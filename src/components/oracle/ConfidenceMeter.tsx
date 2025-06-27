
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface ConfidenceMeterProps {
  score: string | number;
  label?: string;
  showDetails?: boolean;
  animated?: boolean;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  label = "Route Confidence",
  showDetails = true,
  animated = true
}) => {
  const numericScore = typeof score === 'string' ? parseFloat(score) : score;
  const percentage = numericScore * 100;
  
  const getConfidenceLevel = (value: number) => {
    if (value >= 80) return { 
      level: 'High', 
      color: 'text-green-400', 
      icon: CheckCircle, 
      bgColor: 'bg-green-900/30',
      glowColor: 'shadow-green-500/20'
    };
    if (value >= 60) return { 
      level: 'Medium', 
      color: 'text-yellow-400', 
      icon: TrendingUp, 
      bgColor: 'bg-yellow-900/30',
      glowColor: 'shadow-yellow-500/20'
    };
    return { 
      level: 'Low', 
      color: 'text-red-400', 
      icon: AlertTriangle, 
      bgColor: 'bg-red-900/30',
      glowColor: 'shadow-red-500/20'
    };
  };

  const confidence = getConfidenceLevel(percentage);
  const Icon = confidence.icon;

  return (
    <div className={`space-y-3 ${animated ? 'animate-fade-in' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <Badge variant="outline" className={`${confidence.color} border-current ${animated ? 'animate-pulse' : ''}`}>
          <Icon className="w-3 h-3 mr-1" />
          {confidence.level}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{numericScore.toFixed(3)}</span>
            {animated && <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />}
          </div>
          <span className="text-sm text-slate-400">{percentage.toFixed(1)}%</span>
        </div>
        
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-3 bg-slate-700"
          />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${animated ? 'animate-pulse' : ''}`}
            style={{
              width: `${percentage}%`,
              background: percentage >= 80 
                ? 'linear-gradient(90deg, #10b981, #34d399)' 
                : percentage >= 60 
                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                : 'linear-gradient(90deg, #ef4444, #f87171)'
            }}
          />
          
          {/* Glow effect for high confidence */}
          {percentage >= 80 && animated && (
            <div className="absolute top-0 left-0 w-full h-3 rounded-full bg-green-400/20 animate-pulse" />
          )}
        </div>
        
        {showDetails && (
          <div className={`${confidence.bgColor} ${confidence.glowColor} rounded-lg p-3 border border-current/20 ${animated ? 'shadow-lg' : ''}`}>
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${confidence.color}`} />
              <span className="text-xs text-slate-300">
                {percentage >= 80 && "🚀 Excellent route optimization with high reliability metrics"}
                {percentage >= 60 && percentage < 80 && "⚡ Good route choice with moderate risk factors"}
                {percentage < 60 && "⚠️ Consider alternative routes or adjust priorities"}
              </span>
            </div>
            
            {animated && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">Live confidence tracking</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfidenceMeter;
