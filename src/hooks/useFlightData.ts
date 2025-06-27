
import { useState, useEffect } from 'react';
import { flightService } from '@/services/flightService';

export const useFlightData = (origin: string, destination: string, modeOfShipment: string) => {
  const [flightData, setFlightData] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modeOfShipment === 'Air' && origin && destination) {
      const fetchFlightData = async () => {
        setIsLoading(true);
        try {
          const flights = await flightService.getFlightsByRoute(origin, destination);
          const weather = await flightService.getAirportWeather(origin);
          setFlightData(flights);
          setWeatherData(weather);
        } catch (error) {
          console.error('Failed to fetch flight data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchFlightData();
    }
  }, [origin, destination, modeOfShipment]);

  return {
    flightData,
    weatherData,
    isLoading
  };
};
