/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = require('../src/react-native/rollbar');
var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
}
var rollbar = new Rollbar(rollbarConfig);

describe('sendJsonPayload', function() {
  var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

  before(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    window.fetchStub = sinon.stub(window, 'fetch');
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

    var json = JSON.stringify({foo: 'baaar'});

    rollbar.sendJsonPayload(json);

    expect(window.fetchStub.called).to.be.ok();
    expect(window.fetchStub.getCall(0).args[1].body).to.eql(json);

    done();
  });
});

const DUMMY_TRACE_ID = 'some-trace-id';
const DUMMY_SPAN_ID = 'some-span-id';

const ValidOpenTracingTracerStub = {
  scope: () => {
    return {
      active: () => {
        return {
          setTag: () => { },
          context: () => {
            return {
              toTraceId: () => DUMMY_TRACE_ID,
              toSpanId: () => DUMMY_SPAN_ID
            }
          }
        }
      }
    }
  }
};

const InvalidOpenTracingTracerStub = {
  foo: () => { }
};

function TestClientGen() {
  var TestClient = function() {
    this.transforms = [];
    this.predicates = [];
    this.notifier = {
      addTransform: function(t) {
        this.transforms.push(t);
        return this.notifier;
      }.bind(this)
    };
    this.queue = {
      addPredicate: function(p) {
        this.predicates.push(p);
        return this.queue;
      }.bind(this)
    };
    this.logCalls = [];
    var logs = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i=0, len=logs.length; i < len; i++) {
      var fn = logs[i].slice(0);
      this[fn] = function(fn, item) {
        this.logCalls.push({func: fn, item: item})
      }.bind(this, fn)
    }
    this.options = {};
    this.payloadData = {};
    this.configure = function(o, payloadData) {
      this.options = o;
      this.payloadData = payloadData;
    };
  };

  return TestClient;
}

describe('Rollbar()', function() {
  it('should have all of the expected methods with a real client', function(done) {
    var options = {};
    var rollbar = new Rollbar(options);

    expect(rollbar).to.have.property('log');
    expect(rollbar).to.have.property('debug');
    expect(rollbar).to.have.property('info');
    expect(rollbar).to.have.property('warn');
    expect(rollbar).to.have.property('warning');
    expect(rollbar).to.have.property('error');
    expect(rollbar).to.have.property('critical');

    done();
  });

  it('should have all of the expected methods', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    expect(rollbar).to.have.property('log');
    expect(rollbar).to.have.property('debug');
    expect(rollbar).to.have.property('info');
    expect(rollbar).to.have.property('warn');
    expect(rollbar).to.have.property('warning');
    expect(rollbar).to.have.property('error');
    expect(rollbar).to.have.property('critical');

    done();
  });

  it ('should have some default options', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.scrubFields).to.contain('password');
    done();
  });

  it ('should merge with the defaults options', function(done) {
    var client = new (TestClientGen())();
    var options = {
      scrubFields: [
        'foobar'
      ]
    };
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.scrubFields).to.contain('foobar');
    expect(rollbar.options.scrubFields).to.contain('password');
    done();
  });

  it ('should overwrite default if specified', function(done) {
    var client = new (TestClientGen())();
    var options = {
      scrubFields: [
        'foobar'
      ],
      overwriteScrubFields: true,
    };
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.scrubFields).to.contain('foobar');
    expect(rollbar.options.scrubFields).to.not.contain('password');
    done();
  });

  it ('should replace deprecated options', function(done) {
    var client = new (TestClientGen())();
    var options = {
      hostWhiteList: ['foo'],
      hostBlackList: ['bar']
    };
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.hostWhiteList).to.eql(undefined);
    expect(rollbar.options.hostBlackList).to.eql(undefined);
    expect(rollbar.options.hostSafeList).to.contain('foo');
    expect(rollbar.options.hostBlockList).to.contain('bar');
    done();
  });

  it('should return a uuid when logging', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var result = rollbar.log('a messasge', 'another one');
    expect(result.uuid).to.be.ok();

    done();
  });

  it('should package up the inputs', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var result = rollbar.log('a message', 'another one');
    var loggedItem = client.logCalls[0].item;
    expect(loggedItem.message).to.eql('a message');
    expect(loggedItem.custom).to.be.ok();

    done();
  });

  it('should call the client with the right method', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var methods = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i=0; i < methods.length; i++) {
      var msg = 'message:' + i;
      rollbar[methods[i]](msg);
      expect(client.logCalls[i].func).to.eql(methods[i]);
      expect(client.logCalls[i].item.message).to.eql(msg)
    }

    done();
  });

  it('should have a tracer if valid tracer is provided', function (done) {
    var options = { tracer: ValidOpenTracingTracerStub };
    var rollbar = new Rollbar(options);

    expect(rollbar.client.tracer).to.eql(ValidOpenTracingTracerStub);

    done();
  });

  it('should not have a tracer if invalid tracer is provided', function (done) {
    var options = { tracer: InvalidOpenTracingTracerStub };
    var rollbar = new Rollbar(options);

    expect(rollbar.client.tracer).to.eql(null);

    done();
  });
});

describe('configure', function() {
  it('should configure client', function(done) {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest'
      }
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({payload: {environment: 'borkbork'}});
    expect(rollbar.options.payload.environment).to.eql('borkbork');
    expect(client.options.payload.environment).to.eql('borkbork');
    done();
  });
  it('should accept a second parameter and use it as the payload value', function(done) {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest'
      }
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({somekey: 'borkbork'}, {b: 97});
    expect(rollbar.options.somekey).to.eql('borkbork');
    expect(rollbar.options.payload.b).to.eql(97);
    expect(client.payloadData.b).to.eql(97);
    done();
  });
  it('should accept a second parameter and override the payload with it', function(done) {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest'
      }
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({somekey: 'borkbork', payload: {b: 101}}, {b: 97});
    expect(rollbar.options.somekey).to.eql('borkbork');
    expect(rollbar.options.payload.b).to.eql(97);
    expect(client.payloadData.b).to.eql(97);
    done();
  });
  it ('should replace deprecated options', function(done) {
    var client = new (TestClientGen())();
    var options = {
      hostWhiteList: ['foo'],
      hostBlackList: ['bar']
    };
    var rollbar = window.rollbar = new Rollbar({ autoInstrument: false }, client);
    rollbar.configure(options);

    expect(rollbar.options.hostWhiteList).to.eql(undefined);
    expect(rollbar.options.hostBlackList).to.eql(undefined);
    expect(rollbar.options.hostSafeList).to.contain('foo');
    expect(rollbar.options.hostBlockList).to.contain('bar');
    done();
  });
  it('should store configured options', function(done) {
    var client = new (TestClientGen())();
    var options = {
      captureUncaught: true,
      payload: {
        a: 42,
        environment: 'testtest'
      }
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options._configuredOptions.payload.environment).to.eql('testtest');
    expect(rollbar.options._configuredOptions.captureUncaught).to.eql(true);

    rollbar.configure({ captureUncaught: false, payload: {environment: 'borkbork'}});
    expect(rollbar.options._configuredOptions.payload.environment).to.eql('borkbork');
    expect(rollbar.options._configuredOptions.captureUncaught).to.eql(false);
    done();
  });
});

describe('captureEvent', function() {
  it('should handle missing/default type and level', function(done) {
    var options = {};
    var rollbar = new Rollbar(options);

    var event = rollbar.captureEvent({foo: 'bar'});
    expect(event.type).to.eql('manual');
    expect(event.level).to.eql('info');
    expect(event.body.foo).to.eql('bar');

    done();
  });
  it('should handle specified type and level', function(done) {
    var options = {};
    var rollbar = new Rollbar(options);

    var event = rollbar.captureEvent('log', {foo: 'bar'}, 'debug');
    expect(event.type).to.eql('log');
    expect(event.level).to.eql('debug');
    expect(event.body.foo).to.eql('bar');

    done();
  });
  it('should handle extra args', function(done) {
    var options = {};
    var rollbar = new Rollbar(options);

    var event = rollbar.captureEvent('meaningless', {foo: 'bar'}, 23);
    expect(event.type).to.eql('manual');
    expect(event.level).to.eql('info');
    expect(event.body.foo).to.eql('bar');

    done();
  });
});

describe('callback options', function() {
  beforeEach(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    window.fetchStub = sinon.stub(window, 'fetch');
    done();
  });

  afterEach(function () {
    window.fetch.restore();
  });

  function stubResponse(code, err, message) {
    var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

    window.fetch.returns(Promise.resolve(new Response(
      JSON.stringify({ err: err, message: message, result: { uuid: uuid }}),
      { status: code, statusText: message, headers: { 'Content-Type': 'application/json' }}
    )));
  }

  it('should use checkIgnore when set', function(done) {
    stubResponse(200, 0, 'OK');

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      checkIgnore: function(_isUncaught, _args, _payload) {
        return true;
      }
    };
    var rollbar = new Rollbar(options);

    rollbar.log('test'); // generate a payload to ignore

    expect(window.fetchStub.called).to.not.be.ok();

    done();
  });

  it('should use onSendCallback when set', function(done) {
    stubResponse(200, 0, 'OK');

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      onSendCallback: function(_isUncaught, _args, payload) {
        payload.foo = 'bar';
      }
    };
    var rollbar = new Rollbar(options);

    rollbar.log('test'); // generate a payload to inspect

    setTimeout(function() {
      expect(window.fetchStub.called).to.be.ok();
      var body = JSON.parse(window.fetchStub.getCall(0).args[1].body);
      expect(body.data.foo).to.eql('bar');

      done();
    }, 1);
  });

  it('should use transform when set', function(done) {
    stubResponse(200, 0, 'OK');

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      transform: function(data, _item) {
        data.foo = 'baz';
      }
    };
    var rollbar = new Rollbar(options);

    rollbar.log('test'); // generate a payload to inspect

    setTimeout(function() {
      expect(window.fetchStub.called).to.be.ok();
      var body = JSON.parse(window.fetchStub.getCall(0).args[1].body);
      expect(body.data.foo).to.eql('baz');

      done();
    }, 1);
  });
});

describe('createItem', function() {
  it('should handle multiple strings', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = ['first', 'second'];
    var item = rollbar._createItem(args);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs['0']).to.eql('second');

    done();
  });
  it('should handle errors', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs['0']).to.eql('second');

    done();
  });
  it('should handle a callback', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var myCallbackCalled = false;
    var myCallback = function() {
      myCallbackCalled = true;
    };
    var args = [new Error('Whoa'), 'first', myCallback, 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs).to.eql(['second']);
    expect(item.callback).to.be.ok();
    item.callback();
    expect(myCallbackCalled).to.be.ok();

    done();
  });
  it('should handle arrays', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', [1, 2, 3], 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom['0']).to.eql(1);
    expect(item.custom.extraArgs).to.eql(['second']);

    done();
  });
  it('should handle objects', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', {a: 1, b: 2}, 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.a).to.eql(1);
    expect(item.custom.b).to.eql(2);
    expect(item.custom.extraArgs).to.eql(['second']);

    done();
  });
  it('should have a timestamp', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', {a: 1, b: 2}, 'second'];
    var item = rollbar._createItem(args);
    var now = (new Date()).getTime();
    expect(item.timestamp).to.be.within(now - 1000, now + 1000);

    done();
  });
  it('should have an uuid', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', {a: 1, b: 2}, 'second'];
    var item = rollbar._createItem(args);
    expect(item.uuid).to.be.ok();

    var parts = item.uuid.split('-');
    expect(parts.length).to.eql(5);
    // Type 4 UUID
    expect(parts[2][0]).to.eql('4');

    done();
  });
  it('should handle dates', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var y2k = new Date(2000, 0, 1)
    var args = [new Error('Whoa'), 'first', y2k, {a: 1, b: 2}, 'second'];
    var item = rollbar._createItem(args);
    expect(item.custom.extraArgs).to.eql([y2k, 'second']);

    done();
  });
  it('should handle numbers', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', 42, {a: 1, b: 2}, 'second'];
    var item = rollbar._createItem(args);
    expect(item.custom.extraArgs).to.eql([42, 'second']);

    done();
  });
  it('should handle domexceptions', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    if (document && document.querySelectorAll) {
      var e;
      try { document.querySelectorAll('div:foo'); } catch (ee) { e = ee }
      var args = [e, 'first', 42, {a: 1, b: 2}, 'second'];
      var item = rollbar._createItem(args);
      expect(item.err).to.be.ok();
    }

    done();
  });
});

describe('singleton', function() {
  it('should pass through the underlying client after init', function(done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = Rollbar.init(options, client);

    rollbar.log('hello 1');
    Rollbar.log('hello 2');

    var loggedItemDirect = client.logCalls[0].item;
    var loggedItemSingleton = client.logCalls[1].item;
    expect(loggedItemDirect.message).to.eql('hello 1');
    expect(loggedItemSingleton.message).to.eql('hello 2');

    done();
  });
});
