import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  Star, 
  Wand2,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface MagicalOverlayProps {
  isVisible: boolean;
  isCalculating: boolean;
  onComplete?: () => void;
  stage?: 'analyzing' | 'optimizing' | 'calculating' | 'complete' | 'error';
  message?: string;
}

const magicalParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 2
}));

const stageMessages = {
  analyzing: 'Analyzing shipment parameters...',
  optimizing: 'Optimizing route calculations...',
  calculating: 'Computing freight costs...',
  complete: 'Calculation complete!',
  error: 'An error occurred during calculation'
};

const stageIcons = {
  analyzing: Sparkles,
  optimizing: Zap,
  calculating: Wand2,
  complete: CheckCircle,
  error: AlertTriangle
};

export default function MagicalOverlay({ 
  isVisible, 
  isCalculating, 
  onComplete,
  stage = 'analyzing',
  message 
}: MagicalOverlayProps) {
  const [currentStage, setCurrentStage] = useState<string>(stage);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isCalculating) {
      setProgress(0);
      return;
    }

    const stages = ['analyzing', 'optimizing', 'calculating'];
    let stageIndex = 0;
    let stageProgress = 0;

    const interval = setInterval(() => {
      stageProgress += Math.random() * 15 + 5;
      
      if (stageProgress >= 100) {
        stageIndex++;
        stageProgress = 0;
        
        if (stageIndex >= stages.length) {
          setCurrentStage('complete');
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 1000);
          return;
        }
        
        setCurrentStage(stages[stageIndex]);
      }
      
      const totalProgress = (stageIndex * 100 + stageProgress) / stages.length;
      setProgress(Math.min(totalProgress, 95));
    }, 200);

    return () => clearInterval(interval);
  }, [isCalculating, onComplete]);

  useEffect(() => {
    setCurrentStage(stage);
  }, [stage]);

  if (!isVisible) return null;

  const IconComponent = stageIcons[currentStage as keyof typeof stageIcons] || Sparkles;
  const displayMessage = message || stageMessages[currentStage as keyof typeof stageMessages];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Magical Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {magicalParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          >
            <Star 
              className="text-lime-400/60" 
              size={particle.size}
              style={{
                filter: 'drop-shadow(0 0 4px rgba(163, 230, 53, 0.5))'
              }}
            />
          </div>
        ))}
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '3s'
            }}
          >
            <Sparkles 
              className="text-purple-400/40" 
              size={12 + (i % 3) * 4}
              style={{
                filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.4))'
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8 p-8">
        {/* Central Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-lime-400/20 to-purple-600/20 border-2 border-lime-400/30 flex items-center justify-center backdrop-blur-sm">
            {isCalculating && currentStage !== 'complete' && currentStage !== 'error' ? (
              <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
            ) : (
              <IconComponent 
                className={`w-12 h-12 ${
                  currentStage === 'complete' 
                    ? 'text-green-400' 
                    : currentStage === 'error'
                    ? 'text-red-400'
                    : 'text-lime-400'
                }`}
              />
            )}
          </div>
          
          {/* Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-lime-400/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-pulse" />
        </div>

        {/* Progress Ring */}
        {isCalculating && (
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
                fill="none"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a3e635" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            {currentStage === 'complete' ? '✨ Magic Complete!' : '🔮 Oracle at Work'}
          </h2>
          <p className="text-lg text-indigo-300 max-w-md mx-auto">
            {displayMessage}
          </p>
          
          {/* Stage Indicator */}
          {isCalculating && currentStage !== 'complete' && currentStage !== 'error' && (
            <div className="flex items-center justify-center space-x-2">
              {['analyzing', 'optimizing', 'calculating'].map((stageName, index) => (
                <div
                  key={stageName}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    stageName === currentStage
                      ? 'bg-lime-400 scale-125'
                      : index < ['analyzing', 'optimizing', 'calculating'].indexOf(currentStage)
                      ? 'bg-green-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -left-4">
          <Wand2 className="w-8 h-8 text-purple-400/60 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute -top-2 -right-6">
          <Zap className="w-6 h-6 text-yellow-400/60 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute -bottom-4 -left-2">
          <Star className="w-5 h-5 text-blue-400/60 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute -bottom-2 -right-4">
          <Sparkles className="w-7 h-7 text-pink-400/60 animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-lime-900/20 pointer-events-none" />
    </div>
  );
}