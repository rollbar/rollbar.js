var expect = chai.expect;

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true    
};
Rollbar.init(window, config);

describe("Script load", function() {
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


describe("window.Rollbar.configure()", function() {
});


describe("window.Rollbar.scope()", function() {

  it("should return a new shim)", function(done) {
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

  // TODO(cory): negative test cases for invalid params
});


describe("window.Rollbar.log()", function() {
});


describe("window.Rollbar.debug/info/warning/error/critical()", function() {
});
