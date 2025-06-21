import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, MapPin, Clock } from 'lucide-react';
import type { ShipmentData } from '@/types/shipment';

interface TabsAnalyticsProps {
  shipmentData: ShipmentData[];
}

export const TabsAnalytics: React.FC<TabsAnalyticsProps> = ({ shipmentData }) => {
  // Calculate analytics data from real shipment data
  const calculateAnalytics = () => {
    if (!shipmentData || shipmentData.length === 0) {
      return {
        costAnalysis: [],
        routeAnalysis: [],
        timeAnalysis: [],
        carrierAnalysis: []
      };
    }

    // Cost analysis by month
    const monthlyCosts: Record<string, number> = {};
    const routePerformance: Record<string, { count: number; avgCost: number; totalCost: number }> = {};
    const carrierPerformance: Record<string, { count: number; avgCost: number; totalCost: number }> = {};

    shipmentData.forEach(shipment => {
      const dateStr = shipment.pickup_date || shipment.delivery_date || '2024-01-01';
      const month = new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      
      const costField = shipment['carrier+cost'] || shipment.carrier_cost || 0;
      const costNum = typeof costField === 'string' ? parseFloat(costField.replace(/[^0-9.-]/g, '')) : Number(costField) || 0;
      
      // Monthly costs
      monthlyCosts[month] = (monthlyCosts[month] || 0) + costNum;
      
      // Route analysis
      const route = `${shipment.origin_country || 'Unknown'} → ${shipment.destination_country || 'Unknown'}`;
      if (!routePerformance[route]) {
        routePerformance[route] = { count: 0, avgCost: 0, totalCost: 0 };
      }
      routePerformance[route].count++;
      routePerformance[route].totalCost += costNum;
      
      // Carrier analysis
      const carrier = shipment.carrier || 'Unknown';
      if (!carrierPerformance[carrier]) {
        carrierPerformance[carrier] = { count: 0, avgCost: 0, totalCost: 0 };
      }
      carrierPerformance[carrier].count++;
      const carrierCostField = shipment['carrier+cost'] || shipment.carrier_cost || 0;
      const carrierCostNum = typeof carrierCostField === 'string' ? parseFloat(carrierCostField.replace(/[^0-9.-]/g, '')) : Number(carrierCostField) || 0;
      carrierPerformance[carrier].totalCost += carrierCostNum;
    });

    // Convert monthly costs to chart data
    const costAnalysis = Object.entries(monthlyCosts)
      .map(([month, cost]) => ({ month, cost: Math.round(cost) }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Convert route performance to chart data
    const routeAnalysis = Object.entries(routePerformance)
      .map(([route, data]) => ({
        route,
        shipments: data.count,
        avgCost: Math.round(data.totalCost / data.count)
      }))
      .sort((a, b) => b.shipments - a.shipments)
      .slice(0, 5); // Top 5 routes

    // Time analysis (shipments per month)
    const timeAnalysis = costAnalysis.map(item => ({
      month: item.month,
      shipments: shipmentData.filter(s => {
        const dateStr = s.pickup_date || s.delivery_date || '2024-01-01';
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) === item.month;
      }).length
    }));

    // Carrier analysis for pie chart
    const carrierAnalysis = Object.entries(carrierPerformance)
      .map(([carrier, data]) => ({
        carrier,
        shipments: data.count,
        avgCost: Math.round(data.totalCost / data.count)
      }))
      .sort((a, b) => b.shipments - a.shipments)
      .slice(0, 5); // Top 5 carriers

    return {
      costAnalysis,
      routeAnalysis,
      timeAnalysis,
      carrierAnalysis
    };
  };

  const { costAnalysis, routeAnalysis, timeAnalysis, carrierAnalysis } = calculateAnalytics();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          📊 Shipment Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultvalue="cost" className="w-full">
          <TabsList>
            <TabsTrigger value="cost" className="text-indigo-300">
              <TrendingUp className="w-4 h-4 mr-2" />
              Cost Analysis
            </TabsTrigger>
            <TabsTrigger value="route" className="text-indigo-300">
              <MapPin className="w-4 h-4 mr-2" />
              Route Performance
            </TabsTrigger>
            <TabsTrigger value="time" className="text-indigo-300">
              <Clock className="w-4 h-4 mr-2" />
              Time Analysis
            </TabsTrigger>
            <TabsTrigger value="carrier" className="text-indigo-300">
              <Package className="w-4 h-4 mr-2" />
              Carrier Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cost">
            {costAnalysis.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costAnalysis}>
                    <XAxis dataKey="month" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', color: 'white' }} />
                    <Line type="monotone" dataKey="cost" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-indigo-300">
                No cost data available
              </div>
            )}
          </TabsContent>
          <TabsContent value="route">
            {routeAnalysis.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={routeAnalysis}>
                    <XAxis dataKey="route" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', color: 'white' }} />
                    <Bar dataKey="avgCost" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-indigo-300">
                No route data available
              </div>
            )}
          </TabsContent>
          <TabsContent value="time">
            {timeAnalysis.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeAnalysis}>
                    <XAxis dataKey="month" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', color: 'white' }} />
                    <Line type="monotone" dataKey="shipments" stroke="#f472b6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-indigo-300">
                No time data available
              </div>
            )}
          </TabsContent>
          <TabsContent value="carrier">
            {carrierAnalysis.length > 0 ? (
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="shipments"
                      data={carrierAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {
                        carrierAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '8px', color: 'white' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-indigo-300">
                No carrier data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
