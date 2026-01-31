import './App.css'
import {Routes ,Route } from 'react-router-dom'
import { Home } from './Pages/Home'
import { Navbar } from './components/common/Navbar'
import Login  from "./Pages/Login"
import  SignUp  from './Pages/SignUp'
import { ForgotPassword } from './Pages/ForgotPassword'
import { UpdatePassword } from './Pages/UpdatePassword'
import { VerifyEmail } from './Pages/VerifyEmail'
import { About } from './Pages/About'
import PrivateRoute from './components/core/Auth/PrivateRoute'
import { MyProfile } from './components/core/Dashboard/MyProfile'
import{ Dashboard } from "./Pages/Dashboard"
import { EnrolledCourses } from './components/core/Dashboard/EnrolledCourses'
import {Cart} from "../src/components/core/Dashboard/Cart/index"
import { useSelector } from 'react-redux'
import { ACCOUNT_TYPE } from './utils/constants'
import { AddCourse } from './components/core/Dashboard/AddCourse'
import { Catalog } from "../src/Pages/Catalog"
import { CourseDetails } from './Pages/CourseDetails'
import { VideoDetails } from './components/core/ViewCourse/VideoDetails'


// import openRoute
import OpenRoute from "./components/core/Auth/OpenRoute"
import { ContactUs } from './Pages/ContactUs'
import { ViewCourse } from './Pages/ViewCourse'


function App() {
  const {user}=useSelector((state) => state.profile)
  return(
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route  path="/catalog/:catalogName" element={<Catalog/>}></Route>
        <Route path="/courses/:courseId"  element={<CourseDetails/>}></Route>


        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signUp" element={<SignUp/>}></Route>

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              < ForgotPassword/>
            </OpenRoute>
          }
        />  
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        /> 

        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        /> 
        <Route
          path="/about"
          element={
            <OpenRoute>
              < About/>
            </OpenRoute>
          }
        /> 
        <Route
          path="/contact"
          element={
            <OpenRoute>
              <ContactUs/>
            </OpenRoute>
          }
        /> 
        <Route
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
        >
        <Route path="dashboard/my-profile" element={<MyProfile />} />
        {/* have to define the settings */}

        {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
        }

        {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="dashboard/add-course" element={<AddCourse/>} />
          
          </>
        )
        }

        </Route>   
        <Route element={
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }>{
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route 
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails/>}
              >
              </Route>
            </>
          )
        }

        </Route>
        

      </Routes>
    </div>
  )
}

export default App
