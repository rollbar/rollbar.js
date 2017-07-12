/* globals expect */
/* globals describe */
/* globals it */

var _ = require('../src/utility');
var t = require('../src/transforms');

function itemFromArgs(args) {
  var item = _.createItem(args);
  item.level = 'debug';
  return item;
}

describe('itemToPayload', function() {
  it('ignores options.payload.body but merges in other payload options', function(done) {
    var args = ['a message', {custom: 'stuff'}];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    var options = {
      endpoint: 'api.rollbar.com',
      payload: {body: 'hey', x: 42}
    };
    t.itemToPayload(item, options, function(e, i) {
      expect(i.body).to.not.eql('hey');
      expect(i.x).to.eql(42);
      done(e);
    });
  });
  it('ignores handles trailing slash in endpoint', function(done) {
    var args = ['a message', {custom: 'stuff'}];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    item.data = {message: 'a message'};
    var options = {
      endpoint: 'api.rollbar.com/'
    };
    t.itemToPayload(item, options, function(e, i) {
      expect(i.message).to.eql('a message');
      done(e);
    });
  });
});
