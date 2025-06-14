
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';
import { csvDataEngine } from '@/services/csvDataEngine';

const RealAnalytics = () => {
  const isDataLoaded = csvDataEngine.isDataLoaded();
  
  if (!isDataLoaded) {
    return (
      <div className="text-center py-8">
        <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
        <p className="text-muted-foreground">Load CSV data to view real analytics</p>
      </div>
    );
  }

  const analytics = csvDataEngine.getAnalytics();
  const forwarderKPIs = csvDataEngine.calculateForwarderKPIs();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transit Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{analytics.avgTransitTime} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per KG</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">${analytics.costPerKg}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reliability Index</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{analytics.reliabilityIndex}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk/Disruption</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{analytics.riskDisruption}</div>
          </CardContent>
        </Card>
      </div>

      {/* Forwarder Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Forwarder Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forwarderKPIs.slice(0, 6).map((forwarder) => (
              <div key={forwarder.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                    #{forwarder.rank}
                  </div>
                  <div>
                    <div className="font-semibold">{forwarder.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {forwarder.totalShipments} shipments
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${forwarder.costPerKg.toFixed(2)}/kg</div>
                  <div className="text-sm text-green-600">
                    {(forwarder.onTimeRate * 100).toFixed(0)}% on-time
                  </div>
                  <div className="text-sm text-blue-600">
                    {forwarder.avgTransitDays.toFixed(1)} days avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealAnalytics;
