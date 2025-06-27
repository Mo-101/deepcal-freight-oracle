
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Brain, Zap, Target } from 'lucide-react';

interface SymbolicLegendProps {
  activeRuleCount?: number;
  rejectedRules?: number;
}

export const SymbolicLegend: React.FC<SymbolicLegendProps> = ({
  activeRuleCount = 0,
  rejectedRules = 0
}) => {
  return (
    <Card className="glass-card shadow-glass border border-glassBorder p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-slate-400">DeepCAL v2.1 - Symbolic Intelligence Engine</span>
          <Badge className="bg-green-600/20 text-green-400">Live</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Brain className="w-3 h-3" />
            <span>{activeRuleCount} rules active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Target className="w-3 h-3" />
            <span>Processing 105 historical records</span>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    </Card>
  );
};
