import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { showCities } from "../../src/actions/listCities.ts";
import { captureLog, resetConfig } from "../helpers.ts";

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
const barcelona: City = { name: "Barcelona", country: "España", region: "Cataluña", latitude: 41.3874, longitude: 2.1686 };

beforeEach(() => resetConfig());

describe("showCities", () => {
  test("avisa si no hay ciudades", () => {
    const log = captureLog();
    showCities();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No hay ciudades registradas."]);
    log.mockRestore();
  });

  test("lista las ciudades registradas", () => {
    addCity(madrid);
    addCity(barcelona);
    const log = captureLog();
    showCities();
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "  1. Madrid (España, Comunidad de Madrid)",
      "  2. Barcelona (España, Cataluña)",
    ]);
    log.mockRestore();
  });
});
