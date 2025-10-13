// Course API Service
export interface CourseFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
}

export interface CourseSyllabus {
  _id: string;
  module: string;
  topics: string[];
  duration: string;
}

export interface ClassSchedule {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: CourseLesson[];
  isCompleted?: boolean;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  isCompleted?: boolean;
  isFree?: boolean;
}

export interface CourseDetails {
  _id: string;
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
  syllabus: CourseSyllabus[];
  price: number;
  originalPrice: number;
  currency: string;
  duration: string;
  totalHours: number;
  totalLectures: number;
  language: string;
  isPublished: boolean;
  isFeatured: boolean;
  difficulty: number;
  rating: number;
  totalStudents: number;
  certificateProvided: boolean;
  hasProjects: boolean;
  hasAssignments: boolean;
  hasQuizzes: boolean;
  supportProvided: boolean;
  jobAssistance: boolean;
  thumbnailUrl: string;
  videoPreviewUrl: string;
  tags: string[];
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  courseStartDate: string;
  courseEndDate: string;
  maxStudents: number;
  minStudents: number;
  classSchedule: ClassSchedule[];
  mode: 'Online' | 'Offline' | 'Hybrid';
  createdAt: string;
  updatedAt: string;
  __v: number;
  progress?: number;
  isEnrolled?: boolean;
}

export interface CoursesResponse {
  data: CourseDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  search?: string;
  instructor?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'price' | 'rating' | 'enrolled' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

// Mock API Base URL (replace with actual API endpoint)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

class CourseApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request URL:', url);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Fetch all courses with filtering and pagination
  async getCourses(filters: CourseFilters = {}): Promise<CoursesResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    // For now, return mock data - replace with actual API call
    // const endpoint = `/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest('/courses/limited/6');
  }

  // Fetch single course by ID
  async getCourseById(courseId: string): Promise<CourseDetails> {
    // For now, return mock data - replace with actual API call
    // const endpoint = `/courses/${courseId}`;
    return this.getMockCourseById(courseId);
  }

  // Enroll in a course
  async enrollInCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    // const endpoint = `/courses/${courseId}/enroll`;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use courseId in simulation
    console.log(`Enrolling in course: ${courseId}`);
    
    return {
      success: true,
      message: 'Successfully enrolled in course'
    };
  }

  // Get enrolled courses for current user
  async getEnrolledCourses(): Promise<CourseDetails[]> {
    // For now, return mock data - replace with actual API call
    // const endpoint = '/courses/enrolled';
    return this.getMockEnrolledCourses();
  }

  // Update course progress
  async updateProgress(courseId: string, lessonId: string, progress: number): Promise<{ success: boolean }> {
    const endpoint = `/courses/${courseId}/progress`;
    
    await this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ lessonId, progress }),
    });

    return { success: true };
  }

  // Get course categories
  async getCategories(): Promise<string[]> {
    // Return mock categories
    // const endpoint = '/courses/categories';
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

  // Mock data methods (replace these with actual API calls)
  private async getMockCourses(filters: CourseFilters): Promise<CoursesResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const allCourses: CourseDetails[] = [
      {
        _id: '1',
        title: 'Full Stack Web Development with React & Node.js',
        description: 'Master modern web development with this comprehensive course covering React, Node.js, Express, MongoDB, and deployment strategies.',
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
        totalStudents: 8950,
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
        __v: 0
      },
      {
        _id: '2',
        title: 'Data Science & Machine Learning with Python',
        description: 'Complete data science course covering Python, pandas, NumPy, scikit-learn, and deep learning with TensorFlow.',
        shortDescription: 'Master data analysis, visualization, and machine learning',
        instructor: 'Dr. Rajesh Kumar',
        instructorBio: 'PhD in Computer Science, AI Research Scientist',
        category: 'Data Science',
        subCategory: 'Machine Learning',
        level: 'Intermediate',
        technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow'],
        prerequisites: ['Basic Python', 'Mathematics (Statistics)'],
        learningOutcomes: [
          'Data manipulation with pandas',
          'Data visualization',
          'Machine learning algorithms',
          'Deep learning with TensorFlow',
          'Statistical analysis',
          'Model deployment'
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
        totalStudents: 5670,
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
        __v: 0
      }
    ];

    // Apply filters
    let filteredCourses = allCourses;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.category === filters.category
      );
    }

    if (filters.level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level === filters.level
      );
    }

    if (filters.priceMin !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price >= filters.priceMin!
      );
    }

    if (filters.priceMax !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.price <= filters.priceMax!
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredCourses.sort((a, b) => {
        let aVal: string | number, bVal: string | number;
        
        switch (filters.sortBy) {
          case 'title':
            aVal = a.title;
            bVal = b.title;
            break;
          case 'price':
            aVal = a.price;
            bVal = b.price;
            break;
          case 'rating':
            aVal = a.rating;
            bVal = b.rating;
            break;
          case 'enrolled':
            aVal = a.totalStudents;
            bVal = b.totalStudents;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return {
      data: paginatedCourses,
      total: filteredCourses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCourses.length / limit)
    };
  }

  private async getMockCourseById(courseId: string): Promise<CourseDetails> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const courses = await this.getMockCourses({});
    const course = courses.data.find(c => c._id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return course;
  }

  private async getMockEnrolledCourses(): Promise<CourseDetails[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const allCourses = await this.getMockCourses({});
    return allCourses.data.slice(0, 2).map(course => ({
      ...course,
      isEnrolled: true,
      progress: Math.floor(Math.random() * 100)
    }));
  }
}

// Export singleton instance
export const courseApiService = new CourseApiService();
export default courseApiService;