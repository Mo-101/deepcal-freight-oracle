
import { useState } from 'react';
import { csvDataEngine } from '@/services/csvDataEngine';
import { detectForwarderAnomalies } from "@/components/analytical/anomalyUtils";
import { OracleResults, ShipmentData, CalculatorInputs } from '@/types/shipment';
import { generateForwarderComparison } from '@/utils/shipmentMapper';

export const useOracleCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [anomalyMap, setAnomalyMap] = useState<any>({});

  const performCalculation = async (shipment: ShipmentData, mappedInputs: Partial<CalculatorInputs>): Promise<OracleResults> => {
    console.log('Oracle is now calculating results for shipment:', shipment.request_reference);
    
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
      recommendation: `DeepCAL++ Analysis: ${bestForwarder} ranked highest with TOPSIS score ${routeScore} for ${mappedInputs.cargoType || shipment.item_category} shipment (${mappedInputs.weight || shipment.weight_kg}kg) from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency Grade: ${emergencyGrade}.`,
      oracleNarrative: `📊 Historical Shipment Analysis: ${shipment.item_description} (${mappedInputs.weight || shipment.weight_kg}kg) transported via ${shipment.mode_of_shipment || 'Air'} from ${mappedInputs.origin || shipment.origin_country} to ${mappedInputs.destination || shipment.destination_country}. Emergency Grade: ${emergencyGrade}. Final carrier: ${bestForwarder}. Delivery Status: ${shipment.delivery_status}.`,
      methodology: `Multi-criteria decision analysis using TOPSIS (Technique for Order Preference by Similarity to Ideal Solution). Historical shipment data from ${shipment.date_of_collection || shipment.shipment_date || 'recorded date'}. Cost per kg, transit time, and reliability metrics normalized and weighted. Euclidean distance calculations to positive and negative ideal solutions. ${forwarderComparison.length} freight forwarders analyzed with mathematical precision.`,
      seal: "📋 HISTORICAL",
      qseal: shipment.request_reference.substring(0, 8),
      timestamp: shipment.date_of_collection || shipment.shipment_date || new Date().toISOString(),
      blessing: `Historical reference: ${shipment.request_reference}`
    };

    // Update anomaly map
    const found = detectForwarderAnomalies(forwarderComparison);
    setAnomalyMap(found);

    return newResults;
  };

  return {
    isCalculating,
    setIsCalculating,
    anomalyMap,
    setAnomalyMap,
    performCalculation
  };
};
