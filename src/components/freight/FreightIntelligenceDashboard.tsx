import React, { useEffect, useState } from 'react';
import ModalPreferenceMatrix from './ModalPreferenceMatrix';
import VoiceJustification from '../voice/VoiceJustification';
import SymbolicTOPSISMatrix from './SymbolicTOPSISMatrix';
import DisruptionHeatmap from './DisruptionHeatmap';
import GreyLogicDisplay from './GreyLogicDisplay';
import RuleAuditPanel from './RuleAuditPanel';
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

  // Generate mock data for symbolic intelligence components
  const generateSymbolicData = () => {
    // Mock TOPSIS data
    const topsisScores = [
      {
        name: 'Kuehne+Nagel',
        score: 0.8547,
        rank: 1,
        criteria: { cost: 0.75, time: 0.90, reliability: 0.95, risk: 0.20 }
      },
      {
        name: 'DHL Global',
        score: 0.7823,
        rank: 2,
        criteria: { cost: 0.65, time: 0.85, reliability: 0.88, risk: 0.25 }
      },
      {
        name: 'Scan Global',
        score: 0.6891,
        rank: 3,
        criteria: { cost: 0.80, time: 0.70, reliability: 0.82, risk: 0.30 }
      }
    ];

    const topsisWeights = {
      cost: budgetConstraint,
      time: urgency,
      reliability: reliabilityRequired,
      risk: 1 - (budgetConstraint + urgency + reliabilityRequired) / 3
    };

    // Mock corridor data
    const corridors = [
      {
        name: 'East Africa - Europe Corridor',
        origin,
        destination,
        riskLevel: urgency > 0.7 ? 8 : 4,
        status: 'open' as const,
        notes: 'Standard maritime route with seasonal weather considerations',
        factors: ['Weather', 'Port Congestion', 'Fuel Costs']
      },
      {
        name: 'Alternative Air Route',
        origin,
        destination,
        riskLevel: urgency > 0.5 ? 3 : 6,
        status: 'congested' as const,
        notes: 'Higher cost but faster delivery option',
        factors: ['High Demand', 'Limited Capacity']
      }
    ];

    // Mock grey inferences
    const greyInferences = weight < 100 || !cargoType ? [
      {
        field: 'Transit Time',
        originalValue: null,
        estimatedValue: `${Math.ceil(distanceKm / 500)} days`,
        confidence: 0.75,
        source: 'Historical route data',
        method: 'fusion' as const,
        reasoning: 'Calculated from distance and average speed patterns'
      },
      {
        field: 'Handling Requirements',
        originalValue: cargoType || 'Unknown',
        estimatedValue: 'Standard handling',
        confidence: 0.60,
        source: 'Cargo category inference',
        method: 'exponential' as const,
        reasoning: 'Inferred from weight and volume characteristics'
      }
    ] : [];

    // Mock rule audit
    const rules = [
      {
        id: 'R001',
        text: 'High urgency shipments require air transport when distance > 3000km',
        category: 'Transport Mode',
        values: { truth: 0.85, indeterminacy: 0.10, falsity: 0.05 },
        applied: urgency > 0.7 && distanceKm > 3000,
        weight: 0.25,
        rejectionReason: urgency <= 0.7 ? 'Urgency threshold not met' : undefined
      },
      {
        id: 'R002',
        text: 'Temperature-controlled cargo requires specialized handling',
        category: 'Cargo Handling',
        values: { truth: 0.95, indeterminacy: 0.03, falsity: 0.02 },
        applied: temperatureRequired,
        weight: 0.20,
        rejectionReason: !temperatureRequired ? 'Temperature control not required' : undefined
      },
      {
        id: 'R003',
        text: 'High emission sensitivity favors sea freight over air',
        category: 'Environmental',
        values: { truth: 0.80, indeterminacy: 0.15, falsity: 0.05 },
        applied: emissionSensitivity > 0.6,
        weight: 0.15,
        rejectionReason: emissionSensitivity <= 0.6 ? 'Low emission sensitivity' : undefined
      },
      {
        id: 'R004',
        text: 'Budget constraints eliminate premium carriers',
        category: 'Cost Optimization',
        values: { truth: 0.70, indeterminacy: 0.25, falsity: 0.05 },
        applied: budgetConstraint > 0.7,
        weight: 0.30,
        rejectionReason: budgetConstraint <= 0.7 ? 'Budget constraint not severe' : undefined
      }
    ];

    return { topsisScores, topsisWeights, corridors, greyInferences, rules };
  };

  const symbolicData = generateSymbolicData();

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
        <h2 className="text-2xl font-bold text-textPrimary flex items-center">
          🧠 DeepCAL Freight Intelligence
          <span className="ml-2 text-sm text-textSecondary">
            Live Symbolic Analysis
          </span>
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {freightData.isConnected ? (
              <><Wifi className="w-4 h-4 text-neonLime" /> <span className="text-textPrimary">Live Data</span></>
            ) : (
              <><WifiOff className="w-4 h-4 text-emberOrange" /> <span className="text-textSecondary">Offline</span></>
            )}
          </div>
          
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="border-deepAqua/50 text-deepAqua hover:bg-deepAqua/10 hover:border-deepAqua"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time data status */}
      {(freightData.lastUpdate || marketData.lastUpdate) && (
        <div className="bg-cardStandard rounded-xl p-4 border border-deepPurple/50 shadow-deepcal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-textSecondary">Freight Data:</span>
              <span className="ml-2 text-neonLime">
                {freightData.lastUpdate ? 
                  `Updated ${freightData.lastUpdate.toLocaleTimeString()}` : 
                  'No data'
                }
              </span>
            </div>
            <div>
              <span className="text-textSecondary">Market Data:</span>
              <span className="ml-2 text-deepAqua">
                {marketData.lastUpdate ? 
                  `Updated ${marketData.lastUpdate.toLocaleTimeString()}` : 
                  'No data'
                }
              </span>
            </div>
            <div>
              <span className="text-textSecondary">Data Freshness:</span>
              <span className={`ml-2 ${
                freightData.isDataFresh() ? 'text-neonLime' : 'text-solarGold'
              }`}>
                {freightData.isDataFresh() ? 'Fresh' : 'Stale'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Core Symbolic Intelligence Components */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* TOPSIS Decision Matrix */}
        <SymbolicTOPSISMatrix 
          scores={symbolicData.topsisScores}
          weights={symbolicData.topsisWeights}
        />

        {/* Rule Audit Panel */}
        <RuleAuditPanel rules={symbolicData.rules} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Disruption Heatmap */}
        <DisruptionHeatmap corridors={symbolicData.corridors} />

        {/* Grey Logic Display */}
        <GreyLogicDisplay inferences={symbolicData.greyInferences} />
      </div>

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
        <div className="bg-gradient-to-r from-deepPurple/50 to-surface/50 p-4 rounded-xl border border-solarGold/30 shadow-deepcal">
          <h4 className="text-lg font-semibold text-solarGold mb-3">
            📈 Live Market Context
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-textSecondary">Fuel Costs:</span>
              <span className="ml-2 text-textAccent">
                ${marketData.data.market.fuel_costs?.toFixed(2) || 'N/A'}
              </span>
            </div>
            {marketData.data.market.port_congestion && Object.entries(marketData.data.market.port_congestion).map(([port, level]) => (
              <div key={port}>
                <span className="text-textSecondary">{port} Port:</span>
                <span className={`ml-2 ${
                  (level as number) > 0.7 ? 'text-emberOrange' : 
                  (level as number) > 0.4 ? 'text-solarGold' : 'text-neonLime'
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
        <div className="bg-background/90 p-4 rounded-xl border border-deepPurple text-xs">
          <details>
            <summary className="text-textSecondary cursor-pointer">Debug Info</summary>
            <pre className="text-textPrimary mt-2 overflow-auto">
              {JSON.stringify({
                freightConnected: freightData.isConnected,
                marketConnected: marketData.isConnected,
                selectedMode,
                analysisResults,
                symbolicData: {
                  topsisScores: symbolicData.topsisScores.length,
                  corridors: symbolicData.corridors.length,
                  greyInferences: symbolicData.greyInferences.length,
                  appliedRules: symbolicData.rules.filter(r => r.applied).length
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
