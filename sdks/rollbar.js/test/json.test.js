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
    try {
      stringify(object);
    } catch (e) {
      expect(e.constructor.name).to.equal('TypeError');
    }

    try {
      stringify(window);
    } catch (e) {
      expect(e.constructor.name).to.equal('TypeError');
    }

    try {
      stringify(document.querySelector('#mocha'));
    } catch (e) {
      expect(e.constructor.name).to.equal('TypeError');
    }

    expect(stringify()).to.equal(undefined);
    expect(stringify(null)).to.equal('null');

    done();
  });
});
