
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Zap, AlertTriangle, Truck, Ship, Plane } from 'lucide-react';
import { LogisticsAlternative, SymbolicInput } from '@/hooks/useSymbolicIntelligence';
import symbolicRulesData from '@/data/symbolicRules.json';

interface ScenarioLibraryProps {
  onRunScenario: (scenario: SymbolicInput) => void;
  isProcessing: boolean;
}

export const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ onRunScenario, isProcessing }) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios = {
    emergency: {
      name: "Emergency Medical Supply to Juba",
      description: "Critical medical supplies needed in South Sudan within 48 hours",
      icon: AlertTriangle,
      difficulty: "High",
      alternatives: [
        {
          id: 'emergency_air',
          name: 'Express Air (Nairobi → Juba)',
          cost: 4500,
          time: 1.5,
          reliability: 0.95,
          risk: 0.10,
          carrier: 'DHL Express',
          mode: 'Air'
        },
        {
          id: 'emergency_charter',
          name: 'Charter Flight (Direct)',
          cost: 8000,
          time: 1.0,
          reliability: 0.98,
          risk: 0.05,
          carrier: 'Charter Solutions',
          mode: 'Air'
        },
        {
          id: 'emergency_mixed',
          name: 'Road + Air Hybrid',
          cost: 3200,
          time: 2.5,
          reliability: 0.85,
          risk: 0.25,
          carrier: 'Mixed Logistics',
          mode: 'Road+Air'
        }
      ]
    },
    bulk: {
      name: "Bulk Grain Shipment to Lagos",
      description: "500 tons of grain from Addis Ababa to Lagos, cost-optimized",
      icon: Truck,
      difficulty: "Medium",
      alternatives: [
        {
          id: 'bulk_sea',
          name: 'Sea Freight (Djibouti → Lagos)',
          cost: 12000,
          time: 14,
          reliability: 0.88,
          risk: 0.15,
          carrier: 'Maersk Line',
          mode: 'Sea'
        },
        {
          id: 'bulk_road',
          name: 'Overland Convoy',
          cost: 18000,
          time: 8,
          reliability: 0.75,
          risk: 0.30,
          carrier: 'Trans-African Logistics',
          mode: 'Road'
        },
        {
          id: 'bulk_rail',
          name: 'Rail + Road Combination',
          cost: { range: [14000, 16000] as [number, number], value: 15000, type: 'incomplete' as const },
          time: { value: 12, uncertainty: 0.25, type: 'uncertain' as const },
          reliability: 0.82,
          risk: 0.20,
          carrier: 'AfriRail Consortium',
          mode: 'Rail+Road'
        }
      ]
    },
    tech: {
      name: "High-Value Electronics to Accra",
      description: "Sensitive electronics requiring security and climate control",
      icon: Zap,
      difficulty: "High",
      alternatives: [
        {
          id: 'tech_express',
          name: 'FedEx Priority (Dubai → Accra)',
          cost: 3800,
          time: 3,
          reliability: 0.92,
          risk: 0.08,
          carrier: 'FedEx',
          mode: 'Air'
        },
        {
          id: 'tech_secure',
          name: 'Secure Air Freight',
          cost: 4200,
          time: 2.5,
          reliability: 0.95,
          risk: 0.05,
          carrier: 'SecureLog Air',
          mode: 'Air'
        },
        {
          id: 'tech_budget',
          name: 'Standard Air + Insurance',
          cost: 2900,
          time: 5,
          reliability: 0.85,
          risk: 0.12,
          carrier: 'Ghana Airways Cargo',
          mode: 'Air'
        }
      ]
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'High': return 'bg-red-600/20 text-red-400 border-red-400/50';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-400 border-yellow-400/50';
      case 'Low': return 'bg-green-600/20 text-green-400 border-green-400/50';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-400/50';
    }
  };

  const runScenario = (scenarioKey: string) => {
    const scenario = scenarios[scenarioKey as keyof typeof scenarios];
    const input: SymbolicInput = {
      alternatives: scenario.alternatives,
      rules: symbolicRulesData.map(rule => ({
        id: rule.id,
        rule: rule.rule,
        truth: rule.truth,
        indeterminacy: rule.indeterminacy,
        falsity: rule.falsity,
        category: rule.category || 'general', // Provide default category
        weight: rule.weight
      }))
    };
    
    setSelectedScenario(scenarioKey);
    onRunScenario(input);
  };

  return (
    <Card className="glass-card shadow-glass border border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <Play className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-lg font-bold text-orange-400">Demo Scenario Library</h4>
      </div>

      <Tabs defaultValue="emergency" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="emergency" className="data-[state=active]:bg-red-600/30">Emergency</TabsTrigger>
          <TabsTrigger value="bulk" className="data-[state=active]:bg-yellow-600/30">Bulk Cargo</TabsTrigger>
          <TabsTrigger value="tech" className="data-[state=active]:bg-purple-600/30">High-Value</TabsTrigger>
        </TabsList>

        {Object.entries(scenarios).map(([key, scenario]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <scenario.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">{scenario.name}</h5>
                    <p className="text-sm text-slate-400">{scenario.description}</p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(scenario.difficulty)}>
                  {scenario.difficulty} Complexity
                </Badge>
              </div>

              <div className="space-y-2">
                <h6 className="text-sm font-medium text-slate-300">Available Alternatives:</h6>
                <div className="grid gap-2">
                  {scenario.alternatives.map(alt => (
                    <div key={alt.id} className="bg-slate-800/30 rounded-lg p-3 border border-slate-600/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{alt.name}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>${typeof alt.cost === 'number' ? alt.cost.toLocaleString() : (alt.cost as any)?.value?.toLocaleString() || 'Variable'}</span>
                          <span>•</span>
                          <span>{typeof alt.time === 'number' ? alt.time : (alt.time as any)?.value || 'Variable'}d</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => runScenario(key)}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing && selectedScenario === key ? 'Running Analysis...' : 'Run This Scenario'}
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-4 text-xs text-slate-500 border-t border-slate-700 pt-3">
        💡 Each scenario demonstrates different symbolic reasoning challenges: uncertainty handling, 
        multi-criteria trade-offs, and rule validation under various African logistics conditions.
      </div>
    </Card>
  );
};
