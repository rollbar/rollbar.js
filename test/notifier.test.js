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

    var prop;
    for (prop in shim) {
      if (shim.hasOwnProperty(prop)) {
        expect(notifier).to.not.have.property(prop);
      }
    }

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
  it("should save options via configure()", function(done) {
    var notifier = new Notifier();
    notifier.configure({foo: 'bar'});
    expect(notifier.options.foo).to.equal('bar');

    done();
  });

  it("should overwrite previous options via configure()", function(done) {
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
    expect(1).to.equal(0);
    done();
  });
});


/*
 * Notifier.uncaughtError()
 */

describe("Notifier.uncaughtError()", function() {
  it("should be IMPLEMENTED", function(done) {
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
  it("should report a message with a debug level", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    notifier.debug('debug');

    expect(spy.called).to.be.true;

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];

    expect(level).to.be.equal('debug');
    expect(message).to.be.equal('debug');

    done();
  });

  it("should report a message with a info level", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    notifier.info('info');

    expect(spy.called).to.be.true;

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];

    expect(level).to.be.equal('info');
    expect(message).to.be.equal('info');

    done();
  });

  it("should report a message with a warning level", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    notifier.warning('warning');

    expect(spy.called).to.be.true;

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];

    expect(level).to.be.equal('warning');
    expect(message).to.be.equal('warning');

    done();
  });

  it("should report a message with a error level", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    notifier.error('error');

    expect(spy.called).to.be.true;

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];

    expect(level).to.be.equal('error');
    expect(message).to.be.equal('error');

    done();
  });

  it("should report a message with a debug critical", function(done) {
    var notifier = new Notifier();
    var spy = sinon.spy(notifier, "_log");

    notifier.critical('critical');

    expect(spy.called).to.be.true;

    var call = spy.getCall(0);
    var level = call.args[0];
    var message = call.args[1];

    expect(level).to.be.equal('critical');
    expect(message).to.be.equal('critical');

    done();
  });
});


/***** Notifier internal API tests *****/

/*
 * Notifier._log()
 */

describe("Notifier._log()", function() {
  it("should enqueue to the Notifier.payloadQueue", function(done) {
    expect(1).to.equal(0);
    done();
  });
});


/*
 * Notifier._route()
 */

describe("Notifier._route()", function() {
  it("should route using the default endpoint", function(done) {
    var notifier = new Notifier();

    expect(notifier._route('test')).to.equal('https://api.rollbar.com/api/1/item/test');

    notifier.configure({endpoint: 'http://test.com/'});

    expect(notifier._route('test')).to.equal('http://test.com/test');

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
  it("should return an object with scrubbed values", function(done) {
    expect(1).to.equal(0);
    done();
  });

  it("should return an object that has query params scrubbed", function(done) {
    // e.g. {url: 'http://foo.com/?password=ASDFASDF'} should become
    //      {url: 'http://foo.com/?password=********'}
    expect(1).to.equal(0);
    done();
  });

  it("should respect global() params for scrub values", function(done) {
    // i.e. var x = Notifier.scope(); window.Rollbar.global({scrubParams: ['password']});
    expect(1).to.equal(0);
    done();
  });

});
