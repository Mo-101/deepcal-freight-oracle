
import React, { useState, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingTabs } from "@/components/training/TrainingTabs";
import { SystemStatusSidebar } from "@/components/training/SystemStatusSidebar";
import { EngineConfigTab } from "@/components/training/EngineConfigTab";
import { WeightsConfigTab } from "@/components/training/WeightsConfigTab";
import { SyntheticDataTab } from "@/components/training/SyntheticDataTab";
import { AdvancedConfigTab } from "@/components/training/AdvancedConfigTab";
import { LiveMetricsPanel } from "@/components/training/LiveMetricsPanel";
import { useLiveTraining } from "@/hooks/useLiveTraining";
import { WeightVector, SystemStatus, TrainingMetrics } from "@/types/training";

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
  const { toast } = useToast();
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

  const { currentJob, isTraining, startTraining, stopTraining, getLatestWeights } = useLiveTraining();

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
      stage: 'Neutrosophic Feature Extraction',
      progress: 0,
      timestamp: '--:--:--',
      status: 'pending',
      metrics: { loss: 0.0, accuracy: 0, learningRate: 0.001 }
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
      timestamp: '14:32',
      status: 'pending',
      metrics: { loss: 0.0, accuracy: 0, learningRate: 0.0007 }
    }
  ]);

  const systemStatus: SystemStatus = {
    neutroEngine: isTraining ? 'connected' : 'warning',
    firestore: 'connected',
    groqAPI: 'connected',
    trainingPipeline: isTraining ? 'connected' : 'warning'
  };

  const trainingMetrics: TrainingMetrics = {
    samplesProcessed: currentJob ? Math.floor((currentJob.currentEpoch / currentJob.totalEpochs) * 15000) : 12547,
    accuracy: currentJob ? currentJob.metrics.validationAccuracy : 94.2,
    lastTraining: isTraining ? 'Live' : '2h ago',
    modelVersion: 'v2.4.1'
  };

  // Update training activities based on real training progress
  useEffect(() => {
    if (currentJob && isTraining) {
      const progress = (currentJob.currentEpoch / currentJob.totalEpochs) * 100;
      const currentTime = new Date().toLocaleTimeString();
      
      setTrainingActivities(prev => prev.map((activity, index) => {
        if (index === 1) { // Neutrosophic Feature Extraction
          return {
            ...activity,
            progress: Math.min(progress, 100),
            status: progress < 100 ? 'active' as const : 'completed' as const,
            timestamp: currentTime,
            metrics: {
              loss: currentJob.metrics.loss,
              accuracy: currentJob.metrics.accuracy,
              learningRate: currentJob.metrics.learningRate
            }
          };
        }
        if (index === 2 && progress > 50) { // TOPSIS Weight Optimization
          return {
            ...activity,
            progress: Math.max(0, progress - 50) * 2,
            status: progress > 50 ? 'active' as const : 'pending' as const,
            timestamp: progress > 50 ? currentTime : '--:--:--'
          };
        }
        return activity;
      }));
    } else if (currentJob?.status === 'completed') {
      setTrainingActivities(prev => prev.map(activity => ({
        ...activity,
        progress: 100,
        status: 'completed' as const
      })));
    }
  }, [currentJob, isTraining]);

  // Load latest trained weights on mount
  useEffect(() => {
    const loadLatestWeights = async () => {
      try {
        const latestWeights = await getLatestWeights();
        if (latestWeights) {
          setWeights(latestWeights);
        }
      } catch (error) {
        console.error('Failed to load latest weights:', error);
      }
    };
    loadLatestWeights();
  }, [getLatestWeights]);

  const handleSaveConfiguration = () => {
    console.log("Configuration saved", { weights, modelConfig });
    toast({
      title: 'Configuration Saved',
      description: 'Model parameters updated successfully'
    });
  };

  const handleToggleTraining = async () => {
    if (isTraining) {
      stopTraining();
    } else {
      try {
        await startTraining(weights, 100); // 100 epochs of real training
        
        // Reset training activities for new session
        setTrainingActivities(prev => prev.map((activity, index) => ({
          ...activity,
          progress: index === 0 ? 100 : 0,
          status: index === 0 ? 'completed' : 'pending',
          timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
        })));

      } catch (error) {
        console.error('Failed to start training:', error);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'engine':
        return (
          <EngineConfigTab
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            trainingMetrics={trainingMetrics}
            isTraining={isTraining}
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALSymbolicHeader />
      
      <main className="container max-w-full mx-auto py-6 px-6">
        <TrainingHeader
          isTraining={isTraining}
          onSaveConfiguration={handleSaveConfiguration}
          onToggleTraining={handleToggleTraining}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <TrainingTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <SystemStatusSidebar 
              systemStatus={systemStatus}
              trainingMetrics={trainingMetrics}
            />
            <LiveMetricsPanel isTraining={isTraining} />
          </div>
        </div>

        {/* Live Training Progress Display */}
        {currentJob && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lime-400 font-semibold">Live Training Progress</h3>
              <span className="text-white">Epoch {currentJob.currentEpoch}/{currentJob.totalEpochs}</span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-indigo-300">Loss: </span>
                <span className="text-red-400 font-mono">{currentJob.metrics.loss.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-indigo-300">Accuracy: </span>
                <span className="text-lime-400 font-mono">{currentJob.metrics.accuracy.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-indigo-300">Val Loss: </span>
                <span className="text-yellow-400 font-mono">{currentJob.metrics.validationLoss.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-indigo-300">Val Acc: </span>
                <span className="text-purple-400 font-mono">{currentJob.metrics.validationAccuracy.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Training;
