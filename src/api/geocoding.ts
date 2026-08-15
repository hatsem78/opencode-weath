import type { GeocodingResponse, GeocodingResult } from "../types/City.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

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
