import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Config } from "../types/City.ts";
import type { Unit } from "../types/Weather.ts";

function configPath(): string {
  return process.env.WEATH_CONFIG_PATH ?? join(homedir(), ".weath.json");
}

const DEFAULT_CONFIG: Config = {
  cities: [],
  defaultCity: null,
  unit: "celsius",
};

export function loadConfig(): Config {
  try {
    const raw = readFileSync(configPath(), "utf-8");
    const parsed = JSON.parse(raw) as Partial<Config>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      defaultCity: typeof parsed.defaultCity === "string" ? parsed.defaultCity : null,
      unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Config): void {
  const path = configPath();
  const dir = path.replace(/\/[^/]+$/, "");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, JSON.stringify(config, null, 2));
}

export function getUnit(): Unit {
  return loadConfig().unit;
}

export function setUnit(unit: Unit): void {
  const config = loadConfig();
  config.unit = unit;
  saveConfig(config);
}
