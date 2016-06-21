/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = require('../src/shim.js');
Rollbar = Rollbar.Rollbar;
var notifiersSrc = require('../src/notifier');
var Notifier = notifiersSrc.Notifier;

var config = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};

notifiersSrc.setupJSON(JSON);
Rollbar.init(window, config);

/*
 * Notifier automatic retry on connection failure
 */
describe('Notifier automatic retry', function() {
  var clockStub;
  var notifier;
  var enqueueSpy;

  beforeEach(function () {
    clockStub = sinon.useFakeTimers();
    enqueueSpy = sinon.spy(Notifier, 'directlyEnqueuePayload');
    notifier = new Notifier();
  });

  afterEach(function () {
    clockStub.restore();
    enqueueSpy.restore();
  });

  it('should not requeue successful processing', function() {
    var server = sinon.fakeServer.create();
    server.respondWith([200, {'Content-Type': 'application/json'}, '{}']);
    notifier.error('test');

    Notifier.processPayloads(true);
    expect(enqueueSpy.callCount).to.equal(1);

    server.restore();
  });

  it('should not retry processing that fails but gets a status code back', function() {
    var server = sinon.fakeServer.create();
    server.respondWith([404, {'Content-Type': 'application/json'}, '{}']);
    notifier.error('test');
    Notifier.processPayloads(true);

    expect(enqueueSpy.callCount).to.equal(1);
    waitUntilNextRetry();
    expect(enqueueSpy.callCount).to.equal(1);

    server.restore();
  });

  it('should retry processing that fails at the network level after a timeout', function() {
    console.log('start test');
    notifier.error('test');
    Notifier.processPayloads(true);

    console.log('first test');
    expect(enqueueSpy.callCount).to.equal(1);

    waitUntilNextRetry();
    console.log('second test');
    expect(enqueueSpy.callCount).to.equal(2);

    waitUntilNextRetry();
    console.log('third test');
    expect(enqueueSpy.callCount).to.equal(3);
  });

  // it('should stop retrying processing that failed once it eventually succeeds', function() {
  //   notifier.error('test');
  //   givenXhrsHaveConnectionErrors();
  //
  //   Notifier.processPayloads(true);
  //
  //   givenXhrsSucceed();
  //   waitUntilNextRetry();
  //   expect(xhrPostStub.callCount).to.equal(2);
  //
  //   waitUntilNextRetry();
  //   expect(xhrPostStub.callCount).to.equal(2);
  // });
  //
  // it('should call error callback once initially on error, regardless of future failed or successful retries', function() {
  //   var callback = sinon.stub();
  //
  //   notifier.error('test', callback);
  //   givenXhrsHaveConnectionErrors();
  //
  //   Notifier.processPayloads(true);
  //   expect(callback.callCount).to.equal(1);
  //
  //   waitUntilNextRetry();
  //
  //   givenXhrsSucceed();
  //   waitUntilNextRetry();
  //
  //   expect(callback.callCount).to.equal(1);
  // });

  function givenXhrsSucceed() {
    console.log('givenXhrsSuccess');
    console.log(server);
    server.respondWith([200, {'Content-Type': 'application/json'}, '{}']);
  }
  
  function givenXhrsReceiveUpstreamErrors() {
    server.respondWith([401, {'Content-Type': 'application/json'}, '{}']);
  }

  function waitUntilNextRetry() {
    clockStub.tick(1000 * 10);
    Notifier.processPayloads(true);
  }
});
