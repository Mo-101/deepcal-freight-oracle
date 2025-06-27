
// Symbolic Processing Service
// Core business logic for symbolic intelligence processing

import { neutrosophicEngine } from '@/services/neutrosophicEngine';
import { createLogisticsTOPSIS, TOPSISAlternative } from '@/services/topsisEngine';
import { greySystemEngine } from '@/services/greySystemEngine';
import { contextualRuleEngine } from '@/services/contextualRuleEngine';
import { handleDecisionVoice, handleRuleRejection, handleLowConfidence } from '@/services/deepcal_voice_core';
import { SymbolicInput, SymbolicResult, EngineStatus } from '@/types/symbolicIntelligence';

export class SymbolicProcessor {
  async processSymbolicInput(
    input: SymbolicInput,
    voiceEnabled: boolean,
    updateStatus: (status: Partial<EngineStatus>) => void,
    simulateProgress: (key: 'neutrosophicProgress' | 'topsisProgress' | 'greyProgress', delay?: number) => Promise<void>
  ): Promise<SymbolicResult> {
    const startTime = Date.now();

    try {
      // Phase 1: Neutrosophic Logic Filtering
      updateStatus({
        phase: 'neutrosophic',
        progress: 10,
        currentOperation: 'Filtering symbolic rules using Neutrosophic Logic...',
        neutrosophicProgress: 0,
        topsisProgress: 0,
        greyProgress: 0
      });

      const contextualRules = contextualRuleEngine.getAllRules();
      const validRules = neutrosophicEngine.filterRules(contextualRules);
      const ruleWeights = neutrosophicEngine.generateRuleWeights(validRules);

      // Tactical voice feedback for rule rejections
      if (voiceEnabled && contextualRules.length - validRules.length > 0) {
        const rejectedRules = contextualRules.filter(rule => !validRules.includes(rule));
        rejectedRules.forEach(rule => handleRuleRejection(rule));
      }

      // Phase 2: Grey System Processing
      updateStatus({
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
      await simulateProgress('greyProgress');

      // Phase 3: TOPSIS Multi-Criteria Optimization
      updateStatus({
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
      await simulateProgress('topsisProgress', 300);

      const ranking = topsisEngine.rankAlternatives(topsisAlternatives);

      // Calculate overall confidence
      const confidence = (validRules.length / contextualRules.length) * ranking[0].score;

      // Check for low confidence scenarios
      if (confidence < 0.5 && voiceEnabled) {
        handleLowConfidence();
      }

      // Final phase
      updateStatus({
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

      // Tactical voice announcement only if enabled and high confidence
      if (voiceEnabled && confidence >= 0.5) {
        handleDecisionVoice(symbolicResult);
      }

      return symbolicResult;

    } catch (error) {
      console.error('Symbolic processing error:', error);
      updateStatus({
        phase: 'idle',
        progress: 0,
        currentOperation: 'Error in symbolic processing',
        neutrosophicProgress: 0,
        topsisProgress: 0,
        greyProgress: 0
      });
      throw error;
    }
  }

  getDiagnostics() {
    return {
      neutrosophic: neutrosophicEngine.getEngineStatus(),
      topsis: createLogisticsTOPSIS().getCriteriaInfo(),
      grey: greySystemEngine.getEngineStatus(),
      overall: {
        status: 'READY'
      }
    };
  }
}

export const symbolicProcessor = new SymbolicProcessor();
