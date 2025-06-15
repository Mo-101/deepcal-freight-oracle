
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

// Mock data for demonstration - in production, use actual API calls
export const flightService = {
  async getFlightsByRoute(origin: string, destination: string): Promise<FlightData[]> {
    // Mock implementation - replace with actual FlightAware API call
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
    // Mock implementation - replace with actual FlightAware API call
    return {
      temperature: 24,
      conditions: "Clear",
      visibility: "10+ km",
      windSpeed: 12,
      windDirection: 180
    };
  },

  async getAirportDelays(airportCode: string): Promise<AirportData> {
    // Mock implementation - replace with actual FlightAware API call
    return {
      id: airportCode,
      name: `${airportCode} Airport`,
      delays: 15,
      weather: await this.getAirportWeather(airportCode)
    };
  }
};
