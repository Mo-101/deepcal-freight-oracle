
import { TrainingData } from './trainingDataGenerator';
import { NeuralNetwork } from './neuralNetwork';
import { WeightVector } from '@/types/training';

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
  learningRate: number;
}

export class MetricsCalculator {
  calculateLoss(data: TrainingData, neuralNetwork: NeuralNetwork, weights: WeightVector): number {
    if (data.features.length === 0) return 1.0;
    
    let totalLoss = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = neuralNetwork.predict(data.metadata[i], weights);
      const actual = data.targets[i];
      
      // Enhanced loss with regularization
      const binaryLoss = -(actual * Math.log(Math.max(1e-15, prediction)) + (1 - actual) * Math.log(Math.max(1e-15, 1 - prediction)));
      
      // Add L2 regularization
      const l2Reg = 0.001 * (
        weights.cost * weights.cost +
        weights.time * weights.time +
        weights.reliability * weights.reliability +
        weights.risk * weights.risk
      );
      
      totalLoss += binaryLoss + l2Reg;
    }
    return totalLoss / data.features.length;
  }

  calculateAccuracy(data: TrainingData, neuralNetwork: NeuralNetwork, weights: WeightVector): number {
    if (data.features.length === 0) return 0;
    
    let correct = 0;
    for (let i = 0; i < data.features.length; i++) {
      const prediction = neuralNetwork.predict(data.metadata[i], weights);
      const actual = data.targets[i];
      
      // Dynamic threshold based on data distribution
      const threshold = 0.5 + (Math.random() - 0.5) * 0.1;
      const predictedClass = prediction > threshold ? 1 : 0;
      if (predictedClass === actual) correct++;
    }
    return (correct / data.features.length) * 100;
  }

  computeGradients(trainingData: TrainingData, neuralNetwork: NeuralNetwork, weights: WeightVector): WeightVector {
    const gradients: WeightVector = { cost: 0, time: 0, reliability: 0, risk: 0 };
    const n = trainingData.features.length;

    for (let i = 0; i < n; i++) {
      const prediction = neuralNetwork.predict(trainingData.metadata[i], weights);
      const actual = trainingData.targets[i];
      const error = prediction - actual;

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

    return gradients;
  }
}
