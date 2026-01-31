import React from 'react'
import { CTAButton } from './CTAButton'
import { HighlightText } from './HighlightText'

import Know_your_progress from "../../../../../assets/Images/Know_your_progress.png";
import Compare_with_others from "../../../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../../../assets/Images/Plan_your_lessons.svg";

export const LanguageLineSection = () => {
  return (
    <div>
      {/* main div   */}
      <div>
        <div className='text-4xl  font-bold  text-center my-10'>
          Your swiss knife for
          <HighlightText text={"  learning any language"} />
        </div>

        <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
          Using spin making learning multiple languages easy. with 20+languages realistic voice-over, progress tracking, custom schedule and more.
        </div>
        <div className='flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0 '>
          <img src={Know_your_progress}
          alt=""
          className="object-contain  lg:-mr-32 "
          
          />
          <img  src={Compare_with_others}
            alt=""
            className='object-contain lg :-mb-10 lg:-mt-0 -mt-12'
            />
          <img  src={Plan_your_lessons}
            alt=""
            className='object-contain   mr-8 lg:-ml-36 lg:-mt-5 -mt-16'
          
          />
        </div>
        <div className='w-fit mx-auto '>
            <CTAButton active={true} linkTo={"/signUP"}>
            <div >Learn  more </div></CTAButton>
        </div>
        <div className='h-[150px]'>

        </div>
      </div>
    </div>
  )
}
