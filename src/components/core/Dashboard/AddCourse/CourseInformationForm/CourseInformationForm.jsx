import React,{useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from "react-hot-toast"
import { RequirementsField } from './RequirementsField'
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import{IconBtn} from "../../../../common/IconBtn"
import { MdNavigateNext } from "react-icons/md"
import{COURSE_STATUS} from "../../../../../utils/constants"

import { addCourseDetails, editCourseDetails, fetchCourseCategories } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse, setStep } from '../../../../../reducer/Slices/courseSlice'
import ChipInput from "./ChipInput"
import { Upload } from '../Upload'

export const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors},

  }=useForm();

  const[loading,setLoading]=useState(false)
  const{course,editCourse}=useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [courseCategory,setCourseCategory]=useState([])
  const dispatch=useDispatch();

  // making an function for  call all category
  const fetchCategories=async()=>{
    setLoading(true);
    try{
      const response=await fetchCourseCategories();
      if(response.length>0){
        setCourseCategory(response);
        console.log("All categories  ",response)
      }
    }catch(err){
      console.log("Something went wrong in fetching the categories",err)
    }
    setLoading(false);
  }

  //useEffect 
  useEffect(()=>{
    fetchCategories();
  },[])
  // useEffect for Call Category
  useEffect(()=>{

    // if the form is in the edit form  and set all the values 
    if(editCourse){
      setValue("courseTitle",course.courseName)
      setValue("courseShortDesc",course.courseDescription)
      setValue("coursePrice",course.price)
      setValue("courseTags",course.tag)
      setValue("courseBenefits",course.whatYouWillLearn)
      setValue("courseCategory",course.category._id)
      setValue("courseRequirements",course.instructions)

    }
  },[editCourse, course, setValue])

  //thi is for checking Is anything is Updated in the form or not  
  const isFormUpdated=()=>{
    // fetch the current values 
    const currentValues=getValues();

    // now checking 
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  // submit function
  const  onSubmit=async(data)=>{
    console.log(data);

    if(editCourse){

      if(isFormUpdated()){
        const currentValues = getValues()
        const formData=new FormData();
        // console.log(data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage)
        }
        console.log("the form data ",formData)
        setLoading(true)
        const result=await editCourseDetails(formData,token);
        setLoading(false)

        if(result){
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      }else{
        toast.error("No changes made to the form")
      }
      return
    }

    // now if we create new data 
    const formData = new FormData();
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnail", data.courseImage)
    setLoading(true)
    console.log("creating courses")
    const response=await addCourseDetails(formData,token)
    console.log("created courses",response)
    if(response){
      dispatch(setStep(2))
      dispatch(setCourse(response))
    }
    setLoading(false)
  }


  // we will making an form 
  return (
    <form onSubmit={handleSubmit(onSubmit)}
    className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">

      {/*Course title */}
      <div className='flex flex-col space-y-2'>
        <label className='text-sm text-richblack-5' htmlFor='courseTitle'
        >Course Title<sup className='text-pink-200'>*</sup></label>
        <input
        id="courseTitle"
        placeholder='Enter course Title'
        {...register("courseTitle",{required:true})}
        className="form-style w-full"
        />
        {
          errors.courseTitle &&(
            <span className='ml-2 text-xs tracking-wide text-pink-200'>
              Course Title is required
            </span>
          )
        }
      </div>

      {/*Course Short Description */}
      <div className='flex flex-col space-y-2'>
        <label  className="text-sm text-richblack-5" htmlFor='courseShortDesc'>
          Course Short Description<sup className='text-pink-200'>*</sup>
        </label>
        <input
        id="courseShortDesc"
        placeholder='Enter Description'
        {...register("courseShortDesc",{required:true})}
        className='form-style w-full'
        />
        {
          errors.courseShortDesc && (
            <span className='ml-2 text-xs tracking-wide text-pink-200'>
              course Description is required 
            </span>
          )

        }
      </div>

      {/* course Price*/}
      <div className='flex flex-col space-y-2'>
        <label htmlFor='coursePrice'className="text-sm text-richblack-5"
        >course Price<sup className='text-pink-200'>*</sup></label>
        <div className='relative'>
          <input
          id="coursePrice"
          placeholder='Enter The Price'
          {...register("coursePrice",{required:true,
            valueAsNumber:true,
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
            },
          })}
          className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
          
        </div>
        {
          errors.coursePrice && (
            <span className='ml-2 text-xs tracking-widetext-pink-200'>Course Price Not Found</span>
          )
        }
      </div>

      {/* Course Category  */}
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseCategory' className='text-sm text-richblack-5'
        >Course category <sup className='text-pink-200'>*</sup></label>
        <select
        {...register("courseCategory",{required:true})}
        defaultValue=""
        id="courseCategory"
        className='w-full form-style'

        >
          <option value="" disabled >
            Choose the Category
          </option>
          {
            !loading && courseCategory.map((category,index)=>{
              return <option key={index} value={category?._id}>
                {category.name}
              </option>
                })     
          }
        </select>
      </div>
      {/*course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/*Course thumbnail Image */}
      <Upload
      name="courseImage"
      label="Course Thumbnail"
      register={register}
      setValue={setValue}
      errors={errors}
      editData={editCourse ? course?.thumbnail : null}  
      />

      {/*Benefits of courses  */}
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseBenefits' className="text-sm text-richblack-5">
          Benefits Of Course
          <sup className='text-pink-200'>*</sup></label>
          <textarea
          id="courseBenefits"
          {...register("courseBenefits",{required:true})}
          className="form-style resize-x-none min-h-[130px] w-full"
          />
          {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
        {/* Requirements/Instructions */}
        <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
        />
        {/*Next Button */}
        <div>
          {
            editCourse && (
              <button
              onClick={()=> dispatch(setStep(2))}
              disabled={loading}
              className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
              >
                Continue Without Saving
              </button>
            )
          }
          <IconBtn
          type="submit"
          disabled={loading}
          text={!editCourse ? "Next" :"Save Changes"}
          />
            <MdNavigateNext />
        </div>

    </form>
  )
}
