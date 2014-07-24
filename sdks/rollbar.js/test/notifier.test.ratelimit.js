var expect = chai.expect;

var config = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};
Rollbar.init(window, config);


/*
 * Notifier default rate limits
 */

describe("Notifier default rate limits", function() {
  it("should respect itemsPerMinute defaults", function(done) {
    var xhrPostStub = sinon.stub(XHR, 'post');
    var notifier = new Notifier();

    for (var i = 0; i < Notifier.DEFAULT_ITEMS_PER_MIN + 1; ++i) {
      notifier.error('test');
    }
    Notifier.processPayloads(true);

    expect(xhrPostStub.called).to.equal(true);
    expect(xhrPostStub.callCount).to.equal(Notifier.DEFAULT_ITEMS_PER_MIN);

    xhrPostStub.restore();

    return done();
  });
});
