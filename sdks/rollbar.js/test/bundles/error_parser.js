/* globals mocha */
/* globals sinon */
/* globals beforeEach */
/* globals afterEach */


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


require('../error_parser.test.js');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
