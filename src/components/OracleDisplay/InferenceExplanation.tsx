
import React from 'react';
import { Brain, Target, Sparkles } from 'lucide-react';
import { InferenceResult } from '@/types/oracle';

interface InferenceExplanationProps {
  result: InferenceResult;
  isTyping: boolean;
  displayText: string;
}

export const InferenceExplanation: React.FC<InferenceExplanationProps> = ({
  result,
  isTyping,
  displayText
}) => {
  return (
    <div className="space-y-4">
      {/* Message Display */}
      <div className="bg-slate-800/50 rounded-lg p-4 min-h-[80px] flex items-center">
        <span className="text-slate-200 font-mono text-sm leading-relaxed">
          {displayText}
          {isTyping && <span className="animate-pulse text-cyan-400 ml-1">|</span>}
        </span>
      </div>

      {/* Results Display */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400 font-bold">OPTIMAL SOLUTION</span>
            </div>
            <div className="text-lg font-bold text-white">{result.bestAlternative}</div>
            <div className="text-xs text-amber-300">Neural recommendation</div>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400 font-bold">CONFIDENCE</span>
            </div>
            <div className="text-lg font-bold text-white">{result.routeScore}</div>
            <div className="text-xs text-cyan-300">TOPSIS Score</div>
          </div>
        </div>
      )}
    </div>
  );
};
