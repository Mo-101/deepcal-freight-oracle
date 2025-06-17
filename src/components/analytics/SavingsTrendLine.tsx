
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';

const trendData = [
  { month: 'Jan', costSavings: 18.2, timeReduction: 15.8 },
  { month: 'Feb', costSavings: 20.1, timeReduction: 17.2 },
  { month: 'Mar', costSavings: 22.3, timeReduction: 18.9 },
  { month: 'Apr', costSavings: 21.8, timeReduction: 19.5 },
  { month: 'May', costSavings: 24.1, timeReduction: 21.2 },
  { month: 'Jun', costSavings: 23.5, timeReduction: 18.3 },
];

export const SavingsTrendLine: React.FC = () => {
  const [showCost, setShowCost] = useState(true);
  const [showTime, setShowTime] = useState(true);

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          📈 Cost vs Time Efficiency Trends
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={showCost ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCost(!showCost)}
            className="text-xs"
          >
            💰 Cost Savings
          </Button>
          <Button
            variant={showTime ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTime(!showTime)}
            className="text-xs"
          >
            ⏱️ Time Reduction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 30]} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
              />
              <Legend />
              {showCost && (
                <Line 
                  type="monotone" 
                  dataKey="costSavings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Cost Savings %"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              )}
              {showTime && (
                <Line 
                  type="monotone" 
                  dataKey="timeReduction" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Time Reduction %"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
