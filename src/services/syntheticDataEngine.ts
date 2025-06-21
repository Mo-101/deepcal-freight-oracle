import { csvDataEngine } from './csvDataEngine';
import { syntheticDataService, SyntheticDataset } from './syntheticDataService';
import { trainingService, WeightMatrix } from './trainingService';
import { parquetDataService } from './parquetDataService';
import { ShipmentRecord } from './csvDataEngine';

export interface EnhancedShipmentRecord extends ShipmentRecord {
  synthetic: boolean;
  sourceDataset?: string;
  generationId?: string;
  privacyScore?: number;
}

class SyntheticDataEngine {
  private static instance: SyntheticDataEngine;
  private syntheticDatasets: Map<string, SyntheticDataset> = new Map();
  private parquetDatasets: Map<string, any> = new Map();
  private currentWeights: WeightMatrix | null = null;
  private trainingDataHash: string | null = null;

  private constructor() {}

  public static getInstance(): SyntheticDataEngine {
    if (!SyntheticDataEngine.instance) {
      SyntheticDataEngine.instance = new SyntheticDataEngine();
    }
    return SyntheticDataEngine.instance;
  }

  /**
   * Load parquet training data
   */
  async loadParquetTrainingData(filename: string = 'part.000000.000000.parquet'): Promise<void> {
    try {
      const dataset = await parquetDataService.loadParquetDataset(filename);
      this.parquetDatasets.set(filename, dataset);
      
      console.log(`Loaded ${dataset.records.length} records from parquet: ${filename}`);
    } catch (error) {
      console.error('Failed to load parquet training data:', error);
      throw error;
    }
  }

  /**
   * Load and merge synthetic data with real data
   */
  async loadSyntheticDataset(datasetId: string): Promise<void> {
    try {
      const dataset = await syntheticDataService.getSyntheticDataset(datasetId);
      if (!dataset) {
        throw new Error(`Dataset ${datasetId} not found`);
      }

      // Mark synthetic records
      const syntheticRecords: EnhancedShipmentRecord[] = dataset.records.map(record => ({
        ...record,
        synthetic: true,
        sourceDataset: dataset.id,
        generationId: dataset.jobId,
        privacyScore: Math.random() * 0.3 + 0.7 // Simulated privacy score
      }));

      this.syntheticDatasets.set(datasetId, dataset);
      
      console.log(`Loaded ${syntheticRecords.length} synthetic records from dataset ${datasetId}`);
    } catch (error) {
      console.error('Failed to load synthetic dataset:', error);
      throw error;
    }
  }

  /**
   * Get combined dataset (real + synthetic + parquet)
   */
  getCombinedShipments(includeSynthetic: boolean = true, includeParquet: boolean = true): EnhancedShipmentRecord[] {
    const realShipments = csvDataEngine.listShipments().map(record => ({
      ...record,
      synthetic: false
    })) as EnhancedShipmentRecord[];

    let combinedShipments = [...realShipments];

    if (includeSynthetic) {
      const syntheticShipments: EnhancedShipmentRecord[] = [];
      for (const dataset of this.syntheticDatasets.values()) {
        const records = dataset.records.map(record => ({
          ...record,
          synthetic: true,
          sourceDataset: dataset.id,
          generationId: dataset.jobId,
          privacyScore: Math.random() * 0.3 + 0.7
        }));
        syntheticShipments.push(...records);
      }
      combinedShipments.push(...syntheticShipments);
    }

    if (includeParquet) {
      const parquetShipments: EnhancedShipmentRecord[] = [];
      for (const dataset of this.parquetDatasets.values()) {
        const records = dataset.records.map(record => ({
          ...record,
          synthetic: false,
          sourceDataset: 'parquet',
          generationId: dataset.id,
          privacyScore: 1.0 // Parquet data is considered fully private
        }));
        parquetShipments.push(...records);
      }
      combinedShipments.push(...parquetShipments);
    }

    return combinedShipments;
  }

  /**
   * Get enhanced statistics with parquet data insights
   */
  getEnhancedStatistics(originCountry?: string, destinationCountry?: string) {
    const allShipments = this.getCombinedShipments();
    const filteredShipments = allShipments.filter(s => {
      if (originCountry && s.origin_country !== originCountry) return false;
      if (destinationCountry && s.destination_country !== destinationCountry) return false;
      return true;
    });

    const realCount = filteredShipments.filter(s => !s.synthetic && s.sourceDataset !== 'parquet').length;
    const syntheticCount = filteredShipments.filter(s => s.synthetic).length;
    const parquetCount = filteredShipments.filter(s => s.sourceDataset === 'parquet').length;

    return {
      totalShipments: filteredShipments.length,
      realShipments: realCount,
      syntheticShipments: syntheticCount,
      parquetShipments: parquetCount,
      syntheticRatio: realCount > 0 ? syntheticCount / realCount : 0,
      parquetRatio: realCount > 0 ? parquetCount / realCount : 0,
      dataQuality: {
        completeness: this.calculateCompleteness(filteredShipments),
        consistency: this.calculateConsistency(filteredShipments),
        accuracy: this.calculateAccuracy(filteredShipments)
      },
      privacyMetrics: {
        averagePrivacyScore: this.calculateAveragePrivacyScore(filteredShipments),
        anonymityLevel: this.calculateAnonymityLevel(filteredShipments)
      }
    };
  }

  /**
   * Check if training data needs to be updated
   */
  isTrainingDataStale(): boolean {
    const currentData = this.getCombinedShipments();
    const currentHash = this.generateDataHash(currentData);
    return this.trainingDataHash !== currentHash;
  }

  /**
   * Generate hash for training data state
   */
  private generateDataHash(data: EnhancedShipmentRecord[]): string {
    const dataString = JSON.stringify(data.map(record => ({
      id: record.request_reference,
      synthetic: record.synthetic,
      timestamp: record.synthetic ? record.generationId : 'real'
    })));
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Mark training data as synced
   */
  markTrainingDataSynced(): void {
    const currentData = this.getCombinedShipments();
    this.trainingDataHash = this.generateDataHash(currentData);
  }

  /**
   * Get training readiness status
   */
  getTrainingReadiness(): {
    isReady: boolean;
    dataStale: boolean;
    totalSamples: number;
    syntheticRatio: number;
    recommendations: string[];
  } {
    const stats = this.getEnhancedStatistics();
    const isStale = this.isTrainingDataStale();
    const recommendations: string[] = [];

    if (stats.totalShipments < 100) {
      recommendations.push('Consider generating more synthetic data for better training');
    }
    
    if (stats.syntheticRatio < 1.0) {
      recommendations.push('Increase synthetic data ratio for better model generalization');
    }
    
    if (stats.dataQuality.completeness < 0.8) {
      recommendations.push('Improve data completeness before training');
    }

    return {
      isReady: stats.totalShipments >= 50 && stats.dataQuality.completeness > 0.7,
      dataStale: isStale,
      totalSamples: stats.totalShipments,
      syntheticRatio: stats.syntheticRatio,
      recommendations
    };
  }

  /**
   * Train model with current dataset
   */
  async trainModelWithCurrentData(): Promise<string> {
    try {
      const combinedData = this.getCombinedShipments();
      const syntheticRatio = combinedData.filter(s => s.synthetic).length / 
                            combinedData.filter(s => !s.synthetic).length;

      const job = await trainingService.startRetraining({
        includeSynthetic: true,
        syntheticRatio,
        validationSplit: 0.2
      });

      return job.id;
    } catch (error) {
      console.error('Failed to start training:', error);
      throw error;
    }
  }

  /**
   * Get current model weights
   */
  async getCurrentWeights(): Promise<WeightMatrix> {
    if (!this.currentWeights) {
      this.currentWeights = await trainingService.getLatestWeights();
    }
    return this.currentWeights;
  }

  /**
   * Generate stress test scenarios
   */
  async generateStressTestData(scenario: 'peak_season' | 'supply_disruption' | 'economic_downturn'): Promise<string> {
    try {
      const job = await syntheticDataService.generateScenario(scenario);
      return job.id;
    } catch (error) {
      console.error('Failed to generate stress test data:', error);
      throw error;
    }
  }

  /**
   * Save training results to parquet
   */
  async saveTrainingResultsToParquet(modelId: string, trainingData: EnhancedShipmentRecord[]): Promise<string> {
    try {
      const filename = await parquetDataService.saveTrainingResults(
        modelId,
        trainingData,
        {
          modelVersion: modelId,
          dataComposition: {
            real: trainingData.filter(s => !s.synthetic && s.sourceDataset !== 'parquet').length,
            synthetic: trainingData.filter(s => s.synthetic).length,
            parquet: trainingData.filter(s => s.sourceDataset === 'parquet').length
          }
        }
      );
      
      console.log(`Training results saved to parquet: ${filename}`);
      return filename;
    } catch (error) {
      console.error('Failed to save training results to parquet:', error);
      throw error;
    }
  }

  // Helper methods for data quality calculations
  private calculateCompleteness(shipments: EnhancedShipmentRecord[]): number {
    if (shipments.length === 0) return 0;
    
    const requiredFields = ['origin_country', 'destination_country', 'weight_kg', 'volume_cbm'];
    const completenessScores = shipments.map(shipment => {
      const filledFields = requiredFields.filter(field => shipment[field] != null).length;
      return filledFields / requiredFields.length;
    });
    
    return completenessScores.reduce((sum, score) => sum + score, 0) / completenessScores.length;
  }

  private calculateConsistency(shipments: EnhancedShipmentRecord[]): number {
    // Simplified consistency check - could be enhanced with domain-specific rules
    const consistentShipments = shipments.filter(s => {
      const weight = Number(s.weight_kg);
      const volume = Number(s.volume_cbm);
      const cost = Number(s['carrier+cost']);
      
      return weight > 0 && volume > 0 && cost > 0 && weight / volume < 1000; // Reasonable density
    });
    
    return shipments.length > 0 ? consistentShipments.length / shipments.length : 0;
  }

  private calculateAccuracy(shipments: EnhancedShipmentRecord[]): number {
    // For synthetic data, this could compare against known ground truth
    const syntheticShipments = shipments.filter(s => s.synthetic);
    const realShipments = shipments.filter(s => !s.synthetic);
    
    if (syntheticShipments.length === 0) return 1.0;
    
    // Simplified accuracy calculation based on distribution similarity
    return 0.85 + (Math.random() * 0.1); // Placeholder - would need actual validation
  }

  private calculateAveragePrivacyScore(shipments: EnhancedShipmentRecord[]): number {
    const syntheticShipments = shipments.filter(s => s.synthetic && s.privacyScore);
    if (syntheticShipments.length === 0) return 1.0;
    
    const totalScore = syntheticShipments.reduce((sum, s) => sum + (s.privacyScore || 0), 0);
    return totalScore / syntheticShipments.length;
  }

  private calculateAnonymityLevel(shipments: EnhancedShipmentRecord[]): string {
    const privacyScore = this.calculateAveragePrivacyScore(shipments);
    if (privacyScore >= 0.9) return 'High';
    if (privacyScore >= 0.7) return 'Medium';
    return 'Low';
  }
}

export const syntheticDataEngine = SyntheticDataEngine.getInstance();
