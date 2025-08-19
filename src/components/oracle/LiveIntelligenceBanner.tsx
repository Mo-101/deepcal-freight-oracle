import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Activity, 
  TrendingUp,
  Database,
  Wifi,
  Eye,
  Sparkles,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LiveIntelligenceBannerProps {
  isActive?: boolean;
  status?: 'analyzing' | 'processing' | 'complete' | 'error' | 'idle';
  message?: string;
  confidence?: number;
  className?: string;
}

const statusConfig = {
  analyzing: {
    icon: Brain,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    message: 'Analyzing freight patterns...',
    pulse: true
  },
  processing: {
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    message: 'Processing optimization algorithms...',
    pulse: true
  },
  complete: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    message: 'Analysis complete - Results ready',
    pulse: false
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    message: 'Analysis encountered an error',
    pulse: false
  },
  idle: {
    icon: Eye,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/30',
    message: 'Oracle ready for analysis',
    pulse: false
  }
};

const intelligenceMetrics = [
  { label: 'Data Points', value: '2.4M', icon: Database },
  { label: 'Models Active', value: '12', icon: Brain },
  { label: 'Accuracy', value: '94.2%', icon: TrendingUp },
  { label: 'Live Feed', value: 'ON', icon: Wifi }
];

export default function LiveIntelligenceBanner({ 
  isActive = false,
  status = 'idle',
  message,
  confidence,
  className = ""
}: LiveIntelligenceBannerProps) {
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);
  const [showMetrics, setShowMetrics] = useState(false);

  const config = statusConfig[status];
  const IconComponent = config.icon;
  const displayMessage = message || config.message;

  // Cycle through metrics
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentMetricIndex(prev => (prev + 1) % intelligenceMetrics.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Show metrics after a delay
  useEffect(() => {
    if (isActive) {
      const timeout = setTimeout(() => {
        setShowMetrics(true);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setShowMetrics(false);
    }
  }, [isActive]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main Banner */}
      <div className={`
        relative p-4 rounded-lg border backdrop-blur-sm transition-all duration-500
        ${config.bgColor} ${config.borderColor}
        ${isActive ? 'shadow-lg' : ''}
      `}>
        {/* Background Animation */}
        {isActive && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-lime-400/20 rounded-full animate-ping" />
            <div className="absolute top-1/2 -left-1 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" />
            <div className="absolute bottom-2 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          {/* Status Section */}
          <div className="flex items-center gap-3">
            <div className={`relative ${config.pulse && isActive ? 'animate-pulse' : ''}`}>
              <div className={`w-8 h-8 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
                <IconComponent className={`w-4 h-4 ${config.color}`} />
              </div>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full animate-pulse" />
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">DeepCAL Intelligence</span>
                {isActive && (
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-lime-400 animate-pulse" />
                    <span className="text-xs text-lime-400">LIVE</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-indigo-300">{displayMessage}</p>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="flex items-center gap-4">
            {showMetrics && (
              <div className="flex items-center gap-3 animate-fade-in">
                {intelligenceMetrics.map((metric, index) => {
                  const MetricIcon = metric.icon;
                  const isActive = index === currentMetricIndex;
                  
                  return (
                    <div
                      key={metric.label}
                      className={`
                        flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300
                        ${isActive 
                          ? 'bg-lime-500/20 border-lime-500/40 text-lime-400' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                        }
                      `}
                    >
                      <MetricIcon className="w-3 h-3" />
                      <div className="text-xs">
                        <div className="font-medium">{metric.value}</div>
                        <div className="text-[10px] opacity-75">{metric.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Confidence Display */}
            {confidence !== undefined && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">
                  {confidence}% confident
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isActive && (status === 'analyzing' || status === 'processing') && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-lime-400 animate-pulse" 
                 style={{ width: '60%' }} />
          </div>
        )}
      </div>

      {/* Floating Particles */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-slow"
              style={{
                left: `${10 + i * 20}%`,
                top: `${20 + (i % 2) * 60}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: '4s'
              }}
            >
              <div className={`w-1 h-1 rounded-full ${
                i % 3 === 0 ? 'bg-blue-400/30' :
                i % 3 === 1 ? 'bg-lime-400/30' : 'bg-purple-400/30'
              }`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add custom animations
const style = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
    50% { transform: translateY(-15px) rotate(180deg); opacity: 0.8; }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  .animate-float-slow {
    animation: float-slow 4s ease-in-out infinite;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('live-intelligence-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'live-intelligence-styles';
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
}