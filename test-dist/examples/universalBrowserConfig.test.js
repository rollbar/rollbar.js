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
/*!******************************************************!*\
  !*** ./test/examples/universalBrowserConfig.test.js ***!
  \******************************************************/
// The most maintainable way to reset the browser state in karma is to put
// tests in separate files. This file is for testing non-default config
// options during snippet execution. (Before full rollbar.js loads.)

describe('Rollbar loaded by snippet with non-default options', function () {
  before(function (done) {
    // Stub the xhr interface.
    window.server = sinon.createFakeServer();

    // Load the HTML page.
    document.write(
      window.__html__[
        'examples/universal-browser/test-with-non-default-options.html'
      ],
    );

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

      // Assert that load telemetry was not added. (First event is the log event.)
      expect(body.data.body.telemetry[0].type).to.eql('log');
      expect(body.data.body.telemetry[0].body.message).to.eql('test');

      done();
    }, 1);
  });
});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMvdW5pdmVyc2FsQnJvd3NlckNvbmZpZy50ZXN0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7OztBQ1ZBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsb0NBQW9DO0FBQzVDLFFBQVEscUJBQXFCLDRDQUE0QztBQUN6RTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9leGFtcGxlcy91bml2ZXJzYWxCcm93c2VyQ29uZmlnLnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvLyBUaGUgbW9zdCBtYWludGFpbmFibGUgd2F5IHRvIHJlc2V0IHRoZSBicm93c2VyIHN0YXRlIGluIGthcm1hIGlzIHRvIHB1dFxuLy8gdGVzdHMgaW4gc2VwYXJhdGUgZmlsZXMuIFRoaXMgZmlsZSBpcyBmb3IgdGVzdGluZyBub24tZGVmYXVsdCBjb25maWdcbi8vIG9wdGlvbnMgZHVyaW5nIHNuaXBwZXQgZXhlY3V0aW9uLiAoQmVmb3JlIGZ1bGwgcm9sbGJhci5qcyBsb2Fkcy4pXG5cbmRlc2NyaWJlKCdSb2xsYmFyIGxvYWRlZCBieSBzbmlwcGV0IHdpdGggbm9uLWRlZmF1bHQgb3B0aW9ucycsIGZ1bmN0aW9uICgpIHtcbiAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XG4gICAgLy8gU3R1YiB0aGUgeGhyIGludGVyZmFjZS5cbiAgICB3aW5kb3cuc2VydmVyID0gc2lub24uY3JlYXRlRmFrZVNlcnZlcigpO1xuXG4gICAgLy8gTG9hZCB0aGUgSFRNTCBwYWdlLlxuICAgIGRvY3VtZW50LndyaXRlKFxuICAgICAgd2luZG93Ll9faHRtbF9fW1xuICAgICAgICAnZXhhbXBsZXMvdW5pdmVyc2FsLWJyb3dzZXIvdGVzdC13aXRoLW5vbi1kZWZhdWx0LW9wdGlvbnMuaHRtbCdcbiAgICAgIF0sXG4gICAgKTtcblxuICAgIC8vIEthcm1hIGhlYWRsZXNzIGNocm9tZSB3b24ndCBkaXNwYXRjaCBET01Db250ZW50TG9hZGVkLFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZXZlbnQuaW5pdEV2ZW50KCdET01Db250ZW50TG9hZGVkJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cbiAgICAvLyBHaXZlIHRoZSBzbmlwcGV0IHRpbWUgdG8gbG9hZCBhbmQgaW5pdC5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxMDAwKTtcbiAgfSk7XG5cbiAgYWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5zZXJ2ZXIucmVzdG9yZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHNlbmQgYSB2YWxpZCBsb2cgZXZlbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuICAgIHZhciByb2xsYmFyID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuUm9sbGJhcjtcblxuICAgIHNlcnZlci5yZXNwb25kV2l0aCgnUE9TVCcsICdhcGkvMS9pdGVtJywgW1xuICAgICAgMjAwLFxuICAgICAgeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAne1wiZXJyXCI6IDAsIFwicmVzdWx0XCI6eyBcInV1aWRcIjogXCJkNGM3YWNlZjU1YmY0YzllYTk1ZTRmZTk0MjhhODI4N1wifX0nLFxuICAgIF0pO1xuXG4gICAgdmFyIHJldCA9IHJvbGxiYXIuaW5mbygndGVzdCcpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgICAgZXhwZWN0KGJvZHkuYWNjZXNzX3Rva2VuKS50by5lcWwoJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEudXVpZCkudG8uZXFsKHJldC51dWlkKTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS5tZXNzYWdlLmJvZHkpLnRvLmVxbCgndGVzdCcpO1xuXG4gICAgICAvLyBBc3NlcnQgdGhhdCBsb2FkIHRlbGVtZXRyeSB3YXMgbm90IGFkZGVkLiAoRmlyc3QgZXZlbnQgaXMgdGhlIGxvZyBldmVudC4pXG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudGVsZW1ldHJ5WzBdLnR5cGUpLnRvLmVxbCgnbG9nJyk7XG4gICAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudGVsZW1ldHJ5WzBdLmJvZHkubWVzc2FnZSkudG8uZXFsKCd0ZXN0Jyk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==