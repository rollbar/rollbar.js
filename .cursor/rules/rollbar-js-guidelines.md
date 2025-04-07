# Rollbar.js Guidelines for Cursor

## Library Overview

Rollbar.js is the official JavaScript SDK for the Rollbar error monitoring platform. This SDK is designed to be integrated into JavaScript applications to capture and report errors to the Rollbar service. Key points:

- Works as a client for the Rollbar cloud service, not as a standalone library
- Supports multiple JavaScript environments (browser, Node.js, React Native)
- Provides error tracking, telemetry, and diagnostic capabilities
- Requires a Rollbar account and access token to function

## Project Structure

```
src/
├── browser/      # Browser-specific implementation
├── server/       # Node.js-specific implementation
├── react-native/ # React Native implementation
├── tracing/      # Distributed tracing support
└── utility/      # Shared utility functions
```

## Development Workflow

- Build: `npm run build` (runs Grunt)
- Lint: `npm run lint` (ESLint)
- Test: `npm run test` (all tests), `npm run test-browser` (browser only), `npm run test-server` (server only)
- Run specific test: `grunt test-browser:specificTestName`
- Single test: `./node_modules/.bin/karma start --single-run --files={path/to/test}`

## Coding Standards

When working with this codebase, please follow these guidelines:

- String quotes: Single quotes (`'example'`)
- Variable naming: camelCase, with underscore prefix for private (`_privateVar`)
- Indentation: 2 spaces
- Array/object formatting: Include trailing commas in multiline declarations
- No whitespace in empty lines
- All files must end with exactly one newline
- Function complexity: Maximum complexity of 35
- Unused parameters: Prefix with underscore (`function(a, _unused) {}`)

## Error Handling and Logging

The library's error handling approach follows specific guidelines:
- Always use try/catch blocks around risky operations
- Log errors through Rollbar's own logger system
- Scrub sensitive fields in error payloads (see package.json defaults)

Different log levels are used for appropriate error categorization:
- `debug`: Development information
- `info`: General information
- `warning`: Non-critical issues
- `error`: Serious problems
- `critical`: Critical failures

## TypeScript Support

- Type definitions are located in index.d.ts
- Add JSDoc types to enable intellisense when needed
- When suggesting TypeScript-compatible code, ensure it aligns with existing type definitions

## Code Suggestions

When suggesting code changes, keep in mind:

1. The library must work in multiple JavaScript environments
2. Error data needs proper transformation and sanitization
3. Network requests should be queued and handle failures gracefully
4. Performance impact should be minimized
5. Sensitive data must be properly scrubbed 
6. Backward compatibility is important