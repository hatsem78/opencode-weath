import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity as addCityToStorage, listCities } from "../../src/storage/citiesStorage.ts";
import { captureLog, installInputMock, jsonResponse, resetConfig, withFetchMock } from "../helpers.ts";

const input = installInputMock();

const { showAddCity } = await import("../../src/actions/addCity.ts");

const result = { id: 1, name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", admin1: "Comunidad de Madrid" };
const expectedCity: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };

beforeEach(() => resetConfig());

describe("showAddCity", () => {
  test("cancela la búsqueda con un nombre vacío", async () => {
    input.setQueue([""]);
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["Búsqueda cancelada."]);
    log.mockRestore();
  });

  test("muestra el error de búsqueda", async () => {
    input.setQueue(["Madrid"]);
    const restore = withFetchMock(() => jsonResponse(500, {}));
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["Error en la búsqueda: Error del geocoding API (500)"]);
    log.mockRestore();
    restore();
  });

  test("avisa si no hay resultados", async () => {
    input.setQueue(["Atlántida"]);
    const restore = withFetchMock(() => jsonResponse(200, { results: [] }));
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No se encontraron ciudades con ese nombre."]);
    log.mockRestore();
    restore();
  });

  test("cancela la selección con una entrada vacía", async () => {
    input.setQueue(["Madrid", ""]);
    const restore = withFetchMock(() => jsonResponse(200, { results: [result] }));
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "Resultados:",
      "  1. Madrid (España, Comunidad de Madrid)",
      "Operación cancelada.",
    ]);
    log.mockRestore();
    restore();
  });

  test("rechaza una selección inválida", async () => {
    input.setQueue(["Madrid", "9"]);
    const restore = withFetchMock(() => jsonResponse(200, { results: [result] }));
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toContain("Selección inválida.");
    log.mockRestore();
    restore();
  });

  test("avisa si la ciudad ya está en la lista", async () => {
    addCityToStorage(expectedCity);
    input.setQueue(["Madrid", "1"]);
    const restore = withFetchMock(() => jsonResponse(200, { results: [result] }));
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toContain('La ciudad "Madrid" ya está en tu lista.');
    log.mockRestore();
    restore();
  });

  test("agrega la ciudad seleccionada", async () => {
    input.setQueue(["Madrid", "1"]);
    const restore = withFetchMock(() => jsonResponse(200, { results: [result] }));
    const log = captureLog();
    await showAddCity();
    expect(log.mock.calls.map((call) => call[0])).toContain('Ciudad "Madrid" agregada.');
    expect(listCities()).toEqual([expectedCity]);
    log.mockRestore();
    restore();
  });
});
