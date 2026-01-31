import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiDeleteBin6Line } from "react-icons/ri"
import RatingStars from '../../../common/RatingStar'
import GetAvgRating from '../../../../utils/avgRating'
import { removeFromCart } from '../../../../reducer/Slices/cartSlice'

export const RenderCartCourses = () => {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course, index) => (
        <div
          key={course?._id || index}
          className="flex justify-between gap-6 border-b border-richblack-700 py-6"
        >
          {/* Left Part */}
          <div className="flex gap-4">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />

            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>

              <div className="flex items-center gap-2">
                {(() => {
                  const avgRating = GetAvgRating(course?.ratingAndReviews || [])
                  const reviewCount = course?.ratingAndReviews?.length || 0
                  return (
                    <>
                      <span className="text-yellow-25">{avgRating.toFixed(1)}</span>
                      <RatingStars Review_Count={avgRating} Star_Size={20} />
                      <span className="text-richblack-400">
                        {reviewCount} {reviewCount === 1 ? "Rating" : "Ratings"}
                      </span>
                    </>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Right Part */}
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-2 px-3 text-pink-200"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>

            <p className="text-3xl font-medium text-yellow-100">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
