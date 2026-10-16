import { expect } from 'chai';

import Transport from '../src/server/transport.js';

class TestTransport {
  constructor(options, error, response, assertions, responseOptions) {
    this.options = options;
    this.error = error;
    this.response = response;
    this.requestOpts = null;
    this.requestCallback = null;
    this.assertions = assertions;
    this.responseOptions = responseOptions;
  }

  request(opts, cb) {
    this.requestOpts = opts;
    this.requestCallback = cb;
    return new TestRequest(this.error, this.response, this);
  }
}

class TestRequest {
  constructor(error, response, transport) {
    this.error = error;
    this.responseData = response;
    this.data = [];
    this.events = {};
    this.transport = transport;
    this.response = null;
  }

  write(data) {
    this.data.push(data);
  }

  on(event, cb) {
    this.events[event] = cb;
  }

  end() {
    if (this.transport.assertions) {
      this.transport.assertions();
    }
    if (this.error) {
      if (this.events['error']) {
        this.events['error'](this.error);
      }
    } else {
      this.response = new TestResponse(this.transport.responseOptions);
      this.transport.requestCallback(this.response);
      if (this.response.events['data']) {
        this.response.events['data'](this.responseData);
      }
      if (this.response.events['end']) {
        this.response.events['end']();
      }
    }
  }
}

class TestResponse {
  constructor(options = {}) {
    this.encoding = null;
    this.events = {};
    this.headers = options.headers || {};
    this.statusCode = options.statusCode || 200;
  }

  setEncoding(s) {
    this.encoding = s;
  }

  on(event, cb) {
    this.events[event] = cb;
  }
}

const transportFactory =
  (error, response, assertions, responseOptions) => (options) =>
    new TestTransport(options, error, response, assertions, responseOptions);

const NGINX_502_PAGE = [
  '<html>',
  '<head><title>502 Bad Gateway</title></head>',
  '<body>',
  '<center><h1>502 Bad Gateway</h1></center>',
  '<hr><center>nginx/1.17.9</center>',
  '</body>',
  '</html>',
].join('\n');

describe('transport', function () {
  const t = new Transport();

  describe('post', function () {
    describe('base data', function () {
      const baseData = {
        accessToken: 'abc123',
        options: {},
        payload: {
          access_token: 'abc123',
          data: { a: 1 },
        },
      };

      it('should have an error with no payload', function (done) {
        const factory = transportFactory(
          null,
          '{"err": null, "result":"all good"}',
        );

        t.post({
          accessToken: baseData.accessToken,
          options: baseData.options,
          payload: null,
          callback: (err, resp) => {
            expect(err).to.exist;
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });

      it('should have the right response data with a payload and no error', function (done) {
        const factory = transportFactory(
          null,
          '{"err": null, "result":{"uuid":"42def", "message":"all good"}}',
          function () {
            expect(this.options.headers['Content-Type']).to.equal(
              'application/json',
            );
            expect(this.options.headers['Content-Length']).to.be.a('number');
            expect(this.options.headers['Content-Length']).to.be.above(0);
            expect(this.options.headers['X-Rollbar-Access-Token']).to.equal(
              baseData.accessToken,
            );
          },
        );

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err).to.not.exist;
            expect(resp.message).to.equal('all good');
            done();
          },
          transportFactory: factory,
        });
      });

      it('should error with a payload and an error in the response', function (done) {
        const factory = transportFactory(
          null,
          '{"err": "bork", "message":"things broke"}',
          function () {
            expect(this.options.headers['Content-Type']).to.equal(
              'application/json',
            );
            expect(this.options.headers['Content-Length']).to.be.a('number');
            expect(this.options.headers['Content-Length']).to.be.above(0);
            expect(this.options.headers['X-Rollbar-Access-Token']).to.equal(
              baseData.accessToken,
            );
          },
        );

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err).to.exist;
            expect(err.message).to.match(/things broke/);
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });

      it('should error with a payload and an error during sending', function (done) {
        const factory = transportFactory(new Error('bork'), null, function () {
          expect(this.options.headers['Content-Type']).to.equal(
            'application/json',
          );
          expect(this.options.headers['Content-Length']).to.be.a('number');
          expect(this.options.headers['Content-Length']).to.be.above(0);
          expect(this.options.headers['X-Rollbar-Access-Token']).to.equal(
            baseData.accessToken,
          );
        });

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err).to.exist;
            expect(err.message).to.match(/bork/);
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });
    });

    // https://github.com/rollbar/rollbar.js/issues/1092
    describe('with a non-2xx response', function () {
      const baseData = {
        accessToken: 'abc123',
        options: {},
        payload: {
          access_token: 'abc123',
          data: { a: 1 },
        },
      };

      it('should report the HTTP status for an HTML error page', function (done) {
        const factory = transportFactory(null, NGINX_502_PAGE, null, {
          statusCode: 502,
        });

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.not.be.an.instanceof(SyntaxError);
            expect(err.message).to.equal('Api error: 502 Bad Gateway');
            expect(err.statusCode).to.equal(502);
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });

      it('should report the HTTP status for an empty body', function (done) {
        const factory = transportFactory(null, '', null, { statusCode: 503 });

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err).to.not.be.an.instanceof(SyntaxError);
            expect(err.message).to.equal('Api error: 503 Service Unavailable');
            expect(err.statusCode).to.equal(503);
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });

      it('should not report success for a JSON body without err', function (done) {
        const factory = transportFactory(
          null,
          '{"message":"upstream unavailable"}',
          null,
          { statusCode: 504 },
        );

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err).to.exist;
            expect(err.message).to.equal('Api error: 504 Gateway Timeout');
            expect(err.statusCode).to.equal(504);
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });

      it('should keep the API message for a JSON error body', function (done) {
        const factory = transportFactory(
          null,
          '{"err":1,"message":"invalid access token"}',
          null,
          { statusCode: 403 },
        );

        t.post({
          ...baseData,
          callback: (err, resp) => {
            expect(err.message).to.equal('Api error: invalid access token');
            expect(err.statusCode).to.equal(403);
            expect(resp).to.not.exist;
            done();
          },
          transportFactory: factory,
        });
      });
    });

    describe('with rate limiting', function () {
      let transport;

      beforeEach(function () {
        transport = new Transport();
      });

      it('should transmit non-rate limited requests', function (done) {
        const factory = transportFactory(
          null,
          '{"err": null, "result": "all good"}',
        );
        const response = new TestResponse({
          statusCode: 200,
          headers: {
            'x-rate-limit-remaining': '1',
            'x-rate-limit-remaining-seconds': '100',
          },
        });

        expect(transport.rateLimitExpires).to.equal(0);

        transport.handleResponse(response);

        transport.post({
          accessToken: 'token',
          options: {},
          payload: 'payload',
          callback: (err) => {
            expect(err).to.not.exist;
            expect(Math.floor(Date.now() / 1000)).to.be.at.least(
              transport.rateLimitExpires,
            );
            done();
          },
          transportFactory: factory,
        });
      });

      it('should drop rate limited requests and set timeout', function (done) {
        const factory = transportFactory(new Error('bork'), null);
        const response = new TestResponse({
          statusCode: 429,
          headers: {
            'x-rate-limit-remaining': '0',
            'x-rate-limit-remaining-seconds': '100',
          },
        });

        transport.handleResponse(response);

        transport.post({
          accessToken: 'token',
          options: {},
          payload: 'payload',
          callback: (err) => {
            expect(err.message).to.match(/Exceeded rate limit/);
            expect(Math.floor(Date.now() / 1000)).to.be.below(
              transport.rateLimitExpires,
            );
            done();
          },
          transportFactory: factory,
        });
      });
    });
  });

  describe('get', function () {
    // https://github.com/rollbar/rollbar.js/issues/1092
    it('should report the HTTP status for an HTML error page', function (done) {
      const factory = transportFactory(null, NGINX_502_PAGE, null, {
        statusCode: 502,
      });

      t.get(
        'abc123',
        {},
        {},
        (err, resp) => {
          expect(err).to.not.be.an.instanceof(SyntaxError);
          expect(err.message).to.equal('Api error: 502 Bad Gateway');
          expect(err.statusCode).to.equal(502);
          expect(resp).to.not.exist;
          done();
        },
        factory,
      );
    });
  });
});
