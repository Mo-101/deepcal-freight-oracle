
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
  const [isCalculating, setIsCalculating] = useState(false);

  const awakenOracle = async () => {
    const isLoaded = await csvDataEngine.isDataLoaded();
    if (!isLoaded) {
      await csvDataEngine.autoLoadEmbeddedData();
    }
    setIsAwakening(true);
    setIsCalculating(true);
    setResults(null);
    setShowOutput(false);
    setOutputAnimation(false);
    
    humorToast("🔮 Oracle Awakening", "The Symbolic Intelligence is stirring...", 2000);
  };

  const resetOutput = () => {
    setShowOutput(false);
    setOutputAnimation(false);
    setResults(null);
    setIsCalculating(false);
  };

  const generateAndShowResults = async (shipment: ShipmentData, mappedInputs: Partial<CalculatorInputs>) => {
    // Start the awakening process
    setIsAwakening(true);
    setIsCalculating(true);
    setResults(null);
    setShowOutput(true);
    
    // Let the typing animation run for 3-4 seconds before showing results
    setTimeout(async () => {
      console.log('Oracle is now calculating results for shipment:', shipment.request_reference);
      
      // Generate real forwarder comparison with TOPSIS calculations
      const forwarderComparison = generateForwarderComparison(shipment);
      
      // Determine best forwarder from actual data or TOPSIS ranking
      const bestForwarder = shipment.initial_quote_awarded || 
                           shipment.final_quote_awarded_freight_forwader_carrier ||
                           shipment.awarded_forwarder ||
                           (forwarderComparison.length > 0 ? forwarderComparison[0].name : 'Unknown');

      // Calculate route score from TOPSIS results
      const routeScore = forwarderComparison.length > 0 ? forwarderComparison[0].topsisScore?.toFixed(3) : "N/A";

      // Get emergency grade safely
      const emergencyGrade = (shipment as any)['emergency grade'] || 
                            (shipment as any).emergency_grade || 
                            'Standard';

      const newResults = {
        bestForwarder,
        routeScore,
        forwarderComparison,
        recommendation: `DeepCAL++ Analysis: ${bestForwarder} ranked highest with TOPSIS score ${routeScore} for ${mappedInputs.cargoType || shipment.item_category} shipment (${mappedInputs.weight || shipment.weight_kg}kg) from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency Grade: ${emergencyGrade}.`,
        oracleNarrative: `📊 Historical Shipment Analysis: ${shipment.item_description} (${mappedInputs.weight || shipment.weight_kg}kg) transported via ${shipment.mode_of_shipment || 'Air'} from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency Grade: ${emergencyGrade}. Final carrier: ${bestForwarder}. Delivery Status: ${shipment.delivery_status}.`,
        methodology: `Multi-criteria decision analysis using TOPSIS (Technique for Order Preference by Similarity to Ideal Solution). Historical shipment data from ${shipment.date_of_collection || shipment.shipment_date || 'recorded date'}. Cost per kg, transit time, and reliability metrics normalized and weighted. Euclidean distance calculations to positive and negative ideal solutions. ${forwarderComparison.length} freight forwarders analyzed with mathematical precision.`,
        seal: "📋 HISTORICAL",
        qseal: shipment.request_reference.substring(0, 8),
        timestamp: shipment.date_of_collection || shipment.shipment_date || new Date().toISOString(),
        blessing: `Historical reference: ${shipment.request_reference}`
      };

      console.log('Oracle calculations complete, displaying results:', newResults);
      
      setResults(newResults);
      setIsCalculating(false);
      setIsAwakening(false);
      setTimeout(() => setOutputAnimation(true), 100);
      humorToast("✨ Transmission Complete", "Oracle analysis ready.", 3000);
    }, 3500); // 3.5 second delay to let typing complete
  };

  const displayResults = (newResults: OracleResults) => {
    console.log('Displaying pre-calculated results:', newResults);
    setResults(newResults);
    setShowOutput(true);
    setIsCalculating(false);
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
    isCalculating,
    awakenOracle,
    resetOutput,
    generateAndShowResults,
    displayResults
  };
};
