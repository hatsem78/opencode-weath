import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { cyan, green, red, yellow } from "../../src/utils/colors.ts";

const originalNoColor = process.env.NO_COLOR;
const originalForceColor = process.env.FORCE_COLOR;

describe("colors", () => {
  beforeEach(() => {
    process.env.NO_COLOR = "1";
    delete process.env.FORCE_COLOR;
  });

  afterEach(() => {
    if (originalNoColor === undefined) delete process.env.NO_COLOR;
    else process.env.NO_COLOR = originalNoColor;
    if (originalForceColor === undefined) delete process.env.FORCE_COLOR;
    else process.env.FORCE_COLOR = originalForceColor;
  });

  test("desactivado devuelve el texto sin códigos ANSI", () => {
    expect(cyan("hola")).toBe("hola");
    expect(yellow("hola")).toBe("hola");
    expect(green("hola")).toBe("hola");
    expect(red("hola")).toBe("hola");
  });

  test("preserva el contenido original", () => {
    expect(cyan("  texto con espacios ")).toBe("  texto con espacios ");
  });

  test("forzado devuelve el texto con códigos ANSI", () => {
    delete process.env.NO_COLOR;
    process.env.FORCE_COLOR = "1";
    expect(cyan("hola")).toBe("\x1b[36mhola\x1b[0m");
    expect(red("hola")).toBe("\x1b[31mhola\x1b[0m");
  });
});
