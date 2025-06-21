
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
    // Connect to FastAPI backend
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-domain.com/api' 
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
        datasetId: 'latest', // Use latest available dataset
        weights: this.currentWeights?.weights || { cost: 0.35, time: 0.35, reliability: 0.2, risk: 0.1 },
        modelType: 'neutrosophic',
        includeSynthetic: config?.includeSynthetic ?? true,
        syntheticRatio: config?.syntheticRatio ?? 2.0,
        validationSplit: config?.validationSplit ?? 0.2
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
   * Optimize weights using Groq AI
   */
  async optimizeWeightsWithGroq(historicalData: any[], optimizationGoal: string = 'balanced'): Promise<WeightMatrix> {
    try {
      const currentWeights = await this.getLatestWeights();
      
      const request = {
        currentWeights: currentWeights.weights,
        historicalData: historicalData.slice(0, 10), // Send sample of historical data
        optimizationGoal
      };

      const response = await axios.post(`${this.baseURL}/groq/optimize-weights`, request);
      const optimizedWeights = response.data;

      // Create new weight matrix with optimized values
      const newMatrix: WeightMatrix = {
        ...currentWeights,
        id: crypto.randomUUID(),
        version: `${parseFloat(currentWeights.version) + 0.1}`,
        weights: optimizedWeights,
        createdAt: new Date().toISOString()
      };

      // Cache the new weights
      this.currentWeights = newMatrix;
      await set('latest-weight-matrix', newMatrix);

      return newMatrix;
    } catch (error) {
      console.error('Failed to optimize weights with Groq:', error);
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
   * Get training statistics
   */
  async getTrainingStats(): Promise<{
    totalJobs: number;
    completedJobs: number;
    avgAccuracy: number;
    lastTraining: string;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/training/stats`);
      return response.data;
    } catch (error) {
      console.error('Failed to get training stats:', error);
      return {
        totalJobs: 0,
        completedJobs: 0,
        avgAccuracy: 0,
        lastTraining: 'Never'
      };
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
