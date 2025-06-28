import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';
import { csvDataEngine } from '@/services/csvDataEngine';

const RealAnalytics = () => {
  const [dataLoaded, setDataLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const shipments = await csvDataEngine.listShipments();
      setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
    })();
  }, []);

  if (!dataLoaded) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-4"><span>🚦</span></div>
        <p className="text-muted-foreground">Shipment record loading complete. Analytics will be enabled once engine is connected.</p>
      </div>
    );
  }

  // No analytics—no scoring available in loader. Remove analytics KPIs and forwarder visualizations.
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-4"><span>🚦</span></div>
        <p className="text-muted-foreground">Shipment record loading complete. Analytics will be enabled once engine is connected.</p>
      </div>
    </div>
  );
};

export default RealAnalytics;
