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
/*!*************************************!*\
  !*** ./test/examples/react.test.js ***!
  \*************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

describe('react app', function () {
  this.timeout(4000);

  before(function (done) {
    // Load the HTML page.
    document.write(window.__html__['examples/react/dist/index.html']);

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
    expect(body.data.body.message.body).to.eql('react test log');

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
    expect(body.data.body.trace.exception.message).to.eql('react test error');

    done();
  });

  it('should not report error inside error boundary', function (done) {
    var server = window.server;

    stubResponse(server);
    server.requests.length = 0;

    var element = document.getElementById('child-error');
    element.click();
    server.respond();

    // Should only produce one API request.
    expect(server.requests.length).to.eql(1);
    var body = JSON.parse(server.requests[0].requestBody);

    expect(body.access_token).to.eql('POST_CLIENT_ITEM_TOKEN');

    // Should be a log event, not an uncaught exception
    expect(body.data.body.message.body).to.eql('react child test error');

    done();
  });
});

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZXMvcmVhY3QudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvQ0FBb0M7QUFDNUMsUUFBUSxxQkFBcUIsNENBQTRDO0FBQ3pFO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi90ZXN0L2V4YW1wbGVzL3JlYWN0LnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG5kZXNjcmliZSgncmVhY3QgYXBwJywgZnVuY3Rpb24gKCkge1xuICB0aGlzLnRpbWVvdXQoNDAwMCk7XG5cbiAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XG4gICAgLy8gTG9hZCB0aGUgSFRNTCBwYWdlLlxuICAgIGRvY3VtZW50LndyaXRlKHdpbmRvdy5fX2h0bWxfX1snZXhhbXBsZXMvcmVhY3QvZGlzdC9pbmRleC5odG1sJ10pO1xuXG4gICAgLy8gU2V0IGEgdGltZXIgYmVmb3JlIHN0dWJiaW5nIHRoZSBYSFIgc2VydmVyLCBlbHNlIGl0IHdpbGwgaW50ZXJmZXJlIHdpdGhcbiAgICAvLyBzY3JpcHRzIGxvYWRlZCBmcm9tIHRoZSBIVE1MIHBhZ2UuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBTdHViIHRoZSB4aHIgaW50ZXJmYWNlLlxuICAgICAgd2luZG93LnNlcnZlciA9IHNpbm9uLmNyZWF0ZUZha2VTZXJ2ZXIoKTtcblxuICAgICAgZG9uZSgpO1xuICAgIH0sIDMwMDApO1xuICB9KTtcblxuICBhZnRlcihmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LnNlcnZlci5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0dWJSZXNwb25zZShzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIucmVzcG9uZFdpdGgoJ1BPU1QnLCAnYXBpLzEvaXRlbScsIFtcbiAgICAgIDIwMCxcbiAgICAgIHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgJ3tcImVyclwiOiAwLCBcInJlc3VsdFwiOnsgXCJ1dWlkXCI6IFwiZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODdcIn19JyxcbiAgICBdKTtcbiAgfVxuXG4gIGl0KCdzaG91bGQgc2VuZCBhIHZhbGlkIGxvZyBldmVudCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIHNlcnZlciA9IHdpbmRvdy5zZXJ2ZXI7XG5cbiAgICBzdHViUmVzcG9uc2Uoc2VydmVyKTtcbiAgICBzZXJ2ZXIucmVxdWVzdHMubGVuZ3RoID0gMDtcblxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvbGxiYXItaW5mbycpO1xuICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICBleHBlY3QoYm9keS5hY2Nlc3NfdG9rZW4pLnRvLmVxbCgnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicpO1xuICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS5tZXNzYWdlLmJvZHkpLnRvLmVxbCgncmVhY3QgdGVzdCBsb2cnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXBvcnQgdW5jYXVnaHQgZXJyb3InLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuXG4gICAgc3R1YlJlc3BvbnNlKHNlcnZlcik7XG4gICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aHJvdy1lcnJvcicpO1xuICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHNlcnZlci5yZXF1ZXN0c1swXS5yZXF1ZXN0Qm9keSk7XG5cbiAgICBleHBlY3QoYm9keS5hY2Nlc3NfdG9rZW4pLnRvLmVxbCgnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicpO1xuICAgIGV4cGVjdChib2R5LmRhdGEuYm9keS50cmFjZS5leGNlcHRpb24ubWVzc2FnZSkudG8uZXFsKCdyZWFjdCB0ZXN0IGVycm9yJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IHJlcG9ydCBlcnJvciBpbnNpZGUgZXJyb3IgYm91bmRhcnknLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBzZXJ2ZXIgPSB3aW5kb3cuc2VydmVyO1xuXG4gICAgc3R1YlJlc3BvbnNlKHNlcnZlcik7XG4gICAgc2VydmVyLnJlcXVlc3RzLmxlbmd0aCA9IDA7XG5cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGlsZC1lcnJvcicpO1xuICAgIGVsZW1lbnQuY2xpY2soKTtcbiAgICBzZXJ2ZXIucmVzcG9uZCgpO1xuXG4gICAgLy8gU2hvdWxkIG9ubHkgcHJvZHVjZSBvbmUgQVBJIHJlcXVlc3QuXG4gICAgZXhwZWN0KHNlcnZlci5yZXF1ZXN0cy5sZW5ndGgpLnRvLmVxbCgxKTtcbiAgICB2YXIgYm9keSA9IEpTT04ucGFyc2Uoc2VydmVyLnJlcXVlc3RzWzBdLnJlcXVlc3RCb2R5KTtcblxuICAgIGV4cGVjdChib2R5LmFjY2Vzc190b2tlbikudG8uZXFsKCdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyk7XG5cbiAgICAvLyBTaG91bGQgYmUgYSBsb2cgZXZlbnQsIG5vdCBhbiB1bmNhdWdodCBleGNlcHRpb25cbiAgICBleHBlY3QoYm9keS5kYXRhLmJvZHkubWVzc2FnZS5ib2R5KS50by5lcWwoJ3JlYWN0IGNoaWxkIHRlc3QgZXJyb3InKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==