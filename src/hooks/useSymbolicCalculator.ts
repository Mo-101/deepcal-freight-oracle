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
    isCalculating,
    awakenOracle: baseAwakenOracle,
    resetOutput,
    generateAndShowResults,
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

  // Reference shipment selection effect - NOW with real-time calculation
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

      // CHANGED: Now use the real-time calculation instead of instant display
      generateAndShowResults(selectedShipment, mappedInputs);
    }
  }, [selectedReference, selectedShipment, setInputs, resetOutput, resetForwarderRFQ, resetInputs, populateRFQFromShipment, generateAndShowResults]);

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
    if (!inputs.weight || !inputs.volume || !selectedShipment) return;
    
    try {
      // Start the real-time calculation process
      await generateAndShowResults(selectedShipment, inputs);
      
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

      // Call the live scoring API (optional enhancement)
      const scoreResult = await callScore(shipmentPayload);

      // Dispatch MoScript event with voiceline
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('onScoreReturned', { 
            detail: scoreResult.voiceline 
          })
        );
      }
    } catch (error) {
      console.error('Live scoring failed, but calculation completed:', error);
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
    isCalculating,
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
