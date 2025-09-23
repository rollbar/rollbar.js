import hrtime from './hrtime.js';

export class Span {
  constructor(options) {
    this.usePerformance = options.usePerformance;
    this.initReadableSpan(options);

    this.spanProcessor = options.spanProcessor;
    this.spanProcessor.onStart(this, options.context);

    if (options.attributes) {
      this.setAttributes(options.attributes);
    }
    return this;
  }

  initReadableSpan(options) {
    this.span = {
      name: options.name,
      kind: options.kind,
      spanContext: options.spanContext,
      parentSpanId: options.parentSpanId,
      startTime: options.startTime || hrtime.now(options.usePerformance),
      endTime: [0, 0],
      status: { code: 0, message: '' },
      attributes: { 'session.id': options.session?.id },
      links: [],
      events: [],
      duration: 0,
      ended: false,
      resource: options.resource,
      instrumentationScope: options.scope,
      droppedAttributesCount: 0,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
    };
  }

  spanContext() {
    return this.span.spanContext;
  }

  get spanId() {
    return this.span.spanContext.spanId;
  }

  get traceId() {
    return this.span.spanContext.traceId;
  }

  setAttribute(key, value) {
    if (value == null || this.span.ended) return this;
    if (key.length === 0) return this;

    this.span.attributes[key] = value;
    return this;
  }

  setAttributes(attributes) {
    for (const [k, v] of Object.entries(attributes)) {
      this.setAttribute(k, v);
    }
    return this;
  }

  addEvent(name, attributes = {}, time) {
    if (this.span.ended) return this;

    this.span.events.push({
      name,
      attributes,
      time: time || hrtime.now(),
      droppedAttributesCount: 0,
    });

    return this;
  }

  isRecording() {
    return this.span.ended === false;
  }

  end(attributes, time) {
    if (attributes) this.setAttributes(attributes);
    this.span.endTime = time || hrtime.now(this.usePerformance);
    this.span.ended = true;
    this.spanProcessor.onEnd(this);
  }

  export() {
    return this.span;
  }
}
