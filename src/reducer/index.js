import {combineReducers } from "redux"

import authReducer from "../reducer/Slices/authSlice"
import profileReducer from "../reducer/Slices/profileSlice"
import cartReducer from "../reducer/Slices/cartSlice"
import courseReducer from "./Slices/courseSlice"
import viewCourseReducer  from "./Slices/viewCourseSlice"

// we combine all the reducer 
const rootReducer=combineReducers({
  auth:authReducer,
  profile:profileReducer,
  cart:cartReducer,
  course:courseReducer,
  viewCourse:viewCourseReducer,

})
export default rootReducer;