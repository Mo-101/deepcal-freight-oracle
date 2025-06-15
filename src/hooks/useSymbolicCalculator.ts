import { useState, useEffect } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { ForwarderRFQData } from "@/components/ForwarderRFQInputs";
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { CalculatorInputs, ShipmentData, OracleResults } from '@/types/shipment';
import { mapShipmentToInputs, generateForwarderComparison } from '@/utils/shipmentMapper';

export const useSymbolicCalculator = () => {
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
    selectedForwarders: [] // Start with no forwarders selected
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

  const handleRefreshData = async () => {
    setRefreshingData(true);
    try {
      await csvDataEngine.forceReloadEmbeddedData();
      const freshShipments = await csvDataEngine.listShipments();
      setShipments(freshShipments);
      setDataStale(false);
      
      // Clear selection and reset form to default state
      setSelectedReference(null);
      setSelectedShipment(null);
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
      setForwarderRFQ({});
      setInputs(prev => ({
        ...prev,
        selectedForwarders: []
      }));
    } catch (error) {
      console.error('Failed to refresh data:', error);
      humorToast("❌ Refresh Failed", "Could not reload fresh data from CSV", 3000);
    } finally {
      setRefreshingData(false);
    }
  };

  // Validation effect
  useEffect(() => {
    let val: typeof validation = {};
    setValidation(val);
  }, [inputs.weight, inputs.volume]);

  // Load shipments effect
  useEffect(() => {
    const fetchShipments = async () => {
      const shipmentData = await csvDataEngine.listShipments();
      setShipments(shipmentData);
      
      const isStale = await csvDataEngine.isDataStale();
      setDataStale(isStale);
    };
    fetchShipments();
  }, []);

  // Reference shipment selection effect - only populate when user actively selects
  useEffect(() => {
    if (!selectedReference) {
      // Clear everything when no reference is selected
      setSelectedShipment(null);
      setResults(null);
      setShowOutput(false);
      setOutputAnimation(false);
      setForwarderRFQ({});
      return;
    }
    
    const shipment = shipments.find((s) => s.request_reference === selectedReference);
    if (shipment) {
      console.log('Selected shipment data:', shipment);
      setSelectedShipment(shipment);
      
      const mappedInputs = mapShipmentToInputs(shipment);
      
      const usedForwarders: string[] = [];
      const newForwarderRFQ: Record<string, ForwarderRFQData> = {};
      
      // Only add forwarders that have actual quote values
      if (shipment.kuehne_nagel && shipment.kuehne_nagel > 0) {
        usedForwarders.push('Kuehne + Nagel');
        newForwarderRFQ['Kuehne + Nagel'] = {
          rate: shipment.kuehne_nagel,
          days: shipment.transit_days || shipment.frieght_in_time || "",
          comments: ""
        };
      }
      
      if ((shipment.dhl_global && shipment.dhl_global > 0) || (shipment.dhl && shipment.dhl > 0)) {
        usedForwarders.push('DHL Global Forwarding');
        newForwarderRFQ['DHL Global Forwarding'] = {
          rate: shipment.dhl_global || shipment.dhl || 0,
          days: shipment.transit_days || shipment.frieght_in_time || "",
          comments: ""
        };
      }
      
      if ((shipment.scan_global_logistics && shipment.scan_global_logistics > 0) || (shipment.scan_global && shipment.scan_global > 0)) {
        usedForwarders.push('Scan Global Logistics');
        newForwarderRFQ['Scan Global Logistics'] = {
          rate: shipment.scan_global_logistics || shipment.scan_global || 0,
          days: shipment.transit_days || shipment.frieght_in_time || "",
          comments: ""
        };
      }
      
      if (shipment.siginon && shipment.siginon > 0) {
        usedForwarders.push('Siginon Logistics');
        newForwarderRFQ['Siginon Logistics'] = {
          rate: shipment.siginon,
          days: shipment.transit_days || shipment.frieght_in_time || "",
          comments: ""
        };
      }
      
      if ((shipment.agl && shipment.agl > 0) || (shipment.agility && shipment.agility > 0)) {
        usedForwarders.push('Agility Logistics');
        newForwarderRFQ['Agility Logistics'] = {
          rate: shipment.agl || shipment.agility || 0,
          days: shipment.transit_days || shipment.frieght_in_time || "",
          comments: ""
        };
      }

      // Update inputs with mapped data and selected forwarders
      setInputs(prev => ({
        ...prev,
        ...mappedInputs,
        selectedForwarders: usedForwarders
      }));
      
      setForwarderRFQ(newForwarderRFQ);

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

  // Reset output on input changes
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

  // Anomaly detection effect
  useEffect(() => {
    if (results && results.forwarderComparison) {
      const found = detectForwarderAnomalies(results.forwarderComparison);
      setAnomalyMap(found);
    } else {
      setAnomalyMap({});
    }
  }, [results]);

  return {
    inputs,
    setInputs,
    shipments,
    selectedReference,
    setSelectedReference,
    selectedShipment,
    forwarderRFQ,
    results,
    isAwakening,
    showOutput,
    outputAnimation,
    anomalyMap,
    dataStale,
    refreshingData,
    validation,
    handlePrioritiesChange,
    handleForwarderToggle,
    handleRFQChange,
    awakenOracle,
    handleRefreshData
  };
};
