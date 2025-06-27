
import React, { useEffect, useState } from 'react';
import ModalPreferenceMatrix from './ModalPreferenceMatrix';
import VoiceJustification from '../voice/VoiceJustification';
import { useRealTimeFreightData, useRealTimeMarketData } from '@/hooks/useRealTimeInputAdapter';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface FreightIntelligenceDashboardProps {
  cargoType: string;
  weight: number;
  volume: number;
  origin: string;
  destination: string;
  urgency: number;
  budgetConstraint: number;
  emissionSensitivity: number;
  reliabilityRequired: number;
  temperatureRequired: boolean;
  realTimeUrl?: string;
  marketDataUrl?: string;
}

const FreightIntelligenceDashboard: React.FC<FreightIntelligenceDashboardProps> = ({
  cargoType,
  weight,
  volume,
  origin,
  destination,
  urgency,
  budgetConstraint,
  emissionSensitivity,
  reliabilityRequired,
  temperatureRequired,
  realTimeUrl,
  marketDataUrl
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [selectedForwarder, setSelectedForwarder] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [distanceKm, setDistanceKm] = useState<number>(0);

  // Real-time data connections
  const freightData = useRealTimeFreightData(realTimeUrl);
  const marketData = useRealTimeMarketData(marketDataUrl);

  // Calculate distance between origin and destination (simplified)
  useEffect(() => {
    // In a real implementation, this would call a geocoding/distance API
    const calculateDistance = () => {
      // Mock distance calculation based on known routes
      const routeDistances: Record<string, number> = {
        'nairobi-hamburg': 6100,
        'lagos-london': 5000,
        'accra-new york': 5800,
        'addis ababa-dubai': 2400
      };
      
      const routeKey = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
      return routeDistances[routeKey] || 3000; // Default distance
    };

    setDistanceKm(calculateDistance());
  }, [origin, destination]);

  // Generate voice justification data
  const generateVoiceDecision = () => {
    if (!analysisResults) return null;

    return {
      selectedMode,
      selectedForwarder,
      confidence: analysisResults.confidence || 0.8,
      symbolicReasons: [
        `Optimal for ${cargoType} cargo`,
        `${urgency > 0.7 ? 'High urgency' : 'Standard urgency'} requirement met`,
        `Distance ${distanceKm}km efficiently handled`,
        `Environmental sensitivity ${(emissionSensitivity * 100).toFixed(0)}% addressed`
      ],
      ethicalScore: 0.75,
      neutrosophicTruth: 0.85,
      riskLevel: urgency > 0.8 ? 0.3 : 0.5,
      costEfficiency: 1 - budgetConstraint
    };
  };

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    if (results.bestMode) {
      setSelectedMode(results.bestMode);
    }
  };

  const refreshData = () => {
    freightData.connect();
    marketData.connect();
  };

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          🧠 DeepCAL Freight Intelligence
          <span className="ml-2 text-sm text-slate-400">
            Live Symbolic Analysis
          </span>
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {freightData.isConnected ? (
              <><Wifi className="w-4 h-4 text-green-400" /> Live Data</>
            ) : (
              <><WifiOff className="w-4 h-4 text-red-400" /> Offline</>
            )}
          </div>
          
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="border-blue-400/50 text-blue-300 hover:bg-blue-900/30"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time data status */}
      {(freightData.lastUpdate || marketData.lastUpdate) && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Freight Data:</span>
              <span className="ml-2 text-green-300">
                {freightData.lastUpdate ? 
                  `Updated ${freightData.lastUpdate.toLocaleTimeString()}` : 
                  'No data'
                }
              </span>
            </div>
            <div>
              <span className="text-slate-400">Market Data:</span>
              <span className="ml-2 text-blue-300">
                {marketData.lastUpdate ? 
                  `Updated ${marketData.lastUpdate.toLocaleTimeString()}` : 
                  'No data'
                }
              </span>
            </div>
            <div>
              <span className="text-slate-400">Data Freshness:</span>
              <span className={`ml-2 ${
                freightData.isDataFresh() ? 'text-green-300' : 'text-yellow-300'
              }`}>
                {freightData.isDataFresh() ? 'Fresh' : 'Stale'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preference Matrix */}
      <ModalPreferenceMatrix
        cargoType={cargoType}
        weight={weight}
        volume={volume}
        distanceKm={distanceKm}
        urgency={urgency}
        emissionSensitivity={emissionSensitivity}
        temperatureRequired={temperatureRequired}
        budgetConstraint={budgetConstraint}
        reliabilityRequired={reliabilityRequired}
      />

      {/* Voice Justification */}
      {selectedMode && (
        <VoiceJustification
          decision={generateVoiceDecision()!}
          autoPlay={true}
        />
      )}

      {/* Live Market Context */}
      {marketData.data?.market && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/30">
          <h4 className="text-lg font-semibold text-purple-300 mb-3">
            📈 Live Market Context
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Fuel Costs:</span>
              <span className="ml-2 text-yellow-300">
                ${marketData.data.market.fuel_costs?.toFixed(2) || 'N/A'}
              </span>
            </div>
            {marketData.data.market.port_congestion && Object.entries(marketData.data.market.port_congestion).map(([port, level]) => (
              <div key={port}>
                <span className="text-slate-400">{port} Port:</span>
                <span className={`ml-2 ${
                  (level as number) > 0.7 ? 'text-red-300' : 
                  (level as number) > 0.4 ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  {((level as number) * 100).toFixed(0)}% congested
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 text-xs">
          <details>
            <summary className="text-slate-400 cursor-pointer">Debug Info</summary>
            <pre className="text-slate-300 mt-2 overflow-auto">
              {JSON.stringify({
                freightConnected: freightData.isConnected,
                marketConnected: marketData.isConnected,
                selectedMode,
                analysisResults,
                realTimeData: {
                  freight: !!freightData.data?.freight,
                  market: !!marketData.data?.market
                }
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default FreightIntelligenceDashboard;
