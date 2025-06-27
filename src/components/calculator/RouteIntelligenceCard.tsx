
import React from 'react';

interface RouteIntelligenceProps {
  routeIntelligence: {
    distance: string;
    corridor: string;
    borderRisk: string;
    weather: string;
    mode?: string;
  };
}

const RouteIntelligenceCard: React.FC<RouteIntelligenceProps> = ({ routeIntelligence }) => {
  return (
    <div>
      <h3 className="font-semibold text-deepcal-light mb-2">📍 Route Intelligence</h3>
      <div className="text-sm grid grid-cols-2 gap-2">
        <div>Distance: <span className="font-mono">{routeIntelligence.distance}</span></div>
        <div>Corridor: <span className="font-mono text-xs">{routeIntelligence.corridor}</span></div>
        <div>Border Risk: <span>{routeIntelligence.borderRisk}</span></div>
        <div>Weather: <span>{routeIntelligence.weather}</span></div>
        <div>Mode: <span className="font-mono">{routeIntelligence.mode}</span></div>
      </div>
    </div>
  );
};

export default RouteIntelligenceCard;
