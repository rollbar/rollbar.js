var expect = chai.expect;

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true    
};

describe("window.Rollbar.init()", function() {

  it("should set window.Rollbar to the shim", function(done) {
    // window.Rollbar will be exposed as a function since shim has 
    // it as a top-level function.
    // var Rollbar = function() {...}
    expect(window.Rollbar).to.be.a('function');

    Rollbar.init(window, config);

    expect(window.Rollbar).to.be.an('object');
    expect(window.RollbarShimQueue).to.be.an('array');

    done();
  });

  it("should create a shim with the expected properties", function(done) {
    expect(window.Rollbar).to.have.property('shimId', 1);
    expect(window.Rollbar).to.have.property('notifier', null);
    expect(window.Rollbar).to.have.ownProperty('parentShim');
    expect(window.Rollbar.parentShim).to.be.equal(undefined);
    done();
  });

  it("should create the global RollbarShimQueue", function(done) {
    expect(window.RollbarShimQueue).to.be.an('array');
    done();
  });

  it("should push initial configure onto RollbarShimQueue", function(done) {
    expect(window.RollbarShimQueue).to.have.length(1);

    // Make sure the object has the expected keys
    expect(window.RollbarShimQueue[0]).to.be.an('object');
    expect(window.RollbarShimQueue[0]).to.have.keys('shim', 'method', 'args', 'ts');

    // Make sure the object's shim value is valid
    expect(window.RollbarShimQueue[0].shim).to.be.an('object');
    expect(window.RollbarShimQueue[0].shim).to.be.equal(window.Rollbar);

    // Make sure the object's method value is correct
    expect(window.RollbarShimQueue[0].method).to.equal('configure');

    // Make sure the object's ts value is valid
    expect(window.RollbarShimQueue[0].ts).to.be.an.instanceOf(Date);
    expect(window.RollbarShimQueue[0].ts.getTime()).to.be.at.most(new Date().getTime());

    // Make sure the object's arguments are correct
    expect(window.RollbarShimQueue[0].args).to.have.property(0);
    expect(window.RollbarShimQueue[0].args[0]).to.be.an('object');
    expect(window.RollbarShimQueue[0].args[0]).to.have.property('accessToken', config.accessToken);
    expect(window.RollbarShimQueue[0].args[0]).to.have.property('captureUncaught', config.captureUncaught);

    done();
  });
});


describe("window.Rollbar.uncaughtError", function() {
  it("should report all args", function(done) {
    var err;
    try {
      // Simulate an uncaught error by wrapping this in a try/catch
      foo();
    } catch (e) {
      err = e;
      window.Rollbar.uncaughtError('test message where foo is undefined', 'test_file.js', 33, 22, err);
    }

    expect(window.RollbarShimQueue[1]).to.be.an('object');
    expect(window.RollbarShimQueue[1]).to.have.property('method', 'uncaughtError');
    expect(window.RollbarShimQueue[1].args).to.not.equal(undefined);
    expect(window.RollbarShimQueue[1].args[0]).to.contain('foo');
    expect(window.RollbarShimQueue[1].args[1]).to.equal('test_file.js');
    expect(window.RollbarShimQueue[1].args[2]).to.equal(33);
    expect(window.RollbarShimQueue[1].args[3]).to.equal(22);
    expect(window.RollbarShimQueue[1].args[4]).to.equal(err);

    done();
  });
});


describe("window.Rollbar.global()", function() {
  it("should not return anything", function(done) {
    expect(window.Rollbar.global()).to.equal(undefined);
    done();
  });

  it("should should pass all arguments to the RollbarShimQueue", function(done) {
    var preLen = window.RollbarShimQueue.length;
    var options = {hello: 'world'};
    window.Rollbar.global(options, 33);

    expect(window.RollbarShimQueue).to.have.length(preLen + 1);

    var globalData = window.RollbarShimQueue[preLen];
    expect(globalData).to.be.an('object');
    expect(globalData.args).to.be.an('array');
    expect(globalData.args).to.have.length(2);
    expect(globalData.args[0]).to.equal(options);
    expect(globalData.args[1]).to.equal(33);

    done();
  });
});

describe("window.Rollbar.configure()", function() {
  it("should not return anything", function(done) {
    expect(window.Rollbar.configure()).to.equal(undefined);
    done();
  });

  it("should should pass all arguments to the RollbarShimQueue", function(done) {
    var preLen = window.RollbarShimQueue.length;
    var options = {hello: 'world'};
    window.Rollbar.configure(options, 33);

    expect(window.RollbarShimQueue).to.have.length(preLen + 1);

    var configData = window.RollbarShimQueue[preLen];
    expect(configData).to.be.an('object');
    expect(configData.args).to.be.an('array');
    expect(configData.args).to.have.length(2);
    expect(configData.args[0]).to.equal(options);
    expect(configData.args[1]).to.equal(33);

    done();
  });
});


describe("window.Rollbar.scope()", function() {

  it("should return a new shim", function(done) {
    var newScope = window.Rollbar.scope();

    expect(newScope).to.be.an('object');
    expect(newScope).to.not.equal(window.Rollbar);

    var props = {
      log: 'function',
      debug: 'function',
      info: 'function',
      warning: 'function',
      error: 'function',
      critical: 'function',
      uncaughtError: 'function',
      configure: 'function',
      scope: 'function',
      shimId: 'number',
      notifier: 'null',
      parentShim: 'object'
    };

    for (var prop in props) {
      expect(newScope).to.have.property(prop).that.is.a(props[prop]);
    }

    expect(newScope.shimId).to.be.above(window.Rollbar.shimId);
    expect(newScope.parentShim).to.equal(window.Rollbar);
    expect(newScope.log).to.equal(window.Rollbar.log);

    done();
  });

  it("should increment the shimId on each call", function(done) {
    var newScope = window.Rollbar.scope();
    expect(newScope.shimId).is.above(window.Rollbar.shimId);

    var prevScope = newScope;
    newScope = newScope.scope();
    expect(newScope.shimId).is.above(prevScope.shimId);

    done();
  });
});


describe("window.Rollbar.log/debug/info/warning/error/critical()", function() {
  it("should add a log message to RollbarShimQueue", function(done) {
    var check = function(method, message) {
      var obj = window.RollbarShimQueue[window.RollbarShimQueue.length - 1];
      expect(obj.method).to.equal(method);
      expect(obj.args[0]).to.equal(message);
    };

    window.Rollbar.log('hello world');
    check('log', 'hello world');

    window.Rollbar.debug('hello debug world');
    check('debug', 'hello debug world');

    window.Rollbar.info('hello info world');
    check('info', 'hello info world');

    window.Rollbar.warning('hello warning world');
    check('warning', 'hello warning world');

    window.Rollbar.error('hello error world');
    check('error', 'hello error world');

    window.Rollbar.critical('hello critical world');
    check('critical', 'hello critical world');

    done();
  });
});


describe("window.Rollbar.loadFull()", function() {

  var successSpy;
  var errSpy;

  var preFullLoad = function(origShim) {
    // Call log() once with a callback to make sure the callback
    // is invoked once the full script loads.
    var successCallback = function() {};
    successSpy = sinon.spy(successCallback);
    origShim.log('testing success callback', successCallback);

    // Call log() once and expect it to fail. It should call
    // the callback with an error.
    var errCallback = function() {};
    errSpy = sinon.spy(errCallback);
    origShim.scope({endpoint: 'http://localhost/nonexistant'}).log('testing error callback', errCallback);
  };

  it("should set window.Rollbar to a Notifier", function(done) {

    var origShim = window.Rollbar;

    // setup some stuff for subsequent tests
    preFullLoad(origShim);

    // Brings in the full rollbar.js file into the DOM
    Rollbar.loadFull(window, document, true);

    // Wait 20 milliseconds before checking window.Rollbar
    setTimeout(function() {
      expect(window.Rollbar).to.be.an('object');
      expect(window.Rollbar).to.not.equal(origShim);
      expect(window.Rollbar.constructor.name).to.equal('Notifier');
      expect(window.Rollbar.parentNotifier).to.be.equal(origShim);

      expect(origShim.notifier).to.be.equal(window.Rollbar);

      var shimQueueSize = window.RollbarShimQueue.length;

      origShim.log('hello world');
      expect(window.RollbarShimQueue.length).is.equal(shimQueueSize);

      done();
    }, 20);
  });

  it("should call the success callback", function(done) {
    // Wait 30 milliseconds for the Rollbar.loadFull() to complete and call
    // the callback
    setTimeout(function() {
      expect(successSpy).to.not.be.equal(undefined);
      expect(successSpy.called).to.be.equal(true);
      var call = successSpy.getCall(0);

      expect(call.args).to.have.length(2);

      var errParam = call.args[0];
      var respParam = call.args[1];

      expect(errParam).to.equal(null);
      expect(respParam).to.be.an('object');

      done();
    }, 30);
  });

  it("should call the error callback", function(done) {
    // Wait 30 milliseconds for the Rollbar.loadFull() to complete and call
    // the callback
    setTimeout(function() {
      expect(errSpy).to.not.be.equal(undefined);
      expect(errSpy.called).to.be.equal(true);
      var call = errSpy.getCall(0);

      expect(call.args).to.have.length(1);

      var errParam = call.args[0];
      expect(errParam).to.not.equal(null);

      done();
    }, 30);
  });
});
