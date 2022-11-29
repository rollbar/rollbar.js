/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var truncation = require('../src/truncation');
var Transport = require('../src/browser/transport');
var t = new Transport(truncation);
var utility = require('../src/utility');
utility.setupJSON();

describe('post', function() {
  var accessToken = 'abc123';
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/',
    timeout: 2000
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
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(err);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with the server error if 403', function(done) {
    var response = '{"err": "bad request", "result": null, "message": "fail whale"}'
    var requestFactory = requestGenerator(response, 403);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('403');
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with the server error if 500', function(done) {
    var response = '{"err": "bad request", "result": null, "message": "500!!!"}'
    var requestFactory = requestGenerator(response, 500);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('500');
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with a retriable error with a weird status', function(done) {
    var response = '{"err": "bad request"}'
    var requestFactory = requestGenerator(response, 12005);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.match(/connection failure/);
      expect(err.code).to.eql('ENOTFOUND');
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  it('should callback with some error if normal sending throws', function(done) {
    var response = '{"err": "bad request"}'
    var requestFactory = requestGenerator(response, 500, true);
    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.match(/Cannot find a method to transport/);
      expect(requestFactory.getInstance().timeout).to.equal(options.timeout);
      done(resp);
    };
    t.post(accessToken, options, payload, callback, requestFactory.getInstance);
  });
  describe('post', function() {
    beforeEach(function (done) {
      window.fetchStub = sinon.stub(window, 'fetch');
      window.server = sinon.createFakeServer();
      done();
    });

    afterEach(function () {
      window.fetch.restore();
      window.server.restore();
    });

    function stubFetchResponse() {
      window.fetch.returns(Promise.resolve(new Response(
        JSON.stringify({ err: 0, message: 'OK', result: { uuid: uuid }}),
        { status: 200, statusText: 'OK', headers: { 'Content-Type': 'application/json' }}
      )));
    }

    function stubXhrResponse() {
      window.server.respondWith(
        [
          200,
          { 'Content-Type': 'application/json' },
          '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}'
        ]
      );
    }

    var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

    it('should use fetch when requested', function(done) {
      var callback = function(err, resp) {
        expect(window.fetchStub.called).to.be.ok();
        expect(server.requests.length).to.eql(0);
        done(err);
      };
      stubFetchResponse();
      stubXhrResponse();
      server.requests.length = 0;
      options.transport = 'fetch';
      t.post(accessToken, options, payload, callback);
    });
    it('should use xhr when requested', function(done) {
      var callback = function(err, resp) {
        expect(window.fetchStub.called).to.not.be.ok();
        expect(server.requests.length).to.eql(1);
        done(err);
      };
      stubFetchResponse();
      stubXhrResponse();
      server.requests.length = 0;
      options.transport = 'xhr';
      t.post(accessToken, options, payload, callback);
      setTimeout(function() {
        server.respond();
      }, 1);
    });
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
  var request;
  return {
    getInstance: function() {
      if(!request) {
        request = new TestRequest(response, status, shouldThrow);
      }
      return request;
    }
  }
};
