import { beforeEach, describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import { addCity } from "../../src/storage/citiesStorage.ts";
import { captureLog, installInputMock, resetConfig } from "../helpers.ts";

const input = installInputMock();

const madrid: City = { name: "Madrid", country: "España", region: "Comunidad de Madrid", latitude: 40.4168, longitude: -3.7038 };
const barcelona: City = { name: "Barcelona", country: "España", region: "Cataluña", latitude: 41.3874, longitude: 2.1686 };

const { printError, printLine, printSuccess, selectCity } = await import("../../src/presentation/output.ts");

beforeEach(() => resetConfig());

describe("printLine / printSuccess / printError", () => {
  test("imprimen el texto recibido", () => {
    const log = captureLog();
    printLine("hola");
    printSuccess("ok");
    printError("falla");
    expect(log.mock.calls.map((call) => call[0])).toEqual(["hola", "ok", "falla"]);
    log.mockRestore();
  });

  test("printLine sin argumentos imprime línea vacía", () => {
    const log = captureLog();
    printLine();
    expect(log.mock.calls.map((call) => call[0])).toEqual([""]);
    log.mockRestore();
  });
});

describe("selectCity", () => {
  test("devuelve null sin ciudades registradas", async () => {
    expect(await selectCity("Selecciona: ")).toBeNull();
  });

  test("lista las ciudades y devuelve la seleccionada", async () => {
    addCity(madrid);
    addCity(barcelona);
    input.setQueue(["1"]);
    const log = captureLog();
    const selected = await selectCity("Selecciona: ");
    expect(selected).toEqual(madrid);
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "Tus ciudades:",
      "  1. Madrid (España, Comunidad de Madrid)",
      "  2. Barcelona (España, Cataluña)",
    ]);
    log.mockRestore();
  });

  test("cancela con entrada vacía", async () => {
    addCity(madrid);
    input.setQueue([""]);
    const log = captureLog();
    const selected = await selectCity("Selecciona: ");
    expect(selected).toBeNull();
    expect(log.mock.calls.map((call) => call[0])).toContain("Operación cancelada.");
    log.mockRestore();
  });

  test("rechaza una selección inválida", async () => {
    addCity(madrid);
    input.setQueue(["9"]);
    const log = captureLog();
    const selected = await selectCity("Selecciona: ");
    expect(selected).toBeNull();
    expect(log.mock.calls.map((call) => call[0])).toContain("Selección inválida.");
    log.mockRestore();
  });
});
