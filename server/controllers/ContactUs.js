const { contactUsEmail } = require("../mail/template/contactFormRes");

const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req,res) =>{
  const { email, firstName, lastName, message, phoneNo, countryCode } = req.body;
  console.log(req.body);

  //sending the mail 
  try{

    const emailRes = await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstName, lastName, message, phoneNo, countryCode)
    )
    console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    })
    

  }catch(error){
    console.log("Error", error)
    console.log("Error message :", error.message)
    res.status(500).json({
      success:false,
      message:"something went wrong "
    })
  }
}