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

## Entry point
- `index.ts` is the app's real entrypoint (not `src/`).

## Notes
- No test/lint/format scripts defined; no test runner or linter installed.
- `tsconfig.json` is `strict` with `module: ESNext`, `moduleResolution: bundler`.
- No monorepo; single-package project.
