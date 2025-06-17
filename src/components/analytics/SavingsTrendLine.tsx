import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import type { ShipmentData } from '@/types/shipment';

interface SavingsTrendLineProps {
  shipmentData: ShipmentData[];
}

export const SavingsTrendLine: React.FC<SavingsTrendLineProps> = ({ shipmentData }) => {
  const [showCost, setShowCost] = useState(true);
  const [showTime, setShowTime] = useState(true);

  // Calculate real trend data from shipment data
  const calculateTrendData = () => {
    if (!shipmentData || shipmentData.length === 0) return [];

    // Group shipments by month
    const monthlyStats: Record<string, {
      totalCost: number;
      count: number;
      avgDeliveryDays: number;
      deliveryDaysCount: number;
    }> = {};

    shipmentData.forEach(shipment => {
      const date = new Date(shipment.date_of_collection || Date.now());
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          totalCost: 0,
          count: 0,
          avgDeliveryDays: 0,
          deliveryDaysCount: 0
        };
      }
      
      monthlyStats[monthKey].count++;
      const cost = shipment['carrier+cost'] || shipment.carrier_cost || 0;
      const costNum = typeof cost === 'string' ? parseFloat(cost.replace(/,/g, '')) || 0 : Number(cost) || 0;
      monthlyStats[monthKey].totalCost += costNum;

      // Calculate delivery days if both dates are available
      if (shipment.date_of_arrival_destination && shipment.date_of_collection) {
        const collectionDate = new Date(shipment.date_of_collection);
        const arrivalDate = new Date(shipment.date_of_arrival_destination);
        const deliveryDays = Math.round((arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (deliveryDays > 0 && deliveryDays < 60) { // Reasonable delivery time
          monthlyStats[monthKey].avgDeliveryDays += deliveryDays;
          monthlyStats[monthKey].deliveryDaysCount++;
        }
      }
    });

    // Calculate baseline costs and times for comparison
    const allCosts = Object.values(monthlyStats).map(stat => stat.count > 0 ? stat.totalCost / stat.count : 0);
    const allTimes = Object.values(monthlyStats).map(stat => 
      stat.deliveryDaysCount > 0 ? stat.avgDeliveryDays / stat.deliveryDaysCount : 0
    ).filter(time => time > 0);
    
    const baselineCost = allCosts.length > 0 ? Math.max(...allCosts) : 1000;
    const baselineTime = allTimes.length > 0 ? Math.max(...allTimes) : 14;

    // Convert to chart format
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const stats = monthlyStats[month];
      if (!stats || stats.count === 0) {
        return {
          month,
          costSavings: 0,
          timeReduction: 0
        };
      }

      const avgCost = stats.totalCost / stats.count;
      const avgTime = stats.deliveryDaysCount > 0 ? stats.avgDeliveryDays / stats.deliveryDaysCount : baselineTime;
      
      const costSavings = Math.max(0, Math.round(((baselineCost - avgCost) / baselineCost) * 100));
      const timeReduction = Math.max(0, Math.round(((baselineTime - avgTime) / baselineTime) * 100));

      return {
        month,
        costSavings,
        timeReduction
      };
    });
  };

  const trendData = calculateTrendData();

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          📈 Performance Efficiency Trends
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={showCost ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCost(!showCost)}
            className="text-xs"
          >
            💰 Cost Efficiency
          </Button>
          <Button
            variant={showTime ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTime(!showTime)}
            className="text-xs"
          >
            ⏱️ Time Efficiency
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {trendData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
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
                    name="Cost Efficiency %"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                )}
                {showTime && (
                  <Line 
                    type="monotone" 
                    dataKey="timeReduction" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Time Efficiency %"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-indigo-300">
            No trend data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
