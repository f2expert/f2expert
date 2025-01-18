"use client";
import { Fragment, useEffect, useState } from "react";
import Footer from "@/_core/Footer";
import Header from "@/_core/Header";
import Navbar from "@/_core/Navbar";
import Card from "@/_core/Card";
import {
  fetchCourses,
  ICourse,
  ICourseRes,
} from "../../app/api/courses/coures";

export default function Home() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  useEffect(() => {
    fetchCourses().then((res: ICourseRes) => {
      setCourses(res.data);
    });
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
