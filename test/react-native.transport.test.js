/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var truncation = require('../src/truncation');
var Transport = require('../src/react-native/transport');
var t = new Transport(truncation);
var utility = require('../src/utility');
utility.setupJSON();

describe('post', function() {
  var accessToken = 'abc123';
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/'
  };
  var payload = {
    access_token: accessToken,
    data: {a: 1}
  };
  var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

  before(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    sinon.stub(window, 'fetch');
    done();
  });

  after(function () {
    window.fetch.restore();
  });

  function stubResponse(code, err, message) {
    window.fetch.returns(Promise.resolve(new Response(
      JSON.stringify({ err: err, message: message, result: { uuid: uuid }}),
      { status: code, statusText: message, headers: { 'Content-Type': 'application/json' }}
    )));
  }

  it('should callback with the right value on success', function(done) {
    stubResponse(200, 0, 'OK');

    var callback = function(err, data) {
      expect(err).to.eql(null);
      expect(data).to.be.ok();
      expect(data.uuid).to.eql(uuid);
      done();
    };
    t.post(accessToken, options, payload, callback);
  });

  it('should callback with the server error if 403', function(done) {
    stubResponse(403, '403', 'bad request');

    var callback = function(err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('Api error: bad request');
      done();
    };
    t.post(accessToken, options, payload, callback);
  });
});
