import logger from '../logger.js';

export class SpanProcessor {
  constructor(exporter, options = {}) {
    this.exporter = exporter;
    this.options = options;
    this.pendingSpans = new Map()
  }

  onStart(span, _parentContext) {
    this.pendingSpans.set(span.span.spanContext.spanId, span);
  }

  onEnd(span) {
    try {
      if (this.options.transformSpan) {
        this.options.transformSpan({span: span.span});
      }
    } catch (e) {
      logger.error('Error running transformSpan callback', e);
    }
    this.exporter.export([span.export()])
    this.pendingSpans.delete(span.span.spanContext.spanId);
  }
}
