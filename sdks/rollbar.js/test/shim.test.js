var expect = chai.expect;

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true    
};
Rollbar.init(window, config);

it("should load window.Rollbar", function(done) {
  expect(window.Rollbar).to.be.an('object');
  done();
});

it("should create a shim", function(done) {
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


it("should report uncaught errors", function(done) {
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


/*
it("should pass all 5 args to checkIgnore", function() {
  var _rollbar = window._rollbar;

  var oldCheckIgnore = _rollbar.checkIgnore;
  _rollbar.checkIgnore = function(m, file, line, col, err) {
    return false;
  }
  var spy = sinon.spy(_rollbar, "checkIgnore");

  var error;
  try { var foo = bar; } catch (e) { error = e; }
  var args = {_t: "uncaught", e: "error!", u: "filename", l: 1, c: 2, err: error};
  _rollbar.push(args);

  var callArgs = spy.getCall(0).args;
  expect(callArgs[0]).to.equal(args.e);
  expect(callArgs[1]).to.equal(args.u);
  expect(callArgs[2]).to.equal(args.l);
  expect(callArgs[3]).to.equal(args.c);
  expect(callArgs[4]).to.equal(args.err);

  _rollbar.checkIgnore.restore();
  _rollbar.checkIgnore = oldCheckIgnore;
});


it("should respect level for 'trace' items", function() {
  var _rollbar = window._rollbar;
  
  var trace = {
    frames: [{lineno: 5, filename: "testfile"}], 
    exception: {"class": "ClassName", message: "the message"}
  };
  var level = "info";

  var spy = sinon.spy(_rollbar.items, "push");
  
  _rollbar.push({_t: "trace", trace: trace, level: level});

  expect(spy.called).to.be.true;
  var item = spy.getCall(0).args[0];
  expect(item.level).to.equal(level);
  expect(item.body.trace).to.deep.equal(trace);
});
*/

