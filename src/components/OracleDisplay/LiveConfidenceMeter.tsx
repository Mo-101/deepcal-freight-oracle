
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface LiveConfidenceMeterProps {
  neutrosophicScore: number;
  topsisProgress: number;
  greySystemProgress: number;
  isCalculating: boolean;
}

export const LiveConfidenceMeter: React.FC<LiveConfidenceMeterProps> = ({
  neutrosophicScore,
  topsisProgress,
  greySystemProgress,
  isCalculating
}) => {
  if (!isCalculating) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Neutrosophic Logic</span>
          <span className="text-xs text-purple-400">{Math.round(neutrosophicScore)}%</span>
        </div>
        <Progress value={neutrosophicScore} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">TOPSIS Analysis</span>
          <span className="text-xs text-cyan-400">{Math.round(topsisProgress)}%</span>
        </div>
        <Progress value={topsisProgress} className="h-2" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Grey System</span>
          <span className="text-xs text-orange-400">{Math.round(greySystemProgress)}%</span>
        </div>
        <Progress value={greySystemProgress} className="h-2" />
      </div>
    </div>
  );
};
