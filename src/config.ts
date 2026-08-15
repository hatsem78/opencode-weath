import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Config } from "./types.ts";

const CONFIG_PATH = join(homedir(), ".weath.json");

const DEFAULT_CONFIG: Config = {
  cities: [],
  defaultCity: null,
  unit: "celsius",
};

export function loadConfig(): Config {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
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
  const dir = CONFIG_PATH.replace(/\/[^/]+$/, "");
  mkdirSync(dir, { recursive: true });
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
