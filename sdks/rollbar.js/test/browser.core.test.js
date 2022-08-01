/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

// Use minimal browser package, with no optional components added.
var Rollbar = require('../src/browser/core');

describe('options.captureUncaught', function() {
  beforeEach(function (done) {
    // Load the HTML page, so errors can be generated.
    document.write(window.__html__['examples/error.html']);

    window.server = sinon.createFakeServer();
    done();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
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

  it('should capture when enabled in constructor', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var element = document.getElementById('throw-error');
    element.click();

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.notifier.diagnostic.raw_error.message).to.eql('test error');
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(true);

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false
      });

      done();
    }, 1);
  });

  it('should respond to enable/disable in configure', function(done) {
    var server = window.server;
    var element = document.getElementById('throw-error');
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: false
    };
    var rollbar = window.rollbar = new Rollbar(options);

    element.click();

    setTimeout(function() {
      server.respond();
      expect(server.requests.length).to.eql(0); // Disabled, no event
      server.requests.length = 0;

      rollbar.configure({
        captureUncaught: true
      });

      element.click();

      setTimeout(function() {
        server.respond();

        var body = JSON.parse(server.requests[0].requestBody);

        expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
        expect(body.data.body.trace.exception.message).to.eql('test error');
        expect(body.data.notifier.diagnostic.is_anonymous).to.not.be.ok();

        server.requests.length = 0;

        rollbar.configure({
          captureUncaught: false
        });

        element.click();

        setTimeout(function() {
          server.respond();
          expect(server.requests.length).to.eql(0); // Disabled, no event

          done();
        }, 1);
      }, 1);
    }, 1);
  });

  // Test case expects Chrome, which is the currently configured karma js/browser
  // engine at the time of this comment. However, karma's Chrome and ChromeHeadless
  // don't actually behave like real Chrome so we settle for stubbing some things.
  it('should capture external error data when inspectAnonymousErrors is true', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    // We're supposedly running on ChromeHeadless, but still need to spoof Chrome. :\
    window.chrome = { runtime: true};

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      inspectAnonymousErrors: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    // Simulate receiving onerror without an error object.
    rollbar.anonymousErrorsPending += 1;

    try {
      throw new Error('anon error')
    } catch(e) {
      Error.prepareStackTrace(e);
    }

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('anon error');
      expect(body.data.notifier.diagnostic.is_anonymous).to.eql(true);

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false
      });

      done();
    }, 1);
  });

  it('should ignore duplicate errors by default', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var element = document.getElementById('throw-error');

    // generate same error twice
    for(var i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    setTimeout(function() {
      server.respond();

      // transmit only once
      expect(server.requests.length).to.eql(1);

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('test error');

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false
      });

      done();
    }, 1);
  });

  it('should transmit duplicate errors when set in config', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      ignoreDuplicateErrors: false
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var element = document.getElementById('throw-error');

    // generate same error twice
    for(var i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    setTimeout(function() {
      server.respond();

      // transmit both errors
      expect(server.requests.length).to.eql(2);

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('test error');

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false
      });

      done();
    }, 1);
  });
  it('should send DOMException as trace_chain', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var element = document.getElementById('throw-dom-exception');
    element.click();

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace_chain[0].exception.message).to.eql('test DOMException');

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false
      });

      done();
    }, 1);
  });

  it('should capture exta frames when stackTraceLimit is set', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var oldLimit = Error.stackTraceLimit;
    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      stackTraceLimit: 50
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var element = document.getElementById('throw-depp-stack-error');
    element.click();

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('deep stack error');
      expect(body.data.body.trace.frames.length).to.be.above(20);

      // karma doesn't unload the browser between tests, so the onerror handler
      // will remain installed. Unset captureUncaught so the onerror handler
      // won't affect other tests.
      rollbar.configure({
        captureUncaught: false,
        stackTraceLimit: oldLimit // reset to default
      });

      done();
    }, 1);
  });
});

describe('options.captureUnhandledRejections', function() {
  beforeEach(function (done) {
    window.server = sinon.createFakeServer();
    done();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
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

  it('should capture when enabled in constructor', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    Promise.reject(new Error('test reject'));

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('test reject');
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(true);

      rollbar.configure({
        captureUnhandledRejections: false
      });
      window.removeEventListener('unhandledrejection', window._rollbarURH);

      done();
    }, 500);
  });

  it('should respond to enable in configure', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: false
    };
    var rollbar = window.rollbar = new Rollbar(options);

    rollbar.configure({
      captureUnhandledRejections: true
    });

    Promise.reject(new Error('test reject'));

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.body.trace.exception.message).to.eql('test reject');

      server.requests.length = 0;

      rollbar.configure({
        captureUnhandledRejections: false
      });
      window.removeEventListener('unhandledrejection', window._rollbarURH);

      done();
    }, 500);
  });

  it('should respond to disable in configure', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    rollbar.configure({
      captureUnhandledRejections: false
    });

    Promise.reject(new Error('test reject'));

    setTimeout(function() {
      server.respond();

      expect(server.requests.length).to.eql(0); // Disabled, no event
      server.requests.length = 0;

      window.removeEventListener('unhandledrejection', window._rollbarURH);

      done();
    }, 500);
  })
});

describe('log', function() {
  beforeEach(function (done) {
    window.server = sinon.createFakeServer();
    done();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
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

  it('should send message when called with message and extra args', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN'
    };
    var rollbar = window.rollbar = new Rollbar(options);

    rollbar.log('test message', { 'foo': 'bar' });

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.message.body).to.eql('test message');
      expect(body.data.body.message.extra).to.eql({ 'foo': 'bar' });
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(undefined);
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql(['string', 'object']);

      done();
    }, 1);
  })

  it('should send exception when called with error and extra args', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN'
    };
    var rollbar = window.rollbar = new Rollbar(options);

    rollbar.log(new Error('test error'), { 'foo': 'bar' });

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.body.trace.extra).to.eql({ 'foo': 'bar' });
      expect(body.data.notifier.diagnostic.is_uncaught).to.eql(undefined);
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql(['error', 'object']);

      done();
    }, 1);
  })

  it('should add custom data when called with error context', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      addErrorContext: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var err = new Error('test error');
    err.rollbarContext = { err: 'test' };

    rollbar.error(err, { 'foo': 'bar' });

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.custom.foo).to.eql('bar');
      expect(body.data.custom.err).to.eql('test');

      done();
    }, 1);
  })

  it('should remove circular references in custom data', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      addErrorContext: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var err = new Error('test error');
    var contextData = { extra: 'baz' }
    contextData.data = contextData;
    var context = { err: 'test', contextData: contextData };
    err.rollbarContext = context;

    var array = ['one', 'two'];
    array.push(array);
    var custom = { foo: 'bar', array: array };
    var notCircular = { key: 'value' };
    custom.notCircular1 = notCircular;
    custom.notCircular2 = notCircular;
    custom.self = custom;
    rollbar.error(err, custom);

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.custom.foo).to.eql('bar');
      expect(body.data.custom.err).to.eql('test');

      // Duplicate objects are allowed when there is no circular reference.
      expect(body.data.custom.notCircular1).to.eql(notCircular);
      expect(body.data.custom.notCircular2).to.eql(notCircular);

      expect(body.data.custom.self).to.eql(
        'Removed circular reference: object'
      );
      expect(body.data.custom.array).to.eql([
        'one', 'two', 'Removed circular reference: array'
      ]);
      expect(body.data.custom.contextData).to.eql({
        extra: 'baz',
        data: 'Removed circular reference: object'
      });

      done();
    }, 1);
  })

  it('should send message when called with only null arguments', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    rollbar.log(null);

    setTimeout(function() {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.message.body).to.eql('Item sent with null or missing arguments.');
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql(['null']);

      done();
    }, 1);
  })

  it('should skipFrames when set', function(done) {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true
    };
    var rollbar = window.rollbar = new Rollbar(options);

    var error = new Error('error with stack');

    rollbar.log(error);
    rollbar.log(error, { skipFrames: 1 });

    setTimeout(function() {
      server.respond();

      var frames1 = JSON.parse(server.requests[0].requestBody).data.body.trace.frames;
      var frames2 = JSON.parse(server.requests[1].requestBody).data.body.trace.frames;

      expect(frames1.length).to.eql(frames2.length + 1);
      expect(frames1.slice(0,-1)).to.eql(frames2);

      done();
    }, 1);
  })
});
