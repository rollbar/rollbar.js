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

/***/ "./src/simple-commonjs.js":
/*!********************************!*\
  !*** ./src/simple-commonjs.js ***!
  \********************************/
/***/ ((module) => {

function add(a, b) {
  return a + b;
}
function multiply(a, b) {
  return a * b;
}
module.exports = {
  add: add,
  multiply: multiply
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
/*!**************************************!*\
  !*** ./test/simple-commonjs.test.js ***!
  \**************************************/
const { add, multiply } = __webpack_require__(/*! ../src/simple-commonjs.js */ "./src/simple-commonjs.js");

describe('Simple Test', function () {
  it('should fail', function () {
    throw new Error('This test intentionally fails');
  });

  it('should pass', function () {
    // This test passes
    const result = add(2, 3);
    if (result !== 5) {
      throw new Error('Add function failed');
    }
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLWNvbW1vbmpzLnRlc3QuanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87Ozs7Ozs7OztBQ1ZBLFNBQVNBLEdBQUdBLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxFQUFFO0VBQ2pCLE9BQU9ELENBQUMsR0FBR0MsQ0FBQztBQUNkO0FBRUEsU0FBU0MsUUFBUUEsQ0FBQ0YsQ0FBQyxFQUFFQyxDQUFDLEVBQUU7RUFDdEIsT0FBT0QsQ0FBQyxHQUFHQyxDQUFDO0FBQ2Q7QUFFQUUsTUFBTSxDQUFDQyxPQUFPLEdBQUc7RUFDZkwsR0FBRyxFQUFIQSxHQUFHO0VBQ0hHLFFBQVEsRUFBUkE7QUFDRixDQUFDOzs7Ozs7VUNYRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7QUN0QkEsUUFBUSxnQkFBZ0IsRUFBRSxtQkFBTyxDQUFDLDJEQUEyQjs7QUFFN0Q7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvc2ltcGxlLWNvbW1vbmpzLmpzIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3Qvc2ltcGxlLWNvbW1vbmpzLnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCJmdW5jdGlvbiBhZGQoYSwgYikge1xuICByZXR1cm4gYSArIGI7XG59XG5cbmZ1bmN0aW9uIG11bHRpcGx5KGEsIGIpIHtcbiAgcmV0dXJuIGEgKiBiO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkLFxuICBtdWx0aXBseSxcbn07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgeyBhZGQsIG11bHRpcGx5IH0gPSByZXF1aXJlKCcuLi9zcmMvc2ltcGxlLWNvbW1vbmpzLmpzJyk7XG5cbmRlc2NyaWJlKCdTaW1wbGUgVGVzdCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBmYWlsJywgZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhpcyB0ZXN0IGludGVudGlvbmFsbHkgZmFpbHMnKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwYXNzJywgZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoaXMgdGVzdCBwYXNzZXNcbiAgICBjb25zdCByZXN1bHQgPSBhZGQoMiwgMyk7XG4gICAgaWYgKHJlc3VsdCAhPT0gNSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGQgZnVuY3Rpb24gZmFpbGVkJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbImFkZCIsImEiLCJiIiwibXVsdGlwbHkiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZVJvb3QiOiIifQ==