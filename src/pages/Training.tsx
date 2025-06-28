
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

  const [isTraining, setIsTraining] = useState(false);
  const [trainingActivities, setTrainingActivities] = useState<TrainingActivity[]>([
    {
      id: '1',
      stage: 'Data Preprocessing',
      progress: 100,
      timestamp: '14:32:15',
      status: 'completed',
      metrics: { loss: 0.245, accuracy: 89.2, learningRate: 0.001 }
    },
    {
      id: '2',
      stage: 'Neutrosophic Feature Extraction',
      progress: 78,
      timestamp: '14:33:42',
      status: 'active',
      metrics: { loss: 0.198, accuracy: 92.1, learningRate: 0.0008 }
    },
    {
      id: '3',
      stage: 'TOPSIS Weight Optimization',
      progress: 0,
      timestamp: '--:--:--',
      status: 'pending',
      metrics: { loss: 0, accuracy: 0, learningRate: 0 }
    },
    {
      id: '4',
      stage: 'Grey System Validation',
      progress: 0,
      timestamp: '--:--:--',
      status: 'pending',
      metrics: { loss: 0, accuracy: 0, learningRate: 0 }
    }
  ]);

  useEffect(() => {
    localStorage.setItem('deepcal-weights', JSON.stringify(weights));
  }, [weights]);

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

  const triggerTraining = () => {
    setIsTraining(!isTraining);
    if (!isTraining) {
      setTrainingActivities(prev => prev.map((activity, index) => ({
        ...activity,
        progress: index === 0 ? 10 : 0,
        status: index === 0 ? 'active' : 'pending',
        timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
      })));
    }
    
    toast({ 
      title: isTraining ? 'Training Stopped' : 'Training Initiated', 
      description: isTraining ? 'Neural engine training halted' : 'Neutrosophic engine optimization in progress...' 
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
      
      <div className="container max-w-full mx-auto py-6 px-6">
        <TrainingHeader 
          isTraining={isTraining}
          onSaveConfiguration={saveConfiguration}
          onToggleTraining={triggerTraining}
        />

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

            <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
              <div className="2xl:col-span-2">
                {activeTab === 'engine' && (
                  <EngineConfigTab 
                    modelConfig={modelConfig}
                    setModelConfig={setModelConfig}
                    trainingMetrics={trainingMetrics}
                    isTraining={isTraining}
                    trainingActivities={trainingActivities}
                  />
                )}

                {activeTab === 'weights' && (
                  <WeightsConfigTab 
                    weights={weights}
                    setWeights={setWeights}
                  />
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
                  <AdvancedConfigTab />
                )}
              </div>

              <div className="2xl:col-span-1 space-y-6">
                <LiveMetricsPanel isTraining={isTraining} />
                <TrainingLogsPanel isTraining={isTraining} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
