/**
 * Common test utilities for server rollbar tests
 */

export const DUMMY_TRACE_ID = 'some-trace-id';
export const DUMMY_SPAN_ID = 'some-span-id';

interface OpenTracingContext {
  toTraceId: () => string;
  toSpanId: () => string;
}

interface OpenTracingSpan {
  setTag: () => void;
  context: () => OpenTracingContext;
}

interface OpenTracingScope {
  active: () => OpenTracingSpan;
}

export const ValidOpenTracingTracerStub: {
  scope: () => OpenTracingScope;
} = {
  scope: () => ({
    active: () => ({
      setTag: () => {},
      context: () => ({
        toTraceId: () => DUMMY_TRACE_ID,
        toSpanId: () => DUMMY_SPAN_ID,
      }),
    }),
  }),
};

export const InvalidOpenTracingTracerStub = {
  foo: () => {},
};

interface LogCall {
  func?: string;
  item: unknown;
}

type LoggerMethod = (item: unknown) => void;
const loggerMethods = [
  'log',
  'debug',
  'info',
  'warn',
  'warning',
  'error',
  'critical',
] as const;

export class TestClient {
  logCalls: LogCall[] = [];
  tracer = ValidOpenTracingTracerStub;

  notifier = {
    addTransform: () => this.notifier,
  };

  queue = {
    addPredicate: () => this.queue,
  };

  log?: LoggerMethod;
  debug?: LoggerMethod;
  info?: LoggerMethod;
  warn?: LoggerMethod;
  warning?: LoggerMethod;
  error?: LoggerMethod;
  critical?: LoggerMethod;

  constructor() {
    loggerMethods.forEach((logLevel) => {
      (this as Record<(typeof loggerMethods)[number], LoggerMethod>)[logLevel] =
        (item) => {
          this.logCalls.push({ func: logLevel, item });
        };
    });
  }

  buildJsonPayload(obj: unknown): void {
    this.logCalls.push({ item: obj });
  }

  sendJsonPayload(json: unknown): void {
    this.logCalls.push({ item: json });
  }

  clearLogCalls(): void {
    this.logCalls = [];
  }
}
