# Copilot Instructions for Rollbar.js

## What is Rollbar.js?

Rollbar.js is the official JavaScript SDK for the Rollbar error monitoring service. This library integrates with the Rollbar platform to help developers detect, diagnose, and fix errors in real-time. It works by sending error data to Rollbar's cloud service where errors are processed, grouped, and notifications are triggered.

The SDK is designed to work across platforms, supporting both browser and server-side JavaScript including frameworks like React, Angular, Express, and Next.js.

## Key Features

- Cross-platform error tracking for client and server-side code
- Telemetry to provide context around errors (breadcrumbs of events)
- Automatic error grouping to reduce noise
- Real-time notifications for critical issues
- Detailed stack traces with source maps support

## Architecture Overview

The codebase is organized with separate implementations for:
- Browser-based JavaScript (`src/browser/`)
- Server-side Node.js (`src/server/`)
- React Native (`src/react-native/`)

Common functionality is shared in the root `src/` directory.

## Build, Lint, and Test Commands

- Build: `npm run build` (runs Grunt)
- Lint: `npm run lint` (ESLint)
- Test all: `npm run test` (runs both server and browser tests)
- Test browser only: `npm run test-browser`
- Test server only: `npm run test-server`
- Test specific browser test: `grunt test-browser:specificTestName`

## Code Style Guidelines

When contributing to Rollbar.js, please follow these style guidelines:

- Use single quotes for strings
- Use camelCase for variables (underscore prefix for private)
- Indentation: 2 spaces
- Include trailing commas in multiline objects/arrays
- Max function complexity: 35
- Unused parameters prefixed with underscore: `function(a, _unused) {}`
- No whitespace in empty lines
- Files should end with exactly one newline
- Follow ESLint rules in the project
- Use Prettier for code formatting

## Error Handling

The codebase uses a comprehensive error tracking approach with different log levels:
- Debug level for development info
- Warning level for non-critical issues
- Error level for uncaught exceptions

## Common Patterns

When suggesting code, be aware of these common patterns:
- Error transformation and normalization before sending
- Telemetry collection for context
- Queue-based sending with retry logic
- Environment and context detection
- Scrubbing of sensitive data