
import { WeightVector } from '@/types/training';

export interface NeuralNetworkConfig {
  hiddenLayerSize: number;
  learningRate: number;
  momentum: number;
}

export class NeuralNetwork {
  private hiddenWeights: number[][];
  private hiddenBias: number[];
  private outputBias: number = 0;
  private velocities: WeightVector;
  private config: NeuralNetworkConfig;

  constructor(config: NeuralNetworkConfig) {
    this.config = config;
    this.velocities = { cost: 0, time: 0, reliability: 0, risk: 0 };
    
    // Initialize hidden layer (4 inputs -> hiddenLayerSize -> 1 output)
    this.hiddenWeights = Array(4).fill(0).map(() => 
      Array(config.hiddenLayerSize).fill(0).map(() => (Math.random() - 0.5) * 0.5)
    );
    this.hiddenBias = Array(config.hiddenLayerSize).fill(0).map(() => (Math.random() - 0.5) * 0.1);
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  predict(metadata: { cost: number; time: number; reliability: number; risk: number }, weights: WeightVector): number {
    // Normalize inputs with better scaling
    const inputs = [
      Math.tanh(metadata.cost / 500),
      Math.tanh(metadata.time / 15),
      (metadata.reliability / 100) * 2 - 1,
      (metadata.risk / 100) * 2 - 1
    ];

    // Hidden layer forward pass
    const hiddenOutputs = this.hiddenBias.map((bias, i) => {
      let sum = bias;
      for (let j = 0; j < 4; j++) {
        sum += inputs[j] * this.hiddenWeights[j][i];
      }
      return this.relu(sum);
    });

    // Output layer (weighted combination with current weights)
    let output = this.outputBias;
    const weightArray = [weights.cost, weights.time, weights.reliability, weights.risk];
    
    for (let i = 0; i < this.config.hiddenLayerSize; i++) {
      output += hiddenOutputs[i] * weightArray[i % 4] * 0.25;
    }
    
    // Add direct weighted input connection
    output += inputs[0] * weights.cost * 0.3;
    output += inputs[1] * weights.time * 0.3;
    output += inputs[2] * weights.reliability * 0.3;
    output += inputs[3] * weights.risk * 0.3;

    return this.sigmoid(output);
  }

  updateWeights(weights: WeightVector, gradients: WeightVector, adaptiveLR: number): WeightVector {
    // Update velocities with momentum
    this.velocities.cost = this.config.momentum * this.velocities.cost - adaptiveLR * gradients.cost;
    this.velocities.time = this.config.momentum * this.velocities.time - adaptiveLR * gradients.time;
    this.velocities.reliability = this.config.momentum * this.velocities.reliability - adaptiveLR * gradients.reliability;
    this.velocities.risk = this.config.momentum * this.velocities.risk - adaptiveLR * gradients.risk;

    // Update weights with noise injection for exploration
    const noise = () => (Math.random() - 0.5) * 0.001;
    const newWeights = {
      cost: weights.cost + this.velocities.cost + noise(),
      time: weights.time + this.velocities.time + noise(),
      reliability: weights.reliability + this.velocities.reliability + noise(),
      risk: weights.risk + this.velocities.risk + noise()
    };

    // Ensure weights remain positive and normalized
    const minWeight = 0.05;
    newWeights.cost = Math.max(minWeight, newWeights.cost);
    newWeights.time = Math.max(minWeight, newWeights.time);
    newWeights.reliability = Math.max(minWeight, newWeights.reliability);
    newWeights.risk = Math.max(minWeight, newWeights.risk);

    const weightSum = newWeights.cost + newWeights.time + newWeights.reliability + newWeights.risk;
    return {
      cost: newWeights.cost / weightSum,
      time: newWeights.time / weightSum,
      reliability: newWeights.reliability / weightSum,
      risk: newWeights.risk / weightSum
    };
  }
}
