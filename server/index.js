const express=require("express");
const app=express();

//-- routes define -----//
const userRoute=require("../server/Router/User");
const profileRoute=require("../server/Router/Profile");
const paymentRoute=require("../server/Router/Payments");
const courseRoute=require("./Router/Course");
const contactRoute=require("./Router/Contact")


const cookieParser=require("cookie-parser");
const dbConnect=require("../server/config/database");
const cors=require("cors");
const cloudinaryConnect=require("../server/config/Cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");

dotenv.config();
const PORT=process.env.PORT || 4000;

//database 
dbConnect();

//--middle ware --//
// Run fileUpload BEFORE express.json for multipart requests so req.body/req.files are set.
// For non-multipart (e.g. JSON), we skip fileUpload so express.json can parse the body.
const fileUploadOptions = { useTempFiles: true, tempFileDir: "/tmp/" };
const fileUploadMw = fileUpload(fileUploadOptions);
app.use((req, res, next) => {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  if (ct.includes("multipart/form-data")) {
    return fileUploadMw(req, res, next);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

//app.use(
//  cors({
//    origin: [
//      "http://localhost:5173",
//      "http://localhost:5174",
//      "https://study-app-lilac-eta.vercel.app"
//    ],
//    credentials: true,
//  })
//);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://study-app-lilac-eta.vercel.app"
  ],
  credentials: true,
}));



//--cloudinary connection--//
cloudinaryConnect();

//--connect the routes--//
app.use("/api/v1/auth",userRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/reach",contactRoute)

//get 
app.get("/",(req,res)=>{
  res.status(200).json({
    success:true,
    message:"Your server is running as expected ",
  })

})

//listen
app.listen(PORT,(req,res)=>{
  console.log(`Successfully server started ${PORT}` );
})








