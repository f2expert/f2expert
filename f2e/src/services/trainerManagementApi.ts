// Trainer Management API Service

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
  trainerInfo?: {
    trainerId: string;
    specializations: string[];
    qualifications: string[];
    expertise: string[];
    certifications: string[];
    experience: number;
    joinedDate: string;
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

export interface Trainer {
  _id: string;
  trainerId: string;
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
  joinedDate: string;
  isActive: boolean;
  specializations: string[];
  qualifications: string[];
  expertise: string[];
  certifications: string[];
  experience: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  bio?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerFilters {
  status?: string; // Keep as 'status' for UI filtering (active/inactive/all)
  gender?: string;
  experience?: string;
  search?: string;
}

export interface TrainerStats {
  totalTrainers: number;
  activeTrainers: number;
  inactiveTrainers: number;
  totalExperience: number;
  averageExperience: number;
  newJoineesThisMonth: number;
}

export interface CreateTrainerData {
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
  specializations: string[];
  qualifications: string[];
  expertise: string[];
  certifications: string[];
  experience: number;
  bio?: string;
}

export interface UpdateTrainerData extends Partial<CreateTrainerData> {
  isActive?: boolean;
}

class TrainerManagementApiService {
  private baseUrl = '/users';

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Trainer Management API Request URL:', url);
    
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
      console.error('Trainer Management API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Helper function to map API response to Trainer interface
  private mapApiUserToTrainer(apiUser: ApiUser): Trainer {
    return {
      _id: apiUser._id || apiUser.id || '',
      trainerId: apiUser.trainerInfo?.trainerId || `TR${Date.now()}`,
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
      joinedDate: apiUser.trainerInfo?.joinedDate || apiUser.createdAt,
      isActive: apiUser.isActive,
      specializations: apiUser.trainerInfo?.specializations || [],
      qualifications: apiUser.trainerInfo?.qualifications || [],
      expertise: apiUser.trainerInfo?.expertise || [],
      certifications: apiUser.trainerInfo?.certifications || [],
      experience: apiUser.trainerInfo?.experience || 0,
      emergencyContact: {
        name: apiUser.emergencyContact?.name || '',
        relationship: apiUser.emergencyContact?.relationship || '',
        phone: apiUser.emergencyContact?.phone || '',
        email: apiUser.emergencyContact?.email || ''
      },
      bio: apiUser.bio || '',
      photo: apiUser.photo || '',
      createdAt: apiUser.createdAt,
      updatedAt: apiUser.updatedAt
    };
  }

  // Get all trainers with filtering and pagination
  async getTrainers(): Promise<{
    trainers: Trainer[];
  }> {
    try {
      const params = new URLSearchParams({
        role: 'trainer', // Always filter for trainers only 
      });

      console.log('Fetching trainers from:', `${API_BASE_URL}${this.baseUrl}?${params.toString()}`);

      const result = await this.makeRequest<ApiResponse>(`${this.baseUrl}?role=trainer`);
      
      // Log successful response for debugging
      console.log('Raw API response:', result);
      
      // Map the API response to our Trainer interface
      const mappedTrainers = result.data?.map(user => this.mapApiUserToTrainer(user)) || [];
      
      console.log('Mapped trainers:', mappedTrainers);
      
      return {
        trainers: mappedTrainers
      };
    } catch (error) {
      console.error('Failed to fetch trainers from API:', error);
      console.log('Falling back to mock data...');
      // Return mock data as fallback
      return this.getMockTrainers();
    }
  }

  // Get trainer by ID
  async getTrainerById(trainerId: string): Promise<Trainer> {
    try {
      console.log('Fetching trainer by ID from:', `${API_BASE_URL}${this.baseUrl}/${trainerId}`);
      const result = await this.makeRequest<{
        success: boolean;
        message: string;
        data: ApiUser;
      }>(`${this.baseUrl}/${trainerId}`);
      
      // Map the API response to Trainer interface
      return this.mapApiUserToTrainer(result.data);
    } catch (error) {
      console.error('Failed to fetch trainer:', error);
      throw error;
    }
  }

  // Create new trainer
  async createTrainer(trainerData: CreateTrainerData): Promise<Trainer> {
    try {
      // Ensure the role is set to 'trainer' for consistency
      const trainerWithRole = {
        ...trainerData,
        role: 'trainer'
      };

      console.log('Creating trainer at:', `${API_BASE_URL}${this.baseUrl}`);

      const result = await this.makeRequest<{
        success: boolean;
        message: string;
        data: ApiUser;
      }>(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(trainerWithRole),
      });
      
      // Map the created user to Trainer interface
      return this.mapApiUserToTrainer(result.data);
    } catch (error) {
      console.error('Failed to create trainer:', error);
      throw error;
    }
  }

  // Update trainer
  async updateTrainer(trainerId: string, updateData: UpdateTrainerData): Promise<Trainer> {
    try {
      const result = await this.makeRequest<{
        success: boolean;
        message: string;
        data: ApiUser;
      }>(`${this.baseUrl}/${trainerId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      // Map the updated user to Trainer interface
      return this.mapApiUserToTrainer(result.data);
    } catch (error) {
      console.error('Failed to update trainer:', error);
      throw error;
    }
  }

  // Soft delete trainer
  async softDeleteTrainer(trainerId: string): Promise<Trainer> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.baseUrl}/${trainerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const updatedTrainer = await response.json();
      return updatedTrainer;
    } catch (error) {
      console.error('Failed to soft delete trainer via API:', error);
      
      // For development, return mock updated trainer
      const mockTrainer: Trainer = {
        _id: trainerId,
        trainerId: 'TR001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: 'Demo@12345',
        phone: '+1234567890',
        dateOfBirth: '1985-05-15',
        gender: 'Male',
        role: 'trainer',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        joinedDate: '2024-01-15',
        isActive: false, // Changed to inactive for soft delete
        specializations: ['React', 'Node.js'],
        qualifications: ['B.Tech Computer Science'],
        expertise: ['Full Stack Development'],
        certifications: ['AWS Certified'],
        experience: 5,
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '+1987654321'
        },
        bio: 'Experienced trainer in web technologies',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return mockTrainer;
    }
  }

  // Get mock trainers for fallback
  private getMockTrainers(): Promise<{ trainers: Trainer[] }> {
    const mockTrainers: Trainer[] = [
      {
        _id: '1',
        trainerId: 'TR001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: 'Demo@12345',
        phone: '+91-9876543210',
        dateOfBirth: '1985-05-15',
        gender: 'Male',
        role: 'trainer',
        address: {
          street: '123 Tech Park',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001'
        },
        joinedDate: '2023-01-15',
        isActive: true,
        specializations: ['React', 'Node.js', 'JavaScript'],
        qualifications: ['M.Tech Computer Science', 'B.Tech IT'],
        expertise: ['Full Stack Development', 'System Architecture'],
        certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
        experience: 8,
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '+91-9876543211',
          email: 'jane.smith@example.com'
        },
        bio: 'Experienced full-stack developer and trainer with 8+ years in the industry.',
        photo: '',
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2024-10-25T00:00:00Z'
      },
      {
        _id: '2',
        trainerId: 'TR002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        password: 'Demo@12345',
        phone: '+91-8765432109',
        dateOfBirth: '1988-03-22',
        gender: 'Female',
        role: 'trainer',
        address: {
          street: '456 Innovation Drive',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          zipCode: '500001'
        },
        joinedDate: '2023-06-01',
        isActive: true,
        specializations: ['Python', 'Data Science', 'Machine Learning'],
        qualifications: ['PhD Computer Science', 'M.Tech AI'],
        expertise: ['Data Analytics', 'AI/ML', 'Statistical Modeling'],
        certifications: ['Microsoft Azure Data Scientist', 'Google ML Engineer'],
        experience: 6,
        emergencyContact: {
          name: 'Michael Johnson',
          relationship: 'Spouse',
          phone: '+91-8765432108'
        },
        bio: 'Data Science expert with extensive experience in machine learning and analytics.',
        photo: '',
        createdAt: '2023-06-01T00:00:00Z',
        updatedAt: '2024-10-26T00:00:00Z'
      }
    ];

    return Promise.resolve({ trainers: mockTrainers });
  }
}

export const trainerManagementApiService = new TrainerManagementApiService();