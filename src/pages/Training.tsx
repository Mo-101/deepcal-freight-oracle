
import React, { useState } from 'react';
import DeepCALHeader from '@/components/DeepCALHeader';
import { TrainingHeader } from '@/components/training/TrainingHeader';
import { SystemStatusSidebar } from '@/components/training/SystemStatusSidebar';
import { TrainingTabs } from '@/components/training/TrainingTabs';
import { LiveMetricsPanel } from '@/components/training/LiveMetricsPanel';
import { TrainingLogsPanel } from '@/components/training/TrainingLogsPanel';

const Training = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState('engine');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <DeepCALHeader />
      <main className="container max-w-full mx-auto pt-6 px-6 space-y-6">
        <TrainingHeader isTraining={isTraining} setIsTraining={setIsTraining} />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            <TrainingTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              isTraining={isTraining}
            />
            
            {/* Live Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiveMetricsPanel isTraining={isTraining} />
              <TrainingLogsPanel isTraining={isTraining} />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1">
            <SystemStatusSidebar isTraining={isTraining} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Training;
