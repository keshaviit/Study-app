const jwt=require("jsonwebtoken");
require("dotenv").config();

//auth 
exports.isAuth= async (req,res,next)=>{
  try{
    // fetch the token 
    const authHeader =
      (typeof req.get === "function" ? req.get("Authorization") : undefined) ??
      req.headers?.authorization;

    const token =
      // support both common cookie names used in this codebase
      req.cookies?.token ||
      req.cookies?.Keshav ||
      req.body?.token ||
      (typeof authHeader === "string"
        ? authHeader.replace(/^Bearer\s+/i, "")
        : undefined);
    // validating 
    if(!token){
      return res.status(401).json({
        success:false,
        message:"Token Not found "
      })
    } 
    
    // now checking token 
    try{
      // decode 
      const decode = await jwt.verify(token,process.env.JWT_SECRET);
      console.log(decode);
      // we store the data in the req
      req.user=decode;

    }catch(err){
      return res.status(401).json({
        success:false,
        message: err?.message || "Token not verified "
      })

    }
    next();

  }catch(err){
    return res.status(500).json({
      success:false,
      message: err?.message || "Something went wrong "
    })
  }
};


//Instructor
exports.isInstructor=async (req,res,next) =>{
  try{
    // now fetch the role
    const role=req.user.accountType;
    if(role!=="Instructor"){
      return res.status(400).json({
        success:true,
        message:"This is protected rout for Instructor"
      })
    }
    next();

  }catch(err){
    return res.status(401).json({
      success:false,
      message:"problem in fetching the instructor detail"
    })
  }
}



//student
exports.isStudent=async (req,res,next) =>{
  try{
    // now fetch the role
    const role=req.user.accountType;
    if(role!=="Student"){
      return res.status(400).json({
        success:true,
        message:"This is protected rout for Student",
      })
    }
    next();
    
  }catch(err){
    return res.status(401).json({
      success:false,
      message:"user can not verified isInstructor "
    })
  }
}


//Admin
exports.isAdmin=async (req,res,next) =>{
  try{
    // now fetch the role
    const role=req.user.accountType;
    if(role!=="Admin"){
      return res.status(400).json({
        success:true,
        message:"This is protected rout for Admin"
      })
    }
    next();
  }catch(err){
    return res.status(401).json({
      success:false,
      message:"user can not verified isAdmin"
    })
  }
}
