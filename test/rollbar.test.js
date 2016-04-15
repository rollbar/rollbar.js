/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */


var shim = require('../src/shim.js');
var snippetCallback = require('../src/snippet_callback');

var Rollbar = shim.Rollbar;

if (typeof Promise === 'undefined') {
  window.Promise = require('bluebird');
}

var rollbarConfig = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true,
  payload: {
    environment: 'testing'
  }
};

var origRollbar = Rollbar.init(window, rollbarConfig);

describe('Script load', function() {
  // Create a div to use in the tests
  var eventDiv = window.document.createElement('div');
  eventDiv.setAttribute('id', 'event-div');
  window.document.body.appendChild(eventDiv);

  describe('Shim', function() {
    it('should be connected to window.Rollbar', function(done) {
      var callback = snippetCallback(origRollbar, rollbarConfig);
      origRollbar.loadFull(window, document, true, {rollbarJsUrl: '../dist/rollbar.js'}, callback);

      function test() {
        if (origRollbar.notifier !== null) {
          expect(origRollbar.notifier).to.equal(window.Rollbar);
          done();
        } else {
          setTimeout(test, 1);
        }
      }
      test();
    });

    it('should configure window.Rollbar via shim.configure()', function(done) {

      var spy = sinon.spy(window.Rollbar, 'configure');
      var config = {test: 'config'};
      origRollbar.configure(config);

      expect(spy.called).to.equal(true);

      var call = spy.getCall(0);
      var args = call.args;

      expect(args.length).to.equal(1);
      expect(args[0]).to.equal(config);

      done();
    });

    it('should create a child scope of window.Rollbar via shim.scope()', function(done) {

      var scope = origRollbar.scope({more: 'config'});
      expect(scope.parentNotifier).to.equal(window.Rollbar);
      expect(scope.options.payload.more).to.equal('config');

      done();
    });

    it("should call the shim's log method", function(done) {
      // Change origRollbar.log to something else then call window.Rollbar.log()
      // and verify it works. (then reset origRollbar._log.)
      var spy = sinon.spy(origRollbar, 'log');

      window.Rollbar.log('testing');
      expect(spy.called).to.equal(false);

      done();
    });

    it('should create a payload when calling shim.error()', function(done) {
      var spy = sinon.spy(window.Rollbar, '_enqueuePayload');
      var err;

      try {
        throw new Error('cool');
      } catch (e) {
        err = e;
      }

      origRollbar.error('some crazy error', {extra: 'payload omg!'}, err);

      expect(spy.called).to.equal(true);

      var call = spy.getCall(0);
      var args = call.args;

      expect(args[0]).to.be.an('object');
      expect(JSON.stringify(args[0])).to.contain('cool');
      expect(JSON.stringify(args[0])).to.contain('some crazy error');
      expect(JSON.stringify(args[0])).to.contain('payload omg!');

      window.Rollbar._enqueuePayload.restore();

      done();
    });
  });
});


describe('window.Rollbar.configure()', function() {
  describe('window.Rollbar.checkIgnore()', function() {
    it('should be called with the correct arguments', function(done) {
      // ignore everything
      var spy = sinon.stub().returns(true);
      var notifier = window.Rollbar.scope();
      notifier.configure({checkIgnore: spy});

      var err;
      try {
        throw new Error('testing...');
      } catch (e) {
        err = e;
      }

      var extra = {sweet: 'extra data'};
      notifier.error('error msg', err, extra);

      expect(spy.called).to.equal(true);

      var call = spy.getCall(0);
      var args = call.args;

      expect(args.length).to.equal(3);
      expect(args[0]).to.equal(false); // isUncaught
      expect(args[1]).to.be.an('array'); // .error() args
      expect(args[2]).to.be.an('object'); // payload

      expect(args[1][0]).to.equal('error');
      expect(args[1][1]).to.equal('error msg');
      expect(args[1][2]).to.equal(err);
      expect(args[1][3]).to.equal(extra);

      done();
    });

    it('should not allow ReferenceErrors', function(done) {
      function checkIgnore(isUncaught, args, payload) {
        var isReferenceErr = payload.data.body.trace.exception['class'].toLowerCase().indexOf('reference') >= 0;
        return isReferenceErr;
      }

      var spy = sinon.stub(window._rollbarPayloadQueue, 'push');
      var notifier = window.Rollbar.scope();
      var beforePayloadLength = window._rollbarPayloadQueue.length;

      notifier.configure({checkIgnore: checkIgnore});

      var refErr;
      try {
        throw new ReferenceError();
      } catch (e) {
        refErr = e;
      }

      notifier.error(refErr);

      expect(spy.called).to.equal(false);
      expect(window._rollbarPayloadQueue.length).to.equal(beforePayloadLength);

      window._rollbarPayloadQueue.push.restore();

      done();
    });

    it('should only allow ReferenceErrors', function(done) {
      function checkIgnore(isUncaught, args, payload) {
        var isReferenceErr = payload.data.body.trace.exception['class'].toLowerCase().indexOf('reference') >= 0;
        return !isReferenceErr;
      }

      var spy = sinon.stub(window._rollbarPayloadQueue, 'push');
      var notifier = window.Rollbar.scope();
      var beforePayloadLength = window._rollbarPayloadQueue.length;

      notifier.configure({checkIgnore: checkIgnore});

      var err;
      var a;
      try {
        a.asdf = 'hello';
      } catch (e) {
        err = e;
      }
      notifier.error('some err', err);
      expect(spy.called).to.equal(false);

      var refErr;
      try {
        throw new ReferenceError();
      } catch (e) {
        refErr = e;
      }

      notifier.error(refErr);
      expect(spy.called).to.equal(true);
      expect(window._rollbarPayloadQueue.length).to.equal(beforePayloadLength);

      window._rollbarPayloadQueue.push.restore();

      done();
    });

    it('should be available for child scopes', function(done) {
      // ignore everything
      var spy = sinon.stub().returns(true);
      var notifier = window.Rollbar.scope();
      notifier.configure({checkIgnore: spy});

      var child = notifier.scope();
      child.error('child scope error');

      expect(spy.called).to.equal(true);

      done();
    });

    it('should not be overwritten by child scopes', function(done) {
      // ignore everything
      var spy = sinon.stub().returns(true);
      var notifier = window.Rollbar.scope();
      notifier.configure({checkIgnore: spy});

      var child = notifier.scope();
      var spy2 = sinon.stub().returns(false);
      child.configure({checkIgnore: spy2});

      notifier.error('parent error');
      expect(spy.called).to.equal(true);
      expect(spy2.called).to.equal(false);

      done();
    });

    it('should be disabled if custom checkIgnore() throws an error', function(done) {
      var notifier = window.Rollbar.scope();
      var spy = sinon.stub().throws(new Error('intentional'));
      var prev = notifier.options.checkIgnore;
      notifier.configure({checkIgnore: spy});

      notifier.error('initial error');

      try {
        expect(spy.called).to.equal(true);
        expect(notifier.options.checkIgnore).to.equal(null);
      } catch (e) {
        notifier.options.checkIgnore = prev;
        throw e;
      }
      notifier.options.checkIgnore = prev;

      done();
    });
  });

  describe('Reconfigure', function() {
    it('should not change child scopes', function(done) {

      var child = window.Rollbar.scope();
      window.Rollbar.configure({itemsPerMinute: 333});

      expect(child.options).to.not.eql(window.Rollbar.options);
      expect(window.Rollbar.options.itemsPerMinute).to.equal(333);

      done();
    });

    it('should not erase un-set properties', function(done) {
      window.Rollbar.configure({
        payload: {
          person: {
            id: 5,
            username: 'testing@rollbar.com'
          }
        }
      });

      expect(window.Rollbar.options).to.have.property('accessToken');
      expect(window.Rollbar.options.accessToken).to.eql('12c99de67a444c229fca100e0967486f');
      expect(window.Rollbar.options).to.have.property('captureUncaught');
      expect(window.Rollbar.options.captureUncaught).to.eql(true);
      expect(window.Rollbar.options).to.have.property('payload');
      expect(window.Rollbar.options.payload).to.have.property('environment');
      expect(window.Rollbar.options.payload.environment).to.eql('testing');
      expect(window.Rollbar.options.payload).to.have.property('person');
      expect(window.Rollbar.options.payload.person).to.have.property('id');
      expect(window.Rollbar.options.payload.person.id).to.eql(5);
      expect(window.Rollbar.options.payload.person).to.have.property('username');
      expect(window.Rollbar.options.payload.person.username).to.eql('testing@rollbar.com');

      done();
    })
  });

  describe('window.Rollbar.log()', function() {
    it('should respect default level', function(done) {

      var spy = sinon.spy(window.Rollbar, '_log');
      window.Rollbar.configure({logLevel: 'critical'});
      window.Rollbar.log('this is some critical stuff!');

      expect(spy.called).to.equal(true);
      expect(spy.getCall(0).args[0]).to.equal('critical');

      done();
    });

    it('should pass along custom fingerprint', function(done) {

      var fingerprint = 'XXXYYYZZZ';
      var notifier = window.Rollbar.scope({fingerprint: fingerprint});
      var spy = sinon.spy(notifier, '_enqueuePayload');

      notifier.log('test custom fingerprint');

      expect(spy.called).to.equal(true);
      expect(spy.getCall(0).args[0].data.fingerprint).to.equal(fingerprint);

      done();
    });
  });
});


describe('window.Rollbar.log()', function() {
  it('should create a valid payload and put onto window._rollbarPayloadQueue', function(done) {
    var pushSpy = sinon.spy(window._rollbarPayloadQueue, 'push');

    window.Rollbar.error('hello world');

    var call = pushSpy.getCall(0);
    var payload = call.args[0].payload.data;

    expect(payload.environment).to.equal('testing');
    expect(payload.uuid).to.not.equal(undefined);
    expect(payload.level).to.equal('error');
    expect(payload.platform).to.equal('browser');
    expect(payload.framework).to.equal('browser-js');
    expect(payload.language).to.equal('javascript');
    expect(payload.body).to.be.an('object');
    expect(payload.request).to.be.an('object');
    expect(payload.request.url).to.not.equal(undefined);
    expect(payload.client).to.be.an('object');
    expect(payload.server).to.be.an('object');
    expect(payload.notifier).to.be.an('object');
    expect(payload.notifier.name).to.equal('rollbar-browser-js');
    expect(payload.client.timestamp).to.be.a('number');

    window._rollbarPayloadQueue.push.restore();

    done();
  });

  it('should put payloads into window._rollbarPayloadQueue in order', function(done) {
    var pushSpy = sinon.spy(window._rollbarPayloadQueue, 'push');
    var spy = sinon.spy(window.Rollbar, '_enqueuePayload');

    window.Rollbar.error('one');
    window.Rollbar.error('two');
    window.Rollbar.error('three');

    expect(spy.called).to.equal(true);
    expect(pushSpy.called).to.equal(true);

    var call1 = spy.getCall(0);
    var call2 = spy.getCall(1);
    var call3 = spy.getCall(2);

    var c1 = pushSpy.getCall(0);
    var c2 = pushSpy.getCall(1);
    var c3 = pushSpy.getCall(2);

    expect(JSON.stringify(call1.args[0])).to.contain('one');
    expect(JSON.stringify(call2.args[0])).to.contain('two');
    expect(JSON.stringify(call3.args[0])).to.contain('three');

    expect(JSON.stringify(c1.args[0])).to.contain('one');
    expect(JSON.stringify(c2.args[0])).to.contain('two');
    expect(JSON.stringify(c3.args[0])).to.contain('three');

    window.Rollbar._enqueuePayload.restore();
    window._rollbarPayloadQueue.push.restore();

    done();
  });
});

describe('window.Rollbar.uncaughtError()', function() {
  it('should catch uncaught errors', function(done) {
    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      shim._rollbarWindowOnError(window.Rollbar, null, args);
    };

    var spy = sinon.spy(window.Rollbar, '_enqueuePayload');

    setTimeout(function() {
      /* eslint-disable no-undef, no-unused-vars */
      var a = b;
      /* eslint-enable no-undef, no-unused-vars */
    }, 10);

    setTimeout(function() {
      try {
        expect(spy.calledOnce).to.equal(true);

        var call = spy.getCall(0);
        var args = call.args;

        var payload = args[0];

        expect(payload).to.include.key('data');
        expect(payload.data).to.include.key('body');
        expect(payload.data.body).to.include.key('trace');
        expect(payload.data.body.trace).to.include.key('exception');

        // Uncaught flag
        expect(args[1]).to.equal(true);

        done();

        window.Rollbar._enqueuePayload.restore();
      } catch (e) {
        window.Rollbar._enqueuePayload.restore();
        done(e);
      }
    }, 20);
  });


  if (document.addEventListener) {
    it('should catch uncaught errors in event listeners and report', function (done) {
      // Bypass on firefox for now due to automated event
      // firing and window.onerror not working together
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        return done();
      }

      var div = document.getElementById('event-div');

      var spy = sinon.spy(window.Rollbar, '_enqueuePayload');
      var oldOnError = (function() { return window.onerror; })();

      window.onerror = function () {
        window.onerror = oldOnError;

        var args = Array.prototype.slice.call(arguments, 0);
        try {
          shim._rollbarWindowOnError(window.Rollbar, null, args);
        } catch (e) {
          console.log('Expected an error and got one', e);
        }

        expect(spy.calledOnce).to.equal(true);

        var call = spy.getCall(0);
        var args = call.args;

        var payload = args[0];

        expect(payload.data.body.trace.exception['class']).to.equal('ReferenceError');

        expect(payload.data.body.trace.extra._wrappedSource).to.contain("var a = 'hello';");

        window.Rollbar._enqueuePayload.restore();

        done();
      };

      setTimeout(function () {
        document.addEventListener('click', function () {
          var a = 'hello';
          throw new ReferenceError();
        });
        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        div.dispatchEvent(event);
      }, 10);
    });
  }
});

describe('window.Rollbar.init', function() {
  var ShimRollbar = shim.Rollbar;
  var GlobalRollbar = require('../src/globalnotifier').wrapper;

  context('when captureUnhandledRejections is set on the config object', function() {

    context('when Rollbar is loaded via shim initially', function() {
      before(function() {
        rollbarConfig.captureUnhandledRejections = true;
      });

      after(function() {
        delete rollbarConfig.captureUnhandledRejections;
      });

      context('and then is initialized via the full Rollbar', function() {
        var handleRejectionSpy;
        var parentRollbar;

        beforeEach(function() {
          delete window.Rollbar;
          parentRollbar = ShimRollbar.init(window, rollbarConfig);
          GlobalRollbar.init(rollbarConfig, parentRollbar);
          handleRejectionSpy = sinon.spy(window.Rollbar, 'unhandledRejection');
        });

        afterEach(function() {
          delete window.Rollbar;
          if (handleRejectionSpy) {
            handleRejectionSpy.restore();
          }
          ShimRollbar.init(window, rollbarConfig);
        });

        it('replaces the shim global rejected handler, and rejections are handled', function(done) {
          var promise = new Promise(function (resolve, reject) {
            // Verify test expectation -- at first, we haven't been called, it should be the result of the rejection
            // itself that makes the call.

            expect(handleRejectionSpy.called).to.equal(false);
            var error = new Error('oh gosh');
            reject(error);

            // Promise resolution occurs in the next 'tick'
            setTimeout(function () {
              expect(handleRejectionSpy.calledOnce).to.equal(true);
              done();
            }, 1);
          });
        });
      });
    });
  });
});
