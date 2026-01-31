// here the flow of Reset Password 
// create link 
// send on email
// take new password 
// update  in db 
const User=require("../models/User");
const mailSender=require("../utils/mailSender");// in this we have to pass 3 parameter email,title,body
const crypto = require("crypto");
const bcrypt=require("bcrypt");



exports.resetPasswordToken =async (req,res)=>{
  try{
    // email fetch
    const email=req.body.email;
    // validate email
    const user=await User.findOne({email});
    if(!user){
      return res.status(401).json({
        success:false,
        message:"user does not exist  pls do sign up first",
      })
    }
    // url create
    const resetPasswordToken=crypto.randomUUID();
    console.log(resetPasswordToken);

    const updateDetails=await User.findOneAndUpdate({email},{
      resetPasswordToken:resetPasswordToken,
      resetPasswordExpires:Date.now()+5*60*1000,
    },{
      new:true
    });

    // now for url
    const url = `${process.env.FRONTEND_URL}/update-password/${resetPasswordToken}`


    // send mail 
    await mailSender(email,"Reset password ",`password reset link : ${url}`);

    //res
    res.status(200).json({
      success:true,
      message:"User Reset Password link send Successfully ",
    })


  }catch(err){
    res.status(500).json({
      success:false,
      message:"Some Internal error Occurs",
    })
  }
}

// reset password function
exports.resetPassword=async(req,res) =>{
  try{
    // fetch the email
    const {password,confirmPassword,token}=req.body;
    //validate the email
    if(!password || !confirmPassword || !token){
      return res.status(401).json({
        success:false,
        message:"All Fields are required ",
      })
    }

    if(password!=confirmPassword){
      return res.status(400).json({
        success:false,
        message:"Password is mismatched "
      })
    }

    // validate user
    const userDetails=await User.findOne({resetPasswordToken:token});

    if(!userDetails){
      return res.status(401).json({
        success:false,
        message:"the user does not exist ",
      })
    }

    // check validity of token
    if(userDetails.resetPasswordExpires < Date.now()){
      return res.status(401).json({
        success:false,
        message:"the Token is expired Generate it again",
      })
    }

    // password hash
    let hashPassword= await bcrypt.hash(password,10);

    //update in db 
    const response=await User.findOneAndUpdate({resetPasswordToken:token},{
      password:hashPassword,
    },{new:true});

    // res
    return res.status(200).json({
      success:true,
      message:"The password is Changed Successfully",
    })

  }catch(err){
    res.status(500).json({
      success:false,
      message:"Something went wrong ",
    })

  }
};

