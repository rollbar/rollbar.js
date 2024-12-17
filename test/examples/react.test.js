/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('react app', function () {
  this.timeout(4000);

  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/react/dist/index.html']);

    // Set a timer before stubbing the XHR server, else it will interfere with
    // scripts loaded from the HTML page.
    setTimeout(function () {
      // Stub the xhr interface.
      window.server = sinon.createFakeServer();

      done();
    }, 3000);
  });

  after(function () {
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should send a valid log event', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('rollbar-info');
    element.click();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('react test log');

    done();
  });

  it('should report uncaught error', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('throw-error');
    element.click();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.trace.exception.message).to.eql('react test error');

    done();
  });

  it('should not report error inside error boundary', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('child-error');
    element.click();
    server.respond();

    // Should only produce one API request.
    expect(server.requests.length).to.eql(1);
    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');

    // Should be a log event, not an uncaught exception
    expect(body.data.body.message.body).to.eql('react child test error');

    done();
  });
});
