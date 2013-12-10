var expect = chai.expect;

it("should load window._rollbar", function(done) {
  expect(window._rollbar.accessToken).to.equal('DUMMY_ACCESS_TOKEN');
  expect(window._rollbar.environment).to.equal('test');
  expect(window._rollbar.extraParams.server.branch).to.equal('develop');
  done();
});


it("should report uncaught errors", function() {
  var _rollbar = window._rollbar;
  
  var msg, err;
  var filename = 'test_file';
  var line = 5;
  var col = 10;
  try {
    var foo = bar;
  } catch (e) {
    msg = e.message;
    err = e;
  }

  var spy = sinon.spy(_rollbar.items, "push");
  
  // TODO actually use the window.onerror handler. Seems a bit tricky with Mocha...
  _rollbar.push({_t: "uncaught", e: msg, u: filename, l: line, c: col, err: err});
  
  expect(spy.called).to.be.true;
  var item = spy.getCall(0).args[0];
  expect(item.body.trace.exception.message).to.equal(msg);
  expect(item.body.trace.exception.class).to.equal(err.name);

  _rollbar.items.push.restore();
});


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

