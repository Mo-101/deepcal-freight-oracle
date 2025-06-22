
export interface TrainingMetadata {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
  actualOutcome: 'success' | 'failure' | 'delayed';
}

export interface TrainingData {
  features: number[][];
  targets: number[];
  metadata: TrainingMetadata[];
}

export class TrainingDataGenerator {
  private dataGenerationSeed: number = 0;

  constructor(seed: number = 42) {
    this.dataGenerationSeed = seed;
  }

  generateAdvancedTrainingData(samples: number = 400, epochBased: boolean = false): TrainingData {
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
      
      const cost = 150 + Math.random() * 850 * complexity;
      const time = Math.max(1, 2 + Math.random() * 28 * complexity);
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
        (cost * time) / 30000,
        Math.log(cost + 1) / 10,
        reliability / (risk + 1),
        Math.sqrt(time) / 6
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

  splitData(data: TrainingData): { training: TrainingData; validation: TrainingData } {
    const splitIndex = Math.floor(data.features.length * 0.75);
    
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

  updateSeed(): void {
    this.dataGenerationSeed++;
  }
}
