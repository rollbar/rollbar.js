var expect = chai.expect;
var setupCustomJSON = require('../../vendor/JSON-js/json2.js');

describe('RollbarJSON', function() {
  it("should correctly serialize JSON that breaks in MooTools", function(done) {
    var JSON = {};
    setupCustomJSON(JSON);

    var json = JSON.stringify({a:[{b:1}]});
    expect(json).to.equal('{"a":[{"b":1}]}');

    done();
  });
});
