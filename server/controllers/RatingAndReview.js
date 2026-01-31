const { default: mongoose } = require("mongoose");
const Course=require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

//create rating 
exports.createRating=async(req,res) =>{
  try{
    // fetch th data
    const {courseId,rating,review}=req.body;

    const userId=req.user.id;

    // validate the data
    if(!rating || !review  || !courseId){
      return res.status(400).json({
        success:false,
        message:"Details are Incomplete",
      })
    }

    // validate courseId and UseId 
    const courseDetails=await Course.findOne(
      {
        _id:courseId,
        studentsEnrolled:{$elemMatch: {$eq: userId} },
      }
    )
    if(!courseDetails){
      return res.status(400).json({
        success:false,
        message:"Course Details and user Not Found"
      })
    }
    // user already rated check
    const userRated=await RatingAndReview.findOne({user:userId,
      course:courseId,
    })
    if(userRated){
      return res.status(400).json({
        success:false,
        message:"Already Rated this course"
      })
    }

    // entry in the course
    const userInfo=await RatingAndReview.create({rating ,review,
      user:userId,
      course:courseId});

    // connect with course
    const courseInfo= await Course.findByIdAndUpdate(courseId,{$push:{ratingAndReviews:userInfo._id}});

    console.log(courseInfo);
    //res
    res.status(200).json({
      success:true,
      message:"RAR successfully created ",
    })

  }catch(err){
    return res.status(500).json({
      success:false,
      message:"Something went wrong in RAR"
    })
  }
}

// Get average rating 
exports.getAverageRatings=async(req,res)=>{
  try{
    // fetch all the data from RAR
    const courseId=req.body.courseId;
    
    // fetch the average value 
    const averageValue=await RatingAndReview.aggregate([
      {
        $match:{
          course:new mongoose.Types.ObjectId(courseId),

      },

      },
      {
        $group:{
          _id:null,
          averageRating:{ $avg :"$rating"}
        }
      }
    ])

    //return rating 
    if(averageRating>0){
      return res.status(200).json({
        success:true,
        averageValue:result[0].averageRating,
        message:" Average rating Values "
      })
    }
    // return rating   
    return res.status(200).json({
      success:true,
      message:'Average Rating is 0, no ratings given till now',
      averageRating:0,
  })

  }catch(err){
    return res.status(500).json({
      success:false,
      message:"Something went wrong in taking average rating ",
    })

  }
};

// get all rating 

exports.getAllRating = async (req, res) => {
  try{
      const allReviews = await RatingAndReview.find({})
                .sort({rating: "desc"})
                .populate({
                    path:"user",
                    select:"firstName lastName email image",
                })
                .populate({
                    path:"course",
                    select: "courseName",
                })
                .exec();
      return res.status(200).json({
        success:true,
        message:"All reviews fetched successfully",
        data:allReviews,
      });
  }   
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:error.message,
      })
  } 
}