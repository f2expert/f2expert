import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import coursesReducer from './slices/coursesSlice';
import userReducer from './slices/userSlice';
import sidebarReducer from './slices/sidebarSlice';
import sidebarDataReducer from './slices/sidebarDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    user: userReducer,
    sidebar: sidebarReducer,
    sidebarData: sidebarDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Infer the type of makeStore
export type AppStore = typeof store;