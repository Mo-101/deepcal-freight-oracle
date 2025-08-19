import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
  };
}

export function KpiCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-lime-400',
  description,
  badge
}: KpiCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getBadgeColor = () => {
    if (badge?.color) return badge.color;
    
    switch (badge?.variant) {
      case 'destructive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'outline':
        return 'bg-transparent text-white border-white/30';
      case 'secondary':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-indigo-200">
            {title}
          </CardTitle>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {badge && (
              <Badge
                variant={badge.variant || 'secondary'}
                className={getBadgeColor()}
              >
                {badge.text}
              </Badge>
            )}
          </div>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${getTrendColor()}`}>
                {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-indigo-300">vs last period</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-indigo-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Preset KPI card variants for common use cases
export const SavingsKpiCard = (props: Omit<KpiCardProps, 'icon' | 'iconColor'>) => (
  <KpiCard {...props} icon={TrendingUp} iconColor="text-green-400" />
);

export const PerformanceKpiCard = (props: Omit<KpiCardProps, 'icon' | 'iconColor'>) => (
  <KpiCard {...props} icon={TrendingUp} iconColor="text-blue-400" />
);

export const RiskKpiCard = (props: Omit<KpiCardProps, 'icon' | 'iconColor'>) => (
  <KpiCard {...props} icon={TrendingDown} iconColor="text-red-400" />
);