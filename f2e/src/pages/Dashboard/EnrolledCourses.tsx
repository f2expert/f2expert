import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { BookOpen, Clock, User, TrendingUp, Search } from 'lucide-react';
import { enrollmentApiService, type EnrollmentStats } from '../../services';
import { useAppSelector } from '../../store/hooks';

// Extended interface to match actual API response
interface ApiEnrollmentResponse {
  _id: string;
  userId: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    price: number;
    duration: string;
    totalHours: number;
    rating: number;
    totalStudents: number;
    thumbnailUrl: string;
    totalLectures?: number;
  };
  status: 'enrolled' | 'completed' | 'cancelled' | 'suspended' | 'active';
  createdAt: string;
  updatedAt: string;
  progress?: number;
  completedHours?: number;
  totalLessons?: number;
  completedLessons?: string[];
  certificateEarned?: boolean;
  nextLesson?: string;
  enrollmentDate?: string;
  lastAccessedAt?: string;
}

interface FilterOptions {
  category: string;
  level: string;
  progress: string;
}



export const EnrolledCourses: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [enrollments, setEnrollments] = useState<ApiEnrollmentResponse[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<ApiEnrollmentResponse[]>([]);
  const [stats, setStats] = useState<EnrollmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    level: 'all',
    progress: 'all'
  });

  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (!user?.id) {
        console.log('No user ID available, skipping enrollment fetch');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching enrollments for user:', user.id);
        
        // Fetch enrollments and stats in parallel
        const [enrollmentsResponse, statsResponse] = await Promise.all([
          enrollmentApiService.getUserEnrollments(user.id),
          enrollmentApiService.getUserEnrollmentStats(user.id)
        ]);
        
        console.log('Received enrollments:', enrollmentsResponse.data);
        console.log('Received stats:', statsResponse);
        
        // Transform the data to match our interface
        const transformedEnrollments = enrollmentsResponse.data as unknown as ApiEnrollmentResponse[];
        
        setEnrollments(transformedEnrollments);
        setFilteredEnrollments(transformedEnrollments);
        setStats(statsResponse);
      } catch (error) {
        console.error('Error fetching user enrollments:', error);
        // Keep empty state on error
        setEnrollments([]);
        setFilteredEnrollments([]);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEnrollments();
  }, [user?.id]);

  useEffect(() => {
    const filtered = enrollments.filter(enrollment => {
      // First check if enrollment and courseId exist
      if (!enrollment || !enrollment.courseId) {
        return false;
      }
      
      const course = enrollment.courseId;
      const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || course.category === filters.category;
      const matchesLevel = filters.level === 'all' || course.level === filters.level;
      
      let matchesProgress = true;
      const progress = enrollment.progress || 0;
      if (filters.progress === 'in-progress') {
        matchesProgress = progress > 0 && progress < 100;
      } else if (filters.progress === 'completed') {
        matchesProgress = progress === 100 || enrollment.status === 'completed';
      } else if (filters.progress === 'not-started') {
        matchesProgress = progress === 0;
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesProgress;
    });

    // Default sort by last updated (most recent first)
    filtered.sort((a, b) => {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

    setFilteredEnrollments(filtered);
  }, [enrollments, searchTerm, filters]);

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 100) return 'Completed';
    if (progress >= 75) return 'Nearly Complete';
    if (progress >= 50) return 'In Progress';
    if (progress >= 25) return 'Getting Started';
    return 'Just Started';
  };

  const categories = [...new Set(enrollments.filter(enrollment => enrollment.courseId).map(enrollment => enrollment.courseId.category))];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-300 rounded"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Enrolled Courses</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalEnrollments || enrollments.filter(e => e && e.courseId).length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.completedEnrollments || enrollments.filter(e => e && (e.progress === 100 || e.status === 'completed')).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hours Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalHoursCompleted || enrollments.filter(e => e && e.courseId).reduce((total, enrollment) => total + (enrollment.completedHours || Math.floor((enrollment.progress || 0) * (enrollment.courseId.totalHours || 0) / 100)), 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.certificatesEarned || enrollments.filter(e => e && (e.certificateEarned || (e.progress === 100 || e.status === 'completed'))).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={filters.level}
              onChange={(e) => setFilters({...filters, level: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {/* Progress Filter */}
            <select
              value={filters.progress}
              onChange={(e) => setFilters({...filters, progress: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Progress</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.filter(enrollment => enrollment && enrollment.courseId).map((enrollment) => {
            const course = enrollment.courseId;
            const progress = enrollment.progress || 0;
            const completedHours = enrollment.completedHours || Math.floor(progress * (course.totalHours || 0) / 100);
            const totalLessons = enrollment.totalLessons || course.totalLectures || 20;
            const completedLessons = enrollment.completedLessons?.length || Math.floor(progress * totalLessons / 100);
            const isCompleted = progress === 100 || enrollment.status === 'completed';
            const hasCertificate = enrollment.certificateEarned || isCompleted;
            
            return (
            <Card key={enrollment._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={course.thumbnailUrl || '/api/placeholder/300/200'} 
                  alt={course.title}
                  className="w-full h-48 object-cover bg-gray-200"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                    course.level === 'Beginner' ? 'bg-green-500' :
                    course.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                    (enrollment.status === 'enrolled' || enrollment.status === 'active') ? 'bg-blue-500' :
                    enrollment.status === 'completed' ? 'bg-green-500' :
                    enrollment.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                  </span>
                </div>
                {hasCertificate && (
                  <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-medium">
                      Certificate Available
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-1" />
                    <span>{course.instructor}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{completedHours}/{course.totalHours || 0} hours</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {getProgressText(progress)}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{completedLessons}/{totalLessons} lessons</span>
                    <span>Updated: {new Date(enrollment.updatedAt || enrollment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Next Lesson */}
                {progress < 100 && (enrollment.status === 'enrolled' || enrollment.status === 'active') && (
                  <p className="text-sm text-blue-600 mb-4">
                    <strong>Status:</strong> In Progress - Continue Learning
                  </p>
                )}

                {enrollment.status === 'cancelled' && (
                  <p className="text-sm text-red-600 mb-4">
                    <strong>Status:</strong> Cancelled - Re-enroll to Continue
                  </p>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  {(enrollment.status === 'enrolled' || enrollment.status === 'active') ? (
                    <Link to={`/courses/${course._id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        {isCompleted ? 'Review' : 'Continue'}
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/courses/${course._id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View Course
                      </Button>
                    </Link>
                  )}
                  {hasCertificate && (
                    <Button variant="outline" size="sm">
                      Certificate
                    </Button>
                  )}
                </div>
              </div>
            </Card>
            );
          })}
        </div>

        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t enrolled in any courses yet'
              }
            </p>
            <Link to="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;