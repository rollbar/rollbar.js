/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var t = require('../src/browser/transport');

describe('post', function() {
  var accessToken = 'abc123';
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/'
  };
  var payload = {
    access_token: accessToken,
    data: {a: 1}
  };
  it('should handle a failure to make a request', function(done) {
    var requestFactory = function() {
      return null;
    };
    var callback = function(err, resp) {
      expect(err).to.be.ok();
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
  it('should callback with the right value on success', function(done) {
    var requestFactory = requestGenerator('{"err": null, "result": true}', 200);
    var callback = function(err, resp) {
      expect(resp).to.be.ok();
      expect(resp.result).to.be.ok();
      done(err);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
  it('should callback with the server error if 403', function(done) {
    var response = '{"err": "bad request", "result": null, "message": "fail whale"}'
    var requestFactory = requestGenerator(response, 403);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('403');
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
  it('should callback with the server error if 500', function(done) {
    var response = '{"err": "bad request", "result": null, "message": "500!!!"}'
    var requestFactory = requestGenerator(response, 500);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('500');
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
  it('should callback with a retriable error with a weird status', function(done) {
    var response = '{"err": "bad request"}'
    var requestFactory = requestGenerator(response, 12005);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.match(/connection failure/);
      expect(err.code).to.eql('ENOTFOUND');
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
  it('should callback with some error if normal sending throws', function(done) {
    var response = '{"err": "bad request"}'
    var requestFactory = requestGenerator(response, 500, true);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.match(/Cannot find a method to transport/);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory);
  });
});

var TestRequest = function(response, status, shouldThrowOnSend) {
  this.method = null;
  this.url = null;
  this.async = false;
  this.headers = [];
  this.data = null;
  this.responseText = response;
  this.status = status;
  this.onreadystatechange = null;
  this.readyState = 0;
  this.shouldThrowOnSend = shouldThrowOnSend;
};
TestRequest.prototype.open = function(m, u, a) {
  this.method = m;
  this.url = u;
  this.async = a;
};
TestRequest.prototype.setRequestHeader = function(key, value) {
  this.headers.push([key, value]);
};
TestRequest.prototype.send = function(data) {
  if (this.shouldThrowOnSend) {
    throw 'Bork Bork';
  }
  this.data = data;
  if (this.onreadystatechange) {
    this.readyState = 4;
    this.onreadystatechange();
  }
};
var requestGenerator = function(response, status, shouldThrow) {
  return function() {
    return new TestRequest(response, status, shouldThrow);
  };
};

