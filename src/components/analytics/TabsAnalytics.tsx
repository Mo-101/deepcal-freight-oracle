
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Globe, Truck, MapPin, Map } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { RouteBarChart } from './RouteBarChart';
import { SavingsTrendLine } from './SavingsTrendLine';
import { AlertTicker } from './AlertTicker';
import { AnalyticsExtendedPanel } from './AnalyticsExtendedPanel';

export const TabsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shipments');

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
              title="Cost Savings"
              value={23.5}
              unit="%"
              icon={<span className="text-green-400 text-xl">💰</span>}
              color="green-400"
              previousValue={21.2}
            />
            <KpiCard
              title="Time Reduction"
              value={18.3}
              unit="%"
              icon={<span className="text-blue-400 text-xl">⏱️</span>}
              color="blue-400"
              previousValue={16.8}
            />
            <KpiCard
              title="Reliability Score"
              value={94.7}
              unit="%"
              icon={<span className="text-purple-400 text-xl">🎯</span>}
              color="purple-400"
              previousValue={92.1}
            />
            <KpiCard
              title="Customer Satisfaction"
              value={96.2}
              unit="%"
              icon={<span className="text-orange-400 text-xl">😊</span>}
              color="orange-400"
              previousValue={95.8}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <RouteBarChart />
              <SavingsTrendLine />
            </div>
            <div className="space-y-6">
              <AlertTicker />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard
              title="Active Regions"
              value={12}
              unit=""
              icon={<span className="text-cyan-400 text-xl">🌍</span>}
              color="cyan-400"
              previousValue={11}
            />
            <KpiCard
              title="High-Risk Routes"
              value={3}
              unit=""
              icon={<span className="text-red-400 text-xl">⚠️</span>}
              color="red-400"
              previousValue={4}
            />
            <KpiCard
              title="Regional Efficiency"
              value={87.4}
              unit="%"
              icon={<span className="text-emerald-400 text-xl">📊</span>}
              color="emerald-400"
              previousValue={85.2}
            />
          </div>
          
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Globe className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Regional Heatmap</h3>
            <p className="text-indigo-300">Interactive destination analytics coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="forwarders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Active Forwarders"
              value={9}
              unit=""
              icon={<span className="text-blue-400 text-xl">🚛</span>}
              color="blue-400"
              previousValue={8}
            />
            <KpiCard
              title="Top Performer Score"
              value={94.7}
              unit="%"
              icon={<span className="text-yellow-400 text-xl">🏆</span>}
              color="yellow-400"
              previousValue={92.3}
            />
            <KpiCard
              title="Avg Response Time"
              value={2.4}
              unit="h"
              icon={<span className="text-green-400 text-xl">⚡</span>}
              color="green-400"
              previousValue={2.8}
            />
            <KpiCard
              title="Partnership Score"
              value={88.9}
              unit="%"
              icon={<span className="text-purple-400 text-xl">🤝</span>}
              color="purple-400"
              previousValue={87.1}
            />
          </div>

          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Truck className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Forwarder Scorecards</h3>
            <p className="text-indigo-300">Detailed forwarder analytics and rankings</p>
          </div>
        </TabsContent>

        <TabsContent value="routes" className="space-y-6">
          <RouteBarChart />
          <SavingsTrendLine />
        </TabsContent>

        <TabsContent value="maps" className="space-y-6">
          <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
            <Map className="w-16 h-16 mx-auto mb-4 text-lime-400" />
            <h3 className="text-xl font-semibold text-white mb-2">Live Route Intelligence</h3>
            <p className="text-indigo-300">Real-time shipment tracking and route optimization maps</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
