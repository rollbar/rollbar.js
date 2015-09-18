/* globals expect */
/* globals describe */
/* globals it */

require('mootools');

var setupCustomJSON = require('../vendor/JSON-js/json2.js');


describe('RollbarJSON', function() {
  it('should correctly serialize JSON that breaks in MooTools', function(done) {
    var _JSON = {};
    setupCustomJSON(_JSON);

    var json = _JSON.stringify({a: [{b: 1}]});
    expect(json).to.equal('{"a":[{"b":1}]}');

    done();
  });
});
