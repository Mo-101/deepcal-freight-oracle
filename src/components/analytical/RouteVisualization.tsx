
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Clock, DollarSign } from 'lucide-react';

interface RouteVisualizationProps {
  origin: string;
  destination: string;
  bestForwarder: string;
  routeScore: number;
  enhanced?: boolean;
}

export const RouteVisualization: React.FC<RouteVisualizationProps> = ({
  origin,
  destination,
  bestForwarder,
  routeScore,
  enhanced = false
}) => {
  const [truckPosition, setTruckPosition] = useState(0);
  const [pulseNodes, setPulseNodes] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTruckPosition(prev => (prev + 1) % 100);
    }, 100);

    const pulseTimer = setInterval(() => {
      setPulseNodes(prev => !prev);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  // Mock route data
  const routeDistance = 2100; // km
  const estimatedTime = 5.2; // days
  const estimatedCost = 36189; // USD

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-rose-400" />
          Optimal Route Visualization
          {enhanced && <Badge variant="outline" className="ml-2">Real-time</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Route Map */}
          <div className="relative h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-slate-700">
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(126,34,206,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(126,34,206,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Origin node */}
            <div 
              className={`absolute w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${
                pulseNodes ? 'scale-125 shadow-green-400/50' : ''
              }`}
              style={{ left: '15%', top: '40%' }}
            >
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-400 whitespace-nowrap">
                {origin}
              </div>
            </div>
            
            {/* Destination node */}
            <div 
              className={`absolute w-4 h-4 bg-red-400 rounded-full border-2 border-white shadow-lg transition-all duration-300 ${
                pulseNodes ? 'scale-125 shadow-red-400/50' : ''
              }`}
              style={{ left: '75%', top: '65%' }}
            >
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-red-400 whitespace-nowrap">
                {destination}
              </div>
            </div>
            
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                </linearGradient>
                
                {enhanced && (
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                )}
              </defs>
              
              <path
                d="M 15% 40% Q 45% 20% 75% 65%"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3"
                strokeDasharray="5,5"
                filter={enhanced ? "url(#glow)" : undefined}
                className="animate-pulse"
              />
            </svg>
            
            {/* Moving truck */}
            <div 
              className="absolute w-6 h-6 text-deepcal-light transition-all duration-100"
              style={{
                left: `${15 + (truckPosition / 100) * 60}%`,
                top: `${40 + Math.sin((truckPosition / 100) * Math.PI) * -15 + (truckPosition / 100) * 25}%`,
                transform: `translate(-50%, -50%) rotate(${25 + Math.sin((truckPosition / 100) * Math.PI * 2) * 10}deg)`
              }}
            >
              <Truck className="w-full h-full drop-shadow-lg" />
            </div>
            
            {/* Route stats overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  <span>{routeDistance} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{estimatedTime}d est.</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span>${(estimatedCost/1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-sm mb-2 text-green-400">Origin Hub</h4>
              <div className="text-xs space-y-1">
                <div>📍 {origin}</div>
                <div>🚛 Pickup scheduled</div>
                <div>📦 Cargo verified</div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-sm mb-2 text-purple-400">Transit Corridor</h4>
              <div className="text-xs space-y-1">
                <div>🛣️ Great North Road</div>
                <div>🔒 {bestForwarder}</div>
                <div>⚡ Score: {(routeScore * 100).toFixed(0)}%</div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-sm mb-2 text-red-400">Destination</h4>
              <div className="text-xs space-y-1">
                <div>🎯 {destination}</div>
                <div>⏱️ ETA: {estimatedTime} days</div>
                <div>✅ Customs pre-cleared</div>
              </div>
            </div>
          </div>
          
          {enhanced && (
            <div className="border border-deepcal-purple/30 rounded-lg p-4 bg-deepcal-dark/20">
              <h4 className="font-semibold text-sm mb-2">Live Route Intelligence</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Traffic density:</span>
                    <span className="text-green-400">Low (12%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weather impact:</span>
                    <span className="text-blue-400">Minimal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Border status:</span>
                    <span className="text-green-400">Open 24/7</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Fuel availability:</span>
                    <span className="text-green-400">Normal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security level:</span>
                    <span className="text-amber-400">Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity util:</span>
                    <span className="text-blue-400">78%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
