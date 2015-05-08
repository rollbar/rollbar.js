var xhr = require('../src/xhr');
var XHR = xhr.XHR;
var expect = chai.expect;

describe('XHR', function() {
  xhr.setupJSON(JSON);

  it("should get an XMLHttp object", function(done) {
    var request = XHR.createXMLHTTPObject();
    expect(request).to.not.equal(false);
    done();
  });

  it("should execute a simple post", function(done) {
    var url = 'http://localhost:3000/api';
    var accessToken = 'abc123';
    var payload = {};

    XHR.post(url, accessToken, payload, function(err, response) {
      expect(err).to.equal(null);

      // Make sure the access token header is received by the test server and sent back in the response
      expect(response).to.deep.equal({accessToken: accessToken});
      done();
    });
  });

  it("should only accept an object to post", function(done) {
    var url = 'http://localhost:3000/api';
    var accessToken = 'abc123';
    var payload = '{}';

    function test() {
      XHR.post(url, accessToken, payload, function(err, response) {})
    }
    expect(test).to.throw(Error);

    done();
  });
});
