var expect = chai.expect;

describe('RollbarJSON', function() {
  it("should generate json string successfully using custom stringify", function(done) {
    var JSON = {};
    setupCustomJSON(JSON);

    var json = JSON.stringify({a: {b: 'c', d: 1, e: [1, 2, 'a', 'b', true]}, f: true});

    expect(json).to.equal('{"a":{"b":"c","d":1,"e":[1,2,"a","b",true]},"f":true}');

    done();
  });

  it("should handle bad stringify input", function(done) {
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

  it("should parse a valid json string correctly", function(done) {
    var JSON = {};
    setupCustomJSON(JSON);

    var jsonString = '{"a":{"b":"c","d":1,"e":[1,2,"a","b",true]},"f":true}';

    var obj = JSON.parse(jsonString);

    expect(obj).to.deep.equal({a: {b: 'c', d: 1, e: [1, 2, 'a', 'b', true]}, f: true});

    done();
  });

  it("should throw errors for bad parse input", function(done) {
    var JSON = {};
    setupCustomJSON(JSON);

    var badString = '{"a":{"b":"c","d":1,"e":[1,2,"a","b",true]},"f":true';

    expect(function() {
      JSON.parse(badString);
    }).to.throw();

    badString = '{"a":abc}';

    expect(function() {
      JSON.parse(badString);
    }).to.throw();

    badString = '{"abc"}';

    expect(function() {
      JSON.parse(badString);
    }).to.throw();

    done();
  });
});
