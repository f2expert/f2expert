import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinDate: string;
  level: string;
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
    emailUpdates: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: string;
  category: string;
}

export interface UserState {
  profile: UserProfile | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}

// Initial state
const initialState: UserState = {
  profile: null,
  achievements: [],
  isLoading: false,
  error: null,
  isUpdating: false,
};

// Mock achievements
const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Course Completed',
    description: 'Completed your first course successfully',
    earnedDate: '2024-02-15',
    icon: '🎓',
    category: 'learning',
  },
  {
    id: '2',
    title: 'JavaScript Master',
    description: 'Mastered JavaScript fundamentals',
    earnedDate: '2024-03-01',
    icon: '⚡',
    category: 'skill',
  },
  {
    id: '3',
    title: 'React Developer',
    description: 'Built your first React application',
    earnedDate: '2024-03-20',
    icon: '⚛️',
    category: 'framework',
  },
];

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProfile: UserProfile = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/api/placeholder/100/100',
        role: 'student',
        joinDate: '2024-01-15',
        level: 'Intermediate Developer',
        totalCourses: 5,
        completedCourses: 2,
        totalHours: 156,
        certificates: 3,
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
          emailUpdates: true,
        },
      };
      
      return mockProfile;
    } catch {
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updates: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return updates;
    } catch {
      return rejectWithValue('Failed to update user profile');
    }
  }
);

export const fetchUserAchievements = createAsyncThunk(
  'user/fetchUserAchievements',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return mockAchievements;
    } catch {
      return rejectWithValue('Failed to fetch user achievements');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences: Partial<UserProfile['preferences']>, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return preferences;
    } catch {
      return rejectWithValue('Failed to update user preferences');
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  'user/uploadUserAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock avatar URL
      const avatarUrl = `/api/placeholder/100/100?t=${Date.now()}`;
      
      return avatarUrl;
    } catch {
      return rejectWithValue('Failed to upload avatar');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfileLocally: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      state.achievements.push(action.payload);
    },
    clearProfile: (state) => {
      state.profile = null;
      state.achievements = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Fetch user achievements
    builder
      .addCase(fetchUserAchievements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user preferences
    builder
      .addCase(updateUserPreferences.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.preferences = { ...state.profile.preferences, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Upload user avatar
    builder
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (state.profile) {
          state.profile.avatar = action.payload;
        }
        state.error = null;
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateProfileLocally, addAchievement, clearProfile } = userSlice.actions;
export default userSlice.reducer;