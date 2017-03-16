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
      });
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
      });
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
      });
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
    expect(_.formatUrl(u, 'file')).to.eql('file://a.b.com:42/wooza/');
  });
  it('should pick a protocol based on port if others are missing', function() {
    var u = {
      hostname: 'a.b.com',
      port: 80,
      path: '/woo'
    };
    expect(_.formatUrl(u)).to.eql('http://a.b.com:80/woo');
    u.protocol = 'https';
    expect(_.formatUrl(u)).to.eql('https://a.b.com:80/woo');
  });
  it('should handle missing parts', function() {
    var u = {
      hostname: 'a.b.com'
    };
    expect(_.formatUrl(u)).to.eql('https://a.b.com');
    expect(_.formatUrl(u, 'http')).to.eql('http://a.b.com');
  });
  it('should return null without a hostname', function() {
    var u = {};
    expect(_.formatUrl(u)).to.not.be.ok();
    expect(_.formatUrl(u, 'https')).to.not.be.ok();
  });
});

