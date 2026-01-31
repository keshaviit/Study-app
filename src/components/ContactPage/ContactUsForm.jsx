import React, { useEffect, useState } from 'react'
import {useForm} from "react-hook-form"
import countryCodes from "../../data/countrycode.json"
import { apiConnector } from '../../services/apiconnector'
import { contactUsEndpoint } from '../../services/apis'


export const ContactUsForm = () => {

  const[loading,setLoading]=useState(false);

  const submitContactForm= async( data )=>{
    setLoading(true);
    try{
      const response=await apiConnector("POST",contactUsEndpoint.CONTACT_US_API,data)
      
      console.log("The contact response Successfully",response)

    }catch(error){
      console.log(error);
      console.log("Error in contact Form Route",error)
    }
    setLoading(false);

  }

  const{
    register,
    handleSubmit,
    reset,
    formState:{errors,isSubmitSuccessful}
    }=useForm();


    useEffect(()=>{
      if(isSubmitSuccessful)
        reset({
        email:"",
        firstName:"",
        lastName:"",
        phoneNo:"",
        message:""

      })
    },[reset,isSubmitSuccessful])



  return (

    <form className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitContactForm)}>
      <div >
          <div className='flex flex-col gap-5 lg:flex-row'>
            {/*First Name */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
            <label htmlFor='firstName' className="lable-style">First Name </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="form-style"
              placeholder='Enter the  name '
              {...register("firstName",{required:true})}
            />
            {
            errors.firstName && (
              <span
              className="-mt-1 text-[12px] text-yellow-100"
              >Please Enter Your name </span>
            )
          }
            </div>

            {/*last  Name */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastName' className="lable-style" >Last Name </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="form-style"
                  placeholder='Enter the Last name '
                  {...register("lastName")}
                />
            </div>
          </div>

          {/*Now email id */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='lable-style'>Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder='Enter Email Address '
              className="form-style"
              {...register("email",{required:true})}
            />
            {
              errors.email && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter Your Email
                </span>
              )
            }
          </div>

          {/*Phone Number  */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='phoneNumber'className="lable-style">Phone Number</label>
            <div className='flex gap-5'>
            {/*country code */}
            <div className='flex w-[81px] flex-col gap-2'>
              <select
              type="countryCode"
              name="countyCode"
              id="countryCode"
              placeholder="Enter the countryCode Name"
              className='form-style'
              {...register("countryCode",{required:true})}
              >
                {
                countryCodes.map((values,index)=>{
                  return (<option key={index} value={values.code}>
                    {values.code} -{values.country}
                  </option>)
                  
                })
                }
              </select>

            </div>

            {/*phoneNumber */}
            <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phoneNumber"
              id="phoneNumber"
              placeholder="12345 67890"
              className="form-style"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                maxLength: { value: 12, message: "Invalid Phone Number" },
                minLength: { value: 10, message: "Invalid Phone Number" },
              })}
            />
            </div>
            </div>

          </div>

          {/*message */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='message' className='lable-style'>
              Message
            </label>
            <textarea 
            type="message"
            id="message"
            cols="30"
            className="form-style"
            rows="7"
            placeholder='Enter The Message Here'
            {...register("message",{required:true})}
            />
            {
              errors.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                Enter the Message  </span>
              )
            }
          </div>

          {/*Button  */}
          <button
          type="submit"
          disabled={loading}
          className={`mt-3  w-full rounded-md bg-yellow-50 px-6 py-3 text-center  font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
            ${
              !loading &&
              "transition-all duration-200 hover:scale-95 hover:shadow-none"
            }  disabled:bg-richblack-500 sm:text-[16px] `}
          >
            send Message
          </button>
      </div>    

    </form>
  )
}
