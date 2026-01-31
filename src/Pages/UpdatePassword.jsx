import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { Link, useLocation, useNavigate } from 'react-router-dom'

// authApi
import { resetPassword } from '../services/operations/authAPI'

export const UpdatePassword = () => {

  const { loading }=useSelector((state)=> state.auth)

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();

  const[showPassword,setShowPassword]=useState(false)
  const[confirmShowPassword,setConfirmShowPassword]=useState(false)

  const[formData,setFormData]=useState({
    password:"",
    confirmPassword:"",
  })

  const{password,confirmPassword}=formData


  const handleOnSubmit=(e)=>{
    e.preventDefault()
    // dispatch function 
    const token = location.pathname.split("/").at(-1)
    dispatch(resetPassword(password,confirmPassword,token,navigate))

  }

  const handleOnChange=(e)=>{
    setFormData((prev)=>({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {
        loading ?
        (<div className='spinner'></div>):
        (<div>
          <div className="max-w-[500px] p-4 lg:p-8">
            <h1
            className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5"
            >Choose new Password </h1>

            <p
            className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100"
            > Almost done. Enter your new password and youre all set.</p>

            <form
            onSubmit={handleOnSubmit}
            >
              <label className="relative gap-1">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  New Password <sup className='text-pink-200'>*</sup>
                </p>
                <input
                  required
                  type={showPassword ? "text":"password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder='Enter the Password'
                  className='form-style w-full p-2 rounded !pr-10'
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] mb-3 z-[10] cursor-pointer"
                >
                  {
                    showPassword ?
                    (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />):
                    (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                  }
                </span>
              </label>

              {/* now making an label for Confirm password  */}
              <label className="relative ">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Confirm New Password <sup className='text-pink-200'>*</sup>
                </p>
                <input
                  required
                  type={confirmShowPassword ? "text":"password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder='Enter the Confirm Password'
                  className='form-style w-full  p-2  rounded !pr-10'
                />
                <span
                  onClick={() => setConfirmShowPassword((prev) => !prev)}
                  className="absolute right-3 top-[38px] mt-6 z-[10] cursor-pointer"
                >
                  {
                    confirmShowPassword ?
                    (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />):
                    (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)
                  }
                </span>
              </label>
              <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
            </form>
            <div className="mt-6 flex items-center justify-between">
              <Link to="/login">
                <p className="flex items-center gap-x-2 text-richblack-5">
                  <BiArrowBack /> Back To Login
                </p>
              </Link>
            </div>

          </div>

        </div>)
      }
    </div>
  )
}
