import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  MapPin, 
  Package, 
  Clock, 
  DollarSign, 
  Globe,
  BarChart3,
  Target,
  Database
} from 'lucide-react';
import { OracleResults, ShipmentData, CalculatorInputs } from '@/types/shipment';
import { csvDataEngine, ShipmentRecord } from '@/services/csvDataEngine';
import OracleTypingDisplay from '@/components/oracle/OracleTypingDisplay';
import ConfidenceMeter from '@/components/oracle/ConfidenceMeter';
import LiveIntelligenceBanner from '@/components/oracle/LiveIntelligenceBanner';

interface OracleResultsPanelProps {
  showOutput: boolean;
  outputAnimation: boolean;
  results: OracleResults | null;
  selectedShipment: ShipmentData | null;
  anomalyMap: any;
  inputs: CalculatorInputs;
}

interface HistoricalStats {
  totalShipments: number;
  routeShipments: number;
  destinationShipments: number;
  originShipments: number;
  countriesFromOrigin: number;
  routeForwarders: number;
  routeTotalWeight: number;
  routeTotalCost: number;
  avgCostPerKg: number;
  mostUsedForwarder: string;
  deliverySuccessRate: number;
  selectedRoute: string;
  selectedCategory: string;
  selectedWeight: number;
  selectedVolume: number;
}

const OracleResultsPanel: React.FC<OracleResultsPanelProps> = ({
  showOutput,
  outputAnimation,
  results,
  selectedShipment,
  anomalyMap,
  inputs
}) => {
  const [historicalStats, setHistoricalStats] = useState<HistoricalStats | null>(null);

  // Calculate historical statistics based on the selected shipment and current data
  useEffect(() => {
    const getHistoricalStats = async () => {
      if (!selectedShipment) return null;

      const allShipments = await csvDataEngine.listShipments();
      
      // Get shipments for the same origin-destination route
      const routeShipments = allShipments.filter(s => 
        s.origin_country === selectedShipment.origin_country &&
        s.destination_country === selectedShipment.destination_country
      );

      // Get all shipments to the destination country
      const destinationShipments = allShipments.filter(s => 
        s.destination_country === selectedShipment.destination_country
      );

      // Get shipments from the origin country
      const originShipments = allShipments.filter(s => 
        s.origin_country === selectedShipment.origin_country
      );

      // Get unique countries served from origin
      const countriesFromOrigin = new Set(
        originShipments.map(s => s.destination_country).filter(Boolean)
      );

      // Get unique forwarders used for this route
      const routeForwarders = new Set(
        routeShipments.map(s => s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded).filter(Boolean)
      );

      // Calculate route performance metrics
      const routeTotalWeight = routeShipments.reduce((sum, s) => sum + (Number(s.weight_kg) || 0), 0);
      const routeTotalCost = routeShipments.reduce((sum, s) => sum + (Number(s['carrier+cost']) || 0), 0);
      const avgCostPerKg = routeTotalWeight > 0 ? routeTotalCost / routeTotalWeight : 0;

      // Get most used forwarder for this route
      const forwarderUsage = routeShipments.reduce((acc, s) => {
        const forwarder = s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded;
        if (forwarder) {
          acc[forwarder] = (acc[forwarder] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const mostUsedForwarder = Object.entries(forwarderUsage)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

      // Calculate delivery success rate
      const deliveredShipments = routeShipments.filter(s => s.delivery_status === 'Delivered').length;
      const deliverySuccessRate = routeShipments.length > 0 ? (deliveredShipments / routeShipments.length) * 100 : 0;

      return {
        totalShipments: allShipments.length,
        routeShipments: routeShipments.length,
        destinationShipments: destinationShipments.length,
        originShipments: originShipments.length,
        countriesFromOrigin: countriesFromOrigin.size,
        routeForwarders: routeForwarders.size,
        routeTotalWeight,
        routeTotalCost,
        avgCostPerKg,
        mostUsedForwarder,
        deliverySuccessRate,
        selectedRoute: `${selectedShipment.origin_country} → ${selectedShipment.destination_country}`,
        selectedCategory: selectedShipment.item_category || 'Unknown',
        selectedWeight: Number(selectedShipment.weight_kg) || 0,
        selectedVolume: Number(selectedShipment.volume_cbm) || 0
      };
    };

    getHistoricalStats().then(setHistoricalStats);
  }, [selectedShipment]);

  return (
    <div className="space-y-6">
      {/* Live Intelligence Banner - Always visible */}
      <LiveIntelligenceBanner />

      {/* Oracle Typing Display */}
      <OracleTypingDisplay
        isActive={showOutput}
        shipmentCount={historicalStats?.totalShipments}
        bestForwarder={results?.bestForwarder}
        routeScore={results?.routeScore}
      />

      {/* Enhanced Results Display */}
      {showOutput && results && (
        <div className={`space-y-6 transition-all duration-500 ${outputAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Historical Statistics Panel */}
          {historicalStats && (
            <Card className="p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-amber-400">Historical Data Intelligence</h3>
                <Badge variant="outline" className="ml-auto border-amber-500 text-amber-400">
                  Live Analysis
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{historicalStats.totalShipments}</div>
                  <div className="text-xs text-slate-400">Total Shipments</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{historicalStats.routeShipments}</div>
                  <div className="text-xs text-slate-400">Same Route</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{historicalStats.destinationShipments}</div>
                  <div className="text-xs text-slate-400">To Destination</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{historicalStats.countriesFromOrigin}</div>
                  <div className="text-xs text-slate-400">Countries Served</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Selected Route</span>
                  </div>
                  <div className="text-sm font-medium text-white">{historicalStats.selectedRoute}</div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">{historicalStats.selectedCategory}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Route Performance</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Delivery Success</span>
                      <span className="text-green-400">{historicalStats.deliverySuccessRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={historicalStats.deliverySuccessRate} className="h-2" />
                  </div>
                  <div className="text-xs text-slate-400">
                    {historicalStats.routeForwarders} forwarders used
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Cost Intelligence</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-green-400">
                      ${historicalStats.avgCostPerKg.toFixed(2)}/kg
                    </div>
                    <div className="text-xs text-slate-400">Average route cost</div>
                    <div className="text-xs text-amber-400">
                      Preferred: {historicalStats.mostUsedForwarder}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Enhanced Main Results Display */}
          <Card className="p-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-purple-400">🏆 Best Forwarder</h3>
              <Badge variant="outline" className="ml-auto border-purple-500 text-purple-400">
                {results.seal}
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{results.bestForwarder}</h2>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <ConfidenceMeter 
                  score={results.routeScore} 
                  label="Route Optimization Score"
                  showDetails={true}
                />
              </div>
            </div>

            <Separator className="bg-slate-600 mb-6" />

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Oracle Analysis</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{results.oracleNarrative}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Recommendation</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{results.recommendation}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Methodology</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{results.methodology}</p>
              </div>
            </div>

            {/* Forwarder Comparison Table */}
            {results.forwarderComparison && results.forwarderComparison.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Forwarder Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-slate-600">
                        <th className="pb-2 text-slate-400">Rank</th>
                        <th className="pb-2 text-slate-400">Forwarder</th>
                        <th className="pb-2 text-slate-400">Cost/kg</th>
                        <th className="pb-2 text-slate-400">Transit Days</th>
                        <th className="pb-2 text-slate-400">On-Time Rate</th>
                        <th className="pb-2 text-slate-400">TOPSIS Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.forwarderComparison.map((forwarder, index) => (
                        <tr 
                          key={forwarder.name} 
                          className={`border-b border-slate-700 ${
                            index === 0 ? 'bg-gradient-to-r from-purple-900/30 to-cyan-900/30' : ''
                          }`}
                        >
                          <td className="py-2">
                            <Badge 
                              variant={index === 0 ? 'default' : 'secondary'}
                              className={index === 0 ? 'bg-amber-600' : ''}
                            >
                              #{forwarder.rank}
                            </Badge>
                          </td>
                          <td className="py-2 font-medium text-white">{forwarder.name}</td>
                          <td className="py-2 text-slate-300">${forwarder.costPerKg.toFixed(2)}</td>
                          <td className="py-2 text-slate-300">{forwarder.avgTransitDays}</td>
                          <td className="py-2 text-slate-300">{forwarder.onTimeRate.toFixed(1)}%</td>
                          <td className="py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-cyan-400">
                                {forwarder.topsisScore.toFixed(3)}
                              </span>
                              {anomalyMap[forwarder.name] && (
                                <Badge variant="destructive" className="text-xs">
                                  Anomaly
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-600">
              <div className="text-xs text-slate-500">
                Analysis: {results.qseal} • {new Date(results.timestamp).toLocaleDateString()}
              </div>
              <div className="text-xs text-slate-500">
                {results.blessing}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OracleResultsPanel;
