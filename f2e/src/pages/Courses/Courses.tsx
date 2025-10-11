import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  category: string;
  image: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  features: string[];
  prerequisites: string[];
}

interface FilterOptions {
  category: string;
  level: string;
  priceRange: string;
}

export const Courses: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    level: '',
    priceRange: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const courses: Course[] = useMemo(() => [
    {
      id: '1',
      title: 'Full Stack Web Development',
      description: 'Master modern web development with React, Node.js, Express, and MongoDB. Build complete web applications from scratch.',
      duration: '12 weeks',
      level: 'Intermediate',
      price: '$599',
      category: 'Web Development',
      image: '/assets/topics/full-stack.png',
      instructor: 'Priya Sharma',
      rating: 4.8,
      studentsCount: 1250,
      features: ['Live Projects', 'Job Assistance', 'Certificate', '24/7 Support'],
      prerequisites: ['Basic HTML/CSS', 'JavaScript Fundamentals']
    },
    {
      id: '2',
      title: 'Data Science & Analytics',
      description: 'Learn Python, pandas, NumPy, machine learning algorithms, and data visualization with real-world projects.',
      duration: '16 weeks',
      level: 'Beginner',
      price: '$699',
      category: 'Data Science',
      image: '/assets/topics/data-science.png',
      instructor: 'Anita Patel',
      rating: 4.9,
      studentsCount: 980,
      features: ['Hands-on Projects', 'Industry Mentorship', 'Portfolio Development'],
      prerequisites: ['Basic Mathematics', 'Computer Literacy']
    },
    {
      id: '3',
      title: 'AWS Cloud Computing',
      description: 'Master Amazon Web Services with hands-on labs covering EC2, S3, Lambda, and DevOps practices.',
      duration: '10 weeks',
      level: 'Advanced',
      price: '$799',
      category: 'Cloud Computing',
      image: '/assets/topics/cloud.png',
      instructor: 'Michael Johnson',
      rating: 4.7,
      studentsCount: 750,
      features: ['AWS Certification Prep', 'Live Labs', 'Real Projects'],
      prerequisites: ['Linux Basics', 'Networking Knowledge', 'Programming Experience']
    },
    {
      id: '4',
      title: 'Python Programming Fundamentals',
      description: 'Complete Python course covering basics to advanced concepts including OOP, file handling, and libraries.',
      duration: '8 weeks',
      level: 'Beginner',
      price: '$399',
      category: 'Programming',
      image: '/assets/topics/python-fundamentals.png',
      instructor: 'Rajesh Kumar',
      rating: 4.6,
      studentsCount: 2100,
      features: ['Interactive Coding', 'Practice Exercises', 'Project Portfolio'],
      prerequisites: ['No Prerequisites']
    },
    {
      id: '5',
      title: 'React.js Frontend Development',
      description: 'Build modern, responsive web applications using React.js, Redux, and modern JavaScript ES6+.',
      duration: '10 weeks',
      level: 'Intermediate',
      price: '$549',
      category: 'Web Development',
      image: '/assets/topics/react-frontend.png',
      instructor: 'Priya Sharma',
      rating: 4.8,
      studentsCount: 890,
      features: ['Modern React Hooks', 'State Management', 'Testing'],
      prerequisites: ['JavaScript ES6', 'HTML/CSS', 'Git Basics']
    },
    {
      id: '6',
      title: 'Machine Learning with Python',
      description: 'Dive deep into machine learning algorithms, neural networks, and AI model development.',
      duration: '14 weeks',
      level: 'Advanced',
      price: '$899',
      category: 'Data Science',
      image: '/assets/topics/machine-learning.png',
      instructor: 'Anita Patel',
      rating: 4.9,
      studentsCount: 560,
      features: ['Deep Learning', 'Model Deployment', 'Research Projects'],
      prerequisites: ['Python Programming', 'Statistics', 'Linear Algebra']
    },
    {
      id: '7',
      title: 'DevOps Engineering',
      description: 'Learn CI/CD, Docker, Kubernetes, Jenkins, and infrastructure automation for modern development.',
      duration: '12 weeks',
      level: 'Advanced',
      price: '$749',
      category: 'DevOps',
      image: '/assets/topics/devops-engineering.png',
      instructor: 'Michael Johnson',
      rating: 4.7,
      studentsCount: 420,
      features: ['Container Orchestration', 'Pipeline Automation', 'Monitoring'],
      prerequisites: ['Linux Administration', 'Cloud Basics', 'Programming']
    },
    {
      id: '8',
      title: 'Mobile App Development',
      description: 'Build cross-platform mobile applications using React Native for iOS and Android.',
      duration: '10 weeks',
      level: 'Intermediate',
      price: '$629',
      category: 'Mobile Development',
      image: '/assets/topics/mobile-app-development.png',
      instructor: 'Priya Sharma',
      rating: 4.6,
      studentsCount: 680,
      features: ['Cross-platform Development', 'App Store Deployment', 'Native Features'],
      prerequisites: ['React.js', 'JavaScript', 'Mobile UI/UX Basics']
    }
  ], []);

  const categories = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Programming', 'DevOps', 'Mobile Development'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = ['All', 'Under $500', '$500-$700', 'Above $700'];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || filters.category === 'All' || course.category === filters.category;
      const matchesLevel = !filters.level || filters.level === 'All' || course.level === filters.level;
      
      let matchesPrice = true;
      if (filters.priceRange && filters.priceRange !== 'All') {
        const price = parseInt(course.price.replace('$', ''));
        if (filters.priceRange === 'Under $500') matchesPrice = price < 500;
        else if (filters.priceRange === '$500-$700') matchesPrice = price >= 500 && price <= 700;
        else if (filters.priceRange === 'Above $700') matchesPrice = price > 700;
      }
      
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }, [searchTerm, filters, courses]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      priceRange: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              IT Training Courses
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Choose from our comprehensive range of courses designed to advance your IT career
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'All' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {levels.map(level => (
                  <option key={level} value={level === 'All' ? '' : level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {priceRanges.map(range => (
                  <option key={range} value={range === 'All' ? '' : range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            <p>Showing {filteredCourses.length} of {courses.length} courses</p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover bg-gray-200"
                  />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {course.level}
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        {course.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 text-sm">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Instructor:</span>
                        <span className="font-medium">{course.instructor}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Students:</span>
                        <span className="font-medium">{course.studentsCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star ${i < Math.floor(course.rating) ? '' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({course.rating})</span>
                      </div>
                      <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        {course.category}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Course Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {course.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{course.features.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link to={`/courses/${course.id}`}>
                        <Button className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find the Right Course?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our education consultants for personalized course recommendations
          </p>
          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
                Get Consultation
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                Learn About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;