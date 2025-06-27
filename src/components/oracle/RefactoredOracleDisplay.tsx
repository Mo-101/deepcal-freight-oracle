
import React, { useState, useEffect } from 'react';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';
import { OracleFrame, InferenceExplanation, LiveConfidenceMeter, SymbolicLegend } from '@/components/OracleDisplay';
import { DisplayState, FlamePulseStatus } from '@/types/display';
import { InferenceResult, OraclePhase } from '@/types/oracle';

interface RefactoredOracleDisplayProps {
  isActive: boolean;
  isCalculating: boolean;
  phase: 'awakening' | 'analysis' | 'optimization' | 'complete';
  bestForwarder?: string;
  routeScore?: string;
  currentMessage?: string;
  neutrosophicScore?: number;
  topsisProgress?: number;
  greySystemProgress?: number;
}

const phaseMessages = {
  awakening: [
    "🧠 Neural pathways forming across symbolic dimensions...",
    "🔮 Oracle consciousness expanding through logistics networks...",
    "⚡ Neutrosophic logic cores calibrating truth thresholds..."
  ],
  analysis: [
    "📊 Processing 105 historical shipment patterns...",
    "🎯 Multi-criteria decision matrix construction initiated...",
    "🌍 Evaluating West African trade corridor performance..."
  ],
  optimization: [
    "⚙️ TOPSIS distance calculations converging...",
    "🔥 Grey system uncertainty modeling active...",
    "📈 Symbolic reasoning cascade reaching optimal solution..."
  ],
  complete: [
    "✨ Optimization sequence complete",
    "🏆 Neural recommendation finalized",
    "🎯 Mathematical certainty achieved"
  ]
};

export function RefactoredOracleDisplay({
  isActive,
  isCalculating,
  phase,
  bestForwarder,
  routeScore,
  currentMessage,
  neutrosophicScore = 0,
  topsisProgress = 0,
  greySystemProgress = 0
}: RefactoredOracleDisplayProps) {
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const [displayState, setDisplayState] = useState<DisplayState>({
    isVisible: isActive,
    animationPhase: 'enter',
    confidence: (neutrosophicScore + topsisProgress + greySystemProgress) / 3,
    moodColors: {
      primary: '#a855f7',
      secondary: '#3b82f6',
      accent: '#06b6d4',
      flame: '#f59e0b'
    },
    flamePulse: {
      isActive: isCalculating,
      intensity: isCalculating ? 0.8 : 0.3,
      pattern: isCalculating ? 'pulsing' : 'steady'
    }
  });

  const result: InferenceResult | null = bestForwarder && routeScore ? {
    bestAlternative: bestForwarder,
    routeScore,
    confidence: parseFloat(routeScore) || 0,
    processingTime: 0,
    methodology: '',
    validRules: [],
    ranking: []
  } : null;

  // Update display state based on props
  useEffect(() => {
    setDisplayState(prev => ({
      ...prev,
      isVisible: isActive,
      confidence: (neutrosophicScore + topsisProgress + greySystemProgress) / 3,
      flamePulse: {
        ...prev.flamePulse,
        isActive: isCalculating,
        intensity: isCalculating ? 0.8 : 0.3,
        pattern: isCalculating ? 'pulsing' : 'steady'
      }
    }));
  }, [isActive, isCalculating, neutrosophicScore, topsisProgress, greySystemProgress]);

  // Message cycling effect
  useEffect(() => {
    if (!isActive || !isCalculating || phase === 'complete') return;

    const rotateMessages = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % phaseMessages[phase].length);
    }, 3000);

    return () => clearInterval(rotateMessages);
  }, [isActive, isCalculating, phase]);

  // Typing effect
  useEffect(() => {
    if (!isActive || phase === 'complete') return;

    const message = currentMessage || phaseMessages[phase][messageIndex];
    setDisplayText('');
    setIsTyping(true);

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayText(message.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 35);

    return () => clearInterval(typeInterval);
  }, [messageIndex, currentMessage, isActive, phase]);

  return (
    <div className="space-y-6">
      <OracleFrame displayState={displayState} isCalculating={isCalculating}>
        <InferenceExplanation 
          result={result}
          isTyping={isTyping}
          displayText={displayText}
        />
        
        <LiveConfidenceMeter
          neutrosophicScore={neutrosophicScore}
          topsisProgress={topsisProgress}
          greySystemProgress={greySystemProgress}
          isCalculating={isCalculating}
        />
      </OracleFrame>

      <SymbolicLegend 
        activeRuleCount={105}
        rejectedRules={12}
      />
    </div>
  );
}
