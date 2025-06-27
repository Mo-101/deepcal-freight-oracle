
// DeepCAL Symbolic Intelligence Hook
// Simplified main hook that orchestrates the symbolic intelligence system

import { useState, useCallback } from 'react';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import { symbolicProcessor } from '@/services/symbolicProcessor';
import { SymbolicInput, SymbolicResult } from '@/types/symbolicIntelligence';

export const useSymbolicIntelligence = () => {
  const [result, setResult] = useState<SymbolicResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const { status, updateStatus, resetStatus, simulateProgress } = useEngineStatus();

  // Core symbolic reasoning function
  const processSymbolicInput = useCallback(async (input: SymbolicInput): Promise<SymbolicResult> => {
    setIsProcessing(true);
    setResult(null);

    try {
      const symbolicResult = await symbolicProcessor.processSymbolicInput(
        input,
        voiceEnabled,
        updateStatus,
        simulateProgress
      );

      setResult(symbolicResult);
      return symbolicResult;

    } catch (error) {
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [voiceEnabled, updateStatus, simulateProgress]);

  // Reset engine state
  const resetEngine = useCallback(() => {
    resetStatus();
    setResult(null);
    setIsProcessing(false);
  }, [resetStatus]);

  // Get engine diagnostics
  const getEngineDiagnostics = useCallback(() => {
    const diagnostics = symbolicProcessor.getDiagnostics();
    return {
      ...diagnostics,
      overall: {
        ...diagnostics.overall,
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
    voiceEnabled,
    setVoiceEnabled,
    
    // Diagnostics
    getEngineDiagnostics
  };
};

// Re-export types for backward compatibility
export type { SymbolicInput, SymbolicResult, LogisticsAlternative, EngineStatus } from '@/types/symbolicIntelligence';
