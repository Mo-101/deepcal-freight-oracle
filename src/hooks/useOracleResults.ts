
import { useState, useEffect } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { humorToast } from '@/components/HumorToast';
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { OracleResults, ShipmentData, CalculatorInputs } from '@/types/shipment';
import { generateForwarderComparison } from '@/utils/shipmentMapper';

export const useOracleResults = () => {
  const [results, setResults] = useState<OracleResults | null>(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});

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
      humorToast("✨ Transmission Complete", "Oracle analysis ready.", 3000);
    }, 1500);
  };

  const resetOutput = () => {
    setShowOutput(false);
    setOutputAnimation(false);
    setResults(null);
  };

  const generateHistoricalResults = (shipment: ShipmentData, mappedInputs: Partial<CalculatorInputs>): OracleResults => {
    console.log('Generating historical results for shipment:', shipment.request_reference);
    
    const forwarderComparison = generateForwarderComparison(shipment);
    const bestForwarder = shipment.final_quote_awarded || 
                         shipment.initial_quote_awarded || 
                         shipment.final_quote_awarded_freight_forwader_carrier ||
                         shipment.awarded_forwarder ||
                         (forwarderComparison.length > 0 ? forwarderComparison[0].name : 'Unknown');

    const results = {
      bestForwarder,
      routeScore: forwarderComparison.length > 0 ? forwarderComparison[0].topsisScore?.toFixed(2) : "N/A",
      forwarderComparison,
      recommendation: `Historical analysis: ${bestForwarder} was selected for this ${mappedInputs.cargoType || shipment.item_category} shipment from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}.`,
      oracleNarrative: `📊 Historical Shipment Analysis: ${shipment.item_description} (${mappedInputs.weight || shipment.weight_kg}kg) transported via ${shipment.mode_of_shipment || 'Air'} from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency Grade: ${shipment.emergency_grade}. Final carrier: ${bestForwarder}. Delivery Status: ${shipment.delivery_status}.`,
      methodology: `Analysis based on historical shipment data from ${shipment.date_of_collection || shipment.shipment_date || 'recorded date'}. Cost analysis and transit performance extracted from actual shipment records. TOPSIS multi-criteria scoring applied to available forwarder quotes.`,
      seal: "📋 HISTORICAL",
      qseal: shipment.request_reference.substring(0, 8),
      timestamp: shipment.date_of_collection || shipment.shipment_date || new Date().toISOString(),
      blessing: `Historical reference: ${shipment.request_reference}`
    };

    console.log('Generated results:', results);
    return results;
  };

  const displayResults = (newResults: OracleResults) => {
    console.log('Displaying results:', newResults);
    setResults(newResults);
    setShowOutput(true);
    setTimeout(() => setOutputAnimation(true), 100);
  };

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
    results,
    setResults,
    isAwakening,
    showOutput,
    outputAnimation,
    anomalyMap,
    awakenOracle,
    resetOutput,
    generateHistoricalResults,
    displayResults
  };
};
