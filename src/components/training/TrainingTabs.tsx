
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Weights, Database, Shuffle, Settings, Activity } from "lucide-react";

interface TrainingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TrainingTabs({ activeTab, onTabChange }: TrainingTabsProps) {
  const tabs = [
    { id: 'engine', label: 'AI Engine', icon: Brain },
    { id: 'weights', label: 'Weight Matrix', icon: Weights },
    { id: 'database', label: 'PostgreSQL + AI', icon: Database },
    { id: 'synthetic', label: 'Synthetic Data', icon: Shuffle },
    { id: 'advanced', label: 'Advanced Config', icon: Settings },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border-slate-700">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-2 data-[state=active]:bg-lime-400 data-[state=active]:text-slate-900 text-white"
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
