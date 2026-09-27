import hrtime from './hrtime.js';

export class Span {
  constructor(options) {
    this.usePerformance = options.usePerformance;
    this.maxEvents = options.maxEvents;
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

  /**
   * Adds an event to the span.
   *
   * When the span was started with a positive `maxEvents`, the events list
   * behaves as a ring buffer: once full, the oldest event is dropped and
   * `droppedEventsCount` is incremented, so a long-lived span stays bounded.
   *
   * @param {string} name - Event name
   * @param {Object} [attributes] - Event attributes
   * @param {Array<number>} [time] - Event time as an hrtime tuple
   * @returns {Span} This span
   */
  addEvent(name, attributes = {}, time) {
    if (this.span.ended) return this;

    if (this.maxEvents > 0 && this.span.events.length >= this.maxEvents) {
      this.span.events.shift();
      this.span.droppedEventsCount++;
    }

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
