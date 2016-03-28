/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = require('../src/shim.js');
Rollbar = Rollbar.Rollbar;
var Notifier = require('../src/notifier').Notifier;

var xhr = require('../src/xhr');
var XHR = xhr.XHR;
var ConnectionError = xhr.ConnectionError;


var config = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};


Rollbar.init(window, config);

/*
 * Notifier automatic retry on connection failure
 */
describe('Notifier automatic retry', function() {
  var clockStub;
  var xhrPostStub;
  var notifier;

  beforeEach(function () {
    clockStub = sinon.useFakeTimers();
    xhrPostStub = sinon.stub(XHR, 'post');
    notifier = new Notifier();
  });

  afterEach(function () {
    clockStub.restore();
    xhrPostStub.restore();
  });

  it('should not retry successful processing', function() {
    notifier.error('test');
    givenXhrsSucceed();

    Notifier.processPayloads(true);

    expect(xhrPostStub.callCount).to.equal(1);
    waitUntilNextRetry();
    expect(xhrPostStub.callCount).to.equal(1);
  });

  it('should not retry processing that fails but gets a status code back', function() {
    notifier.error('test');
    givenXhrsReceiveUpstreamErrors();

    Notifier.processPayloads(true);

    expect(xhrPostStub.callCount).to.equal(1);
    waitUntilNextRetry();
    expect(xhrPostStub.callCount).to.equal(1);
  });

  it('should retry processing that fails at the network level after a timeout', function() {
    notifier.error('test');
    givenXhrsHaveConnectionErrors();

    Notifier.processPayloads(true);

    expect(xhrPostStub.callCount).to.equal(1);

    waitUntilNextRetry();
    expect(xhrPostStub.callCount).to.equal(2);

    waitUntilNextRetry();
    expect(xhrPostStub.callCount).to.equal(3);
  });

  it('should stop retrying processing that failed once it eventually succeeds', function() {
    notifier.error('test');
    givenXhrsHaveConnectionErrors();

    Notifier.processPayloads(true);

    givenXhrsSucceed();
    waitUntilNextRetry();
    expect(xhrPostStub.callCount).to.equal(2);

    waitUntilNextRetry();
    expect(xhrPostStub.callCount).to.equal(2);
  });

  it('should call error callback once initially on error, regardless of future failed or successful retries', function() {
    var callback = sinon.stub();

    notifier.error('test', callback);
    givenXhrsHaveConnectionErrors();

    Notifier.processPayloads(true);
    expect(callback.callCount).to.equal(1);

    waitUntilNextRetry();

    givenXhrsSucceed();
    waitUntilNextRetry();

    expect(callback.callCount).to.equal(1);
  });

  function givenXhrsSucceed() {
    xhrPostStub.yields(null, {});
  }

  function givenXhrsHaveConnectionErrors() {
    xhrPostStub.yields(new ConnectionError());
  }

  function givenXhrsReceiveUpstreamErrors() {
    xhrPostStub.yields(new Error(String(401)));
  }

  function waitUntilNextRetry() {
    clockStub.tick(1000 * 10);
    Notifier.processPayloads(true);
  }
});
