// The most maintainable way to reset the browser state in karma is to put
// tests in separate files. This file is for testing non-default config
// options during snippet execution. (Before full rollbar.js loads.)

describe('Rollbar loaded by snippet with non-default options', function () {
  before(function (done) {
    // Stub the xhr interface.
    window.server = sinon.createFakeServer();

    // Load the HTML page.
    document.write(
      window.__html__[
        'examples/universal-browser/test-with-non-default-options.html'
      ],
    );

    // Karma headless chrome won't dispatch DOMContentLoaded,
    // so we need to do it manually.
    var event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // Give the snippet time to load and init.
    setTimeout(function () {
      done();
    }, 1000);
  });

  after(function () {
    window.server.restore();
  });

  it('should send a valid log event', function (done) {
    var server = window.server;
    var rollbar = document.defaultView.Rollbar;

    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);

    var ret = rollbar.info('test');

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql(undefined);
      expect(body.data.uuid).to.eql(ret.uuid);
      expect(body.data.body.message.body).to.eql('test');

      // Assert that load telemetry was not added. (First event is the log event.)
      expect(body.data.body.telemetry[0].type).to.eql('log');
      expect(body.data.body.telemetry[0].body.message).to.eql('test');

      done();
    }, 1);
  });
});
