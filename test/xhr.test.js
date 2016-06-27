/* globals expect */
/* globals describe */
/* globals it */


var xhr = require('../src/xhr');
var XHR = xhr.XHR;

describe('XHR', function() {
  xhr.setupJSON(JSON);

  it('should get an XMLHttp object', function(done) {
    var request = XHR.createXMLHTTPObject();
    expect(request).to.not.equal(false);
    done();
  });

  it('should execute a simple post', function(done) {
    var url = 'http://localhost:3000/api';
    var accessToken = 'abc123';
    var payload = {};

    XHR.post(url, accessToken, payload, function(err, response) {
      expect(err).to.equal(null);

      // Make sure the access token header is received by the test server and sent back in the response
      expect(response).to.eql({accessToken: accessToken});
      done();
    });
  });

  it('should only accept an object to post', function(done) {
    var url = 'http://localhost:3000/api';
    var accessToken = 'abc123';
    var payload = '{}';

    function test() {
      XHR.post(url, accessToken, payload, function() {});
    }
    expect(test).to.throwError();

    done();
  });

  it('should retry on failure', function(done) {
    var spy = sinon.spy(XHR, 'post');
    var clock = sinon.useFakeTimers();
    XHR.post('http://localhost:6445', 'ACCESS_TOKEN', {});

    clock.tick(xhr.TIMEOUT);
    clock.tick(xhr.RETRY_DELAY);
    expect(spy.callCount).to.equal(2);

    clock.restore();

    done();
  });
});
