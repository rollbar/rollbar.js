var expect = chai.expect;

describe("Script load", function() {
  describe("Shim", function() {
    it("should be connected to window.Rollbar", function(done) {

      done();
    });

    it("should configure window.Rollbar via shim.configure()", function(done) {

      done();
    });

    it("should create a child scope of window.Rollbar via shim.scope()", function(done) {

      done();
    });

    it("should not affect window.Rollbar when modified", function(done) {
      // Change origRollbar._log to something else then call window.Rollbar.log()
      // and verify it works. (then reset origRollbar._log.)

      done();
    });

    it("should create the same payload as window.Rollbar via shim.error()", function(done) {

      done();
    });
  });
});


describe("window.Rollbar.configure()", function() {
  describe("window.Rollbar.checkIgnore()", function() {
    it("should be called with the correct arguments", function(done) {
      
      done();
    });

    it("should be available for child scopes", function(done) {

      done();
    });

    it("should not be overwritten by child scopes", function(done) {

      done();
    });
  });

  describe("Reconfigure", function() {
    it("should not change child scopes", function(done) {

      done();
    });
  });

  describe("window.Rollbar.log()", function() {
    it("should respect default level", function(done) {

      done();
    });

    it("should pass along custom fingerprint", function(done) {

      done();
    });
  });
});


describe("window.Rollbar.log()", function() {
  it("should create a valid payload and put onto window._rollbarPayloadQueue", function(done) {

    done();
  });

  it("should put payloads onto window._rollbarPayloadQueue in order", function(done) {

    done();
  });
});
