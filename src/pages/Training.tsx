import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import DeepCALHeader from '@/components/DeepCALHeader';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Target, 
  Activity, 
  Settings, 
  Sliders,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  Save,
  Play,
  Database
} from 'lucide-react';

export interface WeightVector {
  cost: number;
  time: number;
  reliability: number;
  risk: number;
}

const DEFAULT_WEIGHTS: WeightVector = {
  cost: 0.35,
  time: 0.35,
  reliability: 0.2,
  risk: 0.1,
};

interface ModelConfig {
  primaryLLM: string;
  creativity: number;
  responseLength: number;
  contextWindow: number;
  realTimeProcessing: boolean;
}

interface SystemStatus {
  neutroEngine: 'connected' | 'warning' | 'error';
  firestore: 'connected' | 'warning' | 'error';
  groqAPI: 'connected' | 'warning' | 'error';
  trainingPipeline: 'connected' | 'warning' | 'error';
}

export default function TrainingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('engine');
  const [weights, setWeights] = useState<WeightVector>(() => {
    const cached = localStorage.getItem('deepcal-weights');
    return cached ? JSON.parse(cached) : DEFAULT_WEIGHTS;
  });

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    primaryLLM: 'GPT-4 Turbo',
    creativity: 65,
    responseLength: 50,
    contextWindow: 7,
    realTimeProcessing: true
  });

  const [systemStatus] = useState<SystemStatus>({
    neutroEngine: 'connected',
    firestore: 'connected',
    groqAPI: 'warning',
    trainingPipeline: 'connected'
  });

  const [trainingMetrics] = useState({
    samplesProcessed: 12543,
    accuracy: 94.2,
    lastTraining: '2 hours ago',
    modelVersion: '2.1.3'
  });

  useEffect(() => {
    localStorage.setItem('deepcal-weights', JSON.stringify(weights));
  }, [weights]);

  const handleSlider = (k: keyof WeightVector, v: number) => {
    const next = { ...weights, [k]: v / 100 } as WeightVector;
    const sum = Object.values(next).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 0.0001) return;
    setWeights(next);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const triggerTraining = () => {
    toast({ 
      title: 'Training Initiated', 
      description: 'Neutrosophic engine optimization in progress...' 
    });
  };

  const saveConfiguration = () => {
    toast({ 
      title: 'Configuration Saved', 
      description: 'Model parameters updated successfully' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      
      <div className="container max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <header className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center text-slate-900 shadow-glass">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  DeepCAL++ Neural Training
                </h1>
                <p className="text-indigo-200 mt-1">
                  Advanced multi-criteria optimization with MOSTLY AI synthetic data
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveConfiguration} className="bg-purple-700 hover:bg-purple-600">
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
              <Button onClick={triggerTraining} className="bg-lime-400 hover:bg-lime-500 text-slate-900">
                <Play className="w-4 h-4 mr-2" />
                Start Training
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - System Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Engine Preview */}
            <Card className="glass-card shadow-glass border border-glassBorder">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Neural Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-white animate-pulse" />
                </div>
                <p className="text-indigo-300 mb-4">Neutrosophic Core Active</p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    Monitor Performance
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    View Matrices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="glass-card shadow-glass border border-glassBorder">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-lime-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    System Status
                  </span>
                  <Badge className="bg-green-900 text-green-300">Operational</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Neutro Engine</span>
                  {getStatusIcon(systemStatus.neutroEngine)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Firestore</span>
                  {getStatusIcon(systemStatus.firestore)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Groq API</span>
                  {getStatusIcon(systemStatus.groqAPI)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300">Training Pipeline</span>
                  {getStatusIcon(systemStatus.trainingPipeline)}
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Connections
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Metrics */}
            <Card className="glass-card shadow-glass border border-glassBorder">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Training Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-indigo-300">Samples</span>
                  <span className="text-white font-mono">{trainingMetrics.samplesProcessed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">Accuracy</span>
                  <span className="text-lime-400 font-mono">{trainingMetrics.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">Last Run</span>
                  <span className="text-white text-sm">{trainingMetrics.lastTraining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-300">Version</span>
                  <span className="text-white font-mono">{trainingMetrics.modelVersion}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'engine', label: 'Engine Configuration', icon: Brain },
                { id: 'weights', label: 'Criteria Weights', icon: Sliders },
                { id: 'synthetic', label: 'Synthetic Data', icon: Database },
                { id: 'advanced', label: 'Advanced', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'text-lime-400 border-b-2 border-lime-400'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'engine' && (
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
            )}

            {activeTab === 'weights' && (
              <Card className="glass-card shadow-glass border border-glassBorder">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
                    <Sliders className="w-5 h-5" />
                    Criteria Weights Configuration
                  </CardTitle>
                  <p className="text-indigo-300 mt-2">
                    Adjust the importance of each criterion in the decision-making process. All weights must total 100%.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(['cost', 'time', 'reliability', 'risk'] as (keyof WeightVector)[]).map((criterion) => (
                      <div key={criterion} className="space-y-3">
                        <Label className="text-indigo-300 text-lg capitalize">
                          {criterion} Priority
                        </Label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={weights[criterion] * 100}
                          onChange={(e) => handleSlider(criterion, Number(e.target.value))}
                          className="w-full accent-lime-400 h-2"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-indigo-300">Weight</span>
                          <Badge className="bg-lime-400/20 text-lime-400 font-mono">
                            {(weights[criterion] * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <h4 className="text-white font-semibold mb-2">Current Configuration Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lime-400 font-mono text-lg">{(weights.cost * 100).toFixed(0)}%</div>
                        <div className="text-indigo-300">Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lime-400 font-mono text-lg">{(weights.time * 100).toFixed(0)}%</div>
                        <div className="text-indigo-300">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lime-400 font-mono text-lg">{(weights.reliability * 100).toFixed(0)}%</div>
                        <div className="text-indigo-300">Reliability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lime-400 font-mono text-lg">{(weights.risk * 100).toFixed(0)}%</div>
                        <div className="text-indigo-300">Risk</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'synthetic' && (
              <SyntheticDataManager 
                onDataGenerated={() => {
                  toast({ 
                    title: 'Synthetic Data Ready', 
                    description: 'New synthetic training data is available for model retraining' 
                  });
                }}
              />
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <Card className="glass-card shadow-glass border border-glassBorder">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-lime-400 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Advanced Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <span className="text-white font-medium">Neutrosophic Engine Parameters</span>
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 p-4 bg-slate-800/50 rounded-lg space-y-3">
                        <div>
                          <Label className="text-indigo-300">Truth Degree Threshold</Label>
                          <Input type="number" defaultValue="0.75" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-indigo-300">Indeterminacy Tolerance</Label>
                          <Input type="number" defaultValue="0.15" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-indigo-300">Falsity Rejection Level</Label>
                          <Input type="number" defaultValue="0.10" className="mt-1" />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <span className="text-white font-medium">TOPSIS Configuration</span>
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 p-4 bg-slate-800/50 rounded-lg space-y-3">
                        <div>
                          <Label className="text-indigo-300">Distance Metric</Label>
                          <select className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-1">
                            <option>Euclidean Distance</option>
                            <option>Manhattan Distance</option>
                            <option>Minkowski Distance</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-indigo-300">Normalization Method</Label>
                          <select className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-1">
                            <option>Vector Normalization</option>
                            <option>Linear Normalization</option>
                            <option>Min-Max Normalization</option>
                          </select>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <span className="text-white font-medium">Grey System Theory</span>
                        <ChevronDown className="w-4 h-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 p-4 bg-slate-800/50 rounded-lg space-y-3">
                        <div>
                          <Label className="text-indigo-300">Grey Relation Resolution</Label>
                          <Input type="number" defaultValue="0.5" step="0.1" className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-indigo-300">Whitening Weight Function</Label>
                          <select className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 mt-1">
                            <option>Linear</option>
                            <option>Exponential</option>
                            <option>Logarithmic</option>
                          </select>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
