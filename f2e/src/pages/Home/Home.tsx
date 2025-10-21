import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { 
  FaChalkboardTeacher, 
  FaLaptopCode, 
  FaUsers, 
  FaClock, 
  FaCertificate, 
  FaSyncAlt, 
  FaStar,
  FaFlag,
  FaEye,
  FaHistory
} from 'react-icons/fa';
import { useCourses } from "../../hooks";
import type { CourseDetails } from "../../services/courseApi";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export const Home: React.FC = () => {
  const { courses, isLoading } = useCourses();
  const [featuredCourses, setFeaturedCourses] = useState<CourseDetails[]>([]);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Software Developer at TechCorp",
      content:
        "The Full Stack course transformed my career. The instructors are amazing and the hands-on approach really works.",
      avatar: "/assets/student/user.jpg",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Data Analyst at DataFlow",
      content:
        "Excellent training center with practical projects. I landed my dream job within 2 months of completing the course.",
      avatar: "/assets/student/user.jpg",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "DevOps Engineer at CloudTech",
      content:
        "The AWS course is comprehensive and up-to-date. Great support from instructors even after completion.",
      avatar: "/assets/student/user.jpg",
    },
  ];

  const stats = [
    { number: "5000+", label: "Students Trained" },
    { number: "95%", label: "Job Placement Rate" },
    { number: "50+", label: "Expert Instructors" },
    { number: "100+", label: "Course Modules" },
  ];

  // Banner images for hero section animation
  const bannerImages = [
    "/assets/banner/banner1.jpg",
    "/assets/banner/banner2.jpg",
  ];

  // State for current banner image
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // useCourses hook automatically loads courses on mount
  // Update featured courses when courses data changes
  useEffect(() => {
    if (courses && courses.length > 0) {
      setFeaturedCourses(courses.slice(0, 3));
    }
  }, [courses]);

  // Auto-rotate banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Transform Your Career with
              <span className="block text-yellow-300">
                IT Training Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-md">
              Join thousands of successful professionals who've advanced their
              careers through our industry-leading IT training programs.
            </p>
            <div className="space-x-4">
              <Button
                as={Link}
                to="/courses"
                size="lg"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200"
              >
                Explore Courses
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-200"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBannerIndex
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
        <section className="py-20 sm:py-32" id="about-us">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                About Us
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                {" "}
                F2Expert was founded with a mission to bridge the gap between
                academic learning and industry requirements. We are dedicated to
                providing high-quality, practical training that empowers
                individuals to achieve their full potential in the IT sector.{" "}
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <FaFlag className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  {" "}
                  To deliver cutting-edge IT training that is accessible,
                  affordable, and aligned with the latest industry trends.{" "}
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
                  <FaEye className="text-3xl text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  {" "}
                  To be the leading provider of IT education, recognized for our
                  commitment to student success and innovation.{" "}
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 mb-4">
                  <FaHistory className="text-3xl text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Our History
                </h3>
                <p className="text-gray-600">
                  {" "}
                  Since our inception in 2021, we have successfully trained
                  thousands of students who have gone on to build successful
                  careers in top-tier companies.{" "}
                </p>
              </div>
            </div>
          </div>
        </section> 

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular training programs designed to give you
              the skills employers are looking for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
                      <div className="h-6 w-16 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 w-full bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover bg-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/ui-ux.png'; // Fallback image
                    }}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                        {course.level}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-600">
                          {course.currency}{course.price}
                        </span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {course.currency}{course.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 h-12 overflow-hidden">{course.shortDescription}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        Duration: {course.duration}
                      </span>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 text-sm mr-1" />
                        <span className="text-sm text-gray-600">
                          {course.rating} ({course.totalStudents} students)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        {course.totalStudents} students enrolled
                      </span>
                      <span className="text-sm text-blue-600 font-medium">
                        {course.category}
                      </span>
                    </div>
                    <Button
                      as={Link}
                      to={`/courses/${course._id}`}
                      className="w-full"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button as={Link} to="/courses" variant="outline" size="lg">
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Training Center?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChalkboardTeacher className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of real-world
                experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLaptopCode className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Hands-on Learning
              </h3>
              <p className="text-gray-600">
                Practical projects and real-world scenarios to build your
                portfolio
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Career Support
              </h3>
              <p className="text-gray-600">
                Job placement assistance and ongoing career guidance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Flexible Schedule
              </h3>
              <p className="text-gray-600">
                Evening and weekend classNamees to fit your busy schedule
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCertificate className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Industry Certification
              </h3>
              <p className="text-gray-600">
                Earn recognized certifications that employers value
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSyncAlt className="text-2xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Latest Technologies
              </h3>
              <p className="text-gray-600">
                Stay current with the latest tools and technologies in the
                industry
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Real success stories from our graduates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-gray-200 mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="mt-3 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your IT Career Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of learners and take the first step towards a
            successful career in technology.
          </p>
          <div className="space-x-4">
            <Button
              as={Link}
              to="/courses"
              size="lg"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            >
              Browse Courses
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="outline"
              size="lg"
              className="bg-[#012f5c] text-white hover:bg-[#155a9f]"
            >
              Sign Up Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
