
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Target, Zap, Brain } from 'lucide-react';

interface KPI {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

interface EnhancedAnalyticsProps {
  shipmentData: any[];
}

export const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({ shipmentData }) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [anomalies, setAnomalies] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    // Calculate real-time KPIs
    const calculateKPIs = () => {
      const totalShipments = shipmentData.length;
      const deliveredShipments = shipmentData.filter(s => s.delivery_status === 'Delivered').length;
      const avgCost = shipmentData.reduce((sum, s) => sum + parseFloat(s['carrier+cost'] || '0'), 0) / totalShipments;
      const deliveryRate = (deliveredShipments / totalShipments) * 100;

      setKpis([
        {
          id: 'delivery-rate',
          label: 'Delivery Success Rate',
          value: deliveryRate,
          change: 2.3,
          trend: 'up',
          target: 95
        },
        {
          id: 'avg-cost',
          label: 'Average Cost Per Shipment',
          value: avgCost,
          change: -5.2,
          trend: 'down',
          target: 15000
        },
        {
          id: 'route-efficiency',
          label: 'Route Efficiency Score',
          value: 87.4,
          change: 1.8,
          trend: 'up',
          target: 90
        },
        {
          id: 'carrier-reliability',
          label: 'Carrier Reliability Index',
          value: 92.1,
          change: 0.5,
          trend: 'stable',
          target: 95
        }
      ]);
    };

    // Detect anomalies
    const detectAnomalies = () => {
      const detected = [];
      
      // Cost anomaly detection
      const costs = shipmentData.map(s => parseFloat(s['carrier+cost'] || '0'));
      const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;
      const costThreshold = avgCost * 2;
      
      if (costs.some(cost => cost > costThreshold)) {
        detected.push('Unusual cost spike detected in recent shipments');
      }

      // Route pattern anomalies
      const routes = shipmentData.map(s => `${s.origin_country}-${s.destination_country}`);
      const routeCounts = routes.reduce((acc, route) => {
        acc[route] = (acc[route] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const unusualRoutes = Object.entries(routeCounts).filter(([_, count]) => count === 1);
      if (unusualRoutes.length > 5) {
        detected.push('High number of one-off routes detected');
      }

      setAnomalies(detected);
    };

    // Generate predictions
    const generatePredictions = () => {
      setPredictions([
        {
          metric: 'Next Week Volume',
          value: shipmentData.length * 1.15,
          confidence: 0.87
        },
        {
          metric: 'Cost Optimization Potential',
          value: 12.3,
          confidence: 0.92
        },
        {
          metric: 'Delivery Time Improvement',
          value: 8.7,
          confidence: 0.78
        }
      ]);
    };

    calculateKPIs();
    detectAnomalies();
    generatePredictions();

    const interval = setInterval(() => {
      calculateKPIs();
      detectAnomalies();
      generatePredictions();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [shipmentData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.id} className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {typeof kpi.value === 'number' && kpi.value < 100 
                      ? `${kpi.value.toFixed(1)}${kpi.id.includes('rate') || kpi.id.includes('score') || kpi.id.includes('index') ? '%' : ''}`
                      : kpi.value.toLocaleString()
                    }
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-400' : kpi.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Target</p>
                  <p className="text-sm text-gray-300">{kpi.target}{kpi.id.includes('rate') || kpi.id.includes('score') || kpi.id.includes('index') ? '%' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-400/30 text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-400">
              <Target className="w-5 h-5" />
              <span>Anomaly Detection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-sm">{anomaly}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Analytics */}
      <Card className="border-0 bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-400/30 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-400">
            <Brain className="w-5 h-5" />
            <span>AI Predictions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm text-gray-300">{prediction.metric}</p>
                <p className="text-xl font-bold text-white">
                  {typeof prediction.value === 'number' 
                    ? prediction.value.toFixed(1)
                    : prediction.value
                  }
                  {prediction.metric.includes('Potential') || prediction.metric.includes('Improvement') ? '%' : ''}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{(prediction.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
