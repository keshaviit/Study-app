import React ,{useState}from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { AiFillCaretDown } from "react-icons/ai"
import { setCourse } from '../../../../../reducer/Slices/courseSlice'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'
import {ConfirmationModal} from "../../../../../components/common/ConfirmationModal"
import { FaPlus } from "react-icons/fa"
import SubSectionModal from "./SubSectionModal"



export const NestView = ({ handleChangeEditSectionName }) => {



  const{token}=useSelector((state) => state.auth)
  const{course}=useSelector((state) => state.course)
  const dispatch=useDispatch();
  console.log("NestView courseContent:", course?.courseContent);

    // States to keep track of mode of modal [add, view, edit]
  const[addSubSection,setAddSubSection]=useState(null);
  const[viewSubSection,setViewSubSection]=useState(null)
  const[editSubSection,setEditSubSection]=useState(null);
  // to track the confirmationModal
  const[confirmationModal,setConfirmationModal]=useState(null)
  

  // handleDeleteSection
  const handleDeleteSection=async(sectionId) =>{
    if (!course?._id) return;
    try{

      const result=await deleteSection({
        sectionId,
        courseId:course._id,
      },token)

      if(result){
        console.log("the updated course is ",result)
        dispatch(setCourse(result))
      }
      setConfirmationModal(null);

    }catch(error){
      console.log("facing Problem in deleting the Section",error);
    }

  }  

  //handleDeleteSubSection
  const handleDeleteSubSection =async(subSectionId,sectionId)=>{
    try{
      const result =await deleteSubSection({
        subSectionId,
        sectionId,
        courseId: course._id,
      },token)

      if(result){
        // update the structure of course
        const updatedCourseContent = (course?.courseContent || []).map((section) => {
          return section._id === sectionId ? result : section
        })
        
        
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
      }
    }catch(error){
      console.log("Facing problem in deleting the SubSection ",error)
    }
  }

  
  



  return (
    <>
    <div>
      {
        course?.courseContent?.map((section)=>(
          <details key={section._id} open>
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
              <RxDropdownMenu className="text-2xl text-richblack-50" />
              <p className="font-semibold text-richblack-50">
                  {section.sectionName}
              </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                onClick={ ()=> handleChangeEditSectionName(section._id,section.sectionName)}
                >
                  <MdEdit className="text-xl text-richblack-300"/>

                </button>
                {/* Delete function of that modal  */}
                <button
                  onClick={ () =>{
                    setConfirmationModal({
                      text1:"Delete this Section",
                      text2:"All the lecture  in this  subsection is Deleted ",
                      btn1Text:"Delete",
                      btn2Text:"Cancel",
                      btn1Handler: () =>handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null)

                    })
                  }}
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />

              </div>
            </summary>
            <div>
              {/* Render All Sub Sections Within a Section */}
              {section?.subSection?.map((data) => (
                <div
                  key={data?._id}
                  onClick={ () =>setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div>
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div 
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-x-3">
                    <button
                    onClick={() =>
                      setEditSubSection({ ...data, sectionId: section._id })
                    }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this Sub-Section?",
                        text2: "This lecture will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () =>
                          handleDeleteSubSection(data._id, section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>  
              ))}
              {/* Add New Lecture to Section */}
              <button
                onClick={() => setAddSubSection({ sectionId: section._id })}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture </p>
              </button>
            </div>
          </details>
        ))}

    </div>
    {/* Modal Display */}
    {addSubSection ? (
      <SubSectionModal
        modalData={addSubSection}
        setModalData={setAddSubSection}
        add={true}
      />
    ) : viewSubSection ? (
      <SubSectionModal
        modalData={viewSubSection}
        setModalData={setViewSubSection}
        view={true}
      />
    ) : editSubSection ? (
      <SubSectionModal
        modalData={editSubSection}
        setModalData={setEditSubSection}
        edit={true}
      />
    ) : null}

    
    {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </>
  )
}
