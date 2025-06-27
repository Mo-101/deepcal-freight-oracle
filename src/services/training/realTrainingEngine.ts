
import { WeightVector } from '@/types/training';
import { NeuralNetwork, NeuralNetworkConfig } from './neuralNetwork';
import { TrainingDataGenerator } from './trainingDataGenerator';
import { MetricsCalculator } from './metricsCalculator';

// Fix: Use proper type exports for isolatedModules
export type { TrainingData, TrainingMetadata } from './trainingDataGenerator';
export type { TrainingMetrics } from './metricsCalculator';

export class RealTrainingEngine {
  private weights: WeightVector;
  private learningRate: number = 0.05;
  private bestWeights: WeightVector;
  private bestValidationLoss: number = Infinity;
  private patience: number = 30; // Increased patience
  private patienceCounter: number = 0;
  private epochCount: number = 0;
  private targetEpochs: number = 150;
  
  private neuralNetwork: NeuralNetwork;
  private dataGenerator: TrainingDataGenerator;
  private metricsCalculator: MetricsCalculator;

  constructor(initialWeights: WeightVector, targetEpochs: number = 150) {
    // Normalize initial weights
    const sum = initialWeights.cost + initialWeights.time + initialWeights.reliability + initialWeights.risk;
    this.weights = {
      cost: initialWeights.cost / sum,
      time: initialWeights.time / sum,
      reliability: initialWeights.reliability / sum,
      risk: initialWeights.risk / sum
    };
    
    this.bestWeights = { ...this.weights };
    this.targetEpochs = targetEpochs;
    
    const networkConfig: NeuralNetworkConfig = {
      hiddenLayerSize: 8,
      learningRate: this.learningRate,
      momentum: 0.9
    };
    
    this.neuralNetwork = new NeuralNetwork(networkConfig);
    this.dataGenerator = new TrainingDataGenerator();
    this.metricsCalculator = new MetricsCalculator();
    
    console.log('Enhanced training engine initialized with weights:', this.weights);
    console.log('Target epochs:', this.targetEpochs);
  }

  trainStep(trainingData: import('./trainingDataGenerator').TrainingData, validationData: import('./trainingDataGenerator').TrainingData): import('./metricsCalculator').TrainingMetrics {
    if (trainingData.features.length === 0 || validationData.features.length === 0) {
      throw new Error('Training or validation data is empty');
    }

    this.epochCount++;

    // Compute gradients
    const gradients = this.metricsCalculator.computeGradients(trainingData, this.neuralNetwork, this.weights);

    // Adaptive learning rate based on epoch
    const adaptiveLR = this.learningRate * Math.pow(0.99, this.epochCount / 10);

    // Update weights using neural network
    this.weights = this.neuralNetwork.updateWeights(this.weights, gradients, adaptiveLR);

    // Calculate enhanced metrics
    const trainLoss = this.metricsCalculator.calculateLoss(trainingData, this.neuralNetwork, this.weights);
    const trainAccuracy = this.metricsCalculator.calculateAccuracy(trainingData, this.neuralNetwork, this.weights);
    const valLoss = this.metricsCalculator.calculateLoss(validationData, this.neuralNetwork, this.weights);
    const valAccuracy = this.metricsCalculator.calculateAccuracy(validationData, this.neuralNetwork, this.weights);

    // Improved early stopping with more lenient criteria
    const improvement = this.bestValidationLoss - valLoss;
    if (improvement > 0.0001) { // Lower threshold for improvement
      this.bestValidationLoss = valLoss;
      this.bestWeights = { ...this.weights };
      this.patienceCounter = 0;
      console.log(`Epoch ${this.epochCount}: New best validation loss: ${valLoss.toFixed(4)}`);
    } else {
      this.patienceCounter++;
    }

    // Only apply early stopping after significant training
    if (this.patienceCounter > 5 && this.epochCount < this.targetEpochs * 0.3) {
      // Reset patience counter if we're still early in training
      this.patienceCounter = 0;
      console.log(`Epoch ${this.epochCount}: Resetting patience counter (early training phase)`);
    }

    // Adaptive learning rate scheduling
    if (this.patienceCounter > 10) {
      this.learningRate *= 0.98;
    }

    return {
      epoch: this.epochCount,
      loss: trainLoss,
      accuracy: trainAccuracy,
      validationLoss: valLoss,
      validationAccuracy: valAccuracy,
      learningRate: adaptiveLR
    };
  }

  getWeights(): WeightVector {
    return { ...this.weights };
  }

  getBestWeights(): WeightVector {
    return { ...this.bestWeights };
  }

  shouldStop(): boolean {
    // Only stop if we've reached target epochs OR if we're really stuck
    const reachedTarget = this.epochCount >= this.targetEpochs;
    const reallyStuck = this.patienceCounter >= this.patience && this.epochCount > this.targetEpochs * 0.5;
    
    if (reachedTarget) {
      console.log(`Training completed: reached target epochs (${this.targetEpochs})`);
    } else if (reallyStuck) {
      console.log(`Training stopped early: patience exceeded after ${this.epochCount} epochs`);
    }
    
    return reachedTarget || reallyStuck;
  }

  getProgress(): number {
    return Math.min(100, (this.epochCount / this.targetEpochs) * 100);
  }
}
