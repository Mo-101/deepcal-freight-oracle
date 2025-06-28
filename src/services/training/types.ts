// Centralized types for all training backends

export interface WeightMatrix {
  id: string;
  version: string;
  weights: {
    cost: number;
    time: number;
    reliability: number;
    risk: number;
  };
  neutrosophicParams?: {
    truthThreshold: number;
    indeterminacyTolerance: number;
    falsityRejection: number;
  };
  topsisConfig?: {
    distanceMetric: 'euclidean' | 'manhattan' | 'minkowski';
    normalizationMethod: 'vector' | 'linear' | 'minmax';
  };
  performance?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  createdAt: string;
  trainingData?: {
    samplesUsed: number;
    syntheticRatio: number;
    sourceHash: string;
  };
}

export interface TrainingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'stopped';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  metrics?: any;
  config?: any;
  [key: string]: any;
}

export interface TrainingBackend {
  startTrainingJob(config: any): Promise<TrainingJob>;
  getTrainingStatus(jobId: string): Promise<TrainingJob>;
  getLatestWeights(): Promise<WeightMatrix>;
  getTrainingHistory(): Promise<TrainingJob[]>;
  getTrainingStats(): Promise<any>;
}
