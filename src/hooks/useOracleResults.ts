
import { ShipmentData, CalculatorInputs } from '@/types/shipment';
import { useOracleCalculation } from './useOracleCalculation';
import { useOracleAwakening } from './useOracleAwakening';
import { useOracleOutput } from './useOracleOutput';

export const useOracleResults = () => {
  const {
    isCalculating,
    setIsCalculating,
    anomalyMap,
    performCalculation
  } = useOracleCalculation();

  const {
    isAwakening,
    setIsAwakening,
    awakenOracle: baseAwakenOracle
  } = useOracleAwakening();

  const {
    results,
    setResults,
    showOutput,
    setShowOutput,
    outputAnimation,
    setOutputAnimation,
    resetOutput,
    displayResults
  } = useOracleOutput();

  const awakenOracle = async () => {
    await baseAwakenOracle();
    setIsCalculating(true);
    setResults(null);
    setShowOutput(false);
    setOutputAnimation(false);
  };

  const generateAndShowResults = async (shipment: ShipmentData, mappedInputs: Partial<CalculatorInputs>) => {
    // Start the awakening process
    setIsAwakening(true);
    setIsCalculating(true);
    setResults(null);
    setShowOutput(true);
    
    // Let the typing animation run for 3-4 seconds before showing results
    setTimeout(async () => {
      const newResults = await performCalculation(shipment, mappedInputs);
      
      console.log('Oracle calculations complete, displaying results:', newResults);
      
      setResults(newResults);
      setIsCalculating(false);
      setIsAwakening(false);
      setTimeout(() => setOutputAnimation(true), 100);
    }, 3500); // 3.5 second delay to let typing complete
  };

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
