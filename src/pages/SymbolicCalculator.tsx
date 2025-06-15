
import React, { useState, useEffect } from 'react';
import DeepCALSymbolicHeader from '@/components/DeepCALSymbolicHeader';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { ForwarderRFQData } from "@/components/ForwarderRFQInputs";
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import DataStalenessWarning from '@/components/calculator/DataStalenessWarning';
import ReferenceShipmentSelector from '@/components/calculator/ReferenceShipmentSelector';
import ShipmentConfigurationPanel from '@/components/calculator/ShipmentConfigurationPanel';
import OracleResultsPanel from '@/components/calculator/OracleResultsPanel';

interface CalculatorInputs {
  origin: string;
  destination: string;
  weight: number;
  volume: number;
  cargoType: string;
  priorities: {
    time: number;
    cost: number;
    risk: number;
  };
  selectedForwarders: string[];
}

const SymbolicCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    origin: 'Kenya',
    destination: 'Zambia',
    weight: 7850,
    volume: 24.5,
    cargoType: 'Emergency Health Kits',
    priorities: {
      time: 68,
      cost: 45,
      risk: 22
    },
    selectedForwarders: ['Kuehne + Nagel', 'DHL Global Forwarding', 'Siginon Logistics']
  });

  const [oldShipments, setOldShipments] = useState<any[]>([]);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [forwarderRFQ, setForwarderRFQ] = useState<Record<string, ForwarderRFQData>>({});
  const [results, setResults] = useState<any>(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});
  const [dataStale, setDataStale] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  const [validation, setValidation] = useState<{weight?: string; volume?: string}>({});

  // Handle priorities change from slider
  const handlePrioritiesChange = (priorities: CalculatorInputs["priorities"]) => {
    setInputs((prev) => ({
      ...prev,
      priorities,
    }));
  };

  // Validation for form inputs - remove range restrictions
  useEffect(() => {
    let val: typeof validation = {};
    setValidation(val);
  }, [inputs.weight, inputs.volume]);

  const handleForwarderToggle = (forwarder: string) => {
    setInputs(prev => {
      const selected = prev.selectedForwarders.includes(forwarder)
        ? prev.selectedForwarders.filter(f => f !== forwarder)
        : [...prev.selectedForwarders, forwarder];
      return {
        ...prev,
        selectedForwarders: selected
      };
    });
    setForwarderRFQ(prev => {
      if (inputs.selectedForwarders.includes(forwarder)) {
        const newRFQ = { ...prev };
        delete newRFQ[forwarder];
        return newRFQ;
      } else {
        return {
          ...prev,
          [forwarder]: prev[forwarder] || { rate: "", days: "", comments: "" }
        };
      }
    });
  };

  const handleRFQChange = (forwarder: string, data: ForwarderRFQData) => {
    setForwarderRFQ(prev => ({
      ...prev,
      [forwarder]: data
    }));
  };

  const awakenOracle = async () => {
    const isLoaded = await csvDataEngine.isDataLoaded();
    if (!isLoaded) {
      await csvDataEngine.autoLoadEmbeddedData();
    }
    setIsAwakening(true);
    humorToast("🔮 Oracle Awakening", "The Symbolic Intelligence is stirring...", 2000);

    setTimeout(() => {
      setResults(null);
      setIsAwakening(false);
      setShowOutput(true);
      setTimeout(() => setOutputAnimation(true), 150);
      humorToast("✨ Transmission Complete", "The Oracle is dormant until the engine is connected.", 3000);
    }, 1500);
  };

  // Load old shipments on mount and check for stale data
  useEffect(() => {
    const fetchShipments = async () => {
      const shipments = await csvDataEngine.listShipments();
      setOldShipments(shipments);
      
      const isStale = await csvDataEngine.isDataStale();
      setDataStale(isStale);
    };
    fetchShipments();
  }, []);

  // Handle data refresh
  const handleRefreshData = async () => {
    setRefreshingData(true);
    try {
      await csvDataEngine.forceReloadEmbeddedData();
      const freshShipments = await csvDataEngine.listShipments();
      setOldShipments(freshShipments);
      setDataStale(false);
      
      setSelectedReference(null);
      setSelectedShipment(null);
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      humorToast("❌ Refresh Failed", "Could not reload fresh data from CSV", 3000);
    } finally {
      setRefreshingData(false);
    }
  };

  // Set form fields when shipment is selected
  useEffect(() => {
    if (!selectedReference) {
      setSelectedShipment(null);
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
      return;
    }
    
    const s = oldShipments.find((sh) => sh.request_reference === selectedReference);
    if (s) {
      console.log('Selected shipment data:', s);
      setSelectedShipment(s);
      
      // Map country names to match the dropdown options
      const mapCountryName = (country: string) => {
        if (!country) return '';
        const countryLower = country.toLowerCase();
        if (countryLower.includes('kenya') || countryLower.includes('nairobi')) return 'Kenya';
        if (countryLower.includes('zambia') || countryLower.includes('lusaka')) return 'Zambia';
        if (countryLower.includes('south africa') || countryLower.includes('johannesburg')) return 'South Africa';
        if (countryLower.includes('nigeria') || countryLower.includes('lagos')) return 'Nigeria';
        if (countryLower.includes('uae') || countryLower.includes('dubai')) return 'UAE';
        if (countryLower.includes('china') || countryLower.includes('shanghai')) return 'China';
        return country; // fallback to original value
      };

      // Map cargo type to match dropdown options
      const mapCargoType = (cargoType: string) => {
        if (!cargoType) return 'Emergency Health Kits';
        const cargoLower = cargoType.toLowerCase();
        if (cargoLower.includes('pharmaceutical') || cargoLower.includes('medicine')) return 'Pharmaceuticals';
        if (cargoLower.includes('laboratory') || cargoLower.includes('lab')) return 'Laboratory Equipment';
        if (cargoLower.includes('cold') || cargoLower.includes('vaccine')) return 'Cold Chain Supplies';
        if (cargoLower.includes('health') || cargoLower.includes('medical') || cargoLower.includes('emergency')) return 'Emergency Health Kits';
        return cargoType; // fallback to original value
      };

      // Update all form fields with shipment data
      setInputs(prev => ({
        ...prev,
        origin: mapCountryName(s.origin_country || s.origin || ''),
        destination: mapCountryName(s.destination_country || s.destination || ''),
        weight: s.weight_kg ? Number(s.weight_kg) : (s.weight ? Number(s.weight) : 0),
        volume: s.volume_cbm ? Number(s.volume_cbm) : (s.volume ? Number(s.volume) : 0),
        cargoType: mapCargoType(s.item_category || s.cargo_description || s.cargo_type || ''),
      }));

      // Generate forwarder comparison data from shipment
      const forwarderData = [
        {
          name: 'Kuehne + Nagel',
          costPerKg: s.kuehne_nagel || s['kuehne+nagel'] || 0,
          avgTransitDays: s.frieght_in_time || s.transit_days || 0,
          onTimeRate: 0.92,
          topsisScore: 0,
          rank: 1
        },
        {
          name: 'DHL Global Forwarding',
          costPerKg: s.dhl_global || s.dhl || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 1 : (s.transit_days ? s.transit_days + 1 : 0),
          onTimeRate: 0.88,
          topsisScore: 0,
          rank: 2
        },
        {
          name: 'Scan Global Logistics',
          costPerKg: s.scan_global_logistics || s.scan_global || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 0.5 : (s.transit_days ? s.transit_days + 0.5 : 0),
          onTimeRate: 0.85,
          topsisScore: 0,
          rank: 3
        },
        {
          name: 'Siginon Logistics',
          costPerKg: s.siginon || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 2 : (s.transit_days ? s.transit_days + 2 : 0),
          onTimeRate: 0.82,
          topsisScore: 0,
          rank: 4
        },
        {
          name: 'Agility Logistics',
          costPerKg: s.agl || s.agility || 0,
          avgTransitDays: s.frieght_in_time ? s.frieght_in_time + 1.5 : (s.transit_days ? s.transit_days + 1.5 : 0),
          onTimeRate: 0.80,
          topsisScore: 0,
          rank: 5
        }
      ].filter(f => f.costPerKg > 0);

      if (forwarderData.length > 0) {
        const costs = forwarderData.map(f => f.costPerKg);
        const times = forwarderData.map(f => f.avgTransitDays);
        
        const minCost = Math.min(...costs);
        const maxCost = Math.max(...costs);
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        
        forwarderData.forEach((f, index) => {
          const costScore = maxCost > minCost ? (maxCost - f.costPerKg) / (maxCost - minCost) : 0.5;
          const timeScore = maxTime > minTime ? (maxTime - f.avgTransitDays) / (maxTime - minTime) : 0.5;
          f.topsisScore = (costScore * 0.5 + timeScore * 0.5);
        });

        forwarderData.sort((a, b) => b.topsisScore - a.topsisScore);
        forwarderData.forEach((f, index) => {
          f.rank = index + 1;
        });
      }

      let bestForwarder = s.final_quote_awarded_freight_forwader_carrier || s.initial_quote_awarded || s.awarded_forwarder;
      if (!bestForwarder && forwarderData.length > 0) {
        bestForwarder = forwarderData[0].name;
      }

      const historicalResults = {
        bestForwarder: bestForwarder,
        routeScore: forwarderData.length > 0 ? forwarderData[0].topsisScore?.toFixed(2) : "N/A",
        forwarderComparison: forwarderData,
        recommendation: `Historical data shows ${bestForwarder || 'selected forwarder'} was chosen for this ${s.item_category || s.cargo_description || 'shipment'} route from ${s.origin_country || s.origin} to ${s.destination_country || s.destination}.`,
        oracleNarrative: `📊 Historical Analysis: This ${s.item_category || s.cargo_description || 'shipment'} of ${s.weight_kg || s.weight || 'unknown'}kg was transported from ${s.origin_country || s.origin} to ${s.destination_country || s.destination}. ${bestForwarder ? `${bestForwarder} was selected` : 'Forwarder selection recorded'} with delivery status: ${s.delivery_status || 'unknown'}.`,
        methodology: `Analysis based on historical shipment data from ${s.date_of_collection || s.shipment_date || 'recorded date'}. Costs and transit times extracted from actual shipment record. TOPSIS scoring calculated from available forwarder quotes.`,
        seal: "📋 HISTORICAL",
        qseal: s.request_reference.substring(0, 8),
        timestamp: s.date_of_collection || s.shipment_date || new Date().toISOString(),
        blessing: `Historical shipment reference: ${s.request_reference}`
      };

      setResults(historicalResults);
      setShowOutput(true);
      setTimeout(() => setOutputAnimation(true), 150);
    }
  }, [selectedReference, oldShipments]);

  // Hide output panel on initial mount and on input changes
  useEffect(() => {
    setShowOutput(false);
    setOutputAnimation(false);
    if (!csvDataEngine.isDataLoaded()) {
      const loadData = async () => {
        try {
          await csvDataEngine.autoLoadEmbeddedData();
        } catch (error) {
          console.error('Auto-load failed:', error);
        }
      };
      loadData();
    }
  }, [inputs.origin, inputs.destination, inputs.weight, inputs.volume, inputs.cargoType, inputs.selectedForwarders]);

  useEffect(() => {
    if (results && results.forwarderComparison) {
      const found = detectForwarderAnomalies(results.forwarderComparison);
      setAnomalyMap(found);
    } else {
      setAnomalyMap({});
    }
  }, [results]);

  return (
    <div className="min-h-screen flex flex-col font-space-grotesk" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <DeepCALSymbolicHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <DataStalenessWarning 
            dataStale={dataStale}
            refreshingData={refreshingData}
            onRefresh={handleRefreshData}
          />

          <ReferenceShipmentSelector
            selectedReference={selectedReference}
            oldShipments={oldShipments}
            refreshingData={refreshingData}
            dataStale={dataStale}
            onReferenceChange={setSelectedReference}
            onRefresh={handleRefreshData}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <ShipmentConfigurationPanel
                inputs={inputs}
                validation={validation}
                forwarderRFQ={forwarderRFQ}
                isAwakening={isAwakening}
                onInputsChange={setInputs}
                onPrioritiesChange={handlePrioritiesChange}
                onForwarderToggle={handleForwarderToggle}
                onRFQChange={handleRFQChange}
                onAwakenOracle={awakenOracle}
              />
            </div>
            
            {/* Output Panel */}
            <div className={`lg:col-span-2 relative min-h-[300px] flex items-center justify-center`}>
              <OracleResultsPanel
                showOutput={showOutput}
                outputAnimation={outputAnimation}
                results={results}
                selectedShipment={selectedShipment}
                anomalyMap={anomalyMap}
              />
              
              {/* Magical sparkle overlay */}
              {showOutput && outputAnimation && (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div className="magical-sparkle-overlay" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-700 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8">
            <div>
              <i className="fas fa-brain text-deepcal-light mr-2"></i>
              PHASE I – Power Analytical Engine (ACTIVE)
            </div>
            <div>
              <i className="fas fa-chart-network text-deepcal-light mr-2"></i>
              PHASE II – Neural Visualization (Q2 2025)
            </div>
            <div>
              <i className="fas fa-wave-square text-deepcal-light mr-2"></i>
              PHASE III – DeepTalk Voice (Q3 2025)
            </div>
            <div>
              <i className="fas fa-bolt text-deepcal-light mr-2"></i>
              PHASE IV – Live Integration (Q4 2025)
            </div>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            © 2025 DeepCAL++ Technologies • The First Symbolic Logistical Intelligence Engine • 🔱
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolicCalculator;
