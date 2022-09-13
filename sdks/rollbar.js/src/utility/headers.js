/*
 * headers - Detect when fetch Headers are undefined and use a partial polyfill.
 *
 * A full polyfill is not used in order to keep package size as small as possible.
 * Since this is only used internally and is not added to the window object,
 * the full interface doesn't need to be supported.
 *
 * This implementation is modified from whatwg-fetch:
 * https://github.com/github/fetch
 */
function headers(headers) {
  if (typeof Headers === 'undefined') {
    return new FetchHeaders(headers);
  }

  return new Headers(headers);
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  return iterator
}

function FetchHeaders(headers) {
  this.map = {}

  if (headers instanceof FetchHeaders) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

FetchHeaders.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

FetchHeaders.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

FetchHeaders.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

FetchHeaders.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

FetchHeaders.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

module.exports = headers;
