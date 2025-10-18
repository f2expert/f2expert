import { useState, useEffect, useCallback, useRef } from 'react';
import { trainerApiService, type Trainer, type TrainersResponse } from '../services';

// Track pending trainer API requests to prevent duplicates
const pendingTrainerRequests = new Map<string, Promise<unknown>>();

interface UseTrainersState {
  trainers: Trainer[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

export const useTrainers = () => {
  const [state, setState] = useState<UseTrainersState>({
    trainers: [],
    isLoading: false,
    error: null,
    total: 0
  });

  // Track if initial load has been attempted
  const initialLoadAttempted = useRef(false);

  const loadTrainers = useCallback(async () => {
    const requestKey = 'activeTrainers';
    
    // Check if this request is already pending
    if (pendingTrainerRequests.has(requestKey)) {
      return pendingTrainerRequests.get(requestKey);
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Create and track the request
    const requestPromise = (async () => {
      try {
        const response: TrainersResponse = await trainerApiService.getActiveTrainers();
        setState(prev => ({
          ...prev,
          trainers: response.data || [],
          total: response.total || 0,
          isLoading: false,
          error: null
        }));
        return response;
      } catch (error) {
        setState(prev => ({
          ...prev,
          trainers: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load trainers'
        }));
        throw error;
      }
    })();
    
    pendingTrainerRequests.set(requestKey, requestPromise);
    
    // Clean up completed request
    requestPromise.finally(() => {
      pendingTrainerRequests.delete(requestKey);
    });
    
    return requestPromise;
  }, []);

  // Load trainers on mount (only once)
  useEffect(() => {
    if (!initialLoadAttempted.current) {
      initialLoadAttempted.current = true;
      loadTrainers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    trainers: state.trainers,
    isLoading: state.isLoading,
    error: state.error,
    total: state.total,
    loadTrainers,
    clearError
  };
};

export default useTrainers;