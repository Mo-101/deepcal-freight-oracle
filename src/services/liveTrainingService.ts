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
  private dataGenerationSeed: number = 0;

  private constructor() {}

  public static getInstance(): LiveTrainingService {
    if (!LiveTrainingService.instance) {
      LiveTrainingService.instance = new LiveTrainingService();
    }
    return LiveTrainingService.instance;
  }

  // Enhanced data generation with XGBoost-style features
  private generateAdvancedTrainingData(samples: number = 400, epochBased: boolean = false): TrainingData {
    console.log(`Generating ${samples} advanced training samples (epoch-based: ${epochBased})...`);
    const data: TrainingData = { features: [], targets: [], metadata: [] };
    
    // Use epoch-based seed for evolving data distribution
    const seed = epochBased ? this.dataGenerationSeed++ : 42;
    
    for (let i = 0; i < samples; i++) {
      // More realistic shipping data with correlations
      const complexity = epochBased ? Math.sin(seed * 0.1) * 0.3 + 0.7 : 1.0;
      
      // Generate correlated features
      const baseReliability = 60 + Math.random() * 35;
      const baseRisk = Math.max(5, Math.min(60, 65 - baseReliability + Math.random() * 20));
      
      const cost = 150 + Math.random() * 850 * complexity; // $150-$1000
      const time = Math.max(1, 2 + Math.random() * 28 * complexity); // 2-30 days
      const reliability = Math.max(50, Math.min(99, baseReliability + (Math.random() - 0.5) * 15));
      const risk = Math.max(1, Math.min(70, baseRisk + (Math.random() - 0.5) * 15));
      
      // Enhanced success probability with more factors
      const reliabilityFactor = (reliability / 100) ** 1.2;
      const riskFactor = (1 - risk / 100) ** 0.8;
      const timeFactor = time < 7 ? 0.95 : time < 14 ? 0.85 : time < 21 ? 0.7 : 0.5;
      const costFactor = cost < 300 ? 0.9 : cost < 600 ? 0.75 : cost < 900 ? 0.6 : 0.4;
      
      // Add seasonal and trend factors
      const seasonalFactor = 0.8 + 0.4 * Math.sin((seed + i) * 0.1);
      const trendFactor = epochBased ? 0.9 + 0.2 * Math.tanh(seed * 0.05) : 1.0;
      
      const successProbability = Math.min(0.98, Math.max(0.02,
        (reliabilityFactor * 0.35) + 
        (riskFactor * 0.25) + 
        (timeFactor * 0.2) + 
        (costFactor * 0.1) + 
        (seasonalFactor * 0.05) + 
        (trendFactor * 0.05)
      ));
      
      // Add noise for realistic variation
      const noisyProbability = Math.max(0, Math.min(1, successProbability + (Math.random() - 0.5) * 0.15));
      const outcome = Math.random() < noisyProbability ? 1 : 0;
      
      // Enhanced feature representation
      const features = [
        cost / 1000,
        time / 30,
        reliability / 100,
        risk / 100,
        // Additional derived features
        (cost * time) / 30000, // cost-time interaction
        Math.log(cost + 1) / 10, // log-cost
        reliability / (risk + 1), // reliability-risk ratio
        Math.sqrt(time) / 6 // sqrt-time
      ];
      
      data.features.push(features);
      data.targets.push(outcome);
      data.metadata.push({
        cost,
        time,
        reliability,
        risk,
        actualOutcome: outcome === 1 ? 'success' : (Math.random() < 0.2 ? 'delayed' : 'failure')
      });
    }
    
    console.log(`Generated ${data.features.length} samples with ${(data.targets.reduce((a, b) => a + b, 0) / data.targets.length * 100).toFixed(1)}% success rate`);
    return data;
  }

  private splitData(data: TrainingData): { training: TrainingData; validation: TrainingData } {
    const splitIndex = Math.floor(data.features.length * 0.75); // 75/25 split for better validation
    
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
      this.dataGenerationSeed = Date.now() % 1000;
      
      // Generate initial training data
      const allData = this.generateAdvancedTrainingData(400, false);
      const { training, validation } = this.splitData(allData);
      
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
            const newData = this.generateAdvancedTrainingData(400, true);
            const split = this.splitData(newData);
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
      }, 300); // Faster updates at 300ms

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
    
    // Save final results
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
