/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var extend = require('extend');

var _ = require('../src/utility');

var rollbarConfig = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};

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
    expect(_.isFunction(f)).to.be.ok();
    expect(_.isFunction(g)).to.be.ok();
    done();
  });
});

