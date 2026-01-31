const Razorpay = require("razorpay")
require("dotenv").config()

// define the instance here
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

module.exports = razorpayInstance
