import type { DailyForecast, ForecastResponse, GeocodingResponse, GeocodingResult, Unit } from "./types.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCity(query: string, count = 5): Promise<GeocodingResult[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error del geocoding API (${res.status})`);
  }

  const data = (await res.json()) as GeocodingResponse;
  return data.results ?? [];
}

export async function getTemperature(latitude: number, longitude: number, unit: Unit): Promise<number> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m");
  if (unit === "fahrenheit") {
    url.searchParams.set("temperature_unit", "fahrenheit");
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error del forecast API (${res.status})`);
  }

  const data = (await res.json()) as { current?: { temperature_2m?: number } };
  const temp = data.current?.temperature_2m;
  if (typeof temp !== "number") {
    throw new Error("La API no devolvió la temperatura actual");
  }
  return temp;
}

export async function getDailyForecast(
  latitude: number,
  longitude: number,
  unit: Unit,
  days = 7,
): Promise<DailyForecast[]> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  url.searchParams.set("forecast_days", String(days));
  url.searchParams.set("timezone", "auto");
  if (unit === "fahrenheit") {
    url.searchParams.set("temperature_unit", "fahrenheit");
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error del forecast API (${res.status})`);
  }

  const data = (await res.json()) as ForecastResponse;
  const { time = [], temperature_2m_max = [], temperature_2m_min = [], weather_code = [] } = data.daily ?? {};

  if (time.length === 0) {
    throw new Error("La API no devolvió el pronóstico diario");
  }

  return time.map((t, i) => {
    const temperatureMax = temperature_2m_max[i];
    const temperatureMin = temperature_2m_min[i];
    if (typeof temperatureMax !== "number" || typeof temperatureMin !== "number") {
      throw new Error("La API no devolvió todas las temperaturas del pronóstico");
    }
    return {
      time: t,
      temperatureMax,
      temperatureMin,
      weatherCode: weather_code[i] ?? 0,
    };
  });
}

export function describeWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "Despejado", icon: "☀️" };
  if (code === 1) return { label: "Mayormente despejado", icon: "🌤️" };
  if (code === 2) return { label: "Parcialmente nublado", icon: "⛅" };
  if (code === 3) return { label: "Nublado", icon: "☁️" };
  if (code === 45 || code === 48) return { label: "Niebla", icon: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "Llovizna", icon: "🌦️" };
  if (code >= 61 && code <= 67) return { label: "Lluvia", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Nieve", icon: "🌨️" };
  if (code >= 80 && code <= 82) return { label: "Chubascos", icon: "🌦️" };
  if (code === 85 || code === 86) return { label: "Chubascos de nieve", icon: "🌨️" };
  if (code >= 95) return { label: "Tormenta", icon: "⛈️" };
  return { label: "Desconocido", icon: "❓" };
}

export function formatTemperature(temp: number, unit: Unit): string {
  const symbol = unit === "celsius" ? "°C" : "°F";
  return `${temp.toFixed(1)}${symbol}`;
}
