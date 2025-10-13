// Trainer API Service
export interface Trainer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  role: 'trainer';
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  fullName: string;
  roleDisplay: string;
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  studentInfo?: {
    enrollmentDate: string;
  };
  trainerInfo: {
    employeeId: string;
    specializations: string[];
    qualifications: string[];
    certifications: string[];
    expertise: string[];
  };
  adminInfo?: {
    permissions: string[];
    accessLevel: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TrainersResponse {
  data: Trainer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mock API Base URL (replace with actual API endpoint)
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

class TrainerApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Trainer API Request URL:', url);
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

  // Fetch active trainers
  async getActiveTrainers(): Promise<TrainersResponse> {
    const endpoint = '/users?role=trainer&isActive=true';
    
    try {
      // Make actual API call
      const response = await this.makeRequest<Trainer[] | TrainersResponse>(endpoint);
      
      // Handle both array response and object response with data property
      if (Array.isArray(response)) {
        return {
          data: response,
          total: response.length,
          page: 1,
          limit: response.length,
          totalPages: 1
        };
      } else if (response.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.total || response.data.length,
          page: response.page || 1,
          limit: response.limit || response.data.length,
          totalPages: response.totalPages || 1
        };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      // Fallback to mock data if API fails
      return this.getMockTrainers();
    }
  }

  // Mock data method (replace with actual API call)
  private async getMockTrainers(): Promise<TrainersResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const trainers: Trainer[] = [
      {
        _id: '1',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        fullName: 'Dr. Rajesh Kumar',
        email: 'rajesh@f2expert.com',
        phone: '9999999991',
        dateOfBirth: '1980-05-15T00:00:00.000Z',
        gender: 'male',
        role: 'trainer',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        roleDisplay: 'Trainer',
        id: '1',
        address: {
          street: 'A-123, Sector 15',
          city: 'Noida',
          state: 'Uttar Pradesh',
          country: 'India',
          zipCode: '201301'
        },
        trainerInfo: {
          employeeId: 'TR25001',
          specializations: ['Software Architecture', 'Leadership'],
          qualifications: ['M.Tech Computer Science', 'B.Tech IT'],
          certifications: ['AWS Solutions Architect', 'Google Cloud Professional', 'Microsoft Azure Expert'],
          expertise: ['Leadership', 'Software Architecture', 'AI/ML', 'Cloud Computing']
        },
        preferences: {
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          language: 'en',
          timezone: 'Asia/Kolkata'
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-10-01T00:00:00Z',
        __v: 0
      },
      {
        _id: '2',
        firstName: 'Priya',
        lastName: 'Sharma',
        fullName: 'Priya Sharma',
        email: 'priya@f2expert.com',
        phone: '9999999992',
        dateOfBirth: '1985-08-22T00:00:00.000Z',
        gender: 'female',
        role: 'trainer',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        roleDisplay: 'Trainer',
        id: '2',
        address: {
          street: 'B-456, Block C',
          city: 'Gurgaon',
          state: 'Haryana',
          country: 'India',
          zipCode: '122001'
        },
        trainerInfo: {
          employeeId: 'TR25002',
          specializations: ['Web Development', 'Curriculum Design'],
          qualifications: ['MCA', 'B.Sc Computer Science'],
          certifications: ['Certified Scrum Master', 'React Developer Certification', 'MongoDB Certified Developer'],
          expertise: ['Curriculum Design', 'Web Development', 'React', 'Node.js', 'Data Science']
        },
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: false
          },
          language: 'en',
          timezone: 'Asia/Kolkata'
        },
        createdAt: '2024-01-20T00:00:00Z',
        updatedAt: '2024-09-25T00:00:00Z',
        __v: 0
      },
      {
        _id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        fullName: 'Michael Johnson',
        email: 'michael@f2expert.com',
        phone: '9999999993',
        dateOfBirth: '1982-12-10T00:00:00.000Z',
        gender: 'male',
        role: 'trainer',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        roleDisplay: 'Trainer',
        id: '3',
        address: {
          street: 'C-789, Phase 2',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001'
        },
        trainerInfo: {
          employeeId: 'TR25003',
          specializations: ['Cloud Computing', 'DevOps'],
          qualifications: ['M.S. Computer Science', 'B.E. Electronics'],
          certifications: ['AWS Solutions Architect Professional', 'Kubernetes Administrator', 'Docker Certified Associate'],
          expertise: ['AWS', 'DevOps', 'Kubernetes', 'Docker', 'Terraform']
        },
        preferences: {
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          language: 'en',
          timezone: 'Asia/Kolkata'
        },
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-10-05T00:00:00Z',
        __v: 0
      },
      {
        _id: '4',
        firstName: 'Anita',
        lastName: 'Patel',
        fullName: 'Anita Patel',
        email: 'anita@f2expert.com',
        phone: '9999999994',
        dateOfBirth: '1990-03-18T00:00:00.000Z',
        gender: 'female',
        role: 'trainer',
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        roleDisplay: 'Trainer',
        id: '4',
        address: {
          street: 'D-321, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          zipCode: '500033'
        },
        trainerInfo: {
          employeeId: 'TR25004',
          specializations: ['Data Science', 'Machine Learning'],
          qualifications: ['M.S. Data Science', 'B.Tech CSE'],
          certifications: ['Google Data Analytics Professional', 'TensorFlow Developer Certificate', 'Python Institute Certification'],
          expertise: ['Python', 'Machine Learning', 'Statistics', 'R', 'TensorFlow', 'Pandas']
        },
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          language: 'en',
          timezone: 'Asia/Kolkata'
        },
        createdAt: '2024-02-15T00:00:00Z',
        updatedAt: '2024-09-30T00:00:00Z',
        __v: 0
      }
    ];

    return {
      data: trainers,
      total: trainers.length,
      page: 1,
      limit: 10,
      totalPages: 1
    };
  }
}

// Export singleton instance
export const trainerApiService = new TrainerApiService();
export default trainerApiService;