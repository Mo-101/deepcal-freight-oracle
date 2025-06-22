
import { WeightVector } from '@/types/training';
import { NeuralNetwork, NeuralNetworkConfig } from './neuralNetwork';
import { TrainingDataGenerator, TrainingData } from './trainingDataGenerator';
import { MetricsCalculator, TrainingMetrics } from './metricsCalculator';

export type { TrainingData, TrainingMetrics };

export class RealTrainingEngine {
  private weights: WeightVector;
  private learningRate: number = 0.05;
  private bestWeights: WeightVector;
  private bestValidationLoss: number = Infinity;
  private patience: number = 10;
  private patienceCounter: number = 0;
  private epochCount: number = 0;
  
  private neuralNetwork: NeuralNetwork;
  private dataGenerator: TrainingDataGenerator;
  private metricsCalculator: MetricsCalculator;

  constructor(initialWeights: WeightVector) {
    // Normalize initial weights
    const sum = initialWeights.cost + initialWeights.time + initialWeights.reliability + initialWeights.risk;
    this.weights = {
      cost: initialWeights.cost / sum,
      time: initialWeights.time / sum,
      reliability: initialWeights.reliability / sum,
      risk: initialWeights.risk / sum
    };
    
    this.bestWeights = { ...this.weights };
    
    const networkConfig: NeuralNetworkConfig = {
      hiddenLayerSize: 8,
      learningRate: this.learningRate,
      momentum: 0.9
    };
    
    this.neuralNetwork = new NeuralNetwork(networkConfig);
    this.dataGenerator = new TrainingDataGenerator();
    this.metricsCalculator = new MetricsCalculator();
    
    console.log('Enhanced training engine initialized with weights:', this.weights);
  }

  trainStep(trainingData: TrainingData, validationData: TrainingData): TrainingMetrics {
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

    // Early stopping with improvement tracking
    if (valLoss < this.bestValidationLoss - 0.001) {
      this.bestValidationLoss = valLoss;
      this.bestWeights = { ...this.weights };
      this.patienceCounter = 0;
    } else {
      this.patienceCounter++;
    }

    // Adaptive learning rate scheduling
    if (this.patienceCounter > 3) {
      this.learningRate *= 0.95;
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
    return this.patienceCounter >= this.patience || this.epochCount >= 200;
  }
}
