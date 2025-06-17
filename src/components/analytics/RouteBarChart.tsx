
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Trophy, Award, Medal } from 'lucide-react';

const routeData = [
  { route: 'SIN → LAX', score: 94, cost: 2400, delay: 5 },
  { route: 'FRA → JFK', score: 91, cost: 1800, delay: 8 },
  { route: 'NRT → SFO', score: 89, cost: 2100, delay: 12 },
  { route: 'LHR → ORD', score: 87, cost: 1500, delay: 15 },
  { route: 'DXB → LAX', score: 85, cost: 2200, delay: 18 },
];

const getRankIcon = (index: number) => {
  switch (index) {
    case 0: return <Trophy className="w-4 h-4 text-yellow-400" />;
    case 1: return <Award className="w-4 h-4 text-gray-300" />;
    case 2: return <Medal className="w-4 h-4 text-orange-400" />;
    default: return null;
  }
};

export const RouteBarChart: React.FC = () => {
  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          🛣️ Top Route Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeData} layout="horizontal">
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="route" width={80} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value, name) => [
                  name === 'score' ? `${value}%` : value,
                  name === 'score' ? 'Performance Score' : name
                ]}
              />
              <Bar dataKey="score" fill="url(#gradient)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06d6a0" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {routeData.slice(0, 3).map((route, index) => (
            <div key={route.route} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                {getRankIcon(index)}
                <span className="text-white font-medium">{route.route}</span>
              </div>
              <div className="text-sm text-indigo-300">
                Cost: ${route.cost} | Delay: {route.delay}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
