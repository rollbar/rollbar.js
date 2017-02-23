/* globals expect */
/* globals describe */
/* globals it */


var snippetCallback = require('../src/snippet_callback');


var config = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: false,
  globalAlias: 'testingRollbar'
};

window.Rollbar = require('../src/shim').Rollbar;


describe('window.Rollbar.init()', function () {
  it('should create a shim with the correct alias', function(done) {
    window.Rollbar.init(window, config);

    expect(window.testingRollbar).to.be.an('object');
    expect(window.testingRollbar.log).to.be.a('function');

    done();
  });

  it('should not set window.Rollbar to a notifier', function(done) {
    expect(window.Rollbar).to.not.have.property('log');

    done();
  });
});


describe('window.Rollbar.loadFull()', function () {
  it('should replace window.testingRollbar with an actual notifier', function(done) {
    window._rollbarConfig = config;

    var shim = window.testingRollbar;
    var callback = snippetCallback(shim, config);

    shim.loadFull(window, document, true, {rollbarJsUrl: '../dist/rollbar.js'}, callback);

    function test() {
      if (window.testingRollbar.shimId === undefined) {
        expect(window.testingRollbar).to.have.property('scope');
        expect(window.Rollbar).to.be(window.testingRollbar);

        done();
      } else {
        setTimeout(test, 1);
      }
    }
    test();
  });
});
