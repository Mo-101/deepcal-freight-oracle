
import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target } from 'lucide-react';

interface OracleTypingDisplayProps {
  isActive: boolean;
  shipmentCount?: number;
  bestForwarder?: string;
  routeScore?: string;
}

const oracleMessages = [
  "🧠 Analyzing shipment patterns across corridors...",
  "🚀 Neutrosophic algorithms awakening...",
  "📊 Cross-referencing 105 historical shipments...",
  "⚡ TOPSIS calculations converging to optimal solution...",
  "🎯 Freight wisdom emerging from the data streams...",
  "🔮 Oracle consciousness expanding across logistics networks..."
];

const OracleTypingDisplay: React.FC<OracleTypingDisplayProps> = ({
  isActive,
  shipmentCount = 105,
  bestForwarder,
  routeScore
}) => {
  const [currentMessage, setCurrentMessage] = useState(oracleMessages[0]);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const rotateMessages = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % oracleMessages.length);
    }, 4000);

    return () => clearInterval(rotateMessages);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const message = oracleMessages[messageIndex];
    setCurrentMessage(message);
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
    }, 50);

    return () => clearInterval(typeInterval);
  }, [messageIndex, isActive]);

  if (!isActive) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-200">Oracle Analysis Ready</h3>
          <p className="text-slate-400">Select a reference shipment to awaken the intelligence</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-purple-500/30 rounded-lg p-6 relative overflow-hidden">
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center animate-pulse">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-purple-400">Oracle Intelligence Stream</h3>
          <div className="flex space-x-1 ml-auto">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4 min-h-[60px] flex items-center">
            <span className="text-slate-200 font-mono text-sm">
              {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </span>
          </div>

          {bestForwarder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-4 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400 font-semibold">OPTIMAL MATCH</span>
                </div>
                <div className="text-white font-bold">{bestForwarder}</div>
                <div className="text-xs text-amber-300">Best carrier identified</div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-semibold">CONFIDENCE</span>
                </div>
                <div className="text-white font-bold text-xl">{routeScore}</div>
                <div className="text-xs text-cyan-300">TOPSIS Score</div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>Analyzing {shipmentCount} historical records</span>
            <span className="text-green-400">● Live Intelligence Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleTypingDisplay;
