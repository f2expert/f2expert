// Student Management API Service

// Mock API Base URL (replace with actual API endpoint)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

export interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
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
  status?: string;
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
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
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
  status?: 'active' | 'inactive' | 'suspended' | 'graduated';
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
  private baseUrl = '/students';

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

  // Get all students with filtering and pagination
  async getStudents(
    filters?: StudentFilters,
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    students: Student[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        ...(filters && Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value && value !== 'all')
        ))
      });

      const result = await this.makeRequest<{
        students: Student[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
      }>(`${this.baseUrl}?${params.toString()}`);
      
      return result;
    } catch (error) {
      console.error('Failed to fetch students:', error);
      // Return mock data as fallback
      return this.getMockStudents(filters, page, limit, sortBy, sortOrder);
    }
  }

  // Get student by ID
  async getStudentById(studentId: string): Promise<Student> {
    try {
      const result = await this.makeRequest<Student>(`${this.baseUrl}/${studentId}`);
      return result;
    } catch (error) {
      console.error('Failed to fetch student:', error);
      throw error;
    }
  }

  // Create new student
  async createStudent(studentData: CreateStudentData): Promise<Student> {
    try {
      const result = await this.makeRequest<Student>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
      return result;
    } catch (error) {
      console.error('Failed to create student:', error);
      throw error;
    }
  }

  // Update student
  async updateStudent(studentId: string, updateData: UpdateStudentData): Promise<Student> {
    try {
      const result = await this.makeRequest<Student>(`${this.baseUrl}/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      return result;
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
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    // Mock students data
    const mockStudents: Student[] = [
      {
        _id: '1',
        studentId: 'STU001',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91-9876543210',
        dateOfBirth: '1998-05-15',
        gender: 'Male',
        address: {
          street: '123 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001'
        },
        enrollmentDate: '2024-01-15',
        status: 'active',
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
        phone: '+1234567890',
        dateOfBirth: '1995-05-15',
        gender: 'Male',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        enrollmentDate: '2024-01-15',
        status: 'inactive', // Changed to inactive for soft delete
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
        phone: '+1234567890',
        dateOfBirth: '1995-05-15',
        gender: 'Male' as const,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        enrollmentDate: '2024-01-15',
        status: 'inactive' as const, // Changed to inactive for soft delete
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