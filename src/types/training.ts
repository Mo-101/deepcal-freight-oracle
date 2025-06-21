
export interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

export interface SystemStatus {
  neutroEngine: 'connected' | 'warning' | 'error';
  firestore: 'connected' | 'warning' | 'error';
  groqAPI: 'connected' | 'warning' | 'error';
  trainingPipeline: 'connected' | 'warning' | 'error';
}

export interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}
