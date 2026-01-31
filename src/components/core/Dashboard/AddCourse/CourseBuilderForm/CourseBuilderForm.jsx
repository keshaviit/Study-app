import React from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { IconBtn } from '../../../../common/IconBtn';
import { IoAddCircleOutline } from "react-icons/io5"
import{ useDispatch , useSelector } from "react-redux"
import { MdNavigateNext } from "react-icons/md"
import toast from "react-hot-toast"
import { setStep, setEditCourse ,setCourse } from "../../../../../reducer/Slices/courseSlice"
import { updateSection, createSection } from '../../../../../services/operations/courseDetailsAPI';
import { NestView } from './NestView';

export const CourseBuilderForm = () => {


  const [loading, setLoading] = useState(false)
  const[editSectionName,setEditSectionName]=useState(null)
  const dispatch =useDispatch();
  const {course} = useSelector((state)=>state.course)
  const {token}=useSelector((state) => state.auth)
  
  // cancel edit in the Section 
  const cancelEdit=()=>{
    setEditSectionName(null)
    setValue("sectionName","")
  }

  // goToNxt
  const goToNext =()=>{
    // we will the course is present or not 
    if(course.courseContent.length == 0){
      toast.error("Please add atleast one section ")
      return
    }
    if (
      course.courseContent.some((section) => (section.subSection || []).length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  //cancel button
  const goBack=()=>{
    dispatch(setStep(1))
    // You are going for course Edit not for creating the course
    dispatch(setEditCourse(true))

  }
  // we have call for update and creating section  name
  const OnSubmit= async(data)=>{
    setLoading(true)
    try{
      let result ;

      // now  
      if(editSectionName){
        // now i am in the edit section 
        result =await updateSection(
          {
            name:data.sectionName,
            sectionId:editSectionName,
            courseId:course._id
          },token
        )
      }else{
        result =await createSection({
          sectionName:data.sectionName,
          courseId:course._id

        },token)

      }
      if (result) {
        dispatch(setCourse(result))
      }

    }
    catch(err){
      console.log(err)
    }
    setLoading(false);
  }

  const handleChangeEditSectionName=(sectionId,sectionName)=>{
    if(editSectionName){
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName",sectionName)

  }


  // calling the form 
  const {register,
    handleSubmit,
    setValue, 
    getValues,
    formState: { errors },
  }=useForm();



  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5" >Course Builder</p>

      <form onSubmit={handleSubmit(OnSubmit)} className='space-y-4'>

        {/*section Name*/}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5 "
          htmlFor='sectionName'>
            Section Name <sup className='text-pink-200'>*</sup>
          </label>
          <input
          id="sectionName"
          disabled={loading}
          placeholder="Add a section to build your course"
          {...register("sectionName", { required: true })}
          className="form-style w-full"
          />
          {
            errors.sectionName && (
              <span  className="ml-2 text-xs tracking-wide text-pink-200">
                Section name is required
              </span>
            )
          }
        </div>

        {/* defining the two button back and next  */}
        <div className="flex items-end gap-x-4">
          <IconBtn
          type="submit"
          disabled={loading}
          text={editSectionName ? "Edit Section Name" : " Create Section"}
          outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {
            editSectionName && (
              <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
              >
                Cancel Button

              </button>
            )
          }
        </div>

      </form>
      { 
        course?.courseContent?.length >0 && (
          <NestView  handleChangeEditSectionName={handleChangeEditSectionName}/>
        )
      }
      <div className="flex justify-end gap-x-3">
        {/*back button */}
        <button
        onClick={goBack}
        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>

        {/* next button */}
        <IconBtn 
        disabled={loading}
        text="next"
        onClick={goToNext}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>

    </div>
  )
}
