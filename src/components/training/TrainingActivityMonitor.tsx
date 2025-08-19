import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface TrainingActivity {
  id: string;
  stage: string;
  progress: number;
  timestamp: string;
  status: 'active' | 'completed' | 'pending';
  metrics: {
    loss: number;
    accuracy: number;
    learningRate: number;
  };
}

interface TrainingActivityMonitorProps {
  activities: TrainingActivity[];
  isTraining: boolean;
}

export function TrainingActivityMonitor({ activities, isTraining }: TrainingActivityMonitorProps) {
  const getStatusIcon = (status: TrainingActivity['status']) => {
    switch (status) {
      case 'active':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TrainingActivity['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-lime-400" />
          Training Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(activity.status)}
                <span className="text-sm font-medium">{activity.stage}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={getStatusColor(activity.status)}
                >
                  {activity.status}
                </Badge>
                {activity.timestamp !== '--:--:--' && (
                  <span className="text-xs text-indigo-300">{activity.timestamp}</span>
                )}
              </div>
            </div>
            
            <Progress 
              value={activity.progress} 
              className="h-2"
            />
            
            {activity.status === 'active' && (
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex flex-col">
                  <span className="text-indigo-300">Loss</span>
                  <span className="text-white font-mono">
                    {activity.metrics.loss.toFixed(3)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-indigo-300">Accuracy</span>
                  <span className="text-white font-mono">
                    {activity.metrics.accuracy.toFixed(1)}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-indigo-300">LR</span>
                  <span className="text-white font-mono">
                    {activity.metrics.learningRate.toFixed(4)}
                  </span>
                </div>
              </div>
            )}
            
            {index < activities.length - 1 && (
              <div className="h-px bg-white/10 my-2" />
            )}
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-indigo-300">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No training activities</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span>Pipeline Status</span>
            <Badge
              variant="secondary"
              className={
                isTraining
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              }
            >
              {isTraining ? 'Running' : 'Idle'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}