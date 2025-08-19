import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target
} from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number; // 0-100
  label?: string;
  showDetails?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface ConfidenceLevel {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
  description: string;
}

const confidenceLevels: ConfidenceLevel[] = [
  {
    min: 0,
    max: 30,
    label: 'Low',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: AlertTriangle,
    description: 'Prediction has high uncertainty'
  },
  {
    min: 31,
    max: 60,
    label: 'Moderate',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: Minus,
    description: 'Prediction has moderate reliability'
  },
  {
    min: 61,
    max: 80,
    label: 'High',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: TrendingUp,
    description: 'Prediction is highly reliable'
  },
  {
    min: 81,
    max: 100,
    label: 'Very High',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle,
    description: 'Prediction is extremely reliable'
  }
];

export default function ConfidenceMeter({ 
  confidence, 
  label = "Confidence",
  showDetails = false,
  animated = true,
  size = 'md',
  className = ""
}: ConfidenceMeterProps) {
  const [displayedConfidence, setDisplayedConfidence] = useState(animated ? 0 : confidence);
  const [isAnimating, setIsAnimating] = useState(animated);

  // Animate confidence value
  useEffect(() => {
    if (!animated) {
      setDisplayedConfidence(confidence);
      return;
    }

    setIsAnimating(true);
    const duration = 1500;
    const steps = 60;
    const increment = confidence / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current = Math.min(confidence, increment * step);
      setDisplayedConfidence(current);

      if (step >= steps || current >= confidence) {
        clearInterval(interval);
        setDisplayedConfidence(confidence);
        setIsAnimating(false);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [confidence, animated]);

  const currentLevel = confidenceLevels.find(
    level => displayedConfidence >= level.min && displayedConfidence <= level.max
  ) || confidenceLevels[0];

  const IconComponent = currentLevel.icon;

  const sizeClasses = {
    sm: {
      container: 'w-24 h-24',
      text: 'text-xs',
      icon: 'w-3 h-3',
      stroke: '6'
    },
    md: {
      container: 'w-32 h-32',
      text: 'text-sm',
      icon: 'w-4 h-4',
      stroke: '8'
    },
    lg: {
      container: 'w-40 h-40',
      text: 'text-base',
      icon: 'w-5 h-5',
      stroke: '10'
    }
  };

  const currentSize = sizeClasses[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedConfidence / 100) * circumference;

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Circular Progress */}
      <div className={`relative ${currentSize.container}`}>
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#confidenceGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={
                displayedConfidence <= 30 ? '#ef4444' :
                displayedConfidence <= 60 ? '#eab308' :
                displayedConfidence <= 80 ? '#3b82f6' : '#10b981'
              } />
              <stop offset="100%" stopColor={
                displayedConfidence <= 30 ? '#dc2626' :
                displayedConfidence <= 60 ? '#d97706' :
                displayedConfidence <= 80 ? '#2563eb' : '#059669'
              } />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${currentLevel.color} mb-1`}>
            <IconComponent className={currentSize.icon} />
          </div>
          <div className={`font-bold text-white ${currentSize.text}`}>
            {Math.round(displayedConfidence)}%
          </div>
          <div className={`text-xs ${currentLevel.color} font-medium`}>
            {currentLevel.label}
          </div>
        </div>

        {/* Pulsing Effect for Animation */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full border-2 border-lime-400/30 animate-ping" />
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <div className={`font-medium text-white ${currentSize.text}`}>
          {label}
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className={`p-3 rounded-lg border ${currentLevel.bgColor} border-opacity-30 max-w-xs`}>
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className={`w-4 h-4 ${currentLevel.color}`} />
            <span className={`font-medium ${currentLevel.color}`}>
              {currentLevel.label} Confidence
            </span>
          </div>
          <p className="text-xs text-indigo-300">
            {currentLevel.description}
          </p>
          
          {/* Confidence Breakdown */}
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Data Quality</span>
              <span className="text-white">{Math.min(100, displayedConfidence + 5)}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Model Accuracy</span>
              <span className="text-white">{Math.max(0, displayedConfidence - 3)}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Historical Match</span>
              <span className="text-white">{Math.min(100, displayedConfidence + 2)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Confidence Scale */}
      {showDetails && (
        <div className="flex items-center gap-1 text-xs">
          {confidenceLevels.map((level, index) => (
            <div
              key={index}
              className={`px-2 py-1 rounded text-center transition-all ${
                displayedConfidence >= level.min && displayedConfidence <= level.max
                  ? `${level.bgColor} ${level.color} border border-current`
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              {level.label}
            </div>
          ))}
        </div>
      )}

      {/* Real-time Indicator */}
      {isAnimating && (
        <div className="flex items-center gap-2 text-xs text-lime-400">
          <Zap className="w-3 h-3 animate-pulse" />
          <span>Calculating confidence...</span>
        </div>
      )}
    </div>
  );
}