
import React, { useEffect, useState } from "react";
import { useEnhancedSpeech } from "@/hooks/useEnhancedSpeech";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface VoiceJustificationProps {
  decision: {
    selectedMode: string;
    selectedForwarder: string;
    confidence: number;
    symbolicReasons: string[];
    ethicalScore: number;
    neutrosophicTruth: number;
    riskLevel: number;
    costEfficiency: number;
  };
  autoPlay?: boolean;
}

const VoiceJustification: React.FC<VoiceJustificationProps> = ({
  decision,
  autoPlay = false
}) => {
  const { speakText, isSpeaking, stopSpeaking } = useEnhancedSpeech();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasSpoken, setHasSpoken] = useState(false);

  const generateJustificationNarrative = (): string => {
    const {
      selectedMode,
      selectedForwarder,
      confidence,
      symbolicReasons,
      ethicalScore,
      neutrosophicTruth,
      riskLevel,
      costEfficiency
    } = decision;

    let narrative = `DeepCAL symbolic decision rendered. `;
    
    // Core decision
    narrative += `Transport mode selected: ${selectedMode}. `;
    if (selectedForwarder) {
      narrative += `Forwarder recommendation: ${selectedForwarder}. `;
    }
    
    // Confidence and reasoning
    narrative += `Decision confidence: ${(confidence * 100).toFixed(1)} percent. `;
    narrative += `Neutrosophic truth validation: ${(neutrosophicTruth * 100).toFixed(1)} percent. `;
    
    // Key factors
    if (symbolicReasons.length > 0) {
      narrative += `Primary factors: ${symbolicReasons.slice(0, 3).join(", ")}. `;
    }
    
    // Performance metrics
    if (costEfficiency > 0.7) {
      narrative += `Cost efficiency validated at ${(costEfficiency * 100).toFixed(0)} percent. `;
    }
    
    // Risk assessment
    if (riskLevel < 0.3) {
      narrative += `Low risk profile confirmed. `;
    } else if (riskLevel > 0.7) {
      narrative += `High risk detected, mitigation strategies recommended. `;
    }
    
    // Ethical considerations
    if (ethicalScore > 0.6) {
      narrative += `Ethical alignment score: ${(ethicalScore * 100).toFixed(0)} percent, acceptable standards met. `;
    } else {
      narrative += `Ethical concerns identified, score ${(ethicalScore * 100).toFixed(0)} percent, review recommended. `;
    }
    
    // Conclusion
    if (confidence > 0.8) {
      narrative += `High confidence recommendation. Proceed with implementation.`;
    } else if (confidence > 0.6) {
      narrative += `Moderate confidence. Consider additional validation.`;
    } else {
      narrative += `Low confidence detected. Human oversight strongly recommended.`;
    }

    return narrative;
  };

  const handleVoiceJustification = async () => {
    if (!voiceEnabled || isSpeaking) return;
    
    const narrative = generateJustificationNarrative();
    console.log('🎙️ Voice Justification:', narrative);
    
    try {
      await speakText(narrative);
      setHasSpoken(true);
    } catch (error) {
      console.error('Voice justification failed:', error);
    }
  };

  // Auto-play when decision changes and autoPlay is enabled
  useEffect(() => {
    if (autoPlay && voiceEnabled && !hasSpoken && decision.confidence > 0) {
      const timer = setTimeout(() => {
        handleVoiceJustification();
      }, 1000); // Small delay to let UI settle
      
      return () => clearTimeout(timer);
    }
  }, [decision, autoPlay, voiceEnabled, hasSpoken]);

  // Reset hasSpoken when decision changes
  useEffect(() => {
    setHasSpoken(false);
  }, [decision.selectedMode, decision.selectedForwarder, decision.confidence]);

  return (
    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-4 rounded-lg border border-indigo-500/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-indigo-300 flex items-center">
          🎙️ Symbolic Voice Justification
          {isSpeaking && <span className="ml-2 text-xs animate-pulse text-green-400">Speaking...</span>}
        </h4>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            variant="outline"
            size="sm"
            className={`transition-colors ${
              voiceEnabled 
                ? 'border-green-400/50 bg-green-900/20 text-green-300 hover:bg-green-800/30' 
                : 'border-gray-400/50 bg-gray-900/20 text-gray-400 hover:bg-gray-800/30'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : handleVoiceJustification}
            disabled={!voiceEnabled || decision.confidence === 0}
            variant="outline"
            size="sm"
            className="border-indigo-400/50 bg-indigo-900/20 text-indigo-300 hover:bg-indigo-800/30 disabled:opacity-50"
          >
            {isSpeaking ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Explain Decision
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-slate-300">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400">Selected Mode:</span>
            <span className="ml-2 text-yellow-300 font-medium">{decision.selectedMode}</span>
          </div>
          <div>
            <span className="text-slate-400">Confidence:</span>
            <span className="ml-2 text-green-300 font-medium">{(decision.confidence * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-400">Ethical Score:</span>
            <span className="ml-2 text-purple-300 font-medium">{(decision.ethicalScore * 100).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-slate-400">Risk Level:</span>
            <span className={`ml-2 font-medium ${
              decision.riskLevel > 0.7 ? 'text-red-300' : 
              decision.riskLevel > 0.4 ? 'text-yellow-300' : 'text-green-300'
            }`}>
              {(decision.riskLevel * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        {decision.symbolicReasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-600">
            <div className="text-slate-400 mb-2">Symbolic Reasoning Chain:</div>
            <ul className="space-y-1">
              {decision.symbolicReasons.map((reason, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasSpoken && (
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="text-xs text-green-400">
            ✓ Voice justification completed
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceJustification;
