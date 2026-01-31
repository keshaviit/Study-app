import React, { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { IconBtn } from "../../common/IconBtn"
import { IoIosArrowBack } from "react-icons/io"
import { BsChevronDown } from "react-icons/bs"

export const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")

  const { sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  // Sync active section & lecture with URL
  useEffect(() => {
    if (!courseSectionData?.length) return

    const section = courseSectionData.find(
      (sec) => sec._id === sectionId
    )
    if (!section) return

    setActiveStatus(section._id)

    const subsection = section.subSection?.find(
      (sub) => sub._id === subSectionId
    )
    if (subsection) {
      setVideoBarActive(subsection._id)
    }
  }, [courseSectionData, sectionId, subSectionId, location.pathname])

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] flex-col border-r border-richblack-700 bg-richblack-800">
      {/* Header */}
      <div className="mx-5 flex flex-col gap-4 border-b border-richblack-600 py-5 text-richblack-25">
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 text-richblack-700 cursor-pointer hover:scale-90"
          >
            <IoIosArrowBack size={30} />
          </div>

          <IconBtn
            text="Add Review"
            onClick={() => setReviewModal(true)}
          />
        </div>

        <div>
          <p className="font-bold">{courseEntireData?.courseName}</p>
          <p className="text-sm text-richblack-500">
            {completedLectures?.length ?? 0}/{totalNoOfLectures ?? 0}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {courseSectionData?.length > 0 &&
          courseSectionData.map((course) => (
            <div key={course._id} className="mt-2 text-sm text-richblack-5">
              {/* Section Header */}
              <div
                onClick={() => setActiveStatus(course._id)}
                className="flex cursor-pointer justify-between bg-richblack-600 px-5 py-4"
              >
                <div className="w-[70%] font-semibold">
                  {course.sectionName}
                </div>
                <BsChevronDown
                  className={`transition-transform duration-300 ${
                    activeStatus === course._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Subsections */}
              {activeStatus === course._id && (
                <div>
                  {(course.subSection || []).map((topic) => (
                    <div
                      key={topic._id}
                      className={`flex gap-3 px-5 py-2 cursor-pointer ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${topic._id}`
                        )
                        setVideoBarActive(topic._id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures?.includes(topic._id)}
                        readOnly
                      />
                      <span>{topic.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
