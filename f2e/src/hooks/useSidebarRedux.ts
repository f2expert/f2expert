import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  toggleSidebar,
  setSidebarOpen,
  setMobile,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  toggleCollapsed as toggleCollapsedAction,
  setCollapsed as setCollapsedAction,
  closeMobileSidebar,
} from '../store/slices/sidebarSlice';

export const useSidebarRedux = () => {
  const dispatch = useAppDispatch();
  const sidebarState = useAppSelector(state => state.sidebar);

  // Memoize dispatch functions to prevent unnecessary re-renders
  const toggle = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
  const setOpen = useCallback((open: boolean) => dispatch(setSidebarOpen(open)), [dispatch]);
  const setIsMobile = useCallback((isMobile: boolean) => dispatch(setMobile(isMobile)), [dispatch]);
  const toggleMobile = useCallback(() => dispatch(toggleMobileSidebar()), [dispatch]);
  const setOpenMobile = useCallback((openMobile: boolean) => dispatch(setMobileSidebarOpen(openMobile)), [dispatch]);
  const toggleCollapsed = useCallback(() => dispatch(toggleCollapsedAction()), [dispatch]);
  const setCollapsed = useCallback((collapsed: boolean) => dispatch(setCollapsedAction(collapsed)), [dispatch]);
  const closeMobile = useCallback(() => dispatch(closeMobileSidebar()), [dispatch]);

  return {
    // State
    open: sidebarState?.isOpen ?? true,  // Fallback to true
    isMobile: sidebarState?.isMobile ?? false,  // Fallback to false
    openMobile: sidebarState?.openMobile ?? false,  // Fallback to false
    collapsed: sidebarState?.collapsed ?? false,  // Fallback to false
    
    // Actions (matching the old SidebarProvider API)
    toggle,
    setOpen,
    setIsMobile,
    toggleMobile,
    setOpenMobile,
    toggleCollapsed,
    setCollapsed,
    closeMobile,
  };
};