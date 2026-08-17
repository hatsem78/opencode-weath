# AGENTS.md

## Toolchain
- Runtime/build: `bun` (no separate Node.js, no npm scripts).
- TypeScript: `bunx tsc --noEmit` for type-checking (`dev` peer dep, not auto-run).
- Bundler: `bun build index.ts` (ESM output).

## Commands
- Run app: `bun run index.ts`
- Install deps: `bun install` (uses `bun.lock`).
- Type-check: `bunx tsc --noEmit`
- Build: `bun build index.ts`
- Test: `bun test`
- Coverage: `bun test --coverage`

## Entry point
- `index.ts` is the app's real entrypoint (not `src/`).

## Notes
- Test runner: built-in `bun test` (tests in `test/`, `*.test.ts`). No linter or formatter installed.
- `tsconfig.json` is `strict` with `module: ESNext`, `moduleResolution: bundler`.
- Storage tests isolate config via `WEATH_CONFIG_PATH` env var; API/action tests mock `fetch` and `promptInput`.
- No monorepo; single-package project.
