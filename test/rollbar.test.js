var expect = chai.expect;

describe("Script load", function() {
  describe("Shim", function() {
    it("should be connected to window.Rollbar", function(done) {

      expect(1).to.equal(0);
      done();
    });

    it("should configure window.Rollbar via shim.configure()", function(done) {

      expect(1).to.equal(0);
      done();
    });

    it("should create a child scope of window.Rollbar via shim.scope()", function(done) {

      expect(1).to.equal(0);
      done();
    });

    it("should not affect window.Rollbar when modified", function(done) {
      // Change origRollbar._log to something else then call window.Rollbar.log()
      // and verify it works. (then reset origRollbar._log.)

      expect(1).to.equal(0);
      done();
    });

    it("should create the same payload as window.Rollbar via shim.error()", function(done) {

      expect(1).to.equal(0);
      done();
    });
  });
});


describe("window.Rollbar.configure()", function() {
  describe("window.Rollbar.checkIgnore()", function() {
    it("should be called with the correct arguments", function(done) {
      
      expect(1).to.equal(0);
      done();
    });

    it("should be available for child scopes", function(done) {

      expect(1).to.equal(0);
      done();
    });

    it("should not be overwritten by child scopes", function(done) {

      expect(1).to.equal(0);
      done();
    });
  });

  describe("Reconfigure", function() {
    it("should not change child scopes", function(done) {

      expect(1).to.equal(0);
      done();
    });
  });

  describe("window.Rollbar.log()", function() {
    it("should respect default level", function(done) {

      expect(1).to.equal(0);
      done();
    });

    it("should pass along custom fingerprint", function(done) {

      expect(1).to.equal(0);
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
