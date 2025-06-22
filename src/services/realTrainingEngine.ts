
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
  private learningRate: number = 0.001;
  private momentum: number = 0.9;
  private velocities: WeightVector;
  private bestWeights: WeightVector;
  private bestValidationLoss: number = Infinity;
  private patience: number = 10;
  private patienceCounter: number = 0;

  constructor(initialWeights: WeightVector) {
    this.weights = { ...initialWeights };
    this.velocities = { cost: 0, time: 0, reliability: 0, risk: 0 };
    this.bestWeights = { ...initialWeights };
  }

  // Real backpropagation with gradient descent
  private calculateGradients(data: TrainingData): WeightVector {
    const gradients: WeightVector = { cost: 0, time: 0, reliability: 0, risk: 0 };
    const n = data.features.length;

    for (let i = 0; i < n; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      const error = prediction - actual;

      // Calculate partial derivatives
      const costFeature = data.metadata[i].cost / 100; // Normalize
      const timeFeature = data.metadata[i].time / 100;
      const reliabilityFeature = data.metadata[i].reliability / 100;
      const riskFeature = data.metadata[i].risk / 100;

      gradients.cost += (2 * error * costFeature) / n;
      gradients.time += (2 * error * timeFeature) / n;
      gradients.reliability += (2 * error * reliabilityFeature) / n;
      gradients.risk += (2 * error * riskFeature) / n;
    }

    return gradients;
  }

  // Neural network prediction function
  private predict(metadata: { cost: number; time: number; reliability: number; risk: number }): number {
    const normalizedCost = metadata.cost / 100;
    const normalizedTime = metadata.time / 100;
    const normalizedReliability = metadata.reliability / 100;
    const normalizedRisk = metadata.risk / 100;

    // Weighted sum with sigmoid activation
    const linearOutput = 
      this.weights.cost * normalizedCost +
      this.weights.time * normalizedTime +
      this.weights.reliability * normalizedReliability +
      this.weights.risk * normalizedRisk;

    return 1 / (1 + Math.exp(-linearOutput)); // Sigmoid activation
  }

  // Real training step with momentum
  trainStep(trainingData: TrainingData, validationData: TrainingData): TrainingMetrics {
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

    // Ensure weights sum to 1 (normalization constraint)
    const weightSum = this.weights.cost + this.weights.time + this.weights.reliability + this.weights.risk;
    this.weights.cost /= weightSum;
    this.weights.time /= weightSum;
    this.weights.reliability /= weightSum;
    this.weights.risk /= weightSum;

    // Calculate losses and accuracies
    const trainLoss = this.calculateLoss(trainingData);
    const trainAccuracy = this.calculateAccuracy(trainingData);
    const valLoss = this.calculateLoss(validationData);
    const valAccuracy = this.calculateAccuracy(validationData);

    // Early stopping logic
    if (valLoss < this.bestValidationLoss) {
      this.bestValidationLoss = valLoss;
      this.bestWeights = { ...this.weights };
      this.patienceCounter = 0;
    } else {
      this.patienceCounter++;
    }

    // Adaptive learning rate
    if (this.patienceCounter > 3) {
      this.learningRate *= 0.8;
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
    let totalLoss = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      totalLoss += Math.pow(prediction - actual, 2);
    }
    return totalLoss / data.features.length;
  }

  private calculateAccuracy(data: TrainingData): number {
    let correct = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      // Binary classification threshold
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
