/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

// To make changes to the example app, see /examples/angular2/README.md.

describe('Angular2 app', function () {
  this.timeout(4000);

  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/angular2/dist/my-app/index.html']);

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
    var angularComponent = window.angularAppComponent;

    stubResponse(server);
    server.requests.length = 0;

    angularComponent.publicRollbarInfo();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('angular test log');

    done();
  });

  it('should minimize Angular change detection events', function (done) {
    var server = window.server;
    var angularComponent = window.angularAppComponent;
    var doCheckCount = angularComponent.doCheckCount;

    stubResponse(server);
    server.requests.length = 0;

    angularComponent.publicRollbarInfo();
    server.respond();

    // Angular triggers change detection on all events, timers, and XHR responses.
    // Rollbar.js exits the Angular Zone.js zone before API requests, preventing
    // change detection from being triggered by Rollbar reporting, and improving
    // performance for some apps.
    //
    // See src/browser/transport.js: _makeZoneRequest().
    expect(angularComponent.doCheckCount).to.eql(doCheckCount + 1);

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
    expect(body.data.body.trace.exception.message).to.eql('angular test error');

    done();
  });

  it('should allow undefined arguments to rollbar.log', function (done) {
    var server = window.server;
    var angularComponent = window.angularAppComponent;

    stubResponse(server);
    server.requests.length = 0;

    angularComponent.publicRollbarInfoWithUndefined();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql(
      'angular test log with undefined',
    );

    done();
  });
});
