// Enrollment API Service
export interface EnrollmentDetails {
  _id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'suspended';
  progress: number;
  lastAccessedAt: string;
  completedLessons: string[];
  totalLessons: number;
  completedHours: number;
  totalHours: number;
  nextLesson?: string;
  certificateEarned: boolean;
  certificateUrl?: string;
  course: {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    thumbnailUrl: string;
    duration: string;
    totalHours: number;
    totalLectures: number;
    rating: number;
  };
}

export interface EnrollmentsResponse {
  data: EnrollmentDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EnrollmentFilters {
  status?: 'active' | 'completed' | 'cancelled' | 'suspended';
  category?: string;
  level?: string;
  progress?: 'not-started' | 'in-progress' | 'completed';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'enrollmentDate' | 'lastAccessedAt' | 'progress' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  totalHoursCompleted: number;
  certificatesEarned: number;
  averageProgress: number;
}

// Mock API Base URL (replace with actual API endpoint)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

class EnrollmentApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Enrollment API Request URL:', url);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Enrollment API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Fetch user enrollments
  async getUserEnrollments(userId: string, filters: EnrollmentFilters = {}): Promise<EnrollmentsResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    try {
      const endpoint = `/enrollments/user/${userId}`;
      console.log('Fetching enrollments for user:', userId);
      
      const result = await this.makeRequest<EnrollmentsResponse>(endpoint);
      console.log('Enrollment API response:', result);
      
      return result;
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      // Fallback to mock data if API fails
      console.log('Falling back to mock enrollment data for user:', userId);
      return this.getMockUserEnrollments(userId, filters);
    }
  }

  // Get enrollment statistics for a user
  async getUserEnrollmentStats(userId: string): Promise<EnrollmentStats> {
    try {
      const endpoint = `/enrollments/user/${userId}/stats`;
      console.log('Fetching enrollment stats for user:', userId);
      
      const result = await this.makeRequest<EnrollmentStats>(endpoint);
      console.log('Enrollment stats API response:', result);
      
      return result;
    } catch (error) {
      console.error('Error fetching enrollment stats:', error);
      // Fallback to mock stats if API fails
      return this.getMockEnrollmentStats(userId);
    }
  }

  // Get single enrollment details
  async getEnrollmentById(enrollmentId: string): Promise<EnrollmentDetails> {
    try {
      const endpoint = `/enrollments/${enrollmentId}`;
      console.log('Fetching enrollment by ID:', enrollmentId);
      
      const result = await this.makeRequest<{ data?: EnrollmentDetails } | EnrollmentDetails>(endpoint);
      console.log('Enrollment detail API response:', result);
      
      // Handle both direct enrollment data and wrapped response
      let enrollmentData: EnrollmentDetails;
      if ('data' in result && result.data) {
        enrollmentData = result.data;
      } else if ('_id' in result) {
        enrollmentData = result as EnrollmentDetails;
      } else {
        throw new Error('Invalid enrollment data format received from API');
      }
      
      return enrollmentData;
    } catch (error) {
      console.error('Error fetching enrollment by ID:', error);
      throw error;
    }
  }

  // Update enrollment progress
  async updateEnrollmentProgress(
    enrollmentId: string, 
    lessonId: string, 
    progress: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const endpoint = `/enrollments/${enrollmentId}/progress`;
      console.log(`Updating enrollment progress: ${enrollmentId}, lesson: ${lessonId}, progress: ${progress}`);
      
      const result = await this.makeRequest<{ success?: boolean; message?: string }>(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ lessonId, progress }),
      });
      
      return {
        success: result.success ?? true,
        message: result.message ?? 'Progress updated successfully'
      };
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update progress'
      };
    }
  }

  // Cancel enrollment
  async cancelEnrollment(enrollmentId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const endpoint = `/enrollments/${enrollmentId}/cancel`;
      console.log(`Cancelling enrollment: ${enrollmentId}`);
      
      const result = await this.makeRequest<{ success?: boolean; message?: string }>(endpoint, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });
      
      return {
        success: result.success ?? true,
        message: result.message ?? 'Enrollment cancelled successfully'
      };
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel enrollment'
      };
    }
  }

  // Mock data methods (fallback when API fails)
  private async getMockUserEnrollments(userId: string, filters: EnrollmentFilters): Promise<EnrollmentsResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockEnrollments: EnrollmentDetails[] = [
      {
        _id: 'enroll_1',
        userId: userId,
        courseId: '1',
        enrollmentDate: '2024-01-15T00:00:00Z',
        status: 'active',
        progress: 75,
        lastAccessedAt: '2024-10-20T10:30:00Z',
        completedLessons: ['lesson_1', 'lesson_2', 'lesson_3'],
        totalLessons: 48,
        completedHours: 90,
        totalHours: 120,
        nextLesson: 'React State Management with Redux',
        certificateEarned: false,
        course: {
          _id: '1',
          title: 'Full Stack Web Development',
          description: 'Master modern web development with React, Node.js, and MongoDB',
          instructor: 'Priya Sharma',
          category: 'Web Development',
          level: 'Intermediate',
          thumbnailUrl: '/api/placeholder/300/200',
          duration: '12 weeks',
          totalHours: 120,
          totalLectures: 48,
          rating: 4.8
        }
      },
      {
        _id: 'enroll_2',
        userId: userId,
        courseId: '2',
        enrollmentDate: '2024-02-01T00:00:00Z',
        status: 'active',
        progress: 45,
        lastAccessedAt: '2024-10-18T14:20:00Z',
        completedLessons: ['lesson_1', 'lesson_2'],
        totalLessons: 32,
        completedHours: 36,
        totalHours: 80,
        nextLesson: 'Neural Networks Introduction',
        certificateEarned: false,
        course: {
          _id: '2',
          title: 'Data Science & Machine Learning',
          description: 'Learn data analysis, visualization, and machine learning with Python',
          instructor: 'Dr. Anita Patel',
          category: 'Data Science',
          level: 'Advanced',
          thumbnailUrl: '/api/placeholder/300/200',
          duration: '16 weeks',
          totalHours: 80,
          totalLectures: 32,
          rating: 4.6
        }
      },
      {
        _id: 'enroll_3',
        userId: userId,
        courseId: '3',
        enrollmentDate: '2024-03-10T00:00:00Z',
        status: 'active',
        progress: 20,
        lastAccessedAt: '2024-10-15T09:15:00Z',
        completedLessons: ['lesson_1'],
        totalLessons: 28,
        completedHours: 12,
        totalHours: 60,
        nextLesson: 'Setting up EC2 Instances',
        certificateEarned: false,
        course: {
          _id: '3',
          title: 'AWS Cloud Computing Fundamentals',
          description: 'Master cloud computing with Amazon Web Services',
          instructor: 'Rajesh Kumar',
          category: 'Cloud Computing',
          level: 'Beginner',
          thumbnailUrl: '/api/placeholder/300/200',
          duration: '10 weeks',
          totalHours: 60,
          totalLectures: 28,
          rating: 4.4
        }
      },
      {
        _id: 'enroll_4',
        userId: userId,
        courseId: '4',
        enrollmentDate: '2023-11-20T00:00:00Z',
        status: 'completed',
        progress: 100,
        lastAccessedAt: '2024-01-15T16:45:00Z',
        completedLessons: ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4', 'lesson_5'],
        totalLessons: 25,
        completedHours: 50,
        totalHours: 50,
        nextLesson: 'Course Completed',
        certificateEarned: true,
        certificateUrl: '/certificates/mobile-dev-cert.pdf',
        course: {
          _id: '4',
          title: 'Mobile App Development with React Native',
          description: 'Build cross-platform mobile apps with React Native',
          instructor: 'Sarah Johnson',
          category: 'Mobile Development',
          level: 'Intermediate',
          thumbnailUrl: '/api/placeholder/300/200',
          duration: '8 weeks',
          totalHours: 50,
          totalLectures: 25,
          rating: 4.7
        }
      },
      {
        _id: 'enroll_5',
        userId: userId,
        courseId: '5',
        enrollmentDate: '2023-12-01T00:00:00Z',
        status: 'active',
        progress: 90,
        lastAccessedAt: '2024-10-22T11:30:00Z',
        completedLessons: ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4'],
        totalLessons: 20,
        completedHours: 36,
        totalHours: 40,
        nextLesson: 'Final Project Review',
        certificateEarned: false,
        course: {
          _id: '5',
          title: 'Python Programming for Beginners',
          description: 'Learn Python programming from scratch',
          instructor: 'Michael Chen',
          category: 'Programming',
          level: 'Beginner',
          thumbnailUrl: '/api/placeholder/300/200',
          duration: '6 weeks',
          totalHours: 40,
          totalLectures: 20,
          rating: 4.5
        }
      }
    ];

    // Apply filters
    let filteredEnrollments = mockEnrollments;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEnrollments = filteredEnrollments.filter(enrollment => 
        enrollment.course.title.toLowerCase().includes(searchLower) ||
        enrollment.course.instructor.toLowerCase().includes(searchLower) ||
        enrollment.course.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filteredEnrollments = filteredEnrollments.filter(enrollment => 
        enrollment.status === filters.status
      );
    }

    if (filters.category) {
      filteredEnrollments = filteredEnrollments.filter(enrollment => 
        enrollment.course.category === filters.category
      );
    }

    if (filters.level) {
      filteredEnrollments = filteredEnrollments.filter(enrollment => 
        enrollment.course.level === filters.level
      );
    }

    if (filters.progress) {
      filteredEnrollments = filteredEnrollments.filter(enrollment => {
        if (filters.progress === 'not-started') return enrollment.progress === 0;
        if (filters.progress === 'in-progress') return enrollment.progress > 0 && enrollment.progress < 100;
        if (filters.progress === 'completed') return enrollment.progress === 100;
        return true;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredEnrollments.sort((a, b) => {
        let aVal: string | number, bVal: string | number;
        
        switch (filters.sortBy) {
          case 'title':
            aVal = a.course.title;
            bVal = b.course.title;
            break;
          case 'progress':
            aVal = a.progress;
            bVal = b.progress;
            break;
          case 'enrollmentDate':
            aVal = new Date(a.enrollmentDate).getTime();
            bVal = new Date(b.enrollmentDate).getTime();
            break;
          case 'lastAccessedAt':
          default:
            aVal = new Date(a.lastAccessedAt).getTime();
            bVal = new Date(b.lastAccessedAt).getTime();
            break;
        }

        if (filters.sortOrder === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEnrollments = filteredEnrollments.slice(startIndex, endIndex);

    console.log(`Mock API: Returning ${paginatedEnrollments.length} enrollments for user ${userId}`);

    return {
      data: paginatedEnrollments,
      total: filteredEnrollments.length,
      page,
      limit,
      totalPages: Math.ceil(filteredEnrollments.length / limit)
    };
  }

  private async getMockEnrollmentStats(userId: string): Promise<EnrollmentStats> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockStats: EnrollmentStats = {
      totalEnrollments: 5,
      activeEnrollments: 4,
      completedEnrollments: 1,
      totalHoursCompleted: 224,
      certificatesEarned: 1,
      averageProgress: 66
    };

    console.log(`Mock API: Returning enrollment stats for user ${userId}:`, mockStats);

    return mockStats;
  }
}

// Export singleton instance
export const enrollmentApiService = new EnrollmentApiService();
export default enrollmentApiService;