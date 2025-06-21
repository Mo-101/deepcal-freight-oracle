
import { useState, useEffect } from 'react';
import { firebaseTrainingService, FirebaseTrainingJob } from '@/services/firebaseTrainingService';
import { useToast } from '@/hooks/use-toast';

export function useFirebaseTraining() {
  const [currentJob, setCurrentJob] = useState<FirebaseTrainingJob | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<FirebaseTrainingJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Start a new training job
  const startTraining = async (config: {
    dataSource: string;
    modelType: string;
    epochs: number;
    batchSize: number;
    weights?: any;
  }) => {
    setIsLoading(true);
    try {
      const job = await firebaseTrainingService.startTrainingJob(config);
      setCurrentJob(job);
      
      // Subscribe to job updates
      const unsubscribe = firebaseTrainingService.subscribeToTrainingJob(job.id, (updatedJob) => {
        setCurrentJob(updatedJob);
        
        if (updatedJob.status === 'completed') {
          toast({
            title: 'Training Completed',
            description: `Model training finished with ${updatedJob.metrics?.accuracy?.toFixed(2)}% accuracy`,
          });
        } else if (updatedJob.status === 'failed') {
          toast({
            title: 'Training Failed',
            description: updatedJob.error || 'Training job encountered an error',
            variant: 'destructive',
          });
        }
      });

      // Clean up subscription when job completes or fails
      const checkJobComplete = setInterval(() => {
        if (currentJob && ['completed', 'failed'].includes(currentJob.status)) {
          clearInterval(checkJobComplete);
          unsubscribe();
        }
      }, 1000);

      return job;
    } catch (error) {
      console.error('Failed to start training:', error);
      toast({
        title: 'Training Failed to Start',
        description: 'Could not initialize training job',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload training data
  const uploadData = async (file: File, filename: string) => {
    try {
      const url = await firebaseTrainingService.uploadTrainingData(file, filename);
      toast({
        title: 'Data Uploaded',
        description: `${filename} uploaded successfully`,
      });
      return url;
    } catch (error) {
      console.error('Failed to upload data:', error);
      toast({
        title: 'Upload Failed',
        description: 'Could not upload training data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Load training history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await firebaseTrainingService.getTrainingHistory();
        setTrainingHistory(history);
      } catch (error) {
        console.error('Failed to load training history:', error);
      }
    };
    loadHistory();
  }, []);

  return {
    currentJob,
    trainingHistory,
    isLoading,
    startTraining,
    uploadData,
  };
}
