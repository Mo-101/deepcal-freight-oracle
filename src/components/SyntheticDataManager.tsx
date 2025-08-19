import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Cpu, 
  Database, 
  Shield, 
  TrendingUp, 
  Play, 
  Pause, 
  RotateCcw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { syntheticDataService, GenerationJob, SyntheticDataConfig } from '@/services/syntheticDataService';
import { trainingService, TrainingJob } from '@/services/trainingService';
import { syntheticDataEngine } from '@/services/syntheticDataEngine';
import { humorToast } from './HumorToast';
import { ApiKeyConfig } from './ApiKeyConfig';

interface SyntheticDataManagerProps {
  onDataGenerated?: () => void;
}

export const SyntheticDataManager: React.FC<SyntheticDataManagerProps> = ({ onDataGenerated }) => {
  const [generationJob, setGenerationJob] = useState<GenerationJob | null>(null);
  const [trainingJob, setTrainingJob] = useState<TrainingJob | null>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    totalRecords: 0,
    lastGeneration: 'Never'
  });
  const [config, setConfig] = useState<SyntheticDataConfig>({
    baseDatasetSize: 1000,
    syntheticRatio: 2.0,
    privacyLevel: 'high',
    scenarioType: 'historical'
  });
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(syntheticDataService.isApiKeyConfigured());

  useEffect(() => {
    loadStats();
    const interval = setInterval(() => {
      loadStats();
      setIsApiKeyConfigured(syntheticDataService.isApiKeyConfigured());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const newStats = await syntheticDataService.getGenerationStats();
      setStats(newStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleStartGeneration = async () => {
    try {
      humorToast("🎯 Initializing MOSTLY AI", "Starting synthetic data generation...", 2000);
      
      const job = await syntheticDataService.startGeneration(config);
      setGenerationJob(job);
      
      // Poll job status
      const pollInterval = setInterval(async () => {
        try {
          const updatedJob = await syntheticDataService.getJobStatus(job.id);
          setGenerationJob(updatedJob);
          
          if (updatedJob.status === 'completed') {
            clearInterval(pollInterval);
            humorToast("✅ Generation Complete", `${updatedJob.recordsGenerated || 0} synthetic records created!`, 3000);
            onDataGenerated?.();
            await loadStats();
          } else if (updatedJob.status === 'failed') {
            clearInterval(pollInterval);
            humorToast("❌ Generation Failed", updatedJob.error || "Unknown error", 4000);
          }
        } catch (error) {
          console.error('Failed to poll job status:', error);
          clearInterval(pollInterval);
        }
      }, 2000);
    } catch (error) {
      humorToast("❌ Generation Failed", (error as Error).message, 4000);
    }
  };

  const handleStartTraining = async () => {
    try {
      humorToast("🧠 Neural Engine Starting", "Beginning model retraining with latest data...", 2000);

      const job = await trainingService.startRetraining({
        includeSynthetic: true,
        syntheticRatio: config.syntheticRatio,
        validationSplit: 0.2
      });
      setTrainingJob(job);
      const source = trainingService.streamTrainingUpdates(job.id, (updatedJob) => {
        setTrainingJob(updatedJob);
        if (updatedJob.status === 'completed') {
          humorToast("✅ Training Complete", "Model weights updated successfully!", 3000);
          source.close();
        } else if (updatedJob.status === 'failed') {
          humorToast("❌ Training Failed", updatedJob.error || "Unknown error", 4000);
          source.close();
        }
      });
    } catch (error) {
      humorToast("❌ Training Failed", (error as Error).message, 4000);
    }
  };

  const handleStressTestGeneration = async (scenario: 'peak_season' | 'supply_disruption' | 'economic_downturn') => {
    try {
      humorToast("⚡ Stress Test Mode", `Generating ${scenario.replace('_', ' ')} scenario data...`, 2000);
      
      const jobId = await syntheticDataEngine.generateStressTestData(scenario);
      const job = await syntheticDataService.getJobStatus(jobId);
      setGenerationJob(job);
    } catch (error) {
      humorToast("❌ Stress Test Failed", (error as Error).message, 4000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'running': return <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Configuration */}
      <ApiKeyConfig />

      {/* Generation Controls */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lime-400">
            <Database className="w-5 h-5" />
            MOSTLY AI Synthetic Data Generation
          </CardTitle>
          <p className="text-indigo-300 text-sm">
            Generate privacy-preserving synthetic shipment data for enhanced training
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isApiKeyConfigured && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-400/20 rounded-lg">
              <p className="text-yellow-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Configure your MOSTLY AI API key above to enable synthetic data generation
              </p>
            </div>
          )}

          {/* Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Dataset Size
              </label>
              <input
                type="number"
                value={config.baseDatasetSize}
                onChange={(e) => setConfig(prev => ({ ...prev, baseDatasetSize: Number(e.target.value) }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-1">
                Synthetic Ratio
              </label>
              <input
                type="number"
                step="0.1"
                value={config.syntheticRatio}
                onChange={(e) => setConfig(prev => ({ ...prev, syntheticRatio: Number(e.target.value) }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Privacy Level */}
          <div>
            <label className="block text-sm font-medium text-indigo-300 mb-2">
              Privacy Level
            </label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setConfig(prev => ({ ...prev, privacyLevel: level }))}
                  className={`px-3 py-1 rounded text-sm ${
                    config.privacyLevel === level
                      ? 'bg-lime-400 text-slate-900'
                      : 'bg-slate-700 text-indigo-300 hover:bg-slate-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleStartGeneration}
              disabled={generationJob?.status === 'running'}
              className="bg-lime-400 hover:bg-lime-500 text-slate-900"
            >
              <Play className="w-4 h-4 mr-2" />
              Generate Data
            </Button>
            
            <Button
              onClick={handleStartTraining}
              disabled={trainingJob?.status === 'running'}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-slate-900"
            >
              <Brain className="w-4 h-4 mr-2" />
              Retrain Model
            </Button>
          </div>

          {/* Stress Test Scenarios */}
          <Separator />
          <div>
            <h4 className="text-white font-medium mb-2">Stress Test Scenarios</h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStressTestGeneration('peak_season')}
                className="text-xs"
              >
                Peak Season
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStressTestGeneration('supply_disruption')}
                className="text-xs"
              >
                Supply Disruption
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStressTestGeneration('economic_downturn')}
                className="text-xs"
              >
                Economic Downturn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Status */}
      {(generationJob || trainingJob) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generationJob && (
            <Card className="glass-card shadow-glass border border-glassBorder">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getStatusIcon(generationJob.status)}
                  Generation Job: {generationJob.id.substring(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-300">Status:</span>
                  <Badge 
                    variant={generationJob.status === 'completed' ? 'default' : 'outline'}
                    className={
                      generationJob.status === 'completed' ? 'bg-green-900 text-green-300' :
                      generationJob.status === 'running' ? 'bg-blue-900 text-blue-300' :
                      generationJob.status === 'failed' ? 'bg-red-900 text-red-300' :
                      'bg-gray-900 text-gray-300'
                    }
                  >
                    {generationJob.status}
                  </Badge>
                </div>
                <Progress value={generationJob.progress} className="h-2" />
                <div className="text-xs text-indigo-300">
                  {generationJob.recordsGenerated || 0} records generated
                </div>
              </CardContent>
            </Card>
          )}

          {trainingJob && (
            <Card className="glass-card shadow-glass border border-glassBorder">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getStatusIcon(trainingJob.status)}
                  Training Job: {trainingJob.id.substring(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-300">Stage:</span>
                  <span className="text-white">{trainingJob.stage}</span>
                </div>
                <Progress value={trainingJob.progress} className="h-2" />
                {trainingJob.metrics && (
                  <div className="text-xs text-indigo-300">
                    Accuracy: {(trainingJob.metrics.validationAccuracy * 100).toFixed(1)}%
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Statistics */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lime-400">
            <TrendingUp className="w-5 h-5" />
            Generation Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
              <div className="text-sm text-indigo-300">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-lime-400">{stats.completedJobs}</div>
              <div className="text-sm text-indigo-300">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.totalRecords.toLocaleString()}</div>
              <div className="text-sm text-indigo-300">Records Generated</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-white">{stats.lastGeneration}</div>
              <div className="text-sm text-indigo-300">Last Generation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
