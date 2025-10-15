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

function elementString(elem) {
  return elementArrayToString(treeToArray(elem));
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
    out.push(
      '[' + desc.attributes[i].key + '="' + desc.attributes[i].value + '"]',
    );
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
      out.attributes.push({ key: key, value: attr });
    }
  }
  return out;
}

/*
 * Detects if the given element matches any of the given class names (string or regex),
 * or CSS selectors.
 * @param {HTMLElement} element - The DOM element to check.
 * @param {Array<string|RegExp>} classes - An array of class names (string or regex) to match against.
 * @param {Array<string>} selectors - An array of CSS selectors to match against.
 * @return {boolean} - True if the element matches any of the classes or selectors, false otherwise.
 */
function isMatchingElement(element, classes, selectors) {
  try {
    for (const cls of classes) {
      if (typeof cls === 'string') {
        if (element.classList.contains(cls)) {
          return true;
        }
      } else {
        for (const c of element.classList) {
          if (cls.test(c)) {
            return true;
          }
        }
      }
    }
    for (const sel of selectors) {
      if (element.matches(sel)) {
        return true;
      }
    }
  } catch (e) {
    // ignore errors from invalid arguments
  }
  return false;
}

export {
  describeElement,
  descriptionToString,
  elementArrayToString,
  elementString,
  treeToArray,
  getElementFromEvent,
  isDescribedElement,
  getElementType,
  isMatchingElement,
};
