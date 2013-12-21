var expect = chai.expect;

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true    
};
Rollbar.init(window, config);


/***** Misc setup tests *****/

describe("Misc", function() {
  it("should not equal window.Rollbar", function(done) {
    var notifier = new Notifier();
    expect(notifier).to.not.equal(window.Rollbar);
    done();
  });
});


/***** Notifier public API tests *****/

/*
 * Notifier()
 */

describe("Notifier()", function() {
  it("should have all of the window.Rollbar methods", function(done) {
    var notifier = new Notifier();
    expect(notifier).to.have.property('_getLogArgs');
    expect(notifier).to.have.property('_route');
    expect(notifier).to.have.property('_processShimQueue');
    expect(notifier).to.have.property('_log');
    expect(notifier).to.have.property('log');
    expect(notifier).to.have.property('debug');
    expect(notifier).to.have.property('info');
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

describe("Notifier(shim)", function() {
  it("should not have any of the shim properties", function(done) {
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

describe("Notifier(notifier)", function() {
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

describe("Notifier.global()", function() {
  it("should save options to window._globalRollbarOptions", function(done) {
    var notifier = new Notifier();
    notifier.global({foo: 'bar'});
    expect(window._globalRollbarOptions.foo).to.equal('bar');

    done();
  });

  it("should overwrite previous options via global()", function(done) {
    var notifier = new Notifier();
    notifier.global({foo: 'bar', bar: 'foo'});
    notifier.global({foo: 'baz'});

    expect(window._globalRollbarOptions).to.have.property('foo');
    expect(window._globalRollbarOptions).to.have.property('bar');

    expect(window._globalRollbarOptions.foo).to.equal('baz');
    expect(window._globalRollbarOptions.bar).to.equal('foo');

    done();
  });
});




/*
 * Notifier.configure()
 */

describe("Notifier.configure()", function() {
  it("should save options", function(done) {
    var notifier = new Notifier();
    var originalOptions = Util.copy(notifier.options);

    var config = {foo: 'bar', a: {b: 'c', array: ['a', 'b']}, d: [1, 2, 3]};
    notifier.configure(config);

    Util.merge(originalOptions, config);

    expect(notifier.options).to.deep.equal(originalOptions);
    expect(notifier.options).to.not.equal(config);

    done();
  });

  it("should overwrite previous options", function(done) {
    var notifier = new Notifier();
    notifier.configure({foo: 'bar', bar: 'foo'});
    notifier.configure({foo: 'baz'});

    expect(notifier.options).to.have.property('foo');
    expect(notifier.options).to.have.property('bar');

    expect(notifier.options.foo).to.equal('baz');
    expect(notifier.options.bar).to.equal('foo');

    done();
  });

  it("should save payload options", function(done) {
    var notifier = new Notifier();
    notifier.configure({endpoint: 'http://foo.com/', itemsPerMinute: 33, payload: {server: {host: 'web1'}}});

    expect(notifier.options).to.have.property('payload');
    expect(notifier.options.payload).to.have.property('server');
    expect(notifier.options.payload.server).to.have.property('host').to.equal('web1');

    done();
  });
});


/*
 * Notifier.uncaughtError()
 */

describe("Notifier.uncaughtError()", function() {
  it("should enqueue a payload with the provided error object", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, '_log');

    var err = new Error('uncaught error message');
    notifier.uncaughtError('testing uncaught error', 'http://foo.com/', 33, 21, err);

    expect(spy.called).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    expect(args.length).to.equal(5);
    expect(args[0]).to.equal('error');
    expect(args[1]).to.equal('testing uncaught error');
    expect(args[2]).to.equal(err);
    expect(args[3]).to.equal(null);
    expect(args[4]).to.equal(true);

    done();
  });

  it("should enqueue a payload with an error if an error object was not provided", function(done) {
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
    expect(args[2].length).to.equal(5);
    expect(args[2][0]).to.equal('testing uncaught error');
    expect(args[2][1]).to.equal('http://foo.com/');
    expect(args[2][2]).to.equal(33);
    expect(args[2][3]).to.equal(21);

    done();
  });

  it("should handle the case where an Error event is passed in place of the url", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should sanitize the url", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should use \"(unknown)\" for the url if one is not provided", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should use \"uncaught exception\" for the error message if one is not provided", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should have a null lineno if one is not provided", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should attempt to guess the error class from the message", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should have a single frame if no error object was provided", function(done) {
    expect(1).to.equal(0);
    done();
  });
});


/*
 * Notifier.scope()
 */

describe("Notifier.scope()", function() {
  it("should create a new Notifier with scope()", function(done) {
    var notifier = new Notifier();

    var x = notifier.scope();

    expect(x).to.not.equal(notifier);
    expect(x.constructor).to.equal(Notifier);
    expect(x.parentNotifier).to.equal(notifier);

    done();
  });

  it("should make a copy of the options with scope()", function(done) {
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
describe("Notifier.log()", function() {
  it("should report a simple message with the default level", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    notifier.log('test');

    expect(spy.called).to.be.true;

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

  it("should report a message with the default level and custom arguments", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    var e;
    try {
      a = b;
    } catch (e2) {
      e = e2;
    }

    var obj = {foo: 'bar'};
    var fn = function() {};

    notifier.log('custom', e, obj, fn);

    expect(spy.called).to.be.true;

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
    expect(callback).to.be.equal(fn);

    done();
  });
});


/*
 * Notifier.debug/warning/error/critical()
 */

describe("Notifier.debug/warning/error/critical()", function() {
  var logLevelTest = function(level) {
    it("should report a message with a " + level + " level", function(done) {
      var notifier = new Notifier();
      var spy = sinon.spy(notifier, "_log");
      notifier[level]('Hello ' + level + ' world');

      expect(spy.called).to.be.true;

      var call = spy.getCall(0);
      level = call.args[0];
      var message = call.args[1];

      expect(level).to.be.equal(level);
      expect(message).to.be.equal('Hello ' + level + ' world');

      done();
    });
  };

  var i;
  var levels = ['debug', 'info', 'warning', 'error', 'critical'];
  for (i = 0; i < levels.length; ++i) {
    logLevelTest(levels[i]);
  }
});


/***** Notifier internal API tests *****/

/*
 * Notifier._log()
 */

describe("Notifier._log()", function() {
  it("should enqueue to the Notifier.payloadQueue", function(done) {
    var beforeSize = window._rollbarPayloadQueue.length;

    var notifier = new Notifier();
    notifier.configure({endpoint: 'http://foo.com/'});
    var cb = function() {};
    notifier._log('debug', 'debug message', new Error('broken'), {custom: 'data'}, cb);

    var afterSize = window._rollbarPayloadQueue.length;
    expect(afterSize).to.be.equal(beforeSize + 1);

    var payload = window._rollbarPayloadQueue[afterSize - 1];
    expect(payload).to.be.an('object');
    expect(payload).to.have.property('callback').to.equal(cb);
    expect(payload).to.have.property('endpointUrl').to.be.a('string');
    expect(payload.endpointUrl).to.equal('http://foo.com/item/');
    expect(payload.payload).to.be.an('object');
    done();
  });
});


/*
 * Notifier._route()
 */

describe("Notifier._route()", function() {
  it("should route using the default endpoint", function(done) {
    var notifier = new Notifier();
    expect(notifier._route('item/test')).to.equal('https://api.rollbar.com/api/1/item/test');

    notifier.configure({endpoint: 'http://test.com/'});
    expect(notifier._route('test')).to.equal('http://test.com/test');

    done();
  });

  it("should route using a custom endpoint", function(done) {
    var notifier = new Notifier();

    notifier.configure({endpoint: 'http://test.com/'});
    expect(notifier._route('test')).to.equal('http://test.com/test');

    done();
  });

  it("should route using various combinations of '/'", function(done) {
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
 * Notifier._processShimQueue()
 */

describe("Notifier._processShimQueue()", function() {
  it("should be IMPLEMENTED", function(done) {
    expect(1).to.equal(0);
    done();
  });
});


/*
 * Notifier._buildPayload(ts, level, message, err, custom, callback)
 */

describe("Notifier._buildPayload()", function() {
  it("should return a valid payload object", function(done) {
    // check for expected keys
    expect(1).to.equal(0);
    done();
  });

  it("should not reference Notifier.options", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should not share references with other calls to _buildPayload()", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should respect timestamps from the past/future", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should respect timestamps from the past/future", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should error if level is not valid", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should error if missing message && err && custom", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should not error if missing callback", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should not error if missing err || custom", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should scrub appropriate fields", function(done) {
    // Make sure Notifier._scrub is called with the payload and returns the thing returned
    // by _buildPayload()
    expect(1).to.equal(0);
    done();
  });

  it("should not contain any global options", function(done) {
    expect(1).to.equal(0);
    done();
  });
});


/*
 * Notifier._scrub(obj)
 */

describe("Notifier._scrub()", function() {
  it("should return an object with scrubbed values using default scrub fields", function(done) {
    var notifier = new Notifier();

    ["passwd", "password", "secret", "confirm_password", "password_confirmation"]

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

    expect(payload).to.deep.equal({
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

  it("should return an object with scrubbed values using custom scrub fields", function(done) {
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

    expect(payload).to.deep.equal({
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

  it("should return an object that has query params scrubbed", function(done) {
    var notifier = new Notifier();

    var payload = {
      url: 'http://foo.com/?password=ASDFASDF',
      other_url: 'http://foo.com/?passwd=passwd&visible=visible'
    };

    notifier._scrub(payload);

    expect(payload).to.deep.equal({
      url: 'http://foo.com/?password=********',
      other_url: 'http://foo.com/?passwd=******&visible=visible'
    });

    done();
  });

  it("should handle different scrub fields for different notifiers at the same time", function(done) {
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

    expect(payload1).to.deep.equal({
      visible: 'visible',
      notifier1: '******',
      notifier2: 'visible'
    });

    expect(payload2).to.deep.equal({
      visible: 'visible',
      notifier1: 'visible',
      notifier2: '******'
    });

    done();
  });

});
