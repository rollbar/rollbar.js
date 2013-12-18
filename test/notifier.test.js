var expect = chai.expect;

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true    
};

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
    done();
  });
});


/*
 * Notifier(shim)
 */

describe("Notifier(shim)", function() {
  it("should not have any of the shim properties", function(done) {
    done();
  });

  it("should set the shim's notifier to itself", function(done) {
    done();
  });
});


/*
 * Notifier(notifier)
 */

describe("Notifier(notifier)", function() {
  it("should reference it's parent notifier", function(done) {
    done();
  });
});


/*
 * Notifier.configure()
 */

describe("Notifier.configure()", function() {
  it("should save options via configure()", function(done) {
    done();
  });

  it("should overwrite previous options via configure()", function(done) {
    done();
  });
});


/*
 * Notifier.uncaughtError()
 */

describe("Notifier.uncaughtError()", function() {
});


/*
 * Notifier.scope()
 */

describe("Notifier.scope()", function() {
  it("should create a new Notifier with scope()", function(done) {
    done();
  });

  it("should make a copy of the options with scope()", function(done) {
    done();
  });

  it("should not modify parentNotifier's options from a scope() instance when calling configure()", function(done) {
    done();
  });
});


/*
 * Notifier.log()
 */
describe("Notifier.log()", function() {
});


/*
 * Notifier.debug/warning/error/critical()
 */

describe("Notifier.debug/warning/error/critical()", function() {
});


/***** Notifier internal API tests *****/

/*
 * Notifier._log()
 */

describe("Notifier._log()", function() {
  it("should enqueue to the Notifier.payloadQueue", function(done) {
    done();
  });
});


/*
 * Notifier._route()
 */

describe("Notifier._route()", function() {
});


/*
 * Notifier._processShimQueue()
 */

describe("Notifier._processShimQueue()", function() {
});


