const nodemailer=require("nodemailer");

require("dotenv").config();
// we are using the pre mongoose functionality

const mailSender= async (email,title,body)=>{
  try{
    
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,              // ✅ REQUIRED
      secure: false,          // these filed are required 
      auth: {
        user:process.env.BREVO_SMTP_USER ,
        pass:process.env.BREVO_API_KEY ,
      },
    });

    let info=await transporter.sendMail({
      from: `"StudyNotion" <${process.env.BREVO_SMTP_USER}>`,
      to:`${email}`,
      subject:`${title}`,
      html:`${body}`,

    });

    console.log(info);
    return info;

  }catch(error){

    console.log(error.message)
    throw error; // ✅ 
  }
};
module.exports = mailSender;


