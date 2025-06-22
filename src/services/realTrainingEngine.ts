
import { WeightVector } from '@/types/training';

export interface TrainingData {
  features: number[][];
  targets: number[];
  metadata: {
    cost: number;
    time: number;
    reliability: number;
    risk: number;
    actualOutcome: 'success' | 'failure' | 'delayed';
  }[];
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
}

export class RealTrainingEngine {
  private weights: WeightVector;
  private learningRate: number = 0.01; // Increased for faster convergence
  private momentum: number = 0.9;
  private velocities: WeightVector;
  private bestWeights: WeightVector;
  private bestValidationLoss: number = Infinity;
  private patience: number = 15;
  private patienceCounter: number = 0;

  constructor(initialWeights: WeightVector) {
    // Normalize initial weights
    const sum = initialWeights.cost + initialWeights.time + initialWeights.reliability + initialWeights.risk;
    this.weights = {
      cost: initialWeights.cost / sum,
      time: initialWeights.time / sum,
      reliability: initialWeights.reliability / sum,
      risk: initialWeights.risk / sum
    };
    
    this.velocities = { cost: 0, time: 0, reliability: 0, risk: 0 };
    this.bestWeights = { ...this.weights };
    
    console.log('Training engine initialized with weights:', this.weights);
  }

  // Sigmoid activation function
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); // Clamp to prevent overflow
  }

  // Neural network prediction with sigmoid activation
  private predict(metadata: { cost: number; time: number; reliability: number; risk: number }): number {
    const normalizedCost = Math.min(1, metadata.cost / 1000);
    const normalizedTime = Math.min(1, metadata.time / 30);
    const normalizedReliability = metadata.reliability / 100;
    const normalizedRisk = metadata.risk / 100;

    // Weighted sum with bias
    const linearOutput = 
      this.weights.cost * normalizedCost +
      this.weights.time * normalizedTime +
      this.weights.reliability * normalizedReliability +
      this.weights.risk * normalizedRisk;

    return this.sigmoid(linearOutput);
  }

  // Calculate gradients using backpropagation
  private calculateGradients(data: TrainingData): WeightVector {
    const gradients: WeightVector = { cost: 0, time: 0, reliability: 0, risk: 0 };
    const n = data.features.length;

    if (n === 0) {
      return gradients;
    }

    for (let i = 0; i < n; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      const error = prediction - actual;

      // Sigmoid derivative
      const sigmoidDerivative = prediction * (1 - prediction);
      const delta = error * sigmoidDerivative;

      // Calculate partial derivatives
      const normalizedCost = Math.min(1, data.metadata[i].cost / 1000);
      const normalizedTime = Math.min(1, data.metadata[i].time / 30);
      const normalizedReliability = data.metadata[i].reliability / 100;
      const normalizedRisk = data.metadata[i].risk / 100;

      gradients.cost += (delta * normalizedCost) / n;
      gradients.time += (delta * normalizedTime) / n;
      gradients.reliability += (delta * normalizedReliability) / n;
      gradients.risk += (delta * normalizedRisk) / n;
    }

    return gradients;
  }

  // Training step with momentum and weight constraints
  trainStep(trainingData: TrainingData, validationData: TrainingData): TrainingMetrics {
    if (trainingData.features.length === 0 || validationData.features.length === 0) {
      throw new Error('Training or validation data is empty');
    }

    const gradients = this.calculateGradients(trainingData);

    // Update velocities with momentum
    this.velocities.cost = this.momentum * this.velocities.cost - this.learningRate * gradients.cost;
    this.velocities.time = this.momentum * this.velocities.time - this.learningRate * gradients.time;
    this.velocities.reliability = this.momentum * this.velocities.reliability - this.learningRate * gradients.reliability;
    this.velocities.risk = this.momentum * this.velocities.risk - this.learningRate * gradients.risk;

    // Update weights
    this.weights.cost += this.velocities.cost;
    this.weights.time += this.velocities.time;
    this.weights.reliability += this.velocities.reliability;
    this.weights.risk += this.velocities.risk;

    // Ensure weights remain positive and sum to 1
    const minWeight = 0.01;
    this.weights.cost = Math.max(minWeight, this.weights.cost);
    this.weights.time = Math.max(minWeight, this.weights.time);
    this.weights.reliability = Math.max(minWeight, this.weights.reliability);
    this.weights.risk = Math.max(minWeight, this.weights.risk);

    const weightSum = this.weights.cost + this.weights.time + this.weights.reliability + this.weights.risk;
    this.weights.cost /= weightSum;
    this.weights.time /= weightSum;
    this.weights.reliability /= weightSum;
    this.weights.risk /= weightSum;

    // Calculate metrics
    const trainLoss = this.calculateLoss(trainingData);
    const trainAccuracy = this.calculateAccuracy(trainingData);
    const valLoss = this.calculateLoss(validationData);
    const valAccuracy = this.calculateAccuracy(validationData);

    // Early stopping with best model tracking
    if (valLoss < this.bestValidationLoss) {
      this.bestValidationLoss = valLoss;
      this.bestWeights = { ...this.weights };
      this.patienceCounter = 0;
    } else {
      this.patienceCounter++;
    }

    // Adaptive learning rate
    if (this.patienceCounter > 5) {
      this.learningRate *= 0.95;
    }

    return {
      epoch: 0, // Will be set by caller
      loss: trainLoss,
      accuracy: trainAccuracy,
      validationLoss: valLoss,
      validationAccuracy: valAccuracy,
      learningRate: this.learningRate
    };
  }

  private calculateLoss(data: TrainingData): number {
    if (data.features.length === 0) return 1.0;
    
    let totalLoss = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      // Binary cross-entropy loss
      const loss = -(actual * Math.log(Math.max(1e-15, prediction)) + (1 - actual) * Math.log(Math.max(1e-15, 1 - prediction)));
      totalLoss += loss;
    }
    return totalLoss / data.features.length;
  }

  private calculateAccuracy(data: TrainingData): number {
    if (data.features.length === 0) return 0;
    
    let correct = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      // Binary classification with 0.5 threshold
      const predictedClass = prediction > 0.5 ? 1 : 0;
      if (predictedClass === actual) correct++;
    }
    return (correct / data.features.length) * 100;
  }

  getWeights(): WeightVector {
    return { ...this.weights };
  }

  getBestWeights(): WeightVector {
    return { ...this.bestWeights };
  }

  shouldStop(): boolean {
    return this.patienceCounter >= this.patience;
  }
}
