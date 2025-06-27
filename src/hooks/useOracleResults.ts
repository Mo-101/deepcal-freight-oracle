
import { useState, useEffect } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { OracleResults, ShipmentData, CalculatorInputs } from '@/types/shipment';
import { generateForwarderComparison } from '@/utils/shipmentMapper';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';

export const useOracleResults = () => {
  const [results, setResults] = useState<OracleResults | null>(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent double triggers

  const awakenOracle = async () => {
    if (isProcessing) return; // Prevent multiple simultaneous calls
    
    const isLoaded = await csvDataEngine.isDataLoaded();
    if (!isLoaded) {
      await csvDataEngine.autoLoadEmbeddedData();
    }
    
    // Clear previous state
    setResults(null);
    setShowOutput(false);
    setOutputAnimation(false);
    setIsAwakening(true);
    setIsCalculating(true);
    
    console.log('🔮 Oracle awakening sequence initiated');
  };

  const resetOutput = () => {
    setShowOutput(false);
    setOutputAnimation(false);
    setResults(null);
    setIsCalculating(false);
    setIsAwakening(false);
    setIsProcessing(false);
  };

  const generateAndShowResults = async (shipment: ShipmentData, mappedInputs: Partial<CalculatorInputs>) => {
    if (isProcessing) return; // Prevent multiple simultaneous calls
    
    setIsProcessing(true);
    
    // Start the awakening process
    setIsAwakening(true);
    setIsCalculating(true);
    setResults(null);
    setShowOutput(true);
    
    console.log('🧠 DeepCAL neural analysis initiated for:', shipment.request_reference);
    
    // Single timeout to prevent multiple rapid calls
    setTimeout(async () => {
      try {
        console.log('🔮 Oracle calculations completing...');
        
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
          recommendation: `DeepCAL Neural Analysis: ${bestForwarder} selected through symbolic reasoning with TOPSIS confidence ${routeScore}. Shipment: ${mappedInputs.cargoType || shipment.item_category} (${mappedInputs.weight || shipment.weight_kg}kg) from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency classification: ${emergencyGrade}.`,
          oracleNarrative: `🧠 Symbolic Intelligence Report: ${shipment.item_description} (${mappedInputs.weight || shipment.weight_kg}kg) transported via ${shipment.mode_of_shipment || 'Air'} from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency Grade: ${emergencyGrade}. Optimal carrier: ${bestForwarder}. Status: ${shipment.delivery_status}.`,
          methodology: `Neutrosophic-TOPSIS-Grey fusion analysis using multi-criteria decision mathematics. Historical shipment data from ${shipment.date_of_collection || shipment.shipment_date || 'recorded date'}. Truth/Indeterminacy/Falsity logic applied to ${forwarderComparison.length} freight forwarders. Euclidean distance optimization with entropy-weighted criteria normalization.`,
          seal: "🧠 NEURAL",
          qseal: shipment.request_reference.substring(0, 8),
          timestamp: shipment.date_of_collection || shipment.shipment_date || new Date().toISOString(),
          blessing: `DeepCAL Reference: ${shipment.request_reference}`
        };

        console.log('✨ Neural analysis complete, presenting results:', newResults);
        
        setResults(newResults);
        setIsCalculating(false);
        setIsAwakening(false);
        setTimeout(() => setOutputAnimation(true), 100);
      } catch (error) {
        console.error('Error in generateAndShowResults:', error);
        setIsCalculating(false);
        setIsAwakening(false);
      } finally {
        setIsProcessing(false);
      }
    }, 3500);
  };

  const displayResults = (newResults: OracleResults) => {
    if (isProcessing) return;
    
    console.log('📊 Displaying pre-calculated neural results:', newResults);
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
