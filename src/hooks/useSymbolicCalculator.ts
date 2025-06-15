
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
    generateHistoricalResults
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

  // Reference shipment selection effect - only populate when user actively selects
  useEffect(() => {
    if (!selectedReference) {
      // Clear everything when no reference is selected
      resetOutput();
      resetForwarderRFQ();
      resetInputs();
      return;
    }
    
    if (selectedShipment) {
      const mappedInputs = mapShipmentToInputs(selectedShipment);
      const usedForwarders = populateRFQFromShipment(selectedShipment);

      // Update inputs with mapped data and selected forwarders
      setInputs(prev => ({
        ...prev,
        ...mappedInputs,
        selectedForwarders: usedForwarders
      }));

      const historicalResults = generateHistoricalResults(selectedShipment, mappedInputs);
      setResults(historicalResults);
      
      // Show output with animation
      setTimeout(() => {
        resetOutput();
        setTimeout(() => {
          setResults(historicalResults);
          // Trigger show and animate
          setTimeout(() => {
            // This will be handled by the output panel
          }, 150);
        }, 50);
      }, 100);
    }
  }, [selectedReference, selectedShipment, setInputs, setResults, resetOutput, resetForwarderRFQ, resetInputs, populateRFQFromShipment, generateHistoricalResults]);

  // Reset output on input changes
  useEffect(() => {
    resetOutput();
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
  }, [inputs.origin, inputs.destination, inputs.weight, inputs.volume, inputs.cargoType, inputs.selectedForwarders, resetOutput]);

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
