var expect = chai.expect;

it("custom stringify should parse json correctly", function(done) {
  var stringify = RollbarJSON.setupCustomStringify();
  var json = stringify({a: {b: 'c', d: 1}, e: true});
  expect(json).to.equal('{"a":{"b":"c","d":1},"e":true}');
  done();
});
