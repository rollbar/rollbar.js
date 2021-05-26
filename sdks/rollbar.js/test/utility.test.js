/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var _ = require('../src/utility');
var utility = require('../src/utility');
var polyfillJSON = require('../vendor/JSON-js/json3');

utility.setupJSON();

describe('setupJSON', function() {
  beforeEach(function(){
    utility.RollbarJSON.stringify = null;
    utility.RollbarJSON.parse = null;
  });

  afterEach(function(){
    // Resets utility.RollbarJSON
    utility.RollbarJSON.stringify = null;
    utility.RollbarJSON.parse = null;
    utility.setupJSON();
  });

  it('should use native interface when polyfill is provided', function() {
    var native = {stringify: JSON.stringify, parse: JSON.parse};

    utility.setupJSON(polyfillJSON);

    expect(utility.RollbarJSON.stringify.toString()).to.equal(native.stringify.toString());
    expect(utility.RollbarJSON.parse.toString()).to.equal(native.parse.toString());
  });

  it('should use native interface when polyfill is not provided', function() {
    var native = {stringify: JSON.stringify, parse: JSON.parse};

    utility.setupJSON();

    expect(utility.RollbarJSON.stringify.toString()).to.equal(native.stringify.toString());
    expect(utility.RollbarJSON.parse.toString()).to.equal(native.parse.toString());
  });

  it('should replace custom interface when polyfill is provided', function() {
    var native = {stringify: JSON.stringify, parse: JSON.parse};
    var custom = {stringify: function(json){ return json;}, parse: function(json){ return json;}};
    var polyfill = {};
    polyfillJSON(polyfill);

    // Set to custom interface
    JSON.stringify = custom.stringify;
    JSON.parse = custom.parse;

    utility.setupJSON(polyfillJSON);

    expect(utility.RollbarJSON.stringify.toString()).to.equal(polyfill.stringify.toString());
    expect(utility.RollbarJSON.parse.toString()).to.equal(polyfill.parse.toString());

    // restore original interface
    JSON.stringify = native.stringify;
    JSON.parse = native.parse;
  });

  it('should keep custom interface when polyfill is not provided', function() {
    var native = {stringify: JSON.stringify, parse: JSON.parse};
    var custom = {stringify: function(json){ return json;}, parse: function(json){ return json;}};

    // Set to custom interface
    JSON.stringify = custom.stringify;
    JSON.parse = custom.parse;

    utility.setupJSON();

    expect(utility.RollbarJSON.stringify.toString()).to.equal(custom.stringify.toString());
    expect(utility.RollbarJSON.parse.toString()).to.equal(custom.parse.toString());

    // restore original interface
    JSON.stringify = native.stringify;
    JSON.parse = native.parse;
  });
});

describe('typeName', function() {
  it('should handle undefined', function(done) {
    expect(_.typeName(undefined)).to.eql('undefined');
    done();
  });

  it('should handle null', function(done) {
    expect(_.typeName(null)).to.eql('null');
    done();
  });

  it('should handle numbers', function(done) {
    expect(_.typeName(1)).to.eql('number');
    expect(_.typeName(-32)).to.eql('number');
    expect(_.typeName(1.452)).to.eql('number');
    expect(_.typeName(0)).to.eql('number');
    done();
  });

  it('should handle bools', function(done) {
    expect(_.typeName(true)).to.eql('boolean');
    expect(_.typeName(false)).to.eql('boolean');
    done();
  });

  it('should handle strings', function(done) {
    expect(_.typeName('')).to.eql('string');
    expect(_.typeName('a longer string')).to.eql('string');
    done();
  });

  it('should handle functions', function(done) {
    expect(_.typeName(function(){})).to.eql('function');
    var f = function(x) {
      return x;
    };
    expect(_.typeName(f)).to.eql('function');
    done();
  });

  it('should handle objects', function(done) {
    expect(_.typeName({})).to.eql('object');
    expect(_.typeName({a: 123})).to.eql('object');
    done();
  });

  it('should handle arrays', function(done) {
    expect(_.typeName([])).to.eql('array');
    expect(_.typeName([1, {a: 42}, null])).to.eql('array');
    done();
  });

});

describe('isType', function() {
  it('should handle all types', function(done) {
    expect(_.isType(undefined, 'undefined')).to.be.ok();
    expect(_.isType(undefined, 'null')).to.not.be.ok();
    expect(_.isType(null, 'null')).to.be.ok();
    expect(_.isType(null, 'object')).to.not.be.ok();
    expect(_.isType({}, 'object')).to.be.ok();
    expect(_.isType(function(){}, 'function')).to.be.ok();
    expect(_.isType(42, 'number')).to.be.ok();
    expect(_.isType('42', 'string')).to.be.ok();
    expect(_.isType([], 'array')).to.be.ok();
    expect(_.isType([102, []], 'array')).to.be.ok();

    done();
  });
});

describe('isFunction', function() {
  it('should work for all functions', function(done) {
    var f = function() { return; };
    var g = function(x) {
      return f(x);
    };
    expect(_.isFunction({})).to.not.be.ok();
    expect(_.isFunction(null)).to.not.be.ok();
    expect(_.isFunction(f)).to.be.ok();
    expect(_.isFunction(g)).to.be.ok();
    done();
  });

});
describe('isNativeFunction', function() {
  it('should work for all native functions', function(done) {
    var f = function() { return; };
    var g = function(x) {
      return f(x);
    };
    var h = String.prototype.substr;
    var i = Array.prototype.indexOf;
    expect(_.isNativeFunction({})).to.not.be.ok();
    expect(_.isNativeFunction(null)).to.not.be.ok();
    expect(_.isNativeFunction(f)).to.not.be.ok();
    expect(_.isNativeFunction(g)).to.not.be.ok();
    expect(_.isNativeFunction(h)).to.be.ok();
    expect(_.isNativeFunction(i)).to.be.ok();
    done();
  });
});

describe('isIterable', function() {
  it('should work for all types', function(done) {
    expect(_.isIterable({})).to.be.ok();
    expect(_.isIterable([])).to.be.ok();
    expect(_.isIterable([{a: 1}])).to.be.ok();
    expect(_.isIterable(null)).to.not.be.ok();
    expect(_.isIterable(undefined)).to.not.be.ok();
    expect(_.isIterable('object')).to.not.be.ok();
    expect(_.isIterable(42)).to.not.be.ok();
    done();
  });
});

describe('isError', function() {
  it('should handle null', function(done) {
    expect(_.isError(null)).to.not.be.ok();
    done();
  });
  it('should handle errors', function(done) {
    var e = new Error('hello');
    expect(_.isError(e)).to.be.ok();
    done();
  });
  it('should handle subclasses of error', function(done) {
    // This is a mostly browser compliant way of doing this
    // just for the sake of doing it, even though we mostly
    // need this to work in node environments
    function TestCustomError(message) {
      Object.defineProperty(this, 'name', {
        enumerable: false,
        writable: false,
        value: 'TestCustomError'
      });

      Object.defineProperty(this, 'message', {
        enumerable: false,
        writable: true,
        value: message
      });

      if (Error.hasOwnProperty('captureStackTrace')) {
        Error.captureStackTrace(this, TestCustomError);
      } else {
        Object.defineProperty(this, 'stack', {
          enumerable: false,
          writable: false,
          value: (new Error(message)).stack
        });
      }
    }

    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(TestCustomError.prototype, Error.prototype);
    } else {
      TestCustomError.prototype = Object.create(Error.prototype, {
        constructor: { value: TestCustomError }
      });
    }
    var e = new TestCustomError('bork');
    expect(_.isError(e)).to.be.ok();
    done();
  });
});

describe('isFiniteNumber', function() {
  [ NaN, null, undefined, 'x' ].forEach(function(value) {
    it(`should return false for ${value}`, function(done) {
      expect(_.isFiniteNumber(value)).to.equal(false);
      done();
    });
  });
  [ -100, 0, 100 ].forEach(function(value) {
    it(`should return true for ${value}`, function(done) {
      expect(_.isFiniteNumber(value)).to.equal(true);
      done();
    });
  });
});

describe('merge', function() {
  it('should work for simple objects', function(done) {
    var o1 = {a: 1, b: 2};
    var o2 = {a: 42, c: 101};
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.b).to.eql(2);
    expect(e.c).to.eql(101);

    e.a = 100;

    expect(o1.a).to.eql(1);
    expect(o2.a).to.eql(42);

    done();
  });
  it('should not concat arrays', function(done) {
    var o1 = {a: 1, b: ['hello', 'world']};
    var o2 = {a: 42, b: ['goodbye']};
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.b).to.contain('goodbye');
    expect(e.b).to.not.contain('world');
    expect(e.b.length).to.eql(1);

    expect(o1.b).to.contain('world');
    expect(o1.b).not.to.contain('goodbye');
    done();
  });
  it('should handle nested objects', function(done) {
    var o1 = {
      a: 1,
      c: 100,
      payload: {
        person: {
          id: 'xxx',
          name: 'hello'
        },
        environment: 'foo'
      }
    };
    var o2 = {
      a: 42,
      b: 2,
      payload: {
        person: {
          id: 'yesyes',
          email: 'cool'
        },
        other: 'bar'
      }
    };
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.c).to.eql(100);
    expect(e.b).to.eql(2);
    expect(e.payload.person.id).to.eql('yesyes');
    expect(e.payload.person.email).to.eql('cool');
    expect(e.payload.person.name).to.eql('hello');
    expect(e.payload.environment).to.eql('foo');
    expect(e.payload.other).to.eql('bar');
    done();
  });
  it('should handle nested arrays and objects, with non-matching structure', function(done) {
    var o1 = {
      a: 1,
      c: {
        arr: [3, 4, 5],
        other: [99, 100, 101],
        payload: {
          foo: {
            bar: 'baz'
          },
          hello: 'world',
          keeper: 'yup'
        }
      }
    };
    var o2 = {
      a: 32,
      c: {
        arr: [1],
        other: { fuzz: 'buzz' },
        payload: {
          foo: 'hello',
          hello: {
            baz: 'bar'
          }
        }
      }
    };
    var e = _.merge(o1, o2);

    expect(e.a).to.eql(32);
    expect(e.c.arr.length).to.eql(1);
    expect(e.c.arr[0]).to.eql(1);
    expect(e.c.other.fuzz).to.eql('buzz');
    expect(e.c.payload.foo).to.eql('hello');
    expect(e.c.payload.hello.baz).to.eql('bar');
    expect(e.c.payload.keeper).to.eql('yup');

    done();
  });

  it('should handle many nested objects', function(done) {
    var o1 = {
      a: 1,
      c: 100,
      payload: {
        person: {
          id: 'xxx',
          name: 'hello'
        },
        environment: 'foo'
      }
    };
    var o2 = {
      a: 42,
      b: 2,
      payload: {
        person: {
          id: 'yesyes',
          email: 'cool'
        },
        other: 'bar'
      }
    };
    var o3 = {
      payload: {
        fuzz: 'buzz',
        person: {
          name: 'nope'
        }
      },
      amihere: 'yes'
    };
    var e = _.merge(o1, o2, o3);

    expect(e.a).to.eql(42);
    expect(e.c).to.eql(100);
    expect(e.b).to.eql(2);
    expect(e.payload.person.id).to.eql('yesyes');
    expect(e.payload.person.email).to.eql('cool');
    expect(e.payload.person.name).to.eql('nope');
    expect(e.payload.environment).to.eql('foo');
    expect(e.payload.fuzz).to.eql('buzz');
    expect(e.payload.other).to.eql('bar');
    expect(e.amihere).to.eql('yes');
    done();
  });
});

var traverse = require('../src/utility/traverse');
describe('traverse', function() {
  describe('should call the func for every key,value', function() {
    it('simple object', function(done) {
      var obj = {a: 1, b: 2};
      var expectedOutput = {a: 2, b: 3};
      var callCount = 0;
      var result = traverse(obj, function(k, v) {
        callCount++;
        return v + 1;
      });
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(2);

      done();
    });
    it('nested object', function(done) {
      var obj = {a: 1, b: 2, c: {ca: 11}};
      var expectedOutput = {a: 2, b: 3, c: {ca: 12}};
      var callCount = 0;
      var result = traverse(obj, function(k, v) {
        callCount++;
        if (k === 'c') {
          return {ca: v.ca+1};
       }
        return v + 1;
      });
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(3);

      done();
    });
    it('array', function(done) {
      var obj = [1, 2, 3];
      var expected = [0, 1, 2];
      var callCount = 0;
      var result = traverse(obj, function(k, v) {
        callCount++;
        return v - 1;
      }, []);
      expect(result).to.eql(expected);
      expect(callCount).to.eql(3);
      done();
    });
  });
});

describe('uuid4', function() {
  it('should return a version 4 uuid', function(done) {
    var id = _.uuid4();
    var otherId = _.uuid4();
    expect(id).to.not.eql(otherId);
    var parts = id.split('-');
    expect(parts.length).to.eql(5);
    expect(parts[2][0]).to.eql('4');
    expect(parts[0].length).to.eql(8);
    expect(parts[1].length).to.eql(4);
    expect(parts[2].length).to.eql(4);
    expect(parts[3].length).to.eql(4);
    expect(parts[4].length).to.eql(12);
    done();
  });
});

describe('redact', function() {
  it('should return a string of stars', function(done) {
    var s1 = 'thisIsApasswrD';
    var s2 = 'short';
    var o = {a: 123};
    var a = [12, 34, 56];

    expect(_.redact(s1)).to.not.match(/[^*]/);
    expect(_.redact(s2)).to.not.match(/[^*]/);
    expect(_.redact(s1)).to.eql(_.redact(s2));
    expect(_.redact(o)).to.not.match(/[^*]/);
    expect(_.redact(a)).to.not.match(/[^*]/);

    done();
  })
});

describe('LEVELS', function() {
  it('should include debug', function() {
    expect(_.LEVELS['debug']).to.not.eql(undefined);
  });
  it('should have critical higher than debug', function() {
    expect(_.LEVELS['critical']).to.be.greaterThan(_.LEVELS['debug']);
  });
});

describe('formatUrl', function() {
  it('should handle a missing protocol', function() {
    var u = {
      hostname: 'a.b.com',
      path: '/wooza/',
      port: 42
    };
    expect(_.formatUrl(u)).to.eql('https://a.b.com:42/wooza/');
  });
  it('should use a forced protocol', function() {
    var u = {
      hostname: 'a.b.com',
      path: '/wooza/',
      port: 42
    };
    expect(_.formatUrl(u, 'file:')).to.eql('file://a.b.com:42/wooza/');
  });
  it('should pick a protocol based on port if others are missing', function() {
    var u = {
      hostname: 'a.b.com',
      port: 80,
      path: '/woo'
    };
    expect(_.formatUrl(u)).to.eql('http://a.b.com:80/woo');
    u.protocol = 'https:';
    expect(_.formatUrl(u)).to.eql('https://a.b.com:80/woo');
  });
  it('should handle missing parts', function() {
    var u = {
      hostname: 'a.b.com'
    };
    expect(_.formatUrl(u)).to.eql('https://a.b.com');
    expect(_.formatUrl(u, 'http:')).to.eql('http://a.b.com');
  });
  it('should return null without a hostname', function() {
    var u = {};
    expect(_.formatUrl(u)).to.not.be.ok();
    expect(_.formatUrl(u, 'https:')).to.not.be.ok();
  });
});

describe('addParamsAndAccessTokenToPath', function() {
  var accessToken = 'abc123';
  it('should handle no params and no path', function() {
    var options = {};
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('?access_token=abc123');
  });
  it('should handle existing params', function() {
    var options = {path: '/api?a=b'};
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123&a=b');
  });
  it('should handle a hash with params', function() {
    var options = {path: '/api?a=b#moreStuff??here'};
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123&a=b#moreStuff??here');
  });
  it('should handle a hash without params', function() {
    var options = {path: '/api#moreStuff??here'};
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123#moreStuff??here');
  });
  it('should handle a hash without params and no ?', function() {
    var options = {path: '/api#moreStuff'};
    _.addParamsAndAccessTokenToPath(accessToken, options);
    expect(options.path).to.eql('/api?access_token=abc123#moreStuff');
  });
  it('should handle extra params', function() {
    var options = {path: '/api#moreStuff'};
    _.addParamsAndAccessTokenToPath(accessToken, options, {foo: 'boo'});
    expect(options.path).to.eql('/api?access_token=abc123&foo=boo#moreStuff');
  });
});

describe('json3', function() {
  var setupCustomJSON = require('../vendor/JSON-js/json3.js');
  it('should replace stringify if not there', function() {
    var j = {};
    setupCustomJSON(j);
    expect(j.stringify({a: 1})).to.eql('{"a":1}');
  });
  it('should replace parse if not there', function() {
    var j = {};
    setupCustomJSON(j);
    expect(j.parse('{"a":1}').a).to.eql(1);
  });
  it('should not replace parse if there', function() {
    var j = {parse: function(s) { return 42; }};
    setupCustomJSON(j);
    expect(j.parse('{"a":1}')).to.eql(42);
    expect(j.stringify({a: 1})).to.eql('{"a":1}');
  });
  it('should not replace stringify if there', function() {
    var j = {stringify: function(s) { return '42'; }};
    setupCustomJSON(j);
    expect(j.stringify({a: 1})).to.eql('42');
    expect(j.parse('{"a":1}').a).to.eql(1);
  });
});

describe('get', function() {
  it('should get a deeply nested value', function() {
    var o = {a: {b: {c: {d: 42}}}};
    expect(_.get(o, 'a.b.c.d')).to.eql(42);
  });
  it('should be undefined for a missing value', function() {
    var o = {a: {b: {c: {d: 42}}}};
    expect(_.get(o, 'a.b.x.d')).to.not.be.ok();
  });
  it('should handle bad input', function() {
    var o = 'hello';
    expect(_.get(o, 'oops.1.2.3')).to.not.be.ok();
  });
  it('should actually work with arrays too', function() {
    var o = {a: [{b: {c: [1, {d: 42}, null]}}, 99]};
    expect(_.get(o, 'a.0.b.c.1.d')).to.eql(42);
  });
  it('should handle undefined input', function() {
    var u = undefined;
    expect(_.get(u, 'a.b.c')).to.not.be.ok();
  });
});

describe('filterIp', function() {
  it('no user_ip', function() {
    var requestData = {'something': 'but no ip'};
    _.filterIp(requestData, false);
    expect(requestData['user_ip']).to.not.be.ok();
  });
  it('capture true', function() {
    var ip = '123.32.394.99';
    var requestData = {'user_ip': ip};
    _.filterIp(requestData, true);
    expect(requestData['user_ip']).to.eql(ip);
  });
  it('anonymize ip4', function() {
    var ip = '123.32.394.99';
    var requestData = {'user_ip': ip};
    _.filterIp(requestData, 'anonymize');
    expect(requestData['user_ip']).to.not.eql(ip);
    expect(requestData['user_ip']).to.be.ok();
  });
  it('capture false', function() {
    var ip = '123.32.394.99';
    var requestData = {'user_ip': ip};
    _.filterIp(requestData, false);
    expect(requestData['user_ip']).to.not.eql(ip);
    expect(requestData['user_ip']).to.not.be.ok();
  });
  it('ipv6 capture false', function() {
    var ip = '2607:f0d0:1002:51::4';
    var requestData = {'user_ip': ip};
    _.filterIp(requestData, false);
    expect(requestData['user_ip']).to.not.eql(ip);
    expect(requestData['user_ip']).to.not.be.ok();
  });
  it('ipv6 anonymize', function() {
    var ips = [
        'FE80:0000:0000:0000:0202:B3FF:FE1E:8329',
        'FE80::0202:B3FF:FE1E:8329',
        '2607:f0d0:1002:51::4',
    ];
    for (var i = 0; i < ips.length; i++) {
      var ip = ips[i];
      var requestData = {'user_ip': ip};
      _.filterIp(requestData, 'anonymize');
      expect(requestData['user_ip']).to.not.eql(ip);
      expect(requestData['user_ip']).to.be.ok();
    }
  });
});

describe('set', function() {
  it('should handle a top level key', function() {
    var o = {a: 42};
    _.set(o, 'b', 1);
    expect(o.b).to.eql(1);
    expect(o.a).to.eql(42);
  });
  it('should handle a top level key', function() {
    var o = {a: 42, b: {c: 44, d: {e: 99}}};
    _.set(o, 'f', 1);
    expect(o.f).to.eql(1);
    expect(o.a).to.eql(42);
    expect(o.b.c).to.eql(44);
    expect(o.b.d.e).to.eql(99);
  });
  it('should replace a value that is already there', function() {
    var o = {a: 42};
    _.set(o, 'a', 1);
    expect(o.a).to.eql(1);
  });
  it('should set a nested value with missing keys', function() {
    var o = {baz: 21};
    _.set(o, 'foo.bar', [42]);
    expect(o.baz).to.eql(21);
    expect(o.foo.bar).to.eql([42]);
  });
  it('should replace a nested value', function() {
    var o = {woo: 99, foo: {bar: {baz: 42, buzz: 97}, a: 98}};
    _.set(o, 'foo.bar.baz', 1);
    expect(o.woo).to.eql(99);
    expect(o.foo.a).to.eql(98);
    expect(o.foo.bar.buzz).to.eql(97);
    expect(o.foo.bar.baz).to.eql(1);
  });
  it('should set a nested value with some missing keys', function() {
    var o = {woo: 99, foo: {bar: {buzz: 97}, a: 98}};
    _.set(o, 'foo.bar.baz.fizz', 1);
    expect(o.woo).to.eql(99);
    expect(o.foo.a).to.eql(98);
    expect(o.foo.bar.buzz).to.eql(97);
    expect(o.foo.bar.baz.fizz).to.eql(1);
  });
});

var scrub = require('../src/scrub');
describe('scrub', function() {
  it('should not redact fields that are okay', function() {
    var data = {
      a: 'somestring',
      password: 'abc123',
      tempWorker: 'cool'
    };
    var scrubFields = ['password', 'b', 'pw'];

    var result = scrub(data, scrubFields);

    expect(result.a).to.eql('somestring');
    expect(result.tempWorker).to.eql('cool');
  });
  it('should redact fields that are in the field list', function() {
    var data = {
      a: 'somestring',
      password: 'abc123'
    };
    var scrubFields = ['password', 'b'];

    var result = scrub(data, scrubFields);

    expect(result.password).to.eql(_.redact());
  });
  it('should handle nested objects', function() {
    var data = {
      a: {
        b: {
          badthing: 'secret',
          other: 'stuff'
        },
        c: 'bork',
        password: 'abc123'
      },
      secret: 'blahblah'
    };
    var scrubFields = ['badthing', 'password', 'secret'];

    var result = scrub(data, scrubFields);

    expect(result.a.b.other).to.eql('stuff');
    expect(result.a.b.badthing).to.eql(_.redact());
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.eql(_.redact());
    expect(result.secret).to.eql(_.redact());
    expect(data.secret).to.eql('blahblah');
  });
  it('should do something sane for recursive objects', function() {
    var inner = {
      a: 'what',
      b: 'yes'
    };
    var data = {
      thing: 'stuff',
      password: 'abc123'
    };
    data.inner = inner;
    inner.outer = data;
    var scrubFields = ['password', 'a'];

    var result = scrub(data, scrubFields);

    expect(result.thing).to.eql('stuff');
    expect(result.password).to.eql(_.redact());
    expect(result.inner.a).to.eql(_.redact());
    expect(result.inner.a).to.be.ok();
    expect(result.inner.b).to.eql('yes');
  });
  it('should scrub objects seen twice', function() {
    var request = {
      password: 'foo'
    }

    var data = {
      request,
      response: { request }
    }

    var scrubFields = ['password'];

    var result = scrub(data, scrubFields);

    expect(result.request.password).to.eql(_.redact());
    expect(result.response.request.password).to.eql(_.redact());
  });
  it('should handle scrubPaths', function() {
    var data = {
      a: {
        b: {
          foo: 'secret',
          bar: 'stuff'
        },
        c: 'bork',
        password: 'abc123'
      },
      secret: 'blahblah'
    };
    var scrubPaths = [
      'nowhere', // path not found
      'a.b.foo', // nested path
      'a.password', // nested path
      'secret' // root path
    ];

    var result = scrub(data, [], scrubPaths);

    expect(result.a.b.bar).to.eql('stuff');
    expect(result.a.b.foo).to.eql(_.redact());
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.eql(_.redact());
    expect(result.secret).to.eql(_.redact());
  });
});

describe('formatArgsAsString', function() {
  it('should handle null', function() {
    var args = [null, 1];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('null 1');
  });
  it('should handle undefined', function() {
    var args = [null, 1, undefined];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('null 1 undefined');
  });
  it('should handle objects', function() {
    var args = [1, {a: 42}];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('1 {"a":42}');
  });
  it('should handle strings', function() {
    var args = [1, 'foo'];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('1 foo');
  });
  it('should handle empty args', function() {
    var args = [];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('');
  });
  /*
   * PhantomJS does not support Symbol yet
  it('should handle symbols', function() {
    var args = [1, Symbol('hello')];
    var result = _.formatArgsAsString(args);

    expect(result).to.eql('1 symbol(\'hello\')');
  });
  */
});
