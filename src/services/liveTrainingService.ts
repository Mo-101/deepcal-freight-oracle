import { RealTrainingEngine, TrainingData, TrainingMetrics } from './training/realTrainingEngine';
import { TrainingDataGenerator } from './training/trainingDataGenerator';
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
  private dataGenerator: TrainingDataGenerator;

  private constructor() {
    this.dataGenerator = new TrainingDataGenerator();
  }

  public static getInstance(): LiveTrainingService {
    if (!LiveTrainingService.instance) {
      LiveTrainingService.instance = new LiveTrainingService();
    }
    return LiveTrainingService.instance;
  }

  async startLiveTraining(initialWeights: WeightVector, epochs: number = 150): Promise<string> {
    if (this.currentJob?.status === 'running') {
      throw new Error('Training already in progress');
    }

    console.log('Starting enhanced live training session...');
    console.log('Initial weights:', initialWeights);
    console.log('Training epochs:', epochs);

    try {
      this.stopTrainingLoop();
      
      const jobId = `enhanced-training-${Date.now()}`;
      
      // Generate initial training data
      const allData = this.dataGenerator.generateAdvancedTrainingData(400, false);
      const { training, validation } = this.dataGenerator.splitData(allData);
      
      console.log(`Training set: ${training.features.length} samples`);
      console.log(`Validation set: ${validation.features.length} samples`);
      
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
          learningRate: 0.05
        },
        weights: { ...initialWeights },
        startTime: Date.now()
      };

      console.log('Enhanced training job initialized:', this.currentJob.id);

      // Enhanced training loop with adaptive data generation
      this.trainingInterval = setInterval(() => {
        if (!this.currentJob || !this.trainingEngine || this.currentJob.status !== 'running') {
          return;
        }

        try {
          // Regenerate data every 10 epochs for curriculum learning
          let currentTraining = training;
          let currentValidation = validation;
          
          if (this.currentJob.currentEpoch % 10 === 0 && this.currentJob.currentEpoch > 0) {
            console.log(`Regenerating training data at epoch ${this.currentJob.currentEpoch}...`);
            const newData = this.dataGenerator.generateAdvancedTrainingData(400, true);
            const split = this.dataGenerator.splitData(newData);
            currentTraining = split.training;
            currentValidation = split.validation;
          }

          // Perform training step
          const metrics = this.trainingEngine.trainStep(currentTraining, currentValidation);
          this.currentJob.currentEpoch++;
          
          this.currentJob.metrics = {
            ...metrics,
            epoch: this.currentJob.currentEpoch
          };
          this.currentJob.weights = this.trainingEngine.getWeights();

          // Enhanced progress logging
          if (this.currentJob.currentEpoch % 5 === 0) {
            console.log(`Epoch ${this.currentJob.currentEpoch}/${this.currentJob.totalEpochs}: ` +
              `Loss=${metrics.loss.toFixed(4)}, Acc=${metrics.accuracy.toFixed(2)}%, ` +
              `Val Acc=${metrics.validationAccuracy.toFixed(2)}%, LR=${metrics.learningRate.toFixed(5)}`);
          }

          // Save progress periodically
          if (this.currentJob.currentEpoch % 20 === 0) {
            set(`training-job-${jobId}`, this.currentJob).catch(console.error);
          }

          // Notify callbacks
          this.callbacks.forEach(callback => {
            try {
              callback(this.currentJob!);
            } catch (error) {
              console.error('Callback error:', error);
            }
          });

          // Check completion
          if (this.currentJob.currentEpoch >= epochs || this.trainingEngine.shouldStop()) {
            this.completeLiveTraining();
          }

        } catch (error) {
          console.error('Training step failed:', error);
          this.failLiveTraining(error instanceof Error ? error.message : 'Unknown training error');
        }
      }, 300);

      console.log('Enhanced live training started successfully!');
      return jobId;

    } catch (error) {
      console.error('Failed to start enhanced training:', error);
      throw new Error(`Enhanced training initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private completeLiveTraining(): void {
    if (!this.currentJob || !this.trainingEngine) return;

    console.log('Completing enhanced live training...');
    this.currentJob.status = 'completed';
    this.currentJob.weights = this.trainingEngine.getBestWeights();
    
    set('latest-trained-weights', this.currentJob.weights).catch(console.error);
    set(`training-job-${this.currentJob.id}`, this.currentJob).catch(console.error);

    this.callbacks.forEach(callback => {
      try {
        callback(this.currentJob!);
      } catch (error) {
        console.error('Completion callback error:', error);
      }
    });

    this.stopTrainingLoop();
    console.log('Enhanced live training completed successfully!');
  }

  private failLiveTraining(error: string): void {
    if (!this.currentJob) return;

    console.error('Training failed:', error);
    this.currentJob.status = 'failed';
    
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
      console.log('Stopping enhanced live training...');
      this.currentJob.status = 'stopped';
      
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
      console.log('Enhanced training loop stopped');
    }
  }

  getCurrentJob(): LiveTrainingJob | null {
    return this.currentJob;
  }

  onTrainingUpdate(callback: (job: LiveTrainingJob) => void): () => void {
    this.callbacks.push(callback);
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
