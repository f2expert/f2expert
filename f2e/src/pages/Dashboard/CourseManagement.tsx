import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Filter,
  Download,
  Upload,
  Search,
  Edit3,
  Eye,
  Archive,
  MoreVertical,
  DollarSign,
  Clock,
  Trash2,
  Mail,
  Settings
} from 'lucide-react';

// Radix UI Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/atoms/DropdownMenu';

import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge as BadgeComponent } from '../../components/atoms/Badge';

// Import Course Management Modals
import { ViewCourseModal, EditCourseModal, DeleteCourseModal, AddCourseModal } from '../../components/molecules';

// Import Course Management API Service
import { 
  courseManagementApiService, 
  type CourseManagement as Course, 
  type CourseFilters
} from '../../services';

const CourseManagement: React.FC = () => {
  // State for courses data
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    category: '',
    level: '',
    status: '',
    instructor: '',
    priceRange: ''
  });

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating' | 'enrolled' | 'created'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selection states
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Modal states (placeholders for future implementation)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Clear selections when filters change
  useEffect(() => {
    setSelectedCourses([]);
  }, [filters]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await courseManagementApiService.getCourses();
      setCourses(result.courses);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(searchTerm) ||
          course.instructor.toLowerCase().includes(searchTerm) ||
          course.category.toLowerCase().includes(searchTerm) ||
          course.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && course.category !== filters.category) return false;

      // Level filter
      if (filters.level && course.level !== filters.level) return false;

      // Status filter
      if (filters.status) {
        if (filters.status === 'published' && !course.isPublished) return false;
        if (filters.status === 'draft' && course.isPublished) return false;
        if (filters.status === 'featured' && !course.isFeatured) return false;
      }

      // Instructor filter
      if (filters.instructor && course.instructor !== filters.instructor) return false;

      // Price range filter
      if (filters.priceRange) {
        const price = course.price;
        switch (filters.priceRange) {
          case 'free': if (price > 0) return false; break;
          case 'under-500': if (price >= 500) return false; break;
          case '500-1000': if (price < 500 || price >= 1000) return false; break;
          case 'over-1000': if (price < 1000) return false; break;
        }
      }

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'enrolled':
          aValue = a.totalStudents;
          bValue = b.totalStudents;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [courses, filters, sortBy, sortOrder]);

  // Modal handlers (placeholders)
  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsAddModalOpen(true);
    // TODO: Implement add course modal
    console.log('Add course modal');
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  // Selection handlers
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(c => c._id));
    }
  };

  // Bulk operations (placeholders)
  const handleBulkPublish = () => {
    console.log('Bulk publish courses:', selectedCourses);
    // TODO: Implement bulk publish
  };

  const handleBulkUnpublish = () => {
    console.log('Bulk unpublish courses:', selectedCourses);
    // TODO: Implement bulk unpublish
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete courses:', selectedCourses);
    // TODO: Implement bulk delete
  };

  // Export/Import handlers (placeholders)
  const handleExport = () => {
    console.log('Export courses data');
    // TODO: Implement export functionality
  };

  const handleImport = () => {
    console.log('Import courses data');
    // TODO: Implement import functionality
  };

  // Utility functions
  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free';
    return `${currency === 'USD' ? '$' : currency}${price}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Archive className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">Error: {error}</span>
          </div>
          <Button 
            onClick={loadCourses} 
            className="mt-3"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor training courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search courses by title, instructor, category, or tags..."
              value={filters.search || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'title' | 'price' | 'rating' | 'enrolled' | 'created');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
            <option value="enrolled-desc">Most Popular</option>
            <option value="enrolled-asc">Least Popular</option>
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
          </select>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Programming Languages">Programming Languages</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>

            <select
              value={filters.instructor}
              onChange={(e) => setFilters(prev => ({ ...prev, instructor: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Instructors</option>
              <option value="Priya Sharma">Priya Sharma</option>
              <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Alex Chen">Alex Chen</option>
              <option value="Michael Brown">Michael Brown</option>
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="under-500">Under $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="over-1000">Over $1000</option>
            </select>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedCourses.length > 0 && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedCourses.length} course(s) selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkPublish}>
                <Settings className="h-4 w-4 mr-1" />
                Publish
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkUnpublish}>
                <Archive className="h-4 w-4 mr-1" />
                Unpublish
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Notify Students
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Archive Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Courses Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Level
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price & Duration
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleSelectCourse(course._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img 
                          src={course.thumbnailUrl || '/assets/topics/default-course.png'} 
                          alt={course.title}
                          className="h-12 w-12 rounded-lg object-cover bg-gray-200"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.totalLectures} lectures • {course.totalHours}h
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.instructor}</div>
                    <div className="text-sm text-gray-500">{course.language}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.category}</div>
                    <BadgeComponent variant="outline" className={`text-xs ${getLevelColor(course.level)}`}>
                      {course.level}
                    </BadgeComponent>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(course.price, course.currency)}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewCourse(course)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Course
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCourse(course)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {courses.length === 0 
                  ? "Get started by adding your first course."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {courses.length === 0 && (
                <div className="mt-6">
                  <Button onClick={handleAddCourse}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Pagination would go here */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
          <div className="flex space-x-2">
            {/* Pagination controls would go here */}
          </div>
        </div>

      {/* View Course Modal */}
      {isViewModalOpen && selectedCourse && (
        <ViewCourseModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          course={selectedCourse}
        />
      )}

      {/* Edit Course Modal */}
      {isEditModalOpen && selectedCourse && (
        <EditCourseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          course={selectedCourse}
          onCourseUpdated={loadCourses}
        />
      )}

      {/* Delete Course Modal */}
      {isDeleteModalOpen && selectedCourse && (
        <DeleteCourseModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          course={selectedCourse}
          onCourseDeleted={loadCourses}
        />
      )}

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCourseAdded={loadCourses}
        />
      )}
    </div>
  );
};

export default CourseManagement;