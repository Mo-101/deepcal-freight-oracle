
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  message: string;
  timestamp: string;
  route?: string;
}

const initialAlerts: Alert[] = [
  { id: '1', type: 'success', message: 'Route SIN → LAX optimization completed - 12% cost reduction', timestamp: '2m ago', route: 'SIN → LAX' },
  { id: '2', type: 'warning', message: 'High demand detected on DXB → JFK route - consider alternate forwarders', timestamp: '5m ago', route: 'DXB → JFK' },
  { id: '3', type: 'info', message: 'New synthetic training data generated - 847 samples added', timestamp: '12m ago' },
  { id: '4', type: 'error', message: 'Delay alert: NRT → LAX shipment SR_24-089 experiencing customs hold', timestamp: '18m ago', route: 'NRT → LAX' },
  { id: '5', type: 'success', message: 'Freight In Time reliability score updated: 94.7%', timestamp: '25m ago' },
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
    case 'info': return <Info className="w-4 h-4 text-blue-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

export const AlertTicker: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [newAlertIndex, setNewAlertIndex] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)] as Alert['type'],
        message: `Live update: Route analysis completed for ${['FRA → NYC', 'LHR → SIN', 'DXB → LAX'][Math.floor(Math.random() * 3)]}`,
        timestamp: 'now',
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      setNewAlertIndex(0);
      
      setTimeout(() => setNewAlertIndex(-1), 1000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          🚨 Live System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div 
              key={alert.id} 
              className={`flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg transition-all duration-500 ${
                index === newAlertIndex ? 'animate-pulse border border-lime-400/50' : ''
              }`}
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <p className="text-white text-sm leading-relaxed">{alert.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-indigo-300 text-xs">{alert.timestamp}</p>
                  {alert.route && (
                    <span className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-1 rounded">
                      {alert.route}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
