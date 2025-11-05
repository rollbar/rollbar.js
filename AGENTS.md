# Repository Guidelines

## Project Structure & Module Organization
Rollbar.js is the cross-platform SDK for Rollbar error monitoring. Browser runtime code sits in `src/browser/`, Node handlers in `src/server/`, React Native-specific modules in `src/react-native/`, and shared systems in `src/tracing/`, `src/telemetry.*`, and `src/utility/`. Public entry points flow through `src/rollbar.js` into bundled artifacts under `dist/` (do not edit generated files). Type definitions live in `index.d.ts`. Integration examples and docs are in `examples/` and `docs/`, while CLI helpers and release scripts live under `scripts/`. Tests mirror the source layout inside `test/`, with replay-focused coverage in `test/replay/`.

## Build, Test, and Development Commands
Use `npm run build` for production bundles and `npm run build:dev` during debugging. `npm test` executes both browser (Web Test Runner) and server (Mocha) suites; target subsets via `npm run test:wtr`, `npm run test:wtr:watch`, or `npm run test:server`. Lint with `npm run lint`, and rely on `npm run format` / `npm run format:check` for Prettier parity. Before publishing, run `npm run validate` to enforce ES5 compatibility and verify example snippets, then package distributables with `npm run pack`.

## Coding Style & Naming Conventions
This repo is an ES module project (`package.json` sets `"type": "module"`). ESLint rules in `eslint.config.js` enforce 2-space indentation, single quotes (via Prettier), `no-console` outside `scripts/`, maximum cyclomatic complexity of 35, and grouped alphabetized imports. The `unused-imports` plugin must leave files warning-free. Prefer PascalCase for exported classes or constructors, camelCase for functions and variables, and keep side-effect files named `<feature>.js` or `<feature>.cjs` to match existing patterns.

## Testing Guidelines
Author browser-facing specs under `test/browser.*.test.js` and Node scenarios under `test/server.*.test.js`. Session replay code should carry dedicated unit and integration coverage in `test/replay/**`. Tests use Mocha with Chai assertions and Sinon stubs. Add fixtures in `test/fixtures/` when mocking rrweb payloads or HTTP exchanges. Ensure `npm test` and `npm run validate:es5` succeed before opening a PR, especially after touching bundling or transport logic.

## Commit & Pull Request Guidelines
Follow the existing history by writing imperative, present-tense commit messages (e.g., `Add import linting guard (#1410)`). Each PR should summarize behavior changes, call out linked issues, and include test evidence or reproduction steps. Update relevant docs (`docs/`, `examples/`, `README.md`) for public-facing changes, avoid leaving TODOs, and surface any follow-up work in the PR description rather than the code. For security-sensitive fixes, coordinate disclosure via `SECURITY.md` instructions before merging.
