/* globals chai */
/* globals describe */
/* globals it */


var setupCustomJSON = require('../vendor/JSON-js/json2.js');

var expect = chai.expect;

describe('RollbarJSON', function() {
  it('should generate json string successfully using custom stringify', function(done) {
    var _JSON = {};
    setupCustomJSON(_JSON);

    var json = _JSON.stringify({a: {b: 'c', d: 1, e: [1, 2, 'a', 'b', true]}, f: true});

    expect(json).to.equal('{"a":{"b":"c","d":1,"e":[1,2,"a","b",true]},"f":true}');

    done();
  });

  it('should correctly serialize JSON that breaks in MooTools', function(done) {
    var _JSON = {};
    setupCustomJSON(_JSON);

    var json = _JSON.stringify({a: [{b: 1}]});
    expect(json).to.equal('{"a":[{"b":1}]}');

    done();
  });

  it('should handle bad stringify input', function(done) {
    var _JSON = {};
    setupCustomJSON(_JSON);

    var object = {a: {b: 'c'}};
    object.self = object;

    // Make sure circular references are caught
    expect(function() {
      _JSON.stringify(object);
    }).to.throw(RangeError);

    expect(function() {
      _JSON.stringify(window);
    }).to.throw(RangeError);

    expect(_JSON.stringify()).to.equal(undefined);
    expect(_JSON.stringify(null)).to.equal('null');

    done();
  });

  it('should parse a valid json string correctly', function(done) {
    var _JSON = {};
    setupCustomJSON(_JSON);

    var jsonString = '{"a":{"b":"c","d":1,"e":[1,2,"a","b",true]},"f":true}';

    var obj = _JSON.parse(jsonString);

    expect(obj).to.deep.equal({a: {b: 'c', d: 1, e: [1, 2, 'a', 'b', true]}, f: true});

    done();
  });

  it('should throw errors for bad parse input', function(done) {
    var _JSON = {};
    setupCustomJSON(_JSON);

    var badString = '{"a":{"b":"c","d":1,"e":[1,2,"a","b",true]},"f":true';

    expect(function() {
      _JSON.parse(badString);
    }).to.throw();

    badString = '{"a":abc}';

    expect(function() {
      _JSON.parse(badString);
    }).to.throw();

    badString = '{"abc"}';

    expect(function() {
      _JSON.parse(badString);
    }).to.throw();

    done();
  });
});
