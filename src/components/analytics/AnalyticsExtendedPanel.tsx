import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Globe
} from 'lucide-react';

export function AnalyticsExtendedPanel() {
  const [metrics, setMetrics] = useState({
    totalSavings: 847250,
    avgDeliveryTime: 4.2,
    reliabilityScore: 94.8,
    riskLevel: 'Low',
    activeRoutes: 127,
    monthlyGrowth: 12.5
  });

  const [alerts] = useState([
    {
      id: '1',
      type: 'warning',
      message: 'High fuel costs detected on Asia-Pacific routes',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'success',
      message: 'New cost optimization opportunity identified',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'info',
      message: 'Weekly analytics report generated',
      timestamp: '1 day ago'
    }
  ]);

  const [recentActivity] = useState([
    {
      id: '1',
      action: 'Route optimization completed',
      route: 'LAX → NRT',
      savings: '$12,450',
      timestamp: '15 min ago'
    },
    {
      id: '2',
      action: 'New forwarder analysis',
      route: 'FRA → SIN',
      savings: '$8,200',
      timestamp: '32 min ago'
    },
    {
      id: '3',
      action: 'Risk assessment updated',
      route: 'JFK → LHR',
      savings: '$5,670',
      timestamp: '1 hour ago'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalSavings: prev.totalSavings + Math.floor(Math.random() * 1000),
        avgDeliveryTime: Math.max(3.5, prev.avgDeliveryTime + (Math.random() - 0.5) * 0.1),
        reliabilityScore: Math.min(99.9, Math.max(90, prev.reliabilityScore + (Math.random() - 0.5) * 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Summary */}
      <Card className="bg-white/10 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-lime-400" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-indigo-200">Total Savings</span>
              </div>
              <div className="text-lg font-bold text-green-400">
                ${metrics.totalSavings.toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-indigo-200">Avg Delivery</span>
              </div>
              <div className="text-lg font-bold text-blue-400">
                {metrics.avgDeliveryTime.toFixed(1)} days
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-indigo-200">Reliability</span>
              </div>
              <div className="text-lg font-bold text-purple-400">
                {metrics.reliabilityScore.toFixed(1)}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-indigo-200">Active Routes</span>
              </div>
              <div className="text-lg font-bold text-cyan-400">
                {metrics.activeRoutes}
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-200">Monthly Growth</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  +{metrics.monthlyGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
            <Progress value={metrics.monthlyGrowth * 5} className="h-1 mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="bg-white/10 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-2 p-2 rounded bg-white/5">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{alert.message}</p>
                <p className="text-xs text-indigo-300 mt-1">{alert.timestamp}</p>
              </div>
              <Badge variant="secondary" className={getAlertColor(alert.type)}>
                {alert.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/10 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-lime-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="space-y-1 p-2 rounded bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white">
                  {activity.action}
                </span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  {activity.savings}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-200">{activity.route}</span>
                <span className="text-indigo-300">{activity.timestamp}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Indicator */}
      <Card className="bg-white/10 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-lime-400" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-200">System Health</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Excellent
              </Badge>
            </div>
            <Progress value={95} className="h-2" />
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-indigo-200">Uptime</div>
                <div className="font-medium text-green-400">99.9%</div>
              </div>
              <div className="text-center">
                <div className="text-indigo-200">Response</div>
                <div className="font-medium text-blue-400">120ms</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}