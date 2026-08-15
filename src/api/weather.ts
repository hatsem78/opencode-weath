import type { DailyForecast, ForecastResponse, Unit } from "../types/Weather.ts";
import { FORECAST_URL } from "../utils/constants.ts";

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
