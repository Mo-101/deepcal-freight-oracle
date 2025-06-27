
interface FlightData {
  flightId: string;
  status: string;
  departure: {
    airport: string;
    scheduled: string;
    actual?: string;
  };
  arrival: {
    airport: string;
    scheduled: string;
    estimated?: string;
  };
  route: string[];
}

interface WeatherData {
  temperature: number;
  conditions: string;
  visibility: string;
  windSpeed: number;
  windDirection: number;
}

interface AirportData {
  id: string;
  name: string;
  delays: number;
  weather: WeatherData;
}

const OPENWEATHER_API_KEY = '32b25b6e6eb45b6df18d92b934c332a7';

export const flightService = {
  async getFlightsByRoute(origin: string, destination: string): Promise<FlightData[]> {
    // TODO: Replace with actual FlightAware API call
    // For now, using mock data until FlightAware API integration is implemented
    return [
      {
        flightId: "KQ506",
        status: "En Route",
        departure: {
          airport: origin,
          scheduled: "2024-06-15T10:00:00Z",
          actual: "2024-06-15T10:15:00Z"
        },
        arrival: {
          airport: destination,
          scheduled: "2024-06-15T14:30:00Z",
          estimated: "2024-06-15T14:45:00Z"
        },
        route: [origin, destination]
      }
    ];
  },

  async getAirportWeather(airportCode: string): Promise<WeatherData> {
    try {
      // Use OpenWeather API for real weather data
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${airportCode}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        conditions: data.weather[0].main,
        visibility: `${Math.round(data.visibility / 1000)} km`,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg || 0
      };
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      // Fallback to mock data
      return {
        temperature: 24,
        conditions: "Clear",
        visibility: "10+ km",
        windSpeed: 12,
        windDirection: 180
      };
    }
  },

  async getAirportDelays(airportCode: string): Promise<AirportData> {
    // TODO: Replace with actual FlightAware API call
    return {
      id: airportCode,
      name: `${airportCode} Airport`,
      delays: 15,
      weather: await this.getAirportWeather(airportCode)
    };
  }
};
