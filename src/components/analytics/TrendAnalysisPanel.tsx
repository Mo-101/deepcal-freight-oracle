import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, BarChart } from 'lucide-react';
import type { ShipmentData } from '@/types/shipment';

interface TrendAnalysisPanelProps {
  shipmentData: ShipmentData[];
}

export const TrendAnalysisPanel: React.FC<TrendAnalysisPanelProps> = ({ shipmentData }) => {
  const { monthlyTrends, quarterlyTrends, routeTrends } = useMemo(() => {
    if (!shipmentData || shipmentData.length === 0) {
      return { monthlyTrends: [], quarterlyTrends: [], routeTrends: [] };
    }

    // Monthly trends
    const monthlyData: Record<string, { shipments: number; cost: number; weight: number }> = {};
    
    shipmentData.forEach(shipment => {
      const dateStr = shipment.pickup_date || shipment.date_of_collection || '2024-01-01';
      const date = new Date(dateStr);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { shipments: 0, cost: 0, weight: 0 };
      }
      
      monthlyData[monthKey].shipments += 1;
      monthlyData[monthKey].cost += parseFloat((shipment['carrier+cost'] || '0').toString().replace(/[^0-9.-]/g, ''));
      monthlyData[monthKey].weight += parseFloat((shipment.weight_kg || '0').toString());
    });

    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        shipments: data.shipments,
        cost: Math.round(data.cost),
        avgCostPerShipment: Math.round(data.cost / data.shipments),
        weight: Math.round(data.weight),
        efficiency: Math.round((data.weight / data.cost) * 100) / 100
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Quarterly trends
    const quarterlyData: Record<string, { shipments: number; cost: number; savings: number }> = {};
    
    monthlyTrends.forEach(month => {
      const date = new Date(month.month);
      const quarter = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      
      if (!quarterlyData[quarter]) {
        quarterlyData[quarter] = { shipments: 0, cost: 0, savings: 0 };
      }
      
      quarterlyData[quarter].shipments += month.shipments;
      quarterlyData[quarter].cost += month.cost;
      quarterlyData[quarter].savings += month.cost * 0.15; // Simulated savings
    });

    const quarterlyTrends = Object.entries(quarterlyData)
      .map(([quarter, data]) => ({
        quarter,
        shipments: data.shipments,
        cost: Math.round(data.cost),
        savings: Math.round(data.savings),
        roi: Math.round((data.savings / data.cost) * 100)
      }));

    // Route trends
    const routeData: Record<string, { count: number; totalCost: number; avgWeight: number }> = {};
    
    shipmentData.forEach(shipment => {
      const route = `${shipment.origin_country || 'Unknown'} → ${shipment.destination_country || 'Unknown'}`;
      if (!routeData[route]) {
        routeData[route] = { count: 0, totalCost: 0, avgWeight: 0 };
      }
      
      routeData[route].count += 1;
      routeData[route].totalCost += parseFloat((shipment['carrier+cost'] || '0').toString().replace(/[^0-9.-]/g, ''));
      routeData[route].avgWeight += parseFloat((shipment.weight_kg || '0').toString());
    });

    const routeTrends = Object.entries(routeData)
      .map(([route, data]) => ({
        route,
        shipments: data.count,
        avgCost: Math.round(data.totalCost / data.count),
        avgWeight: Math.round(data.avgWeight / data.count),
        efficiency: Math.round((data.avgWeight / (data.totalCost / data.count)) * 100) / 100
      }))
      .sort((a, b) => b.shipments - a.shipments)
      .slice(0, 8);

    return { monthlyTrends, quarterlyTrends, routeTrends };
  }, [shipmentData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Shipment Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="shipments"
                    stroke="#10b981"
                    fill="rgba(16, 185, 129, 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-glass border border-glassBorder">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Cost Efficiency Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgCostPerShipment"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Quarterly Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quarterlyTrends.map((quarter, index) => (
              <div key={quarter.quarter} className="p-4 bg-slate-800/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">{quarter.quarter}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-300">Shipments:</span>
                    <span className="text-lime-400">{quarter.shipments}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-300">Cost:</span>
                    <span className="text-blue-400">${quarter.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-300">Savings:</span>
                    <span className="text-green-400">${quarter.savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-300">ROI:</span>
                    <span className="text-purple-400">{quarter.roi}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400">Top Route Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routeTrends.map((route, index) => (
              <div key={route.route} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center text-lime-400 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{route.route}</div>
                    <div className="text-xs text-indigo-300">{route.shipments} shipments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-400">${route.avgCost.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">avg cost</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-400">{route.efficiency}</div>
                  <div className="text-xs text-slate-400">efficiency</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
