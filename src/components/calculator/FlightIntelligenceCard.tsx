
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Cloud, Clock, AlertTriangle } from 'lucide-react';
import { useFlightData } from '@/hooks/useFlightData';

interface FlightIntelligenceCardProps {
  origin: string;
  destination: string;
  modeOfShipment: string;
}

const FlightIntelligenceCard: React.FC<FlightIntelligenceCardProps> = ({
  origin,
  destination,
  modeOfShipment
}) => {
  const { flightData, weatherData, isLoading } = useFlightData(origin, destination, modeOfShipment);

  if (modeOfShipment !== 'Air' || !origin || !destination) {
    return null;
  }

  return (
    <Card className="oracle-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-5 h-5 text-blue-400" />
          Flight Intelligence
          <Badge variant="outline" className="ml-2">Real-time</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-slate-400">Loading flight data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Weather Information */}
            {weatherData && (
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-400" />
                  Current Weather ({origin})
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Temperature: {weatherData.temperature}°C</div>
                  <div>Conditions: {weatherData.conditions}</div>
                  <div>Visibility: {weatherData.visibility}</div>
                  <div>Wind: {weatherData.windSpeed} km/h</div>
                </div>
              </div>
            )}

            {/* Flight Information */}
            {flightData.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  Available Flights
                </h4>
                {flightData.map((flight, index) => (
                  <div key={index} className="border-l-2 border-blue-400 pl-3 mb-3 last:mb-0">
                    <div className="font-mono text-sm font-semibold text-blue-400">
                      {flight.flightId}
                    </div>
                    <div className="text-xs space-y-1">
                      <div>Status: <span className="text-green-400">{flight.status}</span></div>
                      <div>Departure: {new Date(flight.departure.scheduled).toLocaleTimeString()}</div>
                      <div>Arrival: {new Date(flight.arrival.scheduled).toLocaleTimeString()}</div>
                      {flight.arrival.estimated && (
                        <div className="text-amber-400">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Est. Arrival: {new Date(flight.arrival.estimated).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Route Optimization Tips */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="font-semibold text-sm mb-2">Route Optimization</h4>
              <div className="text-xs space-y-1">
                <div>✅ Direct route available</div>
                <div>✅ Favorable weather conditions</div>
                <div>⚠️ Consider booking early for better rates</div>
                <div>💡 Peak cargo season - expect higher demand</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightIntelligenceCard;
