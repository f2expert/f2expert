import { useState, useEffect, useCallback, useRef } from 'react';
import { tutorialApiService, type Tutorial, type TutorialsResponse, type TutorialFilters } from '../services';

// Track pending tutorial API requests to prevent duplicates
const pendingTutorialRequests = new Map<string, Promise<unknown>>();

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

  // Track if initial load has been attempted
  const initialLoadAttempted = useRef(false);

  const loadTutorials = useCallback(async (filters?: TutorialFilters) => {
    const filtersKey = JSON.stringify(filters || {});
    
    // Check if this request is already pending
    if (pendingTutorialRequests.has(filtersKey)) {
      return pendingTutorialRequests.get(filtersKey);
    }
    
    console.log('useTutorials: Starting to load tutorials with filters:', filters);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Create and track the request
    const requestPromise = (async () => {
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
        return response;
      } catch (error) {
        console.error('useTutorials: Error loading tutorials:', error);
        setState(prev => ({
          ...prev,
          tutorials: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load tutorials'
        }));
        throw error;
      }
    })();
    
    pendingTutorialRequests.set(filtersKey, requestPromise);
    
    // Clean up completed request
    requestPromise.finally(() => {
      pendingTutorialRequests.delete(filtersKey);
    });
    
    return requestPromise;
  }, []);

  // Load tutorials on mount (only once)
  useEffect(() => {
    if (!initialLoadAttempted.current) {
      initialLoadAttempted.current = true;
      loadTutorials(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // loadTutorials is stable due to concurrent call prevention

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