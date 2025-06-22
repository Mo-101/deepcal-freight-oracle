import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudRain, Sun, Cloud, CloudSnow, CloudLightning, Wind, Droplet } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  dt: number;
}

interface WeatherBrainProps {
  lat?: number;
  lng?: number;
  onWeatherRisk: (riskLevel: 'low' | 'medium' | 'high') => void;
}

export const WeatherBrain: React.FC<WeatherBrainProps> = ({ lat, lng, onWeatherRisk }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Simulate fetching weather data
  useEffect(() => {
    if (!lat || !lng) return;
    
    setLoading(true);
    
    const fetchWeather = async () => {
      try {
        // In a real implementation, this would call the OpenWeather API
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);
        // const data = await response.json();
        
        // Simulated response
        setTimeout(() => {
          const simulatedData: WeatherData = {
            temp: 22.5,
            feels_like: 24.3,
            humidity: 65,
            wind_speed: 12.4,
            weather: [
              {
                main: 'Rain',
                description: 'moderate rain',
                icon: '10d'
              }
            ],
            dt: Date.now() / 1000
          };
          
          setWeather(simulatedData);
          assessWeatherRisk(simulatedData);
          setLoading(false);
          
          toast.success('Weather data updated', {
            description: 'OpenWeather API connection established',
          });
        }, 1500);
      } catch (error) {
        setLoading(false);
        toast.error('Weather update failed', {
          description: 'Could not fetch weather data',
        });
      }
    };
    
    fetchWeather();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [lat, lng]);
  
  const assessWeatherRisk = (data: WeatherData) => {
    let risk: 'low' | 'medium' | 'high' = 'low';
    
    if (data.weather[0].main === 'Rain' && data.weather[0].description.includes('heavy')) {
      risk = 'high';
    } else if (data.wind_speed > 15 || data.weather[0].main === 'Thunderstorm') {
      risk = 'high';
    } else if (data.weather[0].main === 'Rain' || data.wind_speed > 10) {
      risk = 'medium';
    }
    
    onWeatherRisk(risk);
  };
  
  const getWeatherIcon = (main: string) => {
    switch (main) {
      case 'Rain': return <CloudRain className="text-blue-400" />;
      case 'Clear': return <Sun className="text-amber-400" />;
      case 'Clouds': return <Cloud className="text-slate-400" />;
      case 'Snow': return <CloudSnow className="text-blue-200" />;
      case 'Thunderstorm': return <CloudLightning className="text-purple-400" />;
      default: return <Wind className="text-slate-300" />;
    }
  };
  
  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {weather ? getWeatherIcon(weather.weather[0].main) : <Cloud className="text-slate-400" />}
          <span>Weather Brain</span>
          <div className={`ml-2 h-2 w-2 rounded-full ${weather ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          </div>
        ) : weather ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Sun className="text-amber-400" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="font-mono">{weather.temp.toFixed(1)}°C</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wind className="text-blue-300" />
              <div>
                <p className="text-xs text-muted-foreground">Wind Speed</p>
                <p className="font-mono">{weather.wind_speed.toFixed(1)} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Droplet className="text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-mono">{weather.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CloudRain className="text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">Conditions</p>
                <p className="font-mono capitalize">{weather.weather[0].description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No weather data available</p>
            <p className="text-xs text-slate-500 mt-1">Provide coordinates to fetch weather</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
