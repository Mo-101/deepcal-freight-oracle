
// Oracle System Types - Centralized type definitions for symbolic intelligence

export interface SymbolicRule {
  id: string;
  rule: string;
  truth: number;
  indeterminacy: number;
  falsity: number;
  category: string;
  weight?: number;
}

export interface InferenceResult {
  bestAlternative: string;
  routeScore: string;
  confidence: number;
  processingTime: number;
  methodology: string;
  validRules: SymbolicRule[];
  ranking: any[];
}

export interface EthicalScore {
  transparency: number;
  fairness: number;
  accountability: number;
  sustainability: number;
  overall: number;
}

export interface OraclePhase {
  phase: 'awakening' | 'analysis' | 'optimization' | 'complete';
  neutrosophicScore: number;
  topsisProgress: number;
  greySystemProgress: number;
}

export interface SymbolicAnalytics {
  activeRuleCount: number;
  rejectedRules: number;
  inferenceSpeedMs: number;
  greyFillingRate: number;
  ethicalScoreMap: EthicalScore;
  confidenceOverTime: number[];
}
