
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Save, Play } from 'lucide-react';

interface TrainingHeaderProps {
  isTraining: boolean;
  onSaveConfiguration: () => void;
  onToggleTraining: () => void;
}

export function TrainingHeader({ isTraining, onSaveConfiguration, onToggleTraining }: TrainingHeaderProps) {
  return (
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
          <Button onClick={onSaveConfiguration} className="bg-purple-700 hover:bg-purple-600">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
          <Button onClick={onToggleTraining} className={`${isTraining ? 'bg-red-600 hover:bg-red-700' : 'bg-lime-400 hover:bg-lime-500'} text-slate-900`}>
            <Play className="w-4 h-4 mr-2" />
            {isTraining ? 'Stop Training' : 'Start Training'}
          </Button>
        </div>
      </div>
    </header>
  );
}
