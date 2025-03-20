import { Span } from './span.js';

export class Tracer {
  constructor(tracing, spanProcessor) {
    this.spanProcessor = spanProcessor;
    this.tracing = tracing;
  }

  startSpan(
    name,
    options = {},
    context = this.tracing.active()
  ) {
    const parentSpan = this.tracing.getSpan(context);
    const parentSpanContext = parentSpan?.spanContext();
    const spanId = this.tracing.hexId(8);
    let traceId;
    let traceFlags = 0;
    let traceState = null;
    let parentSpanId;
    if (parentSpanContext) {
      traceId = parentSpanContext.traceId;
      traceState = parentSpanContext.traceState;
      parentSpanId = parentSpanContext.spanId;
    } else {
      traceId = this.tracing.hexId(16);
    }

    const kind = 0;
    const spanContext = { traceId, spanId, traceFlags, traceState };

    const span = new Span({
      resource: this.tracing.resource,
      scope: this.tracing.scope,
      session: this.tracing.session.session,
      context,
      spanContext,
      name,
      kind,
      parentSpanId,
      spanProcessor: this.spanProcessor,
    });
    return span;
  }
}
