
import { useEffect } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { mapShipmentToInputs } from '@/utils/shipmentMapper';
import { useCalculatorInputs } from './useCalculatorInputs';
import { useShipmentData } from './useShipmentData';
import { useForwarderRFQ } from './useForwarderRFQ';
import { useOracleResults } from './useOracleResults';
import { useScore } from './useScore';
import { loadAllMoScripts } from '@/moscripts/registry';

export const useSymbolicCalculator = () => {
  const {
    inputs,
    setInputs,
    validation,
    setValidation,
    resetInputs,
    handlePrioritiesChange,
    handleForwarderToggle
  } = useCalculatorInputs();

  const {
    shipments,
    selectedReference,
    setSelectedReference,
    selectedShipment,
    dataStale,
    refreshingData,
    handleRefreshData: baseHandleRefreshData
  } = useShipmentData();

  const {
    forwarderRFQ,
    handleRFQChange,
    resetForwarderRFQ,
    populateRFQFromShipment
  } = useForwarderRFQ();

  const {
    results,
    setResults,
    isAwakening,
    showOutput,
    outputAnimation,
    anomalyMap,
    awakenOracle: baseAwakenOracle,
    resetOutput,
    generateHistoricalResults,
    displayResults
  } = useOracleResults();

  const { loading: isScoring, score: callScore } = useScore();

  const handleRefreshData = async () => {
    await baseHandleRefreshData();
    resetInputs();
    resetOutput();
    resetForwarderRFQ();
  };

  // Validation effect
  useEffect(() => {
    let val: typeof validation = {};
    setValidation(val);
  }, [inputs.weight, inputs.volume, setValidation]);

  // Reference shipment selection effect - this is where Oracle results should be generated
  useEffect(() => {
    if (!selectedReference) {
      resetOutput();
      resetForwarderRFQ();
      resetInputs();
      return;
    }
    
    if (selectedShipment) {
      console.log('Processing selected shipment:', selectedShipment.request_reference);
      
      const mappedInputs = mapShipmentToInputs(selectedShipment);
      const usedForwarders = populateRFQFromShipment(selectedShipment);

      // Determine mode of shipment from historical data
      const modeOfShipment = selectedShipment.mode_of_shipment || 'Air';

      setInputs(prev => ({
        ...prev,
        ...mappedInputs,
        modeOfShipment: modeOfShipment as any,
        selectedForwarders: usedForwarders
      }));

      // Generate and display Oracle results immediately
      const historicalResults = generateHistoricalResults(selectedShipment, mappedInputs);
      displayResults(historicalResults);
    }
  }, [selectedReference, selectedShipment, setInputs, resetOutput, resetForwarderRFQ, resetInputs, populateRFQFromShipment, generateHistoricalResults, displayResults]);

  // Load data effect
  useEffect(() => {
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
  }, []);

  // Load MoScripts on mount
  useEffect(() => {
    loadAllMoScripts();
  }, []);

  // Enhanced awaken oracle function with live scoring
  const awakenOracleWithScoring = async () => {
    if (!inputs.weight || !inputs.volume) return;
    
    try {
      // Prepare shipment payload for scoring API
      const shipmentPayload = {
        id: crypto.randomUUID(),
        origin: inputs.origin,
        destination: inputs.destination,
        weight_kg: inputs.weight,
        volume_cbm: inputs.volume,
        category: inputs.cargoType,
        forwarderId: inputs.selectedForwarders[0] || 'default',
        weights: {
          time: inputs.priorities.time / 100,
          cost: inputs.priorities.cost / 100,
          risk: inputs.priorities.risk / 100,
        },
      };

      // Call the live scoring API
      const scoreResult = await callScore(shipmentPayload);

      // Dispatch MoScript event with voiceline
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('onScoreReturned', { 
            detail: scoreResult.voiceline 
          })
        );
      }

      // Update results with live score
      const enhancedResults = generateHistoricalResults(selectedShipment, inputs);
      if (enhancedResults && enhancedResults.forwarderComparison && enhancedResults.forwarderComparison.length > 0) {
        enhancedResults.forwarderComparison[0].topsisScore = scoreResult.finalScore;
      }

      displayResults(enhancedResults);
    } catch (error) {
      console.error('Live scoring failed, falling back to local calculation:', error);
      // Fall back to existing local oracle logic
      const historicalResults = generateHistoricalResults(selectedShipment, inputs);
      displayResults(historicalResults);
    }
  };

  return {
    inputs,
    setInputs,
    shipments,
    selectedReference,
    setSelectedReference,
    selectedShipment,
    forwarderRFQ,
    results,
    isAwakening: isAwakening || isScoring,
    showOutput,
    outputAnimation,
    anomalyMap,
    dataStale,
    refreshingData,
    validation,
    handlePrioritiesChange,
    handleForwarderToggle,
    handleRFQChange,
    awakenOracle: awakenOracleWithScoring,
    handleRefreshData
  };
};
