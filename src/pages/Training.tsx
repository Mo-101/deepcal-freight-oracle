
import React, { useState } from "react";
import DeepCALSymbolicHeader from "@/components/DeepCALSymbolicHeader";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingTabs } from "@/components/training/TrainingTabs";
import { SystemStatusSidebar } from "@/components/training/SystemStatusSidebar";

const Training = () => {
  const [isTraining, setIsTraining] = useState(false);

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
            <TrainingTabs />
          </div>
          <div className="xl:col-span-1">
            <SystemStatusSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Training;
