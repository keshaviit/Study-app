import { Link, useLocation , matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import  { NavbarLinks } from "../../data/navbar-links"
import {useSelector} from "react-redux"
import { LuShoppingCart } from "react-icons/lu";
import { ProfileDropDown } from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { courseEndpoints } from '../../services/apis'
import React, { useState, useEffect } from 'react'
import { FaAngleDown } from "react-icons/fa6";


export const Navbar = () => {
  const {token }=useSelector((state) => state.auth )
  const {user }=useSelector((state) => state.profile )
  const {totalItems}=useSelector((state) => state.cart )

  const[subLinks,setSubLinks]=useState([]);
  const[loading,setLoading]=useState(false);

  const FetchShowAllCategory= async()=>{
    setLoading(true);
    try{
      const result = await apiConnector(
        "GET",
        courseEndpoints.COURSE_CATEGORIES_API
      );

      console.log("the category fetched are ", result.data.data)
      setSubLinks(result?.data?.data || []);


    }catch(err){
      console.log(" Not able to fetch all the category");
      setSubLinks([]); 
    }
    setLoading(false);
  }


  useEffect(()=>{
    FetchShowAllCategory();
  },[])


  const location =useLocation();
  const matchRoute =(Route)=>{
    return matchPath({ path: Route }, location.pathname)
  }
  return (
    <div className='w-11/12  mx-auto  items-center'>
      <div className={`h-14 border-b-[1px] items-center  justify-center   border-b-richblack-700 mt-6`}>

      <div className='w-11/12 flex  max-w-maxContent items-center justify-between'>

      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
      </Link>

      {/* Navigation Link */}
      <nav>
        <ul className="flex flex-row  gap-6 text-richblack-25">
          { NavbarLinks.map((link,index) => {
            return <li key={index}>
              {
                link.title==="Catalog" ?(
                <div className=' group relative  flex items-center gap-2 '>
                  {link.title}
                  <FaAngleDown />
                  {/* this was the drop down menu  */}
                  <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                    <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                  
                    {/* now defining the category values  */}
                    {loading ?
                    (<p className="text-center">Loading...</p>)
                    :
                    (<div>
                      {
                        subLinks.length ? (
                          <div>
                            { subLinks.map((subLink,index)=>{
                                return (
                                  <Link
                                    to={`/catalog/${subLink.name
                                      .split(" ")
                                      .join("-")
                                      .toLowerCase()}`}
                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                    key={index}
                                  >
                                    <p>{subLink.name}</p>
                                  </Link>
                                )

                            })}
                    </div>)
                    :
                    (<p className="text-center">No Courses Found</p>)
                      }
                    </div>)

                    }

                  </div>
                </div>) :(
                  <Link to={link?.path}>
                    <p className={`${ matchRoute(link?.path) ? "text-yellow-25" :" text-pure-greys-100"}`} >
                    {link?.title}
                    </p> 
                  </Link>
                )
              }
            </li>
          })}

        </ul>
      </nav>
      
      {/*login and signup   dashboard */}
      <div className='flex gap-4 items-center'>

        {/* we define the user and user is student show cart  */}
        {
          user && user?.accountType != "Instructor" && (
            <Link to="/dashboard/cart" className='relative'>
              <LuShoppingCart />
              {
                totalItems > 0  && (
                  <span>
                    {totalItems}
                    </span>
                )
              }
            </Link>
          )
        }

        {/* now make login and sign up  */}

        {
          token===null && (
            <Link to="/login">
              <button className='border border-richblack-700 bg-richblack-800 px-[12px]py-[8px] text-richblack-100 rounded-md p-2 '>
                Log in 
              </button>
            </Link>
          )
        }

        {
          token===null && (
            <Link to="/signUp">
              <button className='border border-richblack-700 bg-richblack-800 px-[12px]py-[8px] p-2 text-richblack-100 rounded-md'>
                  Sign Up 
              </button>
            </Link>
          )
        }
        
        {
          token !=null && <ProfileDropDown/>
        }

      </div>


      </div>
      </div>
    </div>  
  )
}
