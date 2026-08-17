import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity, setDefaultCity } from "../../src/storage/citiesStorage.ts";
import { showAllCitiesWeather, showDefaultCityWeather } from "../../src/actions/getWeather.ts";
import { captureLog, jsonResponse, resetConfig, withFetchMock } from "../helpers.ts";

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
const barcelona: City = { name: "Barcelona", country: "España", region: "Cataluña", latitude: 41.3874, longitude: 2.1686 };

beforeEach(() => resetConfig());

describe("showDefaultCityWeather", () => {
  test("avisa si no hay ciudad default", async () => {
    const log = captureLog();
    await showDefaultCityWeather();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No hay ciudad default configurada. Usa la opción 5 para establecerla."]);
    log.mockRestore();
  });

  test("muestra la temperatura de la ciudad default", async () => {
    addCity(madrid);
    setDefaultCity("Madrid");
    const restore = withFetchMock(() => jsonResponse(200, { current: { temperature_2m: 25.4 } }));
    const log = captureLog();
    await showDefaultCityWeather();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["🌤️  Madrid: 25.4°C"]);
    log.mockRestore();
    restore();
  });

  test("muestra el error de la API", async () => {
    addCity(madrid);
    setDefaultCity("Madrid");
    const restore = withFetchMock(() => jsonResponse(500, {}));
    const log = captureLog();
    await showDefaultCityWeather();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["Error al consultar el clima: Error del forecast API (500)"]);
    log.mockRestore();
    restore();
  });
});

describe("showAllCitiesWeather", () => {
  test("avisa si no hay ciudades", async () => {
    const log = captureLog();
    await showAllCitiesWeather();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No hay ciudades registradas. Usa la opción 3 para agregar una."]);
    log.mockRestore();
  });

  test("muestra el clima de todas las ciudades y marca la default", async () => {
    addCity(madrid);
    addCity(barcelona);
    setDefaultCity("Madrid");
    const restore = withFetchMock(() => jsonResponse(200, { current: { temperature_2m: 20 } }));
    const log = captureLog();
    await showAllCitiesWeather();
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "🌤️  Madrid ★: 20.0°C",
      "🌤️  Barcelona: 20.0°C",
    ]);
    log.mockRestore();
    restore();
  });

  test("reporta errores por ciudad sin cortar el resto", async () => {
    addCity(madrid);
    addCity(barcelona);
    const restore = withFetchMock((input) => {
      const url = new URL(String(input));
      const lat = Number(url.searchParams.get("latitude"));
      if (lat === 40.4168) return jsonResponse(200, { current: { temperature_2m: 25 } });
      return jsonResponse(500, {});
    });
    const log = captureLog();
    await showAllCitiesWeather();
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "🌤️  Madrid: 25.0°C",
      "⚠️  Barcelona: error al consultar (Error del forecast API (500))",
    ]);
    log.mockRestore();
    restore();
  });
});
