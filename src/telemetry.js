import * as _ from './utility.js';

const MAX_EVENTS = 100;

// Temporary workaround while solving commonjs -> esm issues in Node 18 - 20.
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round((millis % 1000) * 1e6)];
}

class Telemeter {
  constructor(options, tracing) {
    this.queue = [];
    this.options = _.merge(options);
    var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
    this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
    this.tracing = tracing;
    this.telemetrySpan = this.tracing?.startSpan('rollbar-telemetry', {});
  }

  configure(options) {
    var oldOptions = this.options;
    this.options = _.merge(oldOptions, options);
    var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
    var newMaxEvents = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
    var deleteCount = 0;
    if (this.queue.length > newMaxEvents) {
      deleteCount = this.queue.length - newMaxEvents;
    }
    this.maxQueueSize = newMaxEvents;
    this.queue.splice(0, deleteCount);
  }

  copyEvents() {
    var events = Array.prototype.slice.call(this.queue, 0);
    if (_.isFunction(this.options.filterTelemetry)) {
      try {
        var i = events.length;
        while (i--) {
          if (this.options.filterTelemetry(events[i])) {
            events.splice(i, 1);
          }
        }
      } catch (e) {
        this.options.filterTelemetry = null;
      }
    }

    // Filter until supported in legacy telemetry
    events = events.filter((e) => e.type !== 'connectivity');

    // Remove internal keys from output
    events = events.map(({ otelAttributes, ...event }) => event);

    return events;
  }

  exportTelemetrySpan(attributes = {}) {
    if (this.telemetrySpan) {
      this.telemetrySpan.end(attributes);
      this.telemetrySpan = this.tracing.startSpan('rollbar-telemetry', {});
    }
  }

  capture(
    type,
    metadata,
    level,
    rollbarUUID,
    timestamp = null,
    otelAttributes = null,
  ) {
    var e = {
      level: getLevel(type, level),
      type: type,
      timestamp_ms: timestamp || _.now(),
      body: metadata,
      source: 'client',
    };
    if (rollbarUUID) {
      e.uuid = rollbarUUID;
    }
    if (otelAttributes) {
      e.otelAttributes = otelAttributes;
    }

    try {
      if (
        _.isFunction(this.options.filterTelemetry) &&
        this.options.filterTelemetry(e)
      ) {
        return false;
      }
    } catch (exc) {
      this.options.filterTelemetry = null;
    }

    this.push(e);
    return e;
  }

  captureEvent(type, metadata, level, rollbarUUID) {
    return this.capture(type, metadata, level, rollbarUUID);
  }

  captureError(err, level, rollbarUUID, timestamp) {
    const message = err.message || String(err);
    var metadata = { message };
    if (err.stack) {
      metadata.stack = err.stack;
    }
    const otelAttributes = {
      message,
      level,
      type: 'error',
      uuid: rollbarUUID,
    };

    this.telemetrySpan?.addEvent(
      'rollbar-occurrence-event',
      otelAttributes,
      fromMillis(timestamp),
    );

    return this.capture(
      'error',
      metadata,
      level,
      rollbarUUID,
      timestamp,
      otelAttributes,
    );
  }

  captureLog(message, level, rollbarUUID, timestamp) {
    let otelAttributes = null;

    // If the uuid is present, this is a message occurrence.
    if (rollbarUUID) {
      ((otelAttributes = {
        message,
        level,
        type: 'message',
        uuid: rollbarUUID,
      }),
        this.telemetrySpan?.addEvent(
          'rollbar-occurrence-event',
          otelAttributes,
          fromMillis(timestamp),
        ));
    } else {
      otelAttributes = { message, level };
      this.telemetrySpan?.addEvent(
        'rollbar-log-event',
        otelAttributes,
        fromMillis(timestamp),
      );
    }

    return this.capture(
      'log',
      { message },
      level,
      rollbarUUID,
      timestamp,
      otelAttributes,
    );
  }

  captureNetwork(metadata, subtype, rollbarUUID, requestData) {
    subtype = subtype || 'xhr';
    metadata.subtype = metadata.subtype || subtype;
    if (requestData) {
      metadata.request = requestData;
    }
    const level = this.levelFromStatus(metadata.status_code);
    const endTimeNano = (metadata.end_time_ms || 0) * 1e6;
    const otelAttributes = {
      type: metadata.subtype,
      method: metadata.method,
      url: metadata.url,
      statusCode: metadata.status_code,
      'request.headers': JSON.stringify(metadata.request_headers || {}),
      'response.headers': JSON.stringify(metadata.response?.headers || {}),
      'response.timeUnixNano': endTimeNano.toString(),
    };

    this.telemetrySpan?.addEvent(
      'rollbar-network-event',
      otelAttributes,
      fromMillis(metadata.start_time_ms),
    );

    return this.capture(
      'network',
      metadata,
      level,
      rollbarUUID,
      metadata.start_time_ms,
      otelAttributes,
    );
  }

  levelFromStatus(statusCode) {
    if (statusCode >= 200 && statusCode < 400) {
      return 'info';
    }
    if (statusCode === 0 || statusCode >= 400) {
      return 'error';
    }
    return 'info';
  }

  captureDom(subtype, element, value, checked, rollbarUUID) {
    var metadata = {
      subtype: subtype,
      element: element,
    };
    if (value !== undefined) {
      metadata.value = value;
    }
    if (checked !== undefined) {
      metadata.checked = checked;
    }
    return this.capture('dom', metadata, 'info', rollbarUUID);
  }

  captureInput({ type, isSynthetic, element, value, timestamp }) {
    const name = 'rollbar-input-event';
    const metadata = {
      type: name,
      subtype: type,
      element,
      value,
    };
    const otelAttributes = {
      type,
      isSynthetic,
      element,
      value,
      endTimeUnixNano: fromMillis(timestamp),
    };
    const event = this._getRepeatedEvent(name, otelAttributes);
    if (event) {
      return this._updateRepeatedEvent(event, otelAttributes, timestamp);
    }

    this.telemetrySpan?.addEvent(name, otelAttributes, fromMillis(timestamp));

    return this.capture(
      'dom',
      metadata,
      'info',
      null,
      timestamp,
      otelAttributes,
    );
  }

  captureClick({ type, isSynthetic, element, timestamp }) {
    const name = 'rollbar-click-event';
    const metadata = {
      type: name,
      subtype: type,
      element,
    };
    const otelAttributes = {
      type,
      isSynthetic,
      element,
      endTimeUnixNano: fromMillis(timestamp),
    };
    const event = this._getRepeatedEvent(name, otelAttributes);
    if (event) {
      return this._updateRepeatedEvent(event, otelAttributes, timestamp);
    }

    this.telemetrySpan?.addEvent(name, otelAttributes, fromMillis(timestamp));

    return this.capture(
      'dom',
      metadata,
      'info',
      null,
      timestamp,
      otelAttributes,
    );
  }

  _getRepeatedEvent(name, attributes) {
    const lastEvent = this._lastEvent(this.queue);

    if (
      lastEvent &&
      lastEvent.body.type === name &&
      lastEvent.otelAttributes.target === attributes.target
    ) {
      return lastEvent;
    }
  }

  _updateRepeatedEvent(event, attributes, timestamp) {
    const duration = Math.max(timestamp - event.timestamp_ms, 1);
    event.body.value = attributes.value;
    event.otelAttributes.value = attributes.value;
    event.otelAttributes.height = attributes.height;
    event.otelAttributes.width = attributes.width;
    event.otelAttributes.textZoomRatio = attributes.textZoomRatio;
    event.otelAttributes['endTimeUnixNano'] = fromMillis(timestamp);
    event.otelAttributes['durationUnixNano'] = fromMillis(duration);
    event.otelAttributes.count = (event.otelAttributes.count || 1) + 1;
    event.otelAttributes.rate = event.otelAttributes.count / (duration / 1000);
  }

  _lastEvent(list) {
    return list.length > 0 ? list[list.length - 1] : null;
  }

  captureFocus({ type, isSynthetic, element, timestamp }) {
    const name = 'rollbar-focus-event';
    const metadata = {
      type: name,
      subtype: type,
      element,
    };
    const otelAttributes = {
      type,
      isSynthetic,
      element,
    };

    this.telemetrySpan?.addEvent(name, otelAttributes, fromMillis(timestamp));

    return this.capture(
      'dom',
      metadata,
      'info',
      null,
      timestamp,
      otelAttributes,
    );
  }

  captureResize({
    type,
    isSynthetic,
    width,
    height,
    textZoomRatio,
    timestamp,
  }) {
    const name = 'rollbar-resize-event';
    const metadata = {
      type: name,
      subtype: type,
      width,
      height,
      textZoomRatio,
    };
    const otelAttributes = {
      type,
      isSynthetic,
      width,
      height,
      textZoomRatio,
    };

    const event = this._getRepeatedEvent(name, otelAttributes);
    if (event) {
      return this._updateRepeatedEvent(event, otelAttributes, timestamp);
    }

    this.telemetrySpan?.addEvent(name, otelAttributes, fromMillis(timestamp));

    return this.capture(
      'dom',
      metadata,
      'info',
      null,
      timestamp,
      otelAttributes,
    );
  }

  captureDragDrop({
    type,
    isSynthetic,
    element,
    dropEffect,
    effectAllowed,
    kinds,
    mediaTypes,
    timestamp,
  }) {
    const name = 'rollbar-dragdrop-event';
    let metadata = {
      type: name,
      subtype: type,
      isSynthetic,
    };

    let otelAttributes = {
      type,
      isSynthetic,
    };

    if (type === 'dragstart') {
      metadata = { ...metadata, element, dropEffect, effectAllowed };
      otelAttributes = {
        ...otelAttributes,
        element,
        dropEffect,
        effectAllowed,
      };
    }

    if (type === 'drop') {
      metadata = {
        ...metadata,
        element,
        dropEffect,
        effectAllowed,
        kinds,
        mediaTypes,
      };
      otelAttributes = {
        ...otelAttributes,
        element,
        dropEffect,
        effectAllowed,
        kinds,
        mediaTypes,
      };
    }

    this.telemetrySpan?.addEvent(name, otelAttributes, fromMillis(timestamp));

    return this.capture(
      'dom',
      metadata,
      'info',
      null,
      timestamp,
      otelAttributes,
    );
  }

  captureNavigation(from, to, rollbarUUID, timestamp) {
    this.telemetrySpan?.addEvent(
      'rollbar-navigation-event',
      { 'previous.url.full': from, 'url.full': to },
      fromMillis(timestamp),
    );

    return this.capture(
      'navigation',
      { from, to },
      'info',
      rollbarUUID,
      timestamp,
    );
  }

  captureDomContentLoaded(ts) {
    return this.capture(
      'navigation',
      { subtype: 'DOMContentLoaded' },
      'info',
      undefined,
      ts && ts.getTime(),
    );
    /**
     * If we decide to make this a dom event instead, then use the line below:
    return this.capture('dom', {subtype: 'DOMContentLoaded'}, 'info', undefined, ts && ts.getTime());
    */
  }

  captureLoad(ts) {
    return this.capture(
      'navigation',
      { subtype: 'load' },
      'info',
      undefined,
      ts && ts.getTime(),
    );
    /**
     * If we decide to make this a dom event instead, then use the line below:
    return this.capture('dom', {subtype: 'load'}, 'info', undefined, ts && ts.getTime());
    */
  }

  captureConnectivityChange({ type, isSynthetic, timestamp }) {
    const name = 'rollbar-connectivity-event';
    const metadata = {
      type: name,
      subtype: type,
    };
    const otelAttributes = {
      type,
      isSynthetic,
    };

    this.telemetrySpan?.addEvent(name, otelAttributes, fromMillis(timestamp));

    return this.capture(
      'connectivity',
      metadata,
      'info',
      null,
      timestamp,
      otelAttributes,
    );
  }

  // Only intended to be used internally by the notifier
  _captureRollbarItem(item) {
    if (!this.options.includeItemsInTelemetry) {
      return;
    }
    if (item.err) {
      return this.captureError(item.err, item.level, item.uuid, item.timestamp);
    }
    if (item.message) {
      return this.captureLog(
        item.message,
        item.level,
        item.uuid,
        item.timestamp,
      );
    }
    if (item.custom) {
      return this.capture(
        'log',
        item.custom,
        item.level,
        item.uuid,
        item.timestamp,
      );
    }
  }

  push(e) {
    this.queue.push(e);
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift();
    }
  }
}

function getLevel(type, level) {
  if (level) {
    return level;
  }
  var defaultLevel = {
    error: 'error',
    manual: 'info',
  };
  return defaultLevel[type] || 'info';
}

export default Telemeter;
