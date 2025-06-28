
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import type { ShipmentData } from '@/types/shipment';

interface RouteBarChartProps {
  shipmentData: ShipmentData[];
}

export const RouteBarChart: React.FC<RouteBarChartProps> = ({ shipmentData }) => {
  // Process data to get route statistics
  const routeStats = shipmentData.reduce((acc, shipment) => {
    const route = `${shipment.origin_country} → ${shipment.destination_country}`;
    if (!acc[route]) {
      acc[route] = {
        route,
        count: 0,
        totalWeight: 0,
        totalCost: 0
      };
    }
    acc[route].count += 1;
    acc[route].totalWeight += shipment.weight_kg || 0;
    acc[route].totalCost += shipment['carrier+cost'] || 0;
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by count
  const chartData = Object.values(routeStats)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10) // Top 10 routes
    .map((route: any) => ({
      route: route.route,
      shipments: route.count,
      avgWeight: route.totalWeight / route.count,
      avgCost: route.totalCost / route.count
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-cyan-400 font-medium">{label}</p>
          <p className="text-white">
            Shipments: <span className="text-green-400">{String(payload[0].value)}</span>
          </p>
          <p className="text-white">
            Avg Weight: <span className="text-blue-400">{String(payload[1].value)} kg</span>
          </p>
          <p className="text-white">
            Avg Cost: <span className="text-yellow-400">${String(payload[2].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-slate-800/90 border border-slate-600">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Top Routes by Volume</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="route" 
            stroke="#9CA3AF"
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis stroke="#9CA3AF" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="shipments" fill="#06B6D4" name="Shipments" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
