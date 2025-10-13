import { useState, useEffect, useCallback } from 'react';
import { trainerApiService, type Trainer, type TrainersResponse } from '../services';

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

  const loadTrainers = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response: TrainersResponse = await trainerApiService.getActiveTrainers();
      setState(prev => ({
        ...prev,
        trainers: response.data || [],
        total: response.total || 0,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        trainers: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load trainers'
      }));
    }
  }, []);

  // Load trainers on mount
  useEffect(() => {
    loadTrainers();
  }, [loadTrainers]);

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