/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */
/* globals Promise */


var snippetCallback = require('../src/snippet_callback');

if (typeof Promise === 'undefined') {
  window.Promise = require('bluebird');
}

window.Rollbar = require('../src/shim').Rollbar;


/* Note (@jon): this is a copy from src/shim.js. It's not part
 * of the public interface for shim module.
 */
function _rollbarWindowOnError(client, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }

  client.uncaughtError.apply(client, args);
  if (old) {
    old.apply(window, args);
  }
}


var config = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};


describe('window.Rollbar.init()', function() {
  // Create a div to use in the tests
  var eventDiv = window.document.createElement('div');
  eventDiv.setAttribute('id', 'event-div');
  window.document.body.appendChild(eventDiv);

  it('should set window.Rollbar to the shim', function(done) {
    // window.Rollbar will be exposed as a function since shim has
    // it as a top-level function.
    // var Rollbar = function() {...}
    expect(window.Rollbar).to.be.a('function');

    window.Rollbar.init(window, config);

    expect(window.Rollbar).to.be.an('object');
    expect(window._rollbarShimQueue).to.be.an('array');

    done();
  });

  it('should create a shim with the expected properties', function(done) {
    expect(window.Rollbar).to.have.property('shimId', 1);
    expect(window.Rollbar).to.have.property('notifier', null);
    expect(window.Rollbar).to.have.property('parentShim');
    expect(window.Rollbar.parentShim).to.equal(undefined);
    done();
  });

  it('should create the global _rollbarShimQueue', function(done) {
    expect(window._rollbarShimQueue).to.be.an('array');
    done();
  });

  it('should push initial configure onto _rollbarShimQueue', function(done) {
    expect(window._rollbarShimQueue).to.have.length(1);

    // Make sure the object has the expected keys
    expect(window._rollbarShimQueue[0]).to.be.an('object');
    expect(window._rollbarShimQueue[0]).to.have.keys('shim', 'method', 'args', 'ts');

    // Make sure the object's shim value is valid
    expect(window._rollbarShimQueue[0].shim).to.be.an('object');
    expect(window._rollbarShimQueue[0].shim).to.be(window.Rollbar);

    // Make sure the object's method value is correct
    expect(window._rollbarShimQueue[0].method).to.equal('configure');

    // Make sure the object's ts value is valid
    expect(window._rollbarShimQueue[0].ts).to.be.a(Date);
    expect(window._rollbarShimQueue[0].ts.getTime()).to.be.lessThan(new Date().getTime());

    // Make sure the object's arguments are correct
    expect(window._rollbarShimQueue[0].args).to.have.property(0);
    expect(window._rollbarShimQueue[0].args[0]).to.be.an('object');
    expect(window._rollbarShimQueue[0].args[0]).to.have.property('accessToken', config.accessToken);
    expect(window._rollbarShimQueue[0].args[0]).to.have.property('captureUncaught', config.captureUncaught);

    done();
  });

  context('when captureUnhandledRejections is set on the config object', function() {
    before(function() {
      window.Rollbar = require('../src/shim').Rollbar;
      config.captureUnhandledRejections = true;
      window.Rollbar.init(window, config);
    });

    after(function() {
      window.Rollbar = require('../src/shim').Rollbar;
      delete config.captureUnhandledRejections;
      window.Rollbar.init(window, config);
    });

    it('installs a top level handler to queue caught unhandled promise rejections', function(done) {
      var preLen = window._rollbarShimQueue.length;

      var promise = new Promise(function (resolve, reject) {
        var error = new Error('oh gosh');
        reject(error);
        // Doesn't trigger the event immediately upon rejection, but in the next 'tick'
        expect(window._rollbarShimQueue).to.have.length(preLen);

        setTimeout(function () {
          expect(window._rollbarShimQueue).to.have.length(preLen + 1);
          var data = window._rollbarShimQueue[preLen];
          var options = {};
          expect(data.method).to.equal('unhandledRejection');
          expect(data.args).to.have.length(2);
          expect(data.args[0]).to.equal(error);
          expect(data.args[1]).to.equal(promise);
          done();
        }, 1);
      });
    });
  });
});


describe('window.Rollbar.uncaughtError', function() {
  it('should report all args', function(done) {
    var err;
    try {
      // Simulate an uncaught error by wrapping this in a try/catch
      /* eslint-disable no-undef */
      foo();
      /* eslint-enable no-undef */
    } catch (e) {
      err = e;
      window.Rollbar.uncaughtError('test message where foo is undefined', 'test_file.js', 33, 22, err);
    }

    expect(window._rollbarShimQueue[1]).to.be.an('object');
    expect(window._rollbarShimQueue[1]).to.have.property('method', 'uncaughtError');
    expect(window._rollbarShimQueue[1].args).to.not.equal(undefined);
    expect(window._rollbarShimQueue[1].args[0]).to.contain('foo');
    expect(window._rollbarShimQueue[1].args[1]).to.equal('test_file.js');
    expect(window._rollbarShimQueue[1].args[2]).to.equal(33);
    expect(window._rollbarShimQueue[1].args[3]).to.equal(22);
    expect(window._rollbarShimQueue[1].args[4]).to.equal(err);

    done();
  });


  var div = document.getElementById('event-div');
  if (div.addEventListener) {
    it('should wrap addEventListener', function (done) {
      // Bypass on firefox for now due to automated event
      // firing and window.onerror not working together
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        return done();
      }

      window.onerror = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        _rollbarWindowOnError(window.Rollbar, null, args);
      };

      var spy = sinon.spy(window.Rollbar, 'uncaughtError');

      div.addEventListener('click', function () {
        throw new ReferenceError();
      }, false);

      var event = document.createEvent('MouseEvent');

      event.initMouseEvent('click', true, true, window, null,
        0, 0, 0, 0, false, false, false, false, 0, null);

      div.dispatchEvent(event);

      expect(spy.calledOnce).to.equal(true);

      var call = spy.getCall(0);
      var args = call.args;

      expect(args[4]).be.a(ReferenceError);

      spy.restore();

      done();
    });
  }

  it('should call the previous window.onerror with the correct args', function(done) {

    var spy = sinon.stub();
    _rollbarWindowOnError(window.Rollbar, spy, ['test message', 'http://localhost/foo']);

    expect(spy.calledOnce).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;
    expect(args).to.have.length(2);
    expect(args[0]).to.equal('test message');
    expect(args[1]).to.equal('http://localhost/foo');

    done();
  });
});

describe('_rollbarWindowOnError', function() {

  it('should set window._rollbarWrappedError as the reported error', function(done) {

    var client = window.Rollbar;

    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);

      expect(window._rollbarWrappedError).to.not.equal(undefined);
      expect(window._rollbarWrappedError).to.be.a(ReferenceError);

      done();
    };

    var wrappedFunc = window.Rollbar.wrap(function() {
      throw new ReferenceError();
    });

    // cause uncaught error to hit the above window.onerror
    setTimeout(wrappedFunc, 10);
  });
});


describe('window.Rollbar.global()', function() {
  it('should not return anything', function(done) {
    expect(window.Rollbar.global()).to.equal(undefined);
    done();
  });

  it('should should pass all arguments to the _rollbarShimQueue', function(done) {
    var preLen = window._rollbarShimQueue.length;
    var options = {hello: 'world'};
    window.Rollbar.global(options, 33);

    expect(window._rollbarShimQueue).to.have.length(preLen + 1);

    var globalData = window._rollbarShimQueue[preLen];
    expect(globalData).to.be.an('object');
    expect(globalData.args).to.be.an('array');
    expect(globalData.args).to.have.length(2);
    expect(globalData.args[0]).to.equal(options);
    expect(globalData.args[1]).to.equal(33);

    done();
  });
});

describe('window.Rollbar.configure()', function() {
  it('should not return anything', function(done) {
    expect(window.Rollbar.configure()).to.equal(undefined);
    done();
  });

  it('should should pass all arguments to the _rollbarShimQueue', function(done) {
    var preLen = window._rollbarShimQueue.length;
    var options = {hello: 'world'};
    window.Rollbar.configure(options, 33);

    expect(window._rollbarShimQueue).to.have.length(preLen + 1);

    var configData = window._rollbarShimQueue[preLen];
    expect(configData).to.be.an('object');
    expect(configData.args).to.be.an('array');
    expect(configData.args).to.have.length(2);
    expect(configData.args[0]).to.equal(options);
    expect(configData.args[1]).to.equal(33);

    done();
  });
});


describe('window.Rollbar.scope()', function() {

  it('should return a new shim', function(done) {
    var newScope = window.Rollbar.scope();

    expect(newScope).to.be.an('object');
    expect(newScope).to.not.be(window.Rollbar);

    var props = [
      ['log', 'function'],
      ['debug', 'function'],
      ['info', 'function'],
      ['warn', 'function'],
      ['warning', 'function'],
      ['error', 'function'],
      ['critical', 'function'],
      ['uncaughtError', 'function'],
      ['configure', 'function'],
      ['scope', 'function'],
      ['shimId', 'number'],
      ['parentShim', 'object']
    ];

    for (var i = 0; i < props.length; ++i) {
      var prop = props[i];
      expect(newScope).to.have.property(prop[0]);
      expect(newScope[prop[0]]).to.be.a(prop[1]);
    }
    expect(newScope.notifier).to.be(null);

    expect(newScope.shimId).to.be.above(window.Rollbar.shimId);
    expect(newScope.parentShim).to.be(window.Rollbar);
    expect(newScope.log).to.be(window.Rollbar.log);

    done();
  });

  it('should increment the shimId on each call', function(done) {
    var newScope = window.Rollbar.scope();
    expect(newScope.shimId).to.be.above(window.Rollbar.shimId);

    var prevScope = newScope;
    newScope = newScope.scope();
    expect(newScope.shimId).to.be.above(prevScope.shimId);

    done();
  });
});


describe('window.Rollbar.log/debug/info/warn/warning/error/critical()', function() {
  it('should add a log message to _rollbarShimQueue', function(done) {
    var check = function(method, message) {
      var obj = window._rollbarShimQueue[window._rollbarShimQueue.length - 1];
      expect(obj.method).to.equal(method);
      expect(obj.args[0]).to.equal(message);
    };

    window.Rollbar.log('hello world');
    check('log', 'hello world');

    window.Rollbar.debug('hello debug world');
    check('debug', 'hello debug world');

    window.Rollbar.info('hello info world');
    check('info', 'hello info world');

    // Special case for 'warn' since it's an alias for 'warning'
    window.Rollbar.warn('hello warn world');
    check('warn', 'hello warn world');

    window.Rollbar.warning('hello warning world');
    check('warning', 'hello warning world');

    window.Rollbar.error('hello error world');
    check('error', 'hello error world');

    window.Rollbar.critical('hello critical world');
    check('critical', 'hello critical world');

    done();
  });
});

describe('window.Rollbar.wrap()', function() {
  it('should let non-functions pass through unchanged', function() {
    var object = {};
    expect(window.Rollbar.wrap(object)).to.be.equal(object);
  });

  it('should handle a thrown string', function() {
    var func = window.Rollbar.wrap(function() {
      throw 'breakme';
    });

    try {
      func();
    } catch (e) {
      expect(e).to.be.an('object');
      expect(e._rollbarContext).to.be.an('object');
      expect(e._rollbarContext).to.not.equal(null);
    }
  });
});

describe('window.Rollbar.loadFull()', function() {
  var errArgs;

  var preFullLoad = function(origShim) {
    // Call log() once and expect it to fail. It should call
    // the callback with an error.
    var errCallback = function() {
      errArgs = arguments;
    };
    var scoped = origShim.scope();
    scoped.configure({endpoint: 'http://localhost/nonexistant'});
    scoped.error('testing error callback', errCallback);
  };

  it('should set window.Rollbar to a Notifier', function(done) {
    var origShim = window.Rollbar;

    // setup some stuff for subsequent tests
    preFullLoad(origShim);
    var callback = snippetCallback(origShim, config);

    // Brings in the full rollbar.js file into the DOM
    window.Rollbar.loadFull(window, document, true, {rollbarJsUrl: 'dist/rollbar.js'}, callback);

    // Wait before checking window.Rollbar
    function test() {
      if (window.Rollbar && window.Rollbar.shimId === undefined) {
        expect(window.Rollbar).to.be.an('object');
        expect(window.Rollbar).to.not.equal(origShim);
        expect(window.Rollbar).to.have.property('scope');
        expect(window.Rollbar.parentNotifier).to.be(origShim);

        expect(origShim.notifier).to.be(window.Rollbar);

        var shimQueueSize = window._rollbarShimQueue.length;

        origShim.log('hello world');
        expect(window._rollbarShimQueue.length).to.equal(shimQueueSize);

        done();
      } else {
        setTimeout(test, 1);
      }
    }
    test();
  });

  it('should call the error callback', function(done) {
    // Wait for the Rollbar.loadFull() to complete and call
    // the callback
    function test() {
      if (errArgs) {
        expect(errArgs).to.not.be.equal(undefined);
        expect(errArgs).to.have.length(1);

        var errParam = errArgs[0];
        expect(errParam).to.not.equal(null);

        done();
      } else {
        setTimeout(test, 1);
      }
    }
    test();
  });
});
