var expect = chai.expect;

describe('XHR', function() {
  it("should get an XMLHttp object", function(done) {
    var request = XHR.createXMLHTTPObject();
    expect(request).to.not.equal(false);
    done();
  });

  it("should execute a simple post", function(done) {
    var url = 'http://localhost:3000/';
    var payload = '{}';

    XHR.post(url, payload, function(err) {
      expect(err).to.equal(null);
      done();
    });
  });
});
