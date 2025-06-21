
import { useEffect, useState, useRef, useCallback } from 'react';
import { firebaseTrainingService, TrainingStatus } from '../services/firebaseTrainingService';

export interface UseTrainingState {
  status?: TrainingStatus;
  error?: any;
  running: boolean;
  start: (params: Record<string, any>) => Promise<void>;
  simulate: (duration?: number) => void;
  reset: () => void;
}

export function useFirebaseTraining(): UseTrainingState {
  const [status, setStatus] = useState<TrainingStatus | undefined>(undefined);
  const [error, setError] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);

  // Start real backend training
  const start = useCallback(async (params: Record<string, any>) => {
    setRunning(true);
    setError(null);
    setStatus(undefined);
    try {
      const jobId = await firebaseTrainingService.startTraining(params);
      const stopMonitoring = await firebaseTrainingService.monitorTraining(jobId, (s) => {
        setStatus(s);
        if (s.completed) setRunning(false);
      });
      stopRef.current = stopMonitoring;
    } catch (e) {
      setError(e);
      setRunning(false);
    }
  }, []);

  // Simulate training for demo or dev mode
  const simulate = useCallback((duration = 10000) => {
    setRunning(true);
    setError(null);
    setStatus(undefined);
    firebaseTrainingService.simulateTraining(duration, (s) => {
      setStatus(s);
      if (s.completed) setRunning(false);
    });
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    setStatus(undefined);
    setError(null);
    setRunning(false);
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
  }, []);

  // Clean up polling/streaming on unmount
  useEffect(() => {
    return () => {
      if (stopRef.current) {
        stopRef.current();
      }
    };
  }, []);

  return { status, error, running, start, simulate, reset };
}
