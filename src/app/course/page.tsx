"use client";
import { Fragment, useEffect, useState } from "react";
import Footer from "@/_core/Footer";
import Header from "@/_core/Header";
import Navbar from "@/_core/Navbar";
import Card from "@/_core/Card";
/*import {
  fetchCourses,
  ICourse,
  ICourseRes,
} from "../__apis__/courses/coures";*/
interface ICourse {
  id: number;
  name: string;
  description: string;
  duration: string;
  imgUrl: string;
  title: string;
  alt: string;
}
export default function Home() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  useEffect(() => {
    //fetchCourses().then((res: ICourseRes) => {
      setCourses([
        {
          id:1,
          imgUrl:"/course-1.jpg",
          alt:"Advance HTML5",
          title:"Advance HTML5",
          description:"Master the latest features of HTML5 to create dynamic, responsive, and cutting-edge web experiences.",
          name: "HTML5 Course",
          duration: "3 months"
        },
        {
          id:2,
          imgUrl:"/course-1.jpg",
          alt:"Advance CSS3",
          title:"Advance CSS3",
          description:"Unlock the power of CSS3 to design visually stunning, responsive, and modern web interfaces.",
          name: "CSS3 Course",
          duration: "3 months"
        },
        {
          id:3,
          imgUrl:"/course-1.jpg",
          alt:"Java Script",
          title:"Java Script",
          description:"Elevate your coding skills with advanced JavaScript techniques to build dynamic and interactive web applications.",
          name: "JavaScript Course",
          duration: "3 months"
        }
      ]);
    //});
  }, []);
  return (
    <Fragment>
      <header>
        <Header />
        <div className="container courses-banner mx-auto min-h-screen bg-black">
          <div className="banner-content max-w-7xl mx-auto">
            <Navbar />
            <div className="banText">
              <h1>Your bright future is our mission</h1>
              <p>
                At F2Expert, we prioritize a learner-centric approach that
                combines theoretical understanding with real-world application
              </p>
              <button>Apply Now</button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="container mx-auto px-10 py-10">
            <h1 className="text-2xl font-semibold text-gray-800 max-w-5xl mx-auto">
                Our Courses
            </h1>
          <ul className="flex justify-between flex-wrap max-w-5xl gap-y-10 mx-auto">
            {courses.map((course: ICourse) => (
              <li
                key={course.id}
                className="border border-gray-300 max-w-[325px]"
              >
                <Card
                  imgUrl={course.imgUrl}
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
      <Footer />
    </Fragment>
  );
}
