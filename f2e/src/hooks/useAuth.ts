import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  loginUser, 
  checkAuthStatus, 
  updateUser,
  clearError,
  logoutImmediate,
  type User,
  type AuthState
} from '../store/slices/authSlice';

// Custom hook that replaces the old AuthContext
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState: AuthState = useAppSelector(state => state.auth);
  const hasCheckedAuth = useRef(false);

  // Check auth status on hook initialization (only once)
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  // Login function
  const login = async (email: string, password: string) => {
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
    if (loginUser.fulfilled.match(result)) {
      return result.payload.user;
    }
    return null;
  };

  // Logout function (immediate, no loading state)
  const logout = (): void => {
    dispatch(logoutImmediate());
  };

  // Update user function
  const updateUserProfile = (updates: Partial<User>): void => {
    dispatch(updateUser(updates));
  };

  // Clear error function
  const clearAuthError = (): void => {
    dispatch(clearError());
  };

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    token: authState.token,
    enrollments: authState.enrollments,
    
    // Actions
    login,
    logout,
    updateUser: updateUserProfile,
    clearError: clearAuthError,
  };
};

// Export User type for components that need it
export type { User };