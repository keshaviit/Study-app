import React from 'react'
import { Footer } from '../components/common/Footer'
import { ReviewSlider } from '../components/common/ReviewSlider'
import { ContactUsSection } from '../components/core/ContactUs/ContactUsSection'
import  ContactDetails  from '../components/core/ContactUs/ContactDetails'

export const ContactUs = () => {
  return (
    <div>
      {/*Section 1 */}

      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">

        {/*part 1 */}
        <div className=" ml-24 lg:w-[40%]">
        <ContactDetails/>
        </div>

        {/*part 1 */}
        <div className='w-[40%] mr-24 border-richblack-50  outline p-6 rounded'>
          <ContactUsSection/>
        </div> 
        
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviews from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>

      {/*Section 3 */}
      <Footer/>
    </div>
  )
}
