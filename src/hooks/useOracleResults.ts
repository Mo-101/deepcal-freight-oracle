
import React from 'react';
import { ShipmentData, CalculatorInputs } from '@/types/shipment';
import { useOracleCalculation } from './useOracleCalculation';
import { useOracleAwakening } from './useOracleAwakening';
import { useOracleOutput } from './useOracleOutput';

const SESSION_HISTORY_LIMIT = 12; // configurable: how many past "oracle sessions" to keep

export const useOracleResults = () => {
  const {
    isCalculating,
    setIsCalculating,
    anomalyMap,
    performCalculation,
  } = useOracleCalculation();

  const {
    isAwakening,
    setIsAwakening,
    awakenOracle: baseAwakenOracle,
  } = useOracleAwakening();

  const {
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
  } = useOracleOutput();

  // Keep a “session log” for this user/session
  const [sessionLog, setSessionLog] = React.useState<any[]>([]);

  // Awaken the Oracle for a new run
  const awakenOracle = async () => {
    await baseAwakenOracle();
    setIsCalculating(true);
    setResults(null);
    setShowOutput(false);
    setOutputAnimation(false);
    // Optionally, clear log for a true "new session"
    // setSessionLog([]);
  };

  // Main runner: calculate and display results, then log session
  const generateAndShowResults = async (
    shipment: ShipmentData,
    mappedInputs: Partial<CalculatorInputs>
  ) => {
    setIsAwakening(true);
    setIsCalculating(true);
    setResults(null);
    setShowOutput(true);

    setTimeout(async () => {
      const newResults = await performCalculation(shipment, mappedInputs);

      // 🦉 Compose a witty, human, explanatory "oracle" narrative if missing
      if (!newResults.oracleNarrative) {
        newResults.oracleNarrative = `The Oracle sees all: shipment "${shipment.request_reference}" from ${shipment.origin_country} to ${shipment.destination_country}. ${newResults.bestForwarder} shines, but beware: ${Object.keys(anomalyMap).length ? "anomalies detected!" : "route looks clear."}`;
      }

      // Add academic, statistical, and symbolic marks
      newResults.methodology = (newResults.methodology ?? '') +
        `\n\nDeepCAL++ MCDA: Neutrosophic-TOPSIS-GRA engine. Forwarder reliability, cost dynamics, and responsiveness evaluated.`;
      newResults.seal = "🦉 ORACLE MODE";
      newResults.timestamp = newResults.timestamp ?? new Date().toISOString();

      // Optional: add a humorous blessing or quip
      newResults.blessing = newResults.blessing ??
        (Object.keys(anomalyMap).length
          ? "⚠️ May your freight forwarders be more reliable than your WiFi!"
          : "✨ May your shipments fly smoother than this algorithm's code.");

      // Save to audit/session log (rolling buffer)
      setSessionLog((log) => [newResults, ...log].slice(0, SESSION_HISTORY_LIMIT));

      setResults(newResults);
      setIsCalculating(false);
      setIsAwakening(false);
      setTimeout(() => setOutputAnimation(true), 100);
    }, 3500); // 3.5s "oracle typing" delay
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
    displayResults,
    outputHistory,      // All past outputs (QA/audit)
    showPreviousOutput, // Navigate previous
    sessionLog,         // All outputs for session, in order
  };
};
