# Contributing to Rollbar.js

Thanks for helping Rollbar.js! Whether you are polishing docs, reporting a bug, adding a framework example, or enhancing SDK features, your contribution matters. This SDK ships in mission-critical environments, so we lean on automation: tests, linting, formatting. That keeps changes low-risk while keeping the process open and welcoming. Jump in wherever you feel inspired and ask questions early and often.

Rollbar.js is also AI-coding-agent ready: `AGENTS.md` documents Codex-specific guidelines and `CLAUDE.md` covers Claude’s conventions so automated assistants can operate safely alongside humans. Feel free to point AI tools at these docs when co-authoring patches.

## Ways to contribute

- Improve docs, READMEs, or examples to make Rollbar easier to adopt
- Reproduce and fix bugs across browsers, Node, or React Native
- Add tests, new features, or quality-of-life improvements
- Share integration snippets, tutorials, or demo apps

If you are unsure where to start, browse the GitHub issues page (<https://github.com/rollbar/rollbar.js/issues>) or open an issue/discussion, and maintainers can help scope a task that fits your interests.

## Quick start

**Prerequisites**

- Node.js 18+ and npm 9+
- A GitHub fork or branch you can push to

**Setup**

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/rollbar-js.git
   cd rollbar-js
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Verify the baseline:
   ```bash
   npm run build:dev
   npm test
   ```

Keep branches focused on a single improvement. CI reruns the full suite on every push, so you can rely on it while iterating.

## Local development workflow

### Linting and autofixes

- `npm run lint` checks the entire repo with ESLint’s flat config.
- `npm run lint:fix` runs ESLint with `--fix`. Run this before every commit so import ordering, unused variables, and other autofixable issues are taken care of automatically.

### Formatting

- `npm run format` applies Prettier to JavaScript, configs, Markdown, JSON, and YAML. Run it before committing; it is safe to run repeatedly.
- `npm run format:check` is the read-only version CI uses. Use it locally when you want to double-check a patch without mutating files.

### Tests

- `npm test` runs both browser (`npm run test:wtr`) and server (`npm run test:server`) suites.
- Scope runs as needed:
  - `npm run test:wtr -- --watch` for browser tests with live reload.
  - `npm run test:server test/server.my-feature.test.js` to focus on one file.
- `npm run validate` executes ES5 compatibility and example snippets. Use it when touching bundling, transports, or documentation code.

### Builds

- `npm run build:dev` compiles bundles in development mode (faster debug cycle).
- `npm run build` + `npm run postbuild` mirrors the release pipeline; only run this when you need to inspect distributables.

## Code style philosophy

- Prettier defines whitespace, quotes, and wrapping. Never hand-format files.
- ESLint (with `unused-imports`, `no-console`, etc.) enforces correctness. Let the tools win; rerun `npm run lint:fix && npm run format` if your editor disagrees.
- Prefer small, incremental commits that respect the SDK’s ES module architecture and multi-platform outputs. Automation keeps everyone aligned, so let the tools guide you instead of enforcing personal style.

## Pull request checklist

Before opening or updating a PR:

- `npm run lint:fix` and `npm run format`
- `npm test` (plus any focused suites you touched)
- `npm run validate` when build outputs, transports, or examples change
- Update docs (`README.md`, `docs/`, `examples/`) for user-facing behavior
- Document risk, testing evidence, and follow-ups in the PR description
- Reference related issues and describe the user benefit in plain language

CI re-runs lint (`--max-warnings 0`), `format:check`, tests, and ES5/example validation on every push, so if something slips through locally it will be caught automatically, and there is no need to stress.

## Troubleshooting linting & formatting

- **ESLint cannot find a plugin**: run `npm install` to ensure devDependencies are installed; the flat config loads plugins via native `import`, so Node 18+ is required.
- **`unused-imports` keeps flagging helper params**: delete the import or prefix intentional unused params with `_` (e.g., `_req`) and rerun `npm run lint:fix`.
- **Prettier rewrites the entire file**: confirm you are using the repo’s pinned Prettier version (`npm run format` handles it) or format just the file you touched (`npm run format -- src/foo.js`).
- **CI fails `format:check` but local format looks fine**: make sure your editor isn’t stripping trailing newlines or converting line endings; set `git config core.autocrlf false` (Unix) or `true` (Windows) and format again.
- **`eslint` reports “Parsing error: Cannot find module”**: ensure every import has a `.js` extension because Rollbar.js is pure ESM, and missing extensions break the parser.

Still stuck? Open a draft PR, start a GitHub Discussion, or tag maintainers in an issue; we’re happy to help.

## Continuous integration expectations

GitHub Actions runs lint, `format:check`, browser/server tests, ES5 validation, and documentation snippet checks on every PR. Hooks are optional; CI is the enforcer so you can iterate locally without fear. Keep patches scoped, trust the automation, and explain what you validated in your PR body.

## Need help?

- Start a GitHub Discussion or issue for questions and feature ideas.
- For security-sensitive findings, follow `SECURITY.md`.
- Unsure where to contribute? Browse open GitHub issues or start a discussion describing what excites you, and maintainers will help scope the work.

Thanks again for partnering with us to improve Rollbar.js!
