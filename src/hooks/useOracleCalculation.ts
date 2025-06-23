
import { useState } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { detectForwarderAnomalies, detectPriceChanges, ForwarderAnomalies, PriceChanges } from "@/components/analytical/anomalyUtils";
import { OracleResults, ShipmentData, CalculatorInputs } from '@/types/shipment';
import { generateForwarderComparison, analyzeHistoricalPerformance, HistoricalPerformance } from '@/utils/shipmentMapper';

// Add helper for Oracle (Woo) wit
function getWooWisdom(
  bestForwarder: string, 
  anomalies: ForwarderAnomalies, 
  priceChanges: PriceChanges, 
  ffHistory: HistoricalPerformance
): string {
  if (anomalies[bestForwarder]) {
    return `⚡ Oracle alert: Anomaly with ${bestForwarder}! Might be magic, or a glitch in the matrix.`;
  }
  if (priceChanges[bestForwarder]) {
    return `💸 Heads up: ${bestForwarder} recently tweaked their pricing. Don't you just love surprises?`;
  }
  if ((ffHistory[bestForwarder]?.count || 0) > 5) {
    return `🦉 Woo wisdom: ${bestForwarder} is the Yoda of this route. Reliable, experienced, and never late (well, almost).`;
  }
  return `✨ All systems go. May the odds and the cargo be ever in your favor.`;
}

export const useOracleCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<ForwarderAnomalies>({});
  const [priceChangeMap, setPriceChangeMap] = useState<PriceChanges>({});

  const performCalculation = async (
    shipment: ShipmentData,
    mappedInputs: Partial<CalculatorInputs>,
    options?: { oracleMode?: boolean }
  ): Promise<OracleResults> => {
    console.log('Oracle is now calculating results for shipment:', shipment.request_reference);

    // === 1. Generate forwarder comparison with MCDA ===
    const forwarderComparison = generateForwarderComparison(shipment);

    // === 2. Deep analytics: Historical stats, anomalies, price changes ===
    const ffHistory = await analyzeHistoricalPerformance(shipment, forwarderComparison);
    const anomalies = detectForwarderAnomalies(forwarderComparison);
    setAnomalyMap(anomalies);
    const priceChanges = detectPriceChanges(forwarderComparison, ffHistory);
    setPriceChangeMap(priceChanges);

    // === 3. Pick best forwarder and scores ===
    const bestForwarder = forwarderComparison[0]?.name ||
      shipment.initial_quote_awarded ||
      shipment.final_quote_awarded_freight_forwader_carrier ||
      shipment.awarded_forwarder || 'Unknown';
    const routeScore = forwarderComparison[0]?.topsisScore?.toFixed(3) || "N/A";
    const emergencyGrade = (shipment as any)['emergency grade'] ||
      (shipment as any).emergency_grade || 'Standard';

    // === 4. Build oracle narrative ===
    let narrative = `
      📦 Oracle Deep Dive:
      - Top Performer: ${bestForwarder} (TOPSIS: ${routeScore})
      - Historic win count: ${ffHistory[bestForwarder]?.count ?? 1}
      - ${ffHistory[bestForwarder]?.summary || ""}
      - Anomaly scan: ${Object.keys(anomalies).length ? "⚠️ Issues spotted!" : "✅ Smooth sailing."}
      - Price trends: ${Object.keys(priceChanges).length ? "🔔 Volatility noticed." : "💵 Stable."}
      - ${options?.oracleMode ? getWooWisdom(bestForwarder, anomalies, priceChanges, ffHistory) : ''}
    `.replace(/^\s+/gm, ''); // clean up indent

    // === 5. Academic, audit-trail-rich methodology ===
    let methodology = `
      Decision: Hybrid Neutrosophic-AHP-TOPSIS-GRA.
      Data: ${shipment.origin_country} → ${shipment.destination_country}, ${forwarderComparison.length} FFs.
      Criteria: Cost, Responsiveness, Reliability, and more.
      Steps: Neutrosophic weights (uncertainty), Grey analysis (incomplete info), full matrix audit. TOPSIS scores reflect all.
      ${Object.keys(anomalies).length ? 'Anomaly detection run. Results flagged.' : ''}
    `.replace(/^\s+/gm, '');

    // === 6. Result summary ===
    const newResults: OracleResults = {
      bestForwarder,
      routeScore,
      forwarderComparison,
      recommendation: `🌟 DeepCAL++ Oracle verdict: ${bestForwarder} wins for ${shipment.item_category} (${shipment.weight_kg}kg) from ${shipment.origin_country} to ${shipment.destination_country}.`,
      oracleNarrative: narrative,
      methodology,
      seal: options?.oracleMode ? "🔮 ORACLE MODE" : "📋 HISTORICAL",
      qseal: shipment.request_reference?.substring(0, 8) || '',
      timestamp: shipment.date_of_collection || shipment.shipment_date || new Date().toISOString(),
      blessing: `Woo's blessing: ${bestForwarder} on ${ffHistory[bestForwarder]?.count || 1} historic runs.`
    };

    return newResults;
  };

  return {
    isCalculating,
    setIsCalculating,
    anomalyMap,
    setAnomalyMap,
    priceChangeMap,
    setPriceChangeMap,
    performCalculation
  };
};
