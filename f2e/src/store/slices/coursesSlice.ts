import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { courseApiService, type CourseDetails, type CourseFilters } from '../../services/courseApi';

// Export the CourseDetails type from API service as Course for compatibility
export type Course = CourseDetails;

// Additional types for the slice
export interface CourseProgress {
  courseId: string;
  progress: number;
  lastAccessedLesson?: string;
  completedLessons: string[];
}

export interface CoursesState {
  courses: Course[];
  enrolledCourses: Course[];
  currentCourse: Course | null;
  categories: string[];
  isLoading: boolean;
  isEnrolling: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  filters: CourseFilters;
}

// Initial state
const initialState: CoursesState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  categories: [],
  isLoading: false,
  isEnrolling: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 10
  },
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'title',
    sortOrder: 'asc'
  },
};



// Additional thunks
export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const courses = await courseApiService.getEnrolledCourses();
      return courses;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch enrolled courses');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'courses/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await courseApiService.getCategories();
      return categories;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const updateCourseProgress = createAsyncThunk(
  'courses/updateProgress',
  async ({ courseId, lessonId, progress }: { courseId: string; lessonId: string; progress: number }, { rejectWithValue }) => {
    try {
      await courseApiService.updateProgress(courseId, lessonId, progress);
      return { courseId, lessonId, progress };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update progress');
    }
  }
);

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (filters: CourseFilters = {}, { rejectWithValue }) => {
    try {
      const response = await courseApiService.getCourses(filters);
      console.log("===",response)
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const course = await courseApiService.getCourseById(courseId);
      return course;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch course details');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'courses/enrollInCourse',
  async (courseId: string, { rejectWithValue, getState }) => {
    try {
      const result = await courseApiService.enrollInCourse(courseId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      const state = getState() as { courses: CoursesState };
      const course = state.courses.courses.find(c => c._id === courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      // Add progress tracking for enrolled course
      const enrolledCourse: Course = {
        ...course,
        progress: 0,
        isEnrolled: true,
      };
      
      return enrolledCourse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to enroll in course');
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
    setFilters: (state, action: PayloadAction<Partial<CourseFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sortBy: 'title',
        sortOrder: 'asc'
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
        const response = action.payload;
        state.courses = response.data;
        state.pagination = {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
          limit: response.limit
        };
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
        state.isEnrolling = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.isEnrolling = false;
        state.enrolledCourses.push(action.payload);
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isEnrolling = false;
        state.error = action.payload as string;
      });

    // Fetch enrolled courses
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrolledCourses = action.payload;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
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
        const { courseId, progress } = action.payload;
        const courseIndex = state.enrolledCourses.findIndex(c => c._id === courseId);
        
        if (courseIndex !== -1) {
          state.enrolledCourses[courseIndex] = {
            ...state.enrolledCourses[courseIndex],
            progress,
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