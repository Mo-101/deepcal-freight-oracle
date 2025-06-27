
// Engine Status Management Hook
// Handles the status tracking for symbolic intelligence processing

import { useState, useCallback } from 'react';
import { EngineStatus } from '@/types/symbolicIntelligence';

export const useEngineStatus = () => {
  const [status, setStatus] = useState<EngineStatus>({
    phase: 'idle',
    progress: 0,
    currentOperation: 'Ready',
    neutrosophicProgress: 0,
    topsisProgress: 0,
    greyProgress: 0
  });

  const updateStatus = useCallback((newStatus: Partial<EngineStatus>) => {
    setStatus(prev => ({ ...prev, ...newStatus }));
  }, []);

  const resetStatus = useCallback(() => {
    setStatus({
      phase: 'idle',
      progress: 0,
      currentOperation: 'Ready',
      neutrosophicProgress: 0,
      topsisProgress: 0,
      greyProgress: 0
    });
  }, []);

  const simulateProgress = useCallback(async (
    progressKey: 'neutrosophicProgress' | 'topsisProgress' | 'greyProgress',
    delay: number = 150
  ) => {
    for (let i = 0; i <= 100; i += 33) {
      setStatus(prev => ({ ...prev, [progressKey]: i }));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }, []);

  return {
    status,
    updateStatus,
    resetStatus,
    simulateProgress
  };
};
