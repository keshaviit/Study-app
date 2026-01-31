const Course=require("../models/Course");
const Category=require("../models/Category");
const {uploadImageAtCloudinary}=require("../utils/imageUploader");
const User=require("../models/User");
const Section=require("../models/Section");
const subSection=require("../models/subSection");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration}=require("../utils/secToDuration");
require("dotenv").config();

exports.createCourse = async (req, res) => {
  try {
    const body = req.body || {};
    const { courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions } = body;
    const thumbnail = req.files?.thumbnail;

    // Validate required fields and return which are missing
    const missing = [];
    if (!courseName) missing.push("courseName");
    if (!courseDescription) missing.push("courseDescription");
    if (price === undefined || price === null || price === "" || (typeof price === "number" && isNaN(price))) missing.push("price");
    if (!whatYouWillLearn) missing.push("whatYouWillLearn");
    if (!category) missing.push("category");
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: "Some data is missing: " + missing.join(", "),
      });
    }
    if (!tag) {
      return res.status(400).json({
        success: false,
        message: "Tag is required",
      })
    }

    let parsedTag
    try {
      parsedTag = JSON.parse(tag)
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid tags format. Add at least one tag.",
      })
    }

    if (!parsedTag || !Array.isArray(parsedTag) || parsedTag.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tag is required",
      })
    }
    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      })
    }
    

    // instructor  we have the user name which is we pass in the auth decode (from token )
    // but we have to pass the instructor._id we have to call db 
    const userId=req.user.id;
    const instructorDetails=await User.findById({_id:userId});
    console.log(instructorDetails);
    if(!instructorDetails){
      return res.status(400).json({
        success:false,
        message:" Instructor not Found",
      })
    }

    // now we are fetching details of category 
    const categoryDetails = await Category.findById(category)
    console.log(categoryDetails);
    if(!categoryDetails){
      return res.status(400).json({
        success:false,
        message:" category  not Found",
      })

    }

    // upload the image to cloudinary (file must be first, then folderName)
    const uploadImage = await uploadImageAtCloudinary(thumbnail, process.env.FOLDER_NAME);
    const thumbnailUrl = uploadImage.secure_url;

    // parse instructions if provided (JSON string from form)
    let parsedInstructions = [];
    if (instructions) {
      try {
        parsedInstructions = JSON.parse(instructions);
      } catch (_) {}
    }

    // create entry in db (use status from body or default to Draft)
    const courseEntry = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      price,
      whatYouWillLearn,
      tag: parsedTag,
      category: categoryDetails._id,
      thumbnail: thumbnailUrl,
      status: status === "Published" ? "Published" : "Draft",
      instructions: parsedInstructions.length ? parsedInstructions : undefined,
    });

    // now we are  adding course instructor
    await User.findByIdAndUpdate({_id:instructorDetails._id},{
      $push:{courses:courseEntry._id}},{new:true});

      // now we are adding with the category 
    await Category.findByIdAndUpdate({_id:categoryDetails._id},
      {
        $push:{courses:courseEntry._id}
      },{new:true});
    //res
    return res.status(200).json({
      success:true,
      message:"we have Successfully created our course",
      data:courseEntry,
    })

  } catch (err) {
    console.error("Create course error:", err?.stack || err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong in creating the course",
      err: err?.message || String(err),
    })
  }
};

exports.editCourse=async(req,res)=>{
  try{
    //fetch course id and the  data we want to update 
    const { courseId, ...updates } = req.body;

    const course=await Course.findById(courseId);
    if(!course){
      return res.status(400).json({
        success:false,
        message:"Course data not found "
      })
    }


    // if thumbnail is update 
    if(req.files && req.files.thumbnail){
      console.log("update thumbnail ");
      const thumbnail=req.files.thumbnail;
      const thumbnailUpdate=await uploadImageAtCloudinary(thumbnail,process.env.FOLDER_NAME);

      // save in course
      course.thumbnail=thumbnailUpdate.secure_url;
    }

    // now we are update the field which are present in field 
    // little doubt here 
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    // this will update the db
    await course.save();

    const updatedCourses=await Course.findOne({_id:courseId})
    .populate({
      path:"instructor",
      populate:{
        path:"additionalDetails",
      }
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path:"courseContent",
      populate:{
        path:"subSection"
      }
    })
    .exec();
    //res
    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourses,
    });

  }catch(err){
    console.log(err)
    return res.status(500).json({
      success:false,
      message:"Something went wrong Internally ",
      error: err.message,
    })
  }
}
// all the courses
exports.getAllCourses=async (req,res)=>{
  try{
    // fetch the course
    const getAllCourses=await Course.find({ },{
      
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      
    })
    .populate("instructor")
    .exec();

    // res
    res.status(200).json({
      status:true,
      getAllCourses,
      message:"All courses are Successfully fetched",
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Some went wrong in Getting all  the  courses details",
    })
  }
};


// get course details
exports.getCourseDetails =async(req,res)=>{
  try{
    // fetch the course id 
    const {courseId}=req.body;
    //validate
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"Course Id not Found",
      })
    }
    // find and populate all data
    const courseDetails=await Course.findOne({_id:courseId})
      .populate({
        path:"instructor",
        populate:{
          path:"additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path:"courseContent",
        populate:{
          path:"subSection",
        }
      })
      .exec();

      if(!courseDetails){
        return res.status(400).json({
          success:false,
          message:"Something went wrong in fetch the course Details",
        })
      }
      let totalDurationInSeconds = 0
      ;(courseDetails.courseContent || []).forEach((content) => {
        (content.subSection || []).forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration, 10) || 0
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })

  }catch(err){
    return res.status(500).json({
      success:false,
      message:"Something went work in finding the Courses Details",
    })
  }
}

//get full courses details
exports.getFullCourseDetails=async(req,res)=>{
  try{
    const{ courseId } =req.body;

    const userId=req.user.id;
    
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"Course Id not found",
      })
    }
    // fetch the course details
    const courseDetails=await Course.findById(courseId)
    .populate({
      path: "instructor",
      populate: {
        path: "additionalDetails",
      },
    })
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();
    //------understand again -----//
    // here the part of the progress i have to read this agin
    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }
    let totalDurationInSeconds = 0
    ;(courseDetails.courseContent || []).forEach((content) => {
      (content.subSection || []).forEach((subSection) => {
        const timeDurationInSeconds = Number(subSection.timeDuration || 0);
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })

    //------understand again -----//

  }catch(err){
    return res.status(500).json({
      success:false,
      message:err.message,
    })
  }
}


//get Instructors courses
exports.getInstructorCourses =async(req,res)=>{
  try{
    // fetch  user id
    const userId=req.user.id;

    //fetch all the courses
    const instructorCourses = await Course.find({
      instructor: userId,
    }).sort({ createdAt: -1 })

    //res
    return res.status(200).json({
      success:true,
      data:instructorCourses,
      message:"All Instructor Courses Fetched Successfully ",
    })

  }catch(err){
    console.log(err);
    res.status(500).json({
      success:false,
      Message:"something went Wrong in courses fetching ",
      err:err.message,
    })

  }
}

//delete courses
exports.deleteCourse = async(req,res) =>{
  try{
    // fetch the courseId
    const {courseId}=req.body ;
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"Course Id Not Found"
      })
    }
    //remove all the students
    const courseDetails=await Course.findById(courseId);
    if(!courseDetails){
      return res.status(400).json({
        success:false,
        message:"CourseDetails not Found"
      })
    }

    //we have to unenroll the student values
    const enrolledStudent=courseDetails.studentsEnrolled;
    //enrolledStudent contains all the ids 
    for(const studentId of enrolledStudent){
      await User.findByIdAndUpdate(studentId,{
        $pull:{courses:courseId},
      },{new:true})
    }

    //delete sections and subSections 
    const courseSection=courseDetails.courseContent;
    for(const sectionId of  courseSection){
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await subSection.findByIdAndDelete(subSectionId);
        }
      }

      // delete the section 
      await Section.findByIdAndDelete(sectionId);
    }

    // delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      success:true,
      message:"Course Deleted Successfully "
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Something went wrong in deleting the course",
      err:err.message,
    })

  }
}