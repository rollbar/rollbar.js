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
});
