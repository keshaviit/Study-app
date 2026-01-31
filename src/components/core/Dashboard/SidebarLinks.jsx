import React from 'react'
import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"


// course set not done

export const SidebarLinks = ({link,iconName}) => {

  const Icon=Icons[iconName];
  const dispatch=useDispatch();
  const location=useLocation();

  // now make an path comparison
  const matchRoute=(Route)=>{
    return matchPath({path:Route},location.pathname)
  }

  return (
    <NavLink
    to={link.path}
    className={`relative px-8 py-2 text-sm font-medium ${
      matchRoute(link.path)
        ? "bg-yellow-800 text-yellow-50"
        : "bg-opacity-0 text-richblack-300"
    } transition-all duration-200`}
    >
      
    <span
    className={`absolute top-0 left-0 h-full w-[0.15rem] bg-yellow-50 ${
      matchRoute(link.path) ?"opacity-100":"opacity-0"
    } `}>
    </span>
    <div className='flex  items-center gap-x-2'>
      {/*Icons goes here  */}
      <Icon className="text-lg" />
      <span>{link.name}</span>
    </div>


    </NavLink>
  )
}
