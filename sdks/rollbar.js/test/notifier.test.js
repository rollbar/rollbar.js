var expect = chai.expect;

var config = {
  accessToken: 'ACCESS_TOKEN',
  captureUncaught: true    
};

Rollbar.init(window, config);


/***** Misc setup tests *****/

it("should not equal window.Rollbar", function(done) {
  var notifier = new Notifier();
  expect(notifier).to.not.equal(window.Rollbar);
  done();
});



it("should not enqueue to the window.RollbarShimQueue", function(done) {
  done();
});


/***** Notifier public API tests *****/

/*
 * Notifier()
 */

it("should have all of the window.Rollbar methods", function(done) {
  done();
});


/*
 * Notifier(shim)
 */

it("should not have any of the shim properties", function(done) {
  done();
});


it("should set the shim's notifier to itself", function(done) {
  done();
});


/*
 * Notifier(notifier)
 */

it("should reference it's parent notifier", function(done) {
  done();
});


/*
 * Notifier.configure()
 */

it("should save options via configure()", function(done) {
  done();
});


it("should overwrite previous options via configure()", function(done) {
  done();
});


/*
 * Notifier.uncaughtError()
 */


/*
 * Notifier.scope()
 */

it("should create a new Notifier with scope()", function(done) {
  done();
});

it("should make a copy of the options with scope()", function(done) {
  done();
});

it("should not modify parentNotifier's options from a scope() instance when calling configure()", function(done) {
  done();
});


/*
 * Notifier.log()
 */


/*
 * Notifier.debug/warning/error/critical()
 */


/***** Notifier internal API tests *****/

/*
 * Notifier._log()
 */

it("should enqueue to the Notifier.payloadQueue", function(done) {
  done();
});


/*
 * Notifier._route()
 */


/*
 * Notifier._processShimQueue()
 */


