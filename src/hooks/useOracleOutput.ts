
import { useState } from 'react';
import { OracleResults } from '@/types/shipment';

export const useOracleOutput = () => {
  const [results, setResults] = useState<OracleResults | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);

  const resetOutput = () => {
    setShowOutput(false);
    setOutputAnimation(false);
    setResults(null);
  };

  const displayResults = (newResults: OracleResults) => {
    console.log('Displaying pre-calculated results:', newResults);
    setResults(newResults);
    setShowOutput(true);
    setTimeout(() => setOutputAnimation(true), 100);
  };

  return {
    results,
    setResults,
    showOutput,
    setShowOutput,
    outputAnimation,
    setOutputAnimation,
    resetOutput,
    displayResults
  };
};
