import { beforeEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Config } from "../../src/types/City.ts";
import { getUnit, loadConfig, saveConfig, setUnit } from "../../src/storage/settingsStorage.ts";
import { resetConfig, TEST_CONFIG_PATH } from "../helpers.ts";

beforeEach(() => resetConfig());

describe("loadConfig", () => {
  test("devuelve defaults si no existe el archivo", () => {
    expect(loadConfig()).toEqual({ cities: [], defaultCity: null, unit: "celsius" });
  });

  test("tolera JSON inválido y devuelve defaults", () => {
    writeFileSync(TEST_CONFIG_PATH, "{ esto no es json", "utf-8");
    expect(loadConfig()).toEqual({ cities: [], defaultCity: null, unit: "celsius" });
  });

  test("sanea campos con tipos incorrectos", () => {
    writeFileSync(TEST_CONFIG_PATH, JSON.stringify({ cities: "nope", defaultCity: 42, unit: "kelvin" }), "utf-8");
    const config = loadConfig();
    expect(config.cities).toEqual([]);
    expect(config.defaultCity).toBeNull();
    expect(config.unit).toBe("celsius");
  });

  test("respeta la unidad fahrenheit", () => {
    writeFileSync(TEST_CONFIG_PATH, JSON.stringify({ unit: "fahrenheit" }), "utf-8");
    expect(loadConfig().unit).toBe("fahrenheit");
  });
});

describe("saveConfig", () => {
  test("persiste la configuración en el archivo", () => {
    const config: Config = { cities: [], defaultCity: "Madrid", unit: "fahrenheit" };
    saveConfig(config);
    expect(existsSync(TEST_CONFIG_PATH)).toBe(true);
    expect(JSON.parse(readFileSync(TEST_CONFIG_PATH, "utf-8"))).toEqual(config);
    expect(loadConfig()).toEqual(config);
  });
});

describe("getUnit / setUnit", () => {
  test("getUnit devuelve celsius por defecto", () => {
    expect(getUnit()).toBe("celsius");
  });

  test("setUnit persiste la nueva unidad", () => {
    setUnit("fahrenheit");
    expect(getUnit()).toBe("fahrenheit");
    expect(loadConfig().unit).toBe("fahrenheit");
  });
});
