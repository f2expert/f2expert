import { useState, useEffect, useCallback } from 'react';
import { tutorialApiService, type Tutorial } from '../services';

interface UseTutorialState {
  tutorial: Tutorial | null;
  isLoading: boolean;
  error: string | null;
}

export const useTutorial = (tutorialId?: string) => {
  const [state, setState] = useState<UseTutorialState>({
    tutorial: null,
    isLoading: false,
    error: null
  });

  const loadTutorial = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('useTutorial: Loading tutorial with ID:', id);
      console.log('useTutorial: API URL will be: http://localhost:5000/api/tutorials/' + id);
      
      const tutorial = await tutorialApiService.getTutorialById(id);
            
      setState(prev => ({
        ...prev,
        tutorial,
        isLoading: false
      }));
      
      return tutorial;
    } catch (error) {
      console.error('useTutorial: Error loading tutorial:', error);
      console.error('useTutorial: Error details:', {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        tutorialId: id
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tutorial';
      
      setState(prev => ({
        ...prev,
        tutorial: null,
        isLoading: false,
        error: errorMessage
      }));
      
      return null;
    }
  }, []);

  // Load tutorial automatically if ID is provided
  useEffect(() => {
    if (tutorialId) {
      loadTutorial(tutorialId);
    }
  }, [tutorialId, loadTutorial]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearTutorial = useCallback(() => {
    setState(prev => ({ ...prev, tutorial: null, error: null }));
  }, []);

  return {
    tutorial: state.tutorial,
    isLoading: state.isLoading,
    error: state.error,
    loadTutorial,
    clearError,
    clearTutorial
  };
};

export default useTutorial;