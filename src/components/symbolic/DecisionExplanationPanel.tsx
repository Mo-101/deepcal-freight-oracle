
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Shield, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { SymbolicResult } from '@/hooks/useSymbolicIntelligence';

interface DecisionExplanationPanelProps {
  result: SymbolicResult;
}

export const DecisionExplanationPanel: React.FC<DecisionExplanationPanelProps> = ({ result }) => {
  const getFactorIcon = (factor: string) => {
    switch (factor.toLowerCase()) {
      case 'cost': return DollarSign;
      case 'time': return Clock;
      case 'reliability': return Shield;
      case 'risk': return AlertTriangle;
      default: return TrendingUp;
    }
  };

  const getFactorScore = (alternative: any, factor: string) => {
    const value = alternative[factor.toLowerCase()];
    if (typeof value === 'number') return value;
    if (value?.value) return value.value;
    if (value?.range) return (value.range[0] + value.range[1]) / 2;
    return 0;
  };

  const factors = ['cost', 'time', 'reliability', 'risk'];

  return (
    <Card className="glass-card shadow-glass border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-lg font-bold text-cyan-400">Why This Choice?</h4>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">{result.bestAlternative.name}</strong> was selected through 
          symbolic reasoning combining {result.validRules.length} validated logistics rules with 
          multi-criteria optimization.
        </div>

        <div className="grid grid-cols-2 gap-4">
          {factors.map(factor => {
            const Icon = getFactorIcon(factor);
            const score = getFactorScore(result.bestAlternative, factor);
            const isHigherBetter = factor === 'reliability';
            const normalizedScore = isHigherBetter ? score * 100 : Math.max(0, 100 - score * 10);
            
            return (
              <div key={factor} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400 capitalize">{factor}</span>
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  {factor === 'cost' ? `$${score.toLocaleString()}` : 
                   factor === 'time' ? `${score} days` :
                   factor === 'reliability' ? `${(score * 100).toFixed(0)}%` :
                   `${(score * 100).toFixed(0)}%`}
                </div>
                <Progress value={Math.min(normalizedScore, 100)} className="h-1" />
              </div>
            );
          })}
        </div>

        <div className="border-t border-cyan-500/30 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Decision Confidence</span>
            <Badge className="bg-cyan-600/20 text-cyan-300">
              {(result.confidence * 100).toFixed(1)}% Symbolic Certainty
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
