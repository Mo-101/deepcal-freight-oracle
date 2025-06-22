
import { useState, useEffect } from 'react';
import { liveTrainingService, LiveTrainingJob } from '@/services/liveTrainingService';
import { WeightVector } from '@/types/training';
import { useToast } from '@/hooks/use-toast';

export function useLiveTraining() {
  const [currentJob, setCurrentJob] = useState<LiveTrainingJob | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to training updates
    const unsubscribe = liveTrainingService.onTrainingUpdate((job) => {
      setCurrentJob(job);
      setIsTraining(job.status === 'running');
      
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
      setCurrentJob(existingJob);
      setIsTraining(existingJob.status === 'running');
    }

    return unsubscribe;
  }, [toast]);

  const startTraining = async (weights: WeightVector, epochs: number = 100) => {
    try {
      const jobId = await liveTrainingService.startLiveTraining(weights, epochs);
      setIsTraining(true);
      
      toast({
        title: 'Live Training Started',
        description: 'Neural network is now learning from real data...',
      });
      
      return jobId;
    } catch (error) {
      toast({
        title: 'Failed to Start Training',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const stopTraining = () => {
    liveTrainingService.stopLiveTraining();
    setIsTraining(false);
    
    toast({
      title: 'Training Stopped',
      description: 'Neural network training has been halted',
    });
  };

  const getLatestWeights = async (): Promise<WeightVector | null> => {
    return await liveTrainingService.getLatestTrainedWeights();
  };

  return {
    currentJob,
    isTraining,
    startTraining,
    stopTraining,
    getLatestWeights,
  };
}
