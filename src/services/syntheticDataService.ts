import axios from 'axios';
import { set, get } from 'idb-keyval';

export interface SyntheticDataConfig {
  baseDatasetSize: number;
  syntheticRatio: number; // e.g., 2.0 = generate 2x the original data
  privacyLevel: 'high' | 'medium' | 'low';
  scenarioType: 'historical' | 'stress_test' | 'seasonal_variation';
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  config: SyntheticDataConfig;
  createdAt: string;
  completedAt?: string;
  recordsGenerated?: number;
  error?: string;
}

export interface SyntheticDataset {
  id: string;
  jobId: string;
  records: any[];
  metadata: {
    generatedAt: string;
    recordCount: number;
    sourceHash: string;
    scenario: string;
    privacyMetrics: {
      kAnonymity: number;
      lDiversity: number;
      tCloseness: number;
    };
  };
}

class SyntheticDataService {
  private static instance: SyntheticDataService;
  private baseURL: string;
  private cache: Map<string, SyntheticDataset> = new Map();

  private constructor() {
    // In production, this would be your backend service URL
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-service.com/api' 
      : 'http://localhost:8000/api';
  }

  public static getInstance(): SyntheticDataService {
    if (!SyntheticDataService.instance) {
      SyntheticDataService.instance = new SyntheticDataService();
    }
    return SyntheticDataService.instance;
  }

  /**
   * Get stored MOSTLY AI API key from localStorage
   */
  private getApiKey(): string | null {
    return localStorage.getItem('mostlyai-api-key');
  }

  /**
   * Store MOSTLY AI API key in localStorage
   */
  setApiKey(apiKey: string): void {
    localStorage.setItem('mostlyai-api-key', apiKey);
  }

  /**
   * Check if API key is configured
   */
  isApiKeyConfigured(): boolean {
    return !!this.getApiKey();
  }

  /**
   * Get headers with API key for backend requests
   */
  private getHeaders() {
    const apiKey = this.getApiKey();
    return {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-MostlyAI-Key': apiKey })
    };
  }

  /**
   * Start synthetic data generation job
   */
  async startGeneration(config: SyntheticDataConfig): Promise<GenerationJob> {
    if (!this.isApiKeyConfigured()) {
      throw new Error('MOSTLY AI API key not configured. Please set your API key first.');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/synthetic/generate`, 
        config,
        { headers: this.getHeaders() }
      );
      const job: GenerationJob = response.data;
      
      // Store job in IndexedDB for offline access
      await set(`generation-job-${job.id}`, job);
      
      return job;
    } catch (error) {
      console.error('Failed to start synthetic data generation:', error);
      throw new Error('Failed to start generation. Check backend service and API key.');
    }
  }

  /**
   * Check generation job status
   */
  async getJobStatus(jobId: string): Promise<GenerationJob> {
    try {
      const response = await axios.get(`${this.baseURL}/synthetic/jobs/${jobId}`);
      const job: GenerationJob = response.data;
      
      // Update cached job
      await set(`generation-job-${jobId}`, job);
      
      return job;
    } catch (error) {
      // Try to get from cache if backend is unavailable
      const cachedJob = await get(`generation-job-${jobId}`);
      if (cachedJob) {
        return cachedJob;
      }
      throw error;
    }
  }

  /**
   * Get completed synthetic dataset
   */
  async getSyntheticDataset(jobId: string): Promise<SyntheticDataset | null> {
    try {
      // Check cache first
      if (this.cache.has(jobId)) {
        return this.cache.get(jobId)!;
      }

      // Check IndexedDB
      const cached = await get(`synthetic-dataset-${jobId}`);
      if (cached) {
        this.cache.set(jobId, cached);
        return cached;
      }

      // Fetch from backend
      const response = await axios.get(`${this.baseURL}/synthetic/datasets/${jobId}`);
      const dataset: SyntheticDataset = response.data;
      
      // Cache in memory and IndexedDB
      this.cache.set(jobId, dataset);
      await set(`synthetic-dataset-${jobId}`, dataset);
      
      return dataset;
    } catch (error) {
      console.error('Failed to get synthetic dataset:', error);
      return null;
    }
  }

  /**
   * List all available synthetic datasets
   */
  async listDatasets(): Promise<SyntheticDataset[]> {
    try {
      const response = await axios.get(`${this.baseURL}/synthetic/datasets`);
      return response.data;
    } catch (error) {
      console.error('Failed to list datasets:', error);
      return [];
    }
  }

  /**
   * Delete synthetic dataset
   */
  async deleteDataset(datasetId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/synthetic/datasets/${datasetId}`);
      
      // Remove from cache and IndexedDB
      this.cache.delete(datasetId);
      await set(`synthetic-dataset-${datasetId}`, undefined);
    } catch (error) {
      console.error('Failed to delete dataset:', error);
      throw error;
    }
  }

  /**
   * Generate scenario-based synthetic data
   */
  async generateScenario(scenario: 'peak_season' | 'supply_disruption' | 'economic_downturn'): Promise<GenerationJob> {
    const config: SyntheticDataConfig = {
      baseDatasetSize: 1000,
      syntheticRatio: 3.0,
      privacyLevel: 'high',
      scenarioType: 'stress_test'
    };

    return this.startGeneration(config);
  }

  /**
   * Get generation statistics
   */
  async getGenerationStats(): Promise<{
    totalJobs: number;
    completedJobs: number;
    totalRecords: number;
    lastGeneration: string;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/synthetic/stats`);
      return response.data;
    } catch (error) {
      return {
        totalJobs: 0,
        completedJobs: 0,
        totalRecords: 0,
        lastGeneration: 'Never'
      };
    }
  }
}

export const syntheticDataService = SyntheticDataService.getInstance();
