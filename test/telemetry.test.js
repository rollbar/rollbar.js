/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

import Telemeter from '../src/telemetry.js';
import Tracing from '../src/tracing/tracing.js';

describe('Telemetry()', function () {
  it('should have all of the expected methods', function (done) {
    var options = {};
    var t = new Telemeter(options);
    expect(t).to.have.property('copyEvents');
    expect(t).to.have.property('capture');
    expect(t).to.have.property('captureLog');
    expect(t).to.have.property('captureError');
    expect(t).to.have.property('captureNetwork');
    expect(t).to.have.property('captureEvent');

    done();
  });
});

describe('capture', function () {
  it('should return a valid telemetry event', function (done) {
    var options = {};
    var t = new Telemeter(options);
    var now = +new Date();
    var event = t.capture('network', { url: 'a.com' }, 'debug');
    expect(event.timestamp_ms - now).to.be.below(500);
    expect(event.type).to.equal('network');
    expect(event.level).to.equal('debug');
    expect(event.body.url).to.equal('a.com');

    done();
  });
});

describe('captureEvent', function () {
  it('should return a valid telemetry event', function (done) {
    var t = new Telemeter();
    var event = t.captureEvent('log', { message: 'bar' }, 'info');
    expect(event.type).to.equal('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('bar');

    done();
  });
});

describe('capture events', function () {
  beforeEach(function () {
    const tracing = new Tracing(
      window,
      {
        resource: {
          'service.name': 'Test',
        },
      }
    );
    tracing.initSession();
    this.t = new Telemeter({includeItemsInTelemetry: true}, tracing);
  });

  it('should return a valid log event', function (done) {
    const timestamp = 12345.678;
    const event = this.t.captureLog('foo', 'info', null, timestamp);
    expect(event.type).to.equal('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('foo');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(event.otelAttributes).to.eql(
      { message: 'foo', level: 'info' }
    );

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.equal('rollbar-log-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql({ message: 'foo', level: 'info' });
    done();
  });

  it('should return a valid error event', function (done) {
    const timestamp = 12345.678;
    const error = new Error('foo');
    const uuid = '12345-67890';
    const event = this.t.captureError(error, 'info', uuid, timestamp);
    expect(event.type).to.eql('error');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('foo');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(event.otelAttributes).to.eql(
      { message: 'foo', level: 'info', type: 'error', uuid: uuid }
    );
    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.eql('rollbar-occurrence-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql(
      { type: 'error', message: 'foo', level: 'info', uuid: uuid }
    );
    done();
  });

  it('should return a valid message event', function (done) {
    const timestamp = 12345.678;
    const uuid = '12345-67890';
    const item = { message: 'foo', level: 'info', uuid: uuid, timestamp: timestamp };
    const event = this.t._captureRollbarItem(item);
    expect(event.type).to.eql('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('foo');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(event.otelAttributes).to.eql(
      { message: 'foo', level: 'info', type: 'message', uuid: uuid }
    );
    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.eql('rollbar-occurrence-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql(
      { type: 'message', message: 'foo', level: 'info', uuid: uuid }
    );
    done();
  });

  it('should return a valid navigation event', function (done) {
    const timestamp = 12345.678;
    const from = 'foo';
    const to = 'bar';
    const event = this.t.captureNavigation(from, to, null, timestamp);
    expect(event.type).to.equal('navigation');
    expect(event.level).to.equal('info');
    expect(event.body.from).to.equal('foo');
    expect(event.body.to).to.equal('bar');
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.equal('rollbar-navigation-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql({ 'previous.url.full': 'foo', 'url.full': 'bar' });
    done();
  });

  it('should return a valid network event', function (done) {
    const subtype = 'xhr';
    const timestamp = 12345.678;
    const metadata = {
      url: 'https://example.com',
      method: 'GET',
      status_code: 400,
      request_headers: { 'Content-Type': 'application/json' },
      response: {
        headers: { 'Content-Type': 'application/json' },
      },
      start_time_ms: timestamp,
      end_time_ms: 12345678,
    };
    const event = this.t.captureNetwork(metadata, subtype, null, null);
    expect(event.type).to.eql('network');
    expect(event.level).to.equal('error');
    expect(event.body.url).to.equal(metadata.url);
    expect(event.body.method).to.equal(metadata.method);
    expect(event.body.status_code).to.equal(metadata.status_code);
    expect(event.timestamp_ms).to.equal(timestamp);

    expect(event.otelAttributes).to.eql(
      {
        type: subtype,
        method: metadata.method,
        statusCode: metadata.status_code,
        url: metadata.url,
        'request.headers': JSON.stringify(metadata.request_headers),
        'response.headers': JSON.stringify(metadata.response.headers),
        'response.timeUnixNano': (metadata.end_time_ms * 1e6).toString(),
      }
    );

    expect(this.t.telemetrySpan).to.be.an('object');
    const otelEvent = this.t.telemetrySpan.span.events[0];
    expect(otelEvent.name).to.eql('rollbar-network-event');
    expect(otelEvent.time).to.eql([ 12, 345678000 ]);
    expect(otelEvent.attributes).to.eql(
      {
        type: subtype,
        method: metadata.method,
        statusCode: metadata.status_code,
        url: metadata.url,
        'request.headers': JSON.stringify(metadata.request_headers),
        'response.headers': JSON.stringify(metadata.response.headers),
        'response.timeUnixNano': (metadata.end_time_ms * 1e6).toString(),
      }
    );
    done();
  });
});

describe('filterTelemetry', function () {
  it("should filter out events that don't match the test", function (done) {
    var options = {
      filterTelemetry: function (e) {
        return (
          e.type === 'network' &&
          (e.body.subtype === 'xhr' || e.body.subtype === 'fetch') &&
          e.body.url.indexOf('https://spammer.com') === 0
        );
      },
    };
    var t = new Telemeter(options);
    var evt = t.capture(
      'network',
      { url: 'https://spammer.com', subtype: 'xhr' },
      'debug',
    );
    expect(evt).to.be(false);

    done();
  });

  it('should filter out events in copy even if they are modified after capture', function (done) {
    var options = {
      filterTelemetry: function (e) {
        return e.type === 'network' && e.body.statusCode === 200;
      },
    };
    var t = new Telemeter(options);
    var evt = t.capture('network', { url: 'https://spammer.com' }, 'debug');
    var evt2 = t.capture(
      'network',
      { url: 'https://spammer.com', statusCode: 404 },
      'debug',
    );
    expect(evt).not.to.be(false);
    expect(evt2).not.to.be(false);
    var events = t.copyEvents();
    expect(events.length).to.equal(2);

    evt.body.statusCode = 200;

    events = t.copyEvents();
    expect(events.length).to.equal(1);
    expect(events[0].body.statusCode).to.equal(404);

    done();
  });
});

describe('configure', function () {
  it('should truncate events to new max', function (done) {
    var options = { maxTelemetryEvents: 5 };
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }

    expect(t.queue.length).to.equal(5);
    t.configure({ maxTelemetryEvents: 3 });
    expect(t.queue.length).to.equal(3);
    done();
  });
  it('should lengthen events to allow new max', function (done) {
    var options = { maxTelemetryEvents: 3 };
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }

    expect(t.queue.length).to.equal(3);
    t.configure({ maxTelemetryEvents: 5 });
    expect(t.queue.length).to.equal(3);
    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }
    expect(t.queue.length).to.equal(5);
    done();
  });
  it('does not drop existing options that are not passed to configure', function (done) {
    var options = { maxTelemetryEvents: 3 };
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }

    expect(t.queue.length).to.equal(3);
    t.configure({});
    expect(t.queue.length).to.equal(3);
    for (var i = 0; i < 7; i++) {
      t.capture('network', { url: 'a.com' }, 'debug');
    }
    expect(t.queue.length).to.equal(3);
    done();
  });
});
