// Student Management API Service

// Mock API Base URL (replace with actual API endpoint)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// API Response interfaces
interface ApiUser {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  roleDisplay?: string;
  photo?: string;
  bio?: string;
  lastLogin?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  studentInfo?: {
    studentId: string;
    enrollmentDate: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  preferences?: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiUser[];
}

export interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  role?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  enrollmentDate: string;
  isActive: boolean;
  courses: {
    courseId: string;
    courseName: string;
    enrollmentDate: string;
    status: 'enrolled' | 'completed' | 'dropped';
    attendance: number;
    grade?: string;
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  totalFeesPaid: number;
  pendingFees: number;
  lastPaymentDate?: string;
  attendance: {
    totalClasses: number;
    attendedClasses: number;
    attendancePercentage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  status?: string; // Keep as 'status' for UI filtering (active/inactive/all)
  course?: string;
  gender?: string;
  city?: string;
  enrollmentYear?: string;
  search?: string;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  graduatedStudents: number;
  suspendedStudents: number;
  totalPendingFees: number;
  averageAttendance: number;
  newEnrollmentsThisMonth: number;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  role?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  courseIds?: string[];
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  isActive?: boolean;
}

export interface AttendanceRecord {
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface PaymentRecord {
  _id: string;
  amount: number;
  date: string;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface BulkOperationData {
  status?: 'active' | 'inactive' | 'suspended' | 'graduated';
  subject?: string;
  message?: string;
  date?: string;
  attendanceStatus?: 'present' | 'absent' | 'late';
  courseId?: string;
}

export interface BulkOperation {
  studentIds: string[];
  operation: 'updateStatus' | 'sendEmail' | 'markAttendance' | 'enrollCourse' | 'delete';
  data: BulkOperationData;
}

class StudentManagementApiService {
  private baseUrl = '/users';

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Student Management API Request URL:', url);
    
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
      console.error('Student Management API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Helper function to map API response to Student interface
  private mapApiUserToStudent(apiUser: ApiUser): Student {
    return {
      _id: apiUser._id || apiUser.id || '',
      studentId: apiUser.studentInfo?.studentId || `STU${Date.now()}`,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      email: apiUser.email,
      password: 'Demo@12345', // Default password for display
      phone: apiUser.phone,
      dateOfBirth: apiUser.dateOfBirth,
      gender: apiUser.gender === 'male' ? 'Male' : apiUser.gender === 'female' ? 'Female' : 'Other',
      role: apiUser.role,
      address: {
        street: apiUser.address?.street || '',
        city: apiUser.address?.city || '',
        state: apiUser.address?.state || '',
        country: apiUser.address?.country || 'India',
        zipCode: apiUser.address?.zipCode || ''
      },
      enrollmentDate: apiUser.studentInfo?.enrollmentDate || apiUser.createdAt,
      isActive: apiUser.isActive,
      courses: [], // Default empty array, can be populated if course data is available
      emergencyContact: {
        name: apiUser.emergencyContact?.name || '',
        relationship: apiUser.emergencyContact?.relationship || '',
        phone: apiUser.emergencyContact?.phone || '',
        email: apiUser.emergencyContact?.email || ''
      },
      totalFeesPaid: 0, // Default values
      pendingFees: 0,
      lastPaymentDate: '',
      attendance: {
        totalClasses: 0,
        attendedClasses: 0,
        attendancePercentage: 0
      },
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.updatedAt
    };
  }

  // Get all students with filtering and pagination
  async getStudents(): Promise<{
    students: Student[];
  }> {
    try {
      const params = new URLSearchParams({
        role: 'student', // Always filter for students only 
      });

      console.log('Fetching students from:', `${API_BASE_URL}${this.baseUrl}?${params.toString()}`);

      const result = await this.makeRequest<ApiResponse>(`${this.baseUrl}?role=student`);
      
      // Log successful response for debugging
      console.log('Raw API response:', result);
      
      // Map the API response to our Student interface
      const mappedStudents = result.data?.map(user => this.mapApiUserToStudent(user)) || [];
      
      console.log('Mapped students:', mappedStudents);
      
      return {
        students: mappedStudents
      };
    } catch (error) {
      console.error('Failed to fetch students from API:', error);
      console.log('Falling back to mock data...');
      // Return mock data as fallback
      return this.getMockStudents();
    }
  }

  // Get student by ID
  async getStudentById(studentId: string): Promise<Student> {
    try {
      console.log('Fetching student by ID from:', `${API_BASE_URL}${this.baseUrl}/${studentId}`);
      const result = await this.makeRequest<{
        success: boolean;
        message: string;
        data: ApiUser;
      }>(`${this.baseUrl}/${studentId}`);
      
      // Map the API response to Student interface
      return this.mapApiUserToStudent(result.data);
    } catch (error) {
      console.error('Failed to fetch student:', error);
      throw error;
    }
  }

  // Create new student
  async createStudent(studentData: CreateStudentData): Promise<Student> {
    try {
      // Ensure the role is set to 'student' for consistency
      const studentWithRole = {
        ...studentData,
        role: 'student'
      };

      console.log('Creating student at:', `${API_BASE_URL}${this.baseUrl}`);

      const result = await this.makeRequest<{
        success: boolean;
        message: string;
        data: ApiUser;
      }>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(studentWithRole),
      });
      
      // Map the created user to Student interface
      return this.mapApiUserToStudent(result.data);
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  }

  // Update student
  async updateStudent(studentId: string, updateData: UpdateStudentData): Promise<Student> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        message: string;
        data: ApiUser;
      }>(`${this.baseUrl}/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      // Map the updated user to Student interface
      return this.mapApiUserToStudent(result.data);
    } catch (error) {
      console.error('Failed to update student:', error);
      throw error;
    }
  }

  // Delete student
  async deleteStudent(studentId: string): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/${studentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete student:', error);
      throw error;
    }
  }

  // Get student statistics
  async getStudentStats(): Promise<StudentStats> {
    try {
      const result = await this.makeRequest<StudentStats>(`${this.baseUrl}/stats`);
      return result;
    } catch (error) {
      console.error('Failed to fetch student stats:', error);
      // Return mock stats as fallback
      return this.getMockStats();
    }
  }

  // Mark attendance for a student
  async markAttendance(attendanceData: AttendanceRecord): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/attendance`, {
        method: 'POST',
        body: JSON.stringify(attendanceData),
      });
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw error;
    }
  }

  // Bulk mark attendance for multiple students
  async bulkMarkAttendance(attendanceRecords: AttendanceRecord[]): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/attendance/bulk`, {
        method: 'POST',
        body: JSON.stringify({ records: attendanceRecords }),
      });
    } catch (error) {
      console.error('Failed to bulk mark attendance:', error);
      throw error;
    }
  }

  // Get attendance history for a student
  async getStudentAttendance(
    studentId: string,
    courseId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceRecord[]> {
    try {
      const params = new URLSearchParams();
      if (courseId) params.append('courseId', courseId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const result = await this.makeRequest<AttendanceRecord[]>(
        `${this.baseUrl}/${studentId}/attendance?${params.toString()}`
      );
      return result;
    } catch (error) {
      console.error('Failed to fetch student attendance:', error);
      throw error;
    }
  }

  // Enroll student in course
  async enrollStudentInCourse(studentId: string, courseId: string): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/${studentId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ courseId }),
      });
    } catch (error) {
      console.error('Failed to enroll student in course:', error);
      throw error;
    }
  }

  // Unenroll student from course
  async unenrollStudentFromCourse(studentId: string, courseId: string): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/${studentId}/enroll/${courseId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to unenroll student from course:', error);
      throw error;
    }
  }

  // Send email to students
  async sendEmailToStudents(
    studentIds: string[],
    subject: string,
    message: string
  ): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/email`, {
        method: 'POST',
        body: JSON.stringify({
          studentIds,
          subject,
          message
        }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  // Bulk operations
  async performBulkOperation(operation: BulkOperation): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/bulk`, {
        method: 'POST',
        body: JSON.stringify(operation),
      });
    } catch (error) {
      console.error('Failed to perform bulk operation:', error);
      throw error;
    }
  }

  // Get payment history for a student
  async getStudentPaymentHistory(studentId: string): Promise<PaymentRecord[]> {
    try {
      const result = await this.makeRequest<PaymentRecord[]>(`${this.baseUrl}/${studentId}/payments`);
      return result;
    } catch (error) {
      console.error('Failed to fetch student payment history:', error);
      throw error;
    }
  }

  // Update student fees
  async updateStudentFees(
    studentId: string,
    feeData: {
      amountPaid: number;
      paymentMethod: string;
      notes?: string;
    }
  ): Promise<void> {
    try {
      await this.makeRequest<void>(`${this.baseUrl}/${studentId}/payment`, {
        method: 'POST',
        body: JSON.stringify(feeData),
      });
    } catch (error) {
      console.error('Failed to update student fees:', error);
      throw error;
    }
  }

  // Mock data methods for fallback
  private getMockStudents(
    filters?: StudentFilters,
    page: number = 1,
    limit: number = 20,
  ) {
    // Mock students data
    const mockStudents: Student[] = [
      {
        _id: '1',
        studentId: 'STU001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@email.com',
        password: 'demo@12345',
        phone: '+91-9876543210',
        dateOfBirth: '1998-05-15',
        gender: 'Male',
        role: 'student',
        address: {
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001'
        },
        enrollmentDate: '2024-01-15',
        isActive: true,
        courses: [
          {
            courseId: '1',
            courseName: 'Full Stack Web Development',
            enrollmentDate: '2024-01-15',
            status: 'enrolled',
            attendance: 85,
            grade: 'A'
          }
        ],
        emergencyContact: {
          name: 'Sita Kumar',
          relationship: 'Mother',
          phone: '+91-9876543211',
          email: 'sita.kumar@email.com'
        },
        totalFeesPaid: 45000,
        pendingFees: 5000,
        lastPaymentDate: '2024-10-01',
        attendance: {
          totalClasses: 120,
          attendedClasses: 102,
          attendancePercentage: 85
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-10-25T00:00:00Z'
      }
    ];

    return {
      students: mockStudents,
      totalCount: mockStudents.length,
      totalPages: Math.ceil(mockStudents.length / limit),
      currentPage: page
    };
  }

  // Delete multiple students
  async deleteMultipleStudents(studentIds: string[]): Promise<{ 
    successful: string[], 
    failed: { id: string, error: string }[] 
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete students: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to delete students via API:', error);
      
      // For development, simulate successful bulk deletion
      console.log(`Mock: Successfully deleted ${studentIds.length} students`);
      return {
        successful: studentIds,
        failed: []
      };
    }
  }

  // Soft delete - mark as inactive instead of hard delete
  async softDeleteStudent(studentId: string): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/soft-delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to soft delete student: ${response.statusText}`);
      }

      const updatedStudent = await response.json();
      return updatedStudent;
    } catch (error) {
      console.error('Failed to soft delete student via API:', error);
      
      // For development, return mock updated student
      const mockStudent: Student = {
        _id: studentId,
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'demo@12345',
        phone: '+1234567890',
        dateOfBirth: '1995-05-15',
        gender: 'Male',
        role: 'student',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        enrollmentDate: '2024-01-15',
        isActive: false, // Changed to inactive for soft delete
        courses: [],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Mother',
          phone: '+1987654321'
        },
        totalFeesPaid: 0,
        pendingFees: 0,
        attendance: {
          totalClasses: 0,
          attendedClasses: 0,
          attendancePercentage: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockStudent;
    }
  }

  // Soft delete multiple students - mark as inactive instead of hard delete
  async softDeleteMultipleStudents(studentIds: string[]): Promise<{ 
    successful: Student[], 
    failed: { id: string, error: string }[] 
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/bulk-soft-delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to soft delete students: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to soft delete students via API:', error);
      
      // For development, simulate successful bulk soft deletion
      console.log(`Mock: Successfully soft deleted ${studentIds.length} students`);
      
      // Return mock updated students (all marked as inactive)
      const mockUpdatedStudents: Student[] = studentIds.map(id => ({
        _id: id,
        studentId: `STU${id.slice(-3)}`,
        firstName: 'Mock',
        lastName: 'Student',
        email: 'mock@example.com',
        password: 'demo@12345',
        phone: '+1234567890',
        dateOfBirth: '1995-05-15',
        gender: 'Male' as const,
        role: 'student',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        enrollmentDate: '2024-01-15',
        isActive: false, // Changed to inactive for soft delete
        courses: [],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Mother',
          phone: '+1987654321'
        },
        totalFeesPaid: 0,
        pendingFees: 0,
        attendance: {
          totalClasses: 0,
          attendedClasses: 0,
          attendancePercentage: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      return {
        successful: mockUpdatedStudents,
        failed: []
      };
    }
  }

  private getMockStats(): StudentStats {
    return {
      totalStudents: 150,
      activeStudents: 120,
      graduatedStudents: 25,
      suspendedStudents: 5,
      totalPendingFees: 125000,
      averageAttendance: 87,
      newEnrollmentsThisMonth: 15
    };
  }
}

export const studentManagementApiService = new StudentManagementApiService();
export default studentManagementApiService;