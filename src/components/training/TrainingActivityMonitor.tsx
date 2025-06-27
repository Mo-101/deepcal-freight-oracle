
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  Activity,
  CheckCircle,
  Timer,
  Network,
  Layers,
  Brain,
  Eye,
  Target
} from 'lucide-react';

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
  isTraining: boolean;
  trainingActivities: TrainingActivity[];
}

export function TrainingActivityMonitor({ isTraining, trainingActivities }: TrainingActivityMonitorProps) {
  const getActivityStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'active': return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'pending': return <Timer className="w-4 h-4 text-gray-400" />;
      default: return <Timer className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Training Activity Monitor
          {isTraining && <Badge className="bg-blue-900 text-blue-300 animate-pulse">LIVE</Badge>}
        </CardTitle>
        <p className="text-indigo-300 text-sm mt-2">
          Real-time neural network training pipeline visualization
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Training Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`p-4 rounded-lg border transition-all duration-500 ${
                activity.status === 'active' 
                  ? 'bg-blue-900/30 border-blue-400 shadow-lg shadow-blue-500/20' 
                  : activity.status === 'completed'
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-slate-800/50 border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getActivityStatusIcon(activity.status)}
                  <span className="text-white font-medium text-sm">{activity.stage}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    activity.status === 'active' ? 'text-blue-400 border-blue-400' :
                    activity.status === 'completed' ? 'text-green-400 border-green-400' :
                    'text-gray-400 border-gray-400'
                  }`}
                >
                  {activity.timestamp}
                </Badge>
              </div>
              
              <Progress 
                value={activity.progress} 
                className={`h-2 mb-3 ${activity.status === 'active' ? 'animate-pulse' : ''}`} 
              />
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-indigo-300">Loss:</span>
                  <div className="text-white font-mono">{activity.metrics.loss.toFixed(3)}</div>
                </div>
                <div>
                  <span className="text-indigo-300">Acc:</span>
                  <div className="text-lime-400 font-mono">{activity.metrics.accuracy.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-indigo-300">LR:</span>
                  <div className="text-purple-400 font-mono">{activity.metrics.learningRate.toFixed(4)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Metrics Visualization */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-4 h-4 text-lime-400" />
            <span className="text-white font-medium">Neural Network Architecture</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-indigo-300">Input Layer</div>
              <div className="text-lime-400 font-mono text-sm">512</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-indigo-300">Hidden Layers</div>
              <div className="text-lime-400 font-mono text-sm">3x256</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-indigo-300">Attention</div>
              <div className="text-lime-400 font-mono text-sm">8 Heads</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-indigo-300">Output Layer</div>
              <div className="text-lime-400 font-mono text-sm">4</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
