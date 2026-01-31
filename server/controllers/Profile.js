const mongoose = require("mongoose");
const Profile=require("../models/Profile");
const User=require("../models/User");
const Course=require("../models/Course");
const  {uploadImageAtCloudinary} =require("../utils/imageUploader");
require("dotenv").config();

exports.updateProfile=async(req,res)=>{
  try{
    // fetch the details gender,dob, about ,contact number,profileId
    const{gender,dob,contactNumber,about}=req.body;

    // fetch user id from auth decode means from body
    const userId= req.user.id ;

    // validate the data
    if(!userId || !dob || !contactNumber || !gender || !about){
      return res.status(400).json({
        success:false,
        message:"Details are incomplete",
      })
    }

    //find the profile id 
    const userResponse=await User.findById(userId);
    if (!userResponse) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // updating the database
    const updateInfo=await Profile.findByIdAndUpdate(userResponse.additionalDetails,{
      gender:gender,
      dob:dob,
      contactNumber:contactNumber,
      about:about,

    },{new:true});


    //res
    res.status(200).json({
      success:true,
      message:"Update teh profile Successfully ",
      updateInfo,
    })


  }catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong with the profile",
    })
    
  }
}


// delete an account
exports.deleteAccount=async (req,res)=>{
  try{
    // user id from decode
    const id=req.user.id;
    // validate
    const user=await User.findById(id);
    if(!user){
      return res.status(400).json({
        success:false,
        message:"Id do not found ",
      })
    }
    // delete profile
    const profileInfo=await  Profile.findByIdAndDelete(user.additionalDetails);

    // delete all the courses
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }

    // delete user 
    const userInfo=await User.findByIdAndDelete(id);

    //res
    res.status(200).json({
      success:true,
      userInfo,
      message:"User deleted Successfully",
    })


  }catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong in Deleting user ",
    })

  }

};


// all user details
exports.allUserDetails =async(req,res)=>{
  try{
    // user id from decode
    const id=req.user.id;
    // validate
    if(!id){
      return res.status(400).json({
        success:false,
        message:"User id not Found",
      })
    }
    // fetch user details
    const userInfo=await User.findById(id)
    .populate("additionalDetails")
    .exec();
    //res
    res.status(200).json({
      success:true,
      userInfo,
      message:"User information Fetched Successfully ",

    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong in finding user Details",
    })

  }
}

//update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


//get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req?.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found"
      })
    }

    // Finding the user first
    let userDetails = await User.findById(userId).lean().exec()

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      })
    }

    // If user has no courses, return empty array
    if (!userDetails.courses || userDetails.courses.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No enrolled courses found"
      })
    }

    // Filter valid ObjectIds
    const validCourseIds = userDetails.courses.filter(id => 
      mongoose.Types.ObjectId.isValid(id)
    )

    if (validCourseIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No valid enrolled courses found"
      })
    }

    // Populate courses with all nested data
    let enrolledCourses = await Course.find({
      _id: { $in: validCourseIds }
    })
      .populate("instructor", "firstName lastName email image")
      .populate("category", "name")
      .populate({
        path: "courseContent",
        model: "Section",
        populate: {
          path: "subSection",
          model: "subSection"
        }
      })
      .lean()
      .exec()

    // Filter out null courses and ensure we have valid data
    enrolledCourses = (enrolledCourses || [])
      .filter(course => course !== null && course !== undefined)
      .map(course => {
        // Ensure courseContent is an array and filter nulls
        if (!course.courseContent || !Array.isArray(course.courseContent)) {
          course.courseContent = []
        } else {
          course.courseContent = course.courseContent
            .filter(section => section !== null && section !== undefined)
            .map(section => {
              // Ensure subSection is an array and filter nulls
              if (!section.subSection || !Array.isArray(section.subSection)) {
                section.subSection = []
              } else {
                section.subSection = section.subSection.filter(
                  subSec => subSec !== null && subSec !== undefined
                )
              }
              return section
            })
        }
        return course
      })

    // Return response
    res.status(200).json({
      success: true,
      data: enrolledCourses,
      message: "Enrolled Courses Found Successfully"
    })

  } catch (err) {
    console.error("Error in getEnrolledCourses:", err)
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong in fetching the Courses details",
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
}



//instructor dashboard
