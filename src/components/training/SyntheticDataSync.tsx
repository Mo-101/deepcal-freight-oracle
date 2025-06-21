import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { syntheticDataEngine } from '@/services/syntheticDataEngine';
import { firebaseTrainingService } from '@/services/firebaseTrainingService';
import { humorToast } from '@/components/HumorToast';

export function SyntheticDataSync() {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [dataStats, setDataStats] = useState({
    realShipments: 0,
    syntheticShipments: 0,
    syntheticRatio: 0,
    totalShipments: 0,
    dataQuality: { completeness: 0, consistency: 0, accuracy: 0 },
    privacyMetrics: { averagePrivacyScore: 0, anonymityLevel: 'Unknown' }
  });
  const [lastSync, setLastSync] = useState<string>('Never');

  useEffect(() => {
    loadDataStats();
  }, []);

  const loadDataStats = () => {
    try {
      const stats = syntheticDataEngine.getEnhancedStatistics();
      setDataStats(stats);
    } catch (error) {
      console.error('Failed to load data stats:', error);
    }
  };

  const handleSyncToTraining = async () => {
    setSyncStatus('syncing');
    try {
      await firebaseTrainingService.syncSyntheticDataToTraining();
      setSyncStatus('synced');
      setLastSync(new Date().toLocaleString());
      humorToast("🔄 Data Synced", "Synthetic data successfully synced to training pipeline", 3000);
    } catch (error) {
      setSyncStatus('error');
      humorToast("❌ Sync Failed", "Failed to sync data to training pipeline", 4000);
      console.error('Sync failed:', error);
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return 'text-green-400';
      case 'syncing': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <RefreshCw className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lime-400">
          <Database className="w-5 h-5" />
          Training Data Sync Status
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          Sync synthetic data with the training pipeline for model updates
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sync Status */}
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className={getSyncStatusColor()}>{getSyncStatusIcon()}</span>
            <span className="text-white font-medium">Pipeline Status</span>
          </div>
          <Badge 
            variant="outline" 
            className={`${getSyncStatusColor()} border-current`}
          >
            {syncStatus.charAt(0).toUpperCase() + syncStatus.slice(1)}
          </Badge>
        </div>

        {/* Data Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-lg font-bold text-white">{dataStats.realShipments}</div>
            <div className="text-xs text-indigo-300">Real Data</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-lg font-bold text-lime-400">{dataStats.syntheticShipments}</div>
            <div className="text-xs text-indigo-300">Synthetic Data</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-lg font-bold text-purple-400">{dataStats.syntheticRatio.toFixed(1)}x</div>
            <div className="text-xs text-indigo-300">Augmentation</div>
          </div>
          <div className="text-center p-3 bg-slate-800/30 rounded-lg">
            <div className="text-lg font-bold text-blue-400">{dataStats.totalShipments}</div>
            <div className="text-xs text-indigo-300">Total Records</div>
          </div>
        </div>

        {/* Data Quality Metrics */}
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Data Quality Metrics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-300">Completeness</span>
                <span className="text-lime-400">{(dataStats.dataQuality.completeness * 100).toFixed(0)}%</span>
              </div>
              <Progress value={dataStats.dataQuality.completeness * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-300">Consistency</span>
                <span className="text-lime-400">{(dataStats.dataQuality.consistency * 100).toFixed(0)}%</span>
              </div>
              <Progress value={dataStats.dataQuality.consistency * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-indigo-300">Accuracy</span>
                <span className="text-lime-400">{(dataStats.dataQuality.accuracy * 100).toFixed(0)}%</span>
              </div>
              <Progress value={dataStats.dataQuality.accuracy * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Privacy Metrics */}
        <div className="p-3 bg-slate-800/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-white font-medium">Privacy Protection</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-indigo-300 text-sm">Anonymity Level</span>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {dataStats.privacyMetrics.anonymityLevel}
            </Badge>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSyncToTraining}
            disabled={syncStatus === 'syncing'}
            className="bg-lime-400 hover:bg-lime-500 text-slate-900 flex-1"
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync to Training
              </>
            )}
          </Button>
          
          <Button
            onClick={loadDataStats}
            variant="outline"
            className="border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-slate-900"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Stats
          </Button>
        </div>

        {/* Last Sync Info */}
        <div className="text-xs text-indigo-300 text-center pt-2 border-t border-slate-700">
          Last synced: {lastSync}
        </div>
      </CardContent>
    </Card>
  );
}
