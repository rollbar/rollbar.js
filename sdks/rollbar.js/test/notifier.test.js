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
 * Notifier.configure()
 */

describe("Notifier.configure()", function() {
  it("should save options via configure()", function(done) {
    var notifier = new Notifier();
    var config = {foo: 'bar', a: {b: 'c', array: ['a', 'b']}, d: [1, 2, 3]};
    notifier.configure(config);

    expect(notifier.options).to.deep.equal(config);
    expect(notifier.options).to.not.equal(config);

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
});


/*
 * Notifier.uncaughtError()
 */

describe("Notifier.uncaughtError()", function() {
  // Implement me
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

    expect(x.options.foo).to.equal('baz');
    expect(x.options.level).to.equal('critical');

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
      notifier[level](level);

      expect(spy.called).to.be.true;

      var call = spy.getCall(0);
      level = call.args[0];
      var message = call.args[1];

      expect(level).to.be.equal(level);
      expect(message).to.be.equal(level);

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
    // Implement me...
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
});


