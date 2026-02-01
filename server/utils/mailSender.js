const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, subject, htmlBody) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER, // your Gmail address
        pass: process.env.MAIL_PASS, // your Gmail app password
      },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlBody,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail error:", error);
    throw error;
  }
};

module.exports = mailSender;
