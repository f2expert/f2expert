// Authentication API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: string;
      gender: string;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
      };
      role: string;
      isActive: boolean;
      isEmailVerified: boolean;
      photo: string;
      bio: string;
      fullName: string;
      roleDisplay: string;
      createdAt: string;
      updatedAt: string;
      studentInfo?: {
        studentId: string;
        enrollmentDate: string;
        emergencyContact: Record<string, unknown>;
      };
    };
    token: string;
    enrollments: {
      _id: string;
      courseId: string;
      status: string;
      createdAt: string;
    }[];
  };
}

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  photo?: string;
  bio?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  studentInfo?: {
    studentId: string;
    enrollmentDate: string;
    emergencyContact: Record<string, unknown>;
  };
  enrollments?: {
    _id: string;
    courseId: string;
    status: string;
    createdAt: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  role?: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  bio?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      role: string;
      createdAt: string;
    };
  };
}

class AuthApiService {
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Making auth API request to:', url);
    console.log('Request options:', options);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type');
    console.log('Auth API response status:', response.status, 'Content-Type:', contentType);
    console.log('Response ok:', response.ok, 'Status text:', response.statusText);

    // Get the response text first for debugging
    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        if (contentType?.includes('application/json') && responseText) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          errorMessage = responseText || errorMessage;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorMessage = responseText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    if (!contentType?.includes('application/json')) {
      throw new Error('Expected JSON response from auth API');
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Auth API response data:', data);
      return data;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error('Invalid JSON response from auth API');
    }
  }

  // Login user with email and password
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    try {
      console.log('Attempting login for email:', credentials.email);
      
      const response = await this.makeRequest<LoginResponse>('/api/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      console.log('Login API response:', response);

      // Check if the response indicates success
      if (response.success !== undefined && response.success === false) {
        throw new Error(response.message || 'Login failed');
      }

      // Extract user, token, and enrollments from response
      const userData = response.data.user;
      const tokenValue = response.data.token;
      const enrollments = response.data.enrollments || [];

      // Ensure we have required data
      if (!tokenValue || !userData) {
        console.error('Missing authentication data in response:', {
          hasToken: !!tokenValue,
          hasUser: !!userData,
          responseKeys: Object.keys(response)
        });
        throw new Error('Login API returned success but missing authentication data.');
      }

      // Normalize user data from the comprehensive API response
      const normalizedUser: AuthUser = {
        id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.fullName || `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        address: userData.address,
        photo: userData.photo,
        bio: userData.bio,
        role: userData.role,
        isActive: userData.isActive,
        isEmailVerified: userData.isEmailVerified,
        studentInfo: userData.studentInfo,
        enrollments: enrollments,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };

      if (!normalizedUser.id) {
        throw new Error('User ID not found in login response');
      }

      console.log('Login successful for user:', normalizedUser);
      return { user: normalizedUser, token: tokenValue };
      
    } catch (error) {
      console.error('Login API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    }
  }

  // Register new user
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      console.log('Attempting registration for email:', userData.email);
      
      // Prepare registration payload in the exact format required by the API
      const registrationPayload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        address: userData.address,
        role: userData.role || 'student'
      };

      console.log('Registration payload:', registrationPayload);

      const response = await this.makeRequest<RegisterResponse>('/api/users', {
        method: 'POST',
        body: JSON.stringify(registrationPayload),
      });

      console.log('Registration API response:', response);

      // Check if registration was successful
      if (response.success !== undefined && response.success === false) {
        throw new Error(response.message || 'Registration failed');
      }

      console.log('Registration successful');
      return response;
      
    } catch (error) {
      console.error('Registration API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    }
  }

  // Validate token (optional - for checking if token is still valid)
  async validateToken(token: string): Promise<AuthUser> {
    try {
      const response = await this.makeRequest<{ user: AuthUser }>('/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.user;
    } catch (error) {
      console.error('Token validation error:', error);
      throw new Error('Invalid or expired token');
    }
  }

  // Logout (if your API has a logout endpoint)
  async logout(token: string): Promise<void> {
    try {
      await this.makeRequest('/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
      // Don't throw error for logout - still clear local storage
    }
  }

  // Upload user photo
  async uploadPhoto(userId: string, photoFile: File, token: string): Promise<{ photoUrl: string }> {
    try {
      console.log('Uploading photo for user:', userId);
      
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/upload-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Photo upload failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Photo upload successful:', result);
      
      // Extract photo URL from response
      const photoUrl = result.data?.photoUrl || result.photoUrl || result.data?.photo || result.photo;
      
      if (!photoUrl) {
        throw new Error('Photo URL not found in response');
      }
      
      return { photoUrl };
    } catch (error) {
      console.error('Photo upload API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Photo upload failed');
    }
  }

  // Update user profile
  async updateProfile(userId: string, profileData: UpdateProfileData, token: string): Promise<AuthUser> {
    try {
      console.log('Updating profile for user:', userId, profileData);
      
      const response = await this.makeRequest<{ success: boolean; message: string; data?: { user: AuthUser } }>(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      console.log('Profile update API response:', response);

      // Check if update was successful
      if (response.success !== undefined && response.success === false) {
        throw new Error(response.message || 'Profile update failed');
      }

      // Extract updated user data
      let actualUserData;
      if (response.data?.user) {
        actualUserData = response.data.user;
      } else {
        // If response doesn't have nested structure, assume response is the user data
        actualUserData = response as unknown as AuthUser;
      }
      
      // Normalize updated user data
      const normalizedUser: AuthUser = {
        id: actualUserData.id || userId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        email: profileData.email,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        photo: actualUserData.photo,
        bio: profileData.bio,
        role: actualUserData.role || 'user',
        isActive: actualUserData.isActive,
        isEmailVerified: actualUserData.isEmailVerified,
        studentInfo: actualUserData.studentInfo,
        createdAt: actualUserData.createdAt,
        updatedAt: actualUserData.updatedAt,
      };

      console.log('Profile update successful:', normalizedUser);
      return normalizedUser;
      
    } catch (error) {
      console.error('Profile update API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Profile update failed');
    }
  }

  // Change user password
  async changePassword(userId: string, passwordData: ChangePasswordData, token: string): Promise<void> {
    try {
      console.log('Changing password for user:', userId);
      
      const response = await this.makeRequest<ChangePasswordResponse>(`/api/users/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      console.log('Password change API response:', response);

      // Check if password change was successful
      if (response.success !== undefined && response.success === false) {
        throw new Error(response.message || 'Password change failed');
      }

      console.log('Password change successful');
      
    } catch (error) {
      console.error('Password change API error:', error);
      throw new Error(error instanceof Error ? error.message : 'Password change failed');
    }
  }
}

export const authApiService = new AuthApiService();