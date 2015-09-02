/* globals mocha */
/* globals afterEach */
/* globals beforeEach */
/* globals sinon */


require('script!../lib/mocha/mocha.js');
require('script!../lib/chai/chai.js');
require('script!../lib/sinon/sinon-1.7.3.js');


mocha.ui('bdd');
mocha.reporter('html');


beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});


afterEach(function() {
  this.sinon.restore();
});


require('../integrations/mootools.test.js');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
