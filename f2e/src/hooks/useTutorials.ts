import { useState, useEffect, useCallback } from 'react';
import { tutorialApiService, type Tutorial, type TutorialsResponse, type TutorialFilters } from '../services';

interface UseTutorialsState {
  tutorials: Tutorial[];
  isLoading: boolean;
  error: string | null;
  total: number;
  categories: string[];
}

export const useTutorials = (initialFilters?: TutorialFilters) => {
  const [state, setState] = useState<UseTutorialsState>({
    tutorials: [],
    isLoading: false,
    error: null,
    total: 0,
    categories: []
  });

  const loadTutorials = useCallback(async (filters?: TutorialFilters) => {
    console.log('useTutorials: Starting to load tutorials with filters:', filters);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('useTutorials: Calling tutorialApiService.getTutorials()');
      const response: TutorialsResponse = await tutorialApiService.getTutorials(filters);
      console.log('useTutorials: Received response:', response);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map(tutorial => tutorial.category))
      );
      console.log('useTutorials: Extracted categories:', uniqueCategories);
      
      setState(prev => ({
        ...prev,
        tutorials: response.data || [],
        total: response.total || 0,
        categories: uniqueCategories,
        isLoading: false,
        error: null
      }));
      
      console.log('useTutorials: Successfully set tutorial data, count:', response.data?.length);
    } catch (error) {
      console.error('useTutorials: Error loading tutorials:', error);
      setState(prev => ({
        ...prev,
        tutorials: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load tutorials'
      }));
    }
  }, []);

  // Load tutorials on mount
  useEffect(() => {
    loadTutorials(initialFilters);
  }, [loadTutorials, initialFilters]);

  const getTutorialById = useCallback(async (id: string): Promise<Tutorial | null> => {
    try {
      return await tutorialApiService.getTutorialById(id);
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      return null;
    }
  }, []);

  const getFeaturedTutorials = useCallback(async (): Promise<Tutorial[]> => {
    try {
      const response = await tutorialApiService.getFeaturedTutorials();
      return response.data;
    } catch (error) {
      console.error('Error fetching featured tutorials:', error);
      return [];
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshTutorials = useCallback((filters?: TutorialFilters) => {
    loadTutorials(filters);
  }, [loadTutorials]);

  return {
    tutorials: state.tutorials,
    isLoading: state.isLoading,
    error: state.error,
    total: state.total,
    categories: state.categories,
    loadTutorials,
    getTutorialById,
    getFeaturedTutorials,
    clearError,
    refreshTutorials
  };
};

export default useTutorials;