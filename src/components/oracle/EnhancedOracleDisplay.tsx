
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Flame, Sparkles, Eye } from 'lucide-react';
import { deepcalVoiceService } from '@/services/deepcalVoiceService';

interface EnhancedOracleDisplayProps {
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

export function EnhancedOracleDisplay({
  isActive,
  isCalculating,
  phase,
  bestForwarder,
  routeScore,
  currentMessage,
  neutrosophicScore = 0,
  topsisProgress = 0,
  greySystemProgress = 0
}: EnhancedOracleDisplayProps) {
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [flames, setFlames] = useState<number[]>([]);

  // Flame animation effect
  useEffect(() => {
    if (isActive && isCalculating) {
      const interval = setInterval(() => {
        setFlames(prev => [...prev.slice(-5), Math.random()]);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isActive, isCalculating]);

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

  // Voice announcements
  useEffect(() => {
    if (phase === 'awakening' && isCalculating) {
      deepcalVoiceService.speakAwakening();
    } else if (phase === 'analysis') {
      deepcalVoiceService.speakAnalysis();
    } else if (phase === 'complete' && bestForwarder && routeScore) {
      deepcalVoiceService.speakResults(bestForwarder, routeScore);
    }
  }, [phase, isCalculating, bestForwarder, routeScore]);

  if (!isActive) {
    return (
      <Card className="glass-card shadow-glass border border-glassBorder p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center relative">
            <Brain className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              DeepCAL Neural Mind
            </h3>
            <p className="text-slate-400">First Symbolic Logistics Intelligence</p>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/50">
              Awaiting Oracle Summons
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Oracle Display */}
      <Card className="glass-card shadow-glass border border-purple-500/30 bg-gradient-to-br from-slate-800/90 to-purple-900/30 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {flames.map((flame, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{
                left: `${flame * 100}%`,
                top: `${(i * 20) % 100}%`,
                opacity: 0.3 + (flame * 0.4)
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 animate-pulse" />
        </div>

        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                {phase === 'awakening' && <Flame className="w-6 h-6 text-white animate-pulse" />}
                {phase === 'analysis' && <Eye className="w-6 h-6 text-white animate-spin" />}
                {phase === 'optimization' && <Zap className="w-6 h-6 text-white animate-bounce" />}
                {phase === 'complete' && <Target className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-400">
                  DeepCAL Neural Mind
                </h3>
                <p className="text-sm text-slate-400 capitalize">
                  Phase: {phase}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                isCalculating ? 'bg-orange-400' : 'bg-green-400'
              }`} />
              <span className={`text-sm font-medium ${
                isCalculating ? 'text-orange-400' : 'text-green-400'
              }`}>
                {isCalculating ? 'Computing' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Message Display */}
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 min-h-[80px] flex items-center">
            <span className="text-slate-200 font-mono text-sm leading-relaxed">
              {displayText}
              {isTyping && <span className="animate-pulse text-cyan-400 ml-1">|</span>}
            </span>
          </div>

          {/* Progress Indicators */}
          {isCalculating && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Neutrosophic Logic</span>
                  <span className="text-xs text-purple-400">{Math.round(neutrosophicScore)}%</span>
                </div>
                <Progress value={neutrosophicScore} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">TOPSIS Analysis</span>
                  <span className="text-xs text-cyan-400">{Math.round(topsisProgress)}%</span>
                </div>
                <Progress value={topsisProgress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Grey System</span>
                  <span className="text-xs text-orange-400">{Math.round(greySystemProgress)}%</span>
                </div>
                <Progress value={greySystemProgress} className="h-2" />
              </div>
            </div>
          )}

          {/* Results Display */}
          {phase === 'complete' && bestForwarder && routeScore && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-amber-400 font-bold">OPTIMAL SOLUTION</span>
                </div>
                <div className="text-lg font-bold text-white">{bestForwarder}</div>
                <div className="text-xs text-amber-300">Neural recommendation</div>
              </Card>

              <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-bold">CONFIDENCE</span>
                </div>
                <div className="text-lg font-bold text-white">{routeScore}</div>
                <div className="text-xs text-cyan-300">TOPSIS Score</div>
              </Card>
            </div>
          )}
        </div>
      </Card>

      {/* System Status Banner */}
      <Card className="glass-card shadow-glass border border-glassBorder p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">DeepCAL v2.1 - Symbolic Intelligence Engine</span>
            <Badge className="bg-green-600/20 text-green-400">Live</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Processing 105 historical records</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  );
}
