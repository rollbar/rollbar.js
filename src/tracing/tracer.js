import { Span } from './span.js';
import id from './id.js';

export class Tracer {
  constructor(tracing, spanProcessor) {
    this.spanProcessor = spanProcessor;
    this.tracing = tracing;
  }

  startSpan(
    name,
    options = {},
    context = this.tracing.contextManager.active(),
  ) {
    const parentSpan = this.tracing.getSpan(context);
    const parentSpanContext = parentSpan?.spanContext();
    const spanId = id.gen(8);
    let traceId;
    let traceFlags = 0;
    let traceState = null;
    let parentSpanId;
    if (parentSpanContext) {
      traceId = parentSpanContext.traceId;
      traceState = parentSpanContext.traceState;
      parentSpanId = parentSpanContext.spanId;
    } else {
      traceId = id.gen(16);
    }

    const kind = 0;
    const spanContext = { traceId, spanId, traceFlags, traceState };
    const resource = {
      attributes: {
        ...(this.tracing.resource?.attributes || {}),
        ...(options.resource?.attributes || {}),
      },
    };

    const span = new Span({
      resource: resource,
      scope: this.tracing.scope,
      session: this.tracing.session.session,
      context,
      spanContext,
      name,
      kind,
      parentSpanId,
      spanProcessor: this.spanProcessor,
      startTime: options.startTime,
      usePerformance: options.usePerformance,
    });
    return span;
  }
}
