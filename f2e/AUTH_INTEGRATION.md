# Authentication System Integration Guide

## Overview

This guide shows how to integrate the comprehensive authentication system across the F2Expert React application. The auth system provides secure token management, automatic refresh, and proper TypeScript typing.

## Quick Start

### 1. Initialize Auth on App Startup

In your main `App.tsx` or `main.tsx`, initialize the auth system:

```tsx
import { initializeAuth } from './examples/authUsage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize auth system on app startup
    initializeAuth();
  }, []);

  return (
    // Your app components
  );
}
```

### 2. Login Flow Integration

```tsx
import { handleLogin } from './examples/authUsage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await handleLogin(email, password);
    
    if (result.success) {
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // Show error message
      console.error(result.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Your login form */}
    </form>
  );
};
```

### 3. Protected Routes

```tsx
import { requireAuth } from './examples/authUsage';
import { useEffect } from 'react';

const ProtectedComponent = () => {
  useEffect(() => {
    if (!requireAuth()) {
      return; // Will redirect to login
    }
  }, []);

  return <div>Protected content</div>;
};
```

## API Service Integration

### Update Existing API Services

For each API service file, follow this pattern:

#### 1. Import Auth Functions

```tsx
import { getAuthHeader, refreshAccessToken } from '../utils/auth';
import { handleLogout } from '../examples/authUsage';
```

#### 2. Update Request Methods

```tsx
export class CourseApiService {
  private async makeRequest<T>(
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

    // Handle 401 - Token expired
    if (response.status === 401) {
      console.warn('Token expired, attempting refresh...');
      const newTokens = await refreshAccessToken();
      
      if (newTokens) {
        // Retry with new token
        return this.makeRequest(endpoint, options);
      } else {
        // Refresh failed, logout user
        handleLogout();
        throw new Error('Authentication expired');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Your existing API methods using makeRequest
  async getCourses() {
    return this.makeRequest<Course[]>('/api/courses');
  }
}
```

## Redux Integration

### Auth Slice Updates

Update your `authSlice.ts` to work with the token manager:

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAuthTokens, clearAuthTokens, getUserData } from '../utils/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: getUserData(), // Get from token manager
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ tokens: TokenData; user: UserData }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.loading = false;
      
      // Set tokens in the auth manager
      setAuthTokens(action.payload.tokens, action.payload.user);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      
      // Clear tokens from auth manager
      clearAuthTokens();
    }
  }
});

export const { loginStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
```

### Auth Hook

Create a custom hook for auth operations:

```tsx
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, logout } from '../store/slices/authSlice';
import { handleLogin as performLogin, handleLogout as performLogout } from '../examples/authUsage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector(state => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    const result = await performLogin(email, password);
    
    if (result.success && result.user) {
      dispatch(loginSuccess({
        tokens: {
          accessToken: '', // Will be handled by auth manager
          refreshToken: '',
          tokenType: 'Bearer',
          expiresAt: 0
        },
        user: result.user as UserData
      }));
    }
    
    return result;
  };

  const logoutUser = () => {
    performLogout();
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout: logoutUser
  };
};
```

## Component Usage Examples

### Navigation Component

```tsx
import { useAuth } from '../hooks/useAuth';
import { getTokenInfo } from '../examples/authUsage';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [tokenInfo, setTokenInfo] = useState(getTokenInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setTokenInfo(getTokenInfo());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <LoginButton />;
  }

  return (
    <div>
      <span>Welcome, {user?.name}</span>
      {tokenInfo.timeLeftSeconds && tokenInfo.timeLeftSeconds < 300 && (
        <div className="text-yellow-600">
          Token expires in {Math.floor(tokenInfo.timeLeftSeconds / 60)} minutes
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### API Hook

```tsx
import { useState, useEffect } from 'react';
import { AuthenticatedApiService } from '../examples/authUsage';

const apiService = new AuthenticatedApiService();

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: fetchCourses };
};
```

## Security Best Practices

### 1. Token Storage
- Access tokens are stored in memory (secure)
- Refresh tokens in localStorage (acceptable for refresh tokens)
- Automatic cleanup on logout

### 2. Automatic Refresh
- Tokens refresh automatically before expiration
- Failed refresh triggers logout
- Background refresh doesn't interrupt user experience

### 3. Error Handling
- 401 responses trigger automatic token refresh
- Failed refresh results in logout and redirect
- Proper error propagation to UI

### 4. Token Validation
- Expiration checking before API calls
- Automatic refresh for expired tokens
- Graceful handling of invalid tokens

## Migration Checklist

- [ ] Initialize auth system in App.tsx
- [ ] Update login/logout flows
- [ ] Migrate API services to use auth headers
- [ ] Update Redux auth slice
- [ ] Create auth hook for components
- [ ] Add protected route guards
- [ ] Test automatic token refresh
- [ ] Verify logout clears all auth data
- [ ] Test session persistence across page reloads

## Troubleshooting

### Common Issues

1. **Infinite refresh loops**: Check token expiration logic
2. **Missing auth headers**: Ensure `getAuthHeader()` is called
3. **Login not persisting**: Verify token storage and retrieval
4. **403/401 errors**: Check token format and API endpoint auth

### Debug Tools

```tsx
import { getTokenInfo } from '../examples/authUsage';

// Debug current auth state
console.log('Auth Debug:', {
  ...getTokenInfo(),
  userData: getUserData(),
  isAuthenticated: isAuthenticated()
});
```

This comprehensive auth system provides secure, scalable authentication for your F2Expert application with automatic token management and proper error handling.