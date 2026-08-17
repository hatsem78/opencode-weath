import { afterEach, describe, expect, test } from "bun:test";
import { getDailyForecast, getTemperature } from "../../src/api/weather.ts";
import { jsonResponse, withFetchMock } from "../helpers.ts";

let restoreFetch: (() => void) | null = null;

afterEach(() => {
  restoreFetch?.();
  restoreFetch = null;
});

describe("getTemperature", () => {
  test("devuelve la temperatura actual en celsius sin parámetro de unidad", async () => {
    const calls: URL[] = [];
    restoreFetch = withFetchMock((input) => {
      calls.push(new URL(String(input)));
      return jsonResponse(200, { current: { temperature_2m: 25.4 } });
    });

    const temp = await getTemperature(40.4168, -3.7038, "celsius");

    expect(temp).toBe(25.4);
    const url = calls[0]!;
    expect(url.origin + url.pathname).toBe("https://api.open-meteo.com/v1/forecast");
    expect(url.searchParams.get("latitude")).toBe("40.4168");
    expect(url.searchParams.get("longitude")).toBe("-3.7038");
    expect(url.searchParams.get("current")).toBe("temperature_2m");
    expect(url.searchParams.get("temperature_unit")).toBeNull();
  });

  test("añade temperature_unit=fahrenheit cuando corresponde", async () => {
    const calls: URL[] = [];
    restoreFetch = withFetchMock((input) => {
      calls.push(new URL(String(input)));
      return jsonResponse(200, { current: { temperature_2m: 80 } });
    });

    const temp = await getTemperature(40.4168, -3.7038, "fahrenheit");

    expect(temp).toBe(80);
    expect(calls[0]!.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  test("lanza error si la API no devuelve la temperatura", async () => {
    restoreFetch = withFetchMock(() => jsonResponse(200, { current: {} }));
    expect(getTemperature(1, 2, "celsius")).rejects.toThrow("La API no devolvió la temperatura actual");
  });

  test("lanza error si la respuesta no es ok", async () => {
    restoreFetch = withFetchMock(() => jsonResponse(500, {}));
    expect(getTemperature(1, 2, "celsius")).rejects.toThrow("Error del forecast API (500)");
  });
});

describe("getDailyForecast", () => {
  const daily = {
    time: ["2026-08-15", "2026-08-16"],
    temperature_2m_max: [30, 28],
    temperature_2m_min: [20, 18],
    weather_code: [0, 61],
  };

  test("mapea el pronóstico diario", async () => {
    const calls: URL[] = [];
    restoreFetch = withFetchMock((input) => {
      calls.push(new URL(String(input)));
      return jsonResponse(200, { daily });
    });

    const forecast = await getDailyForecast(40.4168, -3.7038, "celsius");

    expect(forecast).toEqual([
      { time: "2026-08-15", temperatureMax: 30, temperatureMin: 20, weatherCode: 0 },
      { time: "2026-08-16", temperatureMax: 28, temperatureMin: 18, weatherCode: 61 },
    ]);
    const url = calls[0]!;
    expect(url.searchParams.get("daily")).toBe("temperature_2m_max,temperature_2m_min,weather_code");
    expect(url.searchParams.get("forecast_days")).toBe("7");
    expect(url.searchParams.get("timezone")).toBe("auto");
  });

  test("añade temperature_unit=fahrenheit cuando corresponde", async () => {
    const calls: URL[] = [];
    restoreFetch = withFetchMock((input) => {
      calls.push(new URL(String(input)));
      return jsonResponse(200, { daily });
    });

    await getDailyForecast(40.4168, -3.7038, "fahrenheit");

    expect(calls[0]!.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  test("respeta el número de días indicado", async () => {
    const calls: URL[] = [];
    restoreFetch = withFetchMock((input) => {
      calls.push(new URL(String(input)));
      return jsonResponse(200, { daily });
    });

    await getDailyForecast(40.4168, -3.7038, "celsius", 3);

    expect(calls[0]!.searchParams.get("forecast_days")).toBe("3");
  });

  test("lanza error si no hay pronóstico diario", async () => {
    restoreFetch = withFetchMock(() => jsonResponse(200, {}));
    expect(getDailyForecast(1, 2, "celsius")).rejects.toThrow("La API no devolvió el pronóstico diario");
  });

  test("lanza error si faltan temperaturas", async () => {
    restoreFetch = withFetchMock(() =>
      jsonResponse(200, { daily: { time: ["2026-08-15"], temperature_2m_max: [30], temperature_2m_min: [] } }),
    );
    expect(getDailyForecast(1, 2, "celsius")).rejects.toThrow("La API no devolvió todas las temperaturas del pronóstico");
  });

  test("lanza error si la respuesta no es ok", async () => {
    restoreFetch = withFetchMock(() => jsonResponse(400, {}));
    expect(getDailyForecast(1, 2, "celsius")).rejects.toThrow("Error del forecast API (400)");
  });
});
