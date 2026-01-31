import React from 'react'
// Importing React Icons
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

export const CourseCard = ({cardData, card, setCard}) => {
  return (
    <div>
      <div 
      className={`w-[360px]  ${
        card === cardData?.heading
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
          : "bg-richblack-800"
      }  text-richblack-25 h-[300px] box-border cursor-pointer`}
      onClick={() => setCard(cardData?.heading)}
      >
        <div className=' border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3'>

          <div className={` ${card==cardData?.heading ? "text-richblack-800":" text-richblack-5" } font-semibold text-[20px]`}>
            {cardData?.heading}
          </div>

          <div className='text-richblack-300'>{cardData?.description}</div>

        </div>
        
        {/*Card footer */}
        <div 
        className={` flex justify-between ${card==cardData?.heading ? "text-blue-300":" text-richblack-300"} px-6 py-3 font-medium`}>

           {/* Level */}
          <div  className='flex flex-row gap-2 text-[16px]'>
            <HiUsers/>
            <p>{cardData?.level}</p>
          </div>


           {/* Flow Chart  */}
          <div className='flex flex-row gap-2 text-[16px]'>
            <ImTree/>
            <p>{cardData?.lessionNumber}</p>
          </div>

        </div>


      </div>
    </div>
  )
}
