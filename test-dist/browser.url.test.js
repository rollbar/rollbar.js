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
/******/ 	var __webpack_modules__ = ({

/***/ "./src/browser/url.js":
/*!****************************!*\
  !*** ./src/browser/url.js ***!
  \****************************/
/***/ ((module) => {

// See https://nodejs.org/docs/latest/api/url.html
function parse(url) {
  var result = {
    protocol: null,
    auth: null,
    host: null,
    path: null,
    hash: null,
    href: url,
    hostname: null,
    port: null,
    pathname: null,
    search: null,
    query: null
  };
  var i, last;
  i = url.indexOf('//');
  if (i !== -1) {
    result.protocol = url.substring(0, i);
    last = i + 2;
  } else {
    last = 0;
  }
  i = url.indexOf('@', last);
  if (i !== -1) {
    result.auth = url.substring(last, i);
    last = i + 1;
  }
  i = url.indexOf('/', last);
  if (i === -1) {
    i = url.indexOf('?', last);
    if (i === -1) {
      i = url.indexOf('#', last);
      if (i === -1) {
        result.host = url.substring(last);
      } else {
        result.host = url.substring(last, i);
        result.hash = url.substring(i);
      }
      result.hostname = result.host.split(':')[0];
      result.port = result.host.split(':')[1];
      if (result.port) {
        result.port = parseInt(result.port, 10);
      }
      return result;
    } else {
      result.host = url.substring(last, i);
      result.hostname = result.host.split(':')[0];
      result.port = result.host.split(':')[1];
      if (result.port) {
        result.port = parseInt(result.port, 10);
      }
      last = i;
    }
  } else {
    result.host = url.substring(last, i);
    result.hostname = result.host.split(':')[0];
    result.port = result.host.split(':')[1];
    if (result.port) {
      result.port = parseInt(result.port, 10);
    }
    last = i;
  }
  i = url.indexOf('#', last);
  if (i === -1) {
    result.path = url.substring(last);
  } else {
    result.path = url.substring(last, i);
    result.hash = url.substring(i);
  }
  if (result.path) {
    var pathParts = result.path.split('?');
    result.pathname = pathParts[0];
    result.query = pathParts[1];
    result.search = result.query ? '?' + result.query : null;
  }
  return result;
}
module.exports = {
  parse: parse
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************************!*\
  !*** ./test/browser.url.test.js ***!
  \**********************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var url = __webpack_require__(/*! ../src/browser/url */ "./src/browser/url.js");

describe('parse', function () {
  it('should return an object full of nulls for a blank url', function () {
    var u = '';
    var parsed = url.parse(u);
    expect(parsed).to.be.ok();
  });
  it('should get the protocol', function () {
    var http = 'http://something.com';
    var parsedHttp = url.parse(http);
    expect(parsedHttp.protocol).to.eql('http:');
    var file = 'file://something.com';
    var parsedFile = url.parse(file);
    expect(parsedFile.protocol).to.eql('file:');
  });
  it('should get everything if it is there', function () {
    var u =
      'https://me:you@fake.example.co.uk:85/a/path/object//with/crap?a=b&c=d#hashy!';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.eql('me:you');
    expect(p.host).to.eql('fake.example.co.uk:85');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.eql(85);
    expect(p.path).to.eql('/a/path/object//with/crap?a=b&c=d');
    expect(p.pathname).to.eql('/a/path/object//with/crap');
    expect(p.search).to.eql('?a=b&c=d');
    expect(p.query).to.eql('a=b&c=d');
    expect(p.hash).to.eql('#hashy!');
  });
  it('should get stuff even if some things are missing', function () {
    var u = 'https://fake.example.co.uk/a/path/object//with/crap#hashy!';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('/a/path/object//with/crap');
    expect(p.pathname).to.eql('/a/path/object//with/crap');
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.eql('#hashy!');
  });
  it('should get stuff even the path is missing', function () {
    var u = 'https://fake.example.co.uk#hashy!';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.not.be.ok();
    expect(p.pathname).to.not.be.ok();
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.eql('#hashy!');
  });
  it('should get stuff with a query and no path', function () {
    var u = 'https://fake.example.co.uk?a=b';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('?a=b');
    expect(p.pathname).to.not.be.ok();
    expect(p.search).to.eql('?a=b');
    expect(p.query).to.eql('a=b');
    expect(p.hash).to.not.be.ok();
  });
  it('should get stuff with a query and blank path', function () {
    var u = 'https://fake.example.co.uk/?a=b';
    var p = url.parse(u);
    expect(p.protocol).to.eql('https:');
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('/?a=b');
    expect(p.pathname).to.eql('/');
    expect(p.search).to.eql('?a=b');
    expect(p.query).to.eql('a=b');
    expect(p.hash).to.not.be.ok();
  });
  it('should get stuff with a missing protocol', function () {
    var u = '//fake.example.co.uk/v1/#hashash';
    var p = url.parse(u);
    expect(p.protocol).to.not.be.ok();
    expect(p.auth).to.not.be.ok();
    expect(p.host).to.eql('fake.example.co.uk');
    expect(p.hostname).to.eql('fake.example.co.uk');
    expect(p.port).to.not.be.ok();
    expect(p.path).to.eql('/v1/');
    expect(p.pathname).to.eql('/v1/');
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.eql('#hashash');
  });
  it('should handle missing protocol without slashes', function () {
    var u = 'api.rollbar.com/api/1';
    var p = url.parse(u);
    expect(p.protocol).to.not.be.ok();
    expect(p.host).to.eql('api.rollbar.com');
    expect(p.hostname).to.eql('api.rollbar.com');
    expect(p.path).to.eql('/api/1');
    expect(p.pathname).to.eql('/api/1');
    expect(p.auth).to.not.be.ok();
    expect(p.port).to.not.be.ok();
    expect(p.search).to.not.be.ok();
    expect(p.query).to.not.be.ok();
    expect(p.hash).to.not.be.ok();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvdXJsLmpzIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvYnJvd3Nlci51cmwudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIi8vIFNlZSBodHRwczovL25vZGVqcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3VybC5odG1sXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBwcm90b2NvbDogbnVsbCxcbiAgICBhdXRoOiBudWxsLFxuICAgIGhvc3Q6IG51bGwsXG4gICAgcGF0aDogbnVsbCxcbiAgICBoYXNoOiBudWxsLFxuICAgIGhyZWY6IHVybCxcbiAgICBob3N0bmFtZTogbnVsbCxcbiAgICBwb3J0OiBudWxsLFxuICAgIHBhdGhuYW1lOiBudWxsLFxuICAgIHNlYXJjaDogbnVsbCxcbiAgICBxdWVyeTogbnVsbCxcbiAgfTtcblxuICB2YXIgaSwgbGFzdDtcbiAgaSA9IHVybC5pbmRleE9mKCcvLycpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQucHJvdG9jb2wgPSB1cmwuc3Vic3RyaW5nKDAsIGkpO1xuICAgIGxhc3QgPSBpICsgMjtcbiAgfSBlbHNlIHtcbiAgICBsYXN0ID0gMDtcbiAgfVxuXG4gIGkgPSB1cmwuaW5kZXhPZignQCcsIGxhc3QpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQuYXV0aCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgbGFzdCA9IGkgKyAxO1xuICB9XG5cbiAgaSA9IHVybC5pbmRleE9mKCcvJywgbGFzdCk7XG4gIGlmIChpID09PSAtMSkge1xuICAgIGkgPSB1cmwuaW5kZXhPZignPycsIGxhc3QpO1xuICAgIGlmIChpID09PSAtMSkge1xuICAgICAgaSA9IHVybC5pbmRleE9mKCcjJywgbGFzdCk7XG4gICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QsIGkpO1xuICAgICAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gICAgICB9XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgICAgcmVzdWx0LnBvcnQgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMF07XG4gICAgICByZXN1bHQucG9ydCA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMV07XG4gICAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgICAgcmVzdWx0LnBvcnQgPSBwYXJzZUludChyZXN1bHQucG9ydCwgMTApO1xuICAgICAgfVxuICAgICAgbGFzdCA9IGk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgIHJlc3VsdC5wb3J0ID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVsxXTtcbiAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICB9XG4gICAgbGFzdCA9IGk7XG4gIH1cblxuICBpID0gdXJsLmluZGV4T2YoJyMnLCBsYXN0KTtcbiAgaWYgKGkgPT09IC0xKSB7XG4gICAgcmVzdWx0LnBhdGggPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRoID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gIH1cblxuICBpZiAocmVzdWx0LnBhdGgpIHtcbiAgICB2YXIgcGF0aFBhcnRzID0gcmVzdWx0LnBhdGguc3BsaXQoJz8nKTtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBwYXRoUGFydHNbMF07XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcGF0aFBhcnRzWzFdO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZXN1bHQucXVlcnkgPyAnPycgKyByZXN1bHQucXVlcnkgOiBudWxsO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIGdsb2JhbHMgZXhwZWN0ICovXG4vKiBnbG9iYWxzIGRlc2NyaWJlICovXG4vKiBnbG9iYWxzIGl0ICovXG4vKiBnbG9iYWxzIHNpbm9uICovXG5cbnZhciB1cmwgPSByZXF1aXJlKCcuLi9zcmMvYnJvd3Nlci91cmwnKTtcblxuZGVzY3JpYmUoJ3BhcnNlJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIHJldHVybiBhbiBvYmplY3QgZnVsbCBvZiBudWxscyBmb3IgYSBibGFuayB1cmwnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHUgPSAnJztcbiAgICB2YXIgcGFyc2VkID0gdXJsLnBhcnNlKHUpO1xuICAgIGV4cGVjdChwYXJzZWQpLnRvLmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGdldCB0aGUgcHJvdG9jb2wnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGh0dHAgPSAnaHR0cDovL3NvbWV0aGluZy5jb20nO1xuICAgIHZhciBwYXJzZWRIdHRwID0gdXJsLnBhcnNlKGh0dHApO1xuICAgIGV4cGVjdChwYXJzZWRIdHRwLnByb3RvY29sKS50by5lcWwoJ2h0dHA6Jyk7XG4gICAgdmFyIGZpbGUgPSAnZmlsZTovL3NvbWV0aGluZy5jb20nO1xuICAgIHZhciBwYXJzZWRGaWxlID0gdXJsLnBhcnNlKGZpbGUpO1xuICAgIGV4cGVjdChwYXJzZWRGaWxlLnByb3RvY29sKS50by5lcWwoJ2ZpbGU6Jyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGdldCBldmVyeXRoaW5nIGlmIGl0IGlzIHRoZXJlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID1cbiAgICAgICdodHRwczovL21lOnlvdUBmYWtlLmV4YW1wbGUuY28udWs6ODUvYS9wYXRoL29iamVjdC8vd2l0aC9jcmFwP2E9YiZjPWQjaGFzaHkhJztcbiAgICB2YXIgcCA9IHVybC5wYXJzZSh1KTtcbiAgICBleHBlY3QocC5wcm90b2NvbCkudG8uZXFsKCdodHRwczonKTtcbiAgICBleHBlY3QocC5hdXRoKS50by5lcWwoJ21lOnlvdScpO1xuICAgIGV4cGVjdChwLmhvc3QpLnRvLmVxbCgnZmFrZS5leGFtcGxlLmNvLnVrOjg1Jyk7XG4gICAgZXhwZWN0KHAuaG9zdG5hbWUpLnRvLmVxbCgnZmFrZS5leGFtcGxlLmNvLnVrJyk7XG4gICAgZXhwZWN0KHAucG9ydCkudG8uZXFsKDg1KTtcbiAgICBleHBlY3QocC5wYXRoKS50by5lcWwoJy9hL3BhdGgvb2JqZWN0Ly93aXRoL2NyYXA/YT1iJmM9ZCcpO1xuICAgIGV4cGVjdChwLnBhdGhuYW1lKS50by5lcWwoJy9hL3BhdGgvb2JqZWN0Ly93aXRoL2NyYXAnKTtcbiAgICBleHBlY3QocC5zZWFyY2gpLnRvLmVxbCgnP2E9YiZjPWQnKTtcbiAgICBleHBlY3QocC5xdWVyeSkudG8uZXFsKCdhPWImYz1kJyk7XG4gICAgZXhwZWN0KHAuaGFzaCkudG8uZXFsKCcjaGFzaHkhJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGdldCBzdHVmZiBldmVuIGlmIHNvbWUgdGhpbmdzIGFyZSBtaXNzaW5nJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0gJ2h0dHBzOi8vZmFrZS5leGFtcGxlLmNvLnVrL2EvcGF0aC9vYmplY3QvL3dpdGgvY3JhcCNoYXNoeSEnO1xuICAgIHZhciBwID0gdXJsLnBhcnNlKHUpO1xuICAgIGV4cGVjdChwLnByb3RvY29sKS50by5lcWwoJ2h0dHBzOicpO1xuICAgIGV4cGVjdChwLmF1dGgpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChwLmhvc3QpLnRvLmVxbCgnZmFrZS5leGFtcGxlLmNvLnVrJyk7XG4gICAgZXhwZWN0KHAuaG9zdG5hbWUpLnRvLmVxbCgnZmFrZS5leGFtcGxlLmNvLnVrJyk7XG4gICAgZXhwZWN0KHAucG9ydCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAucGF0aCkudG8uZXFsKCcvYS9wYXRoL29iamVjdC8vd2l0aC9jcmFwJyk7XG4gICAgZXhwZWN0KHAucGF0aG5hbWUpLnRvLmVxbCgnL2EvcGF0aC9vYmplY3QvL3dpdGgvY3JhcCcpO1xuICAgIGV4cGVjdChwLnNlYXJjaCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAucXVlcnkpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChwLmhhc2gpLnRvLmVxbCgnI2hhc2h5IScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBnZXQgc3R1ZmYgZXZlbiB0aGUgcGF0aCBpcyBtaXNzaW5nJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0gJ2h0dHBzOi8vZmFrZS5leGFtcGxlLmNvLnVrI2hhc2h5ISc7XG4gICAgdmFyIHAgPSB1cmwucGFyc2UodSk7XG4gICAgZXhwZWN0KHAucHJvdG9jb2wpLnRvLmVxbCgnaHR0cHM6Jyk7XG4gICAgZXhwZWN0KHAuYXV0aCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAuaG9zdCkudG8uZXFsKCdmYWtlLmV4YW1wbGUuY28udWsnKTtcbiAgICBleHBlY3QocC5ob3N0bmFtZSkudG8uZXFsKCdmYWtlLmV4YW1wbGUuY28udWsnKTtcbiAgICBleHBlY3QocC5wb3J0KS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5wYXRoKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5wYXRobmFtZSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAuc2VhcmNoKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5xdWVyeSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAuaGFzaCkudG8uZXFsKCcjaGFzaHkhJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGdldCBzdHVmZiB3aXRoIGEgcXVlcnkgYW5kIG5vIHBhdGgnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHUgPSAnaHR0cHM6Ly9mYWtlLmV4YW1wbGUuY28udWs/YT1iJztcbiAgICB2YXIgcCA9IHVybC5wYXJzZSh1KTtcbiAgICBleHBlY3QocC5wcm90b2NvbCkudG8uZXFsKCdodHRwczonKTtcbiAgICBleHBlY3QocC5hdXRoKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5ob3N0KS50by5lcWwoJ2Zha2UuZXhhbXBsZS5jby51aycpO1xuICAgIGV4cGVjdChwLmhvc3RuYW1lKS50by5lcWwoJ2Zha2UuZXhhbXBsZS5jby51aycpO1xuICAgIGV4cGVjdChwLnBvcnQpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChwLnBhdGgpLnRvLmVxbCgnP2E9YicpO1xuICAgIGV4cGVjdChwLnBhdGhuYW1lKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5zZWFyY2gpLnRvLmVxbCgnP2E9YicpO1xuICAgIGV4cGVjdChwLnF1ZXJ5KS50by5lcWwoJ2E9YicpO1xuICAgIGV4cGVjdChwLmhhc2gpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBnZXQgc3R1ZmYgd2l0aCBhIHF1ZXJ5IGFuZCBibGFuayBwYXRoJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB1ID0gJ2h0dHBzOi8vZmFrZS5leGFtcGxlLmNvLnVrLz9hPWInO1xuICAgIHZhciBwID0gdXJsLnBhcnNlKHUpO1xuICAgIGV4cGVjdChwLnByb3RvY29sKS50by5lcWwoJ2h0dHBzOicpO1xuICAgIGV4cGVjdChwLmF1dGgpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChwLmhvc3QpLnRvLmVxbCgnZmFrZS5leGFtcGxlLmNvLnVrJyk7XG4gICAgZXhwZWN0KHAuaG9zdG5hbWUpLnRvLmVxbCgnZmFrZS5leGFtcGxlLmNvLnVrJyk7XG4gICAgZXhwZWN0KHAucG9ydCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAucGF0aCkudG8uZXFsKCcvP2E9YicpO1xuICAgIGV4cGVjdChwLnBhdGhuYW1lKS50by5lcWwoJy8nKTtcbiAgICBleHBlY3QocC5zZWFyY2gpLnRvLmVxbCgnP2E9YicpO1xuICAgIGV4cGVjdChwLnF1ZXJ5KS50by5lcWwoJ2E9YicpO1xuICAgIGV4cGVjdChwLmhhc2gpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBnZXQgc3R1ZmYgd2l0aCBhIG1pc3NpbmcgcHJvdG9jb2wnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHUgPSAnLy9mYWtlLmV4YW1wbGUuY28udWsvdjEvI2hhc2hhc2gnO1xuICAgIHZhciBwID0gdXJsLnBhcnNlKHUpO1xuICAgIGV4cGVjdChwLnByb3RvY29sKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5hdXRoKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5ob3N0KS50by5lcWwoJ2Zha2UuZXhhbXBsZS5jby51aycpO1xuICAgIGV4cGVjdChwLmhvc3RuYW1lKS50by5lcWwoJ2Zha2UuZXhhbXBsZS5jby51aycpO1xuICAgIGV4cGVjdChwLnBvcnQpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChwLnBhdGgpLnRvLmVxbCgnL3YxLycpO1xuICAgIGV4cGVjdChwLnBhdGhuYW1lKS50by5lcWwoJy92MS8nKTtcbiAgICBleHBlY3QocC5zZWFyY2gpLnRvLm5vdC5iZS5vaygpO1xuICAgIGV4cGVjdChwLnF1ZXJ5KS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5oYXNoKS50by5lcWwoJyNoYXNoYXNoJyk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIHByb3RvY29sIHdpdGhvdXQgc2xhc2hlcycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdSA9ICdhcGkucm9sbGJhci5jb20vYXBpLzEnO1xuICAgIHZhciBwID0gdXJsLnBhcnNlKHUpO1xuICAgIGV4cGVjdChwLnByb3RvY29sKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5ob3N0KS50by5lcWwoJ2FwaS5yb2xsYmFyLmNvbScpO1xuICAgIGV4cGVjdChwLmhvc3RuYW1lKS50by5lcWwoJ2FwaS5yb2xsYmFyLmNvbScpO1xuICAgIGV4cGVjdChwLnBhdGgpLnRvLmVxbCgnL2FwaS8xJyk7XG4gICAgZXhwZWN0KHAucGF0aG5hbWUpLnRvLmVxbCgnL2FwaS8xJyk7XG4gICAgZXhwZWN0KHAuYXV0aCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAucG9ydCkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAuc2VhcmNoKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QocC5xdWVyeSkudG8ubm90LmJlLm9rKCk7XG4gICAgZXhwZWN0KHAuaGFzaCkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsicGFyc2UiLCJ1cmwiLCJyZXN1bHQiLCJwcm90b2NvbCIsImF1dGgiLCJob3N0IiwicGF0aCIsImhhc2giLCJocmVmIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJzZWFyY2giLCJxdWVyeSIsImkiLCJsYXN0IiwiaW5kZXhPZiIsInN1YnN0cmluZyIsInNwbGl0IiwicGFyc2VJbnQiLCJwYXRoUGFydHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZVJvb3QiOiIifQ==