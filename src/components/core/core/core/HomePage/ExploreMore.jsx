import React, { useState } from 'react'
import {HomePageExplore} from "../../../../../data/homepage-explore"
import { HighlightText } from './HighlightText'
import { CourseCard } from './CourseCard'



const TabsName=[
  "Free",
  "New To Coding ",
  "Most Popular",
  "Skills paths",
  "Career paths"
]

export const ExploreMore = () => {
  const [currentTab,setCurrentTab]=useState(TabsName[0])
  const [courses,setCourses]=useState(HomePageExplore[0].courses)
  const [card,setCard]=useState(HomePageExplore[0].courses[0].heading)

  const setMyCard =(value)=>{
    setCurrentTab(value);
    const result =HomePageExplore.filter((courses)=> courses.tag==value)
    setCourses(result[0].courses)
    setCard(result[0].courses[0].heading);

  }
  return (
    <div>

      <div className='text-4xl text-center font-semibold'>
      Unlock the
      <HighlightText text={" Power of Code"} />
      </div>

      <p className="text-center text-richblack-300 text-lg font-semibold mt-1">Learn to Build anything you can Imagine</p>


      <div className='flex flex-row  rounded-full bg-richblack-800  mt-5 '>
        {TabsName.map((ele,i) => {
          return(
            <div className={`text=[16px] flex flex-row item center gap-2 
            ${currentTab==ele ? "bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200"}  rounded-full transition-all duration-200 
            cursor-pointer hover:bg-richblack-900  hover:text-richblack-5 p-3 px-7 py-7}`}
            key={i}
            onClick={() =>{
              setMyCard(ele)
            }}
            >
              {ele}
            </div>
          )
        })}
      </div>

      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Now doing the course card  */}
      <div className=" lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {
          courses.map((element,index)=>{
            return(
              <CourseCard
                key={index}
                cardData={element}
                card={card}
                setCard={setCard}
              />
            )
          })
        }


      </div>



    </div>
  )
}
