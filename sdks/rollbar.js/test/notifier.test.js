/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var extend = require('extend');

var errorParser = require('../src/error_parser');
var Rollbar = require('../src/shim').Rollbar;
var Util = require('../src/util.js');
var XHR = require('../src/xhr.js').XHR;
var notifiersrc = require('../src/notifier');
var Notifier = notifiersrc.Notifier;


var rollbarConfig = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};


notifiersrc.setupJSON(JSON);
Rollbar.init(window, rollbarConfig);


/***** Misc setup tests *****/

describe('Misc', function() {
  it('should not equal window.Rollbar', function(done) {
    var notifier = new Notifier();
    expect(notifier).to.not.equal(window.Rollbar);
    done();
  });
});


/***** Notifier public API tests *****/

/*
 * Notifier()
 */
describe('Notifier()', function() {
  it('should have all of the window.Rollbar methods', function(done) {
    var notifier = new Notifier();
    expect(notifier).to.have.property('log');
    expect(notifier).to.have.property('debug');
    expect(notifier).to.have.property('info');
    expect(notifier).to.have.property('warn');
    expect(notifier).to.have.property('warning');
    expect(notifier).to.have.property('error');
    expect(notifier).to.have.property('critical');
    expect(notifier).to.have.property('uncaughtError');
    expect(notifier).to.have.property('configure');
    expect(notifier).to.have.property('scope');

    var prop;
    for (prop in notifier) {
      if (notifier.hasOwnProperty(prop) && typeof notifier[prop] === 'function') {
        expect(window.Rollbar).to.have.property(prop);
      }
    }

    done();
  });
});


/*
 * Notifier(shim)
 */

describe('Notifier(shim)', function() {
  it('should not have any of the shim properties', function(done) {
    var shim = window.Rollbar;
    var notifier = new Notifier(shim);

    expect(notifier).to.not.have.property('shimId');
    expect(notifier).to.not.have.property('notifier');
    expect(notifier).to.not.have.property('parentShim');

    done();
  });

  it("should set the shim's notifier to itself", function(done) {
    var shim = window.Rollbar;
    var notifier = new Notifier(shim);

    expect(shim).to.have.property('notifier', notifier);
    done();
  });
});


/*
 * Notifier(notifier)
 */

describe('Notifier(notifier)', function() {
  it("should reference it's parent notifier", function(done) {
    var notifier1 = new Notifier();
    var notifier2 = new Notifier(notifier1);

    expect(notifier2).to.have.property('parentNotifier', notifier1);

    done();
  });
});

/*
 * Notifier.global()
 */

describe('Notifier.global()', function() {
  it('should save options to window._globalRollbarOptions', function(done) {
    var notifier = new Notifier();
    notifier.global({maxItems: 12345});
    expect(window._globalRollbarOptions.maxItems).to.equal(12345);

    done();
  });

  it('should overwrite previous options via global()', function(done) {
    var notifier = new Notifier();
    notifier.global({maxItems: 333});
    notifier.global({maxItems: 444});

    expect(window._globalRollbarOptions.maxItems).to.equal(444);

    done();
  });

  it('should respect maxItems', function(done) {
    var xhrPostStub = sinon.stub(XHR, 'post', function(url, accessToken, payload, cb) {
      return cb(null);
    });
    var notifier = new Notifier();
    notifier.global({maxItems: 2});

    var doCheck = function() {
      expect(xhrPostStub.called).to.equal(true);

      // Called once for the first and again for the
      // second message. The third error will not call XHR.post
      // so the stub will not be called.
      expect(xhrPostStub.callCount).to.equal(2);

      var firstCall = xhrPostStub.getCall(0);
      var lastCall = xhrPostStub.getCall(1);
      var firstArgs = firstCall.args;
      var lastArgs = lastCall.args;

      expect(JSON.stringify(firstArgs[2])).to.contain('first error');
      expect(JSON.stringify(lastArgs[2])).to.contain('second error');

      xhrPostStub.restore();
      window._rollbarPayloadQueue.length = 0;

      return done();
    };

    notifier.error('first error');
    notifier.error('second error');
    notifier.error('third error', doCheck);
    Notifier.processPayloads(true);
  });

  it('should enqueue a maxItems reached payload', function(done) {
    window._rollbarPayloadQueue.length = 0;

    var notifier = new Notifier();
    notifier.global({maxItems: 3});
    notifier.error('first error');
    expect(window._rollbarPayloadQueue.length).to.equal(1);

    notifier.error('second error');
    expect(window._rollbarPayloadQueue.length).to.equal(2);

    notifier.error('third error');
    expect(window._rollbarPayloadQueue.length).to.equal(3);

    var topLevelNotifier = notifiersrc.topLevelNotifier();
    var spy = sinon.stub(topLevelNotifier, '_log');
    Notifier.processPayloads(true);

    expect(spy.called).to.equal(true);
    var call = spy.getCall(0);
    var args = call.args;
    expect(args[1]).to.contain('maxItems has been hit.');
    expect(args[6]).to.equal(true);

    spy.restore();

    done();
  });

  it('should respect itemsPerMinute', function(done) {
    var xhrPostStub = sinon.stub(XHR, 'post');
    var notifier = new Notifier();
    notifier.global({maxItems: 10, itemsPerMinute: 2}); // setting maxItems because we want to reset to rateLimitCounter var

    notifier.error('first error');
    notifier.error('second error');
    notifier.error('third error');
    Notifier.processPayloads(true);

    expect(xhrPostStub.called).to.equal(true);
    expect(xhrPostStub.callCount).to.equal(2);

    xhrPostStub.restore();

    return done();
  });
});



/*
 * Notifier.configure()
 */

describe('Notifier.configure()', function() {
  it('should save options', function(done) {
    var notifier = new Notifier();
    var originalOptions = extend(true, {}, notifier.options);

    var config = {foo: 'bar', a: {b: 'c', array: ['a', 'b']}, d: [1, 2, 3]};
    notifier.configure(config);

    extend(true, originalOptions, config);

    expect(notifier.options).to.have.property('foo');
    expect(notifier.options).to.have.property('a');
    expect(notifier.options).to.have.property('d');
    expect(notifier.options.foo).to.equal('bar');
    expect(notifier.options.a).to.have.property('b');
    expect(notifier.options.a).to.have.property('array');
    expect(notifier.options.a.array).to.eql(['a', 'b']);
    expect(notifier.options.d).to.eql([1, 2, 3]);

    expect(notifier.options).to.not.equal(config);

    done();
  });

  if('should not erase options', function(){
    var notifier = new Notifier();
    notifier.configure({
      accessToken: 'abcdef0123456789abcdef0123456789',
      captureUncaught: true,
      payload: {
        environment: 'testing'
      }
    });

    notifier.configure({
      payload: {
        person: {
          id: 5,
          username: 'tester@rollbar.com',
        }
      }
    });

    expect(notifier.options).to.have.property('accessToken');
    expect(notifier.options).to.have.property('captureUncaught');
    expect(notifier.options).to.have.property('payload');
    expect(notifier.options.payload).to.have.property('environment');
    expect(notifier.options.payload).to.eql('testing');
    expect(notifier.options.payload).to.have.property('person');
    expect(notifier.options.payload.person).to.have.property('id')
    expect(notifier.options.payload.person.id).to.eql(5)
    expect(notifier.options.payload.person).to.have.property('username')
    expect(notifier.options.payload.person.username).to.eql('tester@rollbar.com')
  });

  it('populates window._globalRollbarOptions when passed rate limiting options', function() {
    var notifier = new Notifier();

    notifier.configure({
      maxItems: 100,
      itemsPerMinute: 10
    });

    expect(window._globalRollbarOptions.maxItems).to.equal(100);
    expect(window._globalRollbarOptions.itemsPerMinute).to.equal(10);
  });

  it('should respect the enabled flag', function(done) {
    window._rollbarPayloadQueue.length = 0;

    var notifier = new Notifier();
    notifier.configure({enabled: false});
    var child = notifier.scope();

    notifier.error('error');
    expect(window._rollbarPayloadQueue.length).to.equal(0);

    child.error('error');
    expect(window._rollbarPayloadQueue.length).to.equal(0);

    notifier.configure({enabled: true});
    notifier.error('error');
    expect(window._rollbarPayloadQueue.length).to.equal(1);

    child.error('error');
    expect(window._rollbarPayloadQueue.length).to.equal(1);

    notifier.error('third error');
    expect(window._rollbarPayloadQueue.length).to.equal(2);

    child.configure({enabled: true});
    child.error('error');
    expect(window._rollbarPayloadQueue.length).to.equal(3);

    window._rollbarPayloadQueue.length = 0;
    done();
  });

  it('should respect the verbose flag', function(){
    var notifier = new Notifier();
    var consoleSpy = sinon.stub(window.console, 'log');

    notifier.configure({verbose: true });
    notifier._enqueuePayload({}, false, {}, null);
    expect(consoleSpy.calledOnce);
    consoleSpy.reset();

    notifier.configure({verbose: false });
    notifier._enqueuePayload({}, false, {}, null);
    expect(consoleSpy.notCalled);
    consoleSpy.reset();

    notifier.configure({});
    notifier._enqueuePayload({}, false, {}, null);
    expect(consoleSpy.notCalled);

    consoleSpy.restore();
  });

  it('should overwrite previous options', function(done) {
    var notifier = new Notifier();
    notifier.configure({foo: 'bar', bar: 'foo'});
    notifier.configure({foo: 'baz'});

    expect(notifier.options).to.have.property('foo');
    expect(notifier.options).to.have.property('bar');

    expect(notifier.options.foo).to.equal('baz');
    expect(notifier.options.bar).to.equal('foo');

    done();
  });

  it('should save payload options', function(done) {
    var notifier = new Notifier();
    notifier.configure({endpoint: 'http://foo.com/', itemsPerMinute: 33, payload: {server: {host: 'web1'}}});

    expect(notifier.options).to.have.property('payload');
    expect(notifier.options.payload).to.have.property('server');
    expect(notifier.options.payload.server).to.have.property('host', 'web1');

    done();
  });

  it('should call the transform function', function(done) {
    window._rollbarPayloadQueue.length = 0;

    var transformer = function(payload) {
      payload.customKey = '12345asdf';
    };

    var notifier = new Notifier();
    notifier.configure({transform: transformer});
    notifier.error('error');
    expect(window._rollbarPayloadQueue.length).to.equal(1);

    expect(window._rollbarPayloadQueue[0].payload.customKey).to.equal('12345asdf');

    window._rollbarPayloadQueue.length = 0;
    done();
  });

  it('should log an error if the transform function throws an exception', function(done) {
    var consoleSpy = sinon.stub(window.console, 'error');
    window._rollbarPayloadQueue.length = 0;

    var notifier = new Notifier();
    var transformer = function() {
      /* eslint-disable no-undef */
      foo();
      /* eslint-enable no-undef */
    };
    notifier.configure({transform: transformer});
    notifier.error('test error');

    // The error should not be propagated up the the caller of notifier.error()
    expect(consoleSpy.calledOnce);
    expect(window._rollbarPayloadQueue.length).to.equal(1);

    consoleSpy.restore();
    return done();
  });
});


describe('Notfier.unhandledRejection()', function() {
  var notifier;
  var enqueueSpy;

  beforeEach(function() {
    notifier = new Notifier();
    enqueueSpy = sinon.spy(notifier, '_enqueuePayload');
  });

  context('with an error', function() {
    it('should enqueue a payload with the provided error object', function(done) {
      var err;
      try {
        throw new Error('uncaught exception');
      } catch (e) {
        err = e;
      }
      var promise = {};

      notifier.unhandledRejection(err, promise);

      expect(enqueueSpy.calledOnce).to.equal(true);
      var args = enqueueSpy.getCall(0).args;

      var payloadData = args[0].data;
      expect(payloadData.level).to.equal('error');
      var description = args[0].data.body.trace.exception.description;
      var message = args[0].data.body.trace.exception.message;
      var frames = args[0].data.body.trace.frames;
      expect(description).to.equal('uncaught exception');
      expect(message).to.equal('uncaught exception');
      expect(frames.length > 1).to.equal(true);
      done();
    });

    context('produced from a promise with _rollbarContext set', function() {
      it('should enqueue a payload with custom data', function(done) {
        var err;
        var custom = { data: 'Some custom data' };
        try {
          throw new Error('uncaught exception');
        } catch (e) {
          err = e;
        }
        var promise = { _rollbarContext: custom };

        notifier.unhandledRejection(err, promise);

        expect(enqueueSpy.calledOnce).to.equal(true);
        var args = enqueueSpy.getCall(0).args;

        expect(args[0].data.body.trace.extra.data).to.equal(custom.data);
        done();
      });
    })
  });

  context('with a non error object', function() {
    it('should enqueue a payload with the string realization of the object', function(done) {
      var err = {something: 1};
      var promise = {};

      notifier.unhandledRejection(err, promise);

      expect(enqueueSpy.calledOnce).to.equal(true);
      var args = enqueueSpy.getCall(0).args;

      var payloadData = args[0].data;
      expect(payloadData.level).to.equal('error');
      var description = args[0].data.body.trace.exception.description;
      var message = args[0].data.body.trace.exception.message;
      var frames = args[0].data.body.trace.frames;
      expect(description).to.equal(String(err));
      expect(message).to.equal(String(err));
      expect(frames.length).to.equal(1);
      done();
    });
  });

  context('with a null value', function() {
    it('should not enqueue a payload', function(done) {
      var err = null;
      var promise = {};

      notifier.unhandledRejection(err, promise);

      expect(enqueueSpy.called).to.equal(false);
      done();
    });
  })
});

/*
 * Notifier.uncaughtError()
 */

describe('Notifier.uncaughtError()', function() {
  it('should enqueue a payload with the provided error object', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    var err;
    try {
      throw new Error('uncaught exception');
    } catch (e) {
      err = e;
    }
    notifier.uncaughtError('testing uncaught error', 'http://foo.com/', 33, 21, err);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    expect(args.length >= 3).to.equal(true);
    expect(args[0]).to.be.an('object');

    var payload = args[0];
    var message = payload.data.body.trace.exception.description;
    expect(message).to.equal('testing uncaught error');

    expect(args[1]).to.equal(true);

    done();
  });

  it('should enqueue a payload when a string is thrown', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    var err;
    try {
      throw "Please don't throw strings...";
    } catch (e) {
      err = e;
    }
    notifier.uncaughtError('testing uncaught error', 'http://foo.com/', 33, 21, err);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    expect(args.length).to.be.above(2);
    expect(args[0]).to.be.an('object');
    expect(args[1]).to.equal(true);
    expect(args[2]).to.be.an('array');
    expect(args[2].length).to.be.above(5);
    expect(args[2][1]).to.equal('testing uncaught error');
    expect(args[2][5]).to.equal("Please don't throw strings...");

    done();
  });

  it('should enqueue a payload with the provided DOMException', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    var err;
    try {
      // Will throw a DOMException
      document.querySelectorAll('div:foo');
    } catch (e) {
      err = e;
    }
    notifier.uncaughtError('testing uncaught DOMException', 'http://foo.com/', 33, 21, err);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    expect(args.length).to.be.above(2);
    expect(args[0]).to.be.an('object');
    expect(args[1]).to.equal(true);
    expect(args[2]).to.be.an('array');
    expect(args[2].length).to.be.above(2);
    expect(args[2][1]).to.equal('testing uncaught DOMException');

    done();
  });

  it('should enqueue a payload with the custom data from a wrapped function error', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    var foo = notifier.wrap(function() {
      /* eslint-disable no-undef */
      bar();
      /* eslint-enable no-undef */
    }, {custom: 'value'});

    var err;
    try {
      foo();
    } catch (e) {
      err = e;
    }
    notifier.uncaughtError('testing uncaught error', 'http://foo.com/', 33, 21, err, err._rollbarContext);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    expect(args.length >= 3).to.equal(true);

    var payload = args[0];
    expect(payload.data.body.trace.exception.description).to.equal('testing uncaught error');

    var custom = payload.data.body.trace.extra.custom;
    expect(custom).to.equal('value');

    done();
  });

  it('should enqueue a payload with an error if an error object was not provided', function(done) {
    var notifier = new Notifier();
    var _logSpy = sinon.spy(notifier, '_log');
    var _enqueueSpy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('testing uncaught error', 'http://foo.com/', 33, 21);

    // only call _log when we have an error
    expect(_logSpy.called).to.equal(false);
    expect(_enqueueSpy.called).to.equal(true);

    var call = _enqueueSpy.getCall(0);
    var args = call.args;

    expect(args.length).to.equal(3);
    expect(args[0]).to.be.an('object');
    expect(args[1]).to.equal(true);
    expect(args[2]).to.be.an('array');
    expect(args[2].length).to.equal(6);
    expect(args[2][0]).to.equal('error');
    expect(args[2][1]).to.equal('testing uncaught error');
    expect(args[2][2]).to.equal('http://foo.com/');
    expect(args[2][3]).to.equal(33);
    expect(args[2][4]).to.equal(21);

    done();
  });

  it('should handle the case where an error event is passed in place of the url', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    var err;
    try {
      throw new Error('uncaught error event');
    } catch (e) {
      err = e;
    }
    notifier.uncaughtError('testing uncaught error event', err);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    expect(args.length >= 3).to.equal(true);

    var payload = args[0];
    expect(payload.data.body.trace.exception.message).to.equal('uncaught error event');
    expect(payload.data.body.trace.exception.description).to.equal('testing uncaught error event');

    done();
  });

  it('should sanitize the url', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('error message', 'http://foo.com/#', 111);
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.frames[0].filename).to.equal('http://foo.com/');

    done();
  });

  it('should use "(unknown)" for the url if null is given', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('error message', null, 111);
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.frames[0].filename).to.equal('(unknown)');

    done();
  });

  it('should use "(unknown)" for the url if "" is given', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('error message', '', 111);
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.frames[0].filename).to.equal('(unknown)');

    done();
  });

  it('should use "uncaught exception" for the error message if one is not provided', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError(null, 'http://foo.com/', 111);
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.exception.message).to.equal('uncaught exception');

    done();
  });

  it('should have a null lineno if one is not provided', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('something broke', 'http://foo.com/');
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.frames[0].lineno).to.equal(null);

    done();
  });

  it('should attempt to guess the error class from the message', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('SyntaxError: Unexpected token ;', 'http://foo.com/');
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.exception.class).to.equal('SyntaxError');

    done();
  });

  it('should have a single frame if no error object was provided', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_enqueuePayload');

    notifier.uncaughtError('something broke', 'http://foo.com/');
    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    var payload = args[0];

    expect(payload.data.body.trace.frames.length).to.equal(1);

    done();
  });

  it('should log an internal error if given an error object and the _log() method throws an exception', function(done) {
    var consoleLogStub = sinon.stub(window.console, 'error');
    var notifier = new Notifier();
    var _logStub = sinon.stub(notifier, '_log', function() {
      throw new Error('_log() is broken');
    });
    var test = function() {
      var err;
      try {
        throw new Error('boom');
      } catch (e) {
        err = e;
      }
      notifier.uncaughtError('this should actually cause an internal error',
        'http://foo.com', 222, 2, err);
    };

    // The error should not be propagated up the the caller of notifier.error()
    try {
      test();
    } catch (e) {
      expect(false).to.equal(true);
    }
    expect(consoleLogStub.called).to.equal(true);
    expect(_logStub.called).to.equal(true);
    expect(_logStub.getCall(0).args[0]).to.equal('error');

    var call = consoleLogStub.getCall(0);
    expect(call.args[0]).to.be.a('string');
    expect(call.args[0]).to.contain('[Rollbar]:');
    expect(String(call.args[1])).to.contain('_log() is broken');

    _logStub.restore();
    consoleLogStub.restore();

    return done();
  });

  it('should log an internal error if the _enqueuePayload() method throws an exception', function(done) {
    var consoleLogStub = sinon.stub(window.console, 'error');
    var notifier = new Notifier();
    var _stub = sinon.stub(notifier, '_enqueuePayload', function() {
      throw new Error('_enqueuePayload() is broken');
    });
    var test = function() {
      notifier.uncaughtError('this should actually cause an internal error', 'http://foo.com', 222);
    };

    // The error should not be propagated up the the caller of notifier.error()
    try {
      test();
    } catch (e) {
      expect(false).to.equal(true);
    }
    expect(consoleLogStub.called).to.equal(true);
    expect(_stub.called).to.equal(true);
    expect(_stub.getCall(0).args.length).to.equal(3);
    expect(_stub.getCall(0).args[2][1]).to.equal('this should actually cause an internal error');

    var call = consoleLogStub.getCall(0);
    expect(call.args[0]).to.be.a('string');
    expect(call.args[0]).to.contain('[Rollbar]:');
    expect(String(call.args[1])).to.contain('_enqueuePayload() is broken');

    _stub.restore();
    consoleLogStub.restore();

    return done();
  });
});


/*
 * Notifier.scope()
 */

describe('Notifier.scope()', function() {
  it('should create a new Notifier with scope()', function(done) {
    var notifier = new Notifier();

    var x = notifier.scope();

    expect(x).to.not.equal(notifier);
    expect(x.constructor).to.equal(Notifier);
    expect(x.parentNotifier).to.equal(notifier);
    expect(x.options.payload).to.eql({});

    done();
  });

  it('should make a copy of the options with scope()', function(done) {
    var notifier = new Notifier();
    notifier.configure({foo: 'bar'});

    var x = notifier.scope({foo: 'baz', level: 'critical'});

    // scope() will put all options into .payload
    expect(x.options.foo).to.not.equal('baz');
    expect(x.options.level).to.not.equal('critical');

    expect(x.options.payload.foo).to.equal('baz');
    expect(x.options.payload.level).to.equal('critical');

    done();
  });

  it("should not modify parentNotifier's options from a scope() instance when calling configure()", function(done) {
    var notifier = new Notifier();
    notifier.configure({foo: 'bar'});

    var x = notifier.scope({foo: 'baz', level: 'critical'});

    expect(notifier.options).to.not.equal(x.options);
    expect(notifier.options.foo).to.equal('bar');
    expect(notifier.options).to.not.have.property('level');

    done();
  });
});

//level, message, err, custom, callback

/*
 * Notifier.log()
 */
describe('Notifier.log()', function() {
  it('should report a simple message with the default level', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_log');

    notifier.log('test');

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];
    var err = call.args[2];
    var custom = call.args[3];

    expect(level).to.be.equal('debug');
    expect(message).to.be.equal('test');
    expect(err).to.be.equal(undefined);
    expect(custom).to.be.equal(undefined);

    done();
  });

  it('should report a message with the default level and custom arguments', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_log');

    var e;
    try {
      /* eslint-disable no-undef, no-unused-vars */
      var a = b;
      /* eslint-enable no-undef, no-unused-vars */
    } catch (e2) {
      e = e2;
    }

    var obj = {foo: 'bar'};
    var fn = function() {};

    notifier.log('custom', e, obj, fn);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];
    var err = call.args[2];
    var custom = call.args[3];
    var callback = call.args[4];

    expect(level).to.be.equal('debug');
    expect(message).to.be.equal('custom');
    expect(err).to.be.equal(e);
    expect(custom).to.be.equal(obj);
    expect(callback).to.be.a('function');

    done();
  });

  it('should handle a thrown string', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_log');

    var e;
    try {
      throw 'Please stop throwing strings';
    } catch (e2) {
      e = e2;
    }

    notifier.log('custom', e);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];
    var err = call.args[2];
    var custom = call.args[3];

    expect(level).to.be.equal('debug');
    expect(message).to.be.equal('custom');
    expect(!!err).to.be.equal(false);
    expect(custom.extraArgs[0]).to.be.equal(e);

    done();
  });

  it('should pass the DOMException to the _log method', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_log');

    var e;
    try {
      // Will throw a DOMException
      document.querySelectorAll('div:foo');
    } catch (e2) {
      e = e2;
    }

    notifier.log('custom DOMException message', e);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];
    var err = call.args[2];

    expect(level).to.be.equal('debug');
    expect(message).to.be.equal('custom DOMException message');
    expect(err).to.be.equal(e);

    done();
  });

  it('should call the callback even if level was less than reportLevel', function(done) {
    var notifier = new Notifier();
    var callback = sinon.stub();

    notifier.configure({reportLevel: 'error'});
    notifier.debug('this will get ignored', callback);

    expect(callback.calledOnce);

    var call = callback.getCall(0);
    var args = call.args;
    expect(args).to.have.length(2);
    expect(args[0]).to.equal(null);
    expect(args[1]).to.be.an('object');
    expect(args[1]).to.have.keys(['err', 'result']);
    expect(args[1].err).to.equal(0);
    expect(args[1].result).to.have.keys(['id', 'uuid', 'message']);
    expect(args[1].result.id).to.equal(null);
    expect(args[1].result.uuid).to.equal(null);
    expect(args[1].result.message).to.contain('https://rollbar.com'); // more info at https://...

    done();
  });

  it('should call _log with the provided custom Error subclass', function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_log');

    function SpecificError(message) {
      var tmp = Error.apply(this, arguments);
      this.stack = tmp.stack;
      this.message = tmp.message;
    }
    SpecificError.prototype = Object.create(Error.prototype, {
      constructor: {
        value: SpecificError,
        writable: true,
        configurable: true
      }
    });

    var err;
    try {
      throw new SpecificError('Error stack to Rollbar')
    } catch (e) {
      err = e;
    }

    notifier.log('My awesome error subclass', err, {custom: 'data'});

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];
    var err = call.args[2];
    var custom = call.args[3];

    expect(message).to.be.equal('My awesome error subclass');
    expect(err instanceof Error).to.equal(true);
    expect(custom.custom).to.equal('data');

    done();
  });
});


/*
 * Notifier.debug/warn/warning/error/critical()
 */

describe('Notifier.debug/warn/warning/error/critical()', function() {
  var logLevelTest = function(level) {
    it(level + '() should report a message with a ' + level + ' level', function(done) {
      var notifier = new Notifier();
      var spy = sinon.spy(notifier, '_log');
      notifier[level]('Hello ' + level + ' world');

      expect(spy.called).to.equal(true);

      var call = spy.getCall(0);
      var levelArg = call.args[0];
      var message = call.args[1];

      // Special case for 'warn' since it's just an alias for 'warning'
      if (level === 'warn') {
        expect(levelArg).to.equal('warning');
        levelArg = 'warn';
      }

      expect(levelArg).to.be.equal(level);
      expect(message).to.be.equal('Hello ' + level + ' world');

      spy.restore();

      done();
    });
  };

  var internalErrorTest = function(level) {
    it(level + '() should log an internal error if the _log() method throws an exception', function(done) {
      var consoleLogStub = sinon.stub(window.console, 'error');
      var notifier = new Notifier();
      var _logStub = sinon.stub(notifier, '_log', function() {
        throw new Error('_log() is broken');
      });
      var test = function() {
        notifier[level]('this should actually cause an internal error');
      };

      // The error should not be propagated up the the caller of notifier.error()
      try {
        test();
      } catch (e) {
        expect(false).to.equal(true);
      }
      expect(consoleLogStub.called).to.equal(true);
      expect(_logStub.called).to.equal(true);
      expect(_logStub.getCall(0).args[0]).to.equal(level === 'warn' ? 'warning' : level);

      var call = consoleLogStub.getCall(0);
      expect(call.args[0]).to.be.a('string');
      expect(call.args[0]).to.contain('[Rollbar]:');
      expect(String(call.args[1])).to.contain('_log() is broken');

      _logStub.restore();
      consoleLogStub.restore();

      return done();
    });
  };

  var callbackErrorTest = function(level) {
    it(level + '() should log an internal error if the user-supplied callback throws an exception', function(done) {

      // reset the timeout each test
      window.payloadProcessorTimeout = clearTimeout(window.payloadProcessorTimeout);

      // clear all of the payloads from the queue before starting the processor
      window._rollbarPayloadQueue.length = 0;

      var consoleLogStub = sinon.stub(window.console, 'error');
      var notifier = new Notifier();
      var server = sinon.fakeServer.create();
      var _stub = sinon.stub().throws(new Error('user-supplied callback is broken'));

      notifier.global({maxItems: 100, itemsPerMinute: 100});

      // report all items
      notifier.configure({reportLevel: 'debug'});

      // respond to the .error() with a 200 OK fake response
      server.respondWith([200, {'Content-Type': 'application/json'}, '{}']);

      var test = function() {
        try {
          notifier[level]('fake request', _stub);

          expect(window._rollbarPayloadQueue.length).to.equal(1);
          Notifier.processPayloads(true);
        } catch (e) {
          throw e;
        }
      };

      // The error should not be propagated up the the caller of notifier.error()
      try {
        test();
      } catch (e) {
        expect(false).to.equal(true);
      }

      // have the fake server send a fake response
      server.respond();

      expect(consoleLogStub.called).to.equal(true);
      expect(_stub.called).to.equal(true);

      // Check to make sure the callback received the right arguments
      expect(_stub.getCall(0).args.length).to.equal(2);
      expect(_stub.getCall(0).args[0]).to.equal(null);
      expect(_stub.getCall(0).args[1]).to.eql({});

      var call = consoleLogStub.getCall(0);
      expect(call.args[0]).to.be.a('string');
      expect(call.args[0]).to.contain('[Rollbar]:');
      expect(String(call.args[1])).to.contain('user-supplied callback is broken');

      consoleLogStub.restore();
      server.restore();

      clearTimeout(window.payloadProcessorTimeout);

      done();
    });
  };


  var xhrErrorTest = function(level, statusCode) {
    it(level + '() should pass the error to the callback if the server returns a ' + statusCode + ' response', function(done) {

      // reset the timeout each test
      window.payloadProcessorTimeout = clearTimeout(window.payloadProcessorTimeout);

      // clear all of the payloads from the queue before starting the processor
      window._rollbarPayloadQueue.length = 0;

      var consoleLogStub = sinon.stub(window.console, 'error');
      var notifier = new Notifier();
      var server = sinon.fakeServer.create();
      var stub = sinon.stub();

      // report all items
      notifier.configure({reportLevel: 'debug'});

      // respond to the .error() with a 200 OK fake response
      if (statusCode === 403) {
        var jsonResponse = {
          message: 'this is a test message'
        }
        server.respondWith([statusCode, {'Content-Type': 'application/json'}, JSON.stringify(jsonResponse)]);
      } else {
        server.respondWith([statusCode, {'Content-Type': 'application/json'}, '{}']);
      }

      var test = function() {
        // Must call .error() with a callback so we can capture the error
        notifier[level]('fake request', stub);

        expect(window._rollbarPayloadQueue.length).to.equal(1);
        Notifier.processPayloads(true);
      };

      // The error should not be propagated up the the caller of notifier.error()
      try {
        test();
      } catch (e) {
        expect(false).to.equal(true);
      }

      // have the fake server send a fake response
      server.respond();

      expect(stub.called).to.equal(true);
      expect(stub.getCall(0).args.length).to.equal(1);
      expect(stub.getCall(0).args[0]).to.be.an('object');
      expect(Util.typeName(stub.getCall(0).args[0])).to.equal('error');

      // Shouldn't log internal errors for xhr request failures, we log a message on 403
      if (statusCode !== 403) {
        expect(consoleLogStub.called).to.equal(false);
      } else {
        var message = consoleLogStub.args[0][0];
        expect(message).to.equal('[Rollbar]:this is a test message');
      }

      consoleLogStub.restore();
      server.restore();

      clearTimeout(window.payloadProcessorTimeout);

      done();
    });
  };

  var arrayDataTest = function(level) {
    it(level + '() should be able to accept and report array data', function (done) {
      var notifier = new Notifier();
      var logSpy = sinon.spy(notifier, '_log');

      notifier[level]('Oh no!', ['some array', 'data']);

      var call = logSpy.getCall(0);

      expect(call.args[1]).to.equal('Oh no!');
      expect(call.args[3].join(',')).to.equal('some array,data');
      done();
    });
  };

  var i;
  var levels = ['debug', 'info', 'warn', 'warning', 'error', 'critical'];
  for (i = 0; i < levels.length; ++i) {
    logLevelTest(levels[i]);
  }

  for (i = 0; i < levels.length; ++i) {
    internalErrorTest(levels[i]);
  }

  for (i = 0; i < levels.length; ++i) {
    callbackErrorTest(levels[i]);
  }

  for (i = 0; i < levels.length; ++i) {
    arrayDataTest(levels[i]);
  }

  var j = 0;
  var statusCodes = [400, 401, 403, 404, 500, 502];
  for (i = 0; i < levels.length; ++i) {
    for (j = 0; j < statusCodes.length; ++j) {
      xhrErrorTest(levels[i], statusCodes[j]);
    }
  }
});


/***** Notifier internal API tests *****/

/*
 * Notifier._log()
 */

describe('Notifier._log()', function() {
  it('should enqueue to the Notifier.payloadQueue', function(done) {
    var beforeSize = window._rollbarPayloadQueue.length;

    var notifier = new Notifier();
    notifier.configure({endpoint: 'http://foo.com/'});
    var cb = function() {};
    var err;
    try {
      throw new Error('broken');
    } catch (e) {
      err = e;
    }
    notifier._log('warning', 'debug message', err, {custom: 'data'}, cb);

    var afterSize = window._rollbarPayloadQueue.length;
    expect(afterSize).to.be.equal(beforeSize + 1);

    var payload = window._rollbarPayloadQueue[afterSize - 1];
    expect(payload).to.be.an('object');
    expect(payload).to.have.property('callback', cb);
    expect(payload).to.have.property('endpointUrl', 'http://foo.com/item/');
    expect(payload.payload).to.be.an('object');
    done();
  });
});


/*
 * Notifier._route()
 */

describe('Notifier._route()', function() {
  it('should route using the default endpoint', function(done) {
    var notifier = new Notifier();
    expect(notifier._route('test')).contain('//api.rollbar.com/api/1/test');

    notifier.configure({endpoint: 'http://test.com/'});
    expect(notifier._route('test')).to.equal('http://test.com/test');

    done();
  });

  it('should route using a custom endpoint', function(done) {
    var notifier = new Notifier();

    notifier.configure({endpoint: 'http://test.com/'});
    expect(notifier._route('test')).to.equal('http://test.com/test');

    done();
  });

  it('should route using various combinations of "/"', function(done) {
    var notifier = new Notifier();

    notifier.configure({endpoint: 'http://test.com/'});
    expect(notifier._route('/test')).to.equal('http://test.com/test');

    notifier.configure({endpoint: 'http://test.com/'});
    expect(notifier._route('test/')).to.equal('http://test.com/test/');

    notifier.configure({endpoint: 'http://test.com'});
    expect(notifier._route('/test/')).to.equal('http://test.com/test/');

    notifier.configure({endpoint: 'http://test.com'});
    expect(notifier._route('test')).to.equal('http://test.com/test');

    notifier.configure({endpoint: 'http://test.com'});
    expect(notifier._route('test')).to.equal('http://test.com/test');

    notifier.configure({endpoint: 'http://test.com'});
    expect(notifier._route('/test')).to.equal('http://test.com/test');

    notifier.configure({endpoint: 'http://test.com'});
    expect(notifier._route('/test/')).to.equal('http://test.com/test/');

    notifier.configure({endpoint: 'http://test.com'});
    expect(notifier._route('test/')).to.equal('http://test.com/test/');

    done();
  });
});


/*
 * Notifier._buildPayload(ts, level, message, err, custom, callback)
 */

describe('Notifier._buildPayload()', function() {
  it('should return a valid payload object', function(done) {
    var notifier = new Notifier();

    var payload = notifier._buildPayload(new Date(), 'debug', 'Hello world');

    expect(payload.constructor).to.equal(Object);

    expect(payload.data).to.have.keys(['environment', 'endpoint', 'uuid', 'level', 'platform', 'framework',
      'language', 'body', 'request', 'client', 'server', 'notifier']);

    expect(payload.data.client).to.have.keys(['runtime_ms', 'timestamp', 'javascript']);
    expect(payload.data.client.javascript).to.have.keys(['browser', 'language', 'cookie_enabled', 'screen', 'plugins']);

    expect(payload.data.notifier.name).to.equal('rollbar-browser-js');
    expect(payload.data.notifier.version).to.equal(Notifier.NOTIFIER_VERSION);

    // Check passed in data
    expect(payload.data.level).to.equal('debug');

    expect(payload.data.body.message).to.have.key('body');
    expect(payload.data.body.message.body).to.equal('Hello world');

    // Check a trace object
    var err;
    try {
      /* eslint-disable no-undef */
      x = y;
      /* eslint-enable no-undef */
    } catch (e) {
      err = e;
    }
    payload = notifier._buildPayload(new Date(), 'error', 'reference err', errorParser.parse(err));

    expect(payload.data.body.trace).to.be.an('object');
    expect(payload.data.body.trace.exception).to.be.an('object');
    expect(payload.data.body.trace.exception.class).to.equal('ReferenceError');
    expect(payload.data.body.trace.exception.message).to.be.a('string');
    expect(payload.data.body.trace.exception.description).to.equal('reference err');
    expect(payload.data.body.trace.frames).to.be.an('array');

    done();
  });

  it('should have the most recent frame last', function(done) {
    var notifier = new Notifier();

    function last() {
      /* eslint-disable no-undef */
      nonExistant();
      /* eslint-enable no-undef */
    }

    function second() {
      last();
    }

    function first() {
      second();
    }

    var err;
    try {
      first();
    } catch (e) {
      err = e;
    }
    var payload = notifier._buildPayload(new Date(), 'error', 'frame order test', errorParser.parse(err));
    expect(payload.data.body.trace.frames).to.be.an('array');

    var numFrames = payload.data.body.trace.frames.length;

    // Short-circuit for IE9-
    if (payload.data.body.trace.frames.length) {
      expect(payload.data.body.trace.frames[numFrames - 3].method).to.equal('first');
      expect(payload.data.body.trace.frames[numFrames - 2].method).to.equal('second');
      expect(payload.data.body.trace.frames[numFrames - 1].method).to.equal('last');
    }

    done();
  });

  it('should not reference Notifier.options', function(done) {
    var notifier = new Notifier();
    var x = notifier.scope({
      test: {
        a: 'b',
        c: ['d', 'e']
      }
    });

    var payload = x._buildPayload(new Date(), 'debug', 'Hello world');

    expect(payload).to.not.equal(notifier.options.payload);
    expect(payload.data).to.not.equal(notifier.options.payload);
    expect(payload.data.client).to.not.equal(notifier.options.payload.client);

    expect(payload.data).to.have.property('test');
    expect(payload.data.test.a).to.equal('b');
    expect(payload.data.test.c).to.eql(['d', 'e']);

    // Make sure changing the payload doesn't affect the notifier
    payload.data.test.c.push('f');
    expect(x.options.payload.test.c).to.have.length(2);

    // Make sure changing the notifier doesn't affect the notifier
    x.options.payload.test.a = 'g';
    expect(payload.data.test.a).to.equal('b');

    done();
  });

  it('should set the context', function(done) {
    var notifier = new Notifier();
    notifier.configure({payload: {context: 'test/action'}});
    var payload = notifier._buildPayload(new Date(), 'debug', 'Hello world');

    expect(payload.data.context).to.be.a('string');
    expect(payload.data.context).to.equal('test/action');
    done();
  });

  it('should build the correct message payload for an error with no frames', function(done) {
    var notifier = new Notifier();

    // Simulate an error with no frame info
    var mock = {message: 'ReferenceError: b is not defined'};
    var payload = notifier._buildPayload(new Date(), 'debug', null, mock);

    expect(payload.data.body).to.have.key('message');
    expect(payload.data.body.message.body).to.equal('ReferenceError: b is not defined');

    done();
  });

  it('should set extra data for a logged message in body.message.extra', function(done) {
    var notifier = new Notifier();
    var custom = {
      foo: 'bar',
      bar: 'foo'
    };

    var payload = notifier._buildPayload(new Date(), 'debug', 'Hello world', null, custom);

    expect(payload.data.body).to.have.key('message');
    expect(payload.data.body.message).to.have.keys(['body', 'extra']);
    expect(payload.data.body.message.extra).to.eql(custom);

    done();
  });

  it('should set extra data for a logged error in body.trace.extra', function(done) {
    var notifier = new Notifier();

    var err;
    try {
      /* eslint-disable no-undef */
      a = b;
      /* eslint-enable no-undef */
    } catch(e) {
      err = e;
    }

    var custom = {
      foo: 'bar',
      bar: 'foo'
    };

    var payload = notifier._buildPayload(new Date(), 'debug', null, errorParser.parse(err), custom);

    expect(payload.data.body).to.have.key('trace');
    expect(payload.data.body.trace).to.have.keys(['frames', 'exception', 'extra']);
    expect(payload.data.body.trace.extra).to.eql(custom);

    done();
  });

  it('should set extra data for a logged mesage + error in body.trace.extra', function(done) {
    var notifier = new Notifier();
    var message = 'Hello world';

    var err;
    try {
      /* eslint-disable no-undef */
      a = b;
      /* eslint-enable no-undef */
    } catch(e) {
      err = e;
    }

    var custom = {
      foo: 'bar',
      bar: 'foo'
    };

    var payload = notifier._buildPayload(new Date(), 'debug', message, errorParser.parse(err), custom);

    expect(payload.data.body).to.have.key('trace');
    expect(payload.data.body.trace).to.have.keys(['frames', 'exception', 'extra']);
    expect(payload.data.body.trace.extra).to.eql(custom);
    expect(payload.data.body.trace.exception.description).to.equal(message);

    done();
  });

  it('should set body.message.body to the stringified version of extra data when no message is provided', function(done) {
    var notifier = new Notifier();
    var custom = {
      foo: 'bar'
    };

    var payload = notifier._buildPayload(new Date(), 'debug', undefined, null, custom);

    expect(payload.data.body).to.have.key('message');
    expect(payload.data.body.message).to.have.keys(['body', 'extra']);
    expect(payload.data.body.message.extra).to.eql(custom);
    expect(payload.data.body.message.body).to.equal(JSON.stringify(custom));

    done();
  });

  it('should create a payload from an eval() error', function(done) {
    var err;
    try {
      /* eslint-disable no-eval */
      eval('dd(');
      /* eslint-enable no-eval */
    } catch (e) {
      err = e;
    }

    var notifier = new Notifier();
    var payload = notifier._buildPayload(new Date(), 'error', 'message here', errorParser.parse(err));

    expect(payload.data.body).to.have.key('trace');
    expect(payload.data.body.trace).to.have.keys(['frames', 'exception']);
    expect(payload.data.body.trace.exception.class).to.equal('SyntaxError');

    done();
  });

  it('should update payload root data with scope()', function(done) {
    var notifier = new Notifier();

    var x = notifier.scope({
      newKey: 'newValue',
      request: {
        newRequestKey: 'newRequestValue',
        query_string: 'fake=query_string'
      }
    });

    var payload = x._buildPayload(new Date(), 'debug', 'Hello world');

    expect(payload.data.newKey).to.equal('newValue');
    expect(payload.data.request.newRequestKey).to.equal('newRequestValue');
    expect(payload.data.request.query_string).to.equal('fake=query_string');
    done();
  });

  it('should not be able to update body using scope()', function(done) {
    var notifier = new Notifier();

    var x = notifier.scope({
      body: 'badBody'
    });

    var payload = x._buildPayload(new Date(), 'debug', 'Hello world');

    expect(payload.data.body).to.have.key('message');
    expect(payload.data.body.message).to.eql({
      body: 'Hello world'
    });

    done();
  });

  it('should not share references with other calls to _buildPayload()', function(done) {
    var notifier = new Notifier();

    var custom = {
      a: 'b'
    };

    var payload1 = notifier._buildPayload(new Date(), 'debug', 'Hello world', null, custom);
    var payload2 = notifier._buildPayload(new Date(), 'warning', 'Hello world #2', null, custom);

    expect(payload1).to.not.equal(payload2);
    expect(payload1.data.body.message.extra).to.not.equal(payload2.data.body.message.extra);
    expect(payload1.data.body.message.extra).to.eql(payload2.data.body.message.extra);

    payload1.data.body.message.newKey = 'newValue';

    expect(payload2.data.body.message).to.not.have.property('newKey');

    done();
  });

  it('should respect timestamps from the past/future', function(done) {
    var notifier = new Notifier();

    var pastDate = new Date(new Date().getTime() - 10000);
    var futureDate = new Date(new Date().getTime() + 10000);

    var pastMessage = 'Hello past!';
    var futureMessage = 'Hello future!';

    var payload1 = notifier._buildPayload(pastDate, 'debug', pastMessage);
    var payload2 = notifier._buildPayload(futureDate, 'debug', futureMessage);

    expect(payload1.data.client.timestamp).to.equal(Math.round(pastDate.getTime() / 1000));
    expect(payload2.data.client.timestamp).to.equal(Math.round(futureDate.getTime() / 1000));
    expect(payload1.data.body.message.body).to.equal(pastMessage);
    expect(payload2.data.body.message.body).to.equal(futureMessage);

    done();
  });

  it('should error if level is not valid', function(done) {
    var notifier = new Notifier();

    try {
      notifier._buildPayload(new Date(), 'eror', 'Hello world');
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.equal('Invalid level');
    }

    done();
  });

  it('should error if missing message && err && custom', function(done) {
    var notifier = new Notifier();

    try {
      notifier._buildPayload(new Date(), 'error');
      expect(false).to.equal(true);
    } catch (e) {
      expect(e.message).to.equal('No message, stack info or custom data');
    }

    done();
  });

  it('should scrub appropriate fields', function(done) {
    var notifier = new Notifier();

    var custom = {
      password: 'hidden',
      visible: 'visible'
    };

    var spy = sinon.spy(notifier, '_scrub');

    var payload = notifier._buildPayload(new Date(), 'error', 'Hello world', null, custom);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var scrubbedPayload = call.args[0];

    expect(payload.data).to.equal(scrubbedPayload);
    expect(payload.data).to.eql(scrubbedPayload);

    expect(payload.data.body.message.extra.password).to.equal('******');
    expect(payload.data.body.message.extra.visible).to.equal('visible');

    done();
  });

  it('should not scrub top-level access_token field', function(done) {
    var notifier = new Notifier();
    notifier.configure({accessToken: 'access token', scrubFields: ['access_token']});

    var custom = {
      access_token: 'hidden',
      visible: 'visible'
    };

    var spy = sinon.spy(notifier, '_scrub');

    var payload = notifier._buildPayload(new Date(), 'error', 'Hello world', null, custom);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var scrubbedPayload = call.args[0];

    expect(payload.data).to.equal(scrubbedPayload);
    expect(payload.data).to.eql(scrubbedPayload);

    expect(payload.access_token).to.equal('access token');
    expect(payload.data.body.message.extra.access_token).to.equal('******');
    expect(payload.data.body.message.extra.visible).to.equal('visible');

    done();
  });

  it('should not contain any global options', function(done) {
    var notifier = new Notifier();

    var payload = notifier._buildPayload(new Date(), 'error', 'Hello world');

    expect(payload).to.not.have.keys(Object.keys(window._globalRollbarOptions));

    done();
  });
});


/*
 * Notifier._scrub(obj)
 */

describe('Notifier._scrub()', function() {
  it('should return an object with scrubbed values using default scrub fields', function(done) {
    var notifier = new Notifier();

    var payload = {
      passwd: 'passwd',
      password: 'password',
      secret: 'secret',
      confirm_password: 'confirm_password',
      password_confirmation: 'password_confirmation',
      visible: 'visible',
      extra: {
        password: 'password',
        visible: 'visible'
      }
    };

    notifier._scrub(payload);

    expect(payload).to.eql({
      passwd: '******',
      password: '********',
      secret: '******',
      confirm_password: '****************',
      password_confirmation: '*********************',
      visible: 'visible',
      extra: {
        password: '********',
        visible: 'visible'
      }
    });

    done();
  });

  it('should return an object with scrubbed values using custom scrub fields', function(done) {
    var notifier = new Notifier();

    notifier.configure({
      scrubFields: ['hidden']
    });

    var payload = {
      visible: 'visible',
      hidden: 'hidden',
      custom: {
        inner: {
          hidden: 'hidden'
        },
        hidden: 'hidden',
        visible: 'visible'
      }
    };

    notifier._scrub(payload);

    expect(payload).to.eql({
      visible: 'visible',
      hidden: '******',
      custom: {
        inner: {
          hidden: '******'
        },
        hidden: '******',
        visible: 'visible'
      }
    });

    done();
  });

  it('should return an object that has query params scrubbed', function(done) {
    var notifier = new Notifier();

    var payload = {
      url: 'http://foo.com/?password=hidden',
      other_url: 'http://foo.com/?passwd=hidden&visible=visible',
      extra: {
        another_url: 'http://foo.com/?passwd=hidden&visible=visible&password_confirmation=hidden',
        array: [
          'http://foo.com/?passwd=hidden&visible=visible&password_confirmation=hidden&seen=seen',
          'http://www.foo.com?passwd=&test=test&foo'
        ]
      }
    };

    notifier._scrub(payload);

    expect(payload).to.eql({
      url: 'http://foo.com/?password=******',
      other_url: 'http://foo.com/?passwd=******&visible=visible',
      extra: {
        another_url: 'http://foo.com/?passwd=******&visible=visible&password_confirmation=******',
        array: [
          'http://foo.com/?passwd=******&visible=visible&password_confirmation=******&seen=seen',
          'http://www.foo.com?passwd=&test=test&foo'
        ]
      }
    });

    done();
  });

  it('should handle different scrub fields for different notifiers at the same time', function(done) {
    var notifier1 = new Notifier();
    notifier1.configure({
      scrubFields: ['notifier1']
    });

    var notifier2 = notifier1.scope();
    notifier2.configure({
      scrubFields: ['notifier2']
    });

    var payload1 = {
      visible: 'visible',
      notifier1: 'hidden',
      notifier2: 'visible'
    };

    var payload2 = {
      visible: 'visible',
      notifier1: 'visible',
      notifier2: 'hidden'
    };

    notifier1._scrub(payload1);
    notifier2._scrub(payload2);

    expect(payload1).to.eql({
      visible: 'visible',
      notifier1: '******',
      notifier2: 'visible'
    });

    expect(payload2).to.eql({
      visible: 'visible',
      notifier1: 'visible',
      notifier2: '******'
    });

    done();
  });
});

describe('Notifier._internalCheckIgnore()', function() {
  it('should ignore items below reportLevel', function(done) {
    var notifier = new Notifier();

    notifier.options.reportLevel = 'warning';

    var payload = notifier._buildPayload(new Date(), 'info', 'test');
    var result = notifier._internalCheckIgnore(false, ['info'], payload);

    expect(result).to.equal(true);

    payload = notifier._buildPayload(new Date(), 'warning', 'test');
    result = notifier._internalCheckIgnore(false, ['warning'], payload);

    expect(result).to.equal(false);

    done();
  });
});

describe('Notifier.wrap()', function() {
  it('should catch uncaught errors in wrapped functions and save to window._rollbarWrappedError', function(done) {
    var notifier = new Notifier();

    var wrapped = notifier.wrap(function() {
      /* eslint-disable no-undef, no-unused-vars */
      var a = b;
      /* eslint-disable no-undef, no-unused-vars */
    });
    window._rollbarWrappedError = null;

    try {
      wrapped();
    } catch (e) {
      expect(window._rollbarWrappedError).to.not.equal(null);
      expect(window._rollbarWrappedError.constructor).to.equal(ReferenceError);
    }

    done();
  });

  it('should copy over function properties to the wrapped version', function(done) {
    var notifier = new Notifier();

    var func = function() {
      var a = b;
    };

    func.foo = 'bar';

    var wrapped = notifier.wrap(func);

    expect(wrapped.foo).to.equal('bar');

    done();
  });

  it('should set window._rollbarWrappedError._rollbarContext', function(done) {
    var notifier = new Notifier();

    // Wrap with a context
    var wrapped = notifier.wrap(function() {
      /* eslint-disable no-undef, no-unused-vars */
      var a = b;
      /* eslint-enable no-undef, no-unused-vars */
    }, {custom: 'context'});

    window._rollbarWrappedError = null;

    try {
      wrapped();
    } catch (e) {
      expect(window._rollbarWrappedError).to.not.equal(null);
      expect(window._rollbarWrappedError.constructor).to.equal(ReferenceError);
      expect(window._rollbarWrappedError._rollbarContext).to.not.equal(null);
      expect(window._rollbarWrappedError._rollbarContext.custom).to.equal('context');
      expect(window._rollbarWrappedError._rollbarContext._wrappedSource).to.be.a('string');
    }

    // Wrap without a context
    wrapped = notifier.wrap(function() {
      var a = b;
    });

    window._rollbarWrappedError = null;

    try {
      wrapped();
    } catch (e) {
      expect(window._rollbarWrappedError).to.not.equal(null);
      expect(window._rollbarWrappedError.constructor).to.equal(ReferenceError);
      expect(window._rollbarWrappedError._rollbarContext).to.not.equal(null);
      expect(window._rollbarWrappedError._rollbarContext._wrappedSource).to.be.a('string');
    }

    // Wrap with a context function that returns an Object
    wrapped = notifier.wrap(function() {
      /* eslint-disable no-undef, no-unused-vars */
      var a = b;
      /* eslint-enable no-undef, no-unused-vars */
    }, function() {
      return {custom: 'context_from_function'};
    });

    window._rollbarWrappedError = null;

    try {
      wrapped();
    } catch (e) {
      expect(window._rollbarWrappedError).to.not.equal(null);
      expect(window._rollbarWrappedError.constructor).to.equal(ReferenceError);
      expect(window._rollbarWrappedError._rollbarContext).to.not.equal(null);
      expect(window._rollbarWrappedError._rollbarContext.custom).to.equal('context_from_function');
      expect(window._rollbarWrappedError._rollbarContext._wrappedSource).to.be.a('string');
    }

    // Wrap with a context function that returns undefined
    wrapped = notifier.wrap(function() {
      /* eslint-disable no-undef, no-unused-vars */
      var a = b;
      /* eslint-enable no-undef, no-unused-vars */
    }, function() {
      var a = 1;
      a += 1;
    });

    window._rollbarWrappedError = null;

    try {
      wrapped();
    } catch (e) {
      expect(window._rollbarWrappedError).to.not.equal(null);
      expect(window._rollbarWrappedError.constructor).to.equal(ReferenceError);
      expect(window._rollbarWrappedError._rollbarContext).to.not.equal(null);
      expect(window._rollbarWrappedError._rollbarContext._wrappedSource).to.be.a('string');
    }

    // Wrap a function that throws a string
    wrapped = notifier.wrap(function() {
      throw 'breakme';
    });

    window._rollbarWrappedError = null;

    try {
      wrapped();
    } catch (e) {
      expect(window._rollbarWrappedError).to.not.equal(null);
      expect(window._rollbarWrappedError.constructor).to.equal(String);
      expect(window._rollbarWrappedError._rollbarContext).to.not.equal(null);
      expect(window._rollbarWrappedError._rollbarContext._wrappedSource).to.be.a('string');
    }

    done();
  });

  it('should not double wrap functions', function(done) {
    var notifier = new Notifier();

    var func = sinon.spy();

    var newFunc = notifier.wrap(func);
    var sameFunc = notifier.wrap(func);
    var doubleWrapped = notifier.wrap(newFunc);

    expect(func).to.not.equal(newFunc);
    expect(newFunc).to.equal(sameFunc);
    expect(newFunc).to.equal(doubleWrapped);

    newFunc();

    expect(func.calledOnce).to.equal(true);

    done();
  });

  it('should let non-functions pass through unchanged', function() {
    var object = {};
    expect(window.Rollbar.wrap(object)).to.be.equal(object);
  });
});

/*
 * Notifier._urlIsWhitelisted(payload)
 */
describe('Notifier._urlIsWhitelisted()', function() {

  function buildPayloadWithFrame(frame){
    return {
      data: {
        body: {
          trace: {
            frames: [frame]
          }
        }
      }
    };
  }

  function buildNotifierWithWhitelist(whitelist){
    var notifier = new Notifier();
    notifier.configure({hostWhiteList: whitelist});
    return notifier;
  }

  it('should return true with an empty config', function(){
    var notifier = new Notifier();
    var payload = buildPayloadWithFrame({filename: 'example.com/js/somefile'});
    expect(notifier._urlIsWhitelisted(payload)).to.equal(true);
  });

  it('should return true with an empty payload', function(){
    var notifier = buildNotifierWithWhitelist(['example.com']);
    var payload = {};
    expect(notifier._urlIsWhitelisted(payload)).to.equal(true);
  });

  it('should return true with a url matching the whitelist', function() {
    var notifier = buildNotifierWithWhitelist(['example.com']);
    var payload = buildPayloadWithFrame({filename: 'example.com/js/somefile'});
    expect(notifier._urlIsWhitelisted(payload)).to.equal(true);
  });

  it('should return false with a url not matching the whitelist', function() {
    var notifier = buildNotifierWithWhitelist(['example.com']);
    var payload = buildPayloadWithFrame({filename: 'sample.com/js/somefile'});
    expect(notifier._urlIsWhitelisted(payload)).to.equal(false);
  });

  it('should return pass the whitelist to child notifiers', function() {
    var notifier = buildNotifierWithWhitelist(['example.com']);
    var child = notifier.scope();
    var payload = buildPayloadWithFrame({filename: 'sample.com/js/somefile'});
    expect(child._urlIsWhitelisted(payload)).to.equal(false);
  });

  it('should respect multiple white-listed domains', function() {
    var notifier = buildNotifierWithWhitelist(['example.com', 'sample.com']);
    var child = notifier.scope();
    var payload = buildPayloadWithFrame({filename: 'sample.com/js/somefile'});
    expect(child._urlIsWhitelisted(payload)).to.equal(true);

    payload = buildPayloadWithFrame({filename: 'example.com/js/somefile'});
    expect(child._urlIsWhitelisted(payload)).to.equal(true);

    payload = buildPayloadWithFrame({filename: 'not-on-the-list.com/js/somefile'});
    expect(child._urlIsWhitelisted(payload)).to.equal(false);
  });

});

/*
 * Notifier._messageIsIgnored(payload)
 */
describe('Notifier._messageIsIgnored()', function() {
  function buildPayloadWithExceptionMessage(message){
    return {
      data: {
        body: {
          trace: {
            exception: {
              message: message
            }
          }
        }
      }
    };
  }

  function buildNotifierWithIgnoredMessages(messages){
    var notifier = new Notifier();
    notifier.configure({ ignoredMessages: messages });
    return notifier;
  }

  it('should return false with an empty config', function(){
    var notifier = new Notifier();
    var payload = buildPayloadWithExceptionMessage('');
    expect(notifier._messageIsIgnored(payload)).to.equal(false);
  });

  it('should return false with an empty payload', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Divided by 0! What did you do?!']);
    var payload = {};
    expect(notifier._messageIsIgnored(payload)).to.equal(false);
  });

  it('should return true with a message matching the ignored message', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Null is an abstract concept.', 'Error: 0.1 + 0.2 is not what you think!']);
    var payload = buildPayloadWithExceptionMessage('Null is an abstract concept.');
    expect(notifier._messageIsIgnored(payload)).to.equal(true);
  });

  it('should return false when a message does not match any ignored message', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Error: MySpace profile contains no animated gif.', 'Warning: Github is down!']);
    var payload = buildPayloadWithExceptionMessage('Exception: Not all llamas are ugly.');
    expect(notifier._messageIsIgnored(payload)).to.equal(false);
  });

  it('should return false when a message does not have a trace', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Error: MySpace profile contains no animated gif.', 'Warning: Github is down!']);
    var payload = buildPayloadWithExceptionMessage('Exception: Not all llamas are ugly.');
    delete payload.data.body.trace;
    expect(notifier._messageIsIgnored(payload)).to.equal(false);
  });

  it('should return false when a message does not have a trace.exception', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Error: MySpace profile contains no animated gif.', 'Warning: Github is down!']);
    var payload = buildPayloadWithExceptionMessage('Exception: Not all llamas are ugly.');
    delete payload.data.body.trace.exception;
    expect(notifier._messageIsIgnored(payload)).to.equal(false);
  });

  it('should return false when a message does not have a trace.exception.message', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Error: MySpace profile contains no animated gif.', 'Warning: Github is down!']);
    var payload = buildPayloadWithExceptionMessage('Exception: Not all llamas are ugly.');
    delete payload.data.body.trace.exception.message;
    expect(notifier._messageIsIgnored(payload)).to.equal(false);
  });

  it('should return true when a message has a body.message.body which matches the ignored message', function(){
    var notifier = buildNotifierWithIgnoredMessages(['Error: MySpace profile contains no animated gif.', 'Warning: Github is down!']);
    var payload = buildPayloadWithExceptionMessage('Exception: Not all llamas are ugly.');
    delete payload.data.body.trace;
    payload.data.body = {message: {body: 'Warning: Github is down!'}};
    expect(notifier._messageIsIgnored(payload)).to.equal(true);
  });

  it("child notifiers should ignore the parent's ignored messages", function(){
    var notifier = buildNotifierWithIgnoredMessages(['err1', 'err2']);
    var child = notifier.scope();
    var payload1 = buildPayloadWithExceptionMessage('err1');
    var payload2 = buildPayloadWithExceptionMessage('err2');
    var payload3 = buildPayloadWithExceptionMessage('err3');

    expect(child._messageIsIgnored(payload1)).to.equal(true);
    expect(child._messageIsIgnored(payload2)).to.equal(true);
    expect(child._messageIsIgnored(payload3)).to.equal(false);

    var child2 = child.scope();
    child2.configure({ignoredMessages: ['err1', 'err2', 'err3']});
    expect(child2._messageIsIgnored(payload1)).to.equal(true);
    expect(child2._messageIsIgnored(payload2)).to.equal(true);
    expect(child2._messageIsIgnored(payload3)).to.equal(true);

    // Make sure the scope() didn't effect child2's parent
    expect(child._messageIsIgnored(payload1)).to.equal(true);
    expect(child._messageIsIgnored(payload2)).to.equal(true);
    expect(child._messageIsIgnored(payload3)).to.equal(false);

    // overwrite the set of ignored messages to just be ['err1']
    child.configure({ignoredMessages: ['err1']}, true);
    expect(child._messageIsIgnored(payload1)).to.equal(true);
    expect(child._messageIsIgnored(payload2)).to.equal(false);
    expect(child._messageIsIgnored(payload3)).to.equal(false);

    // Make sure that didn't affect child2
    expect(child2._messageIsIgnored(payload1)).to.equal(true);
    expect(child2._messageIsIgnored(payload2)).to.equal(true);
    expect(child2._messageIsIgnored(payload3)).to.equal(true);
  });
});


/*
 * Notifier._logToFunction
 */
describe('Notifier._logToFunction()', function() {
  function buildNotifierWithLogFunction(cb){
     var notifier = new Notifier();
     notifier.configure({logFunction: cb});
     return notifier;
   }

  it('ignores a null log function', function() {
    var notifier = buildNotifierWithLogFunction(null);
    var fn = function() {
      notifier._enqueuePayload({}, false, {}, null);
    };
    try {
      fn();
    } catch (e) {
      expect(false).to.equal(true);
    }
  });

  it('ignores an undefined log function', function() {
    var notifier = buildNotifierWithLogFunction();
    var fn = function() {
      notifier._enqueuePayload({}, false, {}, null);
    };
    try {
      fn();
    } catch (e) {
      expect(false).to.equal(true);
    }
  });

  it('calls the given log function', function() {
    var called = false;
    var logFunc = function() {
      called = true;
    };
    var notifier = buildNotifierWithLogFunction(logFunc);
    expect(called).to.equal(false);
    notifier._enqueuePayload({}, false, {}, null);
    expect(called).to.equal(true);
  });
});
