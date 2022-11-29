/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var u = require('../src/apiUtility');
var utility = require('../src/utility');
utility.setupJSON();

describe('buildPayload', function() {
  it('should package up the input into a payload', function() {
    var token = 'abc123';
    var data = {context: 'not an object', other: 'stuff'};
    var payload = u.buildPayload(token, data);

    expect(payload.access_token).to.eql(token);
    expect(payload.data).to.eql(data);
  });
  it('should stringify context', function() {
    var token = 'abc123';
    var context = {a: 1, b:'other'};
    var data = {
      context: context,
      other: 'stuff'
    };
    var payload = u.buildPayload(token, data);

    expect(payload.data.context).to.not.eql(context);
    expect(payload.data.context).to.eql('{"a":1,"b":"other"}');
  });
  it('should truncate context', function() {
    var token = 'abc123';
    var context = {};
    for (var i=0; i<35; i++) {
      context[i] = i;
    }
    var data = {
      context: context,
      other: 'stuff'
    };
    var payload = u.buildPayload(token, data);

    expect(payload.data.context).to.not.eql(context);
    expect(payload.data.context.length).to.eql(255);
  });
});

describe('getTransportFromOptions', function() {
  it('should use defaults with not endpoint', function() {
    var options = {
      not: 'endpoint',
      proxy: {
        host: 'whatver.com',
        port: 9090
      },
      timeout: 3000
    };
    var defaults = {
      hostname: 'api.com',
      protocol: 'https:',
      path: '/api/1',
    };
    var url = {
      parse: function() {
        expect(false).to.be.ok();
        return {};
      }
    };
    var t = u.getTransportFromOptions(options, defaults, url);
    expect(t.hostname).to.eql(defaults.hostname);
    expect(t.protocol).to.eql(defaults.protocol);
    expect(t.port).to.eql(defaults.port);
    expect(t.proxy).to.eql(options.proxy);
    expect(t.timeout).to.eql(options.timeout);
  });
  it('should parse the endpoint if given', function() {
    var options = {
      endpoint: 'http://whatever.com/api/42',
      proxy: {
        host: 'nope.com',
        port: 9090
      }
    };
    var defaults = {
      hostname: 'api.com',
      protocol: 'https:',
      path: '/api/1',
      search: '?abc=456',
    };
    var url = {
      parse: function(endpoint) {
        expect(endpoint).to.eql(options.endpoint);
        return {
          hostname: 'whatever.com',
          protocol: 'http:',
          pathname: '/api/42'
        };
      }
    };
    var t = u.getTransportFromOptions(options, defaults, url);
    expect(t.hostname).to.not.eql(defaults.hostname);
    expect(t.hostname).to.eql('whatever.com');
    expect(t.protocol).to.eql('http:');
    expect(t.search).to.not.be.ok();
    expect(t.proxy).to.eql(options.proxy);
    expect(t.timeout).to.eql(undefined);
  });
  describe('getTransportFromOptions', function() {
    var defaults = {
      hostname: 'api.com',
      protocol: 'https:',
      path: '/api/1',
      search: '?abc=456',
    };
    var url = {
      parse: function(_) {
        return {
          hostname: 'whatever.com',
          protocol: 'http:',
          pathname: '/api/42'
        };
      }
    };
    it('should use xhr by default', function(done) {
      var options = {};
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('xhr');
      done();
    });
    it('should use fetch when requested', function(done) {
      var options = {defaultTransport: 'fetch'};
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('fetch');
      done();
    });
    it('should use xhr when requested', function(done) {
      var options = {defaultTransport: 'xhr'};
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('xhr');
      done();
    });
    it('should use xhr when fetch is unavailable', function(done) {
      var options = {defaultTransport: 'fetch'};
      var oldFetch = window.fetch;
      self.fetch = undefined;
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('xhr');
      self.fetch = oldFetch;
      done();
    });
    it('should use fetch when xhr is unavailable', function(done) {
      var options = {defaultTransport: 'xhr'};
      var oldXhr = window.XMLHttpRequest;
      self.XMLHttpRequest = undefined;
      var t = u.getTransportFromOptions(options, defaults, url);
      expect(t.transport).to.eql('fetch');
      self.XMLHttpRequest = oldXhr;
      done();
    });
  });

});

describe('transportOptions', function() {
  it('should use the given data if no proxy', function() {
    var transport = {
      hostname: 'a.com',
      path: '/api/v1/item/',
      port: 5000
    };
    var method = 'GET';

    var o = u.transportOptions(transport, method);
    expect(o.protocol).to.eql('https:');
    expect(o.hostname).to.eql('a.com');
    expect(o.path).to.eql('/api/v1/item/');
    expect(o.port).to.eql(5000);
    expect(o.method).to.eql(method);
    expect(o.timeout).to.eql(undefined);
  });
  it('should use the proxy if given', function() {
    var transport = {
      hostname: 'a.com',
      path: '/api/v1/item/',
      port: 5000,
      proxy: {
        host: 'b.com',
        port: 8080
      },
      timeout: 3000
    };
    var method = 'GET';

    var o = u.transportOptions(transport, method);
    expect(o.protocol).to.eql('https:');
    expect(o.hostname).to.eql('b.com');
    expect(o.port).to.eql(8080);
    expect(o.path).to.eql('https://a.com/api/v1/item/');
    expect(o.method).to.eql(method);
    expect(o.timeout).to.eql(transport.timeout);
  });
});

describe('appendPathToPath', function() {
  var expSlash = '/api/item/';
  var expNoSlash = '/api/item';
  it('should handle trailing slash in base', function() {
    var base = '/api/';
    expect(u.appendPathToPath(base, '/item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, '/item')).to.eql(expNoSlash);
    expect(u.appendPathToPath(base, 'item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, 'item')).to.eql(expNoSlash);
  });
  it('should handle no trailing slash in base', function() {
    var base = '/api';
    expect(u.appendPathToPath(base, '/item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, '/item')).to.eql(expNoSlash);
    expect(u.appendPathToPath(base, 'item/')).to.eql(expSlash);
    expect(u.appendPathToPath(base, 'item')).to.eql(expNoSlash);
  });
});
