
import { useState, useEffect } from 'react';
import { liveTrainingService, LiveTrainingJob } from '@/services/liveTrainingService';
import { WeightVector } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

export function useLiveTraining() {
  const [currentJob, setCurrentJob] = useState<LiveTrainingJob | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up live training hook...');
    
    // Subscribe to training updates
    const unsubscribe = liveTrainingService.onTrainingUpdate((job) => {
      console.log('Training update received:', job.status, job.currentEpoch);
      setCurrentJob(job);
      setIsTraining(job.status === 'running');
      setError(null);
      
      if (job.status === 'completed') {
        toast({
          title: 'Training Completed!',
          description: `Model achieved ${job.metrics.validationAccuracy.toFixed(1)}% validation accuracy`,
        });
      } else if (job.status === 'failed') {
        toast({
          title: 'Training Failed',
          description: 'Neural network training encountered an error',
          variant: 'destructive',
        });
      }
    });

    // Check for existing job
    const existingJob = liveTrainingService.getCurrentJob();
    if (existingJob) {
      console.log('Found existing training job:', existingJob.status);
      setCurrentJob(existingJob);
      setIsTraining(existingJob.status === 'running');
    }

    return unsubscribe;
  }, [toast]);

  const startTraining = async (weights: WeightVector, epochs: number = 100) => {
    console.log('Starting training with weights:', weights);
    setError(null);
    
    try {
      // Validate weights
      const weightSum = weights.cost + weights.time + weights.reliability + weights.risk;
      if (Math.abs(weightSum - 1.0) > 0.01) {
        throw new Error('Weights must sum to 1.0');
      }

      const jobId = await liveTrainingService.startLiveTraining(weights, epochs);
      setIsTraining(true);
      
      toast({
        title: 'Live Training Started',
        description: 'Neural network is now learning from real data...',
      });
      
      console.log('Training started successfully with job ID:', jobId);
      return jobId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to start training:', errorMessage);
      setError(errorMessage);
      
      toast({
        title: 'Failed to Start Training',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const stopTraining = () => {
    console.log('Stopping training...');
    liveTrainingService.stopLiveTraining();
    setIsTraining(false);
    setError(null);
    
    toast({
      title: 'Training Stopped',
      description: 'Neural network training has been halted',
    });
  };

  const getLatestWeights = async (): Promise<WeightVector | null> => {
    try {
      return await liveTrainingService.getLatestTrainedWeights();
    } catch (error) {
      console.error('Failed to get latest weights:', error);
      return null;
    }
  };

  return {
    currentJob,
    isTraining,
    error,
    startTraining,
    stopTraining,
    getLatestWeights,
  };
}
