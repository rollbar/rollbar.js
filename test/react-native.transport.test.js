import { expect } from 'chai';
import sinon from 'sinon';

import Transport from '../src/react-native/transport.js';
import truncation from '../src/truncation.js';
var t = new Transport(truncation);

const NGINX_502_PAGE = [
  '<html>',
  '<head><title>502 Bad Gateway</title></head>',
  '<body>',
  '<center><h1>502 Bad Gateway</h1></center>',
  '<hr><center>nginx/1.17.9</center>',
  '</body>',
  '</html>',
].join('\n');

describe('post', function () {
  var accessToken = 'abc123';
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/',
  };
  var payload = { access_token: accessToken, data: { a: 1 } };
  var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

  before(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    sinon.stub(globalThis, 'fetch');
    done();
  });

  after(function () {
    globalThis.fetch.restore();
  });

  function stubResponse(code, err, message) {
    globalThis.fetch.returns(
      Promise.resolve(
        new Response(
          JSON.stringify({
            err: err,
            message: message,
            result: { uuid: uuid },
          }),
          {
            status: code,
            statusText: message,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );
  }

  it('should callback with the right value on success', function (done) {
    stubResponse(200, 0, 'OK');

    var callback = function (err, data) {
      expect(err).to.be.null;
      expect(data).to.be.ok;
      expect(data.uuid).to.eql(uuid);
      done();
    };
    t.post(accessToken, options, payload, callback);
  });

  it('should callback with the server error if 403', function (done) {
    stubResponse(403, '403', 'bad request');

    var callback = function (err, resp) {
      expect(resp).to.not.be.ok;
      expect(err.message).to.eql('Api error: bad request');
      expect(err.statusCode).to.eql(403);
      done();
    };
    t.post(accessToken, options, payload, callback);
  });

  // https://github.com/rollbar/rollbar.js/issues/1092
  describe('with a non-2xx response', function () {
    function stubRawResponse(body, init) {
      globalThis.fetch.returns(Promise.resolve(new Response(body, init)));
    }

    it('should report the HTTP status for an HTML error page', function (done) {
      stubRawResponse(NGINX_502_PAGE, {
        status: 502,
        statusText: 'Bad Gateway',
        headers: { 'Content-Type': 'text/html' },
      });

      t.post(accessToken, options, payload, function (err, resp) {
        expect(err).to.be.an.instanceof(Error);
        expect(err).to.not.be.an.instanceof(SyntaxError);
        expect(err.message).to.eql('Api error: 502 Bad Gateway');
        expect(err.statusCode).to.eql(502);
        expect(resp).to.not.exist;
        done();
      });
    });

    it('should report the bare status when statusText is empty', function (done) {
      stubRawResponse('', { status: 503 });

      t.post(accessToken, options, payload, function (err, resp) {
        expect(err).to.not.be.an.instanceof(SyntaxError);
        expect(err.message).to.eql('Api error: 503');
        expect(err.statusCode).to.eql(503);
        expect(resp).to.not.exist;
        done();
      });
    });

    it('should not report success for a JSON body without err', function (done) {
      stubRawResponse('{"message":"upstream unavailable"}', {
        status: 504,
        statusText: 'Gateway Timeout',
        headers: { 'Content-Type': 'application/json' },
      });

      t.post(accessToken, options, payload, function (err, resp) {
        expect(err.message).to.eql('Api error: 504 Gateway Timeout');
        expect(err.statusCode).to.eql(504);
        expect(resp).to.not.exist;
        done();
      });
    });

    it('should pass through a parse error for an unparseable 2xx body', function (done) {
      stubRawResponse('not json', { status: 200 });

      t.post(accessToken, options, payload, function (err, resp) {
        expect(err).to.be.an.instanceof(SyntaxError);
        expect(resp).to.not.exist;
        done();
      });
    });
  });
});

describe('get', function () {
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/',
  };

  before(function () {
    sinon.stub(globalThis, 'fetch');
  });

  after(function () {
    globalThis.fetch.restore();
  });

  it('should callback with the parsed body on success', function (done) {
    globalThis.fetch.returns(
      Promise.resolve(
        new Response('{"err":0,"result":{"a":1}}', { status: 200 }),
      ),
    );

    t.get('abc123', options, {}, function (err, data) {
      expect(err).to.be.null;
      expect(data).to.eql({ err: 0, result: { a: 1 } });
      done();
    });
  });

  // https://github.com/rollbar/rollbar.js/issues/1092
  it('should report the HTTP status for an HTML error page', function (done) {
    globalThis.fetch.returns(
      Promise.resolve(
        new Response(NGINX_502_PAGE, {
          status: 502,
          statusText: 'Bad Gateway',
        }),
      ),
    );

    t.get('abc123', options, {}, function (err, resp) {
      expect(err).to.not.be.an.instanceof(SyntaxError);
      expect(err.message).to.eql('Api error: 502 Bad Gateway');
      expect(err.statusCode).to.eql(502);
      expect(resp).to.not.exist;
      done();
    });
  });
});
