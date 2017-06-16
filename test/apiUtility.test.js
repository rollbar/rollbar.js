/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var u = require('../src/apiUtility');

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
      }
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
  });
});

describe('transportOptions', function() {
  it('should use the given data if no proxy', function() {
    var transport = {
      hostname: 'a.com',
      path: '/api/v1',
      port: 5000
    };
    var path = '/item/';
    var method = 'GET';

    var o = u.transportOptions(transport, path, method);
    expect(o.protocol).to.eql('https:');
    expect(o.hostname).to.eql('a.com');
    expect(o.path).to.eql('/api/v1/item/');
    expect(o.port).to.eql(5000);
    expect(o.method).to.eql(method);
  });
  it('should use the proxy if given', function() {
    var transport = {
      hostname: 'a.com',
      path: '/api/v1',
      port: 5000,
      proxy: {
        host: 'b.com',
        port: 8080
      }
    };
    var path = '/item/';
    var method = 'GET';
    
    var o = u.transportOptions(transport, path, method);
    expect(o.protocol).to.eql('https:');
    expect(o.hostname).to.eql('b.com');
    expect(o.port).to.eql(8080);
    expect(o.path).to.eql('https://a.com/api/v1/item/');
    expect(o.method).to.eql(method);
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

