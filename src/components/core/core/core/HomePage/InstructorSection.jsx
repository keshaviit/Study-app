import React from 'react'
import { HighlightText } from './HighlightText'
import { CTAButton } from './CTAButton'
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../../../assets/Images/Instructor.png"

export const InstructorSection = () => {
  return (
    <div>
      <div className='flex flex-row gap-20'>
        {/* Image Section  */}
        <div className='bg-white '></div>
        <div>
          <img src={Instructor}
          alt=" "
          className="shadow-white shadow-[-20px_-20px_0_0]"
          />

        </div>

        {/* Text Section  */}
        <div className='lg:w-[50%] flex gap-10 flex-col my-auto'> 
          <div className='text-3xl font-bold flex  flex-col gap-1'>
            <div>Became an </div>
            <HighlightText text={" instructor"}/>
          </div>


          <div className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
          Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
          </div>


          <div className='w-fit '>
            <CTAButton active={true} linkTo={"/signUp"}>
              <div className='flex flex-row items-center justify-center gap-2'>
                Start Teaching Today
                <FaArrowRight/> 
              </div>
            </CTAButton>
          </div>



        </div>
        
      </div>
    </div>
  )
}
