import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi"
import { useDispatch,useSelector } from 'react-redux'

// authApi Imports 
import { resetPasswordToken } from '../services/operations/authAPI'

// here we will make two pages together
export const ForgotPassword = () => {

  const dispatch=useDispatch();
  const { loading } = useSelector((state) => state.auth)
  const[sendEmail,setSendEmail]=useState(false);
  const[email,setEmail]=useState("");


  const handleOnChange=(e)=>{
    setEmail(e.target.value);

  }

  const handleOnSubmit=(e)=>{
    e.preventDefault()
    dispatch(resetPasswordToken(email,setSendEmail))

  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
  { loading ? (<div> Loading....</div>)
    :
    (<div className="max-w-[500px] p-4 lg:p-8 gap-1">
      {
        sendEmail ?
          (<div className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            <p>RESET YOUR PASSWORD </p>
          </div>)
        :
          (<div  className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            CHECK YOUR EMAIL
          </div>)
      }
      {
        sendEmail ? 
        (<p className="font-semibold  text-richblack-200">{`We have sent the reset email to ${email}`}</p>)
        :
        (<p className=" font-semibold  text-richblack-200">Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery</p>)
      }
      {/* Now we are accessing the value */}
      <form onSubmit={handleOnSubmit}>
        {!sendEmail && (
        <label className='w-full p-2'>
            <p className='mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-200'>
              Email Address<sup className='text-pink-200'>*</sup>
            </p>
            <input
              required
              type="email"
              name="email"
              value={email}
              placeholder='Enter The Email Here '
              onChange={handleOnChange}
              className='form-style w-full p-2 rounded'
            />
        </label>
        )}
        <button
        type="submit"
        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
        >
          {
            !sendEmail ?
            (<p>Submit </p>)
            :(<p>Resend Email</p>)
          }
        </button>
      </form>
      <div className="mt-6 flex items-center justify-between">
        <Link to="/login">
          <p className="flex items-center gap-x-2 text-richblack-5">
            <BiArrowBack /> Back To Login
          </p>
        </Link>
      </div>
      
    </div>)
  } 
  </div>
)

}
