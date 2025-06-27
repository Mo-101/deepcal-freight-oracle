import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import RealAnalytics from '@/components/RealAnalytics';

const kpiData = [
  { name: 'Revenue', value: 45000, change: 7, isPositive: true, icon: DollarSign },
  { name: 'Uptime', value: 99.95, change: 0.01, isPositive: true, icon: Clock },
  { name: 'Security Score', value: 92, change: 3, isPositive: true, icon: Shield },
  { name: 'Pending Alerts', value: 5, change: 2, isPositive: false, icon: AlertTriangle },
];

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 },
  { month: 'Jul', revenue: 3490 },
];

const alertData = [
  { time: '00:00', count: 2 },
  { time: '03:00', count: 5 },
  { time: '06:00', count: 3 },
  { time: '09:00', count: 7 },
  { time: '12:00', count: 4 },
  { time: '15:00', count: 6 },
  { time: '18:00', count: 4 },
  { time: '21:00', count: 3 },
  { time: '24:00', count: 1 },
];

const forwarderPerformance = [
  { name: 'Forwarder A', performance: 95 },
  { name: 'Forwarder B', performance: 88 },
  { name: 'Forwarder C', performance: 76 },
  { name: 'Forwarder D', performance: 92 },
];

const Analytics = () => {
  return (
    <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-white mb-4">Analytics Dashboard</h1>
        <p className="text-gray-400">Real-time insights and analytics to optimize your operations.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-slate-700">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="text-white data-[state=active]:bg-slate-700">Performance</TabsTrigger>
          <TabsTrigger value="security" className="text-white data-[state=active]:bg-slate-700">Security</TabsTrigger>
          <TabsTrigger value="realtime" className="text-white data-[state=active]:bg-slate-700">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="bg-slate-800/50 border border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <kpi.icon className="w-4 h-4" />
                    {kpi.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{kpi.value}</div>
                  <div className={`flex items-center text-sm ${kpi.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {kpi.change}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={alertData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Bar dataKey="count" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Forwarder Performance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={forwarderPerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="performance"
                    label={({ name, performance }) => `${name}: ${performance}%`}
                  >
                    {forwarderPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">Detailed security metrics and insights will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Real-time Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <RealAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
