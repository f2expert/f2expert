import Carousel from "../molecules/Carousel";
import CardTitle from "../atoms/CardTitle";
import Card from "../molecules/Card";
import { useEffect, useState } from "react";
import { fetchCourses } from "../../api/courses/courses";
import { CardContent } from "../../components/ui/card";
import { GrWorkshop, GrSystem, GrServices, GrProjects } from "react-icons/gr";
import { GiTeamIdea } from "react-icons/gi";
import { FaPencilRuler } from "react-icons/fa";
//import { useAppDispatch, useAppSelector } from "../store/hooks";
//import { login } from "../store/slices/auth";
interface ICourse {
  id: number;
  name: string;
  description: string;
  duration: string;
  image: string;
  alt: string;
  title: string;
}
const Home = () => {
  //const dispatch = useAppDispatch();
  //const count = useAppSelector((state) => state.auth.isLoggedIn);
  const [courses, setCourses] = useState<ICourse[]>([]);
  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
    });
  }, []);

  return (
    <>
      <Carousel />
      <main>
        <div className="container mx-auto px-10 py-10 bg-[#f3f3f3] bg-[url('/assets/pattern-21.png')] bg-no-repeat bg-right-top bg-[length:500px_500px]">
          <div className="max-w-5xl  mx-auto min-h-52 text-center">
            <div className="w-full py-2">Training we’re offering</div>
            <h1 className="text-5xl w-full font-bold text-gray-800 leading-tight">
              We Provide our Students <br />
              Best IT Content
            </h1>
          </div>
          <div className="flex justify-between max-w-5xl gap-6 mx-auto min-h-60 text-center">
            <CardContent className="bg-[#fbfbfb] text-gray-800 p-6  w-full border-t-8 border-primary">
              <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                <GrWorkshop className="text-6xl text-blue-900 mb-3 m-auto" />
              </span>
              <h2 className="text-xl font-semibold p-3">UX Design</h2>
              <p className="text-gray-600">
                Master the art of creating intuitive and visually appealing user
                interfaces.
              </p>
            </CardContent>
            <CardContent className="bg-[#fbfbfb] text-gray-800 p-5 w-full border-t-8 border-primary">
              <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                <GrSystem className="text-6xl text-blue-900 mb-3 m-auto" />
              </span>
              <h2 className="text-xl font-semibold p-3">UI Development</h2>
              <p className="text-gray-600">
                Learn to build responsive and dynamic web applications with
                modern technologies.
              </p>
            </CardContent>
            <CardContent className="bg-[#fbfbfb] text-gray-800 p-5 w-full border-t-8 border-primary">
              <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                <GrServices className="text-6xl text-blue-900 mb-3 m-auto" />
              </span>
              <h2 className="text-xl font-semibold p-3">Backend</h2>
              <p className="text-gray-600">
                Dive into server-side programming and learn how to manage
                databases and APIs.
              </p>
            </CardContent>
            <CardContent className="bg-[#fbfbfb] text-gray-800 p-5 w-full  border-t-8 border-primary-foreground">
              <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                <GrProjects className="text-6xl text-blue-900 mb-3 m-auto" />
              </span>
              <h2 className="text-xl font-semibold p-3">Project Management</h2>
              <p className="text-gray-600">
                Gain skills in managing projects effectively, from planning to
                execution.
              </p>
            </CardContent>
          </div>
        </div>

        <div className="container mx-auto px-10 py-10  bg-[#f3f3f3]">
          <div className="flex justify-between max-w-5xl gap-y-10 mx-auto">
            <div className="image-column w-1/2">
              <div className="inner-column">
                <figure className="image-1">
                  <img src="assets/about-3.jpg" alt="" />
                </figure>
                <figure className="image-2">
                  <img src="assets/about-4.jpg" alt="" />
                </figure>
                <div className="experience">
                  <img src="assets/image-1.jpg" alt="" className="icon" />
                  <strong>3600+</strong> Satisfied Client
                </div>
              </div>
            </div>
            <div className="content-column w-1/2">
              <div className="inner-column ml-16">
                  <div className="w-full py-2">F2Expert Vision</div>
                  <h1 className="text-4xl w-full font-bold text-gray-800 pb-5">
                    We Execute Our ideas <br />
                    From The Learn to Earn
                  </h1>
                <p className="text-gray-500 py-2">
                  F2Expert is a premier UI/UX training institute that
                  specializes in providing top-notch education and hands-on
                  experience in the field of user interface and user experience
                  design & development. 
                </p>
                
                <div className="flex justify-between gap-3 py-7">
                  <div className="flex items-center gap-3">
                    <GiTeamIdea className="text-7xl" />
                    <div className="p-3">Expert Instructors</div>
                  </div>
                  <div className="flex items-center justify-center  gap-3">
                    <FaPencilRuler className="text-7xl"/>
                    <div className="p-3">Hands-on Projects</div>
                  </div>
                </div>
                <p className="text-gray-500 py-2">
                  Our mission is to empower aspiring designers and developers  
                  Whether you're a beginner looking to start a tech
                  career or a developer aiming to upgrade your skills, our
                  expert-led courses, live projects, and personalized mentorship
                  will guide you every step of the way.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto bg-primary text-white px-10 py-10 bg-[url('/assets/pattern-14.jpg')] bg-cover bg-center">
          <div className="join">
            <h3>Click to Join the Advance Workshop</h3>
            <h1>Training In Advannce UI</h1>
            <button className="btn-yellow">Join now</button>
          </div>          
        </div>
        <div className="container mx-auto px-10 py-10 bg-[url('/assets/pattern-7.png')] bg-no-repeat bg-left-top">          
          <div className="max-w-5xl mx-auto mb-10">
            <CardTitle title="Our Courses" label="See All" link="/card" />
          </div>
          <ul className="flex justify-between flex-wrap max-w-5xl gap-y-10 mx-auto">
            {courses?.map((course: ICourse) => (
              <li
                key={course.id}
                className="border border-gray-300 max-w-[325px]"
              >
                <Card
                  imgUrl={course.image}
                  title={course.title}
                  description={course.description}
                  btnTitle="Apply Now"
                  btnClass="btn-yellow"
                  width={325}
                  height={225}
                  alt={course.alt}
                />
              </li>
            ))}
          </ul>
        </div>        
      </main>
    </>
  );
};

export default Home;
