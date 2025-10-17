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
    token: string;
    user: {
      id?: string;
      _id?: string;
      name?: string;
      fullName?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      avatar?: string;
      role?: string;
      isActive?: boolean;
      phone?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  // Also support direct token/user for backward compatibility
  token?: string;
  user?: {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
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

      // Handle various response formats
      // Check if the response indicates success (some APIs return success: true/false)
      if (response.success !== undefined && response.success === false) {
        throw new Error(response.message || 'Login failed');
      }

      // Extract user and token from response (handle nested data structure)
      let userData, tokenValue;
      
      if (response.data) {
        // API returns data in nested structure: { success: true, data: { user, token } }
        userData = response.data.user;
        tokenValue = response.data.token;
      } else {
        // API returns data directly: { user, token }
        userData = response.user;
        tokenValue = response.token;
      }

      // For successful responses, ensure we have required data
      if (!tokenValue || !userData) {
        console.error('Missing authentication data in response:', {
          hasToken: !!tokenValue,
          hasUser: !!userData,
          responseKeys: Object.keys(response),
          dataKeys: response.data ? Object.keys(response.data) : 'no data object'
        });
        throw new Error('Login API returned success but missing authentication data. Please check API response format.');
      }

      // Normalize user data
      const normalizedUser: AuthUser = {
        id: userData._id || userData.id || '',
        name: userData.fullName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User',
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role || 'user',
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
}

export const authApiService = new AuthApiService();