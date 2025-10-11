# Redux Toolkit Setup with Async Thunks

This project has been configured with Redux Toolkit for state management, including async thunks for handling asynchronous operations.

## 📁 File Structure

```
src/
├── store/
│   ├── index.ts          # Store configuration
│   ├── hooks.ts          # Typed Redux hooks
│   └── slices/
│       ├── authSlice.ts      # Authentication state
│       ├── coursesSlice.ts   # Courses state
│       └── userSlice.ts      # User profile state
└── components/
    └── examples/
        └── ReduxExample.tsx  # Usage example
```

## 🚀 Installation

Redux Toolkit and React Redux have been installed:
```bash
npm install @reduxjs/toolkit react-redux
```

## 🔧 Configuration

### Store Setup (`src/store/index.ts`)
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks (`src/store/hooks.ts`)
```typescript
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## 📝 Usage Examples

### Basic Component Usage
```typescript
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, logoutUser } from '../store/slices/authSlice';

const MyComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ 
        email: 'user@example.com', 
        password: 'password123' 
      })).unwrap();
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={() => dispatch(logoutUser())}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

## 🔒 Auth Slice Features

### Available Actions
- `loginUser(credentials)` - Authenticate user
- `logoutUser()` - Sign out user
- `registerUser(userData)` - Create new account
- `checkAuthStatus()` - Verify authentication
- `updateUser(updates)` - Update user data
- `clearError()` - Clear error messages

### State Structure
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}
```

## 📚 Courses Slice Features

### Available Actions
- `fetchCourses()` - Load all courses
- `fetchCourseById(id)` - Get specific course
- `enrollInCourse(courseId)` - Enroll in course
- `updateCourseProgress(data)` - Update learning progress
- `setFilters(filters)` - Apply course filters
- `clearFilters()` - Reset filters

### State Structure
```typescript
interface CoursesState {
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
```

## 👤 User Slice Features

### Available Actions
- `fetchUserProfile(userId)` - Load user profile
- `updateUserProfile(updates)` - Update profile
- `fetchUserAchievements(userId)` - Load achievements
- `updateUserPreferences(prefs)` - Update settings
- `uploadUserAvatar(file)` - Upload profile picture

### State Structure
```typescript
interface UserState {
  profile: UserProfile | null;
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
}
```

## 🎯 Async Thunk Patterns

### Basic Async Thunk
```typescript
export const fetchData = createAsyncThunk(
  'slice/fetchData',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await api.getData(params);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error message');
    }
  }
);
```

### Using Async Thunks in Components
```typescript
// With error handling
const handleAsyncAction = async () => {
  try {
    const result = await dispatch(someAsyncThunk(params)).unwrap();
    // Handle success
    console.log('Success:', result);
  } catch (error) {
    // Handle error
    console.error('Error:', error);
  }
};

// Without unwrap (errors handled in slice)
const handleAsyncAction = () => {
  dispatch(someAsyncThunk(params));
};
```

## 🔄 State Updates

### Pending State
```typescript
.addCase(asyncThunk.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
```

### Fulfilled State
```typescript
.addCase(asyncThunk.fulfilled, (state, action) => {
  state.isLoading = false;
  state.data = action.payload;
  state.error = null;
})
```

### Rejected State
```typescript
.addCase(asyncThunk.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
```

## 📱 Integration with React

The Redux store has been integrated into the React app via the Provider in `main.tsx`:

```typescript
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

## 🎨 Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector`
2. **Handle loading states**: Show loading indicators during async operations
3. **Error handling**: Always handle rejected async thunks
4. **Unwrap promises**: Use `.unwrap()` for better error handling in components
5. **Clear errors**: Provide ways to clear error states
6. **Normalize state**: Keep state flat and normalized
7. **Async thunk naming**: Use descriptive names like `slice/actionName`

## 🔧 Development Tools

Redux DevTools are automatically configured and will work with the Redux DevTools Extension in your browser.

## 📊 Performance Tips

1. Use `createSelector` for complex derived state
2. Avoid creating new objects in selectors
3. Use `useCallback` for event handlers
4. Consider using `RTK Query` for advanced data fetching needs

This setup provides a robust foundation for state management in your React application with full TypeScript support and excellent developer experience.