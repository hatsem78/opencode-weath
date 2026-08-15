import type { City, GeocodingResult } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";

export function formatTemperature(temp: number, unit: Unit): string {
  const symbol = unit === "celsius" ? "°C" : "°F";
  return `${temp.toFixed(1)}${symbol}`;
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

export function formatForecastDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "short" });
}

export function cityLabel(city: City): string {
  const parts = [city.country, city.region].filter(Boolean);
  return parts.length > 0 ? `${city.name} (${parts.join(", ")})` : city.name;
}

export function resultLabel(result: GeocodingResult): string {
  const parts = [result.country, result.admin1].filter(Boolean);
  return parts.length > 0 ? `${result.name} (${parts.join(", ")})` : result.name;
}
