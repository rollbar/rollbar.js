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
