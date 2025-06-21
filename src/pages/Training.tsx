
import React, { useState } from "react";
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingTabs } from "@/components/training/TrainingTabs";
import { SystemStatusSidebar } from "@/components/training/SystemStatusSidebar";
import { WeightVector, SystemStatus, TrainingMetrics } from "@/types/training";

const Training = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState('engine');

  // Mock system status - in real app this would come from actual services
  const systemStatus: SystemStatus = {
    neutroEngine: 'connected',
    firestore: 'connected',
    groqAPI: 'connected',
    trainingPipeline: 'connected'
  };

  // Mock training metrics - in real app this would come from actual training service
  const trainingMetrics: TrainingMetrics = {
    samplesProcessed: 12547,
    accuracy: 94.2,
    lastTraining: '2h ago',
    modelVersion: 'v2.4.1'
  };

  const handleSaveConfiguration = () => {
    console.log("Configuration saved");
  };

  const handleToggleTraining = () => {
    setIsTraining(!isTraining);
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
          <div className="xl:col-span-3">
            <TrainingTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="xl:col-span-1">
            <SystemStatusSidebar 
              systemStatus={systemStatus}
              trainingMetrics={trainingMetrics}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Training;
