export interface BusStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lines: string[];
}

export interface BusLine {
  id: string;
  name: string;
  direction: string;
  color: string;
  stops: BusStop[];
}

export interface BusPosition {
  id: string;
  lineId: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  lines: BusLine[];
  estimatedTime: number;
  distance: number;
  createdAt: string;
}
