import React,{useEffect, useState} from 'react'
import { getUserEnrolledCourses } from '../../../services/operations/ProfileAPI'
import { useSelector} from 'react-redux'
import ProgressBarImport from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';

const ProgressBar = ProgressBarImport?.default ?? ProgressBarImport


export const EnrolledCourses = () => {



  const {token}=useSelector((state) => state.auth)
  const[enrolledCourses,setEnrolledCourses]=useState(null);
  const navigate=useNavigate();

  // now defining the getEnrolledCourses function
  const getCourses =async()=>{
    try{
      const res= await getUserEnrolledCourses(token);
      setEnrolledCourses(res);

    }catch(err){
      console.log("Unable to fetch the Enrolled Courses ",err);
    }
  }

  // we are calling the function 
  useEffect(()=>{
    getCourses();
  },[token])


  return (

    <div className='text-white'>
      <div>
        <h1 className="text-3xl text-richblack-50">Enrolled Courses </h1>
        {
          !enrolledCourses ? (<div className='spinner'> Loading ....</div>)
          :(
            !enrolledCourses.length ?
            (<div className="grid h-[10vh] w-full place-content-center text-richblack-5">
              You have not enrolled in any courses 
            </div>):
            (
              <div className="my-8 text-richblack-5">
                {/*Heading */}
                <div className="flex rounded-t-lg bg-richblack-500 ">
                  <p className="w-[45%] px-5 py-3">Course Name</p>
                  <p className="w-1/4 px-2 py-3">Durations</p>
                  <p className="flex-1 px-2 py-3">Progress</p>
                </div>

                {/*Courses name */}
                {
                  enrolledCourses
                    .filter(course => course !== null && course !== undefined)
                    .map((courses,index,arr)=>{
                      const progressRaw = Number(courses?.progressPercentage)
                      const progress = Number.isFinite(progressRaw) ? progressRaw : 0
                      return (
                    <div
                    className={`flex items-center border border-richblack-700 ${
                      index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                    }`}
                    key={index}
                    >

                      {/* thumbnail  */}
                      <div  className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                      onClick={()=> {
                        const firstSection = courses?.courseContent?.[0]
                        const firstSubSection = firstSection?.subSection?.[0]
                        if (courses?._id && firstSection?._id && firstSubSection?._id) {
                          navigate(`/view-course/${courses._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`)
                        } else {
                          console.warn("Course navigation data incomplete:", courses)
                        }
                      }}
                      >
                        <img 
                          src={courses?.thumbnail || "https://via.placeholder.com/56"}
                          alt={courses?.courseName || "course_img"}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div  className="flex max-w-xs flex-col gap-2">
                          <p className="font-semibold">{courses?.courseName || "Untitled Course"}</p>
                          <p className="text-xs text-richblack-300">
                            {courses?.courseDescription 
                              ? (courses.courseDescription.length > 50 
                                  ? `${courses.courseDescription.slice(0, 50)}..` 
                                  : courses.courseDescription)
                              : "No description available"}
                          </p>
                        </div>
                      </div> 
                      {/* duration */}
                      <div>
                        {courses?.totalDuration || "N/A"}
                      </div>
                      {/*now progress */}
                      <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                        <p>Progress: {progress} %</p>
                        <ProgressBar
                        completed={progress}
                        height="8px"
                        isLabelVisible={false}
                        />
                      </div>

                      

                    </div>
                    )
                  })
                }


              </div>

            )
          )
        }
      </div>

    </div>
  )
}
