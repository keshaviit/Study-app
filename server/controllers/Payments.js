const razorpayInstance=require("../config/Razorpay")
const Course=require("../models/Course")
const User=require("../models/User")
const mailSender = require("../utils/mailSender")
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessEmail")
const mongoose=require("mongoose");
const crypto = require("crypto");
require("dotenv").config();
const CourseProgress=require("../models/CourseProgress")
const {courseEnrollmentEmail} =require("../mail/template/courseEnrollmentEmail")
// capture the payment and initiate the payment 




exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body
    const userId = req.user.id

    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please Provide CourseId",
      })
    }

    let totalAmount = 0

    for (const course_id of courses) {
      const course = await Course.findById(course_id)

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Could not find the course",
        })
      }

      const uid = new mongoose.Types.ObjectId(userId)

      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "Student is already enrolled",
        })
      }

      totalAmount += Number(course.price)
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `${Date.now()}`,
    }

    const paymentResponse = await razorpayInstance.orders.create(options)

    // Verify Razorpay response structure
    if (!paymentResponse || !paymentResponse.id) {
      console.error("Invalid Razorpay response:", paymentResponse)
      return res.status(500).json({
        success: false,
        message: "Invalid response from payment gateway",
      })
    }

    return res.status(200).json({
      success: true,
      // Frontend expects `message` (see `studentFeatureAPI.js`)
      message: paymentResponse,
    })
  } catch (error) {
    console.error("capturePayment error:", error)
    const errorMessage = error?.error?.description || error?.message || "Could not initiate order"
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
    })
  }
}



//verify the Payment 
exports.verifyPayment =async(req,res)=>{
  const razorpay_order_id=req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId=req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body=razorpay_order_id +"|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    try {
      const enrollmentResult = await enrolledStudents(courses, userId)
      if (enrollmentResult.success) {
        return res.status(200).json({ success: true, message: "Payment Verified and Courses Enrolled" })
      } else {
        return res.status(500).json({ success: false, message: enrollmentResult.message || "Payment verified but enrollment failed" })
      }
    } catch (error) {
      console.error("Enrollment error after payment verification:", error)
      return res.status(500).json({ 
        success: false, 
        message: "Payment verified but enrollment failed. Please contact support.",
        error: error.message 
      })
    }
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

exports.sendPaymentSuccessEmail = async (req, res) => {
  const {orderId, paymentId,amount}=req.body;

  const userId=req.user.id;

  if(!orderId || !paymentId || !amount){
    return res.status(400).
    json({
      success:false,
      message:"Please provide all the details"
    })
  }

  try{
    const enrolledStudent=await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      'Payment Received',
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount/100,
        orderId,
        paymentId
      )
    )
    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    })
  }catch(error){
    console.log(error);
    return res.status(400).json({
      success:false,
      message:"Could not send the mail"
    })
  }
}


const enrolledStudents = async (courses, userId) => {
  if (!courses || !userId) {
    return { success: false, message: "Please provide userId and CourseId" }
  }

  const userIdObj = new mongoose.Types.ObjectId(userId)
  const enrollmentResults = []

  // Process all courses
  for (const courseId of courses) {
    try {
      // Convert courseId to ObjectId if it's a string
      const courseIdObj = mongoose.Types.ObjectId.isValid(courseId) 
        ? new mongoose.Types.ObjectId(courseId) 
        : courseId

      // Check if already enrolled
      const existingCourse = await Course.findById(courseIdObj)
      if (!existingCourse) {
        console.error(`Course not found: ${courseId}`)
        enrollmentResults.push({ courseId, success: false, error: "Course not found" })
        continue
      }

      // Check if user is already enrolled
      const isAlreadyEnrolled = existingCourse.studentsEnrolled.some(
        id => id.toString() === userIdObj.toString() || id.toString() === userId
      )
      if (isAlreadyEnrolled) {
        console.log(`User ${userId} already enrolled in course ${courseId}`)
        enrollmentResults.push({ courseId, success: false, error: "Already enrolled" })
        continue
      }

      // Add user to course's studentsEnrolled array
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseIdObj,
        {
          $addToSet: { studentsEnrolled: userIdObj } // Use $addToSet to prevent duplicates
        },
        { new: true }
      )

      if (!enrolledCourse) {
        console.error(`Failed to update course: ${courseId}`)
        enrollmentResults.push({ courseId, success: false, error: "Failed to update course" })
        continue
      }

      console.log("Updated course:", enrolledCourse.courseName)

      // Create course progress
      let courseProgress
      try {
        courseProgress = await CourseProgress.create({
          courseId: courseIdObj,
          userId: userIdObj,
          completedVideos: [],
        })
        console.log("Created course progress:", courseProgress._id)
      } catch (progressError) {
        // Check if progress already exists
        if (progressError.code === 11000) {
          courseProgress = await CourseProgress.findOne({
            courseId: courseIdObj,
            userId: userIdObj,
          })
          console.log("Course progress already exists, using existing:", courseProgress._id)
        } else {
          throw progressError
        }
      }

      // Update user's courses and courseProgress arrays
      const enrolledStudent = await User.findByIdAndUpdate(
        userIdObj,
        {
          $addToSet: {
            courses: courseIdObj,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      if (!enrolledStudent) {
        console.error(`Failed to update user: ${userId}`)
        enrollmentResults.push({ courseId, success: false, error: "Failed to update user" })
        continue
      }

      console.log("Enrolled student:", enrolledStudent.email)

      // Send enrollment email
      try {
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
        console.log("Enrollment email sent successfully:", emailResponse?.response)
      } catch (emailError) {
        console.error("Failed to send enrollment email:", emailError)
        // Don't fail enrollment if email fails
      }

      enrollmentResults.push({ courseId, success: true })

    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error)
      enrollmentResults.push({ 
        courseId, 
        success: false, 
        error: error.message || "Unknown error" 
      })
    }
  }

  // Check if all enrollments succeeded
  const allSucceeded = enrollmentResults.every(result => result.success)
  const someSucceeded = enrollmentResults.some(result => result.success)

  if (allSucceeded) {
    return { success: true, message: "All courses enrolled successfully", results: enrollmentResults }
  } else if (someSucceeded) {
    return { 
      success: false, 
      message: "Some courses enrolled, but some failed. Please contact support.",
      results: enrollmentResults 
    }
  } else {
    return { 
      success: false, 
      message: "Failed to enroll in any courses. Please contact support.",
      results: enrollmentResults 
    }
  }
}

