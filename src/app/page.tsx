"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/_core/Banner";
import Header from "@/_core/Header";
import Navbar from "@/_core/Navbar";
import CardTitle from "@/_core/CardTitle";
import Card from "@/_core/Card";
import Footer from "@/_core/Footer";


import { ICourse, ICourseRes, fetchCourses } from "../app/api/courses/coures";
import { IlatestNews, INewsRes, fetchLatestNews } from "../app/api/latestNews/latestNews";


export default function Home() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [latestNews, setLatestNews] = useState<IlatestNews[]>([]);
  useEffect(() => {
    fetchCourses().then((res:ICourseRes) => {
      setCourses(res.data);
    });
    fetchLatestNews().then((res: INewsRes) => {
      setLatestNews(res.data);
    });
  }, []);

  return (
    <>
      <header>
        <Header />
        <div className="container banner mx-auto min-h-screen bg-black">
          <Navbar />
          <Banner />
        </div>
      </header>
      <main>
      <div className="container flex mx-auto bg-gray-50">
            <div className="w-1/2 bg-[#f8f8f8]">
            <Image src="/banner-feature.png" alt="Banner feature" width="551" height="700" className="object-cover" />
            </div>
            <div className="flex flex-wrap relative top-[-75] px-12 pt-12 bg-[#f8f8f8] w-1/2">
              <div className="w-1/2">
                <i className="fa-solid fa-book-open text-5xl text-yellow-500 mb-7"></i>
                <h1 className="text-2xl font-semibold text-gray-600">Scholorship News</h1>
                <p className="text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut
                  enim ad
                </p>
              </div>
              <div className="w-1/2">
                <i className="fa-solid fa-chalkboard text-5xl text-yellow-500 mb-7"></i>
                <h1 className="text-2xl font-semibold text-gray-600">Scholorship News</h1>
                <p className="text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut
                  enim ad
                </p>
              </div> 
              <div className="w-1/2">
                <i className="fa-solid fa-book text-5xl text-yellow-500 mb-7"></i>
                <h1 className="text-2xl font-semibold text-gray-600">Scholorship News</h1>
                <p className="text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut
                  enim ad
                </p>
              </div>
              <div className="w-1/2">
                <i className="fa-solid fa-book text-5xl text-yellow-500 mb-7"></i>
                <h1 className="text-2xl font-semibold text-gray-600">Scholorship News</h1>
                <p className="text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut
                  enim ad
                </p>
              </div>                          
            </div>
        </div>
        <div className="container mx-auto px-10 py-10">
          <div className="flex justify-between max-w-5xl gap-y-10 mx-auto">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                About F2Expert
              </h1>
              <p>
                Welcome to F2Expert, where creativity meets functionality, and
                passion for design transforms into expertise. We are a leading
                UI/UX training institute dedicated to empowering individuals
                with the skills and knowledge needed to excel in the dynamic
                world of user interface and user experience design.
              </p>
                <h1 className="text-xl font-semibold text-gray-800 py-2">
                  What We Offer
                </h1>
              <p className="pb-5">
                Our comprehensive curriculum is tailored to equip you with
                in-demand skills and tools, covering topics such as: <br />
                <strong>UI Design:</strong>
                Mastering tools like Figma, Sketch, and Adobe XD to create
                stunning interfaces. <br />
                <strong>UX Principles:</strong> Understanding user behavior,
                research methodologies, and journey mapping.<br />
                <strong>Prototyping &
                Wireframing:</strong>  Developing interactive prototypes to validate
                design ideas.<br />
                <strong>Responsive Design:</strong>  Creating adaptable layouts for
                diverse devices and screen sizes. <br />
                <strong>Accessibility & Usability:</strong>
                Ensuring inclusivity and user satisfaction through universal
                design principles.
              </p>
              <Link
                href="/"
                className="text-yellow-400 border-[0.1mm] border-yellow-400 px-4 py-3 hover:border-yellow-800"
              >
                Learn more
              </Link>
            </div>
            <Image src="/about-us.jpg" alt="" width={400} height={333} />
          </div>
        </div>

        <div className="container mx-auto px-10 py-10">
          <div className="max-w-5xl mx-auto">
            <CardTitle title="Our Courses" label="See All" link="/card" />
          </div>
          <ul className="flex justify-between flex-wrap max-w-5xl gap-y-10 mx-auto">
            {Array.isArray(courses) && courses.map((course:ICourse) => (
              <li key={course.id} className="border border-gray-300 max-w-[325px]">
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

        <div className="container mx-auto bg-yellow-400">
          <div className="join">
            <h3>Click to Join the Advance Workshop</h3>
            <h1>Training In Advannce UI</h1>
            <button>Join now</button>
          </div>
          <div className="story">
            <Link href="www.google.com">
              <i className="fa-solid fa-play"></i>
            </Link>
            <div className="text">
              <h1>Success Stories</h1>
              <p>
              At F2Expert, we take pride in empowering individuals to transform their aspirations
               into thriving careers. Here&apos;s an inspiring journey of one of our alumni who mastered the art 
               of web design and development to achieve their professional dreams.
              </p>
              <p>
              <strong>Mentorship Matters:</strong> <br />
              With one-on-one mentorship from our experienced trainers, students received personalized feedback, 
              guidance, and encouragement to refine their craft. 
              They also benefited from our career support services, including mock interviews 
              and resume-building workshops.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-10 py-10 bg-gray-200">
          <div className="max-w-5xl mx-auto">
            <CardTitle title="Latest Events" label="See All" link="/card" />
          </div>
          <ul className="flex justify-between flex-wrap max-w-5xl gap-y-10 mx-auto">
            {Array.isArray(latestNews) && latestNews.map((course, index) => (
              <li key={index} className="bg-slate-100 max-w-[325px]">
                <Card
                  imgUrl="/course-1.jpg"
                  title="welcome"
                  description="About Course Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor"
                  width={325}
                  height={225}
                  alt="welcome"
                  link="/card"
                  linkClass="text-yellow-400"
                  linkText="Read More"
                >
                  <div className="flex gap-3">
                    <i className="fa-regular fa-calendar"></i>
                    <h4 className="space">06 Month</h4>
                    <i className="fa-regular fa-bookmark"></i>
                    <h4 className="space"> Photography</h4>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
