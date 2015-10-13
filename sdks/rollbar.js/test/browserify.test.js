describe('Include Rollbar via browserify', function() {
  it('should load a valid Rollbar notifier', function(done) {
    var rollbar = require('../dist/rollbar.umd.nojson.min.js');
    window.Rollbar = rollbar.init({});
    expect(window.Rollbar).to.be.an('object');
    expect(window.Rollbar).to.have.property('configure');

    window.Rollbar.error('error from Browserify test');
    expect(window._rollbarPayloadQueue.length).to.equal(1);
    expect(JSON.stringify(window._rollbarPayloadQueue[0])).to.contain('Browserify test');

    done();
  });
});
