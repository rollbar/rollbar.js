/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	
	mocha.ui('bdd');
	mocha.reporter('html');
	
	var expect = chai.expect;
	var assert = chai.assert;
	
	beforeEach(function() {
	  this.sinon = sinon.sandbox.create();
	});
	
	afterEach(function() {
	  this.sinon.restore();
	});
	
	__webpack_require__(4);
	
	if (window.mochaPhantomJS) {
	  mochaPhantomJS.run();
	} else {
	  mocha.run();
	}


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);
	
	var expect = chai.expect;
	var Rollbar = __webpack_require__(15);
	var notifiersrc = __webpack_require__(16);
	var Notifier = notifiersrc.Notifier;
	var TK = computeStackTraceWrapper({remoteFetching: false, linesOfContext: 3});
	var config = {
	  accessToken: '12c99de67a444c229fca100e0967486f',
	  captureUncaught: true
	};
	
	notifiersrc.setupJSON(JSON);
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
	
	  it("should log an internal error if Util.merge function throws an exception", function(done) {
	    var consoleLogStub = sinon.stub(window.console, 'log');
	    var notifier = new Notifier();
	    var _utilMergeStub = sinon.stub(Util, 'merge', function() { throw new Error('merge() is broken') });
	    var test = function() {
	      notifier.global({itemsPerMinute: 55});
	    };
	
	    // The error should not be propagated up the the caller of notifier.error()
	    expect(test).to.not.throw(Error, 'merge() is broken');
	    expect(consoleLogStub.called).to.equal(true);
	
	    var call = consoleLogStub.getCall(0);
	    expect(call.args[0]).to.be.an('array');
	    expect(call.args[0][0]).to.equal('Rollbar:');
	    expect(call.args[0][1]).to.be.an('object');
	    expect(call.args[0][1].message).to.contain('merge() is broken');
	
	    _utilMergeStub.restore();
	    consoleLogStub.restore();
	
	    return done();
	  });
	
	  it("should respect maxItems", function(done) {
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
	
	  it("should enqueue a maxItems reched payload", function(done) {
	    window._rollbarPayloadQueue.length = 0;
	
	    var notifier = new Notifier();
	    notifier.global({maxItems: 3});
	    notifier.error('first error');
	    expect(_rollbarPayloadQueue.length).to.equal(1);
	
	    notifier.error('second error');
	    expect(_rollbarPayloadQueue.length).to.equal(2);
	
	    notifier.error('third error');
	    expect(_rollbarPayloadQueue.length).to.equal(3);
	
	    var spy = sinon.stub(window._topLevelNotifier, '_log');
	    Notifier.processPayloads(true);
	
	    expect(spy.called).to.equal(true);
	    var call = spy.getCall(0);
	    var args = call.args;
	    expect(args[1]).to.contain('maxItems has been hit.');
	    expect(args[6]).to.equal(true);
	
	    spy.restore();
	
	    done();
	  });
	
	  it("should respect itemsPerMinute", function(done) {
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
	
	  it("should respect the enabled flag", function(done) {
	    window._rollbarPayloadQueue.length = 0;
	
	    var notifier = new Notifier();
	    notifier.configure({enabled: false});
	    var child = notifier.scope();
	
	    notifier.error('error');
	    expect(_rollbarPayloadQueue.length).to.equal(0);
	
	    child.error('error');
	    expect(_rollbarPayloadQueue.length).to.equal(0);
	
	    notifier.configure({enabled: true});
	    notifier.error('error');
	    expect(_rollbarPayloadQueue.length).to.equal(1);
	
	    child.error('error');
	    expect(_rollbarPayloadQueue.length).to.equal(1);
	
	    notifier.error('third error');
	    expect(_rollbarPayloadQueue.length).to.equal(2);
	
	    child.configure({enabled: true});
	    child.error('error');
	    expect(_rollbarPayloadQueue.length).to.equal(3);
	
	    window._rollbarPayloadQueue.length = 0;
	    done();
	  });
	
	  it("should respect the verbose flag", function(){
	    var notifier = new Notifier();
	    var consoleSpy = sinon.stub(window.console, "log");
	
	    notifier.configure({ verbose : true });
	    notifier._enqueuePayload({}, false, {}, null)
	    expect(consoleSpy.calledOnce);
	    consoleSpy.reset();
	
	    notifier.configure({ verbose : false });
	    notifier._enqueuePayload({}, false, {}, null)
	    expect(consoleSpy.notCalled);
	    consoleSpy.reset();
	
	    notifier.configure({});
	    notifier._enqueuePayload({}, false, {}, null)
	    expect(consoleSpy.notCalled);
	
	    consoleSpy.restore();
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
	
	  it("should log an internal error if Util.merge function throws an exception", function(done) {
	    var consoleLogStub = sinon.stub(window.console, 'log');
	    var notifier = new Notifier();
	    var _utilMergeStub = sinon.stub(Util, 'merge', function() { throw new Error('merge() is broken') });
	    var test = function() {
	      notifier.configure({test: 'data'});
	    };
	
	    // The error should not be propagated up the the caller of notifier.error()
	    expect(test).to.not.throw(Error, 'merge() is broken');
	    expect(consoleLogStub.called).to.equal(true);
	
	    var call = consoleLogStub.getCall(0);
	    expect(call.args[0]).to.be.an('array');
	    expect(call.args[0][0]).to.equal('Rollbar:');
	    expect(call.args[0][1]).to.be.an('object');
	    expect(call.args[0][1].message).to.contain('merge() is broken');
	
	    _utilMergeStub.restore();
	    consoleLogStub.restore();
	
	    return done();
	  });
	
	  it("should call the transform function", function(done) {
	    window._rollbarPayloadQueue.length = 0;
	
	    var transformer = function(payload) {
	      payload.customKey = '12345asdf';
	    };
	
	    var notifier = new Notifier();
	    notifier.configure({transform: transformer});
	    notifier.error('error');
	    expect(_rollbarPayloadQueue.length).to.equal(1);
	
	    expect(_rollbarPayloadQueue[0].payload.customKey).to.equal('12345asdf');
	
	    window._rollbarPayloadQueue.length = 0;
	    done();
	  });
	
	  it("should log an error if the transform function throws an exception", function(done) {
	    window._rollbarPayloadQueue.length = 0;
	
	    var notifier = new Notifier();
	    var transformer = function(payload) {
	      foo();
	    };
	    notifier.configure({transform: transformer});
	    notifier.error('test error');
	
	    // The error should not be propagated up the the caller of notifier.error()
	    expect(window._rollbarPayloadQueue.length).to.equal(2);
	    window._rollbarPayloadQueue.length = 0;
	
	    return done();
	  });
	});
	
	
	/*
	 * Notifier.uncaughtError()
	 */
	
	describe("Notifier.uncaughtError()", function() {
	  it("should enqueue a payload with the provided error object", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_log');
	
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
	
	    expect(args.length).to.equal(6);
	    expect(args[0]).to.equal('warning');
	    expect(args[1]).to.equal('testing uncaught error');
	    expect(args[2]).to.equal(err);
	    expect(args[3]).to.equal(null);
	    expect(args[4]).to.equal(null);
	    expect(args[5]).to.equal(true);
	
	    done();
	  });
	
	  it("should enqueue a payload with the provided DOMException", function(done) {
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
	
	    expect(args.length).to.be.at.least(3);
	    expect(args[0]).to.be.an('object');
	    expect(args[1]).to.equal(true);
	    expect(args[2]).to.be.an('array');
	    expect(args[2].length).to.be.at.least(3);
	    expect(args[2][1]).to.equal('testing uncaught DOMException');
	
	    done();
	  });
	
	  it("should enqueue a payload with the custom data from a wrapped function error", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_log');
	
	    var foo = notifier.wrap(function() {
	      bar();
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
	
	    expect(args.length).to.equal(6);
	    expect(args[0]).to.equal('warning');
	    expect(args[1]).to.equal('testing uncaught error');
	    expect(args[2]).to.equal(err);
	    expect(args[3].custom).to.equal('value');
	    expect(args[3]._wrappedSource).to.contain('bar();');
	
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
	    expect(args[2].length).to.equal(6);
	    expect(args[2][0]).to.equal('warning');
	    expect(args[2][1]).to.equal('testing uncaught error');
	    expect(args[2][2]).to.equal('http://foo.com/');
	    expect(args[2][3]).to.equal(33);
	    expect(args[2][4]).to.equal(21);
	
	    done();
	  });
	
	  it("should handle the case where an error event is passed in place of the url", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_log');
	
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
	
	    expect(args.length).to.equal(6);
	    expect(args[0]).to.equal('warning');
	    expect(args[1]).to.equal('testing uncaught error event');
	    expect(args[2]).to.equal(err);
	    expect(args[3]).to.equal(null);
	    expect(args[4]).to.equal(null);
	    expect(args[5]).to.equal(true);
	
	    done();
	  });
	
	  it("should sanitize the url", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError('error message', 'http://foo.com/#', 111);
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.frames[0].filename).to.equal('http://foo.com/');
	
	    done();
	  });
	
	  it("should use \"(unknown)\" for the url if null is given", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError('error message', null, 111);
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.frames[0].filename).to.equal('(unknown)');
	
	    done();
	  });
	
	  it("should use \"(unknown)\" for the url if '' is given", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError('error message', '', 111);
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.frames[0].filename).to.equal('(unknown)');
	
	    done();
	  });
	
	  it("should use \"uncaught exception\" for the error message if one is not provided", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError(null, 'http://foo.com/', 111);
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.exception.message).to.equal('uncaught exception');
	
	    done();
	  });
	
	  it("should have a null lineno if one is not provided", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError('something broke', 'http://foo.com/');
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.frames[0].lineno).to.equal(null);
	
	    done();
	  });
	
	  it("should attempt to guess the error class from the message", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError('SyntaxError: Unexpected token ;', 'http://foo.com/');
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.exception['class']).to.equal('SyntaxError');
	
	    done();
	  });
	
	  it("should have a single frame if no error object was provided", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, '_enqueuePayload')
	
	    notifier.uncaughtError('something broke', 'http://foo.com/');
	    expect(spy.called).to.equal(true);
	
	    var call = spy.getCall(0);
	    var args = call.args;
	    var payload = args[0];
	
	    expect(payload.data.body.trace.frames.length).to.equal(1);
	
	    done();
	  });
	
	  it("should log an internal error if given an error object and the _log() method throws an exception", function(done) {
	    var consoleLogStub = sinon.stub(window.console, 'log');
	    var notifier = new Notifier();
	    var _logStub = sinon.stub(notifier, '_log', function() { throw new Error('_log() is broken') });
	    var test = function() {
	      var err;
	      try {
	        throw new Error('boom');
	      } catch (e) {
	        err = e
	      }
	      notifier.uncaughtError('this should actually cause an internal error',
	        'http://foo.com', 222, 2, err);
	    };
	
	    // The error should not be propagated up the the caller of notifier.error()
	    expect(test).to.not.throw(Error, '_log() is broken');
	    expect(consoleLogStub.called).to.equal(true);
	    expect(_logStub.called).to.equal(true);
	    expect(_logStub.getCall(0).args[0]).to.equal('warning');
	
	    var call = consoleLogStub.getCall(0);
	    expect(call.args[0]).to.be.an('array');
	    expect(call.args[0][0]).to.equal('Rollbar:');
	    expect(call.args[0][1]).to.be.an('object');
	    expect(call.args[0][1].message).to.contain('_log() is broken');
	
	    _logStub.restore();
	    consoleLogStub.restore();
	
	    return done();
	  });
	
	  it("should log an internal error if the _enqueuePayload() method throws an exception", function(done) {
	    var consoleLogStub = sinon.stub(window.console, 'log');
	    var notifier = new Notifier();
	    var _stub = sinon.stub(notifier, '_enqueuePayload', function() { throw new Error('_enqueuePayload() is broken') });
	    var test = function() {
	      notifier.uncaughtError('this should actually cause an internal error', 'http://foo.com', 222);
	    };
	
	    // The error should not be propagated up the the caller of notifier.error()
	    expect(test).to.not.throw(Error, '_enqueuePayload() is broken');
	    expect(consoleLogStub.called).to.equal(true);
	    expect(_stub.called).to.equal(true);
	    expect(_stub.getCall(0).args.length).to.equal(3);
	    expect(_stub.getCall(0).args[2][1]).to.equal('this should actually cause an internal error');
	
	    var call = consoleLogStub.getCall(0);
	    expect(call.args[0]).to.be.an('array');
	    expect(call.args[0][0]).to.equal('Rollbar:');
	    expect(call.args[0][1]).to.be.an('object');
	    expect(call.args[0][1].message).to.contain('_enqueuePayload() is broken');
	
	    _stub.restore();
	    consoleLogStub.restore();
	
	    return done();
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
	    expect(x.options.payload).to.deep.equal({});
	
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
	
	  it("should log an internal error if Util.merge function throws an exception", function(done) {
	    var consoleLogStub = sinon.stub(window.console, 'log');
	    var notifier = new Notifier();
	    var _utilMergeStub = sinon.stub(Util, 'merge', function() { throw new Error('merge() is broken') });
	    var test = function() {
	      notifier.scope({person: {id: 55}});
	    };
	
	    // The error should not be propagated up the the caller of notifier.error()
	    expect(test).to.not.throw(Error, 'merge() is broken');
	    expect(consoleLogStub.called).to.equal(true);
	
	    var call = consoleLogStub.getCall(0);
	    expect(call.args[0]).to.be.an('array');
	    expect(call.args[0][0]).to.equal('Rollbar:');
	    expect(call.args[0][1]).to.be.an('object');
	    expect(call.args[0][1].message).to.contain('merge() is broken');
	
	    _utilMergeStub.restore();
	    consoleLogStub.restore();
	
	    return done();
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
	    expect(callback).to.be.a('function');
	
	    done();
	  });
	
	  it("should pass the DOMException to the _log method", function(done) {
	    var notifier = new Notifier();
	    var spy = sinon.spy(notifier, "_log");
	
	    var e;
	    try {
	      // Will throw a DOMException
	      document.querySelectorAll('div:foo');
	    } catch (e2) {
	      e = e2;
	    }
	
	    notifier.log('custom DOMException message', e);
	
	    expect(spy.called).to.be.true;
	
	    var call = spy.getCall(0);
	    var level = call.args[0];
	    var message = call.args[1];
	    var err = call.args[2];
	
	    expect(level).to.be.equal('debug');
	    expect(message).to.be.equal('custom DOMException message');
	    expect(err).to.be.equal(e);
	
	    done();
	  });
	
	  it("should call the callback even if level was less than reportLevel", function(done) {
	    var notifier = new Notifier();
	    var callback = sinon.stub();
	
	    notifier.configure({reportLevel: 'error'});
	    notifier.debug('this will get ignored', callback);
	
	    expect(callback.calledOnce);
	
	    var call = callback.getCall(0);
	    var args = call.args;
	    expect(args).to.have.length(2);
	    expect(args[0]).to.equal(null);
	    expect(args[1]).to.be.an('object')
	    expect(args[1]).to.have.keys(['err', 'result']);
	    expect(args[1].err).to.equal(0);
	    expect(args[1].result).to.have.keys(['id', 'uuid', 'message']);
	    expect(args[1].result.id).to.equal(null);
	    expect(args[1].result.uuid).to.equal(null);
	    expect(args[1].result.message).to.contain('https://rollbar.com')  // more info at https://...
	
	    done();
	  });
	});
	
	
	/*
	 * Notifier.debug/warn/warning/error/critical()
	 */
	
	describe("Notifier.debug/warn/warning/error/critical()", function() {
	  var logLevelTest = function(level) {
	    it(level + "() should report a message with a " + level + " level", function(done) {
	      var notifier = new Notifier();
	      var spy = sinon.spy(notifier, "_log");
	      notifier[level]('Hello ' + level + ' world');
	
	      expect(spy.called).to.be.true;
	
	      var call = spy.getCall(0);
	      var levelArg = call.args[0];
	      var message = call.args[1];
	
	      // Special case for "warn" since it's just an alias for "warning"
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
	    it(level + "() should log an internal error if the _log() method throws an exception", function(done) {
	      var consoleLogStub = sinon.stub(window.console, 'log');
	      var notifier = new Notifier();
	      var _logStub = sinon.stub(notifier, '_log', function() { throw new Error('_log() is broken') });
	      var test = function() {
	        notifier[level]('this should actually cause an internal error');
	      };
	
	      // The error should not be propagated up the the caller of notifier.error()
	      expect(test).to.not.throw(Error);
	      expect(consoleLogStub.called).to.equal(true);
	      expect(_logStub.called).to.equal(true);
	      expect(_logStub.getCall(0).args[0]).to.equal(level === 'warn' ? 'warning' : level);
	
	      var call = consoleLogStub.getCall(0);
	      expect(call.args[0]).to.be.an('array');
	      expect(call.args[0][0]).to.equal('Rollbar:');
	      expect(call.args[0][1]).to.be.an('object');
	      expect(call.args[0][1].message).to.contain('_log() is broken');
	
	      _logStub.restore();
	      consoleLogStub.restore();
	
	      return done();
	    });
	  };
	
	  var callbackErrorTest = function(level) {
	    it(level + "() should log an internal error if the user-supplied callback throws an exception", function(done) {
	
	      // reset the timeout each test
	      window.payloadProcessorTimeout = clearTimeout(window.payloadProcessorTimeout);
	
	      // clear all of the payloads from the queue before starting the processor
	      window._rollbarPayloadQueue.length = 0;
	
	      var consoleLogStub = sinon.stub(window.console, 'log');
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
	          console.log(e);
	          console.log(e.stack);
	          throw e;
	        }
	      };
	
	      // The error should not be propagated up the the caller of notifier.error()
	      expect(test).to.not.throw(Error);
	
	      // have the fake server send a fake response
	      server.respond();
	
	      expect(consoleLogStub.called).to.equal(true);
	      expect(_stub.called).to.equal(true);
	
	      // Check to make sure the callback received the right arguments
	      expect(_stub.getCall(0).args.length).to.equal(2);
	      expect(_stub.getCall(0).args[0]).to.equal(null);
	      expect(_stub.getCall(0).args[1]).to.deep.equal({});
	
	      var call = consoleLogStub.getCall(0);
	      expect(call.args[0]).to.be.an('array');
	      expect(call.args[0][0]).to.equal('Rollbar:');
	      expect(call.args[0][1]).to.be.an('object');
	      expect(call.args[0][1].message).to.contain('user-supplied callback is broken');
	
	      consoleLogStub.restore();
	      server.restore();
	
	      clearTimeout(window.payloadProcessorTimeout);
	
	      done();
	    });
	  };
	
	
	  var xhrErrorTest = function(level, statusCode) {
	    it(level + "() should pass the error to the callback if the server returns a " + statusCode + " response", function(done) {
	
	      // reset the timeout each test
	      window.payloadProcessorTimeout = clearTimeout(window.payloadProcessorTimeout);
	
	      // clear all of the payloads from the queue before starting the processor
	      window._rollbarPayloadQueue.length = 0;
	
	      var consoleLogStub = sinon.stub(window.console, 'log');
	      var notifier = new Notifier();
	      var server = sinon.fakeServer.create();
	      var stub = sinon.stub();
	
	      // report all items
	      notifier.configure({reportLevel: 'debug'});
	
	      // respond to the .error() with a 200 OK fake response
	      server.respondWith([statusCode, {'Content-Type': 'application/json'}, '{}']);
	
	      var test = function() {
	        // Must call .error() with a callback so we can capture the error
	        notifier[level]('fake request', stub);
	
	        expect(window._rollbarPayloadQueue.length).to.equal(1);
	        Notifier.processPayloads(true);
	      };
	
	      // The error should not be propagated up the the caller of notifier.error()
	      expect(test).to.not.throw(Error);
	
	      // have the fake server send a fake response
	      server.respond();
	
	      expect(stub.called).to.equal(true);
	      expect(stub.getCall(0).args.length).to.equal(1);
	      expect(stub.getCall(0).args[0]).to.be.an('object');
	      expect(stub.getCall(0).args[0].constructor.name).to.equal('Error');
	
	      // Shouldn't log internal errors for xhr request failures
	      expect(consoleLogStub.called).to.equal(false);
	
	      consoleLogStub.restore();
	      server.restore();
	
	      clearTimeout(window.payloadProcessorTimeout);
	
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
	
	describe("Notifier._log()", function() {
	  it("should enqueue to the Notifier.payloadQueue", function(done) {
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
	    expect(notifier._route('test')).include('//api.rollbar.com/api/1/test');
	
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
	 * Notifier._buildPayload(ts, level, message, err, custom, callback)
	 */
	
	describe("Notifier._buildPayload()", function() {
	  it("should return a valid payload object", function(done) {
	    var notifier = new Notifier();
	
	    var payload = notifier._buildPayload(new Date(), 'debug', 'Hello world');
	
	    expect(payload.constructor).to.equal(Object);
	
	    expect(payload.data).to.include.keys(['environment', 'endpoint', 'uuid', 'level', 'platform', 'framework',
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
	      x = y;
	    } catch (e) {
	      err = e
	    }
	    payload = notifier._buildPayload(new Date(), 'error', 'reference err', err);
	
	    expect(payload.data.body.trace).to.be.an('object');
	    expect(payload.data.body.trace.exception).to.be.an('object');
	    expect(payload.data.body.trace.exception.class).to.equal('ReferenceError');
	    expect(payload.data.body.trace.exception.message).to.be.a('string');
	    expect(payload.data.body.trace.exception.description).to.equal('reference err');
	    expect(payload.data.body.trace.frames).to.be.an('array');
	
	    done();
	  });
	
	  it("should not reference Notifier.options", function(done) {
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
	    expect(payload.data.test.c).to.deep.equal(['d', 'e']);
	
	    // Make sure changing the payload doesn't affect the notifier
	    payload.data.test.c.push('f');
	    expect(x.options.payload.test.c).to.have.length(2);
	
	    // Make sure changing the notifier doesn't affect the notifier
	    x.options.payload.test.a = 'g';
	    expect(payload.data.test.a).to.equal('b');
	
	    done();
	  });
	
	  it("should set the context", function(done) {
	    var notifier = new Notifier();
	    notifier.configure({payload: {context: 'test/action'}});
	    var payload = notifier._buildPayload(new Date(), 'debug', 'Hello world');
	
	    expect(payload.data.context).to.be.a('string');
	    expect(payload.data.context).to.equal('test/action');
	    done();
	  });
	
	  it("should build the correct message payload for an error with no frames", function(done) {
	    var notifier = new Notifier();
	
	    // Simulate an error with no frame info
	    var mock = {message: 'ReferenceError: b is not defined'};
	    var payload = notifier._buildPayload(new Date(), 'debug', null, mock);
	
	    expect(payload.data.body).to.have.key('message');
	    expect(payload.data.body.message.body).to.equal('ReferenceError: b is not defined');
	
	    done();
	  });
	
	  it("should set extra data for a logged message in body.message.extra", function(done) {
	    var notifier = new Notifier();
	    var custom = {
	      foo: 'bar',
	      bar: 'foo'
	    };
	
	    var payload = notifier._buildPayload(new Date(), 'debug', 'Hello world', null, custom);
	
	    expect(payload.data.body).to.have.key('message');
	    expect(payload.data.body.message).to.have.keys(['body', 'extra']);
	    expect(payload.data.body.message.extra).to.deep.equal(custom);
	
	    done();
	  });
	
	  it("should set extra data for a logged error in body.trace.extra", function(done) {
	    var notifier = new Notifier();
	
	    var err;
	    try {
	      a = b;
	    } catch(e) {
	      err = e;
	    }
	
	    var custom = {
	      foo: 'bar',
	      bar: 'foo'
	    };
	
	    var payload = notifier._buildPayload(new Date(), 'debug', null, TK(err), custom);
	
	    expect(payload.data.body).to.have.key('trace');
	    expect(payload.data.body.trace).to.have.keys(['frames', 'exception', 'extra']);
	    expect(payload.data.body.trace.extra).to.deep.equal(custom);
	
	    done();
	  });
	
	  it("should set extra data for a logged mesage + error in body.trace.extra", function(done) {
	    var notifier = new Notifier();
	    var message = 'Hello world';
	
	    var err;
	    try {
	      a = b;
	    } catch(e) {
	      err = e;
	    }
	
	    var custom = {
	      foo: 'bar',
	      bar: 'foo'
	    };
	
	    var payload = notifier._buildPayload(new Date(), 'debug', message, TK(err), custom);
	
	    expect(payload.data.body).to.have.key('trace');
	    expect(payload.data.body.trace).to.have.keys(['frames', 'exception', 'extra']);
	    expect(payload.data.body.trace.extra).to.deep.equal(custom);
	    expect(payload.data.body.trace.exception.description).to.equal(message);
	
	    done();
	  });
	
	  it("should set body.message.body to the stringified version of extra data when no message is provided", function(done) {
	    var notifier = new Notifier();
	    var custom = {
	      foo: 'bar'
	    };
	
	    var payload = notifier._buildPayload(new Date(), 'debug', undefined, null, custom);
	
	    expect(payload.data.body).to.have.key('message');
	    expect(payload.data.body.message).to.have.keys(['body', 'extra']);
	    expect(payload.data.body.message.extra).to.deep.equal(custom);
	    expect(payload.data.body.message.body).to.equal(JSON.stringify(custom));
	
	    done();
	  });
	
	  it("should create a payload from an eval() error", function(done) {
	    var err;
	    try {
	      eval('dd(');
	    } catch (e) {
	      err = e;
	    }
	
	    var notifier = new Notifier();
	    var payload = notifier._buildPayload(new Date(), 'error', 'message here', TK(err));
	
	    expect(payload.data.body).to.have.key('trace');
	    expect(payload.data.body.trace).to.have.keys(['frames', 'exception']);
	    expect(payload.data.body.trace.exception.class).to.equal('SyntaxError');
	
	    done();
	  });
	
	  it("should update payload root data with scope()", function(done) {
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
	
	  it("should not be able to update body using scope()", function(done) {
	    var notifier = new Notifier();
	
	    var x = notifier.scope({
	      body: 'badBody'
	    });
	
	    var payload = x._buildPayload(new Date(), 'debug', 'Hello world');
	
	    expect(payload.data.body).to.have.key('message');
	    expect(payload.data.body.message).to.deep.equal({
	      body: 'Hello world'
	    });
	
	    done();
	  });
	
	  it("should not share references with other calls to _buildPayload()", function(done) {
	    var notifier = new Notifier();
	
	    var custom = {
	      a: 'b'
	    };
	
	    var payload1 = notifier._buildPayload(new Date(), 'debug', 'Hello world', null, custom);
	    var payload2 = notifier._buildPayload(new Date(), 'warning', 'Hello world #2', null, custom);
	
	    expect(payload1).to.not.equal(payload2);
	    expect(payload1.data.body.message.extra).to.not.equal(payload2.data.body.message.extra);
	    expect(payload1.data.body.message.extra).to.deep.equal(payload2.data.body.message.extra);
	
	    payload1.data.body.message.newKey = 'newValue';
	
	    expect(payload2.data.body.message).to.not.have.property('newKey');
	
	    done();
	  });
	
	  it("should respect timestamps from the past/future", function(done) {
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
	
	  it("should error if level is not valid", function(done) {
	    var notifier = new Notifier();
	
	    expect(function() {
	      notifier._buildPayload(new Date(), 'eror', 'Hello world');
	    }).to.throw('Invalid level');
	
	    done();
	  });
	
	  it("should error if missing message && err && custom", function(done) {
	    var notifier = new Notifier();
	
	    expect(function() {
	      notifier._buildPayload(new Date(), 'error');
	    }).to.throw('No message, stack info or custom data');
	
	    done();
	  });
	
	  it("should scrub appropriate fields", function(done) {
	    var notifier = new Notifier();
	
	    var custom = {
	      password: 'hidden',
	      visible: 'visible'
	    };
	
	    var spy = sinon.spy(notifier, "_scrub");
	
	    var payload = notifier._buildPayload(new Date(), 'error', 'Hello world', null, custom);
	
	    expect(spy.called).to.be.true;
	
	    var call = spy.getCall(0);
	    var scrubbedPayload = call.args[0];
	
	    expect(payload.data).to.equal(scrubbedPayload);
	    expect(payload.data).to.deep.equal(scrubbedPayload);
	
	    expect(payload.data.body.message.extra.password).to.equal('******');
	    expect(payload.data.body.message.extra.visible).to.equal('visible');
	
	    done();
	  });
	
	  it("should not scrub top-level access_token field", function(done) {
	    var notifier = new Notifier();
	    notifier.configure({accessToken: 'access token', scrubFields: ['access_token']});
	
	    var custom = {
	      access_token: 'hidden',
	      visible: 'visible'
	    };
	
	    var spy = sinon.spy(notifier, "_scrub");
	
	    var payload = notifier._buildPayload(new Date(), 'error', 'Hello world', null, custom);
	
	    expect(spy.called).to.be.true;
	
	    var call = spy.getCall(0);
	    var scrubbedPayload = call.args[0];
	
	    expect(payload.data).to.equal(scrubbedPayload);
	    expect(payload.data).to.deep.equal(scrubbedPayload);
	
	    expect(payload.access_token).to.equal('access token');
	    expect(payload.data.body.message.extra.access_token).to.equal('******');
	    expect(payload.data.body.message.extra.visible).to.equal('visible');
	
	    done();
	  });
	
	  it("should not contain any global options", function(done) {
	    var notifier = new Notifier();
	
	    var payload = notifier._buildPayload(new Date(), 'error', 'Hello world');
	
	    expect(payload).to.not.have.keys(Object.keys(window._globalRollbarOptions));
	
	    done();
	  });
	});
	
	
	/*
	 * Notifier._scrub(obj)
	 */
	
	describe("Notifier._scrub()", function() {
	  it("should return an object with scrubbed values using default scrub fields", function(done) {
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
	
	    expect(payload).to.deep.equal({
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
	
	describe("Notifier._internalCheckIgnore()", function() {
	  it("should ignore items below reportLevel", function(done) {
	    var notifier = new Notifier();
	
	    notifier.options.reportLevel = 'warning';
	
	    var payload = notifier._buildPayload(new Date(), 'info', 'test');
	    var result = notifier._internalCheckIgnore(false, ['info'], payload);
	
	    expect(result).to.be.true;
	
	    payload = notifier._buildPayload(new Date(), 'warning', 'test');
	    result = notifier._internalCheckIgnore(false, ['warning'], payload);
	
	    expect(result).to.be.false;
	
	    done();
	  });
	});
	
	describe("Notifier.wrap()", function() {
	  it("should catch uncaught errors in wrapped functions and save to window._rollbarWrappedError", function(done) {
	    var notifier = new Notifier();
	
	    var wrapped = notifier.wrap(function() {
	      var a = b;
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
	
	  it("should copy over function properties to the wrapped version", function(done) {
	    var notifier = new Notifier();
	
	    var func = function() {
	      var a = b;
	    };
	
	    func.foo = 'bar';
	
	    var wrapped = notifier.wrap(func);
	
	    expect(wrapped.foo).to.equal('bar');
	
	    done();
	  });
	
	  it("should set window._rollbarWrappedError._rollbarContext", function(done) {
	    var notifier = new Notifier();
	
	    // Wrap with a context
	    var wrapped = notifier.wrap(function() {
	      var a = b;
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
	      var a = b;
	    }, function() {return {custom: 'context_from_function'}});
	
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
	      var a = b;
	    }, function() { var a = 1; a+= 1; });
	
	    window._rollbarWrappedError = null;
	
	    try {
	      wrapped();
	    } catch (e) {
	      expect(window._rollbarWrappedError).to.not.equal(null);
	      expect(window._rollbarWrappedError.constructor).to.equal(ReferenceError);
	      expect(window._rollbarWrappedError._rollbarContext).to.not.equal(null);
	      expect(window._rollbarWrappedError._rollbarContext._wrappedSource).to.be.a('string');
	    }
	
	    done();
	  });
	
	  it("should not double wrap functions", function(done) {
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
	
	  it("should let non-functions pass through unchanged", function() {
	    var object = {};
	    expect(window.Rollbar.wrap(object)).to.be.equal(object);
	  });
	});
	
	/*
	 * Notifier._urlIsWhitelisted(payload)
	 */
	describe("Notifier._urlIsWhitelisted()", function() {
	
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
	    notifier.configure({ hostWhiteList: whitelist });
	    return notifier;
	  }
	
	  it("should return true with an empty config", function(){
	    var notifier = new Notifier();
	    var payload = buildPayloadWithFrame({ filename: 'example.com/js/somefile' });
	    expect(notifier._urlIsWhitelisted(payload)).to.equal(true);
	  });
	
	  it("should return true with an empty payload", function(){
	    var notifier = buildNotifierWithWhitelist(["example.com"]);
	    var payload = {};
	    expect(notifier._urlIsWhitelisted(payload)).to.equal(true);
	  });
	
	  it("should return true with a url matching the whitelist", function(){
	    var notifier = buildNotifierWithWhitelist(["example.com"]);
	    var payload = buildPayloadWithFrame({ filename: 'example.com/js/somefile' });
	    expect(notifier._urlIsWhitelisted(payload)).to.equal(true);
	  });
	
	  it("should return false with a url not matching the whitelist",function(){
	    var notifier = buildNotifierWithWhitelist(["example.com"]);
	    var payload = buildPayloadWithFrame({ filename: 'sample.com/js/somefile' });
	    expect(notifier._urlIsWhitelisted(payload)).to.equal(false);
	  });
	
	  it("should return pass the whitelist to child notifiers",function(){
	    var notifier = buildNotifierWithWhitelist(["example.com"]);
	    var child = notifier.scope();
	    var payload = buildPayloadWithFrame({ filename: 'sample.com/js/somefile' });
	    expect(child._urlIsWhitelisted(payload)).to.equal(false);
	  });
	
	  it("should respect multiple white-listed domains",function(){
	    var notifier = buildNotifierWithWhitelist(["example.com", "sample.com"]);
	    var child = notifier.scope();
	    var payload = buildPayloadWithFrame({ filename: 'sample.com/js/somefile' });
	    expect(child._urlIsWhitelisted(payload)).to.equal(true);
	
	    payload = buildPayloadWithFrame({ filename: 'example.com/js/somefile' });
	    expect(child._urlIsWhitelisted(payload)).to.equal(true);
	
	    payload = buildPayloadWithFrame({ filename: 'not-on-the-list.com/js/somefile' });
	    expect(child._urlIsWhitelisted(payload)).to.equal(false);
	  });
	
	});
	
	/*
	 * Notifier._messageIsIgnored(payload)
	 */
	describe("Notifier._messageIsIgnored()", function(){
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
	
	  it("should return false with an empty config", function(){
	    var notifier = new Notifier();
	    var payload = buildPayloadWithExceptionMessage('');
	    expect(notifier._messageIsIgnored(payload)).to.equal(false);
	  });
	
	  it("should return false with an empty payload", function(){
	    var notifier = buildNotifierWithIgnoredMessages(["Divided by 0! What did you do?!"]);
	    var payload = {};
	    expect(notifier._messageIsIgnored(payload)).to.equal(false);
	  });
	
	  it("should return true with a message matching the ignored message", function(){
	    var notifier = buildNotifierWithIgnoredMessages(["Null is an abstract concept.", "Error: 0.1 + 0.2 is not what you think!"]);
	    var payload = buildPayloadWithExceptionMessage("Null is an abstract concept.");
	    expect(notifier._messageIsIgnored(payload)).to.equal(true);
	  });
	
	  it("should return false when a message does not match any ignored message", function(){
	    var notifier = buildNotifierWithIgnoredMessages(["Error: MySpace profile contains no animated gif.", "Warning: Github is down!"]);
	    var payload = buildPayloadWithExceptionMessage("Exception: Not all llamas are ugly.");
	    expect(notifier._messageIsIgnored(payload)).to.equal(false);
	  });
	
	  it("child notifiers should not ignore the parent's messages", function(){
	    var notifier = buildNotifierWithIgnoredMessages(["err1", "err2"]);
	    var child = notifier.scope();
	    var payload1 = buildPayloadWithExceptionMessage("err1");
	    var payload2 = buildPayloadWithExceptionMessage("err2");
	    var payload3 = buildPayloadWithExceptionMessage("err3");
	    expect(child._messageIsIgnored(payload1)).to.equal(true);
	    expect(child._messageIsIgnored(payload2)).to.equal(true);
	
	    var child2 = child.scope();
	    child2.configure({ignoredMessages: ['err3']});
	    expect(child2._messageIsIgnored(payload2)).to.equal(false);
	    expect(child2._messageIsIgnored(payload3)).to.equal(true);
	
	    expect(child._messageIsIgnored(payload3)).to.equal(false);
	    expect(child._messageIsIgnored(payload3)).to.equal(false);
	  });
	});
	
	/*
	 * Notifier._logToFunction
	 */
	 describe("Notifier._logToFunction()", function(){
	   function buildNotifierWithLogFunction(cb){
	     var notifier = new Notifier();
	     notifier.configure({ logFunction : cb });
	     return notifier;
	   }
	
	  it("ignores a null log function", function(){
	    var notifier = buildNotifierWithLogFunction(null);
	    var fn = function(){ notifier._enqueuePayload({}, false, {}, null); };
	    expect(fn).to.not.throw(Error);
	  });
	
	  it("ignores an undefined log function", function(){
	    var notifier = buildNotifierWithLogFunction();
	    var fn = function(){ notifier._enqueuePayload({}, false, {}, null); };
	    expect(fn).to.not.throw(Error);
	  });
	
	  it("calls the given log function", function(){
	    var logFunc = function(){ logFunc.called = true; };
	    var notifier = buildNotifierWithLogFunction(logFunc);
	    expect(logFunc.called).to.be.undefined;
	    notifier._enqueuePayload({}, false, {}, null)
	    expect(logFunc.called).to.equal(true);
	  });
	 });


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9)(__webpack_require__(10)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/jon/rollbar/rollbar.js/test/lib/mocha/mocha.js")

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9)(__webpack_require__(11)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/jon/rollbar/rollbar.js/test/lib/chai/chai.js")

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9)(__webpack_require__(12)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/jon/rollbar/rollbar.js/test/lib/sinon/sinon-1.7.3.js")

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript === "function")
			execScript(src);
		else
			eval.call(null, src);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ";(function(){\n\n// CommonJS require()\n\nfunction require(p){\n    var path = require.resolve(p)\n      , mod = require.modules[path];\n    if (!mod) throw new Error('failed to require \"' + p + '\"');\n    if (!mod.exports) {\n      mod.exports = {};\n      mod.call(mod.exports, mod, mod.exports, require.relative(path));\n    }\n    return mod.exports;\n  }\n\nrequire.modules = {};\n\nrequire.resolve = function (path){\n    var orig = path\n      , reg = path + '.js'\n      , index = path + '/index.js';\n    return require.modules[reg] && reg\n      || require.modules[index] && index\n      || orig;\n  };\n\nrequire.register = function (path, fn){\n    require.modules[path] = fn;\n  };\n\nrequire.relative = function (parent) {\n    return function(p){\n      if ('.' != p.charAt(0)) return require(p);\n\n      var path = parent.split('/')\n        , segs = p.split('/');\n      path.pop();\n\n      for (var i = 0; i < segs.length; i++) {\n        var seg = segs[i];\n        if ('..' == seg) path.pop();\n        else if ('.' != seg) path.push(seg);\n      }\n\n      return require(path.join('/'));\n    };\n  };\n\n\nrequire.register(\"browser/debug.js\", function(module, exports, require){\n\nmodule.exports = function(type){\n  return function(){\n  }\n};\n\n}); // module: browser/debug.js\n\nrequire.register(\"browser/diff.js\", function(module, exports, require){\n/* See LICENSE file for terms of use */\n\n/*\n * Text diff implementation.\n *\n * This library supports the following APIS:\n * JsDiff.diffChars: Character by character diff\n * JsDiff.diffWords: Word (as defined by \\b regex) diff which ignores whitespace\n * JsDiff.diffLines: Line based diff\n *\n * JsDiff.diffCss: Diff targeted at CSS content\n *\n * These methods are based on the implementation proposed in\n * \"An O(ND) Difference Algorithm and its Variations\" (Myers, 1986).\n * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927\n */\nvar JsDiff = (function() {\n  /*jshint maxparams: 5*/\n  function clonePath(path) {\n    return { newPos: path.newPos, components: path.components.slice(0) };\n  }\n  function removeEmpty(array) {\n    var ret = [];\n    for (var i = 0; i < array.length; i++) {\n      if (array[i]) {\n        ret.push(array[i]);\n      }\n    }\n    return ret;\n  }\n  function escapeHTML(s) {\n    var n = s;\n    n = n.replace(/&/g, '&amp;');\n    n = n.replace(/</g, '&lt;');\n    n = n.replace(/>/g, '&gt;');\n    n = n.replace(/\"/g, '&quot;');\n\n    return n;\n  }\n\n  var Diff = function(ignoreWhitespace) {\n    this.ignoreWhitespace = ignoreWhitespace;\n  };\n  Diff.prototype = {\n      diff: function(oldString, newString) {\n        // Handle the identity case (this is due to unrolling editLength == 0\n        if (newString === oldString) {\n          return [{ value: newString }];\n        }\n        if (!newString) {\n          return [{ value: oldString, removed: true }];\n        }\n        if (!oldString) {\n          return [{ value: newString, added: true }];\n        }\n\n        newString = this.tokenize(newString);\n        oldString = this.tokenize(oldString);\n\n        var newLen = newString.length, oldLen = oldString.length;\n        var maxEditLength = newLen + oldLen;\n        var bestPath = [{ newPos: -1, components: [] }];\n\n        // Seed editLength = 0\n        var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);\n        if (bestPath[0].newPos+1 >= newLen && oldPos+1 >= oldLen) {\n          return bestPath[0].components;\n        }\n\n        for (var editLength = 1; editLength <= maxEditLength; editLength++) {\n          for (var diagonalPath = -1*editLength; diagonalPath <= editLength; diagonalPath+=2) {\n            var basePath;\n            var addPath = bestPath[diagonalPath-1],\n                removePath = bestPath[diagonalPath+1];\n            oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;\n            if (addPath) {\n              // No one else is going to attempt to use this value, clear it\n              bestPath[diagonalPath-1] = undefined;\n            }\n\n            var canAdd = addPath && addPath.newPos+1 < newLen;\n            var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;\n            if (!canAdd && !canRemove) {\n              bestPath[diagonalPath] = undefined;\n              continue;\n            }\n\n            // Select the diagonal that we want to branch from. We select the prior\n            // path whose position in the new string is the farthest from the origin\n            // and does not pass the bounds of the diff graph\n            if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {\n              basePath = clonePath(removePath);\n              this.pushComponent(basePath.components, oldString[oldPos], undefined, true);\n            } else {\n              basePath = clonePath(addPath);\n              basePath.newPos++;\n              this.pushComponent(basePath.components, newString[basePath.newPos], true, undefined);\n            }\n\n            var oldPos = this.extractCommon(basePath, newString, oldString, diagonalPath);\n\n            if (basePath.newPos+1 >= newLen && oldPos+1 >= oldLen) {\n              return basePath.components;\n            } else {\n              bestPath[diagonalPath] = basePath;\n            }\n          }\n        }\n      },\n\n      pushComponent: function(components, value, added, removed) {\n        var last = components[components.length-1];\n        if (last && last.added === added && last.removed === removed) {\n          // We need to clone here as the component clone operation is just\n          // as shallow array clone\n          components[components.length-1] =\n            {value: this.join(last.value, value), added: added, removed: removed };\n        } else {\n          components.push({value: value, added: added, removed: removed });\n        }\n      },\n      extractCommon: function(basePath, newString, oldString, diagonalPath) {\n        var newLen = newString.length,\n            oldLen = oldString.length,\n            newPos = basePath.newPos,\n            oldPos = newPos - diagonalPath;\n        while (newPos+1 < newLen && oldPos+1 < oldLen && this.equals(newString[newPos+1], oldString[oldPos+1])) {\n          newPos++;\n          oldPos++;\n\n          this.pushComponent(basePath.components, newString[newPos], undefined, undefined);\n        }\n        basePath.newPos = newPos;\n        return oldPos;\n      },\n\n      equals: function(left, right) {\n        var reWhitespace = /\\S/;\n        if (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right)) {\n          return true;\n        } else {\n          return left === right;\n        }\n      },\n      join: function(left, right) {\n        return left + right;\n      },\n      tokenize: function(value) {\n        return value;\n      }\n  };\n\n  var CharDiff = new Diff();\n\n  var WordDiff = new Diff(true);\n  var WordWithSpaceDiff = new Diff();\n  WordDiff.tokenize = WordWithSpaceDiff.tokenize = function(value) {\n    return removeEmpty(value.split(/(\\s+|\\b)/));\n  };\n\n  var CssDiff = new Diff(true);\n  CssDiff.tokenize = function(value) {\n    return removeEmpty(value.split(/([{}:;,]|\\s+)/));\n  };\n\n  var LineDiff = new Diff();\n  LineDiff.tokenize = function(value) {\n    return value.split(/^/m);\n  };\n\n  return {\n    Diff: Diff,\n\n    diffChars: function(oldStr, newStr) { return CharDiff.diff(oldStr, newStr); },\n    diffWords: function(oldStr, newStr) { return WordDiff.diff(oldStr, newStr); },\n    diffWordsWithSpace: function(oldStr, newStr) { return WordWithSpaceDiff.diff(oldStr, newStr); },\n    diffLines: function(oldStr, newStr) { return LineDiff.diff(oldStr, newStr); },\n\n    diffCss: function(oldStr, newStr) { return CssDiff.diff(oldStr, newStr); },\n\n    createPatch: function(fileName, oldStr, newStr, oldHeader, newHeader) {\n      var ret = [];\n\n      ret.push('Index: ' + fileName);\n      ret.push('===================================================================');\n      ret.push('--- ' + fileName + (typeof oldHeader === 'undefined' ? '' : '\\t' + oldHeader));\n      ret.push('+++ ' + fileName + (typeof newHeader === 'undefined' ? '' : '\\t' + newHeader));\n\n      var diff = LineDiff.diff(oldStr, newStr);\n      if (!diff[diff.length-1].value) {\n        diff.pop();   // Remove trailing newline add\n      }\n      diff.push({value: '', lines: []});   // Append an empty value to make cleanup easier\n\n      function contextLines(lines) {\n        return lines.map(function(entry) { return ' ' + entry; });\n      }\n      function eofNL(curRange, i, current) {\n        var last = diff[diff.length-2],\n            isLast = i === diff.length-2,\n            isLastOfType = i === diff.length-3 && (current.added !== last.added || current.removed !== last.removed);\n\n        // Figure out if this is the last line for the given file and missing NL\n        if (!/\\n$/.test(current.value) && (isLast || isLastOfType)) {\n          curRange.push('\\\\ No newline at end of file');\n        }\n      }\n\n      var oldRangeStart = 0, newRangeStart = 0, curRange = [],\n          oldLine = 1, newLine = 1;\n      for (var i = 0; i < diff.length; i++) {\n        var current = diff[i],\n            lines = current.lines || current.value.replace(/\\n$/, '').split('\\n');\n        current.lines = lines;\n\n        if (current.added || current.removed) {\n          if (!oldRangeStart) {\n            var prev = diff[i-1];\n            oldRangeStart = oldLine;\n            newRangeStart = newLine;\n\n            if (prev) {\n              curRange = contextLines(prev.lines.slice(-4));\n              oldRangeStart -= curRange.length;\n              newRangeStart -= curRange.length;\n            }\n          }\n          curRange.push.apply(curRange, lines.map(function(entry) { return (current.added?'+':'-') + entry; }));\n          eofNL(curRange, i, current);\n\n          if (current.added) {\n            newLine += lines.length;\n          } else {\n            oldLine += lines.length;\n          }\n        } else {\n          if (oldRangeStart) {\n            // Close out any changes that have been output (or join overlapping)\n            if (lines.length <= 8 && i < diff.length-2) {\n              // Overlapping\n              curRange.push.apply(curRange, contextLines(lines));\n            } else {\n              // end the range and output\n              var contextSize = Math.min(lines.length, 4);\n              ret.push(\n                  '@@ -' + oldRangeStart + ',' + (oldLine-oldRangeStart+contextSize)\n                  + ' +' + newRangeStart + ',' + (newLine-newRangeStart+contextSize)\n                  + ' @@');\n              ret.push.apply(ret, curRange);\n              ret.push.apply(ret, contextLines(lines.slice(0, contextSize)));\n              if (lines.length <= 4) {\n                eofNL(ret, i, current);\n              }\n\n              oldRangeStart = 0;  newRangeStart = 0; curRange = [];\n            }\n          }\n          oldLine += lines.length;\n          newLine += lines.length;\n        }\n      }\n\n      return ret.join('\\n') + '\\n';\n    },\n\n    applyPatch: function(oldStr, uniDiff) {\n      var diffstr = uniDiff.split('\\n');\n      var diff = [];\n      var remEOFNL = false,\n          addEOFNL = false;\n\n      for (var i = (diffstr[0][0]==='I'?4:0); i < diffstr.length; i++) {\n        if(diffstr[i][0] === '@') {\n          var meh = diffstr[i].split(/@@ -(\\d+),(\\d+) \\+(\\d+),(\\d+) @@/);\n          diff.unshift({\n            start:meh[3],\n            oldlength:meh[2],\n            oldlines:[],\n            newlength:meh[4],\n            newlines:[]\n          });\n        } else if(diffstr[i][0] === '+') {\n          diff[0].newlines.push(diffstr[i].substr(1));\n        } else if(diffstr[i][0] === '-') {\n          diff[0].oldlines.push(diffstr[i].substr(1));\n        } else if(diffstr[i][0] === ' ') {\n          diff[0].newlines.push(diffstr[i].substr(1));\n          diff[0].oldlines.push(diffstr[i].substr(1));\n        } else if(diffstr[i][0] === '\\\\') {\n          if (diffstr[i-1][0] === '+') {\n            remEOFNL = true;\n          } else if(diffstr[i-1][0] === '-') {\n            addEOFNL = true;\n          }\n        }\n      }\n\n      var str = oldStr.split('\\n');\n      for (var i = diff.length - 1; i >= 0; i--) {\n        var d = diff[i];\n        for (var j = 0; j < d.oldlength; j++) {\n          if(str[d.start-1+j] !== d.oldlines[j]) {\n            return false;\n          }\n        }\n        Array.prototype.splice.apply(str,[d.start-1,+d.oldlength].concat(d.newlines));\n      }\n\n      if (remEOFNL) {\n        while (!str[str.length-1]) {\n          str.pop();\n        }\n      } else if (addEOFNL) {\n        str.push('');\n      }\n      return str.join('\\n');\n    },\n\n    convertChangesToXML: function(changes){\n      var ret = [];\n      for ( var i = 0; i < changes.length; i++) {\n        var change = changes[i];\n        if (change.added) {\n          ret.push('<ins>');\n        } else if (change.removed) {\n          ret.push('<del>');\n        }\n\n        ret.push(escapeHTML(change.value));\n\n        if (change.added) {\n          ret.push('</ins>');\n        } else if (change.removed) {\n          ret.push('</del>');\n        }\n      }\n      return ret.join('');\n    },\n\n    // See: http://code.google.com/p/google-diff-match-patch/wiki/API\n    convertChangesToDMP: function(changes){\n      var ret = [], change;\n      for ( var i = 0; i < changes.length; i++) {\n        change = changes[i];\n        ret.push([(change.added ? 1 : change.removed ? -1 : 0), change.value]);\n      }\n      return ret;\n    }\n  };\n})();\n\nif (typeof module !== 'undefined') {\n    module.exports = JsDiff;\n}\n\n}); // module: browser/diff.js\n\nrequire.register(\"browser/events.js\", function(module, exports, require){\n\n/**\n * Module exports.\n */\n\nexports.EventEmitter = EventEmitter;\n\n/**\n * Check if `obj` is an array.\n */\n\nfunction isArray(obj) {\n  return '[object Array]' == {}.toString.call(obj);\n}\n\n/**\n * Event emitter constructor.\n *\n * @api public\n */\n\nfunction EventEmitter(){};\n\n/**\n * Adds a listener.\n *\n * @api public\n */\n\nEventEmitter.prototype.on = function (name, fn) {\n  if (!this.$events) {\n    this.$events = {};\n  }\n\n  if (!this.$events[name]) {\n    this.$events[name] = fn;\n  } else if (isArray(this.$events[name])) {\n    this.$events[name].push(fn);\n  } else {\n    this.$events[name] = [this.$events[name], fn];\n  }\n\n  return this;\n};\n\nEventEmitter.prototype.addListener = EventEmitter.prototype.on;\n\n/**\n * Adds a volatile listener.\n *\n * @api public\n */\n\nEventEmitter.prototype.once = function (name, fn) {\n  var self = this;\n\n  function on () {\n    self.removeListener(name, on);\n    fn.apply(this, arguments);\n  };\n\n  on.listener = fn;\n  this.on(name, on);\n\n  return this;\n};\n\n/**\n * Removes a listener.\n *\n * @api public\n */\n\nEventEmitter.prototype.removeListener = function (name, fn) {\n  if (this.$events && this.$events[name]) {\n    var list = this.$events[name];\n\n    if (isArray(list)) {\n      var pos = -1;\n\n      for (var i = 0, l = list.length; i < l; i++) {\n        if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {\n          pos = i;\n          break;\n        }\n      }\n\n      if (pos < 0) {\n        return this;\n      }\n\n      list.splice(pos, 1);\n\n      if (!list.length) {\n        delete this.$events[name];\n      }\n    } else if (list === fn || (list.listener && list.listener === fn)) {\n      delete this.$events[name];\n    }\n  }\n\n  return this;\n};\n\n/**\n * Removes all listeners for an event.\n *\n * @api public\n */\n\nEventEmitter.prototype.removeAllListeners = function (name) {\n  if (name === undefined) {\n    this.$events = {};\n    return this;\n  }\n\n  if (this.$events && this.$events[name]) {\n    this.$events[name] = null;\n  }\n\n  return this;\n};\n\n/**\n * Gets all listeners for a certain event.\n *\n * @api public\n */\n\nEventEmitter.prototype.listeners = function (name) {\n  if (!this.$events) {\n    this.$events = {};\n  }\n\n  if (!this.$events[name]) {\n    this.$events[name] = [];\n  }\n\n  if (!isArray(this.$events[name])) {\n    this.$events[name] = [this.$events[name]];\n  }\n\n  return this.$events[name];\n};\n\n/**\n * Emits an event.\n *\n * @api public\n */\n\nEventEmitter.prototype.emit = function (name) {\n  if (!this.$events) {\n    return false;\n  }\n\n  var handler = this.$events[name];\n\n  if (!handler) {\n    return false;\n  }\n\n  var args = [].slice.call(arguments, 1);\n\n  if ('function' == typeof handler) {\n    handler.apply(this, args);\n  } else if (isArray(handler)) {\n    var listeners = handler.slice();\n\n    for (var i = 0, l = listeners.length; i < l; i++) {\n      listeners[i].apply(this, args);\n    }\n  } else {\n    return false;\n  }\n\n  return true;\n};\n}); // module: browser/events.js\n\nrequire.register(\"browser/fs.js\", function(module, exports, require){\n\n}); // module: browser/fs.js\n\nrequire.register(\"browser/path.js\", function(module, exports, require){\n\n}); // module: browser/path.js\n\nrequire.register(\"browser/progress.js\", function(module, exports, require){\n\n/**\n * Expose `Progress`.\n */\n\nmodule.exports = Progress;\n\n/**\n * Initialize a new `Progress` indicator.\n */\n\nfunction Progress() {\n  this.percent = 0;\n  this.size(0);\n  this.fontSize(11);\n  this.font('helvetica, arial, sans-serif');\n}\n\n/**\n * Set progress size to `n`.\n *\n * @param {Number} n\n * @return {Progress} for chaining\n * @api public\n */\n\nProgress.prototype.size = function(n){\n  this._size = n;\n  return this;\n};\n\n/**\n * Set text to `str`.\n *\n * @param {String} str\n * @return {Progress} for chaining\n * @api public\n */\n\nProgress.prototype.text = function(str){\n  this._text = str;\n  return this;\n};\n\n/**\n * Set font size to `n`.\n *\n * @param {Number} n\n * @return {Progress} for chaining\n * @api public\n */\n\nProgress.prototype.fontSize = function(n){\n  this._fontSize = n;\n  return this;\n};\n\n/**\n * Set font `family`.\n *\n * @param {String} family\n * @return {Progress} for chaining\n */\n\nProgress.prototype.font = function(family){\n  this._font = family;\n  return this;\n};\n\n/**\n * Update percentage to `n`.\n *\n * @param {Number} n\n * @return {Progress} for chaining\n */\n\nProgress.prototype.update = function(n){\n  this.percent = n;\n  return this;\n};\n\n/**\n * Draw on `ctx`.\n *\n * @param {CanvasRenderingContext2d} ctx\n * @return {Progress} for chaining\n */\n\nProgress.prototype.draw = function(ctx){\n  var percent = Math.min(this.percent, 100)\n    , size = this._size\n    , half = size / 2\n    , x = half\n    , y = half\n    , rad = half - 1\n    , fontSize = this._fontSize;\n\n  ctx.font = fontSize + 'px ' + this._font;\n\n  var angle = Math.PI * 2 * (percent / 100);\n  ctx.clearRect(0, 0, size, size);\n\n  // outer circle\n  ctx.strokeStyle = '#9f9f9f';\n  ctx.beginPath();\n  ctx.arc(x, y, rad, 0, angle, false);\n  ctx.stroke();\n\n  // inner circle\n  ctx.strokeStyle = '#eee';\n  ctx.beginPath();\n  ctx.arc(x, y, rad - 1, 0, angle, true);\n  ctx.stroke();\n\n  // text\n  var text = this._text || (percent | 0) + '%'\n    , w = ctx.measureText(text).width;\n\n  ctx.fillText(\n      text\n    , x - w / 2 + 1\n    , y + fontSize / 2 - 1);\n\n  return this;\n};\n\n}); // module: browser/progress.js\n\nrequire.register(\"browser/tty.js\", function(module, exports, require){\n\nexports.isatty = function(){\n  return true;\n};\n\nexports.getWindowSize = function(){\n  if ('innerHeight' in global) {\n    return [global.innerHeight, global.innerWidth];\n  } else {\n    // In a Web Worker, the DOM Window is not available.\n    return [640, 480];\n  }\n};\n\n}); // module: browser/tty.js\n\nrequire.register(\"context.js\", function(module, exports, require){\n\n/**\n * Expose `Context`.\n */\n\nmodule.exports = Context;\n\n/**\n * Initialize a new `Context`.\n *\n * @api private\n */\n\nfunction Context(){}\n\n/**\n * Set or get the context `Runnable` to `runnable`.\n *\n * @param {Runnable} runnable\n * @return {Context}\n * @api private\n */\n\nContext.prototype.runnable = function(runnable){\n  if (0 == arguments.length) return this._runnable;\n  this.test = this._runnable = runnable;\n  return this;\n};\n\n/**\n * Set test timeout `ms`.\n *\n * @param {Number} ms\n * @return {Context} self\n * @api private\n */\n\nContext.prototype.timeout = function(ms){\n  this.runnable().timeout(ms);\n  return this;\n};\n\n/**\n * Set test slowness threshold `ms`.\n *\n * @param {Number} ms\n * @return {Context} self\n * @api private\n */\n\nContext.prototype.slow = function(ms){\n  this.runnable().slow(ms);\n  return this;\n};\n\n/**\n * Inspect the context void of `._runnable`.\n *\n * @return {String}\n * @api private\n */\n\nContext.prototype.inspect = function(){\n  return JSON.stringify(this, function(key, val){\n    if ('_runnable' == key) return;\n    if ('test' == key) return;\n    return val;\n  }, 2);\n};\n\n}); // module: context.js\n\nrequire.register(\"hook.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Runnable = require('./runnable');\n\n/**\n * Expose `Hook`.\n */\n\nmodule.exports = Hook;\n\n/**\n * Initialize a new `Hook` with the given `title` and callback `fn`.\n *\n * @param {String} title\n * @param {Function} fn\n * @api private\n */\n\nfunction Hook(title, fn) {\n  Runnable.call(this, title, fn);\n  this.type = 'hook';\n}\n\n/**\n * Inherit from `Runnable.prototype`.\n */\n\nfunction F(){};\nF.prototype = Runnable.prototype;\nHook.prototype = new F;\nHook.prototype.constructor = Hook;\n\n\n/**\n * Get or set the test `err`.\n *\n * @param {Error} err\n * @return {Error}\n * @api public\n */\n\nHook.prototype.error = function(err){\n  if (0 == arguments.length) {\n    var err = this._error;\n    this._error = null;\n    return err;\n  }\n\n  this._error = err;\n};\n\n}); // module: hook.js\n\nrequire.register(\"interfaces/bdd.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite')\n  , Test = require('../test')\n  , utils = require('../utils');\n\n/**\n * BDD-style interface:\n *\n *      describe('Array', function(){\n *        describe('#indexOf()', function(){\n *          it('should return -1 when not present', function(){\n *\n *          });\n *\n *          it('should return the index when present', function(){\n *\n *          });\n *        });\n *      });\n *\n */\n\nmodule.exports = function(suite){\n  var suites = [suite];\n\n  suite.on('pre-require', function(context, file, mocha){\n\n    /**\n     * Execute before running tests.\n     */\n\n    context.before = function(fn){\n      suites[0].beforeAll(fn);\n    };\n\n    /**\n     * Execute after running tests.\n     */\n\n    context.after = function(fn){\n      suites[0].afterAll(fn);\n    };\n\n    /**\n     * Execute before each test case.\n     */\n\n    context.beforeEach = function(fn){\n      suites[0].beforeEach(fn);\n    };\n\n    /**\n     * Execute after each test case.\n     */\n\n    context.afterEach = function(fn){\n      suites[0].afterEach(fn);\n    };\n\n    /**\n     * Describe a \"suite\" with the given `title`\n     * and callback `fn` containing nested suites\n     * and/or tests.\n     */\n\n    context.describe = context.context = function(title, fn){\n      var suite = Suite.create(suites[0], title);\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n      return suite;\n    };\n\n    /**\n     * Pending describe.\n     */\n\n    context.xdescribe =\n    context.xcontext =\n    context.describe.skip = function(title, fn){\n      var suite = Suite.create(suites[0], title);\n      suite.pending = true;\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n    };\n\n    /**\n     * Exclusive suite.\n     */\n\n    context.describe.only = function(title, fn){\n      var suite = context.describe(title, fn);\n      mocha.grep(suite.fullTitle());\n      return suite;\n    };\n\n    /**\n     * Describe a specification or test-case\n     * with the given `title` and callback `fn`\n     * acting as a thunk.\n     */\n\n    context.it = context.specify = function(title, fn){\n      var suite = suites[0];\n      if (suite.pending) var fn = null;\n      var test = new Test(title, fn);\n      suite.addTest(test);\n      return test;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.it.only = function(title, fn){\n      var test = context.it(title, fn);\n      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';\n      mocha.grep(new RegExp(reString));\n      return test;\n    };\n\n    /**\n     * Pending test case.\n     */\n\n    context.xit =\n    context.xspecify =\n    context.it.skip = function(title){\n      context.it(title);\n    };\n  });\n};\n\n}); // module: interfaces/bdd.js\n\nrequire.register(\"interfaces/exports.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite')\n  , Test = require('../test');\n\n/**\n * TDD-style interface:\n *\n *     exports.Array = {\n *       '#indexOf()': {\n *         'should return -1 when the value is not present': function(){\n *\n *         },\n *\n *         'should return the correct index when the value is present': function(){\n *\n *         }\n *       }\n *     };\n *\n */\n\nmodule.exports = function(suite){\n  var suites = [suite];\n\n  suite.on('require', visit);\n\n  function visit(obj) {\n    var suite;\n    for (var key in obj) {\n      if ('function' == typeof obj[key]) {\n        var fn = obj[key];\n        switch (key) {\n          case 'before':\n            suites[0].beforeAll(fn);\n            break;\n          case 'after':\n            suites[0].afterAll(fn);\n            break;\n          case 'beforeEach':\n            suites[0].beforeEach(fn);\n            break;\n          case 'afterEach':\n            suites[0].afterEach(fn);\n            break;\n          default:\n            suites[0].addTest(new Test(key, fn));\n        }\n      } else {\n        var suite = Suite.create(suites[0], key);\n        suites.unshift(suite);\n        visit(obj[key]);\n        suites.shift();\n      }\n    }\n  }\n};\n\n}); // module: interfaces/exports.js\n\nrequire.register(\"interfaces/index.js\", function(module, exports, require){\n\nexports.bdd = require('./bdd');\nexports.tdd = require('./tdd');\nexports.qunit = require('./qunit');\nexports.exports = require('./exports');\n\n}); // module: interfaces/index.js\n\nrequire.register(\"interfaces/qunit.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite')\n  , Test = require('../test')\n  , utils = require('../utils');\n\n/**\n * QUnit-style interface:\n *\n *     suite('Array');\n *\n *     test('#length', function(){\n *       var arr = [1,2,3];\n *       ok(arr.length == 3);\n *     });\n *\n *     test('#indexOf()', function(){\n *       var arr = [1,2,3];\n *       ok(arr.indexOf(1) == 0);\n *       ok(arr.indexOf(2) == 1);\n *       ok(arr.indexOf(3) == 2);\n *     });\n *\n *     suite('String');\n *\n *     test('#length', function(){\n *       ok('foo'.length == 3);\n *     });\n *\n */\n\nmodule.exports = function(suite){\n  var suites = [suite];\n\n  suite.on('pre-require', function(context, file, mocha){\n\n    /**\n     * Execute before running tests.\n     */\n\n    context.before = function(fn){\n      suites[0].beforeAll(fn);\n    };\n\n    /**\n     * Execute after running tests.\n     */\n\n    context.after = function(fn){\n      suites[0].afterAll(fn);\n    };\n\n    /**\n     * Execute before each test case.\n     */\n\n    context.beforeEach = function(fn){\n      suites[0].beforeEach(fn);\n    };\n\n    /**\n     * Execute after each test case.\n     */\n\n    context.afterEach = function(fn){\n      suites[0].afterEach(fn);\n    };\n\n    /**\n     * Describe a \"suite\" with the given `title`.\n     */\n\n    context.suite = function(title){\n      if (suites.length > 1) suites.shift();\n      var suite = Suite.create(suites[0], title);\n      suites.unshift(suite);\n      return suite;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.suite.only = function(title, fn){\n      var suite = context.suite(title, fn);\n      mocha.grep(suite.fullTitle());\n    };\n\n    /**\n     * Describe a specification or test-case\n     * with the given `title` and callback `fn`\n     * acting as a thunk.\n     */\n\n    context.test = function(title, fn){\n      var test = new Test(title, fn);\n      suites[0].addTest(test);\n      return test;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.test.only = function(title, fn){\n      var test = context.test(title, fn);\n      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';\n      mocha.grep(new RegExp(reString));\n    };\n\n    /**\n     * Pending test case.\n     */\n\n    context.test.skip = function(title){\n      context.test(title);\n    };\n  });\n};\n\n}); // module: interfaces/qunit.js\n\nrequire.register(\"interfaces/tdd.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Suite = require('../suite')\n  , Test = require('../test')\n  , utils = require('../utils');;\n\n/**\n * TDD-style interface:\n *\n *      suite('Array', function(){\n *        suite('#indexOf()', function(){\n *          suiteSetup(function(){\n *\n *          });\n *\n *          test('should return -1 when not present', function(){\n *\n *          });\n *\n *          test('should return the index when present', function(){\n *\n *          });\n *\n *          suiteTeardown(function(){\n *\n *          });\n *        });\n *      });\n *\n */\n\nmodule.exports = function(suite){\n  var suites = [suite];\n\n  suite.on('pre-require', function(context, file, mocha){\n\n    /**\n     * Execute before each test case.\n     */\n\n    context.setup = function(fn){\n      suites[0].beforeEach(fn);\n    };\n\n    /**\n     * Execute after each test case.\n     */\n\n    context.teardown = function(fn){\n      suites[0].afterEach(fn);\n    };\n\n    /**\n     * Execute before the suite.\n     */\n\n    context.suiteSetup = function(fn){\n      suites[0].beforeAll(fn);\n    };\n\n    /**\n     * Execute after the suite.\n     */\n\n    context.suiteTeardown = function(fn){\n      suites[0].afterAll(fn);\n    };\n\n    /**\n     * Describe a \"suite\" with the given `title`\n     * and callback `fn` containing nested suites\n     * and/or tests.\n     */\n\n    context.suite = function(title, fn){\n      var suite = Suite.create(suites[0], title);\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n      return suite;\n    };\n\n    /**\n     * Pending suite.\n     */\n    context.suite.skip = function(title, fn) {\n      var suite = Suite.create(suites[0], title);\n      suite.pending = true;\n      suites.unshift(suite);\n      fn.call(suite);\n      suites.shift();\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.suite.only = function(title, fn){\n      var suite = context.suite(title, fn);\n      mocha.grep(suite.fullTitle());\n    };\n\n    /**\n     * Describe a specification or test-case\n     * with the given `title` and callback `fn`\n     * acting as a thunk.\n     */\n\n    context.test = function(title, fn){\n      var suite = suites[0];\n      if (suite.pending) var fn = null;\n      var test = new Test(title, fn);\n      suite.addTest(test);\n      return test;\n    };\n\n    /**\n     * Exclusive test-case.\n     */\n\n    context.test.only = function(title, fn){\n      var test = context.test(title, fn);\n      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';\n      mocha.grep(new RegExp(reString));\n    };\n\n    /**\n     * Pending test case.\n     */\n\n    context.test.skip = function(title){\n      context.test(title);\n    };\n  });\n};\n\n}); // module: interfaces/tdd.js\n\nrequire.register(\"mocha.js\", function(module, exports, require){\n/*!\n * mocha\n * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>\n * MIT Licensed\n */\n\n/**\n * Module dependencies.\n */\n\nvar path = require('browser/path')\n  , utils = require('./utils');\n\n/**\n * Expose `Mocha`.\n */\n\nexports = module.exports = Mocha;\n\n/**\n * Expose internals.\n */\n\nexports.utils = utils;\nexports.interfaces = require('./interfaces');\nexports.reporters = require('./reporters');\nexports.Runnable = require('./runnable');\nexports.Context = require('./context');\nexports.Runner = require('./runner');\nexports.Suite = require('./suite');\nexports.Hook = require('./hook');\nexports.Test = require('./test');\n\n/**\n * Return image `name` path.\n *\n * @param {String} name\n * @return {String}\n * @api private\n */\n\nfunction image(name) {\n  return __dirname + '/../images/' + name + '.png';\n}\n\n/**\n * Setup mocha with `options`.\n *\n * Options:\n *\n *   - `ui` name \"bdd\", \"tdd\", \"exports\" etc\n *   - `reporter` reporter instance, defaults to `mocha.reporters.Dot`\n *   - `globals` array of accepted globals\n *   - `timeout` timeout in milliseconds\n *   - `bail` bail on the first test failure\n *   - `slow` milliseconds to wait before considering a test slow\n *   - `ignoreLeaks` ignore global leaks\n *   - `grep` string or regexp to filter tests with\n *\n * @param {Object} options\n * @api public\n */\n\nfunction Mocha(options) {\n  options = options || {};\n  this.files = [];\n  this.options = options;\n  this.grep(options.grep);\n  this.suite = new exports.Suite('', new exports.Context);\n  this.ui(options.ui);\n  this.bail(options.bail);\n  this.reporter(options.reporter);\n  if (null != options.timeout) this.timeout(options.timeout);\n  this.useColors(options.useColors)\n  if (options.slow) this.slow(options.slow);\n}\n\n/**\n * Enable or disable bailing on the first failure.\n *\n * @param {Boolean} [bail]\n * @api public\n */\n\nMocha.prototype.bail = function(bail){\n  if (0 == arguments.length) bail = true;\n  this.suite.bail(bail);\n  return this;\n};\n\n/**\n * Add test `file`.\n *\n * @param {String} file\n * @api public\n */\n\nMocha.prototype.addFile = function(file){\n  this.files.push(file);\n  return this;\n};\n\n/**\n * Set reporter to `reporter`, defaults to \"dot\".\n *\n * @param {String|Function} reporter name or constructor\n * @api public\n */\n\nMocha.prototype.reporter = function(reporter){\n  if ('function' == typeof reporter) {\n    this._reporter = reporter;\n  } else {\n    reporter = reporter || 'dot';\n    var _reporter;\n    try { _reporter = require('./reporters/' + reporter); } catch (err) {};\n    if (!_reporter) try { _reporter = require(reporter); } catch (err) {};\n    if (!_reporter && reporter === 'teamcity')\n      console.warn('The Teamcity reporter was moved to a package named ' +\n        'mocha-teamcity-reporter ' +\n        '(https://npmjs.org/package/mocha-teamcity-reporter).');\n    if (!_reporter) throw new Error('invalid reporter \"' + reporter + '\"');\n    this._reporter = _reporter;\n  }\n  return this;\n};\n\n/**\n * Set test UI `name`, defaults to \"bdd\".\n *\n * @param {String} bdd\n * @api public\n */\n\nMocha.prototype.ui = function(name){\n  name = name || 'bdd';\n  this._ui = exports.interfaces[name];\n  if (!this._ui) try { this._ui = require(name); } catch (err) {};\n  if (!this._ui) throw new Error('invalid interface \"' + name + '\"');\n  this._ui = this._ui(this.suite);\n  return this;\n};\n\n/**\n * Load registered files.\n *\n * @api private\n */\n\nMocha.prototype.loadFiles = function(fn){\n  var self = this;\n  var suite = this.suite;\n  var pending = this.files.length;\n  this.files.forEach(function(file){\n    file = path.resolve(file);\n    suite.emit('pre-require', global, file, self);\n    suite.emit('require', require(file), file, self);\n    suite.emit('post-require', global, file, self);\n    --pending || (fn && fn());\n  });\n};\n\n/**\n * Enable growl support.\n *\n * @api private\n */\n\nMocha.prototype._growl = function(runner, reporter) {\n  var notify = require('growl');\n\n  runner.on('end', function(){\n    var stats = reporter.stats;\n    if (stats.failures) {\n      var msg = stats.failures + ' of ' + runner.total + ' tests failed';\n      notify(msg, { name: 'mocha', title: 'Failed', image: image('error') });\n    } else {\n      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {\n          name: 'mocha'\n        , title: 'Passed'\n        , image: image('ok')\n      });\n    }\n  });\n};\n\n/**\n * Add regexp to grep, if `re` is a string it is escaped.\n *\n * @param {RegExp|String} re\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.grep = function(re){\n  this.options.grep = 'string' == typeof re\n    ? new RegExp(utils.escapeRegexp(re))\n    : re;\n  return this;\n};\n\n/**\n * Invert `.grep()` matches.\n *\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.invert = function(){\n  this.options.invert = true;\n  return this;\n};\n\n/**\n * Ignore global leaks.\n *\n * @param {Boolean} ignore\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.ignoreLeaks = function(ignore){\n  this.options.ignoreLeaks = !!ignore;\n  return this;\n};\n\n/**\n * Enable global leak checking.\n *\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.checkLeaks = function(){\n  this.options.ignoreLeaks = false;\n  return this;\n};\n\n/**\n * Enable growl support.\n *\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.growl = function(){\n  this.options.growl = true;\n  return this;\n};\n\n/**\n * Ignore `globals` array or string.\n *\n * @param {Array|String} globals\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.globals = function(globals){\n  this.options.globals = (this.options.globals || []).concat(globals);\n  return this;\n};\n\n/**\n * Emit color output.\n *\n * @param {Boolean} colors\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.useColors = function(colors){\n  this.options.useColors = arguments.length && colors != undefined\n    ? colors\n    : true;\n  return this;\n};\n\n/**\n * Set the timeout in milliseconds.\n *\n * @param {Number} timeout\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.timeout = function(timeout){\n  this.suite.timeout(timeout);\n  return this;\n};\n\n/**\n * Set slowness threshold in milliseconds.\n *\n * @param {Number} slow\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.slow = function(slow){\n  this.suite.slow(slow);\n  return this;\n};\n\n/**\n * Makes all tests async (accepting a callback)\n *\n * @return {Mocha}\n * @api public\n */\n\nMocha.prototype.asyncOnly = function(){\n  this.options.asyncOnly = true;\n  return this;\n};\n\n/**\n * Run tests and invoke `fn()` when complete.\n *\n * @param {Function} fn\n * @return {Runner}\n * @api public\n */\n\nMocha.prototype.run = function(fn){\n  if (this.files.length) this.loadFiles();\n  var suite = this.suite;\n  var options = this.options;\n  var runner = new exports.Runner(suite);\n  var reporter = new this._reporter(runner);\n  runner.ignoreLeaks = false !== options.ignoreLeaks;\n  runner.asyncOnly = options.asyncOnly;\n  if (options.grep) runner.grep(options.grep, options.invert);\n  if (options.globals) runner.globals(options.globals);\n  if (options.growl) this._growl(runner, reporter);\n  exports.reporters.Base.useColors = options.useColors;\n  return runner.run(fn);\n};\n\n}); // module: mocha.js\n\nrequire.register(\"ms.js\", function(module, exports, require){\n/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} options\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options){\n  options = options || {};\n  if ('string' == typeof val) return parse(val);\n  return options.long\n    ? long(val)\n    : short(val);\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  var match = /^((?:\\d+)?\\.?\\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);\n  if (!match) return;\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 's':\n      return n * s;\n    case 'ms':\n      return n;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction short(ms) {\n  if (ms >= d) return Math.round(ms / d) + 'd';\n  if (ms >= h) return Math.round(ms / h) + 'h';\n  if (ms >= m) return Math.round(ms / m) + 'm';\n  if (ms >= s) return Math.round(ms / s) + 's';\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction long(ms) {\n  return plural(ms, d, 'day')\n    || plural(ms, h, 'hour')\n    || plural(ms, m, 'minute')\n    || plural(ms, s, 'second')\n    || ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) return;\n  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n\n}); // module: ms.js\n\nrequire.register(\"reporters/base.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar tty = require('browser/tty')\n  , diff = require('browser/diff')\n  , ms = require('../ms');\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\nvar Date = global.Date\n  , setTimeout = global.setTimeout\n  , setInterval = global.setInterval\n  , clearTimeout = global.clearTimeout\n  , clearInterval = global.clearInterval;\n\n/**\n * Check if both stdio streams are associated with a tty.\n */\n\nvar isatty = tty.isatty(1) && tty.isatty(2);\n\n/**\n * Expose `Base`.\n */\n\nexports = module.exports = Base;\n\n/**\n * Enable coloring by default.\n */\n\nexports.useColors = isatty || (process.env.MOCHA_COLORS !== undefined);\n\n/**\n * Inline diffs instead of +/-\n */\n\nexports.inlineDiffs = false;\n\n/**\n * Default color map.\n */\n\nexports.colors = {\n    'pass': 90\n  , 'fail': 31\n  , 'bright pass': 92\n  , 'bright fail': 91\n  , 'bright yellow': 93\n  , 'pending': 36\n  , 'suite': 0\n  , 'error title': 0\n  , 'error message': 31\n  , 'error stack': 90\n  , 'checkmark': 32\n  , 'fast': 90\n  , 'medium': 33\n  , 'slow': 31\n  , 'green': 32\n  , 'light': 90\n  , 'diff gutter': 90\n  , 'diff added': 42\n  , 'diff removed': 41\n};\n\n/**\n * Default symbol map.\n */\n\nexports.symbols = {\n  ok: '✓',\n  err: '✖',\n  dot: '․'\n};\n\n// With node.js on Windows: use symbols available in terminal default fonts\nif ('win32' == process.platform) {\n  exports.symbols.ok = '\\u221A';\n  exports.symbols.err = '\\u00D7';\n  exports.symbols.dot = '.';\n}\n\n/**\n * Color `str` with the given `type`,\n * allowing colors to be disabled,\n * as well as user-defined color\n * schemes.\n *\n * @param {String} type\n * @param {String} str\n * @return {String}\n * @api private\n */\n\nvar color = exports.color = function(type, str) {\n  if (!exports.useColors) return str;\n  return '\\u001b[' + exports.colors[type] + 'm' + str + '\\u001b[0m';\n};\n\n/**\n * Expose term window size, with some\n * defaults for when stderr is not a tty.\n */\n\nexports.window = {\n  width: isatty\n    ? process.stdout.getWindowSize\n      ? process.stdout.getWindowSize(1)[0]\n      : tty.getWindowSize()[1]\n    : 75\n};\n\n/**\n * Expose some basic cursor interactions\n * that are common among reporters.\n */\n\nexports.cursor = {\n  hide: function(){\n    isatty && process.stdout.write('\\u001b[?25l');\n  },\n\n  show: function(){\n    isatty && process.stdout.write('\\u001b[?25h');\n  },\n\n  deleteLine: function(){\n    isatty && process.stdout.write('\\u001b[2K');\n  },\n\n  beginningOfLine: function(){\n    isatty && process.stdout.write('\\u001b[0G');\n  },\n\n  CR: function(){\n    if (isatty) {\n      exports.cursor.deleteLine();\n      exports.cursor.beginningOfLine();\n    } else {\n      process.stdout.write('\\n');\n    }\n  }\n};\n\n/**\n * Outut the given `failures` as a list.\n *\n * @param {Array} failures\n * @api public\n */\n\nexports.list = function(failures){\n  console.error();\n  failures.forEach(function(test, i){\n    // format\n    var fmt = color('error title', '  %s) %s:\\n')\n      + color('error message', '     %s')\n      + color('error stack', '\\n%s\\n');\n\n    // msg\n    var err = test.err\n      , message = err.message || ''\n      , stack = err.stack || message\n      , index = stack.indexOf(message) + message.length\n      , msg = stack.slice(0, index)\n      , actual = err.actual\n      , expected = err.expected\n      , escape = true;\n\n    // uncaught\n    if (err.uncaught) {\n      msg = 'Uncaught ' + msg;\n    }\n\n    // explicitly show diff\n    if (err.showDiff && sameType(actual, expected)) {\n      escape = false;\n      err.actual = actual = stringify(actual);\n      err.expected = expected = stringify(expected);\n    }\n\n    // actual / expected diff\n    if ('string' == typeof actual && 'string' == typeof expected) {\n      fmt = color('error title', '  %s) %s:\\n%s') + color('error stack', '\\n%s\\n');\n      var match = message.match(/^([^:]+): expected/);\n      msg = match ? '\\n      ' + color('error message', match[1]) : '';\n\n      if (exports.inlineDiffs) {\n        msg += inlineDiff(err, escape);\n      } else {\n        msg += unifiedDiff(err, escape);\n      }\n    }\n\n    // indent stack trace without msg\n    stack = stack.slice(index ? index + 1 : index)\n      .replace(/^/gm, '  ');\n\n    console.error(fmt, (i + 1), test.fullTitle(), msg, stack);\n  });\n};\n\n/**\n * Initialize a new `Base` reporter.\n *\n * All other reporters generally\n * inherit from this reporter, providing\n * stats such as test duration, number\n * of tests passed / failed etc.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Base(runner) {\n  var self = this\n    , stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }\n    , failures = this.failures = [];\n\n  if (!runner) return;\n  this.runner = runner;\n\n  runner.stats = stats;\n\n  runner.on('start', function(){\n    stats.start = new Date;\n  });\n\n  runner.on('suite', function(suite){\n    stats.suites = stats.suites || 0;\n    suite.root || stats.suites++;\n  });\n\n  runner.on('test end', function(test){\n    stats.tests = stats.tests || 0;\n    stats.tests++;\n  });\n\n  runner.on('pass', function(test){\n    stats.passes = stats.passes || 0;\n\n    var medium = test.slow() / 2;\n    test.speed = test.duration > test.slow()\n      ? 'slow'\n      : test.duration > medium\n        ? 'medium'\n        : 'fast';\n\n    stats.passes++;\n  });\n\n  runner.on('fail', function(test, err){\n    stats.failures = stats.failures || 0;\n    stats.failures++;\n    test.err = err;\n    failures.push(test);\n  });\n\n  runner.on('end', function(){\n    stats.end = new Date;\n    stats.duration = new Date - stats.start;\n  });\n\n  runner.on('pending', function(){\n    stats.pending++;\n  });\n}\n\n/**\n * Output common epilogue used by many of\n * the bundled reporters.\n *\n * @api public\n */\n\nBase.prototype.epilogue = function(){\n  var stats = this.stats;\n  var tests;\n  var fmt;\n\n  console.log();\n\n  // passes\n  fmt = color('bright pass', ' ')\n    + color('green', ' %d passing')\n    + color('light', ' (%s)');\n\n  console.log(fmt,\n    stats.passes || 0,\n    ms(stats.duration));\n\n  // pending\n  if (stats.pending) {\n    fmt = color('pending', ' ')\n      + color('pending', ' %d pending');\n\n    console.log(fmt, stats.pending);\n  }\n\n  // failures\n  if (stats.failures) {\n    fmt = color('fail', '  %d failing');\n\n    console.error(fmt,\n      stats.failures);\n\n    Base.list(this.failures);\n    console.error();\n  }\n\n  console.log();\n};\n\n/**\n * Pad the given `str` to `len`.\n *\n * @param {String} str\n * @param {String} len\n * @return {String}\n * @api private\n */\n\nfunction pad(str, len) {\n  str = String(str);\n  return Array(len - str.length + 1).join(' ') + str;\n}\n\n\n/**\n * Returns an inline diff between 2 strings with coloured ANSI output\n *\n * @param {Error} Error with actual/expected\n * @return {String} Diff\n * @api private\n */\n\nfunction inlineDiff(err, escape) {\n  var msg = errorDiff(err, 'WordsWithSpace', escape);\n\n  // linenos\n  var lines = msg.split('\\n');\n  if (lines.length > 4) {\n    var width = String(lines.length).length;\n    msg = lines.map(function(str, i){\n      return pad(++i, width) + ' |' + ' ' + str;\n    }).join('\\n');\n  }\n\n  // legend\n  msg = '\\n'\n    + color('diff removed', 'actual')\n    + ' '\n    + color('diff added', 'expected')\n    + '\\n\\n'\n    + msg\n    + '\\n';\n\n  // indent\n  msg = msg.replace(/^/gm, '      ');\n  return msg;\n}\n\n/**\n * Returns a unified diff between 2 strings\n *\n * @param {Error} Error with actual/expected\n * @return {String} Diff\n * @api private\n */\n\nfunction unifiedDiff(err, escape) {\n  var indent = '      ';\n  function cleanUp(line) {\n    if (escape) {\n      line = escapeInvisibles(line);\n    }\n    if (line[0] === '+') return indent + colorLines('diff added', line);\n    if (line[0] === '-') return indent + colorLines('diff removed', line);\n    if (line.match(/\\@\\@/)) return null;\n    if (line.match(/\\\\ No newline/)) return null;\n    else return indent + line;\n  }\n  function notBlank(line) {\n    return line != null;\n  }\n  msg = diff.createPatch('string', err.actual, err.expected);\n  var lines = msg.split('\\n').splice(4);\n  return '\\n      '\n         + colorLines('diff added',   '+ expected') + ' '\n         + colorLines('diff removed', '- actual')\n         + '\\n\\n'\n         + lines.map(cleanUp).filter(notBlank).join('\\n');\n}\n\n/**\n * Return a character diff for `err`.\n *\n * @param {Error} err\n * @return {String}\n * @api private\n */\n\nfunction errorDiff(err, type, escape) {\n  var actual   = escape ? escapeInvisibles(err.actual)   : err.actual;\n  var expected = escape ? escapeInvisibles(err.expected) : err.expected;\n  return diff['diff' + type](actual, expected).map(function(str){\n    if (str.added) return colorLines('diff added', str.value);\n    if (str.removed) return colorLines('diff removed', str.value);\n    return str.value;\n  }).join('');\n}\n\n/**\n * Returns a string with all invisible characters in plain text\n *\n * @param {String} line\n * @return {String}\n * @api private\n */\nfunction escapeInvisibles(line) {\n    return line.replace(/\\t/g, '<tab>')\n               .replace(/\\r/g, '<CR>')\n               .replace(/\\n/g, '<LF>\\n');\n}\n\n/**\n * Color lines for `str`, using the color `name`.\n *\n * @param {String} name\n * @param {String} str\n * @return {String}\n * @api private\n */\n\nfunction colorLines(name, str) {\n  return str.split('\\n').map(function(str){\n    return color(name, str);\n  }).join('\\n');\n}\n\n/**\n * Stringify `obj`.\n *\n * @param {Mixed} obj\n * @return {String}\n * @api private\n */\n\nfunction stringify(obj) {\n  if (obj instanceof RegExp) return obj.toString();\n  return JSON.stringify(obj, null, 2);\n}\n\n/**\n * Check that a / b have the same type.\n *\n * @param {Object} a\n * @param {Object} b\n * @return {Boolean}\n * @api private\n */\n\nfunction sameType(a, b) {\n  a = Object.prototype.toString.call(a);\n  b = Object.prototype.toString.call(b);\n  return a == b;\n}\n\n\n\n}); // module: reporters/base.js\n\nrequire.register(\"reporters/doc.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , utils = require('../utils');\n\n/**\n * Expose `Doc`.\n */\n\nexports = module.exports = Doc;\n\n/**\n * Initialize a new `Doc` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Doc(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , total = runner.total\n    , indents = 2;\n\n  function indent() {\n    return Array(indents).join('  ');\n  }\n\n  runner.on('suite', function(suite){\n    if (suite.root) return;\n    ++indents;\n    console.log('%s<section class=\"suite\">', indent());\n    ++indents;\n    console.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));\n    console.log('%s<dl>', indent());\n  });\n\n  runner.on('suite end', function(suite){\n    if (suite.root) return;\n    console.log('%s</dl>', indent());\n    --indents;\n    console.log('%s</section>', indent());\n    --indents;\n  });\n\n  runner.on('pass', function(test){\n    console.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));\n    var code = utils.escape(utils.clean(test.fn.toString()));\n    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);\n  });\n}\n\n}); // module: reporters/doc.js\n\nrequire.register(\"reporters/dot.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , color = Base.color;\n\n/**\n * Expose `Dot`.\n */\n\nexports = module.exports = Dot;\n\n/**\n * Initialize a new `Dot` matrix test reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Dot(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , width = Base.window.width * .75 | 0\n    , n = 0;\n\n  runner.on('start', function(){\n    process.stdout.write('\\n  ');\n  });\n\n  runner.on('pending', function(test){\n    process.stdout.write(color('pending', Base.symbols.dot));\n  });\n\n  runner.on('pass', function(test){\n    if (++n % width == 0) process.stdout.write('\\n  ');\n    if ('slow' == test.speed) {\n      process.stdout.write(color('bright yellow', Base.symbols.dot));\n    } else {\n      process.stdout.write(color(test.speed, Base.symbols.dot));\n    }\n  });\n\n  runner.on('fail', function(test, err){\n    if (++n % width == 0) process.stdout.write('\\n  ');\n    process.stdout.write(color('fail', Base.symbols.dot));\n  });\n\n  runner.on('end', function(){\n    console.log();\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nDot.prototype = new F;\nDot.prototype.constructor = Dot;\n\n}); // module: reporters/dot.js\n\nrequire.register(\"reporters/html-cov.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar JSONCov = require('./json-cov')\n  , fs = require('browser/fs');\n\n/**\n * Expose `HTMLCov`.\n */\n\nexports = module.exports = HTMLCov;\n\n/**\n * Initialize a new `JsCoverage` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction HTMLCov(runner) {\n  var jade = require('jade')\n    , file = __dirname + '/templates/coverage.jade'\n    , str = fs.readFileSync(file, 'utf8')\n    , fn = jade.compile(str, { filename: file })\n    , self = this;\n\n  JSONCov.call(this, runner, false);\n\n  runner.on('end', function(){\n    process.stdout.write(fn({\n        cov: self.cov\n      , coverageClass: coverageClass\n    }));\n  });\n}\n\n/**\n * Return coverage class for `n`.\n *\n * @return {String}\n * @api private\n */\n\nfunction coverageClass(n) {\n  if (n >= 75) return 'high';\n  if (n >= 50) return 'medium';\n  if (n >= 25) return 'low';\n  return 'terrible';\n}\n}); // module: reporters/html-cov.js\n\nrequire.register(\"reporters/html.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , utils = require('../utils')\n  , Progress = require('../browser/progress')\n  , escape = utils.escape;\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\nvar Date = global.Date\n  , setTimeout = global.setTimeout\n  , setInterval = global.setInterval\n  , clearTimeout = global.clearTimeout\n  , clearInterval = global.clearInterval;\n\n/**\n * Expose `HTML`.\n */\n\nexports = module.exports = HTML;\n\n/**\n * Stats template.\n */\n\nvar statsTemplate = '<ul id=\"mocha-stats\">'\n  + '<li class=\"progress\"><canvas width=\"40\" height=\"40\"></canvas></li>'\n  + '<li class=\"passes\"><a href=\"#\">passes:</a> <em>0</em></li>'\n  + '<li class=\"failures\"><a href=\"#\">failures:</a> <em>0</em></li>'\n  + '<li class=\"duration\">duration: <em>0</em>s</li>'\n  + '</ul>';\n\n/**\n * Initialize a new `HTML` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction HTML(runner, root) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , total = runner.total\n    , stat = fragment(statsTemplate)\n    , items = stat.getElementsByTagName('li')\n    , passes = items[1].getElementsByTagName('em')[0]\n    , passesLink = items[1].getElementsByTagName('a')[0]\n    , failures = items[2].getElementsByTagName('em')[0]\n    , failuresLink = items[2].getElementsByTagName('a')[0]\n    , duration = items[3].getElementsByTagName('em')[0]\n    , canvas = stat.getElementsByTagName('canvas')[0]\n    , report = fragment('<ul id=\"mocha-report\"></ul>')\n    , stack = [report]\n    , progress\n    , ctx\n\n  root = root || document.getElementById('mocha');\n\n  if (canvas.getContext) {\n    var ratio = window.devicePixelRatio || 1;\n    canvas.style.width = canvas.width;\n    canvas.style.height = canvas.height;\n    canvas.width *= ratio;\n    canvas.height *= ratio;\n    ctx = canvas.getContext('2d');\n    ctx.scale(ratio, ratio);\n    progress = new Progress;\n  }\n\n  if (!root) return error('#mocha div missing, add it to your document');\n\n  // pass toggle\n  on(passesLink, 'click', function(){\n    unhide();\n    var name = /pass/.test(report.className) ? '' : ' pass';\n    report.className = report.className.replace(/fail|pass/g, '') + name;\n    if (report.className.trim()) hideSuitesWithout('test pass');\n  });\n\n  // failure toggle\n  on(failuresLink, 'click', function(){\n    unhide();\n    var name = /fail/.test(report.className) ? '' : ' fail';\n    report.className = report.className.replace(/fail|pass/g, '') + name;\n    if (report.className.trim()) hideSuitesWithout('test fail');\n  });\n\n  root.appendChild(stat);\n  root.appendChild(report);\n\n  if (progress) progress.size(40);\n\n  runner.on('suite', function(suite){\n    if (suite.root) return;\n\n    // suite\n    var url = self.suiteURL(suite);\n    var el = fragment('<li class=\"suite\"><h1><a href=\"%s\">%s</a></h1></li>', url, escape(suite.title));\n\n    // container\n    stack[0].appendChild(el);\n    stack.unshift(document.createElement('ul'));\n    el.appendChild(stack[0]);\n  });\n\n  runner.on('suite end', function(suite){\n    if (suite.root) return;\n    stack.shift();\n  });\n\n  runner.on('fail', function(test, err){\n    if ('hook' == test.type) runner.emit('test end', test);\n  });\n\n  runner.on('test end', function(test){\n    // TODO: add to stats\n    var percent = stats.tests / this.total * 100 | 0;\n    if (progress) progress.update(percent).draw(ctx);\n\n    // update stats\n    var ms = new Date - stats.start;\n    text(passes, stats.passes);\n    text(failures, stats.failures);\n    text(duration, (ms / 1000).toFixed(2));\n\n    // test\n    if ('passed' == test.state) {\n      var url = self.testURL(test);\n      var el = fragment('<li class=\"test pass %e\"><h2>%e<span class=\"duration\">%ems</span> <a href=\"%s\" class=\"replay\">‣</a></h2></li>', test.speed, test.title, test.duration, url);\n    } else if (test.pending) {\n      var el = fragment('<li class=\"test pass pending\"><h2>%e</h2></li>', test.title);\n    } else {\n      var el = fragment('<li class=\"test fail\"><h2>%e <a href=\"?grep=%e\" class=\"replay\">‣</a></h2></li>', test.title, encodeURIComponent(test.fullTitle()));\n      var str = test.err.stack || test.err.toString();\n\n      // FF / Opera do not add the message\n      if (!~str.indexOf(test.err.message)) {\n        str = test.err.message + '\\n' + str;\n      }\n\n      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we\n      // check for the result of the stringifying.\n      if ('[object Error]' == str) str = test.err.message;\n\n      // Safari doesn't give you a stack. Let's at least provide a source line.\n      if (!test.err.stack && test.err.sourceURL && test.err.line !== undefined) {\n        str += \"\\n(\" + test.err.sourceURL + \":\" + test.err.line + \")\";\n      }\n\n      el.appendChild(fragment('<pre class=\"error\">%e</pre>', str));\n    }\n\n    // toggle code\n    // TODO: defer\n    if (!test.pending) {\n      var h2 = el.getElementsByTagName('h2')[0];\n\n      on(h2, 'click', function(){\n        pre.style.display = 'none' == pre.style.display\n          ? 'block'\n          : 'none';\n      });\n\n      var pre = fragment('<pre><code>%e</code></pre>', utils.clean(test.fn.toString()));\n      el.appendChild(pre);\n      pre.style.display = 'none';\n    }\n\n    // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.\n    if (stack[0]) stack[0].appendChild(el);\n  });\n}\n\n/**\n * Provide suite URL\n *\n * @param {Object} [suite]\n */\n\nHTML.prototype.suiteURL = function(suite){\n  return '?grep=' + encodeURIComponent(suite.fullTitle());\n};\n\n/**\n * Provide test URL\n *\n * @param {Object} [test]\n */\n\nHTML.prototype.testURL = function(test){\n  return '?grep=' + encodeURIComponent(test.fullTitle());\n};\n\n/**\n * Display error `msg`.\n */\n\nfunction error(msg) {\n  document.body.appendChild(fragment('<div id=\"mocha-error\">%s</div>', msg));\n}\n\n/**\n * Return a DOM fragment from `html`.\n */\n\nfunction fragment(html) {\n  var args = arguments\n    , div = document.createElement('div')\n    , i = 1;\n\n  div.innerHTML = html.replace(/%([se])/g, function(_, type){\n    switch (type) {\n      case 's': return String(args[i++]);\n      case 'e': return escape(args[i++]);\n    }\n  });\n\n  return div.firstChild;\n}\n\n/**\n * Check for suites that do not have elements\n * with `classname`, and hide them.\n */\n\nfunction hideSuitesWithout(classname) {\n  var suites = document.getElementsByClassName('suite');\n  for (var i = 0; i < suites.length; i++) {\n    var els = suites[i].getElementsByClassName(classname);\n    if (0 == els.length) suites[i].className += ' hidden';\n  }\n}\n\n/**\n * Unhide .hidden suites.\n */\n\nfunction unhide() {\n  var els = document.getElementsByClassName('suite hidden');\n  for (var i = 0; i < els.length; ++i) {\n    els[i].className = els[i].className.replace('suite hidden', 'suite');\n  }\n}\n\n/**\n * Set `el` text to `str`.\n */\n\nfunction text(el, str) {\n  if (el.textContent) {\n    el.textContent = str;\n  } else {\n    el.innerText = str;\n  }\n}\n\n/**\n * Listen on `event` with callback `fn`.\n */\n\nfunction on(el, event, fn) {\n  if (el.addEventListener) {\n    el.addEventListener(event, fn, false);\n  } else {\n    el.attachEvent('on' + event, fn);\n  }\n}\n\n}); // module: reporters/html.js\n\nrequire.register(\"reporters/index.js\", function(module, exports, require){\n\nexports.Base = require('./base');\nexports.Dot = require('./dot');\nexports.Doc = require('./doc');\nexports.TAP = require('./tap');\nexports.JSON = require('./json');\nexports.HTML = require('./html');\nexports.List = require('./list');\nexports.Min = require('./min');\nexports.Spec = require('./spec');\nexports.Nyan = require('./nyan');\nexports.XUnit = require('./xunit');\nexports.Markdown = require('./markdown');\nexports.Progress = require('./progress');\nexports.Landing = require('./landing');\nexports.JSONCov = require('./json-cov');\nexports.HTMLCov = require('./html-cov');\nexports.JSONStream = require('./json-stream');\n\n}); // module: reporters/index.js\n\nrequire.register(\"reporters/json-cov.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\n\n/**\n * Expose `JSONCov`.\n */\n\nexports = module.exports = JSONCov;\n\n/**\n * Initialize a new `JsCoverage` reporter.\n *\n * @param {Runner} runner\n * @param {Boolean} output\n * @api public\n */\n\nfunction JSONCov(runner, output) {\n  var self = this\n    , output = 1 == arguments.length ? true : output;\n\n  Base.call(this, runner);\n\n  var tests = []\n    , failures = []\n    , passes = [];\n\n  runner.on('test end', function(test){\n    tests.push(test);\n  });\n\n  runner.on('pass', function(test){\n    passes.push(test);\n  });\n\n  runner.on('fail', function(test){\n    failures.push(test);\n  });\n\n  runner.on('end', function(){\n    var cov = global._$jscoverage || {};\n    var result = self.cov = map(cov);\n    result.stats = self.stats;\n    result.tests = tests.map(clean);\n    result.failures = failures.map(clean);\n    result.passes = passes.map(clean);\n    if (!output) return;\n    process.stdout.write(JSON.stringify(result, null, 2 ));\n  });\n}\n\n/**\n * Map jscoverage data to a JSON structure\n * suitable for reporting.\n *\n * @param {Object} cov\n * @return {Object}\n * @api private\n */\n\nfunction map(cov) {\n  var ret = {\n      instrumentation: 'node-jscoverage'\n    , sloc: 0\n    , hits: 0\n    , misses: 0\n    , coverage: 0\n    , files: []\n  };\n\n  for (var filename in cov) {\n    var data = coverage(filename, cov[filename]);\n    ret.files.push(data);\n    ret.hits += data.hits;\n    ret.misses += data.misses;\n    ret.sloc += data.sloc;\n  }\n\n  ret.files.sort(function(a, b) {\n    return a.filename.localeCompare(b.filename);\n  });\n\n  if (ret.sloc > 0) {\n    ret.coverage = (ret.hits / ret.sloc) * 100;\n  }\n\n  return ret;\n};\n\n/**\n * Map jscoverage data for a single source file\n * to a JSON structure suitable for reporting.\n *\n * @param {String} filename name of the source file\n * @param {Object} data jscoverage coverage data\n * @return {Object}\n * @api private\n */\n\nfunction coverage(filename, data) {\n  var ret = {\n    filename: filename,\n    coverage: 0,\n    hits: 0,\n    misses: 0,\n    sloc: 0,\n    source: {}\n  };\n\n  data.source.forEach(function(line, num){\n    num++;\n\n    if (data[num] === 0) {\n      ret.misses++;\n      ret.sloc++;\n    } else if (data[num] !== undefined) {\n      ret.hits++;\n      ret.sloc++;\n    }\n\n    ret.source[num] = {\n        source: line\n      , coverage: data[num] === undefined\n        ? ''\n        : data[num]\n    };\n  });\n\n  ret.coverage = ret.hits / ret.sloc * 100;\n\n  return ret;\n}\n\n/**\n * Return a plain-object representation of `test`\n * free of cyclic properties etc.\n *\n * @param {Object} test\n * @return {Object}\n * @api private\n */\n\nfunction clean(test) {\n  return {\n      title: test.title\n    , fullTitle: test.fullTitle()\n    , duration: test.duration\n  }\n}\n\n}); // module: reporters/json-cov.js\n\nrequire.register(\"reporters/json-stream.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , color = Base.color;\n\n/**\n * Expose `List`.\n */\n\nexports = module.exports = List;\n\n/**\n * Initialize a new `List` test reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction List(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , total = runner.total;\n\n  runner.on('start', function(){\n    console.log(JSON.stringify(['start', { total: total }]));\n  });\n\n  runner.on('pass', function(test){\n    console.log(JSON.stringify(['pass', clean(test)]));\n  });\n\n  runner.on('fail', function(test, err){\n    console.log(JSON.stringify(['fail', clean(test)]));\n  });\n\n  runner.on('end', function(){\n    process.stdout.write(JSON.stringify(['end', self.stats]));\n  });\n}\n\n/**\n * Return a plain-object representation of `test`\n * free of cyclic properties etc.\n *\n * @param {Object} test\n * @return {Object}\n * @api private\n */\n\nfunction clean(test) {\n  return {\n      title: test.title\n    , fullTitle: test.fullTitle()\n    , duration: test.duration\n  }\n}\n}); // module: reporters/json-stream.js\n\nrequire.register(\"reporters/json.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , cursor = Base.cursor\n  , color = Base.color;\n\n/**\n * Expose `JSON`.\n */\n\nexports = module.exports = JSONReporter;\n\n/**\n * Initialize a new `JSON` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction JSONReporter(runner) {\n  var self = this;\n  Base.call(this, runner);\n\n  var tests = []\n    , failures = []\n    , passes = [];\n\n  runner.on('test end', function(test){\n    tests.push(test);\n  });\n\n  runner.on('pass', function(test){\n    passes.push(test);\n  });\n\n  runner.on('fail', function(test){\n    failures.push(test);\n  });\n\n  runner.on('end', function(){\n    var obj = {\n        stats: self.stats\n      , tests: tests.map(clean)\n      , failures: failures.map(clean)\n      , passes: passes.map(clean)\n    };\n\n    process.stdout.write(JSON.stringify(obj, null, 2));\n  });\n}\n\n/**\n * Return a plain-object representation of `test`\n * free of cyclic properties etc.\n *\n * @param {Object} test\n * @return {Object}\n * @api private\n */\n\nfunction clean(test) {\n  return {\n      title: test.title\n    , fullTitle: test.fullTitle()\n    , duration: test.duration\n  }\n}\n}); // module: reporters/json.js\n\nrequire.register(\"reporters/landing.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , cursor = Base.cursor\n  , color = Base.color;\n\n/**\n * Expose `Landing`.\n */\n\nexports = module.exports = Landing;\n\n/**\n * Airplane color.\n */\n\nBase.colors.plane = 0;\n\n/**\n * Airplane crash color.\n */\n\nBase.colors['plane crash'] = 31;\n\n/**\n * Runway color.\n */\n\nBase.colors.runway = 90;\n\n/**\n * Initialize a new `Landing` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Landing(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , width = Base.window.width * .75 | 0\n    , total = runner.total\n    , stream = process.stdout\n    , plane = color('plane', '✈')\n    , crashed = -1\n    , n = 0;\n\n  function runway() {\n    var buf = Array(width).join('-');\n    return '  ' + color('runway', buf);\n  }\n\n  runner.on('start', function(){\n    stream.write('\\n  ');\n    cursor.hide();\n  });\n\n  runner.on('test end', function(test){\n    // check if the plane crashed\n    var col = -1 == crashed\n      ? width * ++n / total | 0\n      : crashed;\n\n    // show the crash\n    if ('failed' == test.state) {\n      plane = color('plane crash', '✈');\n      crashed = col;\n    }\n\n    // render landing strip\n    stream.write('\\u001b[4F\\n\\n');\n    stream.write(runway());\n    stream.write('\\n  ');\n    stream.write(color('runway', Array(col).join('⋅')));\n    stream.write(plane)\n    stream.write(color('runway', Array(width - col).join('⋅') + '\\n'));\n    stream.write(runway());\n    stream.write('\\u001b[0m');\n  });\n\n  runner.on('end', function(){\n    cursor.show();\n    console.log();\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nLanding.prototype = new F;\nLanding.prototype.constructor = Landing;\n\n}); // module: reporters/landing.js\n\nrequire.register(\"reporters/list.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , cursor = Base.cursor\n  , color = Base.color;\n\n/**\n * Expose `List`.\n */\n\nexports = module.exports = List;\n\n/**\n * Initialize a new `List` test reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction List(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , n = 0;\n\n  runner.on('start', function(){\n    console.log();\n  });\n\n  runner.on('test', function(test){\n    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));\n  });\n\n  runner.on('pending', function(test){\n    var fmt = color('checkmark', '  -')\n      + color('pending', ' %s');\n    console.log(fmt, test.fullTitle());\n  });\n\n  runner.on('pass', function(test){\n    var fmt = color('checkmark', '  '+Base.symbols.dot)\n      + color('pass', ' %s: ')\n      + color(test.speed, '%dms');\n    cursor.CR();\n    console.log(fmt, test.fullTitle(), test.duration);\n  });\n\n  runner.on('fail', function(test, err){\n    cursor.CR();\n    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());\n  });\n\n  runner.on('end', self.epilogue.bind(self));\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nList.prototype = new F;\nList.prototype.constructor = List;\n\n\n}); // module: reporters/list.js\n\nrequire.register(\"reporters/markdown.js\", function(module, exports, require){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , utils = require('../utils');\n\n/**\n * Expose `Markdown`.\n */\n\nexports = module.exports = Markdown;\n\n/**\n * Initialize a new `Markdown` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Markdown(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , level = 0\n    , buf = '';\n\n  function title(str) {\n    return Array(level).join('#') + ' ' + str;\n  }\n\n  function indent() {\n    return Array(level).join('  ');\n  }\n\n  function mapTOC(suite, obj) {\n    var ret = obj;\n    obj = obj[suite.title] = obj[suite.title] || { suite: suite };\n    suite.suites.forEach(function(suite){\n      mapTOC(suite, obj);\n    });\n    return ret;\n  }\n\n  function stringifyTOC(obj, level) {\n    ++level;\n    var buf = '';\n    var link;\n    for (var key in obj) {\n      if ('suite' == key) continue;\n      if (key) link = ' - [' + key + '](#' + utils.slug(obj[key].suite.fullTitle()) + ')\\n';\n      if (key) buf += Array(level).join('  ') + link;\n      buf += stringifyTOC(obj[key], level);\n    }\n    --level;\n    return buf;\n  }\n\n  function generateTOC(suite) {\n    var obj = mapTOC(suite, {});\n    return stringifyTOC(obj, 0);\n  }\n\n  generateTOC(runner.suite);\n\n  runner.on('suite', function(suite){\n    ++level;\n    var slug = utils.slug(suite.fullTitle());\n    buf += '<a name=\"' + slug + '\"></a>' + '\\n';\n    buf += title(suite.title) + '\\n';\n  });\n\n  runner.on('suite end', function(suite){\n    --level;\n  });\n\n  runner.on('pass', function(test){\n    var code = utils.clean(test.fn.toString());\n    buf += test.title + '.\\n';\n    buf += '\\n```js\\n';\n    buf += code + '\\n';\n    buf += '```\\n\\n';\n  });\n\n  runner.on('end', function(){\n    process.stdout.write('# TOC\\n');\n    process.stdout.write(generateTOC(runner.suite));\n    process.stdout.write(buf);\n  });\n}\n}); // module: reporters/markdown.js\n\nrequire.register(\"reporters/min.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base');\n\n/**\n * Expose `Min`.\n */\n\nexports = module.exports = Min;\n\n/**\n * Initialize a new `Min` minimal test reporter (best used with --watch).\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Min(runner) {\n  Base.call(this, runner);\n\n  runner.on('start', function(){\n    // clear screen\n    process.stdout.write('\\u001b[2J');\n    // set cursor position\n    process.stdout.write('\\u001b[1;3H');\n  });\n\n  runner.on('end', this.epilogue.bind(this));\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nMin.prototype = new F;\nMin.prototype.constructor = Min;\n\n\n}); // module: reporters/min.js\n\nrequire.register(\"reporters/nyan.js\", function(module, exports, require){\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , color = Base.color;\n\n/**\n * Expose `Dot`.\n */\n\nexports = module.exports = NyanCat;\n\n/**\n * Initialize a new `Dot` matrix test reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction NyanCat(runner) {\n  Base.call(this, runner);\n  var self = this\n    , stats = this.stats\n    , width = Base.window.width * .75 | 0\n    , rainbowColors = this.rainbowColors = self.generateColors()\n    , colorIndex = this.colorIndex = 0\n    , numerOfLines = this.numberOfLines = 4\n    , trajectories = this.trajectories = [[], [], [], []]\n    , nyanCatWidth = this.nyanCatWidth = 11\n    , trajectoryWidthMax = this.trajectoryWidthMax = (width - nyanCatWidth)\n    , scoreboardWidth = this.scoreboardWidth = 5\n    , tick = this.tick = 0\n    , n = 0;\n\n  runner.on('start', function(){\n    Base.cursor.hide();\n    self.draw();\n  });\n\n  runner.on('pending', function(test){\n    self.draw();\n  });\n\n  runner.on('pass', function(test){\n    self.draw();\n  });\n\n  runner.on('fail', function(test, err){\n    self.draw();\n  });\n\n  runner.on('end', function(){\n    Base.cursor.show();\n    for (var i = 0; i < self.numberOfLines; i++) write('\\n');\n    self.epilogue();\n  });\n}\n\n/**\n * Draw the nyan cat\n *\n * @api private\n */\n\nNyanCat.prototype.draw = function(){\n  this.appendRainbow();\n  this.drawScoreboard();\n  this.drawRainbow();\n  this.drawNyanCat();\n  this.tick = !this.tick;\n};\n\n/**\n * Draw the \"scoreboard\" showing the number\n * of passes, failures and pending tests.\n *\n * @api private\n */\n\nNyanCat.prototype.drawScoreboard = function(){\n  var stats = this.stats;\n  var colors = Base.colors;\n\n  function draw(color, n) {\n    write(' ');\n    write('\\u001b[' + color + 'm' + n + '\\u001b[0m');\n    write('\\n');\n  }\n\n  draw(colors.green, stats.passes);\n  draw(colors.fail, stats.failures);\n  draw(colors.pending, stats.pending);\n  write('\\n');\n\n  this.cursorUp(this.numberOfLines);\n};\n\n/**\n * Append the rainbow.\n *\n * @api private\n */\n\nNyanCat.prototype.appendRainbow = function(){\n  var segment = this.tick ? '_' : '-';\n  var rainbowified = this.rainbowify(segment);\n\n  for (var index = 0; index < this.numberOfLines; index++) {\n    var trajectory = this.trajectories[index];\n    if (trajectory.length >= this.trajectoryWidthMax) trajectory.shift();\n    trajectory.push(rainbowified);\n  }\n};\n\n/**\n * Draw the rainbow.\n *\n * @api private\n */\n\nNyanCat.prototype.drawRainbow = function(){\n  var self = this;\n\n  this.trajectories.forEach(function(line, index) {\n    write('\\u001b[' + self.scoreboardWidth + 'C');\n    write(line.join(''));\n    write('\\n');\n  });\n\n  this.cursorUp(this.numberOfLines);\n};\n\n/**\n * Draw the nyan cat\n *\n * @api private\n */\n\nNyanCat.prototype.drawNyanCat = function() {\n  var self = this;\n  var startWidth = this.scoreboardWidth + this.trajectories[0].length;\n  var color = '\\u001b[' + startWidth + 'C';\n  var padding = '';\n\n  write(color);\n  write('_,------,');\n  write('\\n');\n\n  write(color);\n  padding = self.tick ? '  ' : '   ';\n  write('_|' + padding + '/\\\\_/\\\\ ');\n  write('\\n');\n\n  write(color);\n  padding = self.tick ? '_' : '__';\n  var tail = self.tick ? '~' : '^';\n  var face;\n  write(tail + '|' + padding + this.face() + ' ');\n  write('\\n');\n\n  write(color);\n  padding = self.tick ? ' ' : '  ';\n  write(padding + '\"\"  \"\" ');\n  write('\\n');\n\n  this.cursorUp(this.numberOfLines);\n};\n\n/**\n * Draw nyan cat face.\n *\n * @return {String}\n * @api private\n */\n\nNyanCat.prototype.face = function() {\n  var stats = this.stats;\n  if (stats.failures) {\n    return '( x .x)';\n  } else if (stats.pending) {\n    return '( o .o)';\n  } else if(stats.passes) {\n    return '( ^ .^)';\n  } else {\n    return '( - .-)';\n  }\n}\n\n/**\n * Move cursor up `n`.\n *\n * @param {Number} n\n * @api private\n */\n\nNyanCat.prototype.cursorUp = function(n) {\n  write('\\u001b[' + n + 'A');\n};\n\n/**\n * Move cursor down `n`.\n *\n * @param {Number} n\n * @api private\n */\n\nNyanCat.prototype.cursorDown = function(n) {\n  write('\\u001b[' + n + 'B');\n};\n\n/**\n * Generate rainbow colors.\n *\n * @return {Array}\n * @api private\n */\n\nNyanCat.prototype.generateColors = function(){\n  var colors = [];\n\n  for (var i = 0; i < (6 * 7); i++) {\n    var pi3 = Math.floor(Math.PI / 3);\n    var n = (i * (1.0 / 6));\n    var r = Math.floor(3 * Math.sin(n) + 3);\n    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);\n    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);\n    colors.push(36 * r + 6 * g + b + 16);\n  }\n\n  return colors;\n};\n\n/**\n * Apply rainbow to the given `str`.\n *\n * @param {String} str\n * @return {String}\n * @api private\n */\n\nNyanCat.prototype.rainbowify = function(str){\n  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];\n  this.colorIndex += 1;\n  return '\\u001b[38;5;' + color + 'm' + str + '\\u001b[0m';\n};\n\n/**\n * Stdout helper.\n */\n\nfunction write(string) {\n  process.stdout.write(string);\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nNyanCat.prototype = new F;\nNyanCat.prototype.constructor = NyanCat;\n\n\n}); // module: reporters/nyan.js\n\nrequire.register(\"reporters/progress.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , cursor = Base.cursor\n  , color = Base.color;\n\n/**\n * Expose `Progress`.\n */\n\nexports = module.exports = Progress;\n\n/**\n * General progress bar color.\n */\n\nBase.colors.progress = 90;\n\n/**\n * Initialize a new `Progress` bar test reporter.\n *\n * @param {Runner} runner\n * @param {Object} options\n * @api public\n */\n\nfunction Progress(runner, options) {\n  Base.call(this, runner);\n\n  var self = this\n    , options = options || {}\n    , stats = this.stats\n    , width = Base.window.width * .50 | 0\n    , total = runner.total\n    , complete = 0\n    , max = Math.max;\n\n  // default chars\n  options.open = options.open || '[';\n  options.complete = options.complete || '▬';\n  options.incomplete = options.incomplete || Base.symbols.dot;\n  options.close = options.close || ']';\n  options.verbose = false;\n\n  // tests started\n  runner.on('start', function(){\n    console.log();\n    cursor.hide();\n  });\n\n  // tests complete\n  runner.on('test end', function(){\n    complete++;\n    var incomplete = total - complete\n      , percent = complete / total\n      , n = width * percent | 0\n      , i = width - n;\n\n    cursor.CR();\n    process.stdout.write('\\u001b[J');\n    process.stdout.write(color('progress', '  ' + options.open));\n    process.stdout.write(Array(n).join(options.complete));\n    process.stdout.write(Array(i).join(options.incomplete));\n    process.stdout.write(color('progress', options.close));\n    if (options.verbose) {\n      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));\n    }\n  });\n\n  // tests are complete, output some stats\n  // and the failures if any\n  runner.on('end', function(){\n    cursor.show();\n    console.log();\n    self.epilogue();\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nProgress.prototype = new F;\nProgress.prototype.constructor = Progress;\n\n\n}); // module: reporters/progress.js\n\nrequire.register(\"reporters/spec.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , cursor = Base.cursor\n  , color = Base.color;\n\n/**\n * Expose `Spec`.\n */\n\nexports = module.exports = Spec;\n\n/**\n * Initialize a new `Spec` test reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction Spec(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , indents = 0\n    , n = 0;\n\n  function indent() {\n    return Array(indents).join('  ')\n  }\n\n  runner.on('start', function(){\n    console.log();\n  });\n\n  runner.on('suite', function(suite){\n    ++indents;\n    console.log(color('suite', '%s%s'), indent(), suite.title);\n  });\n\n  runner.on('suite end', function(suite){\n    --indents;\n    if (1 == indents) console.log();\n  });\n\n  runner.on('test', function(test){\n    process.stdout.write(indent() + color('pass', '  ◦ ' + test.title + ': '));\n  });\n\n  runner.on('pending', function(test){\n    var fmt = indent() + color('pending', '  - %s');\n    console.log(fmt, test.title);\n  });\n\n  runner.on('pass', function(test){\n    if ('fast' == test.speed) {\n      var fmt = indent()\n        + color('checkmark', '  ' + Base.symbols.ok)\n        + color('pass', ' %s ');\n      cursor.CR();\n      console.log(fmt, test.title);\n    } else {\n      var fmt = indent()\n        + color('checkmark', '  ' + Base.symbols.ok)\n        + color('pass', ' %s ')\n        + color(test.speed, '(%dms)');\n      cursor.CR();\n      console.log(fmt, test.title, test.duration);\n    }\n  });\n\n  runner.on('fail', function(test, err){\n    cursor.CR();\n    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);\n  });\n\n  runner.on('end', self.epilogue.bind(self));\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nSpec.prototype = new F;\nSpec.prototype.constructor = Spec;\n\n\n}); // module: reporters/spec.js\n\nrequire.register(\"reporters/tap.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , cursor = Base.cursor\n  , color = Base.color;\n\n/**\n * Expose `TAP`.\n */\n\nexports = module.exports = TAP;\n\n/**\n * Initialize a new `TAP` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction TAP(runner) {\n  Base.call(this, runner);\n\n  var self = this\n    , stats = this.stats\n    , n = 1\n    , passes = 0\n    , failures = 0;\n\n  runner.on('start', function(){\n    var total = runner.grepTotal(runner.suite);\n    console.log('%d..%d', 1, total);\n  });\n\n  runner.on('test end', function(){\n    ++n;\n  });\n\n  runner.on('pending', function(test){\n    console.log('ok %d %s # SKIP -', n, title(test));\n  });\n\n  runner.on('pass', function(test){\n    passes++;\n    console.log('ok %d %s', n, title(test));\n  });\n\n  runner.on('fail', function(test, err){\n    failures++;\n    console.log('not ok %d %s', n, title(test));\n    if (err.stack) console.log(err.stack.replace(/^/gm, '  '));\n  });\n\n  runner.on('end', function(){\n    console.log('# tests ' + (passes + failures));\n    console.log('# pass ' + passes);\n    console.log('# fail ' + failures);\n  });\n}\n\n/**\n * Return a TAP-safe title of `test`\n *\n * @param {Object} test\n * @return {String}\n * @api private\n */\n\nfunction title(test) {\n  return test.fullTitle().replace(/#/g, '');\n}\n\n}); // module: reporters/tap.js\n\nrequire.register(\"reporters/xunit.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Base = require('./base')\n  , utils = require('../utils')\n  , escape = utils.escape;\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\nvar Date = global.Date\n  , setTimeout = global.setTimeout\n  , setInterval = global.setInterval\n  , clearTimeout = global.clearTimeout\n  , clearInterval = global.clearInterval;\n\n/**\n * Expose `XUnit`.\n */\n\nexports = module.exports = XUnit;\n\n/**\n * Initialize a new `XUnit` reporter.\n *\n * @param {Runner} runner\n * @api public\n */\n\nfunction XUnit(runner) {\n  Base.call(this, runner);\n  var stats = this.stats\n    , tests = []\n    , self = this;\n\n  runner.on('pass', function(test){\n    tests.push(test);\n  });\n\n  runner.on('fail', function(test){\n    tests.push(test);\n  });\n\n  runner.on('end', function(){\n    console.log(tag('testsuite', {\n        name: 'Mocha Tests'\n      , tests: stats.tests\n      , failures: stats.failures\n      , errors: stats.failures\n      , skipped: stats.tests - stats.failures - stats.passes\n      , timestamp: (new Date).toUTCString()\n      , time: (stats.duration / 1000) || 0\n    }, false));\n\n    tests.forEach(test);\n    console.log('</testsuite>');\n  });\n}\n\n/**\n * Inherit from `Base.prototype`.\n */\n\nfunction F(){};\nF.prototype = Base.prototype;\nXUnit.prototype = new F;\nXUnit.prototype.constructor = XUnit;\n\n\n/**\n * Output tag for the given `test.`\n */\n\nfunction test(test) {\n  var attrs = {\n      classname: test.parent.fullTitle()\n    , name: test.title\n    , time: test.duration / 1000\n  };\n\n  if ('failed' == test.state) {\n    var err = test.err;\n    attrs.message = escape(err.message);\n    console.log(tag('testcase', attrs, false, tag('failure', attrs, false, cdata(err.stack))));\n  } else if (test.pending) {\n    console.log(tag('testcase', attrs, false, tag('skipped', {}, true)));\n  } else {\n    console.log(tag('testcase', attrs, true) );\n  }\n}\n\n/**\n * HTML tag helper.\n */\n\nfunction tag(name, attrs, close, content) {\n  var end = close ? '/>' : '>'\n    , pairs = []\n    , tag;\n\n  for (var key in attrs) {\n    pairs.push(key + '=\"' + escape(attrs[key]) + '\"');\n  }\n\n  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;\n  if (content) tag += content + '</' + name + end;\n  return tag;\n}\n\n/**\n * Return cdata escaped CDATA `str`.\n */\n\nfunction cdata(str) {\n  return '<![CDATA[' + escape(str) + ']]>';\n}\n\n}); // module: reporters/xunit.js\n\nrequire.register(\"runnable.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar EventEmitter = require('browser/events').EventEmitter\n  , debug = require('browser/debug')('mocha:runnable')\n  , milliseconds = require('./ms');\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\nvar Date = global.Date\n  , setTimeout = global.setTimeout\n  , setInterval = global.setInterval\n  , clearTimeout = global.clearTimeout\n  , clearInterval = global.clearInterval;\n\n/**\n * Object#toString().\n */\n\nvar toString = Object.prototype.toString;\n\n/**\n * Expose `Runnable`.\n */\n\nmodule.exports = Runnable;\n\n/**\n * Initialize a new `Runnable` with the given `title` and callback `fn`.\n *\n * @param {String} title\n * @param {Function} fn\n * @api private\n */\n\nfunction Runnable(title, fn) {\n  this.title = title;\n  this.fn = fn;\n  this.async = fn && fn.length;\n  this.sync = ! this.async;\n  this._timeout = 2000;\n  this._slow = 75;\n  this.timedOut = false;\n}\n\n/**\n * Inherit from `EventEmitter.prototype`.\n */\n\nfunction F(){};\nF.prototype = EventEmitter.prototype;\nRunnable.prototype = new F;\nRunnable.prototype.constructor = Runnable;\n\n\n/**\n * Set & get timeout `ms`.\n *\n * @param {Number|String} ms\n * @return {Runnable|Number} ms or self\n * @api private\n */\n\nRunnable.prototype.timeout = function(ms){\n  if (0 == arguments.length) return this._timeout;\n  if ('string' == typeof ms) ms = milliseconds(ms);\n  debug('timeout %d', ms);\n  this._timeout = ms;\n  if (this.timer) this.resetTimeout();\n  return this;\n};\n\n/**\n * Set & get slow `ms`.\n *\n * @param {Number|String} ms\n * @return {Runnable|Number} ms or self\n * @api private\n */\n\nRunnable.prototype.slow = function(ms){\n  if (0 === arguments.length) return this._slow;\n  if ('string' == typeof ms) ms = milliseconds(ms);\n  debug('timeout %d', ms);\n  this._slow = ms;\n  return this;\n};\n\n/**\n * Return the full title generated by recursively\n * concatenating the parent's full title.\n *\n * @return {String}\n * @api public\n */\n\nRunnable.prototype.fullTitle = function(){\n  return this.parent.fullTitle() + ' ' + this.title;\n};\n\n/**\n * Clear the timeout.\n *\n * @api private\n */\n\nRunnable.prototype.clearTimeout = function(){\n  clearTimeout(this.timer);\n};\n\n/**\n * Inspect the runnable void of private properties.\n *\n * @return {String}\n * @api private\n */\n\nRunnable.prototype.inspect = function(){\n  return JSON.stringify(this, function(key, val){\n    if ('_' == key[0]) return;\n    if ('parent' == key) return '#<Suite>';\n    if ('ctx' == key) return '#<Context>';\n    return val;\n  }, 2);\n};\n\n/**\n * Reset the timeout.\n *\n * @api private\n */\n\nRunnable.prototype.resetTimeout = function(){\n  var self = this;\n  var ms = this.timeout() || 1e9;\n\n  this.clearTimeout();\n  this.timer = setTimeout(function(){\n    self.callback(new Error('timeout of ' + ms + 'ms exceeded'));\n    self.timedOut = true;\n  }, ms);\n};\n\n/**\n * Run the test and invoke `fn(err)`.\n *\n * @param {Function} fn\n * @api private\n */\n\nRunnable.prototype.run = function(fn){\n  var self = this\n    , ms = this.timeout()\n    , start = new Date\n    , ctx = this.ctx\n    , finished\n    , emitted;\n\n  if (ctx) ctx.runnable(this);\n\n  // timeout\n  if (this.async) {\n    if (ms) {\n      this.timer = setTimeout(function(){\n        done(new Error('timeout of ' + ms + 'ms exceeded'));\n        self.timedOut = true;\n      }, ms);\n    }\n  }\n\n  // called multiple times\n  function multiple(err) {\n    if (emitted) return;\n    emitted = true;\n    self.emit('error', err || new Error('done() called multiple times'));\n  }\n\n  // finished\n  function done(err) {\n    if (self.timedOut) return;\n    if (finished) return multiple(err);\n    self.clearTimeout();\n    self.duration = new Date - start;\n    finished = true;\n    fn(err);\n  }\n\n  // for .resetTimeout()\n  this.callback = done;\n\n  // async\n  if (this.async) {\n    try {\n      this.fn.call(ctx, function(err){\n        if (err instanceof Error || toString.call(err) === \"[object Error]\") return done(err);\n        if (null != err) return done(new Error('done() invoked with non-Error: ' + err));\n        done();\n      });\n    } catch (err) {\n      done(err);\n    }\n    return;\n  }\n\n  if (this.asyncOnly) {\n    return done(new Error('--async-only option in use without declaring `done()`'));\n  }\n\n  // sync\n  try {\n    if (!this.pending) this.fn.call(ctx);\n    this.duration = new Date - start;\n    fn();\n  } catch (err) {\n    fn(err);\n  }\n};\n\n}); // module: runnable.js\n\nrequire.register(\"runner.js\", function(module, exports, require){\n/**\n * Module dependencies.\n */\n\nvar EventEmitter = require('browser/events').EventEmitter\n  , debug = require('browser/debug')('mocha:runner')\n  , Test = require('./test')\n  , utils = require('./utils')\n  , filter = utils.filter\n  , keys = utils.keys;\n\n/**\n * Non-enumerable globals.\n */\n\nvar globals = [\n  'setTimeout',\n  'clearTimeout',\n  'setInterval',\n  'clearInterval',\n  'XMLHttpRequest',\n  'Date'\n];\n\n/**\n * Expose `Runner`.\n */\n\nmodule.exports = Runner;\n\n/**\n * Initialize a `Runner` for the given `suite`.\n *\n * Events:\n *\n *   - `start`  execution started\n *   - `end`  execution complete\n *   - `suite`  (suite) test suite execution started\n *   - `suite end`  (suite) all tests (and sub-suites) have finished\n *   - `test`  (test) test execution started\n *   - `test end`  (test) test completed\n *   - `hook`  (hook) hook execution started\n *   - `hook end`  (hook) hook complete\n *   - `pass`  (test) test passed\n *   - `fail`  (test, err) test failed\n *   - `pending`  (test) test pending\n *\n * @api public\n */\n\nfunction Runner(suite) {\n  var self = this;\n  this._globals = [];\n  this.suite = suite;\n  this.total = suite.total();\n  this.failures = 0;\n  this.on('test end', function(test){ self.checkGlobals(test); });\n  this.on('hook end', function(hook){ self.checkGlobals(hook); });\n  this.grep(/.*/);\n  this.globals(this.globalProps().concat(['errno']));\n}\n\n/**\n * Wrapper for setImmediate, process.nextTick, or browser polyfill.\n *\n * @param {Function} fn\n * @api private\n */\n\nRunner.immediately = global.setImmediate || process.nextTick;\n\n/**\n * Inherit from `EventEmitter.prototype`.\n */\n\nfunction F(){};\nF.prototype = EventEmitter.prototype;\nRunner.prototype = new F;\nRunner.prototype.constructor = Runner;\n\n\n/**\n * Run tests with full titles matching `re`. Updates runner.total\n * with number of tests matched.\n *\n * @param {RegExp} re\n * @param {Boolean} invert\n * @return {Runner} for chaining\n * @api public\n */\n\nRunner.prototype.grep = function(re, invert){\n  debug('grep %s', re);\n  this._grep = re;\n  this._invert = invert;\n  this.total = this.grepTotal(this.suite);\n  return this;\n};\n\n/**\n * Returns the number of tests matching the grep search for the\n * given suite.\n *\n * @param {Suite} suite\n * @return {Number}\n * @api public\n */\n\nRunner.prototype.grepTotal = function(suite) {\n  var self = this;\n  var total = 0;\n\n  suite.eachTest(function(test){\n    var match = self._grep.test(test.fullTitle());\n    if (self._invert) match = !match;\n    if (match) total++;\n  });\n\n  return total;\n};\n\n/**\n * Return a list of global properties.\n *\n * @return {Array}\n * @api private\n */\n\nRunner.prototype.globalProps = function() {\n  var props = utils.keys(global);\n\n  // non-enumerables\n  for (var i = 0; i < globals.length; ++i) {\n    if (~utils.indexOf(props, globals[i])) continue;\n    props.push(globals[i]);\n  }\n\n  return props;\n};\n\n/**\n * Allow the given `arr` of globals.\n *\n * @param {Array} arr\n * @return {Runner} for chaining\n * @api public\n */\n\nRunner.prototype.globals = function(arr){\n  if (0 == arguments.length) return this._globals;\n  debug('globals %j', arr);\n  utils.forEach(arr, function(arr){\n    this._globals.push(arr);\n  }, this);\n  return this;\n};\n\n/**\n * Check for global variable leaks.\n *\n * @api private\n */\n\nRunner.prototype.checkGlobals = function(test){\n  if (this.ignoreLeaks) return;\n  var ok = this._globals;\n  var globals = this.globalProps();\n  var isNode = process.kill;\n  var leaks;\n\n  // check length - 2 ('errno' and 'location' globals)\n  if (isNode && 1 == ok.length - globals.length) return;\n  else if (2 == ok.length - globals.length) return;\n\n  if(this.prevGlobalsLength == globals.length) return;\n  this.prevGlobalsLength = globals.length;\n\n  leaks = filterLeaks(ok, globals);\n  this._globals = this._globals.concat(leaks);\n\n  if (leaks.length > 1) {\n    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));\n  } else if (leaks.length) {\n    this.fail(test, new Error('global leak detected: ' + leaks[0]));\n  }\n};\n\n/**\n * Fail the given `test`.\n *\n * @param {Test} test\n * @param {Error} err\n * @api private\n */\n\nRunner.prototype.fail = function(test, err){\n  ++this.failures;\n  test.state = 'failed';\n\n  if ('string' == typeof err) {\n    err = new Error('the string \"' + err + '\" was thrown, throw an Error :)');\n  }\n\n  this.emit('fail', test, err);\n};\n\n/**\n * Fail the given `hook` with `err`.\n *\n * Hook failures (currently) hard-end due\n * to that fact that a failing hook will\n * surely cause subsequent tests to fail,\n * causing jumbled reporting.\n *\n * @param {Hook} hook\n * @param {Error} err\n * @api private\n */\n\nRunner.prototype.failHook = function(hook, err){\n  this.fail(hook, err);\n  this.emit('end');\n};\n\n/**\n * Run hook `name` callbacks and then invoke `fn()`.\n *\n * @param {String} name\n * @param {Function} function\n * @api private\n */\n\nRunner.prototype.hook = function(name, fn){\n  var suite = this.suite\n    , hooks = suite['_' + name]\n    , self = this\n    , timer;\n\n  function next(i) {\n    var hook = hooks[i];\n    if (!hook) return fn();\n    if (self.failures && suite.bail()) return fn();\n    self.currentRunnable = hook;\n\n    hook.ctx.currentTest = self.test;\n\n    self.emit('hook', hook);\n\n    hook.on('error', function(err){\n      self.failHook(hook, err);\n    });\n\n    hook.run(function(err){\n      hook.removeAllListeners('error');\n      var testError = hook.error();\n      if (testError) self.fail(self.test, testError);\n      if (err) return self.failHook(hook, err);\n      self.emit('hook end', hook);\n      delete hook.ctx.currentTest;\n      next(++i);\n    });\n  }\n\n  Runner.immediately(function(){\n    next(0);\n  });\n};\n\n/**\n * Run hook `name` for the given array of `suites`\n * in order, and callback `fn(err)`.\n *\n * @param {String} name\n * @param {Array} suites\n * @param {Function} fn\n * @api private\n */\n\nRunner.prototype.hooks = function(name, suites, fn){\n  var self = this\n    , orig = this.suite;\n\n  function next(suite) {\n    self.suite = suite;\n\n    if (!suite) {\n      self.suite = orig;\n      return fn();\n    }\n\n    self.hook(name, function(err){\n      if (err) {\n        self.suite = orig;\n        return fn(err);\n      }\n\n      next(suites.pop());\n    });\n  }\n\n  next(suites.pop());\n};\n\n/**\n * Run hooks from the top level down.\n *\n * @param {String} name\n * @param {Function} fn\n * @api private\n */\n\nRunner.prototype.hookUp = function(name, fn){\n  var suites = [this.suite].concat(this.parents()).reverse();\n  this.hooks(name, suites, fn);\n};\n\n/**\n * Run hooks from the bottom up.\n *\n * @param {String} name\n * @param {Function} fn\n * @api private\n */\n\nRunner.prototype.hookDown = function(name, fn){\n  var suites = [this.suite].concat(this.parents());\n  this.hooks(name, suites, fn);\n};\n\n/**\n * Return an array of parent Suites from\n * closest to furthest.\n *\n * @return {Array}\n * @api private\n */\n\nRunner.prototype.parents = function(){\n  var suite = this.suite\n    , suites = [];\n  while (suite = suite.parent) suites.push(suite);\n  return suites;\n};\n\n/**\n * Run the current test and callback `fn(err)`.\n *\n * @param {Function} fn\n * @api private\n */\n\nRunner.prototype.runTest = function(fn){\n  var test = this.test\n    , self = this;\n\n  if (this.asyncOnly) test.asyncOnly = true;\n\n  try {\n    test.on('error', function(err){\n      self.fail(test, err);\n    });\n    test.run(fn);\n  } catch (err) {\n    fn(err);\n  }\n};\n\n/**\n * Run tests in the given `suite` and invoke\n * the callback `fn()` when complete.\n *\n * @param {Suite} suite\n * @param {Function} fn\n * @api private\n */\n\nRunner.prototype.runTests = function(suite, fn){\n  var self = this\n    , tests = suite.tests.slice()\n    , test;\n\n  function next(err) {\n    // if we bail after first err\n    if (self.failures && suite._bail) return fn();\n\n    // next test\n    test = tests.shift();\n\n    // all done\n    if (!test) return fn();\n\n    // grep\n    var match = self._grep.test(test.fullTitle());\n    if (self._invert) match = !match;\n    if (!match) return next();\n\n    // pending\n    if (test.pending) {\n      self.emit('pending', test);\n      self.emit('test end', test);\n      return next();\n    }\n\n    // execute test and hook(s)\n    self.emit('test', self.test = test);\n    self.hookDown('beforeEach', function(){\n      self.currentRunnable = self.test;\n      self.runTest(function(err){\n        test = self.test;\n\n        if (err) {\n          self.fail(test, err);\n          self.emit('test end', test);\n          return self.hookUp('afterEach', next);\n        }\n\n        test.state = 'passed';\n        self.emit('pass', test);\n        self.emit('test end', test);\n        self.hookUp('afterEach', next);\n      });\n    });\n  }\n\n  this.next = next;\n  next();\n};\n\n/**\n * Run the given `suite` and invoke the\n * callback `fn()` when complete.\n *\n * @param {Suite} suite\n * @param {Function} fn\n * @api private\n */\n\nRunner.prototype.runSuite = function(suite, fn){\n  var total = this.grepTotal(suite)\n    , self = this\n    , i = 0;\n\n  debug('run suite %s', suite.fullTitle());\n\n  if (!total) return fn();\n\n  this.emit('suite', this.suite = suite);\n\n  function next() {\n    var curr = suite.suites[i++];\n    if (!curr) return done();\n    self.runSuite(curr, next);\n  }\n\n  function done() {\n    self.suite = suite;\n    self.hook('afterAll', function(){\n      self.emit('suite end', suite);\n      fn();\n    });\n  }\n\n  this.hook('beforeAll', function(){\n    self.runTests(suite, next);\n  });\n};\n\n/**\n * Handle uncaught exceptions.\n *\n * @param {Error} err\n * @api private\n */\n\nRunner.prototype.uncaught = function(err){\n  debug('uncaught exception %s', err.message);\n  var runnable = this.currentRunnable;\n  if (!runnable || 'failed' == runnable.state) return;\n  runnable.clearTimeout();\n  err.uncaught = true;\n  this.fail(runnable, err);\n\n  // recover from test\n  if ('test' == runnable.type) {\n    this.emit('test end', runnable);\n    this.hookUp('afterEach', this.next);\n    return;\n  }\n\n  // bail on hooks\n  this.emit('end');\n};\n\n/**\n * Run the root suite and invoke `fn(failures)`\n * on completion.\n *\n * @param {Function} fn\n * @return {Runner} for chaining\n * @api public\n */\n\nRunner.prototype.run = function(fn){\n  var self = this\n    , fn = fn || function(){};\n\n  function uncaught(err){\n    self.uncaught(err);\n  }\n\n  debug('start');\n\n  // callback\n  this.on('end', function(){\n    debug('end');\n    process.removeListener('uncaughtException', uncaught);\n    fn(self.failures);\n  });\n\n  // run suites\n  this.emit('start');\n  this.runSuite(this.suite, function(){\n    debug('finished running');\n    self.emit('end');\n  });\n\n  // uncaught exception\n  process.on('uncaughtException', uncaught);\n\n  return this;\n};\n\n/**\n * Filter leaks with the given globals flagged as `ok`.\n *\n * @param {Array} ok\n * @param {Array} globals\n * @return {Array}\n * @api private\n */\n\nfunction filterLeaks(ok, globals) {\n  return filter(globals, function(key){\n    // Firefox and Chrome exposes iframes as index inside the window object\n    if (/^d+/.test(key)) return false;\n\n    // in firefox\n    // if runner runs in an iframe, this iframe's window.getInterface method not init at first\n    // it is assigned in some seconds\n    if (global.navigator && /^getInterface/.test(key)) return false;\n\n    // an iframe could be approached by window[iframeIndex]\n    // in ie6,7,8 and opera, iframeIndex is enumerable, this could cause leak\n    if (global.navigator && /^\\d+/.test(key)) return false;\n\n    // Opera and IE expose global variables for HTML element IDs (issue #243)\n    if (/^mocha-/.test(key)) return false;\n\n    var matched = filter(ok, function(ok){\n      if (~ok.indexOf('*')) return 0 == key.indexOf(ok.split('*')[0]);\n      return key == ok;\n    });\n    return matched.length == 0 && (!global.navigator || 'onerror' !== key);\n  });\n}\n\n}); // module: runner.js\n\nrequire.register(\"suite.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar EventEmitter = require('browser/events').EventEmitter\n  , debug = require('browser/debug')('mocha:suite')\n  , milliseconds = require('./ms')\n  , utils = require('./utils')\n  , Hook = require('./hook');\n\n/**\n * Expose `Suite`.\n */\n\nexports = module.exports = Suite;\n\n/**\n * Create a new `Suite` with the given `title`\n * and parent `Suite`. When a suite with the\n * same title is already present, that suite\n * is returned to provide nicer reporter\n * and more flexible meta-testing.\n *\n * @param {Suite} parent\n * @param {String} title\n * @return {Suite}\n * @api public\n */\n\nexports.create = function(parent, title){\n  var suite = new Suite(title, parent.ctx);\n  suite.parent = parent;\n  if (parent.pending) suite.pending = true;\n  title = suite.fullTitle();\n  parent.addSuite(suite);\n  return suite;\n};\n\n/**\n * Initialize a new `Suite` with the given\n * `title` and `ctx`.\n *\n * @param {String} title\n * @param {Context} ctx\n * @api private\n */\n\nfunction Suite(title, ctx) {\n  this.title = title;\n  this.ctx = ctx;\n  this.suites = [];\n  this.tests = [];\n  this.pending = false;\n  this._beforeEach = [];\n  this._beforeAll = [];\n  this._afterEach = [];\n  this._afterAll = [];\n  this.root = !title;\n  this._timeout = 2000;\n  this._slow = 75;\n  this._bail = false;\n}\n\n/**\n * Inherit from `EventEmitter.prototype`.\n */\n\nfunction F(){};\nF.prototype = EventEmitter.prototype;\nSuite.prototype = new F;\nSuite.prototype.constructor = Suite;\n\n\n/**\n * Return a clone of this `Suite`.\n *\n * @return {Suite}\n * @api private\n */\n\nSuite.prototype.clone = function(){\n  var suite = new Suite(this.title);\n  debug('clone');\n  suite.ctx = this.ctx;\n  suite.timeout(this.timeout());\n  suite.slow(this.slow());\n  suite.bail(this.bail());\n  return suite;\n};\n\n/**\n * Set timeout `ms` or short-hand such as \"2s\".\n *\n * @param {Number|String} ms\n * @return {Suite|Number} for chaining\n * @api private\n */\n\nSuite.prototype.timeout = function(ms){\n  if (0 == arguments.length) return this._timeout;\n  if ('string' == typeof ms) ms = milliseconds(ms);\n  debug('timeout %d', ms);\n  this._timeout = parseInt(ms, 10);\n  return this;\n};\n\n/**\n * Set slow `ms` or short-hand such as \"2s\".\n *\n * @param {Number|String} ms\n * @return {Suite|Number} for chaining\n * @api private\n */\n\nSuite.prototype.slow = function(ms){\n  if (0 === arguments.length) return this._slow;\n  if ('string' == typeof ms) ms = milliseconds(ms);\n  debug('slow %d', ms);\n  this._slow = ms;\n  return this;\n};\n\n/**\n * Sets whether to bail after first error.\n *\n * @parma {Boolean} bail\n * @return {Suite|Number} for chaining\n * @api private\n */\n\nSuite.prototype.bail = function(bail){\n  if (0 == arguments.length) return this._bail;\n  debug('bail %s', bail);\n  this._bail = bail;\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` before running tests.\n *\n * @param {Function} fn\n * @return {Suite} for chaining\n * @api private\n */\n\nSuite.prototype.beforeAll = function(fn){\n  if (this.pending) return this;\n  var hook = new Hook('\"before all\" hook', fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._beforeAll.push(hook);\n  this.emit('beforeAll', hook);\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` after running tests.\n *\n * @param {Function} fn\n * @return {Suite} for chaining\n * @api private\n */\n\nSuite.prototype.afterAll = function(fn){\n  if (this.pending) return this;\n  var hook = new Hook('\"after all\" hook', fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._afterAll.push(hook);\n  this.emit('afterAll', hook);\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` before each test case.\n *\n * @param {Function} fn\n * @return {Suite} for chaining\n * @api private\n */\n\nSuite.prototype.beforeEach = function(fn){\n  if (this.pending) return this;\n  var hook = new Hook('\"before each\" hook', fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._beforeEach.push(hook);\n  this.emit('beforeEach', hook);\n  return this;\n};\n\n/**\n * Run `fn(test[, done])` after each test case.\n *\n * @param {Function} fn\n * @return {Suite} for chaining\n * @api private\n */\n\nSuite.prototype.afterEach = function(fn){\n  if (this.pending) return this;\n  var hook = new Hook('\"after each\" hook', fn);\n  hook.parent = this;\n  hook.timeout(this.timeout());\n  hook.slow(this.slow());\n  hook.ctx = this.ctx;\n  this._afterEach.push(hook);\n  this.emit('afterEach', hook);\n  return this;\n};\n\n/**\n * Add a test `suite`.\n *\n * @param {Suite} suite\n * @return {Suite} for chaining\n * @api private\n */\n\nSuite.prototype.addSuite = function(suite){\n  suite.parent = this;\n  suite.timeout(this.timeout());\n  suite.slow(this.slow());\n  suite.bail(this.bail());\n  this.suites.push(suite);\n  this.emit('suite', suite);\n  return this;\n};\n\n/**\n * Add a `test` to this suite.\n *\n * @param {Test} test\n * @return {Suite} for chaining\n * @api private\n */\n\nSuite.prototype.addTest = function(test){\n  test.parent = this;\n  test.timeout(this.timeout());\n  test.slow(this.slow());\n  test.ctx = this.ctx;\n  this.tests.push(test);\n  this.emit('test', test);\n  return this;\n};\n\n/**\n * Return the full title generated by recursively\n * concatenating the parent's full title.\n *\n * @return {String}\n * @api public\n */\n\nSuite.prototype.fullTitle = function(){\n  if (this.parent) {\n    var full = this.parent.fullTitle();\n    if (full) return full + ' ' + this.title;\n  }\n  return this.title;\n};\n\n/**\n * Return the total number of tests.\n *\n * @return {Number}\n * @api public\n */\n\nSuite.prototype.total = function(){\n  return utils.reduce(this.suites, function(sum, suite){\n    return sum + suite.total();\n  }, 0) + this.tests.length;\n};\n\n/**\n * Iterates through each suite recursively to find\n * all tests. Applies a function in the format\n * `fn(test)`.\n *\n * @param {Function} fn\n * @return {Suite}\n * @api private\n */\n\nSuite.prototype.eachTest = function(fn){\n  utils.forEach(this.tests, fn);\n  utils.forEach(this.suites, function(suite){\n    suite.eachTest(fn);\n  });\n  return this;\n};\n\n}); // module: suite.js\n\nrequire.register(\"test.js\", function(module, exports, require){\n\n/**\n * Module dependencies.\n */\n\nvar Runnable = require('./runnable');\n\n/**\n * Expose `Test`.\n */\n\nmodule.exports = Test;\n\n/**\n * Initialize a new `Test` with the given `title` and callback `fn`.\n *\n * @param {String} title\n * @param {Function} fn\n * @api private\n */\n\nfunction Test(title, fn) {\n  Runnable.call(this, title, fn);\n  this.pending = !fn;\n  this.type = 'test';\n}\n\n/**\n * Inherit from `Runnable.prototype`.\n */\n\nfunction F(){};\nF.prototype = Runnable.prototype;\nTest.prototype = new F;\nTest.prototype.constructor = Test;\n\n\n}); // module: test.js\n\nrequire.register(\"utils.js\", function(module, exports, require){\n/**\n * Module dependencies.\n */\n\nvar fs = require('browser/fs')\n  , path = require('browser/path')\n  , join = path.join\n  , debug = require('browser/debug')('mocha:watch');\n\n/**\n * Ignored directories.\n */\n\nvar ignore = ['node_modules', '.git'];\n\n/**\n * Escape special characters in the given string of html.\n *\n * @param  {String} html\n * @return {String}\n * @api private\n */\n\nexports.escape = function(html){\n  return String(html)\n    .replace(/&/g, '&amp;')\n    .replace(/\"/g, '&quot;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;');\n};\n\n/**\n * Array#forEach (<=IE8)\n *\n * @param {Array} array\n * @param {Function} fn\n * @param {Object} scope\n * @api private\n */\n\nexports.forEach = function(arr, fn, scope){\n  for (var i = 0, l = arr.length; i < l; i++)\n    fn.call(scope, arr[i], i);\n};\n\n/**\n * Array#indexOf (<=IE8)\n *\n * @parma {Array} arr\n * @param {Object} obj to find index of\n * @param {Number} start\n * @api private\n */\n\nexports.indexOf = function(arr, obj, start){\n  for (var i = start || 0, l = arr.length; i < l; i++) {\n    if (arr[i] === obj)\n      return i;\n  }\n  return -1;\n};\n\n/**\n * Array#reduce (<=IE8)\n *\n * @param {Array} array\n * @param {Function} fn\n * @param {Object} initial value\n * @api private\n */\n\nexports.reduce = function(arr, fn, val){\n  var rval = val;\n\n  for (var i = 0, l = arr.length; i < l; i++) {\n    rval = fn(rval, arr[i], i, arr);\n  }\n\n  return rval;\n};\n\n/**\n * Array#filter (<=IE8)\n *\n * @param {Array} array\n * @param {Function} fn\n * @api private\n */\n\nexports.filter = function(arr, fn){\n  var ret = [];\n\n  for (var i = 0, l = arr.length; i < l; i++) {\n    var val = arr[i];\n    if (fn(val, i, arr)) ret.push(val);\n  }\n\n  return ret;\n};\n\n/**\n * Object.keys (<=IE8)\n *\n * @param {Object} obj\n * @return {Array} keys\n * @api private\n */\n\nexports.keys = Object.keys || function(obj) {\n  var keys = []\n    , has = Object.prototype.hasOwnProperty // for `window` on <=IE8\n\n  for (var key in obj) {\n    if (has.call(obj, key)) {\n      keys.push(key);\n    }\n  }\n\n  return keys;\n};\n\n/**\n * Watch the given `files` for changes\n * and invoke `fn(file)` on modification.\n *\n * @param {Array} files\n * @param {Function} fn\n * @api private\n */\n\nexports.watch = function(files, fn){\n  var options = { interval: 100 };\n  files.forEach(function(file){\n    debug('file %s', file);\n    fs.watchFile(file, options, function(curr, prev){\n      if (prev.mtime < curr.mtime) fn(file);\n    });\n  });\n};\n\n/**\n * Ignored files.\n */\n\nfunction ignored(path){\n  return !~ignore.indexOf(path);\n}\n\n/**\n * Lookup files in the given `dir`.\n *\n * @return {Array}\n * @api private\n */\n\nexports.files = function(dir, ret){\n  ret = ret || [];\n\n  fs.readdirSync(dir)\n  .filter(ignored)\n  .forEach(function(path){\n    path = join(dir, path);\n    if (fs.statSync(path).isDirectory()) {\n      exports.files(path, ret);\n    } else if (path.match(/\\.(js|coffee|litcoffee|coffee.md)$/)) {\n      ret.push(path);\n    }\n  });\n\n  return ret;\n};\n\n/**\n * Compute a slug from the given `str`.\n *\n * @param {String} str\n * @return {String}\n * @api private\n */\n\nexports.slug = function(str){\n  return str\n    .toLowerCase()\n    .replace(/ +/g, '-')\n    .replace(/[^-\\w]/g, '');\n};\n\n/**\n * Strip the function definition from `str`,\n * and re-indent for pre whitespace.\n */\n\nexports.clean = function(str) {\n  str = str\n    .replace(/^function *\\(.*\\) *{/, '')\n    .replace(/\\s+\\}$/, '');\n\n  var whitespace = str.match(/^\\n?(\\s*)/)[1]\n    , re = new RegExp('^' + whitespace, 'gm');\n\n  str = str.replace(re, '');\n\n  return exports.trim(str);\n};\n\n/**\n * Escape regular expression characters in `str`.\n *\n * @param {String} str\n * @return {String}\n * @api private\n */\n\nexports.escapeRegexp = function(str){\n  return str.replace(/[-\\\\^$*+?.()|[\\]{}]/g, \"\\\\$&\");\n};\n\n/**\n * Trim the given `str`.\n *\n * @param {String} str\n * @return {String}\n * @api private\n */\n\nexports.trim = function(str){\n  return str.replace(/^\\s+|\\s+$/g, '');\n};\n\n/**\n * Parse the given `qs`.\n *\n * @param {String} qs\n * @return {Object}\n * @api private\n */\n\nexports.parseQuery = function(qs){\n  return exports.reduce(qs.replace('?', '').split('&'), function(obj, pair){\n    var i = pair.indexOf('=')\n      , key = pair.slice(0, i)\n      , val = pair.slice(++i);\n\n    obj[key] = decodeURIComponent(val);\n    return obj;\n  }, {});\n};\n\n/**\n * Highlight the given string of `js`.\n *\n * @param {String} js\n * @return {String}\n * @api private\n */\n\nfunction highlight(js) {\n  return js\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/\\/\\/(.*)/gm, '<span class=\"comment\">//$1</span>')\n    .replace(/('.*?')/gm, '<span class=\"string\">$1</span>')\n    .replace(/(\\d+\\.\\d+)/gm, '<span class=\"number\">$1</span>')\n    .replace(/(\\d+)/gm, '<span class=\"number\">$1</span>')\n    .replace(/\\bnew *(\\w+)/gm, '<span class=\"keyword\">new</span> <span class=\"init\">$1</span>')\n    .replace(/\\b(function|new|throw|return|var|if|else)\\b/gm, '<span class=\"keyword\">$1</span>')\n}\n\n/**\n * Highlight the contents of tag `name`.\n *\n * @param {String} name\n * @api private\n */\n\nexports.highlightTags = function(name) {\n  var code = document.getElementsByTagName(name);\n  for (var i = 0, len = code.length; i < len; ++i) {\n    code[i].innerHTML = highlight(code[i].innerHTML);\n  }\n};\n\n}); // module: utils.js\n// The global object is \"self\" in Web Workers.\nglobal = (function() { return this; })();\n\n/**\n * Save timer references to avoid Sinon interfering (see GH-237).\n */\n\nvar Date = global.Date;\nvar setTimeout = global.setTimeout;\nvar setInterval = global.setInterval;\nvar clearTimeout = global.clearTimeout;\nvar clearInterval = global.clearInterval;\n\n/**\n * Node shims.\n *\n * These are meant only to allow\n * mocha.js to run untouched, not\n * to allow running node code in\n * the browser.\n */\n\nvar process = {};\nprocess.exit = function(status){};\nprocess.stdout = {};\n\n/**\n * Remove uncaughtException listener.\n */\n\nprocess.removeListener = function(e){\n  if ('uncaughtException' == e) {\n    global.onerror = function() {};\n  }\n};\n\n/**\n * Implements uncaughtException listener.\n */\n\nprocess.on = function(e, fn){\n  if ('uncaughtException' == e) {\n    global.onerror = function(err, url, line){\n      fn(new Error(err + ' (' + url + ':' + line + ')'));\n    };\n  }\n};\n\n/**\n * Expose mocha.\n */\n\nvar Mocha = global.Mocha = require('mocha'),\n    mocha = global.mocha = new Mocha({ reporter: 'html' });\n\nvar immediateQueue = []\n  , immediateTimeout;\n\nfunction timeslice() {\n  var immediateStart = new Date().getTime();\n  while (immediateQueue.length && (new Date().getTime() - immediateStart) < 100) {\n    immediateQueue.shift()();\n  }\n  if (immediateQueue.length) {\n    immediateTimeout = setTimeout(timeslice, 0);\n  } else {\n    immediateTimeout = null;\n  }\n}\n\n/**\n * High-performance override of Runner.immediately.\n */\n\nMocha.Runner.immediately = function(callback) {\n  immediateQueue.push(callback);\n  if (!immediateTimeout) {\n    immediateTimeout = setTimeout(timeslice, 0);\n  }\n};\n\n/**\n * Override ui to ensure that the ui functions are initialized.\n * Normally this would happen in Mocha.prototype.loadFiles.\n */\n\nmocha.ui = function(ui){\n  Mocha.prototype.ui.call(this, ui);\n  this.suite.emit('pre-require', global, null, this);\n  return this;\n};\n\n/**\n * Setup mocha with the given setting options.\n */\n\nmocha.setup = function(opts){\n  if ('string' == typeof opts) opts = { ui: opts };\n  for (var opt in opts) this[opt](opts[opt]);\n  return this;\n};\n\n/**\n * Run mocha, returning the Runner.\n */\n\nmocha.run = function(fn){\n  var options = mocha.options;\n  mocha.globals('location');\n\n  var query = Mocha.utils.parseQuery(global.location.search || '');\n  if (query.grep) mocha.grep(query.grep);\n  if (query.invert) mocha.invert();\n\n  return Mocha.prototype.run.call(mocha, function(){\n    // The DOM Document is not available in Web Workers.\n    if (global.document) {\n      Mocha.utils.highlightTags('code');\n    }\n    if (fn) fn();\n  });\n};\n\n/**\n * Expose the process shim.\n */\n\nMocha.process = process;\n})();\n"

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ";(function(){\n\n/**\n * Require the given path.\n *\n * @param {String} path\n * @return {Object} exports\n * @api public\n */\n\nfunction require(path, parent, orig) {\n  var resolved = require.resolve(path);\n\n  // lookup failed\n  if (null == resolved) {\n    orig = orig || path;\n    parent = parent || 'root';\n    var err = new Error('Failed to require \"' + orig + '\" from \"' + parent + '\"');\n    err.path = orig;\n    err.parent = parent;\n    err.require = true;\n    throw err;\n  }\n\n  var module = require.modules[resolved];\n\n  // perform real require()\n  // by invoking the module's\n  // registered function\n  if (!module._resolving && !module.exports) {\n    var mod = {};\n    mod.exports = {};\n    mod.client = mod.component = true;\n    module._resolving = true;\n    module.call(this, mod.exports, require.relative(resolved), mod);\n    delete module._resolving;\n    module.exports = mod.exports;\n  }\n\n  return module.exports;\n}\n\n/**\n * Registered modules.\n */\n\nrequire.modules = {};\n\n/**\n * Registered aliases.\n */\n\nrequire.aliases = {};\n\n/**\n * Resolve `path`.\n *\n * Lookup:\n *\n *   - PATH/index.js\n *   - PATH.js\n *   - PATH\n *\n * @param {String} path\n * @return {String} path or null\n * @api private\n */\n\nrequire.resolve = function(path) {\n  if (path.charAt(0) === '/') path = path.slice(1);\n\n  var paths = [\n    path,\n    path + '.js',\n    path + '.json',\n    path + '/index.js',\n    path + '/index.json'\n  ];\n\n  for (var i = 0; i < paths.length; i++) {\n    var path = paths[i];\n    if (require.modules.hasOwnProperty(path)) return path;\n    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];\n  }\n};\n\n/**\n * Normalize `path` relative to the current path.\n *\n * @param {String} curr\n * @param {String} path\n * @return {String}\n * @api private\n */\n\nrequire.normalize = function(curr, path) {\n  var segs = [];\n\n  if ('.' != path.charAt(0)) return path;\n\n  curr = curr.split('/');\n  path = path.split('/');\n\n  for (var i = 0; i < path.length; ++i) {\n    if ('..' == path[i]) {\n      curr.pop();\n    } else if ('.' != path[i] && '' != path[i]) {\n      segs.push(path[i]);\n    }\n  }\n\n  return curr.concat(segs).join('/');\n};\n\n/**\n * Register module at `path` with callback `definition`.\n *\n * @param {String} path\n * @param {Function} definition\n * @api private\n */\n\nrequire.register = function(path, definition) {\n  require.modules[path] = definition;\n};\n\n/**\n * Alias a module definition.\n *\n * @param {String} from\n * @param {String} to\n * @api private\n */\n\nrequire.alias = function(from, to) {\n  if (!require.modules.hasOwnProperty(from)) {\n    throw new Error('Failed to alias \"' + from + '\", it does not exist');\n  }\n  require.aliases[to] = from;\n};\n\n/**\n * Return a require function relative to the `parent` path.\n *\n * @param {String} parent\n * @return {Function}\n * @api private\n */\n\nrequire.relative = function(parent) {\n  var p = require.normalize(parent, '..');\n\n  /**\n   * lastIndexOf helper.\n   */\n\n  function lastIndexOf(arr, obj) {\n    var i = arr.length;\n    while (i--) {\n      if (arr[i] === obj) return i;\n    }\n    return -1;\n  }\n\n  /**\n   * The relative require() itself.\n   */\n\n  function localRequire(path) {\n    var resolved = localRequire.resolve(path);\n    return require(resolved, parent, path);\n  }\n\n  /**\n   * Resolve relative to the parent.\n   */\n\n  localRequire.resolve = function(path) {\n    var c = path.charAt(0);\n    if ('/' == c) return path.slice(1);\n    if ('.' == c) return require.normalize(p, path);\n\n    // resolve deps by returning\n    // the dep in the nearest \"deps\"\n    // directory\n    var segs = parent.split('/');\n    var i = lastIndexOf(segs, 'deps') + 1;\n    if (!i) i = 0;\n    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;\n    return path;\n  };\n\n  /**\n   * Check if module is defined at `path`.\n   */\n\n  localRequire.exists = function(path) {\n    return require.modules.hasOwnProperty(localRequire.resolve(path));\n  };\n\n  return localRequire;\n};\nrequire.register(\"chaijs-assertion-error/index.js\", function(exports, require, module){\n/*!\n * assertion-error\n * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>\n * MIT Licensed\n */\n\n/*!\n * Return a function that will copy properties from\n * one object to another excluding any originally\n * listed. Returned function will create a new `{}`.\n *\n * @param {String} excluded properties ...\n * @return {Function}\n */\n\nfunction exclude () {\n  var excludes = [].slice.call(arguments);\n\n  function excludeProps (res, obj) {\n    Object.keys(obj).forEach(function (key) {\n      if (!~excludes.indexOf(key)) res[key] = obj[key];\n    });\n  }\n\n  return function extendExclude () {\n    var args = [].slice.call(arguments)\n      , i = 0\n      , res = {};\n\n    for (; i < args.length; i++) {\n      excludeProps(res, args[i]);\n    }\n\n    return res;\n  };\n};\n\n/*!\n * Primary Exports\n */\n\nmodule.exports = AssertionError;\n\n/**\n * ### AssertionError\n *\n * An extension of the JavaScript `Error` constructor for\n * assertion and validation scenarios.\n *\n * @param {String} message\n * @param {Object} properties to include (optional)\n * @param {callee} start stack function (optional)\n */\n\nfunction AssertionError (message, _props, ssf) {\n  var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON')\n    , props = extend(_props || {});\n\n  // default values\n  this.message = message || 'Unspecified AssertionError';\n  this.showDiff = false;\n\n  // copy from properties\n  for (var key in props) {\n    this[key] = props[key];\n  }\n\n  // capture stack trace\n  ssf = ssf || arguments.callee;\n  if (ssf && Error.captureStackTrace) {\n    Error.captureStackTrace(this, ssf);\n  }\n}\n\n/*!\n * Inherit from Error.prototype\n */\n\nAssertionError.prototype = Object.create(Error.prototype);\n\n/*!\n * Statically set name\n */\n\nAssertionError.prototype.name = 'AssertionError';\n\n/*!\n * Ensure correct constructor\n */\n\nAssertionError.prototype.constructor = AssertionError;\n\n/**\n * Allow errors to be converted to JSON for static transfer.\n *\n * @param {Boolean} include stack (default: `true`)\n * @return {Object} object that can be `JSON.stringify`\n */\n\nAssertionError.prototype.toJSON = function (stack) {\n  var extend = exclude('constructor', 'toJSON', 'stack')\n    , props = extend({ name: this.name }, this);\n\n  // include stack if exists and not turned off\n  if (false !== stack && this.stack) {\n    props.stack = this.stack;\n  }\n\n  return props;\n};\n\n});\nrequire.register(\"chaijs-type-detect/lib/type.js\", function(exports, require, module){\n/*!\n * type-detect\n * Copyright(c) 2013 jake luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Primary Exports\n */\n\nvar exports = module.exports = getType;\n\n/*!\n * Detectable javascript natives\n */\n\nvar natives = {\n    '[object Array]': 'array'\n  , '[object RegExp]': 'regexp'\n  , '[object Function]': 'function'\n  , '[object Arguments]': 'arguments'\n  , '[object Date]': 'date'\n};\n\n/**\n * ### typeOf (obj)\n *\n * Use several different techniques to determine\n * the type of object being tested.\n *\n *\n * @param {Mixed} object\n * @return {String} object type\n * @api public\n */\n\nfunction getType (obj) {\n  var str = Object.prototype.toString.call(obj);\n  if (natives[str]) return natives[str];\n  if (obj === null) return 'null';\n  if (obj === undefined) return 'undefined';\n  if (obj === Object(obj)) return 'object';\n  return typeof obj;\n}\n\nexports.Library = Library;\n\n/**\n * ### Library\n *\n * Create a repository for custom type detection.\n *\n * ```js\n * var lib = new type.Library;\n * ```\n *\n */\n\nfunction Library () {\n  this.tests = {};\n}\n\n/**\n * #### .of (obj)\n *\n * Expose replacement `typeof` detection to the library.\n *\n * ```js\n * if ('string' === lib.of('hello world')) {\n *   // ...\n * }\n * ```\n *\n * @param {Mixed} object to test\n * @return {String} type\n */\n\nLibrary.prototype.of = getType;\n\n/**\n * #### .define (type, test)\n *\n * Add a test to for the `.test()` assertion.\n *\n * Can be defined as a regular expression:\n *\n * ```js\n * lib.define('int', /^[0-9]+$/);\n * ```\n *\n * ... or as a function:\n *\n * ```js\n * lib.define('bln', function (obj) {\n *   if ('boolean' === lib.of(obj)) return true;\n *   var blns = [ 'yes', 'no', 'true', 'false', 1, 0 ];\n *   if ('string' === lib.of(obj)) obj = obj.toLowerCase();\n *   return !! ~blns.indexOf(obj);\n * });\n * ```\n *\n * @param {String} type\n * @param {RegExp|Function} test\n * @api public\n */\n\nLibrary.prototype.define = function (type, test) {\n  if (arguments.length === 1) return this.tests[type];\n  this.tests[type] = test;\n  return this;\n};\n\n/**\n * #### .test (obj, test)\n *\n * Assert that an object is of type. Will first\n * check natives, and if that does not pass it will\n * use the user defined custom tests.\n *\n * ```js\n * assert(lib.test('1', 'int'));\n * assert(lib.test('yes', 'bln'));\n * ```\n *\n * @param {Mixed} object\n * @param {String} type\n * @return {Boolean} result\n * @api public\n */\n\nLibrary.prototype.test = function (obj, type) {\n  if (type === getType(obj)) return true;\n  var test = this.tests[type];\n\n  if (test && 'regexp' === getType(test)) {\n    return test.test(obj);\n  } else if (test && 'function' === getType(test)) {\n    return test(obj);\n  } else {\n    throw new ReferenceError('Type test \"' + type + '\" not defined or invalid.');\n  }\n};\n\n});\nrequire.register(\"chaijs-deep-eql/lib/eql.js\", function(exports, require, module){\n/*!\n * deep-eql\n * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Module dependencies\n */\n\nvar type = require('type-detect');\n\n/*!\n * Buffer.isBuffer browser shim\n */\n\nvar Buffer;\ntry { Buffer = require('buffer').Buffer; }\ncatch(ex) {\n  Buffer = {};\n  Buffer.isBuffer = function() { return false; }\n}\n\n/*!\n * Primary Export\n */\n\nmodule.exports = deepEqual;\n\n/**\n * Assert super-strict (egal) equality between\n * two objects of any type.\n *\n * @param {Mixed} a\n * @param {Mixed} b\n * @param {Array} memoised (optional)\n * @return {Boolean} equal match\n */\n\nfunction deepEqual(a, b, m) {\n  if (sameValue(a, b)) {\n    return true;\n  } else if ('date' === type(a)) {\n    return dateEqual(a, b);\n  } else if ('regexp' === type(a)) {\n    return regexpEqual(a, b);\n  } else if (Buffer.isBuffer(a)) {\n    return bufferEqual(a, b);\n  } else if ('arguments' === type(a)) {\n    return argumentsEqual(a, b, m);\n  } else if (!typeEqual(a, b)) {\n    return false;\n  } else if (('object' !== type(a) && 'object' !== type(b))\n  && ('array' !== type(a) && 'array' !== type(b))) {\n    return sameValue(a, b);\n  } else {\n    return objectEqual(a, b, m);\n  }\n}\n\n/*!\n * Strict (egal) equality test. Ensures that NaN always\n * equals NaN and `-0` does not equal `+0`.\n *\n * @param {Mixed} a\n * @param {Mixed} b\n * @return {Boolean} equal match\n */\n\nfunction sameValue(a, b) {\n  if (a === b) return a !== 0 || 1 / a === 1 / b;\n  return a !== a && b !== b;\n}\n\n/*!\n * Compare the types of two given objects and\n * return if they are equal. Note that an Array\n * has a type of `array` (not `object`) and arguments\n * have a type of `arguments` (not `array`/`object`).\n *\n * @param {Mixed} a\n * @param {Mixed} b\n * @return {Boolean} result\n */\n\nfunction typeEqual(a, b) {\n  return type(a) === type(b);\n}\n\n/*!\n * Compare two Date objects by asserting that\n * the time values are equal using `saveValue`.\n *\n * @param {Date} a\n * @param {Date} b\n * @return {Boolean} result\n */\n\nfunction dateEqual(a, b) {\n  if ('date' !== type(b)) return false;\n  return sameValue(a.getTime(), b.getTime());\n}\n\n/*!\n * Compare two regular expressions by converting them\n * to string and checking for `sameValue`.\n *\n * @param {RegExp} a\n * @param {RegExp} b\n * @return {Boolean} result\n */\n\nfunction regexpEqual(a, b) {\n  if ('regexp' !== type(b)) return false;\n  return sameValue(a.toString(), b.toString());\n}\n\n/*!\n * Assert deep equality of two `arguments` objects.\n * Unfortunately, these must be sliced to arrays\n * prior to test to ensure no bad behavior.\n *\n * @param {Arguments} a\n * @param {Arguments} b\n * @param {Array} memoize (optional)\n * @return {Boolean} result\n */\n\nfunction argumentsEqual(a, b, m) {\n  if ('arguments' !== type(b)) return false;\n  a = [].slice.call(a);\n  b = [].slice.call(b);\n  return deepEqual(a, b, m);\n}\n\n/*!\n * Get enumerable properties of a given object.\n *\n * @param {Object} a\n * @return {Array} property names\n */\n\nfunction enumerable(a) {\n  var res = [];\n  for (var key in a) res.push(key);\n  return res;\n}\n\n/*!\n * Simple equality for flat iterable objects\n * such as Arrays or Node.js buffers.\n *\n * @param {Iterable} a\n * @param {Iterable} b\n * @return {Boolean} result\n */\n\nfunction iterableEqual(a, b) {\n  if (a.length !==  b.length) return false;\n\n  var i = 0;\n  var match = true;\n\n  for (; i < a.length; i++) {\n    if (a[i] !== b[i]) {\n      match = false;\n      break;\n    }\n  }\n\n  return match;\n}\n\n/*!\n * Extension to `iterableEqual` specifically\n * for Node.js Buffers.\n *\n * @param {Buffer} a\n * @param {Mixed} b\n * @return {Boolean} result\n */\n\nfunction bufferEqual(a, b) {\n  if (!Buffer.isBuffer(b)) return false;\n  return iterableEqual(a, b);\n}\n\n/*!\n * Block for `objectEqual` ensuring non-existing\n * values don't get in.\n *\n * @param {Mixed} object\n * @return {Boolean} result\n */\n\nfunction isValue(a) {\n  return a !== null && a !== undefined;\n}\n\n/*!\n * Recursively check the equality of two objects.\n * Once basic sameness has been established it will\n * defer to `deepEqual` for each enumerable key\n * in the object.\n *\n * @param {Mixed} a\n * @param {Mixed} b\n * @return {Boolean} result\n */\n\nfunction objectEqual(a, b, m) {\n  if (!isValue(a) || !isValue(b)) {\n    return false;\n  }\n\n  if (a.prototype !== b.prototype) {\n    return false;\n  }\n\n  var i;\n  if (m) {\n    for (i = 0; i < m.length; i++) {\n      if ((m[i][0] === a && m[i][1] === b)\n      ||  (m[i][0] === b && m[i][1] === a)) {\n        return true;\n      }\n    }\n  } else {\n    m = [];\n  }\n\n  try {\n    var ka = enumerable(a);\n    var kb = enumerable(b);\n  } catch (ex) {\n    return false;\n  }\n\n  ka.sort();\n  kb.sort();\n\n  if (!iterableEqual(ka, kb)) {\n    return false;\n  }\n\n  m.push([ a, b ]);\n\n  var key;\n  for (i = ka.length - 1; i >= 0; i--) {\n    key = ka[i];\n    if (!deepEqual(a[key], b[key], m)) {\n      return false;\n    }\n  }\n\n  return true;\n}\n\n});\nrequire.register(\"chai/index.js\", function(exports, require, module){\nmodule.exports = require('./lib/chai');\n\n});\nrequire.register(\"chai/lib/chai.js\", function(exports, require, module){\n/*!\n * chai\n * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\nvar used = []\n  , exports = module.exports = {};\n\n/*!\n * Chai version\n */\n\nexports.version = '1.8.1';\n\n/*!\n * Assertion Error\n */\n\nexports.AssertionError = require('assertion-error');\n\n/*!\n * Utils for plugins (not exported)\n */\n\nvar util = require('./chai/utils');\n\n/**\n * # .use(function)\n *\n * Provides a way to extend the internals of Chai\n *\n * @param {Function}\n * @returns {this} for chaining\n * @api public\n */\n\nexports.use = function (fn) {\n  if (!~used.indexOf(fn)) {\n    fn(this, util);\n    used.push(fn);\n  }\n\n  return this;\n};\n\n/*!\n * Primary `Assertion` prototype\n */\n\nvar assertion = require('./chai/assertion');\nexports.use(assertion);\n\n/*!\n * Core Assertions\n */\n\nvar core = require('./chai/core/assertions');\nexports.use(core);\n\n/*!\n * Expect interface\n */\n\nvar expect = require('./chai/interface/expect');\nexports.use(expect);\n\n/*!\n * Should interface\n */\n\nvar should = require('./chai/interface/should');\nexports.use(should);\n\n/*!\n * Assert interface\n */\n\nvar assert = require('./chai/interface/assert');\nexports.use(assert);\n\n});\nrequire.register(\"chai/lib/chai/assertion.js\", function(exports, require, module){\n/*!\n * chai\n * http://chaijs.com\n * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\nmodule.exports = function (_chai, util) {\n  /*!\n   * Module dependencies.\n   */\n\n  var AssertionError = _chai.AssertionError\n    , flag = util.flag;\n\n  /*!\n   * Module export.\n   */\n\n  _chai.Assertion = Assertion;\n\n  /*!\n   * Assertion Constructor\n   *\n   * Creates object for chaining.\n   *\n   * @api private\n   */\n\n  function Assertion (obj, msg, stack) {\n    flag(this, 'ssfi', stack || arguments.callee);\n    flag(this, 'object', obj);\n    flag(this, 'message', msg);\n  }\n\n  /*!\n    * ### Assertion.includeStack\n    *\n    * User configurable property, influences whether stack trace\n    * is included in Assertion error message. Default of false\n    * suppresses stack trace in the error message\n    *\n    *     Assertion.includeStack = true;  // enable stack on error\n    *\n    * @api public\n    */\n\n  Assertion.includeStack = false;\n\n  /*!\n   * ### Assertion.showDiff\n   *\n   * User configurable property, influences whether or not\n   * the `showDiff` flag should be included in the thrown\n   * AssertionErrors. `false` will always be `false`; `true`\n   * will be true when the assertion has requested a diff\n   * be shown.\n   *\n   * @api public\n   */\n\n  Assertion.showDiff = true;\n\n  Assertion.addProperty = function (name, fn) {\n    util.addProperty(this.prototype, name, fn);\n  };\n\n  Assertion.addMethod = function (name, fn) {\n    util.addMethod(this.prototype, name, fn);\n  };\n\n  Assertion.addChainableMethod = function (name, fn, chainingBehavior) {\n    util.addChainableMethod(this.prototype, name, fn, chainingBehavior);\n  };\n\n  Assertion.overwriteProperty = function (name, fn) {\n    util.overwriteProperty(this.prototype, name, fn);\n  };\n\n  Assertion.overwriteMethod = function (name, fn) {\n    util.overwriteMethod(this.prototype, name, fn);\n  };\n\n  /*!\n   * ### .assert(expression, message, negateMessage, expected, actual)\n   *\n   * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.\n   *\n   * @name assert\n   * @param {Philosophical} expression to be tested\n   * @param {String} message to display if fails\n   * @param {String} negatedMessage to display if negated expression fails\n   * @param {Mixed} expected value (remember to check for negation)\n   * @param {Mixed} actual (optional) will default to `this.obj`\n   * @api private\n   */\n\n  Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {\n    var ok = util.test(this, arguments);\n    if (true !== showDiff) showDiff = false;\n    if (true !== Assertion.showDiff) showDiff = false;\n\n    if (!ok) {\n      var msg = util.getMessage(this, arguments)\n        , actual = util.getActual(this, arguments);\n      throw new AssertionError(msg, {\n          actual: actual\n        , expected: expected\n        , showDiff: showDiff\n      }, (Assertion.includeStack) ? this.assert : flag(this, 'ssfi'));\n    }\n  };\n\n  /*!\n   * ### ._obj\n   *\n   * Quick reference to stored `actual` value for plugin developers.\n   *\n   * @api private\n   */\n\n  Object.defineProperty(Assertion.prototype, '_obj',\n    { get: function () {\n        return flag(this, 'object');\n      }\n    , set: function (val) {\n        flag(this, 'object', val);\n      }\n  });\n};\n\n});\nrequire.register(\"chai/lib/chai/core/assertions.js\", function(exports, require, module){\n/*!\n * chai\n * http://chaijs.com\n * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\nmodule.exports = function (chai, _) {\n  var Assertion = chai.Assertion\n    , toString = Object.prototype.toString\n    , flag = _.flag;\n\n  /**\n   * ### Language Chains\n   *\n   * The following are provide as chainable getters to\n   * improve the readability of your assertions. They\n   * do not provide an testing capability unless they\n   * have been overwritten by a plugin.\n   *\n   * **Chains**\n   *\n   * - to\n   * - be\n   * - been\n   * - is\n   * - that\n   * - and\n   * - have\n   * - with\n   * - at\n   * - of\n   * - same\n   *\n   * @name language chains\n   * @api public\n   */\n\n  [ 'to', 'be', 'been'\n  , 'is', 'and', 'have'\n  , 'with', 'that', 'at'\n  , 'of', 'same' ].forEach(function (chain) {\n    Assertion.addProperty(chain, function () {\n      return this;\n    });\n  });\n\n  /**\n   * ### .not\n   *\n   * Negates any of assertions following in the chain.\n   *\n   *     expect(foo).to.not.equal('bar');\n   *     expect(goodFn).to.not.throw(Error);\n   *     expect({ foo: 'baz' }).to.have.property('foo')\n   *       .and.not.equal('bar');\n   *\n   * @name not\n   * @api public\n   */\n\n  Assertion.addProperty('not', function () {\n    flag(this, 'negate', true);\n  });\n\n  /**\n   * ### .deep\n   *\n   * Sets the `deep` flag, later used by the `equal` and\n   * `property` assertions.\n   *\n   *     expect(foo).to.deep.equal({ bar: 'baz' });\n   *     expect({ foo: { bar: { baz: 'quux' } } })\n   *       .to.have.deep.property('foo.bar.baz', 'quux');\n   *\n   * @name deep\n   * @api public\n   */\n\n  Assertion.addProperty('deep', function () {\n    flag(this, 'deep', true);\n  });\n\n  /**\n   * ### .a(type)\n   *\n   * The `a` and `an` assertions are aliases that can be\n   * used either as language chains or to assert a value's\n   * type.\n   *\n   *     // typeof\n   *     expect('test').to.be.a('string');\n   *     expect({ foo: 'bar' }).to.be.an('object');\n   *     expect(null).to.be.a('null');\n   *     expect(undefined).to.be.an('undefined');\n   *\n   *     // language chain\n   *     expect(foo).to.be.an.instanceof(Foo);\n   *\n   * @name a\n   * @alias an\n   * @param {String} type\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function an (type, msg) {\n    if (msg) flag(this, 'message', msg);\n    type = type.toLowerCase();\n    var obj = flag(this, 'object')\n      , article = ~[ 'a', 'e', 'i', 'o', 'u' ].indexOf(type.charAt(0)) ? 'an ' : 'a ';\n\n    this.assert(\n        type === _.type(obj)\n      , 'expected #{this} to be ' + article + type\n      , 'expected #{this} not to be ' + article + type\n    );\n  }\n\n  Assertion.addChainableMethod('an', an);\n  Assertion.addChainableMethod('a', an);\n\n  /**\n   * ### .include(value)\n   *\n   * The `include` and `contain` assertions can be used as either property\n   * based language chains or as methods to assert the inclusion of an object\n   * in an array or a substring in a string. When used as language chains,\n   * they toggle the `contain` flag for the `keys` assertion.\n   *\n   *     expect([1,2,3]).to.include(2);\n   *     expect('foobar').to.contain('foo');\n   *     expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');\n   *\n   * @name include\n   * @alias contain\n   * @param {Object|String|Number} obj\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function includeChainingBehavior () {\n    flag(this, 'contains', true);\n  }\n\n  function include (val, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object')\n    this.assert(\n        ~obj.indexOf(val)\n      , 'expected #{this} to include ' + _.inspect(val)\n      , 'expected #{this} to not include ' + _.inspect(val));\n  }\n\n  Assertion.addChainableMethod('include', include, includeChainingBehavior);\n  Assertion.addChainableMethod('contain', include, includeChainingBehavior);\n\n  /**\n   * ### .ok\n   *\n   * Asserts that the target is truthy.\n   *\n   *     expect('everthing').to.be.ok;\n   *     expect(1).to.be.ok;\n   *     expect(false).to.not.be.ok;\n   *     expect(undefined).to.not.be.ok;\n   *     expect(null).to.not.be.ok;\n   *\n   * @name ok\n   * @api public\n   */\n\n  Assertion.addProperty('ok', function () {\n    this.assert(\n        flag(this, 'object')\n      , 'expected #{this} to be truthy'\n      , 'expected #{this} to be falsy');\n  });\n\n  /**\n   * ### .true\n   *\n   * Asserts that the target is `true`.\n   *\n   *     expect(true).to.be.true;\n   *     expect(1).to.not.be.true;\n   *\n   * @name true\n   * @api public\n   */\n\n  Assertion.addProperty('true', function () {\n    this.assert(\n        true === flag(this, 'object')\n      , 'expected #{this} to be true'\n      , 'expected #{this} to be false'\n      , this.negate ? false : true\n    );\n  });\n\n  /**\n   * ### .false\n   *\n   * Asserts that the target is `false`.\n   *\n   *     expect(false).to.be.false;\n   *     expect(0).to.not.be.false;\n   *\n   * @name false\n   * @api public\n   */\n\n  Assertion.addProperty('false', function () {\n    this.assert(\n        false === flag(this, 'object')\n      , 'expected #{this} to be false'\n      , 'expected #{this} to be true'\n      , this.negate ? true : false\n    );\n  });\n\n  /**\n   * ### .null\n   *\n   * Asserts that the target is `null`.\n   *\n   *     expect(null).to.be.null;\n   *     expect(undefined).not.to.be.null;\n   *\n   * @name null\n   * @api public\n   */\n\n  Assertion.addProperty('null', function () {\n    this.assert(\n        null === flag(this, 'object')\n      , 'expected #{this} to be null'\n      , 'expected #{this} not to be null'\n    );\n  });\n\n  /**\n   * ### .undefined\n   *\n   * Asserts that the target is `undefined`.\n   *\n   *     expect(undefined).to.be.undefined;\n   *     expect(null).to.not.be.undefined;\n   *\n   * @name undefined\n   * @api public\n   */\n\n  Assertion.addProperty('undefined', function () {\n    this.assert(\n        undefined === flag(this, 'object')\n      , 'expected #{this} to be undefined'\n      , 'expected #{this} not to be undefined'\n    );\n  });\n\n  /**\n   * ### .exist\n   *\n   * Asserts that the target is neither `null` nor `undefined`.\n   *\n   *     var foo = 'hi'\n   *       , bar = null\n   *       , baz;\n   *\n   *     expect(foo).to.exist;\n   *     expect(bar).to.not.exist;\n   *     expect(baz).to.not.exist;\n   *\n   * @name exist\n   * @api public\n   */\n\n  Assertion.addProperty('exist', function () {\n    this.assert(\n        null != flag(this, 'object')\n      , 'expected #{this} to exist'\n      , 'expected #{this} to not exist'\n    );\n  });\n\n\n  /**\n   * ### .empty\n   *\n   * Asserts that the target's length is `0`. For arrays, it checks\n   * the `length` property. For objects, it gets the count of\n   * enumerable keys.\n   *\n   *     expect([]).to.be.empty;\n   *     expect('').to.be.empty;\n   *     expect({}).to.be.empty;\n   *\n   * @name empty\n   * @api public\n   */\n\n  Assertion.addProperty('empty', function () {\n    var obj = flag(this, 'object')\n      , expected = obj;\n\n    if (Array.isArray(obj) || 'string' === typeof object) {\n      expected = obj.length;\n    } else if (typeof obj === 'object') {\n      expected = Object.keys(obj).length;\n    }\n\n    this.assert(\n        !expected\n      , 'expected #{this} to be empty'\n      , 'expected #{this} not to be empty'\n    );\n  });\n\n  /**\n   * ### .arguments\n   *\n   * Asserts that the target is an arguments object.\n   *\n   *     function test () {\n   *       expect(arguments).to.be.arguments;\n   *     }\n   *\n   * @name arguments\n   * @alias Arguments\n   * @api public\n   */\n\n  function checkArguments () {\n    var obj = flag(this, 'object')\n      , type = Object.prototype.toString.call(obj);\n    this.assert(\n        '[object Arguments]' === type\n      , 'expected #{this} to be arguments but got ' + type\n      , 'expected #{this} to not be arguments'\n    );\n  }\n\n  Assertion.addProperty('arguments', checkArguments);\n  Assertion.addProperty('Arguments', checkArguments);\n\n  /**\n   * ### .equal(value)\n   *\n   * Asserts that the target is strictly equal (`===`) to `value`.\n   * Alternately, if the `deep` flag is set, asserts that\n   * the target is deeply equal to `value`.\n   *\n   *     expect('hello').to.equal('hello');\n   *     expect(42).to.equal(42);\n   *     expect(1).to.not.equal(true);\n   *     expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });\n   *     expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });\n   *\n   * @name equal\n   * @alias equals\n   * @alias eq\n   * @alias deep.equal\n   * @param {Mixed} value\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertEqual (val, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    if (flag(this, 'deep')) {\n      return this.eql(val);\n    } else {\n      this.assert(\n          val === obj\n        , 'expected #{this} to equal #{exp}'\n        , 'expected #{this} to not equal #{exp}'\n        , val\n        , this._obj\n        , true\n      );\n    }\n  }\n\n  Assertion.addMethod('equal', assertEqual);\n  Assertion.addMethod('equals', assertEqual);\n  Assertion.addMethod('eq', assertEqual);\n\n  /**\n   * ### .eql(value)\n   *\n   * Asserts that the target is deeply equal to `value`.\n   *\n   *     expect({ foo: 'bar' }).to.eql({ foo: 'bar' });\n   *     expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);\n   *\n   * @name eql\n   * @alias eqls\n   * @param {Mixed} value\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertEql(obj, msg) {\n    if (msg) flag(this, 'message', msg);\n    this.assert(\n        _.eql(obj, flag(this, 'object'))\n      , 'expected #{this} to deeply equal #{exp}'\n      , 'expected #{this} to not deeply equal #{exp}'\n      , obj\n      , this._obj\n      , true\n    );\n  }\n\n  Assertion.addMethod('eql', assertEql);\n  Assertion.addMethod('eqls', assertEql);\n\n  /**\n   * ### .above(value)\n   *\n   * Asserts that the target is greater than `value`.\n   *\n   *     expect(10).to.be.above(5);\n   *\n   * Can also be used in conjunction with `length` to\n   * assert a minimum length. The benefit being a\n   * more informative error message than if the length\n   * was supplied directly.\n   *\n   *     expect('foo').to.have.length.above(2);\n   *     expect([ 1, 2, 3 ]).to.have.length.above(2);\n   *\n   * @name above\n   * @alias gt\n   * @alias greaterThan\n   * @param {Number} value\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertAbove (n, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    if (flag(this, 'doLength')) {\n      new Assertion(obj, msg).to.have.property('length');\n      var len = obj.length;\n      this.assert(\n          len > n\n        , 'expected #{this} to have a length above #{exp} but got #{act}'\n        , 'expected #{this} to not have a length above #{exp}'\n        , n\n        , len\n      );\n    } else {\n      this.assert(\n          obj > n\n        , 'expected #{this} to be above ' + n\n        , 'expected #{this} to be at most ' + n\n      );\n    }\n  }\n\n  Assertion.addMethod('above', assertAbove);\n  Assertion.addMethod('gt', assertAbove);\n  Assertion.addMethod('greaterThan', assertAbove);\n\n  /**\n   * ### .least(value)\n   *\n   * Asserts that the target is greater than or equal to `value`.\n   *\n   *     expect(10).to.be.at.least(10);\n   *\n   * Can also be used in conjunction with `length` to\n   * assert a minimum length. The benefit being a\n   * more informative error message than if the length\n   * was supplied directly.\n   *\n   *     expect('foo').to.have.length.of.at.least(2);\n   *     expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);\n   *\n   * @name least\n   * @alias gte\n   * @param {Number} value\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertLeast (n, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    if (flag(this, 'doLength')) {\n      new Assertion(obj, msg).to.have.property('length');\n      var len = obj.length;\n      this.assert(\n          len >= n\n        , 'expected #{this} to have a length at least #{exp} but got #{act}'\n        , 'expected #{this} to have a length below #{exp}'\n        , n\n        , len\n      );\n    } else {\n      this.assert(\n          obj >= n\n        , 'expected #{this} to be at least ' + n\n        , 'expected #{this} to be below ' + n\n      );\n    }\n  }\n\n  Assertion.addMethod('least', assertLeast);\n  Assertion.addMethod('gte', assertLeast);\n\n  /**\n   * ### .below(value)\n   *\n   * Asserts that the target is less than `value`.\n   *\n   *     expect(5).to.be.below(10);\n   *\n   * Can also be used in conjunction with `length` to\n   * assert a maximum length. The benefit being a\n   * more informative error message than if the length\n   * was supplied directly.\n   *\n   *     expect('foo').to.have.length.below(4);\n   *     expect([ 1, 2, 3 ]).to.have.length.below(4);\n   *\n   * @name below\n   * @alias lt\n   * @alias lessThan\n   * @param {Number} value\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertBelow (n, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    if (flag(this, 'doLength')) {\n      new Assertion(obj, msg).to.have.property('length');\n      var len = obj.length;\n      this.assert(\n          len < n\n        , 'expected #{this} to have a length below #{exp} but got #{act}'\n        , 'expected #{this} to not have a length below #{exp}'\n        , n\n        , len\n      );\n    } else {\n      this.assert(\n          obj < n\n        , 'expected #{this} to be below ' + n\n        , 'expected #{this} to be at least ' + n\n      );\n    }\n  }\n\n  Assertion.addMethod('below', assertBelow);\n  Assertion.addMethod('lt', assertBelow);\n  Assertion.addMethod('lessThan', assertBelow);\n\n  /**\n   * ### .most(value)\n   *\n   * Asserts that the target is less than or equal to `value`.\n   *\n   *     expect(5).to.be.at.most(5);\n   *\n   * Can also be used in conjunction with `length` to\n   * assert a maximum length. The benefit being a\n   * more informative error message than if the length\n   * was supplied directly.\n   *\n   *     expect('foo').to.have.length.of.at.most(4);\n   *     expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);\n   *\n   * @name most\n   * @alias lte\n   * @param {Number} value\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertMost (n, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    if (flag(this, 'doLength')) {\n      new Assertion(obj, msg).to.have.property('length');\n      var len = obj.length;\n      this.assert(\n          len <= n\n        , 'expected #{this} to have a length at most #{exp} but got #{act}'\n        , 'expected #{this} to have a length above #{exp}'\n        , n\n        , len\n      );\n    } else {\n      this.assert(\n          obj <= n\n        , 'expected #{this} to be at most ' + n\n        , 'expected #{this} to be above ' + n\n      );\n    }\n  }\n\n  Assertion.addMethod('most', assertMost);\n  Assertion.addMethod('lte', assertMost);\n\n  /**\n   * ### .within(start, finish)\n   *\n   * Asserts that the target is within a range.\n   *\n   *     expect(7).to.be.within(5,10);\n   *\n   * Can also be used in conjunction with `length` to\n   * assert a length range. The benefit being a\n   * more informative error message than if the length\n   * was supplied directly.\n   *\n   *     expect('foo').to.have.length.within(2,4);\n   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);\n   *\n   * @name within\n   * @param {Number} start lowerbound inclusive\n   * @param {Number} finish upperbound inclusive\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('within', function (start, finish, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object')\n      , range = start + '..' + finish;\n    if (flag(this, 'doLength')) {\n      new Assertion(obj, msg).to.have.property('length');\n      var len = obj.length;\n      this.assert(\n          len >= start && len <= finish\n        , 'expected #{this} to have a length within ' + range\n        , 'expected #{this} to not have a length within ' + range\n      );\n    } else {\n      this.assert(\n          obj >= start && obj <= finish\n        , 'expected #{this} to be within ' + range\n        , 'expected #{this} to not be within ' + range\n      );\n    }\n  });\n\n  /**\n   * ### .instanceof(constructor)\n   *\n   * Asserts that the target is an instance of `constructor`.\n   *\n   *     var Tea = function (name) { this.name = name; }\n   *       , Chai = new Tea('chai');\n   *\n   *     expect(Chai).to.be.an.instanceof(Tea);\n   *     expect([ 1, 2, 3 ]).to.be.instanceof(Array);\n   *\n   * @name instanceof\n   * @param {Constructor} constructor\n   * @param {String} message _optional_\n   * @alias instanceOf\n   * @api public\n   */\n\n  function assertInstanceOf (constructor, msg) {\n    if (msg) flag(this, 'message', msg);\n    var name = _.getName(constructor);\n    this.assert(\n        flag(this, 'object') instanceof constructor\n      , 'expected #{this} to be an instance of ' + name\n      , 'expected #{this} to not be an instance of ' + name\n    );\n  };\n\n  Assertion.addMethod('instanceof', assertInstanceOf);\n  Assertion.addMethod('instanceOf', assertInstanceOf);\n\n  /**\n   * ### .property(name, [value])\n   *\n   * Asserts that the target has a property `name`, optionally asserting that\n   * the value of that property is strictly equal to  `value`.\n   * If the `deep` flag is set, you can use dot- and bracket-notation for deep\n   * references into objects and arrays.\n   *\n   *     // simple referencing\n   *     var obj = { foo: 'bar' };\n   *     expect(obj).to.have.property('foo');\n   *     expect(obj).to.have.property('foo', 'bar');\n   *\n   *     // deep referencing\n   *     var deepObj = {\n   *         green: { tea: 'matcha' }\n   *       , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]\n   *     };\n\n   *     expect(deepObj).to.have.deep.property('green.tea', 'matcha');\n   *     expect(deepObj).to.have.deep.property('teas[1]', 'matcha');\n   *     expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');\n   *\n   * You can also use an array as the starting point of a `deep.property`\n   * assertion, or traverse nested arrays.\n   *\n   *     var arr = [\n   *         [ 'chai', 'matcha', 'konacha' ]\n   *       , [ { tea: 'chai' }\n   *         , { tea: 'matcha' }\n   *         , { tea: 'konacha' } ]\n   *     ];\n   *\n   *     expect(arr).to.have.deep.property('[0][1]', 'matcha');\n   *     expect(arr).to.have.deep.property('[1][2].tea', 'konacha');\n   *\n   * Furthermore, `property` changes the subject of the assertion\n   * to be the value of that property from the original object. This\n   * permits for further chainable assertions on that property.\n   *\n   *     expect(obj).to.have.property('foo')\n   *       .that.is.a('string');\n   *     expect(deepObj).to.have.property('green')\n   *       .that.is.an('object')\n   *       .that.deep.equals({ tea: 'matcha' });\n   *     expect(deepObj).to.have.property('teas')\n   *       .that.is.an('array')\n   *       .with.deep.property('[2]')\n   *         .that.deep.equals({ tea: 'konacha' });\n   *\n   * @name property\n   * @alias deep.property\n   * @param {String} name\n   * @param {Mixed} value (optional)\n   * @param {String} message _optional_\n   * @returns value of property for chaining\n   * @api public\n   */\n\n  Assertion.addMethod('property', function (name, val, msg) {\n    if (msg) flag(this, 'message', msg);\n\n    var descriptor = flag(this, 'deep') ? 'deep property ' : 'property '\n      , negate = flag(this, 'negate')\n      , obj = flag(this, 'object')\n      , value = flag(this, 'deep')\n        ? _.getPathValue(name, obj)\n        : obj[name];\n\n    if (negate && undefined !== val) {\n      if (undefined === value) {\n        msg = (msg != null) ? msg + ': ' : '';\n        throw new Error(msg + _.inspect(obj) + ' has no ' + descriptor + _.inspect(name));\n      }\n    } else {\n      this.assert(\n          undefined !== value\n        , 'expected #{this} to have a ' + descriptor + _.inspect(name)\n        , 'expected #{this} to not have ' + descriptor + _.inspect(name));\n    }\n\n    if (undefined !== val) {\n      this.assert(\n          val === value\n        , 'expected #{this} to have a ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'\n        , 'expected #{this} to not have a ' + descriptor + _.inspect(name) + ' of #{act}'\n        , val\n        , value\n      );\n    }\n\n    flag(this, 'object', value);\n  });\n\n\n  /**\n   * ### .ownProperty(name)\n   *\n   * Asserts that the target has an own property `name`.\n   *\n   *     expect('test').to.have.ownProperty('length');\n   *\n   * @name ownProperty\n   * @alias haveOwnProperty\n   * @param {String} name\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertOwnProperty (name, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    this.assert(\n        obj.hasOwnProperty(name)\n      , 'expected #{this} to have own property ' + _.inspect(name)\n      , 'expected #{this} to not have own property ' + _.inspect(name)\n    );\n  }\n\n  Assertion.addMethod('ownProperty', assertOwnProperty);\n  Assertion.addMethod('haveOwnProperty', assertOwnProperty);\n\n  /**\n   * ### .length(value)\n   *\n   * Asserts that the target's `length` property has\n   * the expected value.\n   *\n   *     expect([ 1, 2, 3]).to.have.length(3);\n   *     expect('foobar').to.have.length(6);\n   *\n   * Can also be used as a chain precursor to a value\n   * comparison for the length property.\n   *\n   *     expect('foo').to.have.length.above(2);\n   *     expect([ 1, 2, 3 ]).to.have.length.above(2);\n   *     expect('foo').to.have.length.below(4);\n   *     expect([ 1, 2, 3 ]).to.have.length.below(4);\n   *     expect('foo').to.have.length.within(2,4);\n   *     expect([ 1, 2, 3 ]).to.have.length.within(2,4);\n   *\n   * @name length\n   * @alias lengthOf\n   * @param {Number} length\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  function assertLengthChain () {\n    flag(this, 'doLength', true);\n  }\n\n  function assertLength (n, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    new Assertion(obj, msg).to.have.property('length');\n    var len = obj.length;\n\n    this.assert(\n        len == n\n      , 'expected #{this} to have a length of #{exp} but got #{act}'\n      , 'expected #{this} to not have a length of #{act}'\n      , n\n      , len\n    );\n  }\n\n  Assertion.addChainableMethod('length', assertLength, assertLengthChain);\n  Assertion.addMethod('lengthOf', assertLength, assertLengthChain);\n\n  /**\n   * ### .match(regexp)\n   *\n   * Asserts that the target matches a regular expression.\n   *\n   *     expect('foobar').to.match(/^foo/);\n   *\n   * @name match\n   * @param {RegExp} RegularExpression\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('match', function (re, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    this.assert(\n        re.exec(obj)\n      , 'expected #{this} to match ' + re\n      , 'expected #{this} not to match ' + re\n    );\n  });\n\n  /**\n   * ### .string(string)\n   *\n   * Asserts that the string target contains another string.\n   *\n   *     expect('foobar').to.have.string('bar');\n   *\n   * @name string\n   * @param {String} string\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('string', function (str, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    new Assertion(obj, msg).is.a('string');\n\n    this.assert(\n        ~obj.indexOf(str)\n      , 'expected #{this} to contain ' + _.inspect(str)\n      , 'expected #{this} to not contain ' + _.inspect(str)\n    );\n  });\n\n\n  /**\n   * ### .keys(key1, [key2], [...])\n   *\n   * Asserts that the target has exactly the given keys, or\n   * asserts the inclusion of some keys when using the\n   * `include` or `contain` modifiers.\n   *\n   *     expect({ foo: 1, bar: 2 }).to.have.keys(['foo', 'bar']);\n   *     expect({ foo: 1, bar: 2, baz: 3 }).to.contain.keys('foo', 'bar');\n   *\n   * @name keys\n   * @alias key\n   * @param {String...|Array} keys\n   * @api public\n   */\n\n  function assertKeys (keys) {\n    var obj = flag(this, 'object')\n      , str\n      , ok = true;\n\n    keys = keys instanceof Array\n      ? keys\n      : Array.prototype.slice.call(arguments);\n\n    if (!keys.length) throw new Error('keys required');\n\n    var actual = Object.keys(obj)\n      , len = keys.length;\n\n    // Inclusion\n    ok = keys.every(function(key){\n      return ~actual.indexOf(key);\n    });\n\n    // Strict\n    if (!flag(this, 'negate') && !flag(this, 'contains')) {\n      ok = ok && keys.length == actual.length;\n    }\n\n    // Key string\n    if (len > 1) {\n      keys = keys.map(function(key){\n        return _.inspect(key);\n      });\n      var last = keys.pop();\n      str = keys.join(', ') + ', and ' + last;\n    } else {\n      str = _.inspect(keys[0]);\n    }\n\n    // Form\n    str = (len > 1 ? 'keys ' : 'key ') + str;\n\n    // Have / include\n    str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;\n\n    // Assertion\n    this.assert(\n        ok\n      , 'expected #{this} to ' + str\n      , 'expected #{this} to not ' + str\n    );\n  }\n\n  Assertion.addMethod('keys', assertKeys);\n  Assertion.addMethod('key', assertKeys);\n\n  /**\n   * ### .throw(constructor)\n   *\n   * Asserts that the function target will throw a specific error, or specific type of error\n   * (as determined using `instanceof`), optionally with a RegExp or string inclusion test\n   * for the error's message.\n   *\n   *     var err = new ReferenceError('This is a bad function.');\n   *     var fn = function () { throw err; }\n   *     expect(fn).to.throw(ReferenceError);\n   *     expect(fn).to.throw(Error);\n   *     expect(fn).to.throw(/bad function/);\n   *     expect(fn).to.not.throw('good function');\n   *     expect(fn).to.throw(ReferenceError, /bad function/);\n   *     expect(fn).to.throw(err);\n   *     expect(fn).to.not.throw(new RangeError('Out of range.'));\n   *\n   * Please note that when a throw expectation is negated, it will check each\n   * parameter independently, starting with error constructor type. The appropriate way\n   * to check for the existence of a type of error but for a message that does not match\n   * is to use `and`.\n   *\n   *     expect(fn).to.throw(ReferenceError)\n   *        .and.not.throw(/good function/);\n   *\n   * @name throw\n   * @alias throws\n   * @alias Throw\n   * @param {ErrorConstructor} constructor\n   * @param {String|RegExp} expected error message\n   * @param {String} message _optional_\n   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types\n   * @api public\n   */\n\n  function assertThrows (constructor, errMsg, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    new Assertion(obj, msg).is.a('function');\n\n    var thrown = false\n      , desiredError = null\n      , name = null\n      , thrownError = null;\n\n    if (arguments.length === 0) {\n      errMsg = null;\n      constructor = null;\n    } else if (constructor && (constructor instanceof RegExp || 'string' === typeof constructor)) {\n      errMsg = constructor;\n      constructor = null;\n    } else if (constructor && constructor instanceof Error) {\n      desiredError = constructor;\n      constructor = null;\n      errMsg = null;\n    } else if (typeof constructor === 'function') {\n      name = (new constructor()).name;\n    } else {\n      constructor = null;\n    }\n\n    try {\n      obj();\n    } catch (err) {\n      // first, check desired error\n      if (desiredError) {\n        this.assert(\n            err === desiredError\n          , 'expected #{this} to throw #{exp} but #{act} was thrown'\n          , 'expected #{this} to not throw #{exp}'\n          , desiredError\n          , err\n        );\n\n        return this;\n      }\n      // next, check constructor\n      if (constructor) {\n        this.assert(\n            err instanceof constructor\n          , 'expected #{this} to throw #{exp} but #{act} was thrown'\n          , 'expected #{this} to not throw #{exp} but #{act} was thrown'\n          , name\n          , err\n        );\n\n        if (!errMsg) return this;\n      }\n      // next, check message\n      var message = 'object' === _.type(err) && \"message\" in err\n        ? err.message\n        : '' + err;\n\n      if ((message != null) && errMsg && errMsg instanceof RegExp) {\n        this.assert(\n            errMsg.exec(message)\n          , 'expected #{this} to throw error matching #{exp} but got #{act}'\n          , 'expected #{this} to throw error not matching #{exp}'\n          , errMsg\n          , message\n        );\n\n        return this;\n      } else if ((message != null) && errMsg && 'string' === typeof errMsg) {\n        this.assert(\n            ~message.indexOf(errMsg)\n          , 'expected #{this} to throw error including #{exp} but got #{act}'\n          , 'expected #{this} to throw error not including #{act}'\n          , errMsg\n          , message\n        );\n\n        return this;\n      } else {\n        thrown = true;\n        thrownError = err;\n      }\n    }\n\n    var actuallyGot = ''\n      , expectedThrown = name !== null\n        ? name\n        : desiredError\n          ? '#{exp}' //_.inspect(desiredError)\n          : 'an error';\n\n    if (thrown) {\n      actuallyGot = ' but #{act} was thrown'\n    }\n\n    this.assert(\n        thrown === true\n      , 'expected #{this} to throw ' + expectedThrown + actuallyGot\n      , 'expected #{this} to not throw ' + expectedThrown + actuallyGot\n      , desiredError\n      , thrownError\n    );\n  };\n\n  Assertion.addMethod('throw', assertThrows);\n  Assertion.addMethod('throws', assertThrows);\n  Assertion.addMethod('Throw', assertThrows);\n\n  /**\n   * ### .respondTo(method)\n   *\n   * Asserts that the object or class target will respond to a method.\n   *\n   *     Klass.prototype.bar = function(){};\n   *     expect(Klass).to.respondTo('bar');\n   *     expect(obj).to.respondTo('bar');\n   *\n   * To check if a constructor will respond to a static function,\n   * set the `itself` flag.\n   *\n   *     Klass.baz = function(){};\n   *     expect(Klass).itself.to.respondTo('baz');\n   *\n   * @name respondTo\n   * @param {String} method\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('respondTo', function (method, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object')\n      , itself = flag(this, 'itself')\n      , context = ('function' === _.type(obj) && !itself)\n        ? obj.prototype[method]\n        : obj[method];\n\n    this.assert(\n        'function' === typeof context\n      , 'expected #{this} to respond to ' + _.inspect(method)\n      , 'expected #{this} to not respond to ' + _.inspect(method)\n    );\n  });\n\n  /**\n   * ### .itself\n   *\n   * Sets the `itself` flag, later used by the `respondTo` assertion.\n   *\n   *     function Foo() {}\n   *     Foo.bar = function() {}\n   *     Foo.prototype.baz = function() {}\n   *\n   *     expect(Foo).itself.to.respondTo('bar');\n   *     expect(Foo).itself.not.to.respondTo('baz');\n   *\n   * @name itself\n   * @api public\n   */\n\n  Assertion.addProperty('itself', function () {\n    flag(this, 'itself', true);\n  });\n\n  /**\n   * ### .satisfy(method)\n   *\n   * Asserts that the target passes a given truth test.\n   *\n   *     expect(1).to.satisfy(function(num) { return num > 0; });\n   *\n   * @name satisfy\n   * @param {Function} matcher\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('satisfy', function (matcher, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    this.assert(\n        matcher(obj)\n      , 'expected #{this} to satisfy ' + _.objDisplay(matcher)\n      , 'expected #{this} to not satisfy' + _.objDisplay(matcher)\n      , this.negate ? false : true\n      , matcher(obj)\n    );\n  });\n\n  /**\n   * ### .closeTo(expected, delta)\n   *\n   * Asserts that the target is equal `expected`, to within a +/- `delta` range.\n   *\n   *     expect(1.5).to.be.closeTo(1, 0.5);\n   *\n   * @name closeTo\n   * @param {Number} expected\n   * @param {Number} delta\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('closeTo', function (expected, delta, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n    this.assert(\n        Math.abs(obj - expected) <= delta\n      , 'expected #{this} to be close to ' + expected + ' +/- ' + delta\n      , 'expected #{this} not to be close to ' + expected + ' +/- ' + delta\n    );\n  });\n\n  function isSubsetOf(subset, superset) {\n    return subset.every(function(elem) {\n      return superset.indexOf(elem) !== -1;\n    })\n  }\n\n  /**\n   * ### .members(set)\n   *\n   * Asserts that the target is a superset of `set`,\n   * or that the target and `set` have the same members.\n   *\n   *     expect([1, 2, 3]).to.include.members([3, 2]);\n   *     expect([1, 2, 3]).to.not.include.members([3, 2, 8]);\n   *\n   *     expect([4, 2]).to.have.members([2, 4]);\n   *     expect([5, 2]).to.not.have.members([5, 2, 1]);\n   *\n   * @name members\n   * @param {Array} set\n   * @param {String} message _optional_\n   * @api public\n   */\n\n  Assertion.addMethod('members', function (subset, msg) {\n    if (msg) flag(this, 'message', msg);\n    var obj = flag(this, 'object');\n\n    new Assertion(obj).to.be.an('array');\n    new Assertion(subset).to.be.an('array');\n\n    if (flag(this, 'contains')) {\n      return this.assert(\n          isSubsetOf(subset, obj)\n        , 'expected #{this} to be a superset of #{act}'\n        , 'expected #{this} to not be a superset of #{act}'\n        , obj\n        , subset\n      );\n    }\n\n    this.assert(\n        isSubsetOf(obj, subset) && isSubsetOf(subset, obj)\n        , 'expected #{this} to have the same members as #{act}'\n        , 'expected #{this} to not have the same members as #{act}'\n        , obj\n        , subset\n    );\n  });\n};\n\n});\nrequire.register(\"chai/lib/chai/interface/assert.js\", function(exports, require, module){\n/*!\n * chai\n * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n\nmodule.exports = function (chai, util) {\n\n  /*!\n   * Chai dependencies.\n   */\n\n  var Assertion = chai.Assertion\n    , flag = util.flag;\n\n  /*!\n   * Module export.\n   */\n\n  /**\n   * ### assert(expression, message)\n   *\n   * Write your own test expressions.\n   *\n   *     assert('foo' !== 'bar', 'foo is not bar');\n   *     assert(Array.isArray([]), 'empty arrays are arrays');\n   *\n   * @param {Mixed} expression to test for truthiness\n   * @param {String} message to display on error\n   * @name assert\n   * @api public\n   */\n\n  var assert = chai.assert = function (express, errmsg) {\n    var test = new Assertion(null);\n    test.assert(\n        express\n      , errmsg\n      , '[ negation message unavailable ]'\n    );\n  };\n\n  /**\n   * ### .fail(actual, expected, [message], [operator])\n   *\n   * Throw a failure. Node.js `assert` module-compatible.\n   *\n   * @name fail\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @param {String} operator\n   * @api public\n   */\n\n  assert.fail = function (actual, expected, message, operator) {\n    throw new chai.AssertionError({\n        actual: actual\n      , expected: expected\n      , message: message\n      , operator: operator\n      , stackStartFunction: assert.fail\n    });\n  };\n\n  /**\n   * ### .ok(object, [message])\n   *\n   * Asserts that `object` is truthy.\n   *\n   *     assert.ok('everything', 'everything is ok');\n   *     assert.ok(false, 'this will fail');\n   *\n   * @name ok\n   * @param {Mixed} object to test\n   * @param {String} message\n   * @api public\n   */\n\n  assert.ok = function (val, msg) {\n    new Assertion(val, msg).is.ok;\n  };\n\n  /**\n   * ### .notOk(object, [message])\n   *\n   * Asserts that `object` is falsy.\n   *\n   *     assert.notOk('everything', 'this will fail');\n   *     assert.notOk(false, 'this will pass');\n   *\n   * @name notOk\n   * @param {Mixed} object to test\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notOk = function (val, msg) {\n    new Assertion(val, msg).is.not.ok;\n  };\n\n  /**\n   * ### .equal(actual, expected, [message])\n   *\n   * Asserts non-strict equality (`==`) of `actual` and `expected`.\n   *\n   *     assert.equal(3, '3', '== coerces values to strings');\n   *\n   * @name equal\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @api public\n   */\n\n  assert.equal = function (act, exp, msg) {\n    var test = new Assertion(act, msg);\n\n    test.assert(\n        exp == flag(test, 'object')\n      , 'expected #{this} to equal #{exp}'\n      , 'expected #{this} to not equal #{act}'\n      , exp\n      , act\n    );\n  };\n\n  /**\n   * ### .notEqual(actual, expected, [message])\n   *\n   * Asserts non-strict inequality (`!=`) of `actual` and `expected`.\n   *\n   *     assert.notEqual(3, 4, 'these numbers are not equal');\n   *\n   * @name notEqual\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notEqual = function (act, exp, msg) {\n    var test = new Assertion(act, msg);\n\n    test.assert(\n        exp != flag(test, 'object')\n      , 'expected #{this} to not equal #{exp}'\n      , 'expected #{this} to equal #{act}'\n      , exp\n      , act\n    );\n  };\n\n  /**\n   * ### .strictEqual(actual, expected, [message])\n   *\n   * Asserts strict equality (`===`) of `actual` and `expected`.\n   *\n   *     assert.strictEqual(true, true, 'these booleans are strictly equal');\n   *\n   * @name strictEqual\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @api public\n   */\n\n  assert.strictEqual = function (act, exp, msg) {\n    new Assertion(act, msg).to.equal(exp);\n  };\n\n  /**\n   * ### .notStrictEqual(actual, expected, [message])\n   *\n   * Asserts strict inequality (`!==`) of `actual` and `expected`.\n   *\n   *     assert.notStrictEqual(3, '3', 'no coercion for strict equality');\n   *\n   * @name notStrictEqual\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notStrictEqual = function (act, exp, msg) {\n    new Assertion(act, msg).to.not.equal(exp);\n  };\n\n  /**\n   * ### .deepEqual(actual, expected, [message])\n   *\n   * Asserts that `actual` is deeply equal to `expected`.\n   *\n   *     assert.deepEqual({ tea: 'green' }, { tea: 'green' });\n   *\n   * @name deepEqual\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @api public\n   */\n\n  assert.deepEqual = function (act, exp, msg) {\n    new Assertion(act, msg).to.eql(exp);\n  };\n\n  /**\n   * ### .notDeepEqual(actual, expected, [message])\n   *\n   * Assert that `actual` is not deeply equal to `expected`.\n   *\n   *     assert.notDeepEqual({ tea: 'green' }, { tea: 'jasmine' });\n   *\n   * @name notDeepEqual\n   * @param {Mixed} actual\n   * @param {Mixed} expected\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notDeepEqual = function (act, exp, msg) {\n    new Assertion(act, msg).to.not.eql(exp);\n  };\n\n  /**\n   * ### .isTrue(value, [message])\n   *\n   * Asserts that `value` is true.\n   *\n   *     var teaServed = true;\n   *     assert.isTrue(teaServed, 'the tea has been served');\n   *\n   * @name isTrue\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isTrue = function (val, msg) {\n    new Assertion(val, msg).is['true'];\n  };\n\n  /**\n   * ### .isFalse(value, [message])\n   *\n   * Asserts that `value` is false.\n   *\n   *     var teaServed = false;\n   *     assert.isFalse(teaServed, 'no tea yet? hmm...');\n   *\n   * @name isFalse\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isFalse = function (val, msg) {\n    new Assertion(val, msg).is['false'];\n  };\n\n  /**\n   * ### .isNull(value, [message])\n   *\n   * Asserts that `value` is null.\n   *\n   *     assert.isNull(err, 'there was no error');\n   *\n   * @name isNull\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNull = function (val, msg) {\n    new Assertion(val, msg).to.equal(null);\n  };\n\n  /**\n   * ### .isNotNull(value, [message])\n   *\n   * Asserts that `value` is not null.\n   *\n   *     var tea = 'tasty chai';\n   *     assert.isNotNull(tea, 'great, time for tea!');\n   *\n   * @name isNotNull\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotNull = function (val, msg) {\n    new Assertion(val, msg).to.not.equal(null);\n  };\n\n  /**\n   * ### .isUndefined(value, [message])\n   *\n   * Asserts that `value` is `undefined`.\n   *\n   *     var tea;\n   *     assert.isUndefined(tea, 'no tea defined');\n   *\n   * @name isUndefined\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isUndefined = function (val, msg) {\n    new Assertion(val, msg).to.equal(undefined);\n  };\n\n  /**\n   * ### .isDefined(value, [message])\n   *\n   * Asserts that `value` is not `undefined`.\n   *\n   *     var tea = 'cup of chai';\n   *     assert.isDefined(tea, 'tea has been defined');\n   *\n   * @name isDefined\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isDefined = function (val, msg) {\n    new Assertion(val, msg).to.not.equal(undefined);\n  };\n\n  /**\n   * ### .isFunction(value, [message])\n   *\n   * Asserts that `value` is a function.\n   *\n   *     function serveTea() { return 'cup of tea'; };\n   *     assert.isFunction(serveTea, 'great, we can have tea now');\n   *\n   * @name isFunction\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isFunction = function (val, msg) {\n    new Assertion(val, msg).to.be.a('function');\n  };\n\n  /**\n   * ### .isNotFunction(value, [message])\n   *\n   * Asserts that `value` is _not_ a function.\n   *\n   *     var serveTea = [ 'heat', 'pour', 'sip' ];\n   *     assert.isNotFunction(serveTea, 'great, we have listed the steps');\n   *\n   * @name isNotFunction\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotFunction = function (val, msg) {\n    new Assertion(val, msg).to.not.be.a('function');\n  };\n\n  /**\n   * ### .isObject(value, [message])\n   *\n   * Asserts that `value` is an object (as revealed by\n   * `Object.prototype.toString`).\n   *\n   *     var selection = { name: 'Chai', serve: 'with spices' };\n   *     assert.isObject(selection, 'tea selection is an object');\n   *\n   * @name isObject\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isObject = function (val, msg) {\n    new Assertion(val, msg).to.be.a('object');\n  };\n\n  /**\n   * ### .isNotObject(value, [message])\n   *\n   * Asserts that `value` is _not_ an object.\n   *\n   *     var selection = 'chai'\n   *     assert.isObject(selection, 'tea selection is not an object');\n   *     assert.isObject(null, 'null is not an object');\n   *\n   * @name isNotObject\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotObject = function (val, msg) {\n    new Assertion(val, msg).to.not.be.a('object');\n  };\n\n  /**\n   * ### .isArray(value, [message])\n   *\n   * Asserts that `value` is an array.\n   *\n   *     var menu = [ 'green', 'chai', 'oolong' ];\n   *     assert.isArray(menu, 'what kind of tea do we want?');\n   *\n   * @name isArray\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isArray = function (val, msg) {\n    new Assertion(val, msg).to.be.an('array');\n  };\n\n  /**\n   * ### .isNotArray(value, [message])\n   *\n   * Asserts that `value` is _not_ an array.\n   *\n   *     var menu = 'green|chai|oolong';\n   *     assert.isNotArray(menu, 'what kind of tea do we want?');\n   *\n   * @name isNotArray\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotArray = function (val, msg) {\n    new Assertion(val, msg).to.not.be.an('array');\n  };\n\n  /**\n   * ### .isString(value, [message])\n   *\n   * Asserts that `value` is a string.\n   *\n   *     var teaOrder = 'chai';\n   *     assert.isString(teaOrder, 'order placed');\n   *\n   * @name isString\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isString = function (val, msg) {\n    new Assertion(val, msg).to.be.a('string');\n  };\n\n  /**\n   * ### .isNotString(value, [message])\n   *\n   * Asserts that `value` is _not_ a string.\n   *\n   *     var teaOrder = 4;\n   *     assert.isNotString(teaOrder, 'order placed');\n   *\n   * @name isNotString\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotString = function (val, msg) {\n    new Assertion(val, msg).to.not.be.a('string');\n  };\n\n  /**\n   * ### .isNumber(value, [message])\n   *\n   * Asserts that `value` is a number.\n   *\n   *     var cups = 2;\n   *     assert.isNumber(cups, 'how many cups');\n   *\n   * @name isNumber\n   * @param {Number} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNumber = function (val, msg) {\n    new Assertion(val, msg).to.be.a('number');\n  };\n\n  /**\n   * ### .isNotNumber(value, [message])\n   *\n   * Asserts that `value` is _not_ a number.\n   *\n   *     var cups = '2 cups please';\n   *     assert.isNotNumber(cups, 'how many cups');\n   *\n   * @name isNotNumber\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotNumber = function (val, msg) {\n    new Assertion(val, msg).to.not.be.a('number');\n  };\n\n  /**\n   * ### .isBoolean(value, [message])\n   *\n   * Asserts that `value` is a boolean.\n   *\n   *     var teaReady = true\n   *       , teaServed = false;\n   *\n   *     assert.isBoolean(teaReady, 'is the tea ready');\n   *     assert.isBoolean(teaServed, 'has tea been served');\n   *\n   * @name isBoolean\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isBoolean = function (val, msg) {\n    new Assertion(val, msg).to.be.a('boolean');\n  };\n\n  /**\n   * ### .isNotBoolean(value, [message])\n   *\n   * Asserts that `value` is _not_ a boolean.\n   *\n   *     var teaReady = 'yep'\n   *       , teaServed = 'nope';\n   *\n   *     assert.isNotBoolean(teaReady, 'is the tea ready');\n   *     assert.isNotBoolean(teaServed, 'has tea been served');\n   *\n   * @name isNotBoolean\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.isNotBoolean = function (val, msg) {\n    new Assertion(val, msg).to.not.be.a('boolean');\n  };\n\n  /**\n   * ### .typeOf(value, name, [message])\n   *\n   * Asserts that `value`'s type is `name`, as determined by\n   * `Object.prototype.toString`.\n   *\n   *     assert.typeOf({ tea: 'chai' }, 'object', 'we have an object');\n   *     assert.typeOf(['chai', 'jasmine'], 'array', 'we have an array');\n   *     assert.typeOf('tea', 'string', 'we have a string');\n   *     assert.typeOf(/tea/, 'regexp', 'we have a regular expression');\n   *     assert.typeOf(null, 'null', 'we have a null');\n   *     assert.typeOf(undefined, 'undefined', 'we have an undefined');\n   *\n   * @name typeOf\n   * @param {Mixed} value\n   * @param {String} name\n   * @param {String} message\n   * @api public\n   */\n\n  assert.typeOf = function (val, type, msg) {\n    new Assertion(val, msg).to.be.a(type);\n  };\n\n  /**\n   * ### .notTypeOf(value, name, [message])\n   *\n   * Asserts that `value`'s type is _not_ `name`, as determined by\n   * `Object.prototype.toString`.\n   *\n   *     assert.notTypeOf('tea', 'number', 'strings are not numbers');\n   *\n   * @name notTypeOf\n   * @param {Mixed} value\n   * @param {String} typeof name\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notTypeOf = function (val, type, msg) {\n    new Assertion(val, msg).to.not.be.a(type);\n  };\n\n  /**\n   * ### .instanceOf(object, constructor, [message])\n   *\n   * Asserts that `value` is an instance of `constructor`.\n   *\n   *     var Tea = function (name) { this.name = name; }\n   *       , chai = new Tea('chai');\n   *\n   *     assert.instanceOf(chai, Tea, 'chai is an instance of tea');\n   *\n   * @name instanceOf\n   * @param {Object} object\n   * @param {Constructor} constructor\n   * @param {String} message\n   * @api public\n   */\n\n  assert.instanceOf = function (val, type, msg) {\n    new Assertion(val, msg).to.be.instanceOf(type);\n  };\n\n  /**\n   * ### .notInstanceOf(object, constructor, [message])\n   *\n   * Asserts `value` is not an instance of `constructor`.\n   *\n   *     var Tea = function (name) { this.name = name; }\n   *       , chai = new String('chai');\n   *\n   *     assert.notInstanceOf(chai, Tea, 'chai is not an instance of tea');\n   *\n   * @name notInstanceOf\n   * @param {Object} object\n   * @param {Constructor} constructor\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notInstanceOf = function (val, type, msg) {\n    new Assertion(val, msg).to.not.be.instanceOf(type);\n  };\n\n  /**\n   * ### .include(haystack, needle, [message])\n   *\n   * Asserts that `haystack` includes `needle`. Works\n   * for strings and arrays.\n   *\n   *     assert.include('foobar', 'bar', 'foobar contains string \"bar\"');\n   *     assert.include([ 1, 2, 3 ], 3, 'array contains value');\n   *\n   * @name include\n   * @param {Array|String} haystack\n   * @param {Mixed} needle\n   * @param {String} message\n   * @api public\n   */\n\n  assert.include = function (exp, inc, msg) {\n    var obj = new Assertion(exp, msg);\n\n    if (Array.isArray(exp)) {\n      obj.to.include(inc);\n    } else if ('string' === typeof exp) {\n      obj.to.contain.string(inc);\n    } else {\n      throw new chai.AssertionError(\n          'expected an array or string'\n        , null\n        , assert.include\n      );\n    }\n  };\n\n  /**\n   * ### .notInclude(haystack, needle, [message])\n   *\n   * Asserts that `haystack` does not include `needle`. Works\n   * for strings and arrays.\n   *i\n   *     assert.notInclude('foobar', 'baz', 'string not include substring');\n   *     assert.notInclude([ 1, 2, 3 ], 4, 'array not include contain value');\n   *\n   * @name notInclude\n   * @param {Array|String} haystack\n   * @param {Mixed} needle\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notInclude = function (exp, inc, msg) {\n    var obj = new Assertion(exp, msg);\n\n    if (Array.isArray(exp)) {\n      obj.to.not.include(inc);\n    } else if ('string' === typeof exp) {\n      obj.to.not.contain.string(inc);\n    } else {\n      throw new chai.AssertionError(\n          'expected an array or string'\n        , null\n        , assert.notInclude\n      );\n    }\n  };\n\n  /**\n   * ### .match(value, regexp, [message])\n   *\n   * Asserts that `value` matches the regular expression `regexp`.\n   *\n   *     assert.match('foobar', /^foo/, 'regexp matches');\n   *\n   * @name match\n   * @param {Mixed} value\n   * @param {RegExp} regexp\n   * @param {String} message\n   * @api public\n   */\n\n  assert.match = function (exp, re, msg) {\n    new Assertion(exp, msg).to.match(re);\n  };\n\n  /**\n   * ### .notMatch(value, regexp, [message])\n   *\n   * Asserts that `value` does not match the regular expression `regexp`.\n   *\n   *     assert.notMatch('foobar', /^foo/, 'regexp does not match');\n   *\n   * @name notMatch\n   * @param {Mixed} value\n   * @param {RegExp} regexp\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notMatch = function (exp, re, msg) {\n    new Assertion(exp, msg).to.not.match(re);\n  };\n\n  /**\n   * ### .property(object, property, [message])\n   *\n   * Asserts that `object` has a property named by `property`.\n   *\n   *     assert.property({ tea: { green: 'matcha' }}, 'tea');\n   *\n   * @name property\n   * @param {Object} object\n   * @param {String} property\n   * @param {String} message\n   * @api public\n   */\n\n  assert.property = function (obj, prop, msg) {\n    new Assertion(obj, msg).to.have.property(prop);\n  };\n\n  /**\n   * ### .notProperty(object, property, [message])\n   *\n   * Asserts that `object` does _not_ have a property named by `property`.\n   *\n   *     assert.notProperty({ tea: { green: 'matcha' }}, 'coffee');\n   *\n   * @name notProperty\n   * @param {Object} object\n   * @param {String} property\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notProperty = function (obj, prop, msg) {\n    new Assertion(obj, msg).to.not.have.property(prop);\n  };\n\n  /**\n   * ### .deepProperty(object, property, [message])\n   *\n   * Asserts that `object` has a property named by `property`, which can be a\n   * string using dot- and bracket-notation for deep reference.\n   *\n   *     assert.deepProperty({ tea: { green: 'matcha' }}, 'tea.green');\n   *\n   * @name deepProperty\n   * @param {Object} object\n   * @param {String} property\n   * @param {String} message\n   * @api public\n   */\n\n  assert.deepProperty = function (obj, prop, msg) {\n    new Assertion(obj, msg).to.have.deep.property(prop);\n  };\n\n  /**\n   * ### .notDeepProperty(object, property, [message])\n   *\n   * Asserts that `object` does _not_ have a property named by `property`, which\n   * can be a string using dot- and bracket-notation for deep reference.\n   *\n   *     assert.notDeepProperty({ tea: { green: 'matcha' }}, 'tea.oolong');\n   *\n   * @name notDeepProperty\n   * @param {Object} object\n   * @param {String} property\n   * @param {String} message\n   * @api public\n   */\n\n  assert.notDeepProperty = function (obj, prop, msg) {\n    new Assertion(obj, msg).to.not.have.deep.property(prop);\n  };\n\n  /**\n   * ### .propertyVal(object, property, value, [message])\n   *\n   * Asserts that `object` has a property named by `property` with value given\n   * by `value`.\n   *\n   *     assert.propertyVal({ tea: 'is good' }, 'tea', 'is good');\n   *\n   * @name propertyVal\n   * @param {Object} object\n   * @param {String} property\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.propertyVal = function (obj, prop, val, msg) {\n    new Assertion(obj, msg).to.have.property(prop, val);\n  };\n\n  /**\n   * ### .propertyNotVal(object, property, value, [message])\n   *\n   * Asserts that `object` has a property named by `property`, but with a value\n   * different from that given by `value`.\n   *\n   *     assert.propertyNotVal({ tea: 'is good' }, 'tea', 'is bad');\n   *\n   * @name propertyNotVal\n   * @param {Object} object\n   * @param {String} property\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.propertyNotVal = function (obj, prop, val, msg) {\n    new Assertion(obj, msg).to.not.have.property(prop, val);\n  };\n\n  /**\n   * ### .deepPropertyVal(object, property, value, [message])\n   *\n   * Asserts that `object` has a property named by `property` with value given\n   * by `value`. `property` can use dot- and bracket-notation for deep\n   * reference.\n   *\n   *     assert.deepPropertyVal({ tea: { green: 'matcha' }}, 'tea.green', 'matcha');\n   *\n   * @name deepPropertyVal\n   * @param {Object} object\n   * @param {String} property\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.deepPropertyVal = function (obj, prop, val, msg) {\n    new Assertion(obj, msg).to.have.deep.property(prop, val);\n  };\n\n  /**\n   * ### .deepPropertyNotVal(object, property, value, [message])\n   *\n   * Asserts that `object` has a property named by `property`, but with a value\n   * different from that given by `value`. `property` can use dot- and\n   * bracket-notation for deep reference.\n   *\n   *     assert.deepPropertyNotVal({ tea: { green: 'matcha' }}, 'tea.green', 'konacha');\n   *\n   * @name deepPropertyNotVal\n   * @param {Object} object\n   * @param {String} property\n   * @param {Mixed} value\n   * @param {String} message\n   * @api public\n   */\n\n  assert.deepPropertyNotVal = function (obj, prop, val, msg) {\n    new Assertion(obj, msg).to.not.have.deep.property(prop, val);\n  };\n\n  /**\n   * ### .lengthOf(object, length, [message])\n   *\n   * Asserts that `object` has a `length` property with the expected value.\n   *\n   *     assert.lengthOf([1,2,3], 3, 'array has length of 3');\n   *     assert.lengthOf('foobar', 5, 'string has length of 6');\n   *\n   * @name lengthOf\n   * @param {Mixed} object\n   * @param {Number} length\n   * @param {String} message\n   * @api public\n   */\n\n  assert.lengthOf = function (exp, len, msg) {\n    new Assertion(exp, msg).to.have.length(len);\n  };\n\n  /**\n   * ### .throws(function, [constructor/string/regexp], [string/regexp], [message])\n   *\n   * Asserts that `function` will throw an error that is an instance of\n   * `constructor`, or alternately that it will throw an error with message\n   * matching `regexp`.\n   *\n   *     assert.throw(fn, 'function throws a reference error');\n   *     assert.throw(fn, /function throws a reference error/);\n   *     assert.throw(fn, ReferenceError);\n   *     assert.throw(fn, ReferenceError, 'function throws a reference error');\n   *     assert.throw(fn, ReferenceError, /function throws a reference error/);\n   *\n   * @name throws\n   * @alias throw\n   * @alias Throw\n   * @param {Function} function\n   * @param {ErrorConstructor} constructor\n   * @param {RegExp} regexp\n   * @param {String} message\n   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types\n   * @api public\n   */\n\n  assert.Throw = function (fn, errt, errs, msg) {\n    if ('string' === typeof errt || errt instanceof RegExp) {\n      errs = errt;\n      errt = null;\n    }\n\n    new Assertion(fn, msg).to.Throw(errt, errs);\n  };\n\n  /**\n   * ### .doesNotThrow(function, [constructor/regexp], [message])\n   *\n   * Asserts that `function` will _not_ throw an error that is an instance of\n   * `constructor`, or alternately that it will not throw an error with message\n   * matching `regexp`.\n   *\n   *     assert.doesNotThrow(fn, Error, 'function does not throw');\n   *\n   * @name doesNotThrow\n   * @param {Function} function\n   * @param {ErrorConstructor} constructor\n   * @param {RegExp} regexp\n   * @param {String} message\n   * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types\n   * @api public\n   */\n\n  assert.doesNotThrow = function (fn, type, msg) {\n    if ('string' === typeof type) {\n      msg = type;\n      type = null;\n    }\n\n    new Assertion(fn, msg).to.not.Throw(type);\n  };\n\n  /**\n   * ### .operator(val1, operator, val2, [message])\n   *\n   * Compares two values using `operator`.\n   *\n   *     assert.operator(1, '<', 2, 'everything is ok');\n   *     assert.operator(1, '>', 2, 'this will fail');\n   *\n   * @name operator\n   * @param {Mixed} val1\n   * @param {String} operator\n   * @param {Mixed} val2\n   * @param {String} message\n   * @api public\n   */\n\n  assert.operator = function (val, operator, val2, msg) {\n    if (!~['==', '===', '>', '>=', '<', '<=', '!=', '!=='].indexOf(operator)) {\n      throw new Error('Invalid operator \"' + operator + '\"');\n    }\n    var test = new Assertion(eval(val + operator + val2), msg);\n    test.assert(\n        true === flag(test, 'object')\n      , 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2)\n      , 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2) );\n  };\n\n  /**\n   * ### .closeTo(actual, expected, delta, [message])\n   *\n   * Asserts that the target is equal `expected`, to within a +/- `delta` range.\n   *\n   *     assert.closeTo(1.5, 1, 0.5, 'numbers are close');\n   *\n   * @name closeTo\n   * @param {Number} actual\n   * @param {Number} expected\n   * @param {Number} delta\n   * @param {String} message\n   * @api public\n   */\n\n  assert.closeTo = function (act, exp, delta, msg) {\n    new Assertion(act, msg).to.be.closeTo(exp, delta);\n  };\n\n  /**\n   * ### .sameMembers(set1, set2, [message])\n   *\n   * Asserts that `set1` and `set2` have the same members.\n   * Order is not taken into account.\n   *\n   *     assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');\n   *\n   * @name sameMembers\n   * @param {Array} superset\n   * @param {Array} subset\n   * @param {String} message\n   * @api public\n   */\n\n  assert.sameMembers = function (set1, set2, msg) {\n    new Assertion(set1, msg).to.have.same.members(set2);\n  }\n\n  /**\n   * ### .includeMembers(superset, subset, [message])\n   *\n   * Asserts that `subset` is included in `superset`.\n   * Order is not taken into account.\n   *\n   *     assert.includeMembers([ 1, 2, 3 ], [ 2, 1 ], 'include members');\n   *\n   * @name includeMembers\n   * @param {Array} superset\n   * @param {Array} subset\n   * @param {String} message\n   * @api public\n   */\n\n  assert.includeMembers = function (superset, subset, msg) {\n    new Assertion(superset, msg).to.include.members(subset);\n  }\n\n  /*!\n   * Undocumented / untested\n   */\n\n  assert.ifError = function (val, msg) {\n    new Assertion(val, msg).to.not.be.ok;\n  };\n\n  /*!\n   * Aliases.\n   */\n\n  (function alias(name, as){\n    assert[as] = assert[name];\n    return alias;\n  })\n  ('Throw', 'throw')\n  ('Throw', 'throws');\n};\n\n});\nrequire.register(\"chai/lib/chai/interface/expect.js\", function(exports, require, module){\n/*!\n * chai\n * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\nmodule.exports = function (chai, util) {\n  chai.expect = function (val, message) {\n    return new chai.Assertion(val, message);\n  };\n};\n\n\n});\nrequire.register(\"chai/lib/chai/interface/should.js\", function(exports, require, module){\n/*!\n * chai\n * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\nmodule.exports = function (chai, util) {\n  var Assertion = chai.Assertion;\n\n  function loadShould () {\n    // modify Object.prototype to have `should`\n    Object.defineProperty(Object.prototype, 'should',\n      {\n        set: function (value) {\n          // See https://github.com/chaijs/chai/issues/86: this makes\n          // `whatever.should = someValue` actually set `someValue`, which is\n          // especially useful for `global.should = require('chai').should()`.\n          //\n          // Note that we have to use [[DefineProperty]] instead of [[Put]]\n          // since otherwise we would trigger this very setter!\n          Object.defineProperty(this, 'should', {\n            value: value,\n            enumerable: true,\n            configurable: true,\n            writable: true\n          });\n        }\n      , get: function(){\n          if (this instanceof String || this instanceof Number) {\n            return new Assertion(this.constructor(this));\n          } else if (this instanceof Boolean) {\n            return new Assertion(this == true);\n          }\n          return new Assertion(this);\n        }\n      , configurable: true\n    });\n\n    var should = {};\n\n    should.equal = function (val1, val2, msg) {\n      new Assertion(val1, msg).to.equal(val2);\n    };\n\n    should.Throw = function (fn, errt, errs, msg) {\n      new Assertion(fn, msg).to.Throw(errt, errs);\n    };\n\n    should.exist = function (val, msg) {\n      new Assertion(val, msg).to.exist;\n    }\n\n    // negation\n    should.not = {}\n\n    should.not.equal = function (val1, val2, msg) {\n      new Assertion(val1, msg).to.not.equal(val2);\n    };\n\n    should.not.Throw = function (fn, errt, errs, msg) {\n      new Assertion(fn, msg).to.not.Throw(errt, errs);\n    };\n\n    should.not.exist = function (val, msg) {\n      new Assertion(val, msg).to.not.exist;\n    }\n\n    should['throw'] = should['Throw'];\n    should.not['throw'] = should.not['Throw'];\n\n    return should;\n  };\n\n  chai.should = loadShould;\n  chai.Should = loadShould;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/addChainableMethod.js\", function(exports, require, module){\n/*!\n * Chai - addChainingMethod utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Module dependencies\n */\n\nvar transferFlags = require('./transferFlags');\n\n/*!\n * Module variables\n */\n\n// Check whether `__proto__` is supported\nvar hasProtoSupport = '__proto__' in Object;\n\n// Without `__proto__` support, this module will need to add properties to a function.\n// However, some Function.prototype methods cannot be overwritten,\n// and there seems no easy cross-platform way to detect them (@see chaijs/chai/issues/69).\nvar excludeNames = /^(?:length|name|arguments|caller)$/;\n\n// Cache `Function` properties\nvar call  = Function.prototype.call,\n    apply = Function.prototype.apply;\n\n/**\n * ### addChainableMethod (ctx, name, method, chainingBehavior)\n *\n * Adds a method to an object, such that the method can also be chained.\n *\n *     utils.addChainableMethod(chai.Assertion.prototype, 'foo', function (str) {\n *       var obj = utils.flag(this, 'object');\n *       new chai.Assertion(obj).to.be.equal(str);\n *     });\n *\n * Can also be accessed directly from `chai.Assertion`.\n *\n *     chai.Assertion.addChainableMethod('foo', fn, chainingBehavior);\n *\n * The result can then be used as both a method assertion, executing both `method` and\n * `chainingBehavior`, or as a language chain, which only executes `chainingBehavior`.\n *\n *     expect(fooStr).to.be.foo('bar');\n *     expect(fooStr).to.be.foo.equal('foo');\n *\n * @param {Object} ctx object to which the method is added\n * @param {String} name of method to add\n * @param {Function} method function to be used for `name`, when called\n * @param {Function} chainingBehavior function to be called every time the property is accessed\n * @name addChainableMethod\n * @api public\n */\n\nmodule.exports = function (ctx, name, method, chainingBehavior) {\n  if (typeof chainingBehavior !== 'function')\n    chainingBehavior = function () { };\n\n  Object.defineProperty(ctx, name,\n    { get: function () {\n        chainingBehavior.call(this);\n\n        var assert = function () {\n          var result = method.apply(this, arguments);\n          return result === undefined ? this : result;\n        };\n\n        // Use `__proto__` if available\n        if (hasProtoSupport) {\n          // Inherit all properties from the object by replacing the `Function` prototype\n          var prototype = assert.__proto__ = Object.create(this);\n          // Restore the `call` and `apply` methods from `Function`\n          prototype.call = call;\n          prototype.apply = apply;\n        }\n        // Otherwise, redefine all properties (slow!)\n        else {\n          var asserterNames = Object.getOwnPropertyNames(ctx);\n          asserterNames.forEach(function (asserterName) {\n            if (!excludeNames.test(asserterName)) {\n              var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);\n              Object.defineProperty(assert, asserterName, pd);\n            }\n          });\n        }\n\n        transferFlags(this, assert);\n        return assert;\n      }\n    , configurable: true\n  });\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/addMethod.js\", function(exports, require, module){\n/*!\n * Chai - addMethod utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### .addMethod (ctx, name, method)\n *\n * Adds a method to the prototype of an object.\n *\n *     utils.addMethod(chai.Assertion.prototype, 'foo', function (str) {\n *       var obj = utils.flag(this, 'object');\n *       new chai.Assertion(obj).to.be.equal(str);\n *     });\n *\n * Can also be accessed directly from `chai.Assertion`.\n *\n *     chai.Assertion.addMethod('foo', fn);\n *\n * Then can be used as any other assertion.\n *\n *     expect(fooStr).to.be.foo('bar');\n *\n * @param {Object} ctx object to which the method is added\n * @param {String} name of method to add\n * @param {Function} method function to be used for name\n * @name addMethod\n * @api public\n */\n\nmodule.exports = function (ctx, name, method) {\n  ctx[name] = function () {\n    var result = method.apply(this, arguments);\n    return result === undefined ? this : result;\n  };\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/addProperty.js\", function(exports, require, module){\n/*!\n * Chai - addProperty utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### addProperty (ctx, name, getter)\n *\n * Adds a property to the prototype of an object.\n *\n *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {\n *       var obj = utils.flag(this, 'object');\n *       new chai.Assertion(obj).to.be.instanceof(Foo);\n *     });\n *\n * Can also be accessed directly from `chai.Assertion`.\n *\n *     chai.Assertion.addProperty('foo', fn);\n *\n * Then can be used as any other assertion.\n *\n *     expect(myFoo).to.be.foo;\n *\n * @param {Object} ctx object to which the property is added\n * @param {String} name of property to add\n * @param {Function} getter function to be used for name\n * @name addProperty\n * @api public\n */\n\nmodule.exports = function (ctx, name, getter) {\n  Object.defineProperty(ctx, name,\n    { get: function () {\n        var result = getter.call(this);\n        return result === undefined ? this : result;\n      }\n    , configurable: true\n  });\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/flag.js\", function(exports, require, module){\n/*!\n * Chai - flag utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### flag(object ,key, [value])\n *\n * Get or set a flag value on an object. If a\n * value is provided it will be set, else it will\n * return the currently set value or `undefined` if\n * the value is not set.\n *\n *     utils.flag(this, 'foo', 'bar'); // setter\n *     utils.flag(this, 'foo'); // getter, returns `bar`\n *\n * @param {Object} object (constructed Assertion\n * @param {String} key\n * @param {Mixed} value (optional)\n * @name flag\n * @api private\n */\n\nmodule.exports = function (obj, key, value) {\n  var flags = obj.__flags || (obj.__flags = Object.create(null));\n  if (arguments.length === 3) {\n    flags[key] = value;\n  } else {\n    return flags[key];\n  }\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/getActual.js\", function(exports, require, module){\n/*!\n * Chai - getActual utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * # getActual(object, [actual])\n *\n * Returns the `actual` value for an Assertion\n *\n * @param {Object} object (constructed Assertion)\n * @param {Arguments} chai.Assertion.prototype.assert arguments\n */\n\nmodule.exports = function (obj, args) {\n  var actual = args[4];\n  return 'undefined' !== typeof actual ? actual : obj._obj;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/getEnumerableProperties.js\", function(exports, require, module){\n/*!\n * Chai - getEnumerableProperties utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### .getEnumerableProperties(object)\n *\n * This allows the retrieval of enumerable property names of an object,\n * inherited or not.\n *\n * @param {Object} object\n * @returns {Array}\n * @name getEnumerableProperties\n * @api public\n */\n\nmodule.exports = function getEnumerableProperties(object) {\n  var result = [];\n  for (var name in object) {\n    result.push(name);\n  }\n  return result;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/getMessage.js\", function(exports, require, module){\n/*!\n * Chai - message composition utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Module dependancies\n */\n\nvar flag = require('./flag')\n  , getActual = require('./getActual')\n  , inspect = require('./inspect')\n  , objDisplay = require('./objDisplay');\n\n/**\n * ### .getMessage(object, message, negateMessage)\n *\n * Construct the error message based on flags\n * and template tags. Template tags will return\n * a stringified inspection of the object referenced.\n *\n * Message template tags:\n * - `#{this}` current asserted object\n * - `#{act}` actual value\n * - `#{exp}` expected value\n *\n * @param {Object} object (constructed Assertion)\n * @param {Arguments} chai.Assertion.prototype.assert arguments\n * @name getMessage\n * @api public\n */\n\nmodule.exports = function (obj, args) {\n  var negate = flag(obj, 'negate')\n    , val = flag(obj, 'object')\n    , expected = args[3]\n    , actual = getActual(obj, args)\n    , msg = negate ? args[2] : args[1]\n    , flagMsg = flag(obj, 'message');\n\n  msg = msg || '';\n  msg = msg\n    .replace(/#{this}/g, objDisplay(val))\n    .replace(/#{act}/g, objDisplay(actual))\n    .replace(/#{exp}/g, objDisplay(expected));\n\n  return flagMsg ? flagMsg + ': ' + msg : msg;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/getName.js\", function(exports, require, module){\n/*!\n * Chai - getName utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * # getName(func)\n *\n * Gets the name of a function, in a cross-browser way.\n *\n * @param {Function} a function (usually a constructor)\n */\n\nmodule.exports = function (func) {\n  if (func.name) return func.name;\n\n  var match = /^\\s?function ([^(]*)\\(/.exec(func);\n  return match && match[1] ? match[1] : \"\";\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/getPathValue.js\", function(exports, require, module){\n/*!\n * Chai - getPathValue utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * @see https://github.com/logicalparadox/filtr\n * MIT Licensed\n */\n\n/**\n * ### .getPathValue(path, object)\n *\n * This allows the retrieval of values in an\n * object given a string path.\n *\n *     var obj = {\n *         prop1: {\n *             arr: ['a', 'b', 'c']\n *           , str: 'Hello'\n *         }\n *       , prop2: {\n *             arr: [ { nested: 'Universe' } ]\n *           , str: 'Hello again!'\n *         }\n *     }\n *\n * The following would be the results.\n *\n *     getPathValue('prop1.str', obj); // Hello\n *     getPathValue('prop1.att[2]', obj); // b\n *     getPathValue('prop2.arr[0].nested', obj); // Universe\n *\n * @param {String} path\n * @param {Object} object\n * @returns {Object} value or `undefined`\n * @name getPathValue\n * @api public\n */\n\nvar getPathValue = module.exports = function (path, obj) {\n  var parsed = parsePath(path);\n  return _getPathValue(parsed, obj);\n};\n\n/*!\n * ## parsePath(path)\n *\n * Helper function used to parse string object\n * paths. Use in conjunction with `_getPathValue`.\n *\n *      var parsed = parsePath('myobject.property.subprop');\n *\n * ### Paths:\n *\n * * Can be as near infinitely deep and nested\n * * Arrays are also valid using the formal `myobject.document[3].property`.\n *\n * @param {String} path\n * @returns {Object} parsed\n * @api private\n */\n\nfunction parsePath (path) {\n  var str = path.replace(/\\[/g, '.[')\n    , parts = str.match(/(\\\\\\.|[^.]+?)+/g);\n  return parts.map(function (value) {\n    var re = /\\[(\\d+)\\]$/\n      , mArr = re.exec(value)\n    if (mArr) return { i: parseFloat(mArr[1]) };\n    else return { p: value };\n  });\n};\n\n/*!\n * ## _getPathValue(parsed, obj)\n *\n * Helper companion function for `.parsePath` that returns\n * the value located at the parsed address.\n *\n *      var value = getPathValue(parsed, obj);\n *\n * @param {Object} parsed definition from `parsePath`.\n * @param {Object} object to search against\n * @returns {Object|Undefined} value\n * @api private\n */\n\nfunction _getPathValue (parsed, obj) {\n  var tmp = obj\n    , res;\n  for (var i = 0, l = parsed.length; i < l; i++) {\n    var part = parsed[i];\n    if (tmp) {\n      if ('undefined' !== typeof part.p)\n        tmp = tmp[part.p];\n      else if ('undefined' !== typeof part.i)\n        tmp = tmp[part.i];\n      if (i == (l - 1)) res = tmp;\n    } else {\n      res = undefined;\n    }\n  }\n  return res;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/getProperties.js\", function(exports, require, module){\n/*!\n * Chai - getProperties utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### .getProperties(object)\n *\n * This allows the retrieval of property names of an object, enumerable or not,\n * inherited or not.\n *\n * @param {Object} object\n * @returns {Array}\n * @name getProperties\n * @api public\n */\n\nmodule.exports = function getProperties(object) {\n  var result = Object.getOwnPropertyNames(subject);\n\n  function addProperty(property) {\n    if (result.indexOf(property) === -1) {\n      result.push(property);\n    }\n  }\n\n  var proto = Object.getPrototypeOf(subject);\n  while (proto !== null) {\n    Object.getOwnPropertyNames(proto).forEach(addProperty);\n    proto = Object.getPrototypeOf(proto);\n  }\n\n  return result;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/index.js\", function(exports, require, module){\n/*!\n * chai\n * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Main exports\n */\n\nvar exports = module.exports = {};\n\n/*!\n * test utility\n */\n\nexports.test = require('./test');\n\n/*!\n * type utility\n */\n\nexports.type = require('./type');\n\n/*!\n * message utility\n */\n\nexports.getMessage = require('./getMessage');\n\n/*!\n * actual utility\n */\n\nexports.getActual = require('./getActual');\n\n/*!\n * Inspect util\n */\n\nexports.inspect = require('./inspect');\n\n/*!\n * Object Display util\n */\n\nexports.objDisplay = require('./objDisplay');\n\n/*!\n * Flag utility\n */\n\nexports.flag = require('./flag');\n\n/*!\n * Flag transferring utility\n */\n\nexports.transferFlags = require('./transferFlags');\n\n/*!\n * Deep equal utility\n */\n\nexports.eql = require('deep-eql');\n\n/*!\n * Deep path value\n */\n\nexports.getPathValue = require('./getPathValue');\n\n/*!\n * Function name\n */\n\nexports.getName = require('./getName');\n\n/*!\n * add Property\n */\n\nexports.addProperty = require('./addProperty');\n\n/*!\n * add Method\n */\n\nexports.addMethod = require('./addMethod');\n\n/*!\n * overwrite Property\n */\n\nexports.overwriteProperty = require('./overwriteProperty');\n\n/*!\n * overwrite Method\n */\n\nexports.overwriteMethod = require('./overwriteMethod');\n\n/*!\n * Add a chainable method\n */\n\nexports.addChainableMethod = require('./addChainableMethod');\n\n\n});\nrequire.register(\"chai/lib/chai/utils/inspect.js\", function(exports, require, module){\n// This is (almost) directly from Node.js utils\n// https://github.com/joyent/node/blob/f8c335d0caf47f16d31413f89aa28eda3878e3aa/lib/util.js\n\nvar getName = require('./getName');\nvar getProperties = require('./getProperties');\nvar getEnumerableProperties = require('./getEnumerableProperties');\n\nmodule.exports = inspect;\n\n/**\n * Echos the value of a value. Trys to print the value out\n * in the best way possible given the different types.\n *\n * @param {Object} obj The object to print out.\n * @param {Boolean} showHidden Flag that shows hidden (not enumerable)\n *    properties of objects.\n * @param {Number} depth Depth in which to descend in object. Default is 2.\n * @param {Boolean} colors Flag to turn on ANSI escape codes to color the\n *    output. Default is false (no coloring).\n */\nfunction inspect(obj, showHidden, depth, colors) {\n  var ctx = {\n    showHidden: showHidden,\n    seen: [],\n    stylize: function (str) { return str; }\n  };\n  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));\n}\n\n// https://gist.github.com/1044128/\nvar getOuterHTML = function(element) {\n  if ('outerHTML' in element) return element.outerHTML;\n  var ns = \"http://www.w3.org/1999/xhtml\";\n  var container = document.createElementNS(ns, '_');\n  var elemProto = (window.HTMLElement || window.Element).prototype;\n  var xmlSerializer = new XMLSerializer();\n  var html;\n  if (document.xmlVersion) {\n    return xmlSerializer.serializeToString(element);\n  } else {\n    container.appendChild(element.cloneNode(false));\n    html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');\n    container.innerHTML = '';\n    return html;\n  }\n};\n\n// Returns true if object is a DOM element.\nvar isDOMElement = function (object) {\n  if (typeof HTMLElement === 'object') {\n    return object instanceof HTMLElement;\n  } else {\n    return object &&\n      typeof object === 'object' &&\n      object.nodeType === 1 &&\n      typeof object.nodeName === 'string';\n  }\n};\n\nfunction formatValue(ctx, value, recurseTimes) {\n  // Provide a hook for user-specified inspect functions.\n  // Check that value is an object with an inspect function on it\n  if (value && typeof value.inspect === 'function' &&\n      // Filter out the util module, it's inspect function is special\n      value.inspect !== exports.inspect &&\n      // Also filter out any prototype objects using the circular check.\n      !(value.constructor && value.constructor.prototype === value)) {\n    var ret = value.inspect(recurseTimes);\n    if (typeof ret !== 'string') {\n      ret = formatValue(ctx, ret, recurseTimes);\n    }\n    return ret;\n  }\n\n  // Primitive types cannot have properties\n  var primitive = formatPrimitive(ctx, value);\n  if (primitive) {\n    return primitive;\n  }\n\n  // If it's DOM elem, get outer HTML.\n  if (isDOMElement(value)) {\n    return getOuterHTML(value);\n  }\n\n  // Look up the keys of the object.\n  var visibleKeys = getEnumerableProperties(value);\n  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;\n\n  // Some type of object without properties can be shortcutted.\n  // In IE, errors have a single `stack` property, or if they are vanilla `Error`,\n  // a `stack` plus `description` property; ignore those for consistency.\n  if (keys.length === 0 || (isError(value) && (\n      (keys.length === 1 && keys[0] === 'stack') ||\n      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')\n     ))) {\n    if (typeof value === 'function') {\n      var name = getName(value);\n      var nameSuffix = name ? ': ' + name : '';\n      return ctx.stylize('[Function' + nameSuffix + ']', 'special');\n    }\n    if (isRegExp(value)) {\n      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');\n    }\n    if (isDate(value)) {\n      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');\n    }\n    if (isError(value)) {\n      return formatError(value);\n    }\n  }\n\n  var base = '', array = false, braces = ['{', '}'];\n\n  // Make Array say that they are Array\n  if (isArray(value)) {\n    array = true;\n    braces = ['[', ']'];\n  }\n\n  // Make functions say that they are functions\n  if (typeof value === 'function') {\n    var name = getName(value);\n    var nameSuffix = name ? ': ' + name : '';\n    base = ' [Function' + nameSuffix + ']';\n  }\n\n  // Make RegExps say that they are RegExps\n  if (isRegExp(value)) {\n    base = ' ' + RegExp.prototype.toString.call(value);\n  }\n\n  // Make dates with properties first say the date\n  if (isDate(value)) {\n    base = ' ' + Date.prototype.toUTCString.call(value);\n  }\n\n  // Make error with message first say the error\n  if (isError(value)) {\n    return formatError(value);\n  }\n\n  if (keys.length === 0 && (!array || value.length == 0)) {\n    return braces[0] + base + braces[1];\n  }\n\n  if (recurseTimes < 0) {\n    if (isRegExp(value)) {\n      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');\n    } else {\n      return ctx.stylize('[Object]', 'special');\n    }\n  }\n\n  ctx.seen.push(value);\n\n  var output;\n  if (array) {\n    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);\n  } else {\n    output = keys.map(function(key) {\n      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);\n    });\n  }\n\n  ctx.seen.pop();\n\n  return reduceToSingleString(output, base, braces);\n}\n\n\nfunction formatPrimitive(ctx, value) {\n  switch (typeof value) {\n    case 'undefined':\n      return ctx.stylize('undefined', 'undefined');\n\n    case 'string':\n      var simple = '\\'' + JSON.stringify(value).replace(/^\"|\"$/g, '')\n                                               .replace(/'/g, \"\\\\'\")\n                                               .replace(/\\\\\"/g, '\"') + '\\'';\n      return ctx.stylize(simple, 'string');\n\n    case 'number':\n      return ctx.stylize('' + value, 'number');\n\n    case 'boolean':\n      return ctx.stylize('' + value, 'boolean');\n  }\n  // For some reason typeof null is \"object\", so special case here.\n  if (value === null) {\n    return ctx.stylize('null', 'null');\n  }\n}\n\n\nfunction formatError(value) {\n  return '[' + Error.prototype.toString.call(value) + ']';\n}\n\n\nfunction formatArray(ctx, value, recurseTimes, visibleKeys, keys) {\n  var output = [];\n  for (var i = 0, l = value.length; i < l; ++i) {\n    if (Object.prototype.hasOwnProperty.call(value, String(i))) {\n      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,\n          String(i), true));\n    } else {\n      output.push('');\n    }\n  }\n  keys.forEach(function(key) {\n    if (!key.match(/^\\d+$/)) {\n      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,\n          key, true));\n    }\n  });\n  return output;\n}\n\n\nfunction formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {\n  var name, str;\n  if (value.__lookupGetter__) {\n    if (value.__lookupGetter__(key)) {\n      if (value.__lookupSetter__(key)) {\n        str = ctx.stylize('[Getter/Setter]', 'special');\n      } else {\n        str = ctx.stylize('[Getter]', 'special');\n      }\n    } else {\n      if (value.__lookupSetter__(key)) {\n        str = ctx.stylize('[Setter]', 'special');\n      }\n    }\n  }\n  if (visibleKeys.indexOf(key) < 0) {\n    name = '[' + key + ']';\n  }\n  if (!str) {\n    if (ctx.seen.indexOf(value[key]) < 0) {\n      if (recurseTimes === null) {\n        str = formatValue(ctx, value[key], null);\n      } else {\n        str = formatValue(ctx, value[key], recurseTimes - 1);\n      }\n      if (str.indexOf('\\n') > -1) {\n        if (array) {\n          str = str.split('\\n').map(function(line) {\n            return '  ' + line;\n          }).join('\\n').substr(2);\n        } else {\n          str = '\\n' + str.split('\\n').map(function(line) {\n            return '   ' + line;\n          }).join('\\n');\n        }\n      }\n    } else {\n      str = ctx.stylize('[Circular]', 'special');\n    }\n  }\n  if (typeof name === 'undefined') {\n    if (array && key.match(/^\\d+$/)) {\n      return str;\n    }\n    name = JSON.stringify('' + key);\n    if (name.match(/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)) {\n      name = name.substr(1, name.length - 2);\n      name = ctx.stylize(name, 'name');\n    } else {\n      name = name.replace(/'/g, \"\\\\'\")\n                 .replace(/\\\\\"/g, '\"')\n                 .replace(/(^\"|\"$)/g, \"'\");\n      name = ctx.stylize(name, 'string');\n    }\n  }\n\n  return name + ': ' + str;\n}\n\n\nfunction reduceToSingleString(output, base, braces) {\n  var numLinesEst = 0;\n  var length = output.reduce(function(prev, cur) {\n    numLinesEst++;\n    if (cur.indexOf('\\n') >= 0) numLinesEst++;\n    return prev + cur.length + 1;\n  }, 0);\n\n  if (length > 60) {\n    return braces[0] +\n           (base === '' ? '' : base + '\\n ') +\n           ' ' +\n           output.join(',\\n  ') +\n           ' ' +\n           braces[1];\n  }\n\n  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];\n}\n\nfunction isArray(ar) {\n  return Array.isArray(ar) ||\n         (typeof ar === 'object' && objectToString(ar) === '[object Array]');\n}\n\nfunction isRegExp(re) {\n  return typeof re === 'object' && objectToString(re) === '[object RegExp]';\n}\n\nfunction isDate(d) {\n  return typeof d === 'object' && objectToString(d) === '[object Date]';\n}\n\nfunction isError(e) {\n  return typeof e === 'object' && objectToString(e) === '[object Error]';\n}\n\nfunction objectToString(o) {\n  return Object.prototype.toString.call(o);\n}\n\n});\nrequire.register(\"chai/lib/chai/utils/objDisplay.js\", function(exports, require, module){\n/*!\n * Chai - flag utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Module dependancies\n */\n\nvar inspect = require('./inspect');\n\n/**\n * ### .objDisplay (object)\n *\n * Determines if an object or an array matches\n * criteria to be inspected in-line for error\n * messages or should be truncated.\n *\n * @param {Mixed} javascript object to inspect\n * @name objDisplay\n * @api public\n */\n\nmodule.exports = function (obj) {\n  var str = inspect(obj)\n    , type = Object.prototype.toString.call(obj);\n\n  if (str.length >= 40) {\n    if (type === '[object Function]') {\n      return !obj.name || obj.name === ''\n        ? '[Function]'\n        : '[Function: ' + obj.name + ']';\n    } else if (type === '[object Array]') {\n      return '[ Array(' + obj.length + ') ]';\n    } else if (type === '[object Object]') {\n      var keys = Object.keys(obj)\n        , kstr = keys.length > 2\n          ? keys.splice(0, 2).join(', ') + ', ...'\n          : keys.join(', ');\n      return '{ Object (' + kstr + ') }';\n    } else {\n      return str;\n    }\n  } else {\n    return str;\n  }\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/overwriteMethod.js\", function(exports, require, module){\n/*!\n * Chai - overwriteMethod utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### overwriteMethod (ctx, name, fn)\n *\n * Overwites an already existing method and provides\n * access to previous function. Must return function\n * to be used for name.\n *\n *     utils.overwriteMethod(chai.Assertion.prototype, 'equal', function (_super) {\n *       return function (str) {\n *         var obj = utils.flag(this, 'object');\n *         if (obj instanceof Foo) {\n *           new chai.Assertion(obj.value).to.equal(str);\n *         } else {\n *           _super.apply(this, arguments);\n *         }\n *       }\n *     });\n *\n * Can also be accessed directly from `chai.Assertion`.\n *\n *     chai.Assertion.overwriteMethod('foo', fn);\n *\n * Then can be used as any other assertion.\n *\n *     expect(myFoo).to.equal('bar');\n *\n * @param {Object} ctx object whose method is to be overwritten\n * @param {String} name of method to overwrite\n * @param {Function} method function that returns a function to be used for name\n * @name overwriteMethod\n * @api public\n */\n\nmodule.exports = function (ctx, name, method) {\n  var _method = ctx[name]\n    , _super = function () { return this; };\n\n  if (_method && 'function' === typeof _method)\n    _super = _method;\n\n  ctx[name] = function () {\n    var result = method(_super).apply(this, arguments);\n    return result === undefined ? this : result;\n  }\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/overwriteProperty.js\", function(exports, require, module){\n/*!\n * Chai - overwriteProperty utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### overwriteProperty (ctx, name, fn)\n *\n * Overwites an already existing property getter and provides\n * access to previous value. Must return function to use as getter.\n *\n *     utils.overwriteProperty(chai.Assertion.prototype, 'ok', function (_super) {\n *       return function () {\n *         var obj = utils.flag(this, 'object');\n *         if (obj instanceof Foo) {\n *           new chai.Assertion(obj.name).to.equal('bar');\n *         } else {\n *           _super.call(this);\n *         }\n *       }\n *     });\n *\n *\n * Can also be accessed directly from `chai.Assertion`.\n *\n *     chai.Assertion.overwriteProperty('foo', fn);\n *\n * Then can be used as any other assertion.\n *\n *     expect(myFoo).to.be.ok;\n *\n * @param {Object} ctx object whose property is to be overwritten\n * @param {String} name of property to overwrite\n * @param {Function} getter function that returns a getter function to be used for name\n * @name overwriteProperty\n * @api public\n */\n\nmodule.exports = function (ctx, name, getter) {\n  var _get = Object.getOwnPropertyDescriptor(ctx, name)\n    , _super = function () {};\n\n  if (_get && 'function' === typeof _get.get)\n    _super = _get.get\n\n  Object.defineProperty(ctx, name,\n    { get: function () {\n        var result = getter(_super).call(this);\n        return result === undefined ? this : result;\n      }\n    , configurable: true\n  });\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/test.js\", function(exports, require, module){\n/*!\n * Chai - test utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Module dependancies\n */\n\nvar flag = require('./flag');\n\n/**\n * # test(object, expression)\n *\n * Test and object for expression.\n *\n * @param {Object} object (constructed Assertion)\n * @param {Arguments} chai.Assertion.prototype.assert arguments\n */\n\nmodule.exports = function (obj, args) {\n  var negate = flag(obj, 'negate')\n    , expr = args[0];\n  return negate ? !expr : expr;\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/transferFlags.js\", function(exports, require, module){\n/*!\n * Chai - transferFlags utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/**\n * ### transferFlags(assertion, object, includeAll = true)\n *\n * Transfer all the flags for `assertion` to `object`. If\n * `includeAll` is set to `false`, then the base Chai\n * assertion flags (namely `object`, `ssfi`, and `message`)\n * will not be transferred.\n *\n *\n *     var newAssertion = new Assertion();\n *     utils.transferFlags(assertion, newAssertion);\n *\n *     var anotherAsseriton = new Assertion(myObj);\n *     utils.transferFlags(assertion, anotherAssertion, false);\n *\n * @param {Assertion} assertion the assertion to transfer the flags from\n * @param {Object} object the object to transfer the flags too; usually a new assertion\n * @param {Boolean} includeAll\n * @name getAllFlags\n * @api private\n */\n\nmodule.exports = function (assertion, object, includeAll) {\n  var flags = assertion.__flags || (assertion.__flags = Object.create(null));\n\n  if (!object.__flags) {\n    object.__flags = Object.create(null);\n  }\n\n  includeAll = arguments.length === 3 ? includeAll : true;\n\n  for (var flag in flags) {\n    if (includeAll ||\n        (flag !== 'object' && flag !== 'ssfi' && flag != 'message')) {\n      object.__flags[flag] = flags[flag];\n    }\n  }\n};\n\n});\nrequire.register(\"chai/lib/chai/utils/type.js\", function(exports, require, module){\n/*!\n * Chai - type utility\n * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>\n * MIT Licensed\n */\n\n/*!\n * Detectable javascript natives\n */\n\nvar natives = {\n    '[object Arguments]': 'arguments'\n  , '[object Array]': 'array'\n  , '[object Date]': 'date'\n  , '[object Function]': 'function'\n  , '[object Number]': 'number'\n  , '[object RegExp]': 'regexp'\n  , '[object String]': 'string'\n};\n\n/**\n * ### type(object)\n *\n * Better implementation of `typeof` detection that can\n * be used cross-browser. Handles the inconsistencies of\n * Array, `null`, and `undefined` detection.\n *\n *     utils.type({}) // 'object'\n *     utils.type(null) // `null'\n *     utils.type(undefined) // `undefined`\n *     utils.type([]) // `array`\n *\n * @param {Mixed} object to detect type of\n * @name type\n * @api private\n */\n\nmodule.exports = function (obj) {\n  var str = Object.prototype.toString.call(obj);\n  if (natives[str]) return natives[str];\n  if (obj === null) return 'null';\n  if (obj === undefined) return 'undefined';\n  if (obj === Object(obj)) return 'object';\n  return typeof obj;\n};\n\n});\n\n\nrequire.alias(\"chaijs-assertion-error/index.js\", \"chai/deps/assertion-error/index.js\");\nrequire.alias(\"chaijs-assertion-error/index.js\", \"chai/deps/assertion-error/index.js\");\nrequire.alias(\"chaijs-assertion-error/index.js\", \"assertion-error/index.js\");\nrequire.alias(\"chaijs-assertion-error/index.js\", \"chaijs-assertion-error/index.js\");\nrequire.alias(\"chaijs-deep-eql/lib/eql.js\", \"chai/deps/deep-eql/lib/eql.js\");\nrequire.alias(\"chaijs-deep-eql/lib/eql.js\", \"chai/deps/deep-eql/index.js\");\nrequire.alias(\"chaijs-deep-eql/lib/eql.js\", \"deep-eql/index.js\");\nrequire.alias(\"chaijs-type-detect/lib/type.js\", \"chaijs-deep-eql/deps/type-detect/lib/type.js\");\nrequire.alias(\"chaijs-type-detect/lib/type.js\", \"chaijs-deep-eql/deps/type-detect/index.js\");\nrequire.alias(\"chaijs-type-detect/lib/type.js\", \"chaijs-type-detect/index.js\");\nrequire.alias(\"chaijs-deep-eql/lib/eql.js\", \"chaijs-deep-eql/index.js\");\nrequire.alias(\"chai/index.js\", \"chai/index.js\");if (typeof exports == \"object\") {\n  module.exports = require(\"chai\");\n} else if (typeof define == \"function\" && define.amd) {\n  define(function(){ return require(\"chai\"); });\n} else {\n  this[\"chai\"] = require(\"chai\");\n}})();\n"

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "/**\n * Sinon.JS 1.7.3, 2013/06/20\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @author Contributors: https://github.com/cjohansen/Sinon.JS/blob/master/AUTHORS\n *\n * (The BSD License)\n * \n * Copyright (c) 2010-2013, Christian Johansen, christian@cjohansen.no\n * All rights reserved.\n * \n * Redistribution and use in source and binary forms, with or without modification,\n * are permitted provided that the following conditions are met:\n * \n *     * Redistributions of source code must retain the above copyright notice,\n *       this list of conditions and the following disclaimer.\n *     * Redistributions in binary form must reproduce the above copyright notice,\n *       this list of conditions and the following disclaimer in the documentation\n *       and/or other materials provided with the distribution.\n *     * Neither the name of Christian Johansen nor the names of his contributors\n *       may be used to endorse or promote products derived from this software\n *       without specific prior written permission.\n * \n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND\n * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\n * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\n * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\n * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\n * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\n * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\n * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\nthis.sinon = (function () {\nvar buster = (function (setTimeout, B) {\n    var isNode = typeof require == \"function\" && typeof module == \"object\";\n    var div = typeof document != \"undefined\" && document.createElement(\"div\");\n    var F = function () {};\n\n    var buster = {\n        bind: function bind(obj, methOrProp) {\n            var method = typeof methOrProp == \"string\" ? obj[methOrProp] : methOrProp;\n            var args = Array.prototype.slice.call(arguments, 2);\n            return function () {\n                var allArgs = args.concat(Array.prototype.slice.call(arguments));\n                return method.apply(obj, allArgs);\n            };\n        },\n\n        partial: function partial(fn) {\n            var args = [].slice.call(arguments, 1);\n            return function () {\n                return fn.apply(this, args.concat([].slice.call(arguments)));\n            };\n        },\n\n        create: function create(object) {\n            F.prototype = object;\n            return new F();\n        },\n\n        extend: function extend(target) {\n            if (!target) { return; }\n            for (var i = 1, l = arguments.length, prop; i < l; ++i) {\n                for (prop in arguments[i]) {\n                    target[prop] = arguments[i][prop];\n                }\n            }\n            return target;\n        },\n\n        nextTick: function nextTick(callback) {\n            if (typeof process != \"undefined\" && process.nextTick) {\n                return process.nextTick(callback);\n            }\n            setTimeout(callback, 0);\n        },\n\n        functionName: function functionName(func) {\n            if (!func) return \"\";\n            if (func.displayName) return func.displayName;\n            if (func.name) return func.name;\n            var matches = func.toString().match(/function\\s+([^\\(]+)/m);\n            return matches && matches[1] || \"\";\n        },\n\n        isNode: function isNode(obj) {\n            if (!div) return false;\n            try {\n                obj.appendChild(div);\n                obj.removeChild(div);\n            } catch (e) {\n                return false;\n            }\n            return true;\n        },\n\n        isElement: function isElement(obj) {\n            return obj && obj.nodeType === 1 && buster.isNode(obj);\n        },\n\n        isArray: function isArray(arr) {\n            return Object.prototype.toString.call(arr) == \"[object Array]\";\n        },\n\n        flatten: function flatten(arr) {\n            var result = [], arr = arr || [];\n            for (var i = 0, l = arr.length; i < l; ++i) {\n                result = result.concat(buster.isArray(arr[i]) ? flatten(arr[i]) : arr[i]);\n            }\n            return result;\n        },\n\n        each: function each(arr, callback) {\n            for (var i = 0, l = arr.length; i < l; ++i) {\n                callback(arr[i]);\n            }\n        },\n\n        map: function map(arr, callback) {\n            var results = [];\n            for (var i = 0, l = arr.length; i < l; ++i) {\n                results.push(callback(arr[i]));\n            }\n            return results;\n        },\n\n        parallel: function parallel(fns, callback) {\n            function cb(err, res) {\n                if (typeof callback == \"function\") {\n                    callback(err, res);\n                    callback = null;\n                }\n            }\n            if (fns.length == 0) { return cb(null, []); }\n            var remaining = fns.length, results = [];\n            function makeDone(num) {\n                return function done(err, result) {\n                    if (err) { return cb(err); }\n                    results[num] = result;\n                    if (--remaining == 0) { cb(null, results); }\n                };\n            }\n            for (var i = 0, l = fns.length; i < l; ++i) {\n                fns[i](makeDone(i));\n            }\n        },\n\n        series: function series(fns, callback) {\n            function cb(err, res) {\n                if (typeof callback == \"function\") {\n                    callback(err, res);\n                }\n            }\n            var remaining = fns.slice();\n            var results = [];\n            function callNext() {\n                if (remaining.length == 0) return cb(null, results);\n                var promise = remaining.shift()(next);\n                if (promise && typeof promise.then == \"function\") {\n                    promise.then(buster.partial(next, null), next);\n                }\n            }\n            function next(err, result) {\n                if (err) return cb(err);\n                results.push(result);\n                callNext();\n            }\n            callNext();\n        },\n\n        countdown: function countdown(num, done) {\n            return function () {\n                if (--num == 0) done();\n            };\n        }\n    };\n\n    if (typeof process === \"object\" &&\n        typeof require === \"function\" && typeof module === \"object\") {\n        var crypto = require(\"crypto\");\n        var path = require(\"path\");\n\n        buster.tmpFile = function (fileName) {\n            var hashed = crypto.createHash(\"sha1\");\n            hashed.update(fileName);\n            var tmpfileName = hashed.digest(\"hex\");\n\n            if (process.platform == \"win32\") {\n                return path.join(process.env[\"TEMP\"], tmpfileName);\n            } else {\n                return path.join(\"/tmp\", tmpfileName);\n            }\n        };\n    }\n\n    if (Array.prototype.some) {\n        buster.some = function (arr, fn, thisp) {\n            return arr.some(fn, thisp);\n        };\n    } else {\n        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some\n        buster.some = function (arr, fun, thisp) {\n                        if (arr == null) { throw new TypeError(); }\n            arr = Object(arr);\n            var len = arr.length >>> 0;\n            if (typeof fun !== \"function\") { throw new TypeError(); }\n\n            for (var i = 0; i < len; i++) {\n                if (arr.hasOwnProperty(i) && fun.call(thisp, arr[i], i, arr)) {\n                    return true;\n                }\n            }\n\n            return false;\n        };\n    }\n\n    if (Array.prototype.filter) {\n        buster.filter = function (arr, fn, thisp) {\n            return arr.filter(fn, thisp);\n        };\n    } else {\n        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter\n        buster.filter = function (fn, thisp) {\n                        if (this == null) { throw new TypeError(); }\n\n            var t = Object(this);\n            var len = t.length >>> 0;\n            if (typeof fn != \"function\") { throw new TypeError(); }\n\n            var res = [];\n            for (var i = 0; i < len; i++) {\n                if (i in t) {\n                    var val = t[i]; // in case fun mutates this\n                    if (fn.call(thisp, val, i, t)) { res.push(val); }\n                }\n            }\n\n            return res;\n        };\n    }\n\n    if (isNode) {\n        module.exports = buster;\n        buster.eventEmitter = require(\"./buster-event-emitter\");\n        Object.defineProperty(buster, \"defineVersionGetter\", {\n            get: function () {\n                return require(\"./define-version-getter\");\n            }\n        });\n    }\n\n    return buster.extend(B || {}, buster);\n}(setTimeout, buster));\nif (typeof buster === \"undefined\") {\n    var buster = {};\n}\n\nif (typeof module === \"object\" && typeof require === \"function\") {\n    buster = require(\"buster-core\");\n}\n\nbuster.format = buster.format || {};\nbuster.format.excludeConstructors = [\"Object\", /^.$/];\nbuster.format.quoteStrings = true;\n\nbuster.format.ascii = (function () {\n    \n    var hasOwn = Object.prototype.hasOwnProperty;\n\n    var specialObjects = [];\n    if (typeof global != \"undefined\") {\n        specialObjects.push({ obj: global, value: \"[object global]\" });\n    }\n    if (typeof document != \"undefined\") {\n        specialObjects.push({ obj: document, value: \"[object HTMLDocument]\" });\n    }\n    if (typeof window != \"undefined\") {\n        specialObjects.push({ obj: window, value: \"[object Window]\" });\n    }\n\n    function keys(object) {\n        var k = Object.keys && Object.keys(object) || [];\n\n        if (k.length == 0) {\n            for (var prop in object) {\n                if (hasOwn.call(object, prop)) {\n                    k.push(prop);\n                }\n            }\n        }\n\n        return k.sort();\n    }\n\n    function isCircular(object, objects) {\n        if (typeof object != \"object\") {\n            return false;\n        }\n\n        for (var i = 0, l = objects.length; i < l; ++i) {\n            if (objects[i] === object) {\n                return true;\n            }\n        }\n\n        return false;\n    }\n\n    function ascii(object, processed, indent) {\n        if (typeof object == \"string\") {\n            var quote = typeof this.quoteStrings != \"boolean\" || this.quoteStrings;\n            return processed || quote ? '\"' + object + '\"' : object;\n        }\n\n        if (typeof object == \"function\" && !(object instanceof RegExp)) {\n            return ascii.func(object);\n        }\n\n        processed = processed || [];\n\n        if (isCircular(object, processed)) {\n            return \"[Circular]\";\n        }\n\n        if (Object.prototype.toString.call(object) == \"[object Array]\") {\n            return ascii.array.call(this, object, processed);\n        }\n\n        if (!object) {\n            return \"\" + object;\n        }\n\n        if (buster.isElement(object)) {\n            return ascii.element(object);\n        }\n\n        if (typeof object.toString == \"function\" &&\n            object.toString !== Object.prototype.toString) {\n            return object.toString();\n        }\n\n        for (var i = 0, l = specialObjects.length; i < l; i++) {\n            if (object === specialObjects[i].obj) {\n                return specialObjects[i].value;\n            }\n        }\n\n        return ascii.object.call(this, object, processed, indent);\n    }\n\n    ascii.func = function (func) {\n        return \"function \" + buster.functionName(func) + \"() {}\";\n    };\n\n    ascii.array = function (array, processed) {\n        processed = processed || [];\n        processed.push(array);\n        var pieces = [];\n\n        for (var i = 0, l = array.length; i < l; ++i) {\n            pieces.push(ascii.call(this, array[i], processed));\n        }\n\n        return \"[\" + pieces.join(\", \") + \"]\";\n    };\n\n    ascii.object = function (object, processed, indent) {\n        processed = processed || [];\n        processed.push(object);\n        indent = indent || 0;\n        var pieces = [], properties = keys(object), prop, str, obj;\n        var is = \"\";\n        var length = 3;\n\n        for (var i = 0, l = indent; i < l; ++i) {\n            is += \" \";\n        }\n\n        for (i = 0, l = properties.length; i < l; ++i) {\n            prop = properties[i];\n            obj = object[prop];\n\n            if (isCircular(obj, processed)) {\n                str = \"[Circular]\";\n            } else {\n                str = ascii.call(this, obj, processed, indent + 2);\n            }\n\n            str = (/\\s/.test(prop) ? '\"' + prop + '\"' : prop) + \": \" + str;\n            length += str.length;\n            pieces.push(str);\n        }\n\n        var cons = ascii.constructorName.call(this, object);\n        var prefix = cons ? \"[\" + cons + \"] \" : \"\"\n\n        return (length + indent) > 80 ?\n            prefix + \"{\\n  \" + is + pieces.join(\",\\n  \" + is) + \"\\n\" + is + \"}\" :\n            prefix + \"{ \" + pieces.join(\", \") + \" }\";\n    };\n\n    ascii.element = function (element) {\n        var tagName = element.tagName.toLowerCase();\n        var attrs = element.attributes, attribute, pairs = [], attrName;\n\n        for (var i = 0, l = attrs.length; i < l; ++i) {\n            attribute = attrs.item(i);\n            attrName = attribute.nodeName.toLowerCase().replace(\"html:\", \"\");\n\n            if (attrName == \"contenteditable\" && attribute.nodeValue == \"inherit\") {\n                continue;\n            }\n\n            if (!!attribute.nodeValue) {\n                pairs.push(attrName + \"=\\\"\" + attribute.nodeValue + \"\\\"\");\n            }\n        }\n\n        var formatted = \"<\" + tagName + (pairs.length > 0 ? \" \" : \"\");\n        var content = element.innerHTML;\n\n        if (content.length > 20) {\n            content = content.substr(0, 20) + \"[...]\";\n        }\n\n        var res = formatted + pairs.join(\" \") + \">\" + content + \"</\" + tagName + \">\";\n\n        return res.replace(/ contentEditable=\"inherit\"/, \"\");\n    };\n\n    ascii.constructorName = function (object) {\n        var name = buster.functionName(object && object.constructor);\n        var excludes = this.excludeConstructors || buster.format.excludeConstructors || [];\n\n        for (var i = 0, l = excludes.length; i < l; ++i) {\n            if (typeof excludes[i] == \"string\" && excludes[i] == name) {\n                return \"\";\n            } else if (excludes[i].test && excludes[i].test(name)) {\n                return \"\";\n            }\n        }\n\n        return name;\n    };\n\n    return ascii;\n}());\n\nif (typeof module != \"undefined\") {\n    module.exports = buster.format;\n}\n/*jslint eqeqeq: false, onevar: false, forin: true, nomen: false, regexp: false, plusplus: false*/\n/*global module, require, __dirname, document*/\n/**\n * Sinon core utilities. For internal use only.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\nvar sinon = (function (buster) {\n    var div = typeof document != \"undefined\" && document.createElement(\"div\");\n    var hasOwn = Object.prototype.hasOwnProperty;\n\n    function isDOMNode(obj) {\n        var success = false;\n\n        try {\n            obj.appendChild(div);\n            success = div.parentNode == obj;\n        } catch (e) {\n            return false;\n        } finally {\n            try {\n                obj.removeChild(div);\n            } catch (e) {\n                // Remove failed, not much we can do about that\n            }\n        }\n\n        return success;\n    }\n\n    function isElement(obj) {\n        return div && obj && obj.nodeType === 1 && isDOMNode(obj);\n    }\n\n    function isFunction(obj) {\n        return typeof obj === \"function\" || !!(obj && obj.constructor && obj.call && obj.apply);\n    }\n\n    function mirrorProperties(target, source) {\n        for (var prop in source) {\n            if (!hasOwn.call(target, prop)) {\n                target[prop] = source[prop];\n            }\n        }\n    }\n\n    function isRestorable (obj) {\n        return typeof obj === \"function\" && typeof obj.restore === \"function\" && obj.restore.sinon;\n    }\n\n    var sinon = {\n        wrapMethod: function wrapMethod(object, property, method) {\n            if (!object) {\n                throw new TypeError(\"Should wrap property of object\");\n            }\n\n            if (typeof method != \"function\") {\n                throw new TypeError(\"Method wrapper should be function\");\n            }\n\n            var wrappedMethod = object[property];\n\n            if (!isFunction(wrappedMethod)) {\n                throw new TypeError(\"Attempted to wrap \" + (typeof wrappedMethod) + \" property \" +\n                                    property + \" as function\");\n            }\n\n            if (wrappedMethod.restore && wrappedMethod.restore.sinon) {\n                throw new TypeError(\"Attempted to wrap \" + property + \" which is already wrapped\");\n            }\n\n            if (wrappedMethod.calledBefore) {\n                var verb = !!wrappedMethod.returns ? \"stubbed\" : \"spied on\";\n                throw new TypeError(\"Attempted to wrap \" + property + \" which is already \" + verb);\n            }\n\n            // IE 8 does not support hasOwnProperty on the window object.\n            var owned = hasOwn.call(object, property);\n            object[property] = method;\n            method.displayName = property;\n\n            method.restore = function () {\n                // For prototype properties try to reset by delete first.\n                // If this fails (ex: localStorage on mobile safari) then force a reset\n                // via direct assignment.\n                if (!owned) {\n                    delete object[property];\n                }\n                if (object[property] === method) {\n                    object[property] = wrappedMethod;\n                }\n            };\n\n            method.restore.sinon = true;\n            mirrorProperties(method, wrappedMethod);\n\n            return method;\n        },\n\n        extend: function extend(target) {\n            for (var i = 1, l = arguments.length; i < l; i += 1) {\n                for (var prop in arguments[i]) {\n                    if (arguments[i].hasOwnProperty(prop)) {\n                        target[prop] = arguments[i][prop];\n                    }\n\n                    // DONT ENUM bug, only care about toString\n                    if (arguments[i].hasOwnProperty(\"toString\") &&\n                        arguments[i].toString != target.toString) {\n                        target.toString = arguments[i].toString;\n                    }\n                }\n            }\n\n            return target;\n        },\n\n        create: function create(proto) {\n            var F = function () {};\n            F.prototype = proto;\n            return new F();\n        },\n\n        deepEqual: function deepEqual(a, b) {\n            if (sinon.match && sinon.match.isMatcher(a)) {\n                return a.test(b);\n            }\n            if (typeof a != \"object\" || typeof b != \"object\") {\n                return a === b;\n            }\n\n            if (isElement(a) || isElement(b)) {\n                return a === b;\n            }\n\n            if (a === b) {\n                return true;\n            }\n\n            if ((a === null && b !== null) || (a !== null && b === null)) {\n                return false;\n            }\n\n            var aString = Object.prototype.toString.call(a);\n            if (aString != Object.prototype.toString.call(b)) {\n                return false;\n            }\n\n            if (aString == \"[object Array]\") {\n                if (a.length !== b.length) {\n                    return false;\n                }\n\n                for (var i = 0, l = a.length; i < l; i += 1) {\n                    if (!deepEqual(a[i], b[i])) {\n                        return false;\n                    }\n                }\n\n                return true;\n            }\n\n            if (aString == \"[object Date]\") {\n                return a.valueOf() === b.valueOf();\n            }\n\n            var prop, aLength = 0, bLength = 0;\n\n            for (prop in a) {\n                aLength += 1;\n\n                if (!deepEqual(a[prop], b[prop])) {\n                    return false;\n                }\n            }\n\n            for (prop in b) {\n                bLength += 1;\n            }\n\n            return aLength == bLength;\n        },\n\n        functionName: function functionName(func) {\n            var name = func.displayName || func.name;\n\n            // Use function decomposition as a last resort to get function\n            // name. Does not rely on function decomposition to work - if it\n            // doesn't debugging will be slightly less informative\n            // (i.e. toString will say 'spy' rather than 'myFunc').\n            if (!name) {\n                var matches = func.toString().match(/function ([^\\s\\(]+)/);\n                name = matches && matches[1];\n            }\n\n            return name;\n        },\n\n        functionToString: function toString() {\n            if (this.getCall && this.callCount) {\n                var thisValue, prop, i = this.callCount;\n\n                while (i--) {\n                    thisValue = this.getCall(i).thisValue;\n\n                    for (prop in thisValue) {\n                        if (thisValue[prop] === this) {\n                            return prop;\n                        }\n                    }\n                }\n            }\n\n            return this.displayName || \"sinon fake\";\n        },\n\n        getConfig: function (custom) {\n            var config = {};\n            custom = custom || {};\n            var defaults = sinon.defaultConfig;\n\n            for (var prop in defaults) {\n                if (defaults.hasOwnProperty(prop)) {\n                    config[prop] = custom.hasOwnProperty(prop) ? custom[prop] : defaults[prop];\n                }\n            }\n\n            return config;\n        },\n\n        format: function (val) {\n            return \"\" + val;\n        },\n\n        defaultConfig: {\n            injectIntoThis: true,\n            injectInto: null,\n            properties: [\"spy\", \"stub\", \"mock\", \"clock\", \"server\", \"requests\"],\n            useFakeTimers: true,\n            useFakeServer: true\n        },\n\n        timesInWords: function timesInWords(count) {\n            return count == 1 && \"once\" ||\n                count == 2 && \"twice\" ||\n                count == 3 && \"thrice\" ||\n                (count || 0) + \" times\";\n        },\n\n        calledInOrder: function (spies) {\n            for (var i = 1, l = spies.length; i < l; i++) {\n                if (!spies[i - 1].calledBefore(spies[i]) || !spies[i].called) {\n                    return false;\n                }\n            }\n\n            return true;\n        },\n\n        orderByFirstCall: function (spies) {\n            return spies.sort(function (a, b) {\n                // uuid, won't ever be equal\n                var aCall = a.getCall(0);\n                var bCall = b.getCall(0);\n                var aId = aCall && aCall.callId || -1;\n                var bId = bCall && bCall.callId || -1;\n\n                return aId < bId ? -1 : 1;\n            });\n        },\n\n        log: function () {},\n\n        logError: function (label, err) {\n            var msg = label + \" threw exception: \"\n            sinon.log(msg + \"[\" + err.name + \"] \" + err.message);\n            if (err.stack) { sinon.log(err.stack); }\n\n            setTimeout(function () {\n                err.message = msg + err.message;\n                throw err;\n            }, 0);\n        },\n\n        typeOf: function (value) {\n            if (value === null) {\n                return \"null\";\n            }\n            else if (value === undefined) {\n                return \"undefined\";\n            }\n            var string = Object.prototype.toString.call(value);\n            return string.substring(8, string.length - 1).toLowerCase();\n        },\n\n        createStubInstance: function (constructor) {\n            if (typeof constructor !== \"function\") {\n                throw new TypeError(\"The constructor should be a function.\");\n            }\n            return sinon.stub(sinon.create(constructor.prototype));\n        },\n\n        restore: function (object) {\n            if (object !== null && typeof object === \"object\") {\n                for (var prop in object) {\n                    if (isRestorable(object[prop])) {\n                        object[prop].restore();\n                    }\n                }\n            }\n            else if (isRestorable(object)) {\n                object.restore();\n            }\n        }\n    };\n\n    var isNode = typeof module == \"object\" && typeof require == \"function\";\n\n    if (isNode) {\n        try {\n            buster = { format: require(\"buster-format\") };\n        } catch (e) {}\n        module.exports = sinon;\n        module.exports.spy = require(\"./sinon/spy\");\n        module.exports.stub = require(\"./sinon/stub\");\n        module.exports.mock = require(\"./sinon/mock\");\n        module.exports.collection = require(\"./sinon/collection\");\n        module.exports.assert = require(\"./sinon/assert\");\n        module.exports.sandbox = require(\"./sinon/sandbox\");\n        module.exports.test = require(\"./sinon/test\");\n        module.exports.testCase = require(\"./sinon/test_case\");\n        module.exports.assert = require(\"./sinon/assert\");\n        module.exports.match = require(\"./sinon/match\");\n    }\n\n    if (buster) {\n        var formatter = sinon.create(buster.format);\n        formatter.quoteStrings = false;\n        sinon.format = function () {\n            return formatter.ascii.apply(formatter, arguments);\n        };\n    } else if (isNode) {\n        try {\n            var util = require(\"util\");\n            sinon.format = function (value) {\n                return typeof value == \"object\" && value.toString === Object.prototype.toString ? util.inspect(value) : value;\n            };\n        } catch (e) {\n            /* Node, but no util module - would be very old, but better safe than\n             sorry */\n        }\n    }\n\n    return sinon;\n}(typeof buster == \"object\" && buster));\n\n/* @depend ../sinon.js */\n/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n/*global module, require, sinon*/\n/**\n * Match functions\n *\n * @author Maximilian Antoni (mail@maxantoni.de)\n * @license BSD\n *\n * Copyright (c) 2012 Maximilian Antoni\n */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon) {\n        return;\n    }\n\n    function assertType(value, type, name) {\n        var actual = sinon.typeOf(value);\n        if (actual !== type) {\n            throw new TypeError(\"Expected type of \" + name + \" to be \" +\n                type + \", but was \" + actual);\n        }\n    }\n\n    var matcher = {\n        toString: function () {\n            return this.message;\n        }\n    };\n\n    function isMatcher(object) {\n        return matcher.isPrototypeOf(object);\n    }\n\n    function matchObject(expectation, actual) {\n        if (actual === null || actual === undefined) {\n            return false;\n        }\n        for (var key in expectation) {\n            if (expectation.hasOwnProperty(key)) {\n                var exp = expectation[key];\n                var act = actual[key];\n                if (match.isMatcher(exp)) {\n                    if (!exp.test(act)) {\n                        return false;\n                    }\n                } else if (sinon.typeOf(exp) === \"object\") {\n                    if (!matchObject(exp, act)) {\n                        return false;\n                    }\n                } else if (!sinon.deepEqual(exp, act)) {\n                    return false;\n                }\n            }\n        }\n        return true;\n    }\n\n    matcher.or = function (m2) {\n        if (!isMatcher(m2)) {\n            throw new TypeError(\"Matcher expected\");\n        }\n        var m1 = this;\n        var or = sinon.create(matcher);\n        or.test = function (actual) {\n            return m1.test(actual) || m2.test(actual);\n        };\n        or.message = m1.message + \".or(\" + m2.message + \")\";\n        return or;\n    };\n\n    matcher.and = function (m2) {\n        if (!isMatcher(m2)) {\n            throw new TypeError(\"Matcher expected\");\n        }\n        var m1 = this;\n        var and = sinon.create(matcher);\n        and.test = function (actual) {\n            return m1.test(actual) && m2.test(actual);\n        };\n        and.message = m1.message + \".and(\" + m2.message + \")\";\n        return and;\n    };\n\n    var match = function (expectation, message) {\n        var m = sinon.create(matcher);\n        var type = sinon.typeOf(expectation);\n        switch (type) {\n        case \"object\":\n            if (typeof expectation.test === \"function\") {\n                m.test = function (actual) {\n                    return expectation.test(actual) === true;\n                };\n                m.message = \"match(\" + sinon.functionName(expectation.test) + \")\";\n                return m;\n            }\n            var str = [];\n            for (var key in expectation) {\n                if (expectation.hasOwnProperty(key)) {\n                    str.push(key + \": \" + expectation[key]);\n                }\n            }\n            m.test = function (actual) {\n                return matchObject(expectation, actual);\n            };\n            m.message = \"match(\" + str.join(\", \") + \")\";\n            break;\n        case \"number\":\n            m.test = function (actual) {\n                return expectation == actual;\n            };\n            break;\n        case \"string\":\n            m.test = function (actual) {\n                if (typeof actual !== \"string\") {\n                    return false;\n                }\n                return actual.indexOf(expectation) !== -1;\n            };\n            m.message = \"match(\\\"\" + expectation + \"\\\")\";\n            break;\n        case \"regexp\":\n            m.test = function (actual) {\n                if (typeof actual !== \"string\") {\n                    return false;\n                }\n                return expectation.test(actual);\n            };\n            break;\n        case \"function\":\n            m.test = expectation;\n            if (message) {\n                m.message = message;\n            } else {\n                m.message = \"match(\" + sinon.functionName(expectation) + \")\";\n            }\n            break;\n        default:\n            m.test = function (actual) {\n              return sinon.deepEqual(expectation, actual);\n            };\n        }\n        if (!m.message) {\n            m.message = \"match(\" + expectation + \")\";\n        }\n        return m;\n    };\n\n    match.isMatcher = isMatcher;\n\n    match.any = match(function () {\n        return true;\n    }, \"any\");\n\n    match.defined = match(function (actual) {\n        return actual !== null && actual !== undefined;\n    }, \"defined\");\n\n    match.truthy = match(function (actual) {\n        return !!actual;\n    }, \"truthy\");\n\n    match.falsy = match(function (actual) {\n        return !actual;\n    }, \"falsy\");\n\n    match.same = function (expectation) {\n        return match(function (actual) {\n            return expectation === actual;\n        }, \"same(\" + expectation + \")\");\n    };\n\n    match.typeOf = function (type) {\n        assertType(type, \"string\", \"type\");\n        return match(function (actual) {\n            return sinon.typeOf(actual) === type;\n        }, \"typeOf(\\\"\" + type + \"\\\")\");\n    };\n\n    match.instanceOf = function (type) {\n        assertType(type, \"function\", \"type\");\n        return match(function (actual) {\n            return actual instanceof type;\n        }, \"instanceOf(\" + sinon.functionName(type) + \")\");\n    };\n\n    function createPropertyMatcher(propertyTest, messagePrefix) {\n        return function (property, value) {\n            assertType(property, \"string\", \"property\");\n            var onlyProperty = arguments.length === 1;\n            var message = messagePrefix + \"(\\\"\" + property + \"\\\"\";\n            if (!onlyProperty) {\n                message += \", \" + value;\n            }\n            message += \")\";\n            return match(function (actual) {\n                if (actual === undefined || actual === null ||\n                        !propertyTest(actual, property)) {\n                    return false;\n                }\n                return onlyProperty || sinon.deepEqual(value, actual[property]);\n            }, message);\n        };\n    }\n\n    match.has = createPropertyMatcher(function (actual, property) {\n        if (typeof actual === \"object\") {\n            return property in actual;\n        }\n        return actual[property] !== undefined;\n    }, \"has\");\n\n    match.hasOwn = createPropertyMatcher(function (actual, property) {\n        return actual.hasOwnProperty(property);\n    }, \"hasOwn\");\n\n    match.bool = match.typeOf(\"boolean\");\n    match.number = match.typeOf(\"number\");\n    match.string = match.typeOf(\"string\");\n    match.object = match.typeOf(\"object\");\n    match.func = match.typeOf(\"function\");\n    match.array = match.typeOf(\"array\");\n    match.regexp = match.typeOf(\"regexp\");\n    match.date = match.typeOf(\"date\");\n\n    if (commonJSModule) {\n        module.exports = match;\n    } else {\n        sinon.match = match;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n  * @depend ../sinon.js\n  * @depend match.js\n  */\n/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n/*global module, require, sinon*/\n/**\n  * Spy calls\n  *\n  * @author Christian Johansen (christian@cjohansen.no)\n  * @author Maximilian Antoni (mail@maxantoni.de)\n  * @license BSD\n  *\n  * Copyright (c) 2010-2013 Christian Johansen\n  * Copyright (c) 2013 Maximilian Antoni\n  */\n\nvar commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n\nif (!this.sinon && commonJSModule) {\n    var sinon = require(\"../sinon\");\n}\n\n(function (sinon) {\n    function throwYieldError(proxy, text, args) {\n        var msg = sinon.functionName(proxy) + text;\n        if (args.length) {\n            msg += \" Received [\" + slice.call(args).join(\", \") + \"]\";\n        }\n        throw new Error(msg);\n    }\n\n    var slice = Array.prototype.slice;\n\n    var callProto = {\n        calledOn: function calledOn(thisValue) {\n            if (sinon.match && sinon.match.isMatcher(thisValue)) {\n                return thisValue.test(this.thisValue);\n            }\n            return this.thisValue === thisValue;\n        },\n\n        calledWith: function calledWith() {\n            for (var i = 0, l = arguments.length; i < l; i += 1) {\n                if (!sinon.deepEqual(arguments[i], this.args[i])) {\n                    return false;\n                }\n            }\n\n            return true;\n        },\n\n        calledWithMatch: function calledWithMatch() {\n            for (var i = 0, l = arguments.length; i < l; i += 1) {\n                var actual = this.args[i];\n                var expectation = arguments[i];\n                if (!sinon.match || !sinon.match(expectation).test(actual)) {\n                    return false;\n                }\n            }\n            return true;\n        },\n\n        calledWithExactly: function calledWithExactly() {\n            return arguments.length == this.args.length &&\n                this.calledWith.apply(this, arguments);\n        },\n\n        notCalledWith: function notCalledWith() {\n            return !this.calledWith.apply(this, arguments);\n        },\n\n        notCalledWithMatch: function notCalledWithMatch() {\n            return !this.calledWithMatch.apply(this, arguments);\n        },\n\n        returned: function returned(value) {\n            return sinon.deepEqual(value, this.returnValue);\n        },\n\n        threw: function threw(error) {\n            if (typeof error === \"undefined\" || !this.exception) {\n                return !!this.exception;\n            }\n\n            return this.exception === error || this.exception.name === error;\n        },\n\n        calledWithNew: function calledWithNew(thisValue) {\n            return this.thisValue instanceof this.proxy;\n        },\n\n        calledBefore: function (other) {\n            return this.callId < other.callId;\n        },\n\n        calledAfter: function (other) {\n            return this.callId > other.callId;\n        },\n\n        callArg: function (pos) {\n            this.args[pos]();\n        },\n\n        callArgOn: function (pos, thisValue) {\n            this.args[pos].apply(thisValue);\n        },\n\n        callArgWith: function (pos) {\n            this.callArgOnWith.apply(this, [pos, null].concat(slice.call(arguments, 1)));\n        },\n\n        callArgOnWith: function (pos, thisValue) {\n            var args = slice.call(arguments, 2);\n            this.args[pos].apply(thisValue, args);\n        },\n\n        \"yield\": function () {\n            this.yieldOn.apply(this, [null].concat(slice.call(arguments, 0)));\n        },\n\n        yieldOn: function (thisValue) {\n            var args = this.args;\n            for (var i = 0, l = args.length; i < l; ++i) {\n                if (typeof args[i] === \"function\") {\n                    args[i].apply(thisValue, slice.call(arguments, 1));\n                    return;\n                }\n            }\n            throwYieldError(this.proxy, \" cannot yield since no callback was passed.\", args);\n        },\n\n        yieldTo: function (prop) {\n            this.yieldToOn.apply(this, [prop, null].concat(slice.call(arguments, 1)));\n        },\n\n        yieldToOn: function (prop, thisValue) {\n            var args = this.args;\n            for (var i = 0, l = args.length; i < l; ++i) {\n                if (args[i] && typeof args[i][prop] === \"function\") {\n                    args[i][prop].apply(thisValue, slice.call(arguments, 2));\n                    return;\n                }\n            }\n            throwYieldError(this.proxy, \" cannot yield to '\" + prop +\n                \"' since no callback was passed.\", args);\n        },\n\n        toString: function () {\n            var callStr = this.proxy.toString() + \"(\";\n            var args = [];\n\n            for (var i = 0, l = this.args.length; i < l; ++i) {\n                args.push(sinon.format(this.args[i]));\n            }\n\n            callStr = callStr + args.join(\", \") + \")\";\n\n            if (typeof this.returnValue != \"undefined\") {\n                callStr += \" => \" + sinon.format(this.returnValue);\n            }\n\n            if (this.exception) {\n                callStr += \" !\" + this.exception.name;\n\n                if (this.exception.message) {\n                    callStr += \"(\" + this.exception.message + \")\";\n                }\n            }\n\n            return callStr;\n        }\n    };\n\n    callProto.invokeCallback = callProto.yield;\n\n    function createSpyCall(spy, thisValue, args, returnValue, exception, id) {\n        if (typeof id !== \"number\") {\n            throw new TypeError(\"Call id is not a number\");\n        }\n        var proxyCall = sinon.create(callProto);\n        proxyCall.proxy = spy;\n        proxyCall.thisValue = thisValue;\n        proxyCall.args = args;\n        proxyCall.returnValue = returnValue;\n        proxyCall.exception = exception;\n        proxyCall.callId = id;\n\n        return proxyCall;\n    };\n    createSpyCall.toString = callProto.toString; // used by mocks\n\n    sinon.spyCall = createSpyCall;\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n  * @depend ../sinon.js\n  */\n/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n/*global module, require, sinon*/\n/**\n  * Spy functions\n  *\n  * @author Christian Johansen (christian@cjohansen.no)\n  * @license BSD\n  *\n  * Copyright (c) 2010-2013 Christian Johansen\n  */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n    var push = Array.prototype.push;\n    var slice = Array.prototype.slice;\n    var callId = 0;\n\n    function spy(object, property) {\n        if (!property && typeof object == \"function\") {\n            return spy.create(object);\n        }\n\n        if (!object && !property) {\n            return spy.create(function () { });\n        }\n\n        var method = object[property];\n        return sinon.wrapMethod(object, property, spy.create(method));\n    }\n\n    function matchingFake(fakes, args, strict) {\n        if (!fakes) {\n            return;\n        }\n\n        var alen = args.length;\n\n        for (var i = 0, l = fakes.length; i < l; i++) {\n            if (fakes[i].matches(args, strict)) {\n                return fakes[i];\n            }\n        }\n    }\n\n    function incrementCallCount() {\n        this.called = true;\n        this.callCount += 1;\n        this.notCalled = false;\n        this.calledOnce = this.callCount == 1;\n        this.calledTwice = this.callCount == 2;\n        this.calledThrice = this.callCount == 3;\n    }\n\n    function createCallProperties() {\n        this.firstCall = this.getCall(0);\n        this.secondCall = this.getCall(1);\n        this.thirdCall = this.getCall(2);\n        this.lastCall = this.getCall(this.callCount - 1);\n    }\n\n    var vars = \"a,b,c,d,e,f,g,h,i,j,k,l\";\n    function createProxy(func) {\n        // Retain the function length:\n        var p;\n        if (func.length) {\n            eval(\"p = (function proxy(\" + vars.substring(0, func.length * 2 - 1) +\n                \") { return p.invoke(func, this, slice.call(arguments)); });\");\n        }\n        else {\n            p = function proxy() {\n                return p.invoke(func, this, slice.call(arguments));\n            };\n        }\n        return p;\n    }\n\n    var uuid = 0;\n\n    // Public API\n    var spyApi = {\n        reset: function () {\n            this.called = false;\n            this.notCalled = true;\n            this.calledOnce = false;\n            this.calledTwice = false;\n            this.calledThrice = false;\n            this.callCount = 0;\n            this.firstCall = null;\n            this.secondCall = null;\n            this.thirdCall = null;\n            this.lastCall = null;\n            this.args = [];\n            this.returnValues = [];\n            this.thisValues = [];\n            this.exceptions = [];\n            this.callIds = [];\n            if (this.fakes) {\n                for (var i = 0; i < this.fakes.length; i++) {\n                    this.fakes[i].reset();\n                }\n            }\n        },\n\n        create: function create(func) {\n            var name;\n\n            if (typeof func != \"function\") {\n                func = function () { };\n            } else {\n                name = sinon.functionName(func);\n            }\n\n            var proxy = createProxy(func);\n\n            sinon.extend(proxy, spy);\n            delete proxy.create;\n            sinon.extend(proxy, func);\n\n            proxy.reset();\n            proxy.prototype = func.prototype;\n            proxy.displayName = name || \"spy\";\n            proxy.toString = sinon.functionToString;\n            proxy._create = sinon.spy.create;\n            proxy.id = \"spy#\" + uuid++;\n\n            return proxy;\n        },\n\n        invoke: function invoke(func, thisValue, args) {\n            var matching = matchingFake(this.fakes, args);\n            var exception, returnValue;\n\n            incrementCallCount.call(this);\n            push.call(this.thisValues, thisValue);\n            push.call(this.args, args);\n            push.call(this.callIds, callId++);\n\n            try {\n                if (matching) {\n                    returnValue = matching.invoke(func, thisValue, args);\n                } else {\n                    returnValue = (this.func || func).apply(thisValue, args);\n                }\n            } catch (e) {\n                push.call(this.returnValues, undefined);\n                exception = e;\n                throw e;\n            } finally {\n                push.call(this.exceptions, exception);\n            }\n\n            push.call(this.returnValues, returnValue);\n\n            createCallProperties.call(this);\n\n            return returnValue;\n        },\n\n        getCall: function getCall(i) {\n            if (i < 0 || i >= this.callCount) {\n                return null;\n            }\n\n            return sinon.spyCall(this, this.thisValues[i], this.args[i],\n                                    this.returnValues[i], this.exceptions[i],\n                                    this.callIds[i]);\n        },\n\n        calledBefore: function calledBefore(spyFn) {\n            if (!this.called) {\n                return false;\n            }\n\n            if (!spyFn.called) {\n                return true;\n            }\n\n            return this.callIds[0] < spyFn.callIds[spyFn.callIds.length - 1];\n        },\n\n        calledAfter: function calledAfter(spyFn) {\n            if (!this.called || !spyFn.called) {\n                return false;\n            }\n\n            return this.callIds[this.callCount - 1] > spyFn.callIds[spyFn.callCount - 1];\n        },\n\n        withArgs: function () {\n            var args = slice.call(arguments);\n\n            if (this.fakes) {\n                var match = matchingFake(this.fakes, args, true);\n\n                if (match) {\n                    return match;\n                }\n            } else {\n                this.fakes = [];\n            }\n\n            var original = this;\n            var fake = this._create();\n            fake.matchingAguments = args;\n            push.call(this.fakes, fake);\n\n            fake.withArgs = function () {\n                return original.withArgs.apply(original, arguments);\n            };\n\n            for (var i = 0; i < this.args.length; i++) {\n                if (fake.matches(this.args[i])) {\n                    incrementCallCount.call(fake);\n                    push.call(fake.thisValues, this.thisValues[i]);\n                    push.call(fake.args, this.args[i]);\n                    push.call(fake.returnValues, this.returnValues[i]);\n                    push.call(fake.exceptions, this.exceptions[i]);\n                    push.call(fake.callIds, this.callIds[i]);\n                }\n            }\n            createCallProperties.call(fake);\n\n            return fake;\n        },\n\n        matches: function (args, strict) {\n            var margs = this.matchingAguments;\n\n            if (margs.length <= args.length &&\n                sinon.deepEqual(margs, args.slice(0, margs.length))) {\n                return !strict || margs.length == args.length;\n            }\n        },\n\n        printf: function (format) {\n            var spy = this;\n            var args = slice.call(arguments, 1);\n            var formatter;\n\n            return (format || \"\").replace(/%(.)/g, function (match, specifyer) {\n                formatter = spyApi.formatters[specifyer];\n\n                if (typeof formatter == \"function\") {\n                    return formatter.call(null, spy, args);\n                } else if (!isNaN(parseInt(specifyer), 10)) {\n                    return sinon.format(args[specifyer - 1]);\n                }\n\n                return \"%\" + specifyer;\n            });\n        }\n    };\n\n    function delegateToCalls(method, matchAny, actual, notCalled) {\n        spyApi[method] = function () {\n            if (!this.called) {\n                if (notCalled) {\n                    return notCalled.apply(this, arguments);\n                }\n                return false;\n            }\n\n            var currentCall;\n            var matches = 0;\n\n            for (var i = 0, l = this.callCount; i < l; i += 1) {\n                currentCall = this.getCall(i);\n\n                if (currentCall[actual || method].apply(currentCall, arguments)) {\n                    matches += 1;\n\n                    if (matchAny) {\n                        return true;\n                    }\n                }\n            }\n\n            return matches === this.callCount;\n        };\n    }\n\n    delegateToCalls(\"calledOn\", true);\n    delegateToCalls(\"alwaysCalledOn\", false, \"calledOn\");\n    delegateToCalls(\"calledWith\", true);\n    delegateToCalls(\"calledWithMatch\", true);\n    delegateToCalls(\"alwaysCalledWith\", false, \"calledWith\");\n    delegateToCalls(\"alwaysCalledWithMatch\", false, \"calledWithMatch\");\n    delegateToCalls(\"calledWithExactly\", true);\n    delegateToCalls(\"alwaysCalledWithExactly\", false, \"calledWithExactly\");\n    delegateToCalls(\"neverCalledWith\", false, \"notCalledWith\",\n        function () { return true; });\n    delegateToCalls(\"neverCalledWithMatch\", false, \"notCalledWithMatch\",\n        function () { return true; });\n    delegateToCalls(\"threw\", true);\n    delegateToCalls(\"alwaysThrew\", false, \"threw\");\n    delegateToCalls(\"returned\", true);\n    delegateToCalls(\"alwaysReturned\", false, \"returned\");\n    delegateToCalls(\"calledWithNew\", true);\n    delegateToCalls(\"alwaysCalledWithNew\", false, \"calledWithNew\");\n    delegateToCalls(\"callArg\", false, \"callArgWith\", function () {\n        throw new Error(this.toString() + \" cannot call arg since it was not yet invoked.\");\n    });\n    spyApi.callArgWith = spyApi.callArg;\n    delegateToCalls(\"callArgOn\", false, \"callArgOnWith\", function () {\n        throw new Error(this.toString() + \" cannot call arg since it was not yet invoked.\");\n    });\n    spyApi.callArgOnWith = spyApi.callArgOn;\n    delegateToCalls(\"yield\", false, \"yield\", function () {\n        throw new Error(this.toString() + \" cannot yield since it was not yet invoked.\");\n    });\n    // \"invokeCallback\" is an alias for \"yield\" since \"yield\" is invalid in strict mode.\n    spyApi.invokeCallback = spyApi.yield;\n    delegateToCalls(\"yieldOn\", false, \"yieldOn\", function () {\n        throw new Error(this.toString() + \" cannot yield since it was not yet invoked.\");\n    });\n    delegateToCalls(\"yieldTo\", false, \"yieldTo\", function (property) {\n        throw new Error(this.toString() + \" cannot yield to '\" + property +\n            \"' since it was not yet invoked.\");\n    });\n    delegateToCalls(\"yieldToOn\", false, \"yieldToOn\", function (property) {\n        throw new Error(this.toString() + \" cannot yield to '\" + property +\n            \"' since it was not yet invoked.\");\n    });\n\n    spyApi.formatters = {\n        \"c\": function (spy) {\n            return sinon.timesInWords(spy.callCount);\n        },\n\n        \"n\": function (spy) {\n            return spy.toString();\n        },\n\n        \"C\": function (spy) {\n            var calls = [];\n\n            for (var i = 0, l = spy.callCount; i < l; ++i) {\n                var stringifiedCall = \"    \" + spy.getCall(i).toString();\n                if (/\\n/.test(calls[i - 1])) {\n                    stringifiedCall = \"\\n\" + stringifiedCall;\n                }\n                push.call(calls, stringifiedCall);\n            }\n\n            return calls.length > 0 ? \"\\n\" + calls.join(\"\\n\") : \"\";\n        },\n\n        \"t\": function (spy) {\n            var objects = [];\n\n            for (var i = 0, l = spy.callCount; i < l; ++i) {\n                push.call(objects, sinon.format(spy.thisValues[i]));\n            }\n\n            return objects.join(\", \");\n        },\n\n        \"*\": function (spy, args) {\n            var formatted = [];\n\n            for (var i = 0, l = args.length; i < l; ++i) {\n                push.call(formatted, sinon.format(args[i]));\n            }\n\n            return formatted.join(\", \");\n        }\n    };\n\n    sinon.extend(spy, spyApi);\n\n    spy.spyCall = sinon.spyCall;\n\n    if (commonJSModule) {\n        module.exports = spy;\n    } else {\n        sinon.spy = spy;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n * @depend ../sinon.js\n * @depend spy.js\n */\n/*jslint eqeqeq: false, onevar: false*/\n/*global module, require, sinon*/\n/**\n * Stub functions\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon) {\n        return;\n    }\n\n    function stub(object, property, func) {\n        if (!!func && typeof func != \"function\") {\n            throw new TypeError(\"Custom stub should be function\");\n        }\n\n        var wrapper;\n\n        if (func) {\n            wrapper = sinon.spy && sinon.spy.create ? sinon.spy.create(func) : func;\n        } else {\n            wrapper = stub.create();\n        }\n\n        if (!object && !property) {\n            return sinon.stub.create();\n        }\n\n        if (!property && !!object && typeof object == \"object\") {\n            for (var prop in object) {\n                if (typeof object[prop] === \"function\") {\n                    stub(object, prop);\n                }\n            }\n\n            return object;\n        }\n\n        return sinon.wrapMethod(object, property, wrapper);\n    }\n\n    function getChangingValue(stub, property) {\n        var index = stub.callCount - 1;\n        var values = stub[property];\n        var prop = index in values ? values[index] : values[values.length - 1];\n        stub[property + \"Last\"] = prop;\n\n        return prop;\n    }\n\n    function getCallback(stub, args) {\n        var callArgAt = getChangingValue(stub, \"callArgAts\");\n\n        if (callArgAt < 0) {\n            var callArgProp = getChangingValue(stub, \"callArgProps\");\n\n            for (var i = 0, l = args.length; i < l; ++i) {\n                if (!callArgProp && typeof args[i] == \"function\") {\n                    return args[i];\n                }\n\n                if (callArgProp && args[i] &&\n                    typeof args[i][callArgProp] == \"function\") {\n                    return args[i][callArgProp];\n                }\n            }\n\n            return null;\n        }\n\n        return args[callArgAt];\n    }\n\n    var join = Array.prototype.join;\n\n    function getCallbackError(stub, func, args) {\n        if (stub.callArgAtsLast < 0) {\n            var msg;\n\n            if (stub.callArgPropsLast) {\n                msg = sinon.functionName(stub) +\n                    \" expected to yield to '\" + stub.callArgPropsLast +\n                    \"', but no object with such a property was passed.\"\n            } else {\n                msg = sinon.functionName(stub) +\n                            \" expected to yield, but no callback was passed.\"\n            }\n\n            if (args.length > 0) {\n                msg += \" Received [\" + join.call(args, \", \") + \"]\";\n            }\n\n            return msg;\n        }\n\n        return \"argument at index \" + stub.callArgAtsLast + \" is not a function: \" + func;\n    }\n\n    var nextTick = (function () {\n        if (typeof process === \"object\" && typeof process.nextTick === \"function\") {\n            return process.nextTick;\n        } else if (typeof setImmediate === \"function\") {\n            return setImmediate;\n        } else {\n            return function (callback) {\n                setTimeout(callback, 0);\n            };\n        }\n    })();\n\n    function callCallback(stub, args) {\n        if (stub.callArgAts.length > 0) {\n            var func = getCallback(stub, args);\n\n            if (typeof func != \"function\") {\n                throw new TypeError(getCallbackError(stub, func, args));\n            }\n\n            var callbackArguments = getChangingValue(stub, \"callbackArguments\");\n            var callbackContext = getChangingValue(stub, \"callbackContexts\");\n\n            if (stub.callbackAsync) {\n                nextTick(function() {\n                    func.apply(callbackContext, callbackArguments);\n                });\n            } else {\n                func.apply(callbackContext, callbackArguments);\n            }\n        }\n    }\n\n    var uuid = 0;\n\n    sinon.extend(stub, (function () {\n        var slice = Array.prototype.slice, proto;\n\n        function throwsException(error, message) {\n            if (typeof error == \"string\") {\n                this.exception = new Error(message || \"\");\n                this.exception.name = error;\n            } else if (!error) {\n                this.exception = new Error(\"Error\");\n            } else {\n                this.exception = error;\n            }\n\n            return this;\n        }\n\n        proto = {\n            create: function create() {\n                var functionStub = function () {\n\n                    callCallback(functionStub, arguments);\n\n                    if (functionStub.exception) {\n                        throw functionStub.exception;\n                    } else if (typeof functionStub.returnArgAt == 'number') {\n                        return arguments[functionStub.returnArgAt];\n                    } else if (functionStub.returnThis) {\n                        return this;\n                    }\n                    return functionStub.returnValue;\n                };\n\n                functionStub.id = \"stub#\" + uuid++;\n                var orig = functionStub;\n                functionStub = sinon.spy.create(functionStub);\n                functionStub.func = orig;\n\n                functionStub.callArgAts = [];\n                functionStub.callbackArguments = [];\n                functionStub.callbackContexts = [];\n                functionStub.callArgProps = [];\n\n                sinon.extend(functionStub, stub);\n                functionStub._create = sinon.stub.create;\n                functionStub.displayName = \"stub\";\n                functionStub.toString = sinon.functionToString;\n\n                return functionStub;\n            },\n\n            resetBehavior: function () {\n                var i;\n\n                this.callArgAts = [];\n                this.callbackArguments = [];\n                this.callbackContexts = [];\n                this.callArgProps = [];\n\n                delete this.returnValue;\n                delete this.returnArgAt;\n                this.returnThis = false;\n\n                if (this.fakes) {\n                    for (i = 0; i < this.fakes.length; i++) {\n                        this.fakes[i].resetBehavior();\n                    }\n                }\n            },\n\n            returns: function returns(value) {\n                this.returnValue = value;\n\n                return this;\n            },\n\n            returnsArg: function returnsArg(pos) {\n                if (typeof pos != \"number\") {\n                    throw new TypeError(\"argument index is not number\");\n                }\n\n                this.returnArgAt = pos;\n\n                return this;\n            },\n\n            returnsThis: function returnsThis() {\n                this.returnThis = true;\n\n                return this;\n            },\n\n            \"throws\": throwsException,\n            throwsException: throwsException,\n\n            callsArg: function callsArg(pos) {\n                if (typeof pos != \"number\") {\n                    throw new TypeError(\"argument index is not number\");\n                }\n\n                this.callArgAts.push(pos);\n                this.callbackArguments.push([]);\n                this.callbackContexts.push(undefined);\n                this.callArgProps.push(undefined);\n\n                return this;\n            },\n\n            callsArgOn: function callsArgOn(pos, context) {\n                if (typeof pos != \"number\") {\n                    throw new TypeError(\"argument index is not number\");\n                }\n                if (typeof context != \"object\") {\n                    throw new TypeError(\"argument context is not an object\");\n                }\n\n                this.callArgAts.push(pos);\n                this.callbackArguments.push([]);\n                this.callbackContexts.push(context);\n                this.callArgProps.push(undefined);\n\n                return this;\n            },\n\n            callsArgWith: function callsArgWith(pos) {\n                if (typeof pos != \"number\") {\n                    throw new TypeError(\"argument index is not number\");\n                }\n\n                this.callArgAts.push(pos);\n                this.callbackArguments.push(slice.call(arguments, 1));\n                this.callbackContexts.push(undefined);\n                this.callArgProps.push(undefined);\n\n                return this;\n            },\n\n            callsArgOnWith: function callsArgWith(pos, context) {\n                if (typeof pos != \"number\") {\n                    throw new TypeError(\"argument index is not number\");\n                }\n                if (typeof context != \"object\") {\n                    throw new TypeError(\"argument context is not an object\");\n                }\n\n                this.callArgAts.push(pos);\n                this.callbackArguments.push(slice.call(arguments, 2));\n                this.callbackContexts.push(context);\n                this.callArgProps.push(undefined);\n\n                return this;\n            },\n\n            yields: function () {\n                this.callArgAts.push(-1);\n                this.callbackArguments.push(slice.call(arguments, 0));\n                this.callbackContexts.push(undefined);\n                this.callArgProps.push(undefined);\n\n                return this;\n            },\n\n            yieldsOn: function (context) {\n                if (typeof context != \"object\") {\n                    throw new TypeError(\"argument context is not an object\");\n                }\n\n                this.callArgAts.push(-1);\n                this.callbackArguments.push(slice.call(arguments, 1));\n                this.callbackContexts.push(context);\n                this.callArgProps.push(undefined);\n\n                return this;\n            },\n\n            yieldsTo: function (prop) {\n                this.callArgAts.push(-1);\n                this.callbackArguments.push(slice.call(arguments, 1));\n                this.callbackContexts.push(undefined);\n                this.callArgProps.push(prop);\n\n                return this;\n            },\n\n            yieldsToOn: function (prop, context) {\n                if (typeof context != \"object\") {\n                    throw new TypeError(\"argument context is not an object\");\n                }\n\n                this.callArgAts.push(-1);\n                this.callbackArguments.push(slice.call(arguments, 2));\n                this.callbackContexts.push(context);\n                this.callArgProps.push(prop);\n\n                return this;\n            }\n        };\n\n        // create asynchronous versions of callsArg* and yields* methods\n        for (var method in proto) {\n            // need to avoid creating anotherasync versions of the newly added async methods\n            if (proto.hasOwnProperty(method) &&\n                method.match(/^(callsArg|yields|thenYields$)/) &&\n                !method.match(/Async/)) {\n                proto[method + 'Async'] = (function (syncFnName) {\n                    return function () {\n                        this.callbackAsync = true;\n                        return this[syncFnName].apply(this, arguments);\n                    };\n                })(method);\n            }\n        }\n\n        return proto;\n\n    }()));\n\n    if (commonJSModule) {\n        module.exports = stub;\n    } else {\n        sinon.stub = stub;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n * @depend ../sinon.js\n * @depend stub.js\n */\n/*jslint eqeqeq: false, onevar: false, nomen: false*/\n/*global module, require, sinon*/\n/**\n * Mock functions.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n    var push = [].push;\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon) {\n        return;\n    }\n\n    function mock(object) {\n        if (!object) {\n            return sinon.expectation.create(\"Anonymous mock\");\n        }\n\n        return mock.create(object);\n    }\n\n    sinon.mock = mock;\n\n    sinon.extend(mock, (function () {\n        function each(collection, callback) {\n            if (!collection) {\n                return;\n            }\n\n            for (var i = 0, l = collection.length; i < l; i += 1) {\n                callback(collection[i]);\n            }\n        }\n\n        return {\n            create: function create(object) {\n                if (!object) {\n                    throw new TypeError(\"object is null\");\n                }\n\n                var mockObject = sinon.extend({}, mock);\n                mockObject.object = object;\n                delete mockObject.create;\n\n                return mockObject;\n            },\n\n            expects: function expects(method) {\n                if (!method) {\n                    throw new TypeError(\"method is falsy\");\n                }\n\n                if (!this.expectations) {\n                    this.expectations = {};\n                    this.proxies = [];\n                }\n\n                if (!this.expectations[method]) {\n                    this.expectations[method] = [];\n                    var mockObject = this;\n\n                    sinon.wrapMethod(this.object, method, function () {\n                        return mockObject.invokeMethod(method, this, arguments);\n                    });\n\n                    push.call(this.proxies, method);\n                }\n\n                var expectation = sinon.expectation.create(method);\n                push.call(this.expectations[method], expectation);\n\n                return expectation;\n            },\n\n            restore: function restore() {\n                var object = this.object;\n\n                each(this.proxies, function (proxy) {\n                    if (typeof object[proxy].restore == \"function\") {\n                        object[proxy].restore();\n                    }\n                });\n            },\n\n            verify: function verify() {\n                var expectations = this.expectations || {};\n                var messages = [], met = [];\n\n                each(this.proxies, function (proxy) {\n                    each(expectations[proxy], function (expectation) {\n                        if (!expectation.met()) {\n                            push.call(messages, expectation.toString());\n                        } else {\n                            push.call(met, expectation.toString());\n                        }\n                    });\n                });\n\n                this.restore();\n\n                if (messages.length > 0) {\n                    sinon.expectation.fail(messages.concat(met).join(\"\\n\"));\n                } else {\n                    sinon.expectation.pass(messages.concat(met).join(\"\\n\"));\n                }\n\n                return true;\n            },\n\n            invokeMethod: function invokeMethod(method, thisValue, args) {\n                var expectations = this.expectations && this.expectations[method];\n                var length = expectations && expectations.length || 0, i;\n\n                for (i = 0; i < length; i += 1) {\n                    if (!expectations[i].met() &&\n                        expectations[i].allowsCall(thisValue, args)) {\n                        return expectations[i].apply(thisValue, args);\n                    }\n                }\n\n                var messages = [], available, exhausted = 0;\n\n                for (i = 0; i < length; i += 1) {\n                    if (expectations[i].allowsCall(thisValue, args)) {\n                        available = available || expectations[i];\n                    } else {\n                        exhausted += 1;\n                    }\n                    push.call(messages, \"    \" + expectations[i].toString());\n                }\n\n                if (exhausted === 0) {\n                    return available.apply(thisValue, args);\n                }\n\n                messages.unshift(\"Unexpected call: \" + sinon.spyCall.toString.call({\n                    proxy: method,\n                    args: args\n                }));\n\n                sinon.expectation.fail(messages.join(\"\\n\"));\n            }\n        };\n    }()));\n\n    var times = sinon.timesInWords;\n\n    sinon.expectation = (function () {\n        var slice = Array.prototype.slice;\n        var _invoke = sinon.spy.invoke;\n\n        function callCountInWords(callCount) {\n            if (callCount == 0) {\n                return \"never called\";\n            } else {\n                return \"called \" + times(callCount);\n            }\n        }\n\n        function expectedCallCountInWords(expectation) {\n            var min = expectation.minCalls;\n            var max = expectation.maxCalls;\n\n            if (typeof min == \"number\" && typeof max == \"number\") {\n                var str = times(min);\n\n                if (min != max) {\n                    str = \"at least \" + str + \" and at most \" + times(max);\n                }\n\n                return str;\n            }\n\n            if (typeof min == \"number\") {\n                return \"at least \" + times(min);\n            }\n\n            return \"at most \" + times(max);\n        }\n\n        function receivedMinCalls(expectation) {\n            var hasMinLimit = typeof expectation.minCalls == \"number\";\n            return !hasMinLimit || expectation.callCount >= expectation.minCalls;\n        }\n\n        function receivedMaxCalls(expectation) {\n            if (typeof expectation.maxCalls != \"number\") {\n                return false;\n            }\n\n            return expectation.callCount == expectation.maxCalls;\n        }\n\n        return {\n            minCalls: 1,\n            maxCalls: 1,\n\n            create: function create(methodName) {\n                var expectation = sinon.extend(sinon.stub.create(), sinon.expectation);\n                delete expectation.create;\n                expectation.method = methodName;\n\n                return expectation;\n            },\n\n            invoke: function invoke(func, thisValue, args) {\n                this.verifyCallAllowed(thisValue, args);\n\n                return _invoke.apply(this, arguments);\n            },\n\n            atLeast: function atLeast(num) {\n                if (typeof num != \"number\") {\n                    throw new TypeError(\"'\" + num + \"' is not number\");\n                }\n\n                if (!this.limitsSet) {\n                    this.maxCalls = null;\n                    this.limitsSet = true;\n                }\n\n                this.minCalls = num;\n\n                return this;\n            },\n\n            atMost: function atMost(num) {\n                if (typeof num != \"number\") {\n                    throw new TypeError(\"'\" + num + \"' is not number\");\n                }\n\n                if (!this.limitsSet) {\n                    this.minCalls = null;\n                    this.limitsSet = true;\n                }\n\n                this.maxCalls = num;\n\n                return this;\n            },\n\n            never: function never() {\n                return this.exactly(0);\n            },\n\n            once: function once() {\n                return this.exactly(1);\n            },\n\n            twice: function twice() {\n                return this.exactly(2);\n            },\n\n            thrice: function thrice() {\n                return this.exactly(3);\n            },\n\n            exactly: function exactly(num) {\n                if (typeof num != \"number\") {\n                    throw new TypeError(\"'\" + num + \"' is not a number\");\n                }\n\n                this.atLeast(num);\n                return this.atMost(num);\n            },\n\n            met: function met() {\n                return !this.failed && receivedMinCalls(this);\n            },\n\n            verifyCallAllowed: function verifyCallAllowed(thisValue, args) {\n                if (receivedMaxCalls(this)) {\n                    this.failed = true;\n                    sinon.expectation.fail(this.method + \" already called \" + times(this.maxCalls));\n                }\n\n                if (\"expectedThis\" in this && this.expectedThis !== thisValue) {\n                    sinon.expectation.fail(this.method + \" called with \" + thisValue + \" as thisValue, expected \" +\n                        this.expectedThis);\n                }\n\n                if (!(\"expectedArguments\" in this)) {\n                    return;\n                }\n\n                if (!args) {\n                    sinon.expectation.fail(this.method + \" received no arguments, expected \" +\n                        sinon.format(this.expectedArguments));\n                }\n\n                if (args.length < this.expectedArguments.length) {\n                    sinon.expectation.fail(this.method + \" received too few arguments (\" + sinon.format(args) +\n                        \"), expected \" + sinon.format(this.expectedArguments));\n                }\n\n                if (this.expectsExactArgCount &&\n                    args.length != this.expectedArguments.length) {\n                    sinon.expectation.fail(this.method + \" received too many arguments (\" + sinon.format(args) +\n                        \"), expected \" + sinon.format(this.expectedArguments));\n                }\n\n                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {\n                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {\n                        sinon.expectation.fail(this.method + \" received wrong arguments \" + sinon.format(args) +\n                            \", expected \" + sinon.format(this.expectedArguments));\n                    }\n                }\n            },\n\n            allowsCall: function allowsCall(thisValue, args) {\n                if (this.met() && receivedMaxCalls(this)) {\n                    return false;\n                }\n\n                if (\"expectedThis\" in this && this.expectedThis !== thisValue) {\n                    return false;\n                }\n\n                if (!(\"expectedArguments\" in this)) {\n                    return true;\n                }\n\n                args = args || [];\n\n                if (args.length < this.expectedArguments.length) {\n                    return false;\n                }\n\n                if (this.expectsExactArgCount &&\n                    args.length != this.expectedArguments.length) {\n                    return false;\n                }\n\n                for (var i = 0, l = this.expectedArguments.length; i < l; i += 1) {\n                    if (!sinon.deepEqual(this.expectedArguments[i], args[i])) {\n                        return false;\n                    }\n                }\n\n                return true;\n            },\n\n            withArgs: function withArgs() {\n                this.expectedArguments = slice.call(arguments);\n                return this;\n            },\n\n            withExactArgs: function withExactArgs() {\n                this.withArgs.apply(this, arguments);\n                this.expectsExactArgCount = true;\n                return this;\n            },\n\n            on: function on(thisValue) {\n                this.expectedThis = thisValue;\n                return this;\n            },\n\n            toString: function () {\n                var args = (this.expectedArguments || []).slice();\n\n                if (!this.expectsExactArgCount) {\n                    push.call(args, \"[...]\");\n                }\n\n                var callStr = sinon.spyCall.toString.call({\n                    proxy: this.method || \"anonymous mock expectation\",\n                    args: args\n                });\n\n                var message = callStr.replace(\", [...\", \"[, ...\") + \" \" +\n                    expectedCallCountInWords(this);\n\n                if (this.met()) {\n                    return \"Expectation met: \" + message;\n                }\n\n                return \"Expected \" + message + \" (\" +\n                    callCountInWords(this.callCount) + \")\";\n            },\n\n            verify: function verify() {\n                if (!this.met()) {\n                    sinon.expectation.fail(this.toString());\n                } else {\n                    sinon.expectation.pass(this.toString());\n                }\n\n                return true;\n            },\n\n            pass: function(message) {\n              sinon.assert.pass(message);\n            },\n            fail: function (message) {\n                var exception = new Error(message);\n                exception.name = \"ExpectationError\";\n\n                throw exception;\n            }\n        };\n    }());\n\n    if (commonJSModule) {\n        module.exports = mock;\n    } else {\n        sinon.mock = mock;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n * @depend ../sinon.js\n * @depend stub.js\n * @depend mock.js\n */\n/*jslint eqeqeq: false, onevar: false, forin: true*/\n/*global module, require, sinon*/\n/**\n * Collections of stubs, spies and mocks.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n    var push = [].push;\n    var hasOwnProperty = Object.prototype.hasOwnProperty;\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon) {\n        return;\n    }\n\n    function getFakes(fakeCollection) {\n        if (!fakeCollection.fakes) {\n            fakeCollection.fakes = [];\n        }\n\n        return fakeCollection.fakes;\n    }\n\n    function each(fakeCollection, method) {\n        var fakes = getFakes(fakeCollection);\n\n        for (var i = 0, l = fakes.length; i < l; i += 1) {\n            if (typeof fakes[i][method] == \"function\") {\n                fakes[i][method]();\n            }\n        }\n    }\n\n    function compact(fakeCollection) {\n        var fakes = getFakes(fakeCollection);\n        var i = 0;\n        while (i < fakes.length) {\n          fakes.splice(i, 1);\n        }\n    }\n\n    var collection = {\n        verify: function resolve() {\n            each(this, \"verify\");\n        },\n\n        restore: function restore() {\n            each(this, \"restore\");\n            compact(this);\n        },\n\n        verifyAndRestore: function verifyAndRestore() {\n            var exception;\n\n            try {\n                this.verify();\n            } catch (e) {\n                exception = e;\n            }\n\n            this.restore();\n\n            if (exception) {\n                throw exception;\n            }\n        },\n\n        add: function add(fake) {\n            push.call(getFakes(this), fake);\n            return fake;\n        },\n\n        spy: function spy() {\n            return this.add(sinon.spy.apply(sinon, arguments));\n        },\n\n        stub: function stub(object, property, value) {\n            if (property) {\n                var original = object[property];\n\n                if (typeof original != \"function\") {\n                    if (!hasOwnProperty.call(object, property)) {\n                        throw new TypeError(\"Cannot stub non-existent own property \" + property);\n                    }\n\n                    object[property] = value;\n\n                    return this.add({\n                        restore: function () {\n                            object[property] = original;\n                        }\n                    });\n                }\n            }\n            if (!property && !!object && typeof object == \"object\") {\n                var stubbedObj = sinon.stub.apply(sinon, arguments);\n\n                for (var prop in stubbedObj) {\n                    if (typeof stubbedObj[prop] === \"function\") {\n                        this.add(stubbedObj[prop]);\n                    }\n                }\n\n                return stubbedObj;\n            }\n\n            return this.add(sinon.stub.apply(sinon, arguments));\n        },\n\n        mock: function mock() {\n            return this.add(sinon.mock.apply(sinon, arguments));\n        },\n\n        inject: function inject(obj) {\n            var col = this;\n\n            obj.spy = function () {\n                return col.spy.apply(col, arguments);\n            };\n\n            obj.stub = function () {\n                return col.stub.apply(col, arguments);\n            };\n\n            obj.mock = function () {\n                return col.mock.apply(col, arguments);\n            };\n\n            return obj;\n        }\n    };\n\n    if (commonJSModule) {\n        module.exports = collection;\n    } else {\n        sinon.collection = collection;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/*jslint eqeqeq: false, plusplus: false, evil: true, onevar: false, browser: true, forin: false*/\n/*global module, require, window*/\n/**\n * Fake timer API\n * setTimeout\n * setInterval\n * clearTimeout\n * clearInterval\n * tick\n * reset\n * Date\n *\n * Inspired by jsUnitMockTimeOut from JsUnit\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\nif (typeof sinon == \"undefined\") {\n    var sinon = {};\n}\n\n(function (global) {\n    var id = 1;\n\n    function addTimer(args, recurring) {\n        if (args.length === 0) {\n            throw new Error(\"Function requires at least 1 parameter\");\n        }\n\n        var toId = id++;\n        var delay = args[1] || 0;\n\n        if (!this.timeouts) {\n            this.timeouts = {};\n        }\n\n        this.timeouts[toId] = {\n            id: toId,\n            func: args[0],\n            callAt: this.now + delay,\n            invokeArgs: Array.prototype.slice.call(args, 2)\n        };\n\n        if (recurring === true) {\n            this.timeouts[toId].interval = delay;\n        }\n\n        return toId;\n    }\n\n    function parseTime(str) {\n        if (!str) {\n            return 0;\n        }\n\n        var strings = str.split(\":\");\n        var l = strings.length, i = l;\n        var ms = 0, parsed;\n\n        if (l > 3 || !/^(\\d\\d:){0,2}\\d\\d?$/.test(str)) {\n            throw new Error(\"tick only understands numbers and 'h:m:s'\");\n        }\n\n        while (i--) {\n            parsed = parseInt(strings[i], 10);\n\n            if (parsed >= 60) {\n                throw new Error(\"Invalid time \" + str);\n            }\n\n            ms += parsed * Math.pow(60, (l - i - 1));\n        }\n\n        return ms * 1000;\n    }\n\n    function createObject(object) {\n        var newObject;\n\n        if (Object.create) {\n            newObject = Object.create(object);\n        } else {\n            var F = function () {};\n            F.prototype = object;\n            newObject = new F();\n        }\n\n        newObject.Date.clock = newObject;\n        return newObject;\n    }\n\n    sinon.clock = {\n        now: 0,\n\n        create: function create(now) {\n            var clock = createObject(this);\n\n            if (typeof now == \"number\") {\n                clock.now = now;\n            }\n\n            if (!!now && typeof now == \"object\") {\n                throw new TypeError(\"now should be milliseconds since UNIX epoch\");\n            }\n\n            return clock;\n        },\n\n        setTimeout: function setTimeout(callback, timeout) {\n            return addTimer.call(this, arguments, false);\n        },\n\n        clearTimeout: function clearTimeout(timerId) {\n            if (!this.timeouts) {\n                this.timeouts = [];\n            }\n\n            if (timerId in this.timeouts) {\n                delete this.timeouts[timerId];\n            }\n        },\n\n        setInterval: function setInterval(callback, timeout) {\n            return addTimer.call(this, arguments, true);\n        },\n\n        clearInterval: function clearInterval(timerId) {\n            this.clearTimeout(timerId);\n        },\n\n        tick: function tick(ms) {\n            ms = typeof ms == \"number\" ? ms : parseTime(ms);\n            var tickFrom = this.now, tickTo = this.now + ms, previous = this.now;\n            var timer = this.firstTimerInRange(tickFrom, tickTo);\n\n            var firstException;\n            while (timer && tickFrom <= tickTo) {\n                if (this.timeouts[timer.id]) {\n                    tickFrom = this.now = timer.callAt;\n                    try {\n                      this.callTimer(timer);\n                    } catch (e) {\n                      firstException = firstException || e;\n                    }\n                }\n\n                timer = this.firstTimerInRange(previous, tickTo);\n                previous = tickFrom;\n            }\n\n            this.now = tickTo;\n\n            if (firstException) {\n              throw firstException;\n            }\n\n            return this.now;\n        },\n\n        firstTimerInRange: function (from, to) {\n            var timer, smallest, originalTimer;\n\n            for (var id in this.timeouts) {\n                if (this.timeouts.hasOwnProperty(id)) {\n                    if (this.timeouts[id].callAt < from || this.timeouts[id].callAt > to) {\n                        continue;\n                    }\n\n                    if (!smallest || this.timeouts[id].callAt < smallest) {\n                        originalTimer = this.timeouts[id];\n                        smallest = this.timeouts[id].callAt;\n\n                        timer = {\n                            func: this.timeouts[id].func,\n                            callAt: this.timeouts[id].callAt,\n                            interval: this.timeouts[id].interval,\n                            id: this.timeouts[id].id,\n                            invokeArgs: this.timeouts[id].invokeArgs\n                        };\n                    }\n                }\n            }\n\n            return timer || null;\n        },\n\n        callTimer: function (timer) {\n            if (typeof timer.interval == \"number\") {\n                this.timeouts[timer.id].callAt += timer.interval;\n            } else {\n                delete this.timeouts[timer.id];\n            }\n\n            try {\n                if (typeof timer.func == \"function\") {\n                    timer.func.apply(null, timer.invokeArgs);\n                } else {\n                    eval(timer.func);\n                }\n            } catch (e) {\n              var exception = e;\n            }\n\n            if (!this.timeouts[timer.id]) {\n                if (exception) {\n                  throw exception;\n                }\n                return;\n            }\n\n            if (exception) {\n              throw exception;\n            }\n        },\n\n        reset: function reset() {\n            this.timeouts = {};\n        },\n\n        Date: (function () {\n            var NativeDate = Date;\n\n            function ClockDate(year, month, date, hour, minute, second, ms) {\n                // Defensive and verbose to avoid potential harm in passing\n                // explicit undefined when user does not pass argument\n                switch (arguments.length) {\n                case 0:\n                    return new NativeDate(ClockDate.clock.now);\n                case 1:\n                    return new NativeDate(year);\n                case 2:\n                    return new NativeDate(year, month);\n                case 3:\n                    return new NativeDate(year, month, date);\n                case 4:\n                    return new NativeDate(year, month, date, hour);\n                case 5:\n                    return new NativeDate(year, month, date, hour, minute);\n                case 6:\n                    return new NativeDate(year, month, date, hour, minute, second);\n                default:\n                    return new NativeDate(year, month, date, hour, minute, second, ms);\n                }\n            }\n\n            return mirrorDateProperties(ClockDate, NativeDate);\n        }())\n    };\n\n    function mirrorDateProperties(target, source) {\n        if (source.now) {\n            target.now = function now() {\n                return target.clock.now;\n            };\n        } else {\n            delete target.now;\n        }\n\n        if (source.toSource) {\n            target.toSource = function toSource() {\n                return source.toSource();\n            };\n        } else {\n            delete target.toSource;\n        }\n\n        target.toString = function toString() {\n            return source.toString();\n        };\n\n        target.prototype = source.prototype;\n        target.parse = source.parse;\n        target.UTC = source.UTC;\n        target.prototype.toUTCString = source.prototype.toUTCString;\n        return target;\n    }\n\n    var methods = [\"Date\", \"setTimeout\", \"setInterval\",\n                   \"clearTimeout\", \"clearInterval\"];\n\n    function restore() {\n        var method;\n\n        for (var i = 0, l = this.methods.length; i < l; i++) {\n            method = this.methods[i];\n            if (global[method].hadOwnProperty) {\n                global[method] = this[\"_\" + method];\n            } else {\n                delete global[method];\n            }\n        }\n\n        // Prevent multiple executions which will completely remove these props\n        this.methods = [];\n    }\n\n    function stubGlobal(method, clock) {\n        clock[method].hadOwnProperty = Object.prototype.hasOwnProperty.call(global, method);\n        clock[\"_\" + method] = global[method];\n\n        if (method == \"Date\") {\n            var date = mirrorDateProperties(clock[method], global[method]);\n            global[method] = date;\n        } else {\n            global[method] = function () {\n                return clock[method].apply(clock, arguments);\n            };\n\n            for (var prop in clock[method]) {\n                if (clock[method].hasOwnProperty(prop)) {\n                    global[method][prop] = clock[method][prop];\n                }\n            }\n        }\n\n        global[method].clock = clock;\n    }\n\n    sinon.useFakeTimers = function useFakeTimers(now) {\n        var clock = sinon.clock.create(now);\n        clock.restore = restore;\n        clock.methods = Array.prototype.slice.call(arguments,\n                                                   typeof now == \"number\" ? 1 : 0);\n\n        if (clock.methods.length === 0) {\n            clock.methods = methods;\n        }\n\n        for (var i = 0, l = clock.methods.length; i < l; i++) {\n            stubGlobal(clock.methods[i], clock);\n        }\n\n        return clock;\n    };\n}(typeof global != \"undefined\" && typeof global !== \"function\" ? global : this));\n\nsinon.timers = {\n    setTimeout: setTimeout,\n    clearTimeout: clearTimeout,\n    setInterval: setInterval,\n    clearInterval: clearInterval,\n    Date: Date\n};\n\nif (typeof module == \"object\" && typeof require == \"function\") {\n    module.exports = sinon;\n}\n\n/*jslint eqeqeq: false, onevar: false*/\n/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/\n/**\n * Minimal Event interface implementation\n *\n * Original implementation by Sven Fuchs: https://gist.github.com/995028\n * Modifications and tests by Christian Johansen.\n *\n * @author Sven Fuchs (svenfuchs@artweb-design.de)\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2011 Sven Fuchs, Christian Johansen\n */\n\nif (typeof sinon == \"undefined\") {\n    this.sinon = {};\n}\n\n(function () {\n    var push = [].push;\n\n    sinon.Event = function Event(type, bubbles, cancelable, target) {\n        this.initEvent(type, bubbles, cancelable, target);\n    };\n\n    sinon.Event.prototype = {\n        initEvent: function(type, bubbles, cancelable, target) {\n            this.type = type;\n            this.bubbles = bubbles;\n            this.cancelable = cancelable;\n            this.target = target;\n        },\n\n        stopPropagation: function () {},\n\n        preventDefault: function () {\n            this.defaultPrevented = true;\n        }\n    };\n\n    sinon.EventTarget = {\n        addEventListener: function addEventListener(event, listener, useCapture) {\n            this.eventListeners = this.eventListeners || {};\n            this.eventListeners[event] = this.eventListeners[event] || [];\n            push.call(this.eventListeners[event], listener);\n        },\n\n        removeEventListener: function removeEventListener(event, listener, useCapture) {\n            var listeners = this.eventListeners && this.eventListeners[event] || [];\n\n            for (var i = 0, l = listeners.length; i < l; ++i) {\n                if (listeners[i] == listener) {\n                    return listeners.splice(i, 1);\n                }\n            }\n        },\n\n        dispatchEvent: function dispatchEvent(event) {\n            var type = event.type;\n            var listeners = this.eventListeners && this.eventListeners[type] || [];\n\n            for (var i = 0; i < listeners.length; i++) {\n                if (typeof listeners[i] == \"function\") {\n                    listeners[i].call(this, event);\n                } else {\n                    listeners[i].handleEvent(event);\n                }\n            }\n\n            return !!event.defaultPrevented;\n        }\n    };\n}());\n\n/**\n * @depend ../../sinon.js\n * @depend event.js\n */\n/*jslint eqeqeq: false, onevar: false*/\n/*global sinon, module, require, ActiveXObject, XMLHttpRequest, DOMParser*/\n/**\n * Fake XMLHttpRequest object\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\nif (typeof sinon == \"undefined\") {\n    this.sinon = {};\n}\nsinon.xhr = { XMLHttpRequest: this.XMLHttpRequest };\n\n// wrapper for global\n(function(global) {\n    var xhr = sinon.xhr;\n    xhr.GlobalXMLHttpRequest = global.XMLHttpRequest;\n    xhr.GlobalActiveXObject = global.ActiveXObject;\n    xhr.supportsActiveX = typeof xhr.GlobalActiveXObject != \"undefined\";\n    xhr.supportsXHR = typeof xhr.GlobalXMLHttpRequest != \"undefined\";\n    xhr.workingXHR = xhr.supportsXHR ? xhr.GlobalXMLHttpRequest : xhr.supportsActiveX\n                                     ? function() { return new xhr.GlobalActiveXObject(\"MSXML2.XMLHTTP.3.0\") } : false;\n\n    /*jsl:ignore*/\n    var unsafeHeaders = {\n        \"Accept-Charset\": true,\n        \"Accept-Encoding\": true,\n        \"Connection\": true,\n        \"Content-Length\": true,\n        \"Cookie\": true,\n        \"Cookie2\": true,\n        \"Content-Transfer-Encoding\": true,\n        \"Date\": true,\n        \"Expect\": true,\n        \"Host\": true,\n        \"Keep-Alive\": true,\n        \"Referer\": true,\n        \"TE\": true,\n        \"Trailer\": true,\n        \"Transfer-Encoding\": true,\n        \"Upgrade\": true,\n        \"User-Agent\": true,\n        \"Via\": true\n    };\n    /*jsl:end*/\n\n    function FakeXMLHttpRequest() {\n        this.readyState = FakeXMLHttpRequest.UNSENT;\n        this.requestHeaders = {};\n        this.requestBody = null;\n        this.status = 0;\n        this.statusText = \"\";\n\n        var xhr = this;\n        var events = [\"loadstart\", \"load\", \"abort\", \"loadend\"];\n\n        function addEventListener(eventName) {\n            xhr.addEventListener(eventName, function (event) {\n                var listener = xhr[\"on\" + eventName];\n\n                if (listener && typeof listener == \"function\") {\n                    listener(event);\n                }\n            });\n        }\n\n        for (var i = events.length - 1; i >= 0; i--) {\n            addEventListener(events[i]);\n        }\n\n        if (typeof FakeXMLHttpRequest.onCreate == \"function\") {\n            FakeXMLHttpRequest.onCreate(this);\n        }\n    }\n\n    function verifyState(xhr) {\n        if (xhr.readyState !== FakeXMLHttpRequest.OPENED) {\n            throw new Error(\"INVALID_STATE_ERR\");\n        }\n\n        if (xhr.sendFlag) {\n            throw new Error(\"INVALID_STATE_ERR\");\n        }\n    }\n\n    // filtering to enable a white-list version of Sinon FakeXhr,\n    // where whitelisted requests are passed through to real XHR\n    function each(collection, callback) {\n        if (!collection) return;\n        for (var i = 0, l = collection.length; i < l; i += 1) {\n            callback(collection[i]);\n        }\n    }\n    function some(collection, callback) {\n        for (var index = 0; index < collection.length; index++) {\n            if(callback(collection[index]) === true) return true;\n        };\n        return false;\n    }\n    // largest arity in XHR is 5 - XHR#open\n    var apply = function(obj,method,args) {\n        switch(args.length) {\n        case 0: return obj[method]();\n        case 1: return obj[method](args[0]);\n        case 2: return obj[method](args[0],args[1]);\n        case 3: return obj[method](args[0],args[1],args[2]);\n        case 4: return obj[method](args[0],args[1],args[2],args[3]);\n        case 5: return obj[method](args[0],args[1],args[2],args[3],args[4]);\n        };\n    };\n\n    FakeXMLHttpRequest.filters = [];\n    FakeXMLHttpRequest.addFilter = function(fn) {\n        this.filters.push(fn)\n    };\n    var IE6Re = /MSIE 6/;\n    FakeXMLHttpRequest.defake = function(fakeXhr,xhrArgs) {\n        var xhr = new sinon.xhr.workingXHR();\n        each([\"open\",\"setRequestHeader\",\"send\",\"abort\",\"getResponseHeader\",\n              \"getAllResponseHeaders\",\"addEventListener\",\"overrideMimeType\",\"removeEventListener\"],\n             function(method) {\n                 fakeXhr[method] = function() {\n                   return apply(xhr,method,arguments);\n                 };\n             });\n\n        var copyAttrs = function(args) {\n            each(args, function(attr) {\n              try {\n                fakeXhr[attr] = xhr[attr]\n              } catch(e) {\n                if(!IE6Re.test(navigator.userAgent)) throw e;\n              }\n            });\n        };\n\n        var stateChange = function() {\n            fakeXhr.readyState = xhr.readyState;\n            if(xhr.readyState >= FakeXMLHttpRequest.HEADERS_RECEIVED) {\n                copyAttrs([\"status\",\"statusText\"]);\n            }\n            if(xhr.readyState >= FakeXMLHttpRequest.LOADING) {\n                copyAttrs([\"responseText\"]);\n            }\n            if(xhr.readyState === FakeXMLHttpRequest.DONE) {\n                copyAttrs([\"responseXML\"]);\n            }\n            if(fakeXhr.onreadystatechange) fakeXhr.onreadystatechange.call(fakeXhr);\n        };\n        if(xhr.addEventListener) {\n          for(var event in fakeXhr.eventListeners) {\n              if(fakeXhr.eventListeners.hasOwnProperty(event)) {\n                  each(fakeXhr.eventListeners[event],function(handler) {\n                      xhr.addEventListener(event, handler);\n                  });\n              }\n          }\n          xhr.addEventListener(\"readystatechange\",stateChange);\n        } else {\n          xhr.onreadystatechange = stateChange;\n        }\n        apply(xhr,\"open\",xhrArgs);\n    };\n    FakeXMLHttpRequest.useFilters = false;\n\n    function verifyRequestSent(xhr) {\n        if (xhr.readyState == FakeXMLHttpRequest.DONE) {\n            throw new Error(\"Request done\");\n        }\n    }\n\n    function verifyHeadersReceived(xhr) {\n        if (xhr.async && xhr.readyState != FakeXMLHttpRequest.HEADERS_RECEIVED) {\n            throw new Error(\"No headers received\");\n        }\n    }\n\n    function verifyResponseBodyType(body) {\n        if (typeof body != \"string\") {\n            var error = new Error(\"Attempted to respond to fake XMLHttpRequest with \" +\n                                 body + \", which is not a string.\");\n            error.name = \"InvalidBodyException\";\n            throw error;\n        }\n    }\n\n    sinon.extend(FakeXMLHttpRequest.prototype, sinon.EventTarget, {\n        async: true,\n\n        open: function open(method, url, async, username, password) {\n            this.method = method;\n            this.url = url;\n            this.async = typeof async == \"boolean\" ? async : true;\n            this.username = username;\n            this.password = password;\n            this.responseText = null;\n            this.responseXML = null;\n            this.requestHeaders = {};\n            this.sendFlag = false;\n            if(sinon.FakeXMLHttpRequest.useFilters === true) {\n                var xhrArgs = arguments;\n                var defake = some(FakeXMLHttpRequest.filters,function(filter) {\n                    return filter.apply(this,xhrArgs)\n                });\n                if (defake) {\n                  return sinon.FakeXMLHttpRequest.defake(this,arguments);\n                }\n            }\n            this.readyStateChange(FakeXMLHttpRequest.OPENED);\n        },\n\n        readyStateChange: function readyStateChange(state) {\n            this.readyState = state;\n\n            if (typeof this.onreadystatechange == \"function\") {\n                try {\n                    this.onreadystatechange();\n                } catch (e) {\n                    sinon.logError(\"Fake XHR onreadystatechange handler\", e);\n                }\n            }\n\n            this.dispatchEvent(new sinon.Event(\"readystatechange\"));\n\n            switch (this.readyState) {\n                case FakeXMLHttpRequest.DONE:\n                    this.dispatchEvent(new sinon.Event(\"load\", false, false, this));\n                    this.dispatchEvent(new sinon.Event(\"loadend\", false, false, this));\n                    break;\n            }\n        },\n\n        setRequestHeader: function setRequestHeader(header, value) {\n            verifyState(this);\n\n            if (unsafeHeaders[header] || /^(Sec-|Proxy-)/.test(header)) {\n                throw new Error(\"Refused to set unsafe header \\\"\" + header + \"\\\"\");\n            }\n\n            if (this.requestHeaders[header]) {\n                this.requestHeaders[header] += \",\" + value;\n            } else {\n                this.requestHeaders[header] = value;\n            }\n        },\n\n        // Helps testing\n        setResponseHeaders: function setResponseHeaders(headers) {\n            this.responseHeaders = {};\n\n            for (var header in headers) {\n                if (headers.hasOwnProperty(header)) {\n                    this.responseHeaders[header] = headers[header];\n                }\n            }\n\n            if (this.async) {\n                this.readyStateChange(FakeXMLHttpRequest.HEADERS_RECEIVED);\n            } else {\n                this.readyState = FakeXMLHttpRequest.HEADERS_RECEIVED;\n            }\n        },\n\n        // Currently treats ALL data as a DOMString (i.e. no Document)\n        send: function send(data) {\n            verifyState(this);\n\n            if (!/^(get|head)$/i.test(this.method)) {\n                if (this.requestHeaders[\"Content-Type\"]) {\n                    var value = this.requestHeaders[\"Content-Type\"].split(\";\");\n                    this.requestHeaders[\"Content-Type\"] = value[0] + \";charset=utf-8\";\n                } else {\n                    this.requestHeaders[\"Content-Type\"] = \"text/plain;charset=utf-8\";\n                }\n\n                this.requestBody = data;\n            }\n\n            this.errorFlag = false;\n            this.sendFlag = this.async;\n            this.readyStateChange(FakeXMLHttpRequest.OPENED);\n\n            if (typeof this.onSend == \"function\") {\n                this.onSend(this);\n            }\n\n            this.dispatchEvent(new sinon.Event(\"loadstart\", false, false, this));\n        },\n\n        abort: function abort() {\n            this.aborted = true;\n            this.responseText = null;\n            this.errorFlag = true;\n            this.requestHeaders = {};\n\n            if (this.readyState > sinon.FakeXMLHttpRequest.UNSENT && this.sendFlag) {\n                this.readyStateChange(sinon.FakeXMLHttpRequest.DONE);\n                this.sendFlag = false;\n            }\n\n            this.readyState = sinon.FakeXMLHttpRequest.UNSENT;\n\n            this.dispatchEvent(new sinon.Event(\"abort\", false, false, this));\n            if (typeof this.onerror === \"function\") {\n                this.onerror();\n            }\n        },\n\n        getResponseHeader: function getResponseHeader(header) {\n            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {\n                return null;\n            }\n\n            if (/^Set-Cookie2?$/i.test(header)) {\n                return null;\n            }\n\n            header = header.toLowerCase();\n\n            for (var h in this.responseHeaders) {\n                if (h.toLowerCase() == header) {\n                    return this.responseHeaders[h];\n                }\n            }\n\n            return null;\n        },\n\n        getAllResponseHeaders: function getAllResponseHeaders() {\n            if (this.readyState < FakeXMLHttpRequest.HEADERS_RECEIVED) {\n                return \"\";\n            }\n\n            var headers = \"\";\n\n            for (var header in this.responseHeaders) {\n                if (this.responseHeaders.hasOwnProperty(header) &&\n                    !/^Set-Cookie2?$/i.test(header)) {\n                    headers += header + \": \" + this.responseHeaders[header] + \"\\r\\n\";\n                }\n            }\n\n            return headers;\n        },\n\n        setResponseBody: function setResponseBody(body) {\n            verifyRequestSent(this);\n            verifyHeadersReceived(this);\n            verifyResponseBodyType(body);\n\n            var chunkSize = this.chunkSize || 10;\n            var index = 0;\n            this.responseText = \"\";\n\n            do {\n                if (this.async) {\n                    this.readyStateChange(FakeXMLHttpRequest.LOADING);\n                }\n\n                this.responseText += body.substring(index, index + chunkSize);\n                index += chunkSize;\n            } while (index < body.length);\n\n            var type = this.getResponseHeader(\"Content-Type\");\n\n            if (this.responseText &&\n                (!type || /(text\\/xml)|(application\\/xml)|(\\+xml)/.test(type))) {\n                try {\n                    this.responseXML = FakeXMLHttpRequest.parseXML(this.responseText);\n                } catch (e) {\n                    // Unable to parse XML - no biggie\n                }\n            }\n\n            if (this.async) {\n                this.readyStateChange(FakeXMLHttpRequest.DONE);\n            } else {\n                this.readyState = FakeXMLHttpRequest.DONE;\n            }\n        },\n\n        respond: function respond(status, headers, body) {\n            this.setResponseHeaders(headers || {});\n            this.status = typeof status == \"number\" ? status : 200;\n            this.statusText = FakeXMLHttpRequest.statusCodes[this.status];\n            this.setResponseBody(body || \"\");\n            if (typeof this.onload === \"function\"){\n                this.onload();\n            }\n\n        }\n    });\n\n    sinon.extend(FakeXMLHttpRequest, {\n        UNSENT: 0,\n        OPENED: 1,\n        HEADERS_RECEIVED: 2,\n        LOADING: 3,\n        DONE: 4\n    });\n\n    // Borrowed from JSpec\n    FakeXMLHttpRequest.parseXML = function parseXML(text) {\n        var xmlDoc;\n\n        if (typeof DOMParser != \"undefined\") {\n            var parser = new DOMParser();\n            xmlDoc = parser.parseFromString(text, \"text/xml\");\n        } else {\n            xmlDoc = new ActiveXObject(\"Microsoft.XMLDOM\");\n            xmlDoc.async = \"false\";\n            xmlDoc.loadXML(text);\n        }\n\n        return xmlDoc;\n    };\n\n    FakeXMLHttpRequest.statusCodes = {\n        100: \"Continue\",\n        101: \"Switching Protocols\",\n        200: \"OK\",\n        201: \"Created\",\n        202: \"Accepted\",\n        203: \"Non-Authoritative Information\",\n        204: \"No Content\",\n        205: \"Reset Content\",\n        206: \"Partial Content\",\n        300: \"Multiple Choice\",\n        301: \"Moved Permanently\",\n        302: \"Found\",\n        303: \"See Other\",\n        304: \"Not Modified\",\n        305: \"Use Proxy\",\n        307: \"Temporary Redirect\",\n        400: \"Bad Request\",\n        401: \"Unauthorized\",\n        402: \"Payment Required\",\n        403: \"Forbidden\",\n        404: \"Not Found\",\n        405: \"Method Not Allowed\",\n        406: \"Not Acceptable\",\n        407: \"Proxy Authentication Required\",\n        408: \"Request Timeout\",\n        409: \"Conflict\",\n        410: \"Gone\",\n        411: \"Length Required\",\n        412: \"Precondition Failed\",\n        413: \"Request Entity Too Large\",\n        414: \"Request-URI Too Long\",\n        415: \"Unsupported Media Type\",\n        416: \"Requested Range Not Satisfiable\",\n        417: \"Expectation Failed\",\n        422: \"Unprocessable Entity\",\n        500: \"Internal Server Error\",\n        501: \"Not Implemented\",\n        502: \"Bad Gateway\",\n        503: \"Service Unavailable\",\n        504: \"Gateway Timeout\",\n        505: \"HTTP Version Not Supported\"\n    };\n\n    sinon.useFakeXMLHttpRequest = function () {\n        sinon.FakeXMLHttpRequest.restore = function restore(keepOnCreate) {\n            if (xhr.supportsXHR) {\n                global.XMLHttpRequest = xhr.GlobalXMLHttpRequest;\n            }\n\n            if (xhr.supportsActiveX) {\n                global.ActiveXObject = xhr.GlobalActiveXObject;\n            }\n\n            delete sinon.FakeXMLHttpRequest.restore;\n\n            if (keepOnCreate !== true) {\n                delete sinon.FakeXMLHttpRequest.onCreate;\n            }\n        };\n        if (xhr.supportsXHR) {\n            global.XMLHttpRequest = sinon.FakeXMLHttpRequest;\n        }\n\n        if (xhr.supportsActiveX) {\n            global.ActiveXObject = function ActiveXObject(objId) {\n                if (objId == \"Microsoft.XMLHTTP\" || /^Msxml2\\.XMLHTTP/i.test(objId)) {\n\n                    return new sinon.FakeXMLHttpRequest();\n                }\n\n                return new xhr.GlobalActiveXObject(objId);\n            };\n        }\n\n        return sinon.FakeXMLHttpRequest;\n    };\n\n    sinon.FakeXMLHttpRequest = FakeXMLHttpRequest;\n})(this);\n\nif (typeof module == \"object\" && typeof require == \"function\") {\n    module.exports = sinon;\n}\n\n/**\n * @depend fake_xml_http_request.js\n */\n/*jslint eqeqeq: false, onevar: false, regexp: false, plusplus: false*/\n/*global module, require, window*/\n/**\n * The Sinon \"server\" mimics a web server that receives requests from\n * sinon.FakeXMLHttpRequest and provides an API to respond to those requests,\n * both synchronously and asynchronously. To respond synchronuously, canned\n * answers have to be provided upfront.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\nif (typeof sinon == \"undefined\") {\n    var sinon = {};\n}\n\nsinon.fakeServer = (function () {\n    var push = [].push;\n    function F() {}\n\n    function create(proto) {\n        F.prototype = proto;\n        return new F();\n    }\n\n    function responseArray(handler) {\n        var response = handler;\n\n        if (Object.prototype.toString.call(handler) != \"[object Array]\") {\n            response = [200, {}, handler];\n        }\n\n        if (typeof response[2] != \"string\") {\n            throw new TypeError(\"Fake server response body should be string, but was \" +\n                                typeof response[2]);\n        }\n\n        return response;\n    }\n\n    var wloc = typeof window !== \"undefined\" ? window.location : {};\n    var rCurrLoc = new RegExp(\"^\" + wloc.protocol + \"//\" + wloc.host);\n\n    function matchOne(response, reqMethod, reqUrl) {\n        var rmeth = response.method;\n        var matchMethod = !rmeth || rmeth.toLowerCase() == reqMethod.toLowerCase();\n        var url = response.url;\n        var matchUrl = !url || url == reqUrl || (typeof url.test == \"function\" && url.test(reqUrl));\n\n        return matchMethod && matchUrl;\n    }\n\n    function match(response, request) {\n        var requestMethod = this.getHTTPMethod(request);\n        var requestUrl = request.url;\n\n        if (!/^https?:\\/\\//.test(requestUrl) || rCurrLoc.test(requestUrl)) {\n            requestUrl = requestUrl.replace(rCurrLoc, \"\");\n        }\n\n        if (matchOne(response, this.getHTTPMethod(request), requestUrl)) {\n            if (typeof response.response == \"function\") {\n                var ru = response.url;\n                var args = [request].concat(!ru ? [] : requestUrl.match(ru).slice(1));\n                return response.response.apply(response, args);\n            }\n\n            return true;\n        }\n\n        return false;\n    }\n\n    function log(response, request) {\n        var str;\n\n        str =  \"Request:\\n\"  + sinon.format(request)  + \"\\n\\n\";\n        str += \"Response:\\n\" + sinon.format(response) + \"\\n\\n\";\n\n        sinon.log(str);\n    }\n\n    return {\n        create: function () {\n            var server = create(this);\n            this.xhr = sinon.useFakeXMLHttpRequest();\n            server.requests = [];\n\n            this.xhr.onCreate = function (xhrObj) {\n                server.addRequest(xhrObj);\n            };\n\n            return server;\n        },\n\n        addRequest: function addRequest(xhrObj) {\n            var server = this;\n            push.call(this.requests, xhrObj);\n\n            xhrObj.onSend = function () {\n                server.handleRequest(this);\n            };\n\n            if (this.autoRespond && !this.responding) {\n                setTimeout(function () {\n                    server.responding = false;\n                    server.respond();\n                }, this.autoRespondAfter || 10);\n\n                this.responding = true;\n            }\n        },\n\n        getHTTPMethod: function getHTTPMethod(request) {\n            if (this.fakeHTTPMethods && /post/i.test(request.method)) {\n                var matches = (request.requestBody || \"\").match(/_method=([^\\b;]+)/);\n                return !!matches ? matches[1] : request.method;\n            }\n\n            return request.method;\n        },\n\n        handleRequest: function handleRequest(xhr) {\n            if (xhr.async) {\n                if (!this.queue) {\n                    this.queue = [];\n                }\n\n                push.call(this.queue, xhr);\n            } else {\n                this.processRequest(xhr);\n            }\n        },\n\n        respondWith: function respondWith(method, url, body) {\n            if (arguments.length == 1 && typeof method != \"function\") {\n                this.response = responseArray(method);\n                return;\n            }\n\n            if (!this.responses) { this.responses = []; }\n\n            if (arguments.length == 1) {\n                body = method;\n                url = method = null;\n            }\n\n            if (arguments.length == 2) {\n                body = url;\n                url = method;\n                method = null;\n            }\n\n            push.call(this.responses, {\n                method: method,\n                url: url,\n                response: typeof body == \"function\" ? body : responseArray(body)\n            });\n        },\n\n        respond: function respond() {\n            if (arguments.length > 0) this.respondWith.apply(this, arguments);\n            var queue = this.queue || [];\n            var request;\n\n            while(request = queue.shift()) {\n                this.processRequest(request);\n            }\n        },\n\n        processRequest: function processRequest(request) {\n            try {\n                if (request.aborted) {\n                    return;\n                }\n\n                var response = this.response || [404, {}, \"\"];\n\n                if (this.responses) {\n                    for (var i = 0, l = this.responses.length; i < l; i++) {\n                        if (match.call(this, this.responses[i], request)) {\n                            response = this.responses[i].response;\n                            break;\n                        }\n                    }\n                }\n\n                if (request.readyState != 4) {\n                    log(response, request);\n\n                    request.respond(response[0], response[1], response[2]);\n                }\n            } catch (e) {\n                sinon.logError(\"Fake server request processing\", e);\n            }\n        },\n\n        restore: function restore() {\n            return this.xhr.restore && this.xhr.restore.apply(this.xhr, arguments);\n        }\n    };\n}());\n\nif (typeof module == \"object\" && typeof require == \"function\") {\n    module.exports = sinon;\n}\n\n/**\n * @depend fake_server.js\n * @depend fake_timers.js\n */\n/*jslint browser: true, eqeqeq: false, onevar: false*/\n/*global sinon*/\n/**\n * Add-on for sinon.fakeServer that automatically handles a fake timer along with\n * the FakeXMLHttpRequest. The direct inspiration for this add-on is jQuery\n * 1.3.x, which does not use xhr object's onreadystatehandler at all - instead,\n * it polls the object for completion with setInterval. Dispite the direct\n * motivation, there is nothing jQuery-specific in this file, so it can be used\n * in any environment where the ajax implementation depends on setInterval or\n * setTimeout.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function () {\n    function Server() {}\n    Server.prototype = sinon.fakeServer;\n\n    sinon.fakeServerWithClock = new Server();\n\n    sinon.fakeServerWithClock.addRequest = function addRequest(xhr) {\n        if (xhr.async) {\n            if (typeof setTimeout.clock == \"object\") {\n                this.clock = setTimeout.clock;\n            } else {\n                this.clock = sinon.useFakeTimers();\n                this.resetClock = true;\n            }\n\n            if (!this.longestTimeout) {\n                var clockSetTimeout = this.clock.setTimeout;\n                var clockSetInterval = this.clock.setInterval;\n                var server = this;\n\n                this.clock.setTimeout = function (fn, timeout) {\n                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);\n\n                    return clockSetTimeout.apply(this, arguments);\n                };\n\n                this.clock.setInterval = function (fn, timeout) {\n                    server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);\n\n                    return clockSetInterval.apply(this, arguments);\n                };\n            }\n        }\n\n        return sinon.fakeServer.addRequest.call(this, xhr);\n    };\n\n    sinon.fakeServerWithClock.respond = function respond() {\n        var returnVal = sinon.fakeServer.respond.apply(this, arguments);\n\n        if (this.clock) {\n            this.clock.tick(this.longestTimeout || 0);\n            this.longestTimeout = 0;\n\n            if (this.resetClock) {\n                this.clock.restore();\n                this.resetClock = false;\n            }\n        }\n\n        return returnVal;\n    };\n\n    sinon.fakeServerWithClock.restore = function restore() {\n        if (this.clock) {\n            this.clock.restore();\n        }\n\n        return sinon.fakeServer.restore.apply(this, arguments);\n    };\n}());\n\n/**\n * @depend ../sinon.js\n * @depend collection.js\n * @depend util/fake_timers.js\n * @depend util/fake_server_with_clock.js\n */\n/*jslint eqeqeq: false, onevar: false, plusplus: false*/\n/*global require, module*/\n/**\n * Manages fake collections as well as fake utilities such as Sinon's\n * timers and fake XHR implementation in one convenient object.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\nif (typeof module == \"object\" && typeof require == \"function\") {\n    var sinon = require(\"../sinon\");\n    sinon.extend(sinon, require(\"./util/fake_timers\"));\n}\n\n(function () {\n    var push = [].push;\n\n    function exposeValue(sandbox, config, key, value) {\n        if (!value) {\n            return;\n        }\n\n        if (config.injectInto) {\n            config.injectInto[key] = value;\n        } else {\n            push.call(sandbox.args, value);\n        }\n    }\n\n    function prepareSandboxFromConfig(config) {\n        var sandbox = sinon.create(sinon.sandbox);\n\n        if (config.useFakeServer) {\n            if (typeof config.useFakeServer == \"object\") {\n                sandbox.serverPrototype = config.useFakeServer;\n            }\n\n            sandbox.useFakeServer();\n        }\n\n        if (config.useFakeTimers) {\n            if (typeof config.useFakeTimers == \"object\") {\n                sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);\n            } else {\n                sandbox.useFakeTimers();\n            }\n        }\n\n        return sandbox;\n    }\n\n    sinon.sandbox = sinon.extend(sinon.create(sinon.collection), {\n        useFakeTimers: function useFakeTimers() {\n            this.clock = sinon.useFakeTimers.apply(sinon, arguments);\n\n            return this.add(this.clock);\n        },\n\n        serverPrototype: sinon.fakeServer,\n\n        useFakeServer: function useFakeServer() {\n            var proto = this.serverPrototype || sinon.fakeServer;\n\n            if (!proto || !proto.create) {\n                return null;\n            }\n\n            this.server = proto.create();\n            return this.add(this.server);\n        },\n\n        inject: function (obj) {\n            sinon.collection.inject.call(this, obj);\n\n            if (this.clock) {\n                obj.clock = this.clock;\n            }\n\n            if (this.server) {\n                obj.server = this.server;\n                obj.requests = this.server.requests;\n            }\n\n            return obj;\n        },\n\n        create: function (config) {\n            if (!config) {\n                return sinon.create(sinon.sandbox);\n            }\n\n            var sandbox = prepareSandboxFromConfig(config);\n            sandbox.args = sandbox.args || [];\n            var prop, value, exposed = sandbox.inject({});\n\n            if (config.properties) {\n                for (var i = 0, l = config.properties.length; i < l; i++) {\n                    prop = config.properties[i];\n                    value = exposed[prop] || prop == \"sandbox\" && sandbox;\n                    exposeValue(sandbox, config, prop, value);\n                }\n            } else {\n                exposeValue(sandbox, config, \"sandbox\", value);\n            }\n\n            return sandbox;\n        }\n    });\n\n    sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;\n\n    if (typeof module == \"object\" && typeof require == \"function\") {\n        module.exports = sinon.sandbox;\n    }\n}());\n\n/**\n * @depend ../sinon.js\n * @depend stub.js\n * @depend mock.js\n * @depend sandbox.js\n */\n/*jslint eqeqeq: false, onevar: false, forin: true, plusplus: false*/\n/*global module, require, sinon*/\n/**\n * Test function, sandboxes fakes\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon) {\n        return;\n    }\n\n    function test(callback) {\n        var type = typeof callback;\n\n        if (type != \"function\") {\n            throw new TypeError(\"sinon.test needs to wrap a test function, got \" + type);\n        }\n\n        return function () {\n            var config = sinon.getConfig(sinon.config);\n            config.injectInto = config.injectIntoThis && this || config.injectInto;\n            var sandbox = sinon.sandbox.create(config);\n            var exception, result;\n            var args = Array.prototype.slice.call(arguments).concat(sandbox.args);\n\n            try {\n                result = callback.apply(this, args);\n            } catch (e) {\n                exception = e;\n            }\n\n            if (typeof exception !== \"undefined\") {\n                sandbox.restore();\n                throw exception;\n            }\n            else {\n                sandbox.verifyAndRestore();\n            }\n\n            return result;\n        };\n    }\n\n    test.config = {\n        injectIntoThis: true,\n        injectInto: null,\n        properties: [\"spy\", \"stub\", \"mock\", \"clock\", \"server\", \"requests\"],\n        useFakeTimers: true,\n        useFakeServer: true\n    };\n\n    if (commonJSModule) {\n        module.exports = test;\n    } else {\n        sinon.test = test;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n * @depend ../sinon.js\n * @depend test.js\n */\n/*jslint eqeqeq: false, onevar: false, eqeqeq: false*/\n/*global module, require, sinon*/\n/**\n * Test case, sandboxes all test functions\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function (sinon) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon || !Object.prototype.hasOwnProperty) {\n        return;\n    }\n\n    function createTest(property, setUp, tearDown) {\n        return function () {\n            if (setUp) {\n                setUp.apply(this, arguments);\n            }\n\n            var exception, result;\n\n            try {\n                result = property.apply(this, arguments);\n            } catch (e) {\n                exception = e;\n            }\n\n            if (tearDown) {\n                tearDown.apply(this, arguments);\n            }\n\n            if (exception) {\n                throw exception;\n            }\n\n            return result;\n        };\n    }\n\n    function testCase(tests, prefix) {\n        /*jsl:ignore*/\n        if (!tests || typeof tests != \"object\") {\n            throw new TypeError(\"sinon.testCase needs an object with test functions\");\n        }\n        /*jsl:end*/\n\n        prefix = prefix || \"test\";\n        var rPrefix = new RegExp(\"^\" + prefix);\n        var methods = {}, testName, property, method;\n        var setUp = tests.setUp;\n        var tearDown = tests.tearDown;\n\n        for (testName in tests) {\n            if (tests.hasOwnProperty(testName)) {\n                property = tests[testName];\n\n                if (/^(setUp|tearDown)$/.test(testName)) {\n                    continue;\n                }\n\n                if (typeof property == \"function\" && rPrefix.test(testName)) {\n                    method = property;\n\n                    if (setUp || tearDown) {\n                        method = createTest(property, setUp, tearDown);\n                    }\n\n                    methods[testName] = sinon.test(method);\n                } else {\n                    methods[testName] = tests[testName];\n                }\n            }\n        }\n\n        return methods;\n    }\n\n    if (commonJSModule) {\n        module.exports = testCase;\n    } else {\n        sinon.testCase = testCase;\n    }\n}(typeof sinon == \"object\" && sinon || null));\n\n/**\n * @depend ../sinon.js\n * @depend stub.js\n */\n/*jslint eqeqeq: false, onevar: false, nomen: false, plusplus: false*/\n/*global module, require, sinon*/\n/**\n * Assertions matching the test spy retrieval interface.\n *\n * @author Christian Johansen (christian@cjohansen.no)\n * @license BSD\n *\n * Copyright (c) 2010-2013 Christian Johansen\n */\n\n(function (sinon, global) {\n    var commonJSModule = typeof module == \"object\" && typeof require == \"function\";\n    var slice = Array.prototype.slice;\n    var assert;\n\n    if (!sinon && commonJSModule) {\n        sinon = require(\"../sinon\");\n    }\n\n    if (!sinon) {\n        return;\n    }\n\n    function verifyIsStub() {\n        var method;\n\n        for (var i = 0, l = arguments.length; i < l; ++i) {\n            method = arguments[i];\n\n            if (!method) {\n                assert.fail(\"fake is not a spy\");\n            }\n\n            if (typeof method != \"function\") {\n                assert.fail(method + \" is not a function\");\n            }\n\n            if (typeof method.getCall != \"function\") {\n                assert.fail(method + \" is not stubbed\");\n            }\n        }\n    }\n\n    function failAssertion(object, msg) {\n        object = object || global;\n        var failMethod = object.fail || assert.fail;\n        failMethod.call(object, msg);\n    }\n\n    function mirrorPropAsAssertion(name, method, message) {\n        if (arguments.length == 2) {\n            message = method;\n            method = name;\n        }\n\n        assert[name] = function (fake) {\n            verifyIsStub(fake);\n\n            var args = slice.call(arguments, 1);\n            var failed = false;\n\n            if (typeof method == \"function\") {\n                failed = !method(fake);\n            } else {\n                failed = typeof fake[method] == \"function\" ?\n                    !fake[method].apply(fake, args) : !fake[method];\n            }\n\n            if (failed) {\n                failAssertion(this, fake.printf.apply(fake, [message].concat(args)));\n            } else {\n                assert.pass(name);\n            }\n        };\n    }\n\n    function exposedName(prefix, prop) {\n        return !prefix || /^fail/.test(prop) ? prop :\n            prefix + prop.slice(0, 1).toUpperCase() + prop.slice(1);\n    };\n\n    assert = {\n        failException: \"AssertError\",\n\n        fail: function fail(message) {\n            var error = new Error(message);\n            error.name = this.failException || assert.failException;\n\n            throw error;\n        },\n\n        pass: function pass(assertion) {},\n\n        callOrder: function assertCallOrder() {\n            verifyIsStub.apply(null, arguments);\n            var expected = \"\", actual = \"\";\n\n            if (!sinon.calledInOrder(arguments)) {\n                try {\n                    expected = [].join.call(arguments, \", \");\n                    var calls = slice.call(arguments);\n                    var i = calls.length;\n                    while (i) {\n                        if (!calls[--i].called) {\n                            calls.splice(i, 1);\n                        }\n                    }\n                    actual = sinon.orderByFirstCall(calls).join(\", \");\n                } catch (e) {\n                    // If this fails, we'll just fall back to the blank string\n                }\n\n                failAssertion(this, \"expected \" + expected + \" to be \" +\n                              \"called in order but were called as \" + actual);\n            } else {\n                assert.pass(\"callOrder\");\n            }\n        },\n\n        callCount: function assertCallCount(method, count) {\n            verifyIsStub(method);\n\n            if (method.callCount != count) {\n                var msg = \"expected %n to be called \" + sinon.timesInWords(count) +\n                    \" but was called %c%C\";\n                failAssertion(this, method.printf(msg));\n            } else {\n                assert.pass(\"callCount\");\n            }\n        },\n\n        expose: function expose(target, options) {\n            if (!target) {\n                throw new TypeError(\"target is null or undefined\");\n            }\n\n            var o = options || {};\n            var prefix = typeof o.prefix == \"undefined\" && \"assert\" || o.prefix;\n            var includeFail = typeof o.includeFail == \"undefined\" || !!o.includeFail;\n\n            for (var method in this) {\n                if (method != \"export\" && (includeFail || !/^(fail)/.test(method))) {\n                    target[exposedName(prefix, method)] = this[method];\n                }\n            }\n\n            return target;\n        }\n    };\n\n    mirrorPropAsAssertion(\"called\", \"expected %n to have been called at least once but was never called\");\n    mirrorPropAsAssertion(\"notCalled\", function (spy) { return !spy.called; },\n                          \"expected %n to not have been called but was called %c%C\");\n    mirrorPropAsAssertion(\"calledOnce\", \"expected %n to be called once but was called %c%C\");\n    mirrorPropAsAssertion(\"calledTwice\", \"expected %n to be called twice but was called %c%C\");\n    mirrorPropAsAssertion(\"calledThrice\", \"expected %n to be called thrice but was called %c%C\");\n    mirrorPropAsAssertion(\"calledOn\", \"expected %n to be called with %1 as this but was called with %t\");\n    mirrorPropAsAssertion(\"alwaysCalledOn\", \"expected %n to always be called with %1 as this but was called with %t\");\n    mirrorPropAsAssertion(\"calledWithNew\", \"expected %n to be called with new\");\n    mirrorPropAsAssertion(\"alwaysCalledWithNew\", \"expected %n to always be called with new\");\n    mirrorPropAsAssertion(\"calledWith\", \"expected %n to be called with arguments %*%C\");\n    mirrorPropAsAssertion(\"calledWithMatch\", \"expected %n to be called with match %*%C\");\n    mirrorPropAsAssertion(\"alwaysCalledWith\", \"expected %n to always be called with arguments %*%C\");\n    mirrorPropAsAssertion(\"alwaysCalledWithMatch\", \"expected %n to always be called with match %*%C\");\n    mirrorPropAsAssertion(\"calledWithExactly\", \"expected %n to be called with exact arguments %*%C\");\n    mirrorPropAsAssertion(\"alwaysCalledWithExactly\", \"expected %n to always be called with exact arguments %*%C\");\n    mirrorPropAsAssertion(\"neverCalledWith\", \"expected %n to never be called with arguments %*%C\");\n    mirrorPropAsAssertion(\"neverCalledWithMatch\", \"expected %n to never be called with match %*%C\");\n    mirrorPropAsAssertion(\"threw\", \"%n did not throw exception%C\");\n    mirrorPropAsAssertion(\"alwaysThrew\", \"%n did not always throw exception%C\");\n\n    if (commonJSModule) {\n        module.exports = assert;\n    } else {\n        sinon.assert = assert;\n    }\n}(typeof sinon == \"object\" && sinon || null, typeof window != \"undefined\" ? window : (typeof self != \"undefined\") ? self : global));\n\nreturn sinon;}.call(typeof window != 'undefined' && window || {}));\n"

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Util = {
	  // modified from https://github.com/jquery/jquery/blob/master/src/core.js#L127
	  merge: function() {
	    var options, name, src, copy, copyIsArray, clone,
	      target = arguments[0] || {},
	      i = 1,
	      length = arguments.length,
	      deep = true;
	
	    // Handle case when target is a string or something (possible in deep copy)
	    if (typeof target !== "object" && typeof target !== 'function') {
	      target = {};
	    }
	
	    for (; i < length; i++) {
	      // Only deal with non-null/undefined values
	      if ((options = arguments[i]) !== null) {
	        // Extend the base object
	        for (name in options) {
	          // IE8 will iterate over properties of objects like "indexOf"
	          if (!options.hasOwnProperty(name)) {
	            continue;
	          }
	
	          src = target[name];
	          copy = options[name];
	
	          // Prevent never-ending loop
	          if (target === copy) {
	            continue;
	          }
	
	          // Recurse if we're merging plain objects or arrays
	          if (deep && copy && (copy.constructor == Object || (copyIsArray = (copy.constructor == Array)))) {
	            if (copyIsArray) {
	              copyIsArray = false;
	              // Overwrite the source with a copy of the array to merge in
	              clone = [];
	            } else {
	              clone = src && src.constructor == Object ? src : {};
	            }
	
	            // Never move original objects, clone them
	            target[name] = Util.merge(clone, copy);
	
	          // Don't bring in undefined values
	          } else if (copy !== undefined) {
	            target[name] = copy;
	          }
	        }
	      }
	    }
	
	    // Return the modified object
	    return target;
	  },
	
	  copy: function(obj) {
	    var dest;
	    if (typeof obj === 'object') {
	      if (obj.constructor == Object) {
	        dest = {};
	      } else if (obj.constructor == Array) {
	        dest = [];
	      }
	    }
	
	    Util.merge(dest, obj);
	    return dest;
	  },
	
	  parseUriOptions: {
	    strictMode: false,
	    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	    q:   {
	      name:   "queryKey",
	      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	    },
	    parser: {
	      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
	      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	    }
	  },
	
	  parseUri: function(str) {
	    if (!str || (typeof str !== 'string' && !(str instanceof String))) {
	      throw new Error('Util.parseUri() received invalid input');
	    }
	
	    var o = Util.parseUriOptions;
	    var m = o.parser[o.strictMode ? "strict" : "loose"].exec(str);
	    var uri = {};
	    var i = 14;
	
	    while (i--) {
	      uri[o.key[i]] = m[i] || "";
	    }
	
	    uri[o.q.name] = {};
	    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
	      if ($1) {
	        uri[o.q.name][$1] = $2;
	      }
	    });
	
	    return uri;
	  },
	
	  sanitizeUrl: function(url) {
	    if (!url || (typeof url !== 'string' && !(url instanceof String))) {
	      throw new Error('Util.sanitizeUrl() received invalid input');
	    }
	
	    var baseUrlParts = Util.parseUri(url);
	    // remove a trailing # if there is no anchor
	    if (baseUrlParts.anchor === '') {
	      baseUrlParts.source = baseUrlParts.source.replace('#', '');
	    }
	
	    url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
	    return url;
	  },
	
	  traverse: function(obj, func) {
	    var k;
	    var v;
	    var i;
	    var isObj = typeof obj === 'object';
	    var keys = [];
	
	    if (isObj) {
	      if (obj.constructor === Object) {
	        for (k in obj) {
	          if (obj.hasOwnProperty(k)) {
	            keys.push(k);
	          }
	        }
	      } else if (obj.constructor === Array) {
	        for (i = 0; i < obj.length; ++i) {
	          keys.push(i);
	        }
	      }
	    }
	
	    for (i = 0; i < keys.length; ++i) {
	      k = keys[i];
	      v = obj[k];
	      isObj = typeof v === 'object';
	      if (isObj) {
	        if (v === null) {
	          obj[k] = func(k, v);
	        } else if (v.constructor === Object) {
	          obj[k] = Util.traverse(v, func);
	        } else if (v.constructor === Array) {
	          obj[k] = Util.traverse(v, func);
	        } else {
	          obj[k] = func(k, v);
	        }
	      } else {
	        obj[k] = func(k, v);
	      }
	    }
	
	    return obj;
	
	  },
	
	  redact: function(val) {
	    val = String(val);
	    return new Array(val.length + 1).join('*');
	  },
	
	  // from http://stackoverflow.com/a/8809472/1138191
	  uuid4: function() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r = (d + Math.random()*16)%16 | 0;
	      d = Math.floor(d/16);
	      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var RollbarJSON = null;
	
	function setupJSON(JSON) {
	  RollbarJSON = JSON;
	}
	
	var XHR = {
	  XMLHttpFactories: [
	      function () {return new XMLHttpRequest();},
	      function () {return new ActiveXObject("Msxml2.XMLHTTP");},
	      function () {return new ActiveXObject("Msxml3.XMLHTTP");},
	      function () {return new ActiveXObject("Microsoft.XMLHTTP");}
	  ],
	  createXMLHTTPObject: function() {
	    var xmlhttp = false;
	    var factories = XHR.XMLHttpFactories;
	    var i;
	    var numFactories = factories.length;
	    for (i = 0; i < numFactories; i++) {
	      try {
	        xmlhttp = factories[i]();
	        break;
	      } catch (e) {
	        // pass
	      }
	    }
	    return xmlhttp;
	  },
	  post: function(url, accessToken, payload, callback) {
	    if (typeof payload !== 'object') {
	      throw new Error('Expected an object to POST');
	    }
	    payload = RollbarJSON.stringify(payload);
	    callback = callback || function() {};
	    var request = XHR.createXMLHTTPObject();
	    if (request) {
	      try {
	        try {
	          var onreadystatechange = function(args) {
	            try {
	              if (onreadystatechange && request.readyState === 4) {
	                onreadystatechange = undefined;
	
	                // TODO(cory): have the notifier log an internal error on non-200 response codes
	                if (request.status === 200) {
	                  callback(null, RollbarJSON.parse(request.responseText));
	                } else if (typeof(request.status) === "number" &&
	                            request.status >= 400  && request.status < 600) {
	                  // return valid http status codes
	                  callback(new Error(request.status.toString()));
	                } else {
	                  // IE will return a status 12000+ on some sort of connection failure,
	                  // so we return a blank error
	                  // http://msdn.microsoft.com/en-us/library/aa383770%28VS.85%29.aspx
	                  callback(new Error());
	                }
	              }
	            } catch (ex) {
	              //jquery source mentions firefox may error out while accessing the
	              //request members if there is a network error
	              //https://github.com/jquery/jquery/blob/a938d7b1282fc0e5c52502c225ae8f0cef219f0a/src/ajax/xhr.js#L111
	              var exc;
	              if (typeof ex === 'object' && ex.stack) {
	                exc = ex;
	              } else {
	                exc = new Error(ex);
	              }
	              callback(exc);
	            }
	          };
	
	          request.open('POST', url, true);
	          if (request.setRequestHeader) {
	            request.setRequestHeader('Content-Type', 'application/json');
	            request.setRequestHeader('X-Rollbar-Access-Token', accessToken);
	          }
	          request.onreadystatechange = onreadystatechange;
	          request.send(payload);
	        } catch (e1) {
	          // Sending using the normal xmlhttprequest object didn't work, try XDomainRequest
	          if (typeof XDomainRequest !== "undefined") {
	            var ontimeout = function(args) {
	              callback(new Error());
	            };
	
	            var onerror = function(args) {
	              callback(new Error());
	            };
	
	            var onload = function(args) {
	              callback(null, RollbarJSON.parse(request.responseText));
	            };
	
	            request = new XDomainRequest();
	            request.onprogress = function() {};
	            request.ontimeout = ontimeout;
	            request.onerror = onerror;
	            request.onload = onload;
	            request.open('POST', url, true);
	            request.send(payload);
	          }
	        }
	      } catch (e2) {
	        callback(e2);
	      }
	    }
	  }
	};
	
	module.exports = {
	  XHR: XHR,
	  setupJSON: setupJSON
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var _shimCounter = 0;
	
	function Rollbar(parentShim) {
	  this.shimId = ++_shimCounter;
	  this.notifier = null;
	  this.parentShim = parentShim;
	  this.logger = function() {};
	
	  if (window.console) {
	    if (window.console.shimId === undefined) {
	      this.logger = window.console.log;
	    }
	  }
	}
	
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
	
	Rollbar.init = function(window, config) {
	  var alias = config.globalAlias || 'Rollbar';
	  if (typeof window[alias] === 'object') {
	    return window[alias];
	  }
	
	  // Expose the global shim queue
	  window._rollbarShimQueue = [];
	  window._rollbarWrappedError = null;
	
	  config = config || {};
	
	  var client = new Rollbar();
	
	  return (_wrapInternalErr(function() {
	    client.configure(config);
	
	    if (config.captureUncaught) {
	      // Create the client and set the onerror handler
	      var old = window.onerror;
	
	      window.onerror = function() {
	        var args = Array.prototype.slice.call(arguments, 0);
	        _rollbarWindowOnError(client, old, args);
	      };
	
	      // Adapted from https://github.com/bugsnag/bugsnag-js
	      var globals = "EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");
	
	      var i;
	      var global;
	      for (i = 0; i < globals.length; ++i) {
	        global = globals[i];
	
	        if (window[global] && window[global].prototype) {
	          _extendListenerPrototype(client, window[global].prototype);
	        }
	      }
	    }
	
	    // Expose Rollbar globally
	    window[alias] = client;
	    return client;
	  }, client.logger))();
	};
	
	Rollbar.prototype.loadFull = function(window, document, immediate, config, callback) {
	  var self = this;
	  // Create the main rollbar script loader
	  var loader = _wrapInternalErr(function() {
	    var s = document.createElement("script");
	    var f = document.getElementsByTagName("script")[0];
	    s.src = config.rollbarJsUrl;
	    s.async = !immediate;
	
	    // NOTE(cory): this may not work for some versions of IE
	    s.onload = handleLoadErr;
	
	    f.parentNode.insertBefore(s, f);
	  }, this.logger);
	
	  var handleLoadErr = _wrapInternalErr(function() {
	    var err;
	    if (window._rollbarPayloadQueue === undefined) {
	      // rollbar.js did not load correctly, call any queued callbacks
	      // with an error.
	      var obj;
	      var cb;
	      var args;
	      var i;
	
	      err = new Error('rollbar.js did not load');
	
	      // Go through each of the shim objects. If one of their args
	      // was a function, treat it as the callback and call it with
	      // err as the first arg.
	      while ((obj = window._rollbarShimQueue.shift())) {
	        args = obj.args;
	        for (i = 0; i < args.length; ++i) {
	          cb = args[i];
	          if (typeof cb === 'function') {
	            cb(err);
	            break;
	          }
	        }
	      }
	    }
	    if (typeof callback === 'function') {
	      callback(err);
	    }
	  }, this.logger);
	
	  (_wrapInternalErr(function() {
	    if (immediate) {
	      loader();
	    } else {
	      // Have the window load up the script ASAP
	      if (window.addEventListener) {
	        window.addEventListener("load", loader, false);
	      } else { 
	        window.attachEvent("onload", loader);
	      }
	    }
	  }, this.logger))();
	};
	
	Rollbar.prototype.wrap = function(f, context) {
	  try {
	    var _this = this;
	    var ctxFn;
	    if (typeof context === 'function') {
	      ctxFn = context;
	    } else {
	      ctxFn = function() { return context || {}; };
	    }
	
	    if (typeof f !== 'function') {
	      return f;
	    }
	
	    if (f._isWrap) {
	      return f;
	    }
	
	    if (!f._wrapped) {
	      f._wrapped = function () {
	        try {
	          return f.apply(this, arguments);
	        } catch(e) {
	          e._rollbarContext = ctxFn() || {};
	          e._rollbarContext._wrappedSource = f.toString();
	
	          window._rollbarWrappedError = e;
	          throw e;
	        }
	      };
	
	      f._wrapped._isWrap = true;
	
	      for (var prop in f) {
	        if (f.hasOwnProperty(prop)) {
	          f._wrapped[prop] = f[prop];
	        }
	      }
	    }
	
	    return f._wrapped;
	  } catch (e) {
	    // Try-catch here is to work around issue where wrap() fails when used inside Selenium.
	    // Return the original function if the wrap fails.
	    return f;
	  }
	};
	
	// Stub out rollbar.js methods
	function stub(method) {
	  var R = Rollbar;
	  return _wrapInternalErr(function() {
	    if (this.notifier) {
	      return this.notifier[method].apply(this.notifier, arguments);
	    } else {
	      var shim = this;
	      var isScope = method === 'scope';
	      if (isScope) {
	        shim = new R(this);
	      }
	      var args = Array.prototype.slice.call(arguments, 0);
	      var data = {shim: shim, method: method, args: args, ts: new Date()};
	      window._rollbarShimQueue.push(data);
	
	      if (isScope) {
	        return shim;
	      }
	    }
	  });
	}
	
	function _extendListenerPrototype(client, prototype) {
	  if (prototype.hasOwnProperty && prototype.hasOwnProperty('addEventListener')) {
	    var oldAddEventListener = prototype.addEventListener;
	    prototype.addEventListener = function(event, callback, bubble) {
	      oldAddEventListener.call(this, event, client.wrap(callback), bubble);
	    };
	
	    var oldRemoveEventListener = prototype.removeEventListener;
	    prototype.removeEventListener = function(event, callback, bubble) {
	      oldRemoveEventListener.call(this, event, (callback && callback._wrapped) ? callback._wrapped : callback, bubble);
	    };
	  }
	}
	
	function _wrapInternalErr(f, logger) {
	  logger = logger || this.logger;
	  return function() {
	    try {
	      return f.apply(this, arguments);
	    } catch (e) {
	      logger('Rollbar internal error:', e);
	    }
	  };
	}
	
	var _methods = 'log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError'.split(',');
	for (var i = 0; i < _methods.length; ++i) {
	  Rollbar.prototype[_methods[i]] = stub(_methods[i]);
	}
	
	module.exports = Rollbar;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(19);
	var Util = __webpack_require__(13);
	var xhr = __webpack_require__(14);
	
	var XHR = xhr.XHR;
	var RollbarJSON = null;
	
	function setupJSON(JSON) {
	  RollbarJSON = JSON;
	  xhr.setupJSON(JSON);
	}
	
	// Updated by the build process to match package.json
	Notifier.NOTIFIER_VERSION = '1.2.2';
	Notifier.DEFAULT_ENDPOINT = 'api.rollbar.com/api/1/';
	Notifier.DEFAULT_SCRUB_FIELDS = ["pw","pass","passwd","password","secret","confirm_password","confirmPassword","password_confirmation","passwordConfirmation","access_token","accessToken","secret_key","secretKey","secretToken"];
	Notifier.DEFAULT_LOG_LEVEL = 'debug';
	Notifier.DEFAULT_REPORT_LEVEL = 'debug';
	Notifier.DEFAULT_UNCAUGHT_ERROR_LEVEL = 'warning';
	Notifier.DEFAULT_ITEMS_PER_MIN = 60;
	Notifier.DEFAULT_MAX_ITEMS = 0;
	
	Notifier.LEVELS = {
	  debug: 0,
	  info: 1,
	  warning: 2,
	  error: 3,
	  critical: 4
	};
	
	// This is the global queue where all notifiers will put their
	// payloads to be sent to Rollbar.
	window._rollbarPayloadQueue = [];
	
	// This contains global options for all Rollbar notifiers.
	window._globalRollbarOptions = {
	  startTime: (new Date()).getTime(),
	  maxItems: Notifier.DEFAULT_MAX_ITEMS,
	  itemsPerMinute: Notifier.DEFAULT_ITEMS_PER_MIN
	};
	
	var TK = computeStackTraceWrapper({remoteFetching: false, linesOfContext: 3});
	var _topLevelNotifier;
	
	function Notifier(parentNotifier) {
	  // Save the first notifier so we can use it to send system messages like
	  // when the rate limit is reached.
	  _topLevelNotifier = _topLevelNotifier || this;
	
	  var protocol = window.location.protocol;
	  if (protocol.indexOf('http') !== 0) {
	    protocol = 'https:';
	  }
	  var endpoint = protocol + '//' + Notifier.DEFAULT_ENDPOINT;
	  this.options = {
	    enabled: true,
	    endpoint: endpoint,
	    environment: 'production',
	    scrubFields: Util.copy(Notifier.DEFAULT_SCRUB_FIELDS),
	    checkIgnore: null,
	    logLevel: Notifier.DEFAULT_LOG_LEVEL,
	    reportLevel: Notifier.DEFAULT_REPORT_LEVEL,
	    uncaughtErrorLevel: Notifier.DEFAULT_UNCAUGHT_ERROR_LEVEL,
	    payload: {}
	  };
	
	  this.lastError = null;
	  this.plugins = {};
	  this.parentNotifier = parentNotifier;
	  this.logger = function() {
	    if (window.console && typeof window.console.log === 'function') {
	      var args = ['Rollbar:'].concat(Array.prototype.slice.call(arguments, 0));
	      window.console.log(args);
	    }
	  };
	
	  if (parentNotifier) {
	    // If the parent notifier has the shimId
	    // property it means that it's a Rollbar shim.
	    if (parentNotifier.hasOwnProperty('shimId')) {
	      // After we set this, the shim is just a proxy to this
	      // Notifier instance.
	      parentNotifier.notifier = this;
	    } else {
	      this.logger = parentNotifier.logger;
	      this.configure(parentNotifier.options);
	    }
	  }
	}
	
	
	Notifier._generateLogFn = function(level) {
	  return _wrapNotifierFn(function _logFn() {
	    var args = this._getLogArgs(arguments);
	
	    return this._log(level || args.level || this.options.logLevel || Notifier.DEFAULT_LOG_LEVEL,
	        args.message, args.err, args.custom, args.callback);
	  });
	};
	
	
	/*
	 * Returns an Object with keys:
	 * {
	 *  message: String,
	 *  err: Error,
	 *  custom: Object
	 * }
	 */
	Notifier.prototype._getLogArgs = function(args) {
	  var level = this.options.logLevel || Notifier.DEFAULT_LOG_LEVEL;
	  var ts;
	  var message;
	  var err;
	  var custom;
	  var callback;
	
	  var argT;
	  var arg;
	  for (var i = 0; i < args.length; ++i) {
	    arg = args[i];
	    argT = typeof arg;
	    if (argT === 'string') {
	      message = arg;
	    } else if (argT === 'function') {
	      callback = _wrapNotifierFn(arg, this);  // wrap the callback in a try/catch block
	    } else if (arg && argT === 'object') {
	      if (arg.constructor.name === 'Date') {
	        ts = arg;
	      } else if (arg instanceof Error ||
	          arg.prototype === Error.prototype ||
	          arg.hasOwnProperty('stack') ||
	          (typeof DOMException !== "undefined" && arg instanceof DOMException)) {
	        err = arg;
	      } else {
	        custom = arg;
	      }
	    }
	  }
	
	  // TODO(cory): somehow pass in timestamp too...
	
	  return {
	    level: level,
	    message: message,
	    err: err,
	    custom: custom,
	    callback: callback
	  };
	};
	
	
	Notifier.prototype._route = function(path) {
	  var endpoint = this.options.endpoint;
	
	  var endpointTrailingSlash = /\/$/.test(endpoint);
	  var pathBeginningSlash = /^\//.test(path);
	
	  if (endpointTrailingSlash && pathBeginningSlash) {
	    path = path.substring(1);
	  } else if (!endpointTrailingSlash && !pathBeginningSlash) {
	    path = '/' + path;
	  }
	
	  return endpoint + path;
	};
	
	
	/*
	 * Given a queue containing each call to the shim, call the
	 * corresponding method on this instance.
	 *
	 * shim queue contains:
	 *
	 * {shim: Rollbar, method: 'info', args: ['hello world', exc], ts: Date}
	 */
	Notifier.prototype._processShimQueue = function(shimQueue) {
	  // implement me
	  var shim;
	  var obj;
	  var tmp;
	  var method;
	  var args;
	  var shimToNotifier = {};
	  var parentShim;
	  var parentNotifier;
	  var notifier;
	
	  // For each of the messages in the shimQueue we need to:
	  // 1. get/create the notifier for that shim
	  // 2. apply the message to the notifier
	  while ((obj = shimQueue.shift())) {
	    shim = obj.shim;
	    method = obj.method;
	    args = obj.args;
	    parentShim = shim.parentShim;
	
	    // Get the current notifier based on the shimId
	    notifier = shimToNotifier[shim.shimId];
	    if (!notifier) {
	
	      // If there is no notifier associated with the shimId
	      // Check to see if there's a parent shim
	      if (parentShim) {
	
	        // If there is a parent shim, get the parent notifier
	        // and create a new notifier for the current shim.
	        parentNotifier = shimToNotifier[parentShim.shimId];
	
	        // Create a new Notifier which will process all of the shim's
	        // messages
	        notifier = new Notifier(parentNotifier);
	      } else {
	        // If there is no parent, assume the shim is the top
	        // level shim and thus, should use this as the notifier.
	        notifier = this;
	      }
	
	      // Save off the shimId->notifier mapping
	      shimToNotifier[shim.shimId] = notifier;
	    }
	
	    if (notifier[method] && typeof notifier[method] === 'function') {
	      notifier[method].apply(notifier, args);
	    }
	  }
	};
	
	
	/*
	 * Builds and returns an Object that will be enqueued onto the
	 * window._rollbarPayloadQueue array to be sent to Rollbar.
	 */
	Notifier.prototype._buildPayload = function(ts, level, message, stackInfo, custom) {
	  var accessToken = this.options.accessToken;
	
	  // NOTE(cory): DEPRECATED
	  // Pass in {payload: {environment: 'production'}} instead of just {environment: 'production'}
	  var environment = this.options.environment;
	
	  var notifierOptions = Util.copy(this.options.payload);
	  var uuid = Util.uuid4();
	
	  if (Notifier.LEVELS[level] === undefined) {
	    throw new Error('Invalid level');
	  }
	
	  if (!message && !stackInfo && !custom) {
	    throw new Error('No message, stack info or custom data');
	  }
	
	  var payloadData = {
	    environment: environment,
	    endpoint: this.options.endpoint,
	    uuid: uuid,
	    level: level,
	    platform: 'browser',
	    framework: 'browser-js',
	    language: 'javascript',
	    body: this._buildBody(message, stackInfo, custom),
	    request: {
	      url: window.location.href,
	      query_string: window.location.search,
	      user_ip: "$remote_ip"
	    },
	    client: {
	      runtime_ms: ts.getTime() - window._globalRollbarOptions.startTime,
	      timestamp: Math.round(ts.getTime() / 1000),
	      javascript: {
	        browser: window.navigator.userAgent,
	        language: window.navigator.language,
	        cookie_enabled: window.navigator.cookieEnabled,
	        screen: {
	          width: window.screen.width,
	          height: window.screen.height
	        },
	        plugins: this._getBrowserPlugins()
	      }
	    },
	    server: {},
	    notifier: {
	      name: 'rollbar-browser-js',
	      version: Notifier.NOTIFIER_VERSION
	    }
	  };
	
	  if (notifierOptions.body) {
	    delete notifierOptions.body;
	  }
	
	  // Overwrite the options from configure() with the payload
	  // data.
	  var payload = {
	    access_token: accessToken,
	    data: Util.merge(payloadData, notifierOptions)
	  };
	
	  // Only scrub the data section since we never want to scrub "access_token"
	  // even if it's in the scrub fields
	  this._scrub(payload.data);
	
	  return payload;
	};
	
	
	Notifier.prototype._buildBody = function(message, stackInfo, custom) {
	  var body;
	  if (stackInfo && stackInfo.mode !== 'failed') {
	    body = this._buildPayloadBodyTrace(message, stackInfo, custom);
	  } else {
	    body = this._buildPayloadBodyMessage(message, custom);
	  }
	  return body;
	};
	
	
	Notifier.prototype._buildPayloadBodyMessage = function(message, custom) {
	  if (!message) {
	    if (custom) {
	      message = RollbarJSON.stringify(custom);
	    } else {
	      message = '';
	    }
	  }
	  var result = {
	    body: message
	  };
	
	  if (custom) {
	    result.extra = Util.copy(custom);
	  }
	
	  return {
	    message: result
	  };
	};
	
	
	Notifier.prototype._buildPayloadBodyTrace = function(description, stackInfo, custom) {
	  var guess = _guessErrorClass(stackInfo.message);
	  var className = stackInfo.name || guess[0];
	  var message = guess[1];
	  var trace = {
	    exception: {
	      'class': className,
	      message: message
	    }
	  };
	
	  if (description) {
	    trace.exception.description = description || 'uncaught exception';
	  }
	
	  // Transform a TraceKit stackInfo object into a Rollbar trace
	  if (stackInfo.stack) {
	    var stackFrame;
	    var frame;
	    var code;
	    var pre;
	    var post;
	    var contextLength;
	    var i, j, mid;
	
	    trace.frames = [];
	    for (i = 0; i < stackInfo.stack.length; ++i) {
	      stackFrame = stackInfo.stack[i];
	      frame = {
	        filename: stackFrame.url ? Util.sanitizeUrl(stackFrame.url) : '(unknown)',
	        lineno: stackFrame.line || null,
	        method: (!stackFrame.func || stackFrame.func === '?') ? '[anonymous]' : stackFrame.func,
	        colno: stackFrame.column
	      };
	
	      code = pre = post = null;
	      contextLength = stackFrame.context ? stackFrame.context.length : 0;
	      if (contextLength) {
	        mid = Math.floor(contextLength / 2);
	        pre = stackFrame.context.slice(0, mid);
	        code = stackFrame.context[mid];
	        post = stackFrame.context.slice(mid);
	      }
	
	      if (code) {
	        frame.code = code;
	      }
	
	      if (pre || post) {
	        frame.context = {};
	        if (pre && pre.length) {
	          frame.context.pre = pre;
	        }
	        if (post && post.length) {
	          frame.context.post = post;
	        }
	      }
	
	      if (stackFrame.args) {
	        frame.args = stackFrame.args;
	      }
	
	      trace.frames.push(frame);
	    }
	    if (custom) {
	      trace.extra = Util.copy(custom);
	    }
	    return {trace: trace};
	  } else {
	    // no frames - not useful as a trace. just report as a message.
	    return this._buildPayloadBodyMessage(className + ': ' + message, custom);
	  }
	};
	
	
	Notifier.prototype._getBrowserPlugins = function() {
	  if (!this._browserPlugins) {
	    var navPlugins = (window.navigator.plugins || []);
	    var cur;
	    var numPlugins = navPlugins.length;
	    var plugins = [];
	    var i;
	    for (i = 0; i < numPlugins; ++i) {
	      cur = navPlugins[i];
	      plugins.push({name: cur.name, description: cur.description});
	    }
	    this._browserPlugins = plugins;
	  }
	  return this._browserPlugins;
	};
	
	
	/*
	 * Does an in-place modification of obj such that:
	 * 1. All keys that match the notifier's options.scrubFields
	 *    list will be normalized into all '*'
	 * 2. Any query string params that match the same criteria will have
	 *    their values normalized as well.
	 */
	Notifier.prototype._scrub = function(obj) {
	  function redactQueryParam(match, paramPart, dummy1,
	      dummy2, dummy3, valPart, offset, string) {
	    return paramPart + Util.redact(valPart);
	  }
	
	  function paramScrubber(v) {
	    var i;
	    if (typeof(v) === 'string') {
	      for (i = 0; i < queryRes.length; ++i) {
	        v = v.replace(queryRes[i], redactQueryParam);
	      }
	    }
	    return v;
	  }
	
	  function valScrubber(k, v) {
	    var i;
	    for (i = 0; i < paramRes.length; ++i) {
	      if (paramRes[i].test(k)) {
	        v = Util.redact(v);
	        break;
	      }
	    }
	    return v;
	  }
	
	  function scrubber(k, v) {
	    var tmpV = valScrubber(k, v);
	    if (tmpV === v) {
	      return paramScrubber(tmpV);
	    } else {
	      return tmpV;
	    }
	  }
	
	  var scrubFields = this.options.scrubFields;
	  var paramRes = this._getScrubFieldRegexs(scrubFields);
	  var queryRes = this._getScrubQueryParamRegexs(scrubFields);
	
	  Util.traverse(obj, scrubber);
	  return obj;
	};
	
	
	Notifier.prototype._getScrubFieldRegexs = function(scrubFields) {
	  var ret = [];
	  var pat;
	  for (var i = 0; i < scrubFields.length; ++i) {
	    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
	    ret.push(new RegExp(pat, 'i'));
	  }
	  return ret;
	};
	
	
	Notifier.prototype._getScrubQueryParamRegexs = function(scrubFields) {
	  var ret = [];
	  var pat;
	  for (var i = 0; i < scrubFields.length; ++i) {
	    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
	    ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
	  }
	  return ret;
	};
	
	Notifier.prototype._urlIsWhitelisted = function(payload){
	  var whitelist, trace, frame, filename, frameLength, url, listLength, urlRegex;
	  var i, j;
	
	  try {
	    whitelist = this.options.hostWhiteList;
	    trace = payload.data.body.trace;
	
	    if (!whitelist || whitelist.length === 0) { return true; }
	    if (!trace) { return true; }
	
	    listLength = whitelist.length;
	    frameLength = trace.frames.length;
	    for (i = 0; i < frameLength; i++) {
	      frame = trace.frames[i];
	      filename = frame.filename;
	      if (typeof filename !== "string") { return true; }
	      for (j = 0; j < listLength; j++) {
	        url = whitelist[j];
	        urlRegex = new RegExp(url);
	
	        if (urlRegex.test(filename)){
	          return true;
	        }
	      }
	    }
	  } catch (e) {
	    this.configure({hostWhiteList: null});
	    this.error("Error while reading your configuration's hostWhiteList option. Removing custom hostWhiteList.", e);
	    return true;
	  }
	
	  return false;
	};
	
	Notifier.prototype._messageIsIgnored = function(payload){
	  var exceptionMessage, i, ignoredMessages, len, messageIsIgnored, rIgnoredMessage, trace;
	  try {
	    messageIsIgnored = false;
	    ignoredMessages = this.options.ignoredMessages;
	    trace = payload.data.body.trace;
	
	    if(!ignoredMessages || ignoredMessages.length === 0) { return false; }
	    if(!trace) { return false; }
	    exceptionMessage = trace.exception.message;
	
	    len = ignoredMessages.length;
	    for(i=0; i < len; i++) {
	      rIgnoredMessage = new RegExp(ignoredMessages[i], "gi");
	      messageIsIgnored = rIgnoredMessage.test(exceptionMessage);
	
	      if(messageIsIgnored){
	        break;
	      }
	    }
	  }
	  catch(e) {
	    this.configure({ignoredMessages: null});
	    this.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.");
	  }
	
	  return messageIsIgnored;
	};
	
	Notifier.prototype._enqueuePayload = function(payload, isUncaught, callerArgs, callback) {
	
	  var payloadToSend = {
	    callback: callback,
	    accessToken: this.options.accessToken,
	    endpointUrl: this._route('item/'),
	    payload: payload
	  };
	
	  var ignoredCallback = function() {
	    if (callback) {
	      // If the item was ignored call the callback anyway
	      var msg = 'This item was not sent to Rollbar because it was ignored. ' +
	                'This can happen if a custom checkIgnore() function was used ' +
	                'or if the item\'s level was less than the notifier\' reportLevel. ' +
	                'See https://rollbar.com/docs/notifier/rollbar.js/configuration for more details.';
	
	      callback(null, {err: 0, result: {id: null, uuid: null, message: msg}});
	    }
	  };
	
	  // Internal checkIgnore will check the level against the minimum
	  // report level from this.options
	  if (this._internalCheckIgnore(isUncaught, callerArgs, payload)) {
	    ignoredCallback();
	    return;
	  }
	
	  // Users can set their own ignore criteria using this.options.checkIgnore()
	  try {
	    if (this.options.checkIgnore &&
	        typeof this.options.checkIgnore === 'function' &&
	        this.options.checkIgnore(isUncaught, callerArgs, payload)) {
	      ignoredCallback();
	      return;
	    }
	  } catch (e) {
	    // Disable the custom checkIgnore and report errors in the checkIgnore function
	    this.configure({checkIgnore: null});
	    this.error('Error while calling custom checkIgnore() function. Removing custom checkIgnore().', e);
	  }
	
	  if (!this._urlIsWhitelisted(payload)) {
	    return;
	  }
	
	  if (this._messageIsIgnored(payload)) {
	    return;
	  }
	
	  if (this.options.verbose) {
	    if (payload.data && payload.data.body && payload.data.body.trace) {
	      var trace = payload.data.body.trace;
	      var exceptionMessage = trace.exception.message;
	      this.logger(exceptionMessage);
	    }
	
	    // FIXME: Some browsers do not output objects as json to the console, and
	    // instead write [object Object], so let's write the message first to ensure that is logged.
	    this.logger('Sending payload -', payloadToSend);
	  }
	
	  if (typeof this.options.logFunction === "function") {
	    this.options.logFunction(payloadToSend);
	  }
	
	  try {
	    if (typeof this.options.transform === 'function') {
	      this.options.transform(payload);
	    }
	  } catch (e) {
	    this.configure({transform: null});
	    this.error('Error while calling custom transform() function. Removing custom transform().', e);
	  }
	
	  if (!!this.options.enabled) {
	    window._rollbarPayloadQueue.push(payloadToSend);
	  }
	};
	
	
	Notifier.prototype._internalCheckIgnore = function(isUncaught, callerArgs, payload) {
	  var level = callerArgs[0];
	  var levelVal = Notifier.LEVELS[level] || 0;
	  var reportLevel = Notifier.LEVELS[this.options.reportLevel] || 0;
	
	  if (levelVal < reportLevel) {
	    return true;
	  }
	
	  var plugins = this.options ? this.options.plugins : {};
	  if (plugins && plugins.jquery && plugins.jquery.ignoreAjaxErrors &&
	        payload.body.message) {
	    return payload.body.messagejquery_ajax_error;
	  }
	
	  return false;
	};
	
	
	/*
	 * Logs stuff to Rollbar using the default
	 * logging level.
	 *
	 * Can be called with the following, (order doesn't matter but type does):
	 * - message: String
	 * - err: Error object, must have a .stack property or it will be
	 *   treated as custom data
	 * - custom: Object containing custom data to be sent along with
	 *   the item
	 * - callback: Function to call once the item is reported to Rollbar
	 * - isUncaught: True if this error originated from an uncaught exception handler
	 * - ignoreRateLimit: True if this item should be allowed despite rate limit checks
	 */
	Notifier.prototype._log = function(level, message, err, custom, callback, isUncaught, ignoreRateLimit) {
	  var stackInfo = null;
	  if (err) {
	    // If we've already calculated the stack trace for the error, use it.
	    // This can happen for wrapped errors that don't have a "stack" property.
	    stackInfo = err._tkStackTrace ? err._tkStackTrace : TK(err);
	
	    // Don't report the same error more than once
	    if (err === this.lastError) {
	      return;
	    }
	
	    this.lastError = err;
	  }
	
	  var payload = this._buildPayload(new Date(), level, message, stackInfo, custom);
	  if (ignoreRateLimit) {
	    payload.ignoreRateLimit = true;
	  }
	  this._enqueuePayload(payload, isUncaught ? true : false, [level, message, err, custom], callback);
	};
	
	Notifier.prototype.log = Notifier._generateLogFn();
	Notifier.prototype.debug = Notifier._generateLogFn('debug');
	Notifier.prototype.info = Notifier._generateLogFn('info');
	Notifier.prototype.warn = Notifier._generateLogFn('warning'); // for console.warn() compatibility
	Notifier.prototype.warning = Notifier._generateLogFn('warning');
	Notifier.prototype.error = Notifier._generateLogFn('error');
	Notifier.prototype.critical = Notifier._generateLogFn('critical');
	
	// Adapted from tracekit.js
	Notifier.prototype.uncaughtError = _wrapNotifierFn(function(message, url, lineNo, colNo, err, context) {
	  context = context || null;
	  if (err && err.stack) {
	    this._log(this.options.uncaughtErrorLevel, message, err, context, null, true);
	    return;
	  }
	
	  // NOTE(cory): sometimes users will trigger an "error" event
	  // on the window object directly which will result in errMsg
	  // being an Object instead of a string.
	  //
	  if (url && url.stack) {
	    this._log(this.options.uncaughtErrorLevel, message, url, context, null, true);
	    return;
	  }
	
	  var location = {
	    'url': url || '',
	    'line': lineNo
	  };
	  location.func = TK.guessFunctionName(location.url, location.line);
	  location.context = TK.gatherContext(location.url, location.line);
	  var stack = {
	    'mode': 'onerror',
	    'message': message || 'uncaught exception',
	    'url': document.location.href,
	    'stack': [location],
	    'useragent': navigator.userAgent
	  };
	  if (err) {
	    stack = err._tkStackTrace || TK(err);
	  }
	
	  var payload = this._buildPayload(new Date(), this.options.uncaughtErrorLevel, message, stack);
	  this._enqueuePayload(payload, true, [this.options.uncaughtErrorLevel, message, url, lineNo, colNo, err]);
	});
	
	
	Notifier.prototype.global = _wrapNotifierFn(function(options) {
	  options = options || {};
	  Util.merge(window._globalRollbarOptions, options);
	  if (options.maxItems !== undefined) {
	    rateLimitCounter = 0;
	  }
	
	  if (options.itemsPerMinute !== undefined) {
	    rateLimitPerMinCounter = 0;
	  }
	});
	
	
	Notifier.prototype.configure = _wrapNotifierFn(function(options) {
	  // TODO(cory): only allow non-payload keys that we understand
	
	  // Make a copy of the options object for this notifier
	  Util.merge(this.options, options);
	});
	
	/*
	 * Create a new Notifier instance which has the same options
	 * as the current notifier + options to override them.
	 */
	Notifier.prototype.scope = _wrapNotifierFn(function(payloadOptions) {
	  var scopedNotifier = new Notifier(this);
	  Util.merge(scopedNotifier.options.payload, payloadOptions);
	  return scopedNotifier;
	});
	
	Notifier.prototype.wrap = function(f, context) {
	  var _this = this;
	  var ctxFn;
	  if (typeof context === 'function') {
	    ctxFn = context;
	  } else {
	    ctxFn = function() { return context || {}; };
	  }
	
	  if (typeof f !== 'function') {
	    return f;
	  }
	
	  // If the given function is already a wrapped function, just
	  // return it instead of wrapping twice
	  if (f._isWrap) {
	    return f;
	  }
	
	  if (!f._wrapped) {
	    f._wrapped = function () {
	      try {
	        return f.apply(this, arguments);
	      } catch(e) {
	        if (!e.stack) {
	          e._tkStackTrace = TK(e);
	        }
	        e._rollbarContext = ctxFn() || {};
	        e._rollbarContext._wrappedSource = f.toString();
	
	        window._rollbarWrappedError = e;
	        throw e;
	      }
	    };
	
	    f._wrapped._isWrap = true;
	
	    for (var prop in f) {
	      if (f.hasOwnProperty(prop)) {
	        f._wrapped[prop] = f[prop];
	      }
	    }
	  }
	
	  return f._wrapped;
	};
	
	/***** Misc *****/
	
	function _wrapNotifierFn(fn, ctx) {
	  return function() {
	    var self = ctx || this;
	    try {
	      return fn.apply(self, arguments);
	    } catch (e) {
	      if (self) {
	        self.logger(e);
	      }
	    }
	  };
	}
	
	
	var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');
	function _guessErrorClass(errMsg) {
	  if (!errMsg) {
	    return ["Unknown error. There was no error message to display.", ""];
	  }
	  var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
	  var errClass = '(unknown)';
	
	  if (errClassMatch) {
	    errClass = errClassMatch[errClassMatch.length - 1];
	    errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
	    errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
	  }
	  return [errClass, errMsg];
	}
	
	/***** Payload processor *****/
	
	var payloadProcessorTimeout;
	Notifier.processPayloads = function(immediate) {
	  if (!payloadProcessorTimeout || immediate) {
	    _payloadProcessorTimer(immediate);
	  }
	};
	
	
	function _payloadProcessorTimer(immediate) {
	  var payloadObj;
	  while ((payloadObj = window._rollbarPayloadQueue.shift())) {
	    _processPayload(payloadObj.endpointUrl, payloadObj.accessToken, payloadObj.payload, payloadObj.callback);
	  }
	  if (!immediate) {
	    payloadProcessorTimeout = setTimeout(_payloadProcessorTimer, 1000);
	  }
	}
	
	
	var rateLimitStartTime = new Date().getTime();
	var rateLimitCounter = 0;
	var rateLimitPerMinCounter = 0;
	function _processPayload(url, accessToken, payload, callback) {
	  callback = callback || function cb() {};
	  var now = new Date().getTime();
	  if (now - rateLimitStartTime >= 60000) {
	    rateLimitStartTime = now;
	    rateLimitPerMinCounter = 0;
	  }
	
	  // Check to see if we have a rate limit set or if
	  // the rate limit has been met/exceeded.
	  var globalRateLimit = window._globalRollbarOptions.maxItems;
	  var globalRateLimitPerMin = window._globalRollbarOptions.itemsPerMinute;
	  var checkOverRateLimit = function() { return !payload.ignoreRateLimit && globalRateLimit >= 1 && rateLimitCounter >= globalRateLimit; };
	  var checkOverRateLimitPerMin = function() { return !payload.ignoreRateLimit && globalRateLimitPerMin >= 1 && rateLimitPerMinCounter >= globalRateLimitPerMin; };
	
	  if (checkOverRateLimit()) {
	    callback(new Error(globalRateLimit + ' max items reached'));
	    return;
	  } else if (checkOverRateLimitPerMin()) {
	    callback(new Error(globalRateLimitPerMin + ' items per minute reached'));
	    return;
	  } else {
	    rateLimitCounter++;
	    rateLimitPerMinCounter++;
	
	    // Check to see if we have just reached the rate limit. If so, notify the customer.
	    if (checkOverRateLimit()) {
	      _topLevelNotifier._log(_topLevelNotifier.options.uncaughtErrorLevel, //level
	          'maxItems has been hit. Ignoring errors for the remainder of the current page load.', // message
	          null, // err
	          {maxItems: globalRateLimit}, // custom
	          null,  // callback
	          false, // isUncaught
	          true); // ignoreRateLimit
	    }
	    // remove this key since it's only used for internal notifier logic
	    if (payload.ignoreRateLimit) {
	      delete payload.ignoreRateLimit;
	    }
	  }
	
	  // There's either no rate limit or we haven't met it yet so
	  // go ahead and send it.
	  XHR.post(url, accessToken, payload, function xhrCallback(err, resp) {
	    if (err) {
	      return callback(err);
	    }
	
	    // TODO(cory): parse resp as JSON
	    return callback(null, resp);
	  });
	}
	
	module.exports = {
	  Notifier: Notifier,
	  setupJSON: setupJSON
	};


/***/ },
/* 17 */,
/* 18 */,
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9)(__webpack_require__(20)+"\n\n// SCRIPT-LOADER FOOTER\n//# sourceURL=script:///home/jon/rollbar/rollbar.js/vendor/trace.min.js")

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "function _isUndefined(a){return\"undefined\"==typeof a}function computeStackTraceWrapper(a){function b(a){if(!t)return\"\";try{var b=function(){try{return new window.XMLHttpRequest}catch(a){return new window.ActiveXObject(\"Microsoft.XMLHTTP\")}},c=b();return c.open(\"GET\",a,!1),c.send(\"\"),c.responseText}catch(d){return\"\"}}function c(a){if(!s.hasOwnProperty(a)){var c=\"\";-1!==a.indexOf(document.domain)&&(c=b(a)),s[a]=c?c.split(\"\\n\"):[]}return s[a]}function d(a,b){var d,e=/function ([^(]*)\\(([^)]*)\\)/,f=/['\"]?([0-9A-Za-z$_]+)['\"]?\\s*[:=]\\s*(function|eval|new Function)/,g=\"\",h=10,i=c(a);if(!i.length)return UNKNOWN_FUNCTION;for(var j=0;h>j;++j)if(g=i[b-j]+g,!_isUndefined(g)){if(d=f.exec(g))return d[1];if(d=e.exec(g))return d[1]}return UNKNOWN_FUNCTION}function e(a,b){var d=c(a);if(!d.length)return null;var e=[],f=Math.floor(u/2),g=f+u%2,h=Math.max(0,b-f-1),i=Math.min(d.length,b+g-1);b-=1;for(var j=h;i>j;++j)_isUndefined(d[j])||e.push(d[j]);return e.length>0?e:null}function f(a){return a.replace(/[\\-\\[\\]{}()*+?.,\\\\\\^$|#]/g,\"\\\\$&\")}function g(a){return f(a).replace(\"<\",\"(?:<|&lt;)\").replace(\">\",\"(?:>|&gt;)\").replace(\"&\",\"(?:&|&amp;)\").replace('\"','(?:\"|&quot;)').replace(/\\s+/g,\"\\\\s+\")}function h(a,b){for(var d,e,f=0,g=b.length;g>f;++f)if((d=c(b[f])).length&&(d=d.join(\"\\n\"),e=a.exec(d)))return{url:b[f],line:d.substring(0,e.index).split(\"\\n\").length,column:e.index-d.lastIndexOf(\"\\n\",e.index)-1};return null}function i(a,b,d){var e,g=c(b),h=new RegExp(\"\\\\b\"+f(a)+\"\\\\b\");return d-=1,g&&g.length>d&&(e=h.exec(g[d]))?e.index:null}function j(a){for(var b,c,d,e,i=[window.location.href],j=document.getElementsByTagName(\"script\"),k=\"\"+a,l=/^function(?:\\s+([\\w$]+))?\\s*\\(([\\w\\s,]*)\\)\\s*\\{\\s*(\\S[\\s\\S]*\\S)\\s*\\}\\s*$/,m=/^function on([\\w$]+)\\s*\\(event\\)\\s*\\{\\s*(\\S[\\s\\S]*\\S)\\s*\\}\\s*$/,n=0;n<j.length;++n){var o=j[n];o.src&&i.push(o.src)}if(d=l.exec(k)){var p=d[1]?\"\\\\s+\"+d[1]:\"\",q=d[2].split(\",\").join(\"\\\\s*,\\\\s*\");b=f(d[3]).replace(/;$/,\";?\"),c=new RegExp(\"function\"+p+\"\\\\s*\\\\(\\\\s*\"+q+\"\\\\s*\\\\)\\\\s*{\\\\s*\"+b+\"\\\\s*}\")}else c=new RegExp(f(k).replace(/\\s+/g,\"\\\\s+\"));if(e=h(c,i))return e;if(d=m.exec(k)){var r=d[1];if(b=g(d[2]),c=new RegExp(\"on\"+r+\"=[\\\\'\\\"]\\\\s*\"+b+\"\\\\s*[\\\\'\\\"]\",\"i\"),e=h(c,i[0]))return e;if(c=new RegExp(b),e=h(c,i))return e}return null}function k(a){if(!a.stack)return null;for(var b,c,f=/^\\s*at (?:((?:\\[object object\\])?\\S+(?: \\[as \\S+\\])?) )?\\(?((?:file|http|https):.*?):(\\d+)(?::(\\d+))?\\)?\\s*$/i,g=/^\\s*(\\S*)(?:\\((.*?)\\))?@((?:file|http|https).*?):(\\d+)(?::(\\d+))?\\s*$/i,h=a.stack.split(\"\\n\"),j=[],k=/^(.*) is undefined$/.exec(a.message),l=0,m=h.length;m>l;++l){if(b=g.exec(h[l]))c={url:b[3],func:b[1]||UNKNOWN_FUNCTION,args:b[2]?b[2].split(\",\"):\"\",line:+b[4],column:b[5]?+b[5]:null};else{if(!(b=f.exec(h[l])))continue;c={url:b[2],func:b[1]||UNKNOWN_FUNCTION,line:+b[3],column:b[4]?+b[4]:null}}!c.func&&c.line&&(c.func=d(c.url,c.line)),c.line&&(c.context=e(c.url,c.line)),j.push(c)}return j[0]&&j[0].line&&!j[0].column&&k&&(j[0].column=i(k[1],j[0].url,j[0].line)),j.length?{mode:\"stack\",name:a.name,message:a.message,url:document.location.href,stack:j,useragent:navigator.userAgent}:null}function l(a){for(var b,c=a.stacktrace,f=/ line (\\d+), column (\\d+) in (?:<anonymous function: ([^>]+)>|([^\\)]+))\\((.*)\\) in (.*):\\s*$/i,g=c.split(\"\\n\"),h=[],i=0,j=g.length;j>i;i+=2)if(b=f.exec(g[i])){var k={line:+b[1],column:+b[2],func:b[3]||b[4],args:b[5]?b[5].split(\",\"):[],url:b[6]};if(!k.func&&k.line&&(k.func=d(k.url,k.line)),k.line)try{k.context=e(k.url,k.line)}catch(l){}k.context||(k.context=[g[i+1]]),h.push(k)}return h.length?{mode:\"stacktrace\",name:a.name,message:a.message,url:document.location.href,stack:h,useragent:navigator.userAgent}:null}function m(a){var b=a.message.split(\"\\n\");if(b.length<4)return null;var f,i,j,k,l=/^\\s*Line (\\d+) of linked script ((?:file|http|https)\\S+)(?:: in function (\\S+))?\\s*$/i,m=/^\\s*Line (\\d+) of inline#(\\d+) script in ((?:file|http|https)\\S+)(?:: in function (\\S+))?\\s*$/i,n=/^\\s*Line (\\d+) of function script\\s*$/i,o=[],p=document.getElementsByTagName(\"script\"),q=[];for(i in p)p.hasOwnProperty(i)&&!p[i].src&&q.push(p[i]);for(i=2,j=b.length;j>i;i+=2){var r=null;if(f=l.exec(b[i]))r={url:f[2],func:f[3],line:+f[1]};else if(f=m.exec(b[i])){r={url:f[3],func:f[4]};var s=+f[1],t=q[f[2]-1];if(t&&(k=c(r.url))){k=k.join(\"\\n\");var u=k.indexOf(t.innerText);u>=0&&(r.line=s+k.substring(0,u).split(\"\\n\").length)}}else if(f=n.exec(b[i])){var v=window.location.href.replace(/#.*$/,\"\"),w=f[1],x=new RegExp(g(b[i+1]));k=h(x,[v]),r={url:v,line:k?k.line:w,func:\"\"}}if(r){r.func||(r.func=d(r.url,r.line));var y=e(r.url,r.line),z=y?y[Math.floor(y.length/2)]:null;r.context=y&&z.replace(/^\\s*/,\"\")===b[i+1].replace(/^\\s*/,\"\")?y:[b[i+1]],o.push(r)}}return o.length?{mode:\"multiline\",name:a.name,message:b[0],url:document.location.href,stack:o,useragent:navigator.userAgent}:null}function n(a,b,c,f){var g={url:b,line:c};if(g.url&&g.line){a.incomplete=!1,g.func||(g.func=d(g.url,g.line)),g.context||(g.context=e(g.url,g.line));var h=/ '([^']+)' /.exec(f);if(h&&(g.column=i(h[1],g.url,g.line)),a.stack.length>0&&a.stack[0].url===g.url){if(a.stack[0].line===g.line)return!1;if(!a.stack[0].line&&a.stack[0].func===g.func)return a.stack[0].line=g.line,a.stack[0].context=g.context,!1}return a.stack.unshift(g),a.partial=!0,!0}return a.incomplete=!0,!1}function o(a,b){for(var c,e,f,g=/function\\s+([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*)?\\s*\\(/i,h=[],k={},l=!1,m=o.caller;m&&!l;m=m.caller)if(m!==p&&m!==v){if(e={url:null,func:UNKNOWN_FUNCTION,line:null,column:null},m.name?e.func=m.name:(c=g.exec(m.toString()))&&(e.func=c[1]),f=j(m)){e.url=f.url,e.line=f.line,e.func===UNKNOWN_FUNCTION&&(e.func=d(e.url,e.line));var q=/ '([^']+)' /.exec(a.message||a.description);q&&(e.column=i(q[1],f.url,f.line))}k[\"\"+m]?l=!0:k[\"\"+m]=!0,h.push(e)}b&&h.splice(0,b);var r={mode:\"callers\",name:a.name,message:a.message,url:document.location.href,stack:h,useragent:navigator.userAgent};return n(r,a.sourceURL||a.fileName,a.line||a.lineNumber,a.message||a.description),r}function p(a,b){var c=null;b=null==b?0:+b;try{if(c=l(a))return c}catch(d){if(r)throw d}try{if(c=k(a))return c}catch(d){if(r)throw d}try{if(c=m(a))return c}catch(d){if(r)throw d}try{if(c=o(a,b+1))return c}catch(d){if(r)throw d}return{mode:\"failed\"}}function q(a){a=(null==a?0:+a)+1;try{throw new Error}catch(b){return p(b,a+1)}}var r=!1,s={},t=a.remoteFetching,u=a.linesOfContext,v=a.tracekitReport;return p.augmentStackTraceWithInitialElement=n,p.guessFunctionName=d,p.gatherContext=e,p.ofCaller=q,p}var UNKNOWN_FUNCTION=\"?\";"

/***/ }
/******/ ]);
//# sourceMappingURL=notifier.bundle.js.map