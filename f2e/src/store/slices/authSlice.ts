import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        avatar: '',
        role: 'user'
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);

      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage immediately (no API call simulation needed for logout)
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return null;
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedToken) {
        return {
          user: JSON.parse(savedUser),
          token: savedToken
        };
      }

      return null;
    } catch (error) {
      return rejectWithValue('Failed to check auth status');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser: User = {
        id: String(Date.now()),
        name: userData.name,
        email: userData.email,
        avatar: '',
        role: 'user'
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);

      return { user: mockUser, token: mockToken };
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    // Immediate logout action (synchronous)
    logoutImmediate: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      // Clear localStorage safely
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } catch (error) {
        console.warn('Failed to clear localStorage during logout:', error);
      }
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check auth status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        // Only set loading if we're not already in a logged-out state
        if (state.user !== null || state.isAuthenticated) {
          state.isLoading = true;
        }
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUser, logoutImmediate } = authSlice.actions;
export default authSlice.reducer;