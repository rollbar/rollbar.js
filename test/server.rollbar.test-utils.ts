/**
 * Common test utilities for server rollbar tests
 */

import sinon from 'sinon';

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

export const DUMMY_OTEL_TRACE_ID = '4bf92f3577b34da6a3ce929d0e0e4736';
export const DUMMY_OTEL_SPAN_ID = '00f067aa0ba902b7';

export interface OpenTelemetrySpanStub {
  spanContext: () => { traceId: string; spanId: string; traceFlags: number };
  setAttributes: sinon.SinonSpy;
  setStatus: sinon.SinonSpy;
}

/**
 * A span with the parts of @opentelemetry/api's Span that Rollbar uses.
 */
export function createOpenTelemetrySpanStub(
  traceId = DUMMY_OTEL_TRACE_ID,
  spanId = DUMMY_OTEL_SPAN_ID,
): OpenTelemetrySpanStub {
  return {
    spanContext: () => ({ traceId, spanId, traceFlags: 1 }),
    setAttributes: sinon.spy(),
    setStatus: sinon.spy(),
  };
}

/**
 * Stands in for the `trace` object from @opentelemetry/api, whose
 * getActiveSpan() returns the span in the active context, if any.
 */
export class OpenTelemetryTraceApiStub {
  activeSpan: OpenTelemetrySpanStub | undefined;

  getActiveSpan(): OpenTelemetrySpanStub | undefined {
    return this.activeSpan;
  }
}

/**
 * Stands in for a Tracer from @opentelemetry/api's trace.getTracer(), which
 * starts spans but has no way to read the active one.
 */
export class OpenTelemetryTracerStub {
  startSpan(): OpenTelemetrySpanStub {
    return createOpenTelemetrySpanStub();
  }

  startActiveSpan(): void {}
}

/**
 * Stands in for an OpenTracing tracer without a scope manager, like
 * opentracing's MockTracer or @opentelemetry/shim-opentracing's TracerShim.
 */
export class UnscopedOpenTracingTracerStub {
  startSpan(): void {}

  inject(): void {}

  extract(): null {
    return null;
  }
}

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
