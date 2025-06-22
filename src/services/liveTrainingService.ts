
import { RealTrainingEngine, TrainingData, TrainingMetrics } from './realTrainingEngine';
import { WeightVector } from '@/types/training';
import { get, set } from 'idb-keyval';

export interface LiveTrainingJob {
  id: string;
  status: 'running' | 'completed' | 'failed' | 'stopped';
  currentEpoch: number;
  totalEpochs: number;
  metrics: TrainingMetrics;
  weights: WeightVector;
  startTime: number;
}

class LiveTrainingService {
  private static instance: LiveTrainingService;
  private trainingEngine: RealTrainingEngine | null = null;
  private currentJob: LiveTrainingJob | null = null;
  private trainingInterval: NodeJS.Timeout | null = null;
  private callbacks: ((job: LiveTrainingJob) => void)[] = [];

  private constructor() {}

  public static getInstance(): LiveTrainingService {
    if (!LiveTrainingService.instance) {
      LiveTrainingService.instance = new LiveTrainingService();
    }
    return LiveTrainingService.instance;
  }

  // Generate guaranteed training data
  private generateTrainingData(samples: number = 300): TrainingData {
    console.log(`Generating ${samples} training samples...`);
    const data: TrainingData = { features: [], targets: [], metadata: [] };
    
    for (let i = 0; i < samples; i++) {
      // Generate realistic shipping data with proper correlations
      const cost = 200 + Math.random() * 800; // $200-$1000
      const time = 3 + Math.random() * 22; // 3-25 days
      const reliability = 60 + Math.random() * 40; // 60-100%
      const risk = 5 + Math.random() * 55; // 5-60%
      
      // Create realistic success probability based on shipping logistics
      const reliabilityFactor = reliability / 100;
      const riskFactor = 1 - (risk / 100);
      const timeFactor = time < 10 ? 0.9 : time < 20 ? 0.7 : 0.5;
      const costFactor = cost < 500 ? 0.8 : cost < 750 ? 0.6 : 0.4;
      
      const successProbability = (reliabilityFactor * 0.4) + (riskFactor * 0.3) + (timeFactor * 0.2) + (costFactor * 0.1);
      const outcome = Math.random() < successProbability ? 1 : 0;
      
      data.features.push([cost / 1000, time / 30, reliability / 100, risk / 100]);
      data.targets.push(outcome);
      data.metadata.push({
        cost,
        time,
        reliability,
        risk,
        actualOutcome: outcome === 1 ? 'success' : 'failure'
      });
    }
    
    console.log(`Generated ${data.features.length} training samples successfully`);
    return data;
  }

  private splitData(data: TrainingData): { training: TrainingData; validation: TrainingData } {
    const splitIndex = Math.floor(data.features.length * 0.8);
    
    return {
      training: {
        features: data.features.slice(0, splitIndex),
        targets: data.targets.slice(0, splitIndex),
        metadata: data.metadata.slice(0, splitIndex)
      },
      validation: {
        features: data.features.slice(splitIndex),
        targets: data.targets.slice(splitIndex),
        metadata: data.metadata.slice(splitIndex)
      }
    };
  }

  async startLiveTraining(initialWeights: WeightVector, epochs: number = 100): Promise<string> {
    if (this.currentJob?.status === 'running') {
      throw new Error('Training already in progress');
    }

    console.log('Starting live training session...');
    console.log('Initial weights:', initialWeights);
    console.log('Training epochs:', epochs);

    try {
      // Stop any existing training
      this.stopTrainingLoop();

      const jobId = `live-training-${Date.now()}`;
      
      // Generate fresh training data
      const allData = this.generateTrainingData(300);
      const { training, validation } = this.splitData(allData);
      
      console.log(`Training set: ${training.features.length} samples`);
      console.log(`Validation set: ${validation.features.length} samples`);
      
      // Initialize training engine
      this.trainingEngine = new RealTrainingEngine(initialWeights);
      
      this.currentJob = {
        id: jobId,
        status: 'running',
        currentEpoch: 0,
        totalEpochs: epochs,
        metrics: {
          epoch: 0,
          loss: 1.0,
          accuracy: 50.0,
          validationLoss: 1.0,
          validationAccuracy: 50.0,
          learningRate: 0.001
        },
        weights: { ...initialWeights },
        startTime: Date.now()
      };

      console.log('Training job initialized:', this.currentJob.id);

      // Start real-time training loop
      this.trainingInterval = setInterval(() => {
        if (!this.currentJob || !this.trainingEngine || this.currentJob.status !== 'running') {
          return;
        }

        try {
          // Perform actual training step
          const metrics = this.trainingEngine.trainStep(training, validation);
          this.currentJob.currentEpoch++;
          
          // Update job with real metrics
          this.currentJob.metrics = {
            ...metrics,
            epoch: this.currentJob.currentEpoch
          };
          this.currentJob.weights = this.trainingEngine.getWeights();

          // Save progress to IndexedDB
          set(`training-job-${jobId}`, this.currentJob).catch(console.error);

          // Notify all callbacks with updated job
          this.callbacks.forEach(callback => {
            try {
              callback(this.currentJob!);
            } catch (error) {
              console.error('Callback error:', error);
            }
          });

          // Log training progress
          console.log(`Epoch ${this.currentJob.currentEpoch}/${this.currentJob.totalEpochs}: Loss=${metrics.loss.toFixed(4)}, Acc=${metrics.accuracy.toFixed(2)}%, Val Acc=${metrics.validationAccuracy.toFixed(2)}%`);

          // Check completion conditions
          if (this.currentJob.currentEpoch >= epochs || this.trainingEngine.shouldStop()) {
            this.completeLiveTraining();
          }

        } catch (error) {
          console.error('Training step failed:', error);
          this.failLiveTraining(error instanceof Error ? error.message : 'Unknown training error');
        }
      }, 500); // Update every 500ms for smooth live updates

      console.log('Live training started successfully!');
      return jobId;

    } catch (error) {
      console.error('Failed to start training:', error);
      throw new Error(`Training initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private completeLiveTraining(): void {
    if (!this.currentJob || !this.trainingEngine) return;

    console.log('Completing live training...');
    this.currentJob.status = 'completed';
    this.currentJob.weights = this.trainingEngine.getBestWeights();
    
    // Save final results
    set('latest-trained-weights', this.currentJob.weights).catch(console.error);
    set(`training-job-${this.currentJob.id}`, this.currentJob).catch(console.error);

    // Notify callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(this.currentJob!);
      } catch (error) {
        console.error('Completion callback error:', error);
      }
    });

    this.stopTrainingLoop();
    console.log('Live training completed successfully!');
  }

  private failLiveTraining(error: string): void {
    if (!this.currentJob) return;

    console.error('Training failed:', error);
    this.currentJob.status = 'failed';
    
    // Notify callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(this.currentJob!);
      } catch (error) {
        console.error('Failure callback error:', error);
      }
    });

    this.stopTrainingLoop();
  }

  stopLiveTraining(): void {
    if (this.currentJob?.status === 'running') {
      console.log('Stopping live training...');
      this.currentJob.status = 'stopped';
      
      // Notify callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(this.currentJob!);
        } catch (error) {
          console.error('Stop callback error:', error);
        }
      });
    }
    this.stopTrainingLoop();
  }

  private stopTrainingLoop(): void {
    if (this.trainingInterval) {
      clearInterval(this.trainingInterval);
      this.trainingInterval = null;
      console.log('Training loop stopped');
    }
  }

  getCurrentJob(): LiveTrainingJob | null {
    return this.currentJob;
  }

  onTrainingUpdate(callback: (job: LiveTrainingJob) => void): () => void {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  async getLatestTrainedWeights(): Promise<WeightVector | null> {
    try {
      const weights = await get('latest-trained-weights');
      return weights || null;
    } catch (error) {
      console.error('Failed to load weights:', error);
      return null;
    }
  }
}

export const liveTrainingService = LiveTrainingService.getInstance();
