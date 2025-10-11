import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { 
  FaLightbulb, 
  FaHandshake, 
  FaUsers, 
  FaTrophy 
} from 'react-icons/fa';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise: string[];
}

interface Achievement {
  year: string;
  title: string;
  description: string;
}

export const About: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      role: 'Founder & CEO',
      bio: 'Former Senior Software Architect with 15+ years experience at top tech companies.',
      image: '/assets/trainer/rajesh.jpg',
      expertise: ['Leadership', 'Software Architecture', 'AI/ML']
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Head of Curriculum',
      bio: 'Education specialist with expertise in designing industry-relevant training programs.',
      image: '/assets/trainer/priya.jpg',
      expertise: ['Curriculum Design', 'Web Development', 'Data Science']
    },
    {
      id: '3',
      name: 'Michael Johnson',
      role: 'Senior Cloud Instructor',
      bio: 'AWS Certified Solutions Architect with 10+ years in cloud infrastructure.',
      image: '/assets/trainer/michael.jpg',
      expertise: ['AWS', 'DevOps', 'Kubernetes']
    },
    {
      id: '4',
      name: 'Anita Patel',
      role: 'Data Science Lead',
      bio: 'Former Data Scientist at leading analytics firms, specialized in machine learning.',
      image: '/assets/trainer/anita.jpg',
      expertise: ['Python', 'Machine Learning', 'Statistics']
    }
  ];

  const achievements: Achievement[] = [
    {
      year: '2018',
      title: 'Founded F2Export IT Training',
      description: 'Started with a vision to bridge the skills gap in IT industry'
    },
    {
      year: '2019',
      title: 'First 1000 Students',
      description: 'Reached milestone of training 1000 students with 90% job placement'
    },
    {
      year: '2021',
      title: 'Industry Partnership',
      description: 'Established partnerships with leading tech companies for direct hiring'
    },
    {
      year: '2023',
      title: 'Award Recognition',
      description: 'Recognized as "Best IT Training Institute" by TechEducation Awards'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Launched online programs reaching students across 15 countries'
    }
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: 'Innovation',
      description: 'We constantly update our curriculum with the latest technologies and industry trends.'
    },
    {
      icon: FaHandshake,
      title: 'Integrity',
      description: 'We maintain the highest standards of honesty and transparency in all our interactions.'
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'We foster a supportive learning environment where everyone can thrive and grow.'
    },
    {
      icon: FaTrophy,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course content to student support.'
    }
  ];

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

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our approach to education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-2xl text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our journey to become a leading IT training center
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-indigo-200"></div>
            
            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-2xl font-bold text-indigo-600 mb-2">
                        {achievement.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
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
              Industry professionals and education experts committed to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover bg-gray-200"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {member.bio}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-indigo-200">Students Trained</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-indigo-200">Job Placement Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-indigo-200">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
              <div className="text-indigo-200">Countries Reached</div>
            </div>
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