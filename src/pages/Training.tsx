
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
import { useFirebaseTraining } from "@/hooks/useFirebaseTraining";
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

  const { currentJob, isLoading, startTraining } = useFirebaseTraining();
  const [isTraining, setIsTraining] = useState(false);

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
      timestamp: '14:32',
      status: 'pending',
      metrics: { loss: 0.0, accuracy: 0, learningRate: 0.0007 }
    }
  ]);

  const systemStatus: SystemStatus = {
    neutroEngine: 'connected',
    firestore: 'connected',
    groqAPI: 'connected',
    trainingPipeline: isTraining ? 'connected' : 'warning'
  };

  const trainingMetrics: TrainingMetrics = {
    samplesProcessed: currentJob?.progress ? Math.floor((currentJob.progress / 100) * 15000) : 12547,
    accuracy: currentJob?.metrics?.accuracy ? currentJob.metrics.accuracy * 100 : 94.2,
    lastTraining: currentJob?.status === 'running' ? 'Live' : '2h ago',
    modelVersion: 'v2.4.1'
  };

  // Update training activities when training is running
  useEffect(() => {
    if (currentJob && currentJob.status === 'running') {
      setIsTraining(true);
      setTrainingActivities(prev => prev.map(activity => {
        if (activity.stage === 'Neutrosophic Feature Extraction') {
          return {
            ...activity,
            progress: currentJob.progress,
            status: 'active' as const,
            metrics: {
              loss: currentJob.metrics?.loss || activity.metrics.loss,
              accuracy: currentJob.metrics?.accuracy ? currentJob.metrics.accuracy * 100 : activity.metrics.accuracy,
              learningRate: 0.0008
            }
          };
        }
        return activity;
      }));
    } else if (currentJob && currentJob.status === 'completed') {
      setIsTraining(false);
    }
  }, [currentJob]);

  const handleSaveConfiguration = () => {
    console.log("Configuration saved", { weights, modelConfig });
    toast({
      title: 'Configuration Saved',
      description: 'Model parameters updated successfully'
    });
  };

  const handleToggleTraining = async () => {
    if (isTraining) {
      setIsTraining(false);
      toast({
        title: 'Training Stopped',
        description: 'Neural engine training halted'
      });
    } else {
      try {
        await startTraining({
          dataSource: 'combined',
          modelType: 'symbolic',
          epochs: 100,
          batchSize: 32,
          weights
        });
        setIsTraining(true);
        
        // Simulate training progress
        setTrainingActivities(prev => prev.map((activity, index) => ({
          ...activity,
          progress: index === 0 ? 10 : 0,
          status: index === 0 ? 'active' : 'pending',
          timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
        })));

        toast({
          title: 'Training Initiated',
          description: 'Neutrosophic engine optimization in progress...'
        });
      } catch (error) {
        console.error('Failed to start training:', error);
        toast({
          title: 'Training Failed',
          description: 'Could not start training session',
          variant: 'destructive'
        });
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

        {currentJob?.error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">Training Error: {currentJob.error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Training;
