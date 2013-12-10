var expect = chai.expect;

it("should load window._rollbar", function(done) {
  expect(window._rollbar.accessToken).to.equal('DUMMY_ACCESS_TOKEN');
  expect(window._rollbar.environment).to.equal('test');
  expect(window._rollbar.extraParams.server.branch).to.equal('develop');
  done();
});


it("should report uncaught errors", function() {
  var _rollbar = window._rollbar;
  var oldHandleEvents = _rollbar.handleEvents;
  
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


it("should respect level for 'trace' items", function() {
  var _rollbar = window._rollbar;
  var oldHandleEvents = _rollbar.handleEvents;
  
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

