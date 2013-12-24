var expect = chai.expect;

describe('XHR', function() {
  it("should get an XMLHttp object", function(done) {
    var request = XHR.createXMLHTTPObject();
    expect(request).to.not.equal(false);
    done();
  });

  it("should execute a simple post", function(done) {
    var url = 'http://localhost:3000/';
    var payload = {};

    XHR.post(url, payload, function(err, response) {
      expect(err).to.equal(null);
      expect(response).to.deep.equal({message: 'It works!'});
      done();
    });
  });

  it("should only accept an object to post", function(done) {
    var url = 'http://localhost:3000/';
    var payload = '{}';

    function test() {
      XHR.post(url, payload, function(err, response) {})
    }
    expect(test).to.throw(Error);

    done();
  });
});
