
// DeepCAL Symbolic Intelligence Types
// Shared type definitions for the symbolic intelligence system

import { NeutrosophicRule } from '@/services/neutrosophicEngine';
import { TOPSISResult } from '@/services/topsisEngine';
import { GreyValue } from '@/services/greySystemEngine';

export interface SymbolicInput {
  alternatives: LogisticsAlternative[];
  rules: NeutrosophicRule[];
  uncertainData?: GreyValue[][];
}

export interface LogisticsAlternative {
  id: string;
  name: string;
  cost?: number | GreyValue;
  time?: number | GreyValue;
  reliability?: number | GreyValue;
  risk?: number | GreyValue;
  [key: string]: any;
}

export interface SymbolicResult {
  bestAlternative: LogisticsAlternative;
  ranking: TOPSISResult[];
  confidence: number;
  validRules: NeutrosophicRule[];
  methodology: string;
  processingTime: number;
}

export interface EngineStatus {
  phase: 'idle' | 'neutrosophic' | 'grey' | 'topsis' | 'complete';
  progress: number;
  currentOperation: string;
  neutrosophicProgress: number;
  topsisProgress: number;
  greyProgress: number;
}
