
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import type { ShipmentData } from '@/types/shipment';

interface AlertTickerProps {
  shipmentData: ShipmentData[];
}

export const AlertTicker: React.FC<AlertTickerProps> = ({ shipmentData }) => {
  // Generate real alerts from shipment data
  const generateAlerts = () => {
    if (!shipmentData || shipmentData.length === 0) return [];

    const alerts: Array<{
      id: string;
      type: 'warning' | 'success' | 'info';
      icon: React.ReactNode;
      message: string;
      timestamp: string;
    }> = [];

    // Calculate various metrics for alerts
    const pendingShipments = shipmentData.filter(s => s.delivery_status !== 'Delivered').length;
    const deliveredShipments = shipmentData.filter(s => s.delivery_status === 'Delivered').length;
    const totalCost = shipmentData.reduce((sum, s) => sum + (parseFloat(String(s.carrier_cost || '0').replace(/,/g, '')) || 0), 0);
    const avgCost = totalCost / shipmentData.length;
    const highValueShipments = shipmentData.filter(s => {
      const cost = parseFloat(String(s.carrier_cost || '0').replace(/,/g, '')) || 0;
      return cost > avgCost * 2;
    }).length;

    // Generate alerts based on data
    if (pendingShipments > 0) {
      alerts.push({
        id: 'pending',
        type: 'warning',
        icon: <Clock className="w-4 h-4" />,
        message: `${pendingShipments} shipments pending delivery`,
        timestamp: '2 min ago'
      });
    }

    if (deliveredShipments > 0) {
      alerts.push({
        id: 'delivered',
        type: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        message: `${deliveredShipments} shipments successfully delivered`,
        timestamp: '5 min ago'
      });
    }

    if (highValueShipments > 0) {
      alerts.push({
        id: 'high-value',
        type: 'info',
        icon: <TrendingUp className="w-4 h-4" />,
        message: `${highValueShipments} high-value shipments detected`,
        timestamp: '8 min ago'
      });
    }

    // Add emergency grade alerts
    const emergencyShipments = shipmentData.filter(s => 
      s['emergency grade'] && s['emergency grade'].includes('Grade')
    );
    
    if (emergencyShipments.length > 0) {
      alerts.push({
        id: 'emergency',
        type: 'warning',
        icon: <AlertTriangle className="w-4 h-4" />,
        message: `${emergencyShipments.length} emergency grade shipments in system`,
        timestamp: '12 min ago'
      });
    }

    return alerts.slice(0, 6); // Limit to 6 alerts
  };

  const alerts = generateAlerts();

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-400 bg-yellow-900/20 text-yellow-300';
      case 'success':
        return 'border-l-green-400 bg-green-900/20 text-green-300';
      case 'info':
        return 'border-l-blue-400 bg-blue-900/20 text-blue-300';
      default:
        return 'border-l-gray-400 bg-gray-900/20 text-gray-300';
    }
  };

  return (
    <Card className="glass-card shadow-glass border border-glassBorder">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
          🔔 Live System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${getAlertStyles(alert.type)} animate-slide-in`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{alert.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-indigo-300">
            No alerts at this time
          </div>
        )}
      </CardContent>
    </Card>
  );
};
