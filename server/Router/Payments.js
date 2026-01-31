// let make payment wallah 
const express=require("express");
const routers=express.Router();

//---Functions ----// 


const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments");
const{isAuth,isStudent,isInstructor,isAdmin}=require("../middlewares/auth");

// ---- payment APIS  ------- //

routers.post("/capturePayment",isAuth,isStudent,capturePayment);

routers.post("/verifyPayment",isAuth,isStudent,verifyPayment);
routers.post("/sendPaymentSuccessEmail", isAuth, isStudent, sendPaymentSuccessEmail);








//--export statements ----//
module.exports=routers;