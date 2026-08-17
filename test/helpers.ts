import { mock, spyOn, type Mock } from "bun:test";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const TEST_CONFIG_PATH = join(tmpdir(), "weath-test-config.json");
process.env.WEATH_CONFIG_PATH = TEST_CONFIG_PATH;
process.env.NO_COLOR = "1";

const DEFAULT_CONFIG = JSON.stringify({ cities: [], defaultCity: null, unit: "celsius" });

export function resetConfig(): void {
  writeFileSync(TEST_CONFIG_PATH, DEFAULT_CONFIG, "utf-8");
}

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function withFetchMock(
  impl: (input: string | URL | Request, init?: RequestInit) => Response | Promise<Response>,
): () => void {
  const original = globalThis.fetch;
  globalThis.fetch = impl as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

export function captureLog(): Mock<(message?: unknown) => void> {
  const log = spyOn(console, "log") as Mock<(message?: unknown) => void>;
  log.mockImplementation(() => {});
  return log;
}

export interface InputMock {
  setQueue: (values: string[]) => void;
}

export function installInputMock(): InputMock {
  let queue: string[] = [];
  mock.module(join(import.meta.dir, "../src/presentation/input.ts"), () => ({
    promptInput: mock(async () => queue.shift() ?? ""),
    readLine: mock(async () => ""),
    waitForEnter: mock(async () => {}),
  }));
  return {
    setQueue: (values: string[]) => {
      queue = values.slice();
    },
  };
}
