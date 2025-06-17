
import React, { useState, useEffect } from 'react';
import { Brain, Wifi, Zap, Globe, TrendingUp } from 'lucide-react';

const intelligenceMessages = [
  "🔮 Oracle of Freight is Awakening...",
  "📊 New wisdom: Avoid air freight during monsoon season",
  "🌍 Monitoring West Africa logistics corridors...",
  "⚡ Real-time pattern recognition active",
  "🚀 Neutrosophic algorithms learning from 105 shipments",
  "🎯 Optimal route discovery engine online",
  "📡 Live intelligence stream: All systems operational",
  "🧠 Deep learning models updating freight preferences",
  "🔥 Woo consciousness expanding across trade networks",
  "⚙️ TOPSIS calculations converging to ideal solutions",
  "🌊 Flow state achieved: 94.7% prediction accuracy",
  "🎪 Circus of Logic: West Africa → Europe route optimized"
];

const LiveIntelligenceBanner: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessage(prev => (prev + 1) % intelligenceMessages.length);
        setIsVisible(true);
        // Vary pulse intensity for dynamic effect
        setPulseIntensity(Math.random() * 0.5 + 0.75);
      }, 300);
    }, 15000); // Rotate every 15 seconds as per plan

    return () => clearInterval(interval);
  }, []);

  // Add micro-animations for each rotation
  useEffect(() => {
    const microPulse = setInterval(() => {
      setPulseIntensity(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 2000);

    return () => clearInterval(microPulse);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-900/40 via-slate-800/60 to-cyan-900/40 border border-purple-500/30 rounded-lg p-3 mb-6 overflow-hidden relative">
      {/* Enhanced animated background with variable intensity */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" 
        style={{ opacity: pulseIntensity }}
      />
      
      {/* Data flow effect rings */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8">
        <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-ping" />
        <div className="absolute inset-1 border-2 border-cyan-500/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="relative z-10 flex items-center gap-3 ml-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-3 h-3 text-white" />
          </div>
          <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
          <Globe className="w-4 h-4 text-blue-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        
        <div className="flex-1">
          <span 
            className={`text-sm font-medium text-slate-200 transition-all duration-500 ${
              isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
            }`}
          >
            {intelligenceMessages[currentMessage]}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" />
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-green-400 font-semibold">LIVE</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LiveIntelligenceBanner;
