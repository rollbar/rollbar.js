import hrtime from './hrtime';

/**
 * SpanExporter is responsible for exporting ReadableSpan objects
 * and transforming them into the OTLP-compatible format.
 */
export class SpanExporter {
  /**
   * Export spans to the span export queue
   *
   * @param {Array} spans - Array of ReadableSpan objects to export
   * @param {Function} _resultCallback - Optional callback (not used)
   */
  export(spans, _resultCallback) {
    console.log(spans); // console exporter, TODO: make optional
    spanExportQueue.push(...spans);
  }

  /**
   * Transforms an array of ReadableSpan objects into the OTLP format payload
   * compatible with the Rollbar API. This follows the OpenTelemetry protocol
   * specification for traces.
   *
   * @param {Array} spans - Array of ReadableSpan objects to transform
   * @param {Object} options - Additional options for the transformation
   * @param {Object} options.resource - Resource information
   * @returns {Object} OTLP format payload for API transmission
   */
  toPayload(options = {}) {
    const spans = spanExportQueue.slice();
    spanExportQueue.length = 0;

    if (!spans || !spans.length) {
      return { resourceSpans: [] };
    }

    const resource = (spans[0] && spans[0].resource) || {};

    const scopeMap = new Map();

    for (const span of spans) {
      const scopeKey = span.instrumentationScope
        ? `${span.instrumentationScope.name}:${span.instrumentationScope.version}`
        : 'default:1.0.0';

      if (!scopeMap.has(scopeKey)) {
        scopeMap.set(scopeKey, {
          scope: span.instrumentationScope || {
            name: 'default',
            version: '1.0.0',
            attributes: [],
          },
          spans: [],
        });
      }

      scopeMap.get(scopeKey).spans.push(this._transformSpan(span));
    }

    return {
      resourceSpans: [
        {
          resource: this._transformResource(resource),
          scopeSpans: Array.from(scopeMap.values()).map((scopeData) => ({
            scope: this._transformInstrumentationScope(scopeData.scope),
            spans: scopeData.spans,
          })),
        },
      ],
    };
  }

  /**
   * Transforms a ReadableSpan into the OTLP Span format
   *
   * @private
   * @param {Object} span - ReadableSpan object to transform
   * @returns {Object} OTLP Span format
   */
  _transformSpan(span) {
    const transformAttributes = (attributes) => {
      return Object.entries(attributes || {}).map(([key, value]) => ({
        key,
        value: this._transformAnyValue(value),
      }));
    };

    const transformEvents = (events) => {
      return (events || []).map((event) => ({
        timeUnixNano: hrtime.toNanos(event.time),
        name: event.name,
        attributes: transformAttributes(event.attributes),
      }));
    };

    return {
      traceId: span.spanContext.traceId,
      spanId: span.spanContext.spanId,
      parentSpanId: span.parentSpanId || '',
      name: span.name,
      kind: span.kind || 1, // INTERNAL by default
      startTimeUnixNano: hrtime.toNanos(span.startTime),
      endTimeUnixNano: hrtime.toNanos(span.endTime),
      attributes: transformAttributes(span.attributes),
      events: transformEvents(span.events),
    };
  }

  /**
   * Transforms a resource object into OTLP Resource format
   *
   * @private
   * @param {Object} resource - Resource information
   * @returns {Object} OTLP Resource format
   */
  _transformResource(resource) {
    const attributes = resource.attributes || {};
    const keyValues = Object.entries(attributes).map(([key, value]) => ({
      key,
      value: this._transformAnyValue(value),
    }));

    return {
      attributes: keyValues,
    };
  }

  /**
   * Transforms an instrumentation scope into OTLP InstrumentationScope format
   *
   * @private
   * @param {Object} scope - Instrumentation scope information
   * @returns {Object} OTLP InstrumentationScope format
   */
  _transformInstrumentationScope(scope) {
    return {
      name: scope.name || '',
      version: scope.version || '',
      attributes: (scope.attributes || []).map((attr) => ({
        key: attr.key,
        value: this._transformAnyValue(attr.value),
      })),
    };
  }

  /**
   * Transforms a JavaScript value into an OTLP AnyValue
   *
   * @private
   * @param {any} value - Value to transform
   * @returns {Object} OTLP AnyValue format
   */
  _transformAnyValue(value) {
    if (value === null || value === undefined) {
      return { stringValue: '' };
    }

    const type = typeof value;

    if (type === 'string') {
      return { stringValue: value };
    } else if (type === 'number') {
      if (Number.isInteger(value)) {
        return { intValue: value.toString() };
      } else {
        return { doubleValue: value };
      }
    } else if (type === 'boolean') {
      return { boolValue: value };
    } else if (Array.isArray(value)) {
      return {
        arrayValue: {
          values: value.map((v) => this._transformAnyValue(v)),
        },
      };
    } else if (type === 'object') {
      return {
        kvlistValue: {
          values: Object.entries(value).map(([k, v]) => ({
            key: k,
            value: this._transformAnyValue(v),
          })),
        },
      };
    }

    return { stringValue: String(value) };
  }
}

export const spanExportQueue = [];
