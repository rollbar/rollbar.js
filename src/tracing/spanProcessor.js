import logger from '../logger.js';

export class SpanProcessor {
  constructor(exporter, options = {}) {
    this.exporter = exporter;
    this.options = options;
    this.pendingSpans = new Map();
    this.transforms = [this.userTransform.bind(this)];
  }

  addTransform(transformFn) {
    this.transforms.unshift(transformFn);
  }

  userTransform(span) {
    if (this.options.transformSpan) {
      this.options.transformSpan({ span: span });
    }
  }

  applyTransforms(span) {
    for (const transform of this.transforms) {
      try {
        transform(span);
      } catch (e) {
        logger.error('Error running span transform callback', e);
      }
    }
  }

  onStart(span, _parentContext) {
    this.pendingSpans.set(span.span.spanContext.spanId, span);
  }

  onEnd(span) {
    this.applyTransforms(span.span);
    this.exporter.export([span.export()]);
    this.pendingSpans.delete(span.span.spanContext.spanId);
  }
}
