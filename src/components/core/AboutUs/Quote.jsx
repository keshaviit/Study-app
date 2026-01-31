import React from 'react'
import { HighlightText } from '../core/core/HomePage/HighlightText'

export const Quote = () => {
  return (
    <div className='text-xl md:text-3xl font-semibold mx-auto py-5 pb-20 text-center text-white'>
      We are passionate  about revolutionizing the way we learn. Our Innovative platform
      <HighlightText text={" combines Technology "}/>,
      <span className= "bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold"
      > expertise</span> , and community to create an 
      <span className= "bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold"
      >unparalleled educational experience.  </span>
    </div>
  )
}
