/**
 * Shared utilities for browser.rollbar tests.
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

export function TestClientGen() {
  var TestClient = function () {
    this.transforms = [];
    this.predicates = [];
    this.notifier = {
      addTransform: function (t) {
        this.transforms.push(t);
        return this.notifier;
      }.bind(this),
    };
    this.queue = {
      addPredicate: function (p) {
        this.predicates.push(p);
        return this.queue;
      }.bind(this),
    };
    this.logCalls = [];
    var logs = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i = 0, len = logs.length; i < len; i++) {
      var fn = logs[i].slice(0);
      this[fn] = function (fn, item) {
        this.logCalls.push({ func: fn, item: item });
      }.bind(this, fn);
    }
    this.options = {};
    this.payloadData = {};
    this.configure = function (o, payloadData) {
      this.options = o;
      this.payloadData = payloadData;
    };
    this.tracer = ValidOpenTracingTracerStub;
  };

  return TestClient;
}

/**
 * Standard stub response for tests.
 */
export function stubResponse(server) {
  server.respondWith('POST', 'api/1/item', [
    200,
    { 'Content-Type': 'application/json' },
    '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
  ]);
}
