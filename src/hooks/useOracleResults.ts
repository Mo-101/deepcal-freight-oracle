
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
      humorToast("✨ Transmission Complete", "The Oracle is dormant until the engine is connected.", 3000);
    }, 1500);
  };

  const resetOutput = () => {
    setShowOutput(false);
    setOutputAnimation(false);
    setResults(null);
  };

  const generateHistoricalResults = (shipment: ShipmentData, mappedInputs: Partial<CalculatorInputs>): OracleResults => {
    const forwarderComparison = generateForwarderComparison(shipment);
    const bestForwarder = shipment.final_quote_awarded_freight_forwader_carrier || 
                         shipment.initial_quote_awarded || 
                         shipment.awarded_forwarder ||
                         (forwarderComparison.length > 0 ? forwarderComparison[0].name : '');

    return {
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
    generateHistoricalResults
  };
};
