import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { 
  FaPlay, 
  FaBook, 
  FaCode, 
  FaVideo, 
  FaDownload,
  FaClock,
  FaUser,
  FaStar,
  FaSearch
} from 'react-icons/fa';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  downloadUrl?: string;
  instructor: string;
  rating: number;
  views: number;
}

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

export const Tutorial: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories: Category[] = [
    { id: 'all', name: 'All Tutorials', icon: FaBook, count: 24 },
    { id: 'web-development', name: 'Web Development', icon: FaCode, count: 8 },
    { id: 'data-science', name: 'Data Science', icon: FaBook, count: 6 },
    { id: 'cloud-computing', name: 'Cloud Computing', icon: FaVideo, count: 5 },
    { id: 'mobile-development', name: 'Mobile Development', icon: FaCode, count: 5 },
  ];

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Learn the fundamentals of React Hooks and how to use useState, useEffect, and custom hooks in your applications.',
      duration: '45 min',
      level: 'Beginner',
      category: 'web-development',
      thumbnail: '/assets/topics/react-frontend.png',
      videoUrl: '#',
      downloadUrl: '/downloads/react-hooks-guide.pdf',
      instructor: 'Sarah Johnson',
      rating: 4.8,
      views: 1250
    },
    {
      id: '2',
      title: 'Python Data Analysis with Pandas',
      description: 'Master data manipulation and analysis using Pandas library. Perfect for beginners in data science.',
      duration: '60 min',
      level: 'Intermediate',
      category: 'data-science',
      thumbnail: '/assets/topics/python-fundamentals.png',
      videoUrl: '#',
      downloadUrl: '/downloads/pandas-tutorial.pdf',
      instructor: 'Dr. Michael Chen',
      rating: 4.9,
      views: 980
    },
    {
      id: '3',
      title: 'AWS EC2 Instance Setup',
      description: 'Step-by-step guide to setting up and configuring EC2 instances on Amazon Web Services.',
      duration: '35 min',
      level: 'Beginner',
      category: 'cloud-computing',
      thumbnail: '/assets/topics/cloud.png',
      videoUrl: '#',
      instructor: 'Emily Rodriguez',
      rating: 4.7,
      views: 756
    },
    {
      id: '4',
      title: 'React Native Mobile App Development',
      description: 'Build your first mobile app using React Native. Learn navigation, state management, and deployment.',
      duration: '90 min',
      level: 'Intermediate',
      category: 'mobile-development',
      thumbnail: '/assets/topics/mobile-app-development.png',
      videoUrl: '#',
      downloadUrl: '/downloads/react-native-guide.pdf',
      instructor: 'James Wilson',
      rating: 4.6,
      views: 645
    },
    {
      id: '5',
      title: 'JavaScript ES6+ Features',
      description: 'Explore modern JavaScript features including arrow functions, destructuring, promises, and async/await.',
      duration: '50 min',
      level: 'Intermediate',
      category: 'web-development',
      thumbnail: '/assets/topics/full-stack.png',
      videoUrl: '#',
      instructor: 'Lisa Chen',
      rating: 4.8,
      views: 1100
    },
    {
      id: '6',
      title: 'Machine Learning Basics with Python',
      description: 'Introduction to machine learning concepts and implementation using Python and scikit-learn.',
      duration: '75 min',
      level: 'Beginner',
      category: 'data-science',
      thumbnail: '/assets/topics/machine-learning.png',
      videoUrl: '#',
      downloadUrl: '/downloads/ml-basics.pdf',
      instructor: 'Dr. Anita Patel',
      rating: 4.9,
      views: 890
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`text-sm ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Interactive Tutorials
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Learn at your own pace with our comprehensive video tutorials and hands-on exercises
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Tutorials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <IconComponent className="mr-2" />
                    {category.name}
                    <span className="ml-2 text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.id === 'all' ? tutorials.length : category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-48 object-cover bg-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      className="bg-white text-gray-900 hover:bg-gray-100"
                      size="sm"
                    >
                      <FaPlay className="mr-2" /> Watch Now
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    <FaClock className="inline mr-1" />
                    {tutorial.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                      {tutorial.level}
                    </span>
                    <div className="flex items-center">
                      {renderStars(tutorial.rating)}
                      <span className="ml-1 text-sm text-gray-600">({tutorial.rating})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tutorial.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm">
                    {tutorial.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUser className="mr-1" />
                      {tutorial.instructor}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tutorial.views} views
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      to={tutorial.videoUrl}
                      className="flex-1"
                      size="sm"
                    >
                      <FaPlay className="mr-2" /> Watch
                    </Button>
                    {tutorial.downloadUrl && (
                      <Button
                        as={Link}
                        to={tutorial.downloadUrl}
                        variant="outline"
                        size="sm"
                      >
                        <FaDownload />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <FaVideo className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tutorials found</h3>
              <p className="text-gray-600">
                Try adjusting your search or selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have advanced their skills with our comprehensive tutorials.
          </p>
          <div className="space-x-4">
            <Button
              as={Link}
              to="/courses"
              size="lg"
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            >
              View All Courses
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-indigo-600"
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tutorial;