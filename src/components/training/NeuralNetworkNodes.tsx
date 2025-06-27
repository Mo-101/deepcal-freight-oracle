
import React from 'react';

interface NeuralNetworkNodesProps {
  trainingProgress: number; // 0-100
  accuracy: number; // 0-100
  isTraining: boolean;
  samples: number;
}

export const NeuralNetworkNodes: React.FC<NeuralNetworkNodesProps> = ({ 
  trainingProgress, 
  accuracy, 
  isTraining, 
  samples 
}) => {
  // Calculate node states based on training metrics
  const knowledgeLevel = Math.min(accuracy / 100, 1);
  const trainingIntensity = isTraining ? 1 : 0.3;
  const networkGrowth = Math.min(trainingProgress / 100, 1);

  // Node colors based on knowledge level
  const getNodeColor = (layerIndex: number, nodeIndex: number) => {
    const baseIntensity = knowledgeLevel * 0.8 + 0.2;
    if (accuracy < 50) return `rgba(255, 68, 68, ${baseIntensity})`;
    if (accuracy < 80) return `rgba(255, 170, 68, ${baseIntensity})`;
    return `rgba(68, 255, 136, ${baseIntensity})`;
  };

  // Connection strength based on training progress
  const getConnectionOpacity = () => {
    return 0.2 + (networkGrowth * 0.6);
  };

  return (
    <div className="w-24 h-24 mx-auto relative">
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        className="absolute inset-0"
      >
        {/* Background glow effect */}
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          
          <filter id="pulse">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Neural Network Connections */}
        {/* Input to Hidden Layer 1 */}
        <g strokeOpacity={getConnectionOpacity()}>
          <line x1="16" y1="20" x2="48" y2="35" stroke="#00ffff" strokeWidth="1">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
            )}
          </line>
          <line x1="16" y1="48" x2="48" y2="35" stroke="#00ffff" strokeWidth="1">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.2s" repeatCount="indefinite" />
            )}
          </line>
          <line x1="16" y1="76" x2="48" y2="35" stroke="#00ffff" strokeWidth="1">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="1.8s" repeatCount="indefinite" />
            )}
          </line>
          
          <line x1="16" y1="20" x2="48" y2="61" stroke="#00ffff" strokeWidth="1">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.1s" repeatCount="indefinite" />
            )}
          </line>
          <line x1="16" y1="48" x2="48" y2="61" stroke="#00ffff" strokeWidth="1">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="1.9s" repeatCount="indefinite" />
            )}
          </line>
          <line x1="16" y1="76" x2="48" y2="61" stroke="#00ffff" strokeWidth="1">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="2.3s" repeatCount="indefinite" />
            )}
          </line>
        </g>

        {/* Hidden Layer 1 to Output */}
        <g strokeOpacity={getConnectionOpacity()}>
          <line x1="48" y1="35" x2="80" y2="48" stroke="#44ff88" strokeWidth="2">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            )}
          </line>
          <line x1="48" y1="61" x2="80" y2="48" stroke="#44ff88" strokeWidth="2">
            {isTraining && (
              <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1.7s" repeatCount="indefinite" />
            )}
          </line>
        </g>

        {/* Input Layer Nodes */}
        <g>
          <circle cx="16" cy="20" r="4" fill={getNodeColor(0, 0)} filter="url(#pulse)">
            {isTraining && (
              <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="16" cy="48" r="4" fill={getNodeColor(0, 1)} filter="url(#pulse)">
            {isTraining && (
              <animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="16" cy="76" r="4" fill={getNodeColor(0, 2)} filter="url(#pulse)">
            {isTraining && (
              <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* Hidden Layer Nodes */}
        <g>
          <circle cx="48" cy="35" r="5" fill={getNodeColor(1, 0)} filter="url(#pulse)">
            {isTraining && (
              <animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx="48" cy="61" r="5" fill={getNodeColor(1, 1)} filter="url(#pulse)">
            {isTraining && (
              <animate attributeName="r" values="5;8;5" dur="1.7s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* Output Layer Node */}
        <g>
          <circle cx="80" cy="48" r="6" fill={getNodeColor(2, 0)} filter="url(#pulse)">
            {isTraining && (
              <animate attributeName="r" values="6;10;6" dur="1.2s" repeatCount="indefinite" />
            )}
          </circle>
        </g>

        {/* Data Flow Particles (only during training) */}
        {isTraining && (
          <g>
            <circle r="1.5" fill="#00ffff" opacity="0.8">
              <animateMotion dur="3s" repeatCount="indefinite">
                <path d="M16,20 Q32,27 48,35" />
              </animateMotion>
            </circle>
            <circle r="1.5" fill="#00ffff" opacity="0.8">
              <animateMotion dur="3.2s" repeatCount="indefinite">
                <path d="M16,48 Q32,41 48,35" />
              </animateMotion>
            </circle>
            <circle r="1.5" fill="#44ff88" opacity="0.8">
              <animateMotion dur="2.5s" repeatCount="indefinite">
                <path d="M48,35 Q64,41 80,48" />
              </animateMotion>
            </circle>
          </g>
        )}

        {/* Knowledge Growth Indicator */}
        <g>
          <circle 
            cx="48" 
            cy="48" 
            r="35" 
            fill="none" 
            stroke="url(#nodeGlow)" 
            strokeWidth="1" 
            strokeOpacity={knowledgeLevel * 0.3}
          >
            {isTraining && (
              <animate attributeName="r" values="35;38;35" dur="4s" repeatCount="indefinite" />
            )}
          </circle>
        </g>
      </svg>

      {/* Status indicators */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              isTraining ? 'bg-green-400' : 'bg-blue-400'
            }`}
          >
            {isTraining && (
              <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {samples > 1000 ? `${Math.floor(samples/1000)}k` : samples}
          </span>
        </div>
      </div>
    </div>
  );
};
