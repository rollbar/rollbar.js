/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var extend = require('extend');

var _ = require('../src/utility');

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

describe('extend', function() {
  it('should be exported and work', function(done) {
    var o1 = {a: 1};
    var o2 = {a: 42};
    var e1 = _.extend(true, {}, o1);
    expect(e1.a).to.eql(1);
    e1.a = 100;
    expect(o1.a).to.eql(1);

    var e2 = _.extend(true, o2, {b: 45});
    expect(e2).to.eql({a: 42, b: 45});

    done();
  });
});

describe('traverse', function() {
  describe('should call the func for every key,value', function() {
    it('simple object', function(done) {
      var obj = {a: 1, b: 2};
      var expectedOutput = {a: 2, b: 3};
      var callCount = 0;
      var result = _.traverse(obj, function(k, v) {
        callCount++;
        return v + 1;
      }, []);
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(2);

      done();
    });
    it('nested object', function(done) {
      var obj = {a: 1, b: 2, c: {ca: 11}};
      var expectedOutput = {a: 2, b: 3, c: {ca: 12}};
      var callCount = 0;
      var result = _.traverse(obj, function(k, v) {
        callCount++;
        if (k === 'c') {
          return {ca: v.ca+1};
       }
        return v + 1;
      }, []);
      expect(result).to.eql(expectedOutput);
      expect(callCount).to.eql(3);

      done();
    });
    it('array', function(done) {
      var obj = [1, 2, 3];
      var expected = [0, 1, 2];
      var callCount = 0;
      var result = _.traverse(obj, function(k, v) {
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

describe('scrub', function() {
  it('should not redact fields that are okay', function() {
    var data = {
      a: 'somestring',
      password: 'abc123'
    };
    var scrubFields = ['password', 'b'];

    var result = _.scrub(data, scrubFields);

    expect(result.a).to.eql('somestring');
  });
  it('should redact fields that are in the field list', function() {
    var data = {
      a: 'somestring',
      password: 'abc123'
    };
    var scrubFields = ['password', 'b'];

    var result = _.scrub(data, scrubFields);

    expect(result.password).to.not.eql('abc123');
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

    var result = _.scrub(data, scrubFields);

    expect(result.a.b.other).to.eql('stuff');
    expect(result.a.badthing).to.not.eql('secret');
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.not.eql('abc123');
    expect(result.secret).to.not.eql('blahblah');
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

    var result = _.scrub(data, scrubFields);

    expect(result.thing).to.eql('stuff');
    expect(result.password).to.not.eql('abc123');
    expect(result.inner.a).to.not.eql('what');
    expect(result.inner.b).to.eql('yes');
  });
});
