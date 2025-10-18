import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { useTrainers } from '../../hooks';
import { Skeleton } from '../../components/atoms/Skeleton';

export const About: React.FC = () => {
  const { trainers, isLoading, error } = useTrainers();  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About F2Export
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Empowering the next generation of IT professionals through 
              world-class training and career development programs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="flex justify-between max-w-5xl gap-y-10 mx-auto">
                  <div className="image-column">
                    <div className="inner-column">
                      <figure className="image-1">
                        <img src="assets/about-3.jpg" alt="" />
                      </figure>
                      <figure className="image-2">
                        <img src="assets/about-4.jpg" alt="" />
                      </figure>
                      <div className="experience">
                        <img src="assets/image-1.jpg" alt="" className="icon" />
                        <strong>3600+</strong> Satisfied Students
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Vision
              </h2>
              <p className="text-md text-gray-600 mb-6">
                To be the global leader in transformative IT education, empowering 
                individuals from all backgrounds to become the next generation of 
                technology innovators and industry leaders. We envision a future where 
                every learner has access to cutting-edge training that not only builds 
                technical expertise but also cultivates creativity, critical thinking, 
                and entrepreneurial mindset.
              </p>
              <p className="text-md text-gray-600 mb-8">
                By 2030, we aim to create a worldwide network of skilled IT professionals 
                who are equipped to solve complex global challenges through technology, 
                drive digital transformation across industries, and contribute to building 
                a more connected and innovative world. Our vision extends beyond traditional 
                training to fostering a community of lifelong learners who continuously 
                adapt and excel in the rapidly evolving tech landscape.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-md text-gray-600 mb-6">
                At F2Export IT Training Center, we believe that quality education 
                should be accessible to everyone. Our mission is to bridge the gap 
                between academic learning and industry requirements by providing 
                practical, hands-on training programs.
              </p>
              <p className="text-md text-gray-600 mb-8">
                We are committed to creating a learning environment that not only 
                teaches technical skills but also develops problem-solving abilities, 
                teamwork, and professional communication skills that are essential 
                for career success.
              </p>
              <Link to="/courses">
                <Button size="lg">
                  Explore Our Programs
                </Button>
              </Link>
            </div>
            
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team comprises experienced instructors, industry experts, and dedicated support staff who are passionate about education and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <div className="flex flex-wrap gap-1">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-14" />
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-8">
                <p className="text-red-600 mb-4">Error loading trainers: {error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : trainers.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No trainers available at the moment.</p>
              </div>
            ) : (
              // Trainer data
              trainers.map((trainer) => (
                <div key={trainer._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={'/assets/trainer/default-avatar.jpg'} 
                    alt={trainer.fullName}
                    className="w-full h-64 object-cover bg-gray-200"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {trainer.fullName}
                    </h3>
                    <p className="text-indigo-600 font-semibold mb-3">
                      {trainer.roleDisplay || 'Senior Instructor'}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Experienced professional dedicated to student success.
                    </p>
                    {trainer.trainerInfo?.expertise && trainer.trainerInfo.expertise.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-700">Expertise:</p>
                        <div className="flex flex-wrap gap-1">
                          {trainer.trainerInfo.expertise.map((skill: string, index: number) => (
                            <span 
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the next step in your career journey with our comprehensive 
            IT training programs and expert guidance.
          </p>
          <div className="space-x-4">
            <Link to="/courses">
              <Button size="lg">
                View Courses
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;