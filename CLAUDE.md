# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About Rollbar.js

Rollbar.js is the official JavaScript SDK for the Rollbar error monitoring service. This library is not standalone - it works in tandem with the Rollbar platform to help developers detect, diagnose, and fix errors in real-time. The SDK sends error data to Rollbar's cloud service where errors are processed, grouped, and notifications are triggered.

The library works across platforms, supporting both browser and server-side JavaScript including frameworks like React, Angular, Express, and Next.js. Key features include:

- Cross-platform error tracking for client and server-side code
- Telemetry to provide context around errors (breadcrumbs of events)
- Automatic error grouping to reduce noise
- Real-time notifications for critical issues
- Detailed stack traces with source maps support

## Project Structure

```
src/
├── browser/      # Browser-specific implementation
├── server/       # Node.js-specific implementation
├── react-native/ # React Native implementation
├── tracing/      # Distributed tracing support
└── utility/      # Shared utility functions
```

## Build & Test Commands

- Build: `npm run build` (runs Grunt)
- Lint: `npm run lint` (ESLint)
- Test all: `npm run test` (runs both server and browser tests)
- Test browser only: `npm run test-browser`
- Test server only: `npm run test-server`
- Test specific browser test: `grunt test-browser:specificTestName`
  - Example: `grunt test-browser:transforms`
- Single test: `./node_modules/.bin/karma start --single-run --files={path/to/test}`

## Code Style Guidelines

- Use single quotes for strings
- Use camelCase for variables (underscore prefix for private)
- Indentation: 2 spaces
- Include trailing commas in multiline objects/arrays
- Max function complexity: 35
- Unused parameters prefixed with underscore: `function(a, _unused) {}`
- No whitespace in empty lines
- Files should end with exactly one newline
- ESLint is used for enforcing code style
- Prettier for code formatting

## Error Handling

- Prefer try/catch blocks around risky operations
- Log errors through Rollbar's own logger system
- Scrub sensitive fields in error payloads (see package.json defaults)
- The codebase uses a comprehensive error tracking approach with appropriate levels:
  - Debug level for development info
  - Warning level for non-critical issues
  - Error level for uncaught exceptions

## TypeScript Support

- Type definitions in index.d.ts
- Add JSDoc types to enable intellisense when needed

## Common Patterns

When working with this codebase, be aware of these patterns:
- Error transformation and normalization before sending
- Telemetry collection for context
- Queue-based sending with retry logic
- Environment and context detection
- Scrubbing of sensitive data