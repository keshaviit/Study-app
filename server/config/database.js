const mongoose=require("mongoose");

require("dotenv").config();

// defining the function 
const dbConnect =()=>{
  mongoose.connect(process.env.DATABASE_URL)
  .then(()=>{console.log("DB Connect Successfully ")})
  .catch((err)=>{
    console.log(err);
    console.log("Db Connection Unsuccessfully. Please check DATABASE_URL and that MongoDB is running.");
    // Do not exit the process; keep the server running so it can start
    // and surface DB errors on individual requests instead.
  })

};
module.exports=dbConnect;