import type { GeocodingResponse, GeocodingResult, Unit } from "./types.ts";

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

export function formatTemperature(temp: number, unit: Unit): string {
  const symbol = unit === "celsius" ? "°C" : "°F";
  return `${temp.toFixed(1)}${symbol}`;
}
