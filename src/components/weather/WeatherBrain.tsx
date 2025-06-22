
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, Shield } from 'lucide-react';
import { weatherService } from '@/services/weatherService';

interface WeatherBrainProps {
  onWeatherRisk: (risk: 'low' | 'medium' | 'high') => void;
}

export const WeatherBrain: React.FC<WeatherBrainProps> = ({ onWeatherRisk }) => {
  const [weather, setWeather] = useState<any>(null);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Default coordinates for Nairobi (major logistics hub)
        const weatherData = await weatherService.getWeather(-1.2921, 36.8219);
        setWeather(weatherData);
        
        const assessedRisk = weatherService.assessRisk(weatherData);
        setRisk(assessedRisk);
        onWeatherRisk(assessedRisk);
      } catch (error) {
        console.error('Weather fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, [onWeatherRisk]);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      default: return 'text-green-400';
    }
  };

  const getRiskIcon = () => {
    switch (risk) {
      case 'high': return <AlertTriangle className="text-red-400" />;
      case 'medium': return <Wind className="text-amber-400" />;
      default: return <Shield className="text-green-400" />;
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="text-blue-400" />
          <span>Weather Brain</span>
          <div className="ml-2 flex items-center">
            {getRiskIcon()}
            <span className={`ml-1 text-sm ${getRiskColor(risk)}`}>
              {risk.toUpperCase()} RISK
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : weather ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Sun className="text-yellow-400" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="font-mono">{weather.temp}°C</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wind className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">Wind Speed</p>
                <p className="font-mono">{weather.wind_speed} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CloudRain className="text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-mono">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Cloud className="text-gray-400" />
              <div>
                <p className="text-xs text-muted-foreground">Conditions</p>
                <p className="font-mono text-xs">{weather.weather[0].description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Cloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Weather data unavailable</p>
          </div>
        )}
        
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Route Impact</span>
            <span className={`text-sm font-medium ${getRiskColor(risk)}`}>
              {risk === 'high' ? 'Consider delays' : 
               risk === 'medium' ? 'Monitor closely' : 
               'Clear for transit'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
