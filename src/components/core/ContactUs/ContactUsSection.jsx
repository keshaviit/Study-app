import React from 'react'
import { ContactUsForm } from '../../ContactPage/ContactUsForm'

export const ContactUsSection = () => {
  return (
    <div className='mx-auto'>
        <h1 className="text-center  text-white text-4xl font-semibold">
        Got a idea ? we've the skills.Let's Team Up ?
        </h1>
        <p className="text-center text-richblack-300 mt-3">
          Tell us more about yourself and what you got in mind
        </p>
        <div>
          <ContactUsForm/>
        </div>
    </div>
  )
}
