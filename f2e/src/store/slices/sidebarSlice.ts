import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  openMobile: boolean;
  collapsed: boolean;
}

const initialState: SidebarState = {
  isOpen: true,
  isMobile: false,
  openMobile: false,
  collapsed: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.openMobile = !state.openMobile;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.openMobile = action.payload;
    },
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
    closeMobileSidebar: (state) => {
      state.openMobile = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setMobile,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  toggleCollapsed,
  setCollapsed,
  closeMobileSidebar,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;