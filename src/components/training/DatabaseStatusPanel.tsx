
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database,
  Activity,
  Zap,
  TrendingUp,
  Server,
  Cloud,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { deepcalDatabaseIntegration } from '@/services/deepcalDatabaseIntegration';

export function DatabaseStatusPanel() {
  const [systemHealth, setSystemHealth] = useState({
    postgres: { status: 'connected' as const, latency: 0 },
    mostlyAI: { status: 'connected' as const },
    activePipelines: 0
  });

  const [trainingStats, setTrainingStats] = useState({
    database: { totalJobs: 0, completedJobs: 0, totalRecords: 0, syntheticRatio: 0 },
    pipeline: { activePipelines: 0, completedToday: 0, avgAccuracy: 0 }
  });

  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const health = await deepcalDatabaseIntegration.getSystemHealth();
        const stats = await deepcalDatabaseIntegration.getEnhancedTrainingStats();
        
        setSystemHealth(health);
        setTrainingStats(stats);
      } catch (error) {
        console.error('Failed to load system status:', error);
      }
    };

    loadSystemStatus();
    const interval = setInterval(loadSystemStatus, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInitializeSystem = async () => {
    setIsInitializing(true);
    try {
      await deepcalDatabaseIntegration.initialize();
      console.log('✅ DeepCAL Database Integration initialized');
    } catch (error) {
      console.error('❌ Failed to initialize system:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStartEnhancedPipeline = async () => {
    try {
      const pipelineId = await deepcalDatabaseIntegration.startEnhancedTrainingPipeline({
        syntheticRatio: 2.5,
        privacyLevel: 'high',
        modelType: 'neutrosophic'
      });
      console.log('🚀 Enhanced training pipeline started:', pipelineId);
    } catch (error) {
      console.error('❌ Failed to start enhanced pipeline:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* System Health Status */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            PostgreSQL + Mostly AI Integration
          </CardTitle>
          <p className="text-indigo-300 mt-2">
            Connected to Neon PostgreSQL database for persistent training data storage and Mostly AI for synthetic data generation.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Server className="w-5 h-5 text-lime-400" />
                {systemHealth.postgres.status === 'connected' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-white text-sm font-medium">PostgreSQL</div>
              <div className="text-lime-400 font-mono text-xs">
                {systemHealth.postgres.latency}ms latency
              </div>
            </div>

            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cloud className="w-5 h-5 text-purple-400" />
                {systemHealth.mostlyAI.status === 'connected' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-white text-sm font-medium">Mostly AI</div>
              <div className="text-purple-400 font-mono text-xs">
                {systemHealth.mostlyAI.status.toUpperCase()}
              </div>
            </div>

            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-white text-sm font-medium">Active Pipelines</div>
              <div className="text-blue-400 font-mono text-lg">
                {systemHealth.activePipelines}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleInitializeSystem}
              disabled={isInitializing}
              className="bg-lime-600 hover:bg-lime-500 text-slate-900"
            >
              <Database className="w-4 h-4 mr-2" />
              {isInitializing ? 'Initializing...' : 'Initialize System'}
            </Button>
            <Button 
              onClick={handleStartEnhancedPipeline}
              className="bg-purple-700 hover:bg-purple-600"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Enhanced Pipeline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Database Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-indigo-300 text-sm">Total Jobs</div>
                <div className="text-white font-mono text-lg">{trainingStats.database.totalJobs}</div>
              </div>
              <div>
                <div className="text-indigo-300 text-sm">Completed</div>
                <div className="text-lime-400 font-mono text-lg">{trainingStats.database.completedJobs}</div>
              </div>
              <div>
                <div className="text-indigo-300 text-sm">Total Records</div>
                <div className="text-blue-400 font-mono text-lg">
                  {trainingStats.database.totalRecords.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-indigo-300 text-sm">Synthetic Ratio</div>
                <div className="text-purple-400 font-mono text-lg">
                  {trainingStats.database.syntheticRatio.toFixed(1)}x
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Pipeline Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-indigo-300">Active Pipelines</span>
                <Badge className="bg-blue-900 text-blue-300">
                  {trainingStats.pipeline.activePipelines}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-indigo-300">Completed Today</span>
                <Badge className="bg-green-900 text-green-300">
                  {trainingStats.pipeline.completedToday}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-indigo-300">Avg Accuracy</span>
                  <span className="text-lime-400 font-mono">
                    {(trainingStats.pipeline.avgAccuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={trainingStats.pipeline.avgAccuracy * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
