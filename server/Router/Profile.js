// taking instance 
const express=require("express");
const routers=express.Router();

// ---  taking Functions ---//
const{updateProfile,deleteAccount,allUserDetails,updateDisplayPicture,getEnrolledCourses}=require("../controllers/Profile");
const{isAuth,isStudent,isInstructor,isAdmin}=require("../middlewares/auth");


//--- APIS ----//
routers.post("/updateProfile", isAuth, updateProfile);
routers.delete("/deleteProfile", isAuth, deleteAccount);
routers.get("/getUserDetails", isAuth, allUserDetails);

// Get Enrolled Courses
routers.put("/updateDisplayPicture", isAuth, updateDisplayPicture);
routers.get("/getEnrolledCourses",isAuth,getEnrolledCourses);


//--- exports ---//
module.exports=routers;
