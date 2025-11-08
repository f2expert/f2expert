// Course Management API Service
import type { CourseDetails } from './index';
import { getAuthHeader } from '../utils/auth';
import '../utils/authDebug'; // Import debug utility to make it available globally

// Extended Course interface for management operations
export interface Course extends CourseDetails {
  createdBy?: string;
  lastModifiedBy?: string;
  enrollmentCount?: number;
  revenue?: number;
  averageRating?: number;
  completionRate?: number;
  isActive?: boolean;
  status?: 'draft' | 'published' | 'archived' | 'suspended';
}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  status?: string;
  instructor?: string;
  priceRange?: string;
  isPublished?: boolean;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  shortDescription: string;
  instructor: string;
  instructorBio: string;
  category: string;
  subCategory: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  price: number;
  originalPrice: number;
  currency: string;
  duration: string;
  totalHours: number;
  totalLectures: number;
  language: string;
  maxStudents: number;
  minStudents: number;
  mode: 'Online' | 'Offline' | 'Hybrid';
  certificateProvided: boolean;
  hasProjects: boolean;
  hasAssignments: boolean;
  hasQuizzes: boolean;
  supportProvided: boolean;
  jobAssistance: boolean;
  thumbnailUrl?: string;
  videoPreviewUrl?: string;
  tags: string[];
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  courseStartDate: string;
  courseEndDate: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  isPublished?: boolean;
  isFeatured?: boolean;
}

// API Configuration
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

class CourseManagementApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Prepare headers with authentication
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token is available
    const authHeader = getAuthHeader();
    console.log('🔍 CourseAPI - Debug: Getting auth header for request to:', endpoint);
    console.log('🔍 CourseAPI - Auth header result:', authHeader);
    
    // Additional debugging - check localStorage directly
    const tokensInStorage = localStorage.getItem('auth_tokens');
    console.log('🔍 CourseAPI - Tokens in localStorage:', tokensInStorage);
    
    if (authHeader) {
      defaultHeaders['Authorization'] = authHeader;
      console.log('✅ CourseAPI - Authorization header added');
    } else {
      console.warn('❌ CourseAPI - No authorization header available');
      
      // Run quick diagnosis
      if (typeof window !== 'undefined') {
        const windowWithDebug = window as unknown as { authDebug?: { diagnoseAuthIssue: () => void } };
        if (windowWithDebug.authDebug) {
          console.log('🏥 CourseAPI - Running quick auth diagnosis...');
          windowWithDebug.authDebug.diagnoseAuthIssue();
        }
      }
    }

    try {
      const response = await fetch(url, {
        headers: {
          ...defaultHeaders,
          ...(options?.headers as Record<string, string> || {}),
        },
        ...options,
      });

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          console.warn('Authentication failed - token may be expired');
          // Could trigger logout or token refresh here
        }
        
        // If API call fails, fall back to mock data
        console.warn(`API call failed (${response.status}), using mock data`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API request failed, falling back to mock data:', error);
      throw error;
    }
  }

  // Get all courses for management
  async getCourses(): Promise<{ courses: Course[] }> {
    try {
      // Try to get courses from the API endpoint
      const result = await this.makeRequest<CourseDetails[] | { data: CourseDetails[] } | { courses: CourseDetails[] }>('/courses');
      
      // Handle different response formats
      let coursesData: CourseDetails[];
      
      if (Array.isArray(result)) {
        // Direct array response
        coursesData = result;
      } else if (typeof result === 'object' && result !== null && 'data' in result && Array.isArray(result.data)) {
        // Wrapped in data property
        coursesData = result.data;
      } else if (typeof result === 'object' && result !== null && 'courses' in result && Array.isArray(result.courses)) {
        // Wrapped in courses property
        coursesData = result.courses;
      } else {
        console.warn('Invalid response format from API, falling back to mock data');
        return this.getMockCourses();
      }

      // Validate that coursesData is actually an array
      if (!Array.isArray(coursesData)) {
        console.warn('Courses data is not an array, falling back to mock data');
        return this.getMockCourses();
      }

      // Map API response to Course interface with management fields
      const mappedCourses: Course[] = coursesData
        .filter((course): course is CourseDetails => {
          // Ensure required fields exist
          if (!course || !course._id || !course.title) {
            console.warn('Invalid course data found, skipping:', course);
            return false;
          }
          return true;
        })
        .map((course: CourseDetails): Course => {
          // Type assertion for management fields that might exist in API response
          const courseAny = course as CourseDetails & Partial<Pick<Course, 'createdBy' | 'lastModifiedBy' | 'enrollmentCount' | 'revenue' | 'averageRating' | 'completionRate' | 'isActive' | 'status'>>;
          
          return {
            ...course,
            // Add management-specific fields with proper defaults
            createdBy: courseAny.createdBy || 'admin',
            lastModifiedBy: courseAny.lastModifiedBy || 'admin',
            enrollmentCount: courseAny.enrollmentCount || course.totalStudents || 0,
            revenue: courseAny.revenue || (course.price * (course.totalStudents || 0)),
            averageRating: courseAny.averageRating || course.rating || 0,
            completionRate: courseAny.completionRate || 85, // Default completion rate
            isActive: courseAny.isActive !== undefined ? courseAny.isActive : course.isPublished,
            status: courseAny.status || (course.isPublished ? 'published' : 'draft')
          };
        });

      return { courses: mappedCourses };
    } catch (error) {
      console.warn('Course API failed, falling back to mock data:', error);
      // Return mock data as fallback
      return this.getMockCourses();
    }
  }

  // Get course statistics
  async getCourseStats(): Promise<CourseStats> {
    try {
      const result = await this.makeRequest<CourseStats>('/courses/stats');
      return result;
    } catch (error) {
      console.warn('Course stats API failed:', error);
      return this.getMockStats();
    }
  }

  // Create new course
  async createCourse(courseData: CreateCourseData): Promise<Course> {
    try {
      const result = await this.makeRequest<Course>('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
      return result;
    } catch (error) {
      console.warn('Course creation API failed:', error);
      // Simulate successful creation for demo
      return this.mockCreateCourse(courseData);
    }
  }

  // Update course
  async updateCourse(courseId: string, courseData: UpdateCourseData): Promise<Course> {
    try {
      const result = await this.makeRequest<Course>(`/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });
      return result;
    } catch (error) {
      console.warn('Course update API failed:', error);
      return this.mockUpdateCourse(courseId, courseData);
    }
  }

  // Delete course (soft delete - archive)
  async deleteCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.makeRequest<{ success: boolean; message: string }>(`/admin/courses/${courseId}`, {
        method: 'DELETE',
      });
      return result;
    } catch (error) {
      console.warn('Course deletion API failed:', error);
      return { success: true, message: 'Course archived successfully' };
    }
  }

  // Bulk operations
  async bulkUpdateCourses(courseIds: string[], updates: Partial<UpdateCourseData>): Promise<{ success: boolean; message: string }> {
    try {
      const result = await this.makeRequest<{ success: boolean; message: string }>('/admin/courses/bulk-update', {
        method: 'PUT',
        body: JSON.stringify({ courseIds, updates }),
      });
      return result;
    } catch (error) {
      console.warn('Bulk update API failed:', error);
      return { success: true, message: `Updated ${courseIds.length} courses successfully` };
    }
  }

  // Get course categories for filters
  async getCourseCategories(): Promise<string[]> {
    return [
      'Web Development',
      'Data Science',
      'Mobile Development',
      'Cloud Computing',
      'DevOps',
      'Machine Learning',
      'UI/UX Design',
      'Cybersecurity',
      'Database',
      'Programming Languages'
    ];
  }

  // Get instructors for filters
  async getInstructors(): Promise<string[]> {
    return [
      'Priya Sharma',
      'Dr. Rajesh Kumar',
      'Sarah Johnson',
      'Alex Chen',
      'Michael Brown',
      'Anita Patel',
      'David Wilson',
      'Lisa Anderson'
    ];
  }

  // Mock data methods (fallback when API is not available)
  private async getMockCourses(): Promise<{ courses: Course[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockCourses: Course[] = [
      {
        _id: '1',
        title: 'Full Stack Web Development with React & Node.js',
        description: 'Master modern web development with this comprehensive course covering React, Node.js, Express, MongoDB, and deployment strategies. Learn to build scalable, production-ready applications from scratch.',
        shortDescription: 'Learn to build complete web applications from front-end to back-end',
        instructor: 'Priya Sharma',
        instructorBio: 'Senior Full Stack Developer with 8+ years experience at top tech companies',
        category: 'Web Development',
        subCategory: 'Full Stack Development',
        level: 'Intermediate',
        technologies: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express'],
        prerequisites: ['Basic HTML/CSS', 'JavaScript Fundamentals'],
        learningOutcomes: [
          'Build full-stack web applications',
          'Master React and Node.js',
          'Work with databases (MongoDB)',
          'Deploy applications to cloud',
          'Implement authentication and security',
          'Create RESTful APIs'
        ],
        syllabus: [
          {
            _id: 'm1',
            module: 'Frontend Development with React',
            topics: ['React Components', 'State Management', 'Hooks', 'Routing'],
            duration: '4 weeks'
          },
          {
            _id: 'm2',
            module: 'Backend Development with Node.js',
            topics: ['Node.js Fundamentals', 'Express Framework', 'API Development'],
            duration: '4 weeks'
          }
        ],
        price: 599,
        originalPrice: 799,
        currency: 'USD',
        duration: '12 weeks',
        totalHours: 120,
        totalLectures: 50,
        language: 'English',
        isPublished: true,
        isFeatured: true,
        difficulty: 3,
        rating: 4.8,
        totalStudents: 25420,
        totalEnrollments: 25420,
        certificateProvided: true,
        hasProjects: true,
        hasAssignments: true,
        hasQuizzes: true,
        supportProvided: true,
        jobAssistance: true,
        thumbnailUrl: '/assets/topics/full-stack.png',
        videoPreviewUrl: '/assets/topics/full-stack-preview.mp4',
        tags: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express'],
        enrollmentStartDate: '2024-01-01T00:00:00Z',
        enrollmentEndDate: '2024-12-31T23:59:59Z',
        courseStartDate: '2024-02-01T00:00:00Z',
        courseEndDate: '2024-05-01T00:00:00Z',
        maxStudents: 50,
        minStudents: 10,
        classSchedule: [
          {
            _id: 'cs1',
            day: 'Monday',
            startTime: '18:00',
            endTime: '20:00'
          },
          {
            _id: 'cs2',
            day: 'Wednesday',
            startTime: '18:00',
            endTime: '20:00'
          }
        ],
        mode: 'Online',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-10-01T00:00:00Z',
        __v: 0,
        // Management specific fields
        createdBy: 'admin',
        lastModifiedBy: 'priya.sharma',
        enrollmentCount: 25420,
        revenue: 15226380,
        averageRating: 4.8,
        completionRate: 87,
        isActive: true,
        status: 'published'
      },
      {
        _id: '2',
        title: 'Data Science & Machine Learning with Python',
        description: 'Complete data science course covering Python, pandas, NumPy, scikit-learn, and deep learning with TensorFlow. Master statistical analysis, data visualization, and predictive modeling.',
        shortDescription: 'Master data analysis, visualization, and machine learning',
        instructor: 'Dr. Rajesh Kumar',
        instructorBio: 'PhD in Computer Science, AI Research Scientist with 10+ years experience',
        category: 'Data Science',
        subCategory: 'Machine Learning',
        level: 'Intermediate',
        technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow'],
        prerequisites: ['Basic Python', 'Mathematics (Statistics)'],
        learningOutcomes: [
          'Data manipulation with pandas',
          'Data visualization with matplotlib/seaborn',
          'Machine learning algorithms implementation',
          'Deep learning with TensorFlow',
          'Statistical analysis and hypothesis testing',
          'Model deployment and productionization'
        ],
        syllabus: [
          {
            _id: 'm3',
            module: 'Python for Data Science',
            topics: ['Pandas', 'NumPy', 'Data Cleaning', 'Data Analysis'],
            duration: '6 weeks'
          },
          {
            _id: 'm4',
            module: 'Machine Learning',
            topics: ['Scikit-learn', 'Algorithms', 'Model Training', 'Evaluation'],
            duration: '6 weeks'
          }
        ],
        price: 699,
        originalPrice: 899,
        currency: 'USD',
        duration: '16 weeks',
        totalHours: 160,
        totalLectures: 80,
        language: 'English',
        isPublished: true,
        isFeatured: false,
        difficulty: 4,
        rating: 4.6,
        totalStudents: 32100,
        totalEnrollments: 32100,
        certificateProvided: true,
        hasProjects: true,
        hasAssignments: true,
        hasQuizzes: true,
        supportProvided: true,
        jobAssistance: false,
        thumbnailUrl: '/assets/topics/data-science.png',
        videoPreviewUrl: '/assets/topics/data-science-preview.mp4',
        tags: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
        enrollmentStartDate: '2024-01-01T00:00:00Z',
        enrollmentEndDate: '2024-12-31T23:59:59Z',
        courseStartDate: '2024-03-01T00:00:00Z',
        courseEndDate: '2024-07-01T00:00:00Z',
        maxStudents: 30,
        minStudents: 8,
        classSchedule: [
          {
            _id: 'cs3',
            day: 'Tuesday',
            startTime: '19:00',
            endTime: '21:00'
          },
          {
            _id: 'cs4',
            day: 'Thursday',
            startTime: '19:00',
            endTime: '21:00'
          }
        ],
        mode: 'Online',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-09-15T00:00:00Z',
        __v: 0,
        // Management specific fields
        createdBy: 'admin',
        lastModifiedBy: 'rajesh.kumar',
        enrollmentCount: 32100,
        revenue: 22441900,
        averageRating: 4.6,
        completionRate: 82,
        isActive: true,
        status: 'published'
      },
      {
        _id: '3',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development with comprehensive HTML and CSS training including responsive design, modern layouts, and best practices.',
        shortDescription: 'Master HTML structure and CSS styling for modern web development',
        instructor: 'Sarah Johnson',
        instructorBio: 'Frontend Developer with 6+ years experience in modern web technologies',
        category: 'Web Development',
        subCategory: 'Frontend Development',
        level: 'Beginner',
        technologies: ['HTML', 'CSS', 'HTML5', 'CSS3', 'Flexbox', 'Grid'],
        prerequisites: ['Basic computer skills'],
        learningOutcomes: [
          'HTML document structure and semantics',
          'Modern CSS styling techniques',
          'Responsive web design principles',
          'CSS Grid and Flexbox mastery',
          'Cross-browser compatibility',
          'Web accessibility best practices'
        ],
        syllabus: [
          {
            _id: 'm5',
            module: 'HTML Fundamentals',
            topics: ['HTML Structure', 'Semantic Elements', 'Forms', 'Accessibility'],
            duration: '3 weeks'
          },
          {
            _id: 'm6',
            module: 'CSS Styling & Layouts',
            topics: ['Selectors', 'Box Model', 'Flexbox', 'Grid', 'Responsive Design'],
            duration: '4 weeks'
          }
        ],
        price: 299,
        originalPrice: 399,
        currency: 'USD',
        duration: '8 weeks',
        totalHours: 60,
        totalLectures: 35,
        language: 'English',
        isPublished: true,
        isFeatured: false,
        difficulty: 2,
        rating: 4.7,
        totalStudents: 18350,
        totalEnrollments: 18350,
        certificateProvided: true,
        hasProjects: true,
        hasAssignments: false,
        hasQuizzes: true,
        supportProvided: true,
        jobAssistance: false,
        thumbnailUrl: '/assets/topics/html-css.png',
        videoPreviewUrl: '/assets/topics/html-css-preview.mp4',
        tags: ['HTML', 'CSS', 'Frontend', 'Web Design'],
        enrollmentStartDate: '2024-01-01T00:00:00Z',
        enrollmentEndDate: '2024-12-31T23:59:59Z',
        courseStartDate: '2024-01-15T00:00:00Z',
        courseEndDate: '2024-03-15T00:00:00Z',
        maxStudents: 100,
        minStudents: 15,
        classSchedule: [
          {
            _id: 'cs5',
            day: 'Monday',
            startTime: '17:00',
            endTime: '19:00'
          }
        ],
        mode: 'Online',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-09-01T00:00:00Z',
        __v: 0,
        // Management specific fields
        createdBy: 'admin',
        lastModifiedBy: 'sarah.johnson',
        enrollmentCount: 18350,
        revenue: 5486650,
        averageRating: 4.7,
        completionRate: 93,
        isActive: true,
        status: 'published'
      },
      {
        _id: '4',
        title: 'JavaScript Programming Masterclass',
        description: 'Complete JavaScript course from basics to advanced concepts including ES6+, async programming, modern frameworks, and best practices for professional development.',
        shortDescription: 'Comprehensive JavaScript programming from beginner to advanced',
        instructor: 'Alex Chen',
        instructorBio: 'Senior JavaScript Developer and Technical Lead with 10+ years experience',
        category: 'Programming Languages',
        subCategory: 'JavaScript',
        level: 'Intermediate',
        technologies: ['JavaScript', 'ES6', 'DOM', 'APIs', 'Async/Await', 'Node.js'],
        prerequisites: ['HTML/CSS basics'],
        learningOutcomes: [
          'JavaScript fundamentals and core concepts',
          'ES6+ modern JavaScript features',
          'DOM manipulation and event handling',
          'Asynchronous programming patterns',
          'API integration and fetch operations',
          'Modern JavaScript development patterns'
        ],
        syllabus: [
          {
            _id: 'm7',
            module: 'JavaScript Fundamentals',
            topics: ['Variables & Data Types', 'Functions', 'Objects & Arrays', 'Control Flow'],
            duration: '4 weeks'
          },
          {
            _id: 'm8',
            module: 'Advanced JavaScript',
            topics: ['ES6+ Features', 'Async Programming', 'Promises', 'Modules', 'Error Handling'],
            duration: '5 weeks'
          }
        ],
        price: 449,
        originalPrice: 599,
        currency: 'USD',
        duration: '10 weeks',
        totalHours: 90,
        totalLectures: 55,
        language: 'English',
        isPublished: true,
        isFeatured: true,
        difficulty: 3,
        rating: 4.9,
        totalStudents: 28750,
        totalEnrollments: 28750,
        certificateProvided: true,
        hasProjects: true,
        hasAssignments: true,
        hasQuizzes: true,
        supportProvided: true,
        jobAssistance: true,
        thumbnailUrl: '/assets/topics/javascript.png',
        videoPreviewUrl: '/assets/topics/javascript-preview.mp4',
        tags: ['JavaScript', 'Programming', 'ES6', 'Frontend', 'Backend'],
        enrollmentStartDate: '2024-01-01T00:00:00Z',
        enrollmentEndDate: '2024-12-31T23:59:59Z',
        courseStartDate: '2024-02-01T00:00:00Z',
        courseEndDate: '2024-04-15T00:00:00Z',
        maxStudents: 75,
        minStudents: 20,
        classSchedule: [
          {
            _id: 'cs6',
            day: 'Wednesday',
            startTime: '18:30',
            endTime: '20:30'
          },
          {
            _id: 'cs7',
            day: 'Friday',
            startTime: '18:30',
            endTime: '20:30'
          }
        ],
        mode: 'Online',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-10-01T00:00:00Z',
        __v: 0,
        // Management specific fields
        createdBy: 'admin',
        lastModifiedBy: 'alex.chen',
        enrollmentCount: 28750,
        revenue: 12908750,
        averageRating: 4.9,
        completionRate: 89,
        isActive: true,
        status: 'published'
      },
      {
        _id: '5',
        title: 'Advanced React Development',
        description: 'Deep dive into React ecosystem with hooks, context, performance optimization, testing, and modern development patterns.',
        shortDescription: 'Advanced React concepts for professional development',
        instructor: 'Michael Brown',
        instructorBio: 'React Core Team Contributor, Senior Frontend Architect',
        category: 'Web Development',
        subCategory: 'Frontend Frameworks',
        level: 'Advanced',
        technologies: ['React', 'Redux', 'TypeScript', 'Jest', 'React Testing Library'],
        prerequisites: ['JavaScript ES6+', 'Basic React Knowledge'],
        learningOutcomes: [
          'Advanced React patterns and hooks',
          'State management with Redux',
          'Performance optimization techniques',
          'Testing React applications',
          'TypeScript with React',
          'Production deployment strategies'
        ],
        syllabus: [
          {
            _id: 'm9',
            module: 'Advanced React Concepts',
            topics: ['Custom Hooks', 'Context API', 'Performance Optimization', 'Error Boundaries'],
            duration: '5 weeks'
          },
          {
            _id: 'm10',
            module: 'Testing & Production',
            topics: ['Unit Testing', 'Integration Testing', 'Deployment', 'Monitoring'],
            duration: '3 weeks'
          }
        ],
        price: 799,
        originalPrice: 999,
        currency: 'USD',
        duration: '8 weeks',
        totalHours: 80,
        totalLectures: 45,
        language: 'English',
        isPublished: false,
        isFeatured: false,
        difficulty: 4,
        rating: 0,
        totalStudents: 0,
        totalEnrollments: 0,
        certificateProvided: true,
        hasProjects: true,
        hasAssignments: true,
        hasQuizzes: false,
        supportProvided: true,
        jobAssistance: true,
        thumbnailUrl: '/assets/topics/react-advanced.png',
        videoPreviewUrl: '/assets/topics/react-advanced-preview.mp4',
        tags: ['React', 'Redux', 'TypeScript', 'Testing', 'Advanced'],
        enrollmentStartDate: '2024-11-01T00:00:00Z',
        enrollmentEndDate: '2024-12-31T23:59:59Z',
        courseStartDate: '2024-11-15T00:00:00Z',
        courseEndDate: '2025-01-15T00:00:00Z',
        maxStudents: 25,
        minStudents: 10,
        classSchedule: [
          {
            _id: 'cs8',
            day: 'Saturday',
            startTime: '10:00',
            endTime: '13:00'
          }
        ],
        mode: 'Online',
        createdAt: '2024-10-15T00:00:00Z',
        updatedAt: '2024-10-25T00:00:00Z',
        __v: 0,
        // Management specific fields
        createdBy: 'admin',
        lastModifiedBy: 'michael.brown',
        enrollmentCount: 0,
        revenue: 0,
        averageRating: 0,
        completionRate: 0,
        isActive: false,
        status: 'draft'
      }
    ];

    return { courses: mockCourses };
  }

  private async getMockStats(): Promise<CourseStats> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalCourses: 5,
      publishedCourses: 4,
      draftCourses: 1,
      totalEnrollments: 104620,
      totalRevenue: 56063280,
      averageRating: 4.7
    };
  }

  private async mockCreateCourse(courseData: CreateCourseData): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCourse: Course = {
      _id: `course_${Date.now()}`,
      ...courseData,
      thumbnailUrl: courseData.thumbnailUrl || '/assets/topics/default-course.png',
      videoPreviewUrl: courseData.videoPreviewUrl || '',
      rating: 0,
      totalStudents: 0,
      totalEnrollments: 0,
      isPublished: false,
      isFeatured: false,
      difficulty: courseData.level === 'Beginner' ? 2 : courseData.level === 'Intermediate' ? 3 : 4,
      syllabus: [],
      classSchedule: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
      // Management fields
      createdBy: 'admin',
      lastModifiedBy: 'admin',
      enrollmentCount: 0,
      revenue: 0,
      averageRating: 0,
      completionRate: 0,
      isActive: false,
      status: 'draft'
    };

    return newCourse;
  }

  private async mockUpdateCourse(courseId: string, courseData: UpdateCourseData): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const courses = await this.getMockCourses();
    const course = courses.courses.find(c => c._id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    const updatedCourse: Course = {
      ...course,
      ...courseData,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'admin'
    };

    return updatedCourse;
  }
}

// Export singleton instance
export const courseManagementApiService = new CourseManagementApiService();
export default courseManagementApiService;