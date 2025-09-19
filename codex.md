## About Rollbar.js

Rollbar.js is the official JavaScript SDK for the Rollbar error monitoring service. This library is not standalone - it works in tandem with the Rollbar platform to help developers detect, diagnose, and fix errors in real-time. The SDK sends error data to Rollbar's cloud service where errors are processed, grouped, and notifications are triggered.

The library works across platforms, supporting both browser and server-side JavaScript including frameworks like React, Angular, Express, and Next.js. Key features include:

- Cross-platform error tracking for client and server-side code
- Telemetry to provide context around errors (breadcrumbs of events)
- Automatic error grouping to reduce noise
- Real-time notifications for critical issues
- Detailed stack traces with source maps support
- Distributed tracing and session management
- Session replay capabilities for reproducing user actions

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
- Test browser only: `npm run test:wtr`
- Test server only: `npm run test:server`
- Test specific browser test: `grunt test-browser:specificTestName`
  - Example: `grunt test-browser:transforms`
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
- ESLint is used for enforcing code style
- Prettier for code formatting

## SDK Design Principles

- **User Problems Are SDK Improvement Opportunities**: When users encounter integration issues, treat these as SDK design improvements rather than user implementation mistakes.
  - Focus on enhancing the SDK to be more robust, intuitive and resilient
  - Implement automatic environment detection and appropriate behavior selection
  - Design APIs that work correctly across all supported contexts without requiring special user handling
  - Errors should be informative and suggest correct usage patterns
  - The burden of complexity should rest with the SDK, not its users

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

## Testing Philosophy

- **Analyze Test Failures Objectively**: When tests fail, evaluate both possibilities objectively:

  - The test could be correctly identifying an actual code issue
  - The test itself might contain errors or invalid expectations

- **Diagnostic Process**:

  1. Examine what the test is expecting vs. what the code actually does
  2. Consider the intended behavior and design of the system
  3. If the test is correct and identifying a legitimate bug, fix the code
  4. If the test contains misconceptions or errors, fix the test

- **Default to Code Quality**: When in doubt and both seem potentially valid, prioritize improving code quality over modifying tests to pass

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
