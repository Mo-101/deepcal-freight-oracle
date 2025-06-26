
import React, { useState, useEffect } from 'react';
import { OracleResults, ShipmentData, CalculatorInputs } from '@/types/shipment';
import { csvDataEngine } from '@/services/csvDataEngine';
import { EnhancedOracleDisplay } from '@/components/oracle/EnhancedOracleDisplay';
import ConfidenceMeter from '@/components/oracle/ConfidenceMeter';

interface OracleResultsPanelProps {
  showOutput: boolean;
  outputAnimation: boolean;
  results: OracleResults | null;
  selectedShipment: ShipmentData | null;
  anomalyMap: any;
  inputs: CalculatorInputs;
}

interface CalculationPhase {
  phase: 'awakening' | 'analysis' | 'optimization' | 'complete';
  neutrosophicScore: number;
  topsisProgress: number;
  greySystemProgress: number;
}

const OracleResultsPanel: React.FC<OracleResultsPanelProps> = ({
  showOutput,
  outputAnimation,
  results,
  selectedShipment,
  anomalyMap,
  inputs
}) => {
  const [calculationPhase, setCalculationPhase] = useState<CalculationPhase>({
    phase: 'awakening',
    neutrosophicScore: 0,
    topsisProgress: 0,
    greySystemProgress: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);

  // Simulate the calculation phases when processing starts
  useEffect(() => {
    if (showOutput && !results) {
      setIsCalculating(true);
      simulateCalculationPhases();
    } else if (results) {
      setCalculationPhase(prev => ({ ...prev, phase: 'complete' }));
      setIsCalculating(false);
    }
  }, [showOutput, results]);

  const simulateCalculationPhases = async () => {
    // Phase 1: Awakening (0.5s)
    setCalculationPhase({
      phase: 'awakening',
      neutrosophicScore: 0,
      topsisProgress: 0,
      greySystemProgress: 0
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Phase 2: Analysis (1.5s with progressive updates)
    setCalculationPhase(prev => ({ ...prev, phase: 'analysis' }));
    
    for (let i = 0; i <= 100; i += 20) {
      setCalculationPhase(prev => ({
        ...prev,
        neutrosophicScore: Math.min(100, i + Math.random() * 10)
      }));
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Phase 3: Optimization (1.5s with TOPSIS and Grey progress)
    setCalculationPhase(prev => ({ ...prev, phase: 'optimization' }));
    
    for (let i = 0; i <= 100; i += 25) {
      setCalculationPhase(prev => ({
        ...prev,
        topsisProgress: Math.min(100, i + Math.random() * 15),
        greySystemProgress: Math.min(100, (i * 0.8) + Math.random() * 10)
      }));
      await new Promise(resolve => setTimeout(resolve, 375));
    }

    // Ensure all progress bars complete
    setCalculationPhase(prev => ({
      ...prev,
      neutrosophicScore: 100,
      topsisProgress: 100,
      greySystemProgress: 100
    }));
  };

  return (
    <div className="space-y-6">
      <EnhancedOracleDisplay
        isActive={showOutput}
        isCalculating={isCalculating}
        phase={calculationPhase.phase}
        bestForwarder={results?.bestForwarder}
        routeScore={results?.routeScore}
        neutrosophicScore={calculationPhase.neutrosophicScore}
        topsisProgress={calculationPhase.topsisProgress}
        greySystemProgress={calculationPhase.greySystemProgress}
      />

      {results && calculationPhase.phase === 'complete' && (
        <div className="space-y-4">
          <ConfidenceMeter 
            score={parseFloat(results.routeScore || '0')} 
            label="TOPSIS Confidence"
          />
          
          {results.recommendation && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-lime-400 mb-3">
                📋 Neural Analysis Report
              </h4>
              <p className="text-slate-200 leading-relaxed mb-4">
                {results.recommendation}
              </p>
              
              {results.methodology && (
                <div className="border-t border-slate-700 pt-4">
                  <h5 className="text-sm font-semibold text-indigo-400 mb-2">
                    🧠 Methodology
                  </h5>
                  <p className="text-xs text-slate-400">
                    {results.methodology}
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                <span>{results.seal} {results.qseal}</span>
                <span>{results.timestamp}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OracleResultsPanel;
