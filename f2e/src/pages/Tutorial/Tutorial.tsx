import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { Skeleton } from '../../components/atoms/Skeleton';
import { useTutorials } from '../../hooks';
import { testTutorialsApi } from '../../utils/testTutorialsApi';
import { debugTutorialApi } from '../../utils/debugTutorialApi';
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

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

export const Tutorial: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { tutorials, isLoading, error, categories: apiCategories } = useTutorials();

  // Debug logging
  console.log('Tutorial Component - Render State:', {
    tutorialsCount: tutorials.length,
    isLoading,
    error,
    categories: apiCategories,
    firstTutorial: tutorials[0]
  });

  // Run API debug on component mount (development only)
  useEffect(() => {
    if (import.meta.env?.NODE_ENV === 'development') {
      // Test direct API connectivity
      testTutorialsApi().then(result => {
        console.log('🧪 Direct API Test Result:', result);
      });
      
      debugTutorialApi();
    }
  }, []);

  // Generate dynamic categories from API data
  const categories: Category[] = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    // Count tutorials per category
    tutorials.forEach(tutorial => {
      const categoryKey = tutorial.category.toLowerCase().replace(/\s+/g, '-');
      categoryMap.set(categoryKey, (categoryMap.get(categoryKey) || 0) + 1);
    });

    const dynamicCategories: Category[] = [
      { id: 'all', name: 'All Tutorials', icon: FaBook, count: tutorials.length }
    ];

    // Add categories from API data
    apiCategories.forEach(category => {
      const categoryId = category.toLowerCase().replace(/\s+/g, '-');
      const count = categoryMap.get(categoryId) || 0;
      
      let icon = FaBook;
      if (category.toLowerCase().includes('web')) icon = FaCode;
      else if (category.toLowerCase().includes('cloud')) icon = FaVideo;
      else if (category.toLowerCase().includes('mobile')) icon = FaCode;
      else if (category.toLowerCase().includes('data')) icon = FaBook;
      
      dynamicCategories.push({
        id: categoryId,
        name: category,
        icon,
        count
      });
    });

    return dynamicCategories;
  }, [tutorials, apiCategories]);

  // Mock tutorials data removed - now using API data from useTutorials hook

  const filteredTutorials = useMemo(() => {
    return tutorials.filter(tutorial => {
      const tutorialCategoryId = tutorial.category.toLowerCase().replace(/\s+/g, '-');
      const matchesCategory = selectedCategory === 'all' || tutorialCategoryId === selectedCategory;
      const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.author.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tutorials, selectedCategory, searchTerm]);

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

          {/* Results Count */}
          {!isLoading && !error && (
            <div className="mb-6 text-gray-600">
              <p>Showing {filteredTutorials.length} of {tutorials.length} tutorials</p>
            </div>
          )}

          {/* Tutorial Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Tutorials</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : filteredTutorials.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No tutorials found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or category filter</p>
              <Button onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTutorials.map((tutorial) => (
                <div key={tutorial._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={tutorial.thumbnailUrl || '/assets/topics/default-tutorial.png'}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover bg-gray-200"
                    />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      as={Link}
                      to={`/tutorials/${tutorial._id}`}
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
                    {tutorial.shortDescription || tutorial.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUser className="mr-1" />
                      {tutorial.author}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tutorial.totalViews} views
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      as={Link}
                      to={`/tutorials/${tutorial._id}`}
                      className="flex-1"
                      size="sm"
                    >
                      <FaPlay className="mr-2" /> Watch
                    </Button>
                    {tutorial.downloadUrl && (
                      <Button
                        onClick={() => window.open(tutorial.downloadUrl, '_blank')}
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
          )}

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