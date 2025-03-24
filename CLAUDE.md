# Rollbar.js Development Guide

## Build/Lint/Test Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Test all: `npm run test`
- Test browser: `npm run test-browser`
- Test server: `npm run test-server`
- Single test: `./node_modules/.bin/karma start --single-run --files={path/to/test}`

## Code Style
- Use ESLint with extends: `eslint:recommended`
- Single quotes for strings
- CamelCase for variables (properties excluded)
- Trailing commas for all multi-line objects/arrays
- Maximum complexity: 35
- Underscore prefix allowed for private methods/variables
- Prefix unused parameters with underscore: `function(data, _unused)`
- Use Prettier with default config for formatting

## Error Handling
- Prefer try/catch blocks around risky operations
- Log errors through Rollbar's own logger system
- Scrub sensitive fields in error payloads (see package.json defaults)

## TypeScript Support
- Type definitions in index.d.ts
- Add JSDoc types to enable intellisense when needed
