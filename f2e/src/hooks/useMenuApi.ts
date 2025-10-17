import { useState, useEffect, useCallback } from 'react';
import { menuApiService, type MenuItem } from '../services/menuApi';
import { useAppDispatch } from '../store/hooks';
import { updateNavMain, type NavItem, type IconName } from '../store/slices/sidebarDataSlice';
import { testMenuApi } from '../utils/testMenuApi';
import { debugMenuIcons } from '../utils/debugMenuIcons';

// Helper function to convert MenuItem to NavItem
const convertMenuItemToNavItem = (menuItem: MenuItem): NavItem => {
  // Enhanced icon mapping to handle various API response formats
  const iconMap: Record<string, IconName> = {
    // Direct icon names (as they appear in iconMap)
    'home': 'Home',
    'filetext': 'FileText',
    'contact': 'Contact',
    'filestack': 'FileStack',
    'filevideo2': 'FileVideo2',
    'fanodejs': 'FaNodeJs',
    'fareact': 'FaReact',
    'tbfiletypecss': 'TbFileTypeCss',
    'grhtml5': 'GrHtml5',
    'pidatabasethin': 'PiDatabaseThin',
    
    // Common variations and aliases
    'file': 'FileText',
    'text': 'FileText',
    'document': 'FileText',
    'courses': 'FileStack',
    'course': 'FileStack',
    'stack': 'FileStack',
    'video': 'FileVideo2',
    'tutorial': 'FileVideo2',
    'tutorials': 'FileVideo2',
    'play': 'FileVideo2',
    'nodejs': 'FaNodeJs',
    'node': 'FaNodeJs',
    'react': 'FaReact',
    'reactjs': 'FaReact',
    'javascript': 'FaReact',
    'js': 'FaReact',
    'css': 'TbFileTypeCss',
    'styles': 'TbFileTypeCss',
    'stylesheet': 'TbFileTypeCss',
    'html': 'GrHtml5',
    'html5': 'GrHtml5',
    'markup': 'GrHtml5',
    'database': 'PiDatabaseThin',
    'db': 'PiDatabaseThin',
    'data': 'PiDatabaseThin',
    'storage': 'PiDatabaseThin',
    
    // Technology specific mappings
    'frontend': 'FaReact',
    'backend': 'FaNodeJs',
    'fullstack': 'FileStack',
    'web': 'GrHtml5',
    'programming': 'FileText',
    'coding': 'FileText',
  };

  // Enhanced icon matching function
  const getIcon = (iconString?: string): IconName => {
    if (!iconString) {
      console.warn('No icon provided, using default FileText');
      return 'FileText';
    }
    
    console.log('Processing icon:', iconString);
    
    // Try exact match first
    if (iconString in iconMap) {
      console.log('Direct match found for icon:', iconString, '→', iconMap[iconString as keyof typeof iconMap]);
      return iconMap[iconString as keyof typeof iconMap];
    }
    
    // Try lowercase match
    const lowerIcon = iconString.toLowerCase();
    if (lowerIcon in iconMap) {
      console.log('Lowercase match found for icon:', iconString, '→', iconMap[lowerIcon]);
      return iconMap[lowerIcon];
    }
    
    // Try without special characters and spaces
    const cleanIcon = lowerIcon.replace(/[-_\s]/g, '');
    if (cleanIcon in iconMap) {
      console.log('Clean match found for icon:', iconString, '→', iconMap[cleanIcon]);
      return iconMap[cleanIcon];
    }
    
    // Try partial matches for common patterns
    for (const [key, value] of Object.entries(iconMap)) {
      if (lowerIcon.includes(key) || key.includes(lowerIcon)) {
        console.log('Partial match found for icon:', iconString, '→', value);
        return value;
      }
    }
    
    console.warn('No icon match found for:', iconString, 'using default FileText');
    return 'FileText';
  };

  const convertedItem = {
    title: menuItem.title,
    path: menuItem.path,
    icon: getIcon(menuItem.icon),
    isActive: menuItem.isActive,
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
  }, [dispatch]);

  // Auto-load menu on hook initialization
  useEffect(() => {
    loadUserMenu();
  }, [loadUserMenu]);

  // Reload menu when user authentication changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('Authentication changed, reloading menu');
        loadUserMenu();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadUserMenu]);

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