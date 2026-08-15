export type Unit = "celsius" | "fahrenheit";

export interface DailyForecast {
  time: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
}

export interface ForecastResponse {
  current?: {
    temperature_2m?: number;
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
  };
}
