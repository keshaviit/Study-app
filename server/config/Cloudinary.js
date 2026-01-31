// take instance of cloudinary 
const cloudinary =require("cloudinary").v2;

require("dotenv").config();


// now making an function
const cloudinaryconnect =()=>{
  try{
    cloudinary.config({
      cloud_name:process.env.CLOUD_NAME,
      api_key:process.env.API_KEY,
      api_secret:process.env.API_SECRET
  
    })
    console.log("Successfully cloudinary connected");
  }

  catch(err){
    console.log(err);
    console.log("cloudinary connection unsuccessful");
  }
}

module.exports=cloudinaryconnect;
