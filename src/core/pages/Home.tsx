import { Link } from "react-router-dom";
import Carousel from "../molecules/Carousel";
import CardTitle from "../atoms/CardTitle";
import Card from "../molecules/Card";
import { useEffect, useState } from "react";
import { fetchCourses } from "../../api/courses/courses";
import { fetchLatestNews } from "../../api/latestNews/latestNews";

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
              <p className="pb-5">
                <strong className="text-xl font-semibold text-gray-800 py-2">
                  What We Offer
                </strong>
                Our comprehensive curriculum is tailored to equip you with
                in-demand skills and tools, covering topics such as: <br />
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
