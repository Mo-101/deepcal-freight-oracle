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
import { TrainingLogsPanel } from "@/components/training/TrainingLogsPanel";
import { TrainingActivityMonitor } from "@/components/training/TrainingActivityMonitor";
import { useLiveTraining } from "@/hooks/useLiveTraining";
import { WeightVector, SystemStatus, TrainingMetrics } from "@/types/training";

interface ModelConfig {
  provider: 'openai' | 'groq' | 'claude' | 'mixtral';
  model: string;
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
    provider: 'openai',
    model: 'gpt-4o',
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
      stage: 'Enhanced Neural Training',
      progress: 0,
      timestamp: '--:--:--',
      status: 'pending',
      metrics: { loss: 0.0, accuracy: 0, learningRate: 0.05 }
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
      stage: 'XGBoost Validation',
      progress: 0,
      timestamp: '--:--:--',
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
    samplesProcessed: currentJob ? Math.floor((currentJob.currentEpoch / currentJob.totalEpochs) * 20000) : 15247,
    accuracy: currentJob ? currentJob.metrics.validationAccuracy : 94.2,
    lastTraining: isTraining ? 'Live' : '2h ago',
    modelVersion: 'v3.1.0-Enhanced'
  };

  // Calculate training progress percentage
  const trainingProgress = currentJob ? (currentJob.currentEpoch / currentJob.totalEpochs) * 100 : 0;

  // Enhanced training activity updates
  useEffect(() => {
    if (currentJob && isTraining) {
      const progress = (currentJob.currentEpoch / currentJob.totalEpochs) * 100;
      const currentTime = new Date().toLocaleTimeString();
      
      setTrainingActivities(prev => prev.map((activity, index) => {
        if (index === 1) { // Enhanced Neural Training
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
        if (index === 2 && progress > 40) { // Weight Matrix Optimization
          return {
            ...activity,
            progress: Math.max(0, (progress - 40) * 1.67),
            status: progress > 40 ? 'active' as const : 'pending' as const,
            timestamp: progress > 40 ? currentTime : '--:--:--',
            metrics: {
              loss: currentJob.metrics.validationLoss,
              accuracy: currentJob.metrics.validationAccuracy,
              learningRate: currentJob.metrics.learningRate
            }
          };
        }
        if (index === 3 && progress > 80) { // XGBoost Validation
          return {
            ...activity,
            progress: Math.max(0, (progress - 80) * 5),
            status: progress > 80 ? 'active' as const : 'pending' as const,
            timestamp: progress > 80 ? currentTime : '--:--:--'
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
        await startTraining(weights, 150); // Enhanced training with 150 epochs
        
        setTrainingActivities(prev => prev.map((activity, index) => ({
          ...activity,
          progress: index === 0 ? 100 : 0,
          status: index === 0 ? 'completed' : 'pending',
          timestamp: index === 0 ? new Date().toLocaleTimeString() : '--:--:--'
        })));

      } catch (error) {
        console.error('Failed to start enhanced training:', error);
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
      
      <main className="container max-w-7xl mx-auto py-6 px-4 lg:px-6">
        {/* Header Section */}
        <div className="mb-8">
          <TrainingHeader
            isTraining={isTraining}
            onSaveConfiguration={handleSaveConfiguration}
            onToggleTraining={handleToggleTraining}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Section */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50">
              <TrainingTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>

            {/* Training Activity Monitor */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50">
              <TrainingActivityMonitor 
                isTraining={isTraining} 
                trainingActivities={trainingActivities} 
              />
            </div>

            {/* Enhanced Live Training Progress Display */}
            {currentJob && (
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-400 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lime-400 font-semibold text-lg">🚀 Enhanced Live Training Progress</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-white">Epoch {currentJob.currentEpoch}/{currentJob.totalEpochs}</span>
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-lime-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentJob.currentEpoch / currentJob.totalEpochs) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <span className="text-indigo-300 block">Training Loss:</span>
                    <span className="text-red-400 font-mono text-lg">{currentJob.metrics.loss.toFixed(4)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <span className="text-indigo-300 block">Training Acc:</span>
                    <span className="text-lime-400 font-mono text-lg">{currentJob.metrics.accuracy.toFixed(2)}%</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <span className="text-indigo-300 block">Validation Loss:</span>
                    <span className="text-yellow-400 font-mono text-lg">{currentJob.metrics.validationLoss.toFixed(4)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <span className="text-indigo-300 block">Validation Acc:</span>
                    <span className="text-purple-400 font-mono text-lg">{currentJob.metrics.validationAccuracy.toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center text-xs text-indigo-300">
                  <span>Learning Rate: <span className="text-cyan-400 font-mono">{currentJob.metrics.learningRate.toFixed(6)}</span></span>
                  <span>Status: <span className="text-lime-400">{currentJob.status.toUpperCase()}</span></span>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <SystemStatusSidebar 
              systemStatus={systemStatus}
              trainingMetrics={trainingMetrics}
              isTraining={isTraining}
              trainingProgress={trainingProgress}
            />
            <LiveMetricsPanel isTraining={isTraining} />
            <TrainingLogsPanel isTraining={isTraining} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Training;
