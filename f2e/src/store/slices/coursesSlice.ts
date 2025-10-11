import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  rating: number;
  enrolled: number;
  thumbnail: string;
  progress?: number;
  nextLesson?: string;
  totalLessons?: number;
  completedLessons?: number;
}

export interface CoursesState {
  courses: Course[];
  enrolledCourses: Course[];
  currentCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    level: string;
    category: string;
    search: string;
  };
}

// Initial state
const initialState: CoursesState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  filters: {
    level: '',
    category: '',
    search: '',
  },
};

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Development Fundamentals',
    description: 'Learn React from scratch with hands-on projects',
    instructor: 'Sarah Johnson',
    duration: '12 hours',
    level: 'Beginner',
    price: 99,
    rating: 4.8,
    enrolled: 1234,
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '2',
    title: 'Advanced JavaScript ES6+',
    description: 'Master modern JavaScript features and patterns',
    instructor: 'Mike Chen',
    duration: '8 hours',
    level: 'Intermediate',
    price: 129,
    rating: 4.9,
    enrolled: 856,
    thumbnail: '/api/placeholder/300/200',
  },
  {
    id: '3',
    title: 'TypeScript for Professionals',
    description: 'Build scalable applications with TypeScript',
    instructor: 'Alex Rivera',
    duration: '10 hours',
    level: 'Advanced',
    price: 149,
    rating: 4.7,
    enrolled: 645,
    thumbnail: '/api/placeholder/300/200',
  },
];

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockCourses;
    } catch {
      return rejectWithValue('Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const course = mockCourses.find(c => c.id === courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      return course;
    } catch {
      return rejectWithValue('Failed to fetch course details');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enrollInCourse',
  async (courseId: string, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const state = getState() as { courses: CoursesState };
      const course = state.courses.courses.find(c => c.id === courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      // Add progress tracking for enrolled course
      const enrolledCourse: Course = {
        ...course,
        progress: 0,
        nextLesson: 'Introduction to the Course',
        totalLessons: 24,
        completedLessons: 0,
      };
      
      return enrolledCourse;
    } catch {
      return rejectWithValue('Failed to enroll in course');
    }
  }
);

export const updateCourseProgress = createAsyncThunk(
  'courses/updateCourseProgress',
  async (
    { courseId, progress, completedLessons, nextLesson }: {
      courseId: string;
      progress: number;
      completedLessons: number;
      nextLesson: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { courseId, progress, completedLessons, nextLesson };
    } catch {
      return rejectWithValue('Failed to update course progress');
    }
  }
);

// Courses slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<CoursesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        level: '',
        category: '',
        search: '',
      };
    },
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Enroll in course
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledCourses.push(action.payload);
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update course progress
    builder
      .addCase(updateCourseProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        const { courseId, progress, completedLessons, nextLesson } = action.payload;
        const courseIndex = state.enrolledCourses.findIndex(c => c.id === courseId);
        
        if (courseIndex !== -1) {
          state.enrolledCourses[courseIndex] = {
            ...state.enrolledCourses[courseIndex],
            progress,
            completedLessons,
            nextLesson,
          };
        }
        state.error = null;
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;