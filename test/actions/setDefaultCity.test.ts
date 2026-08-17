import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity, getDefaultCity } from "../../src/storage/citiesStorage.ts";
import { captureLog, installInputMock, resetConfig } from "../helpers.ts";

const input = installInputMock();

const { showSetDefaultCity } = await import("../../src/actions/setDefaultCity.ts");

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
const barcelona: City = { name: "Barcelona", country: "España", region: "Cataluña", latitude: 41.3874, longitude: 2.1686 };

beforeEach(() => resetConfig());

describe("showSetDefaultCity", () => {
  test("avisa si no hay ciudades", async () => {
    const log = captureLog();
    await showSetDefaultCity();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No hay ciudades registradas. Usa la opción 3 para agregar una."]);
    log.mockRestore();
  });

  test("cancela la selección", async () => {
    addCity(madrid);
    input.setQueue([""]);
    const log = captureLog();
    await showSetDefaultCity();
    expect(log.mock.calls.map((call) => call[0])).toContain("Operación cancelada.");
    expect(getDefaultCity()).toBeNull();
    log.mockRestore();
  });

  test("establece la ciudad default seleccionada", async () => {
    addCity(madrid);
    addCity(barcelona);
    input.setQueue(["2"]);
    const log = captureLog();
    await showSetDefaultCity();
    expect(log.mock.calls.map((call) => call[0])).toContain("Ciudad default establecida: Barcelona");
    expect(getDefaultCity()).toEqual(barcelona);
    log.mockRestore();
  });
});
