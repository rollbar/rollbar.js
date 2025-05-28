(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!************************************************!*\
  !*** ./test/examples/universalBrowser.test.js ***!
  \************************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('Rollbar loaded by snippet', function () {
  before(function (done) {
    // Stub the xhr interface.
    window.server = sinon.createFakeServer();

    // Load the HTML page.
    document.write(window.__html__['examples/universal-browser/test.html']);

    // Karma headless chrome won't dispatch DOMContentLoaded,
    // so we need to do it manually.
    var event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // Give the snippet time to load and init.
    setTimeout(function () {
      done();
    }, 1000);
  });

  after(function () {
    window.server.restore();
  });

  it('should send a valid log event', function (done) {
    var server = window.server;
    var rollbar = document.defaultView.Rollbar;

    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);

    var ret = rollbar.info('test');

    setTimeout(function () {
      server.respond();

      var body = JSON.parse(server.requests[0].requestBody);

      expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
      expect(body.data.uuid).to.eql(ret.uuid);
      expect(body.data.body.message.body).to.eql('test');

      // Assert load telemetry was added.
      expect(body.data.body.telemetry[0].type).to.eql('navigation');
      expect(body.data.body.telemetry[0].body.subtype).to.eql(
        'DOMContentLoaded',
      );

      done();
    }, 1);
  });
});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMvdW5pdmVyc2FsQnJvd3Nlci50ZXN0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsb0NBQW9DO0FBQzVDLFFBQVEscUJBQXFCLDRDQUE0QztBQUN6RTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvZXhhbXBsZXMvdW5pdmVyc2FsQnJvd3Nlci50ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxuZGVzY3JpYmUoJ1JvbGxiYXIgbG9hZGVkIGJ5IHNuaXBwZXQnLCBmdW5jdGlvbiAoKSB7XG4gIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xuICAgIC8vIFN0dWIgdGhlIHhociBpbnRlcmZhY2UuXG4gICAgd2luZG93LnNlcnZlciA9IHNpbm9uLmNyZWF0ZUZha2VTZXJ2ZXIoKTtcblxuICAgIC8vIExvYWQgdGhlIEhUTUwgcGFnZS5cbiAgICBkb2N1bWVudC53cml0ZSh3aW5kb3cuX19odG1sX19bJ2V4YW1wbGVzL3VuaXZlcnNhbC1icm93c2VyL3Rlc3QuaHRtbCddKTtcblxuICAgIC8vIEthcm1hIGhlYWRsZXNzIGNocm9tZSB3b24ndCBkaXNwYXRjaCBET01Db250ZW50TG9hZGVkLFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZXZlbnQuaW5pdEV2ZW50KCdET01Db250ZW50TG9hZGVkJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cbiAgICAvLyBHaXZlIHRoZSBzbmlwcGV0IHRpbWUgdG8gbG9hZCBhbmQgaW5pdC5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxMDAwKTtcbiAgfSk7XG5cbiAgYWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5zZXJ2ZXIucmVzdG9yZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNlbmQgYSB2YWxpZCBsb2cgZXZlbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHZhciByb2xsYmFyID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuUm9sbGJhcjtcblxuICAgIHNlcnZlci5yZXNwb25kV2l0aCgnUE9TVCcsICdhcGkvMS9pdGVtJywgW1xuICAgICAgMjAwLFxuICAgICAgeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAne1wiZXJyXCI6IDAsIFwicmVzdWx0XCI6eyBcInV1aWRcIjogXCJkNGM3YWNlZjU1YmY0YzllYTk1ZTRmZTk0MjhhODI4N1wifX0nLFxuICAgIF0pO1xuXG4gICAgdmFyIHJldCA9IHJvbGxiYXIuaW5mbygndGVzdCcpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgZXhwZWN0KGJvZHkuYWNjZXNzX3Rva2VuKS50by5lcWwoJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEudXVpZCkudG8uZXFsKHJldC51dWlkKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS5tZXNzYWdlLmJvZHkpLnRvLmVxbCgndGVzdCcpO1xuXG4gICAgICAvLyBBc3NlcnQgbG9hZCB0ZWxlbWV0cnkgd2FzIGFkZGVkLlxuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5ib2R5LnRlbGVtZXRyeVswXS50eXBlKS50by5lcWwoJ25hdmlnYXRpb24nKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50ZWxlbWV0cnlbMF0uYm9keS5zdWJ0eXBlKS50by5lcWwoXG4gICAgICAgICdET01Db250ZW50TG9hZGVkJyxcbiAgICAgICk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==