
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Globe,
  Users,
  Package,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export function AnalyticsExtendedPanel() {
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    costSavings: 23.5,
    timeReduction: 18.3,
    reliabilityScore: 94.7,
    activeShipments: 142,
    totalRoutes: 1247,
    satisfaction: 96.2
  });

  const [alerts] = useState([
    { id: 1, type: 'success', message: 'Route optimization completed', time: '2m ago' },
    { id: 2, type: 'warning', message: 'High demand detected on Route A', time: '5m ago' },
    { id: 3, type: 'info', message: 'New synthetic data available', time: '12m ago' }
  ]);

  const [topRoutes] = useState([
    { route: 'SIN → LAX', score: 0.94, savings: '$2.4K' },
    { route: 'FRA → JFK', score: 0.91, savings: '$1.8K' },
    { route: 'NRT → SFO', score: 0.89, savings: '$2.1K' },
    { route: 'LHR → ORD', score: 0.87, savings: '$1.5K' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        costSavings: Math.max(20, Math.min(30, prev.costSavings + (Math.random() - 0.5) * 2)),
        timeReduction: Math.max(15, Math.min(25, prev.timeReduction + (Math.random() - 0.5) * 1.5)),
        reliabilityScore: Math.max(90, Math.min(98, prev.reliabilityScore + (Math.random() - 0.5) * 1)),
        activeShipments: Math.max(100, Math.min(200, prev.activeShipments + Math.floor((Math.random() - 0.5) * 10))),
        totalRoutes: prev.totalRoutes + Math.floor(Math.random() * 3),
        satisfaction: Math.max(93, Math.min(99, prev.satisfaction + (Math.random() - 0.5) * 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Live KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-green-400 font-mono text-xl">{realtimeMetrics.costSavings.toFixed(1)}%</div>
              <div className="text-indigo-300 text-xs">Cost Savings</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-blue-400 font-mono text-xl">{realtimeMetrics.timeReduction.toFixed(1)}%</div>
              <div className="text-indigo-300 text-xs">Time Reduction</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-purple-400 font-mono text-xl">{realtimeMetrics.reliabilityScore.toFixed(1)}%</div>
              <div className="text-indigo-300 text-xs">Reliability</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-orange-400 font-mono text-xl">{realtimeMetrics.satisfaction.toFixed(1)}%</div>
              <div className="text-indigo-300 text-xs">Satisfaction</div>
            </div>
          </div>
          
          <div className="pt-4 space-y-3 border-t border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-300">Active Shipments:</span>
              <span className="text-lime-400 font-mono">{realtimeMetrics.activeShipments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-indigo-300">Total Routes:</span>
              <span className="text-lime-400 font-mono">{realtimeMetrics.totalRoutes}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Routes */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top Routes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topRoutes.map((route, index) => (
            <div key={index} className="p-3 bg-slate-800/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">{route.route}</span>
                <Badge className="bg-lime-400/20 text-lime-400">
                  {route.savings}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-indigo-300 text-sm">Score: {route.score}</span>
                <Progress value={route.score * 100} className="w-16 h-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
              {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />}
              {alert.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />}
              {alert.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />}
              
              <div className="flex-1">
                <p className="text-white text-sm">{alert.message}</p>
                <p className="text-indigo-300 text-xs mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
