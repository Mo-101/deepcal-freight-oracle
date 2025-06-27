import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Brain, Zap, Shield, TrendingUp, Activity, Database, Clock, CheckCircle } from 'lucide-react';

const kpiData = [
  { name: 'Data Processed', value: 12500, icon: <Database className="w-4 h-4 text-blue-500" />, color: '#3B82F6' },
  { name: 'Inferences Made', value: 8900, icon: <Brain className="w-4 h-4 text-purple-500" />, color: '#8B5CF6' },
  { name: 'Anomalies Detected', value: 340, icon: <Zap className="w-4 h-4 text-yellow-500" />, color: '#F59E0B' },
  { name: 'Threats Neutralized', value: 150, icon: <Shield className="w-4 h-4 text-green-500" />, color: '#10B981' },
];

const performanceData = [
  { time: '00:00', latency: 2.1, throughput: 120 },
  { time: '03:00', latency: 2.3, throughput: 130 },
  { time: '06:00', latency: 2.5, throughput: 140 },
  { time: '09:00', latency: 2.2, throughput: 150 },
  { time: '12:00', latency: 2.4, throughput: 160 },
  { time: '15:00', latency: 2.6, throughput: 170 },
  { time: '18:00', latency: 2.3, throughput: 180 },
  { time: '21:00', latency: 2.5, throughput: 190 },
  { time: '24:00', latency: 2.7, throughput: 200 },
];

const intelligenceData = [
  { name: 'Pattern Recognition', value: 35, color: '#FF6384' },
  { name: 'Predictive Analysis', value: 25, color: '#36A2EB' },
  { name: 'Anomaly Detection', value: 20, color: '#FFCE56' },
  { name: 'Strategic Planning', value: 20, color: '#4BC0C0' },
];

const resourceData = [
  { name: 'CPU', value: 75, color: '#FF6384' },
  { name: 'Memory', value: 60, color: '#36A2EB' },
  { name: 'Disk', value: 45, color: '#FFCE56' },
  { name: 'Network', value: 30, color: '#4BC0C0' },
];

const DeepCALDashboard = () => {
  const [uptime, setUptime] = React.useState(0);
  const [isEngineOnline, setIsEngineOnline] = React.useState(false);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setUptime((prevUptime) => prevUptime + 1);
    }, 1000);

    // Simulate engine status check
    const engineCheckInterval = setInterval(() => {
      setIsEngineOnline(Math.random() > 0.2); // 80% chance of being online
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearInterval(engineCheckInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">DeepCAL Engine Dashboard</h1>
        <p className="text-slate-400">Real-time monitoring and analytics for the DeepCAL Symbolic Intelligence Engine.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Key Performance Indicators */}
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-slate-800/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                {kpi.icon}
                {kpi.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value.toLocaleString()}</div>
              <p className="text-sm text-slate-400">Processed in the last 24 hours</p>
            </CardContent>
          </Card>
        ))}

        {/* Intelligence Distribution */}
        <Card className="bg-slate-800/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Brain className="w-5 h-5" />
              Intelligence Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={intelligenceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {intelligenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-slate-800/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xl font-bold ${isEngineOnline ? 'text-green-400' : 'text-red-400'}`}>
                {isEngineOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Uptime: {formatTime(uptime)}</span>
            </div>
          </CardContent>
        </Card>

        {/* System Resource Usage */}
        <Card className="bg-slate-800/50 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Activity className="w-5 h-5" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-slate-800/50 border-orange-500/30 col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <TrendingUp className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="time" stroke="#A0AEC0" />
                <YAxis yAxisId="latency" stroke="#A0AEC0" />
                <YAxis yAxisId="throughput" orientation="right" stroke="#A0AEC0" />
                <Tooltip />
                <Legend />
                <Line yAxisId="latency" type="monotone" dataKey="latency" stroke="#F56565" name="Latency (ms)" />
                <Line yAxisId="throughput" type="monotone" dataKey="throughput" stroke="#48BB78" name="Throughput (TPS)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center text-slate-500 mt-8">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} DeepCAL Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default DeepCALDashboard;
