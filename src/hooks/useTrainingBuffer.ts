import { useState, useCallback } from 'react';

interface TrainingEntry {
  query: string;
  response: string;
  timestamp: Date;
  confidence: number;
}

export const useTrainingBuffer = () => {
  const [trainingBuffer, setTrainingBuffer] = useState<TrainingEntry[]>([]);
  const maxSize = 100;

  const addToTrainingBuffer = useCallback((entry: TrainingEntry) => {
    setTrainingBuffer(prev => {
      const newBuffer = [...prev, entry];
      // Keep only the most recent entries
      if (newBuffer.length > maxSize) {
        return newBuffer.slice(-maxSize);
      }
      return newBuffer;
    });
  }, []);

  const clearTrainingBuffer = useCallback(() => {
    setTrainingBuffer([]);
  }, []);

  const trainingBufferStatus = {
    count: trainingBuffer.length,
    maxSize
  };

  return {
    trainingBuffer,
    trainingBufferStatus,
    addToTrainingBuffer,
    clearTrainingBuffer
  };
};
