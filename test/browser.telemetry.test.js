/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Instrumenter = require('../src/browser/telemetry');

describe('instrumentNetwork', function () {
  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var windowMock = {
      XMLHttpRequest: function () {},
    };

    windowMock.XMLHttpRequest.prototype.open = function () {};
    windowMock.XMLHttpRequest.prototype.send = function () {};

    var i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    var xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', 'http://first.call');
    xhr.send();
    xhr.onreadystatechange();

    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();
    var xhr = new windowMock.XMLHttpRequest();
    xhr.open('GET', new URL('http://second.call'));
    xhr.send();
    xhr.onreadystatechange();
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });

  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var windowMock = {
      fetch: function () {
        return Promise.resolve();
      },
    };

    var i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    windowMock.fetch('http://first.call');
    expect(callback.callCount).to.eql(1);
    expect(callback.args[0][0].url).to.eql('http://first.call');

    i.deinstrumentNetwork();
    i = createInstrumenter(callback, windowMock);
    i.instrumentNetwork();

    windowMock.fetch(new URL('http://second.call'));
    expect(callback.callCount).to.eql(2);
    expect(callback.args[1][0].url).to.eql('http://second.call/');

    done();
  });
});

function createInstrumenter(callback, windowMock) {
  return new Instrumenter(
    { scrubFields: [] },
    { captureNetwork: callback },
    { wrap: function () {}, client: { notifier: { diagnostic: {} } } },
    windowMock,
  );
}
