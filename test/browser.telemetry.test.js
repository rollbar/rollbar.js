/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Instrumenter = require('../src/browser/telemetry');

describe('instrumentNetwork', function () {
  it('should capture XHR requests with string URL', function (done) {
    var callback = sinon.spy();
    var mockWindow = {
      XMLHttpRequest: function () { }
    }

    mockWindow.XMLHttpRequest.prototype.open = function () { }
    mockWindow.XMLHttpRequest.prototype.send = function () { }

    var i = new Instrumenter({ scrubFields: [] }, { captureNetwork: callback }, { wrap: function () { }, client: { notifier: { diagnostic: {} } } }, mockWindow);
    i.instrumentNetwork()

    var xhr = new mockWindow.XMLHttpRequest();
    xhr.open('GET', 'http://first.call')
    xhr.send()
    xhr.onreadystatechange()

    expect(callback.callCount).to.eql(1)
    expect(callback.args[0][0].url).to.eql('http://first.call')

    i.deinstrumentNetwork()
    i.instrumentNetwork()

    var xhr = new mockWindow.XMLHttpRequest();
    xhr.open('GET', new URL('http://second.call'))
    xhr.send()
    xhr.onreadystatechange()
    expect(callback.callCount).to.eql(2)
    expect(callback.args[1][0].url).to.eql('http://second.call/')

    done()
  })
})