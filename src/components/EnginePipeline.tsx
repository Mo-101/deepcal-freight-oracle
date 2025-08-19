import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Database,
  Brain,
  Target
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  duration?: number;
  error?: string;
}

interface EnginePipelineProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

export default function EnginePipeline({ isRunning, onStart, onPause, onStop }: EnginePipelineProps) {
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: 'data-validation',
      name: 'Data Validation',
      status: 'pending',
      progress: 0
    },
    {
      id: 'feature-extraction',
      name: 'Feature Extraction',
      status: 'pending',
      progress: 0
    },
    {
      id: 'model-training',
      name: 'Model Training',
      status: 'pending',
      progress: 0
    },
    {
      id: 'optimization',
      name: 'Route Optimization',
      status: 'pending',
      progress: 0
    },
    {
      id: 'validation',
      name: 'Model Validation',
      status: 'pending',
      progress: 0
    }
  ]);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setStages(prevStages => {
        const newStages = [...prevStages];
        const currentStage = newStages[currentStageIndex];

        if (currentStage && currentStage.status !== 'completed') {
          // Update current stage
          if (currentStage.status === 'pending') {
            currentStage.status = 'running';
          }

          if (currentStage.status === 'running') {
            currentStage.progress = Math.min(100, currentStage.progress + Math.random() * 5);
            
            if (currentStage.progress >= 100) {
              currentStage.status = 'completed';
              currentStage.duration = Math.floor(Math.random() * 30) + 10; // 10-40 seconds
              
              // Move to next stage
              if (currentStageIndex < newStages.length - 1) {
                setCurrentStageIndex(prev => prev + 1);
              }
            }
          }
        }

        return newStages;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, currentStageIndex]);

  useEffect(() => {
    const completedStages = stages.filter(stage => stage.status === 'completed').length;
    const runningStage = stages.find(stage => stage.status === 'running');
    const runningProgress = runningStage ? runningStage.progress : 0;
    
    setTotalProgress((completedStages * 100 + runningProgress) / stages.length);
  }, [stages]);

  const getStageIcon = (stage: PipelineStage) => {
    switch (stage.id) {
      case 'data-validation':
        return <Database className="w-4 h-4" />;
      case 'feature-extraction':
        return <Zap className="w-4 h-4" />;
      case 'model-training':
        return <Brain className="w-4 h-4" />;
      case 'optimization':
        return <Target className="w-4 h-4" />;
      case 'validation':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'running':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Running</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>;
    }
  };

  const allCompleted = stages.every(stage => stage.status === 'completed');
  const hasError = stages.some(stage => stage.status === 'error');

  return (
    <Card className="bg-white/10 border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-lime-400" />
            Engine Pipeline
          </div>
          <div className="flex items-center gap-2">
            {!isRunning && !allCompleted && (
              <Button
                onClick={onStart}
                size="sm"
                className="bg-lime-600 hover:bg-lime-700 text-black"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            )}
            {isRunning && (
              <>
                <Button
                  onClick={onPause}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={onStop}
                  size="sm"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Overall Progress</span>
            <span className="text-sm text-indigo-300">{totalProgress.toFixed(1)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
          {allCompleted && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Pipeline completed successfully</span>
            </div>
          )}
          {hasError && (
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Pipeline encountered errors</span>
            </div>
          )}
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Pipeline Stages</h4>
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`p-3 rounded-lg border transition-colors ${
                  stage.status === 'running'
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : stage.status === 'completed'
                    ? 'border-green-500/30 bg-green-500/5'
                    : stage.status === 'error'
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(stage.status)}>
                      {getStageIcon(stage)}
                    </div>
                    <span className="text-sm font-medium text-white">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {stage.duration && (
                      <div className="flex items-center gap-1 text-xs text-indigo-300">
                        <Clock className="w-3 h-3" />
                        {stage.duration}s
                      </div>
                    )}
                    {getStatusBadge(stage.status)}
                  </div>
                </div>
                
                {(stage.status === 'running' || stage.status === 'completed') && (
                  <div className="space-y-1">
                    <Progress value={stage.progress} className="h-1" />
                    <div className="flex justify-between text-xs text-indigo-300">
                      <span>{stage.progress.toFixed(1)}%</span>
                      {stage.status === 'running' && (
                        <span className="animate-pulse">Processing...</span>
                      )}
                    </div>
                  </div>
                )}

                {stage.error && (
                  <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                    {stage.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-lime-400">
              {stages.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-xs text-indigo-300">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {stages.filter(s => s.status === 'running').length}
            </div>
            <div className="text-xs text-indigo-300">Running</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-400">
              {stages.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-xs text-indigo-300">Pending</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}