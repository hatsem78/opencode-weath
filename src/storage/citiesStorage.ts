import type { City } from "../types/City.ts";
import { loadConfig, saveConfig } from "./settingsStorage.ts";

export function listCities(): City[] {
  return loadConfig().cities;
}

export function getDefaultCity(): City | null {
  const config = loadConfig();
  if (!config.defaultCity) return null;
  return config.cities.find((c) => c.name === config.defaultCity) ?? null;
}

export function addCity(city: City): boolean {
  const config = loadConfig();
  const exists = config.cities.some(
    (c) => c.name === city.name && c.latitude === city.latitude && c.longitude === city.longitude,
  );
  if (exists) return false;
  config.cities.push(city);
  saveConfig(config);
  return true;
}

export function removeCity(name: string): boolean {
  const config = loadConfig();
  const index = config.cities.findIndex((c) => c.name === name);
  if (index === -1) return false;
  config.cities.splice(index, 1);
  if (config.defaultCity === name) {
    config.defaultCity = config.cities[0]?.name ?? null;
  }
  saveConfig(config);
  return true;
}

export function setDefaultCity(name: string): boolean {
  const config = loadConfig();
  if (!config.cities.some((c) => c.name === name)) return false;
  config.defaultCity = name;
  saveConfig(config);
  return true;
}
