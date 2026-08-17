import { describe, expect, test } from "bun:test";
import { cityLabel, describeWeather, formatForecastDate, formatTemperature, resultLabel } from "../../src/utils/format.ts";

describe("formatTemperature", () => {
  test("formatea en celsius", () => {
    expect(formatTemperature(25.4, "celsius")).toBe("25.4°C");
  });

  test("formatea en fahrenheit", () => {
    expect(formatTemperature(32, "fahrenheit")).toBe("32.0°F");
  });

  test("redondea a un decimal", () => {
    expect(formatTemperature(20.05, "celsius")).toBe("20.1°C");
  });
});

describe("describeWeather", () => {
  test.each([
    [0, "Despejado", "☀️"],
    [1, "Mayormente despejado", "🌤️"],
    [2, "Parcialmente nublado", "⛅"],
    [3, "Nublado", "☁️"],
    [45, "Niebla", "🌫️"],
    [48, "Niebla", "🌫️"],
    [51, "Llovizna", "🌦️"],
    [55, "Llovizna", "🌦️"],
    [57, "Llovizna", "🌦️"],
    [61, "Lluvia", "🌧️"],
    [66, "Lluvia", "🌧️"],
    [67, "Lluvia", "🌧️"],
    [71, "Nieve", "🌨️"],
    [75, "Nieve", "🌨️"],
    [77, "Nieve", "🌨️"],
    [80, "Chubascos", "🌦️"],
    [82, "Chubascos", "🌦️"],
    [85, "Chubascos de nieve", "🌨️"],
    [86, "Chubascos de nieve", "🌨️"],
    [95, "Tormenta", "⛈️"],
    [99, "Tormenta", "⛈️"],
    [100, "Tormenta", "⛈️"],
  ])("código %d → %s", (code, label, icon) => {
    expect(describeWeather(code)).toEqual({ label, icon });
  });

  test("códigos desconocidos devuelven Desconocido", () => {
    expect(describeWeather(10)).toEqual({ label: "Desconocido", icon: "❓" });
    expect(describeWeather(90)).toEqual({ label: "Desconocido", icon: "❓" });
  });
});

describe("formatForecastDate", () => {
  test("devuelve una fecha legible en español", () => {
    const result = formatForecastDate("2026-08-15");
    expect(result).toBeTruthy();
    expect(result).toContain("15");
  });
});

describe("cityLabel", () => {
  test("incluye país y región", () => {
    const city = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
    expect(cityLabel(city)).toBe("Madrid (España, Comunidad de Madrid)");
  });

  test("solo con país", () => {
    const city = { name: "Madrid", country: "España", latitude: 40.4168, longitude: -3.7038 };
    expect(cityLabel(city)).toBe("Madrid (España)");
  });

  test("sin datos extra usa solo el nombre", () => {
    const city = { name: "Madrid", latitude: 40.4168, longitude: -3.7038 };
    expect(cityLabel(city)).toBe("Madrid");
  });
});

describe("resultLabel", () => {
  test("incluye país y admin1", () => {
    const result = { id: 1, name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España", admin1: "Comunidad de Madrid" };
    expect(resultLabel(result)).toBe("Madrid (España, Comunidad de Madrid)");
  });

  test("solo con país", () => {
    const result = { id: 1, name: "Madrid", latitude: 40.4168, longitude: -3.7038, country: "España" };
    expect(resultLabel(result)).toBe("Madrid (España)");
  });

  test("sin datos extra usa solo el nombre", () => {
    const result = { id: 1, name: "Madrid", latitude: 40.4168, longitude: -3.7038 };
    expect(resultLabel(result)).toBe("Madrid");
  });
});
