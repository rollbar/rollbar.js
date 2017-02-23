window._rollbarConfig = {
  accessToken: 'XXX',
  rollbarJsUrl: '/dist/rollbar.js'
};


describe('Include Rollbar via requirejs', function() {
  it('should load a valid Rollbar notifier even with a predefined rollbar module', function(done) {
    define('rollbar', {
      foo: 'bar'
    });

    require.config({
      paths: {
        rollbar2: 'dist/rollbar.umd'
      }
    });

    require(['rollbar'], function (mod) {
      expect(mod.foo).to.equal('bar');
    });

    require(['rollbar2'], function (mod) {
      mod.init({});
      expect(window.Rollbar).to.be.an('object');
      expect(window.Rollbar).to.have.property('configure');
      done();
    })
  });
});
