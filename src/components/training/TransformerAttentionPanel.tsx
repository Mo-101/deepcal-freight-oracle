
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Network, 
  Zap, 
  Eye, 
  GitBranch,
  Activity,
  Target
} from 'lucide-react';

interface AttentionHead {
  id: number;
  focus: string;
  weight: number;
  active: boolean;
}

interface TransformerLayer {
  id: number;
  type: 'self-attention' | 'feed-forward' | 'normalization';
  parameters: number;
  activation: number;
}

export function TransformerAttentionPanel() {
  const [attentionHeads, setAttentionHeads] = useState<AttentionHead[]>([
    { id: 1, focus: 'Route Efficiency', weight: 0.28, active: true },
    { id: 2, focus: 'Cost Optimization', weight: 0.24, active: true },
    { id: 3, focus: 'Risk Assessment', weight: 0.18, active: true },
    { id: 4, focus: 'Time Sensitivity', weight: 0.15, active: true },
    { id: 5, focus: 'Carrier Reliability', weight: 0.12, active: false },
    { id: 6, focus: 'Geographical Patterns', weight: 0.08, active: false },
    { id: 7, focus: 'Seasonal Factors', weight: 0.06, active: false },
    { id: 8, focus: 'Emergency Context', weight: 0.04, active: false }
  ]);

  const [transformerLayers] = useState<TransformerLayer[]>([
    { id: 1, type: 'self-attention', parameters: 131072, activation: 0.87 },
    { id: 2, type: 'normalization', parameters: 1024, activation: 0.92 },
    { id: 3, type: 'feed-forward', parameters: 524288, activation: 0.84 },
    { id: 4, type: 'normalization', parameters: 1024, activation: 0.89 },
    { id: 5, type: 'self-attention', parameters: 131072, activation: 0.91 },
    { id: 6, type: 'normalization', parameters: 1024, activation: 0.88 }
  ]);

  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setAttentionHeads(prev => prev.map(head => ({
          ...head,
          weight: Math.max(0.01, head.weight + (Math.random() - 0.5) * 0.02),
          active: head.weight > 0.1
        })));
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isTraining]);

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Transformer Attention Mechanism
          <Badge className="bg-purple-900 text-purple-300">8-Head Architecture</Badge>
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          Multi-head attention for route optimization and logistics pattern recognition
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Attention Heads Visualization */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Attention Heads Distribution
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {attentionHeads.map((head) => (
              <div 
                key={head.id}
                className={`p-3 rounded-lg border transition-all duration-500 ${
                  head.active 
                    ? 'bg-purple-900/30 border-purple-400 shadow-lg shadow-purple-500/20' 
                    : 'bg-slate-800/50 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Head {head.id}</span>
                  <Badge 
                    variant={head.active ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {head.active ? 'Active' : 'Dormant'}
                  </Badge>
                </div>
                <div className="text-xs text-indigo-300 mb-2">{head.focus}</div>
                <div className="flex justify-between items-center">
                  <Progress 
                    value={head.weight * 100} 
                    className={`h-1.5 flex-1 mr-2 ${head.active ? 'animate-pulse' : ''}`} 
                  />
                  <span className="text-lime-400 text-xs font-mono">
                    {(head.weight * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transformer Layers */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Transformer Layer Stack
          </h4>
          <div className="space-y-2">
            {transformerLayers.map((layer, index) => (
              <div 
                key={layer.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    layer.type === 'self-attention' ? 'bg-gradient-to-br from-blue-600 to-purple-600' :
                    layer.type === 'feed-forward' ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                    'bg-gradient-to-br from-green-600 to-blue-600'
                  }`}>
                    {layer.type === 'self-attention' ? <Eye className="w-4 h-4 text-white" /> :
                     layer.type === 'feed-forward' ? <Zap className="w-4 h-4 text-white" /> :
                     <Target className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      Layer {index + 1}: {layer.type.replace('-', ' ').toUpperCase()}
                    </div>
                    <div className="text-xs text-indigo-300">
                      {layer.parameters.toLocaleString()} parameters
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lime-400 font-mono text-sm">
                    {(layer.activation * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">activation</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsTraining(!isTraining)}
            className={`flex-1 ${
              isTraining 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isTraining ? 'Stop Attention Training' : 'Start Attention Training'}
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setAttentionHeads(prev => prev.map(head => ({
                ...head,
                weight: Math.random() * 0.3,
                active: Math.random() > 0.3
              })));
            }}
          >
            <Network className="w-4 h-4 mr-2" />
            Randomize Weights
          </Button>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-lime-400">94.7%</div>
            <div className="text-xs text-indigo-300">Attention Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">0.087</div>
            <div className="text-xs text-indigo-300">Attention Loss</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">2.1M</div>
            <div className="text-xs text-indigo-300">Total Parameters</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
