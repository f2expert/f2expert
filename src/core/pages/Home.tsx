import { Link } from "react-router-dom";
import Carousel from "../molecules/Carousel";
import CardTitle from "../atoms/CardTitle";
import Card from "../molecules/Card";
import { useEffect, useState } from "react";
import { fetchCourses } from "../../api/courses/courses";
import { fetchLatestNews } from "../../api/latestNews/latestNews";
import { CardContent } from "../../components/ui/card";
import { GrWorkshop, GrSystem, GrServices, GrProjects } from "react-icons/gr";

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

interface ILatestNews {
  id: number;
  name: string;
  description: string;
  duration: string;
  image: string;
}
const Home = () => {
  //const dispatch = useAppDispatch();
  //const count = useAppSelector((state) => state.auth.isLoggedIn);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [latestNews, setLatestNews] = useState<ILatestNews[]>([]);
  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
    });
    fetchLatestNews().then((data) => {
      setLatestNews(data);
    });
  }, []);

  return (
    <>
<Carousel />
      <main>
         <div className="container mx-auto px-10 py-10 bg-[#f3f3f3]">
        <div className="max-w-5xl  mx-auto min-h-52 text-center">
          <div className="w-full py-2">Training we’re offering</div>
          <h1 className="text-5xl w-full font-bold text-gray-800 leading-tight">
            We Provide our Students <br />
            Best IT Content
          </h1>
          </div>
          <div className="flex justify-between max-w-5xl gap-6 mx-auto min-h-60 text-center">
              <CardContent className="bg-[#fbfbfb] text-gray-800 p-6  w-full border-t-8 border-yellow-400">
                <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                  <GrWorkshop className="text-6xl text-blue-900 mb-3 m-auto" />
                </span>                
                <h2 className="text-xl font-semibold p-3">UX Design</h2>
                <p className="text-gray-600">
                  Master the art of creating intuitive and visually appealing user interfaces.
                </p>
              </CardContent>
              <CardContent className="bg-[#fbfbfb] text-gray-800 p-5 w-full border-t-8 border-yellow-400">
                <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                  <GrSystem className="text-6xl text-blue-900 mb-3 m-auto" />
                </span>                
                <h2 className="text-xl font-semibold p-3">UI Development</h2>
                <p className="text-gray-600">
                  Learn to build responsive and dynamic web applications with modern technologies.
                </p>
              </CardContent>
              <CardContent className="bg-[#fbfbfb] text-gray-800 p-5 w-full border-t-8 border-yellow-400">
                <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                  <GrServices className="text-6xl text-blue-900 mb-3 m-auto" />
                </span>                
                <h2 className="text-xl font-semibold p-3">Backend</h2>
                <p className="text-gray-600">
                  Dive into server-side programming and learn how to manage databases and APIs.
                </p>
              </CardContent>
              <CardContent className="bg-[#fbfbfb] text-gray-800 p-5 w-full  border-t-8 border-yellow-400">
                <span className="w-24 h-24 bg-gray-100 inline-block rounded-full p-4">
                  <GrProjects className="text-6xl text-blue-900 mb-3 m-auto" />
                </span>                
                <h2 className="text-xl font-semibold p-3">Project Management</h2>
                <p className="text-gray-600">
                  Gain skills in managing projects effectively, from planning to execution.
                </p>
              </CardContent>
          </div>
        </div>

        <div className="container mx-auto px-10 py-10">
          <div className="flex justify-between max-w-5xl gap-y-10 mx-auto">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                What We Offer
              </h1>
              <p className="text-gray-600 py-2">
                F2Expert is a premier UI/UX training institute that specializes
                in providing top-notch education and hands-on experience in the
                field of user interface and user experience design.
                
Whether you're a beginner looking to start a tech career or a developer aiming to upgrade your skills, our expert-led courses, live projects, and personalized mentorship will guide you every step of the way.
              </p>
              <p className="pb-5">
                <strong>UI Design:</strong>
                Mastering tools like Figma, Sketch, and Adobe XD to create
                stunning interfaces. <br />
                <strong>UX Principles:</strong> Understanding user behavior,
                research methodologies, and journey mapping.
                <br />
                <strong>Prototyping & Wireframing:</strong> Developing
                interactive prototypes to validate design ideas.
                <br />
                <strong>Responsive Design:</strong> Creating adaptable layouts
                for diverse devices and screen sizes. <br />
                <strong>Accessibility & Usability:</strong>
                Ensuring inclusivity and user satisfaction through universal
                design principles.
              </p>
              <Link
                to="/"
                className="text-yellow-400 border-[0.1mm] border-yellow-400 px-4 py-3"
              >
                Learn more
              </Link>
            </div>
            <img src="assets/about-us.jpg" alt="" width={400} height={333} />
          </div>
        </div>
        <div className="container mx-auto px-10 py-10">
          <div className="max-w-5xl mx-auto">
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
        <div className="container mx-auto bg-yellow-400">
          <div className="join">
            <h3>Click to Join the Advance Workshop</h3>
            <h1>Training In Advannce UI</h1>
            <button>Join now</button>
          </div>
          <div className="story">
            <Link to="www.google.com">
              <i className="fa-solid fa-play"></i>
            </Link>
            <div className="text">
              <h1>Success Stories</h1>
              <p>
                At F2Expert, we take pride in empowering individuals to
                transform their aspirations into thriving careers. Here&apos;s
                an inspiring journey of one of our alumni who mastered the art
                of web design and development to achieve their professional
                dreams.
              </p>
              <p>
                <strong>Mentorship Matters:</strong> <br />
                With one-on-one mentorship from our experienced trainers,
                students received personalized feedback, guidance, and
                encouragement to refine their craft. They also benefited from
                our career support services, including mock interviews and
                resume-building workshops.
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-10 py-10 bg-gray-200">
          <div className="max-w-5xl mx-auto">
            <CardTitle title="Latest Events" label="See All" link="/card" />
          </div>
          <ul className="flex justify-between flex-wrap max-w-5xl gap-y-10 mx-auto">
            {latestNews.map((news, index) => (
              <li key={index} className="bg-slate-100 max-w-[325px]">
                <Card
                  imgUrl="assets/course-1.jpg"
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
    </>
  );
};

export default Home;
