import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ReactPlayer from "react-player"
import { IconBtn } from "../../common/IconBtn"
import { updateCompletedLectures } from "../../../reducer/Slices/viewCourseSlice"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"

export const VideoDetails = () => {
  const { sectionId, subSectionId, courseId } = useParams()
  const navigate = useNavigate()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load video data
  useEffect(() => {
    if (!courseSectionData?.length || !sectionId || !subSectionId) return


    const section = courseSectionData.find((s) => s._id === sectionId)
    console.log(
      "ALL SUBSECTIONS 👉",
      section?.subSection?.map((s) => s._id)
    )
    console.log("URL subSectionId 👉", subSectionId)
    
    const subsection = section?.subSection?.find(
      (s) => s._id === subSectionId
    )

    if (subsection) {
      // 🔥 Normalize video URL from backend response
      const videoUrl =
        subsection.videoUrl ||
        subsection.video?.url ||
        subsection.video?.secure_url ||
        subsection.video?.secureUrl
    
      console.log("FINAL VIDEO URL 👉", videoUrl)
    
      setVideoData({
        ...subsection,
        videoUrl, // ✅ force a flat videoUrl
      })
    
      setPreviewSource("")
    } else {
      setVideoData(null)
      setPreviewSource(courseEntireData?.thumbnail || "")
    }
  }, [courseSectionData, sectionId, subSectionId, courseEntireData])

  // Reset when video changes
  useEffect(() => {
    setVideoEnded(false)
  }, [sectionId, subSectionId])

  const handleLectureCompletion = async () => {
    if (!token) return
    setLoading(true)

    const res = await markLectureAsComplete(
      { courseId, subsectionId: subSectionId },
      token
    )

    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 text-white">
      {!videoData ? (
        previewSource ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-64 w-full rounded-md object-cover md:h-80"
          />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center rounded-md bg-richblack-800 text-richblack-400">
            Loading lecture...
          </div>
        )
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-richblack-900">
          {videoData?.videoUrl ? (
            <video
            key={videoData.videoUrl}
            src={videoData.videoUrl}
            controls
            className="w-full h-full rounded-md"
            preload="metadata"
            controlsList="nodownload"
            onEnded={() => setVideoEnded(true)}
          />
          
          ) : (
            <div className="flex h-full items-center justify-center text-richblack-400">
              Video not available
            </div>
          )}

          {videoEnded && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-richblack-900/90">
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onClick={handleLectureCompletion}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                />
              )}

              <IconBtn
                onClick={() => {
                  playerRef.current?.seekTo(0)
                  setVideoEnded(false)
                }}
                text="Rewatch"
              />
            </div>
          )}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}
