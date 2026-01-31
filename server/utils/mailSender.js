const nodemailer=require("nodemailer");

require("dotenv").config();
// we are using the pre mongoose functionality

const mailSender= async (email,title,body)=>{
  try{
    console.log(process.env.MAIL_USER ,process.env.MAIL_PASS ,process.env.MAIL_HOST);
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,              // ✅ REQUIRED
      secure: false,          // these filed are required 
      auth: {
        user:process.env.MAIL_USER ,
        pass:process.env.MAIL_PASS ,
      },
    });

    let info=await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
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


