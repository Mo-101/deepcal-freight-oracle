import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Compass, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapContainer } from '@/components/tracker/MapContainer';

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: Date;
  status: 'in-transit' | 'checkpoint' | 'delay' | 'completed';
}

interface EagleEyeTrackerProps {
  routeId: string;
  onCheckIn: (location: { lat: number; lng: number }) => void;
}

export const EagleEyeTracker: React.FC<EagleEyeTrackerProps> = ({ routeId, onCheckIn }) => {
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [eta, setEta] = useState<string>('Calculating...');
  const { position, error } = useGeolocation();
  const mapRef = useRef<any>(null);

  // Simulate route updates
  useEffect(() => {
    if (position) {
      const newPoint: RoutePoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date(),
        status: 'in-transit'
      };
      
      setRoutePoints(prev => [...prev, newPoint]);
      
      // Calculate ETA based on distance and speed
      if (routePoints.length > 1) {
        const lastPoint = routePoints[routePoints.length - 1];
        const distance = calculateDistance(
          lastPoint.lat, lastPoint.lng,
          newPoint.lat, newPoint.lng
        );
        
        const timeDiff = (newPoint.timestamp.getTime() - lastPoint.timestamp.getTime()) / 1000;
        const speed = distance / timeDiff; // km/s
        
        // Simplified ETA calculation
        const remainingDistance = 100; // TODO: Replace with actual destination distance
        const remainingTime = remainingDistance / speed;
        setEta(formatDuration(remainingTime));
      }
    }
  }, [position]);

  const handleCheckIn = () => {
    if (position) {
      onCheckIn({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Compass className="text-cyan-400" />
          <span>Eagle-Eye Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="text-green-400" />
            <div>
              <p className="text-xs text-muted-foreground">Current Location</p>
              <p className="font-mono">
                {position ? `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` : 'Acquiring...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Arrival</p>
              <p className="font-mono">{eta}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-emerald-400" />
            <div>
              <p className="text-xs text-muted-foreground">Last Check-in</p>
              <p className="font-mono">
                {routePoints.length > 0 ? 
                  routePoints[routePoints.length - 1].timestamp.toLocaleTimeString() : 
                  'None'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-64 rounded-lg overflow-hidden border border-slate-700">
          <MapContainer 
            ref={mapRef}
            routePoints={routePoints}
            currentPosition={position}
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={handleCheckIn}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Check In</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Simplified distance calculation
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Approx km
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
