import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseExperience: "",
      courseRating: 0,
    },
  })

  // Register rating manually (important)
  useEffect(() => {
    register("courseRating", { required: true, min: 1 })
  }, [register])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    if (!courseEntireData?._id) return

    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )

    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Header */}
        <div className="flex items-center justify-between bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Add Review
          </p>
          <button type="button" onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-4">
            <img
              src={user?.image}
              alt="profile"
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-400">
                Posting Publicly
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              size={24}
              value={watch("courseRating")}
              onChange={ratingChanged}
              activeColor="#ffd700"
            />

            {errors.courseRating && (
              <span className="mt-1 text-xs text-pink-200">
                Please select a rating
              </span>
            )}

            <div className="mt-4 w-11/12 space-y-2">
              <label className="text-sm text-richblack-5">
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>

              <textarea
                {...register("courseExperience", { required: true })}
                placeholder="Add your experience"
                className="form-style min-h-[130px] w-full resize-none"
              />

              {errors.courseExperience && (
                <span className="text-xs text-pink-200">
                  Please add your experience
                </span>
              )}
            </div>

            <div className="mt-6 flex w-11/12 justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md bg-richblack-300 px-5 py-2 font-semibold text-richblack-900"
              >
                Cancel
              </button>

              <IconBtn text="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
