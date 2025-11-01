// Class Management API Service
// This service handles all API operations for class scheduling and management
//
// ENROLLMENT INFORMATION:
// The API response now includes enrolled student information in the format:
// "enrolledStudents": [
//   {
//     "_id": "enrollment_id",
//     "studentId": {
//       "_id": "student_id",
//       "firstName": "Student",
//       "lastName": "Name", 
//       "email": "student@email.com"
//     },
//     "enrollmentDate": "2025-11-01T11:59:16.891Z",
//     "status": "enrolled"
//   }
// ]
//
// Usage example:
// const classData = await classManagementApiService.getClassById('class_id');
// const enrolledCount = classData.currentEnrollments;
// const studentNames = classData.enrolledStudents?.map(enrollment => 
//   ClassManagementApiService.getStudentDisplayName(enrollment)
// );

import { store } from '../store';
import type { RootState } from '../store';


export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;  
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
}

export interface EnrolledStudent {
  _id: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  enrollmentDate: string;
  status: 'enrolled' | 'waitlist' | 'cancelled' | 'completed';
}

export interface ClassManagement {
  _id: string;
  courseId?: string;
  courseName?: string; // Populated field
  instructorId: string;
  instructorName?: string; // Populated field
  className: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: Address;
  capacity: number;
  maxEnrollments: number;
  currentEnrollments?: number; // For display purposes
  enrolledStudents?: EnrolledStudent[]; // API enrollment information
  attendance?: ApiAttendanceRecord[]; // API attendance data
  materials?: ApiMaterial[]; // API materials data
  assignments?: ApiAssignment[]; // API assignments data
  announcements?: ApiAnnouncement[]; // API announcements data
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  objectives: string[];
  prerequisites: string[];
  requiredMaterials: string[];
  classPrice: number;
  currency: string;
  tags: string[];
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFilters {
  search?: string;
  courseId?: string;
  instructorId?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  venue?: string;
  priceRange?: string;
}

export interface CreateClassRequest {
  courseId: string;
  instructorId: string;
  className: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: Address;
  capacity: number;
  maxEnrollments: number;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  objectives: string[];
  prerequisites: string[];
  requiredMaterials: string[];
  classPrice: number;
  currency: string;
  tags: string[];
  createdBy: string;
}

export interface UpdateClassRequest extends Partial<CreateClassRequest> {
  _id: string;
}

export interface ClassesResponse {
  classes: ClassManagement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface InstructorUser {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export interface ApiClassResponse {
  _id?: string;
  id?: string;
  courseId?: string;
  courseName?: string;
  course?: { title?: string };
  instructorId?: string;
  instructorName?: string;
  instructor?: { name?: string };
  className?: string;
  description?: string;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  address?: Address;
  capacity?: number;
  maxEnrollments?: number;
  currentEnrollments?: number;
  enrolledStudents?: EnrolledStudent[];
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  objectives?: string[];
  prerequisites?: string[];
  requiredMaterials?: string[];
  classPrice?: number;
  currency?: string;
  tags?: string[];
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // New embedded data from API response
  attendance?: ApiAttendanceRecord[];
  materials?: ApiMaterial[];
  assignments?: ApiAssignment[];
  announcements?: ApiAnnouncement[];
}

// API Response Interfaces for embedded data
export interface ApiAttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

export interface ApiMaterial {
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  isRequired: boolean;
}

export interface ApiAssignment {
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  submittedStudents: string[];
}

export interface ApiAnnouncement {
  message: string;
  createdAt: string;
  isUrgent: boolean;
  readBy: string[];
}

// Mock data for development - replace with actual API calls
const mockClasses: ClassManagement[] = [
  {
    _id: '507f1f77bcf86cd799439020',
    courseId: '68ea3dfe0c5167bd4aaec917',
    courseName: 'JavaScript Fundamentals',
    instructorId: '507f1f77bcf86cd799439012',
    instructorName: 'Priya Sharma',
    className: 'JavaScript Fundamentals - Session 1',
    description: 'Introduction to JavaScript basics and syntax',
    scheduledDate: '2025-11-15',
    startTime: '09:00',
    endTime: '12:00',
    venue: 'Classroom A',
    address: {
      street: '123 Tech Street',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560001'
    },
    capacity: 30,
    maxEnrollments: 25,
    currentEnrollments: 18,
    enrolledStudents: [
      {
        _id: '6905f614ff7ba823c161eede',
        studentId: {
          _id: '68f4a9e6f9348402db1e8db1',
          firstName: 'Sumitra',
          lastName: 'Devi',
          email: 'sumitra05465@gmail.com'
        },
        enrollmentDate: '2025-11-01T11:59:16.891Z',
        status: 'enrolled'
      },
      {
        _id: '6905f614ff7ba823c161eedf',
        studentId: {
          _id: '68f4a9e6f9348402db1e8db2',
          firstName: 'Arjun',
          lastName: 'Patel',
          email: 'arjun.patel@email.com'
        },
        enrollmentDate: '2025-10-28T10:30:00.000Z',
        status: 'enrolled'
      }
    ],
    isRecurring: false,
    objectives: [
      'Understand JavaScript syntax',
      'Learn variables and data types',
      'Master basic programming concepts'
    ],
    prerequisites: [
      'Basic HTML knowledge',
      'Computer literacy'
    ],
    requiredMaterials: [
      'Laptop',
      'Notebook',
      'Pen'
    ],
    classPrice: 500,
    currency: 'INR',
    tags: ['javascript', 'programming', 'beginner'],
    status: 'scheduled',
    createdBy: '507f1f77bcf86cd799439013',
    createdAt: '2024-10-15T10:30:00Z',
    updatedAt: '2024-10-15T10:30:00Z'
  },
  {
    _id: '507f1f77bcf86cd799439021',
    courseId: '68ea3dfe0c5167bd4aaec917',
    courseName: 'JavaScript Fundamentals',
    instructorId: '507f1f77bcf86cd799439012',
    instructorName: 'Priya Sharma',
    className: 'JavaScript Fundamentals - Session 2',
    description: 'Advanced JavaScript concepts and DOM manipulation',
    scheduledDate: '2025-11-22',
    startTime: '09:00',
    endTime: '12:00',
    venue: 'Classroom A',
    address: {
      street: '123 Tech Street',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560001'
    },
    capacity: 30,
    maxEnrollments: 25,
    currentEnrollments: 22,
    enrolledStudents: [
      {
        _id: '6905f614ff7ba823c161eee0',
        studentId: {
          _id: '68f4a9e6f9348402db1e8db3',
          firstName: 'Priya',
          lastName: 'Sharma',
          email: 'priya.sharma@email.com'
        },
        enrollmentDate: '2025-10-25T14:00:00.000Z',
        status: 'enrolled'
      }
    ],
    isRecurring: true,
    recurringPattern: {
      type: 'weekly',
      interval: 1,
      endDate: '2025-12-31T23:59:59Z',
      daysOfWeek: [5] // Friday
    },
    objectives: [
      'Master DOM manipulation',
      'Understand event handling',
      'Learn asynchronous programming'
    ],
    prerequisites: [
      'JavaScript Fundamentals - Session 1',
      'Basic programming knowledge'
    ],
    requiredMaterials: [
      'Laptop',
      'Code editor installed',
      'Browser developer tools'
    ],
    classPrice: 750,
    currency: 'INR',
    tags: ['javascript', 'dom', 'intermediate'],
    status: 'scheduled',
    createdBy: '507f1f77bcf86cd799439013',
    createdAt: '2024-10-15T11:00:00Z',
    updatedAt: '2024-10-15T11:00:00Z'
  },
  {
    _id: '507f1f77bcf86cd799439022',
    courseId: '507f1f77bcf86cd799439014',
    courseName: 'React Development Bootcamp',
    instructorId: '507f1f77bcf86cd799439015',
    instructorName: 'Dr. Rajesh Kumar',
    className: 'React Hooks and State Management',
    description: 'Deep dive into React hooks and modern state management patterns',
    scheduledDate: '2025-11-20',
    startTime: '14:00',
    endTime: '17:00',
    venue: 'Lab B',
    address: {
      street: '456 Innovation Hub',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400001'
    },
    capacity: 20,
    maxEnrollments: 18,
    currentEnrollments: 15,
    enrolledStudents: [
      {
        _id: '6905f614ff7ba823c161eee1',
        studentId: {
          _id: '68f4a9e6f9348402db1e8db4',
          firstName: 'Rahul',
          lastName: 'Kumar',
          email: 'rahul.kumar@email.com'
        },
        enrollmentDate: '2025-10-20T09:15:00.000Z',
        status: 'enrolled'
      }
    ],
    isRecurring: false,
    objectives: [
      'Master React hooks usage',
      'Understand state management patterns',
      'Build complex React applications'
    ],
    prerequisites: [
      'JavaScript ES6+ knowledge',
      'Basic React understanding'
    ],
    requiredMaterials: [
      'Laptop with Node.js',
      'VS Code editor',
      'Git installed'
    ],
    classPrice: 1200,
    currency: 'INR',
    tags: ['react', 'hooks', 'advanced'],
    status: 'scheduled',
    createdBy: '507f1f77bcf86cd799439013',
    createdAt: '2024-10-15T12:00:00Z',
    updatedAt: '2024-10-15T12:00:00Z'
  }
];

// Mock enrollment data
const mockEnrollments: ClassEnrollment[] = [
  {
    _id: '507f1f77bcf86cd799430001',
    classId: '507f1f77bcf86cd799439020',
    studentId: '507f1f77bcf86cd799440001',
    studentName: 'Arjun Patel',
    studentEmail: 'arjun.patel@email.com',
    enrollmentDate: '2024-10-01',
    status: 'enrolled',
    paymentStatus: 'paid',
    paymentAmount: 500,
    paymentDate: '2024-10-01',
    attendanceCount: 4,
    totalSessions: 6,
    enrolledBy: '507f1f77bcf86cd799439013',
    createdAt: '2024-10-01T10:30:00Z',
    updatedAt: '2024-10-01T10:30:00Z'
  },
  {
    _id: '507f1f77bcf86cd799430002',
    classId: '507f1f77bcf86cd799439020',
    studentId: '507f1f77bcf86cd799440002',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@email.com',
    enrollmentDate: '2024-10-02',
    status: 'enrolled',
    paymentStatus: 'paid',
    paymentAmount: 500,
    paymentDate: '2024-10-02',
    attendanceCount: 5,
    totalSessions: 6,
    grade: 'A',
    enrolledBy: '507f1f77bcf86cd799439013',
    createdAt: '2024-10-02T11:00:00Z',
    updatedAt: '2024-10-15T14:30:00Z'
  }
];

// Mock material data
const mockMaterials: ClassMaterial[] = [
  {
    _id: '507f1f77bcf86cd799431001',
    classId: '507f1f77bcf86cd799439020',
    title: 'JavaScript Fundamentals - Session 1 Slides',
    description: 'Introduction to JavaScript syntax and basic concepts',
    type: 'document',
    fileUrl: '/materials/js-fundamentals-session1.pdf',
    fileName: 'js-fundamentals-session1.pdf',
    fileSize: 2048576, // 2MB
    downloadCount: 25,
    isRequired: true,
    availableFrom: '2024-11-10',
    uploadedBy: '507f1f77bcf86cd799439012',
    createdAt: '2024-10-10T09:00:00Z',
    updatedAt: '2024-10-10T09:00:00Z'
  },
  {
    _id: '507f1f77bcf86cd799431002',
    classId: '507f1f77bcf86cd799439020',
    title: 'Practice Exercises',
    description: 'Hands-on coding exercises for JavaScript basics',
    type: 'document',
    fileUrl: '/materials/js-exercises.zip',
    fileName: 'js-exercises.zip',
    fileSize: 1024000, // 1MB
    downloadCount: 18,
    isRequired: false,
    uploadedBy: '507f1f77bcf86cd799439012',
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: '2024-10-10T10:00:00Z'
  }
];

// Mock attendance data
const mockAttendance: AttendanceRecord[] = [
  {
    _id: '507f1f77bcf86cd799432001',
    classId: '507f1f77bcf86cd799439020',
    sessionDate: '2024-11-15',
    sessionNumber: 1,
    studentAttendance: [
      {
        studentId: '507f1f77bcf86cd799440001',
        studentName: 'Arjun Patel',
        status: 'present',
        checkInTime: '09:05'
      },
      {
        studentId: '507f1f77bcf86cd799440002',
        studentName: 'Priya Sharma',
        status: 'present',
        checkInTime: '09:00'
      },
      {
        studentId: '507f1f77bcf86cd799440003',
        studentName: 'Rahul Kumar',
        status: 'late',
        checkInTime: '09:20'
      }
    ],
    totalStudents: 18,
    presentCount: 16,
    absentCount: 1,
    lateCount: 1,
    notes: 'Good attendance for first session',
    markedBy: '507f1f77bcf86cd799439012',
    createdAt: '2024-11-15T12:00:00Z',
    updatedAt: '2024-11-15T12:00:00Z'
  }
];

// Mock assignment data
const mockAssignments: ClassAssignment[] = [
  {
    _id: '507f1f77bcf86cd799433001',
    classId: '507f1f77bcf86cd799439020',
    title: 'JavaScript Variables and Data Types',
    description: 'Create a simple program demonstrating JavaScript variables',
    instructions: 'Write a JavaScript program that demonstrates the use of different data types including strings, numbers, booleans, arrays, and objects. Include console.log statements to show the values.',
    type: 'individual',
    maxScore: 100,
    dueDate: '2024-11-25T23:59:59Z',
    submissionFormat: 'file',
    isRequired: true,
    allowLateSubmissions: true,
    latePenalty: 10,
    resources: ['JavaScript MDN Documentation', 'Course Slides'],
    submissions: [
      {
        _id: '507f1f77bcf86cd799434001',
        assignmentId: '507f1f77bcf86cd799433001',
        studentId: '507f1f77bcf86cd799440001',
        studentName: 'Arjun Patel',
        fileUrl: '/submissions/arjun-assignment1.js',
        fileName: 'variables-assignment.js',
        submittedAt: '2024-11-23T18:30:00Z',
        isLate: false,
        status: 'graded',
        score: 95,
        feedback: 'Excellent work! Good use of different data types and clear variable names.',
        gradedBy: '507f1f77bcf86cd799439012',
        gradedAt: '2024-11-24T10:00:00Z'
      }
    ],
    createdBy: '507f1f77bcf86cd799439012',
    createdAt: '2024-11-10T14:00:00Z',
    updatedAt: '2024-11-10T14:00:00Z'
  }
];

// Mock announcement data
const mockAnnouncements: ClassAnnouncement[] = [
  {
    _id: '507f1f77bcf86cd799435001',
    classId: '507f1f77bcf86cd799439020',
    title: 'Welcome to JavaScript Fundamentals',
    content: 'Welcome to our JavaScript Fundamentals course! Please make sure to bring your laptops and have a code editor installed. We recommend VS Code.',
    type: 'general',
    priority: 'high',
    targetAudience: 'all',
    isVisible: true,
    isPinned: true,
    attachments: [
      {
        fileName: 'course-syllabus.pdf',
        fileUrl: '/announcements/syllabus.pdf',
        fileSize: 512000,
        fileType: 'application/pdf'
      }
    ],
    readBy: ['507f1f77bcf86cd799440001', '507f1f77bcf86cd799440002'],
    createdBy: '507f1f77bcf86cd799439012',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z'
  },
  {
    _id: '507f1f77bcf86cd799435002',
    classId: '507f1f77bcf86cd799439020',
    title: 'Assignment 1 Due Reminder',
    content: 'Just a friendly reminder that Assignment 1 (JavaScript Variables and Data Types) is due on November 25th at 11:59 PM. Please submit your work through the class portal.',
    type: 'assignment',
    priority: 'medium',
    targetAudience: 'students',
    isVisible: true,
    isPinned: false,
    expiresAt: '2024-11-25T23:59:59Z',
    readBy: [],
    createdBy: '507f1f77bcf86cd799439012',
    createdAt: '2024-11-20T10:00:00Z',
    updatedAt: '2024-11-20T10:00:00Z'
  }
];

class ClassManagementApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper method to extract enrollment count from API response
  private getEnrollmentCount(cls: ApiClassResponse): number {
    if (cls.currentEnrollments !== undefined) {
      return cls.currentEnrollments;
    }
    if (cls.enrolledStudents && Array.isArray(cls.enrolledStudents)) {
      return cls.enrolledStudents.filter(student => student.status === 'enrolled').length;
    }
    return 0;
  }

  // Helper method to get student display name from enrollment
  static getStudentDisplayName(student: EnrolledStudent): string {
    const { firstName = '', lastName = '' } = student.studentId;
    return `${firstName} ${lastName}`.trim() || student.studentId.email || 'Unknown Student';
  }

  // Helper method to map file types
  private mapFileType(fileType: string): ClassMaterial['type'] {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('pdf') || lowerType.includes('doc')) return 'document';
    if (lowerType.includes('video') || lowerType.includes('mp4')) return 'video';
    if (lowerType.includes('audio') || lowerType.includes('mp3')) return 'audio';
    if (lowerType.includes('image') || lowerType.includes('png') || lowerType.includes('jpg')) return 'image';
    if (lowerType.includes('link') || lowerType.includes('url')) return 'link';
    return 'other';
  }

  // Helper method to get authentication headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Get token from Redux store
    const state = store.getState() as RootState;
    const token = state.auth.token;

    if (token) {
      console.log('Adding authentication token to request headers');
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No authentication token found in store');
    }

    return headers;
  }

  // Get all classes with optional filters
  async getClasses(filters?: ClassFilters, page = 1, limit = 10): Promise<ClassesResponse> {
    try {
      // Build query parameters for API
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.courseId) params.append('courseId', filters.courseId);
        if (filters.instructorId) params.append('instructorId', filters.instructorId);
        if (filters.status) params.append('status', filters.status);
        if (filters.venue) params.append('venue', filters.venue);
        if (filters.priceRange) params.append('priceRange', filters.priceRange);
        if (filters.dateRange) {
          params.append('startDate', filters.dateRange.start);
          params.append('endDate', filters.dateRange.end);
        }
      }

      const apiUrl = `http://localhost:5000/api/schedule-classes?${params.toString()}`;
      
      console.log('Making get classes API call:', {
        url: apiUrl,
        method: 'GET',
        filters,
        page,
        limit
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to fetch classes: ${errorMessage}`);
      }

      const apiResponse = await response.json();
      console.log('Get classes API response:', apiResponse);
      
      // Transform API response to match our expected format
      // The API might return the data directly or wrapped in a data property
      const classesData = apiResponse.data?.classes || apiResponse.classes || apiResponse.data || apiResponse;
      const classes: ApiClassResponse[] = Array.isArray(classesData) ? classesData : [];
      
      // Transform each class to ensure it matches our interface
      const transformedClasses: ClassManagement[] = classes.map((cls: ApiClassResponse) => ({
        _id: cls._id || cls.id || '',
        courseId: cls.courseId || '',
        courseName: cls.courseName || cls.course?.title,
        instructorId: cls.instructorId || '',
        instructorName: cls.instructorName || cls.instructor?.name,
        className: cls.className || '',
        description: cls.description || '',
        scheduledDate: cls.scheduledDate || '',
        startTime: cls.startTime || '',
        endTime: cls.endTime || '',
        venue: cls.venue || '',
        address: cls.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        capacity: cls.capacity || 0,
        maxEnrollments: cls.maxEnrollments || 0,
        currentEnrollments: this.getEnrollmentCount(cls),
        enrolledStudents: cls.enrolledStudents || [],
        isRecurring: cls.isRecurring || false,
        recurringPattern: cls.recurringPattern,
        objectives: cls.objectives || [],
        prerequisites: cls.prerequisites || [],
        requiredMaterials: cls.requiredMaterials || [],
        classPrice: cls.classPrice || 0,
        currency: cls.currency || 'INR',
        tags: cls.tags || [],
        status: (cls.status as ClassManagement['status']) || 'scheduled',
        createdBy: cls.createdBy || '',
        createdAt: cls.createdAt || new Date().toISOString(),
        updatedAt: cls.updatedAt || new Date().toISOString()
      }));

      // Update local mock data for consistency
      if (page === 1) {
        // Replace mock data with API data for first page
        mockClasses.splice(0, mockClasses.length, ...transformedClasses);
      }

      return {
        classes: transformedClasses,
        total: apiResponse.total || transformedClasses.length,
        page: apiResponse.page || page,
        limit: apiResponse.limit || limit,
        totalPages: apiResponse.totalPages || Math.ceil((apiResponse.total || transformedClasses.length) / limit)
      };
      
    } catch (error) {
      console.error('Error fetching classes:', error);
      
      // Handle network errors specifically - fallback to mock data
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Unable to connect to the class scheduling service. Using fallback data.');
        
        // Apply filters to mock data as fallback
        let filteredClasses = [...mockClasses];

        if (filters) {
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredClasses = filteredClasses.filter(cls =>
              cls.className.toLowerCase().includes(searchTerm) ||
              cls.courseName?.toLowerCase().includes(searchTerm) ||
              cls.instructorName?.toLowerCase().includes(searchTerm) ||
              cls.venue.toLowerCase().includes(searchTerm) ||
              cls.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
          }

          if (filters.courseId) {
            filteredClasses = filteredClasses.filter(cls => cls.courseId === filters.courseId);
          }

          if (filters.instructorId) {
            filteredClasses = filteredClasses.filter(cls => cls.instructorId === filters.instructorId);
          }

          if (filters.status) {
            filteredClasses = filteredClasses.filter(cls => cls.status === filters.status);
          }

          if (filters.venue) {
            filteredClasses = filteredClasses.filter(cls => 
              cls.venue.toLowerCase().includes(filters.venue!.toLowerCase())
            );
          }

          if (filters.dateRange) {
            filteredClasses = filteredClasses.filter(cls => {
              const classDate = new Date(cls.scheduledDate);
              const startDate = new Date(filters.dateRange!.start);
              const endDate = new Date(filters.dateRange!.end);
              return classDate >= startDate && classDate <= endDate;
            });
          }

          if (filters.priceRange) {
            filteredClasses = filteredClasses.filter(cls => {
              const price = cls.classPrice;
              switch (filters.priceRange) {
                case 'free': return price === 0;
                case 'under-500': return price > 0 && price < 500;
                case '500-1000': return price >= 500 && price < 1000;
                case 'over-1000': return price >= 1000;
                default: return true;
              }
            });
          }
        }

        // Calculate pagination for fallback
        const total = filteredClasses.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedClasses = filteredClasses.slice(startIndex, endIndex);

        return {
          classes: paginatedClasses,
          total,
          page,
          limit,
          totalPages
        };
      }
      
      throw error;
    }
  }

  // Get class by ID using API endpoint
  async getClassById(id: string): Promise<ClassManagement | null> {
    try {
      if (!id) {
        throw new Error('Class ID is required');
      }

      const apiUrl = `http://localhost:5000/api/schedule-classes/${id}`;
      
      console.log('Making get class by ID API call:', {
        url: apiUrl,
        method: 'GET'
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Class not found
          return null;
        }
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to fetch class: ${errorMessage}`);
      }

      const classResult = await response.json();
      console.log('Get class by ID API response:', classResult);
      
      // Transform the API response to match our ClassManagement interface
      const classData: ClassManagement = {
        _id: classResult._id || classResult.id || id,
        courseId: classResult.courseId || '',
        courseName: classResult.courseName || classResult.course?.title,
        instructorId: classResult.instructorId || '',
        instructorName: classResult.instructorName || classResult.instructor?.name,
        className: classResult.className || '',
        description: classResult.description || '',
        scheduledDate: classResult.scheduledDate || '',
        startTime: classResult.startTime || '',
        endTime: classResult.endTime || '',
        venue: classResult.venue || '',
        address: classResult.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        capacity: classResult.capacity || 0,
        maxEnrollments: classResult.maxEnrollments || 0,
        currentEnrollments: this.getEnrollmentCount(classResult),
        enrolledStudents: classResult.enrolledStudents || [],
        isRecurring: classResult.isRecurring || false,
        recurringPattern: classResult.recurringPattern,
        objectives: classResult.objectives || [],
        prerequisites: classResult.prerequisites || [],
        requiredMaterials: classResult.requiredMaterials || [],
        classPrice: classResult.classPrice || 0,
        currency: classResult.currency || 'INR',
        tags: classResult.tags || [],
        status: (classResult.status as ClassManagement['status']) || 'scheduled',
        createdBy: classResult.createdBy || '',
        createdAt: classResult.createdAt || new Date().toISOString(),
        updatedAt: classResult.updatedAt || new Date().toISOString()
      };
      
      // Attach embedded data directly to the ClassManagement interface properties
      classData.materials = classResult.materials || [];
      classData.attendance = classResult.attendance || [];
      classData.assignments = classResult.assignments || [];
      classData.announcements = classResult.announcements || [];
      
      console.log('Class data with embedded information:', {
        classId: classData._id,
        className: classData.className,
        embeddedDataCounts: {
          materials: classData.materials?.length || 0,
          attendance: classData.attendance?.length || 0,
          assignments: classData.assignments?.length || 0,
          announcements: classData.announcements?.length || 0
        }
      });
      
      return classData;
      
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      
      // Handle network errors specifically - fallback to mock data
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Unable to connect to the class scheduling service. Using fallback data.');
        return mockClasses.find(cls => cls._id === id) || null;
      }
      
      throw error;
    }
  }

  // Create new class using API endpoint
  async createClass(classData: CreateClassRequest): Promise<ClassManagement> {
    try {
      const apiUrl = 'http://localhost:5000/api/schedule-classes';
      
      // Transform our request format to match the API expected format
      const requestBody = {
        courseId: classData.courseId,
        instructorId: classData.instructorId,
        className: classData.className,
        description: classData.description,
        scheduledDate: classData.scheduledDate,
        startTime: classData.startTime,
        endTime: classData.endTime,
        venue: classData.venue,
        address: classData.address,
        capacity: classData.capacity,
        maxEnrollments: classData.maxEnrollments,
        isRecurring: classData.isRecurring,
        recurringPattern: classData.recurringPattern,
        objectives: classData.objectives,
        prerequisites: classData.prerequisites,
        requiredMaterials: classData.requiredMaterials,
        classPrice: classData.classPrice,
        currency: classData.currency,
        tags: classData.tags,
        createdBy: classData.createdBy
      };

      console.log('Making create class API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to create class: ${errorMessage}`);
      }

      const classResult = await response.json();
      console.log('Create class API response:', classResult);
      
      // Transform the API response to match our ClassManagement interface
      const newClass: ClassManagement = {
        _id: classResult._id || classResult.id || `class_${Date.now()}`,
        courseId: classResult.courseId || classData.courseId,
        courseName: classResult.courseName || classResult.course?.title,
        instructorId: classResult.instructorId || classData.instructorId,
        instructorName: classResult.instructorName || classResult.instructor?.name,
        className: classResult.className || classData.className,
        description: classResult.description || classData.description,
        scheduledDate: classResult.scheduledDate || classData.scheduledDate,
        startTime: classResult.startTime || classData.startTime,
        endTime: classResult.endTime || classData.endTime,
        venue: classResult.venue || classData.venue,
        address: classResult.address || classData.address,
        capacity: classResult.capacity || classData.capacity,
        maxEnrollments: classResult.maxEnrollments || classData.maxEnrollments,
        currentEnrollments: this.getEnrollmentCount(classResult),
        enrolledStudents: classResult.enrolledStudents || [],
        isRecurring: classResult.isRecurring || classData.isRecurring,
        recurringPattern: classResult.recurringPattern || classData.recurringPattern,
        objectives: classResult.objectives || classData.objectives,
        prerequisites: classResult.prerequisites || classData.prerequisites,
        requiredMaterials: classResult.requiredMaterials || classData.requiredMaterials,
        classPrice: classResult.classPrice || classData.classPrice,
        currency: classResult.currency || classData.currency,
        tags: classResult.tags || classData.tags,
        status: classResult.status || 'scheduled',
        createdBy: classResult.createdBy || classData.createdBy,
        createdAt: classResult.createdAt || new Date().toISOString(),
        updatedAt: classResult.updatedAt || new Date().toISOString()
      };

      // Also update local mock data for consistency
      mockClasses.unshift(newClass);
      
      return newClass;
      
    } catch (error) {
      console.error('Error creating class:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the class scheduling service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  }

  // Update existing class using API endpoint
  async updateClass(classData: UpdateClassRequest): Promise<ClassManagement> {
    try {
      if (!classData._id) {
        throw new Error('Class ID is required for update');
      }

      const apiUrl = `http://localhost:5000/api/schedule-classes/${classData._id}`;
      
      // Transform our request format to match the API expected format
      // Remove _id from the request body as it's in the URL
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...requestBody } = classData;
      
      console.log('Making update class API call:', {
        url: apiUrl,
        method: 'PUT',
        body: requestBody
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to update class: ${errorMessage}`);
      }

      const classResult = await response.json();
      console.log('Update class API response:', classResult);
      
      // Transform the API response to match our ClassManagement interface
      const updatedClass: ClassManagement = {
        _id: classResult._id || classResult.id || classData._id,
        courseId: classResult.courseId || classData.courseId || '',
        courseName: classResult.courseName || classResult.course?.title,
        instructorId: classResult.instructorId || classData.instructorId || '',
        instructorName: classResult.instructorName || classResult.instructor?.name,
        className: classResult.className || classData.className || '',
        description: classResult.description || classData.description || '',
        scheduledDate: classResult.scheduledDate || classData.scheduledDate || '',
        startTime: classResult.startTime || classData.startTime || '',
        endTime: classResult.endTime || classData.endTime || '',
        venue: classResult.venue || classData.venue || '',
        address: classResult.address || classData.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        },
        capacity: classResult.capacity || classData.capacity || 0,
        maxEnrollments: classResult.maxEnrollments || classData.maxEnrollments || 0,
        currentEnrollments: this.getEnrollmentCount(classResult),
        enrolledStudents: classResult.enrolledStudents || [],
        isRecurring: classResult.isRecurring !== undefined ? classResult.isRecurring : (classData.isRecurring || false),
        recurringPattern: classResult.recurringPattern || classData.recurringPattern,
        objectives: classResult.objectives || classData.objectives || [],
        prerequisites: classResult.prerequisites || classData.prerequisites || [],
        requiredMaterials: classResult.requiredMaterials || classData.requiredMaterials || [],
        classPrice: classResult.classPrice || classData.classPrice || 0,
        currency: classResult.currency || classData.currency || 'INR',
        tags: classResult.tags || classData.tags || [],
        status: (classResult.status as ClassManagement['status']) || 'scheduled',
        createdBy: classResult.createdBy || classData.createdBy || '',
        createdAt: classResult.createdAt || new Date().toISOString(),
        updatedAt: classResult.updatedAt || new Date().toISOString()
      };

      // Also update local mock data for consistency
      const index = mockClasses.findIndex(cls => cls._id === classData._id);
      if (index !== -1) {
        mockClasses[index] = updatedClass;
      }
      
      return updatedClass;
      
    } catch (error) {
      console.error('Error updating class:', error);
      
      // Handle network errors specifically - fallback to mock data update
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Unable to connect to the class scheduling service. Using fallback update.');
        
        const index = mockClasses.findIndex(cls => cls._id === classData._id);
        if (index === -1) {
          throw new Error('Class not found');
        }

        const updatedClass: ClassManagement = {
          ...mockClasses[index],
          ...classData,
          updatedAt: new Date().toISOString()
        };

        mockClasses[index] = updatedClass;
        return updatedClass;
      }
      
      throw error;
    }
  }

  // Delete class using API endpoint
  async deleteClass(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Class ID is required for deletion');
      }

      const apiUrl = `http://localhost:5000/api/schedule-classes/${id}`;
      
      console.log('Making delete class API call:', {
        url: apiUrl,
        method: 'DELETE'
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to delete class: ${errorMessage}`);
      }

      console.log('Delete class API response: Success');
      
      // Also remove from local mock data for consistency
      const index = mockClasses.findIndex(cls => cls._id === id);
      if (index !== -1) {
        mockClasses.splice(index, 1);
      }
      
    } catch (error) {
      console.error('Error deleting class:', error);
      
      // Handle network errors specifically - fallback to mock data deletion
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Unable to connect to the class scheduling service. Using fallback deletion.');
        
        const index = mockClasses.findIndex(cls => cls._id === id);
        if (index === -1) {
          throw new Error('Class not found');
        }

        mockClasses.splice(index, 1);
        return;
      }
      
      throw error;
    }
  }

  // Get available courses for dropdown
  async getCourses(): Promise<Array<{ _id: string; title: string }>> {
    await this.delay(200);
    return [
      { _id: '68ea3dfe0c5167bd4aaec917', title: 'JavaScript Fundamentals' },
      { _id: '507f1f77bcf86cd799439014', title: 'React Development Bootcamp' },
      { _id: '507f1f77bcf86cd799439016', title: 'Node.js Backend Development' },
      { _id: '507f1f77bcf86cd799439017', title: 'Python Data Science' },
      { _id: '507f1f77bcf86cd799439018', title: 'Machine Learning Basics' }
    ];
  }

  // Get available instructors from API endpoint
  async getInstructors(): Promise<Array<{ _id: string; name: string }>> {
    try {
      const apiUrl = 'http://localhost:5000/api/users?role=trainer&isActive=true';
      
      console.log('Making instructors API call:', {
        url: apiUrl,
        method: 'GET'
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to fetch instructors: ${errorMessage}`);
      }
      const trainersInfo = await response.json();
      const instructorsData: InstructorUser[] = trainersInfo.data;
      console.log('Instructors API response:', instructorsData);
      
      // Transform the API response to match our expected format
      // Assuming the API returns an array of user objects with _id and name properties
      // or it might have firstName/lastName that need to be combined
      const instructors = instructorsData.map((instructor: InstructorUser) => ({
        _id: instructor._id || instructor.id || '',
        name: instructor.name || `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || instructor.username || 'Unknown Instructor'
      }));

      return instructors;
      
    } catch (error) {
      console.error('Error fetching instructors:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Unable to connect to the instructors service. Using fallback data.');
        // Fallback to mock data if API is not available
        return [
          { _id: '507f1f77bcf86cd799439012', name: 'Priya Sharma' },
          { _id: '507f1f77bcf86cd799439015', name: 'Dr. Rajesh Kumar' },
          { _id: '507f1f77bcf86cd799439019', name: 'Sarah Johnson' },
          { _id: '507f1f77bcf86cd799439020', name: 'Alex Chen' },
          { _id: '507f1f77bcf86cd799439021', name: 'Michael Brown' }
        ];
      }
      
      throw error;
    }
  }

  // ===============================
  // ENROLLMENT MANAGEMENT METHODS
  // ===============================

  async getClassEnrollments(classId: string): Promise<ClassEnrollment[]> {
    await this.delay(300);
    return mockEnrollments.filter(enrollment => enrollment.classId === classId);
  }

  async enrollStudent(enrollmentData: CreateEnrollmentRequest): Promise<ClassEnrollment> {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${enrollmentData.classId}/enroll`;
      const requestBody = {
        studentId: enrollmentData.studentId,
        status: 'enrolled'
      };

      console.log('Making enrollment API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to enroll student: ${errorMessage}`);
      }

      const enrollmentResult = await response.json();
      console.log('Enrollment API response:', enrollmentResult);
      
      // Transform the API response to match our ClassEnrollment interface
      const newEnrollment: ClassEnrollment = {
        _id: enrollmentResult._id || enrollmentResult.id || `enrollment_${Date.now()}`,
        classId: enrollmentData.classId,
        studentId: enrollmentData.studentId,
        studentName: enrollmentResult.studentName || 'New Student',
        studentEmail: enrollmentResult.studentEmail || 'student@email.com',
        enrollmentDate: enrollmentResult.enrollmentDate || new Date().toISOString().split('T')[0],
        status: enrollmentResult.status || 'enrolled',
        paymentStatus: enrollmentResult.paymentStatus || 'pending',
        paymentDate: enrollmentResult.paymentDate,
        attendanceCount: enrollmentResult.attendanceCount || 0,
        totalSessions: enrollmentResult.totalSessions || 0,
        paymentAmount: enrollmentData.paymentAmount || 0,
        enrolledBy: enrollmentData.enrolledBy || 'system',
        createdAt: enrollmentResult.createdAt || new Date().toISOString(),
        updatedAt: enrollmentResult.updatedAt || new Date().toISOString()
      };

      // Also update local mock data for consistency
      mockEnrollments.push(newEnrollment);
      
      return newEnrollment;
    } catch (error) {
      console.error('Error enrolling student:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the enrollment service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  }

  async updateEnrollmentStatus(enrollmentId: string, status: ClassEnrollment['status']): Promise<ClassEnrollment> {
    await this.delay(400);
    
    const enrollment = mockEnrollments.find(e => e._id === enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found');
    
    enrollment.status = status;
    enrollment.updatedAt = new Date().toISOString();
    return enrollment;
  }

  async removeEnrollment(enrollmentId: string): Promise<void> {
    await this.delay(400);
    const index = mockEnrollments.findIndex(e => e._id === enrollmentId);
    if (index === -1) throw new Error('Enrollment not found');
    mockEnrollments.splice(index, 1);
  }

  // ===============================
  // MATERIAL MANAGEMENT METHODS
  // ===============================

  async getClassMaterials(classId: string): Promise<ClassMaterial[]> {
    try {
      // Fetch class data which includes embedded materials
      const classData = await this.getClassById(classId);
      if (!classData) {
        console.warn(`Class with ID ${classId} not found`);
        return mockMaterials.filter(material => material.classId === classId);
      }

      // Check if the API response includes embedded materials
      if (classData.materials && Array.isArray(classData.materials)) {
        // Transform API materials to ClassMaterial format
        const transformedMaterials: ClassMaterial[] = classData.materials.map((material, index) => ({
          _id: `material_${Date.now()}_${index}`,
          classId,
          title: material.title,
          description: material.description,
          type: this.mapFileType(material.fileType),
          fileUrl: material.fileUrl,
          fileName: material.title,
          downloadCount: 0,
          isRequired: material.isRequired,
          uploadedBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        return transformedMaterials;
      }

      // Fallback to mock data if no embedded materials
      await this.delay(300);
      return mockMaterials.filter(material => material.classId === classId);
    } catch (error) {
      console.error('Error fetching class materials:', error);
      // Fallback to mock data on error
      await this.delay(300);
      return mockMaterials.filter(material => material.classId === classId);
    }
  }

  async uploadMaterial(materialData: CreateMaterialRequest): Promise<ClassMaterial> {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${materialData.classId}/materials`;
      const requestBody = {
        title: materialData.title,
        description: materialData.description,
        fileUrl: materialData.fileUrl || '',
        fileType: materialData.type || 'document',
        isRequired: materialData.isRequired || false
      };

      console.log('Making materials API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to upload material: ${errorMessage}`);
      }

      const materialResult = await response.json();
      console.log('Material API response:', materialResult);
      
      // Transform the API response to match our ClassMaterial interface
      const newMaterial: ClassMaterial = {
        _id: materialResult._id || materialResult.id || `material_${Date.now()}`,
        classId: materialData.classId,
        title: materialResult.title || materialData.title,
        description: materialResult.description || materialData.description,
        type: materialResult.fileType || materialData.type || 'document',
        fileUrl: materialResult.fileUrl || materialData.fileUrl,
        fileName: materialResult.fileName || materialData.fileName,
        fileSize: materialResult.fileSize || materialData.fileSize,
        downloadCount: materialResult.downloadCount || 0,
        isRequired: materialResult.isRequired || materialData.isRequired || false,
        availableFrom: materialResult.availableFrom || materialData.availableFrom,
        availableUntil: materialResult.availableUntil || materialData.availableUntil,
        uploadedBy: materialResult.uploadedBy || materialData.uploadedBy || 'admin',
        createdAt: materialResult.createdAt || new Date().toISOString(),
        updatedAt: materialResult.updatedAt || new Date().toISOString()
      };

      // Also update local mock data for consistency
      mockMaterials.push(newMaterial);
      
      return newMaterial;
    } catch (error) {
      console.error('Error uploading material:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the materials service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  }

  async deleteMaterial(materialId: string): Promise<void> {
    await this.delay(400);
    const index = mockMaterials.findIndex(m => m._id === materialId);
    if (index === -1) throw new Error('Material not found');
    mockMaterials.splice(index, 1);
  }

  async downloadMaterial(materialId: string): Promise<void> {
    await this.delay(200);
    const material = mockMaterials.find(m => m._id === materialId);
    if (material) {
      material.downloadCount += 1;
    }
  }

  // ===============================
  // ATTENDANCE MANAGEMENT METHODS
  // ===============================

  async getClassAttendance(classId: string): Promise<AttendanceRecord[]> {
    try {
      // Fetch class data which includes embedded attendance
      const classData = await this.getClassById(classId);
      if (!classData) {
        console.warn(`Class with ID ${classId} not found`);
        return mockAttendance.filter(record => record.classId === classId);
      }

      // Check if the API response includes embedded attendance
      if (classData.attendance && Array.isArray(classData.attendance)) {
        const transformedAttendance = ApiResponseTransformer.transformAttendanceRecords(classData.attendance);
        // Set the correct classId for each record
        return transformedAttendance.map(record => ({ ...record, classId }));
      }

      // Fallback to mock data if no embedded attendance
      await this.delay(300);
      return mockAttendance.filter(record => record.classId === classId);
    } catch (error) {
      console.error('Error fetching class attendance:', error);
      // Fallback to mock data on error
      await this.delay(300);
      return mockAttendance.filter(record => record.classId === classId);
    }
  }

  async markAttendance(attendanceData: MarkAttendanceRequest): Promise<AttendanceRecord> {
    try {
      // Create the attendance record locally first
      const newRecord: AttendanceRecord = {
        _id: `507f1f77bcf86cd79943${Date.now().toString().slice(-4)}`,
        ...attendanceData,
        totalStudents: attendanceData.studentAttendance.length,
        presentCount: attendanceData.studentAttendance.filter(s => s.status === 'present').length,
        absentCount: attendanceData.studentAttendance.filter(s => s.status === 'absent').length,
        lateCount: attendanceData.studentAttendance.filter(s => s.status === 'late').length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update local mock data
      const existingIndex = mockAttendance.findIndex(
        record => record.classId === attendanceData.classId && 
                 record.sessionDate === attendanceData.sessionDate
      );

      if (existingIndex >= 0) {
        mockAttendance[existingIndex] = newRecord;
      } else {
        mockAttendance.push(newRecord);
      }

      // For each student, we could call the individual attendance API
      // Here's an example with the first student:
      if (attendanceData.studentAttendance.length > 0) {
        const firstStudent = attendanceData.studentAttendance[0];
        await this.markIndividualAttendance(attendanceData.classId, firstStudent);
      }

      return newRecord;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  async markIndividualAttendance(classId: string, studentAttendance: StudentAttendance): Promise<{_id: string; status: string; message: string}> {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${classId}/attendance`;
      const requestBody = {
        studentId: studentAttendance.studentId,
        status: studentAttendance.status,
        checkInTime: studentAttendance.checkInTime || new Date().toISOString(),
        checkOutTime: "2025-11-15T12:00:00Z",
        notes: studentAttendance.notes || `Attendance marked for ${studentAttendance.studentName}`
      };

      console.log('Making individual attendance API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to mark attendance: ${errorMessage}`);
      }

      const attendanceResult = await response.json();
      console.log('Individual attendance API response:', attendanceResult);
      
      return attendanceResult;
    } catch (error) {
      console.error('Error calling individual attendance API:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the attendance service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  }

  async getStudentAttendanceReport(classId: string, studentId: string): Promise<StudentAttendance[]> {
    await this.delay(400);
    const classRecords = mockAttendance.filter(record => record.classId === classId);
    return classRecords.flatMap(record => 
      record.studentAttendance.filter(attendance => attendance.studentId === studentId)
    );
  }

  // ===============================
  // ASSIGNMENT MANAGEMENT METHODS
  // ===============================

  async getClassAssignments(classId: string): Promise<ClassAssignment[]> {
    try {
      // Fetch class data which includes embedded assignments
      const classData = await this.getClassById(classId);
      if (!classData) {
        console.warn(`Class with ID ${classId} not found`);
        return mockAssignments.filter(assignment => assignment.classId === classId);
      }

      // Check if the API response includes embedded assignments
      if (classData.assignments && Array.isArray(classData.assignments)) {
        // Transform API assignments to ClassAssignment format
        const transformedAssignments: ClassAssignment[] = classData.assignments.map((assignment, index) => ({
          _id: `assignment_${Date.now()}_${index}`,
          classId,
          title: assignment.title,
          description: assignment.description,
          instructions: assignment.description,
          type: 'individual' as const,
          maxScore: 100,
          dueDate: assignment.dueDate,
          submissionFormat: 'text' as const,
          isRequired: true,
          allowLateSubmissions: false,
          submissions: [],
          createdBy: 'system',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        return transformedAssignments;
      }

      // Fallback to mock data if no embedded assignments
      await this.delay(300);
      return mockAssignments.filter(assignment => assignment.classId === classId);
    } catch (error) {
      console.error('Error fetching class assignments:', error);
      // Fallback to mock data on error
      await this.delay(300);
      return mockAssignments.filter(assignment => assignment.classId === classId);
    }
  }

  async createAssignment(assignmentData: CreateAssignmentRequest): Promise<ClassAssignment> {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${assignmentData.classId}/assignments`;
      const requestBody = {
        title: assignmentData.title,
        description: assignmentData.description,
        dueDate: assignmentData.dueDate
      };

      console.log('Making assignments API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to create assignment: ${errorMessage}`);
      }

      const assignmentResult = await response.json();
      console.log('Assignment API response:', assignmentResult);
      
      // Transform the API response to match our ClassAssignment interface
      const newAssignment: ClassAssignment = {
        _id: assignmentResult._id || assignmentResult.id || `assignment_${Date.now()}`,
        classId: assignmentData.classId,
        title: assignmentResult.title || assignmentData.title,
        description: assignmentResult.description || assignmentData.description,
        instructions: assignmentResult.instructions || assignmentData.instructions,
        type: assignmentResult.type || assignmentData.type,
        maxScore: assignmentResult.maxScore || assignmentData.maxScore,
        dueDate: assignmentResult.dueDate || assignmentData.dueDate,
        submissionFormat: assignmentResult.submissionFormat || assignmentData.submissionFormat,
        isRequired: assignmentResult.isRequired !== undefined ? assignmentResult.isRequired : assignmentData.isRequired,
        allowLateSubmissions: assignmentResult.allowLateSubmissions !== undefined ? assignmentResult.allowLateSubmissions : assignmentData.allowLateSubmissions,
        latePenalty: assignmentResult.latePenalty || assignmentData.latePenalty,
        resources: assignmentResult.resources || assignmentData.resources,
        submissions: assignmentResult.submissions || [],
        createdBy: assignmentResult.createdBy || assignmentData.createdBy,
        createdAt: assignmentResult.createdAt || new Date().toISOString(),
        updatedAt: assignmentResult.updatedAt || new Date().toISOString()
      };

      // Also update local mock data for consistency
      mockAssignments.push(newAssignment);
      
      return newAssignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the assignments service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  }

  async submitAssignment(submissionData: SubmitAssignmentRequest): Promise<AssignmentSubmission> {
    await this.delay(600);
    
    const assignment = mockAssignments.find(a => a._id === submissionData.assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const newSubmission: AssignmentSubmission = {
      _id: `507f1f77bcf86cd79943${Date.now().toString().slice(-4)}`,
      ...submissionData,
      studentName: 'Student Name', // Would be populated from student API
      submittedAt: new Date().toISOString(),
      isLate: new Date() > new Date(assignment.dueDate),
      status: 'submitted'
    };

    if (!assignment.submissions) assignment.submissions = [];
    assignment.submissions.push(newSubmission);
    
    return newSubmission;
  }

  async gradeAssignment(gradingData: GradeAssignmentRequest): Promise<AssignmentSubmission> {
    await this.delay(400);
    
    // Find the submission across all assignments
    let submission: AssignmentSubmission | undefined;

    for (const assign of mockAssignments) {
      if (assign.submissions) {
        submission = assign.submissions.find(s => s._id === gradingData.submissionId);
        if (submission) {
          break;
        }
      }
    }

    if (!submission) throw new Error('Submission not found');

    submission.score = gradingData.score;
    submission.feedback = gradingData.feedback;
    submission.gradedBy = gradingData.gradedBy;
    submission.gradedAt = new Date().toISOString();
    submission.status = 'graded';

    return submission;
  }

  // ===============================
  // ANNOUNCEMENT MANAGEMENT METHODS
  // ===============================

  async getClassAnnouncements(classId: string): Promise<ClassAnnouncement[]> {
    try {
      // Fetch class data which includes embedded announcements
      const classData = await this.getClassById(classId);
      if (!classData) {
        console.warn(`Class with ID ${classId} not found`);
        return mockAnnouncements.filter(announcement => announcement.classId === classId);
      }

      // Check if the API response includes embedded announcements
      if (classData.announcements && Array.isArray(classData.announcements)) {
        // Transform API announcements to ClassAnnouncement format
        const transformedAnnouncements: ClassAnnouncement[] = classData.announcements.map((announcement, index) => ({
          _id: `announcement_${Date.now()}_${index}`,
          classId,
          title: announcement.isUrgent ? 'Urgent Announcement' : 'Class Announcement',
          content: announcement.message,
          type: announcement.isUrgent ? 'urgent' as const : 'general' as const,
          priority: announcement.isUrgent ? 'high' as const : 'medium' as const,
          targetAudience: 'all' as const,
          isVisible: true,
          isPinned: announcement.isUrgent,
          readBy: announcement.readBy,
          createdBy: 'system',
          createdAt: announcement.createdAt,
          updatedAt: announcement.createdAt
        }));
        
        // Set the correct classId for each announcement and sort them
        return transformedAnnouncements
          .map(announcement => ({ ...announcement, classId }))
          .sort((a, b) => {
            // Sort by pinned first, then by creation date
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
      }

      // Fallback to mock data if no embedded announcements
      await this.delay(300);
      return mockAnnouncements
        .filter(announcement => announcement.classId === classId)
        .sort((a, b) => {
          // Sort by pinned first, then by creation date
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    } catch (error) {
      console.error('Error fetching class announcements:', error);
      // Fallback to mock data on error
      await this.delay(300);
      return mockAnnouncements.filter(announcement => announcement.classId === classId);
    }
  }

  async createAnnouncement(announcementData: CreateAnnouncementRequest): Promise<ClassAnnouncement> {
    try {
      const apiUrl = `http://localhost:5000/api/schedule-classes/${announcementData.classId}/announcements`;
      const requestBody = {
        message: announcementData.content,
        isUrgent: announcementData.priority === 'high'
      };

      console.log('Making announcements API call:', {
        url: apiUrl,
        method: 'POST',
        body: requestBody
      });

      // Call the real API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to create announcement: ${errorMessage}`);
      }

      const announcementResult = await response.json();
      console.log('Announcement API response:', announcementResult);
      
      // Transform the API response to match our ClassAnnouncement interface
      const newAnnouncement: ClassAnnouncement = {
        _id: announcementResult._id || announcementResult.id || `announcement_${Date.now()}`,
        classId: announcementData.classId,
        title: announcementResult.title || announcementData.title,
        content: announcementResult.message || announcementData.content,
        type: announcementResult.type || announcementData.type,
        priority: announcementResult.isUrgent ? 'high' : announcementData.priority,
        targetAudience: announcementResult.targetAudience || announcementData.targetAudience,
        isVisible: announcementResult.isVisible !== undefined ? announcementResult.isVisible : announcementData.isVisible,
        isPinned: announcementResult.isPinned !== undefined ? announcementResult.isPinned : announcementData.isPinned,
        scheduledFor: announcementResult.scheduledFor || announcementData.scheduledFor,
        expiresAt: announcementResult.expiresAt || announcementData.expiresAt,
        attachments: announcementResult.attachments || announcementData.attachments,
        readBy: announcementResult.readBy || [],
        createdBy: announcementResult.createdBy || announcementData.createdBy,
        createdAt: announcementResult.createdAt || new Date().toISOString(),
        updatedAt: announcementResult.updatedAt || new Date().toISOString()
      };

      // Also update local mock data for consistency
      mockAnnouncements.push(newAnnouncement);
      
      return newAnnouncement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the announcements service. Please ensure the server is running on localhost:5000');
      }
      
      throw error;
    }
  }

  async markAnnouncementAsRead(announcementId: string, userId: string): Promise<void> {
    await this.delay(200);
    
    const announcement = mockAnnouncements.find(a => a._id === announcementId);
    if (announcement && !announcement.readBy.includes(userId)) {
      announcement.readBy.push(userId);
    }
  }

  async deleteAnnouncement(announcementId: string): Promise<void> {
    await this.delay(400);
    const index = mockAnnouncements.findIndex(a => a._id === announcementId);
    if (index === -1) throw new Error('Announcement not found');
    mockAnnouncements.splice(index, 1);
  }

  async pinAnnouncement(announcementId: string, isPinned: boolean): Promise<ClassAnnouncement> {
    await this.delay(300);
    
    const announcement = mockAnnouncements.find(a => a._id === announcementId);
    if (!announcement) throw new Error('Announcement not found');
    
    announcement.isPinned = isPinned;
    announcement.updatedAt = new Date().toISOString();
    
    return announcement;
  }
}

// ===============================
// ENROLLMENT MANAGEMENT INTERFACES
// ===============================

export interface ClassEnrollment {
  _id: string;
  classId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  enrollmentDate: string;
  status: 'enrolled' | 'waitlist' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentAmount: number;
  paymentDate?: string;
  attendanceCount: number;
  totalSessions: number;
  grade?: string;
  feedback?: string;
  enrolledBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentRequest {
  classId: string;
  studentId: string;
  paymentAmount?: number;
  enrolledBy?: string;
}

// ===============================
// MATERIAL MANAGEMENT INTERFACES  
// ===============================

export interface ClassMaterial {
  _id: string;
  classId: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  downloadCount: number;
  isRequired: boolean;
  availableFrom?: string;
  availableUntil?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialRequest {
  classId: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRequired: boolean;
  availableFrom?: string;
  availableUntil?: string;
  uploadedBy: string;
}

// ===============================
// ATTENDANCE MANAGEMENT INTERFACES
// ===============================

export interface AttendanceRecord {
  _id: string;
  classId: string;
  sessionDate: string;
  sessionNumber: number;
  studentAttendance: StudentAttendance[];
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  notes?: string;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentAttendance {
  studentId: string;
  studentName?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  notes?: string;
}

export interface MarkAttendanceRequest {
  classId: string;
  sessionDate: string;
  sessionNumber: number;
  studentAttendance: StudentAttendance[];
  notes?: string;
  markedBy: string;
}

// ===============================
// ASSIGNMENT MANAGEMENT INTERFACES
// ===============================

export interface ClassAssignment {
  _id: string;
  classId: string;
  title: string;
  description: string;
  instructions: string;
  type: 'individual' | 'group' | 'project' | 'quiz' | 'exam';
  maxScore: number;
  dueDate: string;
  submissionFormat: 'text' | 'file' | 'link' | 'multiple';
  isRequired: boolean;
  allowLateSubmissions: boolean;
  latePenalty?: number;
  resources?: string[];
  submissions?: AssignmentSubmission[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  _id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  submissionText?: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  isLate: boolean;
  status: 'submitted' | 'graded' | 'returned';
  score?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface CreateAssignmentRequest {
  classId: string;
  title: string;
  description: string;
  instructions: string;
  type: 'individual' | 'group' | 'project' | 'quiz' | 'exam';
  maxScore: number;
  dueDate: string;
  submissionFormat: 'text' | 'file' | 'link' | 'multiple';
  isRequired: boolean;
  allowLateSubmissions: boolean;
  latePenalty?: number;
  resources?: string[];
  createdBy: string;
}

export interface SubmitAssignmentRequest {
  assignmentId: string;
  studentId: string;
  submissionText?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface GradeAssignmentRequest {
  submissionId: string;
  score: number;
  feedback?: string;
  gradedBy: string;
}

// ===============================
// ANNOUNCEMENT MANAGEMENT INTERFACES
// ===============================

export interface ClassAnnouncement {
  _id: string;
  classId: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'reminder' | 'cancellation' | 'assignment' | 'material';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'students' | 'instructors';
  isVisible: boolean;
  isPinned: boolean;
  scheduledFor?: string;
  expiresAt?: string;
  attachments?: AnnouncementAttachment[];
  readBy: string[]; // Array of user IDs who have read this
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementAttachment {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface CreateAnnouncementRequest {
  classId: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'reminder' | 'cancellation' | 'assignment' | 'material';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'students' | 'instructors';
  isVisible: boolean;
  isPinned: boolean;
  scheduledFor?: string;
  expiresAt?: string;
  attachments?: AnnouncementAttachment[];
  createdBy: string;
}

// ===============================
// API RESPONSE TRANSFORMATION HELPERS
// ===============================

// Helper functions to transform API response data to internal interfaces
export class ApiResponseTransformer {
  static transformAttendanceRecords(apiAttendance: ApiAttendanceRecord[] = []): AttendanceRecord[] {
    // Group attendance by session (for now, create one session)
    if (apiAttendance.length === 0) return [];
    
    const sessionAttendance: StudentAttendance[] = apiAttendance.map(record => ({
      studentId: record.studentId,
      status: record.status,
      checkInTime: record.checkInTime,
      notes: record.notes
    }));

    const presentCount = apiAttendance.filter(r => r.status === 'present').length;
    const absentCount = apiAttendance.filter(r => r.status === 'absent').length;
    const lateCount = apiAttendance.filter(r => r.status === 'late').length;

    return [{
      _id: `attendance_${Date.now()}`,
      classId: '',
      sessionDate: new Date().toISOString().split('T')[0],
      sessionNumber: 1,
      studentAttendance: sessionAttendance,
      totalStudents: apiAttendance.length,
      presentCount,
      absentCount,
      lateCount,
      markedBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  }

  static transformMaterials(apiMaterials: ApiMaterial[] = []): ClassMaterial[] {
    return apiMaterials.map((material, index) => ({
      _id: `material_${Date.now()}_${index}`,
      classId: '',
      title: material.title,
      description: material.description,
      type: this.mapFileType(material.fileType),
      fileUrl: material.fileUrl,
      fileName: material.title,
      downloadCount: 0,
      isRequired: material.isRequired,
      uploadedBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  static transformAssignments(apiAssignments: ApiAssignment[] = []): ClassAssignment[] {
    return apiAssignments.map((assignment, index) => ({
      _id: `assignment_${Date.now()}_${index}`,
      classId: '',
      title: assignment.title,
      description: assignment.description,
      instructions: assignment.description,
      type: 'individual' as const,
      maxScore: 100,
      dueDate: assignment.dueDate,
      submissionFormat: 'text' as const,
      isRequired: true,
      allowLateSubmissions: false,
      submissions: [],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  static transformAnnouncements(apiAnnouncements: ApiAnnouncement[] = []): ClassAnnouncement[] {
    return apiAnnouncements.map((announcement, index) => ({
      _id: `announcement_${Date.now()}_${index}`,
      classId: '',
      title: announcement.isUrgent ? 'Urgent Announcement' : 'Class Announcement',
      content: announcement.message,
      type: announcement.isUrgent ? 'urgent' as const : 'general' as const,
      priority: announcement.isUrgent ? 'high' as const : 'medium' as const,
      targetAudience: 'all' as const,
      isVisible: true,
      isPinned: announcement.isUrgent,
      readBy: announcement.readBy,
      createdBy: 'system',
      createdAt: announcement.createdAt,
      updatedAt: announcement.createdAt
    }));
  }

  private static mapFileType(fileType: string): ClassMaterial['type'] {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('pdf') || lowerType.includes('doc')) return 'document';
    if (lowerType.includes('video') || lowerType.includes('mp4')) return 'video';
    if (lowerType.includes('audio') || lowerType.includes('mp3')) return 'audio';
    if (lowerType.includes('image') || lowerType.includes('png') || lowerType.includes('jpg')) return 'image';
    if (lowerType.includes('link') || lowerType.includes('url')) return 'link';
    return 'other';
  }
}

// Export singleton instance
export const classManagementApiService = new ClassManagementApiService();