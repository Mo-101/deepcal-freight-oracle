
import React, { useState, useEffect } from 'react';
import { Brain, Wifi, Zap } from 'lucide-react';

const intelligenceMessages = [
  "🔮 Oracle of Freight is Awakening...",
  "📊 New wisdom: Avoid air freight during monsoon season",
  "🌍 Monitoring West Africa logistics corridors...",
  "⚡ Real-time pattern recognition active",
  "🚀 Neutrosophic algorithms learning from 105 shipments",
  "🎯 Optimal route discovery engine online",
  "📡 Live intelligence stream: All systems operational",
  "🧠 Deep learning models updating freight preferences"
];

const LiveIntelligenceBanner: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessage(prev => (prev + 1) % intelligenceMessages.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-900/40 via-slate-800/60 to-cyan-900/40 border border-purple-500/30 rounded-lg p-3 mb-6 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" />
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
        
        <div className="flex-1">
          <span 
            className={`text-sm font-medium text-slate-200 transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {intelligenceMessages[currentMessage]}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default LiveIntelligenceBanner;
