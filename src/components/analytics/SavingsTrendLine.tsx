
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import type { ShipmentData } from '@/types/shipment';

interface SavingsTrendLineProps {
  shipmentData: ShipmentData[];
}

export const SavingsTrendLine: React.FC<SavingsTrendLineProps> = ({ shipmentData }) => {
  const calculateSavingsData = () => {
    if (!shipmentData || shipmentData.length === 0) return [];

    // Group shipments by month
    const monthlyData: Record<string, {
      totalCost: number;
      shipmentCount: number;
      avgCost: number;
    }> = {};

    shipmentData.forEach(shipment => {
      const dateStr = shipment.pickup_date || shipment.delivery_date || shipment.date_of_collection || '2024-01-01';
      const date = new Date(dateStr);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          totalCost: 0,
          shipmentCount: 0,
          avgCost: 0
        };
      }
      
      const costField = shipment['carrier+cost'] || shipment.carrier_cost || 0;
      const costNum = typeof costField === 'string' ? parseFloat(costField.toString().replace(/[^0-9.-]/g, '')) : Number(costField) || 0;
      monthlyData[monthKey].totalCost += costNum;
      monthlyData[monthKey].shipmentCount++;
    });

    // Calculate average cost for each month
    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].avgCost = monthlyData[month].totalCost / monthlyData[month].shipmentCount;
    });

    // Convert to chart data format
    const chartData = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        avgCost: data.avgCost
      }))
      .sort((a, b) => a.month.localeCompare(b.month)); // Sort by month

    return chartData;
  };

  const savingsData = calculateSavingsData();

  if (!savingsData.length) {
    return (
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            📈 Monthly Savings Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-indigo-300">
            No savings data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          📈 Monthly Savings Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={savingsData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Average Cost']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line type="monotone" dataKey="avgCost" stroke="#82ca9d" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-indigo-300">
          Trend shows average monthly shipment costs.
        </div>
      </CardContent>
    </Card>
  );
};
