import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp, Zap, Target } from 'lucide-react';

interface LiveMetricsPanelProps {
  isTraining: boolean;
}

export function LiveMetricsPanel({ isTraining }: LiveMetricsPanelProps) {
  const [metrics, setMetrics] = useState({
    accuracy: 94.2,
    loss: 0.245,
    learningRate: 0.001,
    epochProgress: 67,
    batchesProcessed: 1247,
    totalBatches: 1850
  });

  // Simulate real-time metrics updates when training
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        accuracy: Math.min(99.9, prev.accuracy + (Math.random() - 0.5) * 0.5),
        loss: Math.max(0.01, prev.loss + (Math.random() - 0.7) * 0.01),
        epochProgress: Math.min(100, prev.epochProgress + Math.random() * 2),
        batchesProcessed: Math.min(prev.totalBatches, prev.batchesProcessed + Math.floor(Math.random() * 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTraining]);

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-lime-400" />
          Live Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Accuracy */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-200">Model Accuracy</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              {metrics.accuracy.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={metrics.accuracy} className="h-2" />
        </div>

        {/* Loss */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-200">Training Loss</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {metrics.loss.toFixed(3)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-indigo-300">Converging</span>
          </div>
        </div>

        {/* Learning Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-200">Learning Rate</span>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {metrics.learningRate.toFixed(4)}
            </Badge>
          </div>
        </div>

        {/* Epoch Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-200">Epoch Progress</span>
            <span className="text-xs text-indigo-300">
              {metrics.batchesProcessed}/{metrics.totalBatches}
            </span>
          </div>
          <Progress value={metrics.epochProgress} className="h-2" />
        </div>

        {/* Status Indicators */}
        <div className="pt-2 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-indigo-200">
                {isTraining ? 'Training' : 'Idle'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3 text-green-400" />
              <span className="text-indigo-200">Optimizing</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}