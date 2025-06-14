
import React, { useState, useEffect } from 'react';

interface SymbolicDecisionSealProps {
  forwarder: string;
  score: number;
  hash: string;
}

export const SymbolicDecisionSeal: React.FC<SymbolicDecisionSealProps> = ({
  forwarder,
  score,
  hash
}) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const glowTimer = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 2000);

    const rotationTimer = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 100);

    return () => {
      clearInterval(glowTimer);
      clearInterval(rotationTimer);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        className={`w-24 h-24 rounded-full bg-gradient-to-br from-deepcal-dark via-deepcal-purple to-deepcal-light flex items-center justify-center transition-all duration-1000 ${
          isGlowing ? 'shadow-lg shadow-deepcal-light/50 scale-105' : 'shadow-md shadow-deepcal-purple/30'
        }`}
        style={{ transform: `rotate(${rotation * 0.5}deg)` }}
      >
        <div className="text-center text-white text-xs font-bold leading-tight">
          <div className="text-[8px] opacity-80">DEEPCAL++</div>
          <div className="text-lg">⚡</div>
          <div className="text-[8px] opacity-80">SEALED</div>
        </div>
      </div>
      
      {/* Floating formulae */}
      <div className="absolute -top-2 -right-2 text-xs font-mono text-deepcal-light opacity-70 animate-pulse">
        C*={score.toFixed(2)}
      </div>
      
      <div className="absolute -bottom-2 -left-2 text-xs font-mono text-purple-300 opacity-70 animate-pulse">
        #{hash}
      </div>
      
      {/* Orbital rings */}
      <div 
        className="absolute inset-0 w-28 h-28 border border-deepcal-light/20 rounded-full -m-2"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-deepcal-light rounded-full -translate-x-1/2"></div>
      </div>
      
      <div 
        className="absolute inset-0 w-32 h-32 border border-purple-400/10 rounded-full -m-4"
        style={{ transform: `rotate(${-rotation * 0.7}deg)` }}
      >
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-purple-400 rounded-full -translate-x-1/2 opacity-60"></div>
      </div>
    </div>
  );
};
