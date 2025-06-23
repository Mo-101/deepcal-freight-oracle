import { useState } from 'react';
import { OracleResults } from '@/types/shipment';

const OUTPUT_HISTORY_LIMIT = 10; // Adjust for deeper audit trail if needed

export const useOracleOutput = () => {
  const [results, setResults] = useState<OracleResults | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [outputAnimation, setOutputAnimation] = useState(false);
  const [outputHistory, setOutputHistory] = useState<OracleResults[]>([]);

  // Fully reset state, for new calculation/session
  const resetOutput = () => {
    setShowOutput(false);
    setOutputAnimation(false);
    setResults(null);
    setOutputHistory([]);
  };

  // Show new results, add to audit trail, animate display
  const displayResults = (newResults: OracleResults) => {
    setResults(newResults);
    setShowOutput(true);
    setOutputHistory(prev => [newResults, ...prev].slice(0, OUTPUT_HISTORY_LIMIT));
    setTimeout(() => setOutputAnimation(true), 100);
  };

  // For QA or power-users: cycle through previous outputs
  const showPreviousOutput = (index: number) => {
    if (outputHistory[index]) {
      setResults(outputHistory[index]);
      setShowOutput(true);
      setOutputAnimation(true);
    }
  };

  // Get a QA/JSON snapshot of the current or last output
  const getQASnapshot = () => {
    return results
      ? JSON.stringify(results, null, 2)
      : outputHistory.length > 0
        ? JSON.stringify(outputHistory[0], null, 2)
        : '{}';
  };

  return {
    results,
    setResults,
    showOutput,
    setShowOutput,
    outputAnimation,
    setOutputAnimation,
    resetOutput,
    displayResults,
    outputHistory,
    showPreviousOutput,
    getQASnapshot, // For QA or download/export/debug
  };
};
