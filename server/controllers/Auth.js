const User=require("../models/User");
const OTP=require("../models/OTP");
const Profile = require("../models/Profile")
const bcrypt=require("bcrypt");
const mailSender=require("../utils/mailSender");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const { passwordUpdated } = require("../mail/template/passwordUpdate");
const otpGenerator = require("otp-generator");

//-----send otp -----//
exports.sendOtp= async (req,res)=>{
  
  try{

     // fetch email
    const {email}=req.body;

    // check user exist or not
    const user= await User.findOne({email});
    if(user){
      return res.status(400).json({
        success:false,
        message:"User already"
      });
    }

    // otp generate 
    let otp=otpGenerator.generate(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false,

    });
    console.log("Otp generated ",otp);
    let result=await OTP.findOne({otp:otp});
    
    // trying  to send unique otp 
    while(result ){
      otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
  
      });
      result=await OTP.findOne({otp:otp});
    }
    console.log("Otp created success  --  >",otp)
    const payload={email,otp};

    //creating entry in the db
    let otpEntry =await OTP.create(payload);

    console.log( "Db entry successfully ->",otpEntry);

    res.status(200).json({
      success:true,
      message:"Otp Generated successfully ",
    })


  }catch (err) {
    console.error("SEND OTP CONTROLLER ERROR 👇");
    console.error(err);               // 👈 THIS IS CRITICAL
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,           // 👈 send real reason
    });
  }
};

// sign up
exports.signUp=async (req,res)=>{
  try{
    // fetching the data
    const{
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      accountType,
      otp }=req.body;

      // validating phone number  field is not added 
      if(!firstName || !lastName || !otp || !password || !confirmPassword ){
        return res.status(400).json({
          status:false,
          message:"Some data is missing ",
        })
      }
    //now checking the email
    const user=await User.findOne({email:email}) ;
    if(user) {
      return res.status(400).json({
        success:false,
        message:"Email id Already Exists",
      })
    }
    // checking the pass and confirm pass
    if(password !=confirmPassword){
      return res.status(400).json({
        success:false,
        message:"Password and Confirm password are not same "
      })
    }

    // now checking the otp 
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp[0].otp);

    //validate the otp
    if(recentOtp.length==0){
      return res.status(400).json({
        success:false,
        message:" OTP NOT FOUND"
      })
    }
    console.log(otp,recentOtp[0].otp);
    // checking otp
    if(otp!=recentOtp[0].otp){
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      })
    }
    // hash the password 
    const  hashPassword=await bcrypt.hash(password,10);

    // profile define
    const profileResponse= await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null
    });

    // creating entry inside the database
    //in additional details we add profile check on model
    const response=await User.create({
      firstName,
      lastName,
      email,
      password:hashPassword,
      phoneNumber,
      additionalDetails:profileResponse._id,
      accountType,
      image:`https://api.dicebear.com/7.x/initials/png?seed=${firstName}%20${lastName}`,

    })

    res.status(200).json({
      success:true,
      response,
      message:"Successfully sign up in the Study Notion",
    })

  }catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Error in sign up Something went wrong "
      
    })
  }

};

//login 
exports.login=async(req,res)=>{
  try{
    //fetch details
    const{email,password}=req.body;

    //validate details
    if(!email|| !password){
      return res.status(400).json({
        success:false,
        message:"Details not filled",
      })
    }

    //check email
    const user=await User.findOne({email:email});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User does not exist",
      })
    }
    console.log("details fetched1 ");
    //check password
    if(await bcrypt.compare(password,user.password)){
      const payload={
        email:user.email,
        id:user._id,
        accountType:user.accountType,

      }
      console.log("details fetched 2 ");
      //jwt token 
      const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h"
      })
      
      user.token=token;
      user.password=undefined;

      console.log("token created  ",token);
      // creating the cookies (name,token,options(expire time http req ))
      const options={
        expires:new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true,
      }
      res.cookie("Keshav",token,options).status(200).json({
        success:true,
        token,
        user,
        message:"login Successfully ",
      })
    }else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
    
  }catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong in login"
    })
  }
}

//password change
exports.changePassword=async(req,res)=>{
  try{
    //fetch the detail
    const userId=req.user.id;
    const userDetails=await User.findById(userId);
    //validate
    if(!userDetails){
      return res.status(400).json({
        success:false,
        message:"something went wrong with the user details in change password"
      })
    }

    // fetch new passwords
    const{newPassword,confirmPassword,oldPassword}=req.body;

    if(newPassword!=confirmPassword){
      return res.status(400).json({
        success:false,
        message:"confirmPassword and newPassword are not same ",
      })
    }

    // now check the new and old password
    const oldCheck=await bcrypt.compare(oldPassword,userDetails.password);
    if(!oldCheck){
      return res.status(400).json({
        success:false,
        message:"Old Password  not match ",
      })
    }

    // encrypt the old password
    const hashPassword=await bcrypt.hash(newPassword,10);
    const updateDetails=await User.findByIdAndUpdate(userId,{
      password:hashPassword

    },{new:true});
    // now sending the mail 
    try{
      // now try to send the mail
      //parameter required email ,title,body

      const mailResponse=await mailSender(userDetails.email,
        "Password for your account has been updated",passwordUpdated(
          updateDetails.email,
          `Password updated successfully for ${updateDetails.firstName} ${updateDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", mailResponse.response);
      //we can send the response 
      res.status(200).json({
        success:true,
        message:"Successfully password change ",
      })

    }catch(err){
      return res.status(400).json({
        success:false,
        message:"something went wrong in sending the mail",
        err:err.message,
      })
    }
    //res

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong in Password Change ",
    })

  }
};
