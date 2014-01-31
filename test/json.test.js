var expect = chai.expect;

describe('RollbarJSON', function() {
  it("should generate json string successfully using custom stringify", function(done) {
    var JSON = {};
    setupCustomJSON(JSON);

    var json = JSON.stringify({a: {b: 'c', d: 1}, e: true});

    expect(json).to.equal('{"a":{"b":"c","d":1},"e":true}');

    done();
  });

  it("should handle bad input", function(done) {
    var JSON = {};
    setupCustomJSON(JSON);

    var object = {a: {b: 'c'}};
    object.self = object;

    // Make sure circular references are caught
    expect(function() {
      JSON.stringify(object);
    }).to.throw(RangeError);

    expect(function() {
      JSON.stringify(window);
    }).to.throw(RangeError);

    expect(function() {
      JSON.stringify(document.querySelector('#mocha'));
    }).to.throw(RangeError);

    expect(JSON.stringify()).to.equal(undefined);
    expect(JSON.stringify(null)).to.equal('null');

    done();
  });
});
