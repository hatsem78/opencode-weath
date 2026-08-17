import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity, listCities } from "../../src/storage/citiesStorage.ts";
import { captureLog, installInputMock, resetConfig } from "../helpers.ts";

const input = installInputMock();

const { showRemoveCity } = await import("../../src/actions/removeCity.ts");

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
const barcelona: City = { name: "Barcelona", country: "España", region: "Cataluña", latitude: 41.3874, longitude: 2.1686 };

beforeEach(() => resetConfig());

describe("showRemoveCity", () => {
  test("avisa si no hay ciudades", async () => {
    const log = captureLog();
    await showRemoveCity();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No hay ciudades registradas."]);
    log.mockRestore();
  });

  test("cancela la selección", async () => {
    addCity(madrid);
    input.setQueue([""]);
    const log = captureLog();
    await showRemoveCity();
    expect(log.mock.calls.map((call) => call[0])).toContain("Operación cancelada.");
    expect(listCities()).toHaveLength(1);
    log.mockRestore();
  });

  test("elimina la ciudad seleccionada", async () => {
    addCity(madrid);
    addCity(barcelona);
    input.setQueue(["1"]);
    const log = captureLog();
    await showRemoveCity();
    expect(log.mock.calls.map((call) => call[0])).toContain('Ciudad "Madrid" eliminada.');
    expect(listCities()).toEqual([barcelona]);
    log.mockRestore();
  });
});
