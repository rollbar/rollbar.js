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

- **Build production**: `npm run build` (Webpack production build)
- **Build development**: `npm run build:dev` (Webpack development build)
- **Lint**: `npm run lint` (ESLint)
- **Test all**: `npm run test` (runs both server and browser tests)
- **Test browser**: `npm run test:wtr` (Web Test Runner)
- **Test browser watch mode**: `npm run test:wtr:watch` (Web Test Runner with watch)
- **Test server**: `npm run test:server` (Mocha)
- **Validate**: `npm run validate` (validates ES5 compatibility and examples)
- **Pack**: `npm run pack` (creates distribution packages)

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

### Documentation vs. Comments

- **Function Documentation (JSDoc/TSDoc)**: Always include comprehensive documentation for functions, classes, and methods using JSDoc/TSDoc format (`/** ... */`). These serve as API documentation, appear in IDE tooltips, and help developers understand purpose, parameters, and return values.

- **Inline Code Comments**: Avoid redundant comments that merely restate what the code is doing. Only add comments to explain:
  - Why the code works a certain way (decisions and reasoning)
  - Non-obvious behavior or edge cases
  - Complex algorithms or business logic
  - Workarounds for bugs or limitations

- **Self-documenting Code**: Write clear, readable code that explains itself through descriptive variable/function names and straightforward logic. Well-written code rarely needs explanatory comments.

- **Examples**:

  ```javascript
  // BAD - Redundant comment
  // Add one to x
  x += 1;

  // GOOD - Explains the non-obvious "why"
  // Increment before sending to API to account for zero-indexing
  x += 1;
  ```

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

### Session Replay Implementation

The `src/browser/replay` directory contains the implementation of the Session Replay feature:

- **Recorder**: Core class that integrates with rrweb to record DOM events
- **ReplayManager**: Manages the mapping between error occurrences and session recordings
- **Configuration**: Configurable options in `defaults.js` for replay behavior

The Session Replay feature utilizes our tracing infrastructure to:

- Record user interactions using rrweb in a memory-efficient way
- Store recordings with checkpoints for better performance
- Generate spans that contain replay events with proper timing
- Associate recordings with user sessions for complete context
- Transport recordings to Rollbar servers via the API

### Session Replay Flow

1. **Recording**: The Recorder class continuously records DOM events using rrweb
2. **Error Occurrence**: When an error occurs, Queue.addItem() calls ReplayManager.add()
3. **Correlation**: ReplayManager generates a replayId and attaches it to the error
4. **Coordination**: After successful error submission, Queue triggers ReplayManager.send()
5. **Transport**: ReplayManager retrieves stored replay data and sends via api.postSpans()

### Testing Infrastructure

- **Unit Tests**: Component-focused tests in `test/replay/unit/`
- **Integration Tests**: Test component interactions in `test/replay/integration/`
- **End-to-End Tests**: Full flow verification in `test/replay/integration/e2e.test.js`
- **Mock Implementation**: `test/replay/util/mockRecordFn.js` provides a deterministic mock of rrweb
- **Fixtures**: Realistic rrweb events in `test/fixtures/replay/` for testing
- **Test Tasks**: Dedicated test configurations for replay code specifically

## File Creation Guidelines

- **Newlines**: All new files MUST end with exactly one newline character
- **Encoding**: Use UTF-8 encoding for all text files
- **Line Endings**: Use LF (Unix-style) line endings, not CRLF
