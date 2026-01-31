const express=require("express");
const routers=express.Router();

const{contactUsController}=require("../controllers/ContactUs")


//------we add to the router ----/
routers.post("/contact",contactUsController)

module.exports = routers