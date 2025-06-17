
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';

interface ForwarderCardFlipProps {
  forwarder: {
    name: string;
    rank: number;
    costPerKg: number;
    avgTransitDays: number;
    onTimeRate: number;
    topsisScore: number;
  };
  isSelected?: boolean;
}

const ForwarderCardFlip: React.FC<ForwarderCardFlipProps> = ({ 
  forwarder, 
  isSelected = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div 
      className="relative w-full h-32 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front Face */}
        <Card className={`absolute inset-0 w-full h-full backface-hidden p-4 cursor-pointer
          ${isSelected 
            ? 'bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-500' 
            : 'bg-slate-800/80 border-slate-600'
          } hover:border-purple-400 transition-all duration-300`}>
          <div className="flex items-center justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={forwarder.rank === 1 ? 'default' : 'secondary'} 
                       className={forwarder.rank === 1 ? 'bg-amber-600' : ''}>
                  #{forwarder.rank}
                </Badge>
                {isSelected && (
                  <Badge className="bg-purple-600 text-white">SELECTED</Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{forwarder.name}</h3>
              <p className="text-sm text-slate-400">Hover for details</p>
            </div>
            <div className="text-right space-y-1">
              <div className={`text-xl font-bold ${getScoreColor(forwarder.topsisScore)}`}>
                {forwarder.topsisScore.toFixed(3)}
              </div>
              <div className="text-xs text-slate-400">TOPSIS Score</div>
            </div>
          </div>
        </Card>

        {/* Back Face */}
        <Card className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-4
          ${isSelected 
            ? 'bg-gradient-to-r from-purple-900/70 to-cyan-900/70 border-purple-500' 
            : 'bg-slate-800/90 border-slate-600'
          }`}>
          <div className="h-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{forwarder.name}</h3>
              <Badge variant="outline" className="text-xs">Metrics</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-slate-300">Cost/kg</span>
                </div>
                <div className="text-green-400 font-semibold">${forwarder.costPerKg.toFixed(2)}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span className="text-slate-300">Transit</span>
                </div>
                <div className="text-blue-400 font-semibold">{forwarder.avgTransitDays} days</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span className="text-slate-300">On-Time</span>
                </div>
                <div className={`font-semibold ${getPerformanceColor(forwarder.onTimeRate)}`}>
                  {forwarder.onTimeRate.toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-cyan-400" />
                  <span className="text-slate-300">Score</span>
                </div>
                <div className={`font-semibold ${getScoreColor(forwarder.topsisScore)}`}>
                  {(forwarder.topsisScore * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForwarderCardFlip;
