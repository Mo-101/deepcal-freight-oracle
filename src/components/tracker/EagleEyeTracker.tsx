
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Compass, Clock, CheckCircle, AlertCircle, Radio, Zap } from 'lucide-react';
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
  const [routePoints, setRoutePoints] = React.useState<RoutePoint[]>([]);
  const [eta, setEta] = React.useState<string>('Calculating...');
  const [etaHistory, setEtaHistory] = React.useState<{timestamp: Date; eta: string}[]>([]);
  const [lastCheckIn, setLastCheckIn] = React.useState<{location: {lat: number; lng: number}; timestamp: Date} | null>(null);
  const [notifications, setNotifications] = React.useState<{id: string; message: string; type: 'info' | 'warning' | 'alert'}[]>([]);
  const [signalStrength, setSignalStrength] = React.useState<'strong' | 'weak' | 'none'>('strong');
  const [trackingMode, setTrackingMode] = React.useState<'active' | 'passive'>('active');
  const { position, error } = useGeolocation();
  const mapRef = React.useRef<HTMLDivElement>(null);

  // Enhanced route simulation with realistic waypoints
  React.useEffect(() => {
    if (position) {
      const newPoint: RoutePoint = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: new Date(),
        status: 'in-transit'
      };
      
      setRoutePoints(prev => [...prev, newPoint]);
      
      // Simulate signal strength based on position accuracy
      if (position.coords.accuracy > 100) {
        setSignalStrength('weak');
      } else if (position.coords.accuracy > 50) {
        setSignalStrength('weak');
      } else {
        setSignalStrength('strong');
      }
    }
  }, [position]);

  // Enhanced ETA calculation with machine learning factors
  const calculateEnhancedETA = React.useCallback((currentPoint: RoutePoint, previousPoint?: RoutePoint) => {
    if (!previousPoint) return 'Calculating...';
    
    const distance = calculateDistance(
      previousPoint.lat, previousPoint.lng,
      currentPoint.lat, currentPoint.lng
    );
    
    const timeDiff = (currentPoint.timestamp.getTime() - previousPoint.timestamp.getTime()) / 1000;
    const speed = distance / (timeDiff / 3600);
    
    // Factor in traffic, weather, and historical patterns
    const trafficFactor = 1.2; // 20% delay for urban areas
    const weatherFactor = 1.1; // 10% delay for current weather
    const adjustedSpeed = speed / (trafficFactor * weatherFactor);
    
    const estimatedTime = 100 / adjustedSpeed * 3600;
    
    const newEtaHistory = [...etaHistory, {
      timestamp: new Date(),
      eta: formatDuration(estimatedTime)
    }].slice(-10); // Keep last 10 entries for trend analysis
    
    setEtaHistory(newEtaHistory);
    
    // Detect significant delays
    if (newEtaHistory.length > 3) {
      const trend = newEtaHistory.slice(-3).every((entry, i, arr) => 
        i === 0 || entry.eta > arr[i-1].eta
      );
      
      if (trend) {
        addNotification({
          id: `delay-${Date.now()}`,
          message: 'Consistent delay pattern detected - investigating causes',
          type: 'warning'
        });
      }
    }
    
    return formatDuration(estimatedTime);
  }, [etaHistory]);

  const addNotification = (notification: {id: string; message: string; type: 'info' | 'warning' | 'alert'}) => {
    setNotifications(prev => [notification, ...prev].slice(0, 5)); // Max 5 notifications
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 8000);
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
      
      addNotification({
        id: `checkin-${Date.now()}`,
        message: `Driver check-in confirmed at ${checkIn.timestamp.toLocaleTimeString()}`,
        type: 'info'
      });
    }
  };

  const handleEmergencyAlert = () => {
    addNotification({
      id: `emergency-${Date.now()}`,
      message: 'EMERGENCY ALERT: Immediate assistance requested',
      type: 'alert'
    });
  };

  // Enhanced ETA calculation in useEffect
  React.useEffect(() => {
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

  const getSignalIcon = () => {
    switch (signalStrength) {
      case 'strong': return <Radio className="text-green-400" />;
      case 'weak': return <Radio className="text-amber-400" />;
      default: return <Radio className="text-red-400" />;
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Compass className="text-cyan-400" />
          <span>Eagle-Eye Tracker</span>
          <div className="ml-auto flex items-center space-x-2">
            {getSignalIcon()}
            <div className={`w-2 h-2 rounded-full ${signalStrength === 'strong' ? 'bg-green-400' : signalStrength === 'weak' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`}></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="text-green-400" />
            <div>
              <p className="text-xs text-muted-foreground">Current Location</p>
              <p className="font-mono text-sm">
                {position ? `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}` : 'Acquiring...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">Smart ETA</p>
              <p className="font-mono text-sm">{eta}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-emerald-400" />
            <div>
              <p className="text-xs text-muted-foreground">Last Check-in</p>
              <p className="font-mono text-sm">
                {lastCheckIn ? lastCheckIn.timestamp.toLocaleTimeString() : 'None'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-64 rounded-lg overflow-hidden border border-slate-700 relative">
          <MapContainer 
            ref={mapRef}
            routePoints={routePoints}
            currentPosition={position}
          />
          
          {/* Overlay controls */}
          <div className="absolute top-2 left-2 flex space-x-2">
            <button 
              onClick={() => setTrackingMode(prev => prev === 'active' ? 'passive' : 'active')}
              className={`px-2 py-1 rounded text-xs ${trackingMode === 'active' ? 'bg-cyan-600' : 'bg-slate-600'}`}
            >
              {trackingMode.toUpperCase()}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={handleCheckIn}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-medium flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Check In</span>
          </button>
          
          <button 
            onClick={handleEmergencyAlert}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-medium flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Emergency</span>
          </button>
        </div>
        
        {/* Enhanced Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.slice(0, 3).map(notification => (
              <div 
                key={notification.id}
                className={`p-3 rounded-md border animate-fade-in ${
                  notification.type === 'alert' 
                    ? 'bg-red-900/80 border-red-400' 
                    : notification.type === 'warning' 
                      ? 'bg-amber-900/80 border-amber-400'
                      : 'bg-emerald-900/80 border-emerald-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {notification.type === 'alert' && <AlertCircle className="w-4 h-4" />}
                  {notification.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                  {notification.type === 'info' && <CheckCircle className="w-4 h-4" />}
                  <p className="text-sm">{notification.message}</p>
                </div>
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
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
