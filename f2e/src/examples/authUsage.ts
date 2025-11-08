// Example usage of the Auth Token Manager

import { 
  authTokenManager, 
  getAuthToken, 
  getAuthHeader, 
  setAuthTokens, 
  clearAuthTokens, 
  isAuthenticated,
  getUserData,
  refreshAccessToken 
} from '../utils/auth';

// Type definitions for examples
interface LoginResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  message?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
}

interface CourseData {
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
}

// Example 1: Login and set tokens
export const handleLogin = async (email: string, password: string): Promise<{ success: boolean; user?: unknown; message?: string }> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result: LoginResponse = await response.json();

    if (result.success && result.accessToken && result.refreshToken && result.user && result.expiresIn) {
      // Set tokens and user data
      setAuthTokens(
        {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          tokenType: 'Bearer',
          expiresAt: Date.now() + (result.expiresIn * 1000) // Convert seconds to milliseconds
        },
        {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role
        }
      );

      // Setup automatic token refresh
      authTokenManager.setupAutoRefresh();

      console.log('Login successful');
      return { success: true, user: result.user };
    }

    return { success: false, message: result.message };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: 'Login failed' };
  }
};

// Example 2: Logout
export const handleLogout = () => {
  clearAuthTokens();
  console.log('User logged out');
  // Redirect to login page or update UI state
};

// Example 3: Making authenticated API calls
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const authHeader = getAuthHeader();
  
  if (!authHeader) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': authHeader
      }
    });

    if (response.status === 401) {
      // Token expired or invalid
      console.warn('Token expired, attempting refresh...');
      const newTokens = await refreshAccessToken();
      
      if (newTokens) {
        // Retry with new token
        return fetchUserProfile();
      } else {
        // Refresh failed, redirect to login
        handleLogout();
        throw new Error('Authentication expired');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
};

// Example 4: Check authentication status
export const checkAuth = () => {
  if (isAuthenticated()) {
    const user = getUserData();
    console.log('User is authenticated:', user);
    return true;
  } else {
    console.log('User is not authenticated');
    return false;
  }
};

// Example 5: Protected route helper
export const requireAuth = () => {
  if (!isAuthenticated()) {
    // Redirect to login
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Example 6: Get token expiration info
export const getTokenInfo = () => {
  const token = getAuthToken();
  const timeLeft = authTokenManager.getTimeUntilExpiration();
  const expiresAt = authTokenManager.getTokenExpiration();

  return {
    hasToken: !!token,
    timeLeftSeconds: timeLeft,
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    isExpired: authTokenManager.isTokenExpired()
  };
};

// Example 7: Initialize auth on app startup
export const initializeAuth = () => {
  if (isAuthenticated()) {
    console.log('User already authenticated');
    
    // Setup auto-refresh for existing session
    authTokenManager.setupAutoRefresh();
    
    // Check if token is about to expire and refresh if needed
    const timeLeft = authTokenManager.getTimeUntilExpiration();
    if (timeLeft && timeLeft < 300) { // Less than 5 minutes
      console.log('Token expiring soon, refreshing...');
      refreshAccessToken();
    }
  } else {
    console.log('No active session found');
  }
};

// Example usage in API service
export class AuthenticatedApiService {
  private async makeAuthenticatedRequest<T>(
    endpoint: string, 
    options?: RequestInit
  ): Promise<T> {
    const authHeader = getAuthHeader();
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
        ...(options?.headers || {})
      }
    });

    if (response.status === 401) {
      // Attempt token refresh
      const newTokens = await refreshAccessToken();
      if (newTokens) {
        // Retry with new token
        return this.makeAuthenticatedRequest(endpoint, options);
      } else {
        handleLogout();
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getCourses(): Promise<Course[]> {
    return this.makeAuthenticatedRequest<Course[]>('/api/courses');
  }

  async createCourse(courseData: CourseData): Promise<Course> {
    return this.makeAuthenticatedRequest('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }
}

export default {
  handleLogin,
  handleLogout,
  fetchUserProfile,
  checkAuth,
  requireAuth,
  getTokenInfo,
  initializeAuth,
  AuthenticatedApiService
};