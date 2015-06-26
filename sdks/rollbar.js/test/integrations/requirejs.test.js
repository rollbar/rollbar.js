var expect = chai.expect;

describe('Include Rollbar via requirejs', function() {
  it("should load a valid Rollbar notifier even with a predefined rollbar module", function(done) {

    var custom = define('rollbar', {
      foo: 'bar'
    });

    require.config({
      paths: {
        rollbar: './foo',
        rollbar2: '../../dist/rollbar.umd'
      }
    });

    require(['rollbar'], function (mod) {
      expect(mod.foo).to.equal('bar');
    });

    require(['rollbar2'], function (mod) {
      window.Rollbar.init({});
      expect(window.Rollbar).to.be.an('Object');
      expect(window.Rollbar).to.have.property('configure');
      done();
    })
  });
});
