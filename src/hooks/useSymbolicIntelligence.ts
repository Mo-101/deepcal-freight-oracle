// DeepCAL Symbolic Intelligence Hook
// Integrates Neutrosophic + TOPSIS + Grey System engines

import { useState, useCallback } from 'react';
import { neutrosophicEngine, NeutrosophicRule } from '@/services/neutrosophicEngine';
import { createLogisticsTOPSIS, TOPSISAlternative, TOPSISResult } from '@/services/topsisEngine';
import { greySystemEngine, GreyValue } from '@/services/greySystemEngine';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';
import { symbolicResponseGenerator } from '@/services/symbolicResponseGenerator';
import { contextualRuleEngine } from '@/services/contextualRuleEngine';

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

export const useSymbolicIntelligence = () => {
  const [status, setStatus] = useState<EngineStatus>({
    phase: 'idle',
    progress: 0,
    currentOperation: 'Ready',
    neutrosophicProgress: 0,
    topsisProgress: 0,
    greyProgress: 0
  });

  const [result, setResult] = useState<SymbolicResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Core symbolic reasoning function
  const processSymbolicInput = useCallback(async (input: SymbolicInput): Promise<SymbolicResult> => {
    const startTime = Date.now();
    setIsProcessing(true);
    setResult(null);

    try {
      // Phase 1: Neutrosophic Logic Filtering
      setStatus({
        phase: 'neutrosophic',
        progress: 10,
        currentOperation: 'Filtering symbolic rules using Neutrosophic Logic...',
        neutrosophicProgress: 0,
        topsisProgress: 0,
        greyProgress: 0
      });

      // Use contextual rules instead of static rules
      const contextualRules = contextualRuleEngine.getAllRules();
      const validRules = neutrosophicEngine.filterRules(contextualRules);
      const ruleWeights = neutrosophicEngine.generateRuleWeights(validRules);

      // Phase 2: Grey System Processing
      setStatus({
        phase: 'grey',
        progress: 35,
        currentOperation: 'Processing uncertain data with Grey System Theory...',
        neutrosophicProgress: 100,
        topsisProgress: 0,
        greyProgress: 0
      });

      // Convert alternatives to TOPSIS format, handling grey values
      const topsisAlternatives: TOPSISAlternative[] = input.alternatives.map(alt => {
        const criteria = [
          greySystemEngine.whiten(greySystemEngine.createGreyValue(alt.cost)),
          greySystemEngine.whiten(greySystemEngine.createGreyValue(alt.time)),
          greySystemEngine.whiten(greySystemEngine.createGreyValue(alt.reliability)),
          greySystemEngine.whiten(greySystemEngine.createGreyValue(alt.risk))
        ];

        return {
          id: alt.id,
          name: alt.name,
          criteria,
          rawData: alt
        };
      });

      // Simulate grey system processing
      for (let i = 0; i <= 100; i += 33) {
        setStatus(prev => ({ ...prev, greyProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      // Phase 3: TOPSIS Multi-Criteria Optimization
      setStatus({
        phase: 'topsis',
        progress: 70,
        currentOperation: 'Optimizing decisions using TOPSIS algorithm...',
        neutrosophicProgress: 100,
        topsisProgress: 0,
        greyProgress: 100
      });

      const topsisEngine = createLogisticsTOPSIS();
      
      if (ruleWeights.length >= 4) {
        topsisEngine.updateWeights(ruleWeights.slice(0, 4));
      }

      // Simulate TOPSIS processing
      for (let i = 0; i <= 100; i += 20) {
        setStatus(prev => ({ ...prev, topsisProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const ranking = topsisEngine.rankAlternatives(topsisAlternatives);

      // Calculate overall confidence
      const confidence = (validRules.length / contextualRules.length) * ranking[0].score;

      // Final phase
      setStatus({
        phase: 'complete',
        progress: 100,
        currentOperation: 'Symbolic reasoning complete',
        neutrosophicProgress: 100,
        topsisProgress: 100,
        greyProgress: 100
      });

      const processingTime = Date.now() - startTime;

      const symbolicResult: SymbolicResult = {
        bestAlternative: input.alternatives.find(alt => alt.id === ranking[0].alternative.id)!,
        ranking,
        confidence,
        validRules,
        methodology: `Live symbolic reasoning using ${validRules.length}/${contextualRules.length} evolved rules. Processing time: ${processingTime}ms.`,
        processingTime
      };

      setResult(symbolicResult);
      
      // Generate symbolic voice response instead of hardcoded announcement
      const voiceResponse = symbolicResponseGenerator.generateResponse({
        query: 'analysis_complete',
        intent: 'recommendation',
        data: {
          recommendation: symbolicResult.bestAlternative.name,
          confidence: symbolicResult.confidence
        }
      });

      await deepcalVoiceService.speakCustom(voiceResponse);

      return symbolicResult;

    } catch (error) {
      console.error('Symbolic processing error:', error);
      setStatus({
        phase: 'idle',
        progress: 0,
        currentOperation: 'Error in symbolic processing',
        neutrosophicProgress: 0,
        topsisProgress: 0,
        greyProgress: 0
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Reset engine state
  const resetEngine = useCallback(() => {
    setStatus({
      phase: 'idle',
      progress: 0,
      currentOperation: 'Ready',
      neutrosophicProgress: 0,
      topsisProgress: 0,
      greyProgress: 0
    });
    setResult(null);
    setIsProcessing(false);
  }, []);

  // Get engine diagnostics
  const getEngineDiagnostics = useCallback(() => {
    return {
      neutrosophic: neutrosophicEngine.getEngineStatus(),
      topsis: createLogisticsTOPSIS().getCriteriaInfo(),
      grey: greySystemEngine.getEngineStatus(),
      overall: {
        status: isProcessing ? 'PROCESSING' : 'READY',
        lastProcessingTime: result?.processingTime || 0,
        confidence: result?.confidence || 0
      }
    };
  }, [isProcessing, result]);

  return {
    // Core functionality
    processSymbolicInput,
    resetEngine,
    
    // State
    status,
    result,
    isProcessing,
    
    // Diagnostics
    getEngineDiagnostics
  };
};
