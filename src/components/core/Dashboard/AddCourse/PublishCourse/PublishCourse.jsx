import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { PiSpeakerLow } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { IconBtn } from '../../../../common/IconBtn';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { useNavigate } from "react-router-dom";
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import { setStep,resetCourseState } from '../../../../../reducer/Slices/courseSlice';


export const PublishCourse = () => {

  // initialing the form 

  const{
    register,
    setValue,
    getValues,
    handleSubmit
  }=useForm();

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const{token}=useSelector((state)=>state.auth)
  const{course}=useSelector((state)=>state.course)
  const[loading,setLoading]=useState(false);

  // go back function 
  const goBack=()=>{
    dispatch(setStep(2));
  }

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [course, setValue])
  

  // go To Courses 
  const goToCourse = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }
  // handleCourseSubmit
  const handleCoursePublish= async()=>{

    try{
      if(
        (course?.status==COURSE_STATUS.PUBLISHED 
          && getValues("public")==true) || 
          (course.status==COURSE_STATUS.DRAFT &&
            getValues("public")==false))
        {
          goToCourse()
          return
        }
        const formData= new FormData();
        formData.append("courseId",course._id)
        const courseStatus=getValues("public")
        ? COURSE_STATUS.PUBLISHED
        : COURSE_STATUS.DRAFT
        formData.append("status",courseStatus)
        setLoading(true);
        const response= await editCourseDetails(formData,token);
        if(response){
          goToCourse();
        }
    }catch(error){
      console.log("handleCoursePublish function err",error)
    }
    setLoading(false);

  }
  // submit handler
  const onSubmit =(data)=>{
    // we are calling function here
    handleCoursePublish();

  }



  return (
    <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
      
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>

      <form onSubmit={handleSubmit(onSubmit)} >

        {/* creating Checkbox*/}
        <div className='my-6  mb-8'>
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
            type="checkbox"
            id="public"
            {...register("public")}
            className='border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5'
            />
            <span className="ml-auto flex max-w-max items-center gap-x-4">
              Make this course Public
            </span>
          </label>
        </div>

        {/*next prev button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
          disabled={loading}
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>

          {/*Save changes Button  */}
          <IconBtn disabled={loading} type="submit" text="Save Changes"/>
        </div>

      </form>
    </div>
  )
}



