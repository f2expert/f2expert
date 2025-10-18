import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { tutorialApiService, type Tutorial, type TutorialFilters, type TutorialsResponse } from '../../services/tutorialApi';

// Export the Tutorial type from API service
export type { Tutorial };

// Additional types for the slice
export interface TutorialProgress {
  tutorialId: string;
  progress: number;
  lastStep?: number;
  completedSteps: number[];
}

export interface TutorialsState {
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  categories: string[];
  isLoading: boolean;
  isStarting: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  filters: TutorialFilters;
}

// Initial state
const initialState: TutorialsState = {
  tutorials: [],
  currentTutorial: null,
  categories: [],
  isLoading: false,
  isStarting: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 10
  },
  filters: {
    category: undefined,
    level: undefined,
    search: undefined,
  },
};

// Async thunks
export const fetchTutorials = createAsyncThunk(
  'tutorials/fetchTutorials',
  async (filters: TutorialFilters = {}, { rejectWithValue }) => {
    try {
      const response = await tutorialApiService.getTutorials(filters);
      console.log("Tutorials response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tutorials');
    }
  }
);

export const fetchTutorialsByCategory = createAsyncThunk(
  'tutorials/fetchTutorialsByCategory',
  async ({ category, limit = 10 }: { category: string; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await tutorialApiService.getTutorialsByCategory(category, limit);
      console.log("Tutorials by category:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tutorials by category');
    }
  }
);

// Track pending tutorials by technology requests to prevent duplicates
const pendingTechnologyRequests = new Map<string, Promise<TutorialsResponse>>();

export const fetchTutorialsByTechnology = createAsyncThunk(
  'tutorials/fetchTutorialsByTechnology',
  async (technology: string, { rejectWithValue }) => {
    // Check if this request is already pending
    if (pendingTechnologyRequests.has(technology)) {
      const pendingRequest = pendingTechnologyRequests.get(technology);
      if (pendingRequest) {
        return await pendingRequest;
      }
    }
    
    // Create and track the request
    const requestPromise = (async (): Promise<TutorialsResponse> => {
      try {
        const response = await tutorialApiService.getTutorialsByTechnology(technology);
        console.log("Tutorials by technology:", response);
        return response;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Failed to fetch tutorials by technology');
      }
    })();
    
    pendingTechnologyRequests.set(technology, requestPromise);
    
    // Clean up completed request
    requestPromise.finally(() => {
      pendingTechnologyRequests.delete(technology);
    });
    
    try {
      return await requestPromise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tutorials by technology');
    }
  }
);

export const fetchTutorialById = createAsyncThunk(
  'tutorials/fetchTutorialById',
  async (tutorialId: string, { rejectWithValue }) => {
    try {
      const tutorial = await tutorialApiService.getTutorialById(tutorialId);
      return tutorial;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tutorial details');
    }
  }
);

export const fetchFeaturedTutorials = createAsyncThunk(
  'tutorials/fetchFeaturedTutorials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tutorialApiService.getFeaturedTutorials();
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch featured tutorials');
    }
  }
);

// Slice
const tutorialsSlice = createSlice({
  name: 'tutorials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<TutorialFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentTutorial: (state, action: PayloadAction<Tutorial | null>) => {
      state.currentTutorial = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch tutorials
    builder
      .addCase(fetchTutorials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tutorials = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: action.payload.limit
        };
        state.error = null;
      })
      .addCase(fetchTutorials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch tutorials by category
    builder
      .addCase(fetchTutorialsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorialsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tutorials = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: action.payload.limit
        };
        state.error = null;
      })
      .addCase(fetchTutorialsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch tutorials by technology
    builder
      .addCase(fetchTutorialsByTechnology.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorialsByTechnology.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tutorials = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: action.payload.limit
        };
        state.error = null;
      })
      .addCase(fetchTutorialsByTechnology.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch tutorial by ID
    builder
      .addCase(fetchTutorialById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTutorialById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTutorial = action.payload;
        state.error = null;
      })
      .addCase(fetchTutorialById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch featured tutorials
    builder
      .addCase(fetchFeaturedTutorials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedTutorials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tutorials = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: action.payload.limit
        };
        state.error = null;
      })
      .addCase(fetchFeaturedTutorials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentTutorial } = tutorialsSlice.actions;
export default tutorialsSlice.reducer;