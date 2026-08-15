export type Unit = "celsius" | "fahrenheit";

export interface City {
  name: string;
  country?: string;
  region?: string;
  latitude: number;
  longitude: number;
}

export interface Config {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}

export interface ForecastResponse {
  current?: {
    temperature_2m?: number;
  };
}
