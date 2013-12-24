var expect = chai.expect;

describe("Script load", function() {
  describe("Shim", function() {
    it("should be connected to window.Rollbar", function(done) {
      expect(origRollbar.notifier).to.equal(window.Rollbar);

      done();
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

    expect(1).to.equal(0);
    done();
  });

  it("should put payloads into window._rollbarPayloadQueue in order", function(done) {

    expect(1).to.equal(0);
    done();
  });
});
