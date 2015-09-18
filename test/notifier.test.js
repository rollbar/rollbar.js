/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var errorParser = require('../src/error_parser');
var Rollbar = require('../src/shim').Rollbar;
var Util = require('../src/util.js');
var XHR = require('../src/xhr.js').XHR;
var notifiersrc = require('../src/notifier');
var Notifier = notifiersrc.Notifier;


var rollbarConfig = {
  accessToken: '12c99de67a444c229fca100e0967486f',
  captureUncaught: true
};


notifiersrc.setupJSON(JSON);
Rollbar.init(window, rollbarConfig);


/***** Misc setup tests *****/

describe('Misc', function() {
  it('should not equal window.Rollbar', function(done) {
    var notifier = new Notifier();
    expect(notifier).to.not.equal(window.Rollbar);
    done();
  });
});


/***** Notifier public API tests *****/

/*
 * Notifier()
 */
describe('Notifier()', function() {
  it('should have all of the window.Rollbar methods', function(done) {
    var notifier = new Notifier();
    expect(notifier).to.have.property('log');
    expect(notifier).to.have.property('debug');
    expect(notifier).to.have.property('info');
    expect(notifier).to.have.property('warn');
    expect(notifier).to.have.property('warning');
    expect(notifier).to.have.property('error');
    expect(notifier).to.have.property('critical');
    expect(notifier).to.have.property('uncaughtError');
    expect(notifier).to.have.property('configure');
    expect(notifier).to.have.property('scope');

    var prop;
    for (prop in notifier) {
      if (notifier.hasOwnProperty(prop) && typeof notifier[prop] === 'function') {
        expect(window.Rollbar).to.have.property(prop);
      }
    }

    done();
  });
});
