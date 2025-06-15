
import { useEffect } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { mapShipmentToInputs } from '@/utils/shipmentMapper';
import { useCalculatorInputs } from './useCalculatorInputs';
import { useShipmentData } from './useShipmentData';
import { useForwarderRFQ } from './useForwarderRFQ';
import { useOracleResults } from './useOracleResults';

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
    awakenOracle,
    resetOutput,
    generateHistoricalResults,
    displayResults
  } = useOracleResults();

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
