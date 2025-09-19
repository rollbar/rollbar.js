export class SpanProcessor {
  constructor(exporter) {
    this.exporter = exporter;
    this.pendingSpans = new Map();
  }

  onStart(span, _parentContext) {
    this.pendingSpans.set(span.span.spanContext.spanId, span);
  }

  onEnd(span) {
    this.exporter.export([span.export()]);
    this.pendingSpans.delete(span.span.spanContext.spanId);
  }
}
