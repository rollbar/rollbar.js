export class Span {
  constructor(options) {
    this.initReadableSpan(options)

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
      startTime: options.startTime || this.hrTimeNow(),
      endTime: [0, 0],
      status: {code: 0, message: ''},
      attributes: {'session.id': options.session.id},
      links: [],
      events: [],
      duration: 0,
      ended: false,
      resource: options.resource,
      instrumentationScope: options.scope,
      droppedAttributesCount: 0,
      droppedEventsCount: 0,
      droppedLinksCount: 0,
    }
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
    if (value == null || this.ended) return this;
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
      time: time || this.hrTimeNow(),
      droppedAttributesCount: 0,
    });

    return this;
  }

  isRecording() {
    return this.span.ended === false;
  }

  end(attributes, time) {
    if (attributes) this.setAttributes(attributes);
    this.span.endTime = time || this.hrTimeNow();
    this.span.ended = true;
    this.spanProcessor.onEnd(this);
  }

  /*
   * Methods for handling hrtime.
   * OpenTelemetry uses the [seconds, nanoseconds] format for hrtime in the
   * ReadableSpan interface.
   */
  toHrTime(millis) {
    return [Math.trunc(millis / 1000), Math.round((millis % 1000) * 1e6)];
  }

  sumHrTime(a, b) {
    return [a[0] + b[0] + Math.trunc((a[1] + b[1]) / 1e9), (a[1] + b[1]) % 1e9];
  }

  hrTimeNow() {
    return this.sumHrTime(
      this.toHrTime(performance.timeOrigin),
      this.toHrTime(performance.now())
    );
  }

  export() {
    return this.span;
  }
}
