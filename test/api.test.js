import { expect } from 'chai';
import sinon from 'sinon';
import API from '../src/api.js';

function TestTransportGenerator() {
  var TestTransport = function (callbackError, callbackResponse) {
    this.postArgs = [];
    this.callbackError = callbackError;
    this.callbackResponse = callbackResponse;
  };

  TestTransport.prototype.post = function () {
    var args = arguments;
    this.postArgs.push(args);
    var callback = args[0].callback;
    if (typeof callback === 'function') {
      callback(this.callbackError, this.callbackResponse);
    }
  };

  return TestTransport;
}

describe('Api()', function () {
  it('use the defaults if no custom endpoint is given', function (done) {
    var transport = new (TestTransportGenerator())();
    var url = {
      parse: function (e) {
        expect(false).to.be.ok;
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url);
    // I know this is testing internal state but it
    // is the most expedient way to do this
    expect(api.accessToken).to.eql(accessToken);
    expect(api.transportOptions.hostname).to.eql('api.rollbar.com');
    expect(api.transportOptions.path).to.match(/\/api\/1/);
    expect(api.transportOptions.protocol).to.eql('https:');
    done();
  });
  it('should parse the endpoint and use that if given', function (done) {
    var transport = new (TestTransportGenerator())();
    var endpoint = 'http://woo.foo.com/api/42';
    var url = {
      parse: function (e) {
        expect(e).to.eql(endpoint);
        return {
          hostname: 'woo.foo.com',
          protocol: 'http:',
          pathname: '/api/42',
          path: '/api/42',
        };
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken, endpoint: endpoint };
    var api = new API(options, transport, url);
    expect(api.accessToken).to.eql(accessToken);
    expect(api.transportOptions.hostname).to.eql('woo.foo.com');
    expect(api.transportOptions.path).to.match(/\/api\/42/);
    expect(api.transportOptions.protocol).to.eql('http:');
    done();
  });
});

describe('postItem', function () {
  it('should call post on the transport object', function (done) {
    var response = 'yes';
    var transport = new (TestTransportGenerator())(null, response);
    var url = {
      parse: function (e) {
        expect(false).to.be.ok;
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url);

    var data = { a: 1 };
    api.postItem(data, function (err, resp) {
      expect(err).to.not.be.ok;
      expect(resp).to.eql(response);
      expect(transport.postArgs.length).to.eql(1);
      const params = transport.postArgs[0][0];
      expect(params.accessToken).to.eql(accessToken);
      expect(params.options.path).to.match(/\/item\//);
      expect(params.payload.data.a).to.eql(1);
      done();
    });
  });
  it('should stringify context', function (done) {
    var response = 'yes';
    var transport = new (TestTransportGenerator())(null, response);
    var url = {
      parse: function (e) {
        expect(false).to.be.ok;
      },
    };
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url);

    var data = { a: 1, context: { some: [1, 2, 'stuff'] } };
    api.postItem(data, function (err, resp) {
      expect(err).to.not.be.ok;
      expect(resp).to.eql(response);
      expect(transport.postArgs.length).to.eql(1);
      const params = transport.postArgs[0][0];
      expect(params.accessToken).to.eql(accessToken);
      expect(params.options.path).to.match(/\/item\//);
      expect(params.options.method).to.eql('POST');
      expect(params.payload.data.a).to.eql(1);
      expect(params.payload.data.context).to.eql(
        '{"some":[1,2,"stuff"]}',
      );
      done();
    });
  });
});

describe('postSpans', function () {
  let transport;

  beforeEach(function () {
    // Create mock transport
    transport = {
      post: sinon
        .stub()
        .callsFake(({accessToken, options, payload, callback}) => {
          callback(null, { result: 'ok' });
        }),
      postJsonPayload: sinon.stub(),
    };
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should call post on the transport object', async function () {
    const urllib = await import('../src/browser/url.js');
    const response = 'yes';
    const url = {
      parse: function (e) {
        expect(false).to.be.ok;
      },
    };
    const accessToken = 'abc123';
    const options = {
      accessToken: accessToken,
      tracing: {
        enabled: true,
        endpoint: 'https://api.rollbar.com/api/1/session/',
      },
    };
    const api = new API(options, transport, urllib);

    const data = { a: 1 };
    await api.postSpans(data);

    expect(transport.post.called).to.be.true;

    expect(transport.post.callCount).to.eql(1);
    expect(transport.post.firstCall.args.length).to.eql(1);
    const params = transport.post.firstCall.args[0];
    console.log('post params', params);
    expect(params.accessToken).to.eql(accessToken);
    expect(params.options.path).to.match(/\/session\//);
    expect(params.options.method).to.eql('POST');
    expect(params.payload.a).to.eql(1);
  });
});
