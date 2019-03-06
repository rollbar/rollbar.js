/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Telemeter = require('../src/telemetry');

describe('Telemetry()', function() {
  it('should have all of the expected methods', function(done) {
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

describe('capture', function() {
  it('should return a valid telemetry event', function(done) {
    var options = {};
    var t = new Telemeter(options);
    var now = +new Date();
    var event = t.capture('network', {url: 'a.com'}, 'debug');
    expect(event.timestamp_ms - now).to.be.below(500);
    expect(event.type).to.equal('network');
    expect(event.level).to.equal('debug');
    expect(event.body.url).to.equal('a.com');

    done();
  });
});

describe('captureEvent', function() {
  it('should return a valid telemetry event', function(done) {
    var t = new Telemeter();
    var event = t.captureEvent('log', {message: 'bar'}, 'info');
    expect(event.type).to.equal('log');
    expect(event.level).to.equal('info');
    expect(event.body.message).to.equal('bar');

    done();
  });
});

describe('filterTelemetry', function() {
  it('should filter out events that don\'t match the test', function(done) {
    var options = {
      filterTelemetry: function(e) {
        return e.type === 'network'
          && (e.body.subtype === 'xhr' || e.body.subtype === 'fetch')
          && e.body.url.indexOf('https://spammer.com') === 0;
      }
    };
    var t = new Telemeter(options);
    var evt = t.capture('network', {url: 'https://spammer.com', subtype: 'xhr'}, 'debug');
    expect(evt).to.be(false);

    done();
  });

  it('should filter out events in copy even if they are modified after capture', function(done) {
    var options = {
      filterTelemetry: function(e) {
        return e.type === 'network'
          && e.body.statusCode === 200;
      }
    };
    var t = new Telemeter(options);
    var evt = t.capture('network', {url: 'https://spammer.com'}, 'debug');
    var evt2 = t.capture('network', {url: 'https://spammer.com', statusCode: 404}, 'debug');
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

describe('configure', function() {
  it('should truncate events to new max', function(done) {
    var options = {maxTelemetryEvents: 5};
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', {url: 'a.com'}, 'debug');
    }

    expect(t.queue.length).to.equal(5);
    t.configure({maxTelemetryEvents: 3});
    expect(t.queue.length).to.equal(3);
    done();
  });
  it('should lengthen events to allow new max', function(done) {
    var options = {maxTelemetryEvents: 3};
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', {url: 'a.com'}, 'debug');
    }

    expect(t.queue.length).to.equal(3);
    t.configure({maxTelemetryEvents: 5});
    expect(t.queue.length).to.equal(3);
    for (var i = 0; i < 7; i++) {
      t.capture('network', {url: 'a.com'}, 'debug');
    }
    expect(t.queue.length).to.equal(5);
    done();
  });
  it('does not drop existing options that are not passed to configure', function(done) {
    var options = {maxTelemetryEvents: 3};
    var t = new Telemeter(options);

    for (var i = 0; i < 7; i++) {
      t.capture('network', {url: 'a.com'}, 'debug');
    }

    expect(t.queue.length).to.equal(3);
    t.configure({});
    expect(t.queue.length).to.equal(3);
    for (var i = 0; i < 7; i++) {
      t.capture('network', {url: 'a.com'}, 'debug');
    }
    expect(t.queue.length).to.equal(3);
    done();
  });
});
