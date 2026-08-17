import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { captureLog, installInputMock, jsonResponse, resetConfig, withFetchMock } from "../helpers.ts";

const input = installInputMock();

const { showForecast } = await import("../../src/actions/getForecast.ts");

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };

const daily = {
  time: ["2026-08-15", "2026-08-16"],
  temperature_2m_max: [30, 28],
  temperature_2m_min: [20, 18],
  weather_code: [0, 61],
};

beforeEach(() => resetConfig());

describe("showForecast", () => {
  test("avisa si no hay ciudades", async () => {
    const log = captureLog();
    await showForecast();
    expect(log.mock.calls.map((call) => call[0])).toEqual(["No hay ciudades registradas. Usa la opción 3 para agregar una."]);
    log.mockRestore();
  });

  test("muestra el pronóstico de 7 días", async () => {
    addCity(madrid);
    input.setQueue(["1"]);
    const restore = withFetchMock(() => jsonResponse(200, { daily }));
    const log = captureLog();
    await showForecast();
    const calls = log.mock.calls.map((call) => call[0]);
    expect(calls[0]).toBe("Tus ciudades:");
    expect(calls[1]).toBe("  1. Madrid (España, Comunidad de Madrid)");
    expect(calls[2]).toBe("📅  Pronóstico de 7 días — Madrid:");
    expect(calls[3]).toMatch(/^  ☀️ .*: mín 20\.0°C · máx 30\.0°C — Despejado$/);
    expect(calls[4]).toMatch(/^  🌧️ .*: mín 18\.0°C · máx 28\.0°C — Lluvia$/);
    log.mockRestore();
    restore();
  });

  test("muestra el error de la API", async () => {
    addCity(madrid);
    input.setQueue(["1"]);
    const restore = withFetchMock(() => jsonResponse(500, {}));
    const log = captureLog();
    await showForecast();
    expect(log.mock.calls.map((call) => call[0])).toContain("Error al consultar el pronóstico: Error del forecast API (500)");
    log.mockRestore();
    restore();
  });

  test("cancela la selección de ciudad", async () => {
    addCity(madrid);
    input.setQueue([""]);
    const log = captureLog();
    await showForecast();
    expect(log.mock.calls.map((call) => call[0])).toContain("Operación cancelada.");
    log.mockRestore();
  });
});
