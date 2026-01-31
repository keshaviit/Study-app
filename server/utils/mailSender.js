const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", data);
    return data;
  } catch (error) {
    console.error("Resend error:", error);
    throw error;
  }
};

module.exports = mailSender;
