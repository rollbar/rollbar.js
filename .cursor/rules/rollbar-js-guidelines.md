# Rollbar.js Guidelines for Cursor

## Library Overview

Rollbar.js is the official JavaScript SDK for the Rollbar error monitoring platform. This SDK is designed to be integrated into JavaScript applications to capture and report errors to the Rollbar service. Key points:

- Works as a client for the Rollbar cloud service, not as a standalone library
- Supports multiple JavaScript environments (browser, Node.js, React Native)
- Provides error tracking, telemetry, and diagnostic capabilities
- Enables distributed tracing and session management
- Includes Session Replay features for reproducing user actions
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

## Modern Development Environment

As of version 3.0.0, the SDK has been updated to use modern JavaScript features with appropriate transpilation:

- **ES Modules**: The codebase supports ES modules (`import/export`) syntax
- **Target Compatibility**: 
  - Source code uses ECMAScript 2021 features
  - Builds target ES5 for broad browser compatibility
  - Lower versions can use the ES5/CommonJS compatible bundles
- **Build System**: 
  - Webpack 5 with Babel for transpilation
  - ESLint for code quality
  - Configurable output formats (UMD, AMD, vanilla)
- **Minimum Node.js**: Version 18+ for absolute imports
- **Toolchain Configuration**:
  - `babel.config.json`: Controls transpilation options
  - `eslint.config.mjs`: Modern ESLint flat config format
  - `webpack.config.js`: Manages bundling and output formats

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
- Control statements: All if/for/while blocks MUST use braces and newlines, even for single statements
- Opening braces: Should be on the same line as the control statement

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

## Tracing & Session Replay

The `src/tracing/` directory contains an OpenTelemetry-inspired tracing implementation that powers both distributed tracing and session recording features:

### Components

- **Context & ContextManager**: Manages propagation of tracing context through the application
- **Span**: Represents a unit of work or operation with timing information and attributes
- **Tracer**: Creates and manages spans for tracking operations
- **SpanProcessor & SpanExporter**: Processes and exports spans to their destination 
- **Session**: Manages browser session data persistence and creation

### Usage Patterns

- **Tracing initialization**: Initialize via the main Tracing class with appropriate configuration
- **Context propagation**: Use context to pass trace information between components
- **Span creation**: Create spans to measure operations with `startSpan()`
- **Attributes and events**: Add metadata to spans with `setAttribute()` and `addEvent()`
- **Session management**: Automatically manages user sessions via browser sessionStorage

### Integration with Session Replay

The Session Replay feature utilizes this tracing infrastructure to:
- Track and record user sessions with unique identifiers
- Associate spans with specific user sessions for complete context
- Capture timing information for accurate playback
- Store interaction events as span attributes and events

## Code Suggestions

When suggesting code changes, keep in mind:

1. The library must work in multiple JavaScript environments
2. Error data needs proper transformation and sanitization
3. Network requests should be queued and handle failures gracefully
4. Performance impact should be minimized
5. Sensitive data must be properly scrubbed 
6. Backward compatibility is important
7. Tracing and session data should follow OpenTelemetry concepts