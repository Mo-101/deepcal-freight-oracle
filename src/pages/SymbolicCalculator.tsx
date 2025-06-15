
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
import { CalculatorInputs, ShipmentData, OracleResults } from '@/types/shipment';
import { mapShipmentToInputs, generateForwarderComparison } from '@/utils/shipmentMapper';

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

  const [shipments, setShipments] = useState<ShipmentData[]>([]);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [forwarderRFQ, setForwarderRFQ] = useState<Record<string, ForwarderRFQData>>({});
  const [results, setResults] = useState<OracleResults | null>(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});
  const [dataStale, setDataStale] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  const [validation, setValidation] = useState<{weight?: string; volume?: string}>({});

  const handlePrioritiesChange = (priorities: CalculatorInputs["priorities"]) => {
    setInputs((prev) => ({
      ...prev,
      priorities,
    }));
  };

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

  useEffect(() => {
    const fetchShipments = async () => {
      const shipmentData = await csvDataEngine.listShipments();
      setShipments(shipmentData);
      
      const isStale = await csvDataEngine.isDataStale();
      setDataStale(isStale);
    };
    fetchShipments();
  }, []);

  const handleRefreshData = async () => {
    setRefreshingData(true);
    try {
      await csvDataEngine.forceReloadEmbeddedData();
      const freshShipments = await csvDataEngine.listShipments();
      setShipments(freshShipments);
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

  useEffect(() => {
    if (!selectedReference) {
      setSelectedShipment(null);
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
      return;
    }
    
    const shipment = shipments.find((s) => s.request_reference === selectedReference);
    if (shipment) {
      console.log('Selected shipment data:', shipment);
      setSelectedShipment(shipment);
      
      const mappedInputs = mapShipmentToInputs(shipment);
      setInputs(prev => ({
        ...prev,
        ...mappedInputs
      }));

      const forwarderComparison = generateForwarderComparison(shipment);
      const bestForwarder = shipment.final_quote_awarded_freight_forwader_carrier || 
                           shipment.initial_quote_awarded || 
                           shipment.awarded_forwarder ||
                           (forwarderComparison.length > 0 ? forwarderComparison[0].name : '');

      const historicalResults: OracleResults = {
        bestForwarder,
        routeScore: forwarderComparison.length > 0 ? forwarderComparison[0].topsisScore?.toFixed(2) : "N/A",
        forwarderComparison,
        recommendation: `Historical data shows ${bestForwarder || 'selected forwarder'} was chosen for this ${mappedInputs.cargoType} route from ${mappedInputs.origin} to ${mappedInputs.destination}.`,
        oracleNarrative: `📊 Historical Analysis: This ${mappedInputs.cargoType} of ${mappedInputs.weight}kg was transported from ${mappedInputs.origin} to ${mappedInputs.destination}. ${bestForwarder ? `${bestForwarder} was selected` : 'Forwarder selection recorded'} with delivery status: ${shipment.delivery_status || 'unknown'}.`,
        methodology: `Analysis based on historical shipment data from ${shipment.date_of_collection || shipment.shipment_date || 'recorded date'}. Costs and transit times extracted from actual shipment record. TOPSIS scoring calculated from available forwarder quotes.`,
        seal: "📋 HISTORICAL",
        qseal: shipment.request_reference.substring(0, 8),
        timestamp: shipment.date_of_collection || shipment.shipment_date || new Date().toISOString(),
        blessing: `Historical shipment reference: ${shipment.request_reference}`
      };

      setResults(historicalResults);
      setShowOutput(true);
      setTimeout(() => setOutputAnimation(true), 150);
    }
  }, [selectedReference, shipments]);

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
            oldShipments={shipments}
            refreshingData={refreshingData}
            dataStale={dataStale}
            onReferenceChange={setSelectedReference}
            onRefresh={handleRefreshData}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            
            <div className={`lg:col-span-2 relative min-h-[300px] flex items-center justify-center`}>
              <OracleResultsPanel
                showOutput={showOutput}
                outputAnimation={outputAnimation}
                results={results}
                selectedShipment={selectedShipment}
                anomalyMap={anomalyMap}
              />
              
              {showOutput && outputAnimation && (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div className="magical-sparkle-overlay" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
      </footer>
    </div>
  );
};

export default SymbolicCalculator;
