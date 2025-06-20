import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DeepCALHeader from '@/components/DeepCALHeader';
import { SyntheticDataManager } from '@/components/SyntheticDataManager';
import { TrainingHeader } from '@/components/training/TrainingHeader';
import { SystemStatusSidebar } from '@/components/training/SystemStatusSidebar';
import { TrainingTabs } from '@/components/training/TrainingTabs';
import { EngineConfigTab } from '@/components/training/EngineConfigTab';
import { WeightsConfigTab } from '@/components/training/WeightsConfigTab';
import { AdvancedConfigTab } from '@/components/training/AdvancedConfigTab';
import { LiveMetricsPanel } from '@/components/training/LiveMetricsPanel';
import { TrainingLogsPanel } from '@/components/training/TrainingLogsPanel';
import { SyntheticDataSync } from '@/components/training/SyntheticDataSync';
import { ParquetDataPanel } from '@/components/training/ParquetDataPanel';
import { TransformerAttentionPanel } from '@/components/training/TransformerAttentionPanel';
import { GraphNeuralNetworkPanel } from '@/components/training/GraphNeuralNetworkPanel';
import { DeepLearningMigrationPanel } from '@/components/training/DeepLearningMigrationPanel';
import { NeutrosophicFrameworkPanel } from '@/components/training/NeutrosophicFrameworkPanel';

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

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    neutroEngine: 'connected',
    firestore: 'connected',
    groqAPI: 'connected',
    trainingPipeline: 'warning'
  });

  const [trainingMetrics, setTrainingMetrics] = useState({
    samplesProcessed: 12543,
    accuracy: 94.2,
    lastTraining: '2 hours ago',
    modelVersion: '2.1.3'
  });

  const [isTraining, setIsTraining] = useState(false);
  const [trainingActivities, setTrainingActivities] = useState<TrainingActivity[]>([
    {
      id: '1',
      stage: 'Real Data Loading',
      progress: 100,
      timestamp: '14:32:15',
      status: 'completed',
      metrics: { loss: 0.245, accuracy: 89.2, learningRate: 0.001 }
    },
    {
      id: '2',
      stage: 'Neural Network Training',
      progress: 78,
      timestamp: '14:33:42',
      status: 'active',
      metrics: { loss: 0.198, accuracy: 92.1, learningRate: 0.0008 }
    },
    {
      id: '3',
      stage: 'Weight Matrix Optimization',
      progress: 0,
      timestamp: '--:--:--',
      status: 'pending',
      metrics: { loss: 0, accuracy: 0, learningRate: 0 }
    },
    {
      id: '4',
      stage: 'Model Deployment',
      progress: 0,
      timestamp: '--:--:--',
      status: 'pending',
      metrics: { loss: 0, accuracy: 0, learningRate: 0 }
    }
  ]);

  useEffect(() => {
    localStorage.setItem('deepcal-weights', JSON.stringify(weights));
  }, [weights]);

  // Load training metrics with better error handling
  React.useEffect(() => {
    const loadTrainingMetrics = async () => {
      try {
        console.log('Attempting to load training metrics...');
        const response = await fetch('/api/training/stats');
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Backend not available, using cached metrics');
          setSystemStatus(prev => ({ ...prev, trainingPipeline: 'warning' }));
          return;
        }
        
        if (response.ok) {
          const stats = await response.json();
          setTrainingMetrics({
            samplesProcessed: stats.totalJobs * 1000,
            accuracy: stats.averageAccuracy,
            lastTraining: stats.lastTraining,
            modelVersion: '2.0.0'
          });
          setSystemStatus(prev => ({ ...prev, trainingPipeline: 'connected' }));
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn('Backend unavailable, using offline mode:', error);
        setSystemStatus(prev => ({ ...prev, trainingPipeline: 'warning' }));
      }
    };
    
    loadTrainingMetrics();
  }, []);

  // Simulate real-time training updates
  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingActivities(prev => {
          const updated = [...prev];
          const activeIndex = updated.findIndex(activity => activity.status === 'active');
          
          if (activeIndex !== -1) {
            updated[activeIndex].progress = Math.min(100, updated[activeIndex].progress + Math.random() * 5);
            updated[activeIndex].metrics.loss = Math.max(0.05, updated[activeIndex].metrics.loss - Math.random() * 0.01);
            updated[activeIndex].metrics.accuracy = Math.min(99.9, updated[activeIndex].metrics.accuracy + Math.random() * 0.5);
            
            if (updated[activeIndex].progress >= 100) {
              updated[activeIndex].status = 'completed';
              if (activeIndex + 1 < updated.length) {
                updated[activeIndex + 1].status = 'active';
                updated[activeIndex + 1].timestamp = new Date().toLocaleTimeString();
              }
            }
          }
          
          return updated;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const triggerTraining = async () => {
    if (!isTraining) {
      try {
        console.log('Starting training...');
        
        // Check if backend is available first
        if (systemStatus.trainingPipeline === 'warning') {
          console.log('Backend unavailable, starting simulation mode...');
          setIsTraining(true);
          
          setTrainingActivities(prev => prev.map((activity, index) => ({
            ...activity,
            progress: index === 0 ? 10 : 0,
            status: index === 0 ? 'active' : 'pending',
            timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
          })));
          
          toast({ 
            title: 'Training Started (Simulation)', 
            description: 'Backend unavailable - running training simulation...' 
          });
          return;
        }

        // Try real training
        const trainingResponse = await fetch('/api/training/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            datasetId: 'latest',
            weights: weights,
            modelType: 'neutrosophic',
            includeSynthetic: true,
            syntheticRatio: 2.0,
            validationSplit: 0.2
          })
        });
        
        if (trainingResponse.ok) {
          const job = await trainingResponse.json();
          console.log('Real training job started:', job);
          setIsTraining(true);
          
          setTrainingActivities(prev => prev.map((activity, index) => ({
            ...activity,
            progress: index === 0 ? 10 : 0,
            status: index === 0 ? 'active' : 'pending',
            timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
          }));
          
          toast({ 
            title: 'Real Training Started', 
            description: 'Neural network training with real ML algorithms in progress...' 
          });
        } else {
          throw new Error(`HTTP ${trainingResponse.status}`);
        }
      } catch (error) {
        console.warn('Real training failed, falling back to simulation:', error);
        setIsTraining(true);
        
        setTrainingActivities(prev => prev.map((activity, index) => ({
          ...activity,
          progress: index === 0 ? 10 : 0,
          status: index === 0 ? 'active' : 'pending',
          timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
        })));
        
        toast({ 
          title: 'Training Started (Fallback)', 
          description: 'Backend unavailable - running training simulation...',
          variant: 'default'
        });
      }
    } else {
      setIsTraining(false);
      toast({ 
        title: 'Training Stopped', 
        description: 'Training process halted' 
      });
    }
  };

  const saveConfiguration = async () => {
    try {
      // Try to save to backend
      const response = await fetch('/api/training/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelConfig, weights })
      });
      
      if (response.ok) {
        toast({ 
          title: 'Configuration Saved', 
          description: 'Model parameters updated and persisted to backend' 
        });
      } else {
        throw new Error('Backend unavailable');
      }
    } catch (error) {
      // Save locally as fallback
      localStorage.setItem('deepcal-model-config', JSON.stringify(modelConfig));
      toast({ 
        title: 'Configuration Saved Locally', 
        description: 'Backend unavailable - configuration saved to browser storage',
        variant: 'default'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      
      <div className="container max-w-full mx-auto py-6 px-6">
        <TrainingHeader 
          isTraining={isTraining}
          onSaveConfiguration={saveConfiguration}
          onToggleTraining={triggerTraining}
        />

        {/* Training Status Banner */}
        <div className={`mb-6 p-4 bg-gradient-to-r border rounded-lg ${
          systemStatus.trainingPipeline === 'connected' 
            ? 'from-green-900/30 to-blue-900/30 border-green-400/50'
            : 'from-yellow-900/30 to-orange-900/30 border-yellow-400/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              systemStatus.trainingPipeline === 'connected' 
                ? 'bg-green-400 animate-pulse' 
                : 'bg-yellow-400 animate-pulse'
            }`}></div>
            <span className={`font-semibold ${
              systemStatus.trainingPipeline === 'connected' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {systemStatus.trainingPipeline === 'connected' ? 'Advanced Neural Networks Active' : 'Enhanced Simulation Mode'}
            </span>
            <span className="text-indigo-300">•</span>
            <span className="text-white">
              {systemStatus.trainingPipeline === 'connected' 
                ? 'Transformer attention, graph neural networks, and deep learning optimization enabled'
                : 'Full neural network simulation with transformer attention and graph optimization'
              }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-1">
            <SystemStatusSidebar 
              systemStatus={systemStatus}
              trainingMetrics={trainingMetrics}
            />
          </div>

          <div className="xl:col-span-4 space-y-6">
            <TrainingTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="space-y-6">
              {activeTab === 'engine' && (
                <div className="space-y-6">
                  <EngineConfigTab 
                    modelConfig={modelConfig}
                    setModelConfig={setModelConfig}
                    trainingMetrics={trainingMetrics}
                    isTraining={isTraining}
                    trainingActivities={trainingActivities}
                  />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TransformerAttentionPanel />
                    <GraphNeuralNetworkPanel />
                  </div>
                  <DeepLearningMigrationPanel />
                </div>
              )}

              {activeTab === 'weights' && (
                <div className="space-y-6">
                  <WeightsConfigTab 
                    weights={weights}
                    setWeights={setWeights}
                  />
                  <NeutrosophicFrameworkPanel />
                </div>
              )}

              {activeTab === 'synthetic' && (
                <div className="space-y-6">
                  <SyntheticDataSync />
                  <ParquetDataPanel />
                  <SyntheticDataManager 
                    onDataGenerated={() => {
                      toast({ 
                        title: 'Synthetic Data Ready', 
                        description: 'New synthetic training data available for model retraining' 
                      });
                    }}
                  />
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <AdvancedConfigTab />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <LiveMetricsPanel isTraining={isTraining} />
                    <TrainingLogsPanel isTraining={isTraining} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
