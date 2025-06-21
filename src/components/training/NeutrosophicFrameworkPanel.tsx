
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  Zap, 
  BarChart3,
  RefreshCw,
  Settings,
  TrendingUp
} from 'lucide-react';

interface NeutrosophicParams {
  truthThreshold: number;
  indeterminacyTolerance: number;
  falsityRejection: number;
}

interface TOPSISConfig {
  distanceMetric: 'euclidean' | 'manhattan' | 'minkowski';
  normalizationMethod: 'vector' | 'linear' | 'minmax';
  idealSolution: 'dynamic' | 'static';
}

interface AHPWeights {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

interface FrameworkMetrics {
  neutrosophicAccuracy: number;
  ahpConsistency: number;
  topsisRanking: number;
  greySystemFit: number;
  overallPerformance: number;
}

export function NeutrosophicFrameworkPanel() {
  const [neutrosophicParams, setNeutrosophicParams] = useState<NeutrosophicParams>({
    truthThreshold: 75,
    indeterminacyTolerance: 15,
    falsityRejection: 10
  });

  const [topsisConfig, setTopsisConfig] = useState<TOPSISConfig>({
    distanceMetric: 'euclidean',
    normalizationMethod: 'vector',
    idealSolution: 'dynamic'
  });

  const [ahpWeights, setAHPWeights] = useState<AHPWeights>({
    cost: 35,
    time: 35,
    reliability: 20,
    risk: 10
  });

  const [metrics, setMetrics] = useState<FrameworkMetrics>({
    neutrosophicAccuracy: 94.2,
    ahpConsistency: 0.087,
    topsisRanking: 91.5,
    greySystemFit: 88.7,
    overallPerformance: 92.1
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  // Ensure weights sum to 100
  const normalizeWeights = (newWeights: Partial<AHPWeights>) => {
    const updated = { ...ahpWeights, ...newWeights };
    const total = Object.values(updated).reduce((sum, val) => sum + val, 0);
    
    if (total !== 100) {
      const factor = 100 / total;
      Object.keys(updated).forEach(key => {
        updated[key as keyof AHPWeights] = Math.round(updated[key as keyof AHPWeights] * factor);
      });
    }
    
    return updated;
  };

  useEffect(() => {
    if (isOptimizing) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          neutrosophicAccuracy: Math.max(85, Math.min(99, prev.neutrosophicAccuracy + (Math.random() - 0.5) * 2)),
          ahpConsistency: Math.max(0.01, Math.min(0.15, prev.ahpConsistency + (Math.random() - 0.5) * 0.02)),
          topsisRanking: Math.max(80, Math.min(98, prev.topsisRanking + (Math.random() - 0.5) * 3)),
          greySystemFit: Math.max(75, Math.min(95, prev.greySystemFit + (Math.random() - 0.5) * 2.5)),
          overallPerformance: Math.max(80, Math.min(96, prev.overallPerformance + (Math.random() - 0.5) * 1.5))
        }));
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isOptimizing]);

  // Calculate overall performance based on individual metrics
  useEffect(() => {
    const neutroScore = metrics.neutrosophicAccuracy;
    const ahpScore = (1 - metrics.ahpConsistency) * 100; // Lower is better for consistency ratio
    const topsisScore = metrics.topsisRanking;
    const greyScore = metrics.greySystemFit;
    
    const overall = (neutroScore * 0.3 + ahpScore * 0.25 + topsisScore * 0.25 + greyScore * 0.2);
    
    setMetrics(prev => ({ ...prev, overallPerformance: overall }));
  }, [metrics.neutrosophicAccuracy, metrics.ahpConsistency, metrics.topsisRanking, metrics.greySystemFit]);

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Neutrosophic + AHP + TOPSIS + Grey Framework
          <Badge className="bg-purple-900 text-purple-300">Symbolic Engine</Badge>
        </CardTitle>
        <p className="text-indigo-300 text-sm">
          Advanced decision-making framework combining uncertainty logic with multi-criteria optimization
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Neutrosophic Parameters */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Neutrosophic Logic Parameters
          </h4>
          
          <div className="space-y-4">
            <div>
              <Label className="text-indigo-300 mb-2 block">
                Truth Threshold: {neutrosophicParams.truthThreshold}%
              </Label>
              <Slider
                value={[neutrosophicParams.truthThreshold]}
                onValueChange={(value) => setNeutrosophicParams(prev => ({ 
                  ...prev, 
                  truthThreshold: value[0] 
                }))}
                min={50}
                max={95}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                Minimum confidence level for accepting freight decisions
              </div>
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">
                Indeterminacy Tolerance: {neutrosophicParams.indeterminacyTolerance}%
              </Label>
              <Slider
                value={[neutrosophicParams.indeterminacyTolerance]}
                onValueChange={(value) => setNeutrosophicParams(prev => ({ 
                  ...prev, 
                  indeterminacyTolerance: value[0] 
                }))}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                Acceptable uncertainty in logistics decisions
              </div>
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">
                Falsity Rejection: {neutrosophicParams.falsityRejection}%
              </Label>
              <Slider
                value={[neutrosophicParams.falsityRejection]}
                onValueChange={(value) => setNeutrosophicParams(prev => ({ 
                  ...prev, 
                  falsityRejection: value[0] 
                }))}
                min={5}
                max={25}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">
                Threshold for rejecting poor freight options
              </div>
            </div>
          </div>
        </div>

        {/* AHP Weight Configuration */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            AHP Decision Weights (Total: {Object.values(ahpWeights).reduce((a, b) => a + b, 0)}%)
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-indigo-300 mb-2 block">Cost Weight: {ahpWeights.cost}%</Label>
              <Slider
                value={[ahpWeights.cost]}
                onValueChange={(value) => setAHPWeights(normalizeWeights({ cost: value[0] }))}
                min={10}
                max={60}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">Time Weight: {ahpWeights.time}%</Label>
              <Slider
                value={[ahpWeights.time]}
                onValueChange={(value) => setAHPWeights(normalizeWeights({ time: value[0] }))}
                min={10}
                max={60}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">Reliability Weight: {ahpWeights.reliability}%</Label>
              <Slider
                value={[ahpWeights.reliability]}
                onValueChange={(value) => setAHPWeights(normalizeWeights({ reliability: value[0] }))}
                min={5}
                max={40}
                step={1}
                className="w-full"
              />
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">Risk Weight: {ahpWeights.risk}%</Label>
              <Slider
                value={[ahpWeights.risk]}
                onValueChange={(value) => setAHPWeights(normalizeWeights({ risk: value[0] }))}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* TOPSIS Configuration */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            TOPSIS Configuration
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-indigo-300 mb-2 block">Distance Metric</Label>
              <select
                value={topsisConfig.distanceMetric}
                onChange={(e) => setTopsisConfig(prev => ({ 
                  ...prev, 
                  distanceMetric: e.target.value as TOPSISConfig['distanceMetric']
                }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
              >
                <option value="euclidean">Euclidean</option>
                <option value="manhattan">Manhattan</option>
                <option value="minkowski">Minkowski</option>
              </select>
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">Normalization</Label>
              <select
                value={topsisConfig.normalizationMethod}
                onChange={(e) => setTopsisConfig(prev => ({ 
                  ...prev, 
                  normalizationMethod: e.target.value as TOPSISConfig['normalizationMethod']
                }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
              >
                <option value="vector">Vector</option>
                <option value="linear">Linear</option>
                <option value="minmax">Min-Max</option>
              </select>
            </div>
            
            <div>
              <Label className="text-indigo-300 mb-2 block">Ideal Solution</Label>
              <select
                value={topsisConfig.idealSolution}
                onChange={(e) => setTopsisConfig(prev => ({ 
                  ...prev, 
                  idealSolution: e.target.value as TOPSISConfig['idealSolution']
                }))}
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
              >
                <option value="dynamic">Dynamic</option>
                <option value="static">Static</option>
              </select>
            </div>
          </div>
        </div>

        {/* Framework Performance Metrics */}
        <div>
          <h4 className="text-lime-400 font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Framework Performance Metrics
          </h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-indigo-300 text-sm">Neutrosophic Accuracy</span>
                <span className="text-lime-400 text-sm">{metrics.neutrosophicAccuracy.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.neutrosophicAccuracy} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-indigo-300 text-sm">AHP Consistency Ratio</span>
                <span className={`text-sm ${metrics.ahpConsistency < 0.1 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {metrics.ahpConsistency.toFixed(3)}
                </span>
              </div>
              <Progress value={(1 - metrics.ahpConsistency) * 100} className="h-2" />
              <div className="text-xs text-gray-400 mt-1">
                {metrics.ahpConsistency < 0.1 ? 'Excellent consistency' : 'Review weight relationships'}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-indigo-300 text-sm">TOPSIS Ranking Quality</span>
                <span className="text-lime-400 text-sm">{metrics.topsisRanking.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.topsisRanking} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-indigo-300 text-sm">Grey System Fit</span>
                <span className="text-lime-400 text-sm">{metrics.greySystemFit.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.greySystemFit} className="h-2" />
            </div>
            
            <div className="pt-2 border-t border-slate-700">
              <div className="flex justify-between mb-1">
                <span className="text-lime-400 font-medium">Overall Framework Performance</span>
                <span className="text-lime-400 font-bold text-lg">{metrics.overallPerformance.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.overallPerformance} className="h-3" />
            </div>
          </div>
        </div>

        {/* Optimization Controls */}
        <div className="flex gap-3">
          <Button
            onClick={() => setIsOptimizing(!isOptimizing)}
            className={`flex-1 ${
              isOptimizing 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isOptimizing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isOptimizing ? 'Stop Optimization' : 'Start Framework Tuning'}
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setNeutrosophicParams({ truthThreshold: 75, indeterminacyTolerance: 15, falsityRejection: 10 });
              setAHPWeights({ cost: 35, time: 35, reliability: 20, risk: 10 });
              setTopsisConfig({ distanceMetric: 'euclidean', normalizationMethod: 'vector', idealSolution: 'dynamic' });
            }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
