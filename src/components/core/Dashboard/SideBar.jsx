import React ,{useState}from 'react'
import { SidebarLinks } from './SidebarLinks'
import{sidebarLinks} from"../../../data/dashboard-links"
import { useSelector } from 'react-redux'
import { VscSignOut } from "react-icons/vsc"
import { ConfirmationModal } from '../../common/ConfirmationModal'
import { logout} from "../../../services/operations/authAPI"
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const SideBar = () => {



  const{loading:authLoading}=useSelector((state) =>state.auth)
  const{user,loading:profileLoading}=useSelector((state)=> state.profile)
  const dispatch=useDispatch();
  const navigate=useNavigate();

  // define the ConformationalModal
  const[confirmationModal,setConfirmationModal]=useState(null);

  if(authLoading|| profileLoading){
    return(<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      <div className="spinner"></div>
    </div>)
  }

  return (
    <>
    <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
      <div className="flex flex-col">
        {
          sidebarLinks.map((link,index)=>{
            if(link.type && user?.accountType !==link.type) return null
            return(
              <SidebarLinks key={index}  link={link} iconName={link.icon} />
            )
          })
        }
      </div>

      {/*one line  */}
      <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
      {/* another two icons settings and logout  */}
      <div className='flex flex-col '>
        <SidebarLinks  
          link={{ name: "Settings", path: "/dashboard/settings" }}
          iconName="VscSettingsGear"/>

        <button
        onClick={()=>{
          setConfirmationModal({
            text1:"Are you Sure?",
            text2:"You will be logged out of your account",
            btn1Text:"Logout",
            btn2Text:"Cancel",
            btn1Handler:()=> dispatch(logout(navigate)),
            btn2Handler:()=> setConfirmationModal(null)
          })
        }}
        
        className="px-8 py-2 text-sm font-medium text-richblack-300"
        >
          <div className='flex  items-center gap-x-2'>
            <VscSignOut className="text-lg"/>
            <span>Logout </span>
          </div>
        </button>  


      </div>
    </div>
    {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}
