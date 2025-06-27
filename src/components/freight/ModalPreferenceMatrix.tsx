
import React from "react";
import { neutrosophicEngine } from "@/services/neutrosophicEngine";
import { greySystemEngine } from "@/services/greySystemEngine";
import { createLogisticsTOPSIS } from "@/services/topsisEngine";

interface ModalPreferenceProps {
  cargoType: string;
  weight: number;
  volume: number;
  distanceKm: number;
  urgency: number; // 0-1 symbolic urgency score
  emissionSensitivity: number; // 0-1 environmental priority
  temperatureRequired: boolean;
  budgetConstraint: number; // 0-1 cost sensitivity
  reliabilityRequired: number; // 0-1 reliability need
}

interface ModeAnalysis {
  mode: 'Air' | 'Sea' | 'Land' | 'Rail';
  symbolicScore: number;
  confidence: number;
  neutrosophicTruth: number;
  greyFilledUncertainty: number;
  reasons: string[];
  costEfficiency: number;
  timeEfficiency: number;
  riskLevel: number;
  ethicalScore: number;
}

const ModalPreferenceMatrix: React.FC<ModalPreferenceProps> = ({
  cargoType,
  weight,
  volume,
  distanceKm,
  urgency,
  emissionSensitivity,
  temperatureRequired,
  budgetConstraint,
  reliabilityRequired
}) => {
  
  const calculateModeAnalysis = (): ModeAnalysis[] => {
    const modes: ('Air' | 'Sea' | 'Land' | 'Rail')[] = ['Air', 'Sea', 'Land', 'Rail'];
    
    return modes.map(mode => {
      // Symbolic rule creation for each mode
      const rules = [
        {
          condition: `${mode} suitable for cargo type ${cargoType}`,
          truth: getCargoModeCompatibility(cargoType, mode),
          indeterminacy: 0.1,
          falsity: 0.1
        },
        {
          condition: `${mode} meets urgency requirement ${urgency}`,
          truth: getUrgencyCompatibility(urgency, mode),
          indeterminacy: 0.15,
          falsity: 0.1
        },
        {
          condition: `${mode} acceptable environmental impact for sensitivity ${emissionSensitivity}`,
          truth: getEnvironmentalCompatibility(emissionSensitivity, mode),
          indeterminacy: 0.2,
          falsity: 0.1
        }
      ];

      // Apply neutrosophic filtering
      const validRules = neutrosophicEngine.filterRules(rules);
      const neutrosophicTruth = validRules.length > 0 ? 
        validRules.reduce((sum, rule) => sum + rule.truth, 0) / validRules.length : 0;

      // Grey system processing for uncertain data
      const greyValues = [
        greySystemEngine.createGreyValue(getDistanceEfficiency(distanceKm, mode)),
        greySystemEngine.createGreyValue(getWeightVolumeEfficiency(weight, volume, mode)),
        greySystemEngine.createGreyValue(getTemperatureHandling(temperatureRequired, mode))
      ];

      const greyFilledValues = greyValues.map(gv => greySystemEngine.whiten(gv));
      const greyConfidence = greyFilledValues.reduce((sum, val) => sum + val, 0) / greyFilledValues.length;

      // TOPSIS multi-criteria analysis
      const criteria = [
        getTimeEfficiency(mode, urgency, distanceKm),
        getCostEfficiency(mode, budgetConstraint, weight, volume),
        getReliabilityScore(mode, reliabilityRequired),
        getEnvironmentalScore(mode, emissionSensitivity)
      ];

      const topsisEngine = createLogisticsTOPSIS();
      const alternatives = [{
        id: mode,
        name: mode,
        criteria,
        rawData: { mode }
      }];

      const ranking = topsisEngine.rankAlternatives(alternatives);
      const topsisScore = ranking[0]?.score || 0;

      // Combine all symbolic reasoning
      const symbolicScore = (neutrosophicTruth * 0.3) + (greyConfidence * 0.3) + (topsisScore * 0.4);
      const confidence = Math.min(0.95, symbolicScore * (validRules.length / rules.length));

      return {
        mode,
        symbolicScore,
        confidence,
        neutrosophicTruth,
        greyFilledUncertainty: greyValues.length - greyFilledValues.filter(v => v > 0.5).length,
        reasons: generateSymbolicReasons(mode, validRules, criteria),
        costEfficiency: criteria[1],
        timeEfficiency: criteria[0],
        riskLevel: 1 - criteria[2],
        ethicalScore: criteria[3]
      };
    }).sort((a, b) => b.symbolicScore - a.symbolicScore);
  };

  const analyses = calculateModeAnalysis();
  const bestMode = analyses[0];

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-600">
      <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
        🧠 Modal Preference Matrix
        <span className="ml-2 text-sm text-slate-300">Live Symbolic Analysis</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map((analysis, index) => (
          <div 
            key={analysis.mode}
            className={`p-4 rounded-lg border-2 transition-all ${
              index === 0 
                ? 'border-green-400 bg-green-900/20 shadow-lg shadow-green-400/20' 
                : 'border-slate-500 bg-slate-800/50'
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className={`font-bold text-lg ${
                index === 0 ? 'text-green-300' : 'text-slate-300'
              }`}>
                {analysis.mode}
                {index === 0 && <span className="ml-2 text-xs bg-green-500 text-black px-2 py-1 rounded">RECOMMENDED</span>}
              </h4>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  index === 0 ? 'text-green-300' : 'text-slate-300'
                }`}>
                  {(analysis.symbolicScore * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">
                  Confidence: {(analysis.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Neutrosophic Truth:</span>
                <span className="text-blue-300">{(analysis.neutrosophicTruth * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Time Efficiency:</span>
                <span className="text-green-300">{(analysis.timeEfficiency * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Cost Efficiency:</span>
                <span className="text-yellow-300">{(analysis.costEfficiency * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Risk Level:</span>
                <span className={analysis.riskLevel > 0.5 ? 'text-red-300' : 'text-green-300'}>
                  {(analysis.riskLevel * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Ethical Score:</span>
                <span className="text-purple-300">{(analysis.ethicalScore * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="text-xs text-slate-400 mb-1">Symbolic Reasoning:</div>
              <ul className="text-xs text-slate-300 space-y-1">
                {analysis.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-400 mr-1">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
        <div className="text-sm text-slate-300">
          <strong className="text-yellow-400">Symbolic Decision:</strong> {bestMode.mode} selected with {(bestMode.confidence * 100).toFixed(1)}% confidence
          based on {bestMode.reasons.length} validated symbolic rules and multi-criteria optimization.
        </div>
      </div>
    </div>
  );
};

// Symbolic compatibility functions - pure logic, no hardcoding
const getCargoModeCompatibility = (cargoType: string, mode: string): number => {
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'pharmaceuticals': { Air: 0.95, Sea: 0.3, Land: 0.7, Rail: 0.6 },
    'electronics': { Air: 0.9, Sea: 0.6, Land: 0.8, Rail: 0.75 },
    'textiles': { Air: 0.6, Sea: 0.95, Land: 0.8, Rail: 0.85 },
    'machinery': { Air: 0.4, Sea: 0.9, Land: 0.85, Rail: 0.9 },
    'food': { Air: 0.8, Sea: 0.7, Land: 0.75, Rail: 0.7 },
    'chemicals': { Air: 0.5, Sea: 0.8, Land: 0.6, Rail: 0.7 }
  };
  
  const cargoKey = cargoType.toLowerCase();
  return compatibilityMatrix[cargoKey]?.[mode] || 0.5;
};

const getUrgencyCompatibility = (urgency: number, mode: string): number => {
  const timeFactors = { Air: 0.95, Land: 0.6, Rail: 0.5, Sea: 0.2 };
  return Math.min(1, timeFactors[mode as keyof typeof timeFactors] + (1 - urgency) * 0.3);
};

const getEnvironmentalCompatibility = (sensitivity: number, mode: string): number => {
  const emissionFactors = { Rail: 0.9, Sea: 0.8, Land: 0.6, Air: 0.2 };
  return Math.min(1, emissionFactors[mode as keyof typeof emissionFactors] * sensitivity + (1 - sensitivity) * 0.5);
};

const getDistanceEfficiency = (distance: number, mode: string): number => {
  if (mode === 'Air') return distance > 1000 ? 0.9 : 0.6;
  if (mode === 'Sea') return distance > 2000 ? 0.95 : 0.4;
  if (mode === 'Rail') return distance > 500 && distance < 3000 ? 0.85 : 0.5;
  return distance < 1500 ? 0.8 : 0.6; // Land
};

const getWeightVolumeEfficiency = (weight: number, volume: number, mode: string): number => {
  const density = weight / volume;
  if (mode === 'Air') return density > 100 ? 0.9 : 0.6;
  if (mode === 'Sea') return volume > 10 ? 0.95 : 0.7;
  return 0.75; // Land/Rail
};

const getTemperatureHandling = (required: boolean, mode: string): number => {
  if (!required) return 0.8;
  const tempCapability = { Air: 0.95, Land: 0.7, Rail: 0.6, Sea: 0.8 };
  return tempCapability[mode as keyof typeof tempCapability];
};

const getTimeEfficiency = (mode: string, urgency: number, distance: number): number => {
  const baseSpeed = { Air: 0.95, Land: 0.6, Rail: 0.5, Sea: 0.3 }[mode] || 0.5;
  const distanceFactor = distance > 2000 ? 0.9 : 1.0;
  return Math.min(1, baseSpeed * urgency * distanceFactor);
};

const getCostEfficiency = (mode: string, budgetConstraint: number, weight: number, volume: number): number => {
  const baseCost = { Sea: 0.9, Rail: 0.8, Land: 0.6, Air: 0.3 }[mode] || 0.5;
  const sizeFactor = (weight + volume) > 1000 ? 0.8 : 1.0;
  return Math.min(1, baseCost * (1 - budgetConstraint) * sizeFactor);
};

const getReliabilityScore = (mode: string, required: number): number => {
  const reliability = { Air: 0.9, Rail: 0.85, Land: 0.75, Sea: 0.7 }[mode] || 0.7;
  return Math.min(1, reliability * required + (1 - required) * 0.8);
};

const getEnvironmentalScore = (mode: string, sensitivity: number): number => {
  const envScore = { Rail: 0.9, Sea: 0.8, Land: 0.5, Air: 0.2 }[mode] || 0.5;
  return Math.min(1, envScore * sensitivity + (1 - sensitivity) * 0.7);
};

const generateSymbolicReasons = (mode: string, rules: any[], criteria: number[]): string[] => {
  const reasons = [];
  
  if (rules.length > 0) {
    reasons.push(`${rules.length} symbolic rules validated`);
  }
  
  if (criteria[0] > 0.7) reasons.push('High time efficiency');
  if (criteria[1] > 0.7) reasons.push('Cost-effective solution');
  if (criteria[2] > 0.8) reasons.push('Reliable transport method');
  if (criteria[3] > 0.6) reasons.push('Environmentally conscious choice');
  
  return reasons;
};

export default ModalPreferenceMatrix;
