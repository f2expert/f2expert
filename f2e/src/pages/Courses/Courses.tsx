import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { useCourses } from '../../hooks';
import { Skeleton } from '../../components/atoms/Skeleton';

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
  const { courses, isLoading, error } = useCourses();

  // Remove this mock data array - it will be replaced with API data
  // Mock data removed - now using API data from useCourses hook

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(courses.map(course => course.category)));
    return ['All', ...uniqueCategories];
  }, [courses]);
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
        const price = course.price;
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
          {!isLoading && !error && (
            <div className="mt-6 text-gray-600">
              <p>Showing {filteredCourses.length} of {courses.length} courses</p>
            </div>
          )}
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-16 w-full mb-3" />
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Courses</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={course.thumbnailUrl || '/assets/topics/default-course.png'} 
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
                        {course.currency}{course.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 text-sm">
                      {course.shortDescription || course.description}
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
                        <span className="font-medium">{course.totalStudents.toLocaleString()}</span>
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
                        {course.certificateProvided && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Certificate</span>
                        )}
                        {course.hasProjects && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Live Projects</span>
                        )}
                        {course.jobAssistance && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Job Assistance</span>
                        )}
                        {course.supportProvided && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">24/7 Support</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link to={`/courses/${course._id}`}>
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