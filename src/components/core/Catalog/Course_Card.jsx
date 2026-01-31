import React, { useEffect, useState } from 'react'
import GetAvgRating from "../../../utils/avgRating"
import { Link } from 'react-router-dom';
import RatingStars from '../../common/RatingStar';


export const Course_Card = ({course,Height}) => {

  const[avgReviewCount,setAvgReviewCount]=useState(0);

  useEffect(()=>{
    const count=GetAvgRating(course?.ratingAndReviews || []);
    setAvgReviewCount(count);
  },[course])



  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          {/*Imag part */}
          <div className="rounded-lg">
            <img
            src={course?.thumbnail}
            alt="thumbnail"
            className={`${Height} w-full rounded-xl object-cover`}
            />
          </div>

          <div className="flex flex-col gap-2 px-1 py-3">
            {/*course Name  */}
            <p className="text-xl text-richblack-5">{course.courseName}</p>
            {/*Defining the instructor name */}
            <p>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
            {/*Rating Options */}
            <div className="flex items-center gap-2 ">
              <span className='text-yellow-50'>{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>    
        </div>
      </Link>
    </>
  )
}
