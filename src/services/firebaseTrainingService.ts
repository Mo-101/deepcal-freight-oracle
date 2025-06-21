
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { trainingService } from './trainingService';

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "tokyo-scholar-356213.firebaseapp.com",
  projectId: "tokyo-scholar-356213",
  storageBucket: "tokyo-scholar-356213.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

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
  config: {
    dataSource: string;
    modelType: string;
    epochs: number;
    batchSize: number;
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

  // Start training job via Firebase Function
  async startTrainingJob(config: {
    dataSource: string;
    modelType: string;
    epochs: number;
    batchSize: number;
    weights?: any;
  }): Promise<FirebaseTrainingJob> {
    const startTraining = httpsCallable(functions, 'startTrainingJob');
    const result = await startTraining(config);
    return result.data as FirebaseTrainingJob;
  }

  // Monitor training job status
  subscribeToTrainingJob(jobId: string, callback: (job: FirebaseTrainingJob) => void): () => void {
    const jobRef = doc(db, 'training_jobs', jobId);
    return onSnapshot(jobRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as FirebaseTrainingJob);
      }
    });
  }

  // Upload CSV/Parquet data to Firebase Storage
  async uploadTrainingData(file: File, filename: string): Promise<string> {
    const storageRef = ref(storage, `training-data/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Get latest model weights
  async getLatestModelWeights(): Promise<any> {
    const weightsRef = doc(db, 'model_weights', 'latest');
    const weightsSnap = await getDoc(weightsRef);
    return weightsSnap.exists() ? weightsSnap.data() : null;
  }

  // Get training history
  async getTrainingHistory(): Promise<FirebaseTrainingJob[]> {
    const historyQuery = query(
      collection(db, 'training_jobs'),
      orderBy('startedAt', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(historyQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseTrainingJob));
  }
}

export const firebaseTrainingService = FirebaseTrainingService.getInstance();
