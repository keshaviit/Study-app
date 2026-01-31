const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");

const otpSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  otp:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expires: 60 * 5,
    }

});

// now define sendMail function
async function Sendmail(email,otp){

  try{
    const mailResponse=await mailSender(
      email,"verification of the studyNotion",otp);
    console.log("Email send successfully",mailResponse);

  }catch(err){
    console.log("Error while sending an email ->",err);
  }

};

// now explain the OtpSchema
otpSchema.pre("save", async function(){
  console.log("new otp entry saved in the database ");
  
  if (this.isNew) {
	    await Sendmail(this.email, this.otp)
	}
})

module.exports=mongoose.model("OTP",otpSchema)