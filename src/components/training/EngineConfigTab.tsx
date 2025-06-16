
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cpu, Zap } from 'lucide-react';
import { TrainingActivityMonitor } from './TrainingActivityMonitor';

interface ModelConfig {
  primaryLLM: string;
  creativity: number;
  responseLength: number;
  contextWindow: number;
  realTimeProcessing: boolean;
}

interface TrainingMetrics {
  samplesProcessed: number;
  accuracy: number;
  lastTraining: string;
  modelVersion: string;
}

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

interface EngineConfigTabProps {
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  trainingMetrics: TrainingMetrics;
  isTraining: boolean;
  trainingActivities: TrainingActivity[];
}

export function EngineConfigTab({ 
  modelConfig, 
  setModelConfig, 
  trainingMetrics, 
  isTraining, 
  trainingActivities 
}: EngineConfigTabProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Configuration */}
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              AI Model Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-indigo-300 mb-2 block">Primary LLM</Label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-lime-400"
                value={modelConfig.primaryLLM}
                onChange={(e) => setModelConfig(prev => ({ ...prev, primaryLLM: e.target.value }))}
              >
                <option>GPT-4 Turbo (Recommended)</option>
                <option>Claude 3 Opus</option>
                <option>Gemini Pro</option>
                <option>Llama 3 70B</option>
                <option>Mixtral 8x7B</option>
              </select>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">Creativity Level</Label>
              <input
                type="range"
                min={0}
                max={100}
                value={modelConfig.creativity}
                onChange={(e) => setModelConfig(prev => ({ ...prev, creativity: Number(e.target.value) }))}
                className="w-full accent-lime-400"
              />
              <div className="flex justify-between text-xs text-indigo-300 mt-1">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
              <span className="text-lime-400 text-sm">{modelConfig.creativity}%</span>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">Response Length</Label>
              <input
                type="range"
                min={0}
                max={100}
                value={modelConfig.responseLength}
                onChange={(e) => setModelConfig(prev => ({ ...prev, responseLength: Number(e.target.value) }))}
                className="w-full accent-lime-400"
              />
              <div className="flex justify-between text-xs text-indigo-300 mt-1">
                <span>Concise</span>
                <span>Moderate</span>
                <span>Detailed</span>
              </div>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">Context Window</Label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={modelConfig.contextWindow}
                  onChange={(e) => setModelConfig(prev => ({ ...prev, contextWindow: Number(e.target.value) }))}
                  className="flex-1 accent-lime-400"
                />
                <Badge variant="outline" className="bg-slate-700 text-lime-400">
                  {modelConfig.contextWindow}K tokens
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engine Performance */}
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Model Accuracy</span>
                <span className="text-lime-400 font-mono">{trainingMetrics.accuracy}%</span>
              </div>
              <Progress value={trainingMetrics.accuracy} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Training Progress</span>
                <span className="text-blue-400 font-mono">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-indigo-300">Memory Usage</span>
                <span className="text-yellow-400 font-mono">2.3GB / 8GB</span>
              </div>
              <Progress value={29} className="h-2" />
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-indigo-300">Avg Response Time:</span>
                <span className="text-white">127ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-300">CPU Usage:</span>
                <span className="text-white">34%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Activity Monitor */}
      <TrainingActivityMonitor 
        isTraining={isTraining} 
        trainingActivities={trainingActivities} 
      />
    </>
  );
}
