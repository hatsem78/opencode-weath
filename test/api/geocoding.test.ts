import { afterEach, describe, expect, test } from "bun:test";
import { searchCity } from "../../src/api/geocoding.ts";
import { jsonResponse, withFetchMock } from "../helpers.ts";

let restoreFetch: (() => void) | null = null;

afterEach(() => {
  restoreFetch?.();
  restoreFetch = null;
});

describe("searchCity", () => {
  test("consulta el geocoding API con los parámetros esperados", async () => {
    const calls: URL[] = [];
    const result = { id: 1, name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", admin1: "Comunidad de Madrid" };
    restoreFetch = withFetchMock((input) => {
      calls.push(new URL(String(input)));
      return jsonResponse(200, { results: [result] });
    });

    const results = await searchCity("Madrid");

    expect(results).toEqual([result]);
    expect(calls).toHaveLength(1);
    const url = calls[0]!;
    expect(url.origin + url.pathname).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(url.searchParams.get("name")).toBe("Madrid");
    expect(url.searchParams.get("count")).toBe("5");
    expect(url.searchParams.get("language")).toBe("es");
    expect(url.searchParams.get("format")).toBe("json");
  });

  test("usa el count indicado", async () => {
    let restore: (() => void) | null = null;
    try {
      restore = withFetchMock(() => jsonResponse(200, {}));
      await searchCity("Madrid", 3);
    } finally {
      restore?.();
    }
  });

  test("devuelve array vacío si no hay resultados", async () => {
    restoreFetch = withFetchMock(() => jsonResponse(200, {}));
    expect(await searchCity("Atlántida")).toEqual([]);
  });

  test("lanza error si la respuesta no es ok", async () => {
    restoreFetch = withFetchMock(() => jsonResponse(404, {}));
    expect(searchCity("Madrid")).rejects.toThrow("Error del geocoding API (404)");
  });
});
