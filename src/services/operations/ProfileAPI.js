import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { toast } from "react-hot-toast"


const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
}=profileEndpoints;


export async function getUserEnrolledCourses (token){
  const toastId = toast.loading("Loading...")
  let result=[];
  try{
    console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      { token }, // may be ignored in GET
      {
        Authorization: `Bearer ${token}`, // reliable
      }
    );
    console.log("After Calling BACKEND API FOR ENROLLED COURSES")
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data


  }catch(err){
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............",err);
    toast.error("Could not get the enrolled students")
  }
  toast.dismiss(toastId);
  return result
}

