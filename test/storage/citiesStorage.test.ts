import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity, getDefaultCity, listCities, removeCity, setDefaultCity } from "../../src/storage/citiesStorage.ts";
import { resetConfig } from "../helpers.ts";

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
const barcelona: City = { name: "Barcelona", country: "España", region: "Cataluña", latitude: 41.3874, longitude: 2.1686 };

beforeEach(() => resetConfig());

describe("addCity", () => {
  test("agrega una ciudad nueva", () => {
    expect(addCity(madrid)).toBe(true);
    expect(listCities()).toEqual([madrid]);
  });

  test("rechaza duplicados por nombre y coordenadas", () => {
    addCity(madrid);
    expect(addCity({ ...madrid })).toBe(false);
    expect(listCities()).toEqual([madrid]);
  });

  test("permite mismo nombre con otras coordenadas", () => {
    addCity(madrid);
    expect(addCity({ ...madrid, latitude: 1, longitude: 2 })).toBe(true);
    expect(listCities()).toHaveLength(2);
  });
});

describe("getDefaultCity / setDefaultCity", () => {
  test("getDefaultCity devuelve null sin ciudad default", () => {
    addCity(madrid);
    expect(getDefaultCity()).toBeNull();
  });

  test("setDefaultCity establece la ciudad default", () => {
    addCity(madrid);
    expect(setDefaultCity("Madrid")).toBe(true);
    expect(getDefaultCity()).toEqual(madrid);
  });

  test("setDefaultCity rechaza nombres inexistentes", () => {
    expect(setDefaultCity("Nadie")).toBe(false);
    expect(getDefaultCity()).toBeNull();
  });
});

describe("removeCity", () => {
  test("rechaza nombres inexistentes", () => {
    expect(removeCity("Nadie")).toBe(false);
  });

  test("elimina una ciudad", () => {
    addCity(madrid);
    addCity(barcelona);
    expect(removeCity("Madrid")).toBe(true);
    expect(listCities()).toEqual([barcelona]);
  });

  test("re-asigna la ciudad default al eliminar la actual", () => {
    addCity(madrid);
    addCity(barcelona);
    setDefaultCity("Madrid");
    removeCity("Madrid");
    expect(getDefaultCity()).toEqual(barcelona);
  });

  test("limpia la ciudad default al eliminar la única ciudad", () => {
    addCity(madrid);
    setDefaultCity("Madrid");
    removeCity("Madrid");
    expect(getDefaultCity()).toBeNull();
  });
});
