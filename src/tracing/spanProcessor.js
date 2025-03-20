export class SpanProcessor {
  constructor(exporter) {
    this.exporter = exporter;
  }

  onStart(span, _parentContext) {
    pendingSpans.set(span.spanContext.spanId, span);
  }

  onEnd(span) {
    this.exporter.export([span.export()])
    pendingSpans.delete(span.spanContext.spanId);
  }
}

export const pendingSpans = new Map();
