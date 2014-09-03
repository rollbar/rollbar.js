var expect = chai.expect;

describe("Script load", function() {
  describe("Shim", function() {
    it("should be connected to window.Rollbar", function(done) {
      origRollbar.loadFull(window, document, true, {rollbarJsUrl: '../dist/rollbar.js'});

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

    it("should configure window.Rollbar via shim.configure()", function(done) {

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

    it("should create a child scope of window.Rollbar via shim.scope()", function(done) {

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

    it("should create a payload when calling shim.error()", function(done) {
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


describe("window.Rollbar.configure()", function() {
  describe("window.Rollbar.checkIgnore()", function() {
    it("should be called with the correct arguments", function(done) {
      
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

    it("should not allow ReferenceErrors", function(done) {
      function checkIgnore(isUncaught, args, payload) {
        var isReferenceErr = payload.data.body.trace.exception.class.toLowerCase().indexOf('reference') >= 0;
        return isReferenceErr;
      }

      var spy = sinon.stub(window._rollbarPayloadQueue, 'push');
      var notifier = window.Rollbar.scope();
      var beforePayloadLength = window._rollbarPayloadQueue.length;

      notifier.configure({checkIgnore: checkIgnore});

      var refErr;
      try {
        poop();
      } catch (e) {
        refErr = e;
      }

      notifier.error(refErr);

      expect(spy.called).to.equal(false);
      expect(window._rollbarPayloadQueue.length).to.equal(beforePayloadLength);

      window._rollbarPayloadQueue.push.restore();

      done();
    });

    it("should only allow ReferenceErrors", function(done) {
      function checkIgnore(isUncaught, args, payload) {
        var isReferenceErr = payload.data.body.trace.exception.class.toLowerCase().indexOf('reference') >= 0;
        return !isReferenceErr;
      }

      var spy = sinon.stub(window._rollbarPayloadQueue, 'push');
      var notifier = window.Rollbar.scope();
      var beforePayloadLength = window._rollbarPayloadQueue.length;

      notifier.configure({checkIgnore: checkIgnore});

      var err;
      var a;
      try {
        a['asdf'] = "hello";
      } catch (e) {
        err = e;
      }
      notifier.error('some err', err);
      expect(spy.called).to.equal(false);

      var refErr;
      try {
        poop();
      } catch (e) {
        refErr = e;
      }

      notifier.error(refErr);
      expect(spy.called).to.equal(true);

      window._rollbarPayloadQueue.push.restore();

      done();
    });

    it("should be available for child scopes", function(done) {
      // ignore everything
      var spy = sinon.stub().returns(true);
      var notifier = window.Rollbar.scope();
      notifier.configure({checkIgnore: spy});

      var child = notifier.scope();
      child.error('child scope error');

      expect(spy.called).to.equal(true);

      done();
    });

    it("should not be overwritten by child scopes", function(done) {
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

    it("should be disabled if custom checkIgnore() throws an error", function(done) {
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

  describe("Reconfigure", function() {
    it("should not change child scopes", function(done) {

      var child = window.Rollbar.scope();
      window.Rollbar.configure({itemsPerMinute: 333});

      expect(child.options).to.not.deep.equal(window.Rollbar.options);
      expect(window.Rollbar.options.itemsPerMinute).to.equal(333);

      done();
    });
  });

  describe("window.Rollbar.log()", function() {
    it("should respect default level", function(done) {

      var spy = sinon.spy(window.Rollbar, '_log');
      window.Rollbar.configure({logLevel: 'critical'});
      window.Rollbar.log('this is some critical stuff!');

      expect(spy.called).to.equal(true);
      expect(spy.getCall(0).args[0]).to.equal('critical');

      done();
    });

    it("should pass along custom fingerprint", function(done) {

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


describe("window.Rollbar.log()", function() {
  it("should create a valid payload and put onto window._rollbarPayloadQueue", function(done) {
    var pushSpy = sinon.spy(window._rollbarPayloadQueue, 'push');

    window.Rollbar.error('hello world');

    var call = pushSpy.getCall(0);
    var payload = call.args[0].payload.data;

    expect(payload.environment).to.equal('production');
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

  it("should put payloads into window._rollbarPayloadQueue in order", function(done) {
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

describe("window.Rollbar.uncaughtError()", function() {
  it("should catch uncaught errors", function(done) {
    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      _rollbarWindowOnError(window.Rollbar, null, args);
    };

    var spy = sinon.spy(window.Rollbar, '_enqueuePayload');

    setTimeout(function() {
      var a = b;
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

  it("should catch uncaught errors in event listeners and report", function(done) {
    // Bypass on firefox for now due to automated event
    // firing and window.onerror not working together
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      return done();
    }

    window.onerror = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      _rollbarWindowOnError(window.Rollbar, null, args);
    };

    var div = document.getElementById('event-div');
    div.addEventListener('click', function(e) {
      var a = b;
    }, false);

    var event = document.createEvent("MouseEvent");

    event.initMouseEvent("click", true, true, window, null,
            0, 0, 0, 0, false, false, false, false, 0, null);

    var spy = sinon.spy(window.Rollbar, '_enqueuePayload');

    div.dispatchEvent(event);

    expect(spy.calledOnce).to.equal(true);

    var call = spy.getCall(0);
    var args = call.args;

    var payload = args[0];

    expect(payload.data.body.trace.exception['class']).to.equal('ReferenceError');
    expect(payload.data.body.trace.extra._wrappedSource).to.contain('var a = b;');

    window.Rollbar._enqueuePayload.restore();

    done();
  });
});
