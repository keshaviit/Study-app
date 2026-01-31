import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HighlightText } from "../components/core/core/core/HomePage/HighlightText"
import { CTAButton } from "../components/core/core/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import { CodeBlocks } from "../components/core/core/core/HomePage/CodeBlocks"
import { TimeLineSection } from "../components/core/core/core/HomePage/TimeLineSection";
import { LanguageLineSection } from "../components/core/core/core/HomePage/LanguageLineSection";
import { InstructorSection } from "../components/core/core/core/HomePage/InstructorSection";
import { ExploreMore } from "../components/core/core/core/HomePage/ExploreMore";

export const Home = () => {
  return (
    <div>
      {/*Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        <Link to={"/signUp"}>
          <div className="mt-16 rounded-full mx-auto bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row px-10 py-[5px] items-center transition-all duration-200  gap-2 group-hover:bg-richblack-900 ">
              <p>Become a Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className=" text-center mt-5 font-semibold font-inter flex flex-row  gap-2 text-4xl">
          Empower Your Future with
          <HighlightText text="Coding Skills" />
        </div>

        <div className="mt-4 text-center w-[65%] text-bold text-lg text-richblack-400">
          With our online coaching courses ,you can learn at your pace from
          anywhere in the world and get access to the wealth of resources
          ,including hands on projects,quizzes, including personal feedback from
          instructors.
        </div>

        <div className="flex flex-row mt-8 gap-7">
          <CTAButton active={true} linkTo={"/signUp"}>
            Learn More{" "}
          </CTAButton>
          <CTAButton linkTo={"/signUp"}> Book a Demo </CTAButton>
        </div>

        <div className="shadow-blue-200 mt-10 w-[70%]  h-[400px] overflow-hidden rounded-lg">
          <div className="relative bg-white h-[500px]">
            <video muted loop autoPlay>
              <source src={Banner} type="video/mp4"></source>
            </video>
          </div>
        </div>

        {/* codeBlock 1 */}
        <div className=" mx-8 w-[70%]  items-center">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighlightText text={" Coding potential "}></HighlightText>
                with our online courses.
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it yourself",
              linkTo: "/signUp",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkTo: "/login",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </div>

        {/*CodeBlock 2 */}
        <div className=" mx-8 w-[70%]  items-center">
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighlightText text={" coding in seconds  "}></HighlightText>
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkTo: "/signUp",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkTo: "/login",
              active: false,
            }}
            codeColor={"text-yellow-25"}
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>

        {/* Cards part  */}
        <ExploreMore  className="mb-20"/>
      </div>

      {/*Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700 mb-20">
        {/* part 1 */}
        <div className="homepage_bg h-[330px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkTo={"/signUp"}>
                <div className="flex items-center gap-2">
                  Explore Full Coding
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton
                active={false}
                linkTo={"/signUp"}
                className="text-white"
              >
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        {/*Part 2 */}
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          <div className="flex gap-4">
            <div className="text-4xl font-bold font-inter">
              Get the skills you need for a
              <HighlightText text=" job that in demand " />
            </div>
            <div className=" flex flex-col gap-10 items-start">
              <div>
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more the professional
                skills.
              </div>
              <CTAButton active={true} linkTo={"/signUp"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
          {/*Part 3 */}
          <TimeLineSection/>
          {/*Part 3 */}
          <LanguageLineSection/>

        </div>
      </div>

      {/*Section 3 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white mt-20 mb-20  ">
      <InstructorSection/>
      </div>

      {/*Footer */}
      <div className="text-white"></div>
    </div>
  );
};
