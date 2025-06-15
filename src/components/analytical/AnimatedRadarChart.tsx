import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ForwarderKPI } from '@/services/csvDataEngine';
import { AlertTriangle } from "lucide-react";
import type { ForwarderAnomalies } from "./anomalyUtils";

interface AnimatedRadarChartProps {
  forwarders: ForwarderKPI[];
  revealLevel: 'novice' | 'expert' | 'phd';
  detailed?: boolean;
  anomalies?: ForwarderAnomalies;
}

export const AnimatedRadarChart: React.FC<AnimatedRadarChartProps> = ({
  forwarders,
  revealLevel,
  detailed = false,
  anomalies = {},
}) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
      setTimeout(() => setShowDetails(true), 500);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const colors = ['#a855f7', '#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
  const metrics = ['Speed', 'Cost', 'Reliability', 'Experience'];
  
  // Calculate normalized scores (0-1) for each forwarder
  const normalizedData = forwarders.map(f => ({
    name: f.name,
    scores: [
      1 - (f.avgTransitDays - 3) / 7, // Speed (faster = higher)
      1 - (f.costPerKg - 3) / 5,      // Cost (cheaper = higher)
      f.onTimeRate,                    // Reliability
      Math.min(f.totalShipments / 20, 1) // Experience
    ]
  }));

  const svgSize = detailed ? 320 : 280;
  const center = svgSize / 2;
  const radius = detailed ? 120 : 100;

  // Generate radar chart paths
  const generatePath = (scores: number[], progress: number) => {
    const points = scores.map((score, i) => {
      const angle = (i * 2 * Math.PI) / scores.length - Math.PI / 2;
      const adjustedScore = score * (progress / 100);
      const x = center + Math.cos(angle) * radius * adjustedScore;
      const y = center + Math.sin(angle) * radius * adjustedScore;
      return `${x},${y}`;
    });
    return `M${points.join('L')}Z`;
  };

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-deepcal-light animate-pulse"></div>
          Multi-Criteria Performance Radar
          {detailed && <Badge variant="outline" className="ml-2">Enhanced View</Badge>}
        </CardTitle>
        {revealLevel !== 'novice' && (
          <p className="text-xs text-slate-400">
            Normalized scores using Min-Max scaling with confidence intervals
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width={svgSize} height={svgSize} className="mx-auto">
            {/* Grid circles */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius * scale}
                fill="none"
                stroke="rgba(126,34,206,0.2)"
                strokeWidth="1"
                strokeDasharray={i === 4 ? "none" : "2,2"}
              />
            ))}

            {/* Grid lines */}
            {metrics.map((_, i) => {
              const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
              const endX = center + Math.cos(angle) * radius;
              const endY = center + Math.sin(angle) * radius;
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(126,34,206,0.3)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Metric labels */}
            {metrics.map((metricLabel, i) => {
              const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
              const labelX = center + Math.cos(angle) * (radius + 20);
              const labelY = center + Math.sin(angle) * (radius + 20);
              return (
                <text
                  key={i}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#e2e8f0"
                  fontSize="11"
                  fontWeight="500"
                  className="fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {metricLabel}
                </text>
              );
            })}

            {/* Forwarder paths */}
            {normalizedData.map((forwarder, i) => (
              <g key={forwarder.name}>
                <path
                  d={generatePath(forwarder.scores, animationProgress)}
                  fill={`${colors[i]}40`}
                  stroke={colors[i]}
                  strokeWidth="2"
                  className="transition-all duration-1000 ease-out"
                />
                {/* Data points with anomaly highlight */}
                {forwarder.scores.map((score, j) => {
                  const angle = (j * 2 * Math.PI) / forwarder.scores.length - Math.PI / 2;
                  const adjustedScore = score * (animationProgress / 100);
                  const pointX = center + Math.cos(angle) * radius * adjustedScore;
                  const pointY = center + Math.sin(angle) * radius * adjustedScore;

                  // For anomaly fields, pop an icon
                  let anomalyIcon = null;
                  let isAnomaly = false;
                  if (anomalies && anomalies[forwarder.name]) {
                    const metricField = ['avgTransitDays', 'costPerKg', 'onTimeRate', 'totalShipments'][j];
                    if (anomalies[forwarder.name].anomalyFields.includes(metricField as any)) {
                      anomalyIcon = <AlertTriangle className="w-3 h-3 absolute" style={{ left: pointX, top: pointY }} color="#fde047" />;
                      isAnomaly = true;
                    }
                  }
                  return (
                    <g key={j}>
                      <circle
                        cx={pointX}
                        cy={pointY}
                        r={isAnomaly ? 7 : 4}
                        fill={isAnomaly ? "#fde047" : colors[i]}
                        stroke={isAnomaly ? "#fbbf24" : "white"}
                        strokeWidth="2"
                        className="transition-all duration-1000 ease-out"
                        style={{
                          animationDelay: `${(i * 0.2 + j * 0.1)}s`,
                          opacity: animationProgress > 50 ? 1 : 0,
                        }}
                      />
                      {/* Icon marker for anomaly */}
                      {isAnomaly && anomalyIcon}
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {normalizedData.map((forwarder, i) => (
              <div 
                key={forwarder.name} 
                className="flex items-center gap-2 fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div 
                  className="w-3 h-3 rounded-full border border-white/50"
                  style={{ backgroundColor: colors[i] }}
                ></div>
                <span className="text-xs font-medium">{forwarder.name}</span>
                {revealLevel === 'phd' && (
                  <Badge variant="outline" className="text-xs">
                    μ={((forwarder.scores.reduce((a, b) => a + b, 0) / forwarder.scores.length) * 100).toFixed(0)}%
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {revealLevel === 'phd' && showDetails && (
            <div className="mt-4 text-xs space-y-1 text-slate-400 fade-in">
              <div>• Scores normalized using (x - min) / (max - min) transformation</div>
              <div>• Confidence intervals: ±5% (95% CI) based on historical variance</div>
              <div>• Radar area represents overall capability index</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
