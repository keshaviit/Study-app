import React, { useState } from 'react'

export const RequirementsField = ({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
})=> {

  const [requirement,setRequirement]=useState("");
  const [requirementList,setRequirementList]=useState([]);

  // function mange add requirements 
  const handleAddRequirement=()=>{
    if(requirement){
      setRequirementList([...requirementList,requirement]);
      setRequirement("");
    }
  }

  // function mange remove requirements 
  const handleRemoveRequirement=(index)=>{
      const updatedRequirements = [...requirementList]
      updatedRequirements.splice(index, 1)
      setRequirementList(updatedRequirements)
    
  }

  return (
    <div className='className="flex flex-col space-y-2'>
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label}
        <sup>*</sup>
      </label>
      {/*Add button added here  */}
      <div className='className="flex flex-col items-start space-y-2'>
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button> 
      </div>
      {requirementList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement}</span>
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}



    </div>
  )
}
