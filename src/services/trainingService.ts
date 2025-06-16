
import axios from 'axios';
import { set, get } from 'idb-keyval';

export interface WeightMatrix {
  id: string;
  version: string;
  weights: {
    cost: number;
    time: number;
    reliability: number;
    risk: number;
  };
  neutrosophicParams: {
    truthThreshold: number;
    indeterminacyTolerance: number;
    falsityRejection: number;
  };
  topsisConfig: {
    distanceMetric: 'euclidean' | 'manhattan' | 'minkowski';
    normalizationMethod: 'vector' | 'linear' | 'minmax';
  };
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  createdAt: string;
  trainingData: {
    samplesUsed: number;
    syntheticRatio: number;
    sourceHash: string;
  };
}

export interface TrainingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  stage: 'preprocessing' | 'feature_extraction' | 'model_training' | 'validation' | 'deployment';
  startedAt: string;
  completedAt?: string;
  error?: string;
  metrics?: {
    samplesProcessed: number;
    epochsCompleted: number;
    currentLoss: number;
    validationAccuracy: number;
  };
}

class TrainingService {
  private static instance: TrainingService;
  private baseURL: string;
  private currentWeights: WeightMatrix | null = null;

  private constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-service.com/api' 
      : 'http://localhost:8000/api';
  }

  public static getInstance(): TrainingService {
    if (!TrainingService.instance) {
      TrainingService.instance = new TrainingService();
    }
    return TrainingService.instance;
  }

  /**
   * Start model retraining with latest data
   */
  async startRetraining(config?: {
    includeSynthetic: boolean;
    syntheticRatio: number;
    validationSplit: number;
  }): Promise<TrainingJob> {
    try {
      const trainingConfig = {
        includeSynthetic: config?.includeSynthetic ?? true,
        syntheticRatio: config?.syntheticRatio ?? 2.0,
        validationSplit: config?.validationSplit ?? 0.2,
        hyperparameters: {
          learningRate: 0.001,
          batchSize: 32,
          epochs: 100,
          earlyStoppingPatience: 10
        }
      };

      const response = await axios.post(`${this.baseURL}/training/start`, trainingConfig);
      const job: TrainingJob = response.data;
      
      // Cache job for offline access
      await set(`training-job-${job.id}`, job);
      
      return job;
    } catch (error) {
      console.error('Failed to start training:', error);
      throw new Error('Failed to start model retraining');
    }
  }

  /**
   * Get training job status
   */
  async getTrainingStatus(jobId: string): Promise<TrainingJob> {
    try {
      const response = await axios.get(`${this.baseURL}/training/jobs/${jobId}`);
      const job: TrainingJob = response.data;
      
      await set(`training-job-${jobId}`, job);
      return job;
    } catch (error) {
      // Fallback to cached data
      const cached = await get(`training-job-${jobId}`);
      if (cached) return cached;
      throw error;
    }
  }

  /**
   * Get latest weight matrix
   */
  async getLatestWeights(): Promise<WeightMatrix> {
    try {
      if (this.currentWeights) {
        return this.currentWeights;
      }

      // Try cache first
      const cached = await get('latest-weight-matrix');
      if (cached) {
        this.currentWeights = cached;
        return cached;
      }

      // Fetch from backend
      const response = await axios.get(`${this.baseURL}/training/weights/latest`);
      const weights: WeightMatrix = response.data;
      
      // Cache the weights
      this.currentWeights = weights;
      await set('latest-weight-matrix', weights);
      
      return weights;
    } catch (error) {
      console.error('Failed to get latest weights:', error);
      
      // Return default weights if all fails
      return {
        id: 'default',
        version: '1.0.0',
        weights: { cost: 0.35, time: 0.35, reliability: 0.2, risk: 0.1 },
        neutrosophicParams: {
          truthThreshold: 0.75,
          indeterminacyTolerance: 0.15,
          falsityRejection: 0.10
        },
        topsisConfig: {
          distanceMetric: 'euclidean',
          normalizationMethod: 'vector'
        },
        performance: { accuracy: 0.85, precision: 0.82, recall: 0.88, f1Score: 0.85 },
        createdAt: new Date().toISOString(),
        trainingData: { samplesUsed: 1000, syntheticRatio: 0, sourceHash: 'default' }
      };
    }
  }

  /**
   * Schedule periodic retraining
   */
  async schedulePeriodicTraining(schedule: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/training/schedule`, { schedule });
    } catch (error) {
      console.error('Failed to schedule training:', error);
      throw error;
    }
  }

  /**
   * Get training history
   */
  async getTrainingHistory(): Promise<WeightMatrix[]> {
    try {
      const response = await axios.get(`${this.baseURL}/training/history`);
      return response.data;
    } catch (error) {
      console.error('Failed to get training history:', error);
      return [];
    }
  }

  /**
   * Validate current model performance
   */
  async validateModel(): Promise<{
    accuracy: number;
    crossValidationScore: number;
    confusionMatrix: number[][];
    featureImportance: Record<string, number>;
  }> {
    try {
      const response = await axios.post(`${this.baseURL}/training/validate`);
      return response.data;
    } catch (error) {
      console.error('Failed to validate model:', error);
      throw error;
    }
  }

  /**
   * Update weights manually (for testing)
   */
  updateWeights(weights: WeightMatrix): void {
    this.currentWeights = weights;
    set('latest-weight-matrix', weights);
  }
}

export const trainingService = TrainingService.getInstance();
