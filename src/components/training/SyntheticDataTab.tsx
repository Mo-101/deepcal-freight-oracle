
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Upload, 
  Download, 
  Shuffle, 
  TrendingUp,
  Shield,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { syntheticDataEngine } from '@/services/syntheticDataEngine';

export function SyntheticDataTab() {
  const [syntheticStats, setSyntheticStats] = useState({
    totalShipments: 0,
    realShipments: 0,
    syntheticShipments: 0,
    syntheticRatio: 0,
    dataQuality: { completeness: 0, consistency: 0, accuracy: 0 },
    privacyMetrics: { averagePrivacyScore: 0, anonymityLevel: 'Low' }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const stats = syntheticDataEngine.getEnhancedStatistics();
      setSyntheticStats(stats);
    };
    loadStats();
  }, []);

  const handleGenerateSynthetic = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Refresh stats
          const stats = syntheticDataEngine.getEnhancedStatistics();
          setSyntheticStats(stats);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSyncToTraining = async () => {
    try {
      await syntheticDataEngine.syncSyntheticDataToTraining();
      console.log('Synthetic data synced to training pipeline');
    } catch (error) {
      console.error('Failed to sync synthetic data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Synthetic Data Overview */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Synthetic Data Pipeline
          </CardTitle>
          <p className="text-indigo-300 mt-2">
            MOSTLY AI powered synthetic data generation for enhanced training datasets.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-lime-400 font-mono text-2xl">{syntheticStats.realShipments}</div>
              <div className="text-indigo-300 text-sm">Real Shipments</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-purple-400 font-mono text-2xl">{syntheticStats.syntheticShipments}</div>
              <div className="text-indigo-300 text-sm">Synthetic Records</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-blue-400 font-mono text-2xl">{syntheticStats.syntheticRatio.toFixed(1)}x</div>
              <div className="text-indigo-300 text-sm">Augmentation Ratio</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateSynthetic} 
              disabled={isGenerating}
              className="bg-purple-700 hover:bg-purple-600"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Synthetic Data'}
            </Button>
            <Button 
              onClick={handleSyncToTraining}
              className="bg-lime-600 hover:bg-lime-500 text-slate-900"
            >
              <Upload className="w-4 h-4 mr-2" />
              Sync to Training
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-300">Generation Progress</span>
                <span className="text-lime-400">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Data Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Completeness</span>
                <span className="text-lime-400 font-mono">
                  {(syntheticStats.dataQuality.completeness * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={syntheticStats.dataQuality.completeness * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Consistency</span>
                <span className="text-blue-400 font-mono">
                  {(syntheticStats.dataQuality.consistency * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={syntheticStats.dataQuality.consistency * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Accuracy</span>
                <span className="text-purple-400 font-mono">
                  {(syntheticStats.dataQuality.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={syntheticStats.dataQuality.accuracy * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <div className="text-lime-400 font-mono text-xl">
                {(syntheticStats.privacyMetrics.averagePrivacyScore * 100).toFixed(1)}%
              </div>
              <div className="text-indigo-300 text-sm">Privacy Score</div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-indigo-300">Anonymity Level</span>
              <Badge className={`${
                syntheticStats.privacyMetrics.anonymityLevel === 'High' ? 'bg-green-900 text-green-300' :
                syntheticStats.privacyMetrics.anonymityLevel === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {syntheticStats.privacyMetrics.anonymityLevel}
              </Badge>
            </div>

            <div className="p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
              <div className="flex items-center gap-2 text-blue-300 text-sm">
                <Shield className="w-4 h-4" />
                GDPR Compliant
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Readiness */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Training Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              const readiness = syntheticDataEngine.getTrainingReadiness();
              return (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-300">Dataset Status</span>
                    <Badge className={`${
                      readiness.isReady ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {readiness.isReady ? 'Ready' : 'Needs Attention'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-indigo-300">Total Samples:</span>
                      <span className="text-white ml-2">{readiness.totalSamples}</span>
                    </div>
                    <div>
                      <span className="text-indigo-300">Synthetic Ratio:</span>
                      <span className="text-white ml-2">{readiness.syntheticRatio.toFixed(1)}x</span>
                    </div>
                  </div>

                  {readiness.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Recommendations</span>
                      </div>
                      {readiness.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm text-indigo-300 pl-6">
                          • {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
