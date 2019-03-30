/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('Rollbar loaded by snippet', function() {
  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/universal-browser/test.html']);

    // Stub the xhr interface.
    window.server = sinon.createFakeServer();

    // Give the snippet time to load and init.
    setTimeout(function() {
      done();
    }, 1000);
  });

  after(function () {
    window.server.restore();
  });

  it('should send a valid log event', function(done) {
    var server = window.server;
    var rollbar = document.defaultView.Rollbar;

    server.respondWith('POST', 'api/1/item',
      [
        200,
        { 'Content-Type': 'application/json' },
        '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}'
      ]
    );

    var ret = rollbar.info('test');
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.uuid).to.eql(ret.uuid);
    expect(body.data.body.message.body).to.eql('test');

    done();
  });
});
