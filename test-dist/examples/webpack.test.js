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
/*!***************************************!*\
  !*** ./test/examples/webpack.test.js ***!
  \***************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('webpack app', function () {
  this.timeout(4000);

  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/webpack/src/index.html']);

    // Set a timer before stubbing the XHR server, else it will interfere with
    // scripts loaded from the HTML page.
    setTimeout(function () {
      // Stub the xhr interface.
      window.server = sinon.createFakeServer();

      done();
    }, 3000);
  });

  after(function () {
    window.server.restore();
  });

  function stubResponse(server) {
    server.respondWith('POST', 'api/1/item', [
      200,
      { 'Content-Type': 'application/json' },
      '{"err": 0, "result":{ "uuid": "d4c7acef55bf4c9ea95e4fe9428a8287"}}',
    ]);
  }

  it('should send a valid log event', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('rollbar-info');
    element.click();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');

    done();
  });

  it('should report uncaught error', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('throw-error');
    element.click();
    server.respond();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');

    // This has become necessary because Travis switched their Chrome stable
    // version _down_ from 76 to 62, which handles this test case differently.
    // 2020-05-06: Travis Chrome 62 is now returning the original message.
    var version = parseInt(
      window.navigator.userAgent.match(
        new RegExp('^.*HeadlessChrome/([0-9]*).*$'),
      )[1],
    );
    var message = version >= 62 ? 'webpack test error' : 'Script error.';

    expect(body.data.body.trace.exception.message).to.eql(message);

    done();
  });

  it('should store a payload and send stored payload', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    // Invoke rollbar event to be stored, not sent.
    document.getElementById('rollbar-info-with-extra').click();
    server.respond();

    // Verify event is not sent to API
    expect(server.requests.length).to.eql(0);

    // Verify valid stored payload
    var parsedJson = JSON.parse(window.jsonPayload);
    expect(parsedJson.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(parsedJson.data.body.message.body).to.eql('webpack test log');

    // Send stored payload
    document.getElementById('send-json').click();

    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');
    expect(body.data.body.message.body).to.eql('webpack test log');

    done();
  });
});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMvd2VicGFjay50ZXN0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxRQUFRLG9DQUFvQztBQUM1QyxRQUFRLHFCQUFxQiw0Q0FBNEM7QUFDekU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9leGFtcGxlcy93ZWJwYWNrLnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG5kZXNjcmliZSgnd2VicGFjayBhcHAnLCBmdW5jdGlvbiAoKSB7XG4gIHRoaXMudGltZW91dCg0MDAwKTtcblxuICBiZWZvcmUoZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAvLyBMb2FkIHRoZSBIVE1MIHBhZ2UuXG4gICAgZG9jdW1lbnQud3JpdGUod2luZG93Ll9faHRtbF9fWydleGFtcGxlcy93ZWJwYWNrL3NyYy9pbmRleC5odG1sJ10pO1xuXG4gICAgLy8gU2V0IGEgdGltZXIgYmVmb3JlIHN0dWJiaW5nIHRoZSBYSFIgc2VydmVyLCBlbHNlIGl0IHdpbGwgaW50ZXJmZXJlIHdpdGhcbiAgICAvLyBzY3JpcHRzIGxvYWRlZCBmcm9tIHRoZSBIVE1MIHBhZ2UuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBTdHViIHRoZSB4aHIgaW50ZXJmYWNlLlxuICAgICAgd2luZG93LnNlcnZlciA9IHNpbm9uLmNyZWF0ZUZha2VTZXJ2ZXIoKTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDMwMDApO1xuICB9KTtcblxuICBhZnRlcihmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnNlcnZlci5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0dWJSZXNwb25zZShzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIucmVzcG9uZFdpdGgoJ1BPU1QnLCAnYXBpLzEvaXRlbScsIFtcbiAgICAgIDIwMCxcbiAgICAgIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgJ3tcImVyclwiOiAwLCBcInJlc3VsdFwiOnsgXCJ1dWlkXCI6IFwiZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODdcIn19JyxcbiAgICBdKTtcbiAgfVxuXG4gIGl0KCdzaG91bGQgc2VuZCBhIHZhbGlkIGxvZyBldmVudCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHNlcnZlciA9IHdpbmRvdy5zZXJ2ZXI7XG5cbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvbGxiYXItaW5mbycpO1xuICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICBleHBlY3QoYm9keS5hY2Nlc3NfdG9rZW4pLnRvLmVxbCgnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicpO1xuICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS5tZXNzYWdlLmJvZHkpLnRvLmVxbCgnd2VicGFjayB0ZXN0IGxvZycpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlcG9ydCB1bmNhdWdodCBlcnJvcicsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHNlcnZlciA9IHdpbmRvdy5zZXJ2ZXI7XG5cbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rocm93LWVycm9yJyk7XG4gICAgZWxlbWVudC5jbGljaygpO1xuICAgIHNlcnZlci5yZXNwb25kKCk7XG5cbiAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgIGV4cGVjdChib2R5LmFjY2Vzc190b2tlbikudG8uZXFsKCdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyk7XG5cbiAgICAvLyBUaGlzIGhhcyBiZWNvbWUgbmVjZXNzYXJ5IGJlY2F1c2UgVHJhdmlzIHN3aXRjaGVkIHRoZWlyIENocm9tZSBzdGFibGVcbiAgICAvLyB2ZXJzaW9uIF9kb3duXyBmcm9tIDc2IHRvIDYyLCB3aGljaCBoYW5kbGVzIHRoaXMgdGVzdCBjYXNlIGRpZmZlcmVudGx5LlxuICAgIC8vIDIwMjAtMDUtMDY6IFRyYXZpcyBDaHJvbWUgNjIgaXMgbm93IHJldHVybmluZyB0aGUgb3JpZ2luYWwgbWVzc2FnZS5cbiAgICB2YXIgdmVyc2lvbiA9IHBhcnNlSW50KFxuICAgICAgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goXG4gICAgICAgIG5ldyBSZWdFeHAoJ14uKkhlYWRsZXNzQ2hyb21lLyhbMC05XSopLiokJyksXG4gICAgICApWzFdLFxuICAgICk7XG4gICAgdmFyIG1lc3NhZ2UgPSB2ZXJzaW9uID49IDYyID8gJ3dlYnBhY2sgdGVzdCBlcnJvcicgOiAnU2NyaXB0IGVycm9yLic7XG5cbiAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkudHJhY2UuZXhjZXB0aW9uLm1lc3NhZ2UpLnRvLmVxbChtZXNzYWdlKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBzdG9yZSBhIHBheWxvYWQgYW5kIHNlbmQgc3RvcmVkIHBheWxvYWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuXG4gICAgc3R1YlJlc3BvbnNlKHNlcnZlcik7XG4gICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG5cbiAgICAvLyBJbnZva2Ugcm9sbGJhciBldmVudCB0byBiZSBzdG9yZWQsIG5vdCBzZW50LlxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb2xsYmFyLWluZm8td2l0aC1leHRyYScpLmNsaWNrKCk7XG4gICAgc2VydmVyLnJlc3BvbmQoKTtcblxuICAgIC8vIFZlcmlmeSBldmVudCBpcyBub3Qgc2VudCB0byBBUElcbiAgICBleHBlY3Qoc2VydmVyLnJlcXVlc3RzLmxlbmd0aCkudG8uZXFsKDApO1xuXG4gICAgLy8gVmVyaWZ5IHZhbGlkIHN0b3JlZCBwYXlsb2FkXG4gICAgdmFyIHBhcnNlZEpzb24gPSBKU09OLnBhcnNlKHdpbmRvdy5qc29uUGF5bG9hZCk7XG4gICAgZXhwZWN0KHBhcnNlZEpzb24uYWNjZXNzX3Rva2VuKS50by5lcWwoJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nKTtcbiAgICBleHBlY3QocGFyc2VkSnNvbi5kYXRhLmJvZHkubWVzc2FnZS5ib2R5KS50by5lcWwoJ3dlYnBhY2sgdGVzdCBsb2cnKTtcblxuICAgIC8vIFNlbmQgc3RvcmVkIHBheWxvYWRcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VuZC1qc29uJykuY2xpY2soKTtcblxuICAgIHZhciBib2R5ID0gSlNPTi5wYXJzZShzZXJ2ZXIucmVxdWVzdHNbMF0ucmVxdWVzdEJvZHkpO1xuXG4gICAgZXhwZWN0KGJvZHkuYWNjZXNzX3Rva2VuKS50by5lcWwoJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nKTtcbiAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkubWVzc2FnZS5ib2R5KS50by5lcWwoJ3dlYnBhY2sgdGVzdCBsb2cnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==