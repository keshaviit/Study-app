const express=require("express");
const router=express.Router();



const {sendOtp,signUp,login,changePassword}=require("../controllers/Auth");

const{resetPassword,resetPasswordToken}=require("../controllers/resetPassword");

// authentication
const{isAuth}=require("../middlewares/auth");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// login
router.post("/login",login);

//signup
router.post("/signUp",signUp);

// sendOtp
router.post("/sendOtp",sendOtp);

// changePassword
router.post("/changePassword",isAuth,changePassword);


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************


// reset password token
router.post("/reset-password-token",resetPasswordToken);

// reset password
router.post("/reset-password",resetPassword);


module.exports=router;


// all working 
