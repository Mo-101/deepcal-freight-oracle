
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingTabs } from "@/components/training/TrainingTabs";
import { SystemStatusSidebar } from "@/components/training/SystemStatusSidebar";
import { EngineConfigTab } from "@/components/training/EngineConfigTab";
import { WeightsConfigTab } from "@/components/training/WeightsConfigTab";
import { SyntheticDataTab } from "@/components/training/SyntheticDataTab";
import { AdvancedConfigTab } from "@/components/training/AdvancedConfigTab";
import { LiveMetricsPanel } from "@/components/training/LiveMetricsPanel";
import { useFirebaseTraining } from "@/hooks/useFirebaseTraining";
import { WeightVector, SystemStatus, TrainingMetrics } from "@/types/training";
=======
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
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)

interface ModelConfig {
  primaryLLM: string;
  creativity: number;
  responseLength: number;
  contextWindow: number;
  realTimeProcessing: boolean;
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

const Training = () => {
  const [activeTab, setActiveTab] = useState('engine');
  const [weights, setWeights] = useState<WeightVector>({
    cost: 0.35,
    time: 0.35,
    reliability: 0.2,
    risk: 0.1
  });

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    primaryLLM: 'GPT-4 Turbo (Recommended)',
    creativity: 75,
    responseLength: 50,
    contextWindow: 8,
    realTimeProcessing: true
  });

<<<<<<< HEAD
  const { status, error, running, start, simulate, reset } = useFirebaseTraining();

  // Mock training activities that update during training
=======
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
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
  const [trainingActivities, setTrainingActivities] = useState<TrainingActivity[]>([
    {
      id: '1',
      stage: 'Data Preprocessing',
      progress: 100,
      timestamp: '14:28',
      status: 'completed',
      metrics: { loss: 0.245, accuracy: 89.2, learningRate: 0.001 }
    },
    {
      id: '2',
<<<<<<< HEAD
      stage: 'Feature Extraction',
      progress: 100,
      timestamp: '14:29',
      status: 'completed',
      metrics: { loss: 0.198, accuracy: 91.5, learningRate: 0.0009 }
    },
    {
      id: '3',
      stage: 'Neural Network Training',
      progress: 78,
      timestamp: '14:30',
      status: running ? 'active' : 'pending',
      metrics: { loss: 0.156, accuracy: 94.2, learningRate: 0.0008 }
    },
    {
      id: '4',
      stage: 'Model Validation',
=======
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
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
      progress: 0,
      timestamp: '14:32',
      status: 'pending',
      metrics: { loss: 0.0, accuracy: 0, learningRate: 0.0007 }
    }
  ]);

  // Real system status monitoring
  const systemStatus: SystemStatus = {
    neutroEngine: 'connected',
    firestore: 'connected',
    groqAPI: 'connected',
    trainingPipeline: running ? 'connected' : 'warning'
  };

<<<<<<< HEAD
  // Real training metrics from current training
  const trainingMetrics: TrainingMetrics = {
    samplesProcessed: status?.progress ? Math.floor((status.progress / 100) * 15000) : 12547,
    accuracy: status?.accuracy || 94.2,
    lastTraining: status?.startedAt ? 'Live' : '2h ago',
    modelVersion: 'v2.4.1'
  };

  // Update training activities when training is running
=======
  // Simulate real-time training updates
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
  useEffect(() => {
    if (running && status) {
      setTrainingActivities(prev => prev.map(activity => {
        if (activity.stage === 'Neural Network Training') {
          return {
            ...activity,
            progress: status.progress,
            status: 'active' as const,
            metrics: {
              loss: status.loss,
              accuracy: status.accuracy,
              learningRate: 0.0008
            }
          };
        }
        return activity;
      }));
    }
  }, [running, status]);

<<<<<<< HEAD
  const handleSaveConfiguration = () => {
    console.log("Configuration saved", { weights, modelConfig });
  };

  const handleToggleTraining = async () => {
    if (running) {
      reset();
    } else {
      try {
        await start({
          weights,
          modelConfig,
          dataSource: 'combined',
          includeSynthetic: true
        });
      } catch (error) {
        console.error('Failed to start training:', error);
        // Fallback to simulation for demo
        simulate(30000);
      }
=======
  const triggerTraining = () => {
    setIsTraining(!isTraining);
    if (!isTraining) {
      setTrainingActivities(prev => prev.map((activity, index) => ({
        ...activity,
        progress: index === 0 ? 10 : 0,
        status: index === 0 ? 'active' : 'pending',
        timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
      })));
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
    }
    
    toast({ 
      title: isTraining ? 'Training Stopped' : 'Training Initiated', 
      description: isTraining ? 'Neural engine training halted' : 'Neutrosophic engine optimization in progress...' 
    });
  };

<<<<<<< HEAD
  const renderTabContent = () => {
    switch (activeTab) {
      case 'engine':
        return (
          <EngineConfigTab
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            trainingMetrics={trainingMetrics}
            isTraining={running}
            trainingActivities={trainingActivities}
          />
        );
      case 'weights':
        return (
          <WeightsConfigTab
            weights={weights}
            setWeights={setWeights}
          />
        );
      case 'synthetic':
        return <SyntheticDataTab />;
      case 'advanced':
        return <AdvancedConfigTab />;
      default:
        return null;
    }
=======
  const saveConfiguration = () => {
    toast({ 
      title: 'Configuration Saved', 
      description: 'Model parameters updated successfully' 
    });
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <main className="container max-w-full mx-auto py-6 px-6">
        <TrainingHeader
          isTraining={running}
          onSaveConfiguration={handleSaveConfiguration}
          onToggleTraining={handleToggleTraining}
        />
<<<<<<< HEAD
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <TrainingTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          </div>
          
          <div className="xl:col-span-1 space-y-6">
=======

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-1">
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
            <SystemStatusSidebar 
              systemStatus={systemStatus}
              trainingMetrics={trainingMetrics}
            />
<<<<<<< HEAD
            <LiveMetricsPanel isTraining={running} />
=======
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
>>>>>>> parent of 80b669f (Merge branch 'main' of https://github.com/Mo-101/deepcal-freight-oracle)
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">Training Error: {error.message}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Training;
