import { toast } from 'sonner';

interface WeatherResponse {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export const weatherService = {
  async getWeather(lat: number, lng: number): Promise<WeatherResponse> {
    // In a real implementation, this would call the OpenWeather API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
          ]
        });
        
        toast.success('Weather data fetched', {
          description: `For coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      }, 1500);
    });
  },
  
  assessRisk(weather: WeatherResponse): 'low' | 'medium' | 'high' {
    if (weather.weather[0].main === 'Rain' && weather.weather[0].description.includes('heavy')) {
      return 'high';
    } else if (weather.wind_speed > 15 || weather.weather[0].main === 'Thunderstorm') {
      return 'high';
    } else if (weather.weather[0].main === 'Rain' || weather.wind_speed > 10) {
      return 'medium';
    }
    return 'low';
  }
};
