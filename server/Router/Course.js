const express=require("express");
const routers=express.Router();

// Import the Controllers


// importing middlewares 
const{isAuth,isStudent,isInstructor,isAdmin}=require("../middlewares/auth");

// course controller import 

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");


// Category controllers Import
const{createCategory,showAllCategory,categoryPageDetails}=require("../controllers/Category");


// importing all the sections 
const {createSection,updateSection,deleteSection,allSection}=require("../controllers/Section");

// Importing all the SubSections
const { createSubSection ,deleteSubSection , updateSubSection} = require("../controllers/SubSection");

//importing the rating and reviews 
const{createRating,getAllRating,getAverageRatings}=require("../controllers/RatingAndReview")


//Importing the courseProgress
const{updateCourseProgress}=require("../controllers/courseProgress");





//------------------------ creating the routers ------------------------------------//


//------------- course creating ----////
routers.post("/createCourse",isAuth,isInstructor,createCourse);//done
routers.post("/editCourse", isAuth, isInstructor,editCourse);//done
routers.get("/getAllCourses",getAllCourses);//done
routers.post("/getCourseDetails",getCourseDetails);//done
routers.post("/getFullCourseDetails",isAuth,getFullCourseDetails);//done

// for now checking purpose make it post  otherwise this route req is get for check middleware i have to send an token in the body 
routers.post ("/getInstructorCourses",isAuth,isInstructor,getInstructorCourses);//done

//--course progress-------//
routers.post("/updateCourseProgress", isAuth, isStudent, updateCourseProgress);//done

// delete route
routers.delete("/deleteCourse",deleteCourse);//done



//---------------creating  section -------------//

routers.post("/createSection",isAuth,isInstructor,createSection);//done
routers.post("/updateSection",isAuth,isInstructor,updateSection);//done
routers.post("/allSection",allSection);
routers.delete("/deleteSection",isAuth,isInstructor,deleteSection);//done


//----------creating subSection ------------//

routers.post("/createSubSection",isAuth,isInstructor,createSubSection);//done
routers.post("/deleteSubSection",isAuth,isInstructor,deleteSubSection);//done
routers.post("/updateSubSection",isAuth,isInstructor,updateSubSection);//done


//---------------courseProgress ----------------//
//routers.post("/",)



//--------- rating and reviews --------------//
routers.post("/createRating",isAuth,isStudent,createRating);//done 
routers.get("/getAllRating",getAllRating);
routers.get("/getAverageRatings",getAverageRatings);




//------------- category routers  --------------//

routers.post("/createCategory",isAuth,isAdmin,createCategory);
routers.get("/showAllCategories",showAllCategory);//done
routers.post("/getCategoryPageDetails",categoryPageDetails);






module.exports=routers;








