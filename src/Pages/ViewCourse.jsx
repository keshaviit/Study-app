import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom';
import { VideoDetailsSidebar } from '../components/core/ViewCourse/VideoDetailsSideBar';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../reducer/Slices/viewCourseSlice';

import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"

export const ViewCourse = () => {

  const [reviewModal, setReviewModal] = useState(false);
  const{courseId}=useParams();
  const{token}=useSelector((state) => state.auth);
  const dispatch=useDispatch();

  useEffect(() => {
    let cancelled = false;

    const fetchCourse = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      if (cancelled) return;
      if (courseData?.courseDetails) {
        console.log("The Course Data Fetched data", courseData);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent || []));
        dispatch(setEntireCourseData(courseData.courseDetails));
        dispatch(setCompletedLectures(courseData.completedVideos || []));
        let lectures = 0;
        (courseData.courseDetails.courseContent || []).forEach((sec) => {
          lectures += (sec.subSection || []).length;
        });
        dispatch(setTotalNoOfLectures(lectures));
      }
    };

    fetchCourse();
    return () => { cancelled = true; };
  }, [courseId, token, dispatch])


  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
      {/* VideoDetails Sidebar */}
      <VideoDetailsSidebar setReviewModal={setReviewModal} />

      {/* Main content: video + details */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
