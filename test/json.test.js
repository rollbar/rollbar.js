var expect = chai.expect;

describe('RollbarJSON', function() {
  it("should generate json string successfully using custom stringify", function(done) {
    var stringify = RollbarJSON.setupCustomStringify();
    var json = stringify({a: {b: 'c', d: 1}, e: true});
    expect(json).to.equal('{"a":{"b":"c","d":1},"e":true}');
    done();
  });
});
