import { beforeEach, describe, expect, test } from "bun:test";
import { toggleUnit } from "../../src/actions/settings.ts";
import { getUnit, setUnit } from "../../src/storage/settingsStorage.ts";
import { captureLog, resetConfig } from "../helpers.ts";

beforeEach(() => resetConfig());

describe("toggleUnit", () => {
  test("cambia de celsius a fahrenheit", () => {
    expect(getUnit()).toBe("celsius");
    const log = captureLog();
    toggleUnit();
    expect(getUnit()).toBe("fahrenheit");
    expect(log.mock.calls.map((call) => call[0])).toEqual(["Unidad de temperatura cambiada a °F."]);
    log.mockRestore();
  });

  test("cambia de fahrenheit a celsius", () => {
    setUnit("fahrenheit");
    const log = captureLog();
    toggleUnit();
    expect(getUnit()).toBe("celsius");
    expect(log.mock.calls.map((call) => call[0])).toEqual(["Unidad de temperatura cambiada a °C."]);
    log.mockRestore();
  });
});
