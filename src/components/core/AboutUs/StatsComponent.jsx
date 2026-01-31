import React from 'react'

export const StatsComponent = () => {

  const stats=[
    { count:"5K", label:"Active Students"},
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
  ]
  return (
    <div className='bg-richblack-700 p-4'>
      <div className="flex flex-col gap-10 justify-between w-11/12 max-w-maxContent text-white mx-auto " >
      <div className="grid grid-cols-2 md:grid-cols-4 text-center">
          {
            stats.map((val,index)=>{
              return(
              <div 
              key={index}
              className='className="flex flex-col py-10"'>
                <h1 className="text-[30px] font-bold text-richblack-5">{val.count}</h1>
                <p className="font-semibold text-[16px] text-richblack-500">{val.label}</p>

              </div>
              )
            })
          }
      </div>
      </div>
    </div>  
  )
}
