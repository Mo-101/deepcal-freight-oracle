
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, ChevronDown, Brain, Target, Zap, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdvancedConfigTab() {
  const { toast } = useToast();
  
  // Super Ultimate Logistic Symbolic Engine Parameters
  const [neutrosophicConfig, setNeutrosophicConfig] = useState({
    truthThreshold: 0.80,
    indeterminacyTolerance: 0.10,
    falsityRejectionLevel: 0.05
  });

  const [topsisConfig, setTopsisConfig] = useState({
    distanceMetric: 'manhattan',
    normalizationMethod: 'min-max',
    criteriaWeights: 'entropy',
    ensembleMode: true
  });

  const [greySystemConfig, setGreySystemConfig] = useState({
    relationResolution: 0.4,
    linearWeight: 0.6,
    exponentialWeight: 0.3,
    logarithmicWeight: 0.1
  });

  const [engineMode, setEngineMode] = useState('super-ultimate');

  const handleSaveConfiguration = () => {
    const config = {
      neutrosophicConfig,
      topsisConfig,
      greySystemConfig,
      engineMode
    };
    
    localStorage.setItem('symbolic-engine-config', JSON.stringify(config));
    
    toast({
      title: '🚀 Super Ultimate Configuration Saved',
      description: 'Logistic Symbolic Engine parameters updated successfully',
    });
  };

  const resetToDefaults = () => {
    setNeutrosophicConfig({
      truthThreshold: 0.75,
      indeterminacyTolerance: 0.15,
      falsityRejectionLevel: 0.10
    });
    
    setTopsisConfig({
      distanceMetric: 'euclidean',
      normalizationMethod: 'vector',
      criteriaWeights: 'equal',
      ensembleMode: false
    });
    
    setGreySystemConfig({
      relationResolution: 0.5,
      linearWeight: 0.4,
      exponentialWeight: 0.4,
      logarithmicWeight: 0.2
    });
    
    setEngineMode('standard');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass-card shadow-glass border border-lime-400/30 bg-gradient-to-r from-lime-900/20 to-blue-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Super Ultimate Logistic Symbolic Engine
            </CardTitle>
            <Badge className="bg-lime-400/20 text-lime-300 border-lime-400/50">
              {engineMode.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-indigo-300">
            Advanced symbolic reasoning with Neutrosophic Logic + TOPSIS + Grey System Theory
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={handleSaveConfiguration}
              className="bg-lime-400 hover:bg-lime-500 text-slate-900"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            <Button 
              onClick={resetToDefaults}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Neutrosophic Engine Configuration */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Neutrosophic Engine Parameters
          </CardTitle>
          <p className="text-xs text-slate-400">
            Filters ambiguous/logically inconsistent inputs with truth/falsity handling
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-indigo-300 mb-2 block">
                Truth Degree Threshold
                <Badge className="ml-2 text-xs bg-green-600/20 text-green-400">
                  {neutrosophicConfig.truthThreshold}
                </Badge>
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                step="0.01"
                value={neutrosophicConfig.truthThreshold}
                onChange={(e) => setNeutrosophicConfig(prev => ({
                  ...prev,
                  truthThreshold: parseFloat(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">
                Symbols/rules require >{(neutrosophicConfig.truthThreshold * 100).toFixed(0)}% confidence to propagate
              </p>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">
                Indeterminacy Tolerance
                <Badge className="ml-2 text-xs bg-yellow-600/20 text-yellow-400">
                  {neutrosophicConfig.indeterminacyTolerance}
                </Badge>
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                step="0.01"
                value={neutrosophicConfig.indeterminacyTolerance}
                onChange={(e) => setNeutrosophicConfig(prev => ({
                  ...prev,
                  indeterminacyTolerance: parseFloat(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">
                Rejects symbols with >{(neutrosophicConfig.indeterminacyTolerance * 100).toFixed(0)}% ambiguity
              </p>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">
                Falsity Rejection Level
                <Badge className="ml-2 text-xs bg-red-600/20 text-red-400">
                  {neutrosophicConfig.falsityRejectionLevel}
                </Badge>
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                step="0.01"
                value={neutrosophicConfig.falsityRejectionLevel}
                onChange={(e) => setNeutrosophicConfig(prev => ({
                  ...prev,
                  falsityRejectionLevel: parseFloat(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <p className="text-xs text-slate-400 mt-1">
                Aggressively discards contradictions above {(neutrosophicConfig.falsityRejectionLevel * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOPSIS Configuration */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            TOPSIS Configuration
          </CardTitle>
          <p className="text-xs text-slate-400">
            Ranks symbolic alternatives using multi-criteria optimization
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-indigo-300 mb-2 block">Distance Metric</Label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                value={topsisConfig.distanceMetric}
                onChange={(e) => setTopsisConfig(prev => ({
                  ...prev,
                  distanceMetric: e.target.value
                }))}
              >
                <option value="manhattan">Manhattan Distance (Optimal for discrete symbolic spaces)</option>
                <option value="euclidean">Euclidean Distance</option>
                <option value="minkowski">Minkowski Distance (p=1.5)</option>
                <option value="hybrid">Hybrid Euclidean-Manhattan</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Manhattan measures "rule violation steps" in symbolic spaces
              </p>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">Normalization Method</Label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                value={topsisConfig.normalizationMethod}
                onChange={(e) => setTopsisConfig(prev => ({
                  ...prev,
                  normalizationMethod: e.target.value
                }))}
              >
                <option value="min-max">Min-Max Scaling (Converts symbolic scores to [0,1])</option>
                <option value="vector">Vector Normalization</option>
                <option value="linear">Linear Normalization</option>
                <option value="adaptive">Adaptive Min-Max + Vector</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Min-Max optimal for bounded symbolic rule satisfaction scores
              </p>
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">Criteria Weights</Label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                value={topsisConfig.criteriaWeights}
                onChange={(e) => setTopsisConfig(prev => ({
                  ...prev,
                  criteriaWeights: e.target.value
                }))}
              >
                <option value="entropy">Rule Criticality Entropy (Auto-calculated)</option>
                <option value="equal">Equal Weights</option>
                <option value="manual">Manual Weights</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Entropy weights prioritize frequently used core rules
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ensembleMode"
                checked={topsisConfig.ensembleMode}
                onChange={(e) => setTopsisConfig(prev => ({
                  ...prev,
                  ensembleMode: e.target.checked
                }))}
                className="rounded border-slate-600"
              />
              <Label htmlFor="ensembleMode" className="text-indigo-300">
                Enable Ensemble Mode (Borda Count Aggregation)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grey System Theory Configuration */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Grey System Theory
          </CardTitle>
          <p className="text-xs text-slate-400">
            Handles partial/uncertain symbolic knowledge with whitening functions
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-indigo-300 mb-2 block">
              Grey Relation Resolution (Distinguishing Coefficient)
              <Badge className="ml-2 text-xs bg-purple-600/20 text-purple-400">
                {greySystemConfig.relationResolution}
              </Badge>
            </Label>
            <Input 
              type="number" 
              min="0" 
              max="1" 
              step="0.1"
              value={greySystemConfig.relationResolution}
              onChange={(e) => setGreySystemConfig(prev => ({
                ...prev,
                relationResolution: parseFloat(e.target.value)
              }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-xs text-slate-400 mt-1">
              Higher sensitivity for sparse symbolic relationships (0.4 = optimal)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-indigo-300 mb-2 block">
                Linear Weight
                <span className="text-xs text-slate-400 block">Concrete Symbols</span>
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                step="0.1"
                value={greySystemConfig.linearWeight}
                onChange={(e) => setGreySystemConfig(prev => ({
                  ...prev,
                  linearWeight: parseFloat(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">
                Exponential Weight
                <span className="text-xs text-slate-400 block">Fuzzy Predicates</span>
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                step="0.1"
                value={greySystemConfig.exponentialWeight}
                onChange={(e) => setGreySystemConfig(prev => ({
                  ...prev,
                  exponentialWeight: parseFloat(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-indigo-300 mb-2 block">
                Logarithmic Weight
                <span className="text-xs text-slate-400 block">Dynamic Variables</span>
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="1" 
                step="0.1"
                value={greySystemConfig.logarithmicWeight}
                onChange={(e) => setGreySystemConfig(prev => ({
                  ...prev,    
                  logarithmicWeight: parseFloat(e.target.value)
                }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-lime-400 mb-2">Whitening Function Fusion Formula:</h4>
            <code className="text-xs text-cyan-400">
              final_score = ({greySystemConfig.linearWeight} × Linear) + ({greySystemConfig.exponentialWeight} × Exponential) + ({greySystemConfig.logarithmicWeight} × Logarithmic)
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Integration Pipeline */}
      <Card className="glass-card shadow-glass border border-glassBorder bg-gradient-to-r from-blue-900/10 to-purple-900/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-lime-400">
            Logistic Symbolic Engine Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">1</div>
              <div>
                <h4 className="text-white font-medium">Neutrosophic Filter</h4>
                <p className="text-xs text-slate-400">Input → Symbolic Parser → Truth/Falsity Validation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
              <div>
                <h4 className="text-white font-medium">TOPSIS Engine</h4>
                <p className="text-xs text-slate-400">Multi-criteria ranking with entropy-weighted rule compliance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">3</div>
              <div>
                <h4 className="text-white font-medium">Grey Whitening</h4>
                <p className="text-xs text-slate-400">Uncertainty handling → Crisp output values</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
