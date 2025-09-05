import { expect } from 'chai';
import sinon from 'sinon';

import { setTimeout } from './util/timers.js';
import { loadHtml } from './util/fixtures.js';

// Use minimal browser package, with no optional components added.
import Rollbar from '../src/browser/core.js';

describe('options.captureUncaught', function () {
  let __originalOnError = null;

  before(function () {
    // Prevent WTR/Mocha from failing the test on uncaught errors.
    __originalOnError = window.onerror;
    window.onerror = () => false;
  });

  after(function () {
    window.onerror = __originalOnError;
    __originalOnError = null;
  });

  beforeEach(async function () {
    // Load the HTML page, so errors can be generated.
    await loadHtml('test/fixtures/html/error.html');

    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should capture when enabled in constructor', async function () {
    const server = window.server;
    expect(server).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    const options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    const rollbar = (window.rollbar = new Rollbar(options));

    const element = document.getElementById('throw-error');
    expect(element).to.exist;
    element.click();

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.notifier.diagnostic.raw_error.message).to.eql(
      'test error',
    );
    expect(body.data.notifier.diagnostic.is_uncaught).to.be.true;

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should respond to enable/disable in configure', async function () {
    const server = window.server;
    const element = document.getElementById('throw-error');
    expect(server).to.exist;
    expect(element).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: false,
    }));

    element.click();

    await setTimeout(1);

    server.respond();
    expect(server.requests.length).to.eql(0); // Disabled, no event
    server.requests.length = 0;

    rollbar.configure({
      captureUncaught: true,
    });

    element.click();

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.notifier.diagnostic.is_anonymous).to.be.undefined;

    server.requests.length = 0;

    rollbar.configure({
      captureUncaught: false,
    });

    element.click();

    await setTimeout(1);

    server.respond();
    expect(server.requests.length).to.eql(0); // Disabled, no event
  });

  // Test case expects Chrome, which is the currently configured karma js/browser
  // engine at the time of this comment. However, karma's Chrome and ChromeHeadless
  // don't actually behave like real Chrome so we settle for stubbing some things.
  it('should capture external error data when inspectAnonymousErrors is true', async function () {
    const server = window.server;
    expect(server).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    // We're supposedly running on ChromeHeadless, but still need to spoof Chrome. :\
    window.chrome = { runtime: true };

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      inspectAnonymousErrors: true,
    }));

    // Simulate receiving onerror without an error object.
    rollbar.anonymousErrorsPending += 1;

    try {
      throw new Error('anon error');
    } catch (e) {
      Error.prepareStackTrace(e);
    }

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('anon error');
    expect(body.data.notifier.diagnostic.is_anonymous).to.eql(true);

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should ignore duplicate errors by default', async function () {
    const server = window.server;
    expect(server).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    }));

    const element = document.getElementById('throw-error');
    expect(element).to.exist;

    // generate same error twice
    for (let i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    await setTimeout(1);

    server.respond();

    // transmit only once
    expect(server.requests.length).to.eql(1);

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should transmit duplicate errors when set in config', async function () {
    const server = window.server;
    expect(server).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    const options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      ignoreDuplicateErrors: false,
    };
    const rollbar = (window.rollbar = new Rollbar(options));

    const element = document.getElementById('throw-error');
    expect(element).to.exist;

    // generate same error twice
    for (let i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    await setTimeout(1);

    server.respond();

    // transmit both errors
    expect(server.requests.length).to.eql(2);

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should send DOMException as trace_chain', async function () {
    const server = window.server;
    expect(server).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    }));

    const element = document.getElementById('throw-dom-exception');
    expect(element).to.exist;
    element.click();

    await setTimeout(1);
    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace_chain[0].exception.message).to.eql(
      'test DOMException',
    );

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should capture exta frames when stackTraceLimit is set', async function () {
    const server = window.server;
    expect(server).to.exist;

    stubResponse(server);
    server.requests.length = 0;

    const oldLimit = Error.stackTraceLimit;
    const rollbar = (window.rollbar = new Rollbar({
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      stackTraceLimit: 50,
    }));

    const element = document.getElementById('throw-depp-stack-error');
    expect(element).to.exist;
    element.click();

    await setTimeout(1);

    server.respond();

    const body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('deep stack error');
    expect(body.data.body.trace.frames.length).to.be.above(20);

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
      stackTraceLimit: oldLimit, // reset to default
    });
  });

  describe('options.captureUnhandledRejections', function () {
    beforeEach(function () {
      window.server = sinon.createFakeServer();
    });

    afterEach(function () {
      window.rollbar.configure({ autoInstrument: false });
      window.server.restore();
    });

    function stubResponse(server) {
      server.respondWith('POST', 'api/1/item', [
        200,
        { 'Content-Type': 'application/json' },
        '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
      ]);
    }

    it('should capture when enabled in constructor', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        captureUnhandledRejections: true,
      }));

      Promise.reject(new Error('test reject'));

      await setTimeout(500);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test reject');
      expect(body.data.notifier.diagnostic.is_uncaught).to.be.true;

      rollbar.configure({
        captureUnhandledRejections: false,
      });
      window.removeEventListener('unhandledrejection', window._rollbarURH);
    });

    it('should respond to enable in configure', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        captureUnhandledRejections: false,
      }));

      rollbar.configure({
        captureUnhandledRejections: true,
      });

      Promise.reject(new Error('test reject'));

      await setTimeout(500);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test reject');

      server.requests.length = 0;

      rollbar.configure({
        captureUnhandledRejections: false,
      });
      window.removeEventListener('unhandledrejection', window._rollbarURH);
    });

    it('should respond to disable in configure', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        captureUnhandledRejections: true,
      }));

      rollbar.configure({
        captureUnhandledRejections: false,
      });

      Promise.reject(new Error('test reject'));

      await setTimeout(500);

      server.respond();

      expect(server.requests.length).to.eql(0); // Disabled, no event
      server.requests.length = 0;

      window.removeEventListener('unhandledrejection', window._rollbarURH);
    });
  });

  describe('log', function () {
    beforeEach(function (done) {
      window.server = sinon.createFakeServer();
      done();
    });

    afterEach(function () {
      window.rollbar.configure({ autoInstrument: false });
      window.server.restore();
    });

    function stubResponse(server) {
      server.respondWith('POST', 'api/1/item', [
        200,
        { 'Content-Type': 'application/json' },
        '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
      ]);
    }

    it('should send message when called with message and extra args', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
      }));

      rollbar.log('test message', { foo: 'bar' });

      await setTimeout(1);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.message.body).to.eql('test message');
      expect(body.data.body.message.extra).to.eql({ foo: 'bar' });
      expect(body.data.notifier.diagnostic.is_uncaught).to.be.undefined;
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql([
        'string',
        'object',
      ]);
    });

    it('should send exception when called with error and extra args', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
      }));

      rollbar.log(new Error('test error'), { foo: 'bar' });

      await setTimeout(1);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.body.trace.extra).to.eql({ foo: 'bar' });
      expect(body.data.notifier.diagnostic.is_uncaught).to.be.undefined;
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql([
        'error',
        'object',
      ]);
    });

    it('should add custom data when called with error context', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        addErrorContext: true,
      }));

      const err = new Error('test error');
      err.rollbarContext = { err: 'test' };

      rollbar.error(err, { foo: 'bar' });

      await setTimeout(1);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.custom.foo).to.eql('bar');
      expect(body.data.custom.err).to.eql('test');
    });

    it('should remove circular references in custom data', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        addErrorContext: true,
      }));

      const err = new Error('test error');
      const contextData = { extra: 'baz' };
      contextData.data = contextData;
      const context = { err: 'test', contextData: contextData };
      err.rollbarContext = context;

      const array = ['one', 'two'];
      array.push(array);
      expect(array).to.be.an('array').that.has.nested.include(array);

      const custom = { foo: 'bar', array: array };
      const notCircular = { key: 'value' };
      custom.notCircular1 = notCircular;
      custom.notCircular2 = notCircular;
      custom.self = custom;
      rollbar.error(err, custom);

      await setTimeout(1);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql('test error');
      expect(body.data.custom.foo).to.eql('bar');
      expect(body.data.custom.err).to.eql('test');

      // Duplicate objects are allowed when there is no circular reference.
      expect(body.data.custom.notCircular1).to.eql(notCircular);
      expect(body.data.custom.notCircular2).to.eql(notCircular);

      expect(body.data.custom.self).to.eql(
        'Removed circular reference: object',
      );
      expect(body.data.custom.array).to.be.an('object').that.deep.equals({
        0: 'one',
        1: 'two',
        2: 'Removed circular reference: array',
      });
      expect(body.data.custom.contextData).to.eql({
        extra: 'baz',
        data: 'Removed circular reference: object',
      });
    });

    it('should send message when called with only null arguments', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        captureUnhandledRejections: true,
      }));

      rollbar.log(null);

      await setTimeout(1);

      server.respond();

      const body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.message.body).to.eql(
        'Item sent with null or missing arguments.',
      );
      expect(body.data.notifier.diagnostic.original_arg_types).to.eql(['null']);
    });

    it('should skipFrames when set', async function () {
      const server = window.server;
      expect(server).to.exist;

      stubResponse(server);
      server.requests.length = 0;

      const rollbar = (window.rollbar = new Rollbar({
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        captureUnhandledRejections: true,
      }));

      const error = new Error('error with stack');

      rollbar.log(error);
      rollbar.log(error, { skipFrames: 1 });

      await setTimeout(1);

      server.respond();

      const reqs = server.requests;
      const frames1 = JSON.parse(reqs[0].requestBody).data.body.trace.frames;
      const frames2 = JSON.parse(reqs[1].requestBody).data.body.trace.frames;

      expect(frames1.length).to.eql(frames2.length + 1);
      expect(frames1.slice(0, -1)).to.eql(frames2);
    });
  });
});
