/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('webpack app', function() {
  this.timeout(4000);

  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/webpack/src/index.html']);

    // Set a timer before stubbing the XHR server, else it will interfere with
    // scripts loaded from the HTML page.
    setTimeout(function() {
      // Stub the xhr interface.
      window.server = sinon.createFakeServer();

      done();
    }, 3000);
  });

  after(function () {
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item',
      [
        200,
        { 'Content-Type': 'application/json' },
        '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}'
      ]
    );
  }

  it('should send a valid log event', function(done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('rollbar-info');
    element.click();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');

    done();
  });

  it('should report uncaught error', function(done) {
    var server = window.server;

    stubResponse(server)
    server.requests.length = 0;

    var element = document.getElementById('throw-error');
    element.click();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');

    // This has become necessary because Travis switched their Chrome stable
    // version _down_ from 76 to 62, which handles this test case differently.
    // 2020-05-06: Travis Chrome 62 is now returning the original message.
    var version = parseInt(window.navigator.userAgent.match(new RegExp('^.*HeadlessChrome/([0-9]*).*$'))[1]);
    var message = version >= 62 ? 'webpack test error' : 'Script error.';

    expect(body.data.body.trace.exception.message).to.eql(message);

    done();
  });

  it('should store a payload and send stored payload', function(done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    // Invoke rollbar event to be stored, not sent.
    document.getElementById('rollbar-info-with-extra').click();
    server.respond();

    // Verify event is not sent to API
    expect(server.requests.length).to.eql(0);

    // Verify valid stored payload
    var parsedJson = JSON.parse(window.jsonPayload);
    expect(parsedJson.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(parsedJson.data.body.message.body).to.eql('webpack test log');

    // Send stored payload
    document.getElementById('send-json').click();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');

    done();
  });
});
