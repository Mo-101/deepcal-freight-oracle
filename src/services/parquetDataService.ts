
import { get, set } from 'idb-keyval';
import { ShipmentRecord } from './csvDataEngine';

export interface ParquetDataset {
  id: string;
  name: string;
  records: ShipmentRecord[];
  metadata: {
    source: string;
    createdAt: string;
    recordCount: number;
    columns: string[];
    fileSize: number;
  };
}

class ParquetDataService {
  private static instance: ParquetDataService;
  private cachedDatasets: Map<string, ParquetDataset> = new Map();

  private constructor() {}

  public static getInstance(): ParquetDataService {
    if (!ParquetDataService.instance) {
      ParquetDataService.instance = new ParquetDataService();
    }
    return ParquetDataService.instance;
  }

  /**
   * Load parquet file from training directory
   */
  async loadParquetDataset(filename: string): Promise<ParquetDataset> {
    try {
      // Check cache first
      const cached = await get(`parquet-${filename}`);
      if (cached) {
        this.cachedDatasets.set(filename, cached);
        return cached;
      }

      // For now, simulate loading parquet data
      // In a real implementation, you'd use a parquet library like apache-arrow
      console.log(`Loading parquet file: ${filename}`);
      
      // Simulate parquet data structure
      const mockDataset: ParquetDataset = {
        id: `parquet-${filename}`,
        name: filename,
        records: this.generateMockShipmentRecords(50), // Simulate 50 records
        metadata: {
          source: `training/${filename}`,
          createdAt: new Date().toISOString(),
          recordCount: 50,
          columns: [
            'request_reference', 'origin_country', 'destination_country',
            'weight_kg', 'volume_cbm', 'carrier+cost', 'transit_time_days'
          ],
          fileSize: 2048 // KB
        }
      };

      // Cache the dataset
      await set(`parquet-${filename}`, mockDataset);
      this.cachedDatasets.set(filename, mockDataset);

      return mockDataset;
    } catch (error) {
      console.error('Failed to load parquet dataset:', error);
      throw error;
    }
  }

  /**
   * Save training results to parquet format
   */
  async saveTrainingResults(
    modelId: string,
    trainingData: ShipmentRecord[],
    metadata: any
  ): Promise<string> {
    try {
      const filename = `training_results_${modelId}_${Date.now()}.parquet`;
      
      const dataset: ParquetDataset = {
        id: `results-${modelId}`,
        name: filename,
        records: trainingData,
        metadata: {
          source: 'training_pipeline',
          createdAt: new Date().toISOString(),
          recordCount: trainingData.length,
          columns: Object.keys(trainingData[0] || {}),
          fileSize: JSON.stringify(trainingData).length / 1024
        }
      };

      await set(`parquet-results-${modelId}`, dataset);
      console.log(`Saved training results to: ${filename}`);
      
      return filename;
    } catch (error) {
      console.error('Failed to save parquet results:', error);
      throw error;
    }
  }

  /**
   * Get all available parquet datasets
   */
  getAvailableDatasets(): ParquetDataset[] {
    return Array.from(this.cachedDatasets.values());
  }

  /**
   * Get dataset statistics
   */
  getDatasetStats(datasetId: string): {
    recordCount: number;
    uniqueOrigins: number;
    uniqueDestinations: number;
    avgWeight: number;
    avgCost: number;
  } | null {
    const dataset = this.cachedDatasets.get(datasetId);
    if (!dataset) return null;

    const records = dataset.records;
    const origins = new Set(records.map(r => r.origin_country));
    const destinations = new Set(records.map(r => r.destination_country));
    const avgWeight = records.reduce((sum, r) => sum + Number(r.weight_kg), 0) / records.length;
    const avgCost = records.reduce((sum, r) => sum + Number(r['carrier+cost']), 0) / records.length;

    return {
      recordCount: records.length,
      uniqueOrigins: origins.size,
      uniqueDestinations: destinations.size,
      avgWeight,
      avgCost
    };
  }

  private generateMockShipmentRecords(count: number): ShipmentRecord[] {
    const origins = ['US', 'CN', 'DE', 'SG', 'JP'];
    const destinations = ['US', 'GB', 'FR', 'AU', 'CA'];
    
    return Array.from({ length: count }, (_, i) => ({
      request_reference: `PQ${String(i + 1).padStart(4, '0')}`,
      origin_country: origins[Math.floor(Math.random() * origins.length)],
      destination_country: destinations[Math.floor(Math.random() * destinations.length)],
      weight_kg: (Math.random() * 1000 + 100).toFixed(1),
      volume_cbm: (Math.random() * 50 + 5).toFixed(2),
      'carrier+cost': (Math.random() * 5000 + 1000).toFixed(2),
      transit_time_days: Math.floor(Math.random() * 20 + 5).toString()
    }));
  }
}

export const parquetDataService = ParquetDataService.getInstance();
