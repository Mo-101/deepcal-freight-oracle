
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Globe, Truck, MapPin, Map } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { RouteBarChart } from './RouteBarChart';
import { SavingsTrendLine } from './SavingsTrendLine';
import { AlertTicker } from './AlertTicker';
import { csvDataEngine } from '@/services/csvDataEngine';
import type { ShipmentData } from '@/types/shipment';

export const TabsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shipments');
  const [shipmentData, setShipmentData] = useState<ShipmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await csvDataEngine.listShipments();
        setShipmentData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load shipment data:', error);
        setShipmentData([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate real metrics from shipment data
  const calculateMetrics = () => {
    if (!shipmentData.length) return {
      totalShipments: 0,
      avgCost: 0,
      totalWeight: 0,
      totalValue: 0,
      uniqueForwarders: 0,
      uniqueDestinations: 0,
      deliveredShipments: 0
    };

    const totalShipments = shipmentData.length;
    const totalCost = shipmentData.reduce((sum, s) => {
      const cost = s['carrier+cost'] || s.carrier_cost || 0;
      return sum + (typeof cost === 'string' ? parseFloat(cost.replace(/,/g, '')) : cost);
    }, 0);
    const avgCost = totalCost / totalShipments;
    const totalWeight = shipmentData.reduce((sum, s) => sum + (parseFloat(String(s.weight_kg || '0')) || 0), 0);
    const totalValue = shipmentData.reduce((sum, s) => {
      // Calculate estimated value based on weight and cost since there's no direct value field
      const weight = parseFloat(String(s.weight_kg || '0')) || 0;
      const cost = s['carrier+cost'] || s.carrier_cost || 0;
      const costNum = typeof cost === 'string' ? parseFloat(cost.replace(/,/g, '')) : cost;
      return sum + (weight * costNum * 0.1); // Estimated value multiplier
    }, 0);
    const uniqueForwarders = new Set(shipmentData.map(s => s.final_quote_awarded_freight_forwader_carrier).filter(Boolean)).size;
    const uniqueDestinations = new Set(shipmentData.map(s => s.destination_country).filter(Boolean)).size;
    const deliveredShipments = shipmentData.filter(s => s.delivery_status === 'Delivered').length;

    return {
      totalShipments,
      avgCost,
      totalWeight,
      totalValue,
      uniqueForwarders,
      uniqueDestinations,
      deliveredShipments
    };
  };

  const metrics = calculateMetrics();
  const deliveryRate = metrics.totalShipments > 0 ? (metrics.deliveredShipments / metrics.totalShipments) * 100 : 0;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="shipments" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Shipments</span>
          </TabsTrigger>
          <TabsTrigger value="destinations" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Destinations</span>
          </TabsTrigger>
          <TabsTrigger value="forwarders" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Forwarders</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Routes</span>
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Live Maps</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shipments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Total Shipments"
              value={metrics.totalShipments}
              unit=""
              icon={<span className="text-blue-400 text-xl">📦</span>}
              color="blue-400"
              previousValue={Math.max(0, metrics.totalShipments - 5)}
              isLoading={isLoading}
            />
            <KpiCard
              title="Average Cost"
              value={metrics.avgCost}
              unit="$"
              icon={<span className="text-green-400 text-xl">💰</span>}
              color="green-400"
              previousValue={metrics.avgCost * 0.95}
              isLoading={isLoading}
            />
            <KpiCard
              title="Total Weight"
              value={metrics.totalWeight / 1000}
              unit="T"
              icon={<span className="text-purple-400 text-xl">⚖️</span>}
              color="purple-400"
              previousValue={metrics.totalWeight / 1000 * 0.9}
              isLoading={isLoading}
            />
            <KpiCard
              title="Delivery Rate"
              value={deliveryRate}
              unit="%"
              icon={<span className="text-orange-400 text-xl">✅</span>}
              color="orange-400"
              previousValue={deliveryRate - 2}
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <RouteBarChart shipmentData={shipmentData} />
              <SavingsTrendLine shipmentData={shipmentData} />
            </div>
            <div className="space-y-6">
              <AlertTicker shipmentData={shipmentData} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard
              title="Active Destinations"
              value={metrics.uniqueDestinations}
              unit=""
              icon={<span className="text-cyan-400 text-xl">🌍</span>}
              color="cyan-400"
              previousValue={Math.max(0, metrics.uniqueDestinations - 1)}
              isLoading={isLoading}
            />
            <KpiCard
              title="Total Value"
              value={metrics.totalValue / 1000}
              unit="K$"
              icon={<span className="text-yellow-400 text-xl">💎</span>}
              color="yellow-400"
              previousValue={metrics.totalValue / 1000 * 0.85}
              isLoading={isLoading}
            />
            <KpiCard
              title="Avg Per Destination"
              value={metrics.uniqueDestinations > 0 ? metrics.totalShipments / metrics.uniqueDestinations : 0}
              unit=""
              icon={<span className="text-emerald-400 text-xl">📊</span>}
              color="emerald-400"
              previousValue={metrics.uniqueDestinations > 0 ? (metrics.totalShipments / metrics.uniqueDestinations) * 0.9 : 0}
              isLoading={isLoading}
            />
          </div>
          
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Globe className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Regional Analysis</h3>
            <p className="text-indigo-300">
              {isLoading ? 'Loading destination data...' : `${metrics.uniqueDestinations} destinations analyzed`}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="forwarders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Active Forwarders"
              value={metrics.uniqueForwarders}
              unit=""
              icon={<span className="text-blue-400 text-xl">🚛</span>}
              color="blue-400"
              previousValue={Math.max(0, metrics.uniqueForwarders - 1)}
              isLoading={isLoading}
            />
            <KpiCard
              title="Avg Shipments/Forwarder"
              value={metrics.uniqueForwarders > 0 ? metrics.totalShipments / metrics.uniqueForwarders : 0}
              unit=""
              icon={<span className="text-yellow-400 text-xl">📈</span>}
              color="yellow-400"
              previousValue={metrics.uniqueForwarders > 0 ? (metrics.totalShipments / metrics.uniqueForwarders) * 0.9 : 0}
              isLoading={isLoading}
            />
            <KpiCard
              title="Total Volume"
              value={metrics.totalWeight / 1000}
              unit="T"
              icon={<span className="text-green-400 text-xl">📦</span>}
              color="green-400"
              previousValue={metrics.totalWeight / 1000 * 0.92}
              isLoading={isLoading}
            />
            <KpiCard
              title="Avg Cost/Shipment"
              value={metrics.avgCost}
              unit="$"
              icon={<span className="text-purple-400 text-xl">💰</span>}
              color="purple-400"
              previousValue={metrics.avgCost * 1.05}
              isLoading={isLoading}
            />
          </div>

          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Truck className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Forwarder Performance</h3>
            <p className="text-indigo-300">
              {isLoading ? 'Loading forwarder data...' : `${metrics.uniqueForwarders} forwarders analyzed`}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <RouteBarChart shipmentData={shipmentData} />
          <SavingsTrendLine shipmentData={shipmentData} />
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Map className="w-16 h-16 mx-auto mb-4 text-lime-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Live Route Intelligence</h3>
            <p className="text-indigo-300">
              {isLoading ? 'Loading route data...' : `${metrics.totalShipments} shipments tracked`}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
