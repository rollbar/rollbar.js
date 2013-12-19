var expect = chai.expect;

describe('RollbarJSON', function() {
  it("should generate json string successfully using custom stringify", function(done) {
    var stringify = RollbarJSON.setupCustomStringify();
    var json = stringify({a: {b: 'c', d: 1}, e: true});

    expect(json).to.equal('{"a":{"b":"c","d":1},"e":true}');

    done();
  });

  it("should handle bad input", function(done) {
    var stringify = RollbarJSON.setupCustomStringify();
    var object = {a: {b: 'c'}};
    object.self = object;

    // Make sure circular references are caught
    expect(function() {
      stringify(object);
    }).to.throw(TypeError, 'RollbarJSON.stringify cannot serialize cyclic structures.');

    expect(function() {
      stringify(window);
    }).to.throw(TypeError, 'RollbarJSON.stringify cannot serialize cyclic structures.');

    expect(function() {
      stringify(document.querySelector('#mocha'));
    }).to.throw(TypeError, 'RollbarJSON.stringify cannot serialize cyclic structures.');

    expect(stringify()).to.equal(undefined);
    expect(stringify(null)).to.equal('null');

    done();
  });
});
