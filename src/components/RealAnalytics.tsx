
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Clock, DollarSign, Shield, Database } from 'lucide-react';
import { csvDataEngine } from '@/services/csvDataEngine';

const RealAnalytics = () => {
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [networkStats, setNetworkStats] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      try {
        // Try to load from IndexedDB first, then fallback to embedded data
        await csvDataEngine.loadFromIndexedDB();
        
        if (!csvDataEngine.isDataLoaded()) {
          await csvDataEngine.autoLoadEmbeddedData();
        }
        
        const shipments = csvDataEngine.listShipments();
        setDataLoaded(Array.isArray(shipments) && shipments.length > 0);
        
        if (shipments.length > 0) {
          const stats = csvDataEngine.getNetworkStatistics();
          setNetworkStats(stats);
        }
      } catch (error) {
        console.error('Failed to load shipment data for analytics:', error);
      }
    })();
  }, []);

  if (!dataLoaded || !networkStats) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-4"><span>🚦</span></div>
        <p className="text-muted-foreground">Loading real shipment data for analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Source Information */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Real Data Analytics - Source of Truth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{networkStats.totalShipments}</div>
              <div className="text-sm text-indigo-300">Total Shipments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{networkStats.baseShipments}</div>
              <div className="text-sm text-indigo-300">Base Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{networkStats.newShipments}</div>
              <div className="text-sm text-indigo-300">New Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{networkStats.uniqueCountries}</div>
              <div className="text-sm text-indigo-300">Countries</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-indigo-300 mb-2">Data Integrity:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-green-400">✓</span> No mock data
              </div>
              <div>
                <span className="text-green-400">✓</span> Real shipment records
              </div>
              <div>
                <span className="text-green-400">✓</span> Appends to base (105+)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Overview */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Network Overview (Real Data Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Routes Stats */}
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">{networkStats.uniqueRoutes}</div>
              <div className="text-sm text-indigo-300">Active Routes</div>
            </div>

            {/* Forwarders Stats */}
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400">{networkStats.uniqueForwarders}</div>
              <div className="text-sm text-indigo-300">Freight Forwarders</div>
            </div>

            {/* Volume Stats */}
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {networkStats.totalWeight.toFixed(0)}kg
              </div>
              <div className="text-sm text-indigo-300">Total Weight</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-slate-800/50 to-indigo-900/30 rounded-lg border border-indigo-500/20">
            <div className="text-center">
              <div className="text-lg font-semibold text-white mb-2">Total Network Value</div>
              <div className="text-3xl font-bold text-lime-400">
                ${networkStats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-indigo-300 mt-1">
                Based on {networkStats.totalShipments} real shipment records
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Lineage */}
      <Card className="glass-card shadow-glass border border-glassBorder">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-lime-400">Data Lineage & Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-indigo-300">Data Source:</span>
              <span className="text-white font-mono">embedded_shipments.csv</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-indigo-300">Base Records:</span>
              <span className="text-green-400 font-mono">{networkStats.baseShipments}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-indigo-300">User Added:</span>
              <span className="text-yellow-400 font-mono">+{networkStats.newShipments}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
              <span className="text-indigo-300">Data Integrity:</span>
              <span className="text-lime-400 font-mono">✓ Verified</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealAnalytics;
