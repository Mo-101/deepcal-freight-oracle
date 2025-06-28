
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import type { ShipmentData } from '@/types/shipment';

interface SavingsTrendLineProps {
  shipmentData: ShipmentData[];
}

export const SavingsTrendLine: React.FC<SavingsTrendLineProps> = ({ shipmentData }) => {
  // Process data to create monthly trends
  const monthlyData = shipmentData.reduce((acc, shipment) => {
    const date = new Date(shipment.date_of_collection || Date.now());
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        totalCost: 0,
        shipmentCount: 0,
        totalWeight: 0
      };
    }
    
    acc[monthKey].totalCost += shipment['carrier+cost'] || 0;
    acc[monthKey].shipmentCount += 1;
    acc[monthKey].totalWeight += shipment.weight_kg || 0;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .slice(-12) // Last 12 months
    .map((data: any) => ({
      month: data.month,
      avgCostPerKg: data.totalWeight > 0 ? data.totalCost / data.totalWeight : 0,
      totalCost: data.totalCost,
      shipmentCount: data.shipmentCount
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-cyan-400 font-medium">{label}</p>
          <p className="text-white">
            Avg Cost/kg: <span className="text-green-400">${String(payload[0].value)}</span>
          </p>
          <p className="text-white">
            Total Cost: <span className="text-yellow-400">${String(payload[1]?.value || 0)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-slate-800/90 border border-slate-600">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Cost Trend Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="avgCostPerKg" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 2 }}
            name="Avg Cost/kg"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
