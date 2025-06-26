
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';
import { TOPSISResult } from '@/services/topsisEngine';

interface TOPSISMatrixDisplayProps {
  ranking: TOPSISResult[];
}

export const TOPSISMatrixDisplay: React.FC<TOPSISMatrixDisplayProps> = ({ ranking }) => {
  const criteria = ['Cost', 'Time', 'Reliability', 'Risk'];
  
  // Calculate ideal and anti-ideal points for display
  const idealPoint = criteria.map((_, index) => {
    const values = ranking.map(r => r.alternative.criteria[index]);
    return index < 2 ? Math.min(...values) : Math.max(...values); // Cost/Time = min, Reliability/Risk = max
  });

  const antiIdealPoint = criteria.map((_, index) => {
    const values = ranking.map(r => r.alternative.criteria[index]);
    return index < 2 ? Math.max(...values) : Math.min(...values);
  });

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="glass-card shadow-glass border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
          <Target className="w-4 h-4 text-white" />
        </div>
        <h4 className="text-lg font-bold text-cyan-400">TOPSIS Decision Matrix</h4>
      </div>

      {/* Ideal/Anti-Ideal Reference Points */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">Ideal Solution</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {criteria.map((criterion, index) => (
              <div key={criterion}>
                <span className="text-slate-400">{criterion}:</span>
                <span className="text-green-300 ml-1 font-mono">
                  {idealPoint[index].toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">Anti-Ideal Solution</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {criteria.map((criterion, index) => (
              <div key={criterion}>
                <span className="text-slate-400">{criterion}:</span>
                <span className="text-red-300 ml-1 font-mono">
                  {antiIdealPoint[index].toFixed(3)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left text-slate-400 p-2">Alternative</th>
              {criteria.map(criterion => (
                <th key={criterion} className="text-center text-slate-400 p-2">{criterion}</th>
              ))}
              <th className="text-center text-slate-400 p-2">TOPSIS Score</th>
              <th className="text-center text-slate-400 p-2">Rank</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((result, index) => (
              <tr 
                key={result.alternative.id}
                className={`border-b border-slate-700/50 ${
                  index === 0 ? 'bg-green-900/20' : 'hover:bg-slate-800/30'
                }`}
              >
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'
                    }`}>
                      {result.rank}
                    </div>
                    <span className="text-white text-xs">{result.alternative.name.split(' ')[0]}</span>
                  </div>
                </td>
                {result.alternative.criteria.map((value, criteriaIndex) => (
                  <td key={criteriaIndex} className="text-center p-2">
                    <span className="font-mono text-slate-300">{value.toFixed(3)}</span>
                  </td>
                ))}
                <td className="text-center p-2">
                  <Badge className={`${getScoreColor(result.score)} border-current bg-transparent`}>
                    {result.score.toFixed(3)}
                  </Badge>
                </td>
                <td className="text-center p-2">
                  <span className={index === 0 ? 'text-green-400 font-bold' : 'text-slate-300'}>
                    #{result.rank}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        <p>TOPSIS Score = Distance to Anti-Ideal / (Distance to Ideal + Distance to Anti-Ideal)</p>
        <p>Higher scores indicate better alternatives closer to the ideal solution.</p>
      </div>
    </Card>
  );
};
