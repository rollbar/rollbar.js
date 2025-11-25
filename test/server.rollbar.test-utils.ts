/**
 * Common test utilities for server rollbar tests
 */

export const DUMMY_TRACE_ID = 'some-trace-id';
export const DUMMY_SPAN_ID = 'some-span-id';

export const ValidOpenTracingTracerStub = {
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

export class TestClient {
  logCalls = [];
  tracer = ValidOpenTracingTracerStub;

  notifier = {
    addTransform: () => this.notifier,
  };

  queue = {
    addPredicate: () => this.queue,
  };

  constructor() {
    ['log', 'debug', 'info', 'warn', 'warning', 'error', 'critical'].forEach(
      (logLevel) => {
        this[logLevel] = (item) => {
          this.logCalls.push({ func: logLevel, item });
        };
      },
    );
  }

  buildJsonPayload(obj) {
    this.logCalls.push({ item: obj });
  }

  sendJsonPayload(json) {
    this.logCalls.push({ item: json });
  }

  clearLogCalls() {
    this.logCalls = [];
  }
}
