import { useEffect, useState } from "react";
import CardTitle from "../atoms/CardTitle";
import Card from "../molecules/Card";

import { fetchCourses } from "../../api/courses/courses";

interface ICourse {
  id: number;
  name: string;
  description: string;
  duration: string;
  image: string;
  title: string;
  alt: string;
}

export default function Tutorials() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  useEffect(() => {
    fetchCourses().then((res) => {
      setCourses(res);
    });
  }, []);
  return (
    <div className="container mx-auto py-5">
      <div className="max-w-5xl mx-auto">
        <CardTitle title="Our Courses" label="See All" link="/card" />
      </div>
      <ul className="flex justify-between flex-wrap max-w-5xl gap-y-10 mx-auto">
        {courses.map((course: ICourse) => (
          <li key={course.id} className="border border-gray-300 max-w-[325px]">
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
  );
}
