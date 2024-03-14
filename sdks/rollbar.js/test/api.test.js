/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var API = require('../src/api');
var utility = require('../src/utility');
utility.setupJSON();

function TestTransportGenerator() {
  var TestTransport = function (callbackError, callbackResponse) {
    this.postArgs = [];
    this.callbackError = callbackError;
    this.callbackResponse = callbackResponse;
  };

  TestTransport.prototype.post = function () {
    var args = arguments;
    this.postArgs.push(args);
    var callback = args[args.length - 1];
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
        expect(false).to.be.ok();
      },
    };
    var backup = null;
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url, backup);
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
    var backup = null;
    var accessToken = 'abc123';
    var options = { accessToken: accessToken, endpoint: endpoint };
    var api = new API(options, transport, url, backup);
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
        expect(false).to.be.ok();
      },
    };
    var backup = null;
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url, backup);

    var data = { a: 1 };
    api.postItem(data, function (err, resp) {
      expect(err).to.not.be.ok();
      expect(resp).to.eql(response);
      expect(transport.postArgs.length).to.eql(1);
      expect(transport.postArgs[0][0]).to.eql(accessToken);
      expect(transport.postArgs[0][1].path).to.match(/\/item\//);
      expect(transport.postArgs[0][2].access_token).to.eql(accessToken);
      expect(transport.postArgs[0][2].data.a).to.eql(1);
      done();
    });
  });
  it('should stringify context', function (done) {
    var response = 'yes';
    var transport = new (TestTransportGenerator())(null, response);
    var url = {
      parse: function (e) {
        expect(false).to.be.ok();
      },
    };
    var backup = null;
    var accessToken = 'abc123';
    var options = { accessToken: accessToken };
    var api = new API(options, transport, url, backup);

    var data = { a: 1, context: { some: [1, 2, 'stuff'] } };
    api.postItem(data, function (err, resp) {
      expect(err).to.not.be.ok();
      expect(resp).to.eql(response);
      expect(transport.postArgs.length).to.eql(1);
      expect(transport.postArgs[0][0]).to.eql(accessToken);
      expect(transport.postArgs[0][1].path).to.match(/\/item\//);
      expect(transport.postArgs[0][1].method).to.eql('POST');
      expect(transport.postArgs[0][2].access_token).to.eql(accessToken);
      expect(transport.postArgs[0][2].data.a).to.eql(1);
      expect(transport.postArgs[0][2].data.context).to.eql(
        '{"some":[1,2,"stuff"]}',
      );
      done();
    });
  });
});
