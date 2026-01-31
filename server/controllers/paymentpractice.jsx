
//exports.capturePayment =async (req,res) =>{
//  try{
//    //take courseId and user Id
//    const userId=req.user.id;
//    const {courseId}=req.body;
//
//    // validation
//    if(!courseId){
//      return res.status(400).json({
//        success:false,
//        message:"please Provide valid Course Id",
//      })
//    }
//
//    // valid the course
//    let course;
//    try{
//      course=await Course.findById(courseId);
//      if(!course){
//        return res.status(400).json({
//          success:false,
//          message:"Course Id Not found"
//        })
//      }
//    }catch(err){
//      return res.status(500).json({
//        success:false,
//        message:"something went wrong with Razorpay ",
//      })
//    }
//
//    // checking the user already enrolled in the course
//    const userObjectId= new mongoose.Types.ObjectId(userId);
//    if(course.studentsEnrolled.includes(userObjectId)){
//      return res.status(400).json({
//        success:false,
//        message:"User already enrolled in the course"
//      })
//    }
//    
//    
//    //order create 
//    const amount =course.amount;
//    const currency="INR";
//
//    const options={
//      amount:amount*100,
//      currency,
//      receipt:`receipt_${Date.now()}`,
//      // notes is optional
//      notes:{
//        courseId,
//        userId
//      }
//
//    };
//    // creating the order by razorpay .create 
//    let paymentResponse;
//    try{
//      paymentResponse= await razorpayInstance.orders.create(options);
//      console.log(paymentResponse);
//
//    }catch(err){
//      res.status(400).json({
//        success:false,
//        message:"Something went wrong in creating the order",
//      })
//    }
//    //response
//    res.status(200).json({
//      success: true,
//      orderId: paymentResponse.id,
//      amount: paymentResponse.amount,
//      currency: paymentResponse.currency,
//      courseName: course.courseName,
//    })
//
//  }catch(err){
//    return res.status(500).json({
//      success:false,
//      message:"something went wrong in the Payment capturing "
//    })
//  }
//};



//exports.verifySignature =async(req,res)=>{
//  const webHookSecret=process.env.WebHookSecretKey;
//
//  const signature=req.headers["x-razorpay-signature"];
//
//  const shasum=crypto.createHmac("sha256",webHookSecret);
//  shasum.update(JSON.stringify(req.body));
//  const digest=shasum.digest("hex");
//
//  if(digest === signature){
//    console.log("Payment is Authorized");
//    // getting the courseId and userId from notes in options
//    const{courseId,userId}=req.body.payload.payment.entity.notes;
//
//    try{
//       // now we have create entry in db and user-> course
//      const UserEnrollment=await  User.findByIdAndUpdate(userId,{
//        $push:{courses:courseId}},{new:true});
//        if(!UserEnrollment){
//          return res.status(400).json({
//            success:false,
//            message:"User Does Not exist and facing in finding the user "
//          })
//        }
//       // courses->student enrolled
//      const courseEnrollment=await Course.findByIdAndUpdate(courseId,{$push://{studentsEnrolled:userId}},{new:true});
//      //validating 
//      if(!courseEnrollment){
//        return res.status(400).json({
//          success:false,
//          message:"course Does Not exist and facing in finding the course "
//        })
//      }
//
//      res.status(200).json({
//        success:true,
//        message:"Payment verified Successfully "
//      })
//
//
//    }catch(err){
//      return res.status(400).json({
//        success:false,
//        message:"Facing problem  in enrollment in courses"
//      })
//    }
//  }
//
//}


// Send Payment Success Email
//exports.sendPaymentSuccessEmail = async (req, res) => {
//  const { orderId, paymentId, amount } = req.body
//
//  const userId = req.user.id
//
//  if (!orderId || !paymentId || !amount || !userId) {
//    return res
//      .status(400)
//      .json({ success: false, message: "Please provide all the details" })
//  }
//
//  try {
//    const enrolledStudent = await User.findById(userId)
//
//    await mailSender(
  //    enrolledStudent.email,
  //   `Payment Received`,
  //    paymentSuccessEmail(
    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
    amount / 100,
    orderId,
    paymentId
//   )
//    )
//  } catch (error) {
//    console.log("error in sending mail", error)
//    return res
//      .status(400)
//      .json({ success: false, message: "Could not send email" })
//  }
//}
//