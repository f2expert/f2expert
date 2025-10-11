import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  updateUser as updateUserAction,
  updateTeams as updateTeamsAction,
  addTeam as addTeamAction,
  removeTeam as removeTeamAction,
  updateNavMain as updateNavMainAction,
  addNavItem as addNavItemAction,
  removeNavItem as removeNavItemAction,
  setActiveNavItem as setActiveNavItemAction,
  updateContentId as updateContentIdAction,
  type Team,
  type NavItem,
  type SidebarUser,
} from '../store/slices/sidebarDataSlice';

export const useSidebarData = () => {
  const dispatch = useAppDispatch();
  const sidebarData = useAppSelector(state => state.sidebarData);

  // Helper function to find content by language and topic
  const findContentId = (language: string, topic: string): string | null => {
    const langNav = sidebarData.navMain.find(nav => 
      nav.title.toLowerCase() === language.toLowerCase()
    );
    
    if (langNav && langNav.items) {
      const topicItem = langNav.items.find(item => 
        item.title.toLowerCase() === topic.toLowerCase() ||
        item.url.includes(`/${language}/${topic}`)
      );
      
      return topicItem?.contentId || null;
    }
    
    return null;
  };

  // Helper function to find navigation item by language and topic
  const findNavItem = (language: string, topic: string) => {
    const langNav = sidebarData.navMain.find(nav => 
      nav.title.toLowerCase() === language.toLowerCase()
    );
    
    if (langNav && langNav.items) {
      return langNav.items.find(item => 
        item.title.toLowerCase() === topic.toLowerCase() ||
        item.url.includes(`/${language}/${topic}`)
      );
    }
    
    return null;
  };

  // Helper function to get all available languages
  const getAvailableLanguages = () => {
    return sidebarData.navMain.map(nav => ({
      title: nav.title,
      topics: nav.items?.map(item => ({
        title: item.title,
        url: item.url,
        contentId: item.contentId
      })) || []
    }));
  };

  // Memoize dispatch functions to prevent unnecessary re-renders
  const updateUser = useCallback((userData: Partial<SidebarUser>) => dispatch(updateUserAction(userData)), [dispatch]);
  const updateTeams = useCallback((teams: Team[]) => dispatch(updateTeamsAction(teams)), [dispatch]);
  const addTeam = useCallback((team: Team) => dispatch(addTeamAction(team)), [dispatch]);
  const removeTeam = useCallback((teamName: string) => dispatch(removeTeamAction(teamName)), [dispatch]);
  const updateNavMain = useCallback((navItems: NavItem[]) => dispatch(updateNavMainAction(navItems)), [dispatch]);
  const addNavItem = useCallback((navItem: NavItem) => dispatch(addNavItemAction(navItem)), [dispatch]);
  const removeNavItem = useCallback((navTitle: string) => dispatch(removeNavItemAction(navTitle)), [dispatch]);
  const setActiveNavItem = useCallback((navTitle: string) => dispatch(setActiveNavItemAction(navTitle)), [dispatch]);
  const updateContentId = useCallback((language: string, topic: string, contentId: string) => 
    dispatch(updateContentIdAction({ language, topic, contentId })), [dispatch]);

  return {
    // Data
    user: sidebarData.user,
    teams: sidebarData.teams,
    navMain: sidebarData.navMain,
    
    // Helper functions
    findContentId,
    findNavItem,
    getAvailableLanguages,
    
    // User actions
    updateUser,
    
    // Teams actions
    updateTeams,
    addTeam,
    removeTeam,
    
    // Navigation actions
    updateNavMain,
    addNavItem,
    removeNavItem,
    setActiveNavItem,
    updateContentId,
  };
};