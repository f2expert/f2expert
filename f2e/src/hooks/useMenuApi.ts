import { useState, useEffect, useCallback } from 'react';
import { menuApiService, type MenuItem } from '../services/menuApi';
import { useAppDispatch } from '../store/hooks';
import { updateNavMain, type NavItem, type IconName } from '../store/slices/sidebarDataSlice';
import { testMenuApi } from '../utils/testMenuApi';

// Helper function to convert MenuItem to NavItem
const convertMenuItemToNavItem = (menuItem: MenuItem): NavItem => {
  // Map common icon names to available IconName types
  const iconMap: Record<string, IconName> = {
    'home': 'Home',
    'file': 'FileText',
    'contact': 'Contact',
    'courses': 'FileStack',
    'video': 'FileVideo2',
    'tutorial': 'FileVideo2',
    'nodejs': 'FaNodeJs',
    'react': 'FaReact',
    'css': 'TbFileTypeCss',
    'html': 'GrHtml5',
    'database': 'PiDatabaseThin',
    'javascript': 'FaReact',
    'js': 'FaReact',
  };

  // Try to match the icon or use a default
  const getIcon = (iconString?: string): IconName => {
    if (!iconString) return 'FileText';
    
    const lowerIcon = iconString.toLowerCase();
    return iconMap[lowerIcon] || 'FileText';
  };

  return {
    title: menuItem.title,
    url: menuItem.url,
    icon: getIcon(menuItem.icon),
    isActive: menuItem.isActive,
    children: menuItem.children,
  };
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
      
      setMenuItems(items);
      
      // Convert MenuItem[] to NavItem[] for Redux store
      const navItems = items.map(convertMenuItemToNavItem);
      dispatch(updateNavMain(navItems));
      
      console.log('Menu loaded successfully:', items);
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
      
      setMenuItems(items);
      
      // Convert MenuItem[] to NavItem[] for Redux store
      const navItems = items.map(convertMenuItemToNavItem);
      dispatch(updateNavMain(navItems));
      
      console.log('User menu loaded successfully:', items);
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