import { useState, useEffect, useCallback } from 'react';
import { menuApiService, type MenuItem } from '../services/menuApi';
import { useAppDispatch } from '../store/hooks';
import { updateNavMain, type NavItem } from '../store/slices/sidebarDataSlice';
import { testMenuApi } from '../utils/testMenuApi';
import { debugMenuIcons } from '../utils/debugMenuIcons';

// Helper function to convert MenuItem to NavItem with dynamic icon support
const convertMenuItemToNavItem = (menuItem: MenuItem): NavItem => {
  console.log('Converting menu item:', menuItem);

  const convertedItem: NavItem = {
    title: menuItem.title,
    path: menuItem.path,
    icon: menuItem.icon || 'FileText', // Use icon directly from API or fallback
    isActive: menuItem.isActive,
    menuType: menuItem.menuType, // Include menuType from API
    children: menuItem.children,
  };

  console.log('Converted menu item:', {
    original: menuItem,
    converted: convertedItem
  });

  return convertedItem;
};

export const useMenuApi = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Load menu for specific role
  const loadMenuByRole = useCallback(async (role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading menu for role:', role);
      
      // Test API connectivity in development mode
      if (import.meta.env?.NODE_ENV === 'development') {
        const testResult = await testMenuApi(role);
        console.log('Menu API test result:', testResult);
      }
      
      const items = await menuApiService.getMenuByRole(role);
      
      // Debug icons in development mode
      if (import.meta.env?.NODE_ENV === 'development') {
        debugMenuIcons(items);
      }
      
      setMenuItems(items);
      
      // Convert MenuItem[] to NavItem[] for Redux store
      const navItems = items.map(convertMenuItemToNavItem);
      dispatch(updateNavMain(navItems));
      
      console.log('Menu loaded successfully:', items);
      console.log('Converted nav items:', navItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load menu';
      setError(errorMessage);
      console.error('Failed to load menu:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Load menu for current authenticated user
  const loadUserMenu = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('Menu already loading, skipping duplicate call');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading menu for current user');
      const items = await menuApiService.getUserMenu();
      
      // Debug icons in development mode
      if (import.meta.env?.NODE_ENV === 'development') {
        debugMenuIcons(items);
      }
      
      setMenuItems(items);
      
      // Convert MenuItem[] to NavItem[] for Redux store
      const navItems = items.map(convertMenuItemToNavItem);
      dispatch(updateNavMain(navItems));
      
      console.log('User menu loaded successfully:', items);
      console.log('Converted nav items:', navItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user menu';
      setError(errorMessage);
      console.error('Failed to load user menu:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, isLoading]); // Added isLoading to dependencies for protection

  // Auto-load menu on hook initialization (only once)
  useEffect(() => {
    let isMounted = true;
    
    const initializeMenu = async () => {
      if (isMounted) {
        await loadUserMenu();
      }
    };
    
    initializeMenu();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to run only once on mount

  // Reload menu when user authentication changes (with debouncing)
  useEffect(() => {
    let timeoutId: number;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('Authentication changed, scheduling menu reload');
        
        // Debounce to prevent multiple rapid calls
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          loadUserMenu();
        }, 500); // Wait 500ms before reloading
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty to prevent recreation

  return {
    menuItems,
    isLoading,
    error,
    loadMenuByRole,
    loadUserMenu,
    refreshMenu: loadUserMenu, // Alias for manual refresh
  };
};

export default useMenuApi;