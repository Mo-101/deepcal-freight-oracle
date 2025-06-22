import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [etaHistory, setEtaHistory] = useState<{timestamp: Date; eta: string}[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState<{location: {lat: number; lng: number}; timestamp: Date} | null>(null);
  const [notifications, setNotifications] = useState<{id: string; message: string; type: 'info' | 'warning' | 'alert'}[]>([]);
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
    }
  }, [position]);

  // Memoize ETA calculation function
  const calculateEnhancedETA = useCallback((currentPoint: RoutePoint, previousPoint?: RoutePoint) => {
    if (!previousPoint) return 'Calculating...';
    
    const distance = calculateDistance(
      previousPoint.lat, previousPoint.lng,
      currentPoint.lat, currentPoint.lng
    );
    
    const timeDiff = (currentPoint.timestamp.getTime() - previousPoint.timestamp.getTime()) / 1000; // seconds
    const speed = distance / (timeDiff / 3600); // km/h
    
    // Store ETA history for trend analysis
    const newEtaHistory = [...etaHistory, {
      timestamp: new Date(),
      eta: formatDuration(100 / speed * 3600)
    }].slice(-5); // Keep last 5 entries
    
    setEtaHistory(newEtaHistory);
    
    // Calculate ETA trend
    const trend = newEtaHistory.length > 1 
      ? newEtaHistory[newEtaHistory.length - 1].eta.localeCompare(newEtaHistory[0].eta)
      : 0;
    
    // Add notification if significant delay detected
    if (trend > 0 && newEtaHistory.length > 2) {
      addNotification({
        id: `delay-${Date.now()}`,
        message: 'Potential delay detected - ETA increasing',
        type: 'warning'
      });
    }
    
    return formatDuration(100 / speed * 3600);
  }, [etaHistory]);

  const addNotification = (notification: {id: string; message: string; type: 'info' | 'warning' | 'alert'}) => {
    setNotifications(prev => [notification, ...prev].slice(0, 3)); // Max 3 notifications
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const handleCheckIn = () => {
    if (position) {
      const checkIn = {
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        timestamp: new Date()
      };
      
      setLastCheckIn(checkIn);
      onCheckIn(checkIn.location);
      
      // Add check-in notification
      addNotification({
        id: `checkin-${Date.now()}`,
        message: 'Driver check-in confirmed',
        type: 'info'
      });
    }
  };

  // Enhanced ETA calculation in useEffect
  useEffect(() => {
    if (position && routePoints.length > 1) {
      setEta(calculateEnhancedETA(
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date(),
          status: 'in-transit'
        },
        routePoints[routePoints.length - 1]
      ));
    }
  }, [position, routePoints, calculateEnhancedETA]);

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
                {lastCheckIn ? lastCheckIn.timestamp.toLocaleTimeString() : 'None'}
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
        
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 space-y-2 z-10">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 rounded-md border ${notification.type === 'warning' 
                  ? 'bg-amber-900/80 border-amber-400' 
                  : notification.type === 'alert' 
                    ? 'bg-red-900/80 border-red-400'
                    : 'bg-emerald-900/80 border-emerald-400'}`}
              >
                <p className="text-sm">{notification.message}</p>
              </div>
            ))}
          </div>
        )}
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
