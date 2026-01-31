import React from "react";
import TimeLineImage from "../../../../../assets/Images/TimelineImage.png";
import Logo1 from "../../../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../../../assets/TimeLineLogo/Logo4.svg";

const TimeLine = [
    {
      Logo: Logo1,
      Heading: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      Logo: Logo2,
      Heading: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      Logo: Logo3,
      Heading: "Flexibility",
      Description: "The ability to switch is an important skills",
    },
    {
      Logo: Logo4,
      Heading: "Solve the problem",
      Description: "Code your way to a solution",
    },
  ];

export const TimeLineSection = () => {
  return (
    <div>
      <div>

        <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center ">
          <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
            {
              TimeLine.map((ele,i) => {
                return (
                  <div className="flex flex-row gap-5 mt-10"  key={i}>
                    <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                      <img  src={ele.Logo}/>
                    </div>
                    <div>
                      <h2 className="font-semibold text-[18px]">{ele.Heading}</h2>
                      <p className="text-base">{ele.Description}</p>
                    </div>
                  </div>
                  
                )
            })}
          </div>

          <div className=" relative  shadow-blue-200">
            <img src={TimeLineImage}  
            alt="timelineImage"
            className="shadow-white  object-cover h-fit "/>
            <div className="absolute bg-caribbeangreen-700 flex flex-row text-white uppercase mx-auto  left-[50%]  translate-x-[-50%] p-4 translate-y-[-50%] ">
              {/*Box 1 */}
              <div className=" flex flex-row items-center justify-center gap-2  border-r  border-white p-4  ">
                <p className="text-3xl font-bold  "> 10</p>
                <p className=" text-white text-sm w-[75px] mr-5">Years Of Experience</p>
              </div>

              {/*Box 2 */}
              <div className=" flex flex-row items-center justify-center gap-2  p-4">
                <p className="text-3xl font-bold items-center justify-center "> 250</p>
                <p className=" text-white text-sm">Types Of Courses  </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
