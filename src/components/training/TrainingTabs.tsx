
import React from 'react';
import { Brain, Sliders, Database, Settings } from 'lucide-react';

interface TrainingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TrainingTabs({ activeTab, onTabChange }: TrainingTabsProps) {
  const tabs = [
    { id: 'engine', label: 'Engine Configuration', icon: Brain },
    { id: 'weights', label: 'Criteria Weights', icon: Sliders },
    { id: 'synthetic', label: 'Synthetic Data', icon: Database },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  return (
    <div className="flex border-b border-gray-700">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-medium flex items-center gap-2 transition-all ${
            activeTab === tab.id
              ? 'text-lime-400 border-b-2 border-lime-400'
              : 'text-indigo-300 hover:text-white'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
