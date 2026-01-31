import React, { useEffect ,useState} from 'react'
import { Footer } from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/PagesAndComponentData';
import{ CourseSlider} from "../components/core/Catalog/CourseSlider"
import { ErrorPage } from './ErrorPage';
import{Course_Card} from "../components/core/Catalog/Course_Card"

export const Catalog = () => {

  const { catalogName }=useParams();
  const[active,setActive]=useState(1);
  const[catalogPageData,setCatalogPageData]=useState(null);
  const[categoryId,setCategoryId]=useState("");
  const[loading,setLoading]=useState(false);

  // fetch all categories
  useEffect(()=>{
    const getCategories=async()=>{
      const response=await apiConnector("GET",categories.CATEGORIES_API);
      const category_id=response?.data?.data?.filter((ct)=> ct.name.split(" ").join("-").toLowerCase()==catalogName)[0]._id;
      if(!category_id){
        console.log("Category id not found")
        return
      }
      setCategoryId(category_id);
    }
    getCategories();
  },[catalogName]);


  // function to get the category details
  useEffect(()=>{
    const getCategoryDetails=async()=>{
      if(!categoryId) return;
      try{
        const response=await getCatalogPageData(categoryId);
        setCatalogPageData(response);
        console.log("the catalog page details are ",response);

      }catch(error){
        console.log("Something went Fetching the CategoryDetails",error)
      }
    }
    getCategoryDetails();

  },[categoryId])

  // defining the loading spinner
  if(loading || !catalogPageData){
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  // make the page error free
  if (!loading && !catalogPageData.success) {
    return <ErrorPage />
  }



  const selectedCategory = catalogPageData?.data?.categoryResponse

  return (
    <div>
      {/*Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">

          <p className="text-sm text-richblack-300" >
            {`Home / Catalog / `}
            <span>
              {selectedCategory.name}
            </span>
          </p >
          
          <p className="text-3xl text-richblack-5 ">
            {selectedCategory.name}
          </p>

          <p className="max-w-[870px] text-richblack-200">
          {selectedCategory.description}
          </p>
        </div>
      </div>

      <div>

        {/*Section 1 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <div className="section_heading">Courses to get you started</div>
          <div className="my-4 flex border-b border-b-richblack-600 text-sm">
            <p
            className={`px-4 py-2 ${
              active==1 ? "border-b border-b-yellow-25 text-yellow-25"
              :"text-richblack-50"
            } cursor-point`}
            onClick={()=> setActive(1)}
            >Most Popular</p>

            <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
            >New
            </p>
          </div>
          <div>
            <CourseSlider
            Courses={selectedCategory?.courses}
            />
          </div>
        </div>

        {/*Section 2 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
          <p className="section_heading">
            Top Courses in {selectedCategory?.name}
          </p>
          <div className="py-8">
            <CourseSlider
            Courses={selectedCategory?.courses}/>
          </div>
        </div>

        {/*Section 3 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {
              catalogPageData?.data?.mostSellingCourses ?.slice(0,4).map((course,i)=>{
                return(
                  <Course_Card course={course} key={i} height={"h-[400px]"}/>
                )
            })}
          </div>
        </div>
        </div>

      </div>
    <Footer/>  
    </div>
  )
}
