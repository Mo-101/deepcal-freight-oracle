
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  previousValue?: number;
  isLoading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  previousValue = 0,
  isLoading = false
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isIncreasing = value > previousValue;
  const change = Math.abs(value - previousValue);

  useEffect(() => {
    if (isLoading) return;
    
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isLoading]);

  return (
    <Card className={`glass-card shadow-glass border border-glassBorder hover:border-${color}/50 transition-all duration-300 group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-${color}/20 rounded-lg flex items-center justify-center group-hover:bg-${color}/30 transition-all`}>
              {icon}
            </div>
            <div>
              <p className="text-indigo-300 text-sm font-medium">{title}</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold text-${color}`}>
                  {isLoading ? '--' : displayValue.toFixed(1)}{unit}
                </span>
                {change > 0 && (
                  <div className="flex items-center gap-1">
                    {isIncreasing ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-xs ${isIncreasing ? 'text-green-400' : 'text-red-400'}`}>
                      {change.toFixed(1)}{unit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
