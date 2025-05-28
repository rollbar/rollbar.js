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

/***/ "./src/browser/domUtility.js":
/*!***********************************!*\
  !*** ./src/browser/domUtility.js ***!
  \***********************************/
/***/ ((module) => {

function getElementType(e) {
  return (e.getAttribute('type') || '').toLowerCase();
}
function isDescribedElement(element, type, subtypes) {
  if (element.tagName.toLowerCase() !== type.toLowerCase()) {
    return false;
  }
  if (!subtypes) {
    return true;
  }
  element = getElementType(element);
  for (var i = 0; i < subtypes.length; i++) {
    if (subtypes[i] === element) {
      return true;
    }
  }
  return false;
}
function getElementFromEvent(evt, doc) {
  if (evt.target) {
    return evt.target;
  }
  if (doc && doc.elementFromPoint) {
    return doc.elementFromPoint(evt.clientX, evt.clientY);
  }
  return undefined;
}
function treeToArray(elem) {
  var MAX_HEIGHT = 5;
  var out = [];
  var nextDescription;
  for (var height = 0; elem && height < MAX_HEIGHT; height++) {
    nextDescription = describeElement(elem);
    if (nextDescription.tagName === 'html') {
      break;
    }
    out.unshift(nextDescription);
    elem = elem.parentNode;
  }
  return out;
}
function elementArrayToString(a) {
  var MAX_LENGTH = 80;
  var separator = ' > ',
    separatorLength = separator.length;
  var out = [],
    len = 0,
    nextStr,
    totalLength;
  for (var i = a.length - 1; i >= 0; i--) {
    nextStr = descriptionToString(a[i]);
    totalLength = len + out.length * separatorLength + nextStr.length;
    if (i < a.length - 1 && totalLength >= MAX_LENGTH + 3) {
      out.unshift('...');
      break;
    }
    out.unshift(nextStr);
    len += nextStr.length;
  }
  return out.join(separator);
}
function descriptionToString(desc) {
  if (!desc || !desc.tagName) {
    return '';
  }
  var out = [desc.tagName];
  if (desc.id) {
    out.push('#' + desc.id);
  }
  if (desc.classes) {
    out.push('.' + desc.classes.join('.'));
  }
  for (var i = 0; i < desc.attributes.length; i++) {
    out.push('[' + desc.attributes[i].key + '="' + desc.attributes[i].value + '"]');
  }
  return out.join('');
}

/**
 * Input: a dom element
 * Output: null if tagName is falsey or input is falsey, else
 *  {
 *    tagName: String,
 *    id: String | undefined,
 *    classes: [String] | undefined,
 *    attributes: [
 *      {
 *        key: OneOf(type, name, title, alt),
 *        value: String
 *      }
 *    ]
 *  }
 */
function describeElement(elem) {
  if (!elem || !elem.tagName) {
    return null;
  }
  var out = {},
    className,
    key,
    attr,
    i;
  out.tagName = elem.tagName.toLowerCase();
  if (elem.id) {
    out.id = elem.id;
  }
  className = elem.className;
  if (className && typeof className === 'string') {
    out.classes = className.split(/\s+/);
  }
  var attributes = ['type', 'name', 'title', 'alt'];
  out.attributes = [];
  for (i = 0; i < attributes.length; i++) {
    key = attributes[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.attributes.push({
        key: key,
        value: attr
      });
    }
  }
  return out;
}
module.exports = {
  describeElement: describeElement,
  descriptionToString: descriptionToString,
  elementArrayToString: elementArrayToString,
  treeToArray: treeToArray,
  getElementFromEvent: getElementFromEvent,
  isDescribedElement: isDescribedElement,
  getElementType: getElementType
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
/*!*****************************************!*\
  !*** ./test/browser.domUtility.test.js ***!
  \*****************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var d = __webpack_require__(/*! ../src/browser/domUtility */ "./src/browser/domUtility.js");

function fullElement() {
  return {
    tagName: 'DIV',
    id: 'myId',
    className: 'a b c',
    getAttribute: function (t) {
      return {
        type: 'theType',
        name: 'someName',
        other: 'otherAttr',
      }[t];
    },
  };
}

function genElement(tag, id, classes, type, name) {
  var elem = {
    tagName: tag,
    getAttribute: function (t) {
      return {
        type: type,
        name: name,
        other: 'otherAttr',
      }[t];
    },
  };
  if (id) {
    elem.id = id;
  }
  if (classes) {
    elem.className = classes;
  }
  return elem;
}

describe('isDescribedElement', function () {
  it('should match the type without subtypes', function () {
    var e = genElement('div', null, null, 'text');
    expect(d.isDescribedElement(e, 'div')).to.be.ok();
    expect(d.isDescribedElement(e, 'DIV')).to.be.ok();
    expect(d.isDescribedElement(e, 'span')).to.not.be.ok();
  });
  it('should work with subtypes', function () {
    var e = genElement('div', null, null, 'text');
    expect(d.isDescribedElement(e, 'div', ['input', 'text'])).to.be.ok();
    expect(d.isDescribedElement(e, 'div', ['input', 'nottext'])).to.not.be.ok();
    expect(d.isDescribedElement(e, 'div', [])).to.not.be.ok();
  });
  it('should work if element has no type', function () {
    var e = genElement('div');
    expect(d.isDescribedElement(e, 'div', ['input', 'text'])).to.not.be.ok();
    expect(d.isDescribedElement(e, 'div')).to.be.ok();
  });
});

describe('describeElement', function () {
  it('should include the id', function () {
    var elem = fullElement();
    var description = d.describeElement(elem);
    expect(description.id).to.eql('myId');
  });
  it('should have the right tag name', function () {
    var elem = fullElement();
    var description = d.describeElement(elem);
    expect(description.tagName).to.eql('div');
  });
});

describe('descriptionToString', function () {
  it('should be right', function () {
    var elem = fullElement();
    var desc = d.describeElement(elem);
    var str = d.descriptionToString(desc);
    expect(str).to.eql('div#myId.a.b.c[type="theType"][name="someName"]');
  });
});

describe('treeToArray', function () {
  it('should follow parent pointers', function () {
    var base = genElement('span', 'cool');
    base.parentNode = genElement('div', 'parent');
    var arr = d.treeToArray(base);
    expect(arr.length).to.eql(2);
  });
  it('should not stop before html tag', function () {
    var e1 = genElement('div', 'cool');
    var e2 = genElement('div', null, 'a b');
    var h = genElement('html');
    e1.parentNode = e2;
    e2.parentNode = h;
    var arr = d.treeToArray(e1);
    expect(arr.length).to.eql(2);
  });
  it('should cap out at 5 elements', function () {
    var e1 = genElement('div', 'cool');
    var e2 = genElement('div', null, 'a b');
    var e3 = genElement('div', null, 'a b');
    var e4 = genElement('div', null, 'a b');
    var e5 = genElement('div', null, 'a b');
    var e6 = genElement('div', null, 'a b');
    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;
    var arr = d.treeToArray(e1);
    expect(arr.length).to.eql(5);
  });
  it('should put the innermost element last', function () {
    var e1 = genElement('div', 'id1');
    var e2 = genElement('div', 'id2', 'a b');
    var e3 = genElement('div', 'id3', 'a b');
    var e4 = genElement('div', 'id4', 'a b');
    var e5 = genElement('div', 'id5', 'a b');
    var e6 = genElement('div', 'id6', 'a b');
    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;
    var arr = d.treeToArray(e1);
    expect(arr[4].id).to.eql('id1');
    expect(arr[0].id).to.eql('id5');
  });
});

describe('elementArrayToString', function () {
  it('should work with one element', function () {
    var e1 = { tagName: 'div', id: 'id1', classes: ['a', 'b'], attributes: [] };
    var arr = [e1];
    var res = d.elementArrayToString(arr);
    expect(res).to.eql('div#id1.a.b');
  });
  it('should work with two elements', function () {
    var e1 = { tagName: 'div', id: 'id1', classes: ['a', 'b'], attributes: [] };
    var e2 = {
      tagName: 'div',
      id: 'id2',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing' }],
    };
    var arr = [e1, e2];
    var res = d.elementArrayToString(arr);
    expect(res).to.eql('div#id1.a.b > div#id2.a.b.c[name="thing"]');
  });
  it('should truncate at 80 characters max without breaking within a element', function () {
    var e1 = { tagName: 'div', id: 'id1', classes: ['a', 'b'], attributes: [] };
    var e2 = {
      tagName: 'div',
      id: 'id2',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing2' }],
    };
    var e3 = { tagName: 'div', id: 'id3', classes: ['a', 'b'], attributes: [] };
    var e4 = {
      tagName: 'div',
      id: 'id4',
      classes: ['a', 'b', 'c'],
      attributes: [{ key: 'name', value: 'thing4' }],
    };
    var arr = [e1, e2, e3, e4];
    var res = d.elementArrayToString(arr);
    expect(res).to.eql(
      '... > div#id2.a.b.c[name="thing2"] > div#id3.a.b > div#id4.a.b.c[name="thing4"]',
    );
  });
});

describe('everything', function () {
  it('should work with one element', function () {
    var e = genElement('div', 'id1');
    var description = d.descriptionToString(d.describeElement(e));
    var result = d.elementArrayToString(d.treeToArray(e));
    expect(description).to.eql(result);
  });
  it('should work with many elements', function () {
    var e1 = genElement('div', 'id1');
    var e2 = genElement('div', 'id2', 'a b', 'input');
    var e3 = genElement('div', 'id3', 'a b', null, 'thing');
    var e4 = genElement('div', 'id4', 'a b');
    var e5 = genElement('div', 'id5', 'a b');
    var e6 = genElement('div', 'id6', 'a b');

    e1.parentNode = e2;
    e2.parentNode = e3;
    e3.parentNode = e4;
    e4.parentNode = e5;
    e5.parentNode = e6;

    var d1 = d.descriptionToString(d.describeElement(e1));
    var d2 = d.descriptionToString(d.describeElement(e2));
    var d3 = d.descriptionToString(d.describeElement(e3));
    var d4 = d.descriptionToString(d.describeElement(e4));
    var d5 = d.descriptionToString(d.describeElement(e5));
    var d6 = d.descriptionToString(d.describeElement(e6));

    var description = ['...', d4, d3, d2, d1].join(' > ');
    var result = d.elementArrayToString(d.treeToArray(e1));

    expect(description).to.eql(result);
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkJBQTZCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDhCQUE4QjtBQUNuRDtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYnJvd3Nlci9kb21VdGlsaXR5LmpzIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvYnJvd3Nlci5kb21VdGlsaXR5LnRlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIHtcblx0XHR2YXIgYSA9IGZhY3RvcnkoKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCJmdW5jdGlvbiBnZXRFbGVtZW50VHlwZShlKSB7XG4gIHJldHVybiAoZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gaXNEZXNjcmliZWRFbGVtZW50KGVsZW1lbnQsIHR5cGUsIHN1YnR5cGVzKSB7XG4gIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gdHlwZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghc3VidHlwZXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBlbGVtZW50ID0gZ2V0RWxlbWVudFR5cGUoZWxlbWVudCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3VidHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3VidHlwZXNbaV0gPT09IGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRGcm9tRXZlbnQoZXZ0LCBkb2MpIHtcbiAgaWYgKGV2dC50YXJnZXQpIHtcbiAgICByZXR1cm4gZXZ0LnRhcmdldDtcbiAgfVxuICBpZiAoZG9jICYmIGRvYy5lbGVtZW50RnJvbVBvaW50KSB7XG4gICAgcmV0dXJuIGRvYy5lbGVtZW50RnJvbVBvaW50KGV2dC5jbGllbnRYLCBldnQuY2xpZW50WSk7XG4gIH1cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gdHJlZVRvQXJyYXkoZWxlbSkge1xuICB2YXIgTUFYX0hFSUdIVCA9IDU7XG4gIHZhciBvdXQgPSBbXTtcbiAgdmFyIG5leHREZXNjcmlwdGlvbjtcbiAgZm9yICh2YXIgaGVpZ2h0ID0gMDsgZWxlbSAmJiBoZWlnaHQgPCBNQVhfSEVJR0hUOyBoZWlnaHQrKykge1xuICAgIG5leHREZXNjcmlwdGlvbiA9IGRlc2NyaWJlRWxlbWVudChlbGVtKTtcbiAgICBpZiAobmV4dERlc2NyaXB0aW9uLnRhZ05hbWUgPT09ICdodG1sJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIG91dC51bnNoaWZ0KG5leHREZXNjcmlwdGlvbik7XG4gICAgZWxlbSA9IGVsZW0ucGFyZW50Tm9kZTtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiBlbGVtZW50QXJyYXlUb1N0cmluZyhhKSB7XG4gIHZhciBNQVhfTEVOR1RIID0gODA7XG4gIHZhciBzZXBhcmF0b3IgPSAnID4gJyxcbiAgICBzZXBhcmF0b3JMZW5ndGggPSBzZXBhcmF0b3IubGVuZ3RoO1xuICB2YXIgb3V0ID0gW10sXG4gICAgbGVuID0gMCxcbiAgICBuZXh0U3RyLFxuICAgIHRvdGFsTGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSBhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbmV4dFN0ciA9IGRlc2NyaXB0aW9uVG9TdHJpbmcoYVtpXSk7XG4gICAgdG90YWxMZW5ndGggPSBsZW4gKyBvdXQubGVuZ3RoICogc2VwYXJhdG9yTGVuZ3RoICsgbmV4dFN0ci5sZW5ndGg7XG4gICAgaWYgKGkgPCBhLmxlbmd0aCAtIDEgJiYgdG90YWxMZW5ndGggPj0gTUFYX0xFTkdUSCArIDMpIHtcbiAgICAgIG91dC51bnNoaWZ0KCcuLi4nKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvdXQudW5zaGlmdChuZXh0U3RyKTtcbiAgICBsZW4gKz0gbmV4dFN0ci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIG91dC5qb2luKHNlcGFyYXRvcik7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaXB0aW9uVG9TdHJpbmcoZGVzYykge1xuICBpZiAoIWRlc2MgfHwgIWRlc2MudGFnTmFtZSkge1xuICAgIHJldHVybiAnJztcbiAgfVxuICB2YXIgb3V0ID0gW2Rlc2MudGFnTmFtZV07XG4gIGlmIChkZXNjLmlkKSB7XG4gICAgb3V0LnB1c2goJyMnICsgZGVzYy5pZCk7XG4gIH1cbiAgaWYgKGRlc2MuY2xhc3Nlcykge1xuICAgIG91dC5wdXNoKCcuJyArIGRlc2MuY2xhc3Nlcy5qb2luKCcuJykpO1xuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGVzYy5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0LnB1c2goXG4gICAgICAnWycgKyBkZXNjLmF0dHJpYnV0ZXNbaV0ua2V5ICsgJz1cIicgKyBkZXNjLmF0dHJpYnV0ZXNbaV0udmFsdWUgKyAnXCJdJyxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG91dC5qb2luKCcnKTtcbn1cblxuLyoqXG4gKiBJbnB1dDogYSBkb20gZWxlbWVudFxuICogT3V0cHV0OiBudWxsIGlmIHRhZ05hbWUgaXMgZmFsc2V5IG9yIGlucHV0IGlzIGZhbHNleSwgZWxzZVxuICogIHtcbiAqICAgIHRhZ05hbWU6IFN0cmluZyxcbiAqICAgIGlkOiBTdHJpbmcgfCB1bmRlZmluZWQsXG4gKiAgICBjbGFzc2VzOiBbU3RyaW5nXSB8IHVuZGVmaW5lZCxcbiAqICAgIGF0dHJpYnV0ZXM6IFtcbiAqICAgICAge1xuICogICAgICAgIGtleTogT25lT2YodHlwZSwgbmFtZSwgdGl0bGUsIGFsdCksXG4gKiAgICAgICAgdmFsdWU6IFN0cmluZ1xuICogICAgICB9XG4gKiAgICBdXG4gKiAgfVxuICovXG5mdW5jdGlvbiBkZXNjcmliZUVsZW1lbnQoZWxlbSkge1xuICBpZiAoIWVsZW0gfHwgIWVsZW0udGFnTmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBvdXQgPSB7fSxcbiAgICBjbGFzc05hbWUsXG4gICAga2V5LFxuICAgIGF0dHIsXG4gICAgaTtcbiAgb3V0LnRhZ05hbWUgPSBlbGVtLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGVsZW0uaWQpIHtcbiAgICBvdXQuaWQgPSBlbGVtLmlkO1xuICB9XG4gIGNsYXNzTmFtZSA9IGVsZW0uY2xhc3NOYW1lO1xuICBpZiAoY2xhc3NOYW1lICYmIHR5cGVvZiBjbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgb3V0LmNsYXNzZXMgPSBjbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgfVxuICB2YXIgYXR0cmlidXRlcyA9IFsndHlwZScsICduYW1lJywgJ3RpdGxlJywgJ2FsdCddO1xuICBvdXQuYXR0cmlidXRlcyA9IFtdO1xuICBmb3IgKGkgPSAwOyBpIDwgYXR0cmlidXRlcy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IGF0dHJpYnV0ZXNbaV07XG4gICAgYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKGtleSk7XG4gICAgaWYgKGF0dHIpIHtcbiAgICAgIG91dC5hdHRyaWJ1dGVzLnB1c2goeyBrZXk6IGtleSwgdmFsdWU6IGF0dHIgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZXNjcmliZUVsZW1lbnQ6IGRlc2NyaWJlRWxlbWVudCxcbiAgZGVzY3JpcHRpb25Ub1N0cmluZzogZGVzY3JpcHRpb25Ub1N0cmluZyxcbiAgZWxlbWVudEFycmF5VG9TdHJpbmc6IGVsZW1lbnRBcnJheVRvU3RyaW5nLFxuICB0cmVlVG9BcnJheTogdHJlZVRvQXJyYXksXG4gIGdldEVsZW1lbnRGcm9tRXZlbnQ6IGdldEVsZW1lbnRGcm9tRXZlbnQsXG4gIGlzRGVzY3JpYmVkRWxlbWVudDogaXNEZXNjcmliZWRFbGVtZW50LFxuICBnZXRFbGVtZW50VHlwZTogZ2V0RWxlbWVudFR5cGUsXG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8qIGdsb2JhbHMgZXhwZWN0ICovXG4vKiBnbG9iYWxzIGRlc2NyaWJlICovXG4vKiBnbG9iYWxzIGl0ICovXG4vKiBnbG9iYWxzIHNpbm9uICovXG5cbnZhciBkID0gcmVxdWlyZSgnLi4vc3JjL2Jyb3dzZXIvZG9tVXRpbGl0eScpO1xuXG5mdW5jdGlvbiBmdWxsRWxlbWVudCgpIHtcbiAgcmV0dXJuIHtcbiAgICB0YWdOYW1lOiAnRElWJyxcbiAgICBpZDogJ215SWQnLFxuICAgIGNsYXNzTmFtZTogJ2EgYiBjJyxcbiAgICBnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAndGhlVHlwZScsXG4gICAgICAgIG5hbWU6ICdzb21lTmFtZScsXG4gICAgICAgIG90aGVyOiAnb3RoZXJBdHRyJyxcbiAgICAgIH1bdF07XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2VuRWxlbWVudCh0YWcsIGlkLCBjbGFzc2VzLCB0eXBlLCBuYW1lKSB7XG4gIHZhciBlbGVtID0ge1xuICAgIHRhZ05hbWU6IHRhZyxcbiAgICBnZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uICh0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBvdGhlcjogJ290aGVyQXR0cicsXG4gICAgICB9W3RdO1xuICAgIH0sXG4gIH07XG4gIGlmIChpZCkge1xuICAgIGVsZW0uaWQgPSBpZDtcbiAgfVxuICBpZiAoY2xhc3Nlcykge1xuICAgIGVsZW0uY2xhc3NOYW1lID0gY2xhc3NlcztcbiAgfVxuICByZXR1cm4gZWxlbTtcbn1cblxuZGVzY3JpYmUoJ2lzRGVzY3JpYmVkRWxlbWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBtYXRjaCB0aGUgdHlwZSB3aXRob3V0IHN1YnR5cGVzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gZ2VuRWxlbWVudCgnZGl2JywgbnVsbCwgbnVsbCwgJ3RleHQnKTtcbiAgICBleHBlY3QoZC5pc0Rlc2NyaWJlZEVsZW1lbnQoZSwgJ2RpdicpKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChkLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnRElWJykpLnRvLmJlLm9rKCk7XG4gICAgZXhwZWN0KGQuaXNEZXNjcmliZWRFbGVtZW50KGUsICdzcGFuJykpLnRvLm5vdC5iZS5vaygpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggc3VidHlwZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUgPSBnZW5FbGVtZW50KCdkaXYnLCBudWxsLCBudWxsLCAndGV4dCcpO1xuICAgIGV4cGVjdChkLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnZGl2JywgWydpbnB1dCcsICd0ZXh0J10pKS50by5iZS5vaygpO1xuICAgIGV4cGVjdChkLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnZGl2JywgWydpbnB1dCcsICdub3R0ZXh0J10pKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoZC5pc0Rlc2NyaWJlZEVsZW1lbnQoZSwgJ2RpdicsIFtdKSkudG8ubm90LmJlLm9rKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHdvcmsgaWYgZWxlbWVudCBoYXMgbm8gdHlwZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZSA9IGdlbkVsZW1lbnQoJ2RpdicpO1xuICAgIGV4cGVjdChkLmlzRGVzY3JpYmVkRWxlbWVudChlLCAnZGl2JywgWydpbnB1dCcsICd0ZXh0J10pKS50by5ub3QuYmUub2soKTtcbiAgICBleHBlY3QoZC5pc0Rlc2NyaWJlZEVsZW1lbnQoZSwgJ2RpdicpKS50by5iZS5vaygpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZGVzY3JpYmVFbGVtZW50JywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGluY2x1ZGUgdGhlIGlkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbGVtID0gZnVsbEVsZW1lbnQoKTtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBkLmRlc2NyaWJlRWxlbWVudChlbGVtKTtcbiAgICBleHBlY3QoZGVzY3JpcHRpb24uaWQpLnRvLmVxbCgnbXlJZCcpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYXZlIHRoZSByaWdodCB0YWcgbmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWxlbSA9IGZ1bGxFbGVtZW50KCk7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gZC5kZXNjcmliZUVsZW1lbnQoZWxlbSk7XG4gICAgZXhwZWN0KGRlc2NyaXB0aW9uLnRhZ05hbWUpLnRvLmVxbCgnZGl2Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdkZXNjcmlwdGlvblRvU3RyaW5nJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGJlIHJpZ2h0JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbGVtID0gZnVsbEVsZW1lbnQoKTtcbiAgICB2YXIgZGVzYyA9IGQuZGVzY3JpYmVFbGVtZW50KGVsZW0pO1xuICAgIHZhciBzdHIgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZGVzYyk7XG4gICAgZXhwZWN0KHN0cikudG8uZXFsKCdkaXYjbXlJZC5hLmIuY1t0eXBlPVwidGhlVHlwZVwiXVtuYW1lPVwic29tZU5hbWVcIl0nKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3RyZWVUb0FycmF5JywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGZvbGxvdyBwYXJlbnQgcG9pbnRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJhc2UgPSBnZW5FbGVtZW50KCdzcGFuJywgJ2Nvb2wnKTtcbiAgICBiYXNlLnBhcmVudE5vZGUgPSBnZW5FbGVtZW50KCdkaXYnLCAncGFyZW50Jyk7XG4gICAgdmFyIGFyciA9IGQudHJlZVRvQXJyYXkoYmFzZSk7XG4gICAgZXhwZWN0KGFyci5sZW5ndGgpLnRvLmVxbCgyKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgbm90IHN0b3AgYmVmb3JlIGh0bWwgdGFnJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlMSA9IGdlbkVsZW1lbnQoJ2RpdicsICdjb29sJyk7XG4gICAgdmFyIGUyID0gZ2VuRWxlbWVudCgnZGl2JywgbnVsbCwgJ2EgYicpO1xuICAgIHZhciBoID0gZ2VuRWxlbWVudCgnaHRtbCcpO1xuICAgIGUxLnBhcmVudE5vZGUgPSBlMjtcbiAgICBlMi5wYXJlbnROb2RlID0gaDtcbiAgICB2YXIgYXJyID0gZC50cmVlVG9BcnJheShlMSk7XG4gICAgZXhwZWN0KGFyci5sZW5ndGgpLnRvLmVxbCgyKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgY2FwIG91dCBhdCA1IGVsZW1lbnRzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlMSA9IGdlbkVsZW1lbnQoJ2RpdicsICdjb29sJyk7XG4gICAgdmFyIGUyID0gZ2VuRWxlbWVudCgnZGl2JywgbnVsbCwgJ2EgYicpO1xuICAgIHZhciBlMyA9IGdlbkVsZW1lbnQoJ2RpdicsIG51bGwsICdhIGInKTtcbiAgICB2YXIgZTQgPSBnZW5FbGVtZW50KCdkaXYnLCBudWxsLCAnYSBiJyk7XG4gICAgdmFyIGU1ID0gZ2VuRWxlbWVudCgnZGl2JywgbnVsbCwgJ2EgYicpO1xuICAgIHZhciBlNiA9IGdlbkVsZW1lbnQoJ2RpdicsIG51bGwsICdhIGInKTtcbiAgICBlMS5wYXJlbnROb2RlID0gZTI7XG4gICAgZTIucGFyZW50Tm9kZSA9IGUzO1xuICAgIGUzLnBhcmVudE5vZGUgPSBlNDtcbiAgICBlNC5wYXJlbnROb2RlID0gZTU7XG4gICAgZTUucGFyZW50Tm9kZSA9IGU2O1xuICAgIHZhciBhcnIgPSBkLnRyZWVUb0FycmF5KGUxKTtcbiAgICBleHBlY3QoYXJyLmxlbmd0aCkudG8uZXFsKDUpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBwdXQgdGhlIGlubmVybW9zdCBlbGVtZW50IGxhc3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUxID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkMScpO1xuICAgIHZhciBlMiA9IGdlbkVsZW1lbnQoJ2RpdicsICdpZDInLCAnYSBiJyk7XG4gICAgdmFyIGUzID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkMycsICdhIGInKTtcbiAgICB2YXIgZTQgPSBnZW5FbGVtZW50KCdkaXYnLCAnaWQ0JywgJ2EgYicpO1xuICAgIHZhciBlNSA9IGdlbkVsZW1lbnQoJ2RpdicsICdpZDUnLCAnYSBiJyk7XG4gICAgdmFyIGU2ID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkNicsICdhIGInKTtcbiAgICBlMS5wYXJlbnROb2RlID0gZTI7XG4gICAgZTIucGFyZW50Tm9kZSA9IGUzO1xuICAgIGUzLnBhcmVudE5vZGUgPSBlNDtcbiAgICBlNC5wYXJlbnROb2RlID0gZTU7XG4gICAgZTUucGFyZW50Tm9kZSA9IGU2O1xuICAgIHZhciBhcnIgPSBkLnRyZWVUb0FycmF5KGUxKTtcbiAgICBleHBlY3QoYXJyWzRdLmlkKS50by5lcWwoJ2lkMScpO1xuICAgIGV4cGVjdChhcnJbMF0uaWQpLnRvLmVxbCgnaWQ1Jyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdlbGVtZW50QXJyYXlUb1N0cmluZycsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggb25lIGVsZW1lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUxID0geyB0YWdOYW1lOiAnZGl2JywgaWQ6ICdpZDEnLCBjbGFzc2VzOiBbJ2EnLCAnYiddLCBhdHRyaWJ1dGVzOiBbXSB9O1xuICAgIHZhciBhcnIgPSBbZTFdO1xuICAgIHZhciByZXMgPSBkLmVsZW1lbnRBcnJheVRvU3RyaW5nKGFycik7XG4gICAgZXhwZWN0KHJlcykudG8uZXFsKCdkaXYjaWQxLmEuYicpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggdHdvIGVsZW1lbnRzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlMSA9IHsgdGFnTmFtZTogJ2RpdicsIGlkOiAnaWQxJywgY2xhc3NlczogWydhJywgJ2InXSwgYXR0cmlidXRlczogW10gfTtcbiAgICB2YXIgZTIgPSB7XG4gICAgICB0YWdOYW1lOiAnZGl2JyxcbiAgICAgIGlkOiAnaWQyJyxcbiAgICAgIGNsYXNzZXM6IFsnYScsICdiJywgJ2MnXSxcbiAgICAgIGF0dHJpYnV0ZXM6IFt7IGtleTogJ25hbWUnLCB2YWx1ZTogJ3RoaW5nJyB9XSxcbiAgICB9O1xuICAgIHZhciBhcnIgPSBbZTEsIGUyXTtcbiAgICB2YXIgcmVzID0gZC5lbGVtZW50QXJyYXlUb1N0cmluZyhhcnIpO1xuICAgIGV4cGVjdChyZXMpLnRvLmVxbCgnZGl2I2lkMS5hLmIgPiBkaXYjaWQyLmEuYi5jW25hbWU9XCJ0aGluZ1wiXScpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCB0cnVuY2F0ZSBhdCA4MCBjaGFyYWN0ZXJzIG1heCB3aXRob3V0IGJyZWFraW5nIHdpdGhpbiBhIGVsZW1lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUxID0geyB0YWdOYW1lOiAnZGl2JywgaWQ6ICdpZDEnLCBjbGFzc2VzOiBbJ2EnLCAnYiddLCBhdHRyaWJ1dGVzOiBbXSB9O1xuICAgIHZhciBlMiA9IHtcbiAgICAgIHRhZ05hbWU6ICdkaXYnLFxuICAgICAgaWQ6ICdpZDInLFxuICAgICAgY2xhc3NlczogWydhJywgJ2InLCAnYyddLFxuICAgICAgYXR0cmlidXRlczogW3sga2V5OiAnbmFtZScsIHZhbHVlOiAndGhpbmcyJyB9XSxcbiAgICB9O1xuICAgIHZhciBlMyA9IHsgdGFnTmFtZTogJ2RpdicsIGlkOiAnaWQzJywgY2xhc3NlczogWydhJywgJ2InXSwgYXR0cmlidXRlczogW10gfTtcbiAgICB2YXIgZTQgPSB7XG4gICAgICB0YWdOYW1lOiAnZGl2JyxcbiAgICAgIGlkOiAnaWQ0JyxcbiAgICAgIGNsYXNzZXM6IFsnYScsICdiJywgJ2MnXSxcbiAgICAgIGF0dHJpYnV0ZXM6IFt7IGtleTogJ25hbWUnLCB2YWx1ZTogJ3RoaW5nNCcgfV0sXG4gICAgfTtcbiAgICB2YXIgYXJyID0gW2UxLCBlMiwgZTMsIGU0XTtcbiAgICB2YXIgcmVzID0gZC5lbGVtZW50QXJyYXlUb1N0cmluZyhhcnIpO1xuICAgIGV4cGVjdChyZXMpLnRvLmVxbChcbiAgICAgICcuLi4gPiBkaXYjaWQyLmEuYi5jW25hbWU9XCJ0aGluZzJcIl0gPiBkaXYjaWQzLmEuYiA+IGRpdiNpZDQuYS5iLmNbbmFtZT1cInRoaW5nNFwiXScsXG4gICAgKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2V2ZXJ5dGhpbmcnLCBmdW5jdGlvbiAoKSB7XG4gIGl0KCdzaG91bGQgd29yayB3aXRoIG9uZSBlbGVtZW50JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkMScpO1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IGQuZGVzY3JpcHRpb25Ub1N0cmluZyhkLmRlc2NyaWJlRWxlbWVudChlKSk7XG4gICAgdmFyIHJlc3VsdCA9IGQuZWxlbWVudEFycmF5VG9TdHJpbmcoZC50cmVlVG9BcnJheShlKSk7XG4gICAgZXhwZWN0KGRlc2NyaXB0aW9uKS50by5lcWwocmVzdWx0KTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgd29yayB3aXRoIG1hbnkgZWxlbWVudHMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGUxID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkMScpO1xuICAgIHZhciBlMiA9IGdlbkVsZW1lbnQoJ2RpdicsICdpZDInLCAnYSBiJywgJ2lucHV0Jyk7XG4gICAgdmFyIGUzID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkMycsICdhIGInLCBudWxsLCAndGhpbmcnKTtcbiAgICB2YXIgZTQgPSBnZW5FbGVtZW50KCdkaXYnLCAnaWQ0JywgJ2EgYicpO1xuICAgIHZhciBlNSA9IGdlbkVsZW1lbnQoJ2RpdicsICdpZDUnLCAnYSBiJyk7XG4gICAgdmFyIGU2ID0gZ2VuRWxlbWVudCgnZGl2JywgJ2lkNicsICdhIGInKTtcblxuICAgIGUxLnBhcmVudE5vZGUgPSBlMjtcbiAgICBlMi5wYXJlbnROb2RlID0gZTM7XG4gICAgZTMucGFyZW50Tm9kZSA9IGU0O1xuICAgIGU0LnBhcmVudE5vZGUgPSBlNTtcbiAgICBlNS5wYXJlbnROb2RlID0gZTY7XG5cbiAgICB2YXIgZDEgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZC5kZXNjcmliZUVsZW1lbnQoZTEpKTtcbiAgICB2YXIgZDIgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZC5kZXNjcmliZUVsZW1lbnQoZTIpKTtcbiAgICB2YXIgZDMgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZC5kZXNjcmliZUVsZW1lbnQoZTMpKTtcbiAgICB2YXIgZDQgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZC5kZXNjcmliZUVsZW1lbnQoZTQpKTtcbiAgICB2YXIgZDUgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZC5kZXNjcmliZUVsZW1lbnQoZTUpKTtcbiAgICB2YXIgZDYgPSBkLmRlc2NyaXB0aW9uVG9TdHJpbmcoZC5kZXNjcmliZUVsZW1lbnQoZTYpKTtcblxuICAgIHZhciBkZXNjcmlwdGlvbiA9IFsnLi4uJywgZDQsIGQzLCBkMiwgZDFdLmpvaW4oJyA+ICcpO1xuICAgIHZhciByZXN1bHQgPSBkLmVsZW1lbnRBcnJheVRvU3RyaW5nKGQudHJlZVRvQXJyYXkoZTEpKTtcblxuICAgIGV4cGVjdChkZXNjcmlwdGlvbikudG8uZXFsKHJlc3VsdCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiZ2V0RWxlbWVudFR5cGUiLCJlIiwiZ2V0QXR0cmlidXRlIiwidG9Mb3dlckNhc2UiLCJpc0Rlc2NyaWJlZEVsZW1lbnQiLCJlbGVtZW50IiwidHlwZSIsInN1YnR5cGVzIiwidGFnTmFtZSIsImkiLCJsZW5ndGgiLCJnZXRFbGVtZW50RnJvbUV2ZW50IiwiZXZ0IiwiZG9jIiwidGFyZ2V0IiwiZWxlbWVudEZyb21Qb2ludCIsImNsaWVudFgiLCJjbGllbnRZIiwidW5kZWZpbmVkIiwidHJlZVRvQXJyYXkiLCJlbGVtIiwiTUFYX0hFSUdIVCIsIm91dCIsIm5leHREZXNjcmlwdGlvbiIsImhlaWdodCIsImRlc2NyaWJlRWxlbWVudCIsInVuc2hpZnQiLCJwYXJlbnROb2RlIiwiZWxlbWVudEFycmF5VG9TdHJpbmciLCJhIiwiTUFYX0xFTkdUSCIsInNlcGFyYXRvciIsInNlcGFyYXRvckxlbmd0aCIsImxlbiIsIm5leHRTdHIiLCJ0b3RhbExlbmd0aCIsImRlc2NyaXB0aW9uVG9TdHJpbmciLCJqb2luIiwiZGVzYyIsImlkIiwicHVzaCIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwia2V5IiwidmFsdWUiLCJjbGFzc05hbWUiLCJhdHRyIiwic3BsaXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZVJvb3QiOiIifQ==