
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfidenceMeterProps {
  score: string | number;
  label?: string;
  showDetails?: boolean;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  label = "Route Confidence",
  showDetails = true
}) => {
  const numericScore = typeof score === 'string' ? parseFloat(score) : score;
  const percentage = numericScore * 100;
  
  const getConfidenceLevel = (value: number) => {
    if (value >= 80) return { level: 'High', color: 'text-green-400', icon: CheckCircle, bgColor: 'bg-green-900/30' };
    if (value >= 60) return { level: 'Medium', color: 'text-yellow-400', icon: TrendingUp, bgColor: 'bg-yellow-900/30' };
    return { level: 'Low', color: 'text-red-400', icon: AlertTriangle, bgColor: 'bg-red-900/30' };
  };

  const confidence = getConfidenceLevel(percentage);
  const Icon = confidence.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <Badge variant="outline" className={`${confidence.color} border-current`}>
          <Icon className="w-3 h-3 mr-1" />
          {confidence.level}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">{numericScore.toFixed(3)}</span>
          <span className="text-sm text-slate-400">{percentage.toFixed(1)}%</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-3 bg-slate-700"
          />
          <div 
            className="absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 animate-pulse"
            style={{
              width: `${percentage}%`,
              background: percentage >= 80 
                ? 'linear-gradient(90deg, #10b981, #34d399)' 
                : percentage >= 60 
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)'
            }}
          />
        </div>
        
        {showDetails && (
          <div className={`${confidence.bgColor} rounded-lg p-3 border border-current/20`}>
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${confidence.color}`} />
              <span className="text-xs text-slate-300">
                {percentage >= 80 && "Excellent route optimization with high reliability metrics"}
                {percentage >= 60 && percentage < 80 && "Good route choice with moderate risk factors"}
                {percentage < 60 && "Consider alternative routes or adjust priorities"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfidenceMeter;
