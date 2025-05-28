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

/***/ "./node_modules/base64-js/lib/b64.js":
/*!*******************************************!*\
  !*** ./node_modules/base64-js/lib/b64.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}( false ? (0) : exports))


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/lib/b64.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = __webpack_require__.g.TYPED_ARRAY_SUPPORT !== undefined
  ? __webpack_require__.g.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}


/***/ }),

/***/ "./node_modules/error-stack-parser/error-stack-parser.js":
/*!***************************************************************!*\
  !*** ./node_modules/error-stack-parser/error-stack-parser.js ***!
  \***************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "./node_modules/error-stack-parser/node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else // removed by dead control flow
{}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return filtered.map(function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
                }
                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');

                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
                // case it has spaces in it, as the string is split on \s+ later on
                var location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

                // remove the parenthesized location from the line, if it was matched
                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

                var tokens = sanitizedLine.split(/\s+/).slice(1);
                // if a location was matched, pass it to extractLocation() otherwise pop the last token
                var locationParts = this.extractLocation(location ? location[1] : tokens.pop());
                var functionName = tokens.join(' ') || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame({
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return filtered.map(function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                    var matches = line.match(functionNameRegex);
                    var functionName = matches && matches[1] ? matches[1] : undefined;
                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                    return new StackFrame({
                        functionName: functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2],
                        source: line
                    });
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame({
                            functionName: match[3] || undefined,
                            fileName: match[2],
                            lineNumber: match[1],
                            source: lines[i]
                        })
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return filtered.map(function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                    .replace(/<anonymous function(: (\w+))?>/, '$2')
                    .replace(/\([^)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');

                return new StackFrame({
                    functionName: functionName,
                    args: args,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        }
    };
}));


/***/ }),

/***/ "./node_modules/error-stack-parser/node_modules/stackframe/stackframe.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/error-stack-parser/node_modules/stackframe/stackframe.js ***!
  \*******************************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else // removed by dead control flow
{}
}(this, function() {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function() {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];
    var objectProps = ['evalOrigin'];

    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

    function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
            if (obj[props[i]] !== undefined) {
                this['set' + _capitalize(props[i])](obj[props[i]]);
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function() {
            return this.args;
        },
        setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function() {
            return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function() {
            var fileName = this.getFileName() || '';
            var lineNumber = this.getLineNumber() || '';
            var columnNumber = this.getColumnNumber() || '';
            var functionName = this.getFunctionName() || '';
            if (this.getIsEval()) {
                if (fileName) {
                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                }
                return '[eval]:' + lineNumber + ':' + columnNumber;
            }
            if (functionName) {
                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
            }
            return fileName + ':' + lineNumber + ':' + columnNumber;
        }
    };

    StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf('(');
        var argsEndIndex = str.lastIndexOf(')');

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf('@') === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
        }

        return new StackFrame({
            functionName: functionName,
            args: args || undefined,
            fileName: fileName,
            lineNumber: lineNumber || undefined,
            columnNumber: columnNumber || undefined
        });
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
            return function(v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
            return function(v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
            return function(v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"rollbar","version":"3.0.0-alpha.0","repository":{"type":"git","url":"http://github.com/rollbar/rollbar.js"},"description":"Effortlessly track and debug errors in your JavaScript applications with Rollbar. This package includes advanced error tracking features and an intuitive interface to help you identify and fix issues more quickly.","keywords":["error","tracking","logging","debugging","javascript"],"license":"MIT","main":"src/server/rollbar.js","browser":"dist/rollbar.umd.min.js","types":"./index.d.ts","dependencies":{"@rrweb/record":"^2.0.0-alpha.18","async":"~3.2.3","console-polyfill":"0.3.0","error-stack-parser":"^2.0.4","json-stringify-safe":"~5.0.0","lru-cache":"~2.2.1","request-ip":"~3.3.0","source-map":"^0.5.7"},"devDependencies":{"@babel/core":"^7.26.10","@babel/eslint-parser":"^7.27.0","@babel/preset-env":"^7.26.9","@rollup/plugin-commonjs":"^28.0.3","@rollup/plugin-node-resolve":"^16.0.1","@web/dev-server-rollup":"^0.6.4","@web/test-runner":"^0.20.2","@web/test-runner-playwright":"^0.11.0","babel-eslint":"^10.0.3","babel-loader":"^9.2.1","bluebird":"^3.3.5","chai":"^4.2.0","chalk":"^1.1.1","coverage-istanbul-loader":"^3.0.5","eslint":"^9.24.0","express":"^4.21.2","glob":"^5.0.14","grunt":"^1.1.0","grunt-bumpup":"^0.6.3","grunt-cli":"^1.5.0","grunt-contrib-concat":"^2.1.0","grunt-contrib-connect":"^2.1.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-jshint":"^3.2.0","grunt-contrib-uglify":"^4.0.0","grunt-contrib-watch":"^1.1.0","grunt-karma":"^4.0.2","grunt-parallel":"^0.5.1","grunt-text-replace":"^0.4.0","grunt-vows":"^0.4.2","grunt-webpack":"^5.0.0","jade":"~0.27.7","jasmine-core":"^2.3.4","jquery-mockjax":"^2.5.0","karma":"^6.4.4","karma-chai":"^0.1.0","karma-chrome-launcher":"^2.2.0","karma-expect":"^1.1.0","karma-firefox-launcher":"^0.1.6","karma-html2js-preprocessor":"^1.1.0","karma-jquery":"^0.1.0","karma-mocha":"^2.0.1","karma-mocha-reporter":"^2.2.5","karma-requirejs":"^0.2.2","karma-safari-launcher":"^0.1.1","karma-sinon":"^1.0.4","karma-sourcemap-loader":"^0.3.5","karma-webpack":"^5.0.0","mocha":"^11.1.0","natives":"^1.1.6","nock":"^11.9.1","node-libs-browser":"^0.5.2","prettier":"^3.2.5","requirejs":"^2.3.7","script-loader":"0.6.1","sinon":"^8.1.1","stackframe":"^0.2.2","time-grunt":"^1.0.0","vows":"^0.8.3","webpack":"^5.98.0"},"scripts":{"build":"./node_modules/.bin/grunt","test":"./node_modules/.bin/grunt test","test-browser":"./node_modules/.bin/grunt test-browser","test-browser-wtr":"npm run test-browser:bundle && npm run test-browser:run","test-browser:bundle":"webpack-cli --config webpack.test.config.js","test-browser:run":"web-test-runner","test-server":"./node_modules/.bin/grunt test-server","test-replay":"./node_modules/.bin/grunt test-replay","test-replay-wtr":"web-test-runner --files \'test-dist/replay/**/*.test.js\'","test-replay-unit":"./node_modules/.bin/grunt test-replay-unit","test-replay-integration":"./node_modules/.bin/grunt test-replay-integration","test_ci":"./node_modules/.bin/grunt test","lint":"./node_modules/.bin/eslint ."},"cdn":{"host":"cdn.rollbar.com"},"defaults":{"endpoint":"api.rollbar.com/api/1/item/","server":{"scrubHeaders":["authorization","www-authorization","http_authorization","omniauth.auth","cookie","oauth-access-token","x-access-token","x_csrf_token","http_x_csrf_token","x-csrf-token"],"scrubFields":["pw","pass","passwd","password","password_confirmation","passwordConfirmation","confirm_password","confirmPassword","secret","secret_token","secretToken","secret_key","secretKey","api_key","access_token","accessToken","authenticity_token","oauth_token","token","user_session_secret","request.session.csrf","request.session._csrf","request.params._csrf","request.cookie","request.cookies"]},"reactNative":{"rewriteFilenamePatterns":["^.*/[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/[^/]*.app/(.*)$","^.*/[0-9A-Fa-f]{64}/codepush_ios/(.*)$","^.*/[0-9A-Fa-f]{64}/codepush_android/(.*)$","^.*/[0-9A-Fa-f]{64}/CodePush/(.*)$"]},"logLevel":"debug","reportLevel":"debug","uncaughtErrorLevel":"error","maxItems":0,"itemsPerMin":60},"plugins":{"jquery":{"version":"0.0.8"}}}');

/***/ }),

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var helpers = __webpack_require__(/*! ./apiUtility */ "./src/apiUtility.js");
var defaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/item/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443
};
var OTLPDefaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/session/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443
};

/**
 * Api is an object that encapsulates methods of communicating with
 * the Rollbar API.  It is a standard interface with some parts implemented
 * differently for server or browser contexts.  It is an object that should
 * be instantiated when used so it can contain non-global options that may
 * be different for another instance of RollbarApi.
 *
 * @param options {
 *    accessToken: the accessToken to use for posting items to rollbar
 *    endpoint: an alternative endpoint to send errors to
 *        must be a valid, fully qualified URL.
 *        The default is: https://api.rollbar.com/api/1/item
 *    proxy: if you wish to proxy requests provide an object
 *        with the following keys:
 *          host or hostname (required): foo.example.com
 *          port (optional): 123
 *          protocol (optional): https
 * }
 */
function Api(options, transport, urllib, truncation) {
  this.options = options;
  this.transport = transport;
  this.url = urllib;
  this.truncation = truncation;
  this.accessToken = options.accessToken;
  this.transportOptions = _getTransport(options, urllib);
  this.OTLPTransportOptions = _getOTLPTransport(options, urllib);
}

/**
 * Wraps transport.post in a Promise to support async/await
 *
 * @param {Object} options - Options for the API request
 * @param {string} options.accessToken - The access token for authentication
 * @param {Object} options.transportOptions - Options for the transport
 * @param {Object} options.payload - The data payload to send
 * @returns {Promise} A promise that resolves with the response or rejects with an error
 * @private
 */
Api.prototype._postPromise = function (_ref) {
  var accessToken = _ref.accessToken,
    transportOptions = _ref.transportOptions,
    payload = _ref.payload;
  var self = this;
  return new Promise(function (resolve, reject) {
    self.transport.post(accessToken, transportOptions, payload, function (err, resp) {
      return err ? reject(err) : resolve(resp);
    });
  });
};

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.postItem = function (data, callback) {
  var transportOptions = helpers.transportOptions(this.transportOptions, 'POST');
  var payload = helpers.buildPayload(data);
  var self = this;

  // ensure the network request is scheduled after the current tick.
  setTimeout(function () {
    self.transport.post(self.accessToken, transportOptions, payload, callback);
  }, 0);
};

/**
 * Posts spans to the Rollbar API using the session endpoint
 *
 * @param {Array} payload - The spans to send
 * @returns {Promise<Object>} A promise that resolves with the API response
 */
Api.prototype.postSpans = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(payload) {
    var transportOptions;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          transportOptions = helpers.transportOptions(this.OTLPTransportOptions, 'POST');
          _context.next = 3;
          return this._postPromise({
            accessToken: this.accessToken,
            transportOptions: transportOptions,
            payload: payload
          });
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee, this);
  }));
  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 *
 * @param data
 * @param callback
 */
Api.prototype.buildJsonPayload = function (data, callback) {
  var payload = helpers.buildPayload(data);
  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = _.stringify(payload);
  }
  if (stringifyResult.error) {
    if (callback) {
      callback(stringifyResult.error);
    }
    return null;
  }
  return stringifyResult.value;
};

/**
 *
 * @param jsonPayload
 * @param callback
 */
Api.prototype.postJsonPayload = function (jsonPayload, callback) {
  var transportOptions = helpers.transportOptions(this.transportOptions, 'POST');
  this.transport.postJsonPayload(this.accessToken, transportOptions, jsonPayload, callback);
};
Api.prototype.configure = function (options) {
  var oldOptions = this.oldOptions;
  this.options = _.merge(oldOptions, options);
  this.transportOptions = _getTransport(this.options, this.url);
  this.OTLPTransportOptions = _getOTLPTransport(this.options, this.url);
  if (this.options.accessToken !== undefined) {
    this.accessToken = this.options.accessToken;
  }
  return this;
};
function _getTransport(options, url) {
  return helpers.getTransportFromOptions(options, defaultOptions, url);
}
function _getOTLPTransport(options, url) {
  var _options$tracing;
  options = _objectSpread(_objectSpread({}, options), {}, {
    endpoint: (_options$tracing = options.tracing) === null || _options$tracing === void 0 ? void 0 : _options$tracing.endpoint
  });
  return helpers.getTransportFromOptions(options, OTLPDefaultOptions, url);
}
module.exports = Api;

/***/ }),

/***/ "./src/apiUtility.js":
/*!***************************!*\
  !*** ./src/apiUtility.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
function buildPayload(data) {
  if (!_.isType(data.context, 'string')) {
    var contextResult = _.stringify(data.context);
    if (contextResult.error) {
      data.context = "Error: could not serialize 'context'";
    } else {
      data.context = contextResult.value || '';
    }
    if (data.context.length > 255) {
      data.context = data.context.substr(0, 255);
    }
  }
  return {
    data: data
  };
}
function getTransportFromOptions(options, defaults, url) {
  var hostname = defaults.hostname;
  var protocol = defaults.protocol;
  var port = defaults.port;
  var path = defaults.path;
  var search = defaults.search;
  var timeout = options.timeout;
  var transport = detectTransport(options);
  var proxy = options.proxy;
  if (options.endpoint) {
    var opts = url.parse(options.endpoint);
    hostname = opts.hostname;
    protocol = opts.protocol;
    port = opts.port;
    path = opts.pathname;
    search = opts.search;
  }
  return {
    timeout: timeout,
    hostname: hostname,
    protocol: protocol,
    port: port,
    path: path,
    search: search,
    proxy: proxy,
    transport: transport
  };
}
function detectTransport(options) {
  var gWindow = typeof window != 'undefined' && window || typeof self != 'undefined' && self;
  var transport = options.defaultTransport || 'xhr';
  if (typeof gWindow.fetch === 'undefined') transport = 'xhr';
  if (typeof gWindow.XMLHttpRequest === 'undefined') transport = 'fetch';
  return transport;
}
function transportOptions(transport, method) {
  var protocol = transport.protocol || 'https:';
  var port = transport.port || (protocol === 'http:' ? 80 : protocol === 'https:' ? 443 : undefined);
  var hostname = transport.hostname;
  var path = transport.path;
  var timeout = transport.timeout;
  var transportAPI = transport.transport;
  if (transport.search) {
    path = path + transport.search;
  }
  if (transport.proxy) {
    path = protocol + '//' + hostname + path;
    hostname = transport.proxy.host || transport.proxy.hostname;
    port = transport.proxy.port;
    protocol = transport.proxy.protocol || protocol;
  }
  return {
    timeout: timeout,
    protocol: protocol,
    hostname: hostname,
    path: path,
    port: port,
    method: method,
    transport: transportAPI
  };
}
function appendPathToPath(base, path) {
  var baseTrailingSlash = /\/$/.test(base);
  var pathBeginningSlash = /^\//.test(path);
  if (baseTrailingSlash && pathBeginningSlash) {
    path = path.substring(1);
  } else if (!baseTrailingSlash && !pathBeginningSlash) {
    path = '/' + path;
  }
  return base + path;
}
module.exports = {
  buildPayload: buildPayload,
  getTransportFromOptions: getTransportFromOptions,
  transportOptions: transportOptions,
  appendPathToPath: appendPathToPath
};

/***/ }),

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

/***/ }),

/***/ "./src/errorParser.js":
/*!****************************!*\
  !*** ./src/errorParser.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ErrorStackParser = __webpack_require__(/*! error-stack-parser */ "./node_modules/error-stack-parser/error-stack-parser.js");
var UNKNOWN_FUNCTION = '?';
var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');
function guessFunctionName() {
  return UNKNOWN_FUNCTION;
}
function gatherContext() {
  return null;
}
function Frame(stackFrame) {
  var data = {};
  data._stackFrame = stackFrame;
  data.url = stackFrame.fileName;
  data.line = stackFrame.lineNumber;
  data.func = stackFrame.functionName;
  data.column = stackFrame.columnNumber;
  data.args = stackFrame.args;
  data.context = gatherContext();
  return data;
}
function Stack(exception, skip) {
  function getStack() {
    var parserStack = [];
    skip = skip || 0;
    try {
      parserStack = ErrorStackParser.parse(exception);
    } catch (e) {
      parserStack = [];
    }
    var stack = [];
    for (var i = skip; i < parserStack.length; i++) {
      stack.push(new Frame(parserStack[i]));
    }
    return stack;
  }
  return {
    stack: getStack(),
    message: exception.message,
    name: _mostSpecificErrorName(exception),
    rawStack: exception.stack,
    rawException: exception
  };
}
function parse(e, skip) {
  var err = e;
  if (err.nested || err.cause) {
    var traceChain = [];
    while (err) {
      traceChain.push(new Stack(err, skip));
      err = err.nested || err.cause;
      skip = 0; // Only apply skip value to primary error
    }

    // Return primary error with full trace chain attached.
    traceChain[0].traceChain = traceChain;
    return traceChain[0];
  } else {
    return new Stack(err, skip);
  }
}
function guessErrorClass(errMsg) {
  if (!errMsg || !errMsg.match) {
    return ['Unknown error. There was no error message to display.', ''];
  }
  var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
  var errClass = '(unknown)';
  if (errClassMatch) {
    errClass = errClassMatch[errClassMatch.length - 1];
    errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
    errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
  }
  return [errClass, errMsg];
}

// * Prefers any value over an empty string
// * Prefers any value over 'Error' where possible
// * Prefers name over constructor.name when both are more specific than 'Error'
function _mostSpecificErrorName(error) {
  var name = error.name && error.name.length && error.name;
  var constructorName = error.constructor.name && error.constructor.name.length && error.constructor.name;
  if (!name || !constructorName) {
    return name || constructorName;
  }
  if (name === 'Error') {
    return constructorName;
  }
  return name;
}
module.exports = {
  guessFunctionName: guessFunctionName,
  guessErrorClass: guessErrorClass,
  gatherContext: gatherContext,
  parse: parse,
  Stack: Stack,
  Frame: Frame
};

/***/ }),

/***/ "./src/merge.js":
/*!**********************!*\
  !*** ./src/merge.js ***!
  \**********************/
/***/ ((module) => {

"use strict";


var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var isPlainObject = function isPlainObject(obj) {
  if (!obj || toStr.call(obj) !== '[object Object]') {
    return false;
  }
  var hasOwnConstructor = hasOwn.call(obj, 'constructor');
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  // Not own constructor property must be Object
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  var key;
  for (key in obj) {
    /**/
  }
  return typeof key === 'undefined' || hasOwn.call(obj, key);
};
function merge() {
  var i,
    src,
    copy,
    clone,
    name,
    result = {},
    current = null,
    length = arguments.length;
  for (i = 0; i < length; i++) {
    current = arguments[i];
    if (current == null) {
      continue;
    }
    for (name in current) {
      src = result[name];
      copy = current[name];
      if (result !== copy) {
        if (copy && isPlainObject(copy)) {
          clone = src && isPlainObject(src) ? src : {};
          result[name] = merge(clone, copy);
        } else if (typeof copy !== 'undefined') {
          result[name] = copy;
        }
      }
    }
  }
  return result;
}
module.exports = merge;

/***/ }),

/***/ "./src/notifier.js":
/*!*************************!*\
  !*** ./src/notifier.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * Notifier - the internal object responsible for delegating between the client exposed API, the
 * chain of transforms necessary to turn an item into something that can be sent to Rollbar, and the
 * queue which handles the communcation with the Rollbar API servers.
 *
 * @param queue - an object that conforms to the interface: addItem(item, callback)
 * @param options - an object representing the options to be set for this notifier, this should have
 * any defaults already set by the caller
 */
function Notifier(queue, options) {
  this.queue = queue;
  this.options = options;
  this.transforms = [];
  this.diagnostic = {};
}

/*
 * configure - updates the options for this notifier with the passed in object
 *
 * @param options - an object which gets merged with the current options set on this notifier
 * @returns this
 */
Notifier.prototype.configure = function (options) {
  this.queue && this.queue.configure(options);
  var oldOptions = this.options;
  this.options = _.merge(oldOptions, options);
  return this;
};

/*
 * addTransform - adds a transform onto the end of the queue of transforms for this notifier
 *
 * @param transform - a function which takes three arguments:
 *    * item: An Object representing the data to eventually be sent to Rollbar
 *    * options: The current value of the options for this notifier
 *    * callback: function(err: (Null|Error), item: (Null|Object)) the transform must call this
 *    callback with a null value for error if it wants the processing chain to continue, otherwise
 *    with an error to terminate the processing. The item should be the updated item after this
 *    transform is finished modifying it.
 */
Notifier.prototype.addTransform = function (transform) {
  if (_.isFunction(transform)) {
    this.transforms.push(transform);
  }
  return this;
};

/*
 * log - the internal log function which applies the configured transforms and then pushes onto the
 * queue to be sent to the backend.
 *
 * @param item - An object with the following structure:
 *    message [String] - An optional string to be sent to rollbar
 *    error [Error] - An optional error
 *
 * @param callback - A function of type function(err, resp) which will be called with exactly one
 * null argument and one non-null argument. The callback will be called once, either during the
 * transform stage if an error occurs inside a transform, or in response to the communication with
 * the backend. The second argument will be the response from the backend in case of success.
 */
Notifier.prototype.log = function (item, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  if (!this.options.enabled) {
    return callback(new Error('Rollbar is not enabled'));
  }
  this.queue.addPendingItem(item);
  var originalError = item.err;
  this._applyTransforms(item, function (err, i) {
    if (err) {
      this.queue.removePendingItem(item);
      return callback(err, null);
    }
    this.queue.addItem(i, callback, originalError, item);
  }.bind(this));
};

/* Internal */

/*
 * _applyTransforms - Applies the transforms that have been added to this notifier sequentially. See
 * `addTransform` for more information.
 *
 * @param item - An item to be transformed
 * @param callback - A function of type function(err, item) which will be called with a non-null
 * error and a null item in the case of a transform failure, or a null error and non-null item after
 * all transforms have been applied.
 */
Notifier.prototype._applyTransforms = function (item, callback) {
  var transformIndex = -1;
  var transformsLength = this.transforms.length;
  var transforms = this.transforms;
  var options = this.options;
  var _cb = function cb(err, i) {
    if (err) {
      callback(err, null);
      return;
    }
    transformIndex++;
    if (transformIndex === transformsLength) {
      callback(null, i);
      return;
    }
    transforms[transformIndex](i, options, _cb);
  };
  _cb(null, item);
};
module.exports = Notifier;

/***/ }),

/***/ "./src/predicates.js":
/*!***************************!*\
  !*** ./src/predicates.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
function checkLevel(item, settings) {
  var level = item.level;
  var levelVal = _.LEVELS[level] || 0;
  var reportLevel = settings.reportLevel;
  var reportLevelVal = _.LEVELS[reportLevel] || 0;
  if (levelVal < reportLevelVal) {
    return false;
  }
  return true;
}
function userCheckIgnore(logger) {
  return function (item, settings) {
    var isUncaught = !!item._isUncaught;
    delete item._isUncaught;
    var args = item._originalArgs;
    delete item._originalArgs;
    try {
      if (_.isFunction(settings.onSendCallback)) {
        settings.onSendCallback(isUncaught, args, item);
      }
    } catch (e) {
      settings.onSendCallback = null;
      logger.error('Error while calling onSendCallback, removing', e);
    }
    try {
      if (_.isFunction(settings.checkIgnore) && settings.checkIgnore(isUncaught, args, item)) {
        return false;
      }
    } catch (e) {
      settings.checkIgnore = null;
      logger.error('Error while calling custom checkIgnore(), removing', e);
    }
    return true;
  };
}
function urlIsNotBlockListed(logger) {
  return function (item, settings) {
    return !urlIsOnAList(item, settings, 'blocklist', logger);
  };
}
function urlIsSafeListed(logger) {
  return function (item, settings) {
    return urlIsOnAList(item, settings, 'safelist', logger);
  };
}
function matchFrames(trace, list, block) {
  if (!trace) {
    return !block;
  }
  var frames = trace.frames;
  if (!frames || frames.length === 0) {
    return !block;
  }
  var frame, filename, url, urlRegex;
  var listLength = list.length;
  var frameLength = frames.length;
  for (var i = 0; i < frameLength; i++) {
    frame = frames[i];
    filename = frame.filename;
    if (!_.isType(filename, 'string')) {
      return !block;
    }
    for (var j = 0; j < listLength; j++) {
      url = list[j];
      urlRegex = new RegExp(url);
      if (urlRegex.test(filename)) {
        return true;
      }
    }
  }
  return false;
}
function urlIsOnAList(item, settings, safeOrBlock, logger) {
  // safelist is the default
  var block = false;
  if (safeOrBlock === 'blocklist') {
    block = true;
  }
  var list, traces;
  try {
    list = block ? settings.hostBlockList : settings.hostSafeList;
    traces = _.get(item, 'body.trace_chain') || [_.get(item, 'body.trace')];

    // These two checks are important to come first as they are defaults
    // in case the list is missing or the trace is missing or not well-formed
    if (!list || list.length === 0) {
      return !block;
    }
    if (traces.length === 0 || !traces[0]) {
      return !block;
    }
    var tracesLength = traces.length;
    for (var i = 0; i < tracesLength; i++) {
      if (matchFrames(traces[i], list, block)) {
        return true;
      }
    }
  } catch (e
  /* istanbul ignore next */) {
    if (block) {
      settings.hostBlockList = null;
    } else {
      settings.hostSafeList = null;
    }
    var listName = block ? 'hostBlockList' : 'hostSafeList';
    logger.error("Error while reading your configuration's " + listName + ' option. Removing custom ' + listName + '.', e);
    return !block;
  }
  return false;
}
function messageIsIgnored(logger) {
  return function (item, settings) {
    var i, j, ignoredMessages, len, messageIsIgnored, rIgnoredMessage, messages;
    try {
      messageIsIgnored = false;
      ignoredMessages = settings.ignoredMessages;
      if (!ignoredMessages || ignoredMessages.length === 0) {
        return true;
      }
      messages = messagesFromItem(item);
      if (messages.length === 0) {
        return true;
      }
      len = ignoredMessages.length;
      for (i = 0; i < len; i++) {
        rIgnoredMessage = new RegExp(ignoredMessages[i], 'gi');
        for (j = 0; j < messages.length; j++) {
          messageIsIgnored = rIgnoredMessage.test(messages[j]);
          if (messageIsIgnored) {
            return false;
          }
        }
      }
    } catch (e
    /* istanbul ignore next */) {
      settings.ignoredMessages = null;
      logger.error("Error while reading your configuration's ignoredMessages option. Removing custom ignoredMessages.");
    }
    return true;
  };
}
function messagesFromItem(item) {
  var body = item.body;
  var messages = [];

  // The payload schema only allows one of trace_chain, message, or trace.
  // However, existing test cases are based on having both trace and message present.
  // So here we preserve the ability to collect strings from any combination of these keys.
  if (body.trace_chain) {
    var traceChain = body.trace_chain;
    for (var i = 0; i < traceChain.length; i++) {
      var trace = traceChain[i];
      messages.push(_.get(trace, 'exception.message'));
    }
  }
  if (body.trace) {
    messages.push(_.get(body, 'trace.exception.message'));
  }
  if (body.message) {
    messages.push(_.get(body, 'message.body'));
  }
  return messages;
}
module.exports = {
  checkLevel: checkLevel,
  userCheckIgnore: userCheckIgnore,
  urlIsNotBlockListed: urlIsNotBlockListed,
  urlIsSafeListed: urlIsSafeListed,
  messageIsIgnored: messageIsIgnored
};

/***/ }),

/***/ "./src/queue.js":
/*!**********************!*\
  !*** ./src/queue.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * Queue - an object which handles which handles a queue of items to be sent to Rollbar.
 *   This object handles rate limiting via a passed in rate limiter, retries based on connection
 *   errors, and filtering of items based on a set of configurable predicates. The communication to
 *   the backend is performed via a given API object.
 *
 * @param rateLimiter - An object which conforms to the interface
 *    rateLimiter.shouldSend(item) -> bool
 * @param api - An object which conforms to the interface
 *    api.postItem(payload, function(err, response))
 * @param logger - An object used to log verbose messages if desired
 * @param options - see Queue.prototype.configure
 * @param replayMap - Optional ReplayMap for coordinating session replay with error occurrences
 */
function Queue(rateLimiter, api, logger, options, replayMap) {
  this.rateLimiter = rateLimiter;
  this.api = api;
  this.logger = logger;
  this.options = options;
  this.replayMap = replayMap;
  this.predicates = [];
  this.pendingItems = [];
  this.pendingRequests = [];
  this.retryQueue = [];
  this.retryHandle = null;
  this.waitCallback = null;
  this.waitIntervalID = null;
}

/*
 * configure - updates the options this queue uses
 *
 * @param options
 */
Queue.prototype.configure = function (options) {
  this.api && this.api.configure(options);
  var oldOptions = this.options;
  this.options = _.merge(oldOptions, options);
  return this;
};

/*
 * addPredicate - adds a predicate to the end of the list of predicates for this queue
 *
 * @param predicate - function(item, options) -> (bool|{err: Error})
 *  Returning true means that this predicate passes and the item is okay to go on the queue
 *  Returning false means do not add the item to the queue, but it is not an error
 *  Returning {err: Error} means do not add the item to the queue, and the given error explains why
 *  Returning {err: undefined} is equivalent to returning true but don't do that
 */
Queue.prototype.addPredicate = function (predicate) {
  if (_.isFunction(predicate)) {
    this.predicates.push(predicate);
  }
  return this;
};
Queue.prototype.addPendingItem = function (item) {
  this.pendingItems.push(item);
};
Queue.prototype.removePendingItem = function (item) {
  var idx = this.pendingItems.indexOf(item);
  if (idx !== -1) {
    this.pendingItems.splice(idx, 1);
  }
};

/*
 * addItem - Send an item to the Rollbar API if all of the predicates are satisfied
 *
 * @param item - The payload to send to the backend
 * @param callback - function(error, repsonse) which will be called with the response from the API
 *  in the case of a success, otherwise response will be null and error will have a value. If both
 *  error and response are null then the item was stopped by a predicate which did not consider this
 *  to be an error condition, but nonetheless did not send the item to the API.
 *  @param originalError - The original error before any transformations that is to be logged if any
 */
Queue.prototype.addItem = function (item, callback, originalError, originalItem) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {
      return;
    };
  }
  var predicateResult = this._applyPredicates(item);
  if (predicateResult.stop) {
    this.removePendingItem(originalItem);
    callback(predicateResult.err);
    return;
  }
  this._maybeLog(item, originalError);
  this.removePendingItem(originalItem);
  if (!this.options.transmit) {
    callback(new Error('Transmit disabled'));
    return;
  }
  if (this.replayMap && item.body) {
    var replayId = this.replayMap.add(item.uuid);
    item.replayId = replayId;
  }
  this.pendingRequests.push(item);
  try {
    this._makeApiRequest(item, function (err, resp) {
      this._dequeuePendingRequest(item);
      if (!err && resp && item.replayId) {
        this._handleReplayResponse(item.replayId, resp);
      }
      callback(err, resp);
    }.bind(this));
  } catch (e) {
    this._dequeuePendingRequest(item);
    callback(e);
  }
};

/*
 * wait - Stop any further errors from being added to the queue, and get called back when all items
 *   currently processing have finished sending to the backend.
 *
 * @param callback - function() called when all pending items have been sent
 */
Queue.prototype.wait = function (callback) {
  if (!_.isFunction(callback)) {
    return;
  }
  this.waitCallback = callback;
  if (this._maybeCallWait()) {
    return;
  }
  if (this.waitIntervalID) {
    this.waitIntervalID = clearInterval(this.waitIntervalID);
  }
  this.waitIntervalID = setInterval(function () {
    this._maybeCallWait();
  }.bind(this), 500);
};

/* _applyPredicates - Sequentially applies the predicates that have been added to the queue to the
 *   given item with the currently configured options.
 *
 * @param item - An item in the queue
 * @returns {stop: bool, err: (Error|null)} - stop being true means do not add item to the queue,
 *   the error value should be passed up to a callbak if we are stopping.
 */
Queue.prototype._applyPredicates = function (item) {
  var p = null;
  for (var i = 0, len = this.predicates.length; i < len; i++) {
    p = this.predicates[i](item, this.options);
    if (!p || p.err !== undefined) {
      return {
        stop: true,
        err: p.err
      };
    }
  }
  return {
    stop: false,
    err: null
  };
};

/*
 * _makeApiRequest - Send an item to Rollbar, callback when done, if there is an error make an
 *   effort to retry if we are configured to do so.
 *
 * @param item - an item ready to send to the backend
 * @param callback - function(err, response)
 */
Queue.prototype._makeApiRequest = function (item, callback) {
  var rateLimitResponse = this.rateLimiter.shouldSend(item);
  if (rateLimitResponse.shouldSend) {
    this.api.postItem(item, function (err, resp) {
      if (err) {
        this._maybeRetry(err, item, callback);
      } else {
        callback(err, resp);
      }
    }.bind(this));
  } else if (rateLimitResponse.error) {
    callback(rateLimitResponse.error);
  } else {
    this.api.postItem(rateLimitResponse.payload, callback);
  }
};

// These are errors basically mean there is no internet connection
var RETRIABLE_ERRORS = ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'];

/*
 * _maybeRetry - Given the error returned by the API, decide if we should retry or just callback
 *   with the error.
 *
 * @param err - an error returned by the API transport
 * @param item - the item that was trying to be sent when this error occured
 * @param callback - function(err, response)
 */
Queue.prototype._maybeRetry = function (err, item, callback) {
  var shouldRetry = false;
  if (this.options.retryInterval) {
    for (var i = 0, len = RETRIABLE_ERRORS.length; i < len; i++) {
      if (err.code === RETRIABLE_ERRORS[i]) {
        shouldRetry = true;
        break;
      }
    }
    if (shouldRetry && _.isFiniteNumber(this.options.maxRetries)) {
      item.retries = item.retries ? item.retries + 1 : 1;
      if (item.retries > this.options.maxRetries) {
        shouldRetry = false;
      }
    }
  }
  if (shouldRetry) {
    this._retryApiRequest(item, callback);
  } else {
    callback(err);
  }
};

/*
 * _retryApiRequest - Add an item and a callback to a queue and possibly start a timer to process
 *   that queue based on the retryInterval in the options for this queue.
 *
 * @param item - an item that failed to send due to an error we deem retriable
 * @param callback - function(err, response)
 */
Queue.prototype._retryApiRequest = function (item, callback) {
  this.retryQueue.push({
    item: item,
    callback: callback
  });
  if (!this.retryHandle) {
    this.retryHandle = setInterval(function () {
      while (this.retryQueue.length) {
        var retryObject = this.retryQueue.shift();
        this._makeApiRequest(retryObject.item, retryObject.callback);
      }
    }.bind(this), this.options.retryInterval);
  }
};

/*
 * _dequeuePendingRequest - Removes the item from the pending request queue, this queue is used to
 *   enable to functionality of providing a callback that clients can pass to `wait` to be notified
 *   when the pending request queue has been emptied. This must be called when the API finishes
 *   processing this item. If a `wait` callback is configured, it is called by this function.
 *
 * @param item - the item previously added to the pending request queue
 */
Queue.prototype._dequeuePendingRequest = function (item) {
  var idx = this.pendingRequests.indexOf(item);
  if (idx !== -1) {
    this.pendingRequests.splice(idx, 1);
    this._maybeCallWait();
  }
};
Queue.prototype._maybeLog = function (data, originalError) {
  if (this.logger && this.options.verbose) {
    var message = originalError;
    message = message || _.get(data, 'body.trace.exception.message');
    message = message || _.get(data, 'body.trace_chain.0.exception.message');
    if (message) {
      this.logger.error(message);
      return;
    }
    message = _.get(data, 'body.message.body');
    if (message) {
      this.logger.log(message);
    }
  }
};
Queue.prototype._maybeCallWait = function () {
  if (_.isFunction(this.waitCallback) && this.pendingItems.length === 0 && this.pendingRequests.length === 0) {
    if (this.waitIntervalID) {
      this.waitIntervalID = clearInterval(this.waitIntervalID);
    }
    this.waitCallback();
    return true;
  }
  return false;
};

/**
 * Handles the API response for an item with a replay ID.
 * Based on the success or failure status of the response,
 * it either sends or discards the associated session replay.
 *
 * @param {string} replayId - The ID of the replay to handle
 * @param {Object} response - The API response
 * @returns {Promise<boolean>} A promise that resolves to true if replay was sent successfully,
 *                             false if replay was discarded or an error occurred
 * @private
 */
Queue.prototype._handleReplayResponse = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(replayId, response) {
    var result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (this.replayMap) {
            _context.next = 3;
            break;
          }
          console.warn('Queue._handleReplayResponse: ReplayMap not available');
          return _context.abrupt("return", false);
        case 3:
          if (replayId) {
            _context.next = 6;
            break;
          }
          console.warn('Queue._handleReplayResponse: No replayId provided');
          return _context.abrupt("return", false);
        case 6:
          _context.prev = 6;
          if (!(response && response.err === 0)) {
            _context.next = 14;
            break;
          }
          _context.next = 10;
          return this.replayMap.send(replayId);
        case 10:
          result = _context.sent;
          return _context.abrupt("return", result);
        case 14:
          this.replayMap.discard(replayId);
          return _context.abrupt("return", false);
        case 16:
          _context.next = 22;
          break;
        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](6);
          console.error('Error handling replay response:', _context.t0);
          return _context.abrupt("return", false);
        case 22:
        case "end":
          return _context.stop();
      }
    }, _callee, this, [[6, 18]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
module.exports = Queue;

/***/ }),

/***/ "./src/rateLimiter.js":
/*!****************************!*\
  !*** ./src/rateLimiter.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * RateLimiter - an object that encapsulates the logic for counting items sent to Rollbar
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
function RateLimiter(options) {
  this.startTime = _.now();
  this.counter = 0;
  this.perMinCounter = 0;
  this.platform = null;
  this.platformOptions = {};
  this.configureGlobal(options);
}
RateLimiter.globalSettings = {
  startTime: _.now(),
  maxItems: undefined,
  itemsPerMinute: undefined
};

/*
 * configureGlobal - set the global rate limiter options
 *
 * @param options - Only the following values are recognized:
 *    startTime: a timestamp of the form returned by (new Date()).getTime()
 *    maxItems: the maximum items
 *    itemsPerMinute: the max number of items to send in a given minute
 */
RateLimiter.prototype.configureGlobal = function (options) {
  if (options.startTime !== undefined) {
    RateLimiter.globalSettings.startTime = options.startTime;
  }
  if (options.maxItems !== undefined) {
    RateLimiter.globalSettings.maxItems = options.maxItems;
  }
  if (options.itemsPerMinute !== undefined) {
    RateLimiter.globalSettings.itemsPerMinute = options.itemsPerMinute;
  }
};

/*
 * shouldSend - determine if we should send a given item based on rate limit settings
 *
 * @param item - the item we are about to send
 * @returns An object with the following structure:
 *  error: (Error|null)
 *  shouldSend: bool
 *  payload: (Object|null)
 *  If shouldSend is false, the item passed as a parameter should not be sent to Rollbar, and
 *  exactly one of error or payload will be non-null. If error is non-null, the returned Error will
 *  describe the situation, but it means that we were already over a rate limit (either globally or
 *  per minute) when this item was checked. If error is null, and therefore payload is non-null, it
 *  means this item put us over the global rate limit and the payload should be sent to Rollbar in
 *  place of the passed in item.
 */
RateLimiter.prototype.shouldSend = function (item, now) {
  now = now || _.now();
  var elapsedTime = now - this.startTime;
  if (elapsedTime < 0 || elapsedTime >= 60000) {
    this.startTime = now;
    this.perMinCounter = 0;
  }
  var globalRateLimit = RateLimiter.globalSettings.maxItems;
  var globalRateLimitPerMin = RateLimiter.globalSettings.itemsPerMinute;
  if (checkRate(item, globalRateLimit, this.counter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimit + ' max items reached', false);
  } else if (checkRate(item, globalRateLimitPerMin, this.perMinCounter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimitPerMin + ' items per minute reached', false);
  }
  this.counter++;
  this.perMinCounter++;
  var shouldSend = !checkRate(item, globalRateLimit, this.counter);
  var perMinute = shouldSend;
  shouldSend = shouldSend && !checkRate(item, globalRateLimitPerMin, this.perMinCounter);
  return shouldSendValue(this.platform, this.platformOptions, null, shouldSend, globalRateLimit, globalRateLimitPerMin, perMinute);
};
RateLimiter.prototype.setPlatformOptions = function (platform, options) {
  this.platform = platform;
  this.platformOptions = options;
};

/* Helpers */

function checkRate(item, limit, counter) {
  return !item.ignoreRateLimit && limit >= 1 && counter > limit;
}
function shouldSendValue(platform, options, error, shouldSend, globalRateLimit, limitPerMin, perMinute) {
  var payload = null;
  if (error) {
    error = new Error(error);
  }
  if (!error && !shouldSend) {
    payload = rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute);
  }
  return {
    error: error,
    shouldSend: shouldSend,
    payload: payload
  };
}
function rateLimitPayload(platform, options, globalRateLimit, limitPerMin, perMinute) {
  var environment = options.environment || options.payload && options.payload.environment;
  var msg;
  if (perMinute) {
    msg = 'item per minute limit reached, ignoring errors until timeout';
  } else {
    msg = 'maxItems has been hit, ignoring errors until reset.';
  }
  var item = {
    body: {
      message: {
        body: msg,
        extra: {
          maxItems: globalRateLimit,
          itemsPerMinute: limitPerMin
        }
      }
    },
    language: 'javascript',
    environment: environment,
    notifier: {
      version: options.notifier && options.notifier.version || options.version
    }
  };
  if (platform === 'browser') {
    item.platform = 'browser';
    item.framework = 'browser-js';
    item.notifier.name = 'rollbar-browser-js';
  } else if (platform === 'server') {
    item.framework = options.framework || 'node-js';
    item.notifier.name = options.notifier.name;
  } else if (platform === 'react-native') {
    item.framework = options.framework || 'react-native';
    item.notifier.name = options.notifier.name;
  }
  return item;
}
module.exports = RateLimiter;

/***/ }),

/***/ "./src/react-native/logger.js":
/*!************************************!*\
  !*** ./src/react-native/logger.js ***!
  \************************************/
/***/ ((module) => {

"use strict";


/* eslint-disable no-console */
var logger = {
  error: console.error.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console)
};
/* eslint-enable no-console */

module.exports = logger;

/***/ }),

/***/ "./src/react-native/rollbar.js":
/*!*************************************!*\
  !*** ./src/react-native/rollbar.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var packageJson = __webpack_require__(/*! ../../package.json */ "./package.json");
var Client = __webpack_require__(/*! ../rollbar */ "./src/rollbar.js");
var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var API = __webpack_require__(/*! ../api */ "./src/api.js");
var logger = __webpack_require__(/*! ./logger */ "./src/react-native/logger.js");
var Transport = __webpack_require__(/*! ./transport */ "./src/react-native/transport.js");
var urllib = __webpack_require__(/*! ../browser/url */ "./src/browser/url.js");
var Telemeter = __webpack_require__(/*! ../telemetry */ "./src/telemetry.js");
var transforms = __webpack_require__(/*! ./transforms */ "./src/react-native/transforms.js");
var sharedTransforms = __webpack_require__(/*! ../transforms */ "./src/transforms.js");
var sharedPredicates = __webpack_require__(/*! ../predicates */ "./src/predicates.js");
var truncation = __webpack_require__(/*! ../truncation */ "./src/truncation.js");
var polyfillJSON = __webpack_require__(/*! ../../vendor/JSON-js/json3 */ "./vendor/JSON-js/json3.js");
function Rollbar(options, client) {
  if (_.isType(options, 'string')) {
    var accessToken = options;
    options = {};
    options.accessToken = accessToken;
  }
  this.options = _.handleOptions(Rollbar.defaultOptions, options, null, logger);
  this.options._configuredOptions = options;
  // This makes no sense in a long running app
  delete this.options.maxItems;
  this.options.environment = this.options.environment || 'unspecified';
  var transport = new Transport(truncation);
  var api = new API(this.options, transport, urllib, truncation);
  var telemeter = new Telemeter(this.options);
  this.client = client || new Client(this.options, api, logger, telemeter, null, null, 'react-native');
  addTransformsToNotifier(this.client.notifier);
  addPredicatesToQueue(this.client.queue);
  _.setupJSON(polyfillJSON);
}
var _instance = null;
Rollbar.init = function (options, client) {
  if (_instance) {
    return _instance.global(options).configure(options);
  }
  _instance = new Rollbar(options, client);
  return _instance;
};
function handleUninitialized(maybeCallback) {
  var message = 'Rollbar is not initialized';
  logger.error(message);
  if (maybeCallback) {
    maybeCallback(new Error(message));
  }
}
Rollbar.prototype.global = function (options) {
  this.client.global(options);
  return this;
};
Rollbar.global = function (options) {
  if (_instance) {
    return _instance.global(options);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.configure = function (options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {
      payload: payloadData
    };
  }
  this.options = _.handleOptions(oldOptions, options, payload, logger);
  this.options._configuredOptions = _.handleOptions(oldOptions._configuredOptions, options, payload);
  this.client.configure(options, payloadData);
  return this;
};
Rollbar.configure = function (options, payloadData) {
  if (_instance) {
    return _instance.configure(options, payloadData);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.lastError = function () {
  return this.client.lastError;
};
Rollbar.lastError = function () {
  if (_instance) {
    return _instance.lastError();
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.log = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.log(item);
  return {
    uuid: uuid
  };
};
Rollbar.log = function () {
  if (_instance) {
    return _instance.log.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.debug = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.debug(item);
  return {
    uuid: uuid
  };
};
Rollbar.debug = function () {
  if (_instance) {
    return _instance.debug.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.info = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.info(item);
  return {
    uuid: uuid
  };
};
Rollbar.info = function () {
  if (_instance) {
    return _instance.info.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.warn = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warn(item);
  return {
    uuid: uuid
  };
};
Rollbar.warn = function () {
  if (_instance) {
    return _instance.warn.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.warning = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.warning(item);
  return {
    uuid: uuid
  };
};
Rollbar.warning = function () {
  if (_instance) {
    return _instance.warning.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.error = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.error(item);
  return {
    uuid: uuid
  };
};
Rollbar.error = function () {
  if (_instance) {
    return _instance.error.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype._uncaughtError = function () {
  var item = this._createItem(arguments);
  item._isUncaught = true;
  var uuid = item.uuid;
  this.client.error(item);
  return {
    uuid: uuid
  };
};
Rollbar.prototype.critical = function () {
  var item = this._createItem(arguments);
  var uuid = item.uuid;
  this.client.critical(item);
  return {
    uuid: uuid
  };
};
Rollbar.critical = function () {
  if (_instance) {
    return _instance.critical.apply(_instance, arguments);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.buildJsonPayload = function (item) {
  return this.client.buildJsonPayload(item);
};
Rollbar.buildJsonPayload = function () {
  if (_instance) {
    return _instance.buildJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  return this.client.sendJsonPayload(jsonPayload);
};
Rollbar.sendJsonPayload = function () {
  if (_instance) {
    return _instance.sendJsonPayload.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.wait = function (callback) {
  this.client.wait(callback);
};
Rollbar.wait = function (callback) {
  if (_instance) {
    return _instance.wait(callback);
  } else {
    var maybeCallback = _getFirstFunction(arguments);
    handleUninitialized(maybeCallback);
  }
};
Rollbar.prototype.captureEvent = function () {
  var event = _.createTelemetryEvent(arguments);
  return this.client.captureEvent(event.type, event.metadata, event.level);
};
Rollbar.captureEvent = function () {
  if (_instance) {
    return _instance.captureEvent.apply(_instance, arguments);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.setPerson = function (personInfo) {
  this.configure({}, {
    person: personInfo
  });
};
Rollbar.setPerson = function (personInfo) {
  if (_instance) {
    return _instance.setPerson(personInfo);
  } else {
    handleUninitialized();
  }
};
Rollbar.prototype.clearPerson = function () {
  this.configure({}, {
    person: {}
  });
};
Rollbar.clearPerson = function () {
  if (_instance) {
    return _instance.clearPerson();
  } else {
    handleUninitialized();
  }
};

/** Internal **/
function addTransformsToNotifier(notifier) {
  notifier.addTransform(transforms.baseData).addTransform(transforms.handleItemWithError).addTransform(transforms.addBody).addTransform(sharedTransforms.addMessageWithError).addTransform(sharedTransforms.addTelemetryData).addTransform(sharedTransforms.addConfigToPayload).addTransform(transforms.scrubPayload).addTransform(sharedTransforms.addPayloadOptions).addTransform(sharedTransforms.userTransform(logger)).addTransform(sharedTransforms.addConfiguredOptions).addTransform(sharedTransforms.addDiagnosticKeys).addTransform(sharedTransforms.itemToPayload);
}
function addPredicatesToQueue(queue) {
  queue.addPredicate(sharedPredicates.checkLevel).addPredicate(sharedPredicates.userCheckIgnore(logger));
}
Rollbar.prototype._createItem = function (args) {
  return _.createItem(args, logger, this);
};
function _getFirstFunction(args) {
  for (var i = 0, len = args.length; i < len; ++i) {
    if (_.isFunction(args[i])) {
      return args[i];
    }
  }
  return undefined;
}
Rollbar.defaultOptions = {
  environment: "development" || 0,
  platform: 'client',
  framework: 'react-native',
  showReportedMessageTraces: false,
  notifier: {
    name: 'rollbar-react-native',
    version: packageJson.version
  },
  scrubHeaders: packageJson.defaults.server.scrubHeaders,
  scrubFields: packageJson.defaults.server.scrubFields,
  reportLevel: packageJson.defaults.reportLevel,
  rewriteFilenamePatterns: packageJson.defaults.reactNative.rewriteFilenamePatterns,
  verbose: false,
  enabled: true,
  transmit: true,
  sendConfig: false,
  includeItemsInTelemetry: true,
  ignoreDuplicateErrors: true
};
module.exports = Rollbar;

/***/ }),

/***/ "./src/react-native/transforms.js":
/*!****************************************!*\
  !*** ./src/react-native/transforms.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var scrub = __webpack_require__(/*! ../scrub */ "./src/scrub.js");
var errorParser = __webpack_require__(/*! ../errorParser */ "./src/errorParser.js");
function baseData(item, options, callback) {
  var environment = options.payload && options.payload.environment || options.environment;
  var data = {
    timestamp: Math.round(item.timestamp / 1000),
    environment: item.environment || environment,
    level: item.level || 'error',
    platform: options.platform || 'client',
    language: 'javascript',
    framework: item.framework || options.framework,
    uuid: item.uuid,
    notifier: JSON.parse(JSON.stringify(options.notifier)),
    custom: item.custom
  };
  if (options.codeVersion) {
    data.code_version = options.codeVersion;
  } else if (options.code_version) {
    data.code_version = options.code_version;
  }
  var props = Object.getOwnPropertyNames(item.custom || {});
  props.forEach(function (name) {
    if (!data.hasOwnProperty(name)) {
      data[name] = item.custom[name];
    }
  });
  item.data = data;
  callback(null, item);
}
function addMessageData(item, options, callback) {
  item.data = item.data || {};
  item.data.body = item.data.body || {};
  var message = item.message || 'Item sent with null or missing arguments.';
  item.data.body.message = {
    body: message
  };
  callback(null, item);
}
function addErrorData(item, options, callback) {
  if (item.stackInfo) {
    item.data = item.data || {};
    item.data.body = item.data.body || {};
    item.data.body.trace = item.stackInfo;
  }
  callback(null, item);
}
function addBody(item, options, callback) {
  if (item.stackInfo) {
    addErrorData(item, options, callback);
  } else {
    addMessageData(item, options, callback);
  }
}
function handleItemWithError(item, options, callback) {
  if (!item.err) {
    return callback(null, item);
  }
  if (options.addErrorContext) {
    _.addErrorContext(item, [item.err]);
  }
  var err = item.err;
  var parsedError = errorParser.parse(err);
  var guess = errorParser.guessErrorClass(parsedError.message);
  var message = guess[1];
  var stackInfo = {
    frames: _buildFrames(parsedError.stack, options),
    exception: {
      "class": _errorClass(parsedError.name, guess[0], options),
      message: message
    }
  };
  if (err.description) {
    stackInfo.exception.description = String(err.description);
  }
  item.stackInfo = stackInfo;
  callback(null, item);
}
function scrubPayload(item, options, callback) {
  var scrubHeaders = options.scrubHeaders || [];
  var scrubFields = options.scrubFields || [];
  var scrubPaths = options.scrubPaths || [];
  scrubFields = scrubHeaders.concat(scrubFields);
  item.data = scrub(item.data, scrubFields, scrubPaths);
  callback(null, item);
}

/** Helpers **/

function _errorClass(name, guess, options) {
  if (name) {
    return name;
  } else if (options.guessErrorClass) {
    return guess;
  } else {
    return '<unknown>';
  }
}
function _buildFrames(stack, options) {
  if (!stack) {
    return [];
  }
  var frames = [];
  for (var i = 0; i < stack.length; ++i) {
    var stackFrame = stack[i];
    var filename = stackFrame.url ? _.sanitizeUrl(stackFrame.url) : '<unknown>';
    var frame = {
      filename: _rewriteFilename(filename, options),
      lineno: stackFrame.line || null,
      method: !stackFrame.func || stackFrame.func === '?' ? '[anonymous]' : stackFrame.func,
      colno: stackFrame.column
    };
    frames.push(frame);
  }
  return frames;
}
function _rewriteFilename(filename, options) {
  var match = filename && filename.match && _matchFilename(filename, options);
  if (match) {
    return 'http://reactnativehost/' + match;
  } else {
    return 'http://reactnativehost/' + filename;
  }
}
function _matchFilename(filename, options) {
  var patterns = options.rewriteFilenamePatterns || [];
  var length = patterns.length || 0;
  for (var i = 0; i < length; i++) {
    var pattern = new RegExp(patterns[i]);
    var match = filename.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}
module.exports = {
  baseData: baseData,
  handleItemWithError: handleItemWithError,
  addBody: addBody,
  scrubPayload: scrubPayload,
  _matchFilename: _matchFilename // to enable unit test
};

/***/ }),

/***/ "./src/react-native/transport.js":
/*!***************************************!*\
  !*** ./src/react-native/transport.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
var logger = __webpack_require__(/*! ./logger */ "./src/react-native/logger.js");
var Buffer = (__webpack_require__(/*! buffer/ */ "./node_modules/buffer/index.js").Buffer);
function Transport(truncation) {
  this.rateLimitExpires = 0;
  this.truncation = truncation;
}
Transport.prototype.get = function (accessToken, options, params, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  options = options || {};
  _.addParamsAndAccessTokenToPath(accessToken, options, params);
  var headers = _headers(accessToken, options);
  fetch(_.formatUrl(options), {
    method: 'GET',
    headers: headers
  }).then(function (resp) {
    _handleResponse(resp, callback);
  })["catch"](function (err) {
    callback(err);
  });
};
Transport.prototype.post = function (accessToken, options, payload, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  options = options || {};
  if (!payload) {
    return callback(new Error('Cannot send empty request'));
  }
  var stringifyResult;
  if (this.truncation) {
    stringifyResult = this.truncation.truncate(payload);
  } else {
    stringifyResult = _.stringify(payload);
  }
  if (stringifyResult.error) {
    logger.error('Problem stringifying payload. Giving up');
    return callback(stringifyResult.error);
  }
  var writeData = stringifyResult.value;
  var headers = _headers(accessToken, options, writeData);
  _makeRequest(headers, options, writeData, callback);
};
Transport.prototype.postJsonPayload = function (accessToken, options, jsonPayload, callback) {
  if (!callback || !_.isFunction(callback)) {
    callback = function callback() {};
  }
  options = options || {};
  if (!jsonPayload) {
    return callback(new Error('Cannot send empty request'));
  }
  var headers = _headers(accessToken, options, jsonPayload);
  _makeRequest(headers, options, jsonPayload, callback);
};

/** Helpers **/
function _makeRequest(headers, options, data, callback) {
  var url = _.formatUrl(options);
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: data
  }).then(function (resp) {
    return resp.json();
  }).then(function (data) {
    _handleResponse(data, _wrapPostCallback(callback));
  })["catch"](function (err) {
    callback(err);
  });
}
function _headers(accessToken, options, data) {
  var headers = options && options.headers || {};
  headers['Content-Type'] = 'application/json';
  if (data) {
    try {
      headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
    } catch (e) {
      logger.error('Could not get the content length of the data');
    }
  }
  headers['X-Rollbar-Access-Token'] = accessToken;
  return headers;
}
function _handleResponse(data, callback) {
  if (data.err) {
    logger.error('Received error: ' + data.message);
    return callback(new Error('Api error: ' + (data.message || 'Unknown error')));
  }
  callback(null, data);
}
function _wrapPostCallback(callback) {
  return function (err, data) {
    if (err) {
      return callback(err);
    }
    if (data.result && data.result.uuid) {
      logger.log(['Successful api response.', ' Link: https://rollbar.com/occurrence/uuid/?uuid=' + data.result.uuid].join(''));
    } else {
      logger.log('Successful api response');
    }
    callback(null, data.result);
  };
}
module.exports = Transport;

/***/ }),

/***/ "./src/rollbar.js":
/*!************************!*\
  !*** ./src/rollbar.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var RateLimiter = __webpack_require__(/*! ./rateLimiter */ "./src/rateLimiter.js");
var Queue = __webpack_require__(/*! ./queue */ "./src/queue.js");
var Notifier = __webpack_require__(/*! ./notifier */ "./src/notifier.js");
var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");

/*
 * Rollbar - the interface to Rollbar
 *
 * @param options
 * @param api
 * @param logger
 */
function Rollbar(options, api, logger, telemeter, tracing, replayMap, platform) {
  this.options = _.merge(options);
  this.logger = logger;
  Rollbar.rateLimiter.configureGlobal(this.options);
  Rollbar.rateLimiter.setPlatformOptions(platform, this.options);
  this.api = api;
  this.queue = new Queue(Rollbar.rateLimiter, api, logger, this.options, replayMap);
  this.tracing = tracing;

  // Legacy OpenTracing support
  // This must happen before the Notifier is created
  var tracer = this.options.tracer || null;
  if (validateTracer(tracer)) {
    this.tracer = tracer;
    // set to a string for api response serialization
    this.options.tracer = 'opentracing-tracer-enabled';
    this.options._configuredOptions.tracer = 'opentracing-tracer-enabled';
  } else {
    this.tracer = null;
  }
  this.notifier = new Notifier(this.queue, this.options);
  this.telemeter = telemeter;
  setStackTraceLimit(options);
  this.lastError = null;
  this.lastErrorHash = 'none';
}
var defaultOptions = {
  maxItems: 0,
  itemsPerMinute: 60
};
Rollbar.rateLimiter = new RateLimiter(defaultOptions);
Rollbar.prototype.global = function (options) {
  Rollbar.rateLimiter.configureGlobal(options);
  return this;
};
Rollbar.prototype.configure = function (options, payloadData) {
  var oldOptions = this.options;
  var payload = {};
  if (payloadData) {
    payload = {
      payload: payloadData
    };
  }
  this.options = _.merge(oldOptions, options, payload);

  // Legacy OpenTracing support
  // This must happen before the Notifier is configured
  var tracer = this.options.tracer || null;
  if (validateTracer(tracer)) {
    this.tracer = tracer;
    // set to a string for api response serialization
    this.options.tracer = 'opentracing-tracer-enabled';
    this.options._configuredOptions.tracer = 'opentracing-tracer-enabled';
  } else {
    this.tracer = null;
  }
  this.notifier && this.notifier.configure(this.options);
  this.telemeter && this.telemeter.configure(this.options);
  setStackTraceLimit(options);
  this.global(this.options);
  if (validateTracer(options.tracer)) {
    this.tracer = options.tracer;
  }
  return this;
};
Rollbar.prototype.log = function (item) {
  var level = this._defaultLogLevel();
  return this._log(level, item);
};
Rollbar.prototype.debug = function (item) {
  this._log('debug', item);
};
Rollbar.prototype.info = function (item) {
  this._log('info', item);
};
Rollbar.prototype.warn = function (item) {
  this._log('warning', item);
};
Rollbar.prototype.warning = function (item) {
  this._log('warning', item);
};
Rollbar.prototype.error = function (item) {
  this._log('error', item);
};
Rollbar.prototype.critical = function (item) {
  this._log('critical', item);
};
Rollbar.prototype.wait = function (callback) {
  this.queue.wait(callback);
};
Rollbar.prototype.captureEvent = function (type, metadata, level) {
  return this.telemeter && this.telemeter.captureEvent(type, metadata, level);
};
Rollbar.prototype.captureDomContentLoaded = function (ts) {
  return this.telemeter && this.telemeter.captureDomContentLoaded(ts);
};
Rollbar.prototype.captureLoad = function (ts) {
  return this.telemeter && this.telemeter.captureLoad(ts);
};
Rollbar.prototype.buildJsonPayload = function (item) {
  return this.api.buildJsonPayload(item);
};
Rollbar.prototype.sendJsonPayload = function (jsonPayload) {
  this.api.postJsonPayload(jsonPayload);
};

/* Internal */

Rollbar.prototype._log = function (defaultLevel, item) {
  var callback;
  if (item.callback) {
    callback = item.callback;
    delete item.callback;
  }
  if (this.options.ignoreDuplicateErrors && this._sameAsLastError(item)) {
    if (callback) {
      var error = new Error('ignored identical item');
      error.item = item;
      callback(error);
    }
    return;
  }
  try {
    this._addTracingAttributes(item);

    // Legacy OpenTracing support
    this._addTracingInfo(item);
    item.level = item.level || defaultLevel;
    var telemeter = this.telemeter;
    if (telemeter) {
      telemeter._captureRollbarItem(item);
      item.telemetryEvents = telemeter.copyEvents() || [];
      if (telemeter.telemetrySpan) {
        telemeter.telemetrySpan.end();
        telemeter.telemetrySpan = telemeter.tracing.startSpan('rollbar-telemetry', {});
      }
    }
    this.notifier.log(item, callback);
  } catch (e) {
    if (callback) {
      callback(e);
    }
    this.logger.error(e);
  }
};
Rollbar.prototype._addTracingAttributes = function (item) {
  var _this$tracing;
  var span = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.getSpan();
  if (!span) {
    return;
  }
  var attributes = [{
    key: 'session_id',
    value: this.tracing.sessionId
  }, {
    key: 'span_id',
    value: span.spanId
  }, {
    key: 'trace_id',
    value: span.traceId
  }];
  _.addItemAttributes(item, attributes);
  span.addEvent('rollbar.occurrence', [{
    key: 'rollbar.occurrence.uuid',
    value: item.uuid
  }]);
};
Rollbar.prototype._defaultLogLevel = function () {
  return this.options.logLevel || 'debug';
};
Rollbar.prototype._sameAsLastError = function (item) {
  if (!item._isUncaught) {
    return false;
  }
  var itemHash = generateItemHash(item);
  if (this.lastErrorHash === itemHash) {
    return true;
  }
  this.lastError = item.err;
  this.lastErrorHash = itemHash;
  return false;
};
Rollbar.prototype._addTracingInfo = function (item) {
  // Tracer validation occurs in the constructor
  // or in the Rollbar.prototype.configure methods
  if (this.tracer) {
    // add rollbar occurrence uuid to span
    var span = this.tracer.scope().active();
    if (validateSpan(span)) {
      span.setTag('rollbar.error_uuid', item.uuid);
      span.setTag('rollbar.has_error', true);
      span.setTag('error', true);
      span.setTag('rollbar.item_url', "https://rollbar.com/item/uuid/?uuid=".concat(item.uuid));
      span.setTag('rollbar.occurrence_url', "https://rollbar.com/occurrence/uuid/?uuid=".concat(item.uuid));

      // add span ID & trace ID to occurrence
      var opentracingSpanId = span.context().toSpanId();
      var opentracingTraceId = span.context().toTraceId();
      if (item.custom) {
        item.custom.opentracing_span_id = opentracingSpanId;
        item.custom.opentracing_trace_id = opentracingTraceId;
      } else {
        item.custom = {
          opentracing_span_id: opentracingSpanId,
          opentracing_trace_id: opentracingTraceId
        };
      }
    }
  }
};
function generateItemHash(item) {
  var message = item.message || '';
  var stack = (item.err || {}).stack || String(item.err);
  return message + '::' + stack;
}

// Node.js, Chrome, Safari, and some other browsers support this property
// which globally sets the number of stack frames returned in an Error object.
// If a browser can't use it, no harm done.
function setStackTraceLimit(options) {
  if (options.stackTraceLimit) {
    Error.stackTraceLimit = options.stackTraceLimit;
  }
}

/**
 * Validate the Tracer object provided to the Client
 * is valid for our Opentracing use case.
 * @param {opentracer.Tracer} tracer
 */
function validateTracer(tracer) {
  if (!tracer) {
    return false;
  }
  if (!tracer.scope || typeof tracer.scope !== 'function') {
    return false;
  }
  var scope = tracer.scope();
  if (!scope || !scope.active || typeof scope.active !== 'function') {
    return false;
  }
  return true;
}

/**
 * Validate the Span object provided
 * @param {opentracer.Span} span
 */
function validateSpan(span) {
  if (!span || !span.context || typeof span.context !== 'function') {
    return false;
  }
  var spanContext = span.context();
  if (!spanContext || !spanContext.toSpanId || !spanContext.toTraceId || typeof spanContext.toSpanId !== 'function' || typeof spanContext.toTraceId !== 'function') {
    return false;
  }
  return true;
}
module.exports = Rollbar;

/***/ }),

/***/ "./src/scrub.js":
/*!**********************!*\
  !*** ./src/scrub.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var traverse = __webpack_require__(/*! ./utility/traverse */ "./src/utility/traverse.js");
function scrub(data, scrubFields, scrubPaths) {
  scrubFields = scrubFields || [];
  if (scrubPaths) {
    for (var i = 0; i < scrubPaths.length; ++i) {
      scrubPath(data, scrubPaths[i]);
    }
  }
  var paramRes = _getScrubFieldRegexs(scrubFields);
  var queryRes = _getScrubQueryParamRegexs(scrubFields);
  function redactQueryParam(dummy0, paramPart) {
    return paramPart + _.redact();
  }
  function paramScrubber(v) {
    var i;
    if (_.isType(v, 'string')) {
      for (i = 0; i < queryRes.length; ++i) {
        v = v.replace(queryRes[i], redactQueryParam);
      }
    }
    return v;
  }
  function valScrubber(k, v) {
    var i;
    for (i = 0; i < paramRes.length; ++i) {
      if (paramRes[i].test(k)) {
        v = _.redact();
        break;
      }
    }
    return v;
  }
  function scrubber(k, v, seen) {
    var tmpV = valScrubber(k, v);
    if (tmpV === v) {
      if (_.isType(v, 'object') || _.isType(v, 'array')) {
        return traverse(v, scrubber, seen);
      }
      return paramScrubber(tmpV);
    } else {
      return tmpV;
    }
  }
  return traverse(data, scrubber);
}
function scrubPath(obj, path) {
  var keys = path.split('.');
  var last = keys.length - 1;
  try {
    for (var i = 0; i <= last; ++i) {
      if (i < last) {
        obj = obj[keys[i]];
      } else {
        obj[keys[i]] = _.redact();
      }
    }
  } catch (e) {
    // Missing key is OK;
  }
}
function _getScrubFieldRegexs(scrubFields) {
  var ret = [];
  var pat;
  for (var i = 0; i < scrubFields.length; ++i) {
    pat = '^\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?$';
    ret.push(new RegExp(pat, 'i'));
  }
  return ret;
}
function _getScrubQueryParamRegexs(scrubFields) {
  var ret = [];
  var pat;
  for (var i = 0; i < scrubFields.length; ++i) {
    pat = '\\[?(%5[bB])?' + scrubFields[i] + '\\[?(%5[bB])?\\]?(%5[dD])?';
    ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
  }
  return ret;
}
module.exports = scrub;

/***/ }),

/***/ "./src/telemetry.js":
/*!**************************!*\
  !*** ./src/telemetry.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var MAX_EVENTS = 100;

// Temporary workaround while solving commonjs -> esm issues in Node 18 - 20.
function fromMillis(millis) {
  return [Math.trunc(millis / 1000), Math.round(millis % 1000 * 1e6)];
}
function Telemeter(options, tracing) {
  var _this$tracing;
  this.queue = [];
  this.options = _.merge(options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  this.maxQueueSize = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
  this.tracing = tracing;
  this.telemetrySpan = (_this$tracing = this.tracing) === null || _this$tracing === void 0 ? void 0 : _this$tracing.startSpan('rollbar-telemetry', {});
}
Telemeter.prototype.configure = function (options) {
  var oldOptions = this.options;
  this.options = _.merge(oldOptions, options);
  var maxTelemetryEvents = this.options.maxTelemetryEvents || MAX_EVENTS;
  var newMaxEvents = Math.max(0, Math.min(maxTelemetryEvents, MAX_EVENTS));
  var deleteCount = 0;
  if (this.queue.length > newMaxEvents) {
    deleteCount = this.queue.length - newMaxEvents;
  }
  this.maxQueueSize = newMaxEvents;
  this.queue.splice(0, deleteCount);
};
Telemeter.prototype.copyEvents = function () {
  var events = Array.prototype.slice.call(this.queue, 0);
  if (_.isFunction(this.options.filterTelemetry)) {
    try {
      var i = events.length;
      while (i--) {
        if (this.options.filterTelemetry(events[i])) {
          events.splice(i, 1);
        }
      }
    } catch (e) {
      this.options.filterTelemetry = null;
    }
  }
  return events;
};
Telemeter.prototype.capture = function (type, metadata, level, rollbarUUID, timestamp) {
  var e = {
    level: getLevel(type, level),
    type: type,
    timestamp_ms: timestamp || _.now(),
    body: metadata,
    source: 'client'
  };
  if (rollbarUUID) {
    e.uuid = rollbarUUID;
  }
  try {
    if (_.isFunction(this.options.filterTelemetry) && this.options.filterTelemetry(e)) {
      return false;
    }
  } catch (exc) {
    this.options.filterTelemetry = null;
  }
  this.push(e);
  return e;
};
Telemeter.prototype.captureEvent = function (type, metadata, level, rollbarUUID) {
  return this.capture(type, metadata, level, rollbarUUID);
};
Telemeter.prototype.captureError = function (err, level, rollbarUUID, timestamp) {
  var _this$telemetrySpan;
  var message = err.message || String(err);
  var metadata = {
    message: message
  };
  if (err.stack) {
    metadata.stack = err.stack;
  }
  (_this$telemetrySpan = this.telemetrySpan) === null || _this$telemetrySpan === void 0 || _this$telemetrySpan.addEvent('rollbar-occurrence-event', {
    message: message,
    level: level,
    type: 'error',
    uuid: rollbarUUID,
    'occurrence.type': 'error',
    // deprecated
    'occurrence.uuid': rollbarUUID // deprecated
  }, fromMillis(timestamp));
  return this.capture('error', metadata, level, rollbarUUID, timestamp);
};
Telemeter.prototype.captureLog = function (message, level, rollbarUUID, timestamp) {
  // If the uuid is present, this is a message occurrence.
  if (rollbarUUID) {
    var _this$telemetrySpan2;
    (_this$telemetrySpan2 = this.telemetrySpan) === null || _this$telemetrySpan2 === void 0 || _this$telemetrySpan2.addEvent('rollbar-occurrence-event', {
      message: message,
      level: level,
      type: 'message',
      uuid: rollbarUUID,
      'occurrence.type': 'message',
      // deprecated
      'occurrence.uuid': rollbarUUID // deprecated
    }, fromMillis(timestamp));
  } else {
    var _this$telemetrySpan3;
    (_this$telemetrySpan3 = this.telemetrySpan) === null || _this$telemetrySpan3 === void 0 || _this$telemetrySpan3.addEvent('log-event', {
      message: message,
      level: level
    }, fromMillis(timestamp));
  }
  return this.capture('log', {
    message: message
  }, level, rollbarUUID, timestamp);
};
Telemeter.prototype.captureNetwork = function (metadata, subtype, rollbarUUID, requestData) {
  subtype = subtype || 'xhr';
  metadata.subtype = metadata.subtype || subtype;
  if (requestData) {
    metadata.request = requestData;
  }
  var level = this.levelFromStatus(metadata.status_code);
  return this.capture('network', metadata, level, rollbarUUID);
};
Telemeter.prototype.levelFromStatus = function (statusCode) {
  if (statusCode >= 200 && statusCode < 400) {
    return 'info';
  }
  if (statusCode === 0 || statusCode >= 400) {
    return 'error';
  }
  return 'info';
};
Telemeter.prototype.captureDom = function (subtype, element, value, checked, rollbarUUID) {
  var metadata = {
    subtype: subtype,
    element: element
  };
  if (value !== undefined) {
    metadata.value = value;
  }
  if (checked !== undefined) {
    metadata.checked = checked;
  }
  return this.capture('dom', metadata, 'info', rollbarUUID);
};
Telemeter.prototype.captureNavigation = function (from, to, rollbarUUID, timestamp) {
  var _this$telemetrySpan4;
  (_this$telemetrySpan4 = this.telemetrySpan) === null || _this$telemetrySpan4 === void 0 || _this$telemetrySpan4.addEvent('session-navigation-event', {
    'previous.url.full': from,
    'url.full': to
  }, fromMillis(timestamp));
  return this.capture('navigation', {
    from: from,
    to: to
  }, 'info', rollbarUUID, timestamp);
};
Telemeter.prototype.captureDomContentLoaded = function (ts) {
  return this.capture('navigation', {
    subtype: 'DOMContentLoaded'
  }, 'info', undefined, ts && ts.getTime());
  /**
   * If we decide to make this a dom event instead, then use the line below:
  return this.capture('dom', {subtype: 'DOMContentLoaded'}, 'info', undefined, ts && ts.getTime());
  */
};
Telemeter.prototype.captureLoad = function (ts) {
  return this.capture('navigation', {
    subtype: 'load'
  }, 'info', undefined, ts && ts.getTime());
  /**
   * If we decide to make this a dom event instead, then use the line below:
  return this.capture('dom', {subtype: 'load'}, 'info', undefined, ts && ts.getTime());
  */
};
Telemeter.prototype.captureConnectivityChange = function (type, rollbarUUID) {
  return this.captureNetwork({
    change: type
  }, 'connectivity', rollbarUUID);
};

// Only intended to be used internally by the notifier
Telemeter.prototype._captureRollbarItem = function (item) {
  if (!this.options.includeItemsInTelemetry) {
    return;
  }
  if (item.err) {
    return this.captureError(item.err, item.level, item.uuid, item.timestamp);
  }
  if (item.message) {
    return this.captureLog(item.message, item.level, item.uuid, item.timestamp);
  }
  if (item.custom) {
    return this.capture('log', item.custom, item.level, item.uuid, item.timestamp);
  }
};
Telemeter.prototype.push = function (e) {
  this.queue.push(e);
  if (this.queue.length > this.maxQueueSize) {
    this.queue.shift();
  }
};
function getLevel(type, level) {
  if (level) {
    return level;
  }
  var defaultLevel = {
    error: 'error',
    manual: 'info'
  };
  return defaultLevel[type] || 'info';
}
module.exports = Telemeter;

/***/ }),

/***/ "./src/transforms.js":
/*!***************************!*\
  !*** ./src/transforms.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
function itemToPayload(item, options, callback) {
  var data = item.data;
  if (item._isUncaught) {
    data._isUncaught = true;
  }
  if (item._originalArgs) {
    data._originalArgs = item._originalArgs;
  }
  callback(null, data);
}
function addPayloadOptions(item, options, callback) {
  var payloadOptions = options.payload || {};
  if (payloadOptions.body) {
    delete payloadOptions.body;
  }
  item.data = _.merge(item.data, payloadOptions);
  callback(null, item);
}
function addTelemetryData(item, options, callback) {
  if (item.telemetryEvents) {
    _.set(item, 'data.body.telemetry', item.telemetryEvents);
  }
  callback(null, item);
}
function addMessageWithError(item, options, callback) {
  if (!item.message) {
    callback(null, item);
    return;
  }
  var tracePath = 'data.body.trace_chain.0';
  var trace = _.get(item, tracePath);
  if (!trace) {
    tracePath = 'data.body.trace';
    trace = _.get(item, tracePath);
  }
  if (trace) {
    if (!(trace.exception && trace.exception.description)) {
      _.set(item, tracePath + '.exception.description', item.message);
      callback(null, item);
      return;
    }
    var extra = _.get(item, tracePath + '.extra') || {};
    var newExtra = _.merge(extra, {
      message: item.message
    });
    _.set(item, tracePath + '.extra', newExtra);
  }
  callback(null, item);
}
function userTransform(logger) {
  return function (item, options, callback) {
    var newItem = _.merge(item);
    var response = null;
    try {
      if (_.isFunction(options.transform)) {
        response = options.transform(newItem.data, item);
      }
    } catch (e) {
      options.transform = null;
      logger.error('Error while calling custom transform() function. Removing custom transform().', e);
      callback(null, item);
      return;
    }
    if (_.isPromise(response)) {
      response.then(function (promisedItem) {
        if (promisedItem) {
          newItem.data = promisedItem;
        }
        callback(null, newItem);
      }, function (error) {
        callback(error, item);
      });
    } else {
      callback(null, newItem);
    }
  };
}
function addConfigToPayload(item, options, callback) {
  if (!options.sendConfig) {
    return callback(null, item);
  }
  var configKey = '_rollbarConfig';
  var custom = _.get(item, 'data.custom') || {};
  custom[configKey] = options;
  item.data.custom = custom;
  callback(null, item);
}
function addFunctionOption(options, name) {
  if (_.isFunction(options[name])) {
    options[name] = options[name].toString();
  }
}
function addConfiguredOptions(item, options, callback) {
  var configuredOptions = options._configuredOptions;

  // These must be stringified or they'll get dropped during serialization.
  addFunctionOption(configuredOptions, 'transform');
  addFunctionOption(configuredOptions, 'checkIgnore');
  addFunctionOption(configuredOptions, 'onSendCallback');
  delete configuredOptions.accessToken;
  item.data.notifier.configured_options = configuredOptions;
  callback(null, item);
}
function addDiagnosticKeys(item, options, callback) {
  var diagnostic = _.merge(item.notifier.client.notifier.diagnostic, item.diagnostic);
  if (_.get(item, 'err._isAnonymous')) {
    diagnostic.is_anonymous = true;
  }
  if (item._isUncaught) {
    diagnostic.is_uncaught = item._isUncaught;
  }
  if (item.err) {
    try {
      diagnostic.raw_error = {
        message: item.err.message,
        name: item.err.name,
        constructor_name: item.err.constructor && item.err.constructor.name,
        filename: item.err.fileName,
        line: item.err.lineNumber,
        column: item.err.columnNumber,
        stack: item.err.stack
      };
    } catch (e) {
      diagnostic.raw_error = {
        failed: String(e)
      };
    }
  }
  item.data.notifier.diagnostic = _.merge(item.data.notifier.diagnostic, diagnostic);
  callback(null, item);
}
module.exports = {
  itemToPayload: itemToPayload,
  addPayloadOptions: addPayloadOptions,
  addTelemetryData: addTelemetryData,
  addMessageWithError: addMessageWithError,
  userTransform: userTransform,
  addConfigToPayload: addConfigToPayload,
  addConfiguredOptions: addConfiguredOptions,
  addDiagnosticKeys: addDiagnosticKeys
};

/***/ }),

/***/ "./src/truncation.js":
/*!***************************!*\
  !*** ./src/truncation.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ./utility */ "./src/utility.js");
var traverse = __webpack_require__(/*! ./utility/traverse */ "./src/utility/traverse.js");
function raw(payload, jsonBackup) {
  return [payload, _.stringify(payload, jsonBackup)];
}
function selectFrames(frames, range) {
  var len = frames.length;
  if (len > range * 2) {
    return frames.slice(0, range).concat(frames.slice(len - range));
  }
  return frames;
}
function truncateFrames(payload, jsonBackup, range) {
  range = typeof range === 'undefined' ? 30 : range;
  var body = payload.data.body;
  var frames;
  if (body.trace_chain) {
    var chain = body.trace_chain;
    for (var i = 0; i < chain.length; i++) {
      frames = chain[i].frames;
      frames = selectFrames(frames, range);
      chain[i].frames = frames;
    }
  } else if (body.trace) {
    frames = body.trace.frames;
    frames = selectFrames(frames, range);
    body.trace.frames = frames;
  }
  return [payload, _.stringify(payload, jsonBackup)];
}
function maybeTruncateValue(len, val) {
  if (!val) {
    return val;
  }
  if (val.length > len) {
    return val.slice(0, len - 3).concat('...');
  }
  return val;
}
function truncateStrings(len, payload, jsonBackup) {
  function truncator(k, v, seen) {
    switch (_.typeName(v)) {
      case 'string':
        return maybeTruncateValue(len, v);
      case 'object':
      case 'array':
        return traverse(v, truncator, seen);
      default:
        return v;
    }
  }
  payload = traverse(payload, truncator);
  return [payload, _.stringify(payload, jsonBackup)];
}
function truncateTraceData(traceData) {
  if (traceData.exception) {
    delete traceData.exception.description;
    traceData.exception.message = maybeTruncateValue(255, traceData.exception.message);
  }
  traceData.frames = selectFrames(traceData.frames, 1);
  return traceData;
}
function minBody(payload, jsonBackup) {
  var body = payload.data.body;
  if (body.trace_chain) {
    var chain = body.trace_chain;
    for (var i = 0; i < chain.length; i++) {
      chain[i] = truncateTraceData(chain[i]);
    }
  } else if (body.trace) {
    body.trace = truncateTraceData(body.trace);
  }
  return [payload, _.stringify(payload, jsonBackup)];
}
function needsTruncation(payload, maxSize) {
  return _.maxByteSize(payload) > maxSize;
}
function truncate(payload, jsonBackup, maxSize) {
  maxSize = typeof maxSize === 'undefined' ? 512 * 1024 : maxSize;
  var strategies = [raw, truncateFrames, truncateStrings.bind(null, 1024), truncateStrings.bind(null, 512), truncateStrings.bind(null, 256), minBody];
  var strategy, results, result;
  while (strategy = strategies.shift()) {
    results = strategy(payload, jsonBackup);
    payload = results[0];
    result = results[1];
    if (result.error || !needsTruncation(result.value, maxSize)) {
      return result;
    }
  }
  return result;
}
module.exports = {
  truncate: truncate,
  /* for testing */
  raw: raw,
  truncateFrames: truncateFrames,
  truncateStrings: truncateStrings,
  maybeTruncateValue: maybeTruncateValue
};

/***/ }),

/***/ "./src/utility.js":
/*!************************!*\
  !*** ./src/utility.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var merge = __webpack_require__(/*! ./merge */ "./src/merge.js");
var RollbarJSON = {};
function setupJSON(polyfillJSON) {
  if (isFunction(RollbarJSON.stringify) && isFunction(RollbarJSON.parse)) {
    return;
  }
  if (isDefined(JSON)) {
    // If polyfill is provided, prefer it over existing non-native shims.
    if (polyfillJSON) {
      if (isNativeFunction(JSON.stringify)) {
        RollbarJSON.stringify = JSON.stringify;
      }
      if (isNativeFunction(JSON.parse)) {
        RollbarJSON.parse = JSON.parse;
      }
    } else {
      // else accept any interface that is present.
      if (isFunction(JSON.stringify)) {
        RollbarJSON.stringify = JSON.stringify;
      }
      if (isFunction(JSON.parse)) {
        RollbarJSON.parse = JSON.parse;
      }
    }
  }
  if (!isFunction(RollbarJSON.stringify) || !isFunction(RollbarJSON.parse)) {
    polyfillJSON && polyfillJSON(RollbarJSON);
  }
}

/*
 * isType - Given a Javascript value and a string, returns true if the type of the value matches the
 * given string.
 *
 * @param x - any value
 * @param t - a lowercase string containing one of the following type names:
 *    - undefined
 *    - null
 *    - error
 *    - number
 *    - boolean
 *    - string
 *    - symbol
 *    - function
 *    - object
 *    - array
 * @returns true if x is of type t, otherwise false
 */
function isType(x, t) {
  return t === typeName(x);
}

/*
 * typeName - Given a Javascript value, returns the type of the object as a string
 */
function typeName(x) {
  var name = _typeof(x);
  if (name !== 'object') {
    return name;
  }
  if (!x) {
    return 'null';
  }
  if (x instanceof Error) {
    return 'error';
  }
  return {}.toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

/* isFunction - a convenience function for checking if a value is a function
 *
 * @param f - any value
 * @returns true if f is a function, otherwise false
 */
function isFunction(f) {
  return isType(f, 'function');
}

/* isNativeFunction - a convenience function for checking if a value is a native JS function
 *
 * @param f - any value
 * @returns true if f is a native JS function, otherwise false
 */
function isNativeFunction(f) {
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var funcMatchString = Function.prototype.toString.call(Object.prototype.hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?');
  var reIsNative = RegExp('^' + funcMatchString + '$');
  return isObject(f) && reIsNative.test(f);
}

/* isObject - Checks if the argument is an object
 *
 * @param value - any value
 * @returns true is value is an object function is an object)
 */
function isObject(value) {
  var type = _typeof(value);
  return value != null && (type == 'object' || type == 'function');
}

/* isString - Checks if the argument is a string
 *
 * @param value - any value
 * @returns true if value is a string
 */
function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

/**
 * isFiniteNumber - determines whether the passed value is a finite number
 *
 * @param {*} n - any value
 * @returns true if value is a finite number
 */
function isFiniteNumber(n) {
  return Number.isFinite(n);
}

/*
 * isDefined - a convenience function for checking if a value is not equal to undefined
 *
 * @param u - any value
 * @returns true if u is anything other than undefined
 */
function isDefined(u) {
  return !isType(u, 'undefined');
}

/*
 * isIterable - convenience function for checking if a value can be iterated, essentially
 * whether it is an object or an array.
 *
 * @param i - any value
 * @returns true if i is an object or an array as determined by `typeName`
 */
function isIterable(i) {
  var type = typeName(i);
  return type === 'object' || type === 'array';
}

/*
 * isError - convenience function for checking if a value is of an error type
 *
 * @param e - any value
 * @returns true if e is an error
 */
function isError(e) {
  // Detect both Error and Firefox Exception type
  return isType(e, 'error') || isType(e, 'exception');
}

/* isPromise - a convenience function for checking if a value is a promise
 *
 * @param p - any value
 * @returns true if f is a function, otherwise false
 */
function isPromise(p) {
  return isObject(p) && isType(p.then, 'function');
}

/**
 * isBrowser - a convenience function for checking if the code is running in a browser
 *
 * @returns true if the code is running in a browser environment
 */
function isBrowser() {
  return typeof window !== 'undefined';
}
function redact() {
  return '********';
}

// from http://stackoverflow.com/a/8809472/1138191
function uuid4() {
  var d = now();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
}
var LEVELS = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  critical: 4
};
function sanitizeUrl(url) {
  var baseUrlParts = parseUri(url);
  if (!baseUrlParts) {
    return '(unknown)';
  }

  // remove a trailing # if there is no anchor
  if (baseUrlParts.anchor === '') {
    baseUrlParts.source = baseUrlParts.source.replace('#', '');
  }
  url = baseUrlParts.source.replace('?' + baseUrlParts.query, '');
  return url;
}
var parseUriOptions = {
  strictMode: false,
  key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};
function parseUri(str) {
  if (!isType(str, 'string')) {
    return undefined;
  }
  var o = parseUriOptions;
  var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  var uri = {};
  for (var i = 0, l = o.key.length; i < l; ++i) {
    uri[o.key[i]] = m[i] || '';
  }
  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) {
      uri[o.q.name][$1] = $2;
    }
  });
  return uri;
}
function addParamsAndAccessTokenToPath(accessToken, options, params) {
  params = params || {};
  params.access_token = accessToken;
  var paramsArray = [];
  var k;
  for (k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k)) {
      paramsArray.push([k, params[k]].join('='));
    }
  }
  var query = '?' + paramsArray.sort().join('&');
  options = options || {};
  options.path = options.path || '';
  var qs = options.path.indexOf('?');
  var h = options.path.indexOf('#');
  var p;
  if (qs !== -1 && (h === -1 || h > qs)) {
    p = options.path;
    options.path = p.substring(0, qs) + query + '&' + p.substring(qs + 1);
  } else {
    if (h !== -1) {
      p = options.path;
      options.path = p.substring(0, h) + query + p.substring(h);
    } else {
      options.path = options.path + query;
    }
  }
}
function formatUrl(u, protocol) {
  protocol = protocol || u.protocol;
  if (!protocol && u.port) {
    if (u.port === 80) {
      protocol = 'http:';
    } else if (u.port === 443) {
      protocol = 'https:';
    }
  }
  protocol = protocol || 'https:';
  if (!u.hostname) {
    return null;
  }
  var result = protocol + '//' + u.hostname;
  if (u.port) {
    result = result + ':' + u.port;
  }
  if (u.path) {
    result = result + u.path;
  }
  return result;
}
function stringify(obj, backup) {
  var value, error;
  try {
    value = RollbarJSON.stringify(obj);
  } catch (jsonError) {
    if (backup && isFunction(backup)) {
      try {
        value = backup(obj);
      } catch (backupError) {
        error = backupError;
      }
    } else {
      error = jsonError;
    }
  }
  return {
    error: error,
    value: value
  };
}
function maxByteSize(string) {
  // The transport will use utf-8, so assume utf-8 encoding.
  //
  // This minimal implementation will accurately count bytes for all UCS-2 and
  // single code point UTF-16. If presented with multi code point UTF-16,
  // which should be rare, it will safely overcount, not undercount.
  //
  // While robust utf-8 encoders exist, this is far smaller and far more performant.
  // For quickly counting payload size for truncation, smaller is better.

  var count = 0;
  var length = string.length;
  for (var i = 0; i < length; i++) {
    var code = string.charCodeAt(i);
    if (code < 128) {
      // up to 7 bits
      count = count + 1;
    } else if (code < 2048) {
      // up to 11 bits
      count = count + 2;
    } else if (code < 65536) {
      // up to 16 bits
      count = count + 3;
    }
  }
  return count;
}
function jsonParse(s) {
  var value, error;
  try {
    value = RollbarJSON.parse(s);
  } catch (e) {
    error = e;
  }
  return {
    error: error,
    value: value
  };
}
function makeUnhandledStackInfo(message, url, lineno, colno, error, mode, backupMessage, errorParser) {
  var location = {
    url: url || '',
    line: lineno,
    column: colno
  };
  location.func = errorParser.guessFunctionName(location.url, location.line);
  location.context = errorParser.gatherContext(location.url, location.line);
  var href = typeof document !== 'undefined' && document && document.location && document.location.href;
  var useragent = typeof window !== 'undefined' && window && window.navigator && window.navigator.userAgent;
  return {
    mode: mode,
    message: error ? String(error) : message || backupMessage,
    url: href,
    stack: [location],
    useragent: useragent
  };
}
function wrapCallback(logger, f) {
  return function (err, resp) {
    try {
      f(err, resp);
    } catch (e) {
      logger.error(e);
    }
  };
}
function nonCircularClone(obj) {
  var seen = [obj];
  function clone(obj, seen) {
    var value,
      name,
      newSeen,
      result = {};
    try {
      for (name in obj) {
        value = obj[name];
        if (value && (isType(value, 'object') || isType(value, 'array'))) {
          if (seen.includes(value)) {
            result[name] = 'Removed circular reference: ' + typeName(value);
          } else {
            newSeen = seen.slice();
            newSeen.push(value);
            result[name] = clone(value, newSeen);
          }
          continue;
        }
        result[name] = value;
      }
    } catch (e) {
      result = 'Failed cloning custom data: ' + e.message;
    }
    return result;
  }
  return clone(obj, seen);
}
function createItem(args, logger, notifier, requestKeys, lambdaContext) {
  var message, err, custom, callback, request;
  var arg;
  var extraArgs = [];
  var diagnostic = {};
  var argTypes = [];
  for (var i = 0, l = args.length; i < l; ++i) {
    arg = args[i];
    var typ = typeName(arg);
    argTypes.push(typ);
    switch (typ) {
      case 'undefined':
        break;
      case 'string':
        message ? extraArgs.push(arg) : message = arg;
        break;
      case 'function':
        callback = wrapCallback(logger, arg);
        break;
      case 'date':
        extraArgs.push(arg);
        break;
      case 'error':
      case 'domexception':
      case 'exception':
        // Firefox Exception type
        err ? extraArgs.push(arg) : err = arg;
        break;
      case 'object':
      case 'array':
        if (arg instanceof Error || typeof DOMException !== 'undefined' && arg instanceof DOMException) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        if (requestKeys && typ === 'object' && !request) {
          for (var j = 0, len = requestKeys.length; j < len; ++j) {
            if (arg[requestKeys[j]] !== undefined) {
              request = arg;
              break;
            }
          }
          if (request) {
            break;
          }
        }
        custom ? extraArgs.push(arg) : custom = arg;
        break;
      default:
        if (arg instanceof Error || typeof DOMException !== 'undefined' && arg instanceof DOMException) {
          err ? extraArgs.push(arg) : err = arg;
          break;
        }
        extraArgs.push(arg);
    }
  }

  // if custom is an array this turns it into an object with integer keys
  if (custom) custom = nonCircularClone(custom);
  if (extraArgs.length > 0) {
    if (!custom) custom = nonCircularClone({});
    custom.extraArgs = nonCircularClone(extraArgs);
  }
  var item = {
    message: message,
    err: err,
    custom: custom,
    timestamp: now(),
    callback: callback,
    notifier: notifier,
    diagnostic: diagnostic,
    uuid: uuid4()
  };
  item.data = item.data || {};
  setCustomItemKeys(item, custom);
  if (requestKeys && request) {
    item.request = request;
  }
  if (lambdaContext) {
    item.lambdaContext = lambdaContext;
  }
  item._originalArgs = args;
  item.diagnostic.original_arg_types = argTypes;
  return item;
}
function setCustomItemKeys(item, custom) {
  if (custom && custom.level !== undefined) {
    item.level = custom.level;
    delete custom.level;
  }
  if (custom && custom.skipFrames !== undefined) {
    item.skipFrames = custom.skipFrames;
    delete custom.skipFrames;
  }
}
function addErrorContext(item, errors) {
  var custom = item.data.custom || {};
  var contextAdded = false;
  try {
    for (var i = 0; i < errors.length; ++i) {
      if (errors[i].hasOwnProperty('rollbarContext')) {
        custom = merge(custom, nonCircularClone(errors[i].rollbarContext));
        contextAdded = true;
      }
    }

    // Avoid adding an empty object to the data.
    if (contextAdded) {
      item.data.custom = custom;
    }
  } catch (e) {
    item.diagnostic.error_context = 'Failed: ' + e.message;
  }
}
var TELEMETRY_TYPES = ['log', 'network', 'dom', 'navigation', 'error', 'manual'];
var TELEMETRY_LEVELS = ['critical', 'error', 'warning', 'info', 'debug'];
function arrayIncludes(arr, val) {
  for (var k = 0; k < arr.length; ++k) {
    if (arr[k] === val) {
      return true;
    }
  }
  return false;
}
function createTelemetryEvent(args) {
  var type, metadata, level;
  var arg;
  for (var i = 0, l = args.length; i < l; ++i) {
    arg = args[i];
    var typ = typeName(arg);
    switch (typ) {
      case 'string':
        if (!type && arrayIncludes(TELEMETRY_TYPES, arg)) {
          type = arg;
        } else if (!level && arrayIncludes(TELEMETRY_LEVELS, arg)) {
          level = arg;
        }
        break;
      case 'object':
        metadata = arg;
        break;
      default:
        break;
    }
  }
  var event = {
    type: type || 'manual',
    metadata: metadata || {},
    level: level
  };
  return event;
}
function addItemAttributes(item, attributes) {
  item.data.attributes = item.data.attributes || [];
  if (attributes) {
    var _item$data$attributes;
    (_item$data$attributes = item.data.attributes).push.apply(_item$data$attributes, _toConsumableArray(attributes));
  }
}

/*
 * get - given an obj/array and a keypath, return the value at that keypath or
 *       undefined if not possible.
 *
 * @param obj - an object or array
 * @param path - a string of keys separated by '.' such as 'plugin.jquery.0.message'
 *    which would correspond to 42 in `{plugin: {jquery: [{message: 42}]}}`
 */
function get(obj, path) {
  if (!obj) {
    return undefined;
  }
  var keys = path.split('.');
  var result = obj;
  try {
    for (var i = 0, len = keys.length; i < len; ++i) {
      result = result[keys[i]];
    }
  } catch (e) {
    result = undefined;
  }
  return result;
}
function set(obj, path, value) {
  if (!obj) {
    return;
  }
  var keys = path.split('.');
  var len = keys.length;
  if (len < 1) {
    return;
  }
  if (len === 1) {
    obj[keys[0]] = value;
    return;
  }
  try {
    var temp = obj[keys[0]] || {};
    var replacement = temp;
    for (var i = 1; i < len - 1; ++i) {
      temp[keys[i]] = temp[keys[i]] || {};
      temp = temp[keys[i]];
    }
    temp[keys[len - 1]] = value;
    obj[keys[0]] = replacement;
  } catch (e) {
    return;
  }
}
function formatArgsAsString(args) {
  var i, len, arg;
  var result = [];
  for (i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    switch (typeName(arg)) {
      case 'object':
        arg = stringify(arg);
        arg = arg.error || arg.value;
        if (arg.length > 500) {
          arg = arg.substr(0, 497) + '...';
        }
        break;
      case 'null':
        arg = 'null';
        break;
      case 'undefined':
        arg = 'undefined';
        break;
      case 'symbol':
        arg = arg.toString();
        break;
    }
    result.push(arg);
  }
  return result.join(' ');
}
function now() {
  if (Date.now) {
    return +Date.now();
  }
  return +new Date();
}
function filterIp(requestData, captureIp) {
  if (!requestData || !requestData['user_ip'] || captureIp === true) {
    return;
  }
  var newIp = requestData['user_ip'];
  if (!captureIp) {
    newIp = null;
  } else {
    try {
      var parts;
      if (newIp.indexOf('.') !== -1) {
        parts = newIp.split('.');
        parts.pop();
        parts.push('0');
        newIp = parts.join('.');
      } else if (newIp.indexOf(':') !== -1) {
        parts = newIp.split(':');
        if (parts.length > 2) {
          var beginning = parts.slice(0, 3);
          var slashIdx = beginning[2].indexOf('/');
          if (slashIdx !== -1) {
            beginning[2] = beginning[2].substring(0, slashIdx);
          }
          var terminal = '0000:0000:0000:0000:0000';
          newIp = beginning.concat(terminal).join(':');
        }
      } else {
        newIp = null;
      }
    } catch (e) {
      newIp = null;
    }
  }
  requestData['user_ip'] = newIp;
}
function handleOptions(current, input, payload, logger) {
  var result = merge(current, input, payload);
  result = updateDeprecatedOptions(result, logger);
  if (!input || input.overwriteScrubFields) {
    return result;
  }
  if (input.scrubFields) {
    result.scrubFields = (current.scrubFields || []).concat(input.scrubFields);
  }
  return result;
}
function updateDeprecatedOptions(options, logger) {
  if (options.hostWhiteList && !options.hostSafeList) {
    options.hostSafeList = options.hostWhiteList;
    options.hostWhiteList = undefined;
    logger && logger.log('hostWhiteList is deprecated. Use hostSafeList.');
  }
  if (options.hostBlackList && !options.hostBlockList) {
    options.hostBlockList = options.hostBlackList;
    options.hostBlackList = undefined;
    logger && logger.log('hostBlackList is deprecated. Use hostBlockList.');
  }
  return options;
}
module.exports = {
  addParamsAndAccessTokenToPath: addParamsAndAccessTokenToPath,
  createItem: createItem,
  addErrorContext: addErrorContext,
  createTelemetryEvent: createTelemetryEvent,
  addItemAttributes: addItemAttributes,
  filterIp: filterIp,
  formatArgsAsString: formatArgsAsString,
  formatUrl: formatUrl,
  get: get,
  handleOptions: handleOptions,
  isError: isError,
  isFiniteNumber: isFiniteNumber,
  isFunction: isFunction,
  isIterable: isIterable,
  isNativeFunction: isNativeFunction,
  isObject: isObject,
  isString: isString,
  isType: isType,
  isPromise: isPromise,
  isBrowser: isBrowser,
  jsonParse: jsonParse,
  LEVELS: LEVELS,
  makeUnhandledStackInfo: makeUnhandledStackInfo,
  merge: merge,
  now: now,
  redact: redact,
  RollbarJSON: RollbarJSON,
  sanitizeUrl: sanitizeUrl,
  set: set,
  setupJSON: setupJSON,
  stringify: stringify,
  maxByteSize: maxByteSize,
  typeName: typeName,
  uuid4: uuid4
};

/***/ }),

/***/ "./src/utility/traverse.js":
/*!*********************************!*\
  !*** ./src/utility/traverse.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _ = __webpack_require__(/*! ../utility */ "./src/utility.js");
function traverse(obj, func, seen) {
  var k, v, i;
  var isObj = _.isType(obj, 'object');
  var isArray = _.isType(obj, 'array');
  var keys = [];
  var seenIndex;

  // Best might be to use Map here with `obj` as the keys, but we want to support IE < 11.
  seen = seen || {
    obj: [],
    mapped: []
  };
  if (isObj) {
    seenIndex = seen.obj.indexOf(obj);
    if (isObj && seenIndex !== -1) {
      // Prefer the mapped object if there is one.
      return seen.mapped[seenIndex] || seen.obj[seenIndex];
    }
    seen.obj.push(obj);
    seenIndex = seen.obj.length - 1;
  }
  if (isObj) {
    for (k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
    }
  } else if (isArray) {
    for (i = 0; i < obj.length; ++i) {
      keys.push(i);
    }
  }
  var result = isObj ? {} : [];
  var same = true;
  for (i = 0; i < keys.length; ++i) {
    k = keys[i];
    v = obj[k];
    result[k] = func(k, v, seen);
    same = same && result[k] === obj[k];
  }
  if (isObj && !same) {
    seen.mapped[seenIndex] = result;
  }
  return !same ? result : obj;
}
module.exports = traverse;

/***/ }),

/***/ "./vendor/JSON-js/json3.js":
/*!*********************************!*\
  !*** ./vendor/JSON-js/json3.js ***!
  \*********************************/
/***/ ((module) => {

//  json3.js
//  2017-02-21
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
//  See http://www.JSON.org/js.html
//  This code should be minified before deployment.
//  See http://javascript.crockford.com/jsmin.html

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.
//          This has been modified to use JSON-js/json_parse_state.js as the
//          parser instead of the one built around eval found in JSON-js/json2.js

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
//                          +a[5], +a[6]));
//                  }
//              }
//              return value;
//          });

//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
//              var d;
//              if (typeof value === "string" &&
//                      value.slice(0, 5) === "Date(" &&
//                      value.slice(-1) === ")") {
//                  d = new Date(value.slice(5, -1));
//                  if (d) {
//                      return d;
//                  }
//              }
//              return value;
//          });

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
  for, this
  */

/*property
  JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
  getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
  lastIndex, length, parse, prototype, push, replace, slice, stringify,
  test, toJSON, toString, valueOf
  */

var setupCustomJSON = function(JSON) {

  var rx_one = /^[\],:{}\s]*$/;
  var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  function f(n) {
    // Format integers to have at least two digits.
    return n < 10
      ? "0" + n
      : n;
  }

  function this_value() {
    return this.valueOf();
  }

  if (typeof Date.prototype.toJSON !== "function") {

    Date.prototype.toJSON = function () {

      return isFinite(this.valueOf())
        ? this.getUTCFullYear() + "-" +
        f(this.getUTCMonth() + 1) + "-" +
        f(this.getUTCDate()) + "T" +
        f(this.getUTCHours()) + ":" +
        f(this.getUTCMinutes()) + ":" +
        f(this.getUTCSeconds()) + "Z"
        : null;
    };

    Boolean.prototype.toJSON = this_value;
    Number.prototype.toJSON = this_value;
    String.prototype.toJSON = this_value;
  }

  var gap;
  var indent;
  var meta;
  var rep;


  function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    rx_escapable.lastIndex = 0;
    return rx_escapable.test(string)
      ? "\"" + string.replace(rx_escapable, function (a) {
        var c = meta[a];
        return typeof c === "string"
          ? c
          : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
      }) + "\""
    : "\"" + string + "\"";
  }


  function str(key, holder) {

    // Produce a string from holder[key].

    var i;          // The loop counter.
    var k;          // The member key.
    var v;          // The member value.
    var length;
    var mind = gap;
    var partial;
    var value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === "object" &&
        typeof value.toJSON === "function") {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === "function") {
      value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
      case "string":
        return quote(value);

      case "number":

        // JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value)
          ? String(value)
          : "null";

      case "boolean":
      case "null":

        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce "null". The case is included here in
        // the remote chance that this gets fixed someday.

        return String(value);

        // If the type is "object", we might be dealing with an object or an array or
        // null.

      case "object":

        // Due to a specification blunder in ECMAScript, typeof null is "object",
        // so watch out for that case.

        if (!value) {
          return "null";
        }

        // Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

        // Is the value an array?

        if (Object.prototype.toString.apply(value) === "[object Array]") {

          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || "null";
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.

          v = partial.length === 0
            ? "[]"
            : gap
            ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
            : "[" + partial.join(",") + "]";
          gap = mind;
          return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === "object") {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === "string") {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (
                      gap
                      ? ": "
                      : ":"
                      ) + v);
              }
            }
          }
        } else {

          // Otherwise, iterate through all of the keys in the object.

          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (
                      gap
                      ? ": "
                      : ":"
                      ) + v);
              }
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0
          ? "{}"
          : gap
          ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
          : "{" + partial.join(",") + "}";
        gap = mind;
        return v;
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.

  if (typeof JSON.stringify !== "function") {
    meta = {    // table of character substitutions
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      "\"": "\\\"",
      "\\": "\\\\"
    };
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = "";
      indent = "";

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " ";
        }

        // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === "string") {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== "function" &&
          (typeof replacer !== "object" ||
           typeof replacer.length !== "number")) {
        throw new Error("JSON.stringify");
      }

      // Make a fake root object containing our value under the key of "".
      // Return the result of stringifying the value.

      return str("", {"": value});
    };
  }


  // If the JSON object does not yet have a parse method, give it one.

  if (typeof JSON.parse !== "function") {
    JSON.parse = (function () {

      // This function creates a JSON parse function that uses a state machine rather
      // than the dangerous eval function to parse a JSON text.

      var state;      // The state of the parser, one of
      // 'go'         The starting state
      // 'ok'         The final, accepting state
      // 'firstokey'  Ready for the first key of the object or
      //              the closing of an empty object
      // 'okey'       Ready for the next key of the object
      // 'colon'      Ready for the colon
      // 'ovalue'     Ready for the value half of a key/value pair
      // 'ocomma'     Ready for a comma or closing }
      // 'firstavalue' Ready for the first value of an array or
      //              an empty array
      // 'avalue'     Ready for the next value of an array
      // 'acomma'     Ready for a comma or closing ]
      var stack;      // The stack, for controlling nesting.
      var container;  // The current container object or array
      var key;        // The current key
      var value;      // The current value
      var escapes = { // Escapement translation table
        "\\": "\\",
        "\"": "\"",
        "/": "/",
        "t": "\t",
        "n": "\n",
        "r": "\r",
        "f": "\f",
        "b": "\b"
      };
      var string = {   // The actions for string tokens
        go: function () {
          state = "ok";
        },
        firstokey: function () {
          key = value;
          state = "colon";
        },
        okey: function () {
          key = value;
          state = "colon";
        },
        ovalue: function () {
          state = "ocomma";
        },
        firstavalue: function () {
          state = "acomma";
        },
        avalue: function () {
          state = "acomma";
        }
      };
      var number = {   // The actions for number tokens
        go: function () {
          state = "ok";
        },
        ovalue: function () {
          state = "ocomma";
        },
        firstavalue: function () {
          state = "acomma";
        },
        avalue: function () {
          state = "acomma";
        }
      };
      var action = {

        // The action table describes the behavior of the machine. It contains an
        // object for each token. Each object contains a method that is called when
        // a token is matched in a state. An object will lack a method for illegal
        // states.

        "{": {
          go: function () {
            stack.push({state: "ok"});
            container = {};
            state = "firstokey";
          },
          ovalue: function () {
            stack.push({container: container, state: "ocomma", key: key});
            container = {};
            state = "firstokey";
          },
          firstavalue: function () {
            stack.push({container: container, state: "acomma"});
            container = {};
            state = "firstokey";
          },
          avalue: function () {
            stack.push({container: container, state: "acomma"});
            container = {};
            state = "firstokey";
          }
        },
        "}": {
          firstokey: function () {
            var pop = stack.pop();
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          },
          ocomma: function () {
            var pop = stack.pop();
            container[key] = value;
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          }
        },
        "[": {
          go: function () {
            stack.push({state: "ok"});
            container = [];
            state = "firstavalue";
          },
          ovalue: function () {
            stack.push({container: container, state: "ocomma", key: key});
            container = [];
            state = "firstavalue";
          },
          firstavalue: function () {
            stack.push({container: container, state: "acomma"});
            container = [];
            state = "firstavalue";
          },
          avalue: function () {
            stack.push({container: container, state: "acomma"});
            container = [];
            state = "firstavalue";
          }
        },
        "]": {
          firstavalue: function () {
            var pop = stack.pop();
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          },
          acomma: function () {
            var pop = stack.pop();
            container.push(value);
            value = container;
            container = pop.container;
            key = pop.key;
            state = pop.state;
          }
        },
        ":": {
          colon: function () {
            if (Object.hasOwnProperty.call(container, key)) {
              throw new SyntaxError("Duplicate key '" + key + "\"");
            }
            state = "ovalue";
          }
        },
        ",": {
          ocomma: function () {
            container[key] = value;
            state = "okey";
          },
          acomma: function () {
            container.push(value);
            state = "avalue";
          }
        },
        "true": {
          go: function () {
            value = true;
            state = "ok";
          },
          ovalue: function () {
            value = true;
            state = "ocomma";
          },
          firstavalue: function () {
            value = true;
            state = "acomma";
          },
          avalue: function () {
            value = true;
            state = "acomma";
          }
        },
        "false": {
          go: function () {
            value = false;
            state = "ok";
          },
          ovalue: function () {
            value = false;
            state = "ocomma";
          },
          firstavalue: function () {
            value = false;
            state = "acomma";
          },
          avalue: function () {
            value = false;
            state = "acomma";
          }
        },
        "null": {
          go: function () {
            value = null;
            state = "ok";
          },
          ovalue: function () {
            value = null;
            state = "ocomma";
          },
          firstavalue: function () {
            value = null;
            state = "acomma";
          },
          avalue: function () {
            value = null;
            state = "acomma";
          }
        }
      };

      function debackslashify(text) {

        // Remove and replace any backslash escapement.

        return text.replace(/\\(?:u(.{4})|([^u]))/g, function (ignore, b, c) {
          return b
            ? String.fromCharCode(parseInt(b, 16))
            : escapes[c];
        });
      }

      return function (source, reviver) {

        // A regular expression is used to extract tokens from the JSON text.
        // The extraction process is cautious.

        var result;
        var tx = /^[\u0020\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;

        // Set the starting state.

        state = "go";

        // The stack records the container, key, and state for each object or array
        // that contains another object or array while processing nested structures.

        stack = [];

        // If any error occurs, we will catch it and ultimately throw a syntax error.

        try {

          // For each token...

          while (true) {
            result = tx.exec(source);
            if (!result) {
              break;
            }

            // result is the result array from matching the tokenizing regular expression.
            //  result[0] contains everything that matched, including any initial whitespace.
            //  result[1] contains any punctuation that was matched, or true, false, or null.
            //  result[2] contains a matched number, still in string form.
            //  result[3] contains a matched string, without quotes but with escapement.

            if (result[1]) {

              // Token: Execute the action for this state and token.

              action[result[1]][state]();

            } else if (result[2]) {

              // Number token: Convert the number string into a number value and execute
              // the action for this state and number.

              value = +result[2];
              number[state]();
            } else {

              // String token: Replace the escapement sequences and execute the action for
              // this state and string.

              value = debackslashify(result[3]);
              string[state]();
            }

            // Remove the token from the string. The loop will continue as long as there
            // are tokens. This is a slow process, but it allows the use of ^ matching,
            // which assures that no illegal tokens slip through.

            source = source.slice(result[0].length);
          }

          // If we find a state/token combination that is illegal, then the action will
          // cause an error. We handle the error by simply changing the state.

        } catch (e) {
          state = e;
        }

        // The parsing is finished. If we are not in the final "ok" state, or if the
        // remaining source contains anything except whitespace, then we did not have
        //a well-formed JSON text.

        if (state !== "ok" || (/[^\u0020\t\n\r]/.test(source))) {
          throw (state instanceof SyntaxError)
            ? state
            : new SyntaxError("JSON");
        }

        // If there is a reviver function, we recursively walk the new structure,
        // passing each name/value pair to the reviver function for possible
        // transformation, starting with a temporary root object that holds the current
        // value in an empty key. If there is not a reviver function, we simply return
        // that value.

        return (typeof reviver === "function")
          ? (function walk(holder, key) {
            var k;
            var v;
            var val = holder[key];
            if (val && typeof val === "object") {
              for (k in value) {
                if (Object.prototype.hasOwnProperty.call(val, k)) {
                  v = walk(val, k);
                  if (v !== undefined) {
                    val[k] = v;
                  } else {
                    delete val[k];
                  }
                }
              }
            }
            return reviver.call(holder, key, val);
          }({"": value}, ""))
        : value;
      };
    }());
  }
}

module.exports = setupCustomJSON;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************************!*\
  !*** ./test/react-native.rollbar.test.js ***!
  \*******************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = __webpack_require__(/*! ../src/react-native/rollbar */ "./src/react-native/rollbar.js");
var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
};
var rollbar = new Rollbar(rollbarConfig);

describe('sendJsonPayload', function () {
  var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

  before(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    window.fetchStub = sinon.stub(window, 'fetch');
    done();
  });

  after(function () {
    window.fetch.restore();
  });

  function stubResponse(code, err, message) {
    window.fetch.returns(
      Promise.resolve(
        new Response(
          JSON.stringify({
            err: err,
            message: message,
            result: { uuid: uuid },
          }),
          {
            status: code,
            statusText: message,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );
  }

  it('should callback with the right value on success', function (done) {
    stubResponse(200, 0, 'OK');

    var json = JSON.stringify({ foo: 'baaar' });

    rollbar.sendJsonPayload(json);

    expect(window.fetchStub.called).to.be.ok();
    expect(window.fetchStub.getCall(0).args[1].body).to.eql(json);

    done();
  });
});

const DUMMY_TRACE_ID = 'some-trace-id';
const DUMMY_SPAN_ID = 'some-span-id';

const ValidOpenTracingTracerStub = {
  scope: () => {
    return {
      active: () => {
        return {
          setTag: () => {},
          context: () => {
            return {
              toTraceId: () => DUMMY_TRACE_ID,
              toSpanId: () => DUMMY_SPAN_ID,
            };
          },
        };
      },
    };
  },
};

const InvalidOpenTracingTracerStub = {
  foo: () => {},
};

function TestClientGen() {
  var TestClient = function () {
    this.transforms = [];
    this.predicates = [];
    this.notifier = {
      addTransform: function (t) {
        this.transforms.push(t);
        return this.notifier;
      }.bind(this),
    };
    this.queue = {
      addPredicate: function (p) {
        this.predicates.push(p);
        return this.queue;
      }.bind(this),
    };
    this.logCalls = [];
    var logs = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i = 0, len = logs.length; i < len; i++) {
      var fn = logs[i].slice(0);
      this[fn] = function (fn, item) {
        this.logCalls.push({ func: fn, item: item });
      }.bind(this, fn);
    }
    this.options = {};
    this.payloadData = {};
    this.configure = function (o, payloadData) {
      this.options = o;
      this.payloadData = payloadData;
    };
  };

  return TestClient;
}

describe('Rollbar()', function () {
  it('should have all of the expected methods with a real client', function (done) {
    var options = {};
    var rollbar = new Rollbar(options);

    expect(rollbar).to.have.property('log');
    expect(rollbar).to.have.property('debug');
    expect(rollbar).to.have.property('info');
    expect(rollbar).to.have.property('warn');
    expect(rollbar).to.have.property('warning');
    expect(rollbar).to.have.property('error');
    expect(rollbar).to.have.property('critical');

    done();
  });

  it('should have all of the expected methods', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    expect(rollbar).to.have.property('log');
    expect(rollbar).to.have.property('debug');
    expect(rollbar).to.have.property('info');
    expect(rollbar).to.have.property('warn');
    expect(rollbar).to.have.property('warning');
    expect(rollbar).to.have.property('error');
    expect(rollbar).to.have.property('critical');

    done();
  });

  it('should have some default options', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.scrubFields).to.contain('password');
    done();
  });

  it('should merge with the defaults options', function (done) {
    var client = new (TestClientGen())();
    var options = {
      scrubFields: ['foobar'],
    };
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.scrubFields).to.contain('foobar');
    expect(rollbar.options.scrubFields).to.contain('password');
    done();
  });

  it('should overwrite default if specified', function (done) {
    var client = new (TestClientGen())();
    var options = {
      scrubFields: ['foobar'],
      overwriteScrubFields: true,
    };
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.scrubFields).to.contain('foobar');
    expect(rollbar.options.scrubFields).to.not.contain('password');
    done();
  });

  it('should replace deprecated options', function (done) {
    var client = new (TestClientGen())();
    var options = {
      hostWhiteList: ['foo'],
      hostBlackList: ['bar'],
    };
    var rollbar = new Rollbar(options, client);

    expect(rollbar.options.hostWhiteList).to.eql(undefined);
    expect(rollbar.options.hostBlackList).to.eql(undefined);
    expect(rollbar.options.hostSafeList).to.contain('foo');
    expect(rollbar.options.hostBlockList).to.contain('bar');
    done();
  });

  it('should return a uuid when logging', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var result = rollbar.log('a messasge', 'another one');
    expect(result.uuid).to.be.ok();

    done();
  });

  it('should package up the inputs', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var result = rollbar.log('a message', 'another one');
    var loggedItem = client.logCalls[0].item;
    expect(loggedItem.message).to.eql('a message');
    expect(loggedItem.custom).to.be.ok();

    done();
  });

  it('should call the client with the right method', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var methods = 'log,debug,info,warn,warning,error,critical'.split(',');
    for (var i = 0; i < methods.length; i++) {
      var msg = 'message:' + i;
      rollbar[methods[i]](msg);
      expect(client.logCalls[i].func).to.eql(methods[i]);
      expect(client.logCalls[i].item.message).to.eql(msg);
    }

    done();
  });

  it('should have a tracer if valid tracer is provided', function (done) {
    var options = { tracer: ValidOpenTracingTracerStub };
    var rollbar = new Rollbar(options);

    expect(rollbar.client.tracer).to.eql(ValidOpenTracingTracerStub);

    done();
  });

  it('should not have a tracer if invalid tracer is provided', function (done) {
    var options = { tracer: InvalidOpenTracingTracerStub };
    var rollbar = new Rollbar(options);

    expect(rollbar.client.tracer).to.eql(null);

    done();
  });
});

describe('configure', function () {
  it('should configure client', function (done) {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({ payload: { environment: 'borkbork' } });
    expect(rollbar.options.payload.environment).to.eql('borkbork');
    expect(client.options.payload.environment).to.eql('borkbork');
    done();
  });
  it('should accept a second parameter and use it as the payload value', function (done) {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({ somekey: 'borkbork' }, { b: 97 });
    expect(rollbar.options.somekey).to.eql('borkbork');
    expect(rollbar.options.payload.b).to.eql(97);
    expect(client.payloadData.b).to.eql(97);
    done();
  });
  it('should accept a second parameter and override the payload with it', function (done) {
    var client = new (TestClientGen())();
    var options = {
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options.payload.environment).to.eql('testtest');

    rollbar.configure({ somekey: 'borkbork', payload: { b: 101 } }, { b: 97 });
    expect(rollbar.options.somekey).to.eql('borkbork');
    expect(rollbar.options.payload.b).to.eql(97);
    expect(client.payloadData.b).to.eql(97);
    done();
  });
  it('should replace deprecated options', function (done) {
    var client = new (TestClientGen())();
    var options = {
      hostWhiteList: ['foo'],
      hostBlackList: ['bar'],
    };
    var rollbar = (window.rollbar = new Rollbar(
      { autoInstrument: false },
      client,
    ));
    rollbar.configure(options);

    expect(rollbar.options.hostWhiteList).to.eql(undefined);
    expect(rollbar.options.hostBlackList).to.eql(undefined);
    expect(rollbar.options.hostSafeList).to.contain('foo');
    expect(rollbar.options.hostBlockList).to.contain('bar');
    done();
  });
  it('should store configured options', function (done) {
    var client = new (TestClientGen())();
    var options = {
      captureUncaught: true,
      payload: {
        a: 42,
        environment: 'testtest',
      },
    };
    var rollbar = new Rollbar(options, client);
    expect(rollbar.options._configuredOptions.payload.environment).to.eql(
      'testtest',
    );
    expect(rollbar.options._configuredOptions.captureUncaught).to.eql(true);

    rollbar.configure({
      captureUncaught: false,
      payload: { environment: 'borkbork' },
    });
    expect(rollbar.options._configuredOptions.payload.environment).to.eql(
      'borkbork',
    );
    expect(rollbar.options._configuredOptions.captureUncaught).to.eql(false);
    done();
  });
});

describe('captureEvent', function () {
  it('should handle missing/default type and level', function (done) {
    var options = {};
    var rollbar = new Rollbar(options);

    var event = rollbar.captureEvent({ foo: 'bar' });
    expect(event.type).to.eql('manual');
    expect(event.level).to.eql('info');
    expect(event.body.foo).to.eql('bar');

    done();
  });
  it('should handle specified type and level', function (done) {
    var options = {};
    var rollbar = new Rollbar(options);

    var event = rollbar.captureEvent('log', { foo: 'bar' }, 'debug');
    expect(event.type).to.eql('log');
    expect(event.level).to.eql('debug');
    expect(event.body.foo).to.eql('bar');

    done();
  });
  it('should handle extra args', function (done) {
    var options = {};
    var rollbar = new Rollbar(options);

    var event = rollbar.captureEvent('meaningless', { foo: 'bar' }, 23);
    expect(event.type).to.eql('manual');
    expect(event.level).to.eql('info');
    expect(event.body.foo).to.eql('bar');

    done();
  });
});

describe('callback options', function () {
  beforeEach(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    window.fetchStub = sinon.stub(window, 'fetch');
    done();
  });

  afterEach(function () {
    window.fetch.restore();
  });

  function stubResponse(code, err, message) {
    var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

    window.fetch.returns(
      Promise.resolve(
        new Response(
          JSON.stringify({
            err: err,
            message: message,
            result: { uuid: uuid },
          }),
          {
            status: code,
            statusText: message,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    );
  }

  it('should use checkIgnore when set', function (done) {
    stubResponse(200, 0, 'OK');

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      checkIgnore: function (_isUncaught, _args, _payload) {
        return true;
      },
    };
    var rollbar = new Rollbar(options);

    rollbar.log('test'); // generate a payload to ignore

    expect(window.fetchStub.called).to.not.be.ok();

    done();
  });

  it('should use onSendCallback when set', function (done) {
    stubResponse(200, 0, 'OK');

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      onSendCallback: function (_isUncaught, _args, payload) {
        payload.foo = 'bar';
      },
    };
    var rollbar = new Rollbar(options);

    rollbar.log('test'); // generate a payload to inspect

    setTimeout(function () {
      expect(window.fetchStub.called).to.be.ok();
      var body = JSON.parse(window.fetchStub.getCall(0).args[1].body);
      expect(body.data.foo).to.eql('bar');

      done();
    }, 1);
  });

  it('should use transform when set', function (done) {
    stubResponse(200, 0, 'OK');

    var options = {
      accessToken: 'POST_CLIENT_ITEM_TOKEN',
      transform: function (data, _item) {
        data.foo = 'baz';
      },
    };
    var rollbar = new Rollbar(options);

    rollbar.log('test'); // generate a payload to inspect

    setTimeout(function () {
      expect(window.fetchStub.called).to.be.ok();
      var body = JSON.parse(window.fetchStub.getCall(0).args[1].body);
      expect(body.data.foo).to.eql('baz');

      done();
    }, 1);
  });
});

describe('createItem', function () {
  it('should handle multiple strings', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = ['first', 'second'];
    var item = rollbar._createItem(args);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs['0']).to.eql('second');

    done();
  });
  it('should handle errors', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs['0']).to.eql('second');

    done();
  });
  it('should handle a callback', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var myCallbackCalled = false;
    var myCallback = function () {
      myCallbackCalled = true;
    };
    var args = [new Error('Whoa'), 'first', myCallback, 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.extraArgs).to.eql(['second']);
    expect(item.callback).to.be.ok();
    item.callback();
    expect(myCallbackCalled).to.be.ok();

    done();
  });
  it('should handle arrays', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', [1, 2, 3], 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom['0']).to.eql(1);
    expect(item.custom.extraArgs).to.eql(['second']);

    done();
  });
  it('should handle objects', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.err).to.eql(args[0]);
    expect(item.message).to.eql('first');
    expect(item.custom.a).to.eql(1);
    expect(item.custom.b).to.eql(2);
    expect(item.custom.extraArgs).to.eql(['second']);

    done();
  });
  it('should have a timestamp', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    var now = new Date().getTime();
    expect(item.timestamp).to.be.within(now - 1000, now + 1000);

    done();
  });
  it('should have an uuid', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.uuid).to.be.ok();

    var parts = item.uuid.split('-');
    expect(parts.length).to.eql(5);
    // Type 4 UUID
    expect(parts[2][0]).to.eql('4');

    done();
  });
  it('should handle dates', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var y2k = new Date(2000, 0, 1);
    var args = [new Error('Whoa'), 'first', y2k, { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.custom.extraArgs).to.eql([y2k, 'second']);

    done();
  });
  it('should handle numbers', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    var args = [new Error('Whoa'), 'first', 42, { a: 1, b: 2 }, 'second'];
    var item = rollbar._createItem(args);
    expect(item.custom.extraArgs).to.eql([42, 'second']);

    done();
  });
  it('should handle domexceptions', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = new Rollbar(options, client);

    if (document && document.querySelectorAll) {
      var e;
      try {
        document.querySelectorAll('div:foo');
      } catch (ee) {
        e = ee;
      }
      var args = [e, 'first', 42, { a: 1, b: 2 }, 'second'];
      var item = rollbar._createItem(args);
      expect(item.err).to.be.ok();
    }

    done();
  });
});

describe('singleton', function () {
  it('should pass through the underlying client after init', function (done) {
    var client = new (TestClientGen())();
    var options = {};
    var rollbar = Rollbar.init(options, client);

    rollbar.log('hello 1');
    Rollbar.log('hello 2');

    var loggedItemDirect = client.logCalls[0].item;
    var loggedItemSingleton = client.logCalls[1].item;
    expect(loggedItemDirect.message).to.eql('hello 1');
    expect(loggedItemSingleton.message).to.eql('hello 2');

    done();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtbmF0aXZlLnJvbGxiYXIudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7O0FBRUEsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsWUFBWTtBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLE1BQThCLElBQUksQ0FBa0I7Ozs7Ozs7Ozs7OztBQzNIdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRVosYUFBYSxtQkFBTyxDQUFDLHNEQUFXO0FBQ2hDLGNBQWMsbUJBQU8sQ0FBQyxnREFBUztBQUMvQixjQUFjLG1CQUFPLENBQUMsZ0RBQVM7O0FBRS9CLGNBQWM7QUFDZCxrQkFBa0I7QUFDbEIseUJBQXlCO0FBQ3pCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHFCQUFNO0FBQ25DLElBQUkscUJBQU07QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsb0NBQW9DO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxFQUFFO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsNkJBQTZCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0Esb0JBQW9CLGNBQWM7QUFDbEM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF3RCxPQUFPO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBd0QsT0FBTztBQUMvRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFlBQVk7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixnQkFBZ0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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Q0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixnREFBZ0Q7QUFDeEU7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixnREFBZ0Q7QUFDeEU7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtB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QTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBOEMsWUFBWTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQThDLFlBQVk7QUFDMUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUE4QyxZQUFZO0FBQzFEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBbUQsWUFBWTtBQUMvRDtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtEQUFrRCxZQUFZO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLG9DQUFvQyxZQUFZO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2Vycm9yLXN0YWNrLXBhcnNlci9lcnJvci1zdGFjay1wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvbm9kZV9tb2R1bGVzL3N0YWNrZnJhbWUvc3RhY2tmcmFtZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9pc2FycmF5L2luZGV4LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvYXBpVXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Jyb3dzZXIvdXJsLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvZXJyb3JQYXJzZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9tZXJnZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL25vdGlmaWVyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcHJlZGljYXRlcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3F1ZXVlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcmF0ZUxpbWl0ZXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9yZWFjdC1uYXRpdmUvbG9nZ2VyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcmVhY3QtbmF0aXZlL3JvbGxiYXIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9yZWFjdC1uYXRpdmUvdHJhbnNmb3Jtcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3JlYWN0LW5hdGl2ZS90cmFuc3BvcnQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9yb2xsYmFyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvc2NydWIuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90ZWxlbWV0cnkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90cmFuc2Zvcm1zLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJ1bmNhdGlvbi5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5L3RyYXZlcnNlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi92ZW5kb3IvSlNPTi1qcy9qc29uMy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JvbGxiYXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdGVzdC9yZWFjdC1uYXRpdmUucm9sbGJhci50ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG52YXIgcm9vdFBhcmVudCA9IHt9XG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gU2FmYXJpIDUtNyBsYWNrcyBzdXBwb3J0IGZvciBjaGFuZ2luZyB0aGUgYE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3JgIHByb3BlcnR5XG4gKiAgICAgb24gb2JqZWN0cy5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIGZ1bmN0aW9uIEJhciAoKSB7fVxuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgYXJyLmNvbnN0cnVjdG9yID0gQmFyXG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgYXJyLmNvbnN0cnVjdG9yID09PSBCYXIgJiYgLy8gY29uc3RydWN0b3IgY2FuIGJlIHNldFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChhcmcpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAvLyBBdm9pZCBnb2luZyB0aHJvdWdoIGFuIEFyZ3VtZW50c0FkYXB0b3JUcmFtcG9saW5lIGluIHRoZSBjb21tb24gY2FzZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHJldHVybiBuZXcgQnVmZmVyKGFyZywgYXJndW1lbnRzWzFdKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZylcbiAgfVxuXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmcm9tTnVtYmVyKHRoaXMsIGFyZylcbiAgfVxuXG4gIC8vIFNsaWdodGx5IGxlc3MgY29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoaXMsIGFyZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiAndXRmOCcpXG4gIH1cblxuICAvLyBVbnVzdWFsLlxuICByZXR1cm4gZnJvbU9iamVjdCh0aGlzLCBhcmcpXG59XG5cbmZ1bmN0aW9uIGZyb21OdW1iZXIgKHRoYXQsIGxlbmd0aCkge1xuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGxlbmd0aCkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgLy8gQXNzdW1wdGlvbjogYnl0ZUxlbmd0aCgpIHJldHVybiB2YWx1ZSBpcyBhbHdheXMgPCBrTWF4TGVuZ3RoLlxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcblxuICB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iamVjdCkpIHJldHVybiBmcm9tQnVmZmVyKHRoYXQsIG9iamVjdClcblxuICBpZiAoaXNBcnJheShvYmplY3QpKSByZXR1cm4gZnJvbUFycmF5KHRoYXQsIG9iamVjdClcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHN0YXJ0IHdpdGggbnVtYmVyLCBidWZmZXIsIGFycmF5IG9yIHN0cmluZycpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChvYmplY3QuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBmcm9tVHlwZWRBcnJheSh0aGF0LCBvYmplY3QpXG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCBvYmplY3QpXG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5sZW5ndGgpIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iamVjdClcblxuICByZXR1cm4gZnJvbUpzb25PYmplY3QodGhhdCwgb2JqZWN0KVxufVxuXG5mdW5jdGlvbiBmcm9tQnVmZmVyICh0aGF0LCBidWZmZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYnVmZmVyLmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGJ1ZmZlci5jb3B5KHRoYXQsIDAsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRHVwbGljYXRlIG9mIGZyb21BcnJheSgpIHRvIGtlZXAgZnJvbUFycmF5KCkgbW9ub21vcnBoaWMuXG5mdW5jdGlvbiBmcm9tVHlwZWRBcnJheSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgLy8gVHJ1bmNhdGluZyB0aGUgZWxlbWVudHMgaXMgcHJvYmFibHkgbm90IHdoYXQgcGVvcGxlIGV4cGVjdCBmcm9tIHR5cGVkXG4gIC8vIGFycmF5cyB3aXRoIEJZVEVTX1BFUl9FTEVNRU5UID4gMSBidXQgaXQncyBjb21wYXRpYmxlIHdpdGggdGhlIGJlaGF2aW9yXG4gIC8vIG9mIHRoZSBvbGQgQnVmZmVyIGNvbnN0cnVjdG9yLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBhcnJheS5ieXRlTGVuZ3RoXG4gICAgdGhhdCA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tVHlwZWRBcnJheSh0aGF0LCBuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8vIERlc2VyaWFsaXplIHsgdHlwZTogJ0J1ZmZlcicsIGRhdGE6IFsxLDIsMywuLi5dIH0gaW50byBhIEJ1ZmZlciBvYmplY3QuXG4vLyBSZXR1cm5zIGEgemVyby1sZW5ndGggYnVmZmVyIGZvciBpbnB1dHMgdGhhdCBkb24ndCBjb25mb3JtIHRvIHRoZSBzcGVjLlxuZnVuY3Rpb24gZnJvbUpzb25PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICB2YXIgYXJyYXlcbiAgdmFyIGxlbmd0aCA9IDBcblxuICBpZiAob2JqZWN0LnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqZWN0LmRhdGEpKSB7XG4gICAgYXJyYXkgPSBvYmplY3QuZGF0YVxuICAgIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgfVxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxufSBlbHNlIHtcbiAgLy8gcHJlLXNldCBmb3IgdmFsdWVzIHRoYXQgbWF5IGV4aXN0IGluIHRoZSBmdXR1cmVcbiAgQnVmZmVyLnByb3RvdHlwZS5sZW5ndGggPSB1bmRlZmluZWRcbiAgQnVmZmVyLnByb3RvdHlwZS5wYXJlbnQgPSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gYWxsb2NhdGUgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gICAgdGhhdC5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgZnJvbVBvb2wgPSBsZW5ndGggIT09IDAgJiYgbGVuZ3RoIDw9IEJ1ZmZlci5wb29sU2l6ZSA+Pj4gMVxuICBpZiAoZnJvbVBvb2wpIHRoYXQucGFyZW50ID0gcm9vdFBhcmVudFxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNsb3dCdWZmZXIpKSByZXR1cm4gbmV3IFNsb3dCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcpXG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGRlbGV0ZSBidWYucGFyZW50XG4gIHJldHVybiBidWZcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIHZhciBpID0gMFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkgYnJlYWtcblxuICAgICsraVxuICB9XG5cbiAgaWYgKGkgIT09IGxlbikge1xuICAgIHggPSBhW2ldXG4gICAgeSA9IGJbaV1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignbGlzdCBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHN0cmluZyA9ICcnICsgc3RyaW5nXG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAvLyBEZXByZWNhdGVkXG4gICAgICBjYXNlICdyYXcnOlxuICAgICAgY2FzZSAncmF3cyc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgc3RhcnQgPSBzdGFydCB8IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID09PSBJbmZpbml0eSA/IHRoaXMubGVuZ3RoIDogZW5kIHwgMFxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG4gIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmIChlbmQgPD0gc3RhcnQpIHJldHVybiAnJ1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGJpbmFyeVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gMFxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYilcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0KSB7XG4gIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgYnl0ZU9mZnNldCA+Pj0gMFxuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG4gIGlmIChieXRlT2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gLTFcblxuICAvLyBOZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoICsgYnl0ZU9mZnNldCwgMClcblxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xIC8vIHNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nIGFsd2F5cyBmYWlsc1xuICAgIHJldHVybiBTdHJpbmcucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gIH1cbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKHRoaXMsIFsgdmFsIF0sIGJ5dGVPZmZzZXQpXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0KSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAodmFyIGkgPSAwOyBieXRlT2Zmc2V0ICsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycltieXRlT2Zmc2V0ICsgaV0gPT09IHZhbFtmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleF0pIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWwubGVuZ3RoKSByZXR1cm4gYnl0ZU9mZnNldCArIGZvdW5kSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTFcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbi8vIGBnZXRgIGlzIGRlcHJlY2F0ZWRcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIGlzIGRlcHJlY2F0ZWRcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0ICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGggfCAwXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGJpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChuZXdCdWYubGVuZ3RoKSBuZXdCdWYucGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpc1xuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYnVmZmVyIG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gdmFsdWUgPCAwID8gMSA6IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0U3RhcnQpXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBSYW5nZUVycm9yKCdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IHZhbHVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IHV0ZjhUb0J5dGVzKHZhbHVlLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIHRvQXJyYXlCdWZmZXIgKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIH1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIF9hdWdtZW50IChhcnIpIHtcbiAgYXJyLmNvbnN0cnVjdG9yID0gQnVmZmVyXG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBzZXQgbWV0aG9kIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmVxdWFscyA9IEJQLmVxdWFsc1xuICBhcnIuY29tcGFyZSA9IEJQLmNvbXBhcmVcbiAgYXJyLmluZGV4T2YgPSBCUC5pbmRleE9mXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnRMRSA9IEJQLnJlYWRVSW50TEVcbiAgYXJyLnJlYWRVSW50QkUgPSBCUC5yZWFkVUludEJFXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludExFID0gQlAucmVhZEludExFXG4gIGFyci5yZWFkSW50QkUgPSBCUC5yZWFkSW50QkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50TEUgPSBCUC53cml0ZVVJbnRMRVxuICBhcnIud3JpdGVVSW50QkUgPSBCUC53cml0ZVVJbnRCRVxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50TEUgPSBCUC53cml0ZUludExFXG4gIGFyci53cml0ZUludEJFID0gQlAud3JpdGVJbnRCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnZXJyb3Itc3RhY2stcGFyc2VyJywgWydzdGFja2ZyYW1lJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdzdGFja2ZyYW1lJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRXJyb3JTdGFja1BhcnNlciA9IGZhY3Rvcnkocm9vdC5TdGFja0ZyYW1lKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIoU3RhY2tGcmFtZSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFAgPSAvKF58QClcXFMrOlxcZCsvO1xuICAgIHZhciBDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQID0gL15cXHMqYXQgLiooXFxTKzpcXGQrfFxcKG5hdGl2ZVxcKSkvbTtcbiAgICB2YXIgU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCA9IC9eKGV2YWxAKT8oXFxbbmF0aXZlIGNvZGVdKT8kLztcblxuICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiBhbiBFcnJvciBvYmplY3QsIGV4dHJhY3QgdGhlIG1vc3QgaW5mb3JtYXRpb24gZnJvbSBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3Igb2JqZWN0XG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBvZiBTdGFja0ZyYW1lc1xuICAgICAgICAgKi9cbiAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVycm9yLnN0YWNrdHJhY2UgIT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBlcnJvclsnb3BlcmEjc291cmNlbG9jJ10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrICYmIGVycm9yLnN0YWNrLm1hdGNoKENIUk9NRV9JRV9TVEFDS19SRUdFWFApKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VWOE9ySUUoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlRkZPclNhZmFyaShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHBhcnNlIGdpdmVuIEVycm9yIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFNlcGFyYXRlIGxpbmUgYW5kIGNvbHVtbiBudW1iZXJzIGZyb20gYSBzdHJpbmcgb2YgdGhlIGZvcm06IChVUkk6TGluZTpDb2x1bW4pXG4gICAgICAgIGV4dHJhY3RMb2NhdGlvbjogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkZXh0cmFjdExvY2F0aW9uKHVybExpa2UpIHtcbiAgICAgICAgICAgIC8vIEZhaWwtZmFzdCBidXQgcmV0dXJuIGxvY2F0aW9ucyBsaWtlIFwiKG5hdGl2ZSlcIlxuICAgICAgICAgICAgaWYgKHVybExpa2UuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbdXJsTGlrZV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZWdFeHAgPSAvKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLztcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlZ0V4cC5leGVjKHVybExpa2UucmVwbGFjZSgvWygpXS9nLCAnJykpO1xuICAgICAgICAgICAgcmV0dXJuIFtwYXJ0c1sxXSwgcGFydHNbMl0gfHwgdW5kZWZpbmVkLCBwYXJ0c1szXSB8fCB1bmRlZmluZWRdO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlVjhPcklFOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZVY4T3JJRShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCcoZXZhbCAnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRocm93IGF3YXkgZXZhbCBpbmZvcm1hdGlvbiB1bnRpbCB3ZSBpbXBsZW1lbnQgc3RhY2t0cmFjZS5qcy9zdGFja2ZyYW1lIzhcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvZXZhbCBjb2RlL2csICdldmFsJykucmVwbGFjZSgvKFxcKGV2YWwgYXQgW14oKV0qKXwoXFwpLC4qJCkvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgc2FuaXRpemVkTGluZSA9IGxpbmUucmVwbGFjZSgvXlxccysvLCAnJykucmVwbGFjZSgvXFwoZXZhbCBjb2RlL2csICcoJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYXB0dXJlIGFuZCBwcmVzZXZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIFwiKC9mb28vbXkgYmFyLmpzOjEyOjg3KVwiIGluXG4gICAgICAgICAgICAgICAgLy8gY2FzZSBpdCBoYXMgc3BhY2VzIGluIGl0LCBhcyB0aGUgc3RyaW5nIGlzIHNwbGl0IG9uIFxccysgbGF0ZXIgb25cbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBzYW5pdGl6ZWRMaW5lLm1hdGNoKC8gKFxcKCguKyk6KFxcZCspOihcXGQrKVxcKSQpLyk7XG5cbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHBhcmVudGhlc2l6ZWQgbG9jYXRpb24gZnJvbSB0aGUgbGluZSwgaWYgaXQgd2FzIG1hdGNoZWRcbiAgICAgICAgICAgICAgICBzYW5pdGl6ZWRMaW5lID0gbG9jYXRpb24gPyBzYW5pdGl6ZWRMaW5lLnJlcGxhY2UobG9jYXRpb25bMF0sICcnKSA6IHNhbml0aXplZExpbmU7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gc2FuaXRpemVkTGluZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGEgbG9jYXRpb24gd2FzIG1hdGNoZWQsIHBhc3MgaXQgdG8gZXh0cmFjdExvY2F0aW9uKCkgb3RoZXJ3aXNlIHBvcCB0aGUgbGFzdCB0b2tlblxuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24obG9jYXRpb24gPyBsb2NhdGlvblsxXSA6IHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRva2Vucy5qb2luKCcgJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IFsnZXZhbCcsICc8YW5vbnltb3VzPiddLmluZGV4T2YobG9jYXRpb25QYXJ0c1swXSkgPiAtMSA/IHVuZGVmaW5lZCA6IGxvY2F0aW9uUGFydHNbMF07XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VGRk9yU2FmYXJpOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZUZGT3JTYWZhcmkoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhbGluZS5tYXRjaChTQUZBUklfTkFUSVZFX0NPREVfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyZWQubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignID4gZXZhbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvIGxpbmUgKFxcZCspKD86ID4gZXZhbCBsaW5lIFxcZCspKiA+IGV2YWw6XFxkKzpcXGQrL2csICc6JDEnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCdAJykgPT09IC0xICYmIGxpbmUuaW5kZXhPZignOicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkgZXZhbCBmcmFtZXMgb25seSBoYXZlIGZ1bmN0aW9uIG5hbWVzIGFuZCBub3RoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbGluZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lUmVnZXggPSAvKCguKlwiLitcIlteQF0qKT9bXkBdKikoPzpAKS87XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbGluZS5tYXRjaChmdW5jdGlvbk5hbWVSZWdleCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBtYXRjaGVzICYmIG1hdGNoZXNbMV0gPyBtYXRjaGVzWzFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKGxpbmUucmVwbGFjZShmdW5jdGlvbk5hbWVSZWdleCwgJycpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxvY2F0aW9uUGFydHNbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYShlKSB7XG4gICAgICAgICAgICBpZiAoIWUuc3RhY2t0cmFjZSB8fCAoZS5tZXNzYWdlLmluZGV4T2YoJ1xcbicpID4gLTEgJiZcbiAgICAgICAgICAgICAgICBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJykubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmE5KGUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghZS5zdGFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMChlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VPcGVyYTExKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE5OiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhOShlKSB7XG4gICAgICAgICAgICB2YXIgbGluZVJFID0gL0xpbmUgKFxcZCspLipzY3JpcHQgKD86aW4gKT8oXFxTKykvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUubWVzc2FnZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAyLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbWF0Y2hbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTEwOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTAoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspKD86OiBJbiBmdW5jdGlvbiAoXFxTKykpPyQvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBtYXRjaFszXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZXNbaV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE9wZXJhIDEwLjY1KyBFcnJvci5zdGFjayB2ZXJ5IHNpbWlsYXIgdG8gRkYvU2FmYXJpXG4gICAgICAgIHBhcnNlT3BlcmExMTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTExKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCkgJiYgIWxpbmUubWF0Y2goL15FcnJvciBjcmVhdGVkIGF0Lyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IGxpbmUuc3BsaXQoJ0AnKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uQ2FsbCA9ICh0b2tlbnMuc2hpZnQoKSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IGZ1bmN0aW9uQ2FsbFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPGFub255bW91cyBmdW5jdGlvbig6IChcXHcrKSk/Pi8sICckMicpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXChbXildKlxcKS9nLCAnJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzUmF3O1xuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkNhbGwubWF0Y2goL1xcKChbXildKilcXCkvKSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzUmF3ID0gZnVuY3Rpb25DYWxsLnJlcGxhY2UoL15bXihdK1xcKChbXildKilcXCkkLywgJyQxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gKGFyZ3NSYXcgPT09IHVuZGVmaW5lZCB8fCBhcmdzUmF3ID09PSAnW2FyZ3VtZW50cyBub3QgYXZhaWxhYmxlXScpID9cbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDogYXJnc1Jhdy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5OdW1iZXI6IGxvY2F0aW9uUGFydHNbMl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbGluZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufSkpO1xuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnc3RhY2tmcmFtZScsIFtdLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LlN0YWNrRnJhbWUgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgZnVuY3Rpb24gX2lzTnVtYmVyKG4pIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY2FwaXRhbGl6ZShzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2dldHRlcihwKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3BdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBib29sZWFuUHJvcHMgPSBbJ2lzQ29uc3RydWN0b3InLCAnaXNFdmFsJywgJ2lzTmF0aXZlJywgJ2lzVG9wbGV2ZWwnXTtcbiAgICB2YXIgbnVtZXJpY1Byb3BzID0gWydjb2x1bW5OdW1iZXInLCAnbGluZU51bWJlciddO1xuICAgIHZhciBzdHJpbmdQcm9wcyA9IFsnZmlsZU5hbWUnLCAnZnVuY3Rpb25OYW1lJywgJ3NvdXJjZSddO1xuICAgIHZhciBhcnJheVByb3BzID0gWydhcmdzJ107XG4gICAgdmFyIG9iamVjdFByb3BzID0gWydldmFsT3JpZ2luJ107XG5cbiAgICB2YXIgcHJvcHMgPSBib29sZWFuUHJvcHMuY29uY2F0KG51bWVyaWNQcm9wcywgc3RyaW5nUHJvcHMsIGFycmF5UHJvcHMsIG9iamVjdFByb3BzKTtcblxuICAgIGZ1bmN0aW9uIFN0YWNrRnJhbWUob2JqKSB7XG4gICAgICAgIGlmICghb2JqKSByZXR1cm47XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvYmpbcHJvcHNbaV1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzWydzZXQnICsgX2NhcGl0YWxpemUocHJvcHNbaV0pXShvYmpbcHJvcHNbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIFN0YWNrRnJhbWUucHJvdG90eXBlID0ge1xuICAgICAgICBnZXRBcmdzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEFyZ3M6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodikgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmdzIG11c3QgYmUgYW4gQXJyYXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXJncyA9IHY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0RXZhbE9yaWdpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsT3JpZ2luO1xuICAgICAgICB9LFxuICAgICAgICBzZXRFdmFsT3JpZ2luOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBpZiAodiBpbnN0YW5jZW9mIFN0YWNrRnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2YWxPcmlnaW4gPSB2O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsT3JpZ2luID0gbmV3IFN0YWNrRnJhbWUodik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V2YWwgT3JpZ2luIG11c3QgYmUgYW4gT2JqZWN0IG9yIFN0YWNrRnJhbWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSB0aGlzLmdldEZpbGVOYW1lKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IHRoaXMuZ2V0TGluZU51bWJlcigpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IHRoaXMuZ2V0Q29sdW1uTnVtYmVyKCkgfHwgJyc7XG4gICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdGhpcy5nZXRGdW5jdGlvbk5hbWUoKSB8fCAnJztcbiAgICAgICAgICAgIGlmICh0aGlzLmdldElzRXZhbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnW2V2YWxdICgnICsgZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyICsgJyknO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gJ1tldmFsXTonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb25OYW1lICsgJyAoJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlciArICcpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU3RhY2tGcmFtZS5mcm9tU3RyaW5nID0gZnVuY3Rpb24gU3RhY2tGcmFtZSQkZnJvbVN0cmluZyhzdHIpIHtcbiAgICAgICAgdmFyIGFyZ3NTdGFydEluZGV4ID0gc3RyLmluZGV4T2YoJygnKTtcbiAgICAgICAgdmFyIGFyZ3NFbmRJbmRleCA9IHN0ci5sYXN0SW5kZXhPZignKScpO1xuXG4gICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBzdHIuc3Vic3RyaW5nKDAsIGFyZ3NTdGFydEluZGV4KTtcbiAgICAgICAgdmFyIGFyZ3MgPSBzdHIuc3Vic3RyaW5nKGFyZ3NTdGFydEluZGV4ICsgMSwgYXJnc0VuZEluZGV4KS5zcGxpdCgnLCcpO1xuICAgICAgICB2YXIgbG9jYXRpb25TdHJpbmcgPSBzdHIuc3Vic3RyaW5nKGFyZ3NFbmRJbmRleCArIDEpO1xuXG4gICAgICAgIGlmIChsb2NhdGlvblN0cmluZy5pbmRleE9mKCdAJykgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IC9AKC4rPykoPzo6KFxcZCspKT8oPzo6KFxcZCspKT8kLy5leGVjKGxvY2F0aW9uU3RyaW5nLCAnJyk7XG4gICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gcGFydHNbMl07XG4gICAgICAgICAgICB2YXIgY29sdW1uTnVtYmVyID0gcGFydHNbM107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICBhcmdzOiBhcmdzIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSxcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXIgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBjb2x1bW5OdW1iZXIgfHwgdW5kZWZpbmVkXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvb2xlYW5Qcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKGJvb2xlYW5Qcm9wc1tpXSldID0gX2dldHRlcihib29sZWFuUHJvcHNbaV0pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKGJvb2xlYW5Qcm9wc1tpXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IEJvb2xlYW4odik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShib29sZWFuUHJvcHNbaV0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtZXJpY1Byb3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydnZXQnICsgX2NhcGl0YWxpemUobnVtZXJpY1Byb3BzW2pdKV0gPSBfZ2V0dGVyKG51bWVyaWNQcm9wc1tqXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUobnVtZXJpY1Byb3BzW2pdKV0gPSAoZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9pc051bWJlcih2KSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHAgKyAnIG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IE51bWJlcih2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKG51bWVyaWNQcm9wc1tqXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayA9IDA7IGsgPCBzdHJpbmdQcm9wcy5sZW5ndGg7IGsrKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKHN0cmluZ1Byb3BzW2tdKV0gPSBfZ2V0dGVyKHN0cmluZ1Byb3BzW2tdKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShzdHJpbmdQcm9wc1trXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdGhpc1twXSA9IFN0cmluZyh2KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKHN0cmluZ1Byb3BzW2tdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RhY2tGcmFtZTtcbn0pKTtcbiIsIi8qISBpZWVlNzU0LiBCU0QtMy1DbGF1c2UgTGljZW5zZS4gRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnL29wZW5zb3VyY2U+ICovXG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbVxuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IChlICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IChtICogMjU2KSArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhc1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSlcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pXG4gICAgZSA9IGUgLSBlQmlhc1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pXG59XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbiAoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGNcbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKCh2YWx1ZSAqIGMpIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgaGVscGVycyA9IHJlcXVpcmUoJy4vYXBpVXRpbGl0eScpO1xuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgcGF0aDogJy9hcGkvMS9pdGVtLycsXG4gIHNlYXJjaDogbnVsbCxcbiAgdmVyc2lvbjogJzEnLFxuICBwcm90b2NvbDogJ2h0dHBzOicsXG4gIHBvcnQ6IDQ0Myxcbn07XG5cbnZhciBPVExQRGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvc3RuYW1lOiAnYXBpLnJvbGxiYXIuY29tJyxcbiAgcGF0aDogJy9hcGkvMS9zZXNzaW9uLycsXG4gIHNlYXJjaDogbnVsbCxcbiAgdmVyc2lvbjogJzEnLFxuICBwcm90b2NvbDogJ2h0dHBzOicsXG4gIHBvcnQ6IDQ0Myxcbn07XG5cbi8qKlxuICogQXBpIGlzIGFuIG9iamVjdCB0aGF0IGVuY2Fwc3VsYXRlcyBtZXRob2RzIG9mIGNvbW11bmljYXRpbmcgd2l0aFxuICogdGhlIFJvbGxiYXIgQVBJLiAgSXQgaXMgYSBzdGFuZGFyZCBpbnRlcmZhY2Ugd2l0aCBzb21lIHBhcnRzIGltcGxlbWVudGVkXG4gKiBkaWZmZXJlbnRseSBmb3Igc2VydmVyIG9yIGJyb3dzZXIgY29udGV4dHMuICBJdCBpcyBhbiBvYmplY3QgdGhhdCBzaG91bGRcbiAqIGJlIGluc3RhbnRpYXRlZCB3aGVuIHVzZWQgc28gaXQgY2FuIGNvbnRhaW4gbm9uLWdsb2JhbCBvcHRpb25zIHRoYXQgbWF5XG4gKiBiZSBkaWZmZXJlbnQgZm9yIGFub3RoZXIgaW5zdGFuY2Ugb2YgUm9sbGJhckFwaS5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyB7XG4gKiAgICBhY2Nlc3NUb2tlbjogdGhlIGFjY2Vzc1Rva2VuIHRvIHVzZSBmb3IgcG9zdGluZyBpdGVtcyB0byByb2xsYmFyXG4gKiAgICBlbmRwb2ludDogYW4gYWx0ZXJuYXRpdmUgZW5kcG9pbnQgdG8gc2VuZCBlcnJvcnMgdG9cbiAqICAgICAgICBtdXN0IGJlIGEgdmFsaWQsIGZ1bGx5IHF1YWxpZmllZCBVUkwuXG4gKiAgICAgICAgVGhlIGRlZmF1bHQgaXM6IGh0dHBzOi8vYXBpLnJvbGxiYXIuY29tL2FwaS8xL2l0ZW1cbiAqICAgIHByb3h5OiBpZiB5b3Ugd2lzaCB0byBwcm94eSByZXF1ZXN0cyBwcm92aWRlIGFuIG9iamVjdFxuICogICAgICAgIHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICogICAgICAgICAgaG9zdCBvciBob3N0bmFtZSAocmVxdWlyZWQpOiBmb28uZXhhbXBsZS5jb21cbiAqICAgICAgICAgIHBvcnQgKG9wdGlvbmFsKTogMTIzXG4gKiAgICAgICAgICBwcm90b2NvbCAob3B0aW9uYWwpOiBodHRwc1xuICogfVxuICovXG5mdW5jdGlvbiBBcGkob3B0aW9ucywgdHJhbnNwb3J0LCB1cmxsaWIsIHRydW5jYXRpb24pIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy50cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG4gIHRoaXMudXJsID0gdXJsbGliO1xuICB0aGlzLnRydW5jYXRpb24gPSB0cnVuY2F0aW9uO1xuICB0aGlzLmFjY2Vzc1Rva2VuID0gb3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgdGhpcy50cmFuc3BvcnRPcHRpb25zID0gX2dldFRyYW5zcG9ydChvcHRpb25zLCB1cmxsaWIpO1xuICB0aGlzLk9UTFBUcmFuc3BvcnRPcHRpb25zID0gX2dldE9UTFBUcmFuc3BvcnQob3B0aW9ucywgdXJsbGliKTtcbn1cblxuLyoqXG4gKiBXcmFwcyB0cmFuc3BvcnQucG9zdCBpbiBhIFByb21pc2UgdG8gc3VwcG9ydCBhc3luYy9hd2FpdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIEFQSSByZXF1ZXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5hY2Nlc3NUb2tlbiAtIFRoZSBhY2Nlc3MgdG9rZW4gZm9yIGF1dGhlbnRpY2F0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy50cmFuc3BvcnRPcHRpb25zIC0gT3B0aW9ucyBmb3IgdGhlIHRyYW5zcG9ydFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMucGF5bG9hZCAtIFRoZSBkYXRhIHBheWxvYWQgdG8gc2VuZFxuICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIHJlc3BvbnNlIG9yIHJlamVjdHMgd2l0aCBhbiBlcnJvclxuICogQHByaXZhdGVcbiAqL1xuQXBpLnByb3RvdHlwZS5fcG9zdFByb21pc2UgPSBmdW5jdGlvbih7IGFjY2Vzc1Rva2VuLCB0cmFuc3BvcnRPcHRpb25zLCBwYXlsb2FkIH0pIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgc2VsZi50cmFuc3BvcnQucG9zdChhY2Nlc3NUb2tlbiwgdHJhbnNwb3J0T3B0aW9ucywgcGF5bG9hZCwgKGVyciwgcmVzcCkgPT5cbiAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShyZXNwKVxuICAgICk7XG4gIH0pO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLnBvc3RJdGVtID0gZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gIHZhciB0cmFuc3BvcnRPcHRpb25zID0gaGVscGVycy50cmFuc3BvcnRPcHRpb25zKFxuICAgIHRoaXMudHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG4gIHZhciBwYXlsb2FkID0gaGVscGVycy5idWlsZFBheWxvYWQoZGF0YSk7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBlbnN1cmUgdGhlIG5ldHdvcmsgcmVxdWVzdCBpcyBzY2hlZHVsZWQgYWZ0ZXIgdGhlIGN1cnJlbnQgdGljay5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi50cmFuc3BvcnQucG9zdChzZWxmLmFjY2Vzc1Rva2VuLCB0cmFuc3BvcnRPcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjayk7XG4gIH0sIDApO1xufTtcblxuLyoqXG4gKiBQb3N0cyBzcGFucyB0byB0aGUgUm9sbGJhciBBUEkgdXNpbmcgdGhlIHNlc3Npb24gZW5kcG9pbnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXlsb2FkIC0gVGhlIHNwYW5zIHRvIHNlbmRcbiAqIEByZXR1cm5zIHtQcm9taXNlPE9iamVjdD59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggdGhlIEFQSSByZXNwb25zZVxuICovXG5BcGkucHJvdG90eXBlLnBvc3RTcGFucyA9IGFzeW5jIGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gIGNvbnN0IHRyYW5zcG9ydE9wdGlvbnMgPSBoZWxwZXJzLnRyYW5zcG9ydE9wdGlvbnMoXG4gICAgdGhpcy5PVExQVHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG5cbiAgcmV0dXJuIGF3YWl0IHRoaXMuX3Bvc3RQcm9taXNlKHtcbiAgICBhY2Nlc3NUb2tlbjogdGhpcy5hY2Nlc3NUb2tlbixcbiAgICB0cmFuc3BvcnRPcHRpb25zLFxuICAgIHBheWxvYWRcbiAgfSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gZGF0YVxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbkFwaS5wcm90b3R5cGUuYnVpbGRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgcGF5bG9hZCA9IGhlbHBlcnMuYnVpbGRQYXlsb2FkKGRhdGEpO1xuXG4gIHZhciBzdHJpbmdpZnlSZXN1bHQ7XG4gIGlmICh0aGlzLnRydW5jYXRpb24pIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSB0aGlzLnRydW5jYXRpb24udHJ1bmNhdGUocGF5bG9hZCk7XG4gIH0gZWxzZSB7XG4gICAgc3RyaW5naWZ5UmVzdWx0ID0gXy5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH1cblxuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhzdHJpbmdpZnlSZXN1bHQuZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBzdHJpbmdpZnlSZXN1bHQudmFsdWU7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ganNvblBheWxvYWRcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLnBvc3RKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChqc29uUGF5bG9hZCwgY2FsbGJhY2spIHtcbiAgdmFyIHRyYW5zcG9ydE9wdGlvbnMgPSBoZWxwZXJzLnRyYW5zcG9ydE9wdGlvbnMoXG4gICAgdGhpcy50cmFuc3BvcnRPcHRpb25zLFxuICAgICdQT1NUJyxcbiAgKTtcbiAgdGhpcy50cmFuc3BvcnQucG9zdEpzb25QYXlsb2FkKFxuICAgIHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgdHJhbnNwb3J0T3B0aW9ucyxcbiAgICBqc29uUGF5bG9hZCxcbiAgICBjYWxsYmFjayxcbiAgKTtcbn07XG5cbkFwaS5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9sZE9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHRoaXMudHJhbnNwb3J0T3B0aW9ucyA9IF9nZXRUcmFuc3BvcnQodGhpcy5vcHRpb25zLCB0aGlzLnVybCk7XG4gIHRoaXMuT1RMUFRyYW5zcG9ydE9wdGlvbnMgPSBfZ2V0T1RMUFRyYW5zcG9ydCh0aGlzLm9wdGlvbnMsIHRoaXMudXJsKTtcbiAgaWYgKHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5hY2Nlc3NUb2tlbiA9IHRoaXMub3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uIF9nZXRUcmFuc3BvcnQob3B0aW9ucywgdXJsKSB7XG4gIHJldHVybiBoZWxwZXJzLmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCB1cmwpO1xufVxuXG5mdW5jdGlvbiBfZ2V0T1RMUFRyYW5zcG9ydChvcHRpb25zLCB1cmwpIHtcbiAgb3B0aW9ucyA9IHsuLi5vcHRpb25zLCBlbmRwb2ludDogb3B0aW9ucy50cmFjaW5nPy5lbmRwb2ludH07XG4gIHJldHVybiBoZWxwZXJzLmdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIE9UTFBEZWZhdWx0T3B0aW9ucywgdXJsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBBcGk7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBidWlsZFBheWxvYWQoZGF0YSkge1xuICBpZiAoIV8uaXNUeXBlKGRhdGEuY29udGV4dCwgJ3N0cmluZycpKSB7XG4gICAgdmFyIGNvbnRleHRSZXN1bHQgPSBfLnN0cmluZ2lmeShkYXRhLmNvbnRleHQpO1xuICAgIGlmIChjb250ZXh0UmVzdWx0LmVycm9yKSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBcIkVycm9yOiBjb3VsZCBub3Qgc2VyaWFsaXplICdjb250ZXh0J1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmNvbnRleHQgPSBjb250ZXh0UmVzdWx0LnZhbHVlIHx8ICcnO1xuICAgIH1cbiAgICBpZiAoZGF0YS5jb250ZXh0Lmxlbmd0aCA+IDI1NSkge1xuICAgICAgZGF0YS5jb250ZXh0ID0gZGF0YS5jb250ZXh0LnN1YnN0cigwLCAyNTUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIGRhdGE6IGRhdGEsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFRyYW5zcG9ydEZyb21PcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzLCB1cmwpIHtcbiAgdmFyIGhvc3RuYW1lID0gZGVmYXVsdHMuaG9zdG5hbWU7XG4gIHZhciBwcm90b2NvbCA9IGRlZmF1bHRzLnByb3RvY29sO1xuICB2YXIgcG9ydCA9IGRlZmF1bHRzLnBvcnQ7XG4gIHZhciBwYXRoID0gZGVmYXVsdHMucGF0aDtcbiAgdmFyIHNlYXJjaCA9IGRlZmF1bHRzLnNlYXJjaDtcbiAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQ7XG4gIHZhciB0cmFuc3BvcnQgPSBkZXRlY3RUcmFuc3BvcnQob3B0aW9ucyk7XG5cbiAgdmFyIHByb3h5ID0gb3B0aW9ucy5wcm94eTtcbiAgaWYgKG9wdGlvbnMuZW5kcG9pbnQpIHtcbiAgICB2YXIgb3B0cyA9IHVybC5wYXJzZShvcHRpb25zLmVuZHBvaW50KTtcbiAgICBob3N0bmFtZSA9IG9wdHMuaG9zdG5hbWU7XG4gICAgcHJvdG9jb2wgPSBvcHRzLnByb3RvY29sO1xuICAgIHBvcnQgPSBvcHRzLnBvcnQ7XG4gICAgcGF0aCA9IG9wdHMucGF0aG5hbWU7XG4gICAgc2VhcmNoID0gb3B0cy5zZWFyY2g7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgIGhvc3RuYW1lOiBob3N0bmFtZSxcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgcG9ydDogcG9ydCxcbiAgICBwYXRoOiBwYXRoLFxuICAgIHNlYXJjaDogc2VhcmNoLFxuICAgIHByb3h5OiBwcm94eSxcbiAgICB0cmFuc3BvcnQ6IHRyYW5zcG9ydCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZGV0ZWN0VHJhbnNwb3J0KG9wdGlvbnMpIHtcbiAgdmFyIGdXaW5kb3cgPVxuICAgICh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdykgfHxcbiAgICAodHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZik7XG4gIHZhciB0cmFuc3BvcnQgPSBvcHRpb25zLmRlZmF1bHRUcmFuc3BvcnQgfHwgJ3hocic7XG4gIGlmICh0eXBlb2YgZ1dpbmRvdy5mZXRjaCA9PT0gJ3VuZGVmaW5lZCcpIHRyYW5zcG9ydCA9ICd4aHInO1xuICBpZiAodHlwZW9mIGdXaW5kb3cuWE1MSHR0cFJlcXVlc3QgPT09ICd1bmRlZmluZWQnKSB0cmFuc3BvcnQgPSAnZmV0Y2gnO1xuICByZXR1cm4gdHJhbnNwb3J0O1xufVxuXG5mdW5jdGlvbiB0cmFuc3BvcnRPcHRpb25zKHRyYW5zcG9ydCwgbWV0aG9kKSB7XG4gIHZhciBwcm90b2NvbCA9IHRyYW5zcG9ydC5wcm90b2NvbCB8fCAnaHR0cHM6JztcbiAgdmFyIHBvcnQgPVxuICAgIHRyYW5zcG9ydC5wb3J0IHx8XG4gICAgKHByb3RvY29sID09PSAnaHR0cDonID8gODAgOiBwcm90b2NvbCA9PT0gJ2h0dHBzOicgPyA0NDMgOiB1bmRlZmluZWQpO1xuICB2YXIgaG9zdG5hbWUgPSB0cmFuc3BvcnQuaG9zdG5hbWU7XG4gIHZhciBwYXRoID0gdHJhbnNwb3J0LnBhdGg7XG4gIHZhciB0aW1lb3V0ID0gdHJhbnNwb3J0LnRpbWVvdXQ7XG4gIHZhciB0cmFuc3BvcnRBUEkgPSB0cmFuc3BvcnQudHJhbnNwb3J0O1xuICBpZiAodHJhbnNwb3J0LnNlYXJjaCkge1xuICAgIHBhdGggPSBwYXRoICsgdHJhbnNwb3J0LnNlYXJjaDtcbiAgfVxuICBpZiAodHJhbnNwb3J0LnByb3h5KSB7XG4gICAgcGF0aCA9IHByb3RvY29sICsgJy8vJyArIGhvc3RuYW1lICsgcGF0aDtcbiAgICBob3N0bmFtZSA9IHRyYW5zcG9ydC5wcm94eS5ob3N0IHx8IHRyYW5zcG9ydC5wcm94eS5ob3N0bmFtZTtcbiAgICBwb3J0ID0gdHJhbnNwb3J0LnByb3h5LnBvcnQ7XG4gICAgcHJvdG9jb2wgPSB0cmFuc3BvcnQucHJveHkucHJvdG9jb2wgfHwgcHJvdG9jb2w7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgIHByb3RvY29sOiBwcm90b2NvbCxcbiAgICBob3N0bmFtZTogaG9zdG5hbWUsXG4gICAgcGF0aDogcGF0aCxcbiAgICBwb3J0OiBwb3J0LFxuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIHRyYW5zcG9ydDogdHJhbnNwb3J0QVBJLFxuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmRQYXRoVG9QYXRoKGJhc2UsIHBhdGgpIHtcbiAgdmFyIGJhc2VUcmFpbGluZ1NsYXNoID0gL1xcLyQvLnRlc3QoYmFzZSk7XG4gIHZhciBwYXRoQmVnaW5uaW5nU2xhc2ggPSAvXlxcLy8udGVzdChwYXRoKTtcblxuICBpZiAoYmFzZVRyYWlsaW5nU2xhc2ggJiYgcGF0aEJlZ2lubmluZ1NsYXNoKSB7XG4gICAgcGF0aCA9IHBhdGguc3Vic3RyaW5nKDEpO1xuICB9IGVsc2UgaWYgKCFiYXNlVHJhaWxpbmdTbGFzaCAmJiAhcGF0aEJlZ2lubmluZ1NsYXNoKSB7XG4gICAgcGF0aCA9ICcvJyArIHBhdGg7XG4gIH1cblxuICByZXR1cm4gYmFzZSArIHBhdGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBidWlsZFBheWxvYWQ6IGJ1aWxkUGF5bG9hZCxcbiAgZ2V0VHJhbnNwb3J0RnJvbU9wdGlvbnM6IGdldFRyYW5zcG9ydEZyb21PcHRpb25zLFxuICB0cmFuc3BvcnRPcHRpb25zOiB0cmFuc3BvcnRPcHRpb25zLFxuICBhcHBlbmRQYXRoVG9QYXRoOiBhcHBlbmRQYXRoVG9QYXRoLFxufTtcbiIsIi8vIFNlZSBodHRwczovL25vZGVqcy5vcmcvZG9jcy9sYXRlc3QvYXBpL3VybC5odG1sXG5mdW5jdGlvbiBwYXJzZSh1cmwpIHtcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICBwcm90b2NvbDogbnVsbCxcbiAgICBhdXRoOiBudWxsLFxuICAgIGhvc3Q6IG51bGwsXG4gICAgcGF0aDogbnVsbCxcbiAgICBoYXNoOiBudWxsLFxuICAgIGhyZWY6IHVybCxcbiAgICBob3N0bmFtZTogbnVsbCxcbiAgICBwb3J0OiBudWxsLFxuICAgIHBhdGhuYW1lOiBudWxsLFxuICAgIHNlYXJjaDogbnVsbCxcbiAgICBxdWVyeTogbnVsbCxcbiAgfTtcblxuICB2YXIgaSwgbGFzdDtcbiAgaSA9IHVybC5pbmRleE9mKCcvLycpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQucHJvdG9jb2wgPSB1cmwuc3Vic3RyaW5nKDAsIGkpO1xuICAgIGxhc3QgPSBpICsgMjtcbiAgfSBlbHNlIHtcbiAgICBsYXN0ID0gMDtcbiAgfVxuXG4gIGkgPSB1cmwuaW5kZXhPZignQCcsIGxhc3QpO1xuICBpZiAoaSAhPT0gLTEpIHtcbiAgICByZXN1bHQuYXV0aCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgbGFzdCA9IGkgKyAxO1xuICB9XG5cbiAgaSA9IHVybC5pbmRleE9mKCcvJywgbGFzdCk7XG4gIGlmIChpID09PSAtMSkge1xuICAgIGkgPSB1cmwuaW5kZXhPZignPycsIGxhc3QpO1xuICAgIGlmIChpID09PSAtMSkge1xuICAgICAgaSA9IHVybC5pbmRleE9mKCcjJywgbGFzdCk7XG4gICAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lmhvc3QgPSB1cmwuc3Vic3RyaW5nKGxhc3QsIGkpO1xuICAgICAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gICAgICB9XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgICAgcmVzdWx0LnBvcnQgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICAgIHJlc3VsdC5ob3N0bmFtZSA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMF07XG4gICAgICByZXN1bHQucG9ydCA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMV07XG4gICAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgICAgcmVzdWx0LnBvcnQgPSBwYXJzZUludChyZXN1bHQucG9ydCwgMTApO1xuICAgICAgfVxuICAgICAgbGFzdCA9IGk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgIHJlc3VsdC5wb3J0ID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVsxXTtcbiAgICBpZiAocmVzdWx0LnBvcnQpIHtcbiAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICB9XG4gICAgbGFzdCA9IGk7XG4gIH1cblxuICBpID0gdXJsLmluZGV4T2YoJyMnLCBsYXN0KTtcbiAgaWYgKGkgPT09IC0xKSB7XG4gICAgcmVzdWx0LnBhdGggPSB1cmwuc3Vic3RyaW5nKGxhc3QpO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdC5wYXRoID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICByZXN1bHQuaGFzaCA9IHVybC5zdWJzdHJpbmcoaSk7XG4gIH1cblxuICBpZiAocmVzdWx0LnBhdGgpIHtcbiAgICB2YXIgcGF0aFBhcnRzID0gcmVzdWx0LnBhdGguc3BsaXQoJz8nKTtcbiAgICByZXN1bHQucGF0aG5hbWUgPSBwYXRoUGFydHNbMF07XG4gICAgcmVzdWx0LnF1ZXJ5ID0gcGF0aFBhcnRzWzFdO1xuICAgIHJlc3VsdC5zZWFyY2ggPSByZXN1bHQucXVlcnkgPyAnPycgKyByZXN1bHQucXVlcnkgOiBudWxsO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYXJzZTogcGFyc2UsXG59O1xuIiwidmFyIEVycm9yU3RhY2tQYXJzZXIgPSByZXF1aXJlKCdlcnJvci1zdGFjay1wYXJzZXInKTtcblxudmFyIFVOS05PV05fRlVOQ1RJT04gPSAnPyc7XG52YXIgRVJSX0NMQVNTX1JFR0VYUCA9IG5ldyBSZWdFeHAoXG4gICdeKChbYS16QS1aMC05LV8kIF0qKTogKik/KFVuY2F1Z2h0ICk/KFthLXpBLVowLTktXyQgXSopOiAnLFxuKTtcblxuZnVuY3Rpb24gZ3Vlc3NGdW5jdGlvbk5hbWUoKSB7XG4gIHJldHVybiBVTktOT1dOX0ZVTkNUSU9OO1xufVxuXG5mdW5jdGlvbiBnYXRoZXJDb250ZXh0KCkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gRnJhbWUoc3RhY2tGcmFtZSkge1xuICB2YXIgZGF0YSA9IHt9O1xuXG4gIGRhdGEuX3N0YWNrRnJhbWUgPSBzdGFja0ZyYW1lO1xuXG4gIGRhdGEudXJsID0gc3RhY2tGcmFtZS5maWxlTmFtZTtcbiAgZGF0YS5saW5lID0gc3RhY2tGcmFtZS5saW5lTnVtYmVyO1xuICBkYXRhLmZ1bmMgPSBzdGFja0ZyYW1lLmZ1bmN0aW9uTmFtZTtcbiAgZGF0YS5jb2x1bW4gPSBzdGFja0ZyYW1lLmNvbHVtbk51bWJlcjtcbiAgZGF0YS5hcmdzID0gc3RhY2tGcmFtZS5hcmdzO1xuXG4gIGRhdGEuY29udGV4dCA9IGdhdGhlckNvbnRleHQoKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gU3RhY2soZXhjZXB0aW9uLCBza2lwKSB7XG4gIGZ1bmN0aW9uIGdldFN0YWNrKCkge1xuICAgIHZhciBwYXJzZXJTdGFjayA9IFtdO1xuXG4gICAgc2tpcCA9IHNraXAgfHwgMDtcblxuICAgIHRyeSB7XG4gICAgICBwYXJzZXJTdGFjayA9IEVycm9yU3RhY2tQYXJzZXIucGFyc2UoZXhjZXB0aW9uKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBwYXJzZXJTdGFjayA9IFtdO1xuICAgIH1cblxuICAgIHZhciBzdGFjayA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IHNraXA7IGkgPCBwYXJzZXJTdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhY2sucHVzaChuZXcgRnJhbWUocGFyc2VyU3RhY2tbaV0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhY2s7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YWNrOiBnZXRTdGFjaygpLFxuICAgIG1lc3NhZ2U6IGV4Y2VwdGlvbi5tZXNzYWdlLFxuICAgIG5hbWU6IF9tb3N0U3BlY2lmaWNFcnJvck5hbWUoZXhjZXB0aW9uKSxcbiAgICByYXdTdGFjazogZXhjZXB0aW9uLnN0YWNrLFxuICAgIHJhd0V4Y2VwdGlvbjogZXhjZXB0aW9uLFxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZShlLCBza2lwKSB7XG4gIHZhciBlcnIgPSBlO1xuXG4gIGlmIChlcnIubmVzdGVkIHx8IGVyci5jYXVzZSkge1xuICAgIHZhciB0cmFjZUNoYWluID0gW107XG4gICAgd2hpbGUgKGVycikge1xuICAgICAgdHJhY2VDaGFpbi5wdXNoKG5ldyBTdGFjayhlcnIsIHNraXApKTtcbiAgICAgIGVyciA9IGVyci5uZXN0ZWQgfHwgZXJyLmNhdXNlO1xuXG4gICAgICBza2lwID0gMDsgLy8gT25seSBhcHBseSBza2lwIHZhbHVlIHRvIHByaW1hcnkgZXJyb3JcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gcHJpbWFyeSBlcnJvciB3aXRoIGZ1bGwgdHJhY2UgY2hhaW4gYXR0YWNoZWQuXG4gICAgdHJhY2VDaGFpblswXS50cmFjZUNoYWluID0gdHJhY2VDaGFpbjtcbiAgICByZXR1cm4gdHJhY2VDaGFpblswXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFN0YWNrKGVyciwgc2tpcCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ3Vlc3NFcnJvckNsYXNzKGVyck1zZykge1xuICBpZiAoIWVyck1zZyB8fCAhZXJyTXNnLm1hdGNoKSB7XG4gICAgcmV0dXJuIFsnVW5rbm93biBlcnJvci4gVGhlcmUgd2FzIG5vIGVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheS4nLCAnJ107XG4gIH1cbiAgdmFyIGVyckNsYXNzTWF0Y2ggPSBlcnJNc2cubWF0Y2goRVJSX0NMQVNTX1JFR0VYUCk7XG4gIHZhciBlcnJDbGFzcyA9ICcodW5rbm93biknO1xuXG4gIGlmIChlcnJDbGFzc01hdGNoKSB7XG4gICAgZXJyQ2xhc3MgPSBlcnJDbGFzc01hdGNoW2VyckNsYXNzTWF0Y2gubGVuZ3RoIC0gMV07XG4gICAgZXJyTXNnID0gZXJyTXNnLnJlcGxhY2UoXG4gICAgICAoZXJyQ2xhc3NNYXRjaFtlcnJDbGFzc01hdGNoLmxlbmd0aCAtIDJdIHx8ICcnKSArIGVyckNsYXNzICsgJzonLFxuICAgICAgJycsXG4gICAgKTtcbiAgICBlcnJNc2cgPSBlcnJNc2cucmVwbGFjZSgvKF5bXFxzXSt8W1xcc10rJCkvZywgJycpO1xuICB9XG4gIHJldHVybiBbZXJyQ2xhc3MsIGVyck1zZ107XG59XG5cbi8vICogUHJlZmVycyBhbnkgdmFsdWUgb3ZlciBhbiBlbXB0eSBzdHJpbmdcbi8vICogUHJlZmVycyBhbnkgdmFsdWUgb3ZlciAnRXJyb3InIHdoZXJlIHBvc3NpYmxlXG4vLyAqIFByZWZlcnMgbmFtZSBvdmVyIGNvbnN0cnVjdG9yLm5hbWUgd2hlbiBib3RoIGFyZSBtb3JlIHNwZWNpZmljIHRoYW4gJ0Vycm9yJ1xuZnVuY3Rpb24gX21vc3RTcGVjaWZpY0Vycm9yTmFtZShlcnJvcikge1xuICB2YXIgbmFtZSA9IGVycm9yLm5hbWUgJiYgZXJyb3IubmFtZS5sZW5ndGggJiYgZXJyb3IubmFtZTtcbiAgdmFyIGNvbnN0cnVjdG9yTmFtZSA9XG4gICAgZXJyb3IuY29uc3RydWN0b3IubmFtZSAmJlxuICAgIGVycm9yLmNvbnN0cnVjdG9yLm5hbWUubGVuZ3RoICYmXG4gICAgZXJyb3IuY29uc3RydWN0b3IubmFtZTtcblxuICBpZiAoIW5hbWUgfHwgIWNvbnN0cnVjdG9yTmFtZSkge1xuICAgIHJldHVybiBuYW1lIHx8IGNvbnN0cnVjdG9yTmFtZTtcbiAgfVxuXG4gIGlmIChuYW1lID09PSAnRXJyb3InKSB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yTmFtZTtcbiAgfVxuICByZXR1cm4gbmFtZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGd1ZXNzRnVuY3Rpb25OYW1lOiBndWVzc0Z1bmN0aW9uTmFtZSxcbiAgZ3Vlc3NFcnJvckNsYXNzOiBndWVzc0Vycm9yQ2xhc3MsXG4gIGdhdGhlckNvbnRleHQ6IGdhdGhlckNvbnRleHQsXG4gIHBhcnNlOiBwYXJzZSxcbiAgU3RhY2s6IFN0YWNrLFxuICBGcmFtZTogRnJhbWUsXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuLypcbiAqIE5vdGlmaWVyIC0gdGhlIGludGVybmFsIG9iamVjdCByZXNwb25zaWJsZSBmb3IgZGVsZWdhdGluZyBiZXR3ZWVuIHRoZSBjbGllbnQgZXhwb3NlZCBBUEksIHRoZVxuICogY2hhaW4gb2YgdHJhbnNmb3JtcyBuZWNlc3NhcnkgdG8gdHVybiBhbiBpdGVtIGludG8gc29tZXRoaW5nIHRoYXQgY2FuIGJlIHNlbnQgdG8gUm9sbGJhciwgYW5kIHRoZVxuICogcXVldWUgd2hpY2ggaGFuZGxlcyB0aGUgY29tbXVuY2F0aW9uIHdpdGggdGhlIFJvbGxiYXIgQVBJIHNlcnZlcnMuXG4gKlxuICogQHBhcmFtIHF1ZXVlIC0gYW4gb2JqZWN0IHRoYXQgY29uZm9ybXMgdG8gdGhlIGludGVyZmFjZTogYWRkSXRlbShpdGVtLCBjYWxsYmFjaylcbiAqIEBwYXJhbSBvcHRpb25zIC0gYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgb3B0aW9ucyB0byBiZSBzZXQgZm9yIHRoaXMgbm90aWZpZXIsIHRoaXMgc2hvdWxkIGhhdmVcbiAqIGFueSBkZWZhdWx0cyBhbHJlYWR5IHNldCBieSB0aGUgY2FsbGVyXG4gKi9cbmZ1bmN0aW9uIE5vdGlmaWVyKHF1ZXVlLCBvcHRpb25zKSB7XG4gIHRoaXMucXVldWUgPSBxdWV1ZTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy50cmFuc2Zvcm1zID0gW107XG4gIHRoaXMuZGlhZ25vc3RpYyA9IHt9O1xufVxuXG4vKlxuICogY29uZmlndXJlIC0gdXBkYXRlcyB0aGUgb3B0aW9ucyBmb3IgdGhpcyBub3RpZmllciB3aXRoIHRoZSBwYXNzZWQgaW4gb2JqZWN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSBhbiBvYmplY3Qgd2hpY2ggZ2V0cyBtZXJnZWQgd2l0aCB0aGUgY3VycmVudCBvcHRpb25zIHNldCBvbiB0aGlzIG5vdGlmaWVyXG4gKiBAcmV0dXJucyB0aGlzXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB0aGlzLnF1ZXVlICYmIHRoaXMucXVldWUuY29uZmlndXJlKG9wdGlvbnMpO1xuICB2YXIgb2xkT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZShvbGRPcHRpb25zLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogYWRkVHJhbnNmb3JtIC0gYWRkcyBhIHRyYW5zZm9ybSBvbnRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlIG9mIHRyYW5zZm9ybXMgZm9yIHRoaXMgbm90aWZpZXJcbiAqXG4gKiBAcGFyYW0gdHJhbnNmb3JtIC0gYSBmdW5jdGlvbiB3aGljaCB0YWtlcyB0aHJlZSBhcmd1bWVudHM6XG4gKiAgICAqIGl0ZW06IEFuIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRhdGEgdG8gZXZlbnR1YWxseSBiZSBzZW50IHRvIFJvbGxiYXJcbiAqICAgICogb3B0aW9uczogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIG9wdGlvbnMgZm9yIHRoaXMgbm90aWZpZXJcbiAqICAgICogY2FsbGJhY2s6IGZ1bmN0aW9uKGVycjogKE51bGx8RXJyb3IpLCBpdGVtOiAoTnVsbHxPYmplY3QpKSB0aGUgdHJhbnNmb3JtIG11c3QgY2FsbCB0aGlzXG4gKiAgICBjYWxsYmFjayB3aXRoIGEgbnVsbCB2YWx1ZSBmb3IgZXJyb3IgaWYgaXQgd2FudHMgdGhlIHByb2Nlc3NpbmcgY2hhaW4gdG8gY29udGludWUsIG90aGVyd2lzZVxuICogICAgd2l0aCBhbiBlcnJvciB0byB0ZXJtaW5hdGUgdGhlIHByb2Nlc3NpbmcuIFRoZSBpdGVtIHNob3VsZCBiZSB0aGUgdXBkYXRlZCBpdGVtIGFmdGVyIHRoaXNcbiAqICAgIHRyYW5zZm9ybSBpcyBmaW5pc2hlZCBtb2RpZnlpbmcgaXQuXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5hZGRUcmFuc2Zvcm0gPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24odHJhbnNmb3JtKSkge1xuICAgIHRoaXMudHJhbnNmb3Jtcy5wdXNoKHRyYW5zZm9ybSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogbG9nIC0gdGhlIGludGVybmFsIGxvZyBmdW5jdGlvbiB3aGljaCBhcHBsaWVzIHRoZSBjb25maWd1cmVkIHRyYW5zZm9ybXMgYW5kIHRoZW4gcHVzaGVzIG9udG8gdGhlXG4gKiBxdWV1ZSB0byBiZSBzZW50IHRvIHRoZSBiYWNrZW5kLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gKiAgICBtZXNzYWdlIFtTdHJpbmddIC0gQW4gb3B0aW9uYWwgc3RyaW5nIHRvIGJlIHNlbnQgdG8gcm9sbGJhclxuICogICAgZXJyb3IgW0Vycm9yXSAtIEFuIG9wdGlvbmFsIGVycm9yXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gQSBmdW5jdGlvbiBvZiB0eXBlIGZ1bmN0aW9uKGVyciwgcmVzcCkgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBleGFjdGx5IG9uZVxuICogbnVsbCBhcmd1bWVudCBhbmQgb25lIG5vbi1udWxsIGFyZ3VtZW50LiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgb25jZSwgZWl0aGVyIGR1cmluZyB0aGVcbiAqIHRyYW5zZm9ybSBzdGFnZSBpZiBhbiBlcnJvciBvY2N1cnMgaW5zaWRlIGEgdHJhbnNmb3JtLCBvciBpbiByZXNwb25zZSB0byB0aGUgY29tbXVuaWNhdGlvbiB3aXRoXG4gKiB0aGUgYmFja2VuZC4gVGhlIHNlY29uZCBhcmd1bWVudCB3aWxsIGJlIHRoZSByZXNwb25zZSBmcm9tIHRoZSBiYWNrZW5kIGluIGNhc2Ugb2Ygc3VjY2Vzcy5cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuXG4gIGlmICghdGhpcy5vcHRpb25zLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdSb2xsYmFyIGlzIG5vdCBlbmFibGVkJykpO1xuICB9XG5cbiAgdGhpcy5xdWV1ZS5hZGRQZW5kaW5nSXRlbShpdGVtKTtcbiAgdmFyIG9yaWdpbmFsRXJyb3IgPSBpdGVtLmVycjtcbiAgdGhpcy5fYXBwbHlUcmFuc2Zvcm1zKFxuICAgIGl0ZW0sXG4gICAgZnVuY3Rpb24gKGVyciwgaSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLnF1ZXVlLnJlbW92ZVBlbmRpbmdJdGVtKGl0ZW0pO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucXVldWUuYWRkSXRlbShpLCBjYWxsYmFjaywgb3JpZ2luYWxFcnJvciwgaXRlbSk7XG4gICAgfS5iaW5kKHRoaXMpLFxuICApO1xufTtcblxuLyogSW50ZXJuYWwgKi9cblxuLypcbiAqIF9hcHBseVRyYW5zZm9ybXMgLSBBcHBsaWVzIHRoZSB0cmFuc2Zvcm1zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoaXMgbm90aWZpZXIgc2VxdWVudGlhbGx5LiBTZWVcbiAqIGBhZGRUcmFuc2Zvcm1gIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gQW4gaXRlbSB0byBiZSB0cmFuc2Zvcm1lZFxuICogQHBhcmFtIGNhbGxiYWNrIC0gQSBmdW5jdGlvbiBvZiB0eXBlIGZ1bmN0aW9uKGVyciwgaXRlbSkgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCBhIG5vbi1udWxsXG4gKiBlcnJvciBhbmQgYSBudWxsIGl0ZW0gaW4gdGhlIGNhc2Ugb2YgYSB0cmFuc2Zvcm0gZmFpbHVyZSwgb3IgYSBudWxsIGVycm9yIGFuZCBub24tbnVsbCBpdGVtIGFmdGVyXG4gKiBhbGwgdHJhbnNmb3JtcyBoYXZlIGJlZW4gYXBwbGllZC5cbiAqL1xuTm90aWZpZXIucHJvdG90eXBlLl9hcHBseVRyYW5zZm9ybXMgPSBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgdmFyIHRyYW5zZm9ybUluZGV4ID0gLTE7XG4gIHZhciB0cmFuc2Zvcm1zTGVuZ3RoID0gdGhpcy50cmFuc2Zvcm1zLmxlbmd0aDtcbiAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnRyYW5zZm9ybXM7XG4gIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gIHZhciBjYiA9IGZ1bmN0aW9uIChlcnIsIGkpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyYW5zZm9ybUluZGV4Kys7XG5cbiAgICBpZiAodHJhbnNmb3JtSW5kZXggPT09IHRyYW5zZm9ybXNMZW5ndGgpIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyYW5zZm9ybXNbdHJhbnNmb3JtSW5kZXhdKGksIG9wdGlvbnMsIGNiKTtcbiAgfTtcblxuICBjYihudWxsLCBpdGVtKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm90aWZpZXI7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBjaGVja0xldmVsKGl0ZW0sIHNldHRpbmdzKSB7XG4gIHZhciBsZXZlbCA9IGl0ZW0ubGV2ZWw7XG4gIHZhciBsZXZlbFZhbCA9IF8uTEVWRUxTW2xldmVsXSB8fCAwO1xuICB2YXIgcmVwb3J0TGV2ZWwgPSBzZXR0aW5ncy5yZXBvcnRMZXZlbDtcbiAgdmFyIHJlcG9ydExldmVsVmFsID0gXy5MRVZFTFNbcmVwb3J0TGV2ZWxdIHx8IDA7XG5cbiAgaWYgKGxldmVsVmFsIDwgcmVwb3J0TGV2ZWxWYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHVzZXJDaGVja0lnbm9yZShsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBzZXR0aW5ncykge1xuICAgIHZhciBpc1VuY2F1Z2h0ID0gISFpdGVtLl9pc1VuY2F1Z2h0O1xuICAgIGRlbGV0ZSBpdGVtLl9pc1VuY2F1Z2h0O1xuICAgIHZhciBhcmdzID0gaXRlbS5fb3JpZ2luYWxBcmdzO1xuICAgIGRlbGV0ZSBpdGVtLl9vcmlnaW5hbEFyZ3M7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24oc2V0dGluZ3Mub25TZW5kQ2FsbGJhY2spKSB7XG4gICAgICAgIHNldHRpbmdzLm9uU2VuZENhbGxiYWNrKGlzVW5jYXVnaHQsIGFyZ3MsIGl0ZW0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldHRpbmdzLm9uU2VuZENhbGxiYWNrID0gbnVsbDtcbiAgICAgIGxvZ2dlci5lcnJvcignRXJyb3Igd2hpbGUgY2FsbGluZyBvblNlbmRDYWxsYmFjaywgcmVtb3ZpbmcnLCBlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmIChcbiAgICAgICAgXy5pc0Z1bmN0aW9uKHNldHRpbmdzLmNoZWNrSWdub3JlKSAmJlxuICAgICAgICBzZXR0aW5ncy5jaGVja0lnbm9yZShpc1VuY2F1Z2h0LCBhcmdzLCBpdGVtKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXR0aW5ncy5jaGVja0lnbm9yZSA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNhbGxpbmcgY3VzdG9tIGNoZWNrSWdub3JlKCksIHJlbW92aW5nJywgZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1cmxJc05vdEJsb2NrTGlzdGVkKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIHNldHRpbmdzKSB7XG4gICAgcmV0dXJuICF1cmxJc09uQUxpc3QoaXRlbSwgc2V0dGluZ3MsICdibG9ja2xpc3QnLCBsb2dnZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1cmxJc1NhZmVMaXN0ZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICByZXR1cm4gdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCAnc2FmZWxpc3QnLCBsb2dnZXIpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBtYXRjaEZyYW1lcyh0cmFjZSwgbGlzdCwgYmxvY2spIHtcbiAgaWYgKCF0cmFjZSkge1xuICAgIHJldHVybiAhYmxvY2s7XG4gIH1cblxuICB2YXIgZnJhbWVzID0gdHJhY2UuZnJhbWVzO1xuXG4gIGlmICghZnJhbWVzIHx8IGZyYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gIWJsb2NrO1xuICB9XG5cbiAgdmFyIGZyYW1lLCBmaWxlbmFtZSwgdXJsLCB1cmxSZWdleDtcbiAgdmFyIGxpc3RMZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgdmFyIGZyYW1lTGVuZ3RoID0gZnJhbWVzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmcmFtZUxlbmd0aDsgaSsrKSB7XG4gICAgZnJhbWUgPSBmcmFtZXNbaV07XG4gICAgZmlsZW5hbWUgPSBmcmFtZS5maWxlbmFtZTtcblxuICAgIGlmICghXy5pc1R5cGUoZmlsZW5hbWUsICdzdHJpbmcnKSkge1xuICAgICAgcmV0dXJuICFibG9jaztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxpc3RMZW5ndGg7IGorKykge1xuICAgICAgdXJsID0gbGlzdFtqXTtcbiAgICAgIHVybFJlZ2V4ID0gbmV3IFJlZ0V4cCh1cmwpO1xuXG4gICAgICBpZiAodXJsUmVnZXgudGVzdChmaWxlbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCBzYWZlT3JCbG9jaywgbG9nZ2VyKSB7XG4gIC8vIHNhZmVsaXN0IGlzIHRoZSBkZWZhdWx0XG4gIHZhciBibG9jayA9IGZhbHNlO1xuICBpZiAoc2FmZU9yQmxvY2sgPT09ICdibG9ja2xpc3QnKSB7XG4gICAgYmxvY2sgPSB0cnVlO1xuICB9XG5cbiAgdmFyIGxpc3QsIHRyYWNlcztcbiAgdHJ5IHtcbiAgICBsaXN0ID0gYmxvY2sgPyBzZXR0aW5ncy5ob3N0QmxvY2tMaXN0IDogc2V0dGluZ3MuaG9zdFNhZmVMaXN0O1xuICAgIHRyYWNlcyA9IF8uZ2V0KGl0ZW0sICdib2R5LnRyYWNlX2NoYWluJykgfHwgW18uZ2V0KGl0ZW0sICdib2R5LnRyYWNlJyldO1xuXG4gICAgLy8gVGhlc2UgdHdvIGNoZWNrcyBhcmUgaW1wb3J0YW50IHRvIGNvbWUgZmlyc3QgYXMgdGhleSBhcmUgZGVmYXVsdHNcbiAgICAvLyBpbiBjYXNlIHRoZSBsaXN0IGlzIG1pc3Npbmcgb3IgdGhlIHRyYWNlIGlzIG1pc3Npbmcgb3Igbm90IHdlbGwtZm9ybWVkXG4gICAgaWYgKCFsaXN0IHx8IGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cbiAgICBpZiAodHJhY2VzLmxlbmd0aCA9PT0gMCB8fCAhdHJhY2VzWzBdKSB7XG4gICAgICByZXR1cm4gIWJsb2NrO1xuICAgIH1cblxuICAgIHZhciB0cmFjZXNMZW5ndGggPSB0cmFjZXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2VzTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaEZyYW1lcyh0cmFjZXNbaV0sIGxpc3QsIGJsb2NrKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKFxuICAgIGVcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICApIHtcbiAgICBpZiAoYmxvY2spIHtcbiAgICAgIHNldHRpbmdzLmhvc3RCbG9ja0xpc3QgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXR0aW5ncy5ob3N0U2FmZUxpc3QgPSBudWxsO1xuICAgIH1cbiAgICB2YXIgbGlzdE5hbWUgPSBibG9jayA/ICdob3N0QmxvY2tMaXN0JyA6ICdob3N0U2FmZUxpc3QnO1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFwiRXJyb3Igd2hpbGUgcmVhZGluZyB5b3VyIGNvbmZpZ3VyYXRpb24ncyBcIiArXG4gICAgICAgIGxpc3ROYW1lICtcbiAgICAgICAgJyBvcHRpb24uIFJlbW92aW5nIGN1c3RvbSAnICtcbiAgICAgICAgbGlzdE5hbWUgK1xuICAgICAgICAnLicsXG4gICAgICBlLFxuICAgICk7XG4gICAgcmV0dXJuICFibG9jaztcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIG1lc3NhZ2VJc0lnbm9yZWQobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgaSwgaiwgaWdub3JlZE1lc3NhZ2VzLCBsZW4sIG1lc3NhZ2VJc0lnbm9yZWQsIHJJZ25vcmVkTWVzc2FnZSwgbWVzc2FnZXM7XG5cbiAgICB0cnkge1xuICAgICAgbWVzc2FnZUlzSWdub3JlZCA9IGZhbHNlO1xuICAgICAgaWdub3JlZE1lc3NhZ2VzID0gc2V0dGluZ3MuaWdub3JlZE1lc3NhZ2VzO1xuXG4gICAgICBpZiAoIWlnbm9yZWRNZXNzYWdlcyB8fCBpZ25vcmVkTWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzRnJvbUl0ZW0oaXRlbSk7XG5cbiAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGxlbiA9IGlnbm9yZWRNZXNzYWdlcy5sZW5ndGg7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcklnbm9yZWRNZXNzYWdlID0gbmV3IFJlZ0V4cChpZ25vcmVkTWVzc2FnZXNbaV0sICdnaScpO1xuXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBtZXNzYWdlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIG1lc3NhZ2VJc0lnbm9yZWQgPSBySWdub3JlZE1lc3NhZ2UudGVzdChtZXNzYWdlc1tqXSk7XG5cbiAgICAgICAgICBpZiAobWVzc2FnZUlzSWdub3JlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKFxuICAgICAgZVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICApIHtcbiAgICAgIHNldHRpbmdzLmlnbm9yZWRNZXNzYWdlcyA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIFwiRXJyb3Igd2hpbGUgcmVhZGluZyB5b3VyIGNvbmZpZ3VyYXRpb24ncyBpZ25vcmVkTWVzc2FnZXMgb3B0aW9uLiBSZW1vdmluZyBjdXN0b20gaWdub3JlZE1lc3NhZ2VzLlwiLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVzc2FnZXNGcm9tSXRlbShpdGVtKSB7XG4gIHZhciBib2R5ID0gaXRlbS5ib2R5O1xuICB2YXIgbWVzc2FnZXMgPSBbXTtcblxuICAvLyBUaGUgcGF5bG9hZCBzY2hlbWEgb25seSBhbGxvd3Mgb25lIG9mIHRyYWNlX2NoYWluLCBtZXNzYWdlLCBvciB0cmFjZS5cbiAgLy8gSG93ZXZlciwgZXhpc3RpbmcgdGVzdCBjYXNlcyBhcmUgYmFzZWQgb24gaGF2aW5nIGJvdGggdHJhY2UgYW5kIG1lc3NhZ2UgcHJlc2VudC5cbiAgLy8gU28gaGVyZSB3ZSBwcmVzZXJ2ZSB0aGUgYWJpbGl0eSB0byBjb2xsZWN0IHN0cmluZ3MgZnJvbSBhbnkgY29tYmluYXRpb24gb2YgdGhlc2Uga2V5cy5cbiAgaWYgKGJvZHkudHJhY2VfY2hhaW4pIHtcbiAgICB2YXIgdHJhY2VDaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0cmFjZUNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHJhY2UgPSB0cmFjZUNoYWluW2ldO1xuICAgICAgbWVzc2FnZXMucHVzaChfLmdldCh0cmFjZSwgJ2V4Y2VwdGlvbi5tZXNzYWdlJykpO1xuICAgIH1cbiAgfVxuICBpZiAoYm9keS50cmFjZSkge1xuICAgIG1lc3NhZ2VzLnB1c2goXy5nZXQoYm9keSwgJ3RyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlJykpO1xuICB9XG4gIGlmIChib2R5Lm1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlcy5wdXNoKF8uZ2V0KGJvZHksICdtZXNzYWdlLmJvZHknKSk7XG4gIH1cbiAgcmV0dXJuIG1lc3NhZ2VzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2tMZXZlbDogY2hlY2tMZXZlbCxcbiAgdXNlckNoZWNrSWdub3JlOiB1c2VyQ2hlY2tJZ25vcmUsXG4gIHVybElzTm90QmxvY2tMaXN0ZWQ6IHVybElzTm90QmxvY2tMaXN0ZWQsXG4gIHVybElzU2FmZUxpc3RlZDogdXJsSXNTYWZlTGlzdGVkLFxuICBtZXNzYWdlSXNJZ25vcmVkOiBtZXNzYWdlSXNJZ25vcmVkLFxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbi8qXG4gKiBRdWV1ZSAtIGFuIG9iamVjdCB3aGljaCBoYW5kbGVzIHdoaWNoIGhhbmRsZXMgYSBxdWV1ZSBvZiBpdGVtcyB0byBiZSBzZW50IHRvIFJvbGxiYXIuXG4gKiAgIFRoaXMgb2JqZWN0IGhhbmRsZXMgcmF0ZSBsaW1pdGluZyB2aWEgYSBwYXNzZWQgaW4gcmF0ZSBsaW1pdGVyLCByZXRyaWVzIGJhc2VkIG9uIGNvbm5lY3Rpb25cbiAqICAgZXJyb3JzLCBhbmQgZmlsdGVyaW5nIG9mIGl0ZW1zIGJhc2VkIG9uIGEgc2V0IG9mIGNvbmZpZ3VyYWJsZSBwcmVkaWNhdGVzLiBUaGUgY29tbXVuaWNhdGlvbiB0b1xuICogICB0aGUgYmFja2VuZCBpcyBwZXJmb3JtZWQgdmlhIGEgZ2l2ZW4gQVBJIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gcmF0ZUxpbWl0ZXIgLSBBbiBvYmplY3Qgd2hpY2ggY29uZm9ybXMgdG8gdGhlIGludGVyZmFjZVxuICogICAgcmF0ZUxpbWl0ZXIuc2hvdWxkU2VuZChpdGVtKSAtPiBib29sXG4gKiBAcGFyYW0gYXBpIC0gQW4gb2JqZWN0IHdoaWNoIGNvbmZvcm1zIHRvIHRoZSBpbnRlcmZhY2VcbiAqICAgIGFwaS5wb3N0SXRlbShwYXlsb2FkLCBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKSlcbiAqIEBwYXJhbSBsb2dnZXIgLSBBbiBvYmplY3QgdXNlZCB0byBsb2cgdmVyYm9zZSBtZXNzYWdlcyBpZiBkZXNpcmVkXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHNlZSBRdWV1ZS5wcm90b3R5cGUuY29uZmlndXJlXG4gKiBAcGFyYW0gcmVwbGF5TWFwIC0gT3B0aW9uYWwgUmVwbGF5TWFwIGZvciBjb29yZGluYXRpbmcgc2Vzc2lvbiByZXBsYXkgd2l0aCBlcnJvciBvY2N1cnJlbmNlc1xuICovXG5mdW5jdGlvbiBRdWV1ZShyYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIG9wdGlvbnMsIHJlcGxheU1hcCkge1xuICB0aGlzLnJhdGVMaW1pdGVyID0gcmF0ZUxpbWl0ZXI7XG4gIHRoaXMuYXBpID0gYXBpO1xuICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5yZXBsYXlNYXAgPSByZXBsYXlNYXA7XG4gIHRoaXMucHJlZGljYXRlcyA9IFtdO1xuICB0aGlzLnBlbmRpbmdJdGVtcyA9IFtdO1xuICB0aGlzLnBlbmRpbmdSZXF1ZXN0cyA9IFtdO1xuICB0aGlzLnJldHJ5UXVldWUgPSBbXTtcbiAgdGhpcy5yZXRyeUhhbmRsZSA9IG51bGw7XG4gIHRoaXMud2FpdENhbGxiYWNrID0gbnVsbDtcbiAgdGhpcy53YWl0SW50ZXJ2YWxJRCA9IG51bGw7XG59XG5cbi8qXG4gKiBjb25maWd1cmUgLSB1cGRhdGVzIHRoZSBvcHRpb25zIHRoaXMgcXVldWUgdXNlc1xuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB0aGlzLmFwaSAmJiB0aGlzLmFwaS5jb25maWd1cmUob3B0aW9ucyk7XG4gIHZhciBvbGRPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9sZE9wdGlvbnMsIG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qXG4gKiBhZGRQcmVkaWNhdGUgLSBhZGRzIGEgcHJlZGljYXRlIHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb2YgcHJlZGljYXRlcyBmb3IgdGhpcyBxdWV1ZVxuICpcbiAqIEBwYXJhbSBwcmVkaWNhdGUgLSBmdW5jdGlvbihpdGVtLCBvcHRpb25zKSAtPiAoYm9vbHx7ZXJyOiBFcnJvcn0pXG4gKiAgUmV0dXJuaW5nIHRydWUgbWVhbnMgdGhhdCB0aGlzIHByZWRpY2F0ZSBwYXNzZXMgYW5kIHRoZSBpdGVtIGlzIG9rYXkgdG8gZ28gb24gdGhlIHF1ZXVlXG4gKiAgUmV0dXJuaW5nIGZhbHNlIG1lYW5zIGRvIG5vdCBhZGQgdGhlIGl0ZW0gdG8gdGhlIHF1ZXVlLCBidXQgaXQgaXMgbm90IGFuIGVycm9yXG4gKiAgUmV0dXJuaW5nIHtlcnI6IEVycm9yfSBtZWFucyBkbyBub3QgYWRkIHRoZSBpdGVtIHRvIHRoZSBxdWV1ZSwgYW5kIHRoZSBnaXZlbiBlcnJvciBleHBsYWlucyB3aHlcbiAqICBSZXR1cm5pbmcge2VycjogdW5kZWZpbmVkfSBpcyBlcXVpdmFsZW50IHRvIHJldHVybmluZyB0cnVlIGJ1dCBkb24ndCBkbyB0aGF0XG4gKi9cblF1ZXVlLnByb3RvdHlwZS5hZGRQcmVkaWNhdGUgPSBmdW5jdGlvbiAocHJlZGljYXRlKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24ocHJlZGljYXRlKSkge1xuICAgIHRoaXMucHJlZGljYXRlcy5wdXNoKHByZWRpY2F0ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuYWRkUGVuZGluZ0l0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLnBlbmRpbmdJdGVtcy5wdXNoKGl0ZW0pO1xufTtcblxuUXVldWUucHJvdG90eXBlLnJlbW92ZVBlbmRpbmdJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGlkeCA9IHRoaXMucGVuZGluZ0l0ZW1zLmluZGV4T2YoaXRlbSk7XG4gIGlmIChpZHggIT09IC0xKSB7XG4gICAgdGhpcy5wZW5kaW5nSXRlbXMuc3BsaWNlKGlkeCwgMSk7XG4gIH1cbn07XG5cbi8qXG4gKiBhZGRJdGVtIC0gU2VuZCBhbiBpdGVtIHRvIHRoZSBSb2xsYmFyIEFQSSBpZiBhbGwgb2YgdGhlIHByZWRpY2F0ZXMgYXJlIHNhdGlzZmllZFxuICpcbiAqIEBwYXJhbSBpdGVtIC0gVGhlIHBheWxvYWQgdG8gc2VuZCB0byB0aGUgYmFja2VuZFxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oZXJyb3IsIHJlcHNvbnNlKSB3aGljaCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSByZXNwb25zZSBmcm9tIHRoZSBBUElcbiAqICBpbiB0aGUgY2FzZSBvZiBhIHN1Y2Nlc3MsIG90aGVyd2lzZSByZXNwb25zZSB3aWxsIGJlIG51bGwgYW5kIGVycm9yIHdpbGwgaGF2ZSBhIHZhbHVlLiBJZiBib3RoXG4gKiAgZXJyb3IgYW5kIHJlc3BvbnNlIGFyZSBudWxsIHRoZW4gdGhlIGl0ZW0gd2FzIHN0b3BwZWQgYnkgYSBwcmVkaWNhdGUgd2hpY2ggZGlkIG5vdCBjb25zaWRlciB0aGlzXG4gKiAgdG8gYmUgYW4gZXJyb3IgY29uZGl0aW9uLCBidXQgbm9uZXRoZWxlc3MgZGlkIG5vdCBzZW5kIHRoZSBpdGVtIHRvIHRoZSBBUEkuXG4gKiAgQHBhcmFtIG9yaWdpbmFsRXJyb3IgLSBUaGUgb3JpZ2luYWwgZXJyb3IgYmVmb3JlIGFueSB0cmFuc2Zvcm1hdGlvbnMgdGhhdCBpcyB0byBiZSBsb2dnZWQgaWYgYW55XG4gKi9cblF1ZXVlLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24gKFxuICBpdGVtLFxuICBjYWxsYmFjayxcbiAgb3JpZ2luYWxFcnJvcixcbiAgb3JpZ2luYWxJdGVtLFxuKSB7XG4gIGlmICghY2FsbGJhY2sgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9O1xuICB9XG4gIHZhciBwcmVkaWNhdGVSZXN1bHQgPSB0aGlzLl9hcHBseVByZWRpY2F0ZXMoaXRlbSk7XG4gIGlmIChwcmVkaWNhdGVSZXN1bHQuc3RvcCkge1xuICAgIHRoaXMucmVtb3ZlUGVuZGluZ0l0ZW0ob3JpZ2luYWxJdGVtKTtcbiAgICBjYWxsYmFjayhwcmVkaWNhdGVSZXN1bHQuZXJyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5fbWF5YmVMb2coaXRlbSwgb3JpZ2luYWxFcnJvcik7XG4gIHRoaXMucmVtb3ZlUGVuZGluZ0l0ZW0ob3JpZ2luYWxJdGVtKTtcbiAgaWYgKCF0aGlzLm9wdGlvbnMudHJhbnNtaXQpIHtcbiAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ1RyYW5zbWl0IGRpc2FibGVkJykpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0aGlzLnJlcGxheU1hcCAmJiBpdGVtLmJvZHkpIHtcbiAgICBjb25zdCByZXBsYXlJZCA9IHRoaXMucmVwbGF5TWFwLmFkZChpdGVtLnV1aWQpO1xuICAgIGl0ZW0ucmVwbGF5SWQgPSByZXBsYXlJZDtcbiAgfVxuXG4gIHRoaXMucGVuZGluZ1JlcXVlc3RzLnB1c2goaXRlbSk7XG4gIHRyeSB7XG4gICAgdGhpcy5fbWFrZUFwaVJlcXVlc3QoXG4gICAgICBpdGVtLFxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgICB0aGlzLl9kZXF1ZXVlUGVuZGluZ1JlcXVlc3QoaXRlbSk7XG5cbiAgICAgICAgaWYgKCFlcnIgJiYgcmVzcCAmJiBpdGVtLnJlcGxheUlkKSB7XG4gICAgICAgICAgdGhpcy5faGFuZGxlUmVwbGF5UmVzcG9uc2UoaXRlbS5yZXBsYXlJZCwgcmVzcCk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3ApO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aGlzLl9kZXF1ZXVlUGVuZGluZ1JlcXVlc3QoaXRlbSk7XG4gICAgY2FsbGJhY2soZSk7XG4gIH1cbn07XG5cbi8qXG4gKiB3YWl0IC0gU3RvcCBhbnkgZnVydGhlciBlcnJvcnMgZnJvbSBiZWluZyBhZGRlZCB0byB0aGUgcXVldWUsIGFuZCBnZXQgY2FsbGVkIGJhY2sgd2hlbiBhbGwgaXRlbXNcbiAqICAgY3VycmVudGx5IHByb2Nlc3NpbmcgaGF2ZSBmaW5pc2hlZCBzZW5kaW5nIHRvIHRoZSBiYWNrZW5kLlxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayAtIGZ1bmN0aW9uKCkgY2FsbGVkIHdoZW4gYWxsIHBlbmRpbmcgaXRlbXMgaGF2ZSBiZWVuIHNlbnRcbiAqL1xuUXVldWUucHJvdG90eXBlLndhaXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMud2FpdENhbGxiYWNrID0gY2FsbGJhY2s7XG4gIGlmICh0aGlzLl9tYXliZUNhbGxXYWl0KCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHRoaXMud2FpdEludGVydmFsSUQpIHtcbiAgICB0aGlzLndhaXRJbnRlcnZhbElEID0gY2xlYXJJbnRlcnZhbCh0aGlzLndhaXRJbnRlcnZhbElEKTtcbiAgfVxuICB0aGlzLndhaXRJbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fbWF5YmVDYWxsV2FpdCgpO1xuICAgIH0uYmluZCh0aGlzKSxcbiAgICA1MDAsXG4gICk7XG59O1xuXG4vKiBfYXBwbHlQcmVkaWNhdGVzIC0gU2VxdWVudGlhbGx5IGFwcGxpZXMgdGhlIHByZWRpY2F0ZXMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHF1ZXVlIHRvIHRoZVxuICogICBnaXZlbiBpdGVtIHdpdGggdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIG9wdGlvbnMuXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBBbiBpdGVtIGluIHRoZSBxdWV1ZVxuICogQHJldHVybnMge3N0b3A6IGJvb2wsIGVycjogKEVycm9yfG51bGwpfSAtIHN0b3AgYmVpbmcgdHJ1ZSBtZWFucyBkbyBub3QgYWRkIGl0ZW0gdG8gdGhlIHF1ZXVlLFxuICogICB0aGUgZXJyb3IgdmFsdWUgc2hvdWxkIGJlIHBhc3NlZCB1cCB0byBhIGNhbGxiYWsgaWYgd2UgYXJlIHN0b3BwaW5nLlxuICovXG5RdWV1ZS5wcm90b3R5cGUuX2FwcGx5UHJlZGljYXRlcyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBwID0gbnVsbDtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMucHJlZGljYXRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHAgPSB0aGlzLnByZWRpY2F0ZXNbaV0oaXRlbSwgdGhpcy5vcHRpb25zKTtcbiAgICBpZiAoIXAgfHwgcC5lcnIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHsgc3RvcDogdHJ1ZSwgZXJyOiBwLmVyciB9O1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBzdG9wOiBmYWxzZSwgZXJyOiBudWxsIH07XG59O1xuXG4vKlxuICogX21ha2VBcGlSZXF1ZXN0IC0gU2VuZCBhbiBpdGVtIHRvIFJvbGxiYXIsIGNhbGxiYWNrIHdoZW4gZG9uZSwgaWYgdGhlcmUgaXMgYW4gZXJyb3IgbWFrZSBhblxuICogICBlZmZvcnQgdG8gcmV0cnkgaWYgd2UgYXJlIGNvbmZpZ3VyZWQgdG8gZG8gc28uXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBhbiBpdGVtIHJlYWR5IHRvIHNlbmQgdG8gdGhlIGJhY2tlbmRcbiAqIEBwYXJhbSBjYWxsYmFjayAtIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fbWFrZUFwaVJlcXVlc3QgPSBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgdmFyIHJhdGVMaW1pdFJlc3BvbnNlID0gdGhpcy5yYXRlTGltaXRlci5zaG91bGRTZW5kKGl0ZW0pO1xuICBpZiAocmF0ZUxpbWl0UmVzcG9uc2Uuc2hvdWxkU2VuZCkge1xuICAgIHRoaXMuYXBpLnBvc3RJdGVtKFxuICAgICAgaXRlbSxcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHRoaXMuX21heWJlUmV0cnkoZXJyLCBpdGVtLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyLCByZXNwKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICk7XG4gIH0gZWxzZSBpZiAocmF0ZUxpbWl0UmVzcG9uc2UuZXJyb3IpIHtcbiAgICBjYWxsYmFjayhyYXRlTGltaXRSZXNwb25zZS5lcnJvcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hcGkucG9zdEl0ZW0ocmF0ZUxpbWl0UmVzcG9uc2UucGF5bG9hZCwgY2FsbGJhY2spO1xuICB9XG59O1xuXG4vLyBUaGVzZSBhcmUgZXJyb3JzIGJhc2ljYWxseSBtZWFuIHRoZXJlIGlzIG5vIGludGVybmV0IGNvbm5lY3Rpb25cbnZhciBSRVRSSUFCTEVfRVJST1JTID0gW1xuICAnRUNPTk5SRVNFVCcsXG4gICdFTk9URk9VTkQnLFxuICAnRVNPQ0tFVFRJTUVET1VUJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdFQ09OTlJFRlVTRUQnLFxuICAnRUhPU1RVTlJFQUNIJyxcbiAgJ0VQSVBFJyxcbiAgJ0VBSV9BR0FJTicsXG5dO1xuXG4vKlxuICogX21heWJlUmV0cnkgLSBHaXZlbiB0aGUgZXJyb3IgcmV0dXJuZWQgYnkgdGhlIEFQSSwgZGVjaWRlIGlmIHdlIHNob3VsZCByZXRyeSBvciBqdXN0IGNhbGxiYWNrXG4gKiAgIHdpdGggdGhlIGVycm9yLlxuICpcbiAqIEBwYXJhbSBlcnIgLSBhbiBlcnJvciByZXR1cm5lZCBieSB0aGUgQVBJIHRyYW5zcG9ydFxuICogQHBhcmFtIGl0ZW0gLSB0aGUgaXRlbSB0aGF0IHdhcyB0cnlpbmcgdG8gYmUgc2VudCB3aGVuIHRoaXMgZXJyb3Igb2NjdXJlZFxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oZXJyLCByZXNwb25zZSlcbiAqL1xuUXVldWUucHJvdG90eXBlLl9tYXliZVJldHJ5ID0gZnVuY3Rpb24gKGVyciwgaXRlbSwgY2FsbGJhY2spIHtcbiAgdmFyIHNob3VsZFJldHJ5ID0gZmFsc2U7XG4gIGlmICh0aGlzLm9wdGlvbnMucmV0cnlJbnRlcnZhbCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBSRVRSSUFCTEVfRVJST1JTLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoZXJyLmNvZGUgPT09IFJFVFJJQUJMRV9FUlJPUlNbaV0pIHtcbiAgICAgICAgc2hvdWxkUmV0cnkgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNob3VsZFJldHJ5ICYmIF8uaXNGaW5pdGVOdW1iZXIodGhpcy5vcHRpb25zLm1heFJldHJpZXMpKSB7XG4gICAgICBpdGVtLnJldHJpZXMgPSBpdGVtLnJldHJpZXMgPyBpdGVtLnJldHJpZXMgKyAxIDogMTtcbiAgICAgIGlmIChpdGVtLnJldHJpZXMgPiB0aGlzLm9wdGlvbnMubWF4UmV0cmllcykge1xuICAgICAgICBzaG91bGRSZXRyeSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoc2hvdWxkUmV0cnkpIHtcbiAgICB0aGlzLl9yZXRyeUFwaVJlcXVlc3QoaXRlbSwgY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrKGVycik7XG4gIH1cbn07XG5cbi8qXG4gKiBfcmV0cnlBcGlSZXF1ZXN0IC0gQWRkIGFuIGl0ZW0gYW5kIGEgY2FsbGJhY2sgdG8gYSBxdWV1ZSBhbmQgcG9zc2libHkgc3RhcnQgYSB0aW1lciB0byBwcm9jZXNzXG4gKiAgIHRoYXQgcXVldWUgYmFzZWQgb24gdGhlIHJldHJ5SW50ZXJ2YWwgaW4gdGhlIG9wdGlvbnMgZm9yIHRoaXMgcXVldWUuXG4gKlxuICogQHBhcmFtIGl0ZW0gLSBhbiBpdGVtIHRoYXQgZmFpbGVkIHRvIHNlbmQgZHVlIHRvIGFuIGVycm9yIHdlIGRlZW0gcmV0cmlhYmxlXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX3JldHJ5QXBpUmVxdWVzdCA9IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICB0aGlzLnJldHJ5UXVldWUucHVzaCh7IGl0ZW06IGl0ZW0sIGNhbGxiYWNrOiBjYWxsYmFjayB9KTtcblxuICBpZiAoIXRoaXMucmV0cnlIYW5kbGUpIHtcbiAgICB0aGlzLnJldHJ5SGFuZGxlID0gc2V0SW50ZXJ2YWwoXG4gICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnJldHJ5UXVldWUubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHJldHJ5T2JqZWN0ID0gdGhpcy5yZXRyeVF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgdGhpcy5fbWFrZUFwaVJlcXVlc3QocmV0cnlPYmplY3QuaXRlbSwgcmV0cnlPYmplY3QuY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICB0aGlzLm9wdGlvbnMucmV0cnlJbnRlcnZhbCxcbiAgICApO1xuICB9XG59O1xuXG4vKlxuICogX2RlcXVldWVQZW5kaW5nUmVxdWVzdCAtIFJlbW92ZXMgdGhlIGl0ZW0gZnJvbSB0aGUgcGVuZGluZyByZXF1ZXN0IHF1ZXVlLCB0aGlzIHF1ZXVlIGlzIHVzZWQgdG9cbiAqICAgZW5hYmxlIHRvIGZ1bmN0aW9uYWxpdHkgb2YgcHJvdmlkaW5nIGEgY2FsbGJhY2sgdGhhdCBjbGllbnRzIGNhbiBwYXNzIHRvIGB3YWl0YCB0byBiZSBub3RpZmllZFxuICogICB3aGVuIHRoZSBwZW5kaW5nIHJlcXVlc3QgcXVldWUgaGFzIGJlZW4gZW1wdGllZC4gVGhpcyBtdXN0IGJlIGNhbGxlZCB3aGVuIHRoZSBBUEkgZmluaXNoZXNcbiAqICAgcHJvY2Vzc2luZyB0aGlzIGl0ZW0uIElmIGEgYHdhaXRgIGNhbGxiYWNrIGlzIGNvbmZpZ3VyZWQsIGl0IGlzIGNhbGxlZCBieSB0aGlzIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gdGhlIGl0ZW0gcHJldmlvdXNseSBhZGRlZCB0byB0aGUgcGVuZGluZyByZXF1ZXN0IHF1ZXVlXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fZGVxdWV1ZVBlbmRpbmdSZXF1ZXN0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGlkeCA9IHRoaXMucGVuZGluZ1JlcXVlc3RzLmluZGV4T2YoaXRlbSk7XG4gIGlmIChpZHggIT09IC0xKSB7XG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMuc3BsaWNlKGlkeCwgMSk7XG4gICAgdGhpcy5fbWF5YmVDYWxsV2FpdCgpO1xuICB9XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuX21heWJlTG9nID0gZnVuY3Rpb24gKGRhdGEsIG9yaWdpbmFsRXJyb3IpIHtcbiAgaWYgKHRoaXMubG9nZ2VyICYmIHRoaXMub3B0aW9ucy52ZXJib3NlKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBvcmlnaW5hbEVycm9yO1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8IF8uZ2V0KGRhdGEsICdib2R5LnRyYWNlLmV4Y2VwdGlvbi5tZXNzYWdlJyk7XG4gICAgbWVzc2FnZSA9IG1lc3NhZ2UgfHwgXy5nZXQoZGF0YSwgJ2JvZHkudHJhY2VfY2hhaW4uMC5leGNlcHRpb24ubWVzc2FnZScpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcihtZXNzYWdlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWVzc2FnZSA9IF8uZ2V0KGRhdGEsICdib2R5Lm1lc3NhZ2UuYm9keScpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLmxvZ2dlci5sb2cobWVzc2FnZSk7XG4gICAgfVxuICB9XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuX21heWJlQ2FsbFdhaXQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChcbiAgICBfLmlzRnVuY3Rpb24odGhpcy53YWl0Q2FsbGJhY2spICYmXG4gICAgdGhpcy5wZW5kaW5nSXRlbXMubGVuZ3RoID09PSAwICYmXG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdHMubGVuZ3RoID09PSAwXG4gICkge1xuICAgIGlmICh0aGlzLndhaXRJbnRlcnZhbElEKSB7XG4gICAgICB0aGlzLndhaXRJbnRlcnZhbElEID0gY2xlYXJJbnRlcnZhbCh0aGlzLndhaXRJbnRlcnZhbElEKTtcbiAgICB9XG4gICAgdGhpcy53YWl0Q2FsbGJhY2soKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIEFQSSByZXNwb25zZSBmb3IgYW4gaXRlbSB3aXRoIGEgcmVwbGF5IElELlxuICogQmFzZWQgb24gdGhlIHN1Y2Nlc3Mgb3IgZmFpbHVyZSBzdGF0dXMgb2YgdGhlIHJlc3BvbnNlLFxuICogaXQgZWl0aGVyIHNlbmRzIG9yIGRpc2NhcmRzIHRoZSBhc3NvY2lhdGVkIHNlc3Npb24gcmVwbGF5LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXBsYXlJZCAtIFRoZSBJRCBvZiB0aGUgcmVwbGF5IHRvIGhhbmRsZVxuICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlIC0gVGhlIEFQSSByZXNwb25zZVxuICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUgaWYgcmVwbGF5IHdhcyBzZW50IHN1Y2Nlc3NmdWxseSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSBpZiByZXBsYXkgd2FzIGRpc2NhcmRlZCBvciBhbiBlcnJvciBvY2N1cnJlZFxuICogQHByaXZhdGVcbiAqL1xuUXVldWUucHJvdG90eXBlLl9oYW5kbGVSZXBsYXlSZXNwb25zZSA9IGFzeW5jIGZ1bmN0aW9uIChyZXBsYXlJZCwgcmVzcG9uc2UpIHtcbiAgaWYgKCF0aGlzLnJlcGxheU1hcCkge1xuICAgIGNvbnNvbGUud2FybignUXVldWUuX2hhbmRsZVJlcGxheVJlc3BvbnNlOiBSZXBsYXlNYXAgbm90IGF2YWlsYWJsZScpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICghcmVwbGF5SWQpIHtcbiAgICBjb25zb2xlLndhcm4oJ1F1ZXVlLl9oYW5kbGVSZXBsYXlSZXNwb25zZTogTm8gcmVwbGF5SWQgcHJvdmlkZWQnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIFN1Y2Nlc3MgY29uZGl0aW9uIG1pZ2h0IG5lZWQgYWRqdXN0bWVudCBiYXNlZCBvbiBBUEkgcmVzcG9uc2Ugc3RydWN0dXJlXG4gICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmVyciA9PT0gMCkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5yZXBsYXlNYXAuc2VuZChyZXBsYXlJZCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlcGxheU1hcC5kaXNjYXJkKHJlcGxheUlkKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgaGFuZGxpbmcgcmVwbGF5IHJlc3BvbnNlOicsIGVycm9yKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG4vKlxuICogUmF0ZUxpbWl0ZXIgLSBhbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgdGhlIGxvZ2ljIGZvciBjb3VudGluZyBpdGVtcyBzZW50IHRvIFJvbGxiYXJcbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyAtIHRoZSBzYW1lIG9wdGlvbnMgdGhhdCBhcmUgYWNjZXB0ZWQgYnkgY29uZmlndXJlR2xvYmFsIG9mZmVyZWQgYXMgYSBjb252ZW5pZW5jZVxuICovXG5mdW5jdGlvbiBSYXRlTGltaXRlcihvcHRpb25zKSB7XG4gIHRoaXMuc3RhcnRUaW1lID0gXy5ub3coKTtcbiAgdGhpcy5jb3VudGVyID0gMDtcbiAgdGhpcy5wZXJNaW5Db3VudGVyID0gMDtcbiAgdGhpcy5wbGF0Zm9ybSA9IG51bGw7XG4gIHRoaXMucGxhdGZvcm1PcHRpb25zID0ge307XG4gIHRoaXMuY29uZmlndXJlR2xvYmFsKG9wdGlvbnMpO1xufVxuXG5SYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncyA9IHtcbiAgc3RhcnRUaW1lOiBfLm5vdygpLFxuICBtYXhJdGVtczogdW5kZWZpbmVkLFxuICBpdGVtc1Blck1pbnV0ZTogdW5kZWZpbmVkLFxufTtcblxuLypcbiAqIGNvbmZpZ3VyZUdsb2JhbCAtIHNldCB0aGUgZ2xvYmFsIHJhdGUgbGltaXRlciBvcHRpb25zXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSBPbmx5IHRoZSBmb2xsb3dpbmcgdmFsdWVzIGFyZSByZWNvZ25pemVkOlxuICogICAgc3RhcnRUaW1lOiBhIHRpbWVzdGFtcCBvZiB0aGUgZm9ybSByZXR1cm5lZCBieSAobmV3IERhdGUoKSkuZ2V0VGltZSgpXG4gKiAgICBtYXhJdGVtczogdGhlIG1heGltdW0gaXRlbXNcbiAqICAgIGl0ZW1zUGVyTWludXRlOiB0aGUgbWF4IG51bWJlciBvZiBpdGVtcyB0byBzZW5kIGluIGEgZ2l2ZW4gbWludXRlXG4gKi9cblJhdGVMaW1pdGVyLnByb3RvdHlwZS5jb25maWd1cmVHbG9iYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5zdGFydFRpbWUgIT09IHVuZGVmaW5lZCkge1xuICAgIFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICB9XG4gIGlmIChvcHRpb25zLm1heEl0ZW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICBSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5tYXhJdGVtcyA9IG9wdGlvbnMubWF4SXRlbXM7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaXRlbXNQZXJNaW51dGUgIT09IHVuZGVmaW5lZCkge1xuICAgIFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLml0ZW1zUGVyTWludXRlID0gb3B0aW9ucy5pdGVtc1Blck1pbnV0ZTtcbiAgfVxufTtcblxuLypcbiAqIHNob3VsZFNlbmQgLSBkZXRlcm1pbmUgaWYgd2Ugc2hvdWxkIHNlbmQgYSBnaXZlbiBpdGVtIGJhc2VkIG9uIHJhdGUgbGltaXQgc2V0dGluZ3NcbiAqXG4gKiBAcGFyYW0gaXRlbSAtIHRoZSBpdGVtIHdlIGFyZSBhYm91dCB0byBzZW5kXG4gKiBAcmV0dXJucyBBbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAqICBlcnJvcjogKEVycm9yfG51bGwpXG4gKiAgc2hvdWxkU2VuZDogYm9vbFxuICogIHBheWxvYWQ6IChPYmplY3R8bnVsbClcbiAqICBJZiBzaG91bGRTZW5kIGlzIGZhbHNlLCB0aGUgaXRlbSBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIgc2hvdWxkIG5vdCBiZSBzZW50IHRvIFJvbGxiYXIsIGFuZFxuICogIGV4YWN0bHkgb25lIG9mIGVycm9yIG9yIHBheWxvYWQgd2lsbCBiZSBub24tbnVsbC4gSWYgZXJyb3IgaXMgbm9uLW51bGwsIHRoZSByZXR1cm5lZCBFcnJvciB3aWxsXG4gKiAgZGVzY3JpYmUgdGhlIHNpdHVhdGlvbiwgYnV0IGl0IG1lYW5zIHRoYXQgd2Ugd2VyZSBhbHJlYWR5IG92ZXIgYSByYXRlIGxpbWl0IChlaXRoZXIgZ2xvYmFsbHkgb3JcbiAqICBwZXIgbWludXRlKSB3aGVuIHRoaXMgaXRlbSB3YXMgY2hlY2tlZC4gSWYgZXJyb3IgaXMgbnVsbCwgYW5kIHRoZXJlZm9yZSBwYXlsb2FkIGlzIG5vbi1udWxsLCBpdFxuICogIG1lYW5zIHRoaXMgaXRlbSBwdXQgdXMgb3ZlciB0aGUgZ2xvYmFsIHJhdGUgbGltaXQgYW5kIHRoZSBwYXlsb2FkIHNob3VsZCBiZSBzZW50IHRvIFJvbGxiYXIgaW5cbiAqICBwbGFjZSBvZiB0aGUgcGFzc2VkIGluIGl0ZW0uXG4gKi9cblJhdGVMaW1pdGVyLnByb3RvdHlwZS5zaG91bGRTZW5kID0gZnVuY3Rpb24gKGl0ZW0sIG5vdykge1xuICBub3cgPSBub3cgfHwgXy5ub3coKTtcbiAgdmFyIGVsYXBzZWRUaW1lID0gbm93IC0gdGhpcy5zdGFydFRpbWU7XG4gIGlmIChlbGFwc2VkVGltZSA8IDAgfHwgZWxhcHNlZFRpbWUgPj0gNjAwMDApIHtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG5vdztcbiAgICB0aGlzLnBlck1pbkNvdW50ZXIgPSAwO1xuICB9XG5cbiAgdmFyIGdsb2JhbFJhdGVMaW1pdCA9IFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLm1heEl0ZW1zO1xuICB2YXIgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluID0gUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MuaXRlbXNQZXJNaW51dGU7XG5cbiAgaWYgKGNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXQsIHRoaXMuY291bnRlcikpIHtcbiAgICByZXR1cm4gc2hvdWxkU2VuZFZhbHVlKFxuICAgICAgdGhpcy5wbGF0Zm9ybSxcbiAgICAgIHRoaXMucGxhdGZvcm1PcHRpb25zLFxuICAgICAgZ2xvYmFsUmF0ZUxpbWl0ICsgJyBtYXggaXRlbXMgcmVhY2hlZCcsXG4gICAgICBmYWxzZSxcbiAgICApO1xuICB9IGVsc2UgaWYgKGNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXRQZXJNaW4sIHRoaXMucGVyTWluQ291bnRlcikpIHtcbiAgICByZXR1cm4gc2hvdWxkU2VuZFZhbHVlKFxuICAgICAgdGhpcy5wbGF0Zm9ybSxcbiAgICAgIHRoaXMucGxhdGZvcm1PcHRpb25zLFxuICAgICAgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluICsgJyBpdGVtcyBwZXIgbWludXRlIHJlYWNoZWQnLFxuICAgICAgZmFsc2UsXG4gICAgKTtcbiAgfVxuICB0aGlzLmNvdW50ZXIrKztcbiAgdGhpcy5wZXJNaW5Db3VudGVyKys7XG5cbiAgdmFyIHNob3VsZFNlbmQgPSAhY2hlY2tSYXRlKGl0ZW0sIGdsb2JhbFJhdGVMaW1pdCwgdGhpcy5jb3VudGVyKTtcbiAgdmFyIHBlck1pbnV0ZSA9IHNob3VsZFNlbmQ7XG4gIHNob3VsZFNlbmQgPVxuICAgIHNob3VsZFNlbmQgJiYgIWNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXRQZXJNaW4sIHRoaXMucGVyTWluQ291bnRlcik7XG4gIHJldHVybiBzaG91bGRTZW5kVmFsdWUoXG4gICAgdGhpcy5wbGF0Zm9ybSxcbiAgICB0aGlzLnBsYXRmb3JtT3B0aW9ucyxcbiAgICBudWxsLFxuICAgIHNob3VsZFNlbmQsXG4gICAgZ2xvYmFsUmF0ZUxpbWl0LFxuICAgIGdsb2JhbFJhdGVMaW1pdFBlck1pbixcbiAgICBwZXJNaW51dGUsXG4gICk7XG59O1xuXG5SYXRlTGltaXRlci5wcm90b3R5cGUuc2V0UGxhdGZvcm1PcHRpb25zID0gZnVuY3Rpb24gKHBsYXRmb3JtLCBvcHRpb25zKSB7XG4gIHRoaXMucGxhdGZvcm0gPSBwbGF0Zm9ybTtcbiAgdGhpcy5wbGF0Zm9ybU9wdGlvbnMgPSBvcHRpb25zO1xufTtcblxuLyogSGVscGVycyAqL1xuXG5mdW5jdGlvbiBjaGVja1JhdGUoaXRlbSwgbGltaXQsIGNvdW50ZXIpIHtcbiAgcmV0dXJuICFpdGVtLmlnbm9yZVJhdGVMaW1pdCAmJiBsaW1pdCA+PSAxICYmIGNvdW50ZXIgPiBsaW1pdDtcbn1cblxuZnVuY3Rpb24gc2hvdWxkU2VuZFZhbHVlKFxuICBwbGF0Zm9ybSxcbiAgb3B0aW9ucyxcbiAgZXJyb3IsXG4gIHNob3VsZFNlbmQsXG4gIGdsb2JhbFJhdGVMaW1pdCxcbiAgbGltaXRQZXJNaW4sXG4gIHBlck1pbnV0ZSxcbikge1xuICB2YXIgcGF5bG9hZCA9IG51bGw7XG4gIGlmIChlcnJvcikge1xuICAgIGVycm9yID0gbmV3IEVycm9yKGVycm9yKTtcbiAgfVxuICBpZiAoIWVycm9yICYmICFzaG91bGRTZW5kKSB7XG4gICAgcGF5bG9hZCA9IHJhdGVMaW1pdFBheWxvYWQoXG4gICAgICBwbGF0Zm9ybSxcbiAgICAgIG9wdGlvbnMsXG4gICAgICBnbG9iYWxSYXRlTGltaXQsXG4gICAgICBsaW1pdFBlck1pbixcbiAgICAgIHBlck1pbnV0ZSxcbiAgICApO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgc2hvdWxkU2VuZDogc2hvdWxkU2VuZCwgcGF5bG9hZDogcGF5bG9hZCB9O1xufVxuXG5mdW5jdGlvbiByYXRlTGltaXRQYXlsb2FkKFxuICBwbGF0Zm9ybSxcbiAgb3B0aW9ucyxcbiAgZ2xvYmFsUmF0ZUxpbWl0LFxuICBsaW1pdFBlck1pbixcbiAgcGVyTWludXRlLFxuKSB7XG4gIHZhciBlbnZpcm9ubWVudCA9XG4gICAgb3B0aW9ucy5lbnZpcm9ubWVudCB8fCAob3B0aW9ucy5wYXlsb2FkICYmIG9wdGlvbnMucGF5bG9hZC5lbnZpcm9ubWVudCk7XG4gIHZhciBtc2c7XG4gIGlmIChwZXJNaW51dGUpIHtcbiAgICBtc2cgPSAnaXRlbSBwZXIgbWludXRlIGxpbWl0IHJlYWNoZWQsIGlnbm9yaW5nIGVycm9ycyB1bnRpbCB0aW1lb3V0JztcbiAgfSBlbHNlIHtcbiAgICBtc2cgPSAnbWF4SXRlbXMgaGFzIGJlZW4gaGl0LCBpZ25vcmluZyBlcnJvcnMgdW50aWwgcmVzZXQuJztcbiAgfVxuICB2YXIgaXRlbSA9IHtcbiAgICBib2R5OiB7XG4gICAgICBtZXNzYWdlOiB7XG4gICAgICAgIGJvZHk6IG1zZyxcbiAgICAgICAgZXh0cmE6IHtcbiAgICAgICAgICBtYXhJdGVtczogZ2xvYmFsUmF0ZUxpbWl0LFxuICAgICAgICAgIGl0ZW1zUGVyTWludXRlOiBsaW1pdFBlck1pbixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBsYW5ndWFnZTogJ2phdmFzY3JpcHQnLFxuICAgIGVudmlyb25tZW50OiBlbnZpcm9ubWVudCxcbiAgICBub3RpZmllcjoge1xuICAgICAgdmVyc2lvbjpcbiAgICAgICAgKG9wdGlvbnMubm90aWZpZXIgJiYgb3B0aW9ucy5ub3RpZmllci52ZXJzaW9uKSB8fCBvcHRpb25zLnZlcnNpb24sXG4gICAgfSxcbiAgfTtcbiAgaWYgKHBsYXRmb3JtID09PSAnYnJvd3NlcicpIHtcbiAgICBpdGVtLnBsYXRmb3JtID0gJ2Jyb3dzZXInO1xuICAgIGl0ZW0uZnJhbWV3b3JrID0gJ2Jyb3dzZXItanMnO1xuICAgIGl0ZW0ubm90aWZpZXIubmFtZSA9ICdyb2xsYmFyLWJyb3dzZXItanMnO1xuICB9IGVsc2UgaWYgKHBsYXRmb3JtID09PSAnc2VydmVyJykge1xuICAgIGl0ZW0uZnJhbWV3b3JrID0gb3B0aW9ucy5mcmFtZXdvcmsgfHwgJ25vZGUtanMnO1xuICAgIGl0ZW0ubm90aWZpZXIubmFtZSA9IG9wdGlvbnMubm90aWZpZXIubmFtZTtcbiAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gJ3JlYWN0LW5hdGl2ZScpIHtcbiAgICBpdGVtLmZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrIHx8ICdyZWFjdC1uYXRpdmUnO1xuICAgIGl0ZW0ubm90aWZpZXIubmFtZSA9IG9wdGlvbnMubm90aWZpZXIubmFtZTtcbiAgfVxuICByZXR1cm4gaXRlbTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSYXRlTGltaXRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xudmFyIGxvZ2dlciA9IHtcbiAgZXJyb3I6IGNvbnNvbGUuZXJyb3IuYmluZChjb25zb2xlKSxcbiAgaW5mbzogY29uc29sZS5pbmZvLmJpbmQoY29uc29sZSksXG4gIGxvZzogY29uc29sZS5sb2cuYmluZChjb25zb2xlKSxcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBsb2dnZXI7XG4iLCJ2YXIgcGFja2FnZUpzb24gPSByZXF1aXJlKCcuLi8uLi9wYWNrYWdlLmpzb24nKTtcbnZhciBDbGllbnQgPSByZXF1aXJlKCcuLi9yb2xsYmFyJyk7XG52YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcbnZhciBBUEkgPSByZXF1aXJlKCcuLi9hcGknKTtcbnZhciBsb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcicpO1xuXG52YXIgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKTtcbnZhciB1cmxsaWIgPSByZXF1aXJlKCcuLi9icm93c2VyL3VybCcpO1xuXG52YXIgVGVsZW1ldGVyID0gcmVxdWlyZSgnLi4vdGVsZW1ldHJ5Jyk7XG52YXIgdHJhbnNmb3JtcyA9IHJlcXVpcmUoJy4vdHJhbnNmb3JtcycpO1xudmFyIHNoYXJlZFRyYW5zZm9ybXMgPSByZXF1aXJlKCcuLi90cmFuc2Zvcm1zJyk7XG52YXIgc2hhcmVkUHJlZGljYXRlcyA9IHJlcXVpcmUoJy4uL3ByZWRpY2F0ZXMnKTtcbnZhciB0cnVuY2F0aW9uID0gcmVxdWlyZSgnLi4vdHJ1bmNhdGlvbicpO1xudmFyIHBvbHlmaWxsSlNPTiA9IHJlcXVpcmUoJy4uLy4uL3ZlbmRvci9KU09OLWpzL2pzb24zJyk7XG5cbmZ1bmN0aW9uIFJvbGxiYXIob3B0aW9ucywgY2xpZW50KSB7XG4gIGlmIChfLmlzVHlwZShvcHRpb25zLCAnc3RyaW5nJykpIHtcbiAgICB2YXIgYWNjZXNzVG9rZW4gPSBvcHRpb25zO1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgICBvcHRpb25zLmFjY2Vzc1Rva2VuID0gYWNjZXNzVG9rZW47XG4gIH1cbiAgdGhpcy5vcHRpb25zID0gXy5oYW5kbGVPcHRpb25zKFJvbGxiYXIuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIG51bGwsIGxvZ2dlcik7XG4gIHRoaXMub3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnMgPSBvcHRpb25zO1xuICAvLyBUaGlzIG1ha2VzIG5vIHNlbnNlIGluIGEgbG9uZyBydW5uaW5nIGFwcFxuICBkZWxldGUgdGhpcy5vcHRpb25zLm1heEl0ZW1zO1xuICB0aGlzLm9wdGlvbnMuZW52aXJvbm1lbnQgPSB0aGlzLm9wdGlvbnMuZW52aXJvbm1lbnQgfHwgJ3Vuc3BlY2lmaWVkJztcblxuICB2YXIgdHJhbnNwb3J0ID0gbmV3IFRyYW5zcG9ydCh0cnVuY2F0aW9uKTtcbiAgdmFyIGFwaSA9IG5ldyBBUEkodGhpcy5vcHRpb25zLCB0cmFuc3BvcnQsIHVybGxpYiwgdHJ1bmNhdGlvbik7XG4gIHZhciB0ZWxlbWV0ZXIgPSBuZXcgVGVsZW1ldGVyKHRoaXMub3B0aW9ucyk7XG4gIHRoaXMuY2xpZW50ID1cbiAgICBjbGllbnQgfHwgbmV3IENsaWVudCh0aGlzLm9wdGlvbnMsIGFwaSwgbG9nZ2VyLCB0ZWxlbWV0ZXIsIG51bGwsIG51bGwsICdyZWFjdC1uYXRpdmUnKTtcbiAgYWRkVHJhbnNmb3Jtc1RvTm90aWZpZXIodGhpcy5jbGllbnQubm90aWZpZXIpO1xuICBhZGRQcmVkaWNhdGVzVG9RdWV1ZSh0aGlzLmNsaWVudC5xdWV1ZSk7XG4gIF8uc2V0dXBKU09OKHBvbHlmaWxsSlNPTik7XG59XG5cbnZhciBfaW5zdGFuY2UgPSBudWxsO1xuUm9sbGJhci5pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNsaWVudCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5nbG9iYWwob3B0aW9ucykuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG4gIF9pbnN0YW5jZSA9IG5ldyBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCk7XG4gIHJldHVybiBfaW5zdGFuY2U7XG59O1xuXG5mdW5jdGlvbiBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spIHtcbiAgdmFyIG1lc3NhZ2UgPSAnUm9sbGJhciBpcyBub3QgaW5pdGlhbGl6ZWQnO1xuICBsb2dnZXIuZXJyb3IobWVzc2FnZSk7XG4gIGlmIChtYXliZUNhbGxiYWNrKSB7XG4gICAgbWF5YmVDYWxsYmFjayhuZXcgRXJyb3IobWVzc2FnZSkpO1xuICB9XG59XG5cblJvbGxiYXIucHJvdG90eXBlLmdsb2JhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHRoaXMuY2xpZW50Lmdsb2JhbChvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuUm9sbGJhci5nbG9iYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5nbG9iYWwob3B0aW9ucyk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucywgcGF5bG9hZERhdGEpIHtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHZhciBwYXlsb2FkID0ge307XG4gIGlmIChwYXlsb2FkRGF0YSkge1xuICAgIHBheWxvYWQgPSB7IHBheWxvYWQ6IHBheWxvYWREYXRhIH07XG4gIH1cbiAgdGhpcy5vcHRpb25zID0gXy5oYW5kbGVPcHRpb25zKG9sZE9wdGlvbnMsIG9wdGlvbnMsIHBheWxvYWQsIGxvZ2dlcik7XG4gIHRoaXMub3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnMgPSBfLmhhbmRsZU9wdGlvbnMoXG4gICAgb2xkT3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnMsXG4gICAgb3B0aW9ucyxcbiAgICBwYXlsb2FkLFxuICApO1xuICB0aGlzLmNsaWVudC5jb25maWd1cmUob3B0aW9ucywgcGF5bG9hZERhdGEpO1xuICByZXR1cm4gdGhpcztcbn07XG5Sb2xsYmFyLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXlsb2FkRGF0YSkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5jb25maWd1cmUob3B0aW9ucywgcGF5bG9hZERhdGEpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUubGFzdEVycm9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5jbGllbnQubGFzdEVycm9yO1xufTtcblJvbGxiYXIubGFzdEVycm9yID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5sYXN0RXJyb3IoKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKCk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC5sb2coaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UubG9nLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQuZGVidWcoaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLmRlYnVnID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5kZWJ1Zy5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQuaW5mbyhpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIuaW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuaW5mby5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLndhcm4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQud2FybihpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIud2FybiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2Uud2Fybi5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQud2FybmluZyhpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIud2FybmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2Uud2FybmluZy5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50LmVycm9yKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci5lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuZXJyb3IuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuUm9sbGJhci5wcm90b3R5cGUuX3VuY2F1Z2h0RXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICBpdGVtLl9pc1VuY2F1Z2h0ID0gdHJ1ZTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50LmVycm9yKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jcml0aWNhbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC5jcml0aWNhbChpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIuY3JpdGljYWwgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmNyaXRpY2FsLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuYnVpbGRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHJldHVybiB0aGlzLmNsaWVudC5idWlsZEpzb25QYXlsb2FkKGl0ZW0pO1xufTtcblJvbGxiYXIuYnVpbGRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuYnVpbGRKc29uUGF5bG9hZC5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5zZW5kSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoanNvblBheWxvYWQpIHtcbiAgcmV0dXJuIHRoaXMuY2xpZW50LnNlbmRKc29uUGF5bG9hZChqc29uUGF5bG9hZCk7XG59O1xuUm9sbGJhci5zZW5kSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLnNlbmRKc29uUGF5bG9hZC5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YWl0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMuY2xpZW50LndhaXQoY2FsbGJhY2spO1xufTtcblJvbGxiYXIud2FpdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS53YWl0KGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY2FwdHVyZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXZlbnQgPSBfLmNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzLmNsaWVudC5jYXB0dXJlRXZlbnQoZXZlbnQudHlwZSwgZXZlbnQubWV0YWRhdGEsIGV2ZW50LmxldmVsKTtcbn07XG5Sb2xsYmFyLmNhcHR1cmVFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuY2FwdHVyZUV2ZW50LmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKCk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLnNldFBlcnNvbiA9IGZ1bmN0aW9uIChwZXJzb25JbmZvKSB7XG4gIHRoaXMuY29uZmlndXJlKHt9LCB7IHBlcnNvbjogcGVyc29uSW5mbyB9KTtcbn07XG5Sb2xsYmFyLnNldFBlcnNvbiA9IGZ1bmN0aW9uIChwZXJzb25JbmZvKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLnNldFBlcnNvbihwZXJzb25JbmZvKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKCk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNsZWFyUGVyc29uID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmNvbmZpZ3VyZSh7fSwgeyBwZXJzb246IHt9IH0pO1xufTtcblJvbGxiYXIuY2xlYXJQZXJzb24gPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmNsZWFyUGVyc29uKCk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG4vKiogSW50ZXJuYWwgKiovXG5mdW5jdGlvbiBhZGRUcmFuc2Zvcm1zVG9Ob3RpZmllcihub3RpZmllcikge1xuICBub3RpZmllclxuICAgIC5hZGRUcmFuc2Zvcm0odHJhbnNmb3Jtcy5iYXNlRGF0YSlcbiAgICAuYWRkVHJhbnNmb3JtKHRyYW5zZm9ybXMuaGFuZGxlSXRlbVdpdGhFcnJvcilcbiAgICAuYWRkVHJhbnNmb3JtKHRyYW5zZm9ybXMuYWRkQm9keSlcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMuYWRkTWVzc2FnZVdpdGhFcnJvcilcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMuYWRkVGVsZW1ldHJ5RGF0YSlcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMuYWRkQ29uZmlnVG9QYXlsb2FkKVxuICAgIC5hZGRUcmFuc2Zvcm0odHJhbnNmb3Jtcy5zY3J1YlBheWxvYWQpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLmFkZFBheWxvYWRPcHRpb25zKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy51c2VyVHJhbnNmb3JtKGxvZ2dlcikpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLmFkZENvbmZpZ3VyZWRPcHRpb25zKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGREaWFnbm9zdGljS2V5cylcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMuaXRlbVRvUGF5bG9hZCk7XG59XG5cbmZ1bmN0aW9uIGFkZFByZWRpY2F0ZXNUb1F1ZXVlKHF1ZXVlKSB7XG4gIHF1ZXVlXG4gICAgLmFkZFByZWRpY2F0ZShzaGFyZWRQcmVkaWNhdGVzLmNoZWNrTGV2ZWwpXG4gICAgLmFkZFByZWRpY2F0ZShzaGFyZWRQcmVkaWNhdGVzLnVzZXJDaGVja0lnbm9yZShsb2dnZXIpKTtcbn1cblxuUm9sbGJhci5wcm90b3R5cGUuX2NyZWF0ZUl0ZW0gPSBmdW5jdGlvbiAoYXJncykge1xuICByZXR1cm4gXy5jcmVhdGVJdGVtKGFyZ3MsIGxvZ2dlciwgdGhpcyk7XG59O1xuXG5mdW5jdGlvbiBfZ2V0Rmlyc3RGdW5jdGlvbihhcmdzKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihhcmdzW2ldKSkge1xuICAgICAgcmV0dXJuIGFyZ3NbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblJvbGxiYXIuZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnLFxuICBwbGF0Zm9ybTogJ2NsaWVudCcsXG4gIGZyYW1ld29yazogJ3JlYWN0LW5hdGl2ZScsXG4gIHNob3dSZXBvcnRlZE1lc3NhZ2VUcmFjZXM6IGZhbHNlLFxuICBub3RpZmllcjoge1xuICAgIG5hbWU6ICdyb2xsYmFyLXJlYWN0LW5hdGl2ZScsXG4gICAgdmVyc2lvbjogcGFja2FnZUpzb24udmVyc2lvbixcbiAgfSxcbiAgc2NydWJIZWFkZXJzOiBwYWNrYWdlSnNvbi5kZWZhdWx0cy5zZXJ2ZXIuc2NydWJIZWFkZXJzLFxuICBzY3J1YkZpZWxkczogcGFja2FnZUpzb24uZGVmYXVsdHMuc2VydmVyLnNjcnViRmllbGRzLFxuICByZXBvcnRMZXZlbDogcGFja2FnZUpzb24uZGVmYXVsdHMucmVwb3J0TGV2ZWwsXG4gIHJld3JpdGVGaWxlbmFtZVBhdHRlcm5zOlxuICAgIHBhY2thZ2VKc29uLmRlZmF1bHRzLnJlYWN0TmF0aXZlLnJld3JpdGVGaWxlbmFtZVBhdHRlcm5zLFxuICB2ZXJib3NlOiBmYWxzZSxcbiAgZW5hYmxlZDogdHJ1ZSxcbiAgdHJhbnNtaXQ6IHRydWUsXG4gIHNlbmRDb25maWc6IGZhbHNlLFxuICBpbmNsdWRlSXRlbXNJblRlbGVtZXRyeTogdHJ1ZSxcbiAgaWdub3JlRHVwbGljYXRlRXJyb3JzOiB0cnVlLFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb2xsYmFyO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG52YXIgc2NydWIgPSByZXF1aXJlKCcuLi9zY3J1YicpO1xudmFyIGVycm9yUGFyc2VyID0gcmVxdWlyZSgnLi4vZXJyb3JQYXJzZXInKTtcblxuZnVuY3Rpb24gYmFzZURhdGEoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGVudmlyb25tZW50ID1cbiAgICAob3B0aW9ucy5wYXlsb2FkICYmIG9wdGlvbnMucGF5bG9hZC5lbnZpcm9ubWVudCkgfHwgb3B0aW9ucy5lbnZpcm9ubWVudDtcbiAgdmFyIGRhdGEgPSB7XG4gICAgdGltZXN0YW1wOiBNYXRoLnJvdW5kKGl0ZW0udGltZXN0YW1wIC8gMTAwMCksXG4gICAgZW52aXJvbm1lbnQ6IGl0ZW0uZW52aXJvbm1lbnQgfHwgZW52aXJvbm1lbnQsXG4gICAgbGV2ZWw6IGl0ZW0ubGV2ZWwgfHwgJ2Vycm9yJyxcbiAgICBwbGF0Zm9ybTogb3B0aW9ucy5wbGF0Zm9ybSB8fCAnY2xpZW50JyxcbiAgICBsYW5ndWFnZTogJ2phdmFzY3JpcHQnLFxuICAgIGZyYW1ld29yazogaXRlbS5mcmFtZXdvcmsgfHwgb3B0aW9ucy5mcmFtZXdvcmssXG4gICAgdXVpZDogaXRlbS51dWlkLFxuICAgIG5vdGlmaWVyOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMubm90aWZpZXIpKSxcbiAgICBjdXN0b206IGl0ZW0uY3VzdG9tLFxuICB9O1xuXG4gIGlmIChvcHRpb25zLmNvZGVWZXJzaW9uKSB7XG4gICAgZGF0YS5jb2RlX3ZlcnNpb24gPSBvcHRpb25zLmNvZGVWZXJzaW9uO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuY29kZV92ZXJzaW9uKSB7XG4gICAgZGF0YS5jb2RlX3ZlcnNpb24gPSBvcHRpb25zLmNvZGVfdmVyc2lvbjtcbiAgfVxuXG4gIHZhciBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGl0ZW0uY3VzdG9tIHx8IHt9KTtcbiAgcHJvcHMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgZGF0YVtuYW1lXSA9IGl0ZW0uY3VzdG9tW25hbWVdO1xuICAgIH1cbiAgfSk7XG5cbiAgaXRlbS5kYXRhID0gZGF0YTtcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZE1lc3NhZ2VEYXRhKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcbiAgaXRlbS5kYXRhLmJvZHkgPSBpdGVtLmRhdGEuYm9keSB8fCB7fTtcbiAgdmFyIG1lc3NhZ2UgPSBpdGVtLm1lc3NhZ2UgfHwgJ0l0ZW0gc2VudCB3aXRoIG51bGwgb3IgbWlzc2luZyBhcmd1bWVudHMuJztcbiAgaXRlbS5kYXRhLmJvZHkubWVzc2FnZSA9IHtcbiAgICBib2R5OiBtZXNzYWdlLFxuICB9O1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JEYXRhKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChpdGVtLnN0YWNrSW5mbykge1xuICAgIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcbiAgICBpdGVtLmRhdGEuYm9keSA9IGl0ZW0uZGF0YS5ib2R5IHx8IHt9O1xuICAgIGl0ZW0uZGF0YS5ib2R5LnRyYWNlID0gaXRlbS5zdGFja0luZm87XG4gIH1cbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZEJvZHkoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGl0ZW0uc3RhY2tJbmZvKSB7XG4gICAgYWRkRXJyb3JEYXRhKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBhZGRNZXNzYWdlRGF0YShpdGVtLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlSXRlbVdpdGhFcnJvcihpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoIWl0ZW0uZXJyKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuYWRkRXJyb3JDb250ZXh0KSB7XG4gICAgXy5hZGRFcnJvckNvbnRleHQoaXRlbSwgW2l0ZW0uZXJyXSk7XG4gIH1cblxuICB2YXIgZXJyID0gaXRlbS5lcnI7XG4gIHZhciBwYXJzZWRFcnJvciA9IGVycm9yUGFyc2VyLnBhcnNlKGVycik7XG4gIHZhciBndWVzcyA9IGVycm9yUGFyc2VyLmd1ZXNzRXJyb3JDbGFzcyhwYXJzZWRFcnJvci5tZXNzYWdlKTtcbiAgdmFyIG1lc3NhZ2UgPSBndWVzc1sxXTtcbiAgdmFyIHN0YWNrSW5mbyA9IHtcbiAgICBmcmFtZXM6IF9idWlsZEZyYW1lcyhwYXJzZWRFcnJvci5zdGFjaywgb3B0aW9ucyksXG4gICAgZXhjZXB0aW9uOiB7XG4gICAgICBjbGFzczogX2Vycm9yQ2xhc3MocGFyc2VkRXJyb3IubmFtZSwgZ3Vlc3NbMF0sIG9wdGlvbnMpLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICB9LFxuICB9O1xuICBpZiAoZXJyLmRlc2NyaXB0aW9uKSB7XG4gICAgc3RhY2tJbmZvLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbiA9IFN0cmluZyhlcnIuZGVzY3JpcHRpb24pO1xuICB9XG4gIGl0ZW0uc3RhY2tJbmZvID0gc3RhY2tJbmZvO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gc2NydWJQYXlsb2FkKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBzY3J1YkhlYWRlcnMgPSBvcHRpb25zLnNjcnViSGVhZGVycyB8fCBbXTtcbiAgdmFyIHNjcnViRmllbGRzID0gb3B0aW9ucy5zY3J1YkZpZWxkcyB8fCBbXTtcbiAgdmFyIHNjcnViUGF0aHMgPSBvcHRpb25zLnNjcnViUGF0aHMgfHwgW107XG4gIHNjcnViRmllbGRzID0gc2NydWJIZWFkZXJzLmNvbmNhdChzY3J1YkZpZWxkcyk7XG4gIGl0ZW0uZGF0YSA9IHNjcnViKGl0ZW0uZGF0YSwgc2NydWJGaWVsZHMsIHNjcnViUGF0aHMpO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuLyoqIEhlbHBlcnMgKiovXG5cbmZ1bmN0aW9uIF9lcnJvckNsYXNzKG5hbWUsIGd1ZXNzLCBvcHRpb25zKSB7XG4gIGlmIChuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5ndWVzc0Vycm9yQ2xhc3MpIHtcbiAgICByZXR1cm4gZ3Vlc3M7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8dW5rbm93bj4nO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZEZyYW1lcyhzdGFjaywgb3B0aW9ucykge1xuICBpZiAoIXN0YWNrKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGZyYW1lcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHN0YWNrRnJhbWUgPSBzdGFja1tpXTtcbiAgICB2YXIgZmlsZW5hbWUgPSBzdGFja0ZyYW1lLnVybCA/IF8uc2FuaXRpemVVcmwoc3RhY2tGcmFtZS51cmwpIDogJzx1bmtub3duPic7XG4gICAgdmFyIGZyYW1lID0ge1xuICAgICAgZmlsZW5hbWU6IF9yZXdyaXRlRmlsZW5hbWUoZmlsZW5hbWUsIG9wdGlvbnMpLFxuICAgICAgbGluZW5vOiBzdGFja0ZyYW1lLmxpbmUgfHwgbnVsbCxcbiAgICAgIG1ldGhvZDpcbiAgICAgICAgIXN0YWNrRnJhbWUuZnVuYyB8fCBzdGFja0ZyYW1lLmZ1bmMgPT09ICc/J1xuICAgICAgICAgID8gJ1thbm9ueW1vdXNdJ1xuICAgICAgICAgIDogc3RhY2tGcmFtZS5mdW5jLFxuICAgICAgY29sbm86IHN0YWNrRnJhbWUuY29sdW1uLFxuICAgIH07XG4gICAgZnJhbWVzLnB1c2goZnJhbWUpO1xuICB9XG4gIHJldHVybiBmcmFtZXM7XG59XG5cbmZ1bmN0aW9uIF9yZXdyaXRlRmlsZW5hbWUoZmlsZW5hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIG1hdGNoID0gZmlsZW5hbWUgJiYgZmlsZW5hbWUubWF0Y2ggJiYgX21hdGNoRmlsZW5hbWUoZmlsZW5hbWUsIG9wdGlvbnMpO1xuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gJ2h0dHA6Ly9yZWFjdG5hdGl2ZWhvc3QvJyArIG1hdGNoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnaHR0cDovL3JlYWN0bmF0aXZlaG9zdC8nICsgZmlsZW5hbWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gX21hdGNoRmlsZW5hbWUoZmlsZW5hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIHBhdHRlcm5zID0gb3B0aW9ucy5yZXdyaXRlRmlsZW5hbWVQYXR0ZXJucyB8fCBbXTtcbiAgdmFyIGxlbmd0aCA9IHBhdHRlcm5zLmxlbmd0aCB8fCAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGF0dGVybiA9IG5ldyBSZWdFeHAocGF0dGVybnNbaV0pO1xuICAgIHZhciBtYXRjaCA9IGZpbGVuYW1lLm1hdGNoKHBhdHRlcm4pO1xuICAgIGlmIChtYXRjaCAmJiBtYXRjaFsxXSkge1xuICAgICAgcmV0dXJuIG1hdGNoWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJhc2VEYXRhOiBiYXNlRGF0YSxcbiAgaGFuZGxlSXRlbVdpdGhFcnJvcjogaGFuZGxlSXRlbVdpdGhFcnJvcixcbiAgYWRkQm9keTogYWRkQm9keSxcbiAgc2NydWJQYXlsb2FkOiBzY3J1YlBheWxvYWQsXG4gIF9tYXRjaEZpbGVuYW1lOiBfbWF0Y2hGaWxlbmFtZSwgLy8gdG8gZW5hYmxlIHVuaXQgdGVzdFxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xudmFyIGxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJyk7XG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXIvJykuQnVmZmVyO1xuXG5mdW5jdGlvbiBUcmFuc3BvcnQodHJ1bmNhdGlvbikge1xuICB0aGlzLnJhdGVMaW1pdEV4cGlyZXMgPSAwO1xuICB0aGlzLnRydW5jYXRpb24gPSB0cnVuY2F0aW9uO1xufVxuXG5UcmFuc3BvcnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKTtcbiAgdmFyIGhlYWRlcnMgPSBfaGVhZGVycyhhY2Nlc3NUb2tlbiwgb3B0aW9ucyk7XG4gIGZldGNoKF8uZm9ybWF0VXJsKG9wdGlvbnMpLCB7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICBfaGFuZGxlUmVzcG9uc2UocmVzcCwgY2FsbGJhY2spO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfSk7XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBheWxvYWQsIGNhbGxiYWNrKSB7XG4gIGlmICghY2FsbGJhY2sgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdDYW5ub3Qgc2VuZCBlbXB0eSByZXF1ZXN0JykpO1xuICB9XG5cbiAgdmFyIHN0cmluZ2lmeVJlc3VsdDtcbiAgaWYgKHRoaXMudHJ1bmNhdGlvbikge1xuICAgIHN0cmluZ2lmeVJlc3VsdCA9IHRoaXMudHJ1bmNhdGlvbi50cnVuY2F0ZShwYXlsb2FkKTtcbiAgfSBlbHNlIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSBfLnN0cmluZ2lmeShwYXlsb2FkKTtcbiAgfVxuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdQcm9ibGVtIHN0cmluZ2lmeWluZyBwYXlsb2FkLiBHaXZpbmcgdXAnKTtcbiAgICByZXR1cm4gY2FsbGJhY2soc3RyaW5naWZ5UmVzdWx0LmVycm9yKTtcbiAgfVxuICB2YXIgd3JpdGVEYXRhID0gc3RyaW5naWZ5UmVzdWx0LnZhbHVlO1xuICB2YXIgaGVhZGVycyA9IF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCB3cml0ZURhdGEpO1xuXG4gIF9tYWtlUmVxdWVzdChoZWFkZXJzLCBvcHRpb25zLCB3cml0ZURhdGEsIGNhbGxiYWNrKTtcbn07XG5cblRyYW5zcG9ydC5wcm90b3R5cGUucG9zdEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKFxuICBhY2Nlc3NUb2tlbixcbiAgb3B0aW9ucyxcbiAganNvblBheWxvYWQsXG4gIGNhbGxiYWNrLFxuKSB7XG4gIGlmICghY2FsbGJhY2sgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoIWpzb25QYXlsb2FkKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignQ2Fubm90IHNlbmQgZW1wdHkgcmVxdWVzdCcpKTtcbiAgfVxuICB2YXIgaGVhZGVycyA9IF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBqc29uUGF5bG9hZCk7XG5cbiAgX21ha2VSZXF1ZXN0KGhlYWRlcnMsIG9wdGlvbnMsIGpzb25QYXlsb2FkLCBjYWxsYmFjayk7XG59O1xuXG4vKiogSGVscGVycyAqKi9cbmZ1bmN0aW9uIF9tYWtlUmVxdWVzdChoZWFkZXJzLCBvcHRpb25zLCBkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgdXJsID0gXy5mb3JtYXRVcmwob3B0aW9ucyk7XG4gIGZldGNoKHVybCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgYm9keTogZGF0YSxcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgcmV0dXJuIHJlc3AuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIF9oYW5kbGVSZXNwb25zZShkYXRhLCBfd3JhcFBvc3RDYWxsYmFjayhjYWxsYmFjaykpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBkYXRhKSB7XG4gIHZhciBoZWFkZXJzID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5oZWFkZXJzKSB8fCB7fTtcbiAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbic7XG4gIGlmIChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPSBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhLCAndXRmOCcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcignQ291bGQgbm90IGdldCB0aGUgY29udGVudCBsZW5ndGggb2YgdGhlIGRhdGEnKTtcbiAgICB9XG4gIH1cbiAgaGVhZGVyc1snWC1Sb2xsYmFyLUFjY2Vzcy1Ub2tlbiddID0gYWNjZXNzVG9rZW47XG4gIHJldHVybiBoZWFkZXJzO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlUmVzcG9uc2UoZGF0YSwgY2FsbGJhY2spIHtcbiAgaWYgKGRhdGEuZXJyKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdSZWNlaXZlZCBlcnJvcjogJyArIGRhdGEubWVzc2FnZSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKFxuICAgICAgbmV3IEVycm9yKCdBcGkgZXJyb3I6ICcgKyAoZGF0YS5tZXNzYWdlIHx8ICdVbmtub3duIGVycm9yJykpLFxuICAgICk7XG4gIH1cblxuICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gX3dyYXBQb3N0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICB9XG4gICAgaWYgKGRhdGEucmVzdWx0ICYmIGRhdGEucmVzdWx0LnV1aWQpIHtcbiAgICAgIGxvZ2dlci5sb2coXG4gICAgICAgIFtcbiAgICAgICAgICAnU3VjY2Vzc2Z1bCBhcGkgcmVzcG9uc2UuJyxcbiAgICAgICAgICAnIExpbms6IGh0dHBzOi8vcm9sbGJhci5jb20vb2NjdXJyZW5jZS91dWlkLz91dWlkPScgK1xuICAgICAgICAgICAgZGF0YS5yZXN1bHQudXVpZCxcbiAgICAgICAgXS5qb2luKCcnKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5sb2coJ1N1Y2Nlc3NmdWwgYXBpIHJlc3BvbnNlJyk7XG4gICAgfVxuICAgIGNhbGxiYWNrKG51bGwsIGRhdGEucmVzdWx0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG4iLCJjb25zdCBSYXRlTGltaXRlciA9IHJlcXVpcmUoJy4vcmF0ZUxpbWl0ZXInKTtcbmNvbnN0IFF1ZXVlID0gcmVxdWlyZSgnLi9xdWV1ZScpO1xuY29uc3QgTm90aWZpZXIgPSByZXF1aXJlKCcuL25vdGlmaWVyJyk7XG5jb25zdCBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbi8qXG4gKiBSb2xsYmFyIC0gdGhlIGludGVyZmFjZSB0byBSb2xsYmFyXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEBwYXJhbSBhcGlcbiAqIEBwYXJhbSBsb2dnZXJcbiAqL1xuZnVuY3Rpb24gUm9sbGJhcihvcHRpb25zLCBhcGksIGxvZ2dlciwgdGVsZW1ldGVyLCB0cmFjaW5nLCByZXBsYXlNYXAsIHBsYXRmb3JtKSB7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob3B0aW9ucyk7XG4gIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICBSb2xsYmFyLnJhdGVMaW1pdGVyLmNvbmZpZ3VyZUdsb2JhbCh0aGlzLm9wdGlvbnMpO1xuICBSb2xsYmFyLnJhdGVMaW1pdGVyLnNldFBsYXRmb3JtT3B0aW9ucyhwbGF0Zm9ybSwgdGhpcy5vcHRpb25zKTtcbiAgdGhpcy5hcGkgPSBhcGk7XG4gIHRoaXMucXVldWUgPSBuZXcgUXVldWUoUm9sbGJhci5yYXRlTGltaXRlciwgYXBpLCBsb2dnZXIsIHRoaXMub3B0aW9ucywgcmVwbGF5TWFwKTtcblxuICB0aGlzLnRyYWNpbmcgPSB0cmFjaW5nO1xuXG4gIC8vIExlZ2FjeSBPcGVuVHJhY2luZyBzdXBwb3J0XG4gIC8vIFRoaXMgbXVzdCBoYXBwZW4gYmVmb3JlIHRoZSBOb3RpZmllciBpcyBjcmVhdGVkXG4gIHZhciB0cmFjZXIgPSB0aGlzLm9wdGlvbnMudHJhY2VyIHx8IG51bGw7XG4gIGlmICh2YWxpZGF0ZVRyYWNlcih0cmFjZXIpKSB7XG4gICAgdGhpcy50cmFjZXIgPSB0cmFjZXI7XG4gICAgLy8gc2V0IHRvIGEgc3RyaW5nIGZvciBhcGkgcmVzcG9uc2Ugc2VyaWFsaXphdGlvblxuICAgIHRoaXMub3B0aW9ucy50cmFjZXIgPSAnb3BlbnRyYWNpbmctdHJhY2VyLWVuYWJsZWQnO1xuICAgIHRoaXMub3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnMudHJhY2VyID0gJ29wZW50cmFjaW5nLXRyYWNlci1lbmFibGVkJztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRyYWNlciA9IG51bGw7XG4gIH1cblxuICB0aGlzLm5vdGlmaWVyID0gbmV3IE5vdGlmaWVyKHRoaXMucXVldWUsIHRoaXMub3B0aW9ucyk7XG4gIHRoaXMudGVsZW1ldGVyID0gdGVsZW1ldGVyO1xuICBzZXRTdGFja1RyYWNlTGltaXQob3B0aW9ucyk7XG4gIHRoaXMubGFzdEVycm9yID0gbnVsbDtcbiAgdGhpcy5sYXN0RXJyb3JIYXNoID0gJ25vbmUnO1xufVxuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIG1heEl0ZW1zOiAwLFxuICBpdGVtc1Blck1pbnV0ZTogNjAsXG59O1xuXG5Sb2xsYmFyLnJhdGVMaW1pdGVyID0gbmV3IFJhdGVMaW1pdGVyKGRlZmF1bHRPcHRpb25zKTtcblxuUm9sbGJhci5wcm90b3R5cGUuZ2xvYmFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgUm9sbGJhci5yYXRlTGltaXRlci5jb25maWd1cmVHbG9iYWwob3B0aW9ucyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBheWxvYWREYXRhKSB7XG4gIHZhciBvbGRPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB2YXIgcGF5bG9hZCA9IHt9O1xuICBpZiAocGF5bG9hZERhdGEpIHtcbiAgICBwYXlsb2FkID0geyBwYXlsb2FkOiBwYXlsb2FkRGF0YSB9O1xuICB9XG5cbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZShvbGRPcHRpb25zLCBvcHRpb25zLCBwYXlsb2FkKTtcblxuICAvLyBMZWdhY3kgT3BlblRyYWNpbmcgc3VwcG9ydFxuICAvLyBUaGlzIG11c3QgaGFwcGVuIGJlZm9yZSB0aGUgTm90aWZpZXIgaXMgY29uZmlndXJlZFxuICB2YXIgdHJhY2VyID0gdGhpcy5vcHRpb25zLnRyYWNlciB8fCBudWxsO1xuICBpZiAodmFsaWRhdGVUcmFjZXIodHJhY2VyKSkge1xuICAgIHRoaXMudHJhY2VyID0gdHJhY2VyO1xuICAgIC8vIHNldCB0byBhIHN0cmluZyBmb3IgYXBpIHJlc3BvbnNlIHNlcmlhbGl6YXRpb25cbiAgICB0aGlzLm9wdGlvbnMudHJhY2VyID0gJ29wZW50cmFjaW5nLXRyYWNlci1lbmFibGVkJztcbiAgICB0aGlzLm9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zLnRyYWNlciA9ICdvcGVudHJhY2luZy10cmFjZXItZW5hYmxlZCc7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50cmFjZXIgPSBudWxsO1xuICB9XG5cbiAgdGhpcy5ub3RpZmllciAmJiB0aGlzLm5vdGlmaWVyLmNvbmZpZ3VyZSh0aGlzLm9wdGlvbnMpO1xuICB0aGlzLnRlbGVtZXRlciAmJiB0aGlzLnRlbGVtZXRlci5jb25maWd1cmUodGhpcy5vcHRpb25zKTtcbiAgc2V0U3RhY2tUcmFjZUxpbWl0KG9wdGlvbnMpO1xuICB0aGlzLmdsb2JhbCh0aGlzLm9wdGlvbnMpO1xuXG4gIGlmICh2YWxpZGF0ZVRyYWNlcihvcHRpb25zLnRyYWNlcikpIHtcbiAgICB0aGlzLnRyYWNlciA9IG9wdGlvbnMudHJhY2VyO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgbGV2ZWwgPSB0aGlzLl9kZWZhdWx0TG9nTGV2ZWwoKTtcbiAgcmV0dXJuIHRoaXMuX2xvZyhsZXZlbCwgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5kZWJ1ZyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHRoaXMuX2xvZygnZGVidWcnLCBpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmluZm8gPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLl9sb2coJ2luZm8nLCBpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLndhcm4gPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLl9sb2coJ3dhcm5pbmcnLCBpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLndhcm5pbmcgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLl9sb2coJ3dhcm5pbmcnLCBpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCdlcnJvcicsIGl0ZW0pO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY3JpdGljYWwgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLl9sb2coJ2NyaXRpY2FsJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YWl0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMucXVldWUud2FpdChjYWxsYmFjayk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlRXZlbnQgPSBmdW5jdGlvbiAodHlwZSwgbWV0YWRhdGEsIGxldmVsKSB7XG4gIHJldHVybiB0aGlzLnRlbGVtZXRlciAmJiB0aGlzLnRlbGVtZXRlci5jYXB0dXJlRXZlbnQodHlwZSwgbWV0YWRhdGEsIGxldmVsKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNhcHR1cmVEb21Db250ZW50TG9hZGVkID0gZnVuY3Rpb24gKHRzKSB7XG4gIHJldHVybiB0aGlzLnRlbGVtZXRlciAmJiB0aGlzLnRlbGVtZXRlci5jYXB0dXJlRG9tQ29udGVudExvYWRlZCh0cyk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlTG9hZCA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZUxvYWQodHMpO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuYnVpbGRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHJldHVybiB0aGlzLmFwaS5idWlsZEpzb25QYXlsb2FkKGl0ZW0pO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuc2VuZEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKGpzb25QYXlsb2FkKSB7XG4gIHRoaXMuYXBpLnBvc3RKc29uUGF5bG9hZChqc29uUGF5bG9hZCk7XG59O1xuXG4vKiBJbnRlcm5hbCAqL1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fbG9nID0gZnVuY3Rpb24gKGRlZmF1bHRMZXZlbCwgaXRlbSkge1xuICB2YXIgY2FsbGJhY2s7XG4gIGlmIChpdGVtLmNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSBpdGVtLmNhbGxiYWNrO1xuICAgIGRlbGV0ZSBpdGVtLmNhbGxiYWNrO1xuICB9XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlRHVwbGljYXRlRXJyb3JzICYmIHRoaXMuX3NhbWVBc0xhc3RFcnJvcihpdGVtKSkge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdpZ25vcmVkIGlkZW50aWNhbCBpdGVtJyk7XG4gICAgICBlcnJvci5pdGVtID0gaXRlbTtcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdGhpcy5fYWRkVHJhY2luZ0F0dHJpYnV0ZXMoaXRlbSk7XG5cbiAgICAvLyBMZWdhY3kgT3BlblRyYWNpbmcgc3VwcG9ydFxuICAgIHRoaXMuX2FkZFRyYWNpbmdJbmZvKGl0ZW0pO1xuXG4gICAgaXRlbS5sZXZlbCA9IGl0ZW0ubGV2ZWwgfHwgZGVmYXVsdExldmVsO1xuXG5cbiAgICBjb25zdCB0ZWxlbWV0ZXIgPSB0aGlzLnRlbGVtZXRlcjtcbiAgICBpZiAodGVsZW1ldGVyKSB7XG4gICAgICB0ZWxlbWV0ZXIuX2NhcHR1cmVSb2xsYmFySXRlbShpdGVtKTtcbiAgICAgIGl0ZW0udGVsZW1ldHJ5RXZlbnRzID0gdGVsZW1ldGVyLmNvcHlFdmVudHMoKSB8fCBbXTtcblxuICAgICAgaWYgKHRlbGVtZXRlci50ZWxlbWV0cnlTcGFuKSB7XG4gICAgICAgIHRlbGVtZXRlci50ZWxlbWV0cnlTcGFuLmVuZCgpO1xuICAgICAgICB0ZWxlbWV0ZXIudGVsZW1ldHJ5U3BhbiA9IHRlbGVtZXRlci50cmFjaW5nLnN0YXJ0U3Bhbigncm9sbGJhci10ZWxlbWV0cnknLCB7fSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5ub3RpZmllci5sb2coaXRlbSwgY2FsbGJhY2spO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhlKTtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoZSk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLl9hZGRUcmFjaW5nQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIGNvbnN0IHNwYW4gPSB0aGlzLnRyYWNpbmc/LmdldFNwYW4oKTtcbiAgaWYgKCFzcGFuKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBbXG4gICAge2tleTogJ3Nlc3Npb25faWQnLCB2YWx1ZTogdGhpcy50cmFjaW5nLnNlc3Npb25JZH0sXG4gICAge2tleTogJ3NwYW5faWQnLCB2YWx1ZTogc3Bhbi5zcGFuSWR9LFxuICAgIHtrZXk6ICd0cmFjZV9pZCcsIHZhbHVlOiBzcGFuLnRyYWNlSWR9LFxuICBdO1xuICBfLmFkZEl0ZW1BdHRyaWJ1dGVzKGl0ZW0sIGF0dHJpYnV0ZXMpO1xuXG4gIHNwYW4uYWRkRXZlbnQoXG4gICAgJ3JvbGxiYXIub2NjdXJyZW5jZScsXG4gICAgW3trZXk6ICdyb2xsYmFyLm9jY3VycmVuY2UudXVpZCcsIHZhbHVlOiBpdGVtLnV1aWR9XSxcbiAgKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLl9kZWZhdWx0TG9nTGV2ZWwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMubG9nTGV2ZWwgfHwgJ2RlYnVnJztcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLl9zYW1lQXNMYXN0RXJyb3IgPSBmdW5jdGlvbiAoaXRlbSkge1xuICBpZiAoIWl0ZW0uX2lzVW5jYXVnaHQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGl0ZW1IYXNoID0gZ2VuZXJhdGVJdGVtSGFzaChpdGVtKTtcbiAgaWYgKHRoaXMubGFzdEVycm9ySGFzaCA9PT0gaXRlbUhhc2gpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB0aGlzLmxhc3RFcnJvciA9IGl0ZW0uZXJyO1xuICB0aGlzLmxhc3RFcnJvckhhc2ggPSBpdGVtSGFzaDtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuX2FkZFRyYWNpbmdJbmZvID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgLy8gVHJhY2VyIHZhbGlkYXRpb24gb2NjdXJzIGluIHRoZSBjb25zdHJ1Y3RvclxuICAvLyBvciBpbiB0aGUgUm9sbGJhci5wcm90b3R5cGUuY29uZmlndXJlIG1ldGhvZHNcbiAgaWYgKHRoaXMudHJhY2VyKSB7XG4gICAgLy8gYWRkIHJvbGxiYXIgb2NjdXJyZW5jZSB1dWlkIHRvIHNwYW5cbiAgICB2YXIgc3BhbiA9IHRoaXMudHJhY2VyLnNjb3BlKCkuYWN0aXZlKCk7XG5cbiAgICBpZiAodmFsaWRhdGVTcGFuKHNwYW4pKSB7XG4gICAgICBzcGFuLnNldFRhZygncm9sbGJhci5lcnJvcl91dWlkJywgaXRlbS51dWlkKTtcbiAgICAgIHNwYW4uc2V0VGFnKCdyb2xsYmFyLmhhc19lcnJvcicsIHRydWUpO1xuICAgICAgc3Bhbi5zZXRUYWcoJ2Vycm9yJywgdHJ1ZSk7XG4gICAgICBzcGFuLnNldFRhZyhcbiAgICAgICAgJ3JvbGxiYXIuaXRlbV91cmwnLFxuICAgICAgICBgaHR0cHM6Ly9yb2xsYmFyLmNvbS9pdGVtL3V1aWQvP3V1aWQ9JHtpdGVtLnV1aWR9YCxcbiAgICAgICk7XG4gICAgICBzcGFuLnNldFRhZyhcbiAgICAgICAgJ3JvbGxiYXIub2NjdXJyZW5jZV91cmwnLFxuICAgICAgICBgaHR0cHM6Ly9yb2xsYmFyLmNvbS9vY2N1cnJlbmNlL3V1aWQvP3V1aWQ9JHtpdGVtLnV1aWR9YCxcbiAgICAgICk7XG5cbiAgICAgIC8vIGFkZCBzcGFuIElEICYgdHJhY2UgSUQgdG8gb2NjdXJyZW5jZVxuICAgICAgdmFyIG9wZW50cmFjaW5nU3BhbklkID0gc3Bhbi5jb250ZXh0KCkudG9TcGFuSWQoKTtcbiAgICAgIHZhciBvcGVudHJhY2luZ1RyYWNlSWQgPSBzcGFuLmNvbnRleHQoKS50b1RyYWNlSWQoKTtcblxuICAgICAgaWYgKGl0ZW0uY3VzdG9tKSB7XG4gICAgICAgIGl0ZW0uY3VzdG9tLm9wZW50cmFjaW5nX3NwYW5faWQgPSBvcGVudHJhY2luZ1NwYW5JZDtcbiAgICAgICAgaXRlbS5jdXN0b20ub3BlbnRyYWNpbmdfdHJhY2VfaWQgPSBvcGVudHJhY2luZ1RyYWNlSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdGVtLmN1c3RvbSA9IHtcbiAgICAgICAgICBvcGVudHJhY2luZ19zcGFuX2lkOiBvcGVudHJhY2luZ1NwYW5JZCxcbiAgICAgICAgICBvcGVudHJhY2luZ190cmFjZV9pZDogb3BlbnRyYWNpbmdUcmFjZUlkLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVJdGVtSGFzaChpdGVtKSB7XG4gIHZhciBtZXNzYWdlID0gaXRlbS5tZXNzYWdlIHx8ICcnO1xuICB2YXIgc3RhY2sgPSAoaXRlbS5lcnIgfHwge30pLnN0YWNrIHx8IFN0cmluZyhpdGVtLmVycik7XG4gIHJldHVybiBtZXNzYWdlICsgJzo6JyArIHN0YWNrO1xufVxuXG4vLyBOb2RlLmpzLCBDaHJvbWUsIFNhZmFyaSwgYW5kIHNvbWUgb3RoZXIgYnJvd3NlcnMgc3VwcG9ydCB0aGlzIHByb3BlcnR5XG4vLyB3aGljaCBnbG9iYWxseSBzZXRzIHRoZSBudW1iZXIgb2Ygc3RhY2sgZnJhbWVzIHJldHVybmVkIGluIGFuIEVycm9yIG9iamVjdC5cbi8vIElmIGEgYnJvd3NlciBjYW4ndCB1c2UgaXQsIG5vIGhhcm0gZG9uZS5cbmZ1bmN0aW9uIHNldFN0YWNrVHJhY2VMaW1pdChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLnN0YWNrVHJhY2VMaW1pdCkge1xuICAgIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9wdGlvbnMuc3RhY2tUcmFjZUxpbWl0O1xuICB9XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIFRyYWNlciBvYmplY3QgcHJvdmlkZWQgdG8gdGhlIENsaWVudFxuICogaXMgdmFsaWQgZm9yIG91ciBPcGVudHJhY2luZyB1c2UgY2FzZS5cbiAqIEBwYXJhbSB7b3BlbnRyYWNlci5UcmFjZXJ9IHRyYWNlclxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVRyYWNlcih0cmFjZXIpIHtcbiAgaWYgKCF0cmFjZXIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIXRyYWNlci5zY29wZSB8fCB0eXBlb2YgdHJhY2VyLnNjb3BlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHNjb3BlID0gdHJhY2VyLnNjb3BlKCk7XG5cbiAgaWYgKCFzY29wZSB8fCAhc2NvcGUuYWN0aXZlIHx8IHR5cGVvZiBzY29wZS5hY3RpdmUgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB0aGUgU3BhbiBvYmplY3QgcHJvdmlkZWRcbiAqIEBwYXJhbSB7b3BlbnRyYWNlci5TcGFufSBzcGFuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlU3BhbihzcGFuKSB7XG4gIGlmICghc3BhbiB8fCAhc3Bhbi5jb250ZXh0IHx8IHR5cGVvZiBzcGFuLmNvbnRleHQgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgc3BhbkNvbnRleHQgPSBzcGFuLmNvbnRleHQoKTtcblxuICBpZiAoXG4gICAgIXNwYW5Db250ZXh0IHx8XG4gICAgIXNwYW5Db250ZXh0LnRvU3BhbklkIHx8XG4gICAgIXNwYW5Db250ZXh0LnRvVHJhY2VJZCB8fFxuICAgIHR5cGVvZiBzcGFuQ29udGV4dC50b1NwYW5JZCAhPT0gJ2Z1bmN0aW9uJyB8fFxuICAgIHR5cGVvZiBzcGFuQ29udGV4dC50b1RyYWNlSWQgIT09ICdmdW5jdGlvbidcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUm9sbGJhcjtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3V0aWxpdHkvdHJhdmVyc2UnKTtcblxuZnVuY3Rpb24gc2NydWIoZGF0YSwgc2NydWJGaWVsZHMsIHNjcnViUGF0aHMpIHtcbiAgc2NydWJGaWVsZHMgPSBzY3J1YkZpZWxkcyB8fCBbXTtcblxuICBpZiAoc2NydWJQYXRocykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NydWJQYXRocy5sZW5ndGg7ICsraSkge1xuICAgICAgc2NydWJQYXRoKGRhdGEsIHNjcnViUGF0aHNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwYXJhbVJlcyA9IF9nZXRTY3J1YkZpZWxkUmVnZXhzKHNjcnViRmllbGRzKTtcbiAgdmFyIHF1ZXJ5UmVzID0gX2dldFNjcnViUXVlcnlQYXJhbVJlZ2V4cyhzY3J1YkZpZWxkcyk7XG5cbiAgZnVuY3Rpb24gcmVkYWN0UXVlcnlQYXJhbShkdW1teTAsIHBhcmFtUGFydCkge1xuICAgIHJldHVybiBwYXJhbVBhcnQgKyBfLnJlZGFjdCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyYW1TY3J1YmJlcih2KSB7XG4gICAgdmFyIGk7XG4gICAgaWYgKF8uaXNUeXBlKHYsICdzdHJpbmcnKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHF1ZXJ5UmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHYgPSB2LnJlcGxhY2UocXVlcnlSZXNbaV0sIHJlZGFjdFF1ZXJ5UGFyYW0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbFNjcnViYmVyKGssIHYpIHtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1SZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChwYXJhbVJlc1tpXS50ZXN0KGspKSB7XG4gICAgICAgIHYgPSBfLnJlZGFjdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBmdW5jdGlvbiBzY3J1YmJlcihrLCB2LCBzZWVuKSB7XG4gICAgdmFyIHRtcFYgPSB2YWxTY3J1YmJlcihrLCB2KTtcbiAgICBpZiAodG1wViA9PT0gdikge1xuICAgICAgaWYgKF8uaXNUeXBlKHYsICdvYmplY3QnKSB8fCBfLmlzVHlwZSh2LCAnYXJyYXknKSkge1xuICAgICAgICByZXR1cm4gdHJhdmVyc2Uodiwgc2NydWJiZXIsIHNlZW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtU2NydWJiZXIodG1wVik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0bXBWO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cmF2ZXJzZShkYXRhLCBzY3J1YmJlcik7XG59XG5cbmZ1bmN0aW9uIHNjcnViUGF0aChvYmosIHBhdGgpIHtcbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsYXN0ID0ga2V5cy5sZW5ndGggLSAxO1xuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGxhc3Q7ICsraSkge1xuICAgICAgaWYgKGkgPCBsYXN0KSB7XG4gICAgICAgIG9iaiA9IG9ialtrZXlzW2ldXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXlzW2ldXSA9IF8ucmVkYWN0KCk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gTWlzc2luZyBrZXkgaXMgT0s7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2dldFNjcnViRmllbGRSZWdleHMoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIgcGF0O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViRmllbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgcGF0ID0gJ15cXFxcWz8oJTVbYkJdKT8nICsgc2NydWJGaWVsZHNbaV0gKyAnXFxcXFs/KCU1W2JCXSk/XFxcXF0/KCU1W2REXSk/JCc7XG4gICAgcmV0LnB1c2gobmV3IFJlZ0V4cChwYXQsICdpJykpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIF9nZXRTY3J1YlF1ZXJ5UGFyYW1SZWdleHMoc2NydWJGaWVsZHMpIHtcbiAgdmFyIHJldCA9IFtdO1xuICB2YXIgcGF0O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViRmllbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgcGF0ID0gJ1xcXFxbPyglNVtiQl0pPycgKyBzY3J1YkZpZWxkc1tpXSArICdcXFxcWz8oJTVbYkJdKT9cXFxcXT8oJTVbZERdKT8nO1xuICAgIHJldC5wdXNoKG5ldyBSZWdFeHAoJygnICsgcGF0ICsgJz0pKFteJlxcXFxuXSspJywgJ2lnbScpKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNjcnViO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuY29uc3QgTUFYX0VWRU5UUyA9IDEwMDtcblxuLy8gVGVtcG9yYXJ5IHdvcmthcm91bmQgd2hpbGUgc29sdmluZyBjb21tb25qcyAtPiBlc20gaXNzdWVzIGluIE5vZGUgMTggLSAyMC5cbmZ1bmN0aW9uIGZyb21NaWxsaXMobWlsbGlzKSB7XG4gIHJldHVybiBbTWF0aC50cnVuYyhtaWxsaXMgLyAxMDAwKSwgTWF0aC5yb3VuZCgobWlsbGlzICUgMTAwMCkgKiAxZTYpXTtcbn1cblxuZnVuY3Rpb24gVGVsZW1ldGVyKG9wdGlvbnMsIHRyYWNpbmcpIHtcbiAgdGhpcy5xdWV1ZSA9IFtdO1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9wdGlvbnMpO1xuICB2YXIgbWF4VGVsZW1ldHJ5RXZlbnRzID0gdGhpcy5vcHRpb25zLm1heFRlbGVtZXRyeUV2ZW50cyB8fCBNQVhfRVZFTlRTO1xuICB0aGlzLm1heFF1ZXVlU2l6ZSA9IE1hdGgubWF4KDAsIE1hdGgubWluKG1heFRlbGVtZXRyeUV2ZW50cywgTUFYX0VWRU5UUykpO1xuICB0aGlzLnRyYWNpbmcgPSB0cmFjaW5nO1xuICB0aGlzLnRlbGVtZXRyeVNwYW4gPSB0aGlzLnRyYWNpbmc/LnN0YXJ0U3Bhbigncm9sbGJhci10ZWxlbWV0cnknLCB7fSk7XG59XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHZhciBtYXhUZWxlbWV0cnlFdmVudHMgPSB0aGlzLm9wdGlvbnMubWF4VGVsZW1ldHJ5RXZlbnRzIHx8IE1BWF9FVkVOVFM7XG4gIHZhciBuZXdNYXhFdmVudHMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhUZWxlbWV0cnlFdmVudHMsIE1BWF9FVkVOVFMpKTtcbiAgdmFyIGRlbGV0ZUNvdW50ID0gMDtcbiAgaWYgKHRoaXMucXVldWUubGVuZ3RoID4gbmV3TWF4RXZlbnRzKSB7XG4gICAgZGVsZXRlQ291bnQgPSB0aGlzLnF1ZXVlLmxlbmd0aCAtIG5ld01heEV2ZW50cztcbiAgfVxuICB0aGlzLm1heFF1ZXVlU2l6ZSA9IG5ld01heEV2ZW50cztcbiAgdGhpcy5xdWV1ZS5zcGxpY2UoMCwgZGVsZXRlQ291bnQpO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jb3B5RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXZlbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5xdWV1ZSwgMCk7XG4gIGlmIChfLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLmZpbHRlclRlbGVtZXRyeSkpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIGkgPSBldmVudHMubGVuZ3RoO1xuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpbHRlclRlbGVtZXRyeShldmVudHNbaV0pKSB7XG4gICAgICAgICAgZXZlbnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5maWx0ZXJUZWxlbWV0cnkgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXZlbnRzO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlID0gZnVuY3Rpb24gKFxuICB0eXBlLFxuICBtZXRhZGF0YSxcbiAgbGV2ZWwsXG4gIHJvbGxiYXJVVUlELFxuICB0aW1lc3RhbXAsXG4pIHtcbiAgdmFyIGUgPSB7XG4gICAgbGV2ZWw6IGdldExldmVsKHR5cGUsIGxldmVsKSxcbiAgICB0eXBlOiB0eXBlLFxuICAgIHRpbWVzdGFtcF9tczogdGltZXN0YW1wIHx8IF8ubm93KCksXG4gICAgYm9keTogbWV0YWRhdGEsXG4gICAgc291cmNlOiAnY2xpZW50JyxcbiAgfTtcbiAgaWYgKHJvbGxiYXJVVUlEKSB7XG4gICAgZS51dWlkID0gcm9sbGJhclVVSUQ7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChcbiAgICAgIF8uaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMuZmlsdGVyVGVsZW1ldHJ5KSAmJlxuICAgICAgdGhpcy5vcHRpb25zLmZpbHRlclRlbGVtZXRyeShlKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXhjKSB7XG4gICAgdGhpcy5vcHRpb25zLmZpbHRlclRlbGVtZXRyeSA9IG51bGw7XG4gIH1cblxuICB0aGlzLnB1c2goZSk7XG4gIHJldHVybiBlO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlRXZlbnQgPSBmdW5jdGlvbiAoXG4gIHR5cGUsXG4gIG1ldGFkYXRhLFxuICBsZXZlbCxcbiAgcm9sbGJhclVVSUQsXG4pIHtcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZSh0eXBlLCBtZXRhZGF0YSwgbGV2ZWwsIHJvbGxiYXJVVUlEKTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZUVycm9yID0gZnVuY3Rpb24gKFxuICBlcnIsXG4gIGxldmVsLFxuICByb2xsYmFyVVVJRCxcbiAgdGltZXN0YW1wLFxuKSB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBlcnIubWVzc2FnZSB8fCBTdHJpbmcoZXJyKTtcbiAgdmFyIG1ldGFkYXRhID0ge21lc3NhZ2V9O1xuICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgbWV0YWRhdGEuc3RhY2sgPSBlcnIuc3RhY2s7XG4gIH1cbiAgdGhpcy50ZWxlbWV0cnlTcGFuPy5hZGRFdmVudChcbiAgICAncm9sbGJhci1vY2N1cnJlbmNlLWV2ZW50JyxcbiAgICB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgbGV2ZWwsXG4gICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgdXVpZDogcm9sbGJhclVVSUQsXG4gICAgICAnb2NjdXJyZW5jZS50eXBlJzogJ2Vycm9yJywgLy8gZGVwcmVjYXRlZFxuICAgICAgJ29jY3VycmVuY2UudXVpZCc6IHJvbGxiYXJVVUlELCAvLyBkZXByZWNhdGVkXG4gICAgfSxcblxuICAgIGZyb21NaWxsaXModGltZXN0YW1wKSxcbiAgKTtcblxuICByZXR1cm4gdGhpcy5jYXB0dXJlKCdlcnJvcicsIG1ldGFkYXRhLCBsZXZlbCwgcm9sbGJhclVVSUQsIHRpbWVzdGFtcCk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVMb2cgPSBmdW5jdGlvbiAoXG4gIG1lc3NhZ2UsXG4gIGxldmVsLFxuICByb2xsYmFyVVVJRCxcbiAgdGltZXN0YW1wLFxuKSB7XG4gIC8vIElmIHRoZSB1dWlkIGlzIHByZXNlbnQsIHRoaXMgaXMgYSBtZXNzYWdlIG9jY3VycmVuY2UuXG4gIGlmIChyb2xsYmFyVVVJRCkge1xuICAgIHRoaXMudGVsZW1ldHJ5U3Bhbj8uYWRkRXZlbnQoXG4gICAgICAncm9sbGJhci1vY2N1cnJlbmNlLWV2ZW50JyxcbiAgICAgIHtcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgbGV2ZWwsXG4gICAgICAgIHR5cGU6ICdtZXNzYWdlJyxcbiAgICAgICAgdXVpZDogcm9sbGJhclVVSUQsXG4gICAgICAgICdvY2N1cnJlbmNlLnR5cGUnOiAnbWVzc2FnZScsIC8vIGRlcHJlY2F0ZWRcbiAgICAgICAgJ29jY3VycmVuY2UudXVpZCc6IHJvbGxiYXJVVUlELCAvLyBkZXByZWNhdGVkXG4gICAgICB9LFxuICAgICAgZnJvbU1pbGxpcyh0aW1lc3RhbXApLFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50ZWxlbWV0cnlTcGFuPy5hZGRFdmVudChcbiAgICAgICdsb2ctZXZlbnQnLFxuICAgICAge21lc3NhZ2UsIGxldmVsfSxcbiAgICAgIGZyb21NaWxsaXModGltZXN0YW1wKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuY2FwdHVyZShcbiAgICAnbG9nJyxcbiAgICB7bWVzc2FnZX0sXG4gICAgbGV2ZWwsXG4gICAgcm9sbGJhclVVSUQsXG4gICAgdGltZXN0YW1wLFxuICApO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlTmV0d29yayA9IGZ1bmN0aW9uIChcbiAgbWV0YWRhdGEsXG4gIHN1YnR5cGUsXG4gIHJvbGxiYXJVVUlELFxuICByZXF1ZXN0RGF0YSxcbikge1xuICBzdWJ0eXBlID0gc3VidHlwZSB8fCAneGhyJztcbiAgbWV0YWRhdGEuc3VidHlwZSA9IG1ldGFkYXRhLnN1YnR5cGUgfHwgc3VidHlwZTtcbiAgaWYgKHJlcXVlc3REYXRhKSB7XG4gICAgbWV0YWRhdGEucmVxdWVzdCA9IHJlcXVlc3REYXRhO1xuICB9XG4gIHZhciBsZXZlbCA9IHRoaXMubGV2ZWxGcm9tU3RhdHVzKG1ldGFkYXRhLnN0YXR1c19jb2RlKTtcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZSgnbmV0d29yaycsIG1ldGFkYXRhLCBsZXZlbCwgcm9sbGJhclVVSUQpO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5sZXZlbEZyb21TdGF0dXMgPSBmdW5jdGlvbiAoc3RhdHVzQ29kZSkge1xuICBpZiAoc3RhdHVzQ29kZSA+PSAyMDAgJiYgc3RhdHVzQ29kZSA8IDQwMCkge1xuICAgIHJldHVybiAnaW5mbyc7XG4gIH1cbiAgaWYgKHN0YXR1c0NvZGUgPT09IDAgfHwgc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4gJ2luZm8nO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlRG9tID0gZnVuY3Rpb24gKFxuICBzdWJ0eXBlLFxuICBlbGVtZW50LFxuICB2YWx1ZSxcbiAgY2hlY2tlZCxcbiAgcm9sbGJhclVVSUQsXG4pIHtcbiAgdmFyIG1ldGFkYXRhID0ge1xuICAgIHN1YnR5cGU6IHN1YnR5cGUsXG4gICAgZWxlbWVudDogZWxlbWVudCxcbiAgfTtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICBtZXRhZGF0YS52YWx1ZSA9IHZhbHVlO1xuICB9XG4gIGlmIChjaGVja2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICBtZXRhZGF0YS5jaGVja2VkID0gY2hlY2tlZDtcbiAgfVxuICByZXR1cm4gdGhpcy5jYXB0dXJlKCdkb20nLCBtZXRhZGF0YSwgJ2luZm8nLCByb2xsYmFyVVVJRCk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVOYXZpZ2F0aW9uID0gZnVuY3Rpb24gKGZyb20sIHRvLCByb2xsYmFyVVVJRCwgdGltZXN0YW1wKSB7XG4gIHRoaXMudGVsZW1ldHJ5U3Bhbj8uYWRkRXZlbnQoXG4gICAgJ3Nlc3Npb24tbmF2aWdhdGlvbi1ldmVudCcsXG4gICAgeydwcmV2aW91cy51cmwuZnVsbCc6IGZyb20sICd1cmwuZnVsbCc6IHRvfSxcbiAgICBmcm9tTWlsbGlzKHRpbWVzdGFtcCksXG4gICk7XG5cbiAgcmV0dXJuIHRoaXMuY2FwdHVyZShcbiAgICAnbmF2aWdhdGlvbicsXG4gICAge2Zyb20sIHRvfSxcbiAgICAnaW5mbycsXG4gICAgcm9sbGJhclVVSUQsXG4gICAgdGltZXN0YW1wLFxuICApO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gdGhpcy5jYXB0dXJlKFxuICAgICduYXZpZ2F0aW9uJyxcbiAgICB7IHN1YnR5cGU6ICdET01Db250ZW50TG9hZGVkJyB9LFxuICAgICdpbmZvJyxcbiAgICB1bmRlZmluZWQsXG4gICAgdHMgJiYgdHMuZ2V0VGltZSgpLFxuICApO1xuICAvKipcbiAgICogSWYgd2UgZGVjaWRlIHRvIG1ha2UgdGhpcyBhIGRvbSBldmVudCBpbnN0ZWFkLCB0aGVuIHVzZSB0aGUgbGluZSBiZWxvdzpcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZSgnZG9tJywge3N1YnR5cGU6ICdET01Db250ZW50TG9hZGVkJ30sICdpbmZvJywgdW5kZWZpbmVkLCB0cyAmJiB0cy5nZXRUaW1lKCkpO1xuICAqL1xufTtcblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZUxvYWQgPSBmdW5jdGlvbiAodHMpIHtcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZShcbiAgICAnbmF2aWdhdGlvbicsXG4gICAgeyBzdWJ0eXBlOiAnbG9hZCcgfSxcbiAgICAnaW5mbycsXG4gICAgdW5kZWZpbmVkLFxuICAgIHRzICYmIHRzLmdldFRpbWUoKSxcbiAgKTtcbiAgLyoqXG4gICAqIElmIHdlIGRlY2lkZSB0byBtYWtlIHRoaXMgYSBkb20gZXZlbnQgaW5zdGVhZCwgdGhlbiB1c2UgdGhlIGxpbmUgYmVsb3c6XG4gIHJldHVybiB0aGlzLmNhcHR1cmUoJ2RvbScsIHtzdWJ0eXBlOiAnbG9hZCd9LCAnaW5mbycsIHVuZGVmaW5lZCwgdHMgJiYgdHMuZ2V0VGltZSgpKTtcbiAgKi9cbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZUNvbm5lY3Rpdml0eUNoYW5nZSA9IGZ1bmN0aW9uICh0eXBlLCByb2xsYmFyVVVJRCkge1xuICByZXR1cm4gdGhpcy5jYXB0dXJlTmV0d29yayh7IGNoYW5nZTogdHlwZSB9LCAnY29ubmVjdGl2aXR5Jywgcm9sbGJhclVVSUQpO1xufTtcblxuLy8gT25seSBpbnRlbmRlZCB0byBiZSB1c2VkIGludGVybmFsbHkgYnkgdGhlIG5vdGlmaWVyXG5UZWxlbWV0ZXIucHJvdG90eXBlLl9jYXB0dXJlUm9sbGJhckl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICBpZiAoIXRoaXMub3B0aW9ucy5pbmNsdWRlSXRlbXNJblRlbGVtZXRyeSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoaXRlbS5lcnIpIHtcbiAgICByZXR1cm4gdGhpcy5jYXB0dXJlRXJyb3IoaXRlbS5lcnIsIGl0ZW0ubGV2ZWwsIGl0ZW0udXVpZCwgaXRlbS50aW1lc3RhbXApO1xuICB9XG4gIGlmIChpdGVtLm1lc3NhZ2UpIHtcbiAgICByZXR1cm4gdGhpcy5jYXB0dXJlTG9nKGl0ZW0ubWVzc2FnZSwgaXRlbS5sZXZlbCwgaXRlbS51dWlkLCBpdGVtLnRpbWVzdGFtcCk7XG4gIH1cbiAgaWYgKGl0ZW0uY3VzdG9tKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwdHVyZShcbiAgICAgICdsb2cnLFxuICAgICAgaXRlbS5jdXN0b20sXG4gICAgICBpdGVtLmxldmVsLFxuICAgICAgaXRlbS51dWlkLFxuICAgICAgaXRlbS50aW1lc3RhbXAsXG4gICAgKTtcbiAgfVxufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGUpIHtcbiAgdGhpcy5xdWV1ZS5wdXNoKGUpO1xuICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPiB0aGlzLm1heFF1ZXVlU2l6ZSkge1xuICAgIHRoaXMucXVldWUuc2hpZnQoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0TGV2ZWwodHlwZSwgbGV2ZWwpIHtcbiAgaWYgKGxldmVsKSB7XG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG4gIHZhciBkZWZhdWx0TGV2ZWwgPSB7XG4gICAgZXJyb3I6ICdlcnJvcicsXG4gICAgbWFudWFsOiAnaW5mbycsXG4gIH07XG4gIHJldHVybiBkZWZhdWx0TGV2ZWxbdHlwZV0gfHwgJ2luZm8nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRlbGVtZXRlcjtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIGl0ZW1Ub1BheWxvYWQoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGRhdGEgPSBpdGVtLmRhdGE7XG5cbiAgaWYgKGl0ZW0uX2lzVW5jYXVnaHQpIHtcbiAgICBkYXRhLl9pc1VuY2F1Z2h0ID0gdHJ1ZTtcbiAgfVxuICBpZiAoaXRlbS5fb3JpZ2luYWxBcmdzKSB7XG4gICAgZGF0YS5fb3JpZ2luYWxBcmdzID0gaXRlbS5fb3JpZ2luYWxBcmdzO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXlsb2FkT3B0aW9ucyhpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgcGF5bG9hZE9wdGlvbnMgPSBvcHRpb25zLnBheWxvYWQgfHwge307XG4gIGlmIChwYXlsb2FkT3B0aW9ucy5ib2R5KSB7XG4gICAgZGVsZXRlIHBheWxvYWRPcHRpb25zLmJvZHk7XG4gIH1cblxuICBpdGVtLmRhdGEgPSBfLm1lcmdlKGl0ZW0uZGF0YSwgcGF5bG9hZE9wdGlvbnMpO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkVGVsZW1ldHJ5RGF0YShpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoaXRlbS50ZWxlbWV0cnlFdmVudHMpIHtcbiAgICBfLnNldChpdGVtLCAnZGF0YS5ib2R5LnRlbGVtZXRyeScsIGl0ZW0udGVsZW1ldHJ5RXZlbnRzKTtcbiAgfVxuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkTWVzc2FnZVdpdGhFcnJvcihpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoIWl0ZW0ubWVzc2FnZSkge1xuICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgdHJhY2VQYXRoID0gJ2RhdGEuYm9keS50cmFjZV9jaGFpbi4wJztcbiAgdmFyIHRyYWNlID0gXy5nZXQoaXRlbSwgdHJhY2VQYXRoKTtcbiAgaWYgKCF0cmFjZSkge1xuICAgIHRyYWNlUGF0aCA9ICdkYXRhLmJvZHkudHJhY2UnO1xuICAgIHRyYWNlID0gXy5nZXQoaXRlbSwgdHJhY2VQYXRoKTtcbiAgfVxuICBpZiAodHJhY2UpIHtcbiAgICBpZiAoISh0cmFjZS5leGNlcHRpb24gJiYgdHJhY2UuZXhjZXB0aW9uLmRlc2NyaXB0aW9uKSkge1xuICAgICAgXy5zZXQoaXRlbSwgdHJhY2VQYXRoICsgJy5leGNlcHRpb24uZGVzY3JpcHRpb24nLCBpdGVtLm1lc3NhZ2UpO1xuICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBleHRyYSA9IF8uZ2V0KGl0ZW0sIHRyYWNlUGF0aCArICcuZXh0cmEnKSB8fCB7fTtcbiAgICB2YXIgbmV3RXh0cmEgPSBfLm1lcmdlKGV4dHJhLCB7IG1lc3NhZ2U6IGl0ZW0ubWVzc2FnZSB9KTtcbiAgICBfLnNldChpdGVtLCB0cmFjZVBhdGggKyAnLmV4dHJhJywgbmV3RXh0cmEpO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiB1c2VyVHJhbnNmb3JtKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIG5ld0l0ZW0gPSBfLm1lcmdlKGl0ZW0pO1xuICAgIHZhciByZXNwb25zZSA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9ucy50cmFuc2Zvcm0pKSB7XG4gICAgICAgIHJlc3BvbnNlID0gb3B0aW9ucy50cmFuc2Zvcm0obmV3SXRlbS5kYXRhLCBpdGVtKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBvcHRpb25zLnRyYW5zZm9ybSA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICdFcnJvciB3aGlsZSBjYWxsaW5nIGN1c3RvbSB0cmFuc2Zvcm0oKSBmdW5jdGlvbi4gUmVtb3ZpbmcgY3VzdG9tIHRyYW5zZm9ybSgpLicsXG4gICAgICAgIGUsXG4gICAgICApO1xuICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChfLmlzUHJvbWlzZShyZXNwb25zZSkpIHtcbiAgICAgIHJlc3BvbnNlLnRoZW4oXG4gICAgICAgIGZ1bmN0aW9uIChwcm9taXNlZEl0ZW0pIHtcbiAgICAgICAgICBpZiAocHJvbWlzZWRJdGVtKSB7XG4gICAgICAgICAgICBuZXdJdGVtLmRhdGEgPSBwcm9taXNlZEl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIG5ld0l0ZW0pO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgaXRlbSk7XG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBuZXdJdGVtKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFkZENvbmZpZ1RvUGF5bG9hZChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoIW9wdGlvbnMuc2VuZENvbmZpZykge1xuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgfVxuICB2YXIgY29uZmlnS2V5ID0gJ19yb2xsYmFyQ29uZmlnJztcbiAgdmFyIGN1c3RvbSA9IF8uZ2V0KGl0ZW0sICdkYXRhLmN1c3RvbScpIHx8IHt9O1xuICBjdXN0b21bY29uZmlnS2V5XSA9IG9wdGlvbnM7XG4gIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRGdW5jdGlvbk9wdGlvbihvcHRpb25zLCBuYW1lKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24ob3B0aW9uc1tuYW1lXSkpIHtcbiAgICBvcHRpb25zW25hbWVdID0gb3B0aW9uc1tuYW1lXS50b1N0cmluZygpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZENvbmZpZ3VyZWRPcHRpb25zKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBjb25maWd1cmVkT3B0aW9ucyA9IG9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zO1xuXG4gIC8vIFRoZXNlIG11c3QgYmUgc3RyaW5naWZpZWQgb3IgdGhleSdsbCBnZXQgZHJvcHBlZCBkdXJpbmcgc2VyaWFsaXphdGlvbi5cbiAgYWRkRnVuY3Rpb25PcHRpb24oY29uZmlndXJlZE9wdGlvbnMsICd0cmFuc2Zvcm0nKTtcbiAgYWRkRnVuY3Rpb25PcHRpb24oY29uZmlndXJlZE9wdGlvbnMsICdjaGVja0lnbm9yZScpO1xuICBhZGRGdW5jdGlvbk9wdGlvbihjb25maWd1cmVkT3B0aW9ucywgJ29uU2VuZENhbGxiYWNrJyk7XG5cbiAgZGVsZXRlIGNvbmZpZ3VyZWRPcHRpb25zLmFjY2Vzc1Rva2VuO1xuICBpdGVtLmRhdGEubm90aWZpZXIuY29uZmlndXJlZF9vcHRpb25zID0gY29uZmlndXJlZE9wdGlvbnM7XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGREaWFnbm9zdGljS2V5cyhpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgZGlhZ25vc3RpYyA9IF8ubWVyZ2UoXG4gICAgaXRlbS5ub3RpZmllci5jbGllbnQubm90aWZpZXIuZGlhZ25vc3RpYyxcbiAgICBpdGVtLmRpYWdub3N0aWMsXG4gICk7XG5cbiAgaWYgKF8uZ2V0KGl0ZW0sICdlcnIuX2lzQW5vbnltb3VzJykpIHtcbiAgICBkaWFnbm9zdGljLmlzX2Fub255bW91cyA9IHRydWU7XG4gIH1cblxuICBpZiAoaXRlbS5faXNVbmNhdWdodCkge1xuICAgIGRpYWdub3N0aWMuaXNfdW5jYXVnaHQgPSBpdGVtLl9pc1VuY2F1Z2h0O1xuICB9XG5cbiAgaWYgKGl0ZW0uZXJyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGRpYWdub3N0aWMucmF3X2Vycm9yID0ge1xuICAgICAgICBtZXNzYWdlOiBpdGVtLmVyci5tZXNzYWdlLFxuICAgICAgICBuYW1lOiBpdGVtLmVyci5uYW1lLFxuICAgICAgICBjb25zdHJ1Y3Rvcl9uYW1lOiBpdGVtLmVyci5jb25zdHJ1Y3RvciAmJiBpdGVtLmVyci5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgICBmaWxlbmFtZTogaXRlbS5lcnIuZmlsZU5hbWUsXG4gICAgICAgIGxpbmU6IGl0ZW0uZXJyLmxpbmVOdW1iZXIsXG4gICAgICAgIGNvbHVtbjogaXRlbS5lcnIuY29sdW1uTnVtYmVyLFxuICAgICAgICBzdGFjazogaXRlbS5lcnIuc3RhY2ssXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRpYWdub3N0aWMucmF3X2Vycm9yID0geyBmYWlsZWQ6IFN0cmluZyhlKSB9O1xuICAgIH1cbiAgfVxuXG4gIGl0ZW0uZGF0YS5ub3RpZmllci5kaWFnbm9zdGljID0gXy5tZXJnZShcbiAgICBpdGVtLmRhdGEubm90aWZpZXIuZGlhZ25vc3RpYyxcbiAgICBkaWFnbm9zdGljLFxuICApO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGl0ZW1Ub1BheWxvYWQ6IGl0ZW1Ub1BheWxvYWQsXG4gIGFkZFBheWxvYWRPcHRpb25zOiBhZGRQYXlsb2FkT3B0aW9ucyxcbiAgYWRkVGVsZW1ldHJ5RGF0YTogYWRkVGVsZW1ldHJ5RGF0YSxcbiAgYWRkTWVzc2FnZVdpdGhFcnJvcjogYWRkTWVzc2FnZVdpdGhFcnJvcixcbiAgdXNlclRyYW5zZm9ybTogdXNlclRyYW5zZm9ybSxcbiAgYWRkQ29uZmlnVG9QYXlsb2FkOiBhZGRDb25maWdUb1BheWxvYWQsXG4gIGFkZENvbmZpZ3VyZWRPcHRpb25zOiBhZGRDb25maWd1cmVkT3B0aW9ucyxcbiAgYWRkRGlhZ25vc3RpY0tleXM6IGFkZERpYWdub3N0aWNLZXlzLFxufTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG52YXIgdHJhdmVyc2UgPSByZXF1aXJlKCcuL3V0aWxpdHkvdHJhdmVyc2UnKTtcblxuZnVuY3Rpb24gcmF3KHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgcmV0dXJuIFtwYXlsb2FkLCBfLnN0cmluZ2lmeShwYXlsb2FkLCBqc29uQmFja3VwKV07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEZyYW1lcyhmcmFtZXMsIHJhbmdlKSB7XG4gIHZhciBsZW4gPSBmcmFtZXMubGVuZ3RoO1xuICBpZiAobGVuID4gcmFuZ2UgKiAyKSB7XG4gICAgcmV0dXJuIGZyYW1lcy5zbGljZSgwLCByYW5nZSkuY29uY2F0KGZyYW1lcy5zbGljZShsZW4gLSByYW5nZSkpO1xuICB9XG4gIHJldHVybiBmcmFtZXM7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlRnJhbWVzKHBheWxvYWQsIGpzb25CYWNrdXAsIHJhbmdlKSB7XG4gIHJhbmdlID0gdHlwZW9mIHJhbmdlID09PSAndW5kZWZpbmVkJyA/IDMwIDogcmFuZ2U7XG4gIHZhciBib2R5ID0gcGF5bG9hZC5kYXRhLmJvZHk7XG4gIHZhciBmcmFtZXM7XG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIGNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmcmFtZXMgPSBjaGFpbltpXS5mcmFtZXM7XG4gICAgICBmcmFtZXMgPSBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSk7XG4gICAgICBjaGFpbltpXS5mcmFtZXMgPSBmcmFtZXM7XG4gICAgfVxuICB9IGVsc2UgaWYgKGJvZHkudHJhY2UpIHtcbiAgICBmcmFtZXMgPSBib2R5LnRyYWNlLmZyYW1lcztcbiAgICBmcmFtZXMgPSBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSk7XG4gICAgYm9keS50cmFjZS5mcmFtZXMgPSBmcmFtZXM7XG4gIH1cbiAgcmV0dXJuIFtwYXlsb2FkLCBfLnN0cmluZ2lmeShwYXlsb2FkLCBqc29uQmFja3VwKV07XG59XG5cbmZ1bmN0aW9uIG1heWJlVHJ1bmNhdGVWYWx1ZShsZW4sIHZhbCkge1xuICBpZiAoIXZhbCkge1xuICAgIHJldHVybiB2YWw7XG4gIH1cbiAgaWYgKHZhbC5sZW5ndGggPiBsZW4pIHtcbiAgICByZXR1cm4gdmFsLnNsaWNlKDAsIGxlbiAtIDMpLmNvbmNhdCgnLi4uJyk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGVTdHJpbmdzKGxlbiwgcGF5bG9hZCwganNvbkJhY2t1cCkge1xuICBmdW5jdGlvbiB0cnVuY2F0b3Ioaywgdiwgc2Vlbikge1xuICAgIHN3aXRjaCAoXy50eXBlTmFtZSh2KSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgcmV0dXJuIG1heWJlVHJ1bmNhdGVWYWx1ZShsZW4sIHYpO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgcmV0dXJuIHRyYXZlcnNlKHYsIHRydW5jYXRvciwgc2Vlbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG4gIH1cbiAgcGF5bG9hZCA9IHRyYXZlcnNlKHBheWxvYWQsIHRydW5jYXRvcik7XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZVRyYWNlRGF0YSh0cmFjZURhdGEpIHtcbiAgaWYgKHRyYWNlRGF0YS5leGNlcHRpb24pIHtcbiAgICBkZWxldGUgdHJhY2VEYXRhLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbjtcbiAgICB0cmFjZURhdGEuZXhjZXB0aW9uLm1lc3NhZ2UgPSBtYXliZVRydW5jYXRlVmFsdWUoXG4gICAgICAyNTUsXG4gICAgICB0cmFjZURhdGEuZXhjZXB0aW9uLm1lc3NhZ2UsXG4gICAgKTtcbiAgfVxuICB0cmFjZURhdGEuZnJhbWVzID0gc2VsZWN0RnJhbWVzKHRyYWNlRGF0YS5mcmFtZXMsIDEpO1xuICByZXR1cm4gdHJhY2VEYXRhO1xufVxuXG5mdW5jdGlvbiBtaW5Cb2R5KHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgdmFyIGJvZHkgPSBwYXlsb2FkLmRhdGEuYm9keTtcbiAgaWYgKGJvZHkudHJhY2VfY2hhaW4pIHtcbiAgICB2YXIgY2hhaW4gPSBib2R5LnRyYWNlX2NoYWluO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhaW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoYWluW2ldID0gdHJ1bmNhdGVUcmFjZURhdGEoY2hhaW5baV0pO1xuICAgIH1cbiAgfSBlbHNlIGlmIChib2R5LnRyYWNlKSB7XG4gICAgYm9keS50cmFjZSA9IHRydW5jYXRlVHJhY2VEYXRhKGJvZHkudHJhY2UpO1xuICB9XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBuZWVkc1RydW5jYXRpb24ocGF5bG9hZCwgbWF4U2l6ZSkge1xuICByZXR1cm4gXy5tYXhCeXRlU2l6ZShwYXlsb2FkKSA+IG1heFNpemU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHBheWxvYWQsIGpzb25CYWNrdXAsIG1heFNpemUpIHtcbiAgbWF4U2l6ZSA9IHR5cGVvZiBtYXhTaXplID09PSAndW5kZWZpbmVkJyA/IDUxMiAqIDEwMjQgOiBtYXhTaXplO1xuICB2YXIgc3RyYXRlZ2llcyA9IFtcbiAgICByYXcsXG4gICAgdHJ1bmNhdGVGcmFtZXMsXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgMTAyNCksXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgNTEyKSxcbiAgICB0cnVuY2F0ZVN0cmluZ3MuYmluZChudWxsLCAyNTYpLFxuICAgIG1pbkJvZHksXG4gIF07XG4gIHZhciBzdHJhdGVneSwgcmVzdWx0cywgcmVzdWx0O1xuXG4gIHdoaWxlICgoc3RyYXRlZ3kgPSBzdHJhdGVnaWVzLnNoaWZ0KCkpKSB7XG4gICAgcmVzdWx0cyA9IHN0cmF0ZWd5KHBheWxvYWQsIGpzb25CYWNrdXApO1xuICAgIHBheWxvYWQgPSByZXN1bHRzWzBdO1xuICAgIHJlc3VsdCA9IHJlc3VsdHNbMV07XG4gICAgaWYgKHJlc3VsdC5lcnJvciB8fCAhbmVlZHNUcnVuY2F0aW9uKHJlc3VsdC52YWx1ZSwgbWF4U2l6ZSkpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0cnVuY2F0ZTogdHJ1bmNhdGUsXG5cbiAgLyogZm9yIHRlc3RpbmcgKi9cbiAgcmF3OiByYXcsXG4gIHRydW5jYXRlRnJhbWVzOiB0cnVuY2F0ZUZyYW1lcyxcbiAgdHJ1bmNhdGVTdHJpbmdzOiB0cnVuY2F0ZVN0cmluZ3MsXG4gIG1heWJlVHJ1bmNhdGVWYWx1ZTogbWF5YmVUcnVuY2F0ZVZhbHVlLFxufTtcbiIsInZhciBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKTtcblxudmFyIFJvbGxiYXJKU09OID0ge307XG5mdW5jdGlvbiBzZXR1cEpTT04ocG9seWZpbGxKU09OKSB7XG4gIGlmIChpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgJiYgaXNGdW5jdGlvbihSb2xsYmFySlNPTi5wYXJzZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaXNEZWZpbmVkKEpTT04pKSB7XG4gICAgLy8gSWYgcG9seWZpbGwgaXMgcHJvdmlkZWQsIHByZWZlciBpdCBvdmVyIGV4aXN0aW5nIG5vbi1uYXRpdmUgc2hpbXMuXG4gICAgaWYgKHBvbHlmaWxsSlNPTikge1xuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5zdHJpbmdpZnkpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuICAgICAgfVxuICAgICAgaWYgKGlzTmF0aXZlRnVuY3Rpb24oSlNPTi5wYXJzZSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04ucGFyc2UgPSBKU09OLnBhcnNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbHNlIGFjY2VwdCBhbnkgaW50ZXJmYWNlIHRoYXQgaXMgcHJlc2VudC5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Z1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKCFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnN0cmluZ2lmeSkgfHwgIWlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcG9seWZpbGxKU09OICYmIHBvbHlmaWxsSlNPTihSb2xsYmFySlNPTik7XG4gIH1cbn1cblxuLypcbiAqIGlzVHlwZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSBhbmQgYSBzdHJpbmcsIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHlwZSBvZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGVcbiAqIGdpdmVuIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0geCAtIGFueSB2YWx1ZVxuICogQHBhcmFtIHQgLSBhIGxvd2VyY2FzZSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2YgdGhlIGZvbGxvd2luZyB0eXBlIG5hbWVzOlxuICogICAgLSB1bmRlZmluZWRcbiAqICAgIC0gbnVsbFxuICogICAgLSBlcnJvclxuICogICAgLSBudW1iZXJcbiAqICAgIC0gYm9vbGVhblxuICogICAgLSBzdHJpbmdcbiAqICAgIC0gc3ltYm9sXG4gKiAgICAtIGZ1bmN0aW9uXG4gKiAgICAtIG9iamVjdFxuICogICAgLSBhcnJheVxuICogQHJldHVybnMgdHJ1ZSBpZiB4IGlzIG9mIHR5cGUgdCwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZSh4LCB0KSB7XG4gIHJldHVybiB0ID09PSB0eXBlTmFtZSh4KTtcbn1cblxuLypcbiAqIHR5cGVOYW1lIC0gR2l2ZW4gYSBKYXZhc2NyaXB0IHZhbHVlLCByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYXMgYSBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gdHlwZU5hbWUoeCkge1xuICB2YXIgbmFtZSA9IHR5cGVvZiB4O1xuICBpZiAobmFtZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBpZiAoIXgpIHtcbiAgICByZXR1cm4gJ251bGwnO1xuICB9XG4gIGlmICh4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gJ2Vycm9yJztcbiAgfVxuICByZXR1cm4ge30udG9TdHJpbmdcbiAgICAuY2FsbCh4KVxuICAgIC5tYXRjaCgvXFxzKFthLXpBLVpdKykvKVsxXVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vKiBpc0Z1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbihmKSB7XG4gIHJldHVybiBpc1R5cGUoZiwgJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzTmF0aXZlRnVuY3Rpb24gLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgbmF0aXZlIEpTIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIGYgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlRnVuY3Rpb24oZikge1xuICB2YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuICB2YXIgZnVuY01hdGNoU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nXG4gICAgLmNhbGwoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSlcbiAgICAucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKTtcbiAgdmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICsgZnVuY01hdGNoU3RyaW5nICsgJyQnKTtcbiAgcmV0dXJuIGlzT2JqZWN0KGYpICYmIHJlSXNOYXRpdmUudGVzdChmKTtcbn1cblxuLyogaXNPYmplY3QgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpcyB2YWx1ZSBpcyBhbiBvYmplY3QgZnVuY3Rpb24gaXMgYW4gb2JqZWN0KVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyogaXNTdHJpbmcgLSBDaGVja3MgaWYgdGhlIGFyZ3VtZW50IGlzIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHZhbHVlIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuXG4vKipcbiAqIGlzRmluaXRlTnVtYmVyIC0gZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXNzZWQgdmFsdWUgaXMgYSBmaW5pdGUgbnVtYmVyXG4gKlxuICogQHBhcmFtIHsqfSBuIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICovXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlcihuKSB7XG4gIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobik7XG59XG5cbi8qXG4gKiBpc0RlZmluZWQgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG5vdCBlcXVhbCB0byB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0gdSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB1IGlzIGFueXRoaW5nIG90aGVyIHRoYW4gdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlzRGVmaW5lZCh1KSB7XG4gIHJldHVybiAhaXNUeXBlKHUsICd1bmRlZmluZWQnKTtcbn1cblxuLypcbiAqIGlzSXRlcmFibGUgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBjYW4gYmUgaXRlcmF0ZWQsIGVzc2VudGlhbGx5XG4gKiB3aGV0aGVyIGl0IGlzIGFuIG9iamVjdCBvciBhbiBhcnJheS5cbiAqXG4gKiBAcGFyYW0gaSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBpIGlzIGFuIG9iamVjdCBvciBhbiBhcnJheSBhcyBkZXRlcm1pbmVkIGJ5IGB0eXBlTmFtZWBcbiAqL1xuZnVuY3Rpb24gaXNJdGVyYWJsZShpKSB7XG4gIHZhciB0eXBlID0gdHlwZU5hbWUoaSk7XG4gIHJldHVybiB0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnYXJyYXknO1xufVxuXG4vKlxuICogaXNFcnJvciAtIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIG9mIGFuIGVycm9yIHR5cGVcbiAqXG4gKiBAcGFyYW0gZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiBlIGlzIGFuIGVycm9yXG4gKi9cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICAvLyBEZXRlY3QgYm90aCBFcnJvciBhbmQgRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICByZXR1cm4gaXNUeXBlKGUsICdlcnJvcicpIHx8IGlzVHlwZShlLCAnZXhjZXB0aW9uJyk7XG59XG5cbi8qIGlzUHJvbWlzZSAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBwcm9taXNlXG4gKlxuICogQHBhcmFtIHAgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZiBpcyBhIGZ1bmN0aW9uLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNQcm9taXNlKHApIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHApICYmIGlzVHlwZShwLnRoZW4sICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIGlzQnJvd3NlciAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIHRoZSBjb2RlIGlzIHJ1bm5pbmcgaW4gYSBicm93c2VyXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudFxuICovXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbn1cblxuZnVuY3Rpb24gcmVkYWN0KCkge1xuICByZXR1cm4gJyoqKioqKioqJztcbn1cblxuLy8gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyLzExMzgxOTFcbmZ1bmN0aW9uIHV1aWQ0KCkge1xuICB2YXIgZCA9IG5vdygpO1xuICB2YXIgdXVpZCA9ICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoXG4gICAgL1t4eV0vZyxcbiAgICBmdW5jdGlvbiAoYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkgKiAxNikgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkIC8gMTYpO1xuICAgICAgcmV0dXJuIChjID09PSAneCcgPyByIDogKHIgJiAweDcpIHwgMHg4KS50b1N0cmluZygxNik7XG4gICAgfSxcbiAgKTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cbnZhciBMRVZFTFMgPSB7XG4gIGRlYnVnOiAwLFxuICBpbmZvOiAxLFxuICB3YXJuaW5nOiAyLFxuICBlcnJvcjogMyxcbiAgY3JpdGljYWw6IDQsXG59O1xuXG5mdW5jdGlvbiBzYW5pdGl6ZVVybCh1cmwpIHtcbiAgdmFyIGJhc2VVcmxQYXJ0cyA9IHBhcnNlVXJpKHVybCk7XG4gIGlmICghYmFzZVVybFBhcnRzKSB7XG4gICAgcmV0dXJuICcodW5rbm93biknO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgdHJhaWxpbmcgIyBpZiB0aGVyZSBpcyBubyBhbmNob3JcbiAgaWYgKGJhc2VVcmxQYXJ0cy5hbmNob3IgPT09ICcnKSB7XG4gICAgYmFzZVVybFBhcnRzLnNvdXJjZSA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnIycsICcnKTtcbiAgfVxuXG4gIHVybCA9IGJhc2VVcmxQYXJ0cy5zb3VyY2UucmVwbGFjZSgnPycgKyBiYXNlVXJsUGFydHMucXVlcnksICcnKTtcbiAgcmV0dXJuIHVybDtcbn1cblxudmFyIHBhcnNlVXJpT3B0aW9ucyA9IHtcbiAgc3RyaWN0TW9kZTogZmFsc2UsXG4gIGtleTogW1xuICAgICdzb3VyY2UnLFxuICAgICdwcm90b2NvbCcsXG4gICAgJ2F1dGhvcml0eScsXG4gICAgJ3VzZXJJbmZvJyxcbiAgICAndXNlcicsXG4gICAgJ3Bhc3N3b3JkJyxcbiAgICAnaG9zdCcsXG4gICAgJ3BvcnQnLFxuICAgICdyZWxhdGl2ZScsXG4gICAgJ3BhdGgnLFxuICAgICdkaXJlY3RvcnknLFxuICAgICdmaWxlJyxcbiAgICAncXVlcnknLFxuICAgICdhbmNob3InLFxuICBdLFxuICBxOiB7XG4gICAgbmFtZTogJ3F1ZXJ5S2V5JyxcbiAgICBwYXJzZXI6IC8oPzpefCYpKFteJj1dKik9PyhbXiZdKikvZyxcbiAgfSxcbiAgcGFyc2VyOiB7XG4gICAgc3RyaWN0OlxuICAgICAgL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopKD86OihbXjpAXSopKT8pP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgICBsb29zZTpcbiAgICAgIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyxcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKHN0cikge1xuICBpZiAoIWlzVHlwZShzdHIsICdzdHJpbmcnKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgbyA9IHBhcnNlVXJpT3B0aW9ucztcbiAgdmFyIG0gPSBvLnBhcnNlcltvLnN0cmljdE1vZGUgPyAnc3RyaWN0JyA6ICdsb29zZSddLmV4ZWMoc3RyKTtcbiAgdmFyIHVyaSA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gby5rZXkubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgdXJpW28ua2V5W2ldXSA9IG1baV0gfHwgJyc7XG4gIH1cblxuICB1cmlbby5xLm5hbWVdID0ge307XG4gIHVyaVtvLmtleVsxMl1dLnJlcGxhY2Uoby5xLnBhcnNlciwgZnVuY3Rpb24gKCQwLCAkMSwgJDIpIHtcbiAgICBpZiAoJDEpIHtcbiAgICAgIHVyaVtvLnEubmFtZV1bJDFdID0gJDI7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgcGFyYW1zLmFjY2Vzc190b2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB2YXIgcGFyYW1zQXJyYXkgPSBbXTtcbiAgdmFyIGs7XG4gIGZvciAoayBpbiBwYXJhbXMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHBhcmFtcywgaykpIHtcbiAgICAgIHBhcmFtc0FycmF5LnB1c2goW2ssIHBhcmFtc1trXV0uam9pbignPScpKTtcbiAgICB9XG4gIH1cbiAgdmFyIHF1ZXJ5ID0gJz8nICsgcGFyYW1zQXJyYXkuc29ydCgpLmpvaW4oJyYnKTtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoIHx8ICcnO1xuICB2YXIgcXMgPSBvcHRpb25zLnBhdGguaW5kZXhPZignPycpO1xuICB2YXIgaCA9IG9wdGlvbnMucGF0aC5pbmRleE9mKCcjJyk7XG4gIHZhciBwO1xuICBpZiAocXMgIT09IC0xICYmIChoID09PSAtMSB8fCBoID4gcXMpKSB7XG4gICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICBvcHRpb25zLnBhdGggPSBwLnN1YnN0cmluZygwLCBxcykgKyBxdWVyeSArICcmJyArIHAuc3Vic3RyaW5nKHFzICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGggIT09IC0xKSB7XG4gICAgICBwID0gb3B0aW9ucy5wYXRoO1xuICAgICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgaCkgKyBxdWVyeSArIHAuc3Vic3RyaW5nKGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhdGggPSBvcHRpb25zLnBhdGggKyBxdWVyeTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0VXJsKHUsIHByb3RvY29sKSB7XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgdS5wcm90b2NvbDtcbiAgaWYgKCFwcm90b2NvbCAmJiB1LnBvcnQpIHtcbiAgICBpZiAodS5wb3J0ID09PSA4MCkge1xuICAgICAgcHJvdG9jb2wgPSAnaHR0cDonO1xuICAgIH0gZWxzZSBpZiAodS5wb3J0ID09PSA0NDMpIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHBzOic7XG4gICAgfVxuICB9XG4gIHByb3RvY29sID0gcHJvdG9jb2wgfHwgJ2h0dHBzOic7XG5cbiAgaWYgKCF1Lmhvc3RuYW1lKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHByb3RvY29sICsgJy8vJyArIHUuaG9zdG5hbWU7XG4gIGlmICh1LnBvcnQpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyAnOicgKyB1LnBvcnQ7XG4gIH1cbiAgaWYgKHUucGF0aCkge1xuICAgIHJlc3VsdCA9IHJlc3VsdCArIHUucGF0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBiYWNrdXApIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnN0cmluZ2lmeShvYmopO1xuICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICBpZiAoYmFja3VwICYmIGlzRnVuY3Rpb24oYmFja3VwKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSBiYWNrdXAob2JqKTtcbiAgICAgIH0gY2F0Y2ggKGJhY2t1cEVycm9yKSB7XG4gICAgICAgIGVycm9yID0gYmFja3VwRXJyb3I7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0ganNvbkVycm9yO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYXhCeXRlU2l6ZShzdHJpbmcpIHtcbiAgLy8gVGhlIHRyYW5zcG9ydCB3aWxsIHVzZSB1dGYtOCwgc28gYXNzdW1lIHV0Zi04IGVuY29kaW5nLlxuICAvL1xuICAvLyBUaGlzIG1pbmltYWwgaW1wbGVtZW50YXRpb24gd2lsbCBhY2N1cmF0ZWx5IGNvdW50IGJ5dGVzIGZvciBhbGwgVUNTLTIgYW5kXG4gIC8vIHNpbmdsZSBjb2RlIHBvaW50IFVURi0xNi4gSWYgcHJlc2VudGVkIHdpdGggbXVsdGkgY29kZSBwb2ludCBVVEYtMTYsXG4gIC8vIHdoaWNoIHNob3VsZCBiZSByYXJlLCBpdCB3aWxsIHNhZmVseSBvdmVyY291bnQsIG5vdCB1bmRlcmNvdW50LlxuICAvL1xuICAvLyBXaGlsZSByb2J1c3QgdXRmLTggZW5jb2RlcnMgZXhpc3QsIHRoaXMgaXMgZmFyIHNtYWxsZXIgYW5kIGZhciBtb3JlIHBlcmZvcm1hbnQuXG4gIC8vIEZvciBxdWlja2x5IGNvdW50aW5nIHBheWxvYWQgc2l6ZSBmb3IgdHJ1bmNhdGlvbiwgc21hbGxlciBpcyBiZXR0ZXIuXG5cbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBjb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNvZGUgPCAxMjgpIHtcbiAgICAgIC8vIHVwIHRvIDcgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDE7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgMjA0OCkge1xuICAgICAgLy8gdXAgdG8gMTEgYml0c1xuICAgICAgY291bnQgPSBjb3VudCArIDI7XG4gICAgfSBlbHNlIGlmIChjb2RlIDwgNjU1MzYpIHtcbiAgICAgIC8vIHVwIHRvIDE2IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAzO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb3VudDtcbn1cblxuZnVuY3Rpb24ganNvblBhcnNlKHMpIHtcbiAgdmFyIHZhbHVlLCBlcnJvcjtcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IFJvbGxiYXJKU09OLnBhcnNlKHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiB7IGVycm9yOiBlcnJvciwgdmFsdWU6IHZhbHVlIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VVbmhhbmRsZWRTdGFja0luZm8oXG4gIG1lc3NhZ2UsXG4gIHVybCxcbiAgbGluZW5vLFxuICBjb2xubyxcbiAgZXJyb3IsXG4gIG1vZGUsXG4gIGJhY2t1cE1lc3NhZ2UsXG4gIGVycm9yUGFyc2VyLFxuKSB7XG4gIHZhciBsb2NhdGlvbiA9IHtcbiAgICB1cmw6IHVybCB8fCAnJyxcbiAgICBsaW5lOiBsaW5lbm8sXG4gICAgY29sdW1uOiBjb2xubyxcbiAgfTtcbiAgbG9jYXRpb24uZnVuYyA9IGVycm9yUGFyc2VyLmd1ZXNzRnVuY3Rpb25OYW1lKGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIGxvY2F0aW9uLmNvbnRleHQgPSBlcnJvclBhcnNlci5nYXRoZXJDb250ZXh0KGxvY2F0aW9uLnVybCwgbG9jYXRpb24ubGluZSk7XG4gIHZhciBocmVmID1cbiAgICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgZG9jdW1lbnQgJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbiAmJlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gIHZhciB1c2VyYWdlbnQgPVxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgd2luZG93ICYmXG4gICAgd2luZG93Lm5hdmlnYXRvciAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4ge1xuICAgIG1vZGU6IG1vZGUsXG4gICAgbWVzc2FnZTogZXJyb3IgPyBTdHJpbmcoZXJyb3IpIDogbWVzc2FnZSB8fCBiYWNrdXBNZXNzYWdlLFxuICAgIHVybDogaHJlZixcbiAgICBzdGFjazogW2xvY2F0aW9uXSxcbiAgICB1c2VyYWdlbnQ6IHVzZXJhZ2VudCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrKGxvZ2dlciwgZikge1xuICByZXR1cm4gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgIHRyeSB7XG4gICAgICBmKGVyciwgcmVzcCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbG9nZ2VyLmVycm9yKGUpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9uQ2lyY3VsYXJDbG9uZShvYmopIHtcbiAgdmFyIHNlZW4gPSBbb2JqXTtcblxuICBmdW5jdGlvbiBjbG9uZShvYmosIHNlZW4pIHtcbiAgICB2YXIgdmFsdWUsXG4gICAgICBuYW1lLFxuICAgICAgbmV3U2VlbixcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbbmFtZV07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIChpc1R5cGUodmFsdWUsICdvYmplY3QnKSB8fCBpc1R5cGUodmFsdWUsICdhcnJheScpKSkge1xuICAgICAgICAgIGlmIChzZWVuLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmVzdWx0W25hbWVdID0gJ1JlbW92ZWQgY2lyY3VsYXIgcmVmZXJlbmNlOiAnICsgdHlwZU5hbWUodmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdTZWVuID0gc2Vlbi5zbGljZSgpO1xuICAgICAgICAgICAgbmV3U2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNsb25lKHZhbHVlLCBuZXdTZWVuKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnRmFpbGVkIGNsb25pbmcgY3VzdG9tIGRhdGE6ICcgKyBlLm1lc3NhZ2U7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGNsb25lKG9iaiwgc2Vlbik7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUl0ZW0oYXJncywgbG9nZ2VyLCBub3RpZmllciwgcmVxdWVzdEtleXMsIGxhbWJkYUNvbnRleHQpIHtcbiAgdmFyIG1lc3NhZ2UsIGVyciwgY3VzdG9tLCBjYWxsYmFjaywgcmVxdWVzdDtcbiAgdmFyIGFyZztcbiAgdmFyIGV4dHJhQXJncyA9IFtdO1xuICB2YXIgZGlhZ25vc3RpYyA9IHt9O1xuICB2YXIgYXJnVHlwZXMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIGFyZ1R5cGVzLnB1c2godHlwKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBtZXNzYWdlID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChtZXNzYWdlID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgIGNhbGxiYWNrID0gd3JhcENhbGxiYWNrKGxvZ2dlciwgYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICBjYXNlICdkb21leGNlcHRpb24nOlxuICAgICAgY2FzZSAnZXhjZXB0aW9uJzogLy8gRmlyZWZveCBFeGNlcHRpb24gdHlwZVxuICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGNhc2UgJ2FycmF5JzpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXF1ZXN0S2V5cyAmJiB0eXAgPT09ICdvYmplY3QnICYmICFyZXF1ZXN0KSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGxlbiA9IHJlcXVlc3RLZXlzLmxlbmd0aDsgaiA8IGxlbjsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYXJnW3JlcXVlc3RLZXlzW2pdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3QgPSBhcmc7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1c3RvbSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoY3VzdG9tID0gYXJnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoXG4gICAgICAgICAgYXJnIGluc3RhbmNlb2YgRXJyb3IgfHxcbiAgICAgICAgICAodHlwZW9mIERPTUV4Y2VwdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYXJnIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uKVxuICAgICAgICApIHtcbiAgICAgICAgICBlcnIgPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGVyciA9IGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZXh0cmFBcmdzLnB1c2goYXJnKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiBjdXN0b20gaXMgYW4gYXJyYXkgdGhpcyB0dXJucyBpdCBpbnRvIGFuIG9iamVjdCB3aXRoIGludGVnZXIga2V5c1xuICBpZiAoY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKGN1c3RvbSk7XG5cbiAgaWYgKGV4dHJhQXJncy5sZW5ndGggPiAwKSB7XG4gICAgaWYgKCFjdXN0b20pIGN1c3RvbSA9IG5vbkNpcmN1bGFyQ2xvbmUoe30pO1xuICAgIGN1c3RvbS5leHRyYUFyZ3MgPSBub25DaXJjdWxhckNsb25lKGV4dHJhQXJncyk7XG4gIH1cblxuICB2YXIgaXRlbSA9IHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGVycjogZXJyLFxuICAgIGN1c3RvbTogY3VzdG9tLFxuICAgIHRpbWVzdGFtcDogbm93KCksXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIG5vdGlmaWVyOiBub3RpZmllcixcbiAgICBkaWFnbm9zdGljOiBkaWFnbm9zdGljLFxuICAgIHV1aWQ6IHV1aWQ0KCksXG4gIH07XG5cbiAgaXRlbS5kYXRhID0gaXRlbS5kYXRhIHx8IHt9O1xuXG4gIHNldEN1c3RvbUl0ZW1LZXlzKGl0ZW0sIGN1c3RvbSk7XG5cbiAgaWYgKHJlcXVlc3RLZXlzICYmIHJlcXVlc3QpIHtcbiAgICBpdGVtLnJlcXVlc3QgPSByZXF1ZXN0O1xuICB9XG4gIGlmIChsYW1iZGFDb250ZXh0KSB7XG4gICAgaXRlbS5sYW1iZGFDb250ZXh0ID0gbGFtYmRhQ29udGV4dDtcbiAgfVxuICBpdGVtLl9vcmlnaW5hbEFyZ3MgPSBhcmdzO1xuICBpdGVtLmRpYWdub3N0aWMub3JpZ2luYWxfYXJnX3R5cGVzID0gYXJnVHlwZXM7XG4gIHJldHVybiBpdGVtO1xufVxuXG5mdW5jdGlvbiBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pIHtcbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZW0ubGV2ZWwgPSBjdXN0b20ubGV2ZWw7XG4gICAgZGVsZXRlIGN1c3RvbS5sZXZlbDtcbiAgfVxuICBpZiAoY3VzdG9tICYmIGN1c3RvbS5za2lwRnJhbWVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLnNraXBGcmFtZXMgPSBjdXN0b20uc2tpcEZyYW1lcztcbiAgICBkZWxldGUgY3VzdG9tLnNraXBGcmFtZXM7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkRXJyb3JDb250ZXh0KGl0ZW0sIGVycm9ycykge1xuICB2YXIgY3VzdG9tID0gaXRlbS5kYXRhLmN1c3RvbSB8fCB7fTtcbiAgdmFyIGNvbnRleHRBZGRlZCA9IGZhbHNlO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGlmIChlcnJvcnNbaV0uaGFzT3duUHJvcGVydHkoJ3JvbGxiYXJDb250ZXh0JykpIHtcbiAgICAgICAgY3VzdG9tID0gbWVyZ2UoY3VzdG9tLCBub25DaXJjdWxhckNsb25lKGVycm9yc1tpXS5yb2xsYmFyQ29udGV4dCkpO1xuICAgICAgICBjb250ZXh0QWRkZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEF2b2lkIGFkZGluZyBhbiBlbXB0eSBvYmplY3QgdG8gdGhlIGRhdGEuXG4gICAgaWYgKGNvbnRleHRBZGRlZCkge1xuICAgICAgaXRlbS5kYXRhLmN1c3RvbSA9IGN1c3RvbTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpdGVtLmRpYWdub3N0aWMuZXJyb3JfY29udGV4dCA9ICdGYWlsZWQ6ICcgKyBlLm1lc3NhZ2U7XG4gIH1cbn1cblxudmFyIFRFTEVNRVRSWV9UWVBFUyA9IFtcbiAgJ2xvZycsXG4gICduZXR3b3JrJyxcbiAgJ2RvbScsXG4gICduYXZpZ2F0aW9uJyxcbiAgJ2Vycm9yJyxcbiAgJ21hbnVhbCcsXG5dO1xudmFyIFRFTEVNRVRSWV9MRVZFTFMgPSBbJ2NyaXRpY2FsJywgJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbycsICdkZWJ1ZyddO1xuXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFyciwgdmFsKSB7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgYXJyLmxlbmd0aDsgKytrKSB7XG4gICAgaWYgKGFycltrXSA9PT0gdmFsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRlbGVtZXRyeUV2ZW50KGFyZ3MpIHtcbiAgdmFyIHR5cGUsIG1ldGFkYXRhLCBsZXZlbDtcbiAgdmFyIGFyZztcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcblxuICAgIHZhciB0eXAgPSB0eXBlTmFtZShhcmcpO1xuICAgIHN3aXRjaCAodHlwKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAoIXR5cGUgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfVFlQRVMsIGFyZykpIHtcbiAgICAgICAgICB0eXBlID0gYXJnO1xuICAgICAgICB9IGVsc2UgaWYgKCFsZXZlbCAmJiBhcnJheUluY2x1ZGVzKFRFTEVNRVRSWV9MRVZFTFMsIGFyZykpIHtcbiAgICAgICAgICBsZXZlbCA9IGFyZztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIG1ldGFkYXRhID0gYXJnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXZlbnQgPSB7XG4gICAgdHlwZTogdHlwZSB8fCAnbWFudWFsJyxcbiAgICBtZXRhZGF0YTogbWV0YWRhdGEgfHwge30sXG4gICAgbGV2ZWw6IGxldmVsLFxuICB9O1xuXG4gIHJldHVybiBldmVudDtcbn1cblxuZnVuY3Rpb24gYWRkSXRlbUF0dHJpYnV0ZXMoaXRlbSwgYXR0cmlidXRlcykge1xuICBpdGVtLmRhdGEuYXR0cmlidXRlcyA9IGl0ZW0uZGF0YS5hdHRyaWJ1dGVzIHx8IFtdO1xuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGl0ZW0uZGF0YS5hdHRyaWJ1dGVzLnB1c2goLi4uYXR0cmlidXRlcyk7XG4gIH1cbn1cblxuLypcbiAqIGdldCAtIGdpdmVuIGFuIG9iai9hcnJheSBhbmQgYSBrZXlwYXRoLCByZXR1cm4gdGhlIHZhbHVlIGF0IHRoYXQga2V5cGF0aCBvclxuICogICAgICAgdW5kZWZpbmVkIGlmIG5vdCBwb3NzaWJsZS5cbiAqXG4gKiBAcGFyYW0gb2JqIC0gYW4gb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0gcGF0aCAtIGEgc3RyaW5nIG9mIGtleXMgc2VwYXJhdGVkIGJ5ICcuJyBzdWNoIGFzICdwbHVnaW4uanF1ZXJ5LjAubWVzc2FnZSdcbiAqICAgIHdoaWNoIHdvdWxkIGNvcnJlc3BvbmQgdG8gNDIgaW4gYHtwbHVnaW46IHtqcXVlcnk6IFt7bWVzc2FnZTogNDJ9XX19YFxuICovXG5mdW5jdGlvbiBnZXQob2JqLCBwYXRoKSB7XG4gIGlmICghb2JqKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIHJlc3VsdCA9IG9iajtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0W2tleXNbaV1dO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBwYXRoLCB2YWx1ZSkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIga2V5cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICBpZiAobGVuIDwgMSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobGVuID09PSAxKSB7XG4gICAgb2JqW2tleXNbMF1dID0gdmFsdWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgdmFyIHRlbXAgPSBvYmpba2V5c1swXV0gfHwge307XG4gICAgdmFyIHJlcGxhY2VtZW50ID0gdGVtcDtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7ICsraSkge1xuICAgICAgdGVtcFtrZXlzW2ldXSA9IHRlbXBba2V5c1tpXV0gfHwge307XG4gICAgICB0ZW1wID0gdGVtcFtrZXlzW2ldXTtcbiAgICB9XG4gICAgdGVtcFtrZXlzW2xlbiAtIDFdXSA9IHZhbHVlO1xuICAgIG9ialtrZXlzWzBdXSA9IHJlcGxhY2VtZW50O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3NBc1N0cmluZyhhcmdzKSB7XG4gIHZhciBpLCBsZW4sIGFyZztcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBzd2l0Y2ggKHR5cGVOYW1lKGFyZykpIHtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGFyZyA9IHN0cmluZ2lmeShhcmcpO1xuICAgICAgICBhcmcgPSBhcmcuZXJyb3IgfHwgYXJnLnZhbHVlO1xuICAgICAgICBpZiAoYXJnLmxlbmd0aCA+IDUwMCkge1xuICAgICAgICAgIGFyZyA9IGFyZy5zdWJzdHIoMCwgNDk3KSArICcuLi4nO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVsbCc6XG4gICAgICAgIGFyZyA9ICdudWxsJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICBhcmcgPSAndW5kZWZpbmVkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICBhcmcgPSBhcmcudG9TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGFyZyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIG5vdygpIHtcbiAgaWYgKERhdGUubm93KSB7XG4gICAgcmV0dXJuICtEYXRlLm5vdygpO1xuICB9XG4gIHJldHVybiArbmV3IERhdGUoKTtcbn1cblxuZnVuY3Rpb24gZmlsdGVySXAocmVxdWVzdERhdGEsIGNhcHR1cmVJcCkge1xuICBpZiAoIXJlcXVlc3REYXRhIHx8ICFyZXF1ZXN0RGF0YVsndXNlcl9pcCddIHx8IGNhcHR1cmVJcCA9PT0gdHJ1ZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmV3SXAgPSByZXF1ZXN0RGF0YVsndXNlcl9pcCddO1xuICBpZiAoIWNhcHR1cmVJcCkge1xuICAgIG5ld0lwID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHBhcnRzO1xuICAgICAgaWYgKG5ld0lwLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnLicpO1xuICAgICAgICBwYXJ0cy5wb3AoKTtcbiAgICAgICAgcGFydHMucHVzaCgnMCcpO1xuICAgICAgICBuZXdJcCA9IHBhcnRzLmpvaW4oJy4nKTtcbiAgICAgIH0gZWxzZSBpZiAobmV3SXAuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICBwYXJ0cyA9IG5ld0lwLnNwbGl0KCc6Jyk7XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgdmFyIGJlZ2lubmluZyA9IHBhcnRzLnNsaWNlKDAsIDMpO1xuICAgICAgICAgIHZhciBzbGFzaElkeCA9IGJlZ2lubmluZ1syXS5pbmRleE9mKCcvJyk7XG4gICAgICAgICAgaWYgKHNsYXNoSWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgYmVnaW5uaW5nWzJdID0gYmVnaW5uaW5nWzJdLnN1YnN0cmluZygwLCBzbGFzaElkeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB0ZXJtaW5hbCA9ICcwMDAwOjAwMDA6MDAwMDowMDAwOjAwMDAnO1xuICAgICAgICAgIG5ld0lwID0gYmVnaW5uaW5nLmNvbmNhdCh0ZXJtaW5hbCkuam9pbignOicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdJcCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgbmV3SXAgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXF1ZXN0RGF0YVsndXNlcl9pcCddID0gbmV3SXA7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU9wdGlvbnMoY3VycmVudCwgaW5wdXQsIHBheWxvYWQsIGxvZ2dlcikge1xuICB2YXIgcmVzdWx0ID0gbWVyZ2UoY3VycmVudCwgaW5wdXQsIHBheWxvYWQpO1xuICByZXN1bHQgPSB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhyZXN1bHQsIGxvZ2dlcik7XG4gIGlmICghaW5wdXQgfHwgaW5wdXQub3ZlcndyaXRlU2NydWJGaWVsZHMpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChpbnB1dC5zY3J1YkZpZWxkcykge1xuICAgIHJlc3VsdC5zY3J1YkZpZWxkcyA9IChjdXJyZW50LnNjcnViRmllbGRzIHx8IFtdKS5jb25jYXQoaW5wdXQuc2NydWJGaWVsZHMpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zKG9wdGlvbnMsIGxvZ2dlcikge1xuICBpZiAob3B0aW9ucy5ob3N0V2hpdGVMaXN0ICYmICFvcHRpb25zLmhvc3RTYWZlTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdFNhZmVMaXN0ID0gb3B0aW9ucy5ob3N0V2hpdGVMaXN0O1xuICAgIG9wdGlvbnMuaG9zdFdoaXRlTGlzdCA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIgJiYgbG9nZ2VyLmxvZygnaG9zdFdoaXRlTGlzdCBpcyBkZXByZWNhdGVkLiBVc2UgaG9zdFNhZmVMaXN0LicpO1xuICB9XG4gIGlmIChvcHRpb25zLmhvc3RCbGFja0xpc3QgJiYgIW9wdGlvbnMuaG9zdEJsb2NrTGlzdCkge1xuICAgIG9wdGlvbnMuaG9zdEJsb2NrTGlzdCA9IG9wdGlvbnMuaG9zdEJsYWNrTGlzdDtcbiAgICBvcHRpb25zLmhvc3RCbGFja0xpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RCbGFja0xpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RCbG9ja0xpc3QuJyk7XG4gIH1cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aDogYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgsXG4gIGNyZWF0ZUl0ZW06IGNyZWF0ZUl0ZW0sXG4gIGFkZEVycm9yQ29udGV4dDogYWRkRXJyb3JDb250ZXh0LFxuICBjcmVhdGVUZWxlbWV0cnlFdmVudDogY3JlYXRlVGVsZW1ldHJ5RXZlbnQsXG4gIGFkZEl0ZW1BdHRyaWJ1dGVzOiBhZGRJdGVtQXR0cmlidXRlcyxcbiAgZmlsdGVySXA6IGZpbHRlcklwLFxuICBmb3JtYXRBcmdzQXNTdHJpbmc6IGZvcm1hdEFyZ3NBc1N0cmluZyxcbiAgZm9ybWF0VXJsOiBmb3JtYXRVcmwsXG4gIGdldDogZ2V0LFxuICBoYW5kbGVPcHRpb25zOiBoYW5kbGVPcHRpb25zLFxuICBpc0Vycm9yOiBpc0Vycm9yLFxuICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIGlzSXRlcmFibGU6IGlzSXRlcmFibGUsXG4gIGlzTmF0aXZlRnVuY3Rpb246IGlzTmF0aXZlRnVuY3Rpb24sXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc1R5cGU6IGlzVHlwZSxcbiAgaXNQcm9taXNlOiBpc1Byb21pc2UsXG4gIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICBqc29uUGFyc2U6IGpzb25QYXJzZSxcbiAgTEVWRUxTOiBMRVZFTFMsXG4gIG1ha2VVbmhhbmRsZWRTdGFja0luZm86IG1ha2VVbmhhbmRsZWRTdGFja0luZm8sXG4gIG1lcmdlOiBtZXJnZSxcbiAgbm93OiBub3csXG4gIHJlZGFjdDogcmVkYWN0LFxuICBSb2xsYmFySlNPTjogUm9sbGJhckpTT04sXG4gIHNhbml0aXplVXJsOiBzYW5pdGl6ZVVybCxcbiAgc2V0OiBzZXQsXG4gIHNldHVwSlNPTjogc2V0dXBKU09OLFxuICBzdHJpbmdpZnk6IHN0cmluZ2lmeSxcbiAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICB0eXBlTmFtZTogdHlwZU5hbWUsXG4gIHV1aWQ0OiB1dWlkNCxcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcblxuZnVuY3Rpb24gdHJhdmVyc2Uob2JqLCBmdW5jLCBzZWVuKSB7XG4gIHZhciBrLCB2LCBpO1xuICB2YXIgaXNPYmogPSBfLmlzVHlwZShvYmosICdvYmplY3QnKTtcbiAgdmFyIGlzQXJyYXkgPSBfLmlzVHlwZShvYmosICdhcnJheScpO1xuICB2YXIga2V5cyA9IFtdO1xuICB2YXIgc2VlbkluZGV4O1xuXG4gIC8vIEJlc3QgbWlnaHQgYmUgdG8gdXNlIE1hcCBoZXJlIHdpdGggYG9iamAgYXMgdGhlIGtleXMsIGJ1dCB3ZSB3YW50IHRvIHN1cHBvcnQgSUUgPCAxMS5cbiAgc2VlbiA9IHNlZW4gfHwgeyBvYmo6IFtdLCBtYXBwZWQ6IFtdIH07XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmouaW5kZXhPZihvYmopO1xuXG4gICAgaWYgKGlzT2JqICYmIHNlZW5JbmRleCAhPT0gLTEpIHtcbiAgICAgIC8vIFByZWZlciB0aGUgbWFwcGVkIG9iamVjdCBpZiB0aGVyZSBpcyBvbmUuXG4gICAgICByZXR1cm4gc2Vlbi5tYXBwZWRbc2VlbkluZGV4XSB8fCBzZWVuLm9ialtzZWVuSW5kZXhdO1xuICAgIH1cblxuICAgIHNlZW4ub2JqLnB1c2gob2JqKTtcbiAgICBzZWVuSW5kZXggPSBzZWVuLm9iai5sZW5ndGggLSAxO1xuICB9XG5cbiAgaWYgKGlzT2JqKSB7XG4gICAgZm9yIChrIGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGspKSB7XG4gICAgICAgIGtleXMucHVzaChrKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNBcnJheSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyArK2kpIHtcbiAgICAgIGtleXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcmVzdWx0ID0gaXNPYmogPyB7fSA6IFtdO1xuICB2YXIgc2FtZSA9IHRydWU7XG4gIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgayA9IGtleXNbaV07XG4gICAgdiA9IG9ialtrXTtcbiAgICByZXN1bHRba10gPSBmdW5jKGssIHYsIHNlZW4pO1xuICAgIHNhbWUgPSBzYW1lICYmIHJlc3VsdFtrXSA9PT0gb2JqW2tdO1xuICB9XG5cbiAgaWYgKGlzT2JqICYmICFzYW1lKSB7XG4gICAgc2Vlbi5tYXBwZWRbc2VlbkluZGV4XSA9IHJlc3VsdDtcbiAgfVxuXG4gIHJldHVybiAhc2FtZSA/IHJlc3VsdCA6IG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmF2ZXJzZTtcbiIsIi8vICBqc29uMy5qc1xuLy8gIDIwMTctMDItMjFcbi8vICBQdWJsaWMgRG9tYWluLlxuLy8gIE5PIFdBUlJBTlRZIEVYUFJFU1NFRCBPUiBJTVBMSUVELiBVU0UgQVQgWU9VUiBPV04gUklTSy5cbi8vICBTZWUgaHR0cDovL3d3dy5KU09OLm9yZy9qcy5odG1sXG4vLyAgVGhpcyBjb2RlIHNob3VsZCBiZSBtaW5pZmllZCBiZWZvcmUgZGVwbG95bWVudC5cbi8vICBTZWUgaHR0cDovL2phdmFzY3JpcHQuY3JvY2tmb3JkLmNvbS9qc21pbi5odG1sXG5cbi8vICBVU0UgWU9VUiBPV04gQ09QWS4gSVQgSVMgRVhUUkVNRUxZIFVOV0lTRSBUTyBMT0FEIENPREUgRlJPTSBTRVJWRVJTIFlPVSBET1xuLy8gIE5PVCBDT05UUk9MLlxuXG4vLyAgVGhpcyBmaWxlIGNyZWF0ZXMgYSBnbG9iYWwgSlNPTiBvYmplY3QgY29udGFpbmluZyB0d28gbWV0aG9kczogc3RyaW5naWZ5XG4vLyAgYW5kIHBhcnNlLiBUaGlzIGZpbGUgcHJvdmlkZXMgdGhlIEVTNSBKU09OIGNhcGFiaWxpdHkgdG8gRVMzIHN5c3RlbXMuXG4vLyAgSWYgYSBwcm9qZWN0IG1pZ2h0IHJ1biBvbiBJRTggb3IgZWFybGllciwgdGhlbiB0aGlzIGZpbGUgc2hvdWxkIGJlIGluY2x1ZGVkLlxuLy8gIFRoaXMgZmlsZSBkb2VzIG5vdGhpbmcgb24gRVM1IHN5c3RlbXMuXG5cbi8vICAgICAgSlNPTi5zdHJpbmdpZnkodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSlcbi8vICAgICAgICAgIHZhbHVlICAgICAgIGFueSBKYXZhU2NyaXB0IHZhbHVlLCB1c3VhbGx5IGFuIG9iamVjdCBvciBhcnJheS5cbi8vICAgICAgICAgIHJlcGxhY2VyICAgIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IGRldGVybWluZXMgaG93IG9iamVjdFxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWVzIGFyZSBzdHJpbmdpZmllZCBmb3Igb2JqZWN0cy4gSXQgY2FuIGJlIGFcbi8vICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4vLyAgICAgICAgICBzcGFjZSAgICAgICBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBzcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uXG4vLyAgICAgICAgICAgICAgICAgICAgICBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCwgdGhlIHRleHQgd2lsbFxuLy8gICAgICAgICAgICAgICAgICAgICAgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYSBudW1iZXIsXG4vLyAgICAgICAgICAgICAgICAgICAgICBpdCB3aWxsIHNwZWNpZnkgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gaW5kZW50IGF0IGVhY2hcbi8vICAgICAgICAgICAgICAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgaXQgY29udGFpbnMgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbi8vICAgICAgICAgIFRoaXMgbWV0aG9kIHByb2R1Y2VzIGEgSlNPTiB0ZXh0IGZyb20gYSBKYXZhU2NyaXB0IHZhbHVlLlxuLy8gICAgICAgICAgV2hlbiBhbiBvYmplY3QgdmFsdWUgaXMgZm91bmQsIGlmIHRoZSBvYmplY3QgY29udGFpbnMgYSB0b0pTT05cbi8vICAgICAgICAgIG1ldGhvZCwgaXRzIHRvSlNPTiBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYW5kIHRoZSByZXN1bHQgd2lsbCBiZVxuLy8gICAgICAgICAgc3RyaW5naWZpZWQuIEEgdG9KU09OIG1ldGhvZCBkb2VzIG5vdCBzZXJpYWxpemU6IGl0IHJldHVybnMgdGhlXG4vLyAgICAgICAgICB2YWx1ZSByZXByZXNlbnRlZCBieSB0aGUgbmFtZS92YWx1ZSBwYWlyIHRoYXQgc2hvdWxkIGJlIHNlcmlhbGl6ZWQsXG4vLyAgICAgICAgICBvciB1bmRlZmluZWQgaWYgbm90aGluZyBzaG91bGQgYmUgc2VyaWFsaXplZC4gVGhlIHRvSlNPTiBtZXRob2Rcbi8vICAgICAgICAgIHdpbGwgYmUgcGFzc2VkIHRoZSBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoZSB2YWx1ZSwgYW5kIHRoaXMgd2lsbCBiZVxuLy8gICAgICAgICAgYm91bmQgdG8gdGhlIHZhbHVlLlxuXG4vLyAgICAgICAgICBGb3IgZXhhbXBsZSwgdGhpcyB3b3VsZCBzZXJpYWxpemUgRGF0ZXMgYXMgSVNPIHN0cmluZ3MuXG5cbi8vICAgICAgICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGYobikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IGludGVnZXJzIHRvIGhhdmUgYXQgbGVhc3QgdHdvIGRpZ2l0cy5cbi8vICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAobiA8IDEwKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgID8gXCIwXCIgKyBuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgICArIFwiLVwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENEYXRlKCkpICAgICAgKyBcIlRcIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICAgICArIFwiOlwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTWludXRlcygpKSAgICsgXCI6XCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICAgKyBcIlpcIjtcbi8vICAgICAgICAgICAgICB9O1xuXG4vLyAgICAgICAgICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWwgcmVwbGFjZXIgbWV0aG9kLiBJdCB3aWxsIGJlIHBhc3NlZCB0aGVcbi8vICAgICAgICAgIGtleSBhbmQgdmFsdWUgb2YgZWFjaCBtZW1iZXIsIHdpdGggdGhpcyBib3VuZCB0byB0aGUgY29udGFpbmluZ1xuLy8gICAgICAgICAgb2JqZWN0LiBUaGUgdmFsdWUgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHlvdXIgbWV0aG9kIHdpbGwgYmVcbi8vICAgICAgICAgIHNlcmlhbGl6ZWQuIElmIHlvdXIgbWV0aG9kIHJldHVybnMgdW5kZWZpbmVkLCB0aGVuIHRoZSBtZW1iZXIgd2lsbFxuLy8gICAgICAgICAgYmUgZXhjbHVkZWQgZnJvbSB0aGUgc2VyaWFsaXphdGlvbi5cblxuLy8gICAgICAgICAgSWYgdGhlIHJlcGxhY2VyIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB0aGVuIGl0IHdpbGwgYmVcbi8vICAgICAgICAgIHVzZWQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHNlcmlhbGl6ZWQuIEl0IGZpbHRlcnMgdGhlIHJlc3VsdHNcbi8vICAgICAgICAgIHN1Y2ggdGhhdCBvbmx5IG1lbWJlcnMgd2l0aCBrZXlzIGxpc3RlZCBpbiB0aGUgcmVwbGFjZXIgYXJyYXkgYXJlXG4vLyAgICAgICAgICBzdHJpbmdpZmllZC5cblxuLy8gICAgICAgICAgVmFsdWVzIHRoYXQgZG8gbm90IGhhdmUgSlNPTiByZXByZXNlbnRhdGlvbnMsIHN1Y2ggYXMgdW5kZWZpbmVkIG9yXG4vLyAgICAgICAgICBmdW5jdGlvbnMsIHdpbGwgbm90IGJlIHNlcmlhbGl6ZWQuIFN1Y2ggdmFsdWVzIGluIG9iamVjdHMgd2lsbCBiZVxuLy8gICAgICAgICAgZHJvcHBlZDsgaW4gYXJyYXlzIHRoZXkgd2lsbCBiZSByZXBsYWNlZCB3aXRoIG51bGwuIFlvdSBjYW4gdXNlXG4vLyAgICAgICAgICBhIHJlcGxhY2VyIGZ1bmN0aW9uIHRvIHJlcGxhY2UgdGhvc2Ugd2l0aCBKU09OIHZhbHVlcy5cblxuLy8gICAgICAgICAgSlNPTi5zdHJpbmdpZnkodW5kZWZpbmVkKSByZXR1cm5zIHVuZGVmaW5lZC5cblxuLy8gICAgICAgICAgVGhlIG9wdGlvbmFsIHNwYWNlIHBhcmFtZXRlciBwcm9kdWNlcyBhIHN0cmluZ2lmaWNhdGlvbiBvZiB0aGVcbi8vICAgICAgICAgIHZhbHVlIHRoYXQgaXMgZmlsbGVkIHdpdGggbGluZSBicmVha3MgYW5kIGluZGVudGF0aW9uIHRvIG1ha2UgaXRcbi8vICAgICAgICAgIGVhc2llciB0byByZWFkLlxuXG4vLyAgICAgICAgICBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbm9uLWVtcHR5IHN0cmluZywgdGhlbiB0aGF0IHN0cmluZyB3aWxsXG4vLyAgICAgICAgICBiZSB1c2VkIGZvciBpbmRlbnRhdGlvbi4gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgdGhlblxuLy8gICAgICAgICAgdGhlIGluZGVudGF0aW9uIHdpbGwgYmUgdGhhdCBtYW55IHNwYWNlcy5cblxuLy8gICAgICAgICAgRXhhbXBsZTpcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtcImVcIiwge3BsdXJpYnVzOiBcInVudW1cIn1dKTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcImVcIix7XCJwbHVyaWJ1c1wiOlwidW51bVwifV0nXG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbXCJlXCIsIHtwbHVyaWJ1czogXCJ1bnVtXCJ9XSwgbnVsbCwgXCJcXHRcIik7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXFxuXFx0XCJlXCIsXFxuXFx0e1xcblxcdFxcdFwicGx1cmlidXNcIjogXCJ1bnVtXCJcXG5cXHR9XFxuXSdcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtuZXcgRGF0ZSgpXSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldIGluc3RhbmNlb2YgRGF0ZVxuLy8gICAgICAgICAgICAgICAgICA/IFwiRGF0ZShcIiArIHRoaXNba2V5XSArIFwiKVwiXG4vLyAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4vLyAgICAgICAgICB9KTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcIkRhdGUoLS0tY3VycmVudCB0aW1lLS0tKVwiXSdcblxuLy8gICAgICBKU09OLnBhcnNlKHRleHQsIHJldml2ZXIpXG4vLyAgICAgICAgICBUaGlzIG1ldGhvZCBwYXJzZXMgYSBKU09OIHRleHQgdG8gcHJvZHVjZSBhbiBvYmplY3Qgb3IgYXJyYXkuXG4vLyAgICAgICAgICBJdCBjYW4gdGhyb3cgYSBTeW50YXhFcnJvciBleGNlcHRpb24uXG4vLyAgICAgICAgICBUaGlzIGhhcyBiZWVuIG1vZGlmaWVkIHRvIHVzZSBKU09OLWpzL2pzb25fcGFyc2Vfc3RhdGUuanMgYXMgdGhlXG4vLyAgICAgICAgICBwYXJzZXIgaW5zdGVhZCBvZiB0aGUgb25lIGJ1aWx0IGFyb3VuZCBldmFsIGZvdW5kIGluIEpTT04tanMvanNvbjIuanNcblxuLy8gICAgICAgICAgVGhlIG9wdGlvbmFsIHJldml2ZXIgcGFyYW1ldGVyIGlzIGEgZnVuY3Rpb24gdGhhdCBjYW4gZmlsdGVyIGFuZFxuLy8gICAgICAgICAgdHJhbnNmb3JtIHRoZSByZXN1bHRzLiBJdCByZWNlaXZlcyBlYWNoIG9mIHRoZSBrZXlzIGFuZCB2YWx1ZXMsXG4vLyAgICAgICAgICBhbmQgaXRzIHJldHVybiB2YWx1ZSBpcyB1c2VkIGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIHZhbHVlLlxuLy8gICAgICAgICAgSWYgaXQgcmV0dXJucyB3aGF0IGl0IHJlY2VpdmVkLCB0aGVuIHRoZSBzdHJ1Y3R1cmUgaXMgbm90IG1vZGlmaWVkLlxuLy8gICAgICAgICAgSWYgaXQgcmV0dXJucyB1bmRlZmluZWQgdGhlbiB0aGUgbWVtYmVyIGlzIGRlbGV0ZWQuXG5cbi8vICAgICAgICAgIEV4YW1wbGU6XG5cbi8vICAgICAgICAgIC8vIFBhcnNlIHRoZSB0ZXh0LiBWYWx1ZXMgdGhhdCBsb29rIGxpa2UgSVNPIGRhdGUgc3RyaW5ncyB3aWxsXG4vLyAgICAgICAgICAvLyBiZSBjb252ZXJ0ZWQgdG8gRGF0ZSBvYmplY3RzLlxuXG4vLyAgICAgICAgICBteURhdGEgPSBKU09OLnBhcnNlKHRleHQsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgdmFyIGE7XG4vLyAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuLy8gICAgICAgICAgICAgICAgICBhID1cbi8vICAgL14oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KD86XFwuXFxkKik/KVokLy5leGVjKHZhbHVlKTtcbi8vICAgICAgICAgICAgICAgICAgaWYgKGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQygrYVsxXSwgK2FbMl0gLSAxLCArYVszXSwgK2FbNF0sXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgK2FbNV0sICthWzZdKSk7XG4vLyAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuLy8gICAgICAgICAgfSk7XG5cbi8vICAgICAgICAgIG15RGF0YSA9IEpTT04ucGFyc2UoJ1tcIkRhdGUoMDkvMDkvMjAwMSlcIl0nLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgIHZhciBkO1xuLy8gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiZcbi8vICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNsaWNlKDAsIDUpID09PSBcIkRhdGUoXCIgJiZcbi8vICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnNsaWNlKC0xKSA9PT0gXCIpXCIpIHtcbi8vICAgICAgICAgICAgICAgICAgZCA9IG5ldyBEYXRlKHZhbHVlLnNsaWNlKDUsIC0xKSk7XG4vLyAgICAgICAgICAgICAgICAgIGlmIChkKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZDtcbi8vICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4vLyAgICAgICAgICB9KTtcblxuLy8gIFRoaXMgaXMgYSByZWZlcmVuY2UgaW1wbGVtZW50YXRpb24uIFlvdSBhcmUgZnJlZSB0byBjb3B5LCBtb2RpZnksIG9yXG4vLyAgcmVkaXN0cmlidXRlLlxuXG4vKmpzbGludFxuICBmb3IsIHRoaXNcbiAgKi9cblxuLypwcm9wZXJ0eVxuICBKU09OLCBhcHBseSwgY2FsbCwgY2hhckNvZGVBdCwgZ2V0VVRDRGF0ZSwgZ2V0VVRDRnVsbFllYXIsIGdldFVUQ0hvdXJzLFxuICBnZXRVVENNaW51dGVzLCBnZXRVVENNb250aCwgZ2V0VVRDU2Vjb25kcywgaGFzT3duUHJvcGVydHksIGpvaW4sXG4gIGxhc3RJbmRleCwgbGVuZ3RoLCBwYXJzZSwgcHJvdG90eXBlLCBwdXNoLCByZXBsYWNlLCBzbGljZSwgc3RyaW5naWZ5LFxuICB0ZXN0LCB0b0pTT04sIHRvU3RyaW5nLCB2YWx1ZU9mXG4gICovXG5cbnZhciBzZXR1cEN1c3RvbUpTT04gPSBmdW5jdGlvbihKU09OKSB7XG5cbiAgdmFyIHJ4X29uZSA9IC9eW1xcXSw6e31cXHNdKiQvO1xuICB2YXIgcnhfdHdvID0gL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZztcbiAgdmFyIHJ4X3RocmVlID0gL1wiW15cIlxcXFxcXG5cXHJdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nO1xuICB2YXIgcnhfZm91ciA9IC8oPzpefDp8LCkoPzpcXHMqXFxbKSsvZztcbiAgdmFyIHJ4X2VzY2FwYWJsZSA9IC9bXFxcXFwiXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zi1cXHUwMDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gIHZhciByeF9kYW5nZXJvdXMgPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcblxuICBmdW5jdGlvbiBmKG4pIHtcbiAgICAvLyBGb3JtYXQgaW50ZWdlcnMgdG8gaGF2ZSBhdCBsZWFzdCB0d28gZGlnaXRzLlxuICAgIHJldHVybiBuIDwgMTBcbiAgICAgID8gXCIwXCIgKyBuXG4gICAgICA6IG47XG4gIH1cblxuICBmdW5jdGlvbiB0aGlzX3ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9KU09OICE9PSBcImZ1bmN0aW9uXCIpIHtcblxuICAgIERhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgcmV0dXJuIGlzRmluaXRlKHRoaXMudmFsdWVPZigpKVxuICAgICAgICA/IHRoaXMuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICtcbiAgICAgICAgZih0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICtcbiAgICAgICAgZih0aGlzLmdldFVUQ0RhdGUoKSkgKyBcIlRcIiArXG4gICAgICAgIGYodGhpcy5nZXRVVENIb3VycygpKSArIFwiOlwiICtcbiAgICAgICAgZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkgKyBcIjpcIiArXG4gICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICsgXCJaXCJcbiAgICAgICAgOiBudWxsO1xuICAgIH07XG5cbiAgICBCb29sZWFuLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlO1xuICAgIE51bWJlci5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZTtcbiAgICBTdHJpbmcucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWU7XG4gIH1cblxuICB2YXIgZ2FwO1xuICB2YXIgaW5kZW50O1xuICB2YXIgbWV0YTtcbiAgdmFyIHJlcDtcblxuXG4gIGZ1bmN0aW9uIHF1b3RlKHN0cmluZykge1xuXG4gICAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuICAgIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gICAgLy8gT3RoZXJ3aXNlIHdlIG11c3QgYWxzbyByZXBsYWNlIHRoZSBvZmZlbmRpbmcgY2hhcmFjdGVycyB3aXRoIHNhZmUgZXNjYXBlXG4gICAgLy8gc2VxdWVuY2VzLlxuXG4gICAgcnhfZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHJ4X2VzY2FwYWJsZS50ZXN0KHN0cmluZylcbiAgICAgID8gXCJcXFwiXCIgKyBzdHJpbmcucmVwbGFjZShyeF9lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHZhciBjID0gbWV0YVthXTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBjID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgPyBjXG4gICAgICAgICAgOiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICB9KSArIFwiXFxcIlwiXG4gICAgOiBcIlxcXCJcIiArIHN0cmluZyArIFwiXFxcIlwiO1xuICB9XG5cblxuICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuICAgIC8vIFByb2R1Y2UgYSBzdHJpbmcgZnJvbSBob2xkZXJba2V5XS5cblxuICAgIHZhciBpOyAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgIHZhciBrOyAgICAgICAgICAvLyBUaGUgbWVtYmVyIGtleS5cbiAgICB2YXIgdjsgICAgICAgICAgLy8gVGhlIG1lbWJlciB2YWx1ZS5cbiAgICB2YXIgbGVuZ3RoO1xuICAgIHZhciBtaW5kID0gZ2FwO1xuICAgIHZhciBwYXJ0aWFsO1xuICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gICAgLy8gSWYgdGhlIHZhbHVlIGhhcyBhIHRvSlNPTiBtZXRob2QsIGNhbGwgaXQgdG8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oa2V5KTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSB3ZXJlIGNhbGxlZCB3aXRoIGEgcmVwbGFjZXIgZnVuY3Rpb24sIHRoZW4gY2FsbCB0aGUgcmVwbGFjZXIgdG9cbiAgICAvLyBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cblxuICAgIGlmICh0eXBlb2YgcmVwID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhbHVlID0gcmVwLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBXaGF0IGhhcHBlbnMgbmV4dCBkZXBlbmRzIG9uIHRoZSB2YWx1ZSdzIHR5cGUuXG5cbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICByZXR1cm4gcXVvdGUodmFsdWUpO1xuXG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG5cbiAgICAgICAgLy8gSlNPTiBudW1iZXJzIG11c3QgYmUgZmluaXRlLiBFbmNvZGUgbm9uLWZpbml0ZSBudW1iZXJzIGFzIG51bGwuXG5cbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKVxuICAgICAgICAgID8gU3RyaW5nKHZhbHVlKVxuICAgICAgICAgIDogXCJudWxsXCI7XG5cbiAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICBjYXNlIFwibnVsbFwiOlxuXG4gICAgICAgIC8vIElmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW4gb3IgbnVsbCwgY29udmVydCBpdCB0byBhIHN0cmluZy4gTm90ZTpcbiAgICAgICAgLy8gdHlwZW9mIG51bGwgZG9lcyBub3QgcHJvZHVjZSBcIm51bGxcIi4gVGhlIGNhc2UgaXMgaW5jbHVkZWQgaGVyZSBpblxuICAgICAgICAvLyB0aGUgcmVtb3RlIGNoYW5jZSB0aGF0IHRoaXMgZ2V0cyBmaXhlZCBzb21lZGF5LlxuXG4gICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuXG4gICAgICAgIC8vIElmIHRoZSB0eXBlIGlzIFwib2JqZWN0XCIsIHdlIG1pZ2h0IGJlIGRlYWxpbmcgd2l0aCBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgb3JcbiAgICAgICAgLy8gbnVsbC5cblxuICAgICAgY2FzZSBcIm9iamVjdFwiOlxuXG4gICAgICAgIC8vIER1ZSB0byBhIHNwZWNpZmljYXRpb24gYmx1bmRlciBpbiBFQ01BU2NyaXB0LCB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLFxuICAgICAgICAvLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgIGdhcCArPSBpbmRlbnQ7XG4gICAgICAgIHBhcnRpYWwgPSBbXTtcblxuICAgICAgICAvLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkodmFsdWUpID09PSBcIltvYmplY3QgQXJyYXldXCIpIHtcblxuICAgICAgICAgIC8vIFRoZSB2YWx1ZSBpcyBhbiBhcnJheS4gU3RyaW5naWZ5IGV2ZXJ5IGVsZW1lbnQuIFVzZSBudWxsIGFzIGEgcGxhY2Vob2xkZXJcbiAgICAgICAgICAvLyBmb3Igbm9uLUpTT04gdmFsdWVzLlxuXG4gICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgcGFydGlhbFtpXSA9IHN0cihpLCB2YWx1ZSkgfHwgXCJudWxsXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSm9pbiBhbGwgb2YgdGhlIGVsZW1lbnRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsIGFuZCB3cmFwIHRoZW0gaW5cbiAgICAgICAgICAvLyBicmFja2V0cy5cblxuICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgPyBcIltdXCJcbiAgICAgICAgICAgIDogZ2FwXG4gICAgICAgICAgICA/IFwiW1xcblwiICsgZ2FwICsgcGFydGlhbC5qb2luKFwiLFxcblwiICsgZ2FwKSArIFwiXFxuXCIgKyBtaW5kICsgXCJdXCJcbiAgICAgICAgICAgIDogXCJbXCIgKyBwYXJ0aWFsLmpvaW4oXCIsXCIpICsgXCJdXCI7XG4gICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSByZXBsYWNlciBpcyBhbiBhcnJheSwgdXNlIGl0IHRvIHNlbGVjdCB0aGUgbWVtYmVycyB0byBiZSBzdHJpbmdpZmllZC5cblxuICAgICAgICBpZiAocmVwICYmIHR5cGVvZiByZXAgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXBbaV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgayA9IHJlcFtpXTtcbiAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKFxuICAgICAgICAgICAgICAgICAgICAgIGdhcFxuICAgICAgICAgICAgICAgICAgICAgID8gXCI6IFwiXG4gICAgICAgICAgICAgICAgICAgICAgOiBcIjpcIlxuICAgICAgICAgICAgICAgICAgICAgICkgKyB2KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIE90aGVyd2lzZSwgaXRlcmF0ZSB0aHJvdWdoIGFsbCBvZiB0aGUga2V5cyBpbiB0aGUgb2JqZWN0LlxuXG4gICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICB2ID0gc3RyKGssIHZhbHVlKTtcbiAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoXG4gICAgICAgICAgICAgICAgICAgICAgZ2FwXG4gICAgICAgICAgICAgICAgICAgICAgPyBcIjogXCJcbiAgICAgICAgICAgICAgICAgICAgICA6IFwiOlwiXG4gICAgICAgICAgICAgICAgICAgICAgKSArIHYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuICAgICAgICAvLyBhbmQgd3JhcCB0aGVtIGluIGJyYWNlcy5cblxuICAgICAgICB2ID0gcGFydGlhbC5sZW5ndGggPT09IDBcbiAgICAgICAgICA/IFwie31cIlxuICAgICAgICAgIDogZ2FwXG4gICAgICAgICAgPyBcIntcXG5cIiArIGdhcCArIHBhcnRpYWwuam9pbihcIixcXG5cIiArIGdhcCkgKyBcIlxcblwiICsgbWluZCArIFwifVwiXG4gICAgICAgICAgOiBcIntcIiArIHBhcnRpYWwuam9pbihcIixcIikgKyBcIn1cIjtcbiAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgc3RyaW5naWZ5IG1ldGhvZCwgZ2l2ZSBpdCBvbmUuXG5cbiAgaWYgKHR5cGVvZiBKU09OLnN0cmluZ2lmeSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgbWV0YSA9IHsgICAgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcbiAgICAgIFwiXFxiXCI6IFwiXFxcXGJcIixcbiAgICAgIFwiXFx0XCI6IFwiXFxcXHRcIixcbiAgICAgIFwiXFxuXCI6IFwiXFxcXG5cIixcbiAgICAgIFwiXFxmXCI6IFwiXFxcXGZcIixcbiAgICAgIFwiXFxyXCI6IFwiXFxcXHJcIixcbiAgICAgIFwiXFxcIlwiOiBcIlxcXFxcXFwiXCIsXG4gICAgICBcIlxcXFxcIjogXCJcXFxcXFxcXFwiXG4gICAgfTtcbiAgICBKU09OLnN0cmluZ2lmeSA9IGZ1bmN0aW9uICh2YWx1ZSwgcmVwbGFjZXIsIHNwYWNlKSB7XG5cbiAgICAgIC8vIFRoZSBzdHJpbmdpZnkgbWV0aG9kIHRha2VzIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIHJlcGxhY2VyLCBhbmQgYW4gb3B0aW9uYWxcbiAgICAgIC8vIHNwYWNlIHBhcmFtZXRlciwgYW5kIHJldHVybnMgYSBKU09OIHRleHQuIFRoZSByZXBsYWNlciBjYW4gYmUgYSBmdW5jdGlvblxuICAgICAgLy8gdGhhdCBjYW4gcmVwbGFjZSB2YWx1ZXMsIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCB3aWxsIHNlbGVjdCB0aGUga2V5cy5cbiAgICAgIC8vIEEgZGVmYXVsdCByZXBsYWNlciBtZXRob2QgY2FuIGJlIHByb3ZpZGVkLiBVc2Ugb2YgdGhlIHNwYWNlIHBhcmFtZXRlciBjYW5cbiAgICAgIC8vIHByb2R1Y2UgdGV4dCB0aGF0IGlzIG1vcmUgZWFzaWx5IHJlYWRhYmxlLlxuXG4gICAgICB2YXIgaTtcbiAgICAgIGdhcCA9IFwiXCI7XG4gICAgICBpbmRlbnQgPSBcIlwiO1xuXG4gICAgICAvLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XG4gICAgICAvLyBtYW55IHNwYWNlcy5cblxuICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc3BhY2U7IGkgKz0gMSkge1xuICAgICAgICAgIGluZGVudCArPSBcIiBcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cblxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgaW5kZW50ID0gc3BhY2U7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIGEgcmVwbGFjZXIsIGl0IG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheS5cbiAgICAgIC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3IuXG5cbiAgICAgIHJlcCA9IHJlcGxhY2VyO1xuICAgICAgaWYgKHJlcGxhY2VyICYmIHR5cGVvZiByZXBsYWNlciAhPT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgKHR5cGVvZiByZXBsYWNlciAhPT0gXCJvYmplY3RcIiB8fFxuICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSBcIm51bWJlclwiKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJKU09OLnN0cmluZ2lmeVwiKTtcbiAgICAgIH1cblxuICAgICAgLy8gTWFrZSBhIGZha2Ugcm9vdCBvYmplY3QgY29udGFpbmluZyBvdXIgdmFsdWUgdW5kZXIgdGhlIGtleSBvZiBcIlwiLlxuICAgICAgLy8gUmV0dXJuIHRoZSByZXN1bHQgb2Ygc3RyaW5naWZ5aW5nIHRoZSB2YWx1ZS5cblxuICAgICAgcmV0dXJuIHN0cihcIlwiLCB7XCJcIjogdmFsdWV9KTtcbiAgICB9O1xuICB9XG5cblxuICAvLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBwYXJzZSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gIGlmICh0eXBlb2YgSlNPTi5wYXJzZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgSlNPTi5wYXJzZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgIC8vIFRoaXMgZnVuY3Rpb24gY3JlYXRlcyBhIEpTT04gcGFyc2UgZnVuY3Rpb24gdGhhdCB1c2VzIGEgc3RhdGUgbWFjaGluZSByYXRoZXJcbiAgICAgIC8vIHRoYW4gdGhlIGRhbmdlcm91cyBldmFsIGZ1bmN0aW9uIHRvIHBhcnNlIGEgSlNPTiB0ZXh0LlxuXG4gICAgICB2YXIgc3RhdGU7ICAgICAgLy8gVGhlIHN0YXRlIG9mIHRoZSBwYXJzZXIsIG9uZSBvZlxuICAgICAgLy8gJ2dvJyAgICAgICAgIFRoZSBzdGFydGluZyBzdGF0ZVxuICAgICAgLy8gJ29rJyAgICAgICAgIFRoZSBmaW5hbCwgYWNjZXB0aW5nIHN0YXRlXG4gICAgICAvLyAnZmlyc3Rva2V5JyAgUmVhZHkgZm9yIHRoZSBmaXJzdCBrZXkgb2YgdGhlIG9iamVjdCBvclxuICAgICAgLy8gICAgICAgICAgICAgIHRoZSBjbG9zaW5nIG9mIGFuIGVtcHR5IG9iamVjdFxuICAgICAgLy8gJ29rZXknICAgICAgIFJlYWR5IGZvciB0aGUgbmV4dCBrZXkgb2YgdGhlIG9iamVjdFxuICAgICAgLy8gJ2NvbG9uJyAgICAgIFJlYWR5IGZvciB0aGUgY29sb25cbiAgICAgIC8vICdvdmFsdWUnICAgICBSZWFkeSBmb3IgdGhlIHZhbHVlIGhhbGYgb2YgYSBrZXkvdmFsdWUgcGFpclxuICAgICAgLy8gJ29jb21tYScgICAgIFJlYWR5IGZvciBhIGNvbW1hIG9yIGNsb3NpbmcgfVxuICAgICAgLy8gJ2ZpcnN0YXZhbHVlJyBSZWFkeSBmb3IgdGhlIGZpcnN0IHZhbHVlIG9mIGFuIGFycmF5IG9yXG4gICAgICAvLyAgICAgICAgICAgICAgYW4gZW1wdHkgYXJyYXlcbiAgICAgIC8vICdhdmFsdWUnICAgICBSZWFkeSBmb3IgdGhlIG5leHQgdmFsdWUgb2YgYW4gYXJyYXlcbiAgICAgIC8vICdhY29tbWEnICAgICBSZWFkeSBmb3IgYSBjb21tYSBvciBjbG9zaW5nIF1cbiAgICAgIHZhciBzdGFjazsgICAgICAvLyBUaGUgc3RhY2ssIGZvciBjb250cm9sbGluZyBuZXN0aW5nLlxuICAgICAgdmFyIGNvbnRhaW5lcjsgIC8vIFRoZSBjdXJyZW50IGNvbnRhaW5lciBvYmplY3Qgb3IgYXJyYXlcbiAgICAgIHZhciBrZXk7ICAgICAgICAvLyBUaGUgY3VycmVudCBrZXlcbiAgICAgIHZhciB2YWx1ZTsgICAgICAvLyBUaGUgY3VycmVudCB2YWx1ZVxuICAgICAgdmFyIGVzY2FwZXMgPSB7IC8vIEVzY2FwZW1lbnQgdHJhbnNsYXRpb24gdGFibGVcbiAgICAgICAgXCJcXFxcXCI6IFwiXFxcXFwiLFxuICAgICAgICBcIlxcXCJcIjogXCJcXFwiXCIsXG4gICAgICAgIFwiL1wiOiBcIi9cIixcbiAgICAgICAgXCJ0XCI6IFwiXFx0XCIsXG4gICAgICAgIFwiblwiOiBcIlxcblwiLFxuICAgICAgICBcInJcIjogXCJcXHJcIixcbiAgICAgICAgXCJmXCI6IFwiXFxmXCIsXG4gICAgICAgIFwiYlwiOiBcIlxcYlwiXG4gICAgICB9O1xuICAgICAgdmFyIHN0cmluZyA9IHsgICAvLyBUaGUgYWN0aW9ucyBmb3Igc3RyaW5nIHRva2Vuc1xuICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJva1wiO1xuICAgICAgICB9LFxuICAgICAgICBmaXJzdG9rZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBrZXkgPSB2YWx1ZTtcbiAgICAgICAgICBzdGF0ZSA9IFwiY29sb25cIjtcbiAgICAgICAgfSxcbiAgICAgICAgb2tleTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGtleSA9IHZhbHVlO1xuICAgICAgICAgIHN0YXRlID0gXCJjb2xvblwiO1xuICAgICAgICB9LFxuICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwib2NvbW1hXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICB9LFxuICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgbnVtYmVyID0geyAgIC8vIFRoZSBhY3Rpb25zIGZvciBudW1iZXIgdG9rZW5zXG4gICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcIm9rXCI7XG4gICAgICAgIH0sXG4gICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJvY29tbWFcIjtcbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBhY3Rpb24gPSB7XG5cbiAgICAgICAgLy8gVGhlIGFjdGlvbiB0YWJsZSBkZXNjcmliZXMgdGhlIGJlaGF2aW9yIG9mIHRoZSBtYWNoaW5lLiBJdCBjb250YWlucyBhblxuICAgICAgICAvLyBvYmplY3QgZm9yIGVhY2ggdG9rZW4uIEVhY2ggb2JqZWN0IGNvbnRhaW5zIGEgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW5cbiAgICAgICAgLy8gYSB0b2tlbiBpcyBtYXRjaGVkIGluIGEgc3RhdGUuIEFuIG9iamVjdCB3aWxsIGxhY2sgYSBtZXRob2QgZm9yIGlsbGVnYWxcbiAgICAgICAgLy8gc3RhdGVzLlxuXG4gICAgICAgIFwie1wiOiB7XG4gICAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe3N0YXRlOiBcIm9rXCJ9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHt9O1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0b2tleVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtjb250YWluZXI6IGNvbnRhaW5lciwgc3RhdGU6IFwib2NvbW1hXCIsIGtleToga2V5fSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSB7fTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdG9rZXlcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtjb250YWluZXI6IGNvbnRhaW5lciwgc3RhdGU6IFwiYWNvbW1hXCJ9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHt9O1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0b2tleVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtjb250YWluZXI6IGNvbnRhaW5lciwgc3RhdGU6IFwiYWNvbW1hXCJ9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHt9O1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0b2tleVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ9XCI6IHtcbiAgICAgICAgICBmaXJzdG9rZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwb3AgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIHZhbHVlID0gY29udGFpbmVyO1xuICAgICAgICAgICAgY29udGFpbmVyID0gcG9wLmNvbnRhaW5lcjtcbiAgICAgICAgICAgIGtleSA9IHBvcC5rZXk7XG4gICAgICAgICAgICBzdGF0ZSA9IHBvcC5zdGF0ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9jb21tYTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBvcCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHZhbHVlID0gY29udGFpbmVyO1xuICAgICAgICAgICAgY29udGFpbmVyID0gcG9wLmNvbnRhaW5lcjtcbiAgICAgICAgICAgIGtleSA9IHBvcC5rZXk7XG4gICAgICAgICAgICBzdGF0ZSA9IHBvcC5zdGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiW1wiOiB7XG4gICAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe3N0YXRlOiBcIm9rXCJ9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IFtdO1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0YXZhbHVlXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe2NvbnRhaW5lcjogY29udGFpbmVyLCBzdGF0ZTogXCJvY29tbWFcIiwga2V5OiBrZXl9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IFtdO1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0YXZhbHVlXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7Y29udGFpbmVyOiBjb250YWluZXIsIHN0YXRlOiBcImFjb21tYVwifSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSBbXTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdGF2YWx1ZVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtjb250YWluZXI6IGNvbnRhaW5lciwgc3RhdGU6IFwiYWNvbW1hXCJ9KTtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IFtdO1xuICAgICAgICAgICAgc3RhdGUgPSBcImZpcnN0YXZhbHVlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIl1cIjoge1xuICAgICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcG9wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHBvcC5jb250YWluZXI7XG4gICAgICAgICAgICBrZXkgPSBwb3Aua2V5O1xuICAgICAgICAgICAgc3RhdGUgPSBwb3Auc3RhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY29tbWE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwb3AgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHZhbHVlID0gY29udGFpbmVyO1xuICAgICAgICAgICAgY29udGFpbmVyID0gcG9wLmNvbnRhaW5lcjtcbiAgICAgICAgICAgIGtleSA9IHBvcC5rZXk7XG4gICAgICAgICAgICBzdGF0ZSA9IHBvcC5zdGF0ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiOlwiOiB7XG4gICAgICAgICAgY29sb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChjb250YWluZXIsIGtleSkpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiRHVwbGljYXRlIGtleSAnXCIgKyBrZXkgKyBcIlxcXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZSA9IFwib3ZhbHVlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIixcIjoge1xuICAgICAgICAgIG9jb21tYTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJva2V5XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY29tbWE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhdmFsdWVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidHJ1ZVwiOiB7XG4gICAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJva1wiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2NvbW1hXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImZhbHNlXCI6IHtcbiAgICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJva1wiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9jb21tYVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm51bGxcIjoge1xuICAgICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2tcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9jb21tYVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZnVuY3Rpb24gZGViYWNrc2xhc2hpZnkodGV4dCkge1xuXG4gICAgICAgIC8vIFJlbW92ZSBhbmQgcmVwbGFjZSBhbnkgYmFja3NsYXNoIGVzY2FwZW1lbnQuXG5cbiAgICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxcXCg/OnUoLns0fSl8KFtedV0pKS9nLCBmdW5jdGlvbiAoaWdub3JlLCBiLCBjKSB7XG4gICAgICAgICAgcmV0dXJuIGJcbiAgICAgICAgICAgID8gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChiLCAxNikpXG4gICAgICAgICAgICA6IGVzY2FwZXNbY107XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHNvdXJjZSwgcmV2aXZlcikge1xuXG4gICAgICAgIC8vIEEgcmVndWxhciBleHByZXNzaW9uIGlzIHVzZWQgdG8gZXh0cmFjdCB0b2tlbnMgZnJvbSB0aGUgSlNPTiB0ZXh0LlxuICAgICAgICAvLyBUaGUgZXh0cmFjdGlvbiBwcm9jZXNzIGlzIGNhdXRpb3VzLlxuXG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHZhciB0eCA9IC9eW1xcdTAwMjBcXHRcXG5cXHJdKig/OihbLDpcXFtcXF17fV18dHJ1ZXxmYWxzZXxudWxsKXwoLT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8pfFwiKCg/OlteXFxyXFxuXFx0XFxcXFxcXCJdfFxcXFwoPzpbXCJcXFxcXFwvdHJuZmJdfHVbMC05YS1mQS1GXXs0fSkpKilcIikvO1xuXG4gICAgICAgIC8vIFNldCB0aGUgc3RhcnRpbmcgc3RhdGUuXG5cbiAgICAgICAgc3RhdGUgPSBcImdvXCI7XG5cbiAgICAgICAgLy8gVGhlIHN0YWNrIHJlY29yZHMgdGhlIGNvbnRhaW5lciwga2V5LCBhbmQgc3RhdGUgZm9yIGVhY2ggb2JqZWN0IG9yIGFycmF5XG4gICAgICAgIC8vIHRoYXQgY29udGFpbnMgYW5vdGhlciBvYmplY3Qgb3IgYXJyYXkgd2hpbGUgcHJvY2Vzc2luZyBuZXN0ZWQgc3RydWN0dXJlcy5cblxuICAgICAgICBzdGFjayA9IFtdO1xuXG4gICAgICAgIC8vIElmIGFueSBlcnJvciBvY2N1cnMsIHdlIHdpbGwgY2F0Y2ggaXQgYW5kIHVsdGltYXRlbHkgdGhyb3cgYSBzeW50YXggZXJyb3IuXG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIC8vIEZvciBlYWNoIHRva2VuLi4uXG5cbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdHguZXhlYyhzb3VyY2UpO1xuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlc3VsdCBpcyB0aGUgcmVzdWx0IGFycmF5IGZyb20gbWF0Y2hpbmcgdGhlIHRva2VuaXppbmcgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAgICAgICAgLy8gIHJlc3VsdFswXSBjb250YWlucyBldmVyeXRoaW5nIHRoYXQgbWF0Y2hlZCwgaW5jbHVkaW5nIGFueSBpbml0aWFsIHdoaXRlc3BhY2UuXG4gICAgICAgICAgICAvLyAgcmVzdWx0WzFdIGNvbnRhaW5zIGFueSBwdW5jdHVhdGlvbiB0aGF0IHdhcyBtYXRjaGVkLCBvciB0cnVlLCBmYWxzZSwgb3IgbnVsbC5cbiAgICAgICAgICAgIC8vICByZXN1bHRbMl0gY29udGFpbnMgYSBtYXRjaGVkIG51bWJlciwgc3RpbGwgaW4gc3RyaW5nIGZvcm0uXG4gICAgICAgICAgICAvLyAgcmVzdWx0WzNdIGNvbnRhaW5zIGEgbWF0Y2hlZCBzdHJpbmcsIHdpdGhvdXQgcXVvdGVzIGJ1dCB3aXRoIGVzY2FwZW1lbnQuXG5cbiAgICAgICAgICAgIGlmIChyZXN1bHRbMV0pIHtcblxuICAgICAgICAgICAgICAvLyBUb2tlbjogRXhlY3V0ZSB0aGUgYWN0aW9uIGZvciB0aGlzIHN0YXRlIGFuZCB0b2tlbi5cblxuICAgICAgICAgICAgICBhY3Rpb25bcmVzdWx0WzFdXVtzdGF0ZV0oKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHRbMl0pIHtcblxuICAgICAgICAgICAgICAvLyBOdW1iZXIgdG9rZW46IENvbnZlcnQgdGhlIG51bWJlciBzdHJpbmcgaW50byBhIG51bWJlciB2YWx1ZSBhbmQgZXhlY3V0ZVxuICAgICAgICAgICAgICAvLyB0aGUgYWN0aW9uIGZvciB0aGlzIHN0YXRlIGFuZCBudW1iZXIuXG5cbiAgICAgICAgICAgICAgdmFsdWUgPSArcmVzdWx0WzJdO1xuICAgICAgICAgICAgICBudW1iZXJbc3RhdGVdKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIC8vIFN0cmluZyB0b2tlbjogUmVwbGFjZSB0aGUgZXNjYXBlbWVudCBzZXF1ZW5jZXMgYW5kIGV4ZWN1dGUgdGhlIGFjdGlvbiBmb3JcbiAgICAgICAgICAgICAgLy8gdGhpcyBzdGF0ZSBhbmQgc3RyaW5nLlxuXG4gICAgICAgICAgICAgIHZhbHVlID0gZGViYWNrc2xhc2hpZnkocmVzdWx0WzNdKTtcbiAgICAgICAgICAgICAgc3RyaW5nW3N0YXRlXSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHRva2VuIGZyb20gdGhlIHN0cmluZy4gVGhlIGxvb3Agd2lsbCBjb250aW51ZSBhcyBsb25nIGFzIHRoZXJlXG4gICAgICAgICAgICAvLyBhcmUgdG9rZW5zLiBUaGlzIGlzIGEgc2xvdyBwcm9jZXNzLCBidXQgaXQgYWxsb3dzIHRoZSB1c2Ugb2YgXiBtYXRjaGluZyxcbiAgICAgICAgICAgIC8vIHdoaWNoIGFzc3VyZXMgdGhhdCBubyBpbGxlZ2FsIHRva2VucyBzbGlwIHRocm91Z2guXG5cbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS5zbGljZShyZXN1bHRbMF0ubGVuZ3RoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBJZiB3ZSBmaW5kIGEgc3RhdGUvdG9rZW4gY29tYmluYXRpb24gdGhhdCBpcyBpbGxlZ2FsLCB0aGVuIHRoZSBhY3Rpb24gd2lsbFxuICAgICAgICAgIC8vIGNhdXNlIGFuIGVycm9yLiBXZSBoYW5kbGUgdGhlIGVycm9yIGJ5IHNpbXBseSBjaGFuZ2luZyB0aGUgc3RhdGUuXG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHN0YXRlID0gZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBwYXJzaW5nIGlzIGZpbmlzaGVkLiBJZiB3ZSBhcmUgbm90IGluIHRoZSBmaW5hbCBcIm9rXCIgc3RhdGUsIG9yIGlmIHRoZVxuICAgICAgICAvLyByZW1haW5pbmcgc291cmNlIGNvbnRhaW5zIGFueXRoaW5nIGV4Y2VwdCB3aGl0ZXNwYWNlLCB0aGVuIHdlIGRpZCBub3QgaGF2ZVxuICAgICAgICAvL2Egd2VsbC1mb3JtZWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgIGlmIChzdGF0ZSAhPT0gXCJva1wiIHx8ICgvW15cXHUwMDIwXFx0XFxuXFxyXS8udGVzdChzb3VyY2UpKSkge1xuICAgICAgICAgIHRocm93IChzdGF0ZSBpbnN0YW5jZW9mIFN5bnRheEVycm9yKVxuICAgICAgICAgICAgPyBzdGF0ZVxuICAgICAgICAgICAgOiBuZXcgU3ludGF4RXJyb3IoXCJKU09OXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLFxuICAgICAgICAvLyBwYXNzaW5nIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIHRoZSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZVxuICAgICAgICAvLyB0cmFuc2Zvcm1hdGlvbiwgc3RhcnRpbmcgd2l0aCBhIHRlbXBvcmFyeSByb290IG9iamVjdCB0aGF0IGhvbGRzIHRoZSBjdXJyZW50XG4gICAgICAgIC8vIHZhbHVlIGluIGFuIGVtcHR5IGtleS4gSWYgdGhlcmUgaXMgbm90IGEgcmV2aXZlciBmdW5jdGlvbiwgd2Ugc2ltcGx5IHJldHVyblxuICAgICAgICAvLyB0aGF0IHZhbHVlLlxuXG4gICAgICAgIHJldHVybiAodHlwZW9mIHJldml2ZXIgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICA/IChmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XG4gICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgIHZhciB2O1xuICAgICAgICAgICAgdmFyIHZhbCA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsLCBrKSkge1xuICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsLCBrKTtcbiAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsW2tdID0gdjtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWxba107XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWwpO1xuICAgICAgICAgIH0oe1wiXCI6IHZhbHVlfSwgXCJcIikpXG4gICAgICAgIDogdmFsdWU7XG4gICAgICB9O1xuICAgIH0oKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR1cEN1c3RvbUpTT047XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG52YXIgUm9sbGJhciA9IHJlcXVpcmUoJy4uL3NyYy9yZWFjdC1uYXRpdmUvcm9sbGJhcicpO1xudmFyIHJvbGxiYXJDb25maWcgPSB7XG4gIGFjY2Vzc1Rva2VuOiAnUE9TVF9DTElFTlRfSVRFTV9UT0tFTicsXG4gIGNhcHR1cmVVbmNhdWdodDogdHJ1ZSxcbiAgY2FwdHVyZVVuaGFuZGxlZFJlamVjdGlvbnM6IHRydWUsXG59O1xudmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihyb2xsYmFyQ29uZmlnKTtcblxuZGVzY3JpYmUoJ3NlbmRKc29uUGF5bG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHV1aWQgPSAnZDRjN2FjZWY1NWJmNGM5ZWE5NWU0ZmU5NDI4YTgyODcnO1xuXG4gIGJlZm9yZShmdW5jdGlvbiAoZG9uZSkge1xuICAgIC8vIEluIHJlYWN0LW5hdGl2ZSBlbnZpcm9ubWVudCwgc3R1YiBmZXRjaCgpIGluc3RlYWQgb2YgWE1MSHR0cFJlcXVlc3RcbiAgICB3aW5kb3cuZmV0Y2hTdHViID0gc2lub24uc3R1Yih3aW5kb3csICdmZXRjaCcpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgYWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5mZXRjaC5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0dWJSZXNwb25zZShjb2RlLCBlcnIsIG1lc3NhZ2UpIHtcbiAgICB3aW5kb3cuZmV0Y2gucmV0dXJucyhcbiAgICAgIFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgbmV3IFJlc3BvbnNlKFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGVycjogZXJyLFxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgICAgIHJlc3VsdDogeyB1dWlkOiB1dWlkIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdHVzOiBjb2RlLFxuICAgICAgICAgICAgc3RhdHVzVGV4dDogbWVzc2FnZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICApLFxuICAgICk7XG4gIH1cblxuICBpdCgnc2hvdWxkIGNhbGxiYWNrIHdpdGggdGhlIHJpZ2h0IHZhbHVlIG9uIHN1Y2Nlc3MnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHN0dWJSZXNwb25zZSgyMDAsIDAsICdPSycpO1xuXG4gICAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeSh7IGZvbzogJ2JhYWFyJyB9KTtcblxuICAgIHJvbGxiYXIuc2VuZEpzb25QYXlsb2FkKGpzb24pO1xuXG4gICAgZXhwZWN0KHdpbmRvdy5mZXRjaFN0dWIuY2FsbGVkKS50by5iZS5vaygpO1xuICAgIGV4cGVjdCh3aW5kb3cuZmV0Y2hTdHViLmdldENhbGwoMCkuYXJnc1sxXS5ib2R5KS50by5lcWwoanNvbik7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IERVTU1ZX1RSQUNFX0lEID0gJ3NvbWUtdHJhY2UtaWQnO1xuY29uc3QgRFVNTVlfU1BBTl9JRCA9ICdzb21lLXNwYW4taWQnO1xuXG5jb25zdCBWYWxpZE9wZW5UcmFjaW5nVHJhY2VyU3R1YiA9IHtcbiAgc2NvcGU6ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aXZlOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc2V0VGFnOiAoKSA9PiB7fSxcbiAgICAgICAgICBjb250ZXh0OiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0b1RyYWNlSWQ6ICgpID0+IERVTU1ZX1RSQUNFX0lELFxuICAgICAgICAgICAgICB0b1NwYW5JZDogKCkgPT4gRFVNTVlfU1BBTl9JRCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG5cbmNvbnN0IEludmFsaWRPcGVuVHJhY2luZ1RyYWNlclN0dWIgPSB7XG4gIGZvbzogKCkgPT4ge30sXG59O1xuXG5mdW5jdGlvbiBUZXN0Q2xpZW50R2VuKCkge1xuICB2YXIgVGVzdENsaWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnRyYW5zZm9ybXMgPSBbXTtcbiAgICB0aGlzLnByZWRpY2F0ZXMgPSBbXTtcbiAgICB0aGlzLm5vdGlmaWVyID0ge1xuICAgICAgYWRkVHJhbnNmb3JtOiBmdW5jdGlvbiAodCkge1xuICAgICAgICB0aGlzLnRyYW5zZm9ybXMucHVzaCh0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubm90aWZpZXI7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgfTtcbiAgICB0aGlzLnF1ZXVlID0ge1xuICAgICAgYWRkUHJlZGljYXRlOiBmdW5jdGlvbiAocCkge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVldWU7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgfTtcbiAgICB0aGlzLmxvZ0NhbGxzID0gW107XG4gICAgdmFyIGxvZ3MgPSAnbG9nLGRlYnVnLGluZm8sd2Fybix3YXJuaW5nLGVycm9yLGNyaXRpY2FsJy5zcGxpdCgnLCcpO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2dzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgZm4gPSBsb2dzW2ldLnNsaWNlKDApO1xuICAgICAgdGhpc1tmbl0gPSBmdW5jdGlvbiAoZm4sIGl0ZW0pIHtcbiAgICAgICAgdGhpcy5sb2dDYWxscy5wdXNoKHsgZnVuYzogZm4sIGl0ZW06IGl0ZW0gfSk7XG4gICAgICB9LmJpbmQodGhpcywgZm4pO1xuICAgIH1cbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLnBheWxvYWREYXRhID0ge307XG4gICAgdGhpcy5jb25maWd1cmUgPSBmdW5jdGlvbiAobywgcGF5bG9hZERhdGEpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG87XG4gICAgICB0aGlzLnBheWxvYWREYXRhID0gcGF5bG9hZERhdGE7XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gVGVzdENsaWVudDtcbn1cblxuZGVzY3JpYmUoJ1JvbGxiYXIoKScsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBoYXZlIGFsbCBvZiB0aGUgZXhwZWN0ZWQgbWV0aG9kcyB3aXRoIGEgcmVhbCBjbGllbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKTtcblxuICAgIGV4cGVjdChyb2xsYmFyKS50by5oYXZlLnByb3BlcnR5KCdsb2cnKTtcbiAgICBleHBlY3Qocm9sbGJhcikudG8uaGF2ZS5wcm9wZXJ0eSgnZGVidWcnKTtcbiAgICBleHBlY3Qocm9sbGJhcikudG8uaGF2ZS5wcm9wZXJ0eSgnaW5mbycpO1xuICAgIGV4cGVjdChyb2xsYmFyKS50by5oYXZlLnByb3BlcnR5KCd3YXJuJyk7XG4gICAgZXhwZWN0KHJvbGxiYXIpLnRvLmhhdmUucHJvcGVydHkoJ3dhcm5pbmcnKTtcbiAgICBleHBlY3Qocm9sbGJhcikudG8uaGF2ZS5wcm9wZXJ0eSgnZXJyb3InKTtcbiAgICBleHBlY3Qocm9sbGJhcikudG8uaGF2ZS5wcm9wZXJ0eSgnY3JpdGljYWwnKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBoYXZlIGFsbCBvZiB0aGUgZXhwZWN0ZWQgbWV0aG9kcycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGNsaWVudCA9IG5ldyAoVGVzdENsaWVudEdlbigpKSgpO1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zLCBjbGllbnQpO1xuXG4gICAgZXhwZWN0KHJvbGxiYXIpLnRvLmhhdmUucHJvcGVydHkoJ2xvZycpO1xuICAgIGV4cGVjdChyb2xsYmFyKS50by5oYXZlLnByb3BlcnR5KCdkZWJ1ZycpO1xuICAgIGV4cGVjdChyb2xsYmFyKS50by5oYXZlLnByb3BlcnR5KCdpbmZvJyk7XG4gICAgZXhwZWN0KHJvbGxiYXIpLnRvLmhhdmUucHJvcGVydHkoJ3dhcm4nKTtcbiAgICBleHBlY3Qocm9sbGJhcikudG8uaGF2ZS5wcm9wZXJ0eSgnd2FybmluZycpO1xuICAgIGV4cGVjdChyb2xsYmFyKS50by5oYXZlLnByb3BlcnR5KCdlcnJvcicpO1xuICAgIGV4cGVjdChyb2xsYmFyKS50by5oYXZlLnByb3BlcnR5KCdjcml0aWNhbCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGhhdmUgc29tZSBkZWZhdWx0IG9wdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMuc2NydWJGaWVsZHMpLnRvLmNvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIG1lcmdlIHdpdGggdGhlIGRlZmF1bHRzIG9wdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHNjcnViRmllbGRzOiBbJ2Zvb2JhciddLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zLCBjbGllbnQpO1xuXG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5zY3J1YkZpZWxkcykudG8uY29udGFpbignZm9vYmFyJyk7XG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5zY3J1YkZpZWxkcykudG8uY29udGFpbigncGFzc3dvcmQnKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgb3ZlcndyaXRlIGRlZmF1bHQgaWYgc3BlY2lmaWVkJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBzY3J1YkZpZWxkczogWydmb29iYXInXSxcbiAgICAgIG92ZXJ3cml0ZVNjcnViRmllbGRzOiB0cnVlLFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zLCBjbGllbnQpO1xuXG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5zY3J1YkZpZWxkcykudG8uY29udGFpbignZm9vYmFyJyk7XG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5zY3J1YkZpZWxkcykudG8ubm90LmNvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJlcGxhY2UgZGVwcmVjYXRlZCBvcHRpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBob3N0V2hpdGVMaXN0OiBbJ2ZvbyddLFxuICAgICAgaG9zdEJsYWNrTGlzdDogWydiYXInXSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMuaG9zdFdoaXRlTGlzdCkudG8uZXFsKHVuZGVmaW5lZCk7XG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5ob3N0QmxhY2tMaXN0KS50by5lcWwodW5kZWZpbmVkKTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLmhvc3RTYWZlTGlzdCkudG8uY29udGFpbignZm9vJyk7XG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5ob3N0QmxvY2tMaXN0KS50by5jb250YWluKCdiYXInKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgdXVpZCB3aGVuIGxvZ2dpbmcnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIHZhciByZXN1bHQgPSByb2xsYmFyLmxvZygnYSBtZXNzYXNnZScsICdhbm90aGVyIG9uZScpO1xuICAgIGV4cGVjdChyZXN1bHQudXVpZCkudG8uYmUub2soKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBwYWNrYWdlIHVwIHRoZSBpbnB1dHMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIHZhciByZXN1bHQgPSByb2xsYmFyLmxvZygnYSBtZXNzYWdlJywgJ2Fub3RoZXIgb25lJyk7XG4gICAgdmFyIGxvZ2dlZEl0ZW0gPSBjbGllbnQubG9nQ2FsbHNbMF0uaXRlbTtcbiAgICBleHBlY3QobG9nZ2VkSXRlbS5tZXNzYWdlKS50by5lcWwoJ2EgbWVzc2FnZScpO1xuICAgIGV4cGVjdChsb2dnZWRJdGVtLmN1c3RvbSkudG8uYmUub2soKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjYWxsIHRoZSBjbGllbnQgd2l0aCB0aGUgcmlnaHQgbWV0aG9kJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCk7XG5cbiAgICB2YXIgbWV0aG9kcyA9ICdsb2csZGVidWcsaW5mbyx3YXJuLHdhcm5pbmcsZXJyb3IsY3JpdGljYWwnLnNwbGl0KCcsJyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbXNnID0gJ21lc3NhZ2U6JyArIGk7XG4gICAgICByb2xsYmFyW21ldGhvZHNbaV1dKG1zZyk7XG4gICAgICBleHBlY3QoY2xpZW50LmxvZ0NhbGxzW2ldLmZ1bmMpLnRvLmVxbChtZXRob2RzW2ldKTtcbiAgICAgIGV4cGVjdChjbGllbnQubG9nQ2FsbHNbaV0uaXRlbS5tZXNzYWdlKS50by5lcWwobXNnKTtcbiAgICB9XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgaGF2ZSBhIHRyYWNlciBpZiB2YWxpZCB0cmFjZXIgaXMgcHJvdmlkZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0geyB0cmFjZXI6IFZhbGlkT3BlblRyYWNpbmdUcmFjZXJTdHViIH07XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKTtcblxuICAgIGV4cGVjdChyb2xsYmFyLmNsaWVudC50cmFjZXIpLnRvLmVxbChWYWxpZE9wZW5UcmFjaW5nVHJhY2VyU3R1Yik7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgbm90IGhhdmUgYSB0cmFjZXIgaWYgaW52YWxpZCB0cmFjZXIgaXMgcHJvdmlkZWQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0geyB0cmFjZXI6IEludmFsaWRPcGVuVHJhY2luZ1RyYWNlclN0dWIgfTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpO1xuXG4gICAgZXhwZWN0KHJvbGxiYXIuY2xpZW50LnRyYWNlcikudG8uZXFsKG51bGwpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY29uZmlndXJlJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGNvbmZpZ3VyZSBjbGllbnQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgYTogNDIsXG4gICAgICAgIGVudmlyb25tZW50OiAndGVzdHRlc3QnLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLnBheWxvYWQuZW52aXJvbm1lbnQpLnRvLmVxbCgndGVzdHRlc3QnKTtcblxuICAgIHJvbGxiYXIuY29uZmlndXJlKHsgcGF5bG9hZDogeyBlbnZpcm9ubWVudDogJ2Jvcmtib3JrJyB9IH0pO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMucGF5bG9hZC5lbnZpcm9ubWVudCkudG8uZXFsKCdib3JrYm9yaycpO1xuICAgIGV4cGVjdChjbGllbnQub3B0aW9ucy5wYXlsb2FkLmVudmlyb25tZW50KS50by5lcWwoJ2Jvcmtib3JrJyk7XG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBhY2NlcHQgYSBzZWNvbmQgcGFyYW1ldGVyIGFuZCB1c2UgaXQgYXMgdGhlIHBheWxvYWQgdmFsdWUnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgYTogNDIsXG4gICAgICAgIGVudmlyb25tZW50OiAndGVzdHRlc3QnLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLnBheWxvYWQuZW52aXJvbm1lbnQpLnRvLmVxbCgndGVzdHRlc3QnKTtcblxuICAgIHJvbGxiYXIuY29uZmlndXJlKHsgc29tZWtleTogJ2Jvcmtib3JrJyB9LCB7IGI6IDk3IH0pO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMuc29tZWtleSkudG8uZXFsKCdib3JrYm9yaycpO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMucGF5bG9hZC5iKS50by5lcWwoOTcpO1xuICAgIGV4cGVjdChjbGllbnQucGF5bG9hZERhdGEuYikudG8uZXFsKDk3KTtcbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGFjY2VwdCBhIHNlY29uZCBwYXJhbWV0ZXIgYW5kIG92ZXJyaWRlIHRoZSBwYXlsb2FkIHdpdGggaXQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgYTogNDIsXG4gICAgICAgIGVudmlyb25tZW50OiAndGVzdHRlc3QnLFxuICAgICAgfSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLnBheWxvYWQuZW52aXJvbm1lbnQpLnRvLmVxbCgndGVzdHRlc3QnKTtcblxuICAgIHJvbGxiYXIuY29uZmlndXJlKHsgc29tZWtleTogJ2Jvcmtib3JrJywgcGF5bG9hZDogeyBiOiAxMDEgfSB9LCB7IGI6IDk3IH0pO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMuc29tZWtleSkudG8uZXFsKCdib3JrYm9yaycpO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMucGF5bG9hZC5iKS50by5lcWwoOTcpO1xuICAgIGV4cGVjdChjbGllbnQucGF5bG9hZERhdGEuYikudG8uZXFsKDk3KTtcbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIHJlcGxhY2UgZGVwcmVjYXRlZCBvcHRpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBob3N0V2hpdGVMaXN0OiBbJ2ZvbyddLFxuICAgICAgaG9zdEJsYWNrTGlzdDogWydiYXInXSxcbiAgICB9O1xuICAgIHZhciByb2xsYmFyID0gKHdpbmRvdy5yb2xsYmFyID0gbmV3IFJvbGxiYXIoXG4gICAgICB7IGF1dG9JbnN0cnVtZW50OiBmYWxzZSB9LFxuICAgICAgY2xpZW50LFxuICAgICkpO1xuICAgIHJvbGxiYXIuY29uZmlndXJlKG9wdGlvbnMpO1xuXG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5ob3N0V2hpdGVMaXN0KS50by5lcWwodW5kZWZpbmVkKTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLmhvc3RCbGFja0xpc3QpLnRvLmVxbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMuaG9zdFNhZmVMaXN0KS50by5jb250YWluKCdmb28nKTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLmhvc3RCbG9ja0xpc3QpLnRvLmNvbnRhaW4oJ2JhcicpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgc3RvcmUgY29uZmlndXJlZCBvcHRpb25zJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBjYXB0dXJlVW5jYXVnaHQ6IHRydWUsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGE6IDQyLFxuICAgICAgICBlbnZpcm9ubWVudDogJ3Rlc3R0ZXN0JyxcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCk7XG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnMucGF5bG9hZC5lbnZpcm9ubWVudCkudG8uZXFsKFxuICAgICAgJ3Rlc3R0ZXN0JyxcbiAgICApO1xuICAgIGV4cGVjdChyb2xsYmFyLm9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zLmNhcHR1cmVVbmNhdWdodCkudG8uZXFsKHRydWUpO1xuXG4gICAgcm9sbGJhci5jb25maWd1cmUoe1xuICAgICAgY2FwdHVyZVVuY2F1Z2h0OiBmYWxzZSxcbiAgICAgIHBheWxvYWQ6IHsgZW52aXJvbm1lbnQ6ICdib3JrYm9yaycgfSxcbiAgICB9KTtcbiAgICBleHBlY3Qocm9sbGJhci5vcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucy5wYXlsb2FkLmVudmlyb25tZW50KS50by5lcWwoXG4gICAgICAnYm9ya2JvcmsnLFxuICAgICk7XG4gICAgZXhwZWN0KHJvbGxiYXIub3B0aW9ucy5fY29uZmlndXJlZE9wdGlvbnMuY2FwdHVyZVVuY2F1Z2h0KS50by5lcWwoZmFsc2UpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NhcHR1cmVFdmVudCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZy9kZWZhdWx0IHR5cGUgYW5kIGxldmVsJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucyk7XG5cbiAgICB2YXIgZXZlbnQgPSByb2xsYmFyLmNhcHR1cmVFdmVudCh7IGZvbzogJ2JhcicgfSk7XG4gICAgZXhwZWN0KGV2ZW50LnR5cGUpLnRvLmVxbCgnbWFudWFsJyk7XG4gICAgZXhwZWN0KGV2ZW50LmxldmVsKS50by5lcWwoJ2luZm8nKTtcbiAgICBleHBlY3QoZXZlbnQuYm9keS5mb28pLnRvLmVxbCgnYmFyJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWZpZWQgdHlwZSBhbmQgbGV2ZWwnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKTtcblxuICAgIHZhciBldmVudCA9IHJvbGxiYXIuY2FwdHVyZUV2ZW50KCdsb2cnLCB7IGZvbzogJ2JhcicgfSwgJ2RlYnVnJyk7XG4gICAgZXhwZWN0KGV2ZW50LnR5cGUpLnRvLmVxbCgnbG9nJyk7XG4gICAgZXhwZWN0KGV2ZW50LmxldmVsKS50by5lcWwoJ2RlYnVnJyk7XG4gICAgZXhwZWN0KGV2ZW50LmJvZHkuZm9vKS50by5lcWwoJ2JhcicpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZXh0cmEgYXJncycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpO1xuXG4gICAgdmFyIGV2ZW50ID0gcm9sbGJhci5jYXB0dXJlRXZlbnQoJ21lYW5pbmdsZXNzJywgeyBmb286ICdiYXInIH0sIDIzKTtcbiAgICBleHBlY3QoZXZlbnQudHlwZSkudG8uZXFsKCdtYW51YWwnKTtcbiAgICBleHBlY3QoZXZlbnQubGV2ZWwpLnRvLmVxbCgnaW5mbycpO1xuICAgIGV4cGVjdChldmVudC5ib2R5LmZvbykudG8uZXFsKCdiYXInKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NhbGxiYWNrIG9wdGlvbnMnLCBmdW5jdGlvbiAoKSB7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAvLyBJbiByZWFjdC1uYXRpdmUgZW52aXJvbm1lbnQsIHN0dWIgZmV0Y2goKSBpbnN0ZWFkIG9mIFhNTEh0dHBSZXF1ZXN0XG4gICAgd2luZG93LmZldGNoU3R1YiA9IHNpbm9uLnN0dWIod2luZG93LCAnZmV0Y2gnKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmZldGNoLnJlc3RvcmUoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gc3R1YlJlc3BvbnNlKGNvZGUsIGVyciwgbWVzc2FnZSkge1xuICAgIHZhciB1dWlkID0gJ2Q0YzdhY2VmNTViZjRjOWVhOTVlNGZlOTQyOGE4Mjg3JztcblxuICAgIHdpbmRvdy5mZXRjaC5yZXR1cm5zKFxuICAgICAgUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgICBuZXcgUmVzcG9uc2UoXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgZXJyOiBlcnIsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgcmVzdWx0OiB7IHV1aWQ6IHV1aWQgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGF0dXM6IGNvZGUsXG4gICAgICAgICAgICBzdGF0dXNUZXh0OiBtZXNzYWdlLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIGl0KCdzaG91bGQgdXNlIGNoZWNrSWdub3JlIHdoZW4gc2V0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBzdHViUmVzcG9uc2UoMjAwLCAwLCAnT0snKTtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyxcbiAgICAgIGNoZWNrSWdub3JlOiBmdW5jdGlvbiAoX2lzVW5jYXVnaHQsIF9hcmdzLCBfcGF5bG9hZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpO1xuXG4gICAgcm9sbGJhci5sb2coJ3Rlc3QnKTsgLy8gZ2VuZXJhdGUgYSBwYXlsb2FkIHRvIGlnbm9yZVxuXG4gICAgZXhwZWN0KHdpbmRvdy5mZXRjaFN0dWIuY2FsbGVkKS50by5ub3QuYmUub2soKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2Ugb25TZW5kQ2FsbGJhY2sgd2hlbiBzZXQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHN0dWJSZXNwb25zZSgyMDAsIDAsICdPSycpO1xuXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBhY2Nlc3NUb2tlbjogJ1BPU1RfQ0xJRU5UX0lURU1fVE9LRU4nLFxuICAgICAgb25TZW5kQ2FsbGJhY2s6IGZ1bmN0aW9uIChfaXNVbmNhdWdodCwgX2FyZ3MsIHBheWxvYWQpIHtcbiAgICAgICAgcGF5bG9hZC5mb28gPSAnYmFyJztcbiAgICAgIH0sXG4gICAgfTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMpO1xuXG4gICAgcm9sbGJhci5sb2coJ3Rlc3QnKTsgLy8gZ2VuZXJhdGUgYSBwYXlsb2FkIHRvIGluc3BlY3RcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KHdpbmRvdy5mZXRjaFN0dWIuY2FsbGVkKS50by5iZS5vaygpO1xuICAgICAgdmFyIGJvZHkgPSBKU09OLnBhcnNlKHdpbmRvdy5mZXRjaFN0dWIuZ2V0Q2FsbCgwKS5hcmdzWzFdLmJvZHkpO1xuICAgICAgZXhwZWN0KGJvZHkuZGF0YS5mb28pLnRvLmVxbCgnYmFyJyk7XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9LCAxKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB1c2UgdHJhbnNmb3JtIHdoZW4gc2V0JywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBzdHViUmVzcG9uc2UoMjAwLCAwLCAnT0snKTtcblxuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgYWNjZXNzVG9rZW46ICdQT1NUX0NMSUVOVF9JVEVNX1RPS0VOJyxcbiAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24gKGRhdGEsIF9pdGVtKSB7XG4gICAgICAgIGRhdGEuZm9vID0gJ2Jheic7XG4gICAgICB9LFxuICAgIH07XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zKTtcblxuICAgIHJvbGxiYXIubG9nKCd0ZXN0Jyk7IC8vIGdlbmVyYXRlIGEgcGF5bG9hZCB0byBpbnNwZWN0XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdCh3aW5kb3cuZmV0Y2hTdHViLmNhbGxlZCkudG8uYmUub2soKTtcbiAgICAgIHZhciBib2R5ID0gSlNPTi5wYXJzZSh3aW5kb3cuZmV0Y2hTdHViLmdldENhbGwoMCkuYXJnc1sxXS5ib2R5KTtcbiAgICAgIGV4cGVjdChib2R5LmRhdGEuZm9vKS50by5lcWwoJ2JheicpO1xuXG4gICAgICBkb25lKCk7XG4gICAgfSwgMSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjcmVhdGVJdGVtJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBzdHJpbmdzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCk7XG5cbiAgICB2YXIgYXJncyA9IFsnZmlyc3QnLCAnc2Vjb25kJ107XG4gICAgdmFyIGl0ZW0gPSByb2xsYmFyLl9jcmVhdGVJdGVtKGFyZ3MpO1xuICAgIGV4cGVjdChpdGVtLm1lc3NhZ2UpLnRvLmVxbCgnZmlyc3QnKTtcbiAgICBleHBlY3QoaXRlbS5jdXN0b20uZXh0cmFBcmdzWycwJ10pLnRvLmVxbCgnc2Vjb25kJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBlcnJvcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIHZhciBhcmdzID0gW25ldyBFcnJvcignV2hvYScpLCAnZmlyc3QnLCAnc2Vjb25kJ107XG4gICAgdmFyIGl0ZW0gPSByb2xsYmFyLl9jcmVhdGVJdGVtKGFyZ3MpO1xuICAgIGV4cGVjdChpdGVtLmVycikudG8uZXFsKGFyZ3NbMF0pO1xuICAgIGV4cGVjdChpdGVtLm1lc3NhZ2UpLnRvLmVxbCgnZmlyc3QnKTtcbiAgICBleHBlY3QoaXRlbS5jdXN0b20uZXh0cmFBcmdzWycwJ10pLnRvLmVxbCgnc2Vjb25kJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBhIGNhbGxiYWNrJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCk7XG5cbiAgICB2YXIgbXlDYWxsYmFja0NhbGxlZCA9IGZhbHNlO1xuICAgIHZhciBteUNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgbXlDYWxsYmFja0NhbGxlZCA9IHRydWU7XG4gICAgfTtcbiAgICB2YXIgYXJncyA9IFtuZXcgRXJyb3IoJ1dob2EnKSwgJ2ZpcnN0JywgbXlDYWxsYmFjaywgJ3NlY29uZCddO1xuICAgIHZhciBpdGVtID0gcm9sbGJhci5fY3JlYXRlSXRlbShhcmdzKTtcbiAgICBleHBlY3QoaXRlbS5lcnIpLnRvLmVxbChhcmdzWzBdKTtcbiAgICBleHBlY3QoaXRlbS5tZXNzYWdlKS50by5lcWwoJ2ZpcnN0Jyk7XG4gICAgZXhwZWN0KGl0ZW0uY3VzdG9tLmV4dHJhQXJncykudG8uZXFsKFsnc2Vjb25kJ10pO1xuICAgIGV4cGVjdChpdGVtLmNhbGxiYWNrKS50by5iZS5vaygpO1xuICAgIGl0ZW0uY2FsbGJhY2soKTtcbiAgICBleHBlY3QobXlDYWxsYmFja0NhbGxlZCkudG8uYmUub2soKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGFycmF5cycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGNsaWVudCA9IG5ldyAoVGVzdENsaWVudEdlbigpKSgpO1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zLCBjbGllbnQpO1xuXG4gICAgdmFyIGFyZ3MgPSBbbmV3IEVycm9yKCdXaG9hJyksICdmaXJzdCcsIFsxLCAyLCAzXSwgJ3NlY29uZCddO1xuICAgIHZhciBpdGVtID0gcm9sbGJhci5fY3JlYXRlSXRlbShhcmdzKTtcbiAgICBleHBlY3QoaXRlbS5lcnIpLnRvLmVxbChhcmdzWzBdKTtcbiAgICBleHBlY3QoaXRlbS5tZXNzYWdlKS50by5lcWwoJ2ZpcnN0Jyk7XG4gICAgZXhwZWN0KGl0ZW0uY3VzdG9tWycwJ10pLnRvLmVxbCgxKTtcbiAgICBleHBlY3QoaXRlbS5jdXN0b20uZXh0cmFBcmdzKS50by5lcWwoWydzZWNvbmQnXSk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhbmRsZSBvYmplY3RzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgcm9sbGJhciA9IG5ldyBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCk7XG5cbiAgICB2YXIgYXJncyA9IFtuZXcgRXJyb3IoJ1dob2EnKSwgJ2ZpcnN0JywgeyBhOiAxLCBiOiAyIH0sICdzZWNvbmQnXTtcbiAgICB2YXIgaXRlbSA9IHJvbGxiYXIuX2NyZWF0ZUl0ZW0oYXJncyk7XG4gICAgZXhwZWN0KGl0ZW0uZXJyKS50by5lcWwoYXJnc1swXSk7XG4gICAgZXhwZWN0KGl0ZW0ubWVzc2FnZSkudG8uZXFsKCdmaXJzdCcpO1xuICAgIGV4cGVjdChpdGVtLmN1c3RvbS5hKS50by5lcWwoMSk7XG4gICAgZXhwZWN0KGl0ZW0uY3VzdG9tLmIpLnRvLmVxbCgyKTtcbiAgICBleHBlY3QoaXRlbS5jdXN0b20uZXh0cmFBcmdzKS50by5lcWwoWydzZWNvbmQnXSk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhdmUgYSB0aW1lc3RhbXAnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIHZhciBhcmdzID0gW25ldyBFcnJvcignV2hvYScpLCAnZmlyc3QnLCB7IGE6IDEsIGI6IDIgfSwgJ3NlY29uZCddO1xuICAgIHZhciBpdGVtID0gcm9sbGJhci5fY3JlYXRlSXRlbShhcmdzKTtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgZXhwZWN0KGl0ZW0udGltZXN0YW1wKS50by5iZS53aXRoaW4obm93IC0gMTAwMCwgbm93ICsgMTAwMCk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xuICBpdCgnc2hvdWxkIGhhdmUgYW4gdXVpZCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIGNsaWVudCA9IG5ldyAoVGVzdENsaWVudEdlbigpKSgpO1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgdmFyIHJvbGxiYXIgPSBuZXcgUm9sbGJhcihvcHRpb25zLCBjbGllbnQpO1xuXG4gICAgdmFyIGFyZ3MgPSBbbmV3IEVycm9yKCdXaG9hJyksICdmaXJzdCcsIHsgYTogMSwgYjogMiB9LCAnc2Vjb25kJ107XG4gICAgdmFyIGl0ZW0gPSByb2xsYmFyLl9jcmVhdGVJdGVtKGFyZ3MpO1xuICAgIGV4cGVjdChpdGVtLnV1aWQpLnRvLmJlLm9rKCk7XG5cbiAgICB2YXIgcGFydHMgPSBpdGVtLnV1aWQuc3BsaXQoJy0nKTtcbiAgICBleHBlY3QocGFydHMubGVuZ3RoKS50by5lcWwoNSk7XG4gICAgLy8gVHlwZSA0IFVVSURcbiAgICBleHBlY3QocGFydHNbMl1bMF0pLnRvLmVxbCgnNCcpO1xuXG4gICAgZG9uZSgpO1xuICB9KTtcbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZGF0ZXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIHZhciB5MmsgPSBuZXcgRGF0ZSgyMDAwLCAwLCAxKTtcbiAgICB2YXIgYXJncyA9IFtuZXcgRXJyb3IoJ1dob2EnKSwgJ2ZpcnN0JywgeTJrLCB7IGE6IDEsIGI6IDIgfSwgJ3NlY29uZCddO1xuICAgIHZhciBpdGVtID0gcm9sbGJhci5fY3JlYXRlSXRlbShhcmdzKTtcbiAgICBleHBlY3QoaXRlbS5jdXN0b20uZXh0cmFBcmdzKS50by5lcWwoW3kyaywgJ3NlY29uZCddKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIG51bWJlcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIHZhciBhcmdzID0gW25ldyBFcnJvcignV2hvYScpLCAnZmlyc3QnLCA0MiwgeyBhOiAxLCBiOiAyIH0sICdzZWNvbmQnXTtcbiAgICB2YXIgaXRlbSA9IHJvbGxiYXIuX2NyZWF0ZUl0ZW0oYXJncyk7XG4gICAgZXhwZWN0KGl0ZW0uY3VzdG9tLmV4dHJhQXJncykudG8uZXFsKFs0MiwgJ3NlY29uZCddKTtcblxuICAgIGRvbmUoKTtcbiAgfSk7XG4gIGl0KCdzaG91bGQgaGFuZGxlIGRvbWV4Y2VwdGlvbnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIob3B0aW9ucywgY2xpZW50KTtcblxuICAgIGlmIChkb2N1bWVudCAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Rpdjpmb28nKTtcbiAgICAgIH0gY2F0Y2ggKGVlKSB7XG4gICAgICAgIGUgPSBlZTtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gW2UsICdmaXJzdCcsIDQyLCB7IGE6IDEsIGI6IDIgfSwgJ3NlY29uZCddO1xuICAgICAgdmFyIGl0ZW0gPSByb2xsYmFyLl9jcmVhdGVJdGVtKGFyZ3MpO1xuICAgICAgZXhwZWN0KGl0ZW0uZXJyKS50by5iZS5vaygpO1xuICAgIH1cblxuICAgIGRvbmUoKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3NpbmdsZXRvbicsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ3Nob3VsZCBwYXNzIHRocm91Z2ggdGhlIHVuZGVybHlpbmcgY2xpZW50IGFmdGVyIGluaXQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBjbGllbnQgPSBuZXcgKFRlc3RDbGllbnRHZW4oKSkoKTtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIHZhciByb2xsYmFyID0gUm9sbGJhci5pbml0KG9wdGlvbnMsIGNsaWVudCk7XG5cbiAgICByb2xsYmFyLmxvZygnaGVsbG8gMScpO1xuICAgIFJvbGxiYXIubG9nKCdoZWxsbyAyJyk7XG5cbiAgICB2YXIgbG9nZ2VkSXRlbURpcmVjdCA9IGNsaWVudC5sb2dDYWxsc1swXS5pdGVtO1xuICAgIHZhciBsb2dnZWRJdGVtU2luZ2xldG9uID0gY2xpZW50LmxvZ0NhbGxzWzFdLml0ZW07XG4gICAgZXhwZWN0KGxvZ2dlZEl0ZW1EaXJlY3QubWVzc2FnZSkudG8uZXFsKCdoZWxsbyAxJyk7XG4gICAgZXhwZWN0KGxvZ2dlZEl0ZW1TaW5nbGV0b24ubWVzc2FnZSkudG8uZXFsKCdoZWxsbyAyJyk7XG5cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiX3JlZ2VuZXJhdG9yUnVudGltZSIsImUiLCJ0IiwiciIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiaSIsIlN5bWJvbCIsImEiLCJpdGVyYXRvciIsImMiLCJhc3luY0l0ZXJhdG9yIiwidSIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwid3JhcCIsIkdlbmVyYXRvciIsImNyZWF0ZSIsIkNvbnRleHQiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJ0eXBlIiwiYXJnIiwiY2FsbCIsImgiLCJsIiwiZiIsInMiLCJ5IiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsInAiLCJkIiwiZ2V0UHJvdG90eXBlT2YiLCJ2IiwidmFsdWVzIiwiZyIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsIl90eXBlb2YiLCJyZXNvbHZlIiwiX19hd2FpdCIsInRoZW4iLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsIkVycm9yIiwiZG9uZSIsIm1ldGhvZCIsImRlbGVnYXRlIiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiVHlwZUVycm9yIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicHVzaCIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpc05hTiIsImxlbmd0aCIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwibmFtZSIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsIl8iLCJyZXF1aXJlIiwiaGVscGVycyIsImRlZmF1bHRPcHRpb25zIiwiaG9zdG5hbWUiLCJwYXRoIiwic2VhcmNoIiwidmVyc2lvbiIsInByb3RvY29sIiwicG9ydCIsIk9UTFBEZWZhdWx0T3B0aW9ucyIsIkFwaSIsIm9wdGlvbnMiLCJ0cmFuc3BvcnQiLCJ1cmxsaWIiLCJ0cnVuY2F0aW9uIiwidXJsIiwiYWNjZXNzVG9rZW4iLCJ0cmFuc3BvcnRPcHRpb25zIiwiX2dldFRyYW5zcG9ydCIsIk9UTFBUcmFuc3BvcnRPcHRpb25zIiwiX2dldE9UTFBUcmFuc3BvcnQiLCJfcG9zdFByb21pc2UiLCJfcmVmIiwicGF5bG9hZCIsInNlbGYiLCJyZWplY3QiLCJwb3N0IiwiZXJyIiwicmVzcCIsInBvc3RJdGVtIiwiZGF0YSIsImNhbGxiYWNrIiwiYnVpbGRQYXlsb2FkIiwic2V0VGltZW91dCIsInBvc3RTcGFucyIsIl9yZWYyIiwiX2NhbGxlZSIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJfeCIsImJ1aWxkSnNvblBheWxvYWQiLCJzdHJpbmdpZnlSZXN1bHQiLCJ0cnVuY2F0ZSIsInN0cmluZ2lmeSIsImVycm9yIiwicG9zdEpzb25QYXlsb2FkIiwianNvblBheWxvYWQiLCJjb25maWd1cmUiLCJvbGRPcHRpb25zIiwibWVyZ2UiLCJ1bmRlZmluZWQiLCJnZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyIsIl9vcHRpb25zJHRyYWNpbmciLCJfb2JqZWN0U3ByZWFkIiwiZW5kcG9pbnQiLCJ0cmFjaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImlzVHlwZSIsImNvbnRleHQiLCJjb250ZXh0UmVzdWx0Iiwic3Vic3RyIiwiZGVmYXVsdHMiLCJ0aW1lb3V0IiwiZGV0ZWN0VHJhbnNwb3J0IiwicHJveHkiLCJvcHRzIiwicGFyc2UiLCJwYXRobmFtZSIsImdXaW5kb3ciLCJ3aW5kb3ciLCJkZWZhdWx0VHJhbnNwb3J0IiwiZmV0Y2giLCJYTUxIdHRwUmVxdWVzdCIsInRyYW5zcG9ydEFQSSIsImhvc3QiLCJhcHBlbmRQYXRoVG9QYXRoIiwiYmFzZSIsImJhc2VUcmFpbGluZ1NsYXNoIiwidGVzdCIsInBhdGhCZWdpbm5pbmdTbGFzaCIsInN1YnN0cmluZyIsInJlc3VsdCIsImF1dGgiLCJoYXNoIiwiaHJlZiIsInF1ZXJ5IiwibGFzdCIsImluZGV4T2YiLCJzcGxpdCIsInBhcnNlSW50IiwicGF0aFBhcnRzIiwiRXJyb3JTdGFja1BhcnNlciIsIlVOS05PV05fRlVOQ1RJT04iLCJFUlJfQ0xBU1NfUkVHRVhQIiwiUmVnRXhwIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJnYXRoZXJDb250ZXh0IiwiRnJhbWUiLCJzdGFja0ZyYW1lIiwiX3N0YWNrRnJhbWUiLCJmaWxlTmFtZSIsImxpbmUiLCJsaW5lTnVtYmVyIiwiZnVuYyIsImZ1bmN0aW9uTmFtZSIsImNvbHVtbiIsImNvbHVtbk51bWJlciIsImFyZ3MiLCJTdGFjayIsImV4Y2VwdGlvbiIsInNraXAiLCJnZXRTdGFjayIsInBhcnNlclN0YWNrIiwic3RhY2siLCJtZXNzYWdlIiwiX21vc3RTcGVjaWZpY0Vycm9yTmFtZSIsInJhd1N0YWNrIiwicmF3RXhjZXB0aW9uIiwibmVzdGVkIiwiY2F1c2UiLCJ0cmFjZUNoYWluIiwiZ3Vlc3NFcnJvckNsYXNzIiwiZXJyTXNnIiwibWF0Y2giLCJlcnJDbGFzc01hdGNoIiwiZXJyQ2xhc3MiLCJyZXBsYWNlIiwiY29uc3RydWN0b3JOYW1lIiwiaGFzT3duIiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJoYXNPd25Db25zdHJ1Y3RvciIsImhhc0lzUHJvdG90eXBlT2YiLCJrZXkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJjdXJyZW50IiwiTm90aWZpZXIiLCJxdWV1ZSIsInRyYW5zZm9ybXMiLCJkaWFnbm9zdGljIiwiYWRkVHJhbnNmb3JtIiwidHJhbnNmb3JtIiwiaXNGdW5jdGlvbiIsImxvZyIsIml0ZW0iLCJlbmFibGVkIiwiYWRkUGVuZGluZ0l0ZW0iLCJvcmlnaW5hbEVycm9yIiwiX2FwcGx5VHJhbnNmb3JtcyIsInJlbW92ZVBlbmRpbmdJdGVtIiwiYWRkSXRlbSIsImJpbmQiLCJ0cmFuc2Zvcm1JbmRleCIsInRyYW5zZm9ybXNMZW5ndGgiLCJjYiIsImNoZWNrTGV2ZWwiLCJzZXR0aW5ncyIsImxldmVsIiwibGV2ZWxWYWwiLCJMRVZFTFMiLCJyZXBvcnRMZXZlbCIsInJlcG9ydExldmVsVmFsIiwidXNlckNoZWNrSWdub3JlIiwibG9nZ2VyIiwiaXNVbmNhdWdodCIsIl9pc1VuY2F1Z2h0IiwiX29yaWdpbmFsQXJncyIsIm9uU2VuZENhbGxiYWNrIiwiY2hlY2tJZ25vcmUiLCJ1cmxJc05vdEJsb2NrTGlzdGVkIiwidXJsSXNPbkFMaXN0IiwidXJsSXNTYWZlTGlzdGVkIiwibWF0Y2hGcmFtZXMiLCJ0cmFjZSIsImxpc3QiLCJibG9jayIsImZyYW1lcyIsImZyYW1lIiwiZmlsZW5hbWUiLCJ1cmxSZWdleCIsImxpc3RMZW5ndGgiLCJmcmFtZUxlbmd0aCIsImoiLCJzYWZlT3JCbG9jayIsInRyYWNlcyIsImhvc3RCbG9ja0xpc3QiLCJob3N0U2FmZUxpc3QiLCJnZXQiLCJ0cmFjZXNMZW5ndGgiLCJsaXN0TmFtZSIsIm1lc3NhZ2VJc0lnbm9yZWQiLCJpZ25vcmVkTWVzc2FnZXMiLCJsZW4iLCJySWdub3JlZE1lc3NhZ2UiLCJtZXNzYWdlcyIsIm1lc3NhZ2VzRnJvbUl0ZW0iLCJib2R5IiwidHJhY2VfY2hhaW4iLCJRdWV1ZSIsInJhdGVMaW1pdGVyIiwiYXBpIiwicmVwbGF5TWFwIiwicHJlZGljYXRlcyIsInBlbmRpbmdJdGVtcyIsInBlbmRpbmdSZXF1ZXN0cyIsInJldHJ5UXVldWUiLCJyZXRyeUhhbmRsZSIsIndhaXRDYWxsYmFjayIsIndhaXRJbnRlcnZhbElEIiwiYWRkUHJlZGljYXRlIiwicHJlZGljYXRlIiwiaWR4Iiwic3BsaWNlIiwib3JpZ2luYWxJdGVtIiwicHJlZGljYXRlUmVzdWx0IiwiX2FwcGx5UHJlZGljYXRlcyIsIl9tYXliZUxvZyIsInRyYW5zbWl0IiwicmVwbGF5SWQiLCJhZGQiLCJ1dWlkIiwiX21ha2VBcGlSZXF1ZXN0IiwiX2RlcXVldWVQZW5kaW5nUmVxdWVzdCIsIl9oYW5kbGVSZXBsYXlSZXNwb25zZSIsIndhaXQiLCJfbWF5YmVDYWxsV2FpdCIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInJhdGVMaW1pdFJlc3BvbnNlIiwic2hvdWxkU2VuZCIsIl9tYXliZVJldHJ5IiwiUkVUUklBQkxFX0VSUk9SUyIsInNob3VsZFJldHJ5IiwicmV0cnlJbnRlcnZhbCIsImNvZGUiLCJpc0Zpbml0ZU51bWJlciIsIm1heFJldHJpZXMiLCJyZXRyaWVzIiwiX3JldHJ5QXBpUmVxdWVzdCIsInJldHJ5T2JqZWN0Iiwic2hpZnQiLCJ2ZXJib3NlIiwicmVzcG9uc2UiLCJjb25zb2xlIiwid2FybiIsInNlbmQiLCJkaXNjYXJkIiwidDAiLCJfeDIiLCJSYXRlTGltaXRlciIsInN0YXJ0VGltZSIsIm5vdyIsImNvdW50ZXIiLCJwZXJNaW5Db3VudGVyIiwicGxhdGZvcm0iLCJwbGF0Zm9ybU9wdGlvbnMiLCJjb25maWd1cmVHbG9iYWwiLCJnbG9iYWxTZXR0aW5ncyIsIm1heEl0ZW1zIiwiaXRlbXNQZXJNaW51dGUiLCJlbGFwc2VkVGltZSIsImdsb2JhbFJhdGVMaW1pdCIsImdsb2JhbFJhdGVMaW1pdFBlck1pbiIsImNoZWNrUmF0ZSIsInNob3VsZFNlbmRWYWx1ZSIsInBlck1pbnV0ZSIsInNldFBsYXRmb3JtT3B0aW9ucyIsImxpbWl0IiwiaWdub3JlUmF0ZUxpbWl0IiwibGltaXRQZXJNaW4iLCJyYXRlTGltaXRQYXlsb2FkIiwiZW52aXJvbm1lbnQiLCJtc2ciLCJleHRyYSIsImxhbmd1YWdlIiwibm90aWZpZXIiLCJmcmFtZXdvcmsiLCJpbmZvIiwicGFja2FnZUpzb24iLCJDbGllbnQiLCJBUEkiLCJUcmFuc3BvcnQiLCJUZWxlbWV0ZXIiLCJzaGFyZWRUcmFuc2Zvcm1zIiwic2hhcmVkUHJlZGljYXRlcyIsInBvbHlmaWxsSlNPTiIsIlJvbGxiYXIiLCJjbGllbnQiLCJoYW5kbGVPcHRpb25zIiwiX2NvbmZpZ3VyZWRPcHRpb25zIiwidGVsZW1ldGVyIiwiYWRkVHJhbnNmb3Jtc1RvTm90aWZpZXIiLCJhZGRQcmVkaWNhdGVzVG9RdWV1ZSIsInNldHVwSlNPTiIsIl9pbnN0YW5jZSIsImluaXQiLCJnbG9iYWwiLCJoYW5kbGVVbmluaXRpYWxpemVkIiwibWF5YmVDYWxsYmFjayIsInBheWxvYWREYXRhIiwibGFzdEVycm9yIiwiX2NyZWF0ZUl0ZW0iLCJfZ2V0Rmlyc3RGdW5jdGlvbiIsImRlYnVnIiwid2FybmluZyIsIl91bmNhdWdodEVycm9yIiwiY3JpdGljYWwiLCJzZW5kSnNvblBheWxvYWQiLCJjYXB0dXJlRXZlbnQiLCJldmVudCIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJzZXRQZXJzb24iLCJwZXJzb25JbmZvIiwicGVyc29uIiwiY2xlYXJQZXJzb24iLCJiYXNlRGF0YSIsImhhbmRsZUl0ZW1XaXRoRXJyb3IiLCJhZGRCb2R5IiwiYWRkTWVzc2FnZVdpdGhFcnJvciIsImFkZFRlbGVtZXRyeURhdGEiLCJhZGRDb25maWdUb1BheWxvYWQiLCJzY3J1YlBheWxvYWQiLCJhZGRQYXlsb2FkT3B0aW9ucyIsInVzZXJUcmFuc2Zvcm0iLCJhZGRDb25maWd1cmVkT3B0aW9ucyIsImFkZERpYWdub3N0aWNLZXlzIiwiaXRlbVRvUGF5bG9hZCIsImNyZWF0ZUl0ZW0iLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzaG93UmVwb3J0ZWRNZXNzYWdlVHJhY2VzIiwic2NydWJIZWFkZXJzIiwic2VydmVyIiwic2NydWJGaWVsZHMiLCJyZXdyaXRlRmlsZW5hbWVQYXR0ZXJucyIsInJlYWN0TmF0aXZlIiwic2VuZENvbmZpZyIsImluY2x1ZGVJdGVtc0luVGVsZW1ldHJ5IiwiaWdub3JlRHVwbGljYXRlRXJyb3JzIiwic2NydWIiLCJlcnJvclBhcnNlciIsInRpbWVzdGFtcCIsIk1hdGgiLCJyb3VuZCIsIkpTT04iLCJjdXN0b20iLCJjb2RlVmVyc2lvbiIsImNvZGVfdmVyc2lvbiIsInByb3BzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImFkZE1lc3NhZ2VEYXRhIiwiYWRkRXJyb3JEYXRhIiwic3RhY2tJbmZvIiwiYWRkRXJyb3JDb250ZXh0IiwicGFyc2VkRXJyb3IiLCJndWVzcyIsIl9idWlsZEZyYW1lcyIsIl9lcnJvckNsYXNzIiwiZGVzY3JpcHRpb24iLCJTdHJpbmciLCJzY3J1YlBhdGhzIiwiY29uY2F0Iiwic2FuaXRpemVVcmwiLCJfcmV3cml0ZUZpbGVuYW1lIiwibGluZW5vIiwiY29sbm8iLCJfbWF0Y2hGaWxlbmFtZSIsInBhdHRlcm5zIiwicGF0dGVybiIsIkJ1ZmZlciIsInJhdGVMaW1pdEV4cGlyZXMiLCJwYXJhbXMiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImhlYWRlcnMiLCJfaGVhZGVycyIsImZvcm1hdFVybCIsIl9oYW5kbGVSZXNwb25zZSIsIndyaXRlRGF0YSIsIl9tYWtlUmVxdWVzdCIsImpzb24iLCJfd3JhcFBvc3RDYWxsYmFjayIsImJ5dGVMZW5ndGgiLCJqb2luIiwidHJhY2VyIiwidmFsaWRhdGVUcmFjZXIiLCJzZXRTdGFja1RyYWNlTGltaXQiLCJsYXN0RXJyb3JIYXNoIiwiX2RlZmF1bHRMb2dMZXZlbCIsIl9sb2ciLCJjYXB0dXJlRG9tQ29udGVudExvYWRlZCIsInRzIiwiY2FwdHVyZUxvYWQiLCJkZWZhdWx0TGV2ZWwiLCJfc2FtZUFzTGFzdEVycm9yIiwiX2FkZFRyYWNpbmdBdHRyaWJ1dGVzIiwiX2FkZFRyYWNpbmdJbmZvIiwiX2NhcHR1cmVSb2xsYmFySXRlbSIsInRlbGVtZXRyeUV2ZW50cyIsImNvcHlFdmVudHMiLCJ0ZWxlbWV0cnlTcGFuIiwiZW5kIiwic3RhcnRTcGFuIiwiX3RoaXMkdHJhY2luZyIsInNwYW4iLCJnZXRTcGFuIiwiYXR0cmlidXRlcyIsInNlc3Npb25JZCIsInNwYW5JZCIsInRyYWNlSWQiLCJhZGRJdGVtQXR0cmlidXRlcyIsImFkZEV2ZW50IiwibG9nTGV2ZWwiLCJpdGVtSGFzaCIsImdlbmVyYXRlSXRlbUhhc2giLCJzY29wZSIsImFjdGl2ZSIsInZhbGlkYXRlU3BhbiIsInNldFRhZyIsIm9wZW50cmFjaW5nU3BhbklkIiwidG9TcGFuSWQiLCJvcGVudHJhY2luZ1RyYWNlSWQiLCJ0b1RyYWNlSWQiLCJvcGVudHJhY2luZ19zcGFuX2lkIiwib3BlbnRyYWNpbmdfdHJhY2VfaWQiLCJzdGFja1RyYWNlTGltaXQiLCJzcGFuQ29udGV4dCIsInRyYXZlcnNlIiwic2NydWJQYXRoIiwicGFyYW1SZXMiLCJfZ2V0U2NydWJGaWVsZFJlZ2V4cyIsInF1ZXJ5UmVzIiwiX2dldFNjcnViUXVlcnlQYXJhbVJlZ2V4cyIsInJlZGFjdFF1ZXJ5UGFyYW0iLCJkdW1teTAiLCJwYXJhbVBhcnQiLCJyZWRhY3QiLCJwYXJhbVNjcnViYmVyIiwidmFsU2NydWJiZXIiLCJrIiwic2NydWJiZXIiLCJzZWVuIiwidG1wViIsInJldCIsInBhdCIsIk1BWF9FVkVOVFMiLCJmcm9tTWlsbGlzIiwibWlsbGlzIiwidHJ1bmMiLCJtYXhUZWxlbWV0cnlFdmVudHMiLCJtYXhRdWV1ZVNpemUiLCJtYXgiLCJtaW4iLCJuZXdNYXhFdmVudHMiLCJkZWxldGVDb3VudCIsImV2ZW50cyIsIkFycmF5IiwiZmlsdGVyVGVsZW1ldHJ5IiwiY2FwdHVyZSIsInJvbGxiYXJVVUlEIiwiZ2V0TGV2ZWwiLCJ0aW1lc3RhbXBfbXMiLCJzb3VyY2UiLCJleGMiLCJjYXB0dXJlRXJyb3IiLCJfdGhpcyR0ZWxlbWV0cnlTcGFuIiwiY2FwdHVyZUxvZyIsIl90aGlzJHRlbGVtZXRyeVNwYW4yIiwiX3RoaXMkdGVsZW1ldHJ5U3BhbjMiLCJjYXB0dXJlTmV0d29yayIsInN1YnR5cGUiLCJyZXF1ZXN0RGF0YSIsInJlcXVlc3QiLCJsZXZlbEZyb21TdGF0dXMiLCJzdGF0dXNfY29kZSIsInN0YXR1c0NvZGUiLCJjYXB0dXJlRG9tIiwiZWxlbWVudCIsImNoZWNrZWQiLCJjYXB0dXJlTmF2aWdhdGlvbiIsImZyb20iLCJ0byIsIl90aGlzJHRlbGVtZXRyeVNwYW40IiwiZ2V0VGltZSIsImNhcHR1cmVDb25uZWN0aXZpdHlDaGFuZ2UiLCJjaGFuZ2UiLCJtYW51YWwiLCJwYXlsb2FkT3B0aW9ucyIsInNldCIsInRyYWNlUGF0aCIsIm5ld0V4dHJhIiwibmV3SXRlbSIsImlzUHJvbWlzZSIsInByb21pc2VkSXRlbSIsImNvbmZpZ0tleSIsImFkZEZ1bmN0aW9uT3B0aW9uIiwiY29uZmlndXJlZE9wdGlvbnMiLCJjb25maWd1cmVkX29wdGlvbnMiLCJpc19hbm9ueW1vdXMiLCJpc191bmNhdWdodCIsInJhd19lcnJvciIsImNvbnN0cnVjdG9yX25hbWUiLCJmYWlsZWQiLCJyYXciLCJqc29uQmFja3VwIiwic2VsZWN0RnJhbWVzIiwicmFuZ2UiLCJ0cnVuY2F0ZUZyYW1lcyIsImNoYWluIiwibWF5YmVUcnVuY2F0ZVZhbHVlIiwidmFsIiwidHJ1bmNhdGVTdHJpbmdzIiwidHJ1bmNhdG9yIiwidHlwZU5hbWUiLCJ0cnVuY2F0ZVRyYWNlRGF0YSIsInRyYWNlRGF0YSIsIm1pbkJvZHkiLCJuZWVkc1RydW5jYXRpb24iLCJtYXhTaXplIiwibWF4Qnl0ZVNpemUiLCJzdHJhdGVnaWVzIiwic3RyYXRlZ3kiLCJyZXN1bHRzIiwiUm9sbGJhckpTT04iLCJpc0RlZmluZWQiLCJpc05hdGl2ZUZ1bmN0aW9uIiwieCIsInRvTG93ZXJDYXNlIiwicmVSZWdFeHBDaGFyIiwiZnVuY01hdGNoU3RyaW5nIiwiRnVuY3Rpb24iLCJyZUlzTmF0aXZlIiwiaXNPYmplY3QiLCJpc1N0cmluZyIsIk51bWJlciIsImlzRmluaXRlIiwiaXNJdGVyYWJsZSIsImlzRXJyb3IiLCJpc0Jyb3dzZXIiLCJ1dWlkNCIsInJhbmRvbSIsImZsb29yIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwibSIsImV4ZWMiLCJ1cmkiLCIkMCIsIiQxIiwiJDIiLCJhY2Nlc3NfdG9rZW4iLCJwYXJhbXNBcnJheSIsInNvcnQiLCJxcyIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwic3RyaW5nIiwiY291bnQiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsIm1vZGUiLCJiYWNrdXBNZXNzYWdlIiwibG9jYXRpb24iLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIndyYXBDYWxsYmFjayIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJuZXdTZWVuIiwiaW5jbHVkZXMiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJleHRyYUFyZ3MiLCJhcmdUeXBlcyIsInR5cCIsIkRPTUV4Y2VwdGlvbiIsInNldEN1c3RvbUl0ZW1LZXlzIiwib3JpZ2luYWxfYXJnX3R5cGVzIiwic2tpcEZyYW1lcyIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwiRGF0ZSIsImZpbHRlcklwIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJpbnB1dCIsInVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zIiwib3ZlcndyaXRlU2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImlzT2JqIiwiaXNBcnJheSIsInNlZW5JbmRleCIsIm1hcHBlZCIsInNhbWUiXSwic291cmNlUm9vdCI6IiJ9