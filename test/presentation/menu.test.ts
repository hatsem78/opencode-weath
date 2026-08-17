import { describe, expect, test } from "bun:test";
import { renderMenu } from "../../src/presentation/menu.ts";
import { captureLog } from "../helpers.ts";
import type { MenuOption } from "../../src/types/MenuOption.ts";

const options: MenuOption[] = [
  { value: "1", label: "Clima default", handler: () => {} },
  { value: "2", label: "Todas las ciudades", handler: () => {} },
];

describe("renderMenu", () => {
  test("imprime el título, las opciones y los separadores", () => {
    const log = captureLog();
    renderMenu(options);
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "═".repeat(40),
      " ".repeat(14) + "WEATHER CLI",
      "═".repeat(40),
      "  1. Clima default",
      "  2. Todas las ciudades",
      "═".repeat(40),
    ]);
    log.mockRestore();
  });

  test("centra un título personalizado", () => {
    const log = captureLog();
    renderMenu([], "TEST");
    expect(log.mock.calls.map((call) => call[0])).toEqual([
      "═".repeat(40),
      " ".repeat(18) + "TEST",
      "═".repeat(40),
      "═".repeat(40),
    ]);
    log.mockRestore();
  });
});
