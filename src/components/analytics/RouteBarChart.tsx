
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Trophy, Award, Medal } from 'lucide-react';
import type { ShipmentData } from '@/types/shipment';

interface RouteBarChartProps {
  shipmentData: ShipmentData[];
}

const getRankIcon = (index: number) => {
  switch (index) {
    case 0: return <Trophy className="w-4 h-4 text-yellow-400" />;
    case 1: return <Award className="w-4 h-4 text-gray-300" />;
    case 2: return <Medal className="w-4 h-4 text-orange-400" />;
    default: return null;
  }
};

export const RouteBarChart: React.FC<RouteBarChartProps> = ({ shipmentData }) => {
  // Calculate real route performance from shipment data
  const calculateRouteData = () => {
    if (!shipmentData || shipmentData.length === 0) return [];

    const routeStats: Record<string, {
      count: number;
      totalCost: number;
      totalWeight: number;
      deliveredCount: number;
    }> = {};

    shipmentData.forEach(shipment => {
      const origin = shipment.origin_country || 'Unknown';
      const destination = shipment.destination_country || 'Unknown';
      const route = `${origin} → ${destination}`;
      
      if (!routeStats[route]) {
        routeStats[route] = {
          count: 0,
          totalCost: 0,
          totalWeight: 0,
          deliveredCount: 0
        };
      }
      
      routeStats[route].count++;
      const cost = shipment['carrier+cost'] || shipment.carrier_cost || 0;
      const costNum = typeof cost === 'string' ? parseFloat(cost.replace(/,/g, '')) : cost;
      routeStats[route].totalCost += costNum;
      routeStats[route].totalWeight += parseFloat(String(shipment.weight_kg || '0')) || 0;
      if (shipment.delivery_status === 'Delivered') {
        routeStats[route].deliveredCount++;
      }
    });

    // Convert to chart format and calculate performance score
    return Object.entries(routeStats)
      .map(([route, stats]) => ({
        route: route.length > 15 ? route.substring(0, 15) + '...' : route,
        fullRoute: route,
        score: Math.round((stats.deliveredCount / stats.count) * 100),
        cost: Math.round(stats.totalCost / stats.count),
        shipments: stats.count,
        avgWeight: Math.round(stats.totalWeight / stats.count)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 routes
  };

  const routeData = calculateRouteData();

  if (!routeData.length) {
    return (
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            🛣️ Top Route Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-indigo-300">
            No route data available
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  name === 'score' ? 'Delivery Rate' : name
                ]}
                labelFormatter={(label) => routeData.find(r => r.route === label)?.fullRoute || label}
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
            <div key={route.fullRoute} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                {getRankIcon(index)}
                <span className="text-white font-medium" title={route.fullRoute}>
                  {route.route}
                </span>
              </div>
              <div className="text-sm text-indigo-300">
                {route.shipments} shipments | Avg: ${route.cost}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
