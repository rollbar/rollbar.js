import { expect } from 'chai';
import sinon from 'sinon';

import { setTimeout } from './util/timers.js';
import { loadHtml } from './util/fixtures.js';

import Rollbar from '../src/browser/rollbar.js';

const DUMMY_TRACE_ID = 'some-trace-id';
const DUMMY_SPAN_ID = 'some-span-id';

const ValidOpenTracingTracerStub = {
  scope: () => ({
    active: () => ({
      setTag: () => {},
      context: () => ({
        toTraceId: () => DUMMY_TRACE_ID,
        toSpanId: () => DUMMY_SPAN_ID,
      }),
    }),
  }),
};

const InvalidOpenTracingTracerStub = {
  foo: () => {},
};

function TestClientGen() {
  var TestClient = function () {
    this.transforms = [];
    this.predicates = [];
    this.notifier = {
      addTransform: function (t) {
        this.transforms.push(t);
        return this.notifier;
      }.bind(this),
    };
    this.queue = {
      addPredicate: function (p) {
        this.predicates.push(p);
        return this.queue;
      }.bind(this),
    };
    this.logCalls = [];
    var logs = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i = 0, len = logs.length; i < len; i++) {
      var fn = logs[i].slice(0);
      this[fn] = function (fn, item) {
        this.logCalls.push({ func: fn, item: item });
      }.bind(this, fn);
    }
    this.options = {};
    this.payloadData = {};
    this.configure = function (o, payloadData) {
      this.options = o;
      this.payloadData = payloadData;
    };
    this.tracer = ValidOpenTracingTracerStub;
  };

  return TestClient;
}

describe('Rollbar()', function () {
  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
  });

  it('should have all of the expected methods with a real client', function () {
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options));

    expect(rollbar).to.have.property('log');
    expect(rollbar).to.have.property('debug');
    expect(rollbar).to.have.property('info');
    expect(rollbar).to.have.property('warn');
    expect(rollbar).to.have.property('warning');
    expect(rollbar).to.have.property('error');
    expect(rollbar).to.have.property('critical');
  });

  it('should have all of the expected methods', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    expect(rollbar).to.have.property('log');
    expect(rollbar).to.have.property('debug');
    expect(rollbar).to.have.property('info');
    expect(rollbar).to.have.property('warn');
    expect(rollbar).to.have.property('warning');
    expect(rollbar).to.have.property('error');
    expect(rollbar).to.have.property('critical');
  });

  it('should have some default options', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    expect(rollbar.options.scrubFields).to.contain('password');
  });

  it('should merge with the defaults options', function () {
    var client = new (TestClientGen())();
    var options = {
      scrubFields: ['foobar'],
      recorder: {
        enabled: true,
      },
      tracing: {
        endpoint: 'api.rollbar.com/api/1/tracing/',
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));

    expect(rollbar.options.scrubFields).to.contain('foobar');
    expect(rollbar.options.scrubFields).to.contain('password');
    expect(rollbar.options.recorder.enabled).to.eql(true);
    expect(rollbar.options.recorder.triggers[0].level).to.eql([
      'error',
      'critical',
    ]);
    expect(rollbar.options.tracing.endpoint).to.eql(
      'api.rollbar.com/api/1/tracing/',
    );
    expect(rollbar.options.tracing.enabled).to.eql(false);
  });

  it('should overwrite default if specified', function () {
    var client = new (TestClientGen())();
    var options = {
      scrubFields: ['foobar'],
      overwriteScrubFields: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));

    expect(rollbar.options.scrubFields).to.contain('foobar');
    expect(rollbar.options.scrubFields).to.not.contain('password');
  });

  it('should replace deprecated options', function () {
    var client = new (TestClientGen())();
    var options = {
      hostWhiteList: ['foo'],
      hostBlackList: ['bar'],
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));

    expect(rollbar.options.hostWhiteList).to.eql(undefined);
    expect(rollbar.options.hostBlackList).to.eql(undefined);
    expect(rollbar.options.hostSafeList).to.contain('foo');
    expect(rollbar.options.hostBlockList).to.contain('bar');
  });

  it('should return a uuid when logging', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var result = rollbar.log('a messasge', 'another one');
    expect(result.uuid).to.be.ok;
  });

  it('should package up the inputs', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var result = rollbar.log('a message', 'another one');
    var loggedItem = client.logCalls[0].item;
    expect(loggedItem.message).to.eql('a message');
    expect(loggedItem.custom).to.be.ok;
  });

  it('should call the client with the right method', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var methods = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i = 0; i < methods.length; i++) {
      var msg = 'message:' + i;
      rollbar[methods[i]](msg);
      expect(client.logCalls[i].func).to.eql(methods[i]);
      expect(client.logCalls[i].item.message).to.eql(msg);
    }
  });

  // Legacy OpenTracing support
  it('should have a tracer if valid tracer is provided', function () {
    var options = { tracer: ValidOpenTracingTracerStub };
    var rollbar = (window.rollbar = new Rollbar(options));

    expect(rollbar.client.tracer).to.eql(ValidOpenTracingTracerStub);
  });

  // Legacy OpenTracing support
  it('should not have a tracer if invalid tracer is provided', function () {
    var options = { tracer: InvalidOpenTracingTracerStub };
    var rollbar = (window.rollbar = new Rollbar(options));

    expect(rollbar.client.tracer).to.eql(null);
  });
});

describe('configure', function () {
  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
  });

  it('should configure client', function () {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({ payload: { environment: 'borkbork' } });
    expect(rollbar.options.payload.environment).to.eql('borkbork');
    expect(client.options.payload.environment).to.eql('borkbork');
  });
  it('should accept a second parameter and use it as the payload value', function () {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({ somekey: 'borkbork' }, { b: 97 });
    expect(rollbar.options.somekey).to.eql('borkbork');
    expect(rollbar.options.payload.b).to.eql(97);
    expect(client.payloadData.b).to.eql(97);
  });
  it('should accept a second parameter and override the payload with it', function () {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({ somekey: 'borkbork', payload: { b: 101 } }, { b: 97 });
    expect(rollbar.options.somekey).to.eql('borkbork');
    expect(rollbar.options.payload.b).to.eql(97);
    expect(client.payloadData.b).to.eql(97);
  });
  it('should replace deprecated options', function () {
    var client = new (TestClientGen())();
    var options = {
      hostWhiteList: ['foo'],
      hostBlackList: ['bar'],
    };
    var rollbar = (window.rollbar = new Rollbar(
      { autoInstrument: false },
      client,
    ));
    rollbar.configure(options);

    expect(rollbar.options.hostWhiteList).to.eql(undefined);
    expect(rollbar.options.hostBlackList).to.eql(undefined);
    expect(rollbar.options.hostSafeList).to.contain('foo');
    expect(rollbar.options.hostBlockList).to.contain('bar');
  });
  it('should store configured options', function () {
    var client = new (TestClientGen())();
    var options = {
      captureUncaught: true,
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options, client));
    expect(rollbar.options._configuredOptions.payload.environment).to.eql(
      'testtest',
    );
    expect(rollbar.options._configuredOptions.captureUncaught).to.eql(true);

    rollbar.configure({
      captureUncaught: false,
      payload: { environment: 'borkbork' },
    });
    expect(rollbar.options._configuredOptions.payload.environment).to.eql(
      'borkbork',
    );
    expect(rollbar.options._configuredOptions.captureUncaught).to.eql(false);
  });
});

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
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
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
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-error');
    element.click();

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.notifier.diagnostic.raw_error.message).to.eql(
      'test error',
    );
    expect(body.data.notifier.diagnostic.is_uncaught).to.eql(true);

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should respond to enable/disable in configure', async function () {
    var server = window.server;
    var element = document.getElementById('throw-error');
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: false,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

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

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.notifier.diagnostic.is_anonymous).to.not.be.ok;

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
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    // We're supposedly running on ChromeHeadless, but still need to spoof Chrome. :\
    window.chrome = { runtime: true };

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      inspectAnonymousErrors: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    // Simulate receiving onerror without an error object.
    rollbar.anonymousErrorsPending += 1;

    try {
      throw new Error('anon error');
    } catch (e) {
      Error.prepareStackTrace(e);
    }

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

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
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-error');

    // generate same error twice
    for (var i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    await setTimeout(1);

    server.respond();

    // transmit only once
    expect(server.requests.length).to.eql(1);

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });

  it('should transmit duplicate errors when set in config', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      ignoreDuplicateErrors: false,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-error');

    // generate same error twice
    for (var i = 0; i < 2; i++) {
      element.click(); // use for loop to ensure the stack traces have identical line/col info
    }

    await setTimeout(1);

    server.respond();

    // transmit both errors
    expect(server.requests.length).to.eql(2);

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
    });
  });
  it('should send DOMException as trace_chain', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-dom-exception');
    element.click();

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

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
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var oldLimit = Error.stackTraceLimit;
    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      stackTraceLimit: 50,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-depp-stack-error');
    element.click();

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

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

  it('should add _wrappedSource when wrapGlobalEventHandlers is set', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      wrapGlobalEventHandlers: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var element = document.getElementById('throw-event-handler-error');
    element.click();

    await setTimeout(100);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql(
      'event handler error',
    );
    expect(body.data.body.trace.extra).to.have.property('_wrappedSource');

    // karma doesn't unload the browser between tests, so the onerror handler
    // will remain installed. Unset captureUncaught so the onerror handler
    // won't affect other tests.
    rollbar.configure({
      captureUncaught: false,
      wrapGlobalEventHandlers: false,
    });
  });
});

describe('options.captureUnhandledRejections', function () {
  beforeEach(function () {
    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
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
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    Promise.reject(new Error('test reject'));

    await setTimeout(500);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test reject');
    expect(body.data.notifier.diagnostic.is_uncaught).to.eql(true);

    rollbar.configure({
      captureUnhandledRejections: false,
    });
    window.removeEventListener('unhandledrejection', window._rollbarURH);
  });

  it('should respond to enable in configure', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: false,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.configure({
      captureUnhandledRejections: true,
    });

    Promise.reject(new Error('test reject'));

    await setTimeout(500);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test reject');

    server.requests.length = 0;

    rollbar.configure({
      captureUnhandledRejections: false,
    });
    window.removeEventListener('unhandledrejection', window._rollbarURH);
  });

  it('should respond to disable in configure', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

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
  beforeEach(function () {
    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
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
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test message', { foo: 'bar' });

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.message.body).to.eql('test message');
    expect(body.data.body.message.extra).to.eql({ foo: 'bar' });
    expect(body.data.notifier.diagnostic.is_uncaught).to.eql(undefined);
    expect(body.data.notifier.diagnostic.original_arg_types).to.eql([
      'string',
      'object',
    ]);
  });

  it('should send exception when called with error and extra args', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log(new Error('test error'), { foo: 'bar' });

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.body.trace.extra).to.eql({ foo: 'bar' });
    expect(body.data.notifier.diagnostic.is_uncaught).to.eql(undefined);
    expect(body.data.notifier.diagnostic.original_arg_types).to.eql([
      'error',
      'object',
    ]);
  });

  it('should add custom data when called with error context', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      addErrorContext: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var err = new Error('test error');
    err.rollbarContext = { err: 'test' };

    rollbar.error(err, { foo: 'bar' });

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.custom.foo).to.eql('bar');
    expect(body.data.custom.err).to.eql('test');
  });

  it('should add tracing attributes when called in an active span', async function () {
    const server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    const options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      recorder: {
        enabled: true,
      },
    };
    const rollbar = (window.rollbar = new Rollbar(options));

    const err = new Error('test error');

    rollbar.tracing.withSpan('test', {}, () => {
      rollbar.error(err);
    });

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql('test error');
    expect(body.data.attributes).to.be.an('array');
    expect(body.data.attributes.length).to.eql(4);
    expect(body.data.attributes[0].key).to.eql('replay_id');
    expect(body.data.attributes[0].value).to.match(/^[a-f0-9]{16}$/);
    expect(body.data.attributes[1].key).to.eql('session_id');
    expect(body.data.attributes[1].value).to.match(/^[a-f0-9]{32}$/);
    expect(body.data.attributes[2].key).to.eql('span_id');
    expect(body.data.attributes[2].value).to.match(/^[a-f0-9]{16}$/);
    expect(body.data.attributes[3].key).to.eql('trace_id');
    expect(body.data.attributes[3].value).to.match(/^[a-f0-9]{32}$/);
  });

  it('should send message when called with only null arguments', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log(null);

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.message.body).to.eql(
      'Item sent with null or missing arguments.',
    );
    expect(body.data.notifier.diagnostic.original_arg_types).to.eql(['null']);
  });

  it('should skipFrames when set', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUnhandledRejections: true,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var error = new Error('error with stack');

    rollbar.log(error);
    rollbar.log(error, { skipFrames: 1 });

    await setTimeout(1);

    server.respond();

    var frames1 = JSON.parse(server.requests[0].requestBody).data.body.trace
      .frames;
    var frames2 = JSON.parse(server.requests[1].requestBody).data.body.trace
      .frames;

    expect(frames1.length).to.eql(frames2.length + 1);
    expect(frames1.slice(0, -1)).to.eql(frames2);
  });

  it('should call the item callback on error', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    // Create an invalid tracer, in order to force an error in notifier._log()
    var tracer = {
      scope: function () {
        return {
          active: function () {
            throw new Error('Test error');
          },
        };
      },
    };

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      tracer: tracer,
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var callbackCalled;
    var callback = function (err) {
      callbackCalled = err;
    };

    rollbar.log('test', callback);

    await setTimeout(1);

    server.respond();

    expect(callbackCalled.message).to.eql('Test error');
  });
});

// Test direct call to onerror, as used in verification of browser js install.
describe('onerror', function () {
  beforeEach(function () {
    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should send message when calling onerror directly', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
    };
    window.rollbar = new Rollbar(options);

    window.onerror(
      'TestRollbarError: testing window.onerror',
      window.location.href,
    );

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.trace.exception.message).to.eql(
      'testing window.onerror',
    );
  });
});

describe('callback options', function () {
  beforeEach(function () {
    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should use checkIgnore when set', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      checkIgnore: function (_isUncaught, _args, _payload) {
        return true;
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test'); // generate a payload to ignore

    await setTimeout(1);

    server.respond();

    expect(server.requests.length).to.eql(0);
  });

  it('should receive valid arguments at checkIgnore', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      checkIgnore: function (_isUncaught, args, payload) {
        if (_isUncaught === false && args[0] instanceof Error && payload.uuid) {
          return true;
        }
        return false;
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log(new Error('test'));

    await setTimeout(1);

    server.respond();

    // Should be ignored if all checks pass.
    expect(server.requests.length).to.eql(0);
  });

  it('should receive uncaught at checkIgnore', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      captureUncaught: true,
      checkIgnore: function (isUncaught, args, payload) {
        if (isUncaught === true) {
          return true;
        }
        return false;
      },
    };
    window.rollbar = new Rollbar(options);

    var element = document.getElementById('throw-error');
    element.click();

    await setTimeout(1);

    server.respond();

    // Should be ignored if checkIgnore receives isUncaught.
    expect(server.requests.length).to.eql(0);
  });

  it('should send when checkIgnore returns false', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      checkIgnore: function (_isUncaught, _args, _payload) {
        return false;
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    expect(server.requests.length).to.eql(1);
    var body = JSON.parse(server.requests[0].requestBody);
    expect(
      body.data.notifier.configured_options.checkIgnore.substr(0, 8),
    ).to.eql('function');
  });

  it('should use onSendCallback when set', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      onSendCallback: function (_isUncaught, _args, payload) {
        payload.foo = 'bar';
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    expect(server.requests.length).to.eql(1);
    var body = JSON.parse(server.requests[0].requestBody);
    expect(body.data.foo).to.eql('bar');
    expect(
      body.data.notifier.configured_options.onSendCallback.substr(0, 8),
    ).to.eql('function');
  });

  it('should use transform when set', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      transform: function (data, _item) {
        data.foo = 'baz';
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    expect(server.requests.length).to.eql(1);
    var body = JSON.parse(server.requests[0].requestBody);
    expect(body.data.foo).to.eql('baz');
    expect(body.data.notifier.configured_options.transform.substr(0, 8)).to.eql(
      'function',
    );
  });
});

describe('options.autoInstrument', function () {
  beforeEach(function () {
    window.server = sinon.createFakeServer();
  });

  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  describe('options.autoInstrument.contentSecurityPolicy', function () {
    beforeEach(function () {
      var options = {
        accessToken: 'POST_CLIENT_ITEM_TOKEN',
        autoInstrument: {
          log: false,
          contentSecurityPolicy: true,
          errorOnContentSecurityPolicy: true,
        },
      };
      window.rollbar = new Rollbar(options);
    });

    afterEach(function () {
      window.rollbar.configure({
        autoInstrument: false,
        captureUncaught: false,
      });
    });

    it('should report content security policy errors', async function () {
      var queue = rollbar.client.notifier.queue;
      var queueStub = sinon.stub(queue, '_makeApiRequest');

      // Load the HTML page, so errors can be generated.
      await loadHtml('test/fixtures/html/csp-errors.html');

      await setTimeout(100);

      var item = queueStub.getCall(0).args[0];
      var message = item.body.message.body;
      var telemetry = item.body.telemetry[0];

      expect(message).to.match(/Security Policy Violation/);
      expect(message).to.match(/blockedURI: https:\/\/example.com\/v3\//);
      expect(message).to.match(/violatedDirective: script-src/);
      expect(message).to.match(
        /originalPolicy: default-src 'self' 'unsafe-inline' 'unsafe-eval';/,
      );

      expect(telemetry.level).to.eql('error');
      expect(telemetry.type).to.eql('log');
      expect(telemetry.body.message).to.match(/Security Policy Violation/);
      expect(telemetry.body.message).to.match(
        /blockedURI: https:\/\/example.com\/v3\//,
      );
      expect(telemetry.body.message).to.match(/violatedDirective: script-src/);
      expect(telemetry.body.message).to.match(
        /originalPolicy: default-src 'self' 'unsafe-inline' 'unsafe-eval';/,
      );
    });
  });

  it('should add telemetry events when console.log is called', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    console.log('console test'); // generate a telemetry event

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.data.body.telemetry[0].body.message).to.eql('console test');
  });

  function initRollbarForNetworkTelemetry() {
    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkResponseHeaders: true,
        networkResponseBody: true,
        networkRequestBody: true,
        networkRequestHeaders: true,
      },
    };
    return new Rollbar(options);
  }

  it('should add telemetry events for POST xhr calls', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('POST', 'https://example.com/xhr-test', [
      200,
      { 'Content-Type': 'application/json', Password: '123456' },
      JSON.stringify({ name: 'foo', password: '123456' }),
    ]);

    var rollbar = (window.rollbar = initRollbarForNetworkTelemetry());

    // generate a telemetry event
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Secret', 'abcdef');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        try {
          rollbar.log('test'); // generate a payload to inspect

          await setTimeout(1);

          server.respond();

          expect(server.requests.length).to.eql(2);
          var body = JSON.parse(server.requests[1].requestBody);

          // Verify request capture and scrubbing
          expect(body.data.body.telemetry[0].body.request).to.eql(
            '{"name":"bar","secret":"********"}',
          );

          // Verify request headers capture and case-insensitive scrubbing
          expect(body.data.body.telemetry[0].body.request_headers).to.eql({
            'Content-type': 'application/json',
            Secret: '********',
          });

          // Verify response capture and scrubbing
          expect(body.data.body.telemetry[0].body.response.body).to.eql(
            '{"name":"foo","password":"********"}',
          );
          expect(
            body.data.body.telemetry[0].body.response.headers['Password'],
          ).to.eql('********');
        } catch (e) {
          done(e);
        }
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    server.respond();
  });

  it('should add telemetry events for GET xhr calls', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('GET', 'https://example.com/xhr-test', [
      200,
      { 'Content-Type': 'application/json', Password: 'abcdef' },
      JSON.stringify({ name: 'foo', password: '123456' }),
    ]);

    var rollbar = (window.rollbar = initRollbarForNetworkTelemetry());

    // generate a telemetry event
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Secret', 'abcdef');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        try {
          rollbar.log('test'); // generate a payload to inspect

          await setTimeout(1);

          server.respond();

          expect(server.requests.length).to.eql(2);
          var body = JSON.parse(server.requests[1].requestBody);

          // Verify request headers capture and case-insensitive scrubbing
          expect(body.data.body.telemetry[0].body.request_headers).to.eql({
            Secret: '********',
          });

          // Verify response capture and scrubbing
          expect(body.data.body.telemetry[0].body.response.body).to.eql(
            '{"name":"foo","password":"********"}',
          );
          expect(
            body.data.body.telemetry[0].body.response.headers['Password'],
          ).to.eql('********');
        } catch (e) {
          done(e);
        }
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    server.respond();
  });

  it('should handle non-string Content-Type', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('GET', 'https://example.com/xhr-test', [
      200,
      {
        'Content-Type': {}, // unexpected/invalid (non-string) content type
        Password: 'abcdef',
      },
      JSON.stringify({ name: 'foo', password: '123456' }),
    ]);

    var rollbar = (window.rollbar = initRollbarForNetworkTelemetry());

    // generate a telemetry event
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Secret', 'abcdef');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        try {
          rollbar.log('test'); // generate a payload to inspect

          await setTimeout(1);

          server.respond();

          expect(server.requests.length).to.eql(2);
          var body = JSON.parse(server.requests[1].requestBody);

          // Verify request headers capture and case-insensitive scrubbing
          expect(body.data.body.telemetry[0].body.request_headers).to.eql({
            Secret: '********',
          });

          // Not scrubbed for unrecognized content type
          expect(body.data.body.telemetry[0].body.response.body).to.eql(
            '{"name":"foo","password":"123456"}',
          );

          expect(
            body.data.body.telemetry[0].body.response.headers['Password'],
          ).to.eql('********');
        } catch (e) {
          done(e);
        }
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    server.respond();
  });

  it('should send errors for xhr http errors', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    server.respondWith('POST', 'xhr-test', [
      404,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ foo: 'bar' }),
    ]);

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkErrorOnHttp4xx: true,
      },
    };
    window.rollbar = new Rollbar(options);

    // generate a telemetry event
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://example.com/xhr-test', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = async function () {
      if (xhr.readyState === 4) {
        try {
          await setTimeout(1);

          server.respond();

          expect(server.requests.length).to.eql(2);
          var body = JSON.parse(server.requests[1].requestBody);

          expect(body.data.body.trace.exception.message).to.eql(
            'HTTP request failed with Status 404',
          );

          // Just knowing a stack is present is enough for this test.
          expect(body.data.body.trace.frames.length).to.be.above(1);
        } catch (e) {
          done(e);
        }
      }
    };
    xhr.send(JSON.stringify({ name: 'bar', secret: 'xhr post' }));
    await setTimeout(1);

    server.respond();
  });

  it('should add telemetry events for fetch calls', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    window.fetchStub = sinon.stub(window, 'fetch');

    var responseBody = JSON.stringify({ name: 'foo', password: '123456' });
    window.fetch.returns(
      Promise.resolve(
        new Response(responseBody, {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json', password: '123456' },
        }),
      ),
    );

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkResponseHeaders: true,
        networkResponseBody: true,
        networkRequestBody: true,
        networkRequestHeaders: true,
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    var fetchHeaders = new Headers();
    fetchHeaders.append('Content-Type', 'application/json');
    fetchHeaders.append('Secret', '123456');

    const fetchInit = {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({ name: 'bar', secret: 'fetch post' }),
    };
    var fetchRequest = new Request('https://example.com/fetch-test');
    window
      .fetch(fetchRequest, fetchInit)
      .then(function (response) {
        // Assert that the original stream reader hasn't been read.
        expect(response.bodyUsed).to.eql(false);
        return response.text();
      })
      .then(async function (text) {
        expect(text).to.eql(responseBody);

        rollbar.log('test'); // generate a payload to inspect

        await setTimeout(1);

        server.respond();

        expect(window.fetchStub.called).to.be.ok;
        expect(server.requests.length).to.eql(1);
        var body = JSON.parse(server.requests[0].requestBody);

        // Verify request capture and scrubbing
        expect(body.data.body.telemetry[0].body.request).to.eql(
          '{"name":"bar","secret":"********"}',
        );

        // Verify request headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.request_headers).to.eql({
          'content-type': 'application/json',
          secret: '********',
        });

        // Verify response capture and scrubbing
        expect(body.data.body.telemetry[0].body.response.body).to.eql(
          '{"name":"foo","password":"********"}',
        );

        // Verify response headers capture and case-insensitive scrubbing
        expect(body.data.body.telemetry[0].body.response.headers).to.eql({
          'content-type': 'application/json',
          password: '********',
        });

        rollbar.configure({ autoInstrument: false });
        window.fetch.restore();
      });
  });

  it('should report error for http 4xx fetch calls, when enabled', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    window.fetchStub = sinon.stub(window, 'fetch');
    window.fetch.returns(
      Promise.resolve(
        new Response(JSON.stringify({ foo: 'bar' }), {
          status: 404,
          statusText: 'Not Found',
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkErrorOnHttp4xx: true,
      },
    };
    window.rollbar = new Rollbar(options);

    var fetchHeaders = new Headers();
    fetchHeaders.append('Content-Type', 'application/json');

    const fetchInit = {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({ foo: 'bar' }),
    };
    var fetchRequest = new Request('https://example.com/xhr-test');
    window.fetch(fetchRequest, fetchInit).then(async function (_response) {
      await setTimeout(1);

      server.respond();

      expect(server.requests.length).to.eql(1);
      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.data.body.trace.exception.message).to.eql(
        'HTTP request failed with Status 404',
      );

      // Just knowing a stack is present is enough for this test.
      expect(body.data.body.trace.frames.length).to.be.above(1);

      rollbar.configure({ autoInstrument: false });
      window.fetch.restore();
    });
  });

  it('should add telemetry headers when fetch Headers object is undefined', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    window.fetchStub = sinon.stub(window, 'fetch');

    var readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(JSON.stringify({ name: 'foo', password: '123456' }));
        controller.close();
      },
    });

    window.fetch.returns(
      Promise.resolve(
        new Response(readableStream, {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json', password: '123456' },
        }),
      ),
    );

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      autoInstrument: {
        log: false,
        network: true,
        networkResponseHeaders: true,
        networkRequestHeaders: true,
      },
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    // Remove Headers from window object
    var originalHeaders = window.Headers;
    delete window.Headers;

    const fetchInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Secret: '123456' },
      body: JSON.stringify({ name: 'bar', secret: 'xhr post' }),
    };
    var fetchRequest = new Request('https://example.com/xhr-test');
    window.fetch(fetchRequest, fetchInit).then(async function (response) {
      rollbar.log('test'); // generate a payload to inspect

      await setTimeout(1);

      server.respond();

      expect(server.requests.length).to.eql(1);
      var body = JSON.parse(server.requests[0].requestBody);

      // Verify request headers capture and case-insensitive scrubbing
      expect(body.data.body.telemetry[0].body.request_headers).to.eql({
        'content-type': 'application/json',
        secret: '********',
      });

      // Verify response headers capture and case-insensitive scrubbing
      expect(body.data.body.telemetry[0].body.response.headers).to.eql({
        'content-type': 'application/json',
        password: '********',
      });

      // Assert that the original stream reader hasn't been read.
      expect(response.bodyUsed).to.eql(false);

      rollbar.configure({ autoInstrument: false });
      window.fetch.restore();
      window.Headers = originalHeaders;
    });
  });

  it('should add a diagnostic message when wrapConsole fails', async function () {
    var server = window.server;
    stubResponse(server);
    server.requests.length = 0;

    var oldConsole = window.console;
    var newConsole = {};
    Object.defineProperty(newConsole, 'log', {
      get: function () {
        return function (message) {
          oldConsole.log(message);
          return message;
        };
      },
    });
    window.console = newConsole;

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
    };
    var rollbar = (window.rollbar = new Rollbar(options));

    rollbar.log('test'); // generate a payload to inspect

    await setTimeout(1);

    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    window.console = oldConsole;

    expect(
      rollbar.client.notifier.diagnostic.instrumentConsole,
    ).to.have.property('error');
    expect(body.data.notifier.diagnostic.instrumentConsole).to.have.property(
      'error',
    );
  });
});

describe('captureEvent', function () {
  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
  });

  it('should handle missing/default type and level', function () {
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options));

    var event = rollbar.captureEvent({ foo: 'bar' });
    expect(event.type).to.eql('manual');
    expect(event.level).to.eql('info');
    expect(event.body.foo).to.eql('bar');
  });
  it('should handle specified type and level', function () {
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options));

    var event = rollbar.captureEvent('log', { foo: 'bar' }, 'debug');
    expect(event.type).to.eql('log');
    expect(event.level).to.eql('debug');
    expect(event.body.foo).to.eql('bar');
  });
  it('should handle extra args', function () {
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options));

    var event = rollbar.captureEvent(
      'meaningless',
      'info',
      { foo: 'bar' },
      23,
      'debug',
    );
    expect(event.type).to.eql('manual');
    expect(event.level).to.eql('info');
    expect(event.body.foo).to.eql('bar');
  });
  it('should handle level that matches a type string', function () {
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options));

    var event = rollbar.captureEvent('log', { foo: 'bar' }, 'error');
    // ensure level 'error' doesn't overwrite type 'log'
    expect(event.type).to.eql('log');
    expect(event.level).to.eql('error');
    expect(event.body.foo).to.eql('bar');
  });
});

describe('createItem', function () {
  afterEach(function () {
    window.rollbar.configure({ autoInstrument: false, captureUncaught: false });
  });

  it('should handle multiple strings', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = ['first', 'second'];
    var item = rollbar._createItem(args);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs['0']).to.eql('second');
  });
  it('should handle errors', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [new Error('Whoa'), 'first', 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs['0']).to.eql('second');
  });
  it('should handle a callback', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var myCallbackCalled = false;
    var myCallback = function () {
      myCallbackCalled = true;
    };
    var args = [new Error('Whoa'), 'first', myCallback, 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs)
      .to.be.an('object')
      .that.deep.equals({ 0: 'second' });
    expect(item.callback).to.be.ok;
    item.callback();
    expect(myCallbackCalled).to.be.ok;
  });
  it('should handle arrays', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [new Error('Whoa'), 'first', [1, 2, 3], 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom['0']).to.eql(1);
    expect(item.custom.extraArgs)
      .to.be.an('object')
      .that.deep.equals({ 0: 'second' });
  });
  it('should handle objects', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [new Error('Whoa'), 'first', { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.a).to.eql(1);
    expect(item.custom.b).to.eql(2);
    expect(item.custom.extraArgs)
      .to.be.an('object')
      .that.deep.equals({ 0: 'second' });
  });
  it('should handle custom arguments', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [
      new Error('Whoa'),
      { level: 'info', skipFrames: 1, foo: 'bar' },
    ];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.level).to.eql('info');
    expect(item.skipFrames).to.eql(1);
    expect(item.custom.foo).to.eql('bar');
    expect(item.custom.level).to.not.be.ok;
    expect(item.custom.skipFrames).to.not.be.ok;
  });
  it('should have a timestamp', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [new Error('Whoa'), 'first', { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    var now = new Date().getTime();
    expect(item.timestamp).to.be.within(now - 1000, now + 1000);
  });
  it('should have an uuid', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [new Error('Whoa'), 'first', { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.uuid).to.be.ok;

    var parts = item.uuid.split('-');
    expect(parts.length).to.eql(5);
    // Type 4 UUID
    expect(parts[2][0]).to.eql('4');
  });
  it('should handle dates', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var y2k = new Date(2000, 0, 1);
    var args = [new Error('Whoa'), 'first', y2k, { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.custom.extraArgs)
      .to.be.an('object')
      .that.deep.equals({ 0: y2k, 1: 'second' });
  });
  it('should handle numbers', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    var args = [new Error('Whoa'), 'first', 42, { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.custom.extraArgs)
      .to.be.an('object')
      .that.deep.equals({ 0: 42, 1: 'second' });
  });
  it('should handle domexceptions', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = (window.rollbar = new Rollbar(options, client));

    if (document && document.querySelectorAll) {
      var e;
      try {
        document.querySelectorAll('div:foo');
      } catch (ee) {
        e = ee;
      }
      var args = [e, 'first', 42, { a: 1, b: 2 }, 'second'];
      var item = rollbar._createItem(args);
      expect(item.err).to.be.ok;
    }
  });
});

describe('singleton', function () {
  it('should pass through the underlying client after init', function () {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = Rollbar.init(options, client);

    rollbar.log('hello 1');
    Rollbar.log('hello 2');

    var loggedItemDirect = client.logCalls[0].item;
    var loggedItemSingleton = client.logCalls[1].item;
    expect(loggedItemDirect.message).to.eql('hello 1');
    expect(loggedItemSingleton.message).to.eql('hello 2');
  });
});
