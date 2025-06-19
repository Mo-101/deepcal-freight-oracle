
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { syntheticDataEngine } from './syntheticDataEngine';
import { csvDataEngine } from './csvDataEngine';

// Firebase config - only initialize if credentials are available
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Check if Firebase config is available
const isFirebaseConfigured = firebaseConfig.projectId && firebaseConfig.apiKey;

let app: any = null;
let db: any = null;
let functions: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    functions = getFunctions(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export interface FirebaseTrainingJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  stage: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  metrics?: {
    accuracy: number;
    loss: number;
    epochsCompleted: number;
    samplesProcessed: number;
  };
  dataConfig?: {
    realSamples: number;
    syntheticSamples: number;
    syntheticRatio: number;
    includedDatasets: string[];
  };
}

class FirebaseTrainingService {
  private static instance: FirebaseTrainingService;

  private constructor() {}

  public static getInstance(): FirebaseTrainingService {
    if (!FirebaseTrainingService.instance) {
      FirebaseTrainingService.instance = new FirebaseTrainingService();
    }
    return FirebaseTrainingService.instance;
  }

  async startTrainingJob(config: {
    dataSource: string;
    modelType: string;
    epochs: number;
    batchSize: number;
    weights?: any;
  }): Promise<FirebaseTrainingJob> {
    try {
      // Get combined dataset stats for training
      const combinedStats = syntheticDataEngine.getEnhancedStatistics();
      const combinedData = syntheticDataEngine.getCombinedShipments();
      
      const trainingConfig = {
        ...config,
        dataConfig: {
          realSamples: combinedStats.realShipments,
          syntheticSamples: combinedStats.syntheticShipments,
          syntheticRatio: combinedStats.syntheticRatio,
          totalSamples: combinedData.length,
          includedDatasets: Array.from(syntheticDataEngine['syntheticDatasets'].keys())
        }
      };

      if (!isFirebaseConfigured || !functions) {
        // Simulate Firebase training job for demo purposes
        const mockJob: FirebaseTrainingJob = {
          id: `job_${Date.now()}`,
          status: 'pending',
          progress: 0,
          stage: 'Initializing',
          startedAt: new Date().toISOString(),
          dataConfig: trainingConfig.dataConfig
        };
        
        console.log('Demo mode: Firebase training job created locally:', mockJob);
        return mockJob;
      }

      // Call Firebase Function to start training
      const startTraining = httpsCallable(functions, 'startTrainingJob');
      const result = await startTraining(trainingConfig);
      
      return result.data as FirebaseTrainingJob;
    } catch (error) {
      console.error('Failed to start Firebase training job:', error);
      throw error;
    }
  }

  subscribeToTrainingJob(jobId: string, callback: (job: FirebaseTrainingJob) => void): () => void {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured, cannot subscribe to training job');
      return () => {}; // Return empty unsubscribe function
    }

    const unsubscribe = onSnapshot(
      doc(db, 'training_jobs', jobId),
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as FirebaseTrainingJob);
        }
      },
      (error) => {
        console.error('Error listening to training job:', error);
      }
    );

    return unsubscribe;
  }

  async uploadTrainingData(file: File, filename: string): Promise<string> {
    try {
      if (!isFirebaseConfigured) {
        console.log('Demo mode: Simulating training data upload for:', filename);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `demo://uploads/${filename}`;
      }

      // This would upload to Firebase Storage and return the download URL
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', filename);
      
      console.log('Uploading training data:', filename);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return `gs://your-bucket/${filename}`;
    } catch (error) {
      console.error('Failed to upload training data:', error);
      throw error;
    }
  }

  async getTrainingHistory(): Promise<FirebaseTrainingJob[]> {
    if (!isFirebaseConfigured || !db) {
      console.log('Demo mode: Returning empty training history');
      return [];
    }
    
    // This would fetch from Firestore
    return [];
  }

  async syncSyntheticDataToTraining(): Promise<void> {
    try {
      // Get all synthetic datasets
      const combinedData = syntheticDataEngine.getCombinedShipments();
      const stats = syntheticDataEngine.getEnhancedStatistics();
      
      if (!isFirebaseConfigured || !db) {
        console.log('Demo mode: Synthetic data sync completed locally', {
          realSamples: stats.realShipments,
          syntheticSamples: stats.syntheticShipments,
          totalSamples: combinedData.length,
          syntheticRatio: stats.syntheticRatio
        });
        return;
      }

      // Update training data collection in Firestore
      await addDoc(collection(db, 'training_datasets'), {
        type: 'combined',
        realSamples: stats.realShipments,
        syntheticSamples: stats.syntheticShipments,
        totalSamples: combinedData.length,
        syntheticRatio: stats.syntheticRatio,
        dataQuality: stats.dataQuality,
        privacyMetrics: stats.privacyMetrics,
        createdAt: serverTimestamp(),
        status: 'ready'
      });
      
      console.log('Synthetic data synced to training pipeline');
    } catch (error) {
      console.error('Failed to sync synthetic data:', error);
      throw error;
    }
  }
}

export const firebaseTrainingService = FirebaseTrainingService.getInstance();
