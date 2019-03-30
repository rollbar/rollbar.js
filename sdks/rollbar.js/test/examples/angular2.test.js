/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('Angular2 app', function() {
  this.timeout(4000);

  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/angular2/dist/my-app/index.html']);

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

  it('should send a valid log event', function(done) {
    var server = window.server;
    var angularComponent = window.angularAppComponent;

    server.respondWith('POST', 'api/1/item',
      [
        200,
        { 'Content-Type': 'application/json' },
        '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}'
      ]
    );

    angularComponent.publicRollbarInfo();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('angular test log');

    done();
  });
});
