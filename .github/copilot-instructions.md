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
- Distributed tracing and session management
- Session replay capabilities for reproducing user actions

## Architecture Overview

The codebase is organized with separate implementations for:
- Browser-based JavaScript (`src/browser/`)
- Server-side Node.js (`src/server/`)
- React Native (`src/react-native/`)
- Distributed tracing (`src/tracing/`)

Common functionality is shared in the root `src/` directory.

## Build, Lint, and Test Commands

- Build: `npm run build` (runs Grunt)
- Lint: `npm run lint` (ESLint)
- Test all: `npm run test` (runs both server and browser tests)
- Test browser only: `npm run test-browser`
- Test server only: `npm run test-server`
- Test specific browser test: `grunt test-browser:specificTestName`
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
- Control statements (if, for, while, etc.) MUST use braces and newlines, even for single statements
- Opening braces should be on the same line as the control statement
- Follow ESLint rules in the project
- Use Prettier for code formatting

## Error Handling

The error handling approach in Rollbar.js follows these guidelines:
- Prefer try/catch blocks around risky operations
- Log errors through Rollbar's own logger system
- Scrub sensitive fields in error payloads (see package.json defaults)
- Use appropriate log levels:
  - Debug level for development info
  - Warning level for non-critical issues
  - Error level for uncaught exceptions

## TypeScript Support

- Type definitions are located in index.d.ts
- Add JSDoc types to enable intellisense when needed
- When suggesting TypeScript-compatible code, ensure it aligns with existing type definitions

## Common Patterns

When suggesting code, be aware of these common patterns:
- Error transformation and normalization before sending
- Telemetry collection for context
- Queue-based sending with retry logic
- Environment and context detection
- Scrubbing of sensitive data

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