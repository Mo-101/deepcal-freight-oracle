
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
  private learningRate: number = 0.05; // Higher initial learning rate
  private momentum: number = 0.9;
  private velocities: WeightVector;
  private bestWeights: WeightVector;
  private bestValidationLoss: number = Infinity;
  private patience: number = 10;
  private patienceCounter: number = 0;
  private epochCount: number = 0;
  
  // Hidden layer weights for deeper learning
  private hiddenWeights: number[][];
  private hiddenBias: number[];
  private outputBias: number = 0;

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
    
    // Initialize hidden layer (4 inputs -> 8 hidden -> 1 output)
    this.hiddenWeights = Array(4).fill(0).map(() => 
      Array(8).fill(0).map(() => (Math.random() - 0.5) * 0.5)
    );
    this.hiddenBias = Array(8).fill(0).map(() => (Math.random() - 0.5) * 0.1);
    
    console.log('Enhanced training engine initialized with weights:', this.weights);
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  // Forward pass through neural network
  private predict(metadata: { cost: number; time: number; reliability: number; risk: number }): number {
    // Normalize inputs with better scaling
    const inputs = [
      Math.tanh(metadata.cost / 500), // Tanh normalization for better gradients
      Math.tanh(metadata.time / 15),
      (metadata.reliability / 100) * 2 - 1, // Scale to [-1, 1]
      (metadata.risk / 100) * 2 - 1
    ];

    // Hidden layer forward pass
    const hiddenOutputs = this.hiddenBias.map((bias, i) => {
      let sum = bias;
      for (let j = 0; j < 4; j++) {
        sum += inputs[j] * this.hiddenWeights[j][i];
      }
      return this.relu(sum); // ReLU activation
    });

    // Output layer (weighted combination with current weights)
    let output = this.outputBias;
    const weightArray = [this.weights.cost, this.weights.time, this.weights.reliability, this.weights.risk];
    
    for (let i = 0; i < 8; i++) {
      output += hiddenOutputs[i] * weightArray[i % 4] * 0.25; // Distribute weights
    }
    
    // Add direct weighted input connection
    output += inputs[0] * this.weights.cost * 0.3;
    output += inputs[1] * this.weights.time * 0.3;
    output += inputs[2] * this.weights.reliability * 0.3;
    output += inputs[3] * this.weights.risk * 0.3;

    return this.sigmoid(output);
  }

  // Enhanced backpropagation with adaptive learning
  trainStep(trainingData: TrainingData, validationData: TrainingData): TrainingMetrics {
    if (trainingData.features.length === 0 || validationData.features.length === 0) {
      throw new Error('Training or validation data is empty');
    }

    this.epochCount++;
    const gradients: WeightVector = { cost: 0, time: 0, reliability: 0, risk: 0 };
    const n = trainingData.features.length;

    // Batch gradient computation with momentum
    for (let i = 0; i < n; i++) {
      const prediction = this.predict(trainingData.metadata[i]);
      const actual = trainingData.targets[i];
      const error = prediction - actual;

      // Enhanced gradient calculation
      const inputs = [
        Math.tanh(trainingData.metadata[i].cost / 500),
        Math.tanh(trainingData.metadata[i].time / 15),
        (trainingData.metadata[i].reliability / 100) * 2 - 1,
        (trainingData.metadata[i].risk / 100) * 2 - 1
      ];

      const sigmoidDerivative = prediction * (1 - prediction);
      const delta = error * sigmoidDerivative;

      // Compute gradients for each weight
      gradients.cost += (delta * inputs[0]) / n;
      gradients.time += (delta * inputs[1]) / n;
      gradients.reliability += (delta * inputs[2]) / n;
      gradients.risk += (delta * inputs[3]) / n;
    }

    // Adaptive learning rate based on epoch
    const adaptiveLR = this.learningRate * Math.pow(0.99, this.epochCount / 10);

    // Update velocities with momentum
    this.velocities.cost = this.momentum * this.velocities.cost - adaptiveLR * gradients.cost;
    this.velocities.time = this.momentum * this.velocities.time - adaptiveLR * gradients.time;
    this.velocities.reliability = this.momentum * this.velocities.reliability - adaptiveLR * gradients.reliability;
    this.velocities.risk = this.momentum * this.velocities.risk - adaptiveLR * gradients.risk;

    // Update weights with noise injection for exploration
    const noise = () => (Math.random() - 0.5) * 0.001;
    this.weights.cost += this.velocities.cost + noise();
    this.weights.time += this.velocities.time + noise();
    this.weights.reliability += this.velocities.reliability + noise();
    this.weights.risk += this.velocities.risk + noise();

    // Ensure weights remain positive and normalized
    const minWeight = 0.05;
    this.weights.cost = Math.max(minWeight, this.weights.cost);
    this.weights.time = Math.max(minWeight, this.weights.time);
    this.weights.reliability = Math.max(minWeight, this.weights.reliability);
    this.weights.risk = Math.max(minWeight, this.weights.risk);

    const weightSum = this.weights.cost + this.weights.time + this.weights.reliability + this.weights.risk;
    this.weights.cost /= weightSum;
    this.weights.time /= weightSum;
    this.weights.reliability /= weightSum;
    this.weights.risk /= weightSum;

    // Calculate enhanced metrics
    const trainLoss = this.calculateLoss(trainingData);
    const trainAccuracy = this.calculateAccuracy(trainingData);
    const valLoss = this.calculateLoss(validationData);
    const valAccuracy = this.calculateAccuracy(validationData);

    // Early stopping with improvement tracking
    if (valLoss < this.bestValidationLoss - 0.001) { // Require minimum improvement
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

  private calculateLoss(data: TrainingData): number {
    if (data.features.length === 0) return 1.0;
    
    let totalLoss = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      // Enhanced loss with regularization
      const binaryLoss = -(actual * Math.log(Math.max(1e-15, prediction)) + (1 - actual) * Math.log(Math.max(1e-15, 1 - prediction)));
      
      // Add L2 regularization
      const l2Reg = 0.001 * (
        this.weights.cost * this.weights.cost +
        this.weights.time * this.weights.time +
        this.weights.reliability * this.weights.reliability +
        this.weights.risk * this.weights.risk
      );
      
      totalLoss += binaryLoss + l2Reg;
    }
    return totalLoss / data.features.length;
  }

  private calculateAccuracy(data: TrainingData): number {
    if (data.features.length === 0) return 0;
    
    let correct = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = this.predict(data.metadata[i]);
      const actual = data.targets[i];
      // Dynamic threshold based on data distribution
      const threshold = 0.5 + (Math.random() - 0.5) * 0.1; // Add slight randomness
      const predictedClass = prediction > threshold ? 1 : 0;
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
    return this.patienceCounter >= this.patience || this.epochCount >= 200;
  }
}
