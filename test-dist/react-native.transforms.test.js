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
/*!**********************************************!*\
  !*** ./test/react-native.transforms.test.js ***!
  \**********************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = __webpack_require__(/*! ../src/react-native/rollbar */ "./src/react-native/rollbar.js");
var t = __webpack_require__(/*! ../src/react-native/transforms */ "./src/react-native/transforms.js");

function TestClientGen() {
  var TestClient = function () {
    this.notifier = {
      addTransform: function () {
        return this.notifier;
      }.bind(this),
    };
    this.queue = {
      addPredicate: function () {
        return this.queue;
      }.bind(this),
    };
  };
  return TestClient;
}

function itemFromArgs(args) {
  var client = new (TestClientGen())();
  var rollbar = new Rollbar({ autoInstrument: false }, client);
  var item = rollbar._createItem(args);
  item.level = 'debug';
  return item;
}

describe('handleItemWithError', function () {
  it('should create stackInfo', function (done) {
    var err = new Error('test');
    var args = ['a message', err];
    var item = itemFromArgs(args);
    var options = new Rollbar({}).options;
    t.handleItemWithError(item, options, function (e, i) {
      expect(item.stackInfo.exception).to.eql({
        class: 'Error',
        message: 'test',
      });
      done(e);
    });
  });
});
describe('_matchFilename', function () {
  var filenames = {
    before: [
      '/var/mobile/Containers/Data/Application/1122ABCD-FF02-4942-A0D7-632E691D342F/.app/main.jsbundle',
      '/var/mobile/Containers/Data/Application/1122ABCD-FF02-4942-A0D7-632E691D342F/Library/Application Support/CodePush/2071980d74d1fef682fdab1d1cab345f33f498e3b51f68585c1b0b5469334df7/codepush_ios/main.jsbundle',
      '/data/user/0/com.example/files/CodePush/2071980d74d1fef682fdab1d1cab345f33f498e3b51f68585c1b0b5469334df7/codepush_android/index.android.bundle',
      'index.android.bundle',
    ],
    after: ['main.jsbundle', 'main.jsbundle', 'index.android.bundle', null],
  };

  it('should rewrite filenames', function (done) {
    var options = new Rollbar({}).options;
    console.log(options);

    var length = filenames.before.length;

    for (var i = 0; i < length; i++) {
      var filename = t._matchFilename(filenames.before[i], options);
      expect(filename).to.eql(filenames.after[i]);
    }
    done();
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtbmF0aXZlLnRyYW5zZm9ybXMudGVzdC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7O0FBRUEsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLE9BQU87QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsWUFBWTtBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDLE1BQThCLElBQUksQ0FBa0I7Ozs7Ozs7Ozs7OztBQzNIdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRVosYUFBYSxtQkFBTyxDQUFDLHNEQUFXO0FBQ2hDLGNBQWMsbUJBQU8sQ0FBQyxnREFBUztBQUMvQixjQUFjLG1CQUFPLENBQUMsZ0RBQVM7O0FBRS9CLGNBQWM7QUFDZCxrQkFBa0I7QUFD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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxFQUFFO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsNkJBQTZCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0JBQWtCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0Esb0JBQW9CLGNBQWM7QUFDbEM7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF3RCxPQUFPO0FBQy9EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3REFBd0QsT0FBTztBQUMvRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFlBQVk7QUFDOUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixnQkFBZ0I7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixnREFBZ0Q7QUFDeEU7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esd0JBQXdCLFlBQVk7QUFDcEM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixnREFBZ0Q7QUFDeEU7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLHdCQUF3QixzQ0FBc0M7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLHNDQUFzQyxFQUFFO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsK0NBQStDLHlHQUF5RyxFQUFFOztBQUUxSjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxjQUFjOztBQUVkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFLFVBQVU7QUFDdkI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOzs7Ozs7O1VDMXZCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7Ozs7OztBQ1BEO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGNBQWMsbUJBQU8sQ0FBQyxrRUFBNkI7QUFDbkQsUUFBUSxtQkFBTyxDQUFDLHdFQUFnQzs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLHVCQUF1QjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0M7QUFDaEM7O0FBRUE7O0FBRUEsb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvZXJyb3Itc3RhY2stcGFyc2VyL25vZGVfbW9kdWxlcy9zdGFja2ZyYW1lL3N0YWNrZnJhbWUuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2FwaS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2FwaVV0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9icm93c2VyL3VybC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL2Vycm9yUGFyc2VyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvbWVyZ2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9ub3RpZmllci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3ByZWRpY2F0ZXMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9xdWV1ZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3JhdGVMaW1pdGVyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcmVhY3QtbmF0aXZlL2xvZ2dlci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3JlYWN0LW5hdGl2ZS9yb2xsYmFyLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcmVhY3QtbmF0aXZlL3RyYW5zZm9ybXMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy9yZWFjdC1uYXRpdmUvdHJhbnNwb3J0LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcm9sbGJhci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3NjcnViLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdGVsZW1ldHJ5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdHJhbnNmb3Jtcy5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3RydW5jYXRpb24uanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy91dGlsaXR5LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS90cmF2ZXJzZS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vdmVuZG9yL0pTT04tanMvanNvbjMuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvcmVhY3QtbmF0aXZlLnRyYW5zZm9ybXMudGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsInZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJ2lzYXJyYXknKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxudmFyIHJvb3RQYXJlbnQgPSB7fVxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIFNhZmFyaSA1LTcgbGFja3Mgc3VwcG9ydCBmb3IgY2hhbmdpbmcgdGhlIGBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yYCBwcm9wZXJ0eVxuICogICAgIG9uIG9iamVjdHMuXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuZnVuY3Rpb24gdHlwZWRBcnJheVN1cHBvcnQgKCkge1xuICBmdW5jdGlvbiBCYXIgKCkge31cbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIGFyci5jb25zdHJ1Y3RvciA9IEJhclxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gICAgICAgIGFyci5jb25zdHJ1Y3RvciA9PT0gQmFyICYmIC8vIGNvbnN0cnVjdG9yIGNhbiBiZSBzZXRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgLy8gQXZvaWQgZ29pbmcgdGhyb3VnaCBhbiBBcmd1bWVudHNBZGFwdG9yVHJhbXBvbGluZSBpbiB0aGUgY29tbW9uIGNhc2UuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGFyZ3VtZW50c1sxXSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcpXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpcy5sZW5ndGggPSAwXG4gICAgdGhpcy5wYXJlbnQgPSB1bmRlZmluZWRcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZnJvbU51bWJlcih0aGlzLCBhcmcpXG4gIH1cblxuICAvLyBTbGlnaHRseSBsZXNzIGNvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh0aGlzLCBhcmcsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogJ3V0ZjgnKVxuICB9XG5cbiAgLy8gVW51c3VhbC5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhpcywgYXJnKVxufVxuXG5mdW5jdGlvbiBmcm9tTnVtYmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChsZW5ndGgpIHwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoYXRbaV0gPSAwXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21TdHJpbmcgKHRoYXQsIHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycgfHwgZW5jb2RpbmcgPT09ICcnKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIC8vIEFzc3VtcHRpb246IGJ5dGVMZW5ndGgoKSByZXR1cm4gdmFsdWUgaXMgYWx3YXlzIDwga01heExlbmd0aC5cbiAgdmFyIGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG5cbiAgdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0ICh0aGF0LCBvYmplY3QpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmplY3QpKSByZXR1cm4gZnJvbUJ1ZmZlcih0aGF0LCBvYmplY3QpXG5cbiAgaWYgKGlzQXJyYXkob2JqZWN0KSkgcmV0dXJuIGZyb21BcnJheSh0aGF0LCBvYmplY3QpXG5cbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzdGFydCB3aXRoIG51bWJlciwgYnVmZmVyLCBhcnJheSBvciBzdHJpbmcnKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAob2JqZWN0LmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gZnJvbVR5cGVkQXJyYXkodGhhdCwgb2JqZWN0KVxuICAgIH1cbiAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgb2JqZWN0KVxuICAgIH1cbiAgfVxuXG4gIGlmIChvYmplY3QubGVuZ3RoKSByZXR1cm4gZnJvbUFycmF5TGlrZSh0aGF0LCBvYmplY3QpXG5cbiAgcmV0dXJuIGZyb21Kc29uT2JqZWN0KHRoYXQsIG9iamVjdClcbn1cblxuZnVuY3Rpb24gZnJvbUJ1ZmZlciAodGhhdCwgYnVmZmVyKSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGJ1ZmZlci5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBidWZmZXIuY29weSh0aGF0LCAwLCAwLCBsZW5ndGgpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8vIER1cGxpY2F0ZSBvZiBmcm9tQXJyYXkoKSB0byBrZWVwIGZyb21BcnJheSgpIG1vbm9tb3JwaGljLlxuZnVuY3Rpb24gZnJvbVR5cGVkQXJyYXkgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIC8vIFRydW5jYXRpbmcgdGhlIGVsZW1lbnRzIGlzIHByb2JhYmx5IG5vdCB3aGF0IHBlb3BsZSBleHBlY3QgZnJvbSB0eXBlZFxuICAvLyBhcnJheXMgd2l0aCBCWVRFU19QRVJfRUxFTUVOVCA+IDEgYnV0IGl0J3MgY29tcGF0aWJsZSB3aXRoIHRoZSBiZWhhdmlvclxuICAvLyBvZiB0aGUgb2xkIEJ1ZmZlciBjb25zdHJ1Y3Rvci5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXkpIHtcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYXJyYXkuYnl0ZUxlbmd0aFxuICAgIHRoYXQgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkoYXJyYXkpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0ID0gZnJvbVR5cGVkQXJyYXkodGhhdCwgbmV3IFVpbnQ4QXJyYXkoYXJyYXkpKVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG4vLyBEZXNlcmlhbGl6ZSB7IHR5cGU6ICdCdWZmZXInLCBkYXRhOiBbMSwyLDMsLi4uXSB9IGludG8gYSBCdWZmZXIgb2JqZWN0LlxuLy8gUmV0dXJucyBhIHplcm8tbGVuZ3RoIGJ1ZmZlciBmb3IgaW5wdXRzIHRoYXQgZG9uJ3QgY29uZm9ybSB0byB0aGUgc3BlYy5cbmZ1bmN0aW9uIGZyb21Kc29uT2JqZWN0ICh0aGF0LCBvYmplY3QpIHtcbiAgdmFyIGFycmF5XG4gIHZhciBsZW5ndGggPSAwXG5cbiAgaWYgKG9iamVjdC50eXBlID09PSAnQnVmZmVyJyAmJiBpc0FycmF5KG9iamVjdC5kYXRhKSkge1xuICAgIGFycmF5ID0gb2JqZWN0LmRhdGFcbiAgICBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIH1cbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbn0gZWxzZSB7XG4gIC8vIHByZS1zZXQgZm9yIHZhbHVlcyB0aGF0IG1heSBleGlzdCBpbiB0aGUgZnV0dXJlXG4gIEJ1ZmZlci5wcm90b3R5cGUubGVuZ3RoID0gdW5kZWZpbmVkXG4gIEJ1ZmZlci5wcm90b3R5cGUucGFyZW50ID0gdW5kZWZpbmVkXG59XG5cbmZ1bmN0aW9uIGFsbG9jYXRlICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICAgIHRoYXQuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gYW4gb2JqZWN0IGluc3RhbmNlIG9mIHRoZSBCdWZmZXIgY2xhc3NcbiAgICB0aGF0Lmxlbmd0aCA9IGxlbmd0aFxuICAgIHRoYXQuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGZyb21Qb29sID0gbGVuZ3RoICE9PSAwICYmIGxlbmd0aCA8PSBCdWZmZXIucG9vbFNpemUgPj4+IDFcbiAgaWYgKGZyb21Qb29sKSB0aGF0LnBhcmVudCA9IHJvb3RQYXJlbnRcblxuICByZXR1cm4gdGhhdFxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTbG93QnVmZmVyKSkgcmV0dXJuIG5ldyBTbG93QnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nKVxuICBkZWxldGUgYnVmLnBhcmVudFxuICByZXR1cm4gYnVmXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICB2YXIgaSA9IDBcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIGJyZWFrXG5cbiAgICArK2lcbiAgfVxuXG4gIGlmIChpICE9PSBsZW4pIHtcbiAgICB4ID0gYVtpXVxuICAgIHkgPSBiW2ldXG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xpc3QgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzLicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSBzdHJpbmcgPSAnJyArIHN0cmluZ1xuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgLy8gRGVwcmVjYXRlZFxuICAgICAgY2FzZSAncmF3JzpcbiAgICAgIGNhc2UgJ3Jhd3MnOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gbGVuICogMlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGxlbiA+Pj4gMVxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgcmV0dXJuIHV0ZjhUb0J5dGVzKHN0cmluZykubGVuZ3RoIC8vIGFzc3VtZSB1dGY4XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIHN0YXJ0ID0gc3RhcnQgfCAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA9PT0gSW5maW5pdHkgPyB0aGlzLmxlbmd0aCA6IGVuZCB8IDBcblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoZW5kIDw9IHN0YXJ0KSByZXR1cm4gJydcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIDBcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCkge1xuICBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIGJ5dGVPZmZzZXQgPSAweDdmZmZmZmZmXG4gIGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkgYnl0ZU9mZnNldCA9IC0weDgwMDAwMDAwXG4gIGJ5dGVPZmZzZXQgPj49IDBcblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiAtMVxuICBpZiAoYnl0ZU9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIC0xXG5cbiAgLy8gTmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBNYXRoLm1heCh0aGlzLmxlbmd0aCArIGJ5dGVPZmZzZXQsIDApXG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDApIHJldHVybiAtMSAvLyBzcGVjaWFsIGNhc2U6IGxvb2tpbmcgZm9yIGVtcHR5IHN0cmluZyBhbHdheXMgZmFpbHNcbiAgICByZXR1cm4gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICB9XG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsIHZhbCwgYnl0ZU9mZnNldClcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCBbIHZhbCBdLCBieXRlT2Zmc2V0KVxuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlJbmRleE9mIChhcnIsIHZhbCwgYnl0ZU9mZnNldCkge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKHZhciBpID0gMDsgYnl0ZU9mZnNldCArIGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhcnJbYnl0ZU9mZnNldCArIGldID09PSB2YWxbZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXhdKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsLmxlbmd0aCkgcmV0dXJuIGJ5dGVPZmZzZXQgKyBmb3VuZEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG4vLyBgZ2V0YCBpcyBkZXByZWNhdGVkXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCBpcyBkZXByZWNhdGVkXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBhc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIHVjczJXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiB3cml0ZSAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZylcbiAgaWYgKG9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSAndXRmOCdcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBvZmZzZXRbLCBsZW5ndGhdWywgZW5jb2RpbmddKVxuICB9IGVsc2UgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCB8IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICAvLyBsZWdhY3kgd3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpIC0gcmVtb3ZlIGluIHYwLjEzXG4gIH0gZWxzZSB7XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoIHwgMFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdhdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICB2YXIgcmVzID0gW11cblxuICB2YXIgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgdmFyIGZpcnN0Qnl0ZSA9IGJ1ZltpXVxuICAgIHZhciBjb2RlUG9pbnQgPSBudWxsXG4gICAgdmFyIGJ5dGVzUGVyU2VxdWVuY2UgPSAoZmlyc3RCeXRlID4gMHhFRikgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKSA/IDNcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpID8gMlxuICAgICAgOiAxXG5cbiAgICBpZiAoaSArIGJ5dGVzUGVyU2VxdWVuY2UgPD0gZW5kKSB7XG4gICAgICB2YXIgc2Vjb25kQnl0ZSwgdGhpcmRCeXRlLCBmb3VydGhCeXRlLCB0ZW1wQ29kZVBvaW50XG5cbiAgICAgIHN3aXRjaCAoYnl0ZXNQZXJTZXF1ZW5jZSkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaWYgKGZpcnN0Qnl0ZSA8IDB4ODApIHtcbiAgICAgICAgICAgIGNvZGVQb2ludCA9IGZpcnN0Qnl0ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweDFGKSA8PCAweDYgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0YpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHhDIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAodGhpcmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3RkYgJiYgKHRlbXBDb2RlUG9pbnQgPCAweEQ4MDAgfHwgdGVtcENvZGVQb2ludCA+IDB4REZGRikpIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgc2Vjb25kQnl0ZSA9IGJ1ZltpICsgMV1cbiAgICAgICAgICB0aGlyZEJ5dGUgPSBidWZbaSArIDJdXG4gICAgICAgICAgZm91cnRoQnl0ZSA9IGJ1ZltpICsgM11cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKGZvdXJ0aEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4MTIgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4QyB8ICh0aGlyZEJ5dGUgJiAweDNGKSA8PCAweDYgfCAoZm91cnRoQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4RkZGRiAmJiB0ZW1wQ29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgICAgICAgICAgY29kZVBvaW50ID0gdGVtcENvZGVQb2ludFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29kZVBvaW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBkaWQgbm90IGdlbmVyYXRlIGEgdmFsaWQgY29kZVBvaW50IHNvIGluc2VydCBhXG4gICAgICAvLyByZXBsYWNlbWVudCBjaGFyIChVK0ZGRkQpIGFuZCBhZHZhbmNlIG9ubHkgMSBieXRlXG4gICAgICBjb2RlUG9pbnQgPSAweEZGRkRcbiAgICAgIGJ5dGVzUGVyU2VxdWVuY2UgPSAxXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPiAweEZGRkYpIHtcbiAgICAgIC8vIGVuY29kZSB0byB1dGYxNiAoc3Vycm9nYXRlIHBhaXIgZGFuY2UpXG4gICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMFxuICAgICAgcmVzLnB1c2goY29kZVBvaW50ID4+PiAxMCAmIDB4M0ZGIHwgMHhEODAwKVxuICAgICAgY29kZVBvaW50ID0gMHhEQzAwIHwgY29kZVBvaW50ICYgMHgzRkZcbiAgICB9XG5cbiAgICByZXMucHVzaChjb2RlUG9pbnQpXG4gICAgaSArPSBieXRlc1BlclNlcXVlbmNlXG4gIH1cblxuICByZXR1cm4gZGVjb2RlQ29kZVBvaW50c0FycmF5KHJlcylcbn1cblxuLy8gQmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI3NDcyNzIvNjgwNzQyLCB0aGUgYnJvd3NlciB3aXRoXG4vLyB0aGUgbG93ZXN0IGxpbWl0IGlzIENocm9tZSwgd2l0aCAweDEwMDAwIGFyZ3MuXG4vLyBXZSBnbyAxIG1hZ25pdHVkZSBsZXNzLCBmb3Igc2FmZXR5XG52YXIgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIHZhciBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIHZhciByZXMgPSAnJ1xuICB2YXIgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBiaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSArIDFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIHZhciBuZXdCdWZcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgbmV3QnVmID0gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH1cblxuICBpZiAobmV3QnVmLmxlbmd0aCkgbmV3QnVmLnBhcmVudCA9IHRoaXMucGFyZW50IHx8IHRoaXNcblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50TEUgPSBmdW5jdGlvbiByZWFkVUludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuICB9XG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXVxuICB2YXIgbXVsID0gMVxuICB3aGlsZSAoYnl0ZUxlbmd0aCA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gcmVhZFVJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDgpIHwgdGhpc1tvZmZzZXQgKyAxXVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRMRSA9IGZ1bmN0aW9uIHJlYWRJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aFxuICB2YXIgbXVsID0gMVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgaWYgKCEodGhpc1tvZmZzZXRdICYgMHg4MCkpIHJldHVybiAodGhpc1tvZmZzZXRdKVxuICByZXR1cm4gKCgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiByZWFkSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAxXSB8ICh0aGlzW29mZnNldF0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gcmVhZEludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiByZWFkRG91YmxlTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J1ZmZlciBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCksIDApXG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCksIDApXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSB2YWx1ZSA8IDAgPyAxIDogMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ZhbHVlIGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldFN0YXJ0KVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSB2YWx1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSB1dGY4VG9CeXRlcyh2YWx1ZS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICB0aGlzW2ldID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiB0b0FycmF5QnVmZmVyICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICB9XG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiBfYXVnbWVudCAoYXJyKSB7XG4gIGFyci5jb25zdHJ1Y3RvciA9IEJ1ZmZlclxuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgc2V0IG1ldGhvZCBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZFxuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5lcXVhbHMgPSBCUC5lcXVhbHNcbiAgYXJyLmNvbXBhcmUgPSBCUC5jb21wYXJlXG4gIGFyci5pbmRleE9mID0gQlAuaW5kZXhPZlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50TEUgPSBCUC5yZWFkVUludExFXG4gIGFyci5yZWFkVUludEJFID0gQlAucmVhZFVJbnRCRVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnRMRSA9IEJQLnJlYWRJbnRMRVxuICBhcnIucmVhZEludEJFID0gQlAucmVhZEludEJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludExFID0gQlAud3JpdGVVSW50TEVcbiAgYXJyLndyaXRlVUludEJFID0gQlAud3JpdGVVSW50QkVcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludExFID0gQlAud3JpdGVJbnRMRVxuICBhcnIud3JpdGVJbnRCRSA9IEJQLndyaXRlSW50QkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG52YXIgSU5WQUxJRF9CQVNFNjRfUkUgPSAvW14rXFwvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHN0cmlwcyBvdXQgaW52YWxpZCBjaGFyYWN0ZXJzIGxpa2UgXFxuIGFuZCBcXHQgZnJvbSB0aGUgc3RyaW5nLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgc3RyID0gc3RyaW5ndHJpbShzdHIpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICB2YXIgY29kZVBvaW50XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIHZhciBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICB2YXIgYnl0ZXMgPSBbXVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb2RlUG9pbnQgPSBzdHJpbmcuY2hhckNvZGVBdChpKVxuXG4gICAgLy8gaXMgc3Vycm9nYXRlIGNvbXBvbmVudFxuICAgIGlmIChjb2RlUG9pbnQgPiAweEQ3RkYgJiYgY29kZVBvaW50IDwgMHhFMDAwKSB7XG4gICAgICAvLyBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCFsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAgIC8vIG5vIGxlYWQgeWV0XG4gICAgICAgIGlmIChjb2RlUG9pbnQgPiAweERCRkYpIHtcbiAgICAgICAgICAvLyB1bmV4cGVjdGVkIHRyYWlsXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIGlmIChpICsgMSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgLy8gdW5wYWlyZWQgbGVhZFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWxpZCBsZWFkXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcblxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyAyIGxlYWRzIGluIGEgcm93XG4gICAgICBpZiAoY29kZVBvaW50IDwgMHhEQzAwKSB7XG4gICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIHZhbGlkIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICBjb2RlUG9pbnQgPSAobGVhZFN1cnJvZ2F0ZSAtIDB4RDgwMCA8PCAxMCB8IGNvZGVQb2ludCAtIDB4REMwMCkgKyAweDEwMDAwXG4gICAgfSBlbHNlIGlmIChsZWFkU3Vycm9nYXRlKSB7XG4gICAgICAvLyB2YWxpZCBibXAgY2hhciwgYnV0IGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICB9XG5cbiAgICBsZWFkU3Vycm9nYXRlID0gbnVsbFxuXG4gICAgLy8gZW5jb2RlIHV0ZjhcbiAgICBpZiAoY29kZVBvaW50IDwgMHg4MCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAxKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKGNvZGVQb2ludClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4ODAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgfCAweEMwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAzKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDIHwgMHhFMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHgxMTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gNCkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4MTIgfCAweEYwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHhDICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBieXRlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ2Vycm9yLXN0YWNrLXBhcnNlcicsIFsnc3RhY2tmcmFtZSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnc3RhY2tmcmFtZScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LkVycm9yU3RhY2tQYXJzZXIgPSBmYWN0b3J5KHJvb3QuU3RhY2tGcmFtZSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyKFN0YWNrRnJhbWUpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgRklSRUZPWF9TQUZBUklfU1RBQ0tfUkVHRVhQID0gLyhefEApXFxTKzpcXGQrLztcbiAgICB2YXIgQ0hST01FX0lFX1NUQUNLX1JFR0VYUCA9IC9eXFxzKmF0IC4qKFxcUys6XFxkK3xcXChuYXRpdmVcXCkpL207XG4gICAgdmFyIFNBRkFSSV9OQVRJVkVfQ09ERV9SRUdFWFAgPSAvXihldmFsQCk/KFxcW25hdGl2ZSBjb2RlXSk/JC87XG5cbiAgICByZXR1cm4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogR2l2ZW4gYW4gRXJyb3Igb2JqZWN0LCBleHRyYWN0IHRoZSBtb3N0IGluZm9ybWF0aW9uIGZyb20gaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIG9iamVjdFxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gb2YgU3RhY2tGcmFtZXNcbiAgICAgICAgICovXG4gICAgICAgIHBhcnNlOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZShlcnJvcikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlcnJvci5zdGFja3RyYWNlICE9PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXJyb3JbJ29wZXJhI3NvdXJjZWxvYyddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmEoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGFjayAmJiBlcnJvci5zdGFjay5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlVjhPcklFKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUZGT3JTYWZhcmkoZXJyb3IpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBwYXJzZSBnaXZlbiBFcnJvciBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBTZXBhcmF0ZSBsaW5lIGFuZCBjb2x1bW4gbnVtYmVycyBmcm9tIGEgc3RyaW5nIG9mIHRoZSBmb3JtOiAoVVJJOkxpbmU6Q29sdW1uKVxuICAgICAgICBleHRyYWN0TG9jYXRpb246IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJGV4dHJhY3RMb2NhdGlvbih1cmxMaWtlKSB7XG4gICAgICAgICAgICAvLyBGYWlsLWZhc3QgYnV0IHJldHVybiBsb2NhdGlvbnMgbGlrZSBcIihuYXRpdmUpXCJcbiAgICAgICAgICAgIGlmICh1cmxMaWtlLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW3VybExpa2VdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVnRXhwID0gLyguKz8pKD86OihcXGQrKSk/KD86OihcXGQrKSk/JC87XG4gICAgICAgICAgICB2YXIgcGFydHMgPSByZWdFeHAuZXhlYyh1cmxMaWtlLnJlcGxhY2UoL1soKV0vZywgJycpKTtcbiAgICAgICAgICAgIHJldHVybiBbcGFydHNbMV0sIHBhcnRzWzJdIHx8IHVuZGVmaW5lZCwgcGFydHNbM10gfHwgdW5kZWZpbmVkXTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVY4T3JJRTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VWOE9ySUUoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IGVycm9yLnN0YWNrLnNwbGl0KCdcXG4nKS5maWx0ZXIoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIWxpbmUubWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignKGV2YWwgJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL2V2YWwgY29kZS9nLCAnZXZhbCcpLnJlcGxhY2UoLyhcXChldmFsIGF0IFteKCldKil8KFxcKSwuKiQpL2csICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHNhbml0aXplZExpbmUgPSBsaW5lLnJlcGxhY2UoL15cXHMrLywgJycpLnJlcGxhY2UoL1xcKGV2YWwgY29kZS9nLCAnKCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FwdHVyZSBhbmQgcHJlc2V2ZSB0aGUgcGFyZW50aGVzaXplZCBsb2NhdGlvbiBcIigvZm9vL215IGJhci5qczoxMjo4NylcIiBpblxuICAgICAgICAgICAgICAgIC8vIGNhc2UgaXQgaGFzIHNwYWNlcyBpbiBpdCwgYXMgdGhlIHN0cmluZyBpcyBzcGxpdCBvbiBcXHMrIGxhdGVyIG9uXG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gc2FuaXRpemVkTGluZS5tYXRjaCgvIChcXCgoLispOihcXGQrKTooXFxkKylcXCkkKS8pO1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBwYXJlbnRoZXNpemVkIGxvY2F0aW9uIGZyb20gdGhlIGxpbmUsIGlmIGl0IHdhcyBtYXRjaGVkXG4gICAgICAgICAgICAgICAgc2FuaXRpemVkTGluZSA9IGxvY2F0aW9uID8gc2FuaXRpemVkTGluZS5yZXBsYWNlKGxvY2F0aW9uWzBdLCAnJykgOiBzYW5pdGl6ZWRMaW5lO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IHNhbml0aXplZExpbmUuc3BsaXQoL1xccysvKS5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICAvLyBpZiBhIGxvY2F0aW9uIHdhcyBtYXRjaGVkLCBwYXNzIGl0IHRvIGV4dHJhY3RMb2NhdGlvbigpIG90aGVyd2lzZSBwb3AgdGhlIGxhc3QgdG9rZW5cbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKGxvY2F0aW9uID8gbG9jYXRpb25bMV0gOiB0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0b2tlbnMuam9pbignICcpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSBbJ2V2YWwnLCAnPGFub255bW91cz4nXS5pbmRleE9mKGxvY2F0aW9uUGFydHNbMF0pID4gLTEgPyB1bmRlZmluZWQgOiBsb2NhdGlvblBhcnRzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlRkZPclNhZmFyaTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VGRk9yU2FmYXJpKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZmlsdGVyZWQgPSBlcnJvci5zdGFjay5zcGxpdCgnXFxuJykuZmlsdGVyKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWxpbmUubWF0Y2goU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyA+IGV2YWwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoLyBsaW5lIChcXGQrKSg/OiA+IGV2YWwgbGluZSBcXGQrKSogPiBldmFsOlxcZCs6XFxkKy9nLCAnOiQxJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignQCcpID09PSAtMSAmJiBsaW5lLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIGV2YWwgZnJhbWVzIG9ubHkgaGF2ZSBmdW5jdGlvbiBuYW1lcyBhbmQgbm90aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGxpbmVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZVJlZ2V4ID0gLygoLipcIi4rXCJbXkBdKik/W15AXSopKD86QCkvO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGxpbmUubWF0Y2goZnVuY3Rpb25OYW1lUmVnZXgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gbWF0Y2hlcyAmJiBtYXRjaGVzWzFdID8gbWF0Y2hlc1sxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbihsaW5lLnJlcGxhY2UoZnVuY3Rpb25OYW1lUmVnZXgsICcnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmEoZSkge1xuICAgICAgICAgICAgaWYgKCFlLnN0YWNrdHJhY2UgfHwgKGUubWVzc2FnZS5pbmRleE9mKCdcXG4nKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlLnNwbGl0KCdcXG4nKS5sZW5ndGggPiBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhOShlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWUuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTAoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTkoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMiwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBsaW5lc1tpXVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmExMDogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTEwKGUpIHtcbiAgICAgICAgICAgIHZhciBsaW5lUkUgPSAvTGluZSAoXFxkKykuKnNjcmlwdCAoPzppbiApPyhcXFMrKSg/OjogSW4gZnVuY3Rpb24gKFxcUyspKT8kL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFN0YWNrRnJhbWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogbWF0Y2hbM10gfHwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBtYXRjaFsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVzW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBPcGVyYSAxMC42NSsgRXJyb3Iuc3RhY2sgdmVyeSBzaW1pbGFyIHRvIEZGL1NhZmFyaVxuICAgICAgICBwYXJzZU9wZXJhMTE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLmZpbHRlcihmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFApICYmICFsaW5lLm1hdGNoKC9eRXJyb3IgY3JlYXRlZCBhdC8pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJlZC5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbnMgPSBsaW5lLnNwbGl0KCdAJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uUGFydHMgPSB0aGlzLmV4dHJhY3RMb2NhdGlvbih0b2tlbnMucG9wKCkpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbkNhbGwgPSAodG9rZW5zLnNoaWZ0KCkgfHwgJycpO1xuICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSBmdW5jdGlvbkNhbGxcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLzxhbm9ueW1vdXMgZnVuY3Rpb24oOiAoXFx3KykpPz4vLCAnJDInKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwoW14pXSpcXCkvZywgJycpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB2YXIgYXJnc1JhdztcbiAgICAgICAgICAgICAgICBpZiAoZnVuY3Rpb25DYWxsLm1hdGNoKC9cXCgoW14pXSopXFwpLykpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1JhdyA9IGZ1bmN0aW9uQ2FsbC5yZXBsYWNlKC9eW14oXStcXCgoW14pXSopXFwpJC8sICckMScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IChhcmdzUmF3ID09PSB1bmRlZmluZWQgfHwgYXJnc1JhdyA9PT0gJ1thcmd1bWVudHMgbm90IGF2YWlsYWJsZV0nKSA/XG4gICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCA6IGFyZ3NSYXcuc3BsaXQoJywnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZSh7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogbG9jYXRpb25QYXJ0c1swXSxcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogbG9jYXRpb25QYXJ0c1sxXSxcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uTnVtYmVyOiBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGxpbmVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKTtcbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ3N0YWNrZnJhbWUnLCBbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5TdGFja0ZyYW1lID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZ1bmN0aW9uIF9pc051bWJlcihuKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdChuKSkgJiYgaXNGaW5pdGUobik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NhcGl0YWxpemUoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXR0ZXIocCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1twXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYm9vbGVhblByb3BzID0gWydpc0NvbnN0cnVjdG9yJywgJ2lzRXZhbCcsICdpc05hdGl2ZScsICdpc1RvcGxldmVsJ107XG4gICAgdmFyIG51bWVyaWNQcm9wcyA9IFsnY29sdW1uTnVtYmVyJywgJ2xpbmVOdW1iZXInXTtcbiAgICB2YXIgc3RyaW5nUHJvcHMgPSBbJ2ZpbGVOYW1lJywgJ2Z1bmN0aW9uTmFtZScsICdzb3VyY2UnXTtcbiAgICB2YXIgYXJyYXlQcm9wcyA9IFsnYXJncyddO1xuICAgIHZhciBvYmplY3RQcm9wcyA9IFsnZXZhbE9yaWdpbiddO1xuXG4gICAgdmFyIHByb3BzID0gYm9vbGVhblByb3BzLmNvbmNhdChudW1lcmljUHJvcHMsIHN0cmluZ1Byb3BzLCBhcnJheVByb3BzLCBvYmplY3RQcm9wcyk7XG5cbiAgICBmdW5jdGlvbiBTdGFja0ZyYW1lKG9iaikge1xuICAgICAgICBpZiAoIW9iaikgcmV0dXJuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob2JqW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpc1snc2V0JyArIF9jYXBpdGFsaXplKHByb3BzW2ldKV0ob2JqW3Byb3BzW2ldXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdGFja0ZyYW1lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0QXJnczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcmdzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRBcmdzOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJncyBtdXN0IGJlIGFuIEFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFyZ3MgPSB2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEV2YWxPcmlnaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXZhbE9yaWdpbjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0RXZhbE9yaWdpbjogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBTdGFja0ZyYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmFsT3JpZ2luID0gdjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodiBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZhbE9yaWdpbiA9IG5ldyBTdGFja0ZyYW1lKHYpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFdmFsIE9yaWdpbiBtdXN0IGJlIGFuIE9iamVjdCBvciBTdGFja0ZyYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gdGhpcy5nZXRGaWxlTmFtZSgpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGxpbmVOdW1iZXIgPSB0aGlzLmdldExpbmVOdW1iZXIoKSB8fCAnJztcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSB0aGlzLmdldENvbHVtbk51bWJlcigpIHx8ICcnO1xuICAgICAgICAgICAgdmFyIGZ1bmN0aW9uTmFtZSA9IHRoaXMuZ2V0RnVuY3Rpb25OYW1lKCkgfHwgJyc7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRJc0V2YWwoKSkge1xuICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ1tldmFsXSAoJyArIGZpbGVOYW1lICsgJzonICsgbGluZU51bWJlciArICc6JyArIGNvbHVtbk51bWJlciArICcpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICdbZXZhbF06JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uTmFtZSArICcgKCcgKyBmaWxlTmFtZSArICc6JyArIGxpbmVOdW1iZXIgKyAnOicgKyBjb2x1bW5OdW1iZXIgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmlsZU5hbWUgKyAnOicgKyBsaW5lTnVtYmVyICsgJzonICsgY29sdW1uTnVtYmVyO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFN0YWNrRnJhbWUuZnJvbVN0cmluZyA9IGZ1bmN0aW9uIFN0YWNrRnJhbWUkJGZyb21TdHJpbmcoc3RyKSB7XG4gICAgICAgIHZhciBhcmdzU3RhcnRJbmRleCA9IHN0ci5pbmRleE9mKCcoJyk7XG4gICAgICAgIHZhciBhcmdzRW5kSW5kZXggPSBzdHIubGFzdEluZGV4T2YoJyknKTtcblxuICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gc3RyLnN1YnN0cmluZygwLCBhcmdzU3RhcnRJbmRleCk7XG4gICAgICAgIHZhciBhcmdzID0gc3RyLnN1YnN0cmluZyhhcmdzU3RhcnRJbmRleCArIDEsIGFyZ3NFbmRJbmRleCkuc3BsaXQoJywnKTtcbiAgICAgICAgdmFyIGxvY2F0aW9uU3RyaW5nID0gc3RyLnN1YnN0cmluZyhhcmdzRW5kSW5kZXggKyAxKTtcblxuICAgICAgICBpZiAobG9jYXRpb25TdHJpbmcuaW5kZXhPZignQCcpID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSAvQCguKz8pKD86OihcXGQrKSk/KD86OihcXGQrKSk/JC8uZXhlYyhsb2NhdGlvblN0cmluZywgJycpO1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gcGFydHNbMV07XG4gICAgICAgICAgICB2YXIgbGluZU51bWJlciA9IHBhcnRzWzJdO1xuICAgICAgICAgICAgdmFyIGNvbHVtbk51bWJlciA9IHBhcnRzWzNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgYXJnczogYXJncyB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZU5hbWUsXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvbHVtbk51bWJlcjogY29sdW1uTnVtYmVyIHx8IHVuZGVmaW5lZFxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29sZWFuUHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShib29sZWFuUHJvcHNbaV0pXSA9IF9nZXR0ZXIoYm9vbGVhblByb3BzW2ldKTtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ3NldCcgKyBfY2FwaXRhbGl6ZShib29sZWFuUHJvcHNbaV0pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBCb29sZWFuKHYpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoYm9vbGVhblByb3BzW2ldKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bWVyaWNQcm9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnZ2V0JyArIF9jYXBpdGFsaXplKG51bWVyaWNQcm9wc1tqXSldID0gX2dldHRlcihudW1lcmljUHJvcHNbal0pO1xuICAgICAgICBTdGFja0ZyYW1lLnByb3RvdHlwZVsnc2V0JyArIF9jYXBpdGFsaXplKG51bWVyaWNQcm9wc1tqXSldID0gKGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfaXNOdW1iZXIodikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihwICsgJyBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBOdW1iZXIodik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShudW1lcmljUHJvcHNbal0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc3RyaW5nUHJvcHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgU3RhY2tGcmFtZS5wcm90b3R5cGVbJ2dldCcgKyBfY2FwaXRhbGl6ZShzdHJpbmdQcm9wc1trXSldID0gX2dldHRlcihzdHJpbmdQcm9wc1trXSk7XG4gICAgICAgIFN0YWNrRnJhbWUucHJvdG90eXBlWydzZXQnICsgX2NhcGl0YWxpemUoc3RyaW5nUHJvcHNba10pXSA9IChmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHRoaXNbcF0gPSBTdHJpbmcodik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KShzdHJpbmdQcm9wc1trXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0YWNrRnJhbWU7XG59KSk7XG4iLCIvKiEgaWVlZTc1NC4gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2FwaVV0aWxpdHknKTtcblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBob3N0bmFtZTogJ2FwaS5yb2xsYmFyLmNvbScsXG4gIHBhdGg6ICcvYXBpLzEvaXRlbS8nLFxuICBzZWFyY2g6IG51bGwsXG4gIHZlcnNpb246ICcxJyxcbiAgcHJvdG9jb2w6ICdodHRwczonLFxuICBwb3J0OiA0NDMsXG59O1xuXG52YXIgT1RMUERlZmF1bHRPcHRpb25zID0ge1xuICBob3N0bmFtZTogJ2FwaS5yb2xsYmFyLmNvbScsXG4gIHBhdGg6ICcvYXBpLzEvc2Vzc2lvbi8nLFxuICBzZWFyY2g6IG51bGwsXG4gIHZlcnNpb246ICcxJyxcbiAgcHJvdG9jb2w6ICdodHRwczonLFxuICBwb3J0OiA0NDMsXG59O1xuXG4vKipcbiAqIEFwaSBpcyBhbiBvYmplY3QgdGhhdCBlbmNhcHN1bGF0ZXMgbWV0aG9kcyBvZiBjb21tdW5pY2F0aW5nIHdpdGhcbiAqIHRoZSBSb2xsYmFyIEFQSS4gIEl0IGlzIGEgc3RhbmRhcmQgaW50ZXJmYWNlIHdpdGggc29tZSBwYXJ0cyBpbXBsZW1lbnRlZFxuICogZGlmZmVyZW50bHkgZm9yIHNlcnZlciBvciBicm93c2VyIGNvbnRleHRzLiAgSXQgaXMgYW4gb2JqZWN0IHRoYXQgc2hvdWxkXG4gKiBiZSBpbnN0YW50aWF0ZWQgd2hlbiB1c2VkIHNvIGl0IGNhbiBjb250YWluIG5vbi1nbG9iYWwgb3B0aW9ucyB0aGF0IG1heVxuICogYmUgZGlmZmVyZW50IGZvciBhbm90aGVyIGluc3RhbmNlIG9mIFJvbGxiYXJBcGkuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMge1xuICogICAgYWNjZXNzVG9rZW46IHRoZSBhY2Nlc3NUb2tlbiB0byB1c2UgZm9yIHBvc3RpbmcgaXRlbXMgdG8gcm9sbGJhclxuICogICAgZW5kcG9pbnQ6IGFuIGFsdGVybmF0aXZlIGVuZHBvaW50IHRvIHNlbmQgZXJyb3JzIHRvXG4gKiAgICAgICAgbXVzdCBiZSBhIHZhbGlkLCBmdWxseSBxdWFsaWZpZWQgVVJMLlxuICogICAgICAgIFRoZSBkZWZhdWx0IGlzOiBodHRwczovL2FwaS5yb2xsYmFyLmNvbS9hcGkvMS9pdGVtXG4gKiAgICBwcm94eTogaWYgeW91IHdpc2ggdG8gcHJveHkgcmVxdWVzdHMgcHJvdmlkZSBhbiBvYmplY3RcbiAqICAgICAgICB3aXRoIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqICAgICAgICAgIGhvc3Qgb3IgaG9zdG5hbWUgKHJlcXVpcmVkKTogZm9vLmV4YW1wbGUuY29tXG4gKiAgICAgICAgICBwb3J0IChvcHRpb25hbCk6IDEyM1xuICogICAgICAgICAgcHJvdG9jb2wgKG9wdGlvbmFsKTogaHR0cHNcbiAqIH1cbiAqL1xuZnVuY3Rpb24gQXBpKG9wdGlvbnMsIHRyYW5zcG9ydCwgdXJsbGliLCB0cnVuY2F0aW9uKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMudHJhbnNwb3J0ID0gdHJhbnNwb3J0O1xuICB0aGlzLnVybCA9IHVybGxpYjtcbiAgdGhpcy50cnVuY2F0aW9uID0gdHJ1bmNhdGlvbjtcbiAgdGhpcy5hY2Nlc3NUb2tlbiA9IG9wdGlvbnMuYWNjZXNzVG9rZW47XG4gIHRoaXMudHJhbnNwb3J0T3B0aW9ucyA9IF9nZXRUcmFuc3BvcnQob3B0aW9ucywgdXJsbGliKTtcbiAgdGhpcy5PVExQVHJhbnNwb3J0T3B0aW9ucyA9IF9nZXRPVExQVHJhbnNwb3J0KG9wdGlvbnMsIHVybGxpYik7XG59XG5cbi8qKlxuICogV3JhcHMgdHJhbnNwb3J0LnBvc3QgaW4gYSBQcm9taXNlIHRvIHN1cHBvcnQgYXN5bmMvYXdhaXRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgZm9yIHRoZSBBUEkgcmVxdWVzdFxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuYWNjZXNzVG9rZW4gLSBUaGUgYWNjZXNzIHRva2VuIGZvciBhdXRoZW50aWNhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMudHJhbnNwb3J0T3B0aW9ucyAtIE9wdGlvbnMgZm9yIHRoZSB0cmFuc3BvcnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLnBheWxvYWQgLSBUaGUgZGF0YSBwYXlsb2FkIHRvIHNlbmRcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSByZXNwb25zZSBvciByZWplY3RzIHdpdGggYW4gZXJyb3JcbiAqIEBwcml2YXRlXG4gKi9cbkFwaS5wcm90b3R5cGUuX3Bvc3RQcm9taXNlID0gZnVuY3Rpb24oeyBhY2Nlc3NUb2tlbiwgdHJhbnNwb3J0T3B0aW9ucywgcGF5bG9hZCB9KSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHNlbGYudHJhbnNwb3J0LnBvc3QoYWNjZXNzVG9rZW4sIHRyYW5zcG9ydE9wdGlvbnMsIHBheWxvYWQsIChlcnIsIHJlc3ApID0+XG4gICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUocmVzcClcbiAgICApO1xuICB9KTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSBkYXRhXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuQXBpLnByb3RvdHlwZS5wb3N0SXRlbSA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgdHJhbnNwb3J0T3B0aW9ucyA9IGhlbHBlcnMudHJhbnNwb3J0T3B0aW9ucyhcbiAgICB0aGlzLnRyYW5zcG9ydE9wdGlvbnMsXG4gICAgJ1BPU1QnLFxuICApO1xuICB2YXIgcGF5bG9hZCA9IGhlbHBlcnMuYnVpbGRQYXlsb2FkKGRhdGEpO1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gZW5zdXJlIHRoZSBuZXR3b3JrIHJlcXVlc3QgaXMgc2NoZWR1bGVkIGFmdGVyIHRoZSBjdXJyZW50IHRpY2suXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYudHJhbnNwb3J0LnBvc3Qoc2VsZi5hY2Nlc3NUb2tlbiwgdHJhbnNwb3J0T3B0aW9ucywgcGF5bG9hZCwgY2FsbGJhY2spO1xuICB9LCAwKTtcbn07XG5cbi8qKlxuICogUG9zdHMgc3BhbnMgdG8gdGhlIFJvbGxiYXIgQVBJIHVzaW5nIHRoZSBzZXNzaW9uIGVuZHBvaW50XG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGF5bG9hZCAtIFRoZSBzcGFucyB0byBzZW5kXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aXRoIHRoZSBBUEkgcmVzcG9uc2VcbiAqL1xuQXBpLnByb3RvdHlwZS5wb3N0U3BhbnMgPSBhc3luYyBmdW5jdGlvbiAocGF5bG9hZCkge1xuICBjb25zdCB0cmFuc3BvcnRPcHRpb25zID0gaGVscGVycy50cmFuc3BvcnRPcHRpb25zKFxuICAgIHRoaXMuT1RMUFRyYW5zcG9ydE9wdGlvbnMsXG4gICAgJ1BPU1QnLFxuICApO1xuXG4gIHJldHVybiBhd2FpdCB0aGlzLl9wb3N0UHJvbWlzZSh7XG4gICAgYWNjZXNzVG9rZW46IHRoaXMuYWNjZXNzVG9rZW4sXG4gICAgdHJhbnNwb3J0T3B0aW9ucyxcbiAgICBwYXlsb2FkXG4gIH0pO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5BcGkucHJvdG90eXBlLmJ1aWxkSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgdmFyIHBheWxvYWQgPSBoZWxwZXJzLmJ1aWxkUGF5bG9hZChkYXRhKTtcblxuICB2YXIgc3RyaW5naWZ5UmVzdWx0O1xuICBpZiAodGhpcy50cnVuY2F0aW9uKSB7XG4gICAgc3RyaW5naWZ5UmVzdWx0ID0gdGhpcy50cnVuY2F0aW9uLnRydW5jYXRlKHBheWxvYWQpO1xuICB9IGVsc2Uge1xuICAgIHN0cmluZ2lmeVJlc3VsdCA9IF8uc3RyaW5naWZ5KHBheWxvYWQpO1xuICB9XG5cbiAgaWYgKHN0cmluZ2lmeVJlc3VsdC5lcnJvcikge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soc3RyaW5naWZ5UmVzdWx0LmVycm9yKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gc3RyaW5naWZ5UmVzdWx0LnZhbHVlO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIGpzb25QYXlsb2FkXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuQXBpLnByb3RvdHlwZS5wb3N0SnNvblBheWxvYWQgPSBmdW5jdGlvbiAoanNvblBheWxvYWQsIGNhbGxiYWNrKSB7XG4gIHZhciB0cmFuc3BvcnRPcHRpb25zID0gaGVscGVycy50cmFuc3BvcnRPcHRpb25zKFxuICAgIHRoaXMudHJhbnNwb3J0T3B0aW9ucyxcbiAgICAnUE9TVCcsXG4gICk7XG4gIHRoaXMudHJhbnNwb3J0LnBvc3RKc29uUGF5bG9hZChcbiAgICB0aGlzLmFjY2Vzc1Rva2VuLFxuICAgIHRyYW5zcG9ydE9wdGlvbnMsXG4gICAganNvblBheWxvYWQsXG4gICAgY2FsbGJhY2ssXG4gICk7XG59O1xuXG5BcGkucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBvbGRPcHRpb25zID0gdGhpcy5vbGRPcHRpb25zO1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9sZE9wdGlvbnMsIG9wdGlvbnMpO1xuICB0aGlzLnRyYW5zcG9ydE9wdGlvbnMgPSBfZ2V0VHJhbnNwb3J0KHRoaXMub3B0aW9ucywgdGhpcy51cmwpO1xuICB0aGlzLk9UTFBUcmFuc3BvcnRPcHRpb25zID0gX2dldE9UTFBUcmFuc3BvcnQodGhpcy5vcHRpb25zLCB0aGlzLnVybCk7XG4gIGlmICh0aGlzLm9wdGlvbnMuYWNjZXNzVG9rZW4gIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSB0aGlzLm9wdGlvbnMuYWNjZXNzVG9rZW47XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBfZ2V0VHJhbnNwb3J0KG9wdGlvbnMsIHVybCkge1xuICByZXR1cm4gaGVscGVycy5nZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgdXJsKTtcbn1cblxuZnVuY3Rpb24gX2dldE9UTFBUcmFuc3BvcnQob3B0aW9ucywgdXJsKSB7XG4gIG9wdGlvbnMgPSB7Li4ub3B0aW9ucywgZW5kcG9pbnQ6IG9wdGlvbnMudHJhY2luZz8uZW5kcG9pbnR9O1xuICByZXR1cm4gaGVscGVycy5nZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyhvcHRpb25zLCBPVExQRGVmYXVsdE9wdGlvbnMsIHVybCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXBpO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuZnVuY3Rpb24gYnVpbGRQYXlsb2FkKGRhdGEpIHtcbiAgaWYgKCFfLmlzVHlwZShkYXRhLmNvbnRleHQsICdzdHJpbmcnKSkge1xuICAgIHZhciBjb250ZXh0UmVzdWx0ID0gXy5zdHJpbmdpZnkoZGF0YS5jb250ZXh0KTtcbiAgICBpZiAoY29udGV4dFJlc3VsdC5lcnJvcikge1xuICAgICAgZGF0YS5jb250ZXh0ID0gXCJFcnJvcjogY291bGQgbm90IHNlcmlhbGl6ZSAnY29udGV4dCdcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5jb250ZXh0ID0gY29udGV4dFJlc3VsdC52YWx1ZSB8fCAnJztcbiAgICB9XG4gICAgaWYgKGRhdGEuY29udGV4dC5sZW5ndGggPiAyNTUpIHtcbiAgICAgIGRhdGEuY29udGV4dCA9IGRhdGEuY29udGV4dC5zdWJzdHIoMCwgMjU1KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkYXRhLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0cywgdXJsKSB7XG4gIHZhciBob3N0bmFtZSA9IGRlZmF1bHRzLmhvc3RuYW1lO1xuICB2YXIgcHJvdG9jb2wgPSBkZWZhdWx0cy5wcm90b2NvbDtcbiAgdmFyIHBvcnQgPSBkZWZhdWx0cy5wb3J0O1xuICB2YXIgcGF0aCA9IGRlZmF1bHRzLnBhdGg7XG4gIHZhciBzZWFyY2ggPSBkZWZhdWx0cy5zZWFyY2g7XG4gIHZhciB0aW1lb3V0ID0gb3B0aW9ucy50aW1lb3V0O1xuICB2YXIgdHJhbnNwb3J0ID0gZGV0ZWN0VHJhbnNwb3J0KG9wdGlvbnMpO1xuXG4gIHZhciBwcm94eSA9IG9wdGlvbnMucHJveHk7XG4gIGlmIChvcHRpb25zLmVuZHBvaW50KSB7XG4gICAgdmFyIG9wdHMgPSB1cmwucGFyc2Uob3B0aW9ucy5lbmRwb2ludCk7XG4gICAgaG9zdG5hbWUgPSBvcHRzLmhvc3RuYW1lO1xuICAgIHByb3RvY29sID0gb3B0cy5wcm90b2NvbDtcbiAgICBwb3J0ID0gb3B0cy5wb3J0O1xuICAgIHBhdGggPSBvcHRzLnBhdGhuYW1lO1xuICAgIHNlYXJjaCA9IG9wdHMuc2VhcmNoO1xuICB9XG4gIHJldHVybiB7XG4gICAgdGltZW91dDogdGltZW91dCxcbiAgICBob3N0bmFtZTogaG9zdG5hbWUsXG4gICAgcHJvdG9jb2w6IHByb3RvY29sLFxuICAgIHBvcnQ6IHBvcnQsXG4gICAgcGF0aDogcGF0aCxcbiAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICBwcm94eTogcHJveHksXG4gICAgdHJhbnNwb3J0OiB0cmFuc3BvcnQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGRldGVjdFRyYW5zcG9ydChvcHRpb25zKSB7XG4gIHZhciBnV2luZG93ID1cbiAgICAodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cpIHx8XG4gICAgKHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYpO1xuICB2YXIgdHJhbnNwb3J0ID0gb3B0aW9ucy5kZWZhdWx0VHJhbnNwb3J0IHx8ICd4aHInO1xuICBpZiAodHlwZW9mIGdXaW5kb3cuZmV0Y2ggPT09ICd1bmRlZmluZWQnKSB0cmFuc3BvcnQgPSAneGhyJztcbiAgaWYgKHR5cGVvZiBnV2luZG93LlhNTEh0dHBSZXF1ZXN0ID09PSAndW5kZWZpbmVkJykgdHJhbnNwb3J0ID0gJ2ZldGNoJztcbiAgcmV0dXJuIHRyYW5zcG9ydDtcbn1cblxuZnVuY3Rpb24gdHJhbnNwb3J0T3B0aW9ucyh0cmFuc3BvcnQsIG1ldGhvZCkge1xuICB2YXIgcHJvdG9jb2wgPSB0cmFuc3BvcnQucHJvdG9jb2wgfHwgJ2h0dHBzOic7XG4gIHZhciBwb3J0ID1cbiAgICB0cmFuc3BvcnQucG9ydCB8fFxuICAgIChwcm90b2NvbCA9PT0gJ2h0dHA6JyA/IDgwIDogcHJvdG9jb2wgPT09ICdodHRwczonID8gNDQzIDogdW5kZWZpbmVkKTtcbiAgdmFyIGhvc3RuYW1lID0gdHJhbnNwb3J0Lmhvc3RuYW1lO1xuICB2YXIgcGF0aCA9IHRyYW5zcG9ydC5wYXRoO1xuICB2YXIgdGltZW91dCA9IHRyYW5zcG9ydC50aW1lb3V0O1xuICB2YXIgdHJhbnNwb3J0QVBJID0gdHJhbnNwb3J0LnRyYW5zcG9ydDtcbiAgaWYgKHRyYW5zcG9ydC5zZWFyY2gpIHtcbiAgICBwYXRoID0gcGF0aCArIHRyYW5zcG9ydC5zZWFyY2g7XG4gIH1cbiAgaWYgKHRyYW5zcG9ydC5wcm94eSkge1xuICAgIHBhdGggPSBwcm90b2NvbCArICcvLycgKyBob3N0bmFtZSArIHBhdGg7XG4gICAgaG9zdG5hbWUgPSB0cmFuc3BvcnQucHJveHkuaG9zdCB8fCB0cmFuc3BvcnQucHJveHkuaG9zdG5hbWU7XG4gICAgcG9ydCA9IHRyYW5zcG9ydC5wcm94eS5wb3J0O1xuICAgIHByb3RvY29sID0gdHJhbnNwb3J0LnByb3h5LnByb3RvY29sIHx8IHByb3RvY29sO1xuICB9XG4gIHJldHVybiB7XG4gICAgdGltZW91dDogdGltZW91dCxcbiAgICBwcm90b2NvbDogcHJvdG9jb2wsXG4gICAgaG9zdG5hbWU6IGhvc3RuYW1lLFxuICAgIHBhdGg6IHBhdGgsXG4gICAgcG9ydDogcG9ydCxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICB0cmFuc3BvcnQ6IHRyYW5zcG9ydEFQSSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kUGF0aFRvUGF0aChiYXNlLCBwYXRoKSB7XG4gIHZhciBiYXNlVHJhaWxpbmdTbGFzaCA9IC9cXC8kLy50ZXN0KGJhc2UpO1xuICB2YXIgcGF0aEJlZ2lubmluZ1NsYXNoID0gL15cXC8vLnRlc3QocGF0aCk7XG5cbiAgaWYgKGJhc2VUcmFpbGluZ1NsYXNoICYmIHBhdGhCZWdpbm5pbmdTbGFzaCkge1xuICAgIHBhdGggPSBwYXRoLnN1YnN0cmluZygxKTtcbiAgfSBlbHNlIGlmICghYmFzZVRyYWlsaW5nU2xhc2ggJiYgIXBhdGhCZWdpbm5pbmdTbGFzaCkge1xuICAgIHBhdGggPSAnLycgKyBwYXRoO1xuICB9XG5cbiAgcmV0dXJuIGJhc2UgKyBwYXRoO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnVpbGRQYXlsb2FkOiBidWlsZFBheWxvYWQsXG4gIGdldFRyYW5zcG9ydEZyb21PcHRpb25zOiBnZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyxcbiAgdHJhbnNwb3J0T3B0aW9uczogdHJhbnNwb3J0T3B0aW9ucyxcbiAgYXBwZW5kUGF0aFRvUGF0aDogYXBwZW5kUGF0aFRvUGF0aCxcbn07XG4iLCIvLyBTZWUgaHR0cHM6Ly9ub2RlanMub3JnL2RvY3MvbGF0ZXN0L2FwaS91cmwuaHRtbFxuZnVuY3Rpb24gcGFyc2UodXJsKSB7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgcHJvdG9jb2w6IG51bGwsXG4gICAgYXV0aDogbnVsbCxcbiAgICBob3N0OiBudWxsLFxuICAgIHBhdGg6IG51bGwsXG4gICAgaGFzaDogbnVsbCxcbiAgICBocmVmOiB1cmwsXG4gICAgaG9zdG5hbWU6IG51bGwsXG4gICAgcG9ydDogbnVsbCxcbiAgICBwYXRobmFtZTogbnVsbCxcbiAgICBzZWFyY2g6IG51bGwsXG4gICAgcXVlcnk6IG51bGwsXG4gIH07XG5cbiAgdmFyIGksIGxhc3Q7XG4gIGkgPSB1cmwuaW5kZXhPZignLy8nKTtcbiAgaWYgKGkgIT09IC0xKSB7XG4gICAgcmVzdWx0LnByb3RvY29sID0gdXJsLnN1YnN0cmluZygwLCBpKTtcbiAgICBsYXN0ID0gaSArIDI7XG4gIH0gZWxzZSB7XG4gICAgbGFzdCA9IDA7XG4gIH1cblxuICBpID0gdXJsLmluZGV4T2YoJ0AnLCBsYXN0KTtcbiAgaWYgKGkgIT09IC0xKSB7XG4gICAgcmVzdWx0LmF1dGggPSB1cmwuc3Vic3RyaW5nKGxhc3QsIGkpO1xuICAgIGxhc3QgPSBpICsgMTtcbiAgfVxuXG4gIGkgPSB1cmwuaW5kZXhPZignLycsIGxhc3QpO1xuICBpZiAoaSA9PT0gLTEpIHtcbiAgICBpID0gdXJsLmluZGV4T2YoJz8nLCBsYXN0KTtcbiAgICBpZiAoaSA9PT0gLTEpIHtcbiAgICAgIGkgPSB1cmwuaW5kZXhPZignIycsIGxhc3QpO1xuICAgICAgaWYgKGkgPT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5ob3N0ID0gdXJsLnN1YnN0cmluZyhsYXN0LCBpKTtcbiAgICAgICAgcmVzdWx0Lmhhc2ggPSB1cmwuc3Vic3RyaW5nKGkpO1xuICAgICAgfVxuICAgICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVswXTtcbiAgICAgIHJlc3VsdC5wb3J0ID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVsxXTtcbiAgICAgIGlmIChyZXN1bHQucG9ydCkge1xuICAgICAgICByZXN1bHQucG9ydCA9IHBhcnNlSW50KHJlc3VsdC5wb3J0LCAxMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQuaG9zdCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgICByZXN1bHQuaG9zdG5hbWUgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzBdO1xuICAgICAgcmVzdWx0LnBvcnQgPSByZXN1bHQuaG9zdC5zcGxpdCgnOicpWzFdO1xuICAgICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICAgIHJlc3VsdC5wb3J0ID0gcGFyc2VJbnQocmVzdWx0LnBvcnQsIDEwKTtcbiAgICAgIH1cbiAgICAgIGxhc3QgPSBpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXN1bHQuaG9zdCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgcmVzdWx0Lmhvc3RuYW1lID0gcmVzdWx0Lmhvc3Quc3BsaXQoJzonKVswXTtcbiAgICByZXN1bHQucG9ydCA9IHJlc3VsdC5ob3N0LnNwbGl0KCc6JylbMV07XG4gICAgaWYgKHJlc3VsdC5wb3J0KSB7XG4gICAgICByZXN1bHQucG9ydCA9IHBhcnNlSW50KHJlc3VsdC5wb3J0LCAxMCk7XG4gICAgfVxuICAgIGxhc3QgPSBpO1xuICB9XG5cbiAgaSA9IHVybC5pbmRleE9mKCcjJywgbGFzdCk7XG4gIGlmIChpID09PSAtMSkge1xuICAgIHJlc3VsdC5wYXRoID0gdXJsLnN1YnN0cmluZyhsYXN0KTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQucGF0aCA9IHVybC5zdWJzdHJpbmcobGFzdCwgaSk7XG4gICAgcmVzdWx0Lmhhc2ggPSB1cmwuc3Vic3RyaW5nKGkpO1xuICB9XG5cbiAgaWYgKHJlc3VsdC5wYXRoKSB7XG4gICAgdmFyIHBhdGhQYXJ0cyA9IHJlc3VsdC5wYXRoLnNwbGl0KCc/Jyk7XG4gICAgcmVzdWx0LnBhdGhuYW1lID0gcGF0aFBhcnRzWzBdO1xuICAgIHJlc3VsdC5xdWVyeSA9IHBhdGhQYXJ0c1sxXTtcbiAgICByZXN1bHQuc2VhcmNoID0gcmVzdWx0LnF1ZXJ5ID8gJz8nICsgcmVzdWx0LnF1ZXJ5IDogbnVsbDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGFyc2U6IHBhcnNlLFxufTtcbiIsInZhciBFcnJvclN0YWNrUGFyc2VyID0gcmVxdWlyZSgnZXJyb3Itc3RhY2stcGFyc2VyJyk7XG5cbnZhciBVTktOT1dOX0ZVTkNUSU9OID0gJz8nO1xudmFyIEVSUl9DTEFTU19SRUdFWFAgPSBuZXcgUmVnRXhwKFxuICAnXigoW2EtekEtWjAtOS1fJCBdKik6ICopPyhVbmNhdWdodCApPyhbYS16QS1aMC05LV8kIF0qKTogJyxcbik7XG5cbmZ1bmN0aW9uIGd1ZXNzRnVuY3Rpb25OYW1lKCkge1xuICByZXR1cm4gVU5LTk9XTl9GVU5DVElPTjtcbn1cblxuZnVuY3Rpb24gZ2F0aGVyQ29udGV4dCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIEZyYW1lKHN0YWNrRnJhbWUpIHtcbiAgdmFyIGRhdGEgPSB7fTtcblxuICBkYXRhLl9zdGFja0ZyYW1lID0gc3RhY2tGcmFtZTtcblxuICBkYXRhLnVybCA9IHN0YWNrRnJhbWUuZmlsZU5hbWU7XG4gIGRhdGEubGluZSA9IHN0YWNrRnJhbWUubGluZU51bWJlcjtcbiAgZGF0YS5mdW5jID0gc3RhY2tGcmFtZS5mdW5jdGlvbk5hbWU7XG4gIGRhdGEuY29sdW1uID0gc3RhY2tGcmFtZS5jb2x1bW5OdW1iZXI7XG4gIGRhdGEuYXJncyA9IHN0YWNrRnJhbWUuYXJncztcblxuICBkYXRhLmNvbnRleHQgPSBnYXRoZXJDb250ZXh0KCk7XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbmZ1bmN0aW9uIFN0YWNrKGV4Y2VwdGlvbiwgc2tpcCkge1xuICBmdW5jdGlvbiBnZXRTdGFjaygpIHtcbiAgICB2YXIgcGFyc2VyU3RhY2sgPSBbXTtcblxuICAgIHNraXAgPSBza2lwIHx8IDA7XG5cbiAgICB0cnkge1xuICAgICAgcGFyc2VyU3RhY2sgPSBFcnJvclN0YWNrUGFyc2VyLnBhcnNlKGV4Y2VwdGlvbik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcGFyc2VyU3RhY2sgPSBbXTtcbiAgICB9XG5cbiAgICB2YXIgc3RhY2sgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSBza2lwOyBpIDwgcGFyc2VyU3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YWNrLnB1c2gobmV3IEZyYW1lKHBhcnNlclN0YWNrW2ldKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YWNrO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzdGFjazogZ2V0U3RhY2soKSxcbiAgICBtZXNzYWdlOiBleGNlcHRpb24ubWVzc2FnZSxcbiAgICBuYW1lOiBfbW9zdFNwZWNpZmljRXJyb3JOYW1lKGV4Y2VwdGlvbiksXG4gICAgcmF3U3RhY2s6IGV4Y2VwdGlvbi5zdGFjayxcbiAgICByYXdFeGNlcHRpb246IGV4Y2VwdGlvbixcbiAgfTtcbn1cblxuZnVuY3Rpb24gcGFyc2UoZSwgc2tpcCkge1xuICB2YXIgZXJyID0gZTtcblxuICBpZiAoZXJyLm5lc3RlZCB8fCBlcnIuY2F1c2UpIHtcbiAgICB2YXIgdHJhY2VDaGFpbiA9IFtdO1xuICAgIHdoaWxlIChlcnIpIHtcbiAgICAgIHRyYWNlQ2hhaW4ucHVzaChuZXcgU3RhY2soZXJyLCBza2lwKSk7XG4gICAgICBlcnIgPSBlcnIubmVzdGVkIHx8IGVyci5jYXVzZTtcblxuICAgICAgc2tpcCA9IDA7IC8vIE9ubHkgYXBwbHkgc2tpcCB2YWx1ZSB0byBwcmltYXJ5IGVycm9yXG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHByaW1hcnkgZXJyb3Igd2l0aCBmdWxsIHRyYWNlIGNoYWluIGF0dGFjaGVkLlxuICAgIHRyYWNlQ2hhaW5bMF0udHJhY2VDaGFpbiA9IHRyYWNlQ2hhaW47XG4gICAgcmV0dXJuIHRyYWNlQ2hhaW5bMF07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBTdGFjayhlcnIsIHNraXApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGd1ZXNzRXJyb3JDbGFzcyhlcnJNc2cpIHtcbiAgaWYgKCFlcnJNc2cgfHwgIWVyck1zZy5tYXRjaCkge1xuICAgIHJldHVybiBbJ1Vua25vd24gZXJyb3IuIFRoZXJlIHdhcyBubyBlcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkuJywgJyddO1xuICB9XG4gIHZhciBlcnJDbGFzc01hdGNoID0gZXJyTXNnLm1hdGNoKEVSUl9DTEFTU19SRUdFWFApO1xuICB2YXIgZXJyQ2xhc3MgPSAnKHVua25vd24pJztcblxuICBpZiAoZXJyQ2xhc3NNYXRjaCkge1xuICAgIGVyckNsYXNzID0gZXJyQ2xhc3NNYXRjaFtlcnJDbGFzc01hdGNoLmxlbmd0aCAtIDFdO1xuICAgIGVyck1zZyA9IGVyck1zZy5yZXBsYWNlKFxuICAgICAgKGVyckNsYXNzTWF0Y2hbZXJyQ2xhc3NNYXRjaC5sZW5ndGggLSAyXSB8fCAnJykgKyBlcnJDbGFzcyArICc6JyxcbiAgICAgICcnLFxuICAgICk7XG4gICAgZXJyTXNnID0gZXJyTXNnLnJlcGxhY2UoLyheW1xcc10rfFtcXHNdKyQpL2csICcnKTtcbiAgfVxuICByZXR1cm4gW2VyckNsYXNzLCBlcnJNc2ddO1xufVxuXG4vLyAqIFByZWZlcnMgYW55IHZhbHVlIG92ZXIgYW4gZW1wdHkgc3RyaW5nXG4vLyAqIFByZWZlcnMgYW55IHZhbHVlIG92ZXIgJ0Vycm9yJyB3aGVyZSBwb3NzaWJsZVxuLy8gKiBQcmVmZXJzIG5hbWUgb3ZlciBjb25zdHJ1Y3Rvci5uYW1lIHdoZW4gYm90aCBhcmUgbW9yZSBzcGVjaWZpYyB0aGFuICdFcnJvcidcbmZ1bmN0aW9uIF9tb3N0U3BlY2lmaWNFcnJvck5hbWUoZXJyb3IpIHtcbiAgdmFyIG5hbWUgPSBlcnJvci5uYW1lICYmIGVycm9yLm5hbWUubGVuZ3RoICYmIGVycm9yLm5hbWU7XG4gIHZhciBjb25zdHJ1Y3Rvck5hbWUgPVxuICAgIGVycm9yLmNvbnN0cnVjdG9yLm5hbWUgJiZcbiAgICBlcnJvci5jb25zdHJ1Y3Rvci5uYW1lLmxlbmd0aCAmJlxuICAgIGVycm9yLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgaWYgKCFuYW1lIHx8ICFjb25zdHJ1Y3Rvck5hbWUpIHtcbiAgICByZXR1cm4gbmFtZSB8fCBjb25zdHJ1Y3Rvck5hbWU7XG4gIH1cblxuICBpZiAobmFtZSA9PT0gJ0Vycm9yJykge1xuICAgIHJldHVybiBjb25zdHJ1Y3Rvck5hbWU7XG4gIH1cbiAgcmV0dXJuIG5hbWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBndWVzc0Z1bmN0aW9uTmFtZTogZ3Vlc3NGdW5jdGlvbk5hbWUsXG4gIGd1ZXNzRXJyb3JDbGFzczogZ3Vlc3NFcnJvckNsYXNzLFxuICBnYXRoZXJDb250ZXh0OiBnYXRoZXJDb250ZXh0LFxuICBwYXJzZTogcGFyc2UsXG4gIFN0YWNrOiBTdGFjayxcbiAgRnJhbWU6IEZyYW1lLFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gIGlmICghb2JqIHx8IHRvU3RyLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaGFzT3duQ29uc3RydWN0b3IgPSBoYXNPd24uY2FsbChvYmosICdjb25zdHJ1Y3RvcicpO1xuICB2YXIgaGFzSXNQcm90b3R5cGVPZiA9XG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSAmJlxuICAgIGhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICdpc1Byb3RvdHlwZU9mJyk7XG4gIC8vIE5vdCBvd24gY29uc3RydWN0b3IgcHJvcGVydHkgbXVzdCBiZSBPYmplY3RcbiAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiAhaGFzT3duQ29uc3RydWN0b3IgJiYgIWhhc0lzUHJvdG90eXBlT2YpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBPd24gcHJvcGVydGllcyBhcmUgZW51bWVyYXRlZCBmaXJzdGx5LCBzbyB0byBzcGVlZCB1cCxcbiAgLy8gaWYgbGFzdCBvbmUgaXMgb3duLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIGFyZSBvd24uXG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIC8qKi9cbiAgfVxuXG4gIHJldHVybiB0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG59O1xuXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIGksXG4gICAgc3JjLFxuICAgIGNvcHksXG4gICAgY2xvbmUsXG4gICAgbmFtZSxcbiAgICByZXN1bHQgPSB7fSxcbiAgICBjdXJyZW50ID0gbnVsbCxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGN1cnJlbnQgPSBhcmd1bWVudHNbaV07XG4gICAgaWYgKGN1cnJlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgZm9yIChuYW1lIGluIGN1cnJlbnQpIHtcbiAgICAgIHNyYyA9IHJlc3VsdFtuYW1lXTtcbiAgICAgIGNvcHkgPSBjdXJyZW50W25hbWVdO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gY29weSkge1xuICAgICAgICBpZiAoY29weSAmJiBpc1BsYWluT2JqZWN0KGNvcHkpKSB7XG4gICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gbWVyZ2UoY2xvbmUsIGNvcHkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb3B5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJlc3VsdFtuYW1lXSA9IGNvcHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZXJnZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbi8qXG4gKiBOb3RpZmllciAtIHRoZSBpbnRlcm5hbCBvYmplY3QgcmVzcG9uc2libGUgZm9yIGRlbGVnYXRpbmcgYmV0d2VlbiB0aGUgY2xpZW50IGV4cG9zZWQgQVBJLCB0aGVcbiAqIGNoYWluIG9mIHRyYW5zZm9ybXMgbmVjZXNzYXJ5IHRvIHR1cm4gYW4gaXRlbSBpbnRvIHNvbWV0aGluZyB0aGF0IGNhbiBiZSBzZW50IHRvIFJvbGxiYXIsIGFuZCB0aGVcbiAqIHF1ZXVlIHdoaWNoIGhhbmRsZXMgdGhlIGNvbW11bmNhdGlvbiB3aXRoIHRoZSBSb2xsYmFyIEFQSSBzZXJ2ZXJzLlxuICpcbiAqIEBwYXJhbSBxdWV1ZSAtIGFuIG9iamVjdCB0aGF0IGNvbmZvcm1zIHRvIHRoZSBpbnRlcmZhY2U6IGFkZEl0ZW0oaXRlbSwgY2FsbGJhY2spXG4gKiBAcGFyYW0gb3B0aW9ucyAtIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG9wdGlvbnMgdG8gYmUgc2V0IGZvciB0aGlzIG5vdGlmaWVyLCB0aGlzIHNob3VsZCBoYXZlXG4gKiBhbnkgZGVmYXVsdHMgYWxyZWFkeSBzZXQgYnkgdGhlIGNhbGxlclxuICovXG5mdW5jdGlvbiBOb3RpZmllcihxdWV1ZSwgb3B0aW9ucykge1xuICB0aGlzLnF1ZXVlID0gcXVldWU7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMudHJhbnNmb3JtcyA9IFtdO1xuICB0aGlzLmRpYWdub3N0aWMgPSB7fTtcbn1cblxuLypcbiAqIGNvbmZpZ3VyZSAtIHVwZGF0ZXMgdGhlIG9wdGlvbnMgZm9yIHRoaXMgbm90aWZpZXIgd2l0aCB0aGUgcGFzc2VkIGluIG9iamVjdFxuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gYW4gb2JqZWN0IHdoaWNoIGdldHMgbWVyZ2VkIHdpdGggdGhlIGN1cnJlbnQgb3B0aW9ucyBzZXQgb24gdGhpcyBub3RpZmllclxuICogQHJldHVybnMgdGhpc1xuICovXG5Ob3RpZmllci5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdGhpcy5xdWV1ZSAmJiB0aGlzLnF1ZXVlLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgdmFyIG9sZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqIGFkZFRyYW5zZm9ybSAtIGFkZHMgYSB0cmFuc2Zvcm0gb250byB0aGUgZW5kIG9mIHRoZSBxdWV1ZSBvZiB0cmFuc2Zvcm1zIGZvciB0aGlzIG5vdGlmaWVyXG4gKlxuICogQHBhcmFtIHRyYW5zZm9ybSAtIGEgZnVuY3Rpb24gd2hpY2ggdGFrZXMgdGhyZWUgYXJndW1lbnRzOlxuICogICAgKiBpdGVtOiBBbiBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIHRvIGV2ZW50dWFsbHkgYmUgc2VudCB0byBSb2xsYmFyXG4gKiAgICAqIG9wdGlvbnM6IFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBvcHRpb25zIGZvciB0aGlzIG5vdGlmaWVyXG4gKiAgICAqIGNhbGxiYWNrOiBmdW5jdGlvbihlcnI6IChOdWxsfEVycm9yKSwgaXRlbTogKE51bGx8T2JqZWN0KSkgdGhlIHRyYW5zZm9ybSBtdXN0IGNhbGwgdGhpc1xuICogICAgY2FsbGJhY2sgd2l0aCBhIG51bGwgdmFsdWUgZm9yIGVycm9yIGlmIGl0IHdhbnRzIHRoZSBwcm9jZXNzaW5nIGNoYWluIHRvIGNvbnRpbnVlLCBvdGhlcndpc2VcbiAqICAgIHdpdGggYW4gZXJyb3IgdG8gdGVybWluYXRlIHRoZSBwcm9jZXNzaW5nLiBUaGUgaXRlbSBzaG91bGQgYmUgdGhlIHVwZGF0ZWQgaXRlbSBhZnRlciB0aGlzXG4gKiAgICB0cmFuc2Zvcm0gaXMgZmluaXNoZWQgbW9kaWZ5aW5nIGl0LlxuICovXG5Ob3RpZmllci5wcm90b3R5cGUuYWRkVHJhbnNmb3JtID0gZnVuY3Rpb24gKHRyYW5zZm9ybSkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKHRyYW5zZm9ybSkpIHtcbiAgICB0aGlzLnRyYW5zZm9ybXMucHVzaCh0cmFuc2Zvcm0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqIGxvZyAtIHRoZSBpbnRlcm5hbCBsb2cgZnVuY3Rpb24gd2hpY2ggYXBwbGllcyB0aGUgY29uZmlndXJlZCB0cmFuc2Zvcm1zIGFuZCB0aGVuIHB1c2hlcyBvbnRvIHRoZVxuICogcXVldWUgdG8gYmUgc2VudCB0byB0aGUgYmFja2VuZC5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIEFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlOlxuICogICAgbWVzc2FnZSBbU3RyaW5nXSAtIEFuIG9wdGlvbmFsIHN0cmluZyB0byBiZSBzZW50IHRvIHJvbGxiYXJcbiAqICAgIGVycm9yIFtFcnJvcl0gLSBBbiBvcHRpb25hbCBlcnJvclxuICpcbiAqIEBwYXJhbSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gb2YgdHlwZSBmdW5jdGlvbihlcnIsIHJlc3ApIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdpdGggZXhhY3RseSBvbmVcbiAqIG51bGwgYXJndW1lbnQgYW5kIG9uZSBub24tbnVsbCBhcmd1bWVudC4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIG9uY2UsIGVpdGhlciBkdXJpbmcgdGhlXG4gKiB0cmFuc2Zvcm0gc3RhZ2UgaWYgYW4gZXJyb3Igb2NjdXJzIGluc2lkZSBhIHRyYW5zZm9ybSwgb3IgaW4gcmVzcG9uc2UgdG8gdGhlIGNvbW11bmljYXRpb24gd2l0aFxuICogdGhlIGJhY2tlbmQuIFRoZSBzZWNvbmQgYXJndW1lbnQgd2lsbCBiZSB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgYmFja2VuZCBpbiBjYXNlIG9mIHN1Y2Nlc3MuXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gIH1cblxuICBpZiAoIXRoaXMub3B0aW9ucy5lbmFibGVkKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignUm9sbGJhciBpcyBub3QgZW5hYmxlZCcpKTtcbiAgfVxuXG4gIHRoaXMucXVldWUuYWRkUGVuZGluZ0l0ZW0oaXRlbSk7XG4gIHZhciBvcmlnaW5hbEVycm9yID0gaXRlbS5lcnI7XG4gIHRoaXMuX2FwcGx5VHJhbnNmb3JtcyhcbiAgICBpdGVtLFxuICAgIGZ1bmN0aW9uIChlcnIsIGkpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5yZW1vdmVQZW5kaW5nSXRlbShpdGVtKTtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICB9XG4gICAgICB0aGlzLnF1ZXVlLmFkZEl0ZW0oaSwgY2FsbGJhY2ssIG9yaWdpbmFsRXJyb3IsIGl0ZW0pO1xuICAgIH0uYmluZCh0aGlzKSxcbiAgKTtcbn07XG5cbi8qIEludGVybmFsICovXG5cbi8qXG4gKiBfYXBwbHlUcmFuc2Zvcm1zIC0gQXBwbGllcyB0aGUgdHJhbnNmb3JtcyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGlzIG5vdGlmaWVyIHNlcXVlbnRpYWxseS4gU2VlXG4gKiBgYWRkVHJhbnNmb3JtYCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIEFuIGl0ZW0gdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gb2YgdHlwZSBmdW5jdGlvbihlcnIsIGl0ZW0pIHdoaWNoIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBub24tbnVsbFxuICogZXJyb3IgYW5kIGEgbnVsbCBpdGVtIGluIHRoZSBjYXNlIG9mIGEgdHJhbnNmb3JtIGZhaWx1cmUsIG9yIGEgbnVsbCBlcnJvciBhbmQgbm9uLW51bGwgaXRlbSBhZnRlclxuICogYWxsIHRyYW5zZm9ybXMgaGF2ZSBiZWVuIGFwcGxpZWQuXG4gKi9cbk5vdGlmaWVyLnByb3RvdHlwZS5fYXBwbHlUcmFuc2Zvcm1zID0gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gIHZhciB0cmFuc2Zvcm1JbmRleCA9IC0xO1xuICB2YXIgdHJhbnNmb3Jtc0xlbmd0aCA9IHRoaXMudHJhbnNmb3Jtcy5sZW5ndGg7XG4gIHZhciB0cmFuc2Zvcm1zID0gdGhpcy50cmFuc2Zvcm1zO1xuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICB2YXIgY2IgPSBmdW5jdGlvbiAoZXJyLCBpKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cmFuc2Zvcm1JbmRleCsrO1xuXG4gICAgaWYgKHRyYW5zZm9ybUluZGV4ID09PSB0cmFuc2Zvcm1zTGVuZ3RoKSB7XG4gICAgICBjYWxsYmFjayhudWxsLCBpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cmFuc2Zvcm1zW3RyYW5zZm9ybUluZGV4XShpLCBvcHRpb25zLCBjYik7XG4gIH07XG5cbiAgY2IobnVsbCwgaXRlbSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vdGlmaWVyO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuZnVuY3Rpb24gY2hlY2tMZXZlbChpdGVtLCBzZXR0aW5ncykge1xuICB2YXIgbGV2ZWwgPSBpdGVtLmxldmVsO1xuICB2YXIgbGV2ZWxWYWwgPSBfLkxFVkVMU1tsZXZlbF0gfHwgMDtcbiAgdmFyIHJlcG9ydExldmVsID0gc2V0dGluZ3MucmVwb3J0TGV2ZWw7XG4gIHZhciByZXBvcnRMZXZlbFZhbCA9IF8uTEVWRUxTW3JlcG9ydExldmVsXSB8fCAwO1xuXG4gIGlmIChsZXZlbFZhbCA8IHJlcG9ydExldmVsVmFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB1c2VyQ2hlY2tJZ25vcmUobG9nZ2VyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgaXNVbmNhdWdodCA9ICEhaXRlbS5faXNVbmNhdWdodDtcbiAgICBkZWxldGUgaXRlbS5faXNVbmNhdWdodDtcbiAgICB2YXIgYXJncyA9IGl0ZW0uX29yaWdpbmFsQXJncztcbiAgICBkZWxldGUgaXRlbS5fb3JpZ2luYWxBcmdzO1xuICAgIHRyeSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKHNldHRpbmdzLm9uU2VuZENhbGxiYWNrKSkge1xuICAgICAgICBzZXR0aW5ncy5vblNlbmRDYWxsYmFjayhpc1VuY2F1Z2h0LCBhcmdzLCBpdGVtKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXR0aW5ncy5vblNlbmRDYWxsYmFjayA9IG51bGw7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHdoaWxlIGNhbGxpbmcgb25TZW5kQ2FsbGJhY2ssIHJlbW92aW5nJywgZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZiAoXG4gICAgICAgIF8uaXNGdW5jdGlvbihzZXR0aW5ncy5jaGVja0lnbm9yZSkgJiZcbiAgICAgICAgc2V0dGluZ3MuY2hlY2tJZ25vcmUoaXNVbmNhdWdodCwgYXJncywgaXRlbSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0dGluZ3MuY2hlY2tJZ25vcmUgPSBudWxsO1xuICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciB3aGlsZSBjYWxsaW5nIGN1c3RvbSBjaGVja0lnbm9yZSgpLCByZW1vdmluZycsIGUpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXJsSXNOb3RCbG9ja0xpc3RlZChsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBzZXR0aW5ncykge1xuICAgIHJldHVybiAhdXJsSXNPbkFMaXN0KGl0ZW0sIHNldHRpbmdzLCAnYmxvY2tsaXN0JywgbG9nZ2VyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXJsSXNTYWZlTGlzdGVkKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIHNldHRpbmdzKSB7XG4gICAgcmV0dXJuIHVybElzT25BTGlzdChpdGVtLCBzZXR0aW5ncywgJ3NhZmVsaXN0JywgbG9nZ2VyKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hGcmFtZXModHJhY2UsIGxpc3QsIGJsb2NrKSB7XG4gIGlmICghdHJhY2UpIHtcbiAgICByZXR1cm4gIWJsb2NrO1xuICB9XG5cbiAgdmFyIGZyYW1lcyA9IHRyYWNlLmZyYW1lcztcblxuICBpZiAoIWZyYW1lcyB8fCBmcmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICFibG9jaztcbiAgfVxuXG4gIHZhciBmcmFtZSwgZmlsZW5hbWUsIHVybCwgdXJsUmVnZXg7XG4gIHZhciBsaXN0TGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHZhciBmcmFtZUxlbmd0aCA9IGZyYW1lcy5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZnJhbWVMZW5ndGg7IGkrKykge1xuICAgIGZyYW1lID0gZnJhbWVzW2ldO1xuICAgIGZpbGVuYW1lID0gZnJhbWUuZmlsZW5hbWU7XG5cbiAgICBpZiAoIV8uaXNUeXBlKGZpbGVuYW1lLCAnc3RyaW5nJykpIHtcbiAgICAgIHJldHVybiAhYmxvY2s7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBsaXN0TGVuZ3RoOyBqKyspIHtcbiAgICAgIHVybCA9IGxpc3Rbal07XG4gICAgICB1cmxSZWdleCA9IG5ldyBSZWdFeHAodXJsKTtcblxuICAgICAgaWYgKHVybFJlZ2V4LnRlc3QoZmlsZW5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHVybElzT25BTGlzdChpdGVtLCBzZXR0aW5ncywgc2FmZU9yQmxvY2ssIGxvZ2dlcikge1xuICAvLyBzYWZlbGlzdCBpcyB0aGUgZGVmYXVsdFxuICB2YXIgYmxvY2sgPSBmYWxzZTtcbiAgaWYgKHNhZmVPckJsb2NrID09PSAnYmxvY2tsaXN0Jykge1xuICAgIGJsb2NrID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciBsaXN0LCB0cmFjZXM7XG4gIHRyeSB7XG4gICAgbGlzdCA9IGJsb2NrID8gc2V0dGluZ3MuaG9zdEJsb2NrTGlzdCA6IHNldHRpbmdzLmhvc3RTYWZlTGlzdDtcbiAgICB0cmFjZXMgPSBfLmdldChpdGVtLCAnYm9keS50cmFjZV9jaGFpbicpIHx8IFtfLmdldChpdGVtLCAnYm9keS50cmFjZScpXTtcblxuICAgIC8vIFRoZXNlIHR3byBjaGVja3MgYXJlIGltcG9ydGFudCB0byBjb21lIGZpcnN0IGFzIHRoZXkgYXJlIGRlZmF1bHRzXG4gICAgLy8gaW4gY2FzZSB0aGUgbGlzdCBpcyBtaXNzaW5nIG9yIHRoZSB0cmFjZSBpcyBtaXNzaW5nIG9yIG5vdCB3ZWxsLWZvcm1lZFxuICAgIGlmICghbGlzdCB8fCBsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICFibG9jaztcbiAgICB9XG4gICAgaWYgKHRyYWNlcy5sZW5ndGggPT09IDAgfHwgIXRyYWNlc1swXSkge1xuICAgICAgcmV0dXJuICFibG9jaztcbiAgICB9XG5cbiAgICB2YXIgdHJhY2VzTGVuZ3RoID0gdHJhY2VzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRyYWNlc0xlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hGcmFtZXModHJhY2VzW2ldLCBsaXN0LCBibG9jaykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChcbiAgICBlXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgKSB7XG4gICAgaWYgKGJsb2NrKSB7XG4gICAgICBzZXR0aW5ncy5ob3N0QmxvY2tMaXN0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0dGluZ3MuaG9zdFNhZmVMaXN0ID0gbnVsbDtcbiAgICB9XG4gICAgdmFyIGxpc3ROYW1lID0gYmxvY2sgPyAnaG9zdEJsb2NrTGlzdCcgOiAnaG9zdFNhZmVMaXN0JztcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBcIkVycm9yIHdoaWxlIHJlYWRpbmcgeW91ciBjb25maWd1cmF0aW9uJ3MgXCIgK1xuICAgICAgICBsaXN0TmFtZSArXG4gICAgICAgICcgb3B0aW9uLiBSZW1vdmluZyBjdXN0b20gJyArXG4gICAgICAgIGxpc3ROYW1lICtcbiAgICAgICAgJy4nLFxuICAgICAgZSxcbiAgICApO1xuICAgIHJldHVybiAhYmxvY2s7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBtZXNzYWdlSXNJZ25vcmVkKGxvZ2dlcikge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIHNldHRpbmdzKSB7XG4gICAgdmFyIGksIGosIGlnbm9yZWRNZXNzYWdlcywgbGVuLCBtZXNzYWdlSXNJZ25vcmVkLCBySWdub3JlZE1lc3NhZ2UsIG1lc3NhZ2VzO1xuXG4gICAgdHJ5IHtcbiAgICAgIG1lc3NhZ2VJc0lnbm9yZWQgPSBmYWxzZTtcbiAgICAgIGlnbm9yZWRNZXNzYWdlcyA9IHNldHRpbmdzLmlnbm9yZWRNZXNzYWdlcztcblxuICAgICAgaWYgKCFpZ25vcmVkTWVzc2FnZXMgfHwgaWdub3JlZE1lc3NhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgbWVzc2FnZXMgPSBtZXNzYWdlc0Zyb21JdGVtKGl0ZW0pO1xuXG4gICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBsZW4gPSBpZ25vcmVkTWVzc2FnZXMubGVuZ3RoO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHJJZ25vcmVkTWVzc2FnZSA9IG5ldyBSZWdFeHAoaWdub3JlZE1lc3NhZ2VzW2ldLCAnZ2knKTtcblxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgbWVzc2FnZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBtZXNzYWdlSXNJZ25vcmVkID0gcklnbm9yZWRNZXNzYWdlLnRlc3QobWVzc2FnZXNbal0pO1xuXG4gICAgICAgICAgaWYgKG1lc3NhZ2VJc0lnbm9yZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChcbiAgICAgIGVcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgKSB7XG4gICAgICBzZXR0aW5ncy5pZ25vcmVkTWVzc2FnZXMgPSBudWxsO1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICBcIkVycm9yIHdoaWxlIHJlYWRpbmcgeW91ciBjb25maWd1cmF0aW9uJ3MgaWdub3JlZE1lc3NhZ2VzIG9wdGlvbi4gUmVtb3ZpbmcgY3VzdG9tIGlnbm9yZWRNZXNzYWdlcy5cIixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lc3NhZ2VzRnJvbUl0ZW0oaXRlbSkge1xuICB2YXIgYm9keSA9IGl0ZW0uYm9keTtcbiAgdmFyIG1lc3NhZ2VzID0gW107XG5cbiAgLy8gVGhlIHBheWxvYWQgc2NoZW1hIG9ubHkgYWxsb3dzIG9uZSBvZiB0cmFjZV9jaGFpbiwgbWVzc2FnZSwgb3IgdHJhY2UuXG4gIC8vIEhvd2V2ZXIsIGV4aXN0aW5nIHRlc3QgY2FzZXMgYXJlIGJhc2VkIG9uIGhhdmluZyBib3RoIHRyYWNlIGFuZCBtZXNzYWdlIHByZXNlbnQuXG4gIC8vIFNvIGhlcmUgd2UgcHJlc2VydmUgdGhlIGFiaWxpdHkgdG8gY29sbGVjdCBzdHJpbmdzIGZyb20gYW55IGNvbWJpbmF0aW9uIG9mIHRoZXNlIGtleXMuXG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIHRyYWNlQ2hhaW4gPSBib2R5LnRyYWNlX2NoYWluO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHJhY2VDaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRyYWNlID0gdHJhY2VDaGFpbltpXTtcbiAgICAgIG1lc3NhZ2VzLnB1c2goXy5nZXQodHJhY2UsICdleGNlcHRpb24ubWVzc2FnZScpKTtcbiAgICB9XG4gIH1cbiAgaWYgKGJvZHkudHJhY2UpIHtcbiAgICBtZXNzYWdlcy5wdXNoKF8uZ2V0KGJvZHksICd0cmFjZS5leGNlcHRpb24ubWVzc2FnZScpKTtcbiAgfVxuICBpZiAoYm9keS5tZXNzYWdlKSB7XG4gICAgbWVzc2FnZXMucHVzaChfLmdldChib2R5LCAnbWVzc2FnZS5ib2R5JykpO1xuICB9XG4gIHJldHVybiBtZXNzYWdlcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrTGV2ZWw6IGNoZWNrTGV2ZWwsXG4gIHVzZXJDaGVja0lnbm9yZTogdXNlckNoZWNrSWdub3JlLFxuICB1cmxJc05vdEJsb2NrTGlzdGVkOiB1cmxJc05vdEJsb2NrTGlzdGVkLFxuICB1cmxJc1NhZmVMaXN0ZWQ6IHVybElzU2FmZUxpc3RlZCxcbiAgbWVzc2FnZUlzSWdub3JlZDogbWVzc2FnZUlzSWdub3JlZCxcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG4vKlxuICogUXVldWUgLSBhbiBvYmplY3Qgd2hpY2ggaGFuZGxlcyB3aGljaCBoYW5kbGVzIGEgcXVldWUgb2YgaXRlbXMgdG8gYmUgc2VudCB0byBSb2xsYmFyLlxuICogICBUaGlzIG9iamVjdCBoYW5kbGVzIHJhdGUgbGltaXRpbmcgdmlhIGEgcGFzc2VkIGluIHJhdGUgbGltaXRlciwgcmV0cmllcyBiYXNlZCBvbiBjb25uZWN0aW9uXG4gKiAgIGVycm9ycywgYW5kIGZpbHRlcmluZyBvZiBpdGVtcyBiYXNlZCBvbiBhIHNldCBvZiBjb25maWd1cmFibGUgcHJlZGljYXRlcy4gVGhlIGNvbW11bmljYXRpb24gdG9cbiAqICAgdGhlIGJhY2tlbmQgaXMgcGVyZm9ybWVkIHZpYSBhIGdpdmVuIEFQSSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHJhdGVMaW1pdGVyIC0gQW4gb2JqZWN0IHdoaWNoIGNvbmZvcm1zIHRvIHRoZSBpbnRlcmZhY2VcbiAqICAgIHJhdGVMaW1pdGVyLnNob3VsZFNlbmQoaXRlbSkgLT4gYm9vbFxuICogQHBhcmFtIGFwaSAtIEFuIG9iamVjdCB3aGljaCBjb25mb3JtcyB0byB0aGUgaW50ZXJmYWNlXG4gKiAgICBhcGkucG9zdEl0ZW0ocGF5bG9hZCwgZnVuY3Rpb24oZXJyLCByZXNwb25zZSkpXG4gKiBAcGFyYW0gbG9nZ2VyIC0gQW4gb2JqZWN0IHVzZWQgdG8gbG9nIHZlcmJvc2UgbWVzc2FnZXMgaWYgZGVzaXJlZFxuICogQHBhcmFtIG9wdGlvbnMgLSBzZWUgUXVldWUucHJvdG90eXBlLmNvbmZpZ3VyZVxuICogQHBhcmFtIHJlcGxheU1hcCAtIE9wdGlvbmFsIFJlcGxheU1hcCBmb3IgY29vcmRpbmF0aW5nIHNlc3Npb24gcmVwbGF5IHdpdGggZXJyb3Igb2NjdXJyZW5jZXNcbiAqL1xuZnVuY3Rpb24gUXVldWUocmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCBvcHRpb25zLCByZXBsYXlNYXApIHtcbiAgdGhpcy5yYXRlTGltaXRlciA9IHJhdGVMaW1pdGVyO1xuICB0aGlzLmFwaSA9IGFwaTtcbiAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIHRoaXMucmVwbGF5TWFwID0gcmVwbGF5TWFwO1xuICB0aGlzLnByZWRpY2F0ZXMgPSBbXTtcbiAgdGhpcy5wZW5kaW5nSXRlbXMgPSBbXTtcbiAgdGhpcy5wZW5kaW5nUmVxdWVzdHMgPSBbXTtcbiAgdGhpcy5yZXRyeVF1ZXVlID0gW107XG4gIHRoaXMucmV0cnlIYW5kbGUgPSBudWxsO1xuICB0aGlzLndhaXRDYWxsYmFjayA9IG51bGw7XG4gIHRoaXMud2FpdEludGVydmFsSUQgPSBudWxsO1xufVxuXG4vKlxuICogY29uZmlndXJlIC0gdXBkYXRlcyB0aGUgb3B0aW9ucyB0aGlzIHF1ZXVlIHVzZXNcbiAqXG4gKiBAcGFyYW0gb3B0aW9uc1xuICovXG5RdWV1ZS5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdGhpcy5hcGkgJiYgdGhpcy5hcGkuY29uZmlndXJlKG9wdGlvbnMpO1xuICB2YXIgb2xkT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZShvbGRPcHRpb25zLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogYWRkUHJlZGljYXRlIC0gYWRkcyBhIHByZWRpY2F0ZSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIHByZWRpY2F0ZXMgZm9yIHRoaXMgcXVldWVcbiAqXG4gKiBAcGFyYW0gcHJlZGljYXRlIC0gZnVuY3Rpb24oaXRlbSwgb3B0aW9ucykgLT4gKGJvb2x8e2VycjogRXJyb3J9KVxuICogIFJldHVybmluZyB0cnVlIG1lYW5zIHRoYXQgdGhpcyBwcmVkaWNhdGUgcGFzc2VzIGFuZCB0aGUgaXRlbSBpcyBva2F5IHRvIGdvIG9uIHRoZSBxdWV1ZVxuICogIFJldHVybmluZyBmYWxzZSBtZWFucyBkbyBub3QgYWRkIHRoZSBpdGVtIHRvIHRoZSBxdWV1ZSwgYnV0IGl0IGlzIG5vdCBhbiBlcnJvclxuICogIFJldHVybmluZyB7ZXJyOiBFcnJvcn0gbWVhbnMgZG8gbm90IGFkZCB0aGUgaXRlbSB0byB0aGUgcXVldWUsIGFuZCB0aGUgZ2l2ZW4gZXJyb3IgZXhwbGFpbnMgd2h5XG4gKiAgUmV0dXJuaW5nIHtlcnI6IHVuZGVmaW5lZH0gaXMgZXF1aXZhbGVudCB0byByZXR1cm5pbmcgdHJ1ZSBidXQgZG9uJ3QgZG8gdGhhdFxuICovXG5RdWV1ZS5wcm90b3R5cGUuYWRkUHJlZGljYXRlID0gZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKHByZWRpY2F0ZSkpIHtcbiAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuUXVldWUucHJvdG90eXBlLmFkZFBlbmRpbmdJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5wZW5kaW5nSXRlbXMucHVzaChpdGVtKTtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5yZW1vdmVQZW5kaW5nSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBpZHggPSB0aGlzLnBlbmRpbmdJdGVtcy5pbmRleE9mKGl0ZW0pO1xuICBpZiAoaWR4ICE9PSAtMSkge1xuICAgIHRoaXMucGVuZGluZ0l0ZW1zLnNwbGljZShpZHgsIDEpO1xuICB9XG59O1xuXG4vKlxuICogYWRkSXRlbSAtIFNlbmQgYW4gaXRlbSB0byB0aGUgUm9sbGJhciBBUEkgaWYgYWxsIG9mIHRoZSBwcmVkaWNhdGVzIGFyZSBzYXRpc2ZpZWRcbiAqXG4gKiBAcGFyYW0gaXRlbSAtIFRoZSBwYXlsb2FkIHRvIHNlbmQgdG8gdGhlIGJhY2tlbmRcbiAqIEBwYXJhbSBjYWxsYmFjayAtIGZ1bmN0aW9uKGVycm9yLCByZXBzb25zZSkgd2hpY2ggd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgQVBJXG4gKiAgaW4gdGhlIGNhc2Ugb2YgYSBzdWNjZXNzLCBvdGhlcndpc2UgcmVzcG9uc2Ugd2lsbCBiZSBudWxsIGFuZCBlcnJvciB3aWxsIGhhdmUgYSB2YWx1ZS4gSWYgYm90aFxuICogIGVycm9yIGFuZCByZXNwb25zZSBhcmUgbnVsbCB0aGVuIHRoZSBpdGVtIHdhcyBzdG9wcGVkIGJ5IGEgcHJlZGljYXRlIHdoaWNoIGRpZCBub3QgY29uc2lkZXIgdGhpc1xuICogIHRvIGJlIGFuIGVycm9yIGNvbmRpdGlvbiwgYnV0IG5vbmV0aGVsZXNzIGRpZCBub3Qgc2VuZCB0aGUgaXRlbSB0byB0aGUgQVBJLlxuICogIEBwYXJhbSBvcmlnaW5hbEVycm9yIC0gVGhlIG9yaWdpbmFsIGVycm9yIGJlZm9yZSBhbnkgdHJhbnNmb3JtYXRpb25zIHRoYXQgaXMgdG8gYmUgbG9nZ2VkIGlmIGFueVxuICovXG5RdWV1ZS5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uIChcbiAgaXRlbSxcbiAgY2FsbGJhY2ssXG4gIG9yaWdpbmFsRXJyb3IsXG4gIG9yaWdpbmFsSXRlbSxcbikge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm47XG4gICAgfTtcbiAgfVxuICB2YXIgcHJlZGljYXRlUmVzdWx0ID0gdGhpcy5fYXBwbHlQcmVkaWNhdGVzKGl0ZW0pO1xuICBpZiAocHJlZGljYXRlUmVzdWx0LnN0b3ApIHtcbiAgICB0aGlzLnJlbW92ZVBlbmRpbmdJdGVtKG9yaWdpbmFsSXRlbSk7XG4gICAgY2FsbGJhY2socHJlZGljYXRlUmVzdWx0LmVycik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuX21heWJlTG9nKGl0ZW0sIG9yaWdpbmFsRXJyb3IpO1xuICB0aGlzLnJlbW92ZVBlbmRpbmdJdGVtKG9yaWdpbmFsSXRlbSk7XG4gIGlmICghdGhpcy5vcHRpb25zLnRyYW5zbWl0KSB7XG4gICAgY2FsbGJhY2sobmV3IEVycm9yKCdUcmFuc21pdCBkaXNhYmxlZCcpKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodGhpcy5yZXBsYXlNYXAgJiYgaXRlbS5ib2R5KSB7XG4gICAgY29uc3QgcmVwbGF5SWQgPSB0aGlzLnJlcGxheU1hcC5hZGQoaXRlbS51dWlkKTtcbiAgICBpdGVtLnJlcGxheUlkID0gcmVwbGF5SWQ7XG4gIH1cblxuICB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5wdXNoKGl0ZW0pO1xuICB0cnkge1xuICAgIHRoaXMuX21ha2VBcGlSZXF1ZXN0KFxuICAgICAgaXRlbSxcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICAgICAgdGhpcy5fZGVxdWV1ZVBlbmRpbmdSZXF1ZXN0KGl0ZW0pO1xuXG4gICAgICAgIGlmICghZXJyICYmIHJlc3AgJiYgaXRlbS5yZXBsYXlJZCkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVJlcGxheVJlc3BvbnNlKGl0ZW0ucmVwbGF5SWQsIHJlc3ApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXNwKTtcbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICApO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhpcy5fZGVxdWV1ZVBlbmRpbmdSZXF1ZXN0KGl0ZW0pO1xuICAgIGNhbGxiYWNrKGUpO1xuICB9XG59O1xuXG4vKlxuICogd2FpdCAtIFN0b3AgYW55IGZ1cnRoZXIgZXJyb3JzIGZyb20gYmVpbmcgYWRkZWQgdG8gdGhlIHF1ZXVlLCBhbmQgZ2V0IGNhbGxlZCBiYWNrIHdoZW4gYWxsIGl0ZW1zXG4gKiAgIGN1cnJlbnRseSBwcm9jZXNzaW5nIGhhdmUgZmluaXNoZWQgc2VuZGluZyB0byB0aGUgYmFja2VuZC5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbigpIGNhbGxlZCB3aGVuIGFsbCBwZW5kaW5nIGl0ZW1zIGhhdmUgYmVlbiBzZW50XG4gKi9cblF1ZXVlLnByb3RvdHlwZS53YWl0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGlmICghXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLndhaXRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICBpZiAodGhpcy5fbWF5YmVDYWxsV2FpdCgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0aGlzLndhaXRJbnRlcnZhbElEKSB7XG4gICAgdGhpcy53YWl0SW50ZXJ2YWxJRCA9IGNsZWFySW50ZXJ2YWwodGhpcy53YWl0SW50ZXJ2YWxJRCk7XG4gIH1cbiAgdGhpcy53YWl0SW50ZXJ2YWxJRCA9IHNldEludGVydmFsKFxuICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX21heWJlQ2FsbFdhaXQoKTtcbiAgICB9LmJpbmQodGhpcyksXG4gICAgNTAwLFxuICApO1xufTtcblxuLyogX2FwcGx5UHJlZGljYXRlcyAtIFNlcXVlbnRpYWxseSBhcHBsaWVzIHRoZSBwcmVkaWNhdGVzIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIHRvIHRoZSBxdWV1ZSB0byB0aGVcbiAqICAgZ2l2ZW4gaXRlbSB3aXRoIHRoZSBjdXJyZW50bHkgY29uZmlndXJlZCBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gQW4gaXRlbSBpbiB0aGUgcXVldWVcbiAqIEByZXR1cm5zIHtzdG9wOiBib29sLCBlcnI6IChFcnJvcnxudWxsKX0gLSBzdG9wIGJlaW5nIHRydWUgbWVhbnMgZG8gbm90IGFkZCBpdGVtIHRvIHRoZSBxdWV1ZSxcbiAqICAgdGhlIGVycm9yIHZhbHVlIHNob3VsZCBiZSBwYXNzZWQgdXAgdG8gYSBjYWxsYmFrIGlmIHdlIGFyZSBzdG9wcGluZy5cbiAqL1xuUXVldWUucHJvdG90eXBlLl9hcHBseVByZWRpY2F0ZXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgcCA9IG51bGw7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnByZWRpY2F0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBwID0gdGhpcy5wcmVkaWNhdGVzW2ldKGl0ZW0sIHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKCFwIHx8IHAuZXJyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB7IHN0b3A6IHRydWUsIGVycjogcC5lcnIgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgc3RvcDogZmFsc2UsIGVycjogbnVsbCB9O1xufTtcblxuLypcbiAqIF9tYWtlQXBpUmVxdWVzdCAtIFNlbmQgYW4gaXRlbSB0byBSb2xsYmFyLCBjYWxsYmFjayB3aGVuIGRvbmUsIGlmIHRoZXJlIGlzIGFuIGVycm9yIG1ha2UgYW5cbiAqICAgZWZmb3J0IHRvIHJldHJ5IGlmIHdlIGFyZSBjb25maWd1cmVkIHRvIGRvIHNvLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gYW4gaXRlbSByZWFkeSB0byBzZW5kIHRvIHRoZSBiYWNrZW5kXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBmdW5jdGlvbihlcnIsIHJlc3BvbnNlKVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX21ha2VBcGlSZXF1ZXN0ID0gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gIHZhciByYXRlTGltaXRSZXNwb25zZSA9IHRoaXMucmF0ZUxpbWl0ZXIuc2hvdWxkU2VuZChpdGVtKTtcbiAgaWYgKHJhdGVMaW1pdFJlc3BvbnNlLnNob3VsZFNlbmQpIHtcbiAgICB0aGlzLmFwaS5wb3N0SXRlbShcbiAgICAgIGl0ZW0sXG4gICAgICBmdW5jdGlvbiAoZXJyLCByZXNwKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICB0aGlzLl9tYXliZVJldHJ5KGVyciwgaXRlbSwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzcCk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSxcbiAgICApO1xuICB9IGVsc2UgaWYgKHJhdGVMaW1pdFJlc3BvbnNlLmVycm9yKSB7XG4gICAgY2FsbGJhY2socmF0ZUxpbWl0UmVzcG9uc2UuZXJyb3IpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYXBpLnBvc3RJdGVtKHJhdGVMaW1pdFJlc3BvbnNlLnBheWxvYWQsIGNhbGxiYWNrKTtcbiAgfVxufTtcblxuLy8gVGhlc2UgYXJlIGVycm9ycyBiYXNpY2FsbHkgbWVhbiB0aGVyZSBpcyBubyBpbnRlcm5ldCBjb25uZWN0aW9uXG52YXIgUkVUUklBQkxFX0VSUk9SUyA9IFtcbiAgJ0VDT05OUkVTRVQnLFxuICAnRU5PVEZPVU5EJyxcbiAgJ0VTT0NLRVRUSU1FRE9VVCcsXG4gICdFVElNRURPVVQnLFxuICAnRUNPTk5SRUZVU0VEJyxcbiAgJ0VIT1NUVU5SRUFDSCcsXG4gICdFUElQRScsXG4gICdFQUlfQUdBSU4nLFxuXTtcblxuLypcbiAqIF9tYXliZVJldHJ5IC0gR2l2ZW4gdGhlIGVycm9yIHJldHVybmVkIGJ5IHRoZSBBUEksIGRlY2lkZSBpZiB3ZSBzaG91bGQgcmV0cnkgb3IganVzdCBjYWxsYmFja1xuICogICB3aXRoIHRoZSBlcnJvci5cbiAqXG4gKiBAcGFyYW0gZXJyIC0gYW4gZXJyb3IgcmV0dXJuZWQgYnkgdGhlIEFQSSB0cmFuc3BvcnRcbiAqIEBwYXJhbSBpdGVtIC0gdGhlIGl0ZW0gdGhhdCB3YXMgdHJ5aW5nIHRvIGJlIHNlbnQgd2hlbiB0aGlzIGVycm9yIG9jY3VyZWRcbiAqIEBwYXJhbSBjYWxsYmFjayAtIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5fbWF5YmVSZXRyeSA9IGZ1bmN0aW9uIChlcnIsIGl0ZW0sIGNhbGxiYWNrKSB7XG4gIHZhciBzaG91bGRSZXRyeSA9IGZhbHNlO1xuICBpZiAodGhpcy5vcHRpb25zLnJldHJ5SW50ZXJ2YWwpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gUkVUUklBQkxFX0VSUk9SUy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGVyci5jb2RlID09PSBSRVRSSUFCTEVfRVJST1JTW2ldKSB7XG4gICAgICAgIHNob3VsZFJldHJ5ID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzaG91bGRSZXRyeSAmJiBfLmlzRmluaXRlTnVtYmVyKHRoaXMub3B0aW9ucy5tYXhSZXRyaWVzKSkge1xuICAgICAgaXRlbS5yZXRyaWVzID0gaXRlbS5yZXRyaWVzID8gaXRlbS5yZXRyaWVzICsgMSA6IDE7XG4gICAgICBpZiAoaXRlbS5yZXRyaWVzID4gdGhpcy5vcHRpb25zLm1heFJldHJpZXMpIHtcbiAgICAgICAgc2hvdWxkUmV0cnkgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHNob3VsZFJldHJ5KSB7XG4gICAgdGhpcy5fcmV0cnlBcGlSZXF1ZXN0KGl0ZW0sIGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBjYWxsYmFjayhlcnIpO1xuICB9XG59O1xuXG4vKlxuICogX3JldHJ5QXBpUmVxdWVzdCAtIEFkZCBhbiBpdGVtIGFuZCBhIGNhbGxiYWNrIHRvIGEgcXVldWUgYW5kIHBvc3NpYmx5IHN0YXJ0IGEgdGltZXIgdG8gcHJvY2Vzc1xuICogICB0aGF0IHF1ZXVlIGJhc2VkIG9uIHRoZSByZXRyeUludGVydmFsIGluIHRoZSBvcHRpb25zIGZvciB0aGlzIHF1ZXVlLlxuICpcbiAqIEBwYXJhbSBpdGVtIC0gYW4gaXRlbSB0aGF0IGZhaWxlZCB0byBzZW5kIGR1ZSB0byBhbiBlcnJvciB3ZSBkZWVtIHJldHJpYWJsZVxuICogQHBhcmFtIGNhbGxiYWNrIC0gZnVuY3Rpb24oZXJyLCByZXNwb25zZSlcbiAqL1xuUXVldWUucHJvdG90eXBlLl9yZXRyeUFwaVJlcXVlc3QgPSBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgdGhpcy5yZXRyeVF1ZXVlLnB1c2goeyBpdGVtOiBpdGVtLCBjYWxsYmFjazogY2FsbGJhY2sgfSk7XG5cbiAgaWYgKCF0aGlzLnJldHJ5SGFuZGxlKSB7XG4gICAgdGhpcy5yZXRyeUhhbmRsZSA9IHNldEludGVydmFsKFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5yZXRyeVF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgIHZhciByZXRyeU9iamVjdCA9IHRoaXMucmV0cnlRdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgIHRoaXMuX21ha2VBcGlSZXF1ZXN0KHJldHJ5T2JqZWN0Lml0ZW0sIHJldHJ5T2JqZWN0LmNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy5vcHRpb25zLnJldHJ5SW50ZXJ2YWwsXG4gICAgKTtcbiAgfVxufTtcblxuLypcbiAqIF9kZXF1ZXVlUGVuZGluZ1JlcXVlc3QgLSBSZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIHBlbmRpbmcgcmVxdWVzdCBxdWV1ZSwgdGhpcyBxdWV1ZSBpcyB1c2VkIHRvXG4gKiAgIGVuYWJsZSB0byBmdW5jdGlvbmFsaXR5IG9mIHByb3ZpZGluZyBhIGNhbGxiYWNrIHRoYXQgY2xpZW50cyBjYW4gcGFzcyB0byBgd2FpdGAgdG8gYmUgbm90aWZpZWRcbiAqICAgd2hlbiB0aGUgcGVuZGluZyByZXF1ZXN0IHF1ZXVlIGhhcyBiZWVuIGVtcHRpZWQuIFRoaXMgbXVzdCBiZSBjYWxsZWQgd2hlbiB0aGUgQVBJIGZpbmlzaGVzXG4gKiAgIHByb2Nlc3NpbmcgdGhpcyBpdGVtLiBJZiBhIGB3YWl0YCBjYWxsYmFjayBpcyBjb25maWd1cmVkLCBpdCBpcyBjYWxsZWQgYnkgdGhpcyBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gaXRlbSAtIHRoZSBpdGVtIHByZXZpb3VzbHkgYWRkZWQgdG8gdGhlIHBlbmRpbmcgcmVxdWVzdCBxdWV1ZVxuICovXG5RdWV1ZS5wcm90b3R5cGUuX2RlcXVldWVQZW5kaW5nUmVxdWVzdCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBpZHggPSB0aGlzLnBlbmRpbmdSZXF1ZXN0cy5pbmRleE9mKGl0ZW0pO1xuICBpZiAoaWR4ICE9PSAtMSkge1xuICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLnNwbGljZShpZHgsIDEpO1xuICAgIHRoaXMuX21heWJlQ2FsbFdhaXQoKTtcbiAgfVxufTtcblxuUXVldWUucHJvdG90eXBlLl9tYXliZUxvZyA9IGZ1bmN0aW9uIChkYXRhLCBvcmlnaW5hbEVycm9yKSB7XG4gIGlmICh0aGlzLmxvZ2dlciAmJiB0aGlzLm9wdGlvbnMudmVyYm9zZSkge1xuICAgIHZhciBtZXNzYWdlID0gb3JpZ2luYWxFcnJvcjtcbiAgICBtZXNzYWdlID0gbWVzc2FnZSB8fCBfLmdldChkYXRhLCAnYm9keS50cmFjZS5leGNlcHRpb24ubWVzc2FnZScpO1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlIHx8IF8uZ2V0KGRhdGEsICdib2R5LnRyYWNlX2NoYWluLjAuZXhjZXB0aW9uLm1lc3NhZ2UnKTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IobWVzc2FnZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lc3NhZ2UgPSBfLmdldChkYXRhLCAnYm9keS5tZXNzYWdlLmJvZHknKTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5sb2dnZXIubG9nKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufTtcblxuUXVldWUucHJvdG90eXBlLl9tYXliZUNhbGxXYWl0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoXG4gICAgXy5pc0Z1bmN0aW9uKHRoaXMud2FpdENhbGxiYWNrKSAmJlxuICAgIHRoaXMucGVuZGluZ0l0ZW1zLmxlbmd0aCA9PT0gMCAmJlxuICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmxlbmd0aCA9PT0gMFxuICApIHtcbiAgICBpZiAodGhpcy53YWl0SW50ZXJ2YWxJRCkge1xuICAgICAgdGhpcy53YWl0SW50ZXJ2YWxJRCA9IGNsZWFySW50ZXJ2YWwodGhpcy53YWl0SW50ZXJ2YWxJRCk7XG4gICAgfVxuICAgIHRoaXMud2FpdENhbGxiYWNrKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBIYW5kbGVzIHRoZSBBUEkgcmVzcG9uc2UgZm9yIGFuIGl0ZW0gd2l0aCBhIHJlcGxheSBJRC5cbiAqIEJhc2VkIG9uIHRoZSBzdWNjZXNzIG9yIGZhaWx1cmUgc3RhdHVzIG9mIHRoZSByZXNwb25zZSxcbiAqIGl0IGVpdGhlciBzZW5kcyBvciBkaXNjYXJkcyB0aGUgYXNzb2NpYXRlZCBzZXNzaW9uIHJlcGxheS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVwbGF5SWQgLSBUaGUgSUQgb2YgdGhlIHJlcGxheSB0byBoYW5kbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSAtIFRoZSBBUEkgcmVzcG9uc2VcbiAqIEByZXR1cm5zIHtQcm9taXNlPGJvb2xlYW4+fSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cnVlIGlmIHJlcGxheSB3YXMgc2VudCBzdWNjZXNzZnVsbHksXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UgaWYgcmVwbGF5IHdhcyBkaXNjYXJkZWQgb3IgYW4gZXJyb3Igb2NjdXJyZWRcbiAqIEBwcml2YXRlXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5faGFuZGxlUmVwbGF5UmVzcG9uc2UgPSBhc3luYyBmdW5jdGlvbiAocmVwbGF5SWQsIHJlc3BvbnNlKSB7XG4gIGlmICghdGhpcy5yZXBsYXlNYXApIHtcbiAgICBjb25zb2xlLndhcm4oJ1F1ZXVlLl9oYW5kbGVSZXBsYXlSZXNwb25zZTogUmVwbGF5TWFwIG5vdCBhdmFpbGFibGUnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoIXJlcGxheUlkKSB7XG4gICAgY29uc29sZS53YXJuKCdRdWV1ZS5faGFuZGxlUmVwbGF5UmVzcG9uc2U6IE5vIHJlcGxheUlkIHByb3ZpZGVkJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBTdWNjZXNzIGNvbmRpdGlvbiBtaWdodCBuZWVkIGFkanVzdG1lbnQgYmFzZWQgb24gQVBJIHJlc3BvbnNlIHN0cnVjdHVyZVxuICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5lcnIgPT09IDApIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucmVwbGF5TWFwLnNlbmQocmVwbGF5SWQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXBsYXlNYXAuZGlzY2FyZChyZXBsYXlJZCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGhhbmRsaW5nIHJlcGxheSByZXNwb25zZTonLCBlcnJvcik7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWxpdHknKTtcblxuLypcbiAqIFJhdGVMaW1pdGVyIC0gYW4gb2JqZWN0IHRoYXQgZW5jYXBzdWxhdGVzIHRoZSBsb2dpYyBmb3IgY291bnRpbmcgaXRlbXMgc2VudCB0byBSb2xsYmFyXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgLSB0aGUgc2FtZSBvcHRpb25zIHRoYXQgYXJlIGFjY2VwdGVkIGJ5IGNvbmZpZ3VyZUdsb2JhbCBvZmZlcmVkIGFzIGEgY29udmVuaWVuY2VcbiAqL1xuZnVuY3Rpb24gUmF0ZUxpbWl0ZXIob3B0aW9ucykge1xuICB0aGlzLnN0YXJ0VGltZSA9IF8ubm93KCk7XG4gIHRoaXMuY291bnRlciA9IDA7XG4gIHRoaXMucGVyTWluQ291bnRlciA9IDA7XG4gIHRoaXMucGxhdGZvcm0gPSBudWxsO1xuICB0aGlzLnBsYXRmb3JtT3B0aW9ucyA9IHt9O1xuICB0aGlzLmNvbmZpZ3VyZUdsb2JhbChvcHRpb25zKTtcbn1cblxuUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MgPSB7XG4gIHN0YXJ0VGltZTogXy5ub3coKSxcbiAgbWF4SXRlbXM6IHVuZGVmaW5lZCxcbiAgaXRlbXNQZXJNaW51dGU6IHVuZGVmaW5lZCxcbn07XG5cbi8qXG4gKiBjb25maWd1cmVHbG9iYWwgLSBzZXQgdGhlIGdsb2JhbCByYXRlIGxpbWl0ZXIgb3B0aW9uc1xuICpcbiAqIEBwYXJhbSBvcHRpb25zIC0gT25seSB0aGUgZm9sbG93aW5nIHZhbHVlcyBhcmUgcmVjb2duaXplZDpcbiAqICAgIHN0YXJ0VGltZTogYSB0aW1lc3RhbXAgb2YgdGhlIGZvcm0gcmV0dXJuZWQgYnkgKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxuICogICAgbWF4SXRlbXM6IHRoZSBtYXhpbXVtIGl0ZW1zXG4gKiAgICBpdGVtc1Blck1pbnV0ZTogdGhlIG1heCBudW1iZXIgb2YgaXRlbXMgdG8gc2VuZCBpbiBhIGdpdmVuIG1pbnV0ZVxuICovXG5SYXRlTGltaXRlci5wcm90b3R5cGUuY29uZmlndXJlR2xvYmFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuc3RhcnRUaW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICBSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgfVxuICBpZiAob3B0aW9ucy5tYXhJdGVtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgUmF0ZUxpbWl0ZXIuZ2xvYmFsU2V0dGluZ3MubWF4SXRlbXMgPSBvcHRpb25zLm1heEl0ZW1zO1xuICB9XG4gIGlmIChvcHRpb25zLml0ZW1zUGVyTWludXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICBSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5pdGVtc1Blck1pbnV0ZSA9IG9wdGlvbnMuaXRlbXNQZXJNaW51dGU7XG4gIH1cbn07XG5cbi8qXG4gKiBzaG91bGRTZW5kIC0gZGV0ZXJtaW5lIGlmIHdlIHNob3VsZCBzZW5kIGEgZ2l2ZW4gaXRlbSBiYXNlZCBvbiByYXRlIGxpbWl0IHNldHRpbmdzXG4gKlxuICogQHBhcmFtIGl0ZW0gLSB0aGUgaXRlbSB3ZSBhcmUgYWJvdXQgdG8gc2VuZFxuICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gKiAgZXJyb3I6IChFcnJvcnxudWxsKVxuICogIHNob3VsZFNlbmQ6IGJvb2xcbiAqICBwYXlsb2FkOiAoT2JqZWN0fG51bGwpXG4gKiAgSWYgc2hvdWxkU2VuZCBpcyBmYWxzZSwgdGhlIGl0ZW0gcGFzc2VkIGFzIGEgcGFyYW1ldGVyIHNob3VsZCBub3QgYmUgc2VudCB0byBSb2xsYmFyLCBhbmRcbiAqICBleGFjdGx5IG9uZSBvZiBlcnJvciBvciBwYXlsb2FkIHdpbGwgYmUgbm9uLW51bGwuIElmIGVycm9yIGlzIG5vbi1udWxsLCB0aGUgcmV0dXJuZWQgRXJyb3Igd2lsbFxuICogIGRlc2NyaWJlIHRoZSBzaXR1YXRpb24sIGJ1dCBpdCBtZWFucyB0aGF0IHdlIHdlcmUgYWxyZWFkeSBvdmVyIGEgcmF0ZSBsaW1pdCAoZWl0aGVyIGdsb2JhbGx5IG9yXG4gKiAgcGVyIG1pbnV0ZSkgd2hlbiB0aGlzIGl0ZW0gd2FzIGNoZWNrZWQuIElmIGVycm9yIGlzIG51bGwsIGFuZCB0aGVyZWZvcmUgcGF5bG9hZCBpcyBub24tbnVsbCwgaXRcbiAqICBtZWFucyB0aGlzIGl0ZW0gcHV0IHVzIG92ZXIgdGhlIGdsb2JhbCByYXRlIGxpbWl0IGFuZCB0aGUgcGF5bG9hZCBzaG91bGQgYmUgc2VudCB0byBSb2xsYmFyIGluXG4gKiAgcGxhY2Ugb2YgdGhlIHBhc3NlZCBpbiBpdGVtLlxuICovXG5SYXRlTGltaXRlci5wcm90b3R5cGUuc2hvdWxkU2VuZCA9IGZ1bmN0aW9uIChpdGVtLCBub3cpIHtcbiAgbm93ID0gbm93IHx8IF8ubm93KCk7XG4gIHZhciBlbGFwc2VkVGltZSA9IG5vdyAtIHRoaXMuc3RhcnRUaW1lO1xuICBpZiAoZWxhcHNlZFRpbWUgPCAwIHx8IGVsYXBzZWRUaW1lID49IDYwMDAwKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBub3c7XG4gICAgdGhpcy5wZXJNaW5Db3VudGVyID0gMDtcbiAgfVxuXG4gIHZhciBnbG9iYWxSYXRlTGltaXQgPSBSYXRlTGltaXRlci5nbG9iYWxTZXR0aW5ncy5tYXhJdGVtcztcbiAgdmFyIGdsb2JhbFJhdGVMaW1pdFBlck1pbiA9IFJhdGVMaW1pdGVyLmdsb2JhbFNldHRpbmdzLml0ZW1zUGVyTWludXRlO1xuXG4gIGlmIChjaGVja1JhdGUoaXRlbSwgZ2xvYmFsUmF0ZUxpbWl0LCB0aGlzLmNvdW50ZXIpKSB7XG4gICAgcmV0dXJuIHNob3VsZFNlbmRWYWx1ZShcbiAgICAgIHRoaXMucGxhdGZvcm0sXG4gICAgICB0aGlzLnBsYXRmb3JtT3B0aW9ucyxcbiAgICAgIGdsb2JhbFJhdGVMaW1pdCArICcgbWF4IGl0ZW1zIHJlYWNoZWQnLFxuICAgICAgZmFsc2UsXG4gICAgKTtcbiAgfSBlbHNlIGlmIChjaGVja1JhdGUoaXRlbSwgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluLCB0aGlzLnBlck1pbkNvdW50ZXIpKSB7XG4gICAgcmV0dXJuIHNob3VsZFNlbmRWYWx1ZShcbiAgICAgIHRoaXMucGxhdGZvcm0sXG4gICAgICB0aGlzLnBsYXRmb3JtT3B0aW9ucyxcbiAgICAgIGdsb2JhbFJhdGVMaW1pdFBlck1pbiArICcgaXRlbXMgcGVyIG1pbnV0ZSByZWFjaGVkJyxcbiAgICAgIGZhbHNlLFxuICAgICk7XG4gIH1cbiAgdGhpcy5jb3VudGVyKys7XG4gIHRoaXMucGVyTWluQ291bnRlcisrO1xuXG4gIHZhciBzaG91bGRTZW5kID0gIWNoZWNrUmF0ZShpdGVtLCBnbG9iYWxSYXRlTGltaXQsIHRoaXMuY291bnRlcik7XG4gIHZhciBwZXJNaW51dGUgPSBzaG91bGRTZW5kO1xuICBzaG91bGRTZW5kID1cbiAgICBzaG91bGRTZW5kICYmICFjaGVja1JhdGUoaXRlbSwgZ2xvYmFsUmF0ZUxpbWl0UGVyTWluLCB0aGlzLnBlck1pbkNvdW50ZXIpO1xuICByZXR1cm4gc2hvdWxkU2VuZFZhbHVlKFxuICAgIHRoaXMucGxhdGZvcm0sXG4gICAgdGhpcy5wbGF0Zm9ybU9wdGlvbnMsXG4gICAgbnVsbCxcbiAgICBzaG91bGRTZW5kLFxuICAgIGdsb2JhbFJhdGVMaW1pdCxcbiAgICBnbG9iYWxSYXRlTGltaXRQZXJNaW4sXG4gICAgcGVyTWludXRlLFxuICApO1xufTtcblxuUmF0ZUxpbWl0ZXIucHJvdG90eXBlLnNldFBsYXRmb3JtT3B0aW9ucyA9IGZ1bmN0aW9uIChwbGF0Zm9ybSwgb3B0aW9ucykge1xuICB0aGlzLnBsYXRmb3JtID0gcGxhdGZvcm07XG4gIHRoaXMucGxhdGZvcm1PcHRpb25zID0gb3B0aW9ucztcbn07XG5cbi8qIEhlbHBlcnMgKi9cblxuZnVuY3Rpb24gY2hlY2tSYXRlKGl0ZW0sIGxpbWl0LCBjb3VudGVyKSB7XG4gIHJldHVybiAhaXRlbS5pZ25vcmVSYXRlTGltaXQgJiYgbGltaXQgPj0gMSAmJiBjb3VudGVyID4gbGltaXQ7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFNlbmRWYWx1ZShcbiAgcGxhdGZvcm0sXG4gIG9wdGlvbnMsXG4gIGVycm9yLFxuICBzaG91bGRTZW5kLFxuICBnbG9iYWxSYXRlTGltaXQsXG4gIGxpbWl0UGVyTWluLFxuICBwZXJNaW51dGUsXG4pIHtcbiAgdmFyIHBheWxvYWQgPSBudWxsO1xuICBpZiAoZXJyb3IpIHtcbiAgICBlcnJvciA9IG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbiAgaWYgKCFlcnJvciAmJiAhc2hvdWxkU2VuZCkge1xuICAgIHBheWxvYWQgPSByYXRlTGltaXRQYXlsb2FkKFxuICAgICAgcGxhdGZvcm0sXG4gICAgICBvcHRpb25zLFxuICAgICAgZ2xvYmFsUmF0ZUxpbWl0LFxuICAgICAgbGltaXRQZXJNaW4sXG4gICAgICBwZXJNaW51dGUsXG4gICAgKTtcbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHNob3VsZFNlbmQ6IHNob3VsZFNlbmQsIHBheWxvYWQ6IHBheWxvYWQgfTtcbn1cblxuZnVuY3Rpb24gcmF0ZUxpbWl0UGF5bG9hZChcbiAgcGxhdGZvcm0sXG4gIG9wdGlvbnMsXG4gIGdsb2JhbFJhdGVMaW1pdCxcbiAgbGltaXRQZXJNaW4sXG4gIHBlck1pbnV0ZSxcbikge1xuICB2YXIgZW52aXJvbm1lbnQgPVxuICAgIG9wdGlvbnMuZW52aXJvbm1lbnQgfHwgKG9wdGlvbnMucGF5bG9hZCAmJiBvcHRpb25zLnBheWxvYWQuZW52aXJvbm1lbnQpO1xuICB2YXIgbXNnO1xuICBpZiAocGVyTWludXRlKSB7XG4gICAgbXNnID0gJ2l0ZW0gcGVyIG1pbnV0ZSBsaW1pdCByZWFjaGVkLCBpZ25vcmluZyBlcnJvcnMgdW50aWwgdGltZW91dCc7XG4gIH0gZWxzZSB7XG4gICAgbXNnID0gJ21heEl0ZW1zIGhhcyBiZWVuIGhpdCwgaWdub3JpbmcgZXJyb3JzIHVudGlsIHJlc2V0Lic7XG4gIH1cbiAgdmFyIGl0ZW0gPSB7XG4gICAgYm9keToge1xuICAgICAgbWVzc2FnZToge1xuICAgICAgICBib2R5OiBtc2csXG4gICAgICAgIGV4dHJhOiB7XG4gICAgICAgICAgbWF4SXRlbXM6IGdsb2JhbFJhdGVMaW1pdCxcbiAgICAgICAgICBpdGVtc1Blck1pbnV0ZTogbGltaXRQZXJNaW4sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgbGFuZ3VhZ2U6ICdqYXZhc2NyaXB0JyxcbiAgICBlbnZpcm9ubWVudDogZW52aXJvbm1lbnQsXG4gICAgbm90aWZpZXI6IHtcbiAgICAgIHZlcnNpb246XG4gICAgICAgIChvcHRpb25zLm5vdGlmaWVyICYmIG9wdGlvbnMubm90aWZpZXIudmVyc2lvbikgfHwgb3B0aW9ucy52ZXJzaW9uLFxuICAgIH0sXG4gIH07XG4gIGlmIChwbGF0Zm9ybSA9PT0gJ2Jyb3dzZXInKSB7XG4gICAgaXRlbS5wbGF0Zm9ybSA9ICdicm93c2VyJztcbiAgICBpdGVtLmZyYW1ld29yayA9ICdicm93c2VyLWpzJztcbiAgICBpdGVtLm5vdGlmaWVyLm5hbWUgPSAncm9sbGJhci1icm93c2VyLWpzJztcbiAgfSBlbHNlIGlmIChwbGF0Zm9ybSA9PT0gJ3NlcnZlcicpIHtcbiAgICBpdGVtLmZyYW1ld29yayA9IG9wdGlvbnMuZnJhbWV3b3JrIHx8ICdub2RlLWpzJztcbiAgICBpdGVtLm5vdGlmaWVyLm5hbWUgPSBvcHRpb25zLm5vdGlmaWVyLm5hbWU7XG4gIH0gZWxzZSBpZiAocGxhdGZvcm0gPT09ICdyZWFjdC1uYXRpdmUnKSB7XG4gICAgaXRlbS5mcmFtZXdvcmsgPSBvcHRpb25zLmZyYW1ld29yayB8fCAncmVhY3QtbmF0aXZlJztcbiAgICBpdGVtLm5vdGlmaWVyLm5hbWUgPSBvcHRpb25zLm5vdGlmaWVyLm5hbWU7XG4gIH1cbiAgcmV0dXJuIGl0ZW07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmF0ZUxpbWl0ZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbnZhciBsb2dnZXIgPSB7XG4gIGVycm9yOiBjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSksXG4gIGluZm86IGNvbnNvbGUuaW5mby5iaW5kKGNvbnNvbGUpLFxuICBsb2c6IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSksXG59O1xuLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG5cbm1vZHVsZS5leHBvcnRzID0gbG9nZ2VyO1xuIiwidmFyIHBhY2thZ2VKc29uID0gcmVxdWlyZSgnLi4vLi4vcGFja2FnZS5qc29uJyk7XG52YXIgQ2xpZW50ID0gcmVxdWlyZSgnLi4vcm9sbGJhcicpO1xudmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG52YXIgQVBJID0gcmVxdWlyZSgnLi4vYXBpJyk7XG52YXIgbG9nZ2VyID0gcmVxdWlyZSgnLi9sb2dnZXInKTtcblxudmFyIFRyYW5zcG9ydCA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0Jyk7XG52YXIgdXJsbGliID0gcmVxdWlyZSgnLi4vYnJvd3Nlci91cmwnKTtcblxudmFyIFRlbGVtZXRlciA9IHJlcXVpcmUoJy4uL3RlbGVtZXRyeScpO1xudmFyIHRyYW5zZm9ybXMgPSByZXF1aXJlKCcuL3RyYW5zZm9ybXMnKTtcbnZhciBzaGFyZWRUcmFuc2Zvcm1zID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtcycpO1xudmFyIHNoYXJlZFByZWRpY2F0ZXMgPSByZXF1aXJlKCcuLi9wcmVkaWNhdGVzJyk7XG52YXIgdHJ1bmNhdGlvbiA9IHJlcXVpcmUoJy4uL3RydW5jYXRpb24nKTtcbnZhciBwb2x5ZmlsbEpTT04gPSByZXF1aXJlKCcuLi8uLi92ZW5kb3IvSlNPTi1qcy9qc29uMycpO1xuXG5mdW5jdGlvbiBSb2xsYmFyKG9wdGlvbnMsIGNsaWVudCkge1xuICBpZiAoXy5pc1R5cGUob3B0aW9ucywgJ3N0cmluZycpKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gICAgb3B0aW9ucy5hY2Nlc3NUb2tlbiA9IGFjY2Vzc1Rva2VuO1xuICB9XG4gIHRoaXMub3B0aW9ucyA9IF8uaGFuZGxlT3B0aW9ucyhSb2xsYmFyLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zLCBudWxsLCBsb2dnZXIpO1xuICB0aGlzLm9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zID0gb3B0aW9ucztcbiAgLy8gVGhpcyBtYWtlcyBubyBzZW5zZSBpbiBhIGxvbmcgcnVubmluZyBhcHBcbiAgZGVsZXRlIHRoaXMub3B0aW9ucy5tYXhJdGVtcztcbiAgdGhpcy5vcHRpb25zLmVudmlyb25tZW50ID0gdGhpcy5vcHRpb25zLmVudmlyb25tZW50IHx8ICd1bnNwZWNpZmllZCc7XG5cbiAgdmFyIHRyYW5zcG9ydCA9IG5ldyBUcmFuc3BvcnQodHJ1bmNhdGlvbik7XG4gIHZhciBhcGkgPSBuZXcgQVBJKHRoaXMub3B0aW9ucywgdHJhbnNwb3J0LCB1cmxsaWIsIHRydW5jYXRpb24pO1xuICB2YXIgdGVsZW1ldGVyID0gbmV3IFRlbGVtZXRlcih0aGlzLm9wdGlvbnMpO1xuICB0aGlzLmNsaWVudCA9XG4gICAgY2xpZW50IHx8IG5ldyBDbGllbnQodGhpcy5vcHRpb25zLCBhcGksIGxvZ2dlciwgdGVsZW1ldGVyLCBudWxsLCBudWxsLCAncmVhY3QtbmF0aXZlJyk7XG4gIGFkZFRyYW5zZm9ybXNUb05vdGlmaWVyKHRoaXMuY2xpZW50Lm5vdGlmaWVyKTtcbiAgYWRkUHJlZGljYXRlc1RvUXVldWUodGhpcy5jbGllbnQucXVldWUpO1xuICBfLnNldHVwSlNPTihwb2x5ZmlsbEpTT04pO1xufVxuXG52YXIgX2luc3RhbmNlID0gbnVsbDtcblJvbGxiYXIuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zLCBjbGllbnQpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuZ2xvYmFsKG9wdGlvbnMpLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuICBfaW5zdGFuY2UgPSBuZXcgUm9sbGJhcihvcHRpb25zLCBjbGllbnQpO1xuICByZXR1cm4gX2luc3RhbmNlO1xufTtcblxuZnVuY3Rpb24gaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKSB7XG4gIHZhciBtZXNzYWdlID0gJ1JvbGxiYXIgaXMgbm90IGluaXRpYWxpemVkJztcbiAgbG9nZ2VyLmVycm9yKG1lc3NhZ2UpO1xuICBpZiAobWF5YmVDYWxsYmFjaykge1xuICAgIG1heWJlQ2FsbGJhY2sobmV3IEVycm9yKG1lc3NhZ2UpKTtcbiAgfVxufVxuXG5Sb2xsYmFyLnByb3RvdHlwZS5nbG9iYWwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB0aGlzLmNsaWVudC5nbG9iYWwob3B0aW9ucyk7XG4gIHJldHVybiB0aGlzO1xufTtcblJvbGxiYXIuZ2xvYmFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuZ2xvYmFsKG9wdGlvbnMpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24gKG9wdGlvbnMsIHBheWxvYWREYXRhKSB7XG4gIHZhciBvbGRPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB2YXIgcGF5bG9hZCA9IHt9O1xuICBpZiAocGF5bG9hZERhdGEpIHtcbiAgICBwYXlsb2FkID0geyBwYXlsb2FkOiBwYXlsb2FkRGF0YSB9O1xuICB9XG4gIHRoaXMub3B0aW9ucyA9IF8uaGFuZGxlT3B0aW9ucyhvbGRPcHRpb25zLCBvcHRpb25zLCBwYXlsb2FkLCBsb2dnZXIpO1xuICB0aGlzLm9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zID0gXy5oYW5kbGVPcHRpb25zKFxuICAgIG9sZE9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zLFxuICAgIG9wdGlvbnMsXG4gICAgcGF5bG9hZCxcbiAgKTtcbiAgdGhpcy5jbGllbnQuY29uZmlndXJlKG9wdGlvbnMsIHBheWxvYWREYXRhKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuUm9sbGJhci5jb25maWd1cmUgPSBmdW5jdGlvbiAob3B0aW9ucywgcGF5bG9hZERhdGEpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuY29uZmlndXJlKG9wdGlvbnMsIHBheWxvYWREYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKCk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmxhc3RFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY2xpZW50Lmxhc3RFcnJvcjtcbn07XG5Sb2xsYmFyLmxhc3RFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UubGFzdEVycm9yKCk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQubG9nKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmxvZy5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50LmRlYnVnKGl0ZW0pO1xuICByZXR1cm4geyB1dWlkOiB1dWlkIH07XG59O1xuUm9sbGJhci5kZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2UuZGVidWcuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50LmluZm8oaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLmluZm8gPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmluZm8uYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50Lndhcm4oaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLndhcm4gPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLndhcm4uYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgdmFyIHV1aWQgPSBpdGVtLnV1aWQ7XG4gIHRoaXMuY2xpZW50Lndhcm5pbmcoaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLndhcm5pbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLndhcm5pbmcuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtYXliZUNhbGxiYWNrID0gX2dldEZpcnN0RnVuY3Rpb24oYXJndW1lbnRzKTtcbiAgICBoYW5kbGVVbmluaXRpYWxpemVkKG1heWJlQ2FsbGJhY2spO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLl9jcmVhdGVJdGVtKGFyZ3VtZW50cyk7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC5lcnJvcihpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblJvbGxiYXIuZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmVycm9yLmFwcGx5KF9pbnN0YW5jZSwgYXJndW1lbnRzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbWF5YmVDYWxsYmFjayA9IF9nZXRGaXJzdEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZChtYXliZUNhbGxiYWNrKTtcbiAgfVxufTtcblJvbGxiYXIucHJvdG90eXBlLl91bmNhdWdodEVycm9yID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaXRlbSA9IHRoaXMuX2NyZWF0ZUl0ZW0oYXJndW1lbnRzKTtcbiAgaXRlbS5faXNVbmNhdWdodCA9IHRydWU7XG4gIHZhciB1dWlkID0gaXRlbS51dWlkO1xuICB0aGlzLmNsaWVudC5lcnJvcihpdGVtKTtcbiAgcmV0dXJuIHsgdXVpZDogdXVpZCB9O1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY3JpdGljYWwgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpdGVtID0gdGhpcy5fY3JlYXRlSXRlbShhcmd1bWVudHMpO1xuICB2YXIgdXVpZCA9IGl0ZW0udXVpZDtcbiAgdGhpcy5jbGllbnQuY3JpdGljYWwoaXRlbSk7XG4gIHJldHVybiB7IHV1aWQ6IHV1aWQgfTtcbn07XG5Sb2xsYmFyLmNyaXRpY2FsID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5jcml0aWNhbC5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmJ1aWxkSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICByZXR1cm4gdGhpcy5jbGllbnQuYnVpbGRKc29uUGF5bG9hZChpdGVtKTtcbn07XG5Sb2xsYmFyLmJ1aWxkSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmJ1aWxkSnNvblBheWxvYWQuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUuc2VuZEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKGpzb25QYXlsb2FkKSB7XG4gIHJldHVybiB0aGlzLmNsaWVudC5zZW5kSnNvblBheWxvYWQoanNvblBheWxvYWQpO1xufTtcblJvbGxiYXIuc2VuZEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5zZW5kSnNvblBheWxvYWQuYXBwbHkoX2luc3RhbmNlLCBhcmd1bWVudHMpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuUm9sbGJhci5wcm90b3R5cGUud2FpdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLmNsaWVudC53YWl0KGNhbGxiYWNrKTtcbn07XG5Sb2xsYmFyLndhaXQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgaWYgKF9pbnN0YW5jZSkge1xuICAgIHJldHVybiBfaW5zdGFuY2Uud2FpdChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1heWJlQ2FsbGJhY2sgPSBfZ2V0Rmlyc3RGdW5jdGlvbihhcmd1bWVudHMpO1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQobWF5YmVDYWxsYmFjayk7XG4gIH1cbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNhcHR1cmVFdmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV2ZW50ID0gXy5jcmVhdGVUZWxlbWV0cnlFdmVudChhcmd1bWVudHMpO1xuICByZXR1cm4gdGhpcy5jbGllbnQuY2FwdHVyZUV2ZW50KGV2ZW50LnR5cGUsIGV2ZW50Lm1ldGFkYXRhLCBldmVudC5sZXZlbCk7XG59O1xuUm9sbGJhci5jYXB0dXJlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChfaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gX2luc3RhbmNlLmNhcHR1cmVFdmVudC5hcHBseShfaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5zZXRQZXJzb24gPSBmdW5jdGlvbiAocGVyc29uSW5mbykge1xuICB0aGlzLmNvbmZpZ3VyZSh7fSwgeyBwZXJzb246IHBlcnNvbkluZm8gfSk7XG59O1xuUm9sbGJhci5zZXRQZXJzb24gPSBmdW5jdGlvbiAocGVyc29uSW5mbykge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5zZXRQZXJzb24ocGVyc29uSW5mbyk7XG4gIH0gZWxzZSB7XG4gICAgaGFuZGxlVW5pbml0aWFsaXplZCgpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jbGVhclBlcnNvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jb25maWd1cmUoe30sIHsgcGVyc29uOiB7fSB9KTtcbn07XG5Sb2xsYmFyLmNsZWFyUGVyc29uID0gZnVuY3Rpb24gKCkge1xuICBpZiAoX2luc3RhbmNlKSB7XG4gICAgcmV0dXJuIF9pbnN0YW5jZS5jbGVhclBlcnNvbigpO1xuICB9IGVsc2Uge1xuICAgIGhhbmRsZVVuaW5pdGlhbGl6ZWQoKTtcbiAgfVxufTtcblxuLyoqIEludGVybmFsICoqL1xuZnVuY3Rpb24gYWRkVHJhbnNmb3Jtc1RvTm90aWZpZXIobm90aWZpZXIpIHtcbiAgbm90aWZpZXJcbiAgICAuYWRkVHJhbnNmb3JtKHRyYW5zZm9ybXMuYmFzZURhdGEpXG4gICAgLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm1zLmhhbmRsZUl0ZW1XaXRoRXJyb3IpXG4gICAgLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm1zLmFkZEJvZHkpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLmFkZE1lc3NhZ2VXaXRoRXJyb3IpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLmFkZFRlbGVtZXRyeURhdGEpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLmFkZENvbmZpZ1RvUGF5bG9hZClcbiAgICAuYWRkVHJhbnNmb3JtKHRyYW5zZm9ybXMuc2NydWJQYXlsb2FkKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRQYXlsb2FkT3B0aW9ucylcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMudXNlclRyYW5zZm9ybShsb2dnZXIpKVxuICAgIC5hZGRUcmFuc2Zvcm0oc2hhcmVkVHJhbnNmb3Jtcy5hZGRDb25maWd1cmVkT3B0aW9ucylcbiAgICAuYWRkVHJhbnNmb3JtKHNoYXJlZFRyYW5zZm9ybXMuYWRkRGlhZ25vc3RpY0tleXMpXG4gICAgLmFkZFRyYW5zZm9ybShzaGFyZWRUcmFuc2Zvcm1zLml0ZW1Ub1BheWxvYWQpO1xufVxuXG5mdW5jdGlvbiBhZGRQcmVkaWNhdGVzVG9RdWV1ZShxdWV1ZSkge1xuICBxdWV1ZVxuICAgIC5hZGRQcmVkaWNhdGUoc2hhcmVkUHJlZGljYXRlcy5jaGVja0xldmVsKVxuICAgIC5hZGRQcmVkaWNhdGUoc2hhcmVkUHJlZGljYXRlcy51c2VyQ2hlY2tJZ25vcmUobG9nZ2VyKSk7XG59XG5cblJvbGxiYXIucHJvdG90eXBlLl9jcmVhdGVJdGVtID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgcmV0dXJuIF8uY3JlYXRlSXRlbShhcmdzLCBsb2dnZXIsIHRoaXMpO1xufTtcblxuZnVuY3Rpb24gX2dldEZpcnN0RnVuY3Rpb24oYXJncykge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oYXJnc1tpXSkpIHtcbiAgICAgIHJldHVybiBhcmdzW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5Sb2xsYmFyLmRlZmF1bHRPcHRpb25zID0ge1xuICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JyxcbiAgcGxhdGZvcm06ICdjbGllbnQnLFxuICBmcmFtZXdvcms6ICdyZWFjdC1uYXRpdmUnLFxuICBzaG93UmVwb3J0ZWRNZXNzYWdlVHJhY2VzOiBmYWxzZSxcbiAgbm90aWZpZXI6IHtcbiAgICBuYW1lOiAncm9sbGJhci1yZWFjdC1uYXRpdmUnLFxuICAgIHZlcnNpb246IHBhY2thZ2VKc29uLnZlcnNpb24sXG4gIH0sXG4gIHNjcnViSGVhZGVyczogcGFja2FnZUpzb24uZGVmYXVsdHMuc2VydmVyLnNjcnViSGVhZGVycyxcbiAgc2NydWJGaWVsZHM6IHBhY2thZ2VKc29uLmRlZmF1bHRzLnNlcnZlci5zY3J1YkZpZWxkcyxcbiAgcmVwb3J0TGV2ZWw6IHBhY2thZ2VKc29uLmRlZmF1bHRzLnJlcG9ydExldmVsLFxuICByZXdyaXRlRmlsZW5hbWVQYXR0ZXJuczpcbiAgICBwYWNrYWdlSnNvbi5kZWZhdWx0cy5yZWFjdE5hdGl2ZS5yZXdyaXRlRmlsZW5hbWVQYXR0ZXJucyxcbiAgdmVyYm9zZTogZmFsc2UsXG4gIGVuYWJsZWQ6IHRydWUsXG4gIHRyYW5zbWl0OiB0cnVlLFxuICBzZW5kQ29uZmlnOiBmYWxzZSxcbiAgaW5jbHVkZUl0ZW1zSW5UZWxlbWV0cnk6IHRydWUsXG4gIGlnbm9yZUR1cGxpY2F0ZUVycm9yczogdHJ1ZSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUm9sbGJhcjtcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xudmFyIHNjcnViID0gcmVxdWlyZSgnLi4vc2NydWInKTtcbnZhciBlcnJvclBhcnNlciA9IHJlcXVpcmUoJy4uL2Vycm9yUGFyc2VyJyk7XG5cbmZ1bmN0aW9uIGJhc2VEYXRhKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBlbnZpcm9ubWVudCA9XG4gICAgKG9wdGlvbnMucGF5bG9hZCAmJiBvcHRpb25zLnBheWxvYWQuZW52aXJvbm1lbnQpIHx8IG9wdGlvbnMuZW52aXJvbm1lbnQ7XG4gIHZhciBkYXRhID0ge1xuICAgIHRpbWVzdGFtcDogTWF0aC5yb3VuZChpdGVtLnRpbWVzdGFtcCAvIDEwMDApLFxuICAgIGVudmlyb25tZW50OiBpdGVtLmVudmlyb25tZW50IHx8IGVudmlyb25tZW50LFxuICAgIGxldmVsOiBpdGVtLmxldmVsIHx8ICdlcnJvcicsXG4gICAgcGxhdGZvcm06IG9wdGlvbnMucGxhdGZvcm0gfHwgJ2NsaWVudCcsXG4gICAgbGFuZ3VhZ2U6ICdqYXZhc2NyaXB0JyxcbiAgICBmcmFtZXdvcms6IGl0ZW0uZnJhbWV3b3JrIHx8IG9wdGlvbnMuZnJhbWV3b3JrLFxuICAgIHV1aWQ6IGl0ZW0udXVpZCxcbiAgICBub3RpZmllcjogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvcHRpb25zLm5vdGlmaWVyKSksXG4gICAgY3VzdG9tOiBpdGVtLmN1c3RvbSxcbiAgfTtcblxuICBpZiAob3B0aW9ucy5jb2RlVmVyc2lvbikge1xuICAgIGRhdGEuY29kZV92ZXJzaW9uID0gb3B0aW9ucy5jb2RlVmVyc2lvbjtcbiAgfSBlbHNlIGlmIChvcHRpb25zLmNvZGVfdmVyc2lvbikge1xuICAgIGRhdGEuY29kZV92ZXJzaW9uID0gb3B0aW9ucy5jb2RlX3ZlcnNpb247XG4gIH1cblxuICB2YXIgcHJvcHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhpdGVtLmN1c3RvbSB8fCB7fSk7XG4gIHByb3BzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGRhdGFbbmFtZV0gPSBpdGVtLmN1c3RvbVtuYW1lXTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0ZW0uZGF0YSA9IGRhdGE7XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRNZXNzYWdlRGF0YShpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG4gIGl0ZW0uZGF0YS5ib2R5ID0gaXRlbS5kYXRhLmJvZHkgfHwge307XG4gIHZhciBtZXNzYWdlID0gaXRlbS5tZXNzYWdlIHx8ICdJdGVtIHNlbnQgd2l0aCBudWxsIG9yIG1pc3NpbmcgYXJndW1lbnRzLic7XG4gIGl0ZW0uZGF0YS5ib2R5Lm1lc3NhZ2UgPSB7XG4gICAgYm9keTogbWVzc2FnZSxcbiAgfTtcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yRGF0YShpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICBpZiAoaXRlbS5zdGFja0luZm8pIHtcbiAgICBpdGVtLmRhdGEgPSBpdGVtLmRhdGEgfHwge307XG4gICAgaXRlbS5kYXRhLmJvZHkgPSBpdGVtLmRhdGEuYm9keSB8fCB7fTtcbiAgICBpdGVtLmRhdGEuYm9keS50cmFjZSA9IGl0ZW0uc3RhY2tJbmZvO1xuICB9XG4gIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xufVxuXG5mdW5jdGlvbiBhZGRCb2R5KGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIGlmIChpdGVtLnN0YWNrSW5mbykge1xuICAgIGFkZEVycm9yRGF0YShpdGVtLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgYWRkTWVzc2FnZURhdGEoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUl0ZW1XaXRoRXJyb3IoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKCFpdGVtLmVycikge1xuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFkZEVycm9yQ29udGV4dCkge1xuICAgIF8uYWRkRXJyb3JDb250ZXh0KGl0ZW0sIFtpdGVtLmVycl0pO1xuICB9XG5cbiAgdmFyIGVyciA9IGl0ZW0uZXJyO1xuICB2YXIgcGFyc2VkRXJyb3IgPSBlcnJvclBhcnNlci5wYXJzZShlcnIpO1xuICB2YXIgZ3Vlc3MgPSBlcnJvclBhcnNlci5ndWVzc0Vycm9yQ2xhc3MocGFyc2VkRXJyb3IubWVzc2FnZSk7XG4gIHZhciBtZXNzYWdlID0gZ3Vlc3NbMV07XG4gIHZhciBzdGFja0luZm8gPSB7XG4gICAgZnJhbWVzOiBfYnVpbGRGcmFtZXMocGFyc2VkRXJyb3Iuc3RhY2ssIG9wdGlvbnMpLFxuICAgIGV4Y2VwdGlvbjoge1xuICAgICAgY2xhc3M6IF9lcnJvckNsYXNzKHBhcnNlZEVycm9yLm5hbWUsIGd1ZXNzWzBdLCBvcHRpb25zKSxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgfSxcbiAgfTtcbiAgaWYgKGVyci5kZXNjcmlwdGlvbikge1xuICAgIHN0YWNrSW5mby5leGNlcHRpb24uZGVzY3JpcHRpb24gPSBTdHJpbmcoZXJyLmRlc2NyaXB0aW9uKTtcbiAgfVxuICBpdGVtLnN0YWNrSW5mbyA9IHN0YWNrSW5mbztcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIHNjcnViUGF5bG9hZChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgc2NydWJIZWFkZXJzID0gb3B0aW9ucy5zY3J1YkhlYWRlcnMgfHwgW107XG4gIHZhciBzY3J1YkZpZWxkcyA9IG9wdGlvbnMuc2NydWJGaWVsZHMgfHwgW107XG4gIHZhciBzY3J1YlBhdGhzID0gb3B0aW9ucy5zY3J1YlBhdGhzIHx8IFtdO1xuICBzY3J1YkZpZWxkcyA9IHNjcnViSGVhZGVycy5jb25jYXQoc2NydWJGaWVsZHMpO1xuICBpdGVtLmRhdGEgPSBzY3J1YihpdGVtLmRhdGEsIHNjcnViRmllbGRzLCBzY3J1YlBhdGhzKTtcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbi8qKiBIZWxwZXJzICoqL1xuXG5mdW5jdGlvbiBfZXJyb3JDbGFzcyhuYW1lLCBndWVzcywgb3B0aW9ucykge1xuICBpZiAobmFtZSkge1xuICAgIHJldHVybiBuYW1lO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMuZ3Vlc3NFcnJvckNsYXNzKSB7XG4gICAgcmV0dXJuIGd1ZXNzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPHVua25vd24+JztcbiAgfVxufVxuXG5mdW5jdGlvbiBfYnVpbGRGcmFtZXMoc3RhY2ssIG9wdGlvbnMpIHtcbiAgaWYgKCFzdGFjaykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBmcmFtZXMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7ICsraSkge1xuICAgIHZhciBzdGFja0ZyYW1lID0gc3RhY2tbaV07XG4gICAgdmFyIGZpbGVuYW1lID0gc3RhY2tGcmFtZS51cmwgPyBfLnNhbml0aXplVXJsKHN0YWNrRnJhbWUudXJsKSA6ICc8dW5rbm93bj4nO1xuICAgIHZhciBmcmFtZSA9IHtcbiAgICAgIGZpbGVuYW1lOiBfcmV3cml0ZUZpbGVuYW1lKGZpbGVuYW1lLCBvcHRpb25zKSxcbiAgICAgIGxpbmVubzogc3RhY2tGcmFtZS5saW5lIHx8IG51bGwsXG4gICAgICBtZXRob2Q6XG4gICAgICAgICFzdGFja0ZyYW1lLmZ1bmMgfHwgc3RhY2tGcmFtZS5mdW5jID09PSAnPydcbiAgICAgICAgICA/ICdbYW5vbnltb3VzXSdcbiAgICAgICAgICA6IHN0YWNrRnJhbWUuZnVuYyxcbiAgICAgIGNvbG5vOiBzdGFja0ZyYW1lLmNvbHVtbixcbiAgICB9O1xuICAgIGZyYW1lcy5wdXNoKGZyYW1lKTtcbiAgfVxuICByZXR1cm4gZnJhbWVzO1xufVxuXG5mdW5jdGlvbiBfcmV3cml0ZUZpbGVuYW1lKGZpbGVuYW1lLCBvcHRpb25zKSB7XG4gIHZhciBtYXRjaCA9IGZpbGVuYW1lICYmIGZpbGVuYW1lLm1hdGNoICYmIF9tYXRjaEZpbGVuYW1lKGZpbGVuYW1lLCBvcHRpb25zKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuICdodHRwOi8vcmVhY3RuYXRpdmVob3N0LycgKyBtYXRjaDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2h0dHA6Ly9yZWFjdG5hdGl2ZWhvc3QvJyArIGZpbGVuYW1lO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9tYXRjaEZpbGVuYW1lKGZpbGVuYW1lLCBvcHRpb25zKSB7XG4gIHZhciBwYXR0ZXJucyA9IG9wdGlvbnMucmV3cml0ZUZpbGVuYW1lUGF0dGVybnMgfHwgW107XG4gIHZhciBsZW5ndGggPSBwYXR0ZXJucy5sZW5ndGggfHwgMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHBhdHRlcm4gPSBuZXcgUmVnRXhwKHBhdHRlcm5zW2ldKTtcbiAgICB2YXIgbWF0Y2ggPSBmaWxlbmFtZS5tYXRjaChwYXR0ZXJuKTtcbiAgICBpZiAobWF0Y2ggJiYgbWF0Y2hbMV0pIHtcbiAgICAgIHJldHVybiBtYXRjaFsxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiYXNlRGF0YTogYmFzZURhdGEsXG4gIGhhbmRsZUl0ZW1XaXRoRXJyb3I6IGhhbmRsZUl0ZW1XaXRoRXJyb3IsXG4gIGFkZEJvZHk6IGFkZEJvZHksXG4gIHNjcnViUGF5bG9hZDogc2NydWJQYXlsb2FkLFxuICBfbWF0Y2hGaWxlbmFtZTogX21hdGNoRmlsZW5hbWUsIC8vIHRvIGVuYWJsZSB1bml0IHRlc3Rcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWxpdHknKTtcbnZhciBsb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcicpO1xuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyLycpLkJ1ZmZlcjtcblxuZnVuY3Rpb24gVHJhbnNwb3J0KHRydW5jYXRpb24pIHtcbiAgdGhpcy5yYXRlTGltaXRFeHBpcmVzID0gMDtcbiAgdGhpcy50cnVuY2F0aW9uID0gdHJ1bmNhdGlvbjtcbn1cblxuVHJhbnNwb3J0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgaWYgKCFjYWxsYmFjayB8fCAhXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIF8uYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcyk7XG4gIHZhciBoZWFkZXJzID0gX2hlYWRlcnMoYWNjZXNzVG9rZW4sIG9wdGlvbnMpO1xuICBmZXRjaChfLmZvcm1hdFVybChvcHRpb25zKSwge1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgaGVhZGVyczogaGVhZGVycyxcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgX2hhbmRsZVJlc3BvbnNlKHJlc3AsIGNhbGxiYWNrKTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH0pO1xufTtcblxuVHJhbnNwb3J0LnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24gKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKCFwYXlsb2FkKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignQ2Fubm90IHNlbmQgZW1wdHkgcmVxdWVzdCcpKTtcbiAgfVxuXG4gIHZhciBzdHJpbmdpZnlSZXN1bHQ7XG4gIGlmICh0aGlzLnRydW5jYXRpb24pIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSB0aGlzLnRydW5jYXRpb24udHJ1bmNhdGUocGF5bG9hZCk7XG4gIH0gZWxzZSB7XG4gICAgc3RyaW5naWZ5UmVzdWx0ID0gXy5zdHJpbmdpZnkocGF5bG9hZCk7XG4gIH1cbiAgaWYgKHN0cmluZ2lmeVJlc3VsdC5lcnJvcikge1xuICAgIGxvZ2dlci5lcnJvcignUHJvYmxlbSBzdHJpbmdpZnlpbmcgcGF5bG9hZC4gR2l2aW5nIHVwJyk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKHN0cmluZ2lmeVJlc3VsdC5lcnJvcik7XG4gIH1cbiAgdmFyIHdyaXRlRGF0YSA9IHN0cmluZ2lmeVJlc3VsdC52YWx1ZTtcbiAgdmFyIGhlYWRlcnMgPSBfaGVhZGVycyhhY2Nlc3NUb2tlbiwgb3B0aW9ucywgd3JpdGVEYXRhKTtcblxuICBfbWFrZVJlcXVlc3QoaGVhZGVycywgb3B0aW9ucywgd3JpdGVEYXRhLCBjYWxsYmFjayk7XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLnBvc3RKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChcbiAgYWNjZXNzVG9rZW4sXG4gIG9wdGlvbnMsXG4gIGpzb25QYXlsb2FkLFxuICBjYWxsYmFjayxcbikge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKCFqc29uUGF5bG9hZCkge1xuICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ0Nhbm5vdCBzZW5kIGVtcHR5IHJlcXVlc3QnKSk7XG4gIH1cbiAgdmFyIGhlYWRlcnMgPSBfaGVhZGVycyhhY2Nlc3NUb2tlbiwgb3B0aW9ucywganNvblBheWxvYWQpO1xuXG4gIF9tYWtlUmVxdWVzdChoZWFkZXJzLCBvcHRpb25zLCBqc29uUGF5bG9hZCwgY2FsbGJhY2spO1xufTtcblxuLyoqIEhlbHBlcnMgKiovXG5mdW5jdGlvbiBfbWFrZVJlcXVlc3QoaGVhZGVycywgb3B0aW9ucywgZGF0YSwgY2FsbGJhY2spIHtcbiAgdmFyIHVybCA9IF8uZm9ybWF0VXJsKG9wdGlvbnMpO1xuICBmZXRjaCh1cmwsIHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgIGJvZHk6IGRhdGEsXG4gIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcbiAgICAgIHJldHVybiByZXNwLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBfaGFuZGxlUmVzcG9uc2UoZGF0YSwgX3dyYXBQb3N0Q2FsbGJhY2soY2FsbGJhY2spKTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjYWxsYmFjayhlcnIpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBfaGVhZGVycyhhY2Nlc3NUb2tlbiwgb3B0aW9ucywgZGF0YSkge1xuICB2YXIgaGVhZGVycyA9IChvcHRpb25zICYmIG9wdGlvbnMuaGVhZGVycykgfHwge307XG4gIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICBpZiAoZGF0YSkge1xuICAgIHRyeSB7XG4gICAgICBoZWFkZXJzWydDb250ZW50LUxlbmd0aCddID0gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSwgJ3V0ZjgnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ0NvdWxkIG5vdCBnZXQgdGhlIGNvbnRlbnQgbGVuZ3RoIG9mIHRoZSBkYXRhJyk7XG4gICAgfVxuICB9XG4gIGhlYWRlcnNbJ1gtUm9sbGJhci1BY2Nlc3MtVG9rZW4nXSA9IGFjY2Vzc1Rva2VuO1xuICByZXR1cm4gaGVhZGVycztcbn1cblxuZnVuY3Rpb24gX2hhbmRsZVJlc3BvbnNlKGRhdGEsIGNhbGxiYWNrKSB7XG4gIGlmIChkYXRhLmVycikge1xuICAgIGxvZ2dlci5lcnJvcignUmVjZWl2ZWQgZXJyb3I6ICcgKyBkYXRhLm1lc3NhZ2UpO1xuICAgIHJldHVybiBjYWxsYmFjayhcbiAgICAgIG5ldyBFcnJvcignQXBpIGVycm9yOiAnICsgKGRhdGEubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicpKSxcbiAgICApO1xuICB9XG5cbiAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIF93cmFwUG9zdENhbGxiYWNrKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgfVxuICAgIGlmIChkYXRhLnJlc3VsdCAmJiBkYXRhLnJlc3VsdC51dWlkKSB7XG4gICAgICBsb2dnZXIubG9nKFxuICAgICAgICBbXG4gICAgICAgICAgJ1N1Y2Nlc3NmdWwgYXBpIHJlc3BvbnNlLicsXG4gICAgICAgICAgJyBMaW5rOiBodHRwczovL3JvbGxiYXIuY29tL29jY3VycmVuY2UvdXVpZC8/dXVpZD0nICtcbiAgICAgICAgICAgIGRhdGEucmVzdWx0LnV1aWQsXG4gICAgICAgIF0uam9pbignJyksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dnZXIubG9nKCdTdWNjZXNzZnVsIGFwaSByZXNwb25zZScpO1xuICAgIH1cbiAgICBjYWxsYmFjayhudWxsLCBkYXRhLnJlc3VsdCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNwb3J0O1xuIiwiY29uc3QgUmF0ZUxpbWl0ZXIgPSByZXF1aXJlKCcuL3JhdGVMaW1pdGVyJyk7XG5jb25zdCBRdWV1ZSA9IHJlcXVpcmUoJy4vcXVldWUnKTtcbmNvbnN0IE5vdGlmaWVyID0gcmVxdWlyZSgnLi9ub3RpZmllcicpO1xuY29uc3QgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG4vKlxuICogUm9sbGJhciAtIHRoZSBpbnRlcmZhY2UgdG8gUm9sbGJhclxuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcGFyYW0gYXBpXG4gKiBAcGFyYW0gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIFJvbGxiYXIob3B0aW9ucywgYXBpLCBsb2dnZXIsIHRlbGVtZXRlciwgdHJhY2luZywgcmVwbGF5TWFwLCBwbGF0Zm9ybSkge1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9wdGlvbnMpO1xuICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgUm9sbGJhci5yYXRlTGltaXRlci5jb25maWd1cmVHbG9iYWwodGhpcy5vcHRpb25zKTtcbiAgUm9sbGJhci5yYXRlTGltaXRlci5zZXRQbGF0Zm9ybU9wdGlvbnMocGxhdGZvcm0sIHRoaXMub3B0aW9ucyk7XG4gIHRoaXMuYXBpID0gYXBpO1xuICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKFJvbGxiYXIucmF0ZUxpbWl0ZXIsIGFwaSwgbG9nZ2VyLCB0aGlzLm9wdGlvbnMsIHJlcGxheU1hcCk7XG5cbiAgdGhpcy50cmFjaW5nID0gdHJhY2luZztcblxuICAvLyBMZWdhY3kgT3BlblRyYWNpbmcgc3VwcG9ydFxuICAvLyBUaGlzIG11c3QgaGFwcGVuIGJlZm9yZSB0aGUgTm90aWZpZXIgaXMgY3JlYXRlZFxuICB2YXIgdHJhY2VyID0gdGhpcy5vcHRpb25zLnRyYWNlciB8fCBudWxsO1xuICBpZiAodmFsaWRhdGVUcmFjZXIodHJhY2VyKSkge1xuICAgIHRoaXMudHJhY2VyID0gdHJhY2VyO1xuICAgIC8vIHNldCB0byBhIHN0cmluZyBmb3IgYXBpIHJlc3BvbnNlIHNlcmlhbGl6YXRpb25cbiAgICB0aGlzLm9wdGlvbnMudHJhY2VyID0gJ29wZW50cmFjaW5nLXRyYWNlci1lbmFibGVkJztcbiAgICB0aGlzLm9wdGlvbnMuX2NvbmZpZ3VyZWRPcHRpb25zLnRyYWNlciA9ICdvcGVudHJhY2luZy10cmFjZXItZW5hYmxlZCc7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50cmFjZXIgPSBudWxsO1xuICB9XG5cbiAgdGhpcy5ub3RpZmllciA9IG5ldyBOb3RpZmllcih0aGlzLnF1ZXVlLCB0aGlzLm9wdGlvbnMpO1xuICB0aGlzLnRlbGVtZXRlciA9IHRlbGVtZXRlcjtcbiAgc2V0U3RhY2tUcmFjZUxpbWl0KG9wdGlvbnMpO1xuICB0aGlzLmxhc3RFcnJvciA9IG51bGw7XG4gIHRoaXMubGFzdEVycm9ySGFzaCA9ICdub25lJztcbn1cblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBtYXhJdGVtczogMCxcbiAgaXRlbXNQZXJNaW51dGU6IDYwLFxufTtcblxuUm9sbGJhci5yYXRlTGltaXRlciA9IG5ldyBSYXRlTGltaXRlcihkZWZhdWx0T3B0aW9ucyk7XG5cblJvbGxiYXIucHJvdG90eXBlLmdsb2JhbCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIFJvbGxiYXIucmF0ZUxpbWl0ZXIuY29uZmlndXJlR2xvYmFsKG9wdGlvbnMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBwYXlsb2FkRGF0YSkge1xuICB2YXIgb2xkT3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdmFyIHBheWxvYWQgPSB7fTtcbiAgaWYgKHBheWxvYWREYXRhKSB7XG4gICAgcGF5bG9hZCA9IHsgcGF5bG9hZDogcGF5bG9hZERhdGEgfTtcbiAgfVxuXG4gIHRoaXMub3B0aW9ucyA9IF8ubWVyZ2Uob2xkT3B0aW9ucywgb3B0aW9ucywgcGF5bG9hZCk7XG5cbiAgLy8gTGVnYWN5IE9wZW5UcmFjaW5nIHN1cHBvcnRcbiAgLy8gVGhpcyBtdXN0IGhhcHBlbiBiZWZvcmUgdGhlIE5vdGlmaWVyIGlzIGNvbmZpZ3VyZWRcbiAgdmFyIHRyYWNlciA9IHRoaXMub3B0aW9ucy50cmFjZXIgfHwgbnVsbDtcbiAgaWYgKHZhbGlkYXRlVHJhY2VyKHRyYWNlcikpIHtcbiAgICB0aGlzLnRyYWNlciA9IHRyYWNlcjtcbiAgICAvLyBzZXQgdG8gYSBzdHJpbmcgZm9yIGFwaSByZXNwb25zZSBzZXJpYWxpemF0aW9uXG4gICAgdGhpcy5vcHRpb25zLnRyYWNlciA9ICdvcGVudHJhY2luZy10cmFjZXItZW5hYmxlZCc7XG4gICAgdGhpcy5vcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucy50cmFjZXIgPSAnb3BlbnRyYWNpbmctdHJhY2VyLWVuYWJsZWQnO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudHJhY2VyID0gbnVsbDtcbiAgfVxuXG4gIHRoaXMubm90aWZpZXIgJiYgdGhpcy5ub3RpZmllci5jb25maWd1cmUodGhpcy5vcHRpb25zKTtcbiAgdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY29uZmlndXJlKHRoaXMub3B0aW9ucyk7XG4gIHNldFN0YWNrVHJhY2VMaW1pdChvcHRpb25zKTtcbiAgdGhpcy5nbG9iYWwodGhpcy5vcHRpb25zKTtcblxuICBpZiAodmFsaWRhdGVUcmFjZXIob3B0aW9ucy50cmFjZXIpKSB7XG4gICAgdGhpcy50cmFjZXIgPSBvcHRpb25zLnRyYWNlcjtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGxldmVsID0gdGhpcy5fZGVmYXVsdExvZ0xldmVsKCk7XG4gIHJldHVybiB0aGlzLl9sb2cobGV2ZWwsIGl0ZW0pO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB0aGlzLl9sb2coJ2RlYnVnJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5pbmZvID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCdpbmZvJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCd3YXJuaW5nJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS53YXJuaW5nID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCd3YXJuaW5nJywgaXRlbSk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHRoaXMuX2xvZygnZXJyb3InLCBpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmNyaXRpY2FsID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdGhpcy5fbG9nKCdjcml0aWNhbCcsIGl0ZW0pO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUud2FpdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLnF1ZXVlLndhaXQoY2FsbGJhY2spO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY2FwdHVyZUV2ZW50ID0gZnVuY3Rpb24gKHR5cGUsIG1ldGFkYXRhLCBsZXZlbCkge1xuICByZXR1cm4gdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZUV2ZW50KHR5cGUsIG1ldGFkYXRhLCBsZXZlbCk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5jYXB0dXJlRG9tQ29udGVudExvYWRlZCA9IGZ1bmN0aW9uICh0cykge1xuICByZXR1cm4gdGhpcy50ZWxlbWV0ZXIgJiYgdGhpcy50ZWxlbWV0ZXIuY2FwdHVyZURvbUNvbnRlbnRMb2FkZWQodHMpO1xufTtcblxuUm9sbGJhci5wcm90b3R5cGUuY2FwdHVyZUxvYWQgPSBmdW5jdGlvbiAodHMpIHtcbiAgcmV0dXJuIHRoaXMudGVsZW1ldGVyICYmIHRoaXMudGVsZW1ldGVyLmNhcHR1cmVMb2FkKHRzKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLmJ1aWxkSnNvblBheWxvYWQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICByZXR1cm4gdGhpcy5hcGkuYnVpbGRKc29uUGF5bG9hZChpdGVtKTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLnNlbmRKc29uUGF5bG9hZCA9IGZ1bmN0aW9uIChqc29uUGF5bG9hZCkge1xuICB0aGlzLmFwaS5wb3N0SnNvblBheWxvYWQoanNvblBheWxvYWQpO1xufTtcblxuLyogSW50ZXJuYWwgKi9cblxuUm9sbGJhci5wcm90b3R5cGUuX2xvZyA9IGZ1bmN0aW9uIChkZWZhdWx0TGV2ZWwsIGl0ZW0pIHtcbiAgdmFyIGNhbGxiYWNrO1xuICBpZiAoaXRlbS5jYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gaXRlbS5jYWxsYmFjaztcbiAgICBkZWxldGUgaXRlbS5jYWxsYmFjaztcbiAgfVxuICBpZiAodGhpcy5vcHRpb25zLmlnbm9yZUR1cGxpY2F0ZUVycm9ycyAmJiB0aGlzLl9zYW1lQXNMYXN0RXJyb3IoaXRlbSkpIHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignaWdub3JlZCBpZGVudGljYWwgaXRlbScpO1xuICAgICAgZXJyb3IuaXRlbSA9IGl0ZW07XG4gICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHRoaXMuX2FkZFRyYWNpbmdBdHRyaWJ1dGVzKGl0ZW0pO1xuXG4gICAgLy8gTGVnYWN5IE9wZW5UcmFjaW5nIHN1cHBvcnRcbiAgICB0aGlzLl9hZGRUcmFjaW5nSW5mbyhpdGVtKTtcblxuICAgIGl0ZW0ubGV2ZWwgPSBpdGVtLmxldmVsIHx8IGRlZmF1bHRMZXZlbDtcblxuXG4gICAgY29uc3QgdGVsZW1ldGVyID0gdGhpcy50ZWxlbWV0ZXI7XG4gICAgaWYgKHRlbGVtZXRlcikge1xuICAgICAgdGVsZW1ldGVyLl9jYXB0dXJlUm9sbGJhckl0ZW0oaXRlbSk7XG4gICAgICBpdGVtLnRlbGVtZXRyeUV2ZW50cyA9IHRlbGVtZXRlci5jb3B5RXZlbnRzKCkgfHwgW107XG5cbiAgICAgIGlmICh0ZWxlbWV0ZXIudGVsZW1ldHJ5U3Bhbikge1xuICAgICAgICB0ZWxlbWV0ZXIudGVsZW1ldHJ5U3Bhbi5lbmQoKTtcbiAgICAgICAgdGVsZW1ldGVyLnRlbGVtZXRyeVNwYW4gPSB0ZWxlbWV0ZXIudHJhY2luZy5zdGFydFNwYW4oJ3JvbGxiYXItdGVsZW1ldHJ5Jywge30pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubm90aWZpZXIubG9nKGl0ZW0sIGNhbGxiYWNrKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soZSk7XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyLmVycm9yKGUpO1xuICB9XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fYWRkVHJhY2luZ0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICBjb25zdCBzcGFuID0gdGhpcy50cmFjaW5nPy5nZXRTcGFuKCk7XG4gIGlmICghc3Bhbikge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBhdHRyaWJ1dGVzID0gW1xuICAgIHtrZXk6ICdzZXNzaW9uX2lkJywgdmFsdWU6IHRoaXMudHJhY2luZy5zZXNzaW9uSWR9LFxuICAgIHtrZXk6ICdzcGFuX2lkJywgdmFsdWU6IHNwYW4uc3BhbklkfSxcbiAgICB7a2V5OiAndHJhY2VfaWQnLCB2YWx1ZTogc3Bhbi50cmFjZUlkfSxcbiAgXTtcbiAgXy5hZGRJdGVtQXR0cmlidXRlcyhpdGVtLCBhdHRyaWJ1dGVzKTtcblxuICBzcGFuLmFkZEV2ZW50KFxuICAgICdyb2xsYmFyLm9jY3VycmVuY2UnLFxuICAgIFt7a2V5OiAncm9sbGJhci5vY2N1cnJlbmNlLnV1aWQnLCB2YWx1ZTogaXRlbS51dWlkfV0sXG4gICk7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fZGVmYXVsdExvZ0xldmVsID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5vcHRpb25zLmxvZ0xldmVsIHx8ICdkZWJ1Zyc7XG59O1xuXG5Sb2xsYmFyLnByb3RvdHlwZS5fc2FtZUFzTGFzdEVycm9yID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgaWYgKCFpdGVtLl9pc1VuY2F1Z2h0KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpdGVtSGFzaCA9IGdlbmVyYXRlSXRlbUhhc2goaXRlbSk7XG4gIGlmICh0aGlzLmxhc3RFcnJvckhhc2ggPT09IGl0ZW1IYXNoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdGhpcy5sYXN0RXJyb3IgPSBpdGVtLmVycjtcbiAgdGhpcy5sYXN0RXJyb3JIYXNoID0gaXRlbUhhc2g7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblJvbGxiYXIucHJvdG90eXBlLl9hZGRUcmFjaW5nSW5mbyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIC8vIFRyYWNlciB2YWxpZGF0aW9uIG9jY3VycyBpbiB0aGUgY29uc3RydWN0b3JcbiAgLy8gb3IgaW4gdGhlIFJvbGxiYXIucHJvdG90eXBlLmNvbmZpZ3VyZSBtZXRob2RzXG4gIGlmICh0aGlzLnRyYWNlcikge1xuICAgIC8vIGFkZCByb2xsYmFyIG9jY3VycmVuY2UgdXVpZCB0byBzcGFuXG4gICAgdmFyIHNwYW4gPSB0aGlzLnRyYWNlci5zY29wZSgpLmFjdGl2ZSgpO1xuXG4gICAgaWYgKHZhbGlkYXRlU3BhbihzcGFuKSkge1xuICAgICAgc3Bhbi5zZXRUYWcoJ3JvbGxiYXIuZXJyb3JfdXVpZCcsIGl0ZW0udXVpZCk7XG4gICAgICBzcGFuLnNldFRhZygncm9sbGJhci5oYXNfZXJyb3InLCB0cnVlKTtcbiAgICAgIHNwYW4uc2V0VGFnKCdlcnJvcicsIHRydWUpO1xuICAgICAgc3Bhbi5zZXRUYWcoXG4gICAgICAgICdyb2xsYmFyLml0ZW1fdXJsJyxcbiAgICAgICAgYGh0dHBzOi8vcm9sbGJhci5jb20vaXRlbS91dWlkLz91dWlkPSR7aXRlbS51dWlkfWAsXG4gICAgICApO1xuICAgICAgc3Bhbi5zZXRUYWcoXG4gICAgICAgICdyb2xsYmFyLm9jY3VycmVuY2VfdXJsJyxcbiAgICAgICAgYGh0dHBzOi8vcm9sbGJhci5jb20vb2NjdXJyZW5jZS91dWlkLz91dWlkPSR7aXRlbS51dWlkfWAsXG4gICAgICApO1xuXG4gICAgICAvLyBhZGQgc3BhbiBJRCAmIHRyYWNlIElEIHRvIG9jY3VycmVuY2VcbiAgICAgIHZhciBvcGVudHJhY2luZ1NwYW5JZCA9IHNwYW4uY29udGV4dCgpLnRvU3BhbklkKCk7XG4gICAgICB2YXIgb3BlbnRyYWNpbmdUcmFjZUlkID0gc3Bhbi5jb250ZXh0KCkudG9UcmFjZUlkKCk7XG5cbiAgICAgIGlmIChpdGVtLmN1c3RvbSkge1xuICAgICAgICBpdGVtLmN1c3RvbS5vcGVudHJhY2luZ19zcGFuX2lkID0gb3BlbnRyYWNpbmdTcGFuSWQ7XG4gICAgICAgIGl0ZW0uY3VzdG9tLm9wZW50cmFjaW5nX3RyYWNlX2lkID0gb3BlbnRyYWNpbmdUcmFjZUlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbS5jdXN0b20gPSB7XG4gICAgICAgICAgb3BlbnRyYWNpbmdfc3Bhbl9pZDogb3BlbnRyYWNpbmdTcGFuSWQsXG4gICAgICAgICAgb3BlbnRyYWNpbmdfdHJhY2VfaWQ6IG9wZW50cmFjaW5nVHJhY2VJZCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSXRlbUhhc2goaXRlbSkge1xuICB2YXIgbWVzc2FnZSA9IGl0ZW0ubWVzc2FnZSB8fCAnJztcbiAgdmFyIHN0YWNrID0gKGl0ZW0uZXJyIHx8IHt9KS5zdGFjayB8fCBTdHJpbmcoaXRlbS5lcnIpO1xuICByZXR1cm4gbWVzc2FnZSArICc6OicgKyBzdGFjaztcbn1cblxuLy8gTm9kZS5qcywgQ2hyb21lLCBTYWZhcmksIGFuZCBzb21lIG90aGVyIGJyb3dzZXJzIHN1cHBvcnQgdGhpcyBwcm9wZXJ0eVxuLy8gd2hpY2ggZ2xvYmFsbHkgc2V0cyB0aGUgbnVtYmVyIG9mIHN0YWNrIGZyYW1lcyByZXR1cm5lZCBpbiBhbiBFcnJvciBvYmplY3QuXG4vLyBJZiBhIGJyb3dzZXIgY2FuJ3QgdXNlIGl0LCBubyBoYXJtIGRvbmUuXG5mdW5jdGlvbiBzZXRTdGFja1RyYWNlTGltaXQob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5zdGFja1RyYWNlTGltaXQpIHtcbiAgICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBvcHRpb25zLnN0YWNrVHJhY2VMaW1pdDtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBUcmFjZXIgb2JqZWN0IHByb3ZpZGVkIHRvIHRoZSBDbGllbnRcbiAqIGlzIHZhbGlkIGZvciBvdXIgT3BlbnRyYWNpbmcgdXNlIGNhc2UuXG4gKiBAcGFyYW0ge29wZW50cmFjZXIuVHJhY2VyfSB0cmFjZXJcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVUcmFjZXIodHJhY2VyKSB7XG4gIGlmICghdHJhY2VyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKCF0cmFjZXIuc2NvcGUgfHwgdHlwZW9mIHRyYWNlci5zY29wZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBzY29wZSA9IHRyYWNlci5zY29wZSgpO1xuXG4gIGlmICghc2NvcGUgfHwgIXNjb3BlLmFjdGl2ZSB8fCB0eXBlb2Ygc2NvcGUuYWN0aXZlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgdGhlIFNwYW4gb2JqZWN0IHByb3ZpZGVkXG4gKiBAcGFyYW0ge29wZW50cmFjZXIuU3Bhbn0gc3BhblxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZVNwYW4oc3Bhbikge1xuICBpZiAoIXNwYW4gfHwgIXNwYW4uY29udGV4dCB8fCB0eXBlb2Ygc3Bhbi5jb250ZXh0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHNwYW5Db250ZXh0ID0gc3Bhbi5jb250ZXh0KCk7XG5cbiAgaWYgKFxuICAgICFzcGFuQ29udGV4dCB8fFxuICAgICFzcGFuQ29udGV4dC50b1NwYW5JZCB8fFxuICAgICFzcGFuQ29udGV4dC50b1RyYWNlSWQgfHxcbiAgICB0eXBlb2Ygc3BhbkNvbnRleHQudG9TcGFuSWQgIT09ICdmdW5jdGlvbicgfHxcbiAgICB0eXBlb2Ygc3BhbkNvbnRleHQudG9UcmFjZUlkICE9PSAnZnVuY3Rpb24nXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxiYXI7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi91dGlsaXR5L3RyYXZlcnNlJyk7XG5cbmZ1bmN0aW9uIHNjcnViKGRhdGEsIHNjcnViRmllbGRzLCBzY3J1YlBhdGhzKSB7XG4gIHNjcnViRmllbGRzID0gc2NydWJGaWVsZHMgfHwgW107XG5cbiAgaWYgKHNjcnViUGF0aHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjcnViUGF0aHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHNjcnViUGF0aChkYXRhLCBzY3J1YlBhdGhzW2ldKTtcbiAgICB9XG4gIH1cblxuICB2YXIgcGFyYW1SZXMgPSBfZ2V0U2NydWJGaWVsZFJlZ2V4cyhzY3J1YkZpZWxkcyk7XG4gIHZhciBxdWVyeVJlcyA9IF9nZXRTY3J1YlF1ZXJ5UGFyYW1SZWdleHMoc2NydWJGaWVsZHMpO1xuXG4gIGZ1bmN0aW9uIHJlZGFjdFF1ZXJ5UGFyYW0oZHVtbXkwLCBwYXJhbVBhcnQpIHtcbiAgICByZXR1cm4gcGFyYW1QYXJ0ICsgXy5yZWRhY3QoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcmFtU2NydWJiZXIodikge1xuICAgIHZhciBpO1xuICAgIGlmIChfLmlzVHlwZSh2LCAnc3RyaW5nJykpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBxdWVyeVJlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2ID0gdi5yZXBsYWNlKHF1ZXJ5UmVzW2ldLCByZWRhY3RRdWVyeVBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxTY3J1YmJlcihrLCB2KSB7XG4gICAgdmFyIGk7XG4gICAgZm9yIChpID0gMDsgaSA8IHBhcmFtUmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAocGFyYW1SZXNbaV0udGVzdChrKSkge1xuICAgICAgICB2ID0gXy5yZWRhY3QoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2O1xuICB9XG5cbiAgZnVuY3Rpb24gc2NydWJiZXIoaywgdiwgc2Vlbikge1xuICAgIHZhciB0bXBWID0gdmFsU2NydWJiZXIoaywgdik7XG4gICAgaWYgKHRtcFYgPT09IHYpIHtcbiAgICAgIGlmIChfLmlzVHlwZSh2LCAnb2JqZWN0JykgfHwgXy5pc1R5cGUodiwgJ2FycmF5JykpIHtcbiAgICAgICAgcmV0dXJuIHRyYXZlcnNlKHYsIHNjcnViYmVyLCBzZWVuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbVNjcnViYmVyKHRtcFYpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdG1wVjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJhdmVyc2UoZGF0YSwgc2NydWJiZXIpO1xufVxuXG5mdW5jdGlvbiBzY3J1YlBhdGgob2JqLCBwYXRoKSB7XG4gIHZhciBrZXlzID0gcGF0aC5zcGxpdCgnLicpO1xuICB2YXIgbGFzdCA9IGtleXMubGVuZ3RoIC0gMTtcbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBsYXN0OyArK2kpIHtcbiAgICAgIGlmIChpIDwgbGFzdCkge1xuICAgICAgICBvYmogPSBvYmpba2V5c1tpXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5c1tpXV0gPSBfLnJlZGFjdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIE1pc3Npbmcga2V5IGlzIE9LO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRTY3J1YkZpZWxkUmVnZXhzKHNjcnViRmllbGRzKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgdmFyIHBhdDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3J1YkZpZWxkcy5sZW5ndGg7ICsraSkge1xuICAgIHBhdCA9ICdeXFxcXFs/KCU1W2JCXSk/JyArIHNjcnViRmllbGRzW2ldICsgJ1xcXFxbPyglNVtiQl0pP1xcXFxdPyglNVtkRF0pPyQnO1xuICAgIHJldC5wdXNoKG5ldyBSZWdFeHAocGF0LCAnaScpKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBfZ2V0U2NydWJRdWVyeVBhcmFtUmVnZXhzKHNjcnViRmllbGRzKSB7XG4gIHZhciByZXQgPSBbXTtcbiAgdmFyIHBhdDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY3J1YkZpZWxkcy5sZW5ndGg7ICsraSkge1xuICAgIHBhdCA9ICdcXFxcWz8oJTVbYkJdKT8nICsgc2NydWJGaWVsZHNbaV0gKyAnXFxcXFs/KCU1W2JCXSk/XFxcXF0/KCU1W2REXSk/JztcbiAgICByZXQucHVzaChuZXcgUmVnRXhwKCcoJyArIHBhdCArICc9KShbXiZcXFxcbl0rKScsICdpZ20nKSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzY3J1YjtcbiIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsaXR5Jyk7XG5cbmNvbnN0IE1BWF9FVkVOVFMgPSAxMDA7XG5cbi8vIFRlbXBvcmFyeSB3b3JrYXJvdW5kIHdoaWxlIHNvbHZpbmcgY29tbW9uanMgLT4gZXNtIGlzc3VlcyBpbiBOb2RlIDE4IC0gMjAuXG5mdW5jdGlvbiBmcm9tTWlsbGlzKG1pbGxpcykge1xuICByZXR1cm4gW01hdGgudHJ1bmMobWlsbGlzIC8gMTAwMCksIE1hdGgucm91bmQoKG1pbGxpcyAlIDEwMDApICogMWU2KV07XG59XG5cbmZ1bmN0aW9uIFRlbGVtZXRlcihvcHRpb25zLCB0cmFjaW5nKSB7XG4gIHRoaXMucXVldWUgPSBbXTtcbiAgdGhpcy5vcHRpb25zID0gXy5tZXJnZShvcHRpb25zKTtcbiAgdmFyIG1heFRlbGVtZXRyeUV2ZW50cyA9IHRoaXMub3B0aW9ucy5tYXhUZWxlbWV0cnlFdmVudHMgfHwgTUFYX0VWRU5UUztcbiAgdGhpcy5tYXhRdWV1ZVNpemUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhUZWxlbWV0cnlFdmVudHMsIE1BWF9FVkVOVFMpKTtcbiAgdGhpcy50cmFjaW5nID0gdHJhY2luZztcbiAgdGhpcy50ZWxlbWV0cnlTcGFuID0gdGhpcy50cmFjaW5nPy5zdGFydFNwYW4oJ3JvbGxiYXItdGVsZW1ldHJ5Jywge30pO1xufVxuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIHZhciBvbGRPcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICB0aGlzLm9wdGlvbnMgPSBfLm1lcmdlKG9sZE9wdGlvbnMsIG9wdGlvbnMpO1xuICB2YXIgbWF4VGVsZW1ldHJ5RXZlbnRzID0gdGhpcy5vcHRpb25zLm1heFRlbGVtZXRyeUV2ZW50cyB8fCBNQVhfRVZFTlRTO1xuICB2YXIgbmV3TWF4RXZlbnRzID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4VGVsZW1ldHJ5RXZlbnRzLCBNQVhfRVZFTlRTKSk7XG4gIHZhciBkZWxldGVDb3VudCA9IDA7XG4gIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCA+IG5ld01heEV2ZW50cykge1xuICAgIGRlbGV0ZUNvdW50ID0gdGhpcy5xdWV1ZS5sZW5ndGggLSBuZXdNYXhFdmVudHM7XG4gIH1cbiAgdGhpcy5tYXhRdWV1ZVNpemUgPSBuZXdNYXhFdmVudHM7XG4gIHRoaXMucXVldWUuc3BsaWNlKDAsIGRlbGV0ZUNvdW50KTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY29weUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV2ZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMucXVldWUsIDApO1xuICBpZiAoXy5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy5maWx0ZXJUZWxlbWV0cnkpKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBpID0gZXZlbnRzLmxlbmd0aDtcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJUZWxlbWV0cnkoZXZlbnRzW2ldKSkge1xuICAgICAgICAgIGV2ZW50cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZmlsdGVyVGVsZW1ldHJ5ID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV2ZW50cztcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZSA9IGZ1bmN0aW9uIChcbiAgdHlwZSxcbiAgbWV0YWRhdGEsXG4gIGxldmVsLFxuICByb2xsYmFyVVVJRCxcbiAgdGltZXN0YW1wLFxuKSB7XG4gIHZhciBlID0ge1xuICAgIGxldmVsOiBnZXRMZXZlbCh0eXBlLCBsZXZlbCksXG4gICAgdHlwZTogdHlwZSxcbiAgICB0aW1lc3RhbXBfbXM6IHRpbWVzdGFtcCB8fCBfLm5vdygpLFxuICAgIGJvZHk6IG1ldGFkYXRhLFxuICAgIHNvdXJjZTogJ2NsaWVudCcsXG4gIH07XG4gIGlmIChyb2xsYmFyVVVJRCkge1xuICAgIGUudXVpZCA9IHJvbGxiYXJVVUlEO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoXG4gICAgICBfLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLmZpbHRlclRlbGVtZXRyeSkgJiZcbiAgICAgIHRoaXMub3B0aW9ucy5maWx0ZXJUZWxlbWV0cnkoZSlcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGV4Yykge1xuICAgIHRoaXMub3B0aW9ucy5maWx0ZXJUZWxlbWV0cnkgPSBudWxsO1xuICB9XG5cbiAgdGhpcy5wdXNoKGUpO1xuICByZXR1cm4gZTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZUV2ZW50ID0gZnVuY3Rpb24gKFxuICB0eXBlLFxuICBtZXRhZGF0YSxcbiAgbGV2ZWwsXG4gIHJvbGxiYXJVVUlELFxuKSB7XG4gIHJldHVybiB0aGlzLmNhcHR1cmUodHlwZSwgbWV0YWRhdGEsIGxldmVsLCByb2xsYmFyVVVJRCk7XG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVFcnJvciA9IGZ1bmN0aW9uIChcbiAgZXJyLFxuICBsZXZlbCxcbiAgcm9sbGJhclVVSUQsXG4gIHRpbWVzdGFtcCxcbikge1xuICBjb25zdCBtZXNzYWdlID0gZXJyLm1lc3NhZ2UgfHwgU3RyaW5nKGVycik7XG4gIHZhciBtZXRhZGF0YSA9IHttZXNzYWdlfTtcbiAgaWYgKGVyci5zdGFjaykge1xuICAgIG1ldGFkYXRhLnN0YWNrID0gZXJyLnN0YWNrO1xuICB9XG4gIHRoaXMudGVsZW1ldHJ5U3Bhbj8uYWRkRXZlbnQoXG4gICAgJ3JvbGxiYXItb2NjdXJyZW5jZS1ldmVudCcsXG4gICAge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIGxldmVsLFxuICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgIHV1aWQ6IHJvbGxiYXJVVUlELFxuICAgICAgJ29jY3VycmVuY2UudHlwZSc6ICdlcnJvcicsIC8vIGRlcHJlY2F0ZWRcbiAgICAgICdvY2N1cnJlbmNlLnV1aWQnOiByb2xsYmFyVVVJRCwgLy8gZGVwcmVjYXRlZFxuICAgIH0sXG5cbiAgICBmcm9tTWlsbGlzKHRpbWVzdGFtcCksXG4gICk7XG5cbiAgcmV0dXJuIHRoaXMuY2FwdHVyZSgnZXJyb3InLCBtZXRhZGF0YSwgbGV2ZWwsIHJvbGxiYXJVVUlELCB0aW1lc3RhbXApO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlTG9nID0gZnVuY3Rpb24gKFxuICBtZXNzYWdlLFxuICBsZXZlbCxcbiAgcm9sbGJhclVVSUQsXG4gIHRpbWVzdGFtcCxcbikge1xuICAvLyBJZiB0aGUgdXVpZCBpcyBwcmVzZW50LCB0aGlzIGlzIGEgbWVzc2FnZSBvY2N1cnJlbmNlLlxuICBpZiAocm9sbGJhclVVSUQpIHtcbiAgICB0aGlzLnRlbGVtZXRyeVNwYW4/LmFkZEV2ZW50KFxuICAgICAgJ3JvbGxiYXItb2NjdXJyZW5jZS1ldmVudCcsXG4gICAgICB7XG4gICAgICAgIG1lc3NhZ2UsXG4gICAgICAgIGxldmVsLFxuICAgICAgICB0eXBlOiAnbWVzc2FnZScsXG4gICAgICAgIHV1aWQ6IHJvbGxiYXJVVUlELFxuICAgICAgICAnb2NjdXJyZW5jZS50eXBlJzogJ21lc3NhZ2UnLCAvLyBkZXByZWNhdGVkXG4gICAgICAgICdvY2N1cnJlbmNlLnV1aWQnOiByb2xsYmFyVVVJRCwgLy8gZGVwcmVjYXRlZFxuICAgICAgfSxcbiAgICAgIGZyb21NaWxsaXModGltZXN0YW1wKSxcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudGVsZW1ldHJ5U3Bhbj8uYWRkRXZlbnQoXG4gICAgICAnbG9nLWV2ZW50JyxcbiAgICAgIHttZXNzYWdlLCBsZXZlbH0sXG4gICAgICBmcm9tTWlsbGlzKHRpbWVzdGFtcCksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmNhcHR1cmUoXG4gICAgJ2xvZycsXG4gICAge21lc3NhZ2V9LFxuICAgIGxldmVsLFxuICAgIHJvbGxiYXJVVUlELFxuICAgIHRpbWVzdGFtcCxcbiAgKTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZU5ldHdvcmsgPSBmdW5jdGlvbiAoXG4gIG1ldGFkYXRhLFxuICBzdWJ0eXBlLFxuICByb2xsYmFyVVVJRCxcbiAgcmVxdWVzdERhdGEsXG4pIHtcbiAgc3VidHlwZSA9IHN1YnR5cGUgfHwgJ3hocic7XG4gIG1ldGFkYXRhLnN1YnR5cGUgPSBtZXRhZGF0YS5zdWJ0eXBlIHx8IHN1YnR5cGU7XG4gIGlmIChyZXF1ZXN0RGF0YSkge1xuICAgIG1ldGFkYXRhLnJlcXVlc3QgPSByZXF1ZXN0RGF0YTtcbiAgfVxuICB2YXIgbGV2ZWwgPSB0aGlzLmxldmVsRnJvbVN0YXR1cyhtZXRhZGF0YS5zdGF0dXNfY29kZSk7XG4gIHJldHVybiB0aGlzLmNhcHR1cmUoJ25ldHdvcmsnLCBtZXRhZGF0YSwgbGV2ZWwsIHJvbGxiYXJVVUlEKTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUubGV2ZWxGcm9tU3RhdHVzID0gZnVuY3Rpb24gKHN0YXR1c0NvZGUpIHtcbiAgaWYgKHN0YXR1c0NvZGUgPj0gMjAwICYmIHN0YXR1c0NvZGUgPCA0MDApIHtcbiAgICByZXR1cm4gJ2luZm8nO1xuICB9XG4gIGlmIChzdGF0dXNDb2RlID09PSAwIHx8IHN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgcmV0dXJuICdlcnJvcic7XG4gIH1cbiAgcmV0dXJuICdpbmZvJztcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZURvbSA9IGZ1bmN0aW9uIChcbiAgc3VidHlwZSxcbiAgZWxlbWVudCxcbiAgdmFsdWUsXG4gIGNoZWNrZWQsXG4gIHJvbGxiYXJVVUlELFxuKSB7XG4gIHZhciBtZXRhZGF0YSA9IHtcbiAgICBzdWJ0eXBlOiBzdWJ0eXBlLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gIH07XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbWV0YWRhdGEudmFsdWUgPSB2YWx1ZTtcbiAgfVxuICBpZiAoY2hlY2tlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbWV0YWRhdGEuY2hlY2tlZCA9IGNoZWNrZWQ7XG4gIH1cbiAgcmV0dXJuIHRoaXMuY2FwdHVyZSgnZG9tJywgbWV0YWRhdGEsICdpbmZvJywgcm9sbGJhclVVSUQpO1xufTtcblxuVGVsZW1ldGVyLnByb3RvdHlwZS5jYXB0dXJlTmF2aWdhdGlvbiA9IGZ1bmN0aW9uIChmcm9tLCB0bywgcm9sbGJhclVVSUQsIHRpbWVzdGFtcCkge1xuICB0aGlzLnRlbGVtZXRyeVNwYW4/LmFkZEV2ZW50KFxuICAgICdzZXNzaW9uLW5hdmlnYXRpb24tZXZlbnQnLFxuICAgIHsncHJldmlvdXMudXJsLmZ1bGwnOiBmcm9tLCAndXJsLmZ1bGwnOiB0b30sXG4gICAgZnJvbU1pbGxpcyh0aW1lc3RhbXApLFxuICApO1xuXG4gIHJldHVybiB0aGlzLmNhcHR1cmUoXG4gICAgJ25hdmlnYXRpb24nLFxuICAgIHtmcm9tLCB0b30sXG4gICAgJ2luZm8nLFxuICAgIHJvbGxiYXJVVUlELFxuICAgIHRpbWVzdGFtcCxcbiAgKTtcbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUuY2FwdHVyZURvbUNvbnRlbnRMb2FkZWQgPSBmdW5jdGlvbiAodHMpIHtcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZShcbiAgICAnbmF2aWdhdGlvbicsXG4gICAgeyBzdWJ0eXBlOiAnRE9NQ29udGVudExvYWRlZCcgfSxcbiAgICAnaW5mbycsXG4gICAgdW5kZWZpbmVkLFxuICAgIHRzICYmIHRzLmdldFRpbWUoKSxcbiAgKTtcbiAgLyoqXG4gICAqIElmIHdlIGRlY2lkZSB0byBtYWtlIHRoaXMgYSBkb20gZXZlbnQgaW5zdGVhZCwgdGhlbiB1c2UgdGhlIGxpbmUgYmVsb3c6XG4gIHJldHVybiB0aGlzLmNhcHR1cmUoJ2RvbScsIHtzdWJ0eXBlOiAnRE9NQ29udGVudExvYWRlZCd9LCAnaW5mbycsIHVuZGVmaW5lZCwgdHMgJiYgdHMuZ2V0VGltZSgpKTtcbiAgKi9cbn07XG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVMb2FkID0gZnVuY3Rpb24gKHRzKSB7XG4gIHJldHVybiB0aGlzLmNhcHR1cmUoXG4gICAgJ25hdmlnYXRpb24nLFxuICAgIHsgc3VidHlwZTogJ2xvYWQnIH0sXG4gICAgJ2luZm8nLFxuICAgIHVuZGVmaW5lZCxcbiAgICB0cyAmJiB0cy5nZXRUaW1lKCksXG4gICk7XG4gIC8qKlxuICAgKiBJZiB3ZSBkZWNpZGUgdG8gbWFrZSB0aGlzIGEgZG9tIGV2ZW50IGluc3RlYWQsIHRoZW4gdXNlIHRoZSBsaW5lIGJlbG93OlxuICByZXR1cm4gdGhpcy5jYXB0dXJlKCdkb20nLCB7c3VidHlwZTogJ2xvYWQnfSwgJ2luZm8nLCB1bmRlZmluZWQsIHRzICYmIHRzLmdldFRpbWUoKSk7XG4gICovXG59O1xuXG5UZWxlbWV0ZXIucHJvdG90eXBlLmNhcHR1cmVDb25uZWN0aXZpdHlDaGFuZ2UgPSBmdW5jdGlvbiAodHlwZSwgcm9sbGJhclVVSUQpIHtcbiAgcmV0dXJuIHRoaXMuY2FwdHVyZU5ldHdvcmsoeyBjaGFuZ2U6IHR5cGUgfSwgJ2Nvbm5lY3Rpdml0eScsIHJvbGxiYXJVVUlEKTtcbn07XG5cbi8vIE9ubHkgaW50ZW5kZWQgdG8gYmUgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBub3RpZmllclxuVGVsZW1ldGVyLnByb3RvdHlwZS5fY2FwdHVyZVJvbGxiYXJJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMuaW5jbHVkZUl0ZW1zSW5UZWxlbWV0cnkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGl0ZW0uZXJyKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwdHVyZUVycm9yKGl0ZW0uZXJyLCBpdGVtLmxldmVsLCBpdGVtLnV1aWQsIGl0ZW0udGltZXN0YW1wKTtcbiAgfVxuICBpZiAoaXRlbS5tZXNzYWdlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FwdHVyZUxvZyhpdGVtLm1lc3NhZ2UsIGl0ZW0ubGV2ZWwsIGl0ZW0udXVpZCwgaXRlbS50aW1lc3RhbXApO1xuICB9XG4gIGlmIChpdGVtLmN1c3RvbSkge1xuICAgIHJldHVybiB0aGlzLmNhcHR1cmUoXG4gICAgICAnbG9nJyxcbiAgICAgIGl0ZW0uY3VzdG9tLFxuICAgICAgaXRlbS5sZXZlbCxcbiAgICAgIGl0ZW0udXVpZCxcbiAgICAgIGl0ZW0udGltZXN0YW1wLFxuICAgICk7XG4gIH1cbn07XG5cblRlbGVtZXRlci5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChlKSB7XG4gIHRoaXMucXVldWUucHVzaChlKTtcbiAgaWYgKHRoaXMucXVldWUubGVuZ3RoID4gdGhpcy5tYXhRdWV1ZVNpemUpIHtcbiAgICB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldExldmVsKHR5cGUsIGxldmVsKSB7XG4gIGlmIChsZXZlbCkge1xuICAgIHJldHVybiBsZXZlbDtcbiAgfVxuICB2YXIgZGVmYXVsdExldmVsID0ge1xuICAgIGVycm9yOiAnZXJyb3InLFxuICAgIG1hbnVhbDogJ2luZm8nLFxuICB9O1xuICByZXR1cm4gZGVmYXVsdExldmVsW3R5cGVdIHx8ICdpbmZvJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZWxlbWV0ZXI7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xuXG5mdW5jdGlvbiBpdGVtVG9QYXlsb2FkKGl0ZW0sIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gIHZhciBkYXRhID0gaXRlbS5kYXRhO1xuXG4gIGlmIChpdGVtLl9pc1VuY2F1Z2h0KSB7XG4gICAgZGF0YS5faXNVbmNhdWdodCA9IHRydWU7XG4gIH1cbiAgaWYgKGl0ZW0uX29yaWdpbmFsQXJncykge1xuICAgIGRhdGEuX29yaWdpbmFsQXJncyA9IGl0ZW0uX29yaWdpbmFsQXJncztcbiAgfVxuICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gYWRkUGF5bG9hZE9wdGlvbnMoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIHBheWxvYWRPcHRpb25zID0gb3B0aW9ucy5wYXlsb2FkIHx8IHt9O1xuICBpZiAocGF5bG9hZE9wdGlvbnMuYm9keSkge1xuICAgIGRlbGV0ZSBwYXlsb2FkT3B0aW9ucy5ib2R5O1xuICB9XG5cbiAgaXRlbS5kYXRhID0gXy5tZXJnZShpdGVtLmRhdGEsIHBheWxvYWRPcHRpb25zKTtcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZFRlbGVtZXRyeURhdGEoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGl0ZW0udGVsZW1ldHJ5RXZlbnRzKSB7XG4gICAgXy5zZXQoaXRlbSwgJ2RhdGEuYm9keS50ZWxlbWV0cnknLCBpdGVtLnRlbGVtZXRyeUV2ZW50cyk7XG4gIH1cbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbmZ1bmN0aW9uIGFkZE1lc3NhZ2VXaXRoRXJyb3IoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKCFpdGVtLm1lc3NhZ2UpIHtcbiAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHRyYWNlUGF0aCA9ICdkYXRhLmJvZHkudHJhY2VfY2hhaW4uMCc7XG4gIHZhciB0cmFjZSA9IF8uZ2V0KGl0ZW0sIHRyYWNlUGF0aCk7XG4gIGlmICghdHJhY2UpIHtcbiAgICB0cmFjZVBhdGggPSAnZGF0YS5ib2R5LnRyYWNlJztcbiAgICB0cmFjZSA9IF8uZ2V0KGl0ZW0sIHRyYWNlUGF0aCk7XG4gIH1cbiAgaWYgKHRyYWNlKSB7XG4gICAgaWYgKCEodHJhY2UuZXhjZXB0aW9uICYmIHRyYWNlLmV4Y2VwdGlvbi5kZXNjcmlwdGlvbikpIHtcbiAgICAgIF8uc2V0KGl0ZW0sIHRyYWNlUGF0aCArICcuZXhjZXB0aW9uLmRlc2NyaXB0aW9uJywgaXRlbS5tZXNzYWdlKTtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZXh0cmEgPSBfLmdldChpdGVtLCB0cmFjZVBhdGggKyAnLmV4dHJhJykgfHwge307XG4gICAgdmFyIG5ld0V4dHJhID0gXy5tZXJnZShleHRyYSwgeyBtZXNzYWdlOiBpdGVtLm1lc3NhZ2UgfSk7XG4gICAgXy5zZXQoaXRlbSwgdHJhY2VQYXRoICsgJy5leHRyYScsIG5ld0V4dHJhKTtcbiAgfVxuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gdXNlclRyYW5zZm9ybShsb2dnZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBuZXdJdGVtID0gXy5tZXJnZShpdGVtKTtcbiAgICB2YXIgcmVzcG9uc2UgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9wdGlvbnMudHJhbnNmb3JtKSkge1xuICAgICAgICByZXNwb25zZSA9IG9wdGlvbnMudHJhbnNmb3JtKG5ld0l0ZW0uZGF0YSwgaXRlbSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgb3B0aW9ucy50cmFuc2Zvcm0gPSBudWxsO1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAnRXJyb3Igd2hpbGUgY2FsbGluZyBjdXN0b20gdHJhbnNmb3JtKCkgZnVuY3Rpb24uIFJlbW92aW5nIGN1c3RvbSB0cmFuc2Zvcm0oKS4nLFxuICAgICAgICBlLFxuICAgICAgKTtcbiAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoXy5pc1Byb21pc2UocmVzcG9uc2UpKSB7XG4gICAgICByZXNwb25zZS50aGVuKFxuICAgICAgICBmdW5jdGlvbiAocHJvbWlzZWRJdGVtKSB7XG4gICAgICAgICAgaWYgKHByb21pc2VkSXRlbSkge1xuICAgICAgICAgICAgbmV3SXRlbS5kYXRhID0gcHJvbWlzZWRJdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBuZXdJdGVtKTtcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIGl0ZW0pO1xuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2sobnVsbCwgbmV3SXRlbSk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBhZGRDb25maWdUb1BheWxvYWQoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKCFvcHRpb25zLnNlbmRDb25maWcpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gIH1cbiAgdmFyIGNvbmZpZ0tleSA9ICdfcm9sbGJhckNvbmZpZyc7XG4gIHZhciBjdXN0b20gPSBfLmdldChpdGVtLCAnZGF0YS5jdXN0b20nKSB8fCB7fTtcbiAgY3VzdG9tW2NvbmZpZ0tleV0gPSBvcHRpb25zO1xuICBpdGVtLmRhdGEuY3VzdG9tID0gY3VzdG9tO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkRnVuY3Rpb25PcHRpb24ob3B0aW9ucywgbmFtZSkge1xuICBpZiAoXy5pc0Z1bmN0aW9uKG9wdGlvbnNbbmFtZV0pKSB7XG4gICAgb3B0aW9uc1tuYW1lXSA9IG9wdGlvbnNbbmFtZV0udG9TdHJpbmcoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDb25maWd1cmVkT3B0aW9ucyhpdGVtLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgY29uZmlndXJlZE9wdGlvbnMgPSBvcHRpb25zLl9jb25maWd1cmVkT3B0aW9ucztcblxuICAvLyBUaGVzZSBtdXN0IGJlIHN0cmluZ2lmaWVkIG9yIHRoZXknbGwgZ2V0IGRyb3BwZWQgZHVyaW5nIHNlcmlhbGl6YXRpb24uXG4gIGFkZEZ1bmN0aW9uT3B0aW9uKGNvbmZpZ3VyZWRPcHRpb25zLCAndHJhbnNmb3JtJyk7XG4gIGFkZEZ1bmN0aW9uT3B0aW9uKGNvbmZpZ3VyZWRPcHRpb25zLCAnY2hlY2tJZ25vcmUnKTtcbiAgYWRkRnVuY3Rpb25PcHRpb24oY29uZmlndXJlZE9wdGlvbnMsICdvblNlbmRDYWxsYmFjaycpO1xuXG4gIGRlbGV0ZSBjb25maWd1cmVkT3B0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgaXRlbS5kYXRhLm5vdGlmaWVyLmNvbmZpZ3VyZWRfb3B0aW9ucyA9IGNvbmZpZ3VyZWRPcHRpb25zO1xuICBjYWxsYmFjayhudWxsLCBpdGVtKTtcbn1cblxuZnVuY3Rpb24gYWRkRGlhZ25vc3RpY0tleXMoaXRlbSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgdmFyIGRpYWdub3N0aWMgPSBfLm1lcmdlKFxuICAgIGl0ZW0ubm90aWZpZXIuY2xpZW50Lm5vdGlmaWVyLmRpYWdub3N0aWMsXG4gICAgaXRlbS5kaWFnbm9zdGljLFxuICApO1xuXG4gIGlmIChfLmdldChpdGVtLCAnZXJyLl9pc0Fub255bW91cycpKSB7XG4gICAgZGlhZ25vc3RpYy5pc19hbm9ueW1vdXMgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGl0ZW0uX2lzVW5jYXVnaHQpIHtcbiAgICBkaWFnbm9zdGljLmlzX3VuY2F1Z2h0ID0gaXRlbS5faXNVbmNhdWdodDtcbiAgfVxuXG4gIGlmIChpdGVtLmVycikge1xuICAgIHRyeSB7XG4gICAgICBkaWFnbm9zdGljLnJhd19lcnJvciA9IHtcbiAgICAgICAgbWVzc2FnZTogaXRlbS5lcnIubWVzc2FnZSxcbiAgICAgICAgbmFtZTogaXRlbS5lcnIubmFtZSxcbiAgICAgICAgY29uc3RydWN0b3JfbmFtZTogaXRlbS5lcnIuY29uc3RydWN0b3IgJiYgaXRlbS5lcnIuY29uc3RydWN0b3IubmFtZSxcbiAgICAgICAgZmlsZW5hbWU6IGl0ZW0uZXJyLmZpbGVOYW1lLFxuICAgICAgICBsaW5lOiBpdGVtLmVyci5saW5lTnVtYmVyLFxuICAgICAgICBjb2x1bW46IGl0ZW0uZXJyLmNvbHVtbk51bWJlcixcbiAgICAgICAgc3RhY2s6IGl0ZW0uZXJyLnN0YWNrLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBkaWFnbm9zdGljLnJhd19lcnJvciA9IHsgZmFpbGVkOiBTdHJpbmcoZSkgfTtcbiAgICB9XG4gIH1cblxuICBpdGVtLmRhdGEubm90aWZpZXIuZGlhZ25vc3RpYyA9IF8ubWVyZ2UoXG4gICAgaXRlbS5kYXRhLm5vdGlmaWVyLmRpYWdub3N0aWMsXG4gICAgZGlhZ25vc3RpYyxcbiAgKTtcbiAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpdGVtVG9QYXlsb2FkOiBpdGVtVG9QYXlsb2FkLFxuICBhZGRQYXlsb2FkT3B0aW9uczogYWRkUGF5bG9hZE9wdGlvbnMsXG4gIGFkZFRlbGVtZXRyeURhdGE6IGFkZFRlbGVtZXRyeURhdGEsXG4gIGFkZE1lc3NhZ2VXaXRoRXJyb3I6IGFkZE1lc3NhZ2VXaXRoRXJyb3IsXG4gIHVzZXJUcmFuc2Zvcm06IHVzZXJUcmFuc2Zvcm0sXG4gIGFkZENvbmZpZ1RvUGF5bG9hZDogYWRkQ29uZmlnVG9QYXlsb2FkLFxuICBhZGRDb25maWd1cmVkT3B0aW9uczogYWRkQ29uZmlndXJlZE9wdGlvbnMsXG4gIGFkZERpYWdub3N0aWNLZXlzOiBhZGREaWFnbm9zdGljS2V5cyxcbn07XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi91dGlsaXR5L3RyYXZlcnNlJyk7XG5cbmZ1bmN0aW9uIHJhdyhwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSkge1xuICB2YXIgbGVuID0gZnJhbWVzLmxlbmd0aDtcbiAgaWYgKGxlbiA+IHJhbmdlICogMikge1xuICAgIHJldHVybiBmcmFtZXMuc2xpY2UoMCwgcmFuZ2UpLmNvbmNhdChmcmFtZXMuc2xpY2UobGVuIC0gcmFuZ2UpKTtcbiAgfVxuICByZXR1cm4gZnJhbWVzO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZUZyYW1lcyhwYXlsb2FkLCBqc29uQmFja3VwLCByYW5nZSkge1xuICByYW5nZSA9IHR5cGVvZiByYW5nZSA9PT0gJ3VuZGVmaW5lZCcgPyAzMCA6IHJhbmdlO1xuICB2YXIgYm9keSA9IHBheWxvYWQuZGF0YS5ib2R5O1xuICB2YXIgZnJhbWVzO1xuICBpZiAoYm9keS50cmFjZV9jaGFpbikge1xuICAgIHZhciBjaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgZnJhbWVzID0gY2hhaW5baV0uZnJhbWVzO1xuICAgICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgICAgY2hhaW5baV0uZnJhbWVzID0gZnJhbWVzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChib2R5LnRyYWNlKSB7XG4gICAgZnJhbWVzID0gYm9keS50cmFjZS5mcmFtZXM7XG4gICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgIGJvZHkudHJhY2UuZnJhbWVzID0gZnJhbWVzO1xuICB9XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2YWwpIHtcbiAgaWYgKCF2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIGlmICh2YWwubGVuZ3RoID4gbGVuKSB7XG4gICAgcmV0dXJuIHZhbC5zbGljZSgwLCBsZW4gLSAzKS5jb25jYXQoJy4uLicpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlU3RyaW5ncyhsZW4sIHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgZnVuY3Rpb24gdHJ1bmNhdG9yKGssIHYsIHNlZW4pIHtcbiAgICBzd2l0Y2ggKF8udHlwZU5hbWUodikpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2KTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIHJldHVybiB0cmF2ZXJzZSh2LCB0cnVuY2F0b3IsIHNlZW4pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICB9XG4gIHBheWxvYWQgPSB0cmF2ZXJzZShwYXlsb2FkLCB0cnVuY2F0b3IpO1xuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGVUcmFjZURhdGEodHJhY2VEYXRhKSB7XG4gIGlmICh0cmFjZURhdGEuZXhjZXB0aW9uKSB7XG4gICAgZGVsZXRlIHRyYWNlRGF0YS5leGNlcHRpb24uZGVzY3JpcHRpb247XG4gICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlID0gbWF5YmVUcnVuY2F0ZVZhbHVlKFxuICAgICAgMjU1LFxuICAgICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlLFxuICAgICk7XG4gIH1cbiAgdHJhY2VEYXRhLmZyYW1lcyA9IHNlbGVjdEZyYW1lcyh0cmFjZURhdGEuZnJhbWVzLCAxKTtcbiAgcmV0dXJuIHRyYWNlRGF0YTtcbn1cblxuZnVuY3Rpb24gbWluQm9keShwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHZhciBib2R5ID0gcGF5bG9hZC5kYXRhLmJvZHk7XG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIGNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFpbltpXSA9IHRydW5jYXRlVHJhY2VEYXRhKGNoYWluW2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYm9keS50cmFjZSkge1xuICAgIGJvZHkudHJhY2UgPSB0cnVuY2F0ZVRyYWNlRGF0YShib2R5LnRyYWNlKTtcbiAgfVxuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gbmVlZHNUcnVuY2F0aW9uKHBheWxvYWQsIG1heFNpemUpIHtcbiAgcmV0dXJuIF8ubWF4Qnl0ZVNpemUocGF5bG9hZCkgPiBtYXhTaXplO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShwYXlsb2FkLCBqc29uQmFja3VwLCBtYXhTaXplKSB7XG4gIG1heFNpemUgPSB0eXBlb2YgbWF4U2l6ZSA9PT0gJ3VuZGVmaW5lZCcgPyA1MTIgKiAxMDI0IDogbWF4U2l6ZTtcbiAgdmFyIHN0cmF0ZWdpZXMgPSBbXG4gICAgcmF3LFxuICAgIHRydW5jYXRlRnJhbWVzLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDEwMjQpLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDUxMiksXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgMjU2KSxcbiAgICBtaW5Cb2R5LFxuICBdO1xuICB2YXIgc3RyYXRlZ3ksIHJlc3VsdHMsIHJlc3VsdDtcblxuICB3aGlsZSAoKHN0cmF0ZWd5ID0gc3RyYXRlZ2llcy5zaGlmdCgpKSkge1xuICAgIHJlc3VsdHMgPSBzdHJhdGVneShwYXlsb2FkLCBqc29uQmFja3VwKTtcbiAgICBwYXlsb2FkID0gcmVzdWx0c1swXTtcbiAgICByZXN1bHQgPSByZXN1bHRzWzFdO1xuICAgIGlmIChyZXN1bHQuZXJyb3IgfHwgIW5lZWRzVHJ1bmNhdGlvbihyZXN1bHQudmFsdWUsIG1heFNpemUpKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJ1bmNhdGU6IHRydW5jYXRlLFxuXG4gIC8qIGZvciB0ZXN0aW5nICovXG4gIHJhdzogcmF3LFxuICB0cnVuY2F0ZUZyYW1lczogdHJ1bmNhdGVGcmFtZXMsXG4gIHRydW5jYXRlU3RyaW5nczogdHJ1bmNhdGVTdHJpbmdzLFxuICBtYXliZVRydW5jYXRlVmFsdWU6IG1heWJlVHJ1bmNhdGVWYWx1ZSxcbn07XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG5cbnZhciBSb2xsYmFySlNPTiA9IHt9O1xuZnVuY3Rpb24gc2V0dXBKU09OKHBvbHlmaWxsSlNPTikge1xuICBpZiAoaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpICYmIGlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzRGVmaW5lZChKU09OKSkge1xuICAgIC8vIElmIHBvbHlmaWxsIGlzIHByb3ZpZGVkLCBwcmVmZXIgaXQgb3ZlciBleGlzdGluZyBub24tbmF0aXZlIHNoaW1zLlxuICAgIGlmIChwb2x5ZmlsbEpTT04pIHtcbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWxzZSBhY2NlcHQgYW55IGludGVyZmFjZSB0aGF0IGlzIHByZXNlbnQuXG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpIHx8ICFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHBvbHlmaWxsSlNPTiAmJiBwb2x5ZmlsbEpTT04oUm9sbGJhckpTT04pO1xuICB9XG59XG5cbi8qXG4gKiBpc1R5cGUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUgYW5kIGEgc3RyaW5nLCByZXR1cm5zIHRydWUgaWYgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gKiBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHggLSBhbnkgdmFsdWVcbiAqIEBwYXJhbSB0IC0gYSBsb3dlcmNhc2Ugc3RyaW5nIGNvbnRhaW5pbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZSBuYW1lczpcbiAqICAgIC0gdW5kZWZpbmVkXG4gKiAgICAtIG51bGxcbiAqICAgIC0gZXJyb3JcbiAqICAgIC0gbnVtYmVyXG4gKiAgICAtIGJvb2xlYW5cbiAqICAgIC0gc3RyaW5nXG4gKiAgICAtIHN5bWJvbFxuICogICAgLSBmdW5jdGlvblxuICogICAgLSBvYmplY3RcbiAqICAgIC0gYXJyYXlcbiAqIEByZXR1cm5zIHRydWUgaWYgeCBpcyBvZiB0eXBlIHQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1R5cGUoeCwgdCkge1xuICByZXR1cm4gdCA9PT0gdHlwZU5hbWUoeCk7XG59XG5cbi8qXG4gKiB0eXBlTmFtZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSwgcmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgb2JqZWN0IGFzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKHgpIHtcbiAgdmFyIG5hbWUgPSB0eXBlb2YgeDtcbiAgaWYgKG5hbWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoeCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuICdlcnJvcic7XG4gIH1cbiAgcmV0dXJuIHt9LnRvU3RyaW5nXG4gICAgLmNhbGwoeClcbiAgICAubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV1cbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyogaXNGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZikge1xuICByZXR1cm4gaXNUeXBlKGYsICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc05hdGl2ZUZ1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUZ1bmN0aW9uKGYpIHtcbiAgdmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcbiAgdmFyIGZ1bmNNYXRjaFN0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuICAgIC5jYWxsKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpXG4gICAgLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/Jyk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNNYXRjaFN0cmluZyArICckJyk7XG4gIHJldHVybiBpc09iamVjdChmKSAmJiByZUlzTmF0aXZlLnRlc3QoZik7XG59XG5cbi8qIGlzT2JqZWN0IC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaXMgdmFsdWUgaXMgYW4gb2JqZWN0IGZ1bmN0aW9uIGlzIGFuIG9iamVjdClcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzU3RyaW5nIC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuLyoqXG4gKiBpc0Zpbml0ZU51bWJlciAtIGRldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICpcbiAqIEBwYXJhbSB7Kn0gbiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gaXNGaW5pdGVOdW1iZXIobikge1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pO1xufVxuXG4vKlxuICogaXNEZWZpbmVkIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdSBpcyBhbnl0aGluZyBvdGhlciB0aGFuIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBpc0RlZmluZWQodSkge1xuICByZXR1cm4gIWlzVHlwZSh1LCAndW5kZWZpbmVkJyk7XG59XG5cbi8qXG4gKiBpc0l0ZXJhYmxlIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgY2FuIGJlIGl0ZXJhdGVkLCBlc3NlbnRpYWxseVxuICogd2hldGhlciBpdCBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIGkgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgaSBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgYXMgZGV0ZXJtaW5lZCBieSBgdHlwZU5hbWVgXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmFibGUoaSkge1xuICB2YXIgdHlwZSA9IHR5cGVOYW1lKGkpO1xuICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2FycmF5Jztcbn1cblxuLypcbiAqIGlzRXJyb3IgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBvZiBhbiBlcnJvciB0eXBlXG4gKlxuICogQHBhcmFtIGUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZSBpcyBhbiBlcnJvclxuICovXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgLy8gRGV0ZWN0IGJvdGggRXJyb3IgYW5kIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgcmV0dXJuIGlzVHlwZShlLCAnZXJyb3InKSB8fCBpc1R5cGUoZSwgJ2V4Y2VwdGlvbicpO1xufVxuXG4vKiBpc1Byb21pc2UgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgcHJvbWlzZVxuICpcbiAqIEBwYXJhbSBwIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUHJvbWlzZShwKSB7XG4gIHJldHVybiBpc09iamVjdChwKSAmJiBpc1R5cGUocC50aGVuLCAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBpc0Jyb3dzZXIgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlclxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqL1xuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlZGFjdCgpIHtcbiAgcmV0dXJuICcqKioqKioqKic7XG59XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3Mi8xMTM4MTkxXG5mdW5jdGlvbiB1dWlkNCgpIHtcbiAgdmFyIGQgPSBub3coKTtcbiAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKFxuICAgIC9beHldL2csXG4gICAgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHg3KSB8IDB4OCkudG9TdHJpbmcoMTYpO1xuICAgIH0sXG4gICk7XG4gIHJldHVybiB1dWlkO1xufVxuXG52YXIgTEVWRUxTID0ge1xuICBkZWJ1ZzogMCxcbiAgaW5mbzogMSxcbiAgd2FybmluZzogMixcbiAgZXJyb3I6IDMsXG4gIGNyaXRpY2FsOiA0LFxufTtcblxuZnVuY3Rpb24gc2FuaXRpemVVcmwodXJsKSB7XG4gIHZhciBiYXNlVXJsUGFydHMgPSBwYXJzZVVyaSh1cmwpO1xuICBpZiAoIWJhc2VVcmxQYXJ0cykge1xuICAgIHJldHVybiAnKHVua25vd24pJztcbiAgfVxuXG4gIC8vIHJlbW92ZSBhIHRyYWlsaW5nICMgaWYgdGhlcmUgaXMgbm8gYW5jaG9yXG4gIGlmIChiYXNlVXJsUGFydHMuYW5jaG9yID09PSAnJykge1xuICAgIGJhc2VVcmxQYXJ0cy5zb3VyY2UgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJyMnLCAnJyk7XG4gIH1cblxuICB1cmwgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJz8nICsgYmFzZVVybFBhcnRzLnF1ZXJ5LCAnJyk7XG4gIHJldHVybiB1cmw7XG59XG5cbnZhciBwYXJzZVVyaU9wdGlvbnMgPSB7XG4gIHN0cmljdE1vZGU6IGZhbHNlLFxuICBrZXk6IFtcbiAgICAnc291cmNlJyxcbiAgICAncHJvdG9jb2wnLFxuICAgICdhdXRob3JpdHknLFxuICAgICd1c2VySW5mbycsXG4gICAgJ3VzZXInLFxuICAgICdwYXNzd29yZCcsXG4gICAgJ2hvc3QnLFxuICAgICdwb3J0JyxcbiAgICAncmVsYXRpdmUnLFxuICAgICdwYXRoJyxcbiAgICAnZGlyZWN0b3J5JyxcbiAgICAnZmlsZScsXG4gICAgJ3F1ZXJ5JyxcbiAgICAnYW5jaG9yJyxcbiAgXSxcbiAgcToge1xuICAgIG5hbWU6ICdxdWVyeUtleScsXG4gICAgcGFyc2VyOiAvKD86XnwmKShbXiY9XSopPT8oW14mXSopL2csXG4gIH0sXG4gIHBhcnNlcjoge1xuICAgIHN0cmljdDpcbiAgICAgIC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gICAgbG9vc2U6XG4gICAgICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgaWYgKCFpc1R5cGUoc3RyLCAnc3RyaW5nJykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIG8gPSBwYXJzZVVyaU9wdGlvbnM7XG4gIHZhciBtID0gby5wYXJzZXJbby5zdHJpY3RNb2RlID8gJ3N0cmljdCcgOiAnbG9vc2UnXS5leGVjKHN0cik7XG4gIHZhciB1cmkgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IG8ua2V5Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIHVyaVtvLmtleVtpXV0gPSBtW2ldIHx8ICcnO1xuICB9XG5cbiAgdXJpW28ucS5uYW1lXSA9IHt9O1xuICB1cmlbby5rZXlbMTJdXS5yZXBsYWNlKG8ucS5wYXJzZXIsIGZ1bmN0aW9uICgkMCwgJDEsICQyKSB7XG4gICAgaWYgKCQxKSB7XG4gICAgICB1cmlbby5xLm5hbWVdWyQxXSA9ICQyO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcykge1xuICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIHBhcmFtcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbjtcbiAgdmFyIHBhcmFtc0FycmF5ID0gW107XG4gIHZhciBrO1xuICBmb3IgKGsgaW4gcGFyYW1zKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGspKSB7XG4gICAgICBwYXJhbXNBcnJheS5wdXNoKFtrLCBwYXJhbXNba11dLmpvaW4oJz0nKSk7XG4gICAgfVxuICB9XG4gIHZhciBxdWVyeSA9ICc/JyArIHBhcmFtc0FycmF5LnNvcnQoKS5qb2luKCcmJyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCB8fCAnJztcbiAgdmFyIHFzID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJz8nKTtcbiAgdmFyIGggPSBvcHRpb25zLnBhdGguaW5kZXhPZignIycpO1xuICB2YXIgcDtcbiAgaWYgKHFzICE9PSAtMSAmJiAoaCA9PT0gLTEgfHwgaCA+IHFzKSkge1xuICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgcXMpICsgcXVlcnkgKyAnJicgKyBwLnN1YnN0cmluZyhxcyArIDEpO1xuICB9IGVsc2Uge1xuICAgIGlmIChoICE9PSAtMSkge1xuICAgICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIGgpICsgcXVlcnkgKyBwLnN1YnN0cmluZyhoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoICsgcXVlcnk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVybCh1LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sIHx8IHUucHJvdG9jb2w7XG4gIGlmICghcHJvdG9jb2wgJiYgdS5wb3J0KSB7XG4gICAgaWYgKHUucG9ydCA9PT0gODApIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHA6JztcbiAgICB9IGVsc2UgaWYgKHUucG9ydCA9PT0gNDQzKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczonO1xuICAgIH1cbiAgfVxuICBwcm90b2NvbCA9IHByb3RvY29sIHx8ICdodHRwczonO1xuXG4gIGlmICghdS5ob3N0bmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICcvLycgKyB1Lmhvc3RuYW1lO1xuICBpZiAodS5wb3J0KSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgJzonICsgdS5wb3J0O1xuICB9XG4gIGlmICh1LnBhdGgpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyB1LnBhdGg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgYmFja3VwKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgaWYgKGJhY2t1cCAmJiBpc0Z1bmN0aW9uKGJhY2t1cCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gYmFja3VwKG9iaik7XG4gICAgICB9IGNhdGNoIChiYWNrdXBFcnJvcikge1xuICAgICAgICBlcnJvciA9IGJhY2t1cEVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IGpzb25FcnJvcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWF4Qnl0ZVNpemUoc3RyaW5nKSB7XG4gIC8vIFRoZSB0cmFuc3BvcnQgd2lsbCB1c2UgdXRmLTgsIHNvIGFzc3VtZSB1dGYtOCBlbmNvZGluZy5cbiAgLy9cbiAgLy8gVGhpcyBtaW5pbWFsIGltcGxlbWVudGF0aW9uIHdpbGwgYWNjdXJhdGVseSBjb3VudCBieXRlcyBmb3IgYWxsIFVDUy0yIGFuZFxuICAvLyBzaW5nbGUgY29kZSBwb2ludCBVVEYtMTYuIElmIHByZXNlbnRlZCB3aXRoIG11bHRpIGNvZGUgcG9pbnQgVVRGLTE2LFxuICAvLyB3aGljaCBzaG91bGQgYmUgcmFyZSwgaXQgd2lsbCBzYWZlbHkgb3ZlcmNvdW50LCBub3QgdW5kZXJjb3VudC5cbiAgLy9cbiAgLy8gV2hpbGUgcm9idXN0IHV0Zi04IGVuY29kZXJzIGV4aXN0LCB0aGlzIGlzIGZhciBzbWFsbGVyIGFuZCBmYXIgbW9yZSBwZXJmb3JtYW50LlxuICAvLyBGb3IgcXVpY2tseSBjb3VudGluZyBwYXlsb2FkIHNpemUgZm9yIHRydW5jYXRpb24sIHNtYWxsZXIgaXMgYmV0dGVyLlxuXG4gIHZhciBjb3VudCA9IDA7XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29kZSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICAvLyB1cCB0byA3IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAxO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDIwNDgpIHtcbiAgICAgIC8vIHVwIHRvIDExIGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAyO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDY1NTM2KSB7XG4gICAgICAvLyB1cCB0byAxNiBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY291bnQ7XG59XG5cbmZ1bmN0aW9uIGpzb25QYXJzZShzKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5wYXJzZShzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvKFxuICBtZXNzYWdlLFxuICB1cmwsXG4gIGxpbmVubyxcbiAgY29sbm8sXG4gIGVycm9yLFxuICBtb2RlLFxuICBiYWNrdXBNZXNzYWdlLFxuICBlcnJvclBhcnNlcixcbikge1xuICB2YXIgbG9jYXRpb24gPSB7XG4gICAgdXJsOiB1cmwgfHwgJycsXG4gICAgbGluZTogbGluZW5vLFxuICAgIGNvbHVtbjogY29sbm8sXG4gIH07XG4gIGxvY2F0aW9uLmZ1bmMgPSBlcnJvclBhcnNlci5ndWVzc0Z1bmN0aW9uTmFtZShsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICBsb2NhdGlvbi5jb250ZXh0ID0gZXJyb3JQYXJzZXIuZ2F0aGVyQ29udGV4dChsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICB2YXIgaHJlZiA9XG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGRvY3VtZW50ICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24gJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICB2YXIgdXNlcmFnZW50ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdyAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yID8gU3RyaW5nKGVycm9yKSA6IG1lc3NhZ2UgfHwgYmFja3VwTWVzc2FnZSxcbiAgICB1cmw6IGhyZWYsXG4gICAgc3RhY2s6IFtsb2NhdGlvbl0sXG4gICAgdXNlcmFnZW50OiB1c2VyYWdlbnQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhsb2dnZXIsIGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICB0cnkge1xuICAgICAgZihlcnIsIHJlc3ApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vbkNpcmN1bGFyQ2xvbmUob2JqKSB7XG4gIHZhciBzZWVuID0gW29ial07XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqLCBzZWVuKSB7XG4gICAgdmFyIHZhbHVlLFxuICAgICAgbmFtZSxcbiAgICAgIG5ld1NlZW4sXG4gICAgICByZXN1bHQgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh2YWx1ZSAmJiAoaXNUeXBlKHZhbHVlLCAnb2JqZWN0JykgfHwgaXNUeXBlKHZhbHVlLCAnYXJyYXknKSkpIHtcbiAgICAgICAgICBpZiAoc2Vlbi5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9ICdSZW1vdmVkIGNpcmN1bGFyIHJlZmVyZW5jZTogJyArIHR5cGVOYW1lKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3U2VlbiA9IHNlZW4uc2xpY2UoKTtcbiAgICAgICAgICAgIG5ld1NlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjbG9uZSh2YWx1ZSwgbmV3U2Vlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0gJ0ZhaWxlZCBjbG9uaW5nIGN1c3RvbSBkYXRhOiAnICsgZS5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJldHVybiBjbG9uZShvYmosIHNlZW4pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtKGFyZ3MsIGxvZ2dlciwgbm90aWZpZXIsIHJlcXVlc3RLZXlzLCBsYW1iZGFDb250ZXh0KSB7XG4gIHZhciBtZXNzYWdlLCBlcnIsIGN1c3RvbSwgY2FsbGJhY2ssIHJlcXVlc3Q7XG4gIHZhciBhcmc7XG4gIHZhciBleHRyYUFyZ3MgPSBbXTtcbiAgdmFyIGRpYWdub3N0aWMgPSB7fTtcbiAgdmFyIGFyZ1R5cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBhcmdUeXBlcy5wdXNoKHR5cCk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgbWVzc2FnZSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAobWVzc2FnZSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBjYWxsYmFjayA9IHdyYXBDYWxsYmFjayhsb2dnZXIsIGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgY2FzZSAnZG9tZXhjZXB0aW9uJzpcbiAgICAgIGNhc2UgJ2V4Y2VwdGlvbic6IC8vIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEtleXMgJiYgdHlwID09PSAnb2JqZWN0JyAmJiAhcmVxdWVzdCkge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSByZXF1ZXN0S2V5cy5sZW5ndGg7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgaWYgKGFyZ1tyZXF1ZXN0S2V5c1tqXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXF1ZXN0ID0gYXJnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcXVlc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXN0b20gPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGN1c3RvbSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgY3VzdG9tIGlzIGFuIGFycmF5IHRoaXMgdHVybnMgaXQgaW50byBhbiBvYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXNcbiAgaWYgKGN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZShjdXN0b20pO1xuXG4gIGlmIChleHRyYUFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmICghY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKHt9KTtcbiAgICBjdXN0b20uZXh0cmFBcmdzID0gbm9uQ2lyY3VsYXJDbG9uZShleHRyYUFyZ3MpO1xuICB9XG5cbiAgdmFyIGl0ZW0gPSB7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBlcnI6IGVycixcbiAgICBjdXN0b206IGN1c3RvbSxcbiAgICB0aW1lc3RhbXA6IG5vdygpLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBub3RpZmllcjogbm90aWZpZXIsXG4gICAgZGlhZ25vc3RpYzogZGlhZ25vc3RpYyxcbiAgICB1dWlkOiB1dWlkNCgpLFxuICB9O1xuXG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcblxuICBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pO1xuXG4gIGlmIChyZXF1ZXN0S2V5cyAmJiByZXF1ZXN0KSB7XG4gICAgaXRlbS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuICBpZiAobGFtYmRhQ29udGV4dCkge1xuICAgIGl0ZW0ubGFtYmRhQ29udGV4dCA9IGxhbWJkYUNvbnRleHQ7XG4gIH1cbiAgaXRlbS5fb3JpZ2luYWxBcmdzID0gYXJncztcbiAgaXRlbS5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcyA9IGFyZ1R5cGVzO1xuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKSB7XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLmxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLmxldmVsID0gY3VzdG9tLmxldmVsO1xuICAgIGRlbGV0ZSBjdXN0b20ubGV2ZWw7XG4gIH1cbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20uc2tpcEZyYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5za2lwRnJhbWVzID0gY3VzdG9tLnNraXBGcmFtZXM7XG4gICAgZGVsZXRlIGN1c3RvbS5za2lwRnJhbWVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yQ29udGV4dChpdGVtLCBlcnJvcnMpIHtcbiAgdmFyIGN1c3RvbSA9IGl0ZW0uZGF0YS5jdXN0b20gfHwge307XG4gIHZhciBjb250ZXh0QWRkZWQgPSBmYWxzZTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoZXJyb3JzW2ldLmhhc093blByb3BlcnR5KCdyb2xsYmFyQ29udGV4dCcpKSB7XG4gICAgICAgIGN1c3RvbSA9IG1lcmdlKGN1c3RvbSwgbm9uQ2lyY3VsYXJDbG9uZShlcnJvcnNbaV0ucm9sbGJhckNvbnRleHQpKTtcbiAgICAgICAgY29udGV4dEFkZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgYW4gZW1wdHkgb2JqZWN0IHRvIHRoZSBkYXRhLlxuICAgIGlmIChjb250ZXh0QWRkZWQpIHtcbiAgICAgIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaXRlbS5kaWFnbm9zdGljLmVycm9yX2NvbnRleHQgPSAnRmFpbGVkOiAnICsgZS5tZXNzYWdlO1xuICB9XG59XG5cbnZhciBURUxFTUVUUllfVFlQRVMgPSBbXG4gICdsb2cnLFxuICAnbmV0d29yaycsXG4gICdkb20nLFxuICAnbmF2aWdhdGlvbicsXG4gICdlcnJvcicsXG4gICdtYW51YWwnLFxuXTtcbnZhciBURUxFTUVUUllfTEVWRUxTID0gWydjcml0aWNhbCcsICdlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nLCAnZGVidWcnXTtcblxuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnIsIHZhbCkge1xuICBmb3IgKHZhciBrID0gMDsgayA8IGFyci5sZW5ndGg7ICsraykge1xuICAgIGlmIChhcnJba10gPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZWxlbWV0cnlFdmVudChhcmdzKSB7XG4gIHZhciB0eXBlLCBtZXRhZGF0YSwgbGV2ZWw7XG4gIHZhciBhcmc7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKCF0eXBlICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX1RZUEVTLCBhcmcpKSB7XG4gICAgICAgICAgdHlwZSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmICghbGV2ZWwgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfTEVWRUxTLCBhcmcpKSB7XG4gICAgICAgICAgbGV2ZWwgPSBhcmc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBtZXRhZGF0YSA9IGFyZztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV2ZW50ID0ge1xuICAgIHR5cGU6IHR5cGUgfHwgJ21hbnVhbCcsXG4gICAgbWV0YWRhdGE6IG1ldGFkYXRhIHx8IHt9LFxuICAgIGxldmVsOiBsZXZlbCxcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW1BdHRyaWJ1dGVzKGl0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMgPSBpdGVtLmRhdGEuYXR0cmlidXRlcyB8fCBbXTtcbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBpdGVtLmRhdGEuYXR0cmlidXRlcy5wdXNoKC4uLmF0dHJpYnV0ZXMpO1xuICB9XG59XG5cbi8qXG4gKiBnZXQgLSBnaXZlbiBhbiBvYmovYXJyYXkgYW5kIGEga2V5cGF0aCwgcmV0dXJuIHRoZSB2YWx1ZSBhdCB0aGF0IGtleXBhdGggb3JcbiAqICAgICAgIHVuZGVmaW5lZCBpZiBub3QgcG9zc2libGUuXG4gKlxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvciBhcnJheVxuICogQHBhcmFtIHBhdGggLSBhIHN0cmluZyBvZiBrZXlzIHNlcGFyYXRlZCBieSAnLicgc3VjaCBhcyAncGx1Z2luLmpxdWVyeS4wLm1lc3NhZ2UnXG4gKiAgICB3aGljaCB3b3VsZCBjb3JyZXNwb25kIHRvIDQyIGluIGB7cGx1Z2luOiB7anF1ZXJ5OiBbe21lc3NhZ2U6IDQyfV19fWBcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciByZXN1bHQgPSBvYmo7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdFtrZXlzW2ldXTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGxlbiA9PT0gMSkge1xuICAgIG9ialtrZXlzWzBdXSA9IHZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHZhciB0ZW1wID0gb2JqW2tleXNbMF1dIHx8IHt9O1xuICAgIHZhciByZXBsYWNlbWVudCA9IHRlbXA7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gLSAxOyArK2kpIHtcbiAgICAgIHRlbXBba2V5c1tpXV0gPSB0ZW1wW2tleXNbaV1dIHx8IHt9O1xuICAgICAgdGVtcCA9IHRlbXBba2V5c1tpXV07XG4gICAgfVxuICAgIHRlbXBba2V5c1tsZW4gLSAxXV0gPSB2YWx1ZTtcbiAgICBvYmpba2V5c1swXV0gPSByZXBsYWNlbWVudDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzQXNTdHJpbmcoYXJncykge1xuICB2YXIgaSwgbGVuLCBhcmc7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG4gICAgc3dpdGNoICh0eXBlTmFtZShhcmcpKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBhcmcgPSBzdHJpbmdpZnkoYXJnKTtcbiAgICAgICAgYXJnID0gYXJnLmVycm9yIHx8IGFyZy52YWx1ZTtcbiAgICAgICAgaWYgKGFyZy5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICBhcmcgPSBhcmcuc3Vic3RyKDAsIDQ5NykgKyAnLi4uJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bGwnOlxuICAgICAgICBhcmcgPSAnbnVsbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYXJnID0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChhcmcpO1xuICB9XG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIGlmIChEYXRlLm5vdykge1xuICAgIHJldHVybiArRGF0ZS5ub3coKTtcbiAgfVxuICByZXR1cm4gK25ldyBEYXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlcklwKHJlcXVlc3REYXRhLCBjYXB0dXJlSXApIHtcbiAgaWYgKCFyZXF1ZXN0RGF0YSB8fCAhcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSB8fCBjYXB0dXJlSXAgPT09IHRydWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld0lwID0gcmVxdWVzdERhdGFbJ3VzZXJfaXAnXTtcbiAgaWYgKCFjYXB0dXJlSXApIHtcbiAgICBuZXdJcCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBwYXJ0cztcbiAgICAgIGlmIChuZXdJcC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJy4nKTtcbiAgICAgICAgcGFydHMucG9wKCk7XG4gICAgICAgIHBhcnRzLnB1c2goJzAnKTtcbiAgICAgICAgbmV3SXAgPSBwYXJ0cy5qb2luKCcuJyk7XG4gICAgICB9IGVsc2UgaWYgKG5ld0lwLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnOicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMikge1xuICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBwYXJ0cy5zbGljZSgwLCAzKTtcbiAgICAgICAgICB2YXIgc2xhc2hJZHggPSBiZWdpbm5pbmdbMl0uaW5kZXhPZignLycpO1xuICAgICAgICAgIGlmIChzbGFzaElkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJlZ2lubmluZ1syXSA9IGJlZ2lubmluZ1syXS5zdWJzdHJpbmcoMCwgc2xhc2hJZHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGVybWluYWwgPSAnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwJztcbiAgICAgICAgICBuZXdJcCA9IGJlZ2lubmluZy5jb25jYXQodGVybWluYWwpLmpvaW4oJzonKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3SXAgPSBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ld0lwID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSA9IG5ld0lwO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkLCBsb2dnZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG1lcmdlKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkKTtcbiAgcmVzdWx0ID0gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMocmVzdWx0LCBsb2dnZXIpO1xuICBpZiAoIWlucHV0IHx8IGlucHV0Lm92ZXJ3cml0ZVNjcnViRmllbGRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoaW5wdXQuc2NydWJGaWVsZHMpIHtcbiAgICByZXN1bHQuc2NydWJGaWVsZHMgPSAoY3VycmVudC5zY3J1YkZpZWxkcyB8fCBbXSkuY29uY2F0KGlucHV0LnNjcnViRmllbGRzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgaWYgKG9wdGlvbnMuaG9zdFdoaXRlTGlzdCAmJiAhb3B0aW9ucy5ob3N0U2FmZUxpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RTYWZlTGlzdCA9IG9wdGlvbnMuaG9zdFdoaXRlTGlzdDtcbiAgICBvcHRpb25zLmhvc3RXaGl0ZUxpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RXaGl0ZUxpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RTYWZlTGlzdC4nKTtcbiAgfVxuICBpZiAob3B0aW9ucy5ob3N0QmxhY2tMaXN0ICYmICFvcHRpb25zLmhvc3RCbG9ja0xpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RCbG9ja0xpc3QgPSBvcHRpb25zLmhvc3RCbGFja0xpc3Q7XG4gICAgb3B0aW9ucy5ob3N0QmxhY2tMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0QmxhY2tMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0QmxvY2tMaXN0LicpO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGg6IGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoLFxuICBjcmVhdGVJdGVtOiBjcmVhdGVJdGVtLFxuICBhZGRFcnJvckNvbnRleHQ6IGFkZEVycm9yQ29udGV4dCxcbiAgY3JlYXRlVGVsZW1ldHJ5RXZlbnQ6IGNyZWF0ZVRlbGVtZXRyeUV2ZW50LFxuICBhZGRJdGVtQXR0cmlidXRlczogYWRkSXRlbUF0dHJpYnV0ZXMsXG4gIGZpbHRlcklwOiBmaWx0ZXJJcCxcbiAgZm9ybWF0QXJnc0FzU3RyaW5nOiBmb3JtYXRBcmdzQXNTdHJpbmcsXG4gIGZvcm1hdFVybDogZm9ybWF0VXJsLFxuICBnZXQ6IGdldCxcbiAgaGFuZGxlT3B0aW9uczogaGFuZGxlT3B0aW9ucyxcbiAgaXNFcnJvcjogaXNFcnJvcixcbiAgaXNGaW5pdGVOdW1iZXI6IGlzRmluaXRlTnVtYmVyLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc0l0ZXJhYmxlOiBpc0l0ZXJhYmxlLFxuICBpc05hdGl2ZUZ1bmN0aW9uOiBpc05hdGl2ZUZ1bmN0aW9uLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNUeXBlOiBpc1R5cGUsXG4gIGlzUHJvbWlzZTogaXNQcm9taXNlLFxuICBpc0Jyb3dzZXI6IGlzQnJvd3NlcixcbiAganNvblBhcnNlOiBqc29uUGFyc2UsXG4gIExFVkVMUzogTEVWRUxTLFxuICBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvOiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvLFxuICBtZXJnZTogbWVyZ2UsXG4gIG5vdzogbm93LFxuICByZWRhY3Q6IHJlZGFjdCxcbiAgUm9sbGJhckpTT046IFJvbGxiYXJKU09OLFxuICBzYW5pdGl6ZVVybDogc2FuaXRpemVVcmwsXG4gIHNldDogc2V0LFxuICBzZXR1cEpTT046IHNldHVwSlNPTixcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIG1heEJ5dGVTaXplOiBtYXhCeXRlU2l6ZSxcbiAgdHlwZU5hbWU6IHR5cGVOYW1lLFxuICB1dWlkNDogdXVpZDQsXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKG9iaiwgZnVuYywgc2Vlbikge1xuICB2YXIgaywgdiwgaTtcbiAgdmFyIGlzT2JqID0gXy5pc1R5cGUob2JqLCAnb2JqZWN0Jyk7XG4gIHZhciBpc0FycmF5ID0gXy5pc1R5cGUob2JqLCAnYXJyYXknKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNlZW5JbmRleDtcblxuICAvLyBCZXN0IG1pZ2h0IGJlIHRvIHVzZSBNYXAgaGVyZSB3aXRoIGBvYmpgIGFzIHRoZSBrZXlzLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0IElFIDwgMTEuXG4gIHNlZW4gPSBzZWVuIHx8IHsgb2JqOiBbXSwgbWFwcGVkOiBbXSB9O1xuXG4gIGlmIChpc09iaikge1xuICAgIHNlZW5JbmRleCA9IHNlZW4ub2JqLmluZGV4T2Yob2JqKTtcblxuICAgIGlmIChpc09iaiAmJiBzZWVuSW5kZXggIT09IC0xKSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIG1hcHBlZCBvYmplY3QgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgcmV0dXJuIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gfHwgc2Vlbi5vYmpbc2VlbkluZGV4XTtcbiAgICB9XG5cbiAgICBzZWVuLm9iai5wdXNoKG9iaik7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmoubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkge1xuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQXJyYXkpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgICBrZXlzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGlzT2JqID8ge30gOiBbXTtcbiAgdmFyIHNhbWUgPSB0cnVlO1xuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBrZXlzW2ldO1xuICAgIHYgPSBvYmpba107XG4gICAgcmVzdWx0W2tdID0gZnVuYyhrLCB2LCBzZWVuKTtcbiAgICBzYW1lID0gc2FtZSAmJiByZXN1bHRba10gPT09IG9ialtrXTtcbiAgfVxuXG4gIGlmIChpc09iaiAmJiAhc2FtZSkge1xuICAgIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gPSByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gIXNhbWUgPyByZXN1bHQgOiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2U7XG4iLCIvLyAganNvbjMuanNcbi8vICAyMDE3LTAyLTIxXG4vLyAgUHVibGljIERvbWFpbi5cbi8vICBOTyBXQVJSQU5UWSBFWFBSRVNTRUQgT1IgSU1QTElFRC4gVVNFIEFUIFlPVVIgT1dOIFJJU0suXG4vLyAgU2VlIGh0dHA6Ly93d3cuSlNPTi5vcmcvanMuaHRtbFxuLy8gIFRoaXMgY29kZSBzaG91bGQgYmUgbWluaWZpZWQgYmVmb3JlIGRlcGxveW1lbnQuXG4vLyAgU2VlIGh0dHA6Ly9qYXZhc2NyaXB0LmNyb2NrZm9yZC5jb20vanNtaW4uaHRtbFxuXG4vLyAgVVNFIFlPVVIgT1dOIENPUFkuIElUIElTIEVYVFJFTUVMWSBVTldJU0UgVE8gTE9BRCBDT0RFIEZST00gU0VSVkVSUyBZT1UgRE9cbi8vICBOT1QgQ09OVFJPTC5cblxuLy8gIFRoaXMgZmlsZSBjcmVhdGVzIGEgZ2xvYmFsIEpTT04gb2JqZWN0IGNvbnRhaW5pbmcgdHdvIG1ldGhvZHM6IHN0cmluZ2lmeVxuLy8gIGFuZCBwYXJzZS4gVGhpcyBmaWxlIHByb3ZpZGVzIHRoZSBFUzUgSlNPTiBjYXBhYmlsaXR5IHRvIEVTMyBzeXN0ZW1zLlxuLy8gIElmIGEgcHJvamVjdCBtaWdodCBydW4gb24gSUU4IG9yIGVhcmxpZXIsIHRoZW4gdGhpcyBmaWxlIHNob3VsZCBiZSBpbmNsdWRlZC5cbi8vICBUaGlzIGZpbGUgZG9lcyBub3RoaW5nIG9uIEVTNSBzeXN0ZW1zLlxuXG4vLyAgICAgIEpTT04uc3RyaW5naWZ5KHZhbHVlLCByZXBsYWNlciwgc3BhY2UpXG4vLyAgICAgICAgICB2YWx1ZSAgICAgICBhbnkgSmF2YVNjcmlwdCB2YWx1ZSwgdXN1YWxseSBhbiBvYmplY3Qgb3IgYXJyYXkuXG4vLyAgICAgICAgICByZXBsYWNlciAgICBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBkZXRlcm1pbmVzIGhvdyBvYmplY3Rcbi8vICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyBhcmUgc3RyaW5naWZpZWQgZm9yIG9iamVjdHMuIEl0IGNhbiBiZSBhXG4vLyAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBvciBhbiBhcnJheSBvZiBzdHJpbmdzLlxuLy8gICAgICAgICAgc3BhY2UgICAgICAgYW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgc3BlY2lmaWVzIHRoZSBpbmRlbnRhdGlvblxuLy8gICAgICAgICAgICAgICAgICAgICAgb2YgbmVzdGVkIHN0cnVjdHVyZXMuIElmIGl0IGlzIG9taXR0ZWQsIHRoZSB0ZXh0IHdpbGxcbi8vICAgICAgICAgICAgICAgICAgICAgIGJlIHBhY2tlZCB3aXRob3V0IGV4dHJhIHdoaXRlc3BhY2UuIElmIGl0IGlzIGEgbnVtYmVyLFxuLy8gICAgICAgICAgICAgICAgICAgICAgaXQgd2lsbCBzcGVjaWZ5IHRoZSBudW1iZXIgb2Ygc3BhY2VzIHRvIGluZGVudCBhdCBlYWNoXG4vLyAgICAgICAgICAgICAgICAgICAgICBsZXZlbC4gSWYgaXQgaXMgYSBzdHJpbmcgKHN1Y2ggYXMgXCJcXHRcIiBvciBcIiZuYnNwO1wiKSxcbi8vICAgICAgICAgICAgICAgICAgICAgIGl0IGNvbnRhaW5zIHRoZSBjaGFyYWN0ZXJzIHVzZWQgdG8gaW5kZW50IGF0IGVhY2ggbGV2ZWwuXG4vLyAgICAgICAgICBUaGlzIG1ldGhvZCBwcm9kdWNlcyBhIEpTT04gdGV4dCBmcm9tIGEgSmF2YVNjcmlwdCB2YWx1ZS5cbi8vICAgICAgICAgIFdoZW4gYW4gb2JqZWN0IHZhbHVlIGlzIGZvdW5kLCBpZiB0aGUgb2JqZWN0IGNvbnRhaW5zIGEgdG9KU09OXG4vLyAgICAgICAgICBtZXRob2QsIGl0cyB0b0pTT04gbWV0aG9kIHdpbGwgYmUgY2FsbGVkIGFuZCB0aGUgcmVzdWx0IHdpbGwgYmVcbi8vICAgICAgICAgIHN0cmluZ2lmaWVkLiBBIHRvSlNPTiBtZXRob2QgZG9lcyBub3Qgc2VyaWFsaXplOiBpdCByZXR1cm5zIHRoZVxuLy8gICAgICAgICAgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlIG5hbWUvdmFsdWUgcGFpciB0aGF0IHNob3VsZCBiZSBzZXJpYWxpemVkLFxuLy8gICAgICAgICAgb3IgdW5kZWZpbmVkIGlmIG5vdGhpbmcgc2hvdWxkIGJlIHNlcmlhbGl6ZWQuIFRoZSB0b0pTT04gbWV0aG9kXG4vLyAgICAgICAgICB3aWxsIGJlIHBhc3NlZCB0aGUga2V5IGFzc29jaWF0ZWQgd2l0aCB0aGUgdmFsdWUsIGFuZCB0aGlzIHdpbGwgYmVcbi8vICAgICAgICAgIGJvdW5kIHRvIHRoZSB2YWx1ZS5cblxuLy8gICAgICAgICAgRm9yIGV4YW1wbGUsIHRoaXMgd291bGQgc2VyaWFsaXplIERhdGVzIGFzIElTTyBzdHJpbmdzLlxuXG4vLyAgICAgICAgICAgICAgRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKGtleSkge1xuLy8gICAgICAgICAgICAgICAgICBmdW5jdGlvbiBmKG4pIHtcbi8vICAgICAgICAgICAgICAgICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4vLyAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG4gPCAxMClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiMFwiICsgblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgIDogbjtcbi8vICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVVENGdWxsWWVhcigpICAgKyBcIi1cIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArIFwiLVwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDRGF0ZSgpKSAgICAgICsgXCJUXCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENIb3VycygpKSAgICAgKyBcIjpcIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkgICArIFwiOlwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDU2Vjb25kcygpKSAgICsgXCJaXCI7XG4vLyAgICAgICAgICAgICAgfTtcblxuLy8gICAgICAgICAgWW91IGNhbiBwcm92aWRlIGFuIG9wdGlvbmFsIHJlcGxhY2VyIG1ldGhvZC4gSXQgd2lsbCBiZSBwYXNzZWQgdGhlXG4vLyAgICAgICAgICBrZXkgYW5kIHZhbHVlIG9mIGVhY2ggbWVtYmVyLCB3aXRoIHRoaXMgYm91bmQgdG8gdGhlIGNvbnRhaW5pbmdcbi8vICAgICAgICAgIG9iamVjdC4gVGhlIHZhbHVlIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSB5b3VyIG1ldGhvZCB3aWxsIGJlXG4vLyAgICAgICAgICBzZXJpYWxpemVkLiBJZiB5b3VyIG1ldGhvZCByZXR1cm5zIHVuZGVmaW5lZCwgdGhlbiB0aGUgbWVtYmVyIHdpbGxcbi8vICAgICAgICAgIGJlIGV4Y2x1ZGVkIGZyb20gdGhlIHNlcmlhbGl6YXRpb24uXG5cbi8vICAgICAgICAgIElmIHRoZSByZXBsYWNlciBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2Ygc3RyaW5ncywgdGhlbiBpdCB3aWxsIGJlXG4vLyAgICAgICAgICB1c2VkIHRvIHNlbGVjdCB0aGUgbWVtYmVycyB0byBiZSBzZXJpYWxpemVkLiBJdCBmaWx0ZXJzIHRoZSByZXN1bHRzXG4vLyAgICAgICAgICBzdWNoIHRoYXQgb25seSBtZW1iZXJzIHdpdGgga2V5cyBsaXN0ZWQgaW4gdGhlIHJlcGxhY2VyIGFycmF5IGFyZVxuLy8gICAgICAgICAgc3RyaW5naWZpZWQuXG5cbi8vICAgICAgICAgIFZhbHVlcyB0aGF0IGRvIG5vdCBoYXZlIEpTT04gcmVwcmVzZW50YXRpb25zLCBzdWNoIGFzIHVuZGVmaW5lZCBvclxuLy8gICAgICAgICAgZnVuY3Rpb25zLCB3aWxsIG5vdCBiZSBzZXJpYWxpemVkLiBTdWNoIHZhbHVlcyBpbiBvYmplY3RzIHdpbGwgYmVcbi8vICAgICAgICAgIGRyb3BwZWQ7IGluIGFycmF5cyB0aGV5IHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBudWxsLiBZb3UgY2FuIHVzZVxuLy8gICAgICAgICAgYSByZXBsYWNlciBmdW5jdGlvbiB0byByZXBsYWNlIHRob3NlIHdpdGggSlNPTiB2YWx1ZXMuXG5cbi8vICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHVuZGVmaW5lZCkgcmV0dXJucyB1bmRlZmluZWQuXG5cbi8vICAgICAgICAgIFRoZSBvcHRpb25hbCBzcGFjZSBwYXJhbWV0ZXIgcHJvZHVjZXMgYSBzdHJpbmdpZmljYXRpb24gb2YgdGhlXG4vLyAgICAgICAgICB2YWx1ZSB0aGF0IGlzIGZpbGxlZCB3aXRoIGxpbmUgYnJlYWtzIGFuZCBpbmRlbnRhdGlvbiB0byBtYWtlIGl0XG4vLyAgICAgICAgICBlYXNpZXIgdG8gcmVhZC5cblxuLy8gICAgICAgICAgSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG5vbi1lbXB0eSBzdHJpbmcsIHRoZW4gdGhhdCBzdHJpbmcgd2lsbFxuLy8gICAgICAgICAgYmUgdXNlZCBmb3IgaW5kZW50YXRpb24uIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBudW1iZXIsIHRoZW5cbi8vICAgICAgICAgIHRoZSBpbmRlbnRhdGlvbiB3aWxsIGJlIHRoYXQgbWFueSBzcGFjZXMuXG5cbi8vICAgICAgICAgIEV4YW1wbGU6XG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbXCJlXCIsIHtwbHVyaWJ1czogXCJ1bnVtXCJ9XSk7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXCJlXCIse1wicGx1cmlidXNcIjpcInVudW1cIn1dJ1xuXG4vLyAgICAgICAgICB0ZXh0ID0gSlNPTi5zdHJpbmdpZnkoW1wiZVwiLCB7cGx1cmlidXM6IFwidW51bVwifV0sIG51bGwsIFwiXFx0XCIpO1xuLy8gICAgICAgICAgLy8gdGV4dCBpcyAnW1xcblxcdFwiZVwiLFxcblxcdHtcXG5cXHRcXHRcInBsdXJpYnVzXCI6IFwidW51bVwiXFxuXFx0fVxcbl0nXG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbbmV3IERhdGUoKV0sIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgcmV0dXJuIHRoaXNba2V5XSBpbnN0YW5jZW9mIERhdGVcbi8vICAgICAgICAgICAgICAgICAgPyBcIkRhdGUoXCIgKyB0aGlzW2tleV0gKyBcIilcIlxuLy8gICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuLy8gICAgICAgICAgfSk7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXCJEYXRlKC0tLWN1cnJlbnQgdGltZS0tLSlcIl0nXG5cbi8vICAgICAgSlNPTi5wYXJzZSh0ZXh0LCByZXZpdmVyKVxuLy8gICAgICAgICAgVGhpcyBtZXRob2QgcGFyc2VzIGEgSlNPTiB0ZXh0IHRvIHByb2R1Y2UgYW4gb2JqZWN0IG9yIGFycmF5LlxuLy8gICAgICAgICAgSXQgY2FuIHRocm93IGEgU3ludGF4RXJyb3IgZXhjZXB0aW9uLlxuLy8gICAgICAgICAgVGhpcyBoYXMgYmVlbiBtb2RpZmllZCB0byB1c2UgSlNPTi1qcy9qc29uX3BhcnNlX3N0YXRlLmpzIGFzIHRoZVxuLy8gICAgICAgICAgcGFyc2VyIGluc3RlYWQgb2YgdGhlIG9uZSBidWlsdCBhcm91bmQgZXZhbCBmb3VuZCBpbiBKU09OLWpzL2pzb24yLmpzXG5cbi8vICAgICAgICAgIFRoZSBvcHRpb25hbCByZXZpdmVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGZpbHRlciBhbmRcbi8vICAgICAgICAgIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy4gSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLFxuLy8gICAgICAgICAgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbi8vICAgICAgICAgIElmIGl0IHJldHVybnMgd2hhdCBpdCByZWNlaXZlZCwgdGhlbiB0aGUgc3RydWN0dXJlIGlzIG5vdCBtb2RpZmllZC5cbi8vICAgICAgICAgIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpcyBkZWxldGVkLlxuXG4vLyAgICAgICAgICBFeGFtcGxlOlxuXG4vLyAgICAgICAgICAvLyBQYXJzZSB0aGUgdGV4dC4gVmFsdWVzIHRoYXQgbG9vayBsaWtlIElTTyBkYXRlIHN0cmluZ3Mgd2lsbFxuLy8gICAgICAgICAgLy8gYmUgY29udmVydGVkIHRvIERhdGUgb2JqZWN0cy5cblxuLy8gICAgICAgICAgbXlEYXRhID0gSlNPTi5wYXJzZSh0ZXh0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgIHZhciBhO1xuLy8gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbi8vICAgICAgICAgICAgICAgICAgYSA9XG4vLyAgIC9eKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSg/OlxcLlxcZCopPylaJC8uZXhlYyh2YWx1ZSk7XG4vLyAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoK2FbMV0sICthWzJdIC0gMSwgK2FbM10sICthWzRdLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICthWzVdLCArYVs2XSkpO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbi8vICAgICAgICAgIH0pO1xuXG4vLyAgICAgICAgICBteURhdGEgPSBKU09OLnBhcnNlKCdbXCJEYXRlKDA5LzA5LzIwMDEpXCJdJywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICB2YXIgZDtcbi8vICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmXG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgwLCA1KSA9PT0gXCJEYXRlKFwiICYmXG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgtMSkgPT09IFwiKVwiKSB7XG4vLyAgICAgICAgICAgICAgICAgIGQgPSBuZXcgRGF0ZSh2YWx1ZS5zbGljZSg1LCAtMSkpO1xuLy8gICAgICAgICAgICAgICAgICBpZiAoZCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQ7XG4vLyAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuLy8gICAgICAgICAgfSk7XG5cbi8vICBUaGlzIGlzIGEgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLiBZb3UgYXJlIGZyZWUgdG8gY29weSwgbW9kaWZ5LCBvclxuLy8gIHJlZGlzdHJpYnV0ZS5cblxuLypqc2xpbnRcbiAgZm9yLCB0aGlzXG4gICovXG5cbi8qcHJvcGVydHlcbiAgSlNPTiwgYXBwbHksIGNhbGwsIGNoYXJDb2RlQXQsIGdldFVUQ0RhdGUsIGdldFVUQ0Z1bGxZZWFyLCBnZXRVVENIb3VycyxcbiAgZ2V0VVRDTWludXRlcywgZ2V0VVRDTW9udGgsIGdldFVUQ1NlY29uZHMsIGhhc093blByb3BlcnR5LCBqb2luLFxuICBsYXN0SW5kZXgsIGxlbmd0aCwgcGFyc2UsIHByb3RvdHlwZSwgcHVzaCwgcmVwbGFjZSwgc2xpY2UsIHN0cmluZ2lmeSxcbiAgdGVzdCwgdG9KU09OLCB0b1N0cmluZywgdmFsdWVPZlxuICAqL1xuXG52YXIgc2V0dXBDdXN0b21KU09OID0gZnVuY3Rpb24oSlNPTikge1xuXG4gIHZhciByeF9vbmUgPSAvXltcXF0sOnt9XFxzXSokLztcbiAgdmFyIHJ4X3R3byA9IC9cXFxcKD86W1wiXFxcXFxcL2JmbnJ0XXx1WzAtOWEtZkEtRl17NH0pL2c7XG4gIHZhciByeF90aHJlZSA9IC9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZztcbiAgdmFyIHJ4X2ZvdXIgPSAvKD86Xnw6fCwpKD86XFxzKlxcWykrL2c7XG4gIHZhciByeF9lc2NhcGFibGUgPSAvW1xcXFxcIlxcdTAwMDAtXFx1MDAxZlxcdTAwN2YtXFx1MDA5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuICB2YXIgcnhfZGFuZ2Vyb3VzID0gL1tcXHUwMDAwXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG5cbiAgZnVuY3Rpb24gZihuKSB7XG4gICAgLy8gRm9ybWF0IGludGVnZXJzIHRvIGhhdmUgYXQgbGVhc3QgdHdvIGRpZ2l0cy5cbiAgICByZXR1cm4gbiA8IDEwXG4gICAgICA/IFwiMFwiICsgblxuICAgICAgOiBuO1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpc192YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZU9mKCk7XG4gIH1cblxuICBpZiAodHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiAhPT0gXCJmdW5jdGlvblwiKSB7XG5cbiAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHJldHVybiBpc0Zpbml0ZSh0aGlzLnZhbHVlT2YoKSlcbiAgICAgICAgPyB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgKyBcIi1cIiArXG4gICAgICAgIGYodGhpcy5nZXRVVENNb250aCgpICsgMSkgKyBcIi1cIiArXG4gICAgICAgIGYodGhpcy5nZXRVVENEYXRlKCkpICsgXCJUXCIgK1xuICAgICAgICBmKHRoaXMuZ2V0VVRDSG91cnMoKSkgKyBcIjpcIiArXG4gICAgICAgIGYodGhpcy5nZXRVVENNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICAgICBmKHRoaXMuZ2V0VVRDU2Vjb25kcygpKSArIFwiWlwiXG4gICAgICAgIDogbnVsbDtcbiAgICB9O1xuXG4gICAgQm9vbGVhbi5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZTtcbiAgICBOdW1iZXIucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWU7XG4gICAgU3RyaW5nLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlO1xuICB9XG5cbiAgdmFyIGdhcDtcbiAgdmFyIGluZGVudDtcbiAgdmFyIG1ldGE7XG4gIHZhciByZXA7XG5cblxuICBmdW5jdGlvbiBxdW90ZShzdHJpbmcpIHtcblxuICAgIC8vIElmIHRoZSBzdHJpbmcgY29udGFpbnMgbm8gY29udHJvbCBjaGFyYWN0ZXJzLCBubyBxdW90ZSBjaGFyYWN0ZXJzLCBhbmQgbm9cbiAgICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxuICAgIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAgIC8vIHNlcXVlbmNlcy5cblxuICAgIHJ4X2VzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiByeF9lc2NhcGFibGUudGVzdChzdHJpbmcpXG4gICAgICA/IFwiXFxcIlwiICsgc3RyaW5nLnJlcGxhY2UocnhfZXNjYXBhYmxlLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICB2YXIgYyA9IG1ldGFbYV07XG4gICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgID8gY1xuICAgICAgICAgIDogXCJcXFxcdVwiICsgKFwiMDAwMFwiICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgfSkgKyBcIlxcXCJcIlxuICAgIDogXCJcXFwiXCIgKyBzdHJpbmcgKyBcIlxcXCJcIjtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gc3RyKGtleSwgaG9sZGVyKSB7XG5cbiAgICAvLyBQcm9kdWNlIGEgc3RyaW5nIGZyb20gaG9sZGVyW2tleV0uXG5cbiAgICB2YXIgaTsgICAgICAgICAgLy8gVGhlIGxvb3AgY291bnRlci5cbiAgICB2YXIgazsgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXG4gICAgdmFyIHY7ICAgICAgICAgIC8vIFRoZSBtZW1iZXIgdmFsdWUuXG4gICAgdmFyIGxlbmd0aDtcbiAgICB2YXIgbWluZCA9IGdhcDtcbiAgICB2YXIgcGFydGlhbDtcbiAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAgIC8vIElmIHRoZSB2YWx1ZSBoYXMgYSB0b0pTT04gbWV0aG9kLCBjYWxsIGl0IHRvIG9idGFpbiBhIHJlcGxhY2VtZW50IHZhbHVlLlxuXG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICB0eXBlb2YgdmFsdWUudG9KU09OID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKGtleSk7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2VyZSBjYWxsZWQgd2l0aCBhIHJlcGxhY2VyIGZ1bmN0aW9uLCB0aGVuIGNhbGwgdGhlIHJlcGxhY2VyIHRvXG4gICAgLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICBpZiAodHlwZW9mIHJlcCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YWx1ZSA9IHJlcC5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gV2hhdCBoYXBwZW5zIG5leHQgZGVwZW5kcyBvbiB0aGUgdmFsdWUncyB0eXBlLlxuXG4gICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgcmV0dXJuIHF1b3RlKHZhbHVlKTtcblxuICAgICAgY2FzZSBcIm51bWJlclwiOlxuXG4gICAgICAgIC8vIEpTT04gbnVtYmVycyBtdXN0IGJlIGZpbml0ZS4gRW5jb2RlIG5vbi1maW5pdGUgbnVtYmVycyBhcyBudWxsLlxuXG4gICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSlcbiAgICAgICAgICA/IFN0cmluZyh2YWx1ZSlcbiAgICAgICAgICA6IFwibnVsbFwiO1xuXG4gICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgY2FzZSBcIm51bGxcIjpcblxuICAgICAgICAvLyBJZiB0aGUgdmFsdWUgaXMgYSBib29sZWFuIG9yIG51bGwsIGNvbnZlcnQgaXQgdG8gYSBzdHJpbmcuIE5vdGU6XG4gICAgICAgIC8vIHR5cGVvZiBudWxsIGRvZXMgbm90IHByb2R1Y2UgXCJudWxsXCIuIFRoZSBjYXNlIGlzIGluY2x1ZGVkIGhlcmUgaW5cbiAgICAgICAgLy8gdGhlIHJlbW90ZSBjaGFuY2UgdGhhdCB0aGlzIGdldHMgZml4ZWQgc29tZWRheS5cblxuICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcblxuICAgICAgICAvLyBJZiB0aGUgdHlwZSBpcyBcIm9iamVjdFwiLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXG4gICAgICAgIC8vIG51bGwuXG5cbiAgICAgIGNhc2UgXCJvYmplY3RcIjpcblxuICAgICAgICAvLyBEdWUgdG8gYSBzcGVjaWZpY2F0aW9uIGJsdW5kZXIgaW4gRUNNQVNjcmlwdCwgdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIixcbiAgICAgICAgLy8gc28gd2F0Y2ggb3V0IGZvciB0aGF0IGNhc2UuXG5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2UgYW4gYXJyYXkgdG8gaG9sZCB0aGUgcGFydGlhbCByZXN1bHRzIG9mIHN0cmluZ2lmeWluZyB0aGlzIG9iamVjdCB2YWx1ZS5cblxuICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICBwYXJ0aWFsID0gW107XG5cbiAgICAgICAgLy8gSXMgdGhlIHZhbHVlIGFuIGFycmF5P1xuXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG5cbiAgICAgICAgICAvLyBUaGUgdmFsdWUgaXMgYW4gYXJyYXkuIFN0cmluZ2lmeSBldmVyeSBlbGVtZW50LiBVc2UgbnVsbCBhcyBhIHBsYWNlaG9sZGVyXG4gICAgICAgICAgLy8gZm9yIG5vbi1KU09OIHZhbHVlcy5cblxuICAgICAgICAgIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHBhcnRpYWxbaV0gPSBzdHIoaSwgdmFsdWUpIHx8IFwibnVsbFwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEpvaW4gYWxsIG9mIHRoZSBlbGVtZW50cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLCBhbmQgd3JhcCB0aGVtIGluXG4gICAgICAgICAgLy8gYnJhY2tldHMuXG5cbiAgICAgICAgICB2ID0gcGFydGlhbC5sZW5ndGggPT09IDBcbiAgICAgICAgICAgID8gXCJbXVwiXG4gICAgICAgICAgICA6IGdhcFxuICAgICAgICAgICAgPyBcIltcXG5cIiArIGdhcCArIHBhcnRpYWwuam9pbihcIixcXG5cIiArIGdhcCkgKyBcIlxcblwiICsgbWluZCArIFwiXVwiXG4gICAgICAgICAgICA6IFwiW1wiICsgcGFydGlhbC5qb2luKFwiLFwiKSArIFwiXVwiO1xuICAgICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgcmVwbGFjZXIgaXMgYW4gYXJyYXksIHVzZSBpdCB0byBzZWxlY3QgdGhlIG1lbWJlcnMgdG8gYmUgc3RyaW5naWZpZWQuXG5cbiAgICAgICAgaWYgKHJlcCAmJiB0eXBlb2YgcmVwID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgbGVuZ3RoID0gcmVwLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwW2ldID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgIGsgPSByZXBbaV07XG4gICAgICAgICAgICAgIHYgPSBzdHIoaywgdmFsdWUpO1xuICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChcbiAgICAgICAgICAgICAgICAgICAgICBnYXBcbiAgICAgICAgICAgICAgICAgICAgICA/IFwiOiBcIlxuICAgICAgICAgICAgICAgICAgICAgIDogXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgICApICsgdik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cblxuICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgcGFydGlhbC5wdXNoKHF1b3RlKGspICsgKFxuICAgICAgICAgICAgICAgICAgICAgIGdhcFxuICAgICAgICAgICAgICAgICAgICAgID8gXCI6IFwiXG4gICAgICAgICAgICAgICAgICAgICAgOiBcIjpcIlxuICAgICAgICAgICAgICAgICAgICAgICkgKyB2KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEpvaW4gYWxsIG9mIHRoZSBtZW1iZXIgdGV4dHMgdG9nZXRoZXIsIHNlcGFyYXRlZCB3aXRoIGNvbW1hcyxcbiAgICAgICAgLy8gYW5kIHdyYXAgdGhlbSBpbiBicmFjZXMuXG5cbiAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwXG4gICAgICAgICAgPyBcInt9XCJcbiAgICAgICAgICA6IGdhcFxuICAgICAgICAgID8gXCJ7XFxuXCIgKyBnYXAgKyBwYXJ0aWFsLmpvaW4oXCIsXFxuXCIgKyBnYXApICsgXCJcXG5cIiArIG1pbmQgKyBcIn1cIlxuICAgICAgICAgIDogXCJ7XCIgKyBwYXJ0aWFsLmpvaW4oXCIsXCIpICsgXCJ9XCI7XG4gICAgICAgIGdhcCA9IG1pbmQ7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHN0cmluZ2lmeSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gIGlmICh0eXBlb2YgSlNPTi5zdHJpbmdpZnkgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICBcIlxcYlwiOiBcIlxcXFxiXCIsXG4gICAgICBcIlxcdFwiOiBcIlxcXFx0XCIsXG4gICAgICBcIlxcblwiOiBcIlxcXFxuXCIsXG4gICAgICBcIlxcZlwiOiBcIlxcXFxmXCIsXG4gICAgICBcIlxcclwiOiBcIlxcXFxyXCIsXG4gICAgICBcIlxcXCJcIjogXCJcXFxcXFxcIlwiLFxuICAgICAgXCJcXFxcXCI6IFwiXFxcXFxcXFxcIlxuICAgIH07XG4gICAgSlNPTi5zdHJpbmdpZnkgPSBmdW5jdGlvbiAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuXG4gICAgICAvLyBUaGUgc3RyaW5naWZ5IG1ldGhvZCB0YWtlcyBhIHZhbHVlIGFuZCBhbiBvcHRpb25hbCByZXBsYWNlciwgYW5kIGFuIG9wdGlvbmFsXG4gICAgICAvLyBzcGFjZSBwYXJhbWV0ZXIsIGFuZCByZXR1cm5zIGEgSlNPTiB0ZXh0LiBUaGUgcmVwbGFjZXIgY2FuIGJlIGEgZnVuY3Rpb25cbiAgICAgIC8vIHRoYXQgY2FuIHJlcGxhY2UgdmFsdWVzLCBvciBhbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgd2lsbCBzZWxlY3QgdGhlIGtleXMuXG4gICAgICAvLyBBIGRlZmF1bHQgcmVwbGFjZXIgbWV0aG9kIGNhbiBiZSBwcm92aWRlZC4gVXNlIG9mIHRoZSBzcGFjZSBwYXJhbWV0ZXIgY2FuXG4gICAgICAvLyBwcm9kdWNlIHRleHQgdGhhdCBpcyBtb3JlIGVhc2lseSByZWFkYWJsZS5cblxuICAgICAgdmFyIGk7XG4gICAgICBnYXAgPSBcIlwiO1xuICAgICAgaW5kZW50ID0gXCJcIjtcblxuICAgICAgLy8gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgbWFrZSBhbiBpbmRlbnQgc3RyaW5nIGNvbnRhaW5pbmcgdGhhdFxuICAgICAgLy8gbWFueSBzcGFjZXMuXG5cbiAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHNwYWNlOyBpICs9IDEpIHtcbiAgICAgICAgICBpbmRlbnQgKz0gXCIgXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgc3RyaW5nLCBpdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGluZGVudCBzdHJpbmcuXG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGluZGVudCA9IHNwYWNlO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGVyZSBpcyBhIHJlcGxhY2VyLCBpdCBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXkuXG4gICAgICAvLyBPdGhlcndpc2UsIHRocm93IGFuIGVycm9yLlxuXG4gICAgICByZXAgPSByZXBsYWNlcjtcbiAgICAgIGlmIChyZXBsYWNlciAmJiB0eXBlb2YgcmVwbGFjZXIgIT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICAgICh0eXBlb2YgcmVwbGFjZXIgIT09IFwib2JqZWN0XCIgfHxcbiAgICAgICAgICAgdHlwZW9mIHJlcGxhY2VyLmxlbmd0aCAhPT0gXCJudW1iZXJcIikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSlNPTi5zdHJpbmdpZnlcIik7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgYSBmYWtlIHJvb3Qgb2JqZWN0IGNvbnRhaW5pbmcgb3VyIHZhbHVlIHVuZGVyIHRoZSBrZXkgb2YgXCJcIi5cbiAgICAgIC8vIFJldHVybiB0aGUgcmVzdWx0IG9mIHN0cmluZ2lmeWluZyB0aGUgdmFsdWUuXG5cbiAgICAgIHJldHVybiBzdHIoXCJcIiwge1wiXCI6IHZhbHVlfSk7XG4gICAgfTtcbiAgfVxuXG5cbiAgLy8gSWYgdGhlIEpTT04gb2JqZWN0IGRvZXMgbm90IHlldCBoYXZlIGEgcGFyc2UgbWV0aG9kLCBnaXZlIGl0IG9uZS5cblxuICBpZiAodHlwZW9mIEpTT04ucGFyc2UgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIEpTT04ucGFyc2UgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgICAvLyBUaGlzIGZ1bmN0aW9uIGNyZWF0ZXMgYSBKU09OIHBhcnNlIGZ1bmN0aW9uIHRoYXQgdXNlcyBhIHN0YXRlIG1hY2hpbmUgcmF0aGVyXG4gICAgICAvLyB0aGFuIHRoZSBkYW5nZXJvdXMgZXZhbCBmdW5jdGlvbiB0byBwYXJzZSBhIEpTT04gdGV4dC5cblxuICAgICAgdmFyIHN0YXRlOyAgICAgIC8vIFRoZSBzdGF0ZSBvZiB0aGUgcGFyc2VyLCBvbmUgb2ZcbiAgICAgIC8vICdnbycgICAgICAgICBUaGUgc3RhcnRpbmcgc3RhdGVcbiAgICAgIC8vICdvaycgICAgICAgICBUaGUgZmluYWwsIGFjY2VwdGluZyBzdGF0ZVxuICAgICAgLy8gJ2ZpcnN0b2tleScgIFJlYWR5IGZvciB0aGUgZmlyc3Qga2V5IG9mIHRoZSBvYmplY3Qgb3JcbiAgICAgIC8vICAgICAgICAgICAgICB0aGUgY2xvc2luZyBvZiBhbiBlbXB0eSBvYmplY3RcbiAgICAgIC8vICdva2V5JyAgICAgICBSZWFkeSBmb3IgdGhlIG5leHQga2V5IG9mIHRoZSBvYmplY3RcbiAgICAgIC8vICdjb2xvbicgICAgICBSZWFkeSBmb3IgdGhlIGNvbG9uXG4gICAgICAvLyAnb3ZhbHVlJyAgICAgUmVhZHkgZm9yIHRoZSB2YWx1ZSBoYWxmIG9mIGEga2V5L3ZhbHVlIHBhaXJcbiAgICAgIC8vICdvY29tbWEnICAgICBSZWFkeSBmb3IgYSBjb21tYSBvciBjbG9zaW5nIH1cbiAgICAgIC8vICdmaXJzdGF2YWx1ZScgUmVhZHkgZm9yIHRoZSBmaXJzdCB2YWx1ZSBvZiBhbiBhcnJheSBvclxuICAgICAgLy8gICAgICAgICAgICAgIGFuIGVtcHR5IGFycmF5XG4gICAgICAvLyAnYXZhbHVlJyAgICAgUmVhZHkgZm9yIHRoZSBuZXh0IHZhbHVlIG9mIGFuIGFycmF5XG4gICAgICAvLyAnYWNvbW1hJyAgICAgUmVhZHkgZm9yIGEgY29tbWEgb3IgY2xvc2luZyBdXG4gICAgICB2YXIgc3RhY2s7ICAgICAgLy8gVGhlIHN0YWNrLCBmb3IgY29udHJvbGxpbmcgbmVzdGluZy5cbiAgICAgIHZhciBjb250YWluZXI7ICAvLyBUaGUgY3VycmVudCBjb250YWluZXIgb2JqZWN0IG9yIGFycmF5XG4gICAgICB2YXIga2V5OyAgICAgICAgLy8gVGhlIGN1cnJlbnQga2V5XG4gICAgICB2YXIgdmFsdWU7ICAgICAgLy8gVGhlIGN1cnJlbnQgdmFsdWVcbiAgICAgIHZhciBlc2NhcGVzID0geyAvLyBFc2NhcGVtZW50IHRyYW5zbGF0aW9uIHRhYmxlXG4gICAgICAgIFwiXFxcXFwiOiBcIlxcXFxcIixcbiAgICAgICAgXCJcXFwiXCI6IFwiXFxcIlwiLFxuICAgICAgICBcIi9cIjogXCIvXCIsXG4gICAgICAgIFwidFwiOiBcIlxcdFwiLFxuICAgICAgICBcIm5cIjogXCJcXG5cIixcbiAgICAgICAgXCJyXCI6IFwiXFxyXCIsXG4gICAgICAgIFwiZlwiOiBcIlxcZlwiLFxuICAgICAgICBcImJcIjogXCJcXGJcIlxuICAgICAgfTtcbiAgICAgIHZhciBzdHJpbmcgPSB7ICAgLy8gVGhlIGFjdGlvbnMgZm9yIHN0cmluZyB0b2tlbnNcbiAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwib2tcIjtcbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3Rva2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAga2V5ID0gdmFsdWU7XG4gICAgICAgICAgc3RhdGUgPSBcImNvbG9uXCI7XG4gICAgICAgIH0sXG4gICAgICAgIG9rZXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBrZXkgPSB2YWx1ZTtcbiAgICAgICAgICBzdGF0ZSA9IFwiY29sb25cIjtcbiAgICAgICAgfSxcbiAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcIm9jb21tYVwiO1xuICAgICAgICB9LFxuICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgfSxcbiAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIG51bWJlciA9IHsgICAvLyBUaGUgYWN0aW9ucyBmb3IgbnVtYmVyIHRva2Vuc1xuICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHN0YXRlID0gXCJva1wiO1xuICAgICAgICB9LFxuICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwib2NvbW1hXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICB9LFxuICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgYWN0aW9uID0ge1xuXG4gICAgICAgIC8vIFRoZSBhY3Rpb24gdGFibGUgZGVzY3JpYmVzIHRoZSBiZWhhdmlvciBvZiB0aGUgbWFjaGluZS4gSXQgY29udGFpbnMgYW5cbiAgICAgICAgLy8gb2JqZWN0IGZvciBlYWNoIHRva2VuLiBFYWNoIG9iamVjdCBjb250YWlucyBhIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCB3aGVuXG4gICAgICAgIC8vIGEgdG9rZW4gaXMgbWF0Y2hlZCBpbiBhIHN0YXRlLiBBbiBvYmplY3Qgd2lsbCBsYWNrIGEgbWV0aG9kIGZvciBpbGxlZ2FsXG4gICAgICAgIC8vIHN0YXRlcy5cblxuICAgICAgICBcIntcIjoge1xuICAgICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtzdGF0ZTogXCJva1wifSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSB7fTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdG9rZXlcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7Y29udGFpbmVyOiBjb250YWluZXIsIHN0YXRlOiBcIm9jb21tYVwiLCBrZXk6IGtleX0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0ge307XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3Rva2V5XCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7Y29udGFpbmVyOiBjb250YWluZXIsIHN0YXRlOiBcImFjb21tYVwifSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSB7fTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdG9rZXlcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7Y29udGFpbmVyOiBjb250YWluZXIsIHN0YXRlOiBcImFjb21tYVwifSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSB7fTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdG9rZXlcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwifVwiOiB7XG4gICAgICAgICAgZmlyc3Rva2V5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcG9wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHBvcC5jb250YWluZXI7XG4gICAgICAgICAgICBrZXkgPSBwb3Aua2V5O1xuICAgICAgICAgICAgc3RhdGUgPSBwb3Auc3RhdGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvY29tbWE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwb3AgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHBvcC5jb250YWluZXI7XG4gICAgICAgICAgICBrZXkgPSBwb3Aua2V5O1xuICAgICAgICAgICAgc3RhdGUgPSBwb3Auc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIltcIjoge1xuICAgICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtzdGF0ZTogXCJva1wifSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSBbXTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdGF2YWx1ZVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgb3ZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKHtjb250YWluZXI6IGNvbnRhaW5lciwgc3RhdGU6IFwib2NvbW1hXCIsIGtleToga2V5fSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSBbXTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdGF2YWx1ZVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goe2NvbnRhaW5lcjogY29udGFpbmVyLCBzdGF0ZTogXCJhY29tbWFcIn0pO1xuICAgICAgICAgICAgY29udGFpbmVyID0gW107XG4gICAgICAgICAgICBzdGF0ZSA9IFwiZmlyc3RhdmFsdWVcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3RhY2sucHVzaCh7Y29udGFpbmVyOiBjb250YWluZXIsIHN0YXRlOiBcImFjb21tYVwifSk7XG4gICAgICAgICAgICBjb250YWluZXIgPSBbXTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJmaXJzdGF2YWx1ZVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJdXCI6IHtcbiAgICAgICAgICBmaXJzdGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHBvcCA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgdmFsdWUgPSBjb250YWluZXI7XG4gICAgICAgICAgICBjb250YWluZXIgPSBwb3AuY29udGFpbmVyO1xuICAgICAgICAgICAga2V5ID0gcG9wLmtleTtcbiAgICAgICAgICAgIHN0YXRlID0gcG9wLnN0YXRlO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWNvbW1hOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcG9wID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBjb250YWluZXIucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHBvcC5jb250YWluZXI7XG4gICAgICAgICAgICBrZXkgPSBwb3Aua2V5O1xuICAgICAgICAgICAgc3RhdGUgPSBwb3Auc3RhdGU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIjpcIjoge1xuICAgICAgICAgIGNvbG9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoY29udGFpbmVyLCBrZXkpKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkR1cGxpY2F0ZSBrZXkgJ1wiICsga2V5ICsgXCJcXFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGUgPSBcIm92YWx1ZVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCIsXCI6IHtcbiAgICAgICAgICBvY29tbWE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gdmFsdWU7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2tleVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYWNvbW1hOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250YWluZXIucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYXZhbHVlXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRydWVcIjoge1xuICAgICAgICAgIGdvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2tcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9jb21tYVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmlyc3RhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJmYWxzZVwiOiB7XG4gICAgICAgICAgZ286IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBzdGF0ZSA9IFwib2tcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIG92YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHN0YXRlID0gXCJvY29tbWFcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgc3RhdGUgPSBcImFjb21tYVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJudWxsXCI6IHtcbiAgICAgICAgICBnbzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgc3RhdGUgPSBcIm9rXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBvdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHN0YXRlID0gXCJvY29tbWFcIjtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpcnN0YXZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiYWNvbW1hXCI7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIHN0YXRlID0gXCJhY29tbWFcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIGRlYmFja3NsYXNoaWZ5KHRleHQpIHtcblxuICAgICAgICAvLyBSZW1vdmUgYW5kIHJlcGxhY2UgYW55IGJhY2tzbGFzaCBlc2NhcGVtZW50LlxuXG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFwoPzp1KC57NH0pfChbXnVdKSkvZywgZnVuY3Rpb24gKGlnbm9yZSwgYiwgYykge1xuICAgICAgICAgIHJldHVybiBiXG4gICAgICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoYiwgMTYpKVxuICAgICAgICAgICAgOiBlc2NhcGVzW2NdO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzb3VyY2UsIHJldml2ZXIpIHtcblxuICAgICAgICAvLyBBIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyB1c2VkIHRvIGV4dHJhY3QgdG9rZW5zIGZyb20gdGhlIEpTT04gdGV4dC5cbiAgICAgICAgLy8gVGhlIGV4dHJhY3Rpb24gcHJvY2VzcyBpcyBjYXV0aW91cy5cblxuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICB2YXIgdHggPSAvXltcXHUwMDIwXFx0XFxuXFxyXSooPzooWyw6XFxbXFxde31dfHRydWV8ZmFsc2V8bnVsbCl8KC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/KXxcIigoPzpbXlxcclxcblxcdFxcXFxcXFwiXXxcXFxcKD86W1wiXFxcXFxcL3RybmZiXXx1WzAtOWEtZkEtRl17NH0pKSopXCIpLztcblxuICAgICAgICAvLyBTZXQgdGhlIHN0YXJ0aW5nIHN0YXRlLlxuXG4gICAgICAgIHN0YXRlID0gXCJnb1wiO1xuXG4gICAgICAgIC8vIFRoZSBzdGFjayByZWNvcmRzIHRoZSBjb250YWluZXIsIGtleSwgYW5kIHN0YXRlIGZvciBlYWNoIG9iamVjdCBvciBhcnJheVxuICAgICAgICAvLyB0aGF0IGNvbnRhaW5zIGFub3RoZXIgb2JqZWN0IG9yIGFycmF5IHdoaWxlIHByb2Nlc3NpbmcgbmVzdGVkIHN0cnVjdHVyZXMuXG5cbiAgICAgICAgc3RhY2sgPSBbXTtcblxuICAgICAgICAvLyBJZiBhbnkgZXJyb3Igb2NjdXJzLCB3ZSB3aWxsIGNhdGNoIGl0IGFuZCB1bHRpbWF0ZWx5IHRocm93IGEgc3ludGF4IGVycm9yLlxuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAvLyBGb3IgZWFjaCB0b2tlbi4uLlxuXG4gICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHR4LmV4ZWMoc291cmNlKTtcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXN1bHQgaXMgdGhlIHJlc3VsdCBhcnJheSBmcm9tIG1hdGNoaW5nIHRoZSB0b2tlbml6aW5nIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgICAgICAgIC8vICByZXN1bHRbMF0gY29udGFpbnMgZXZlcnl0aGluZyB0aGF0IG1hdGNoZWQsIGluY2x1ZGluZyBhbnkgaW5pdGlhbCB3aGl0ZXNwYWNlLlxuICAgICAgICAgICAgLy8gIHJlc3VsdFsxXSBjb250YWlucyBhbnkgcHVuY3R1YXRpb24gdGhhdCB3YXMgbWF0Y2hlZCwgb3IgdHJ1ZSwgZmFsc2UsIG9yIG51bGwuXG4gICAgICAgICAgICAvLyAgcmVzdWx0WzJdIGNvbnRhaW5zIGEgbWF0Y2hlZCBudW1iZXIsIHN0aWxsIGluIHN0cmluZyBmb3JtLlxuICAgICAgICAgICAgLy8gIHJlc3VsdFszXSBjb250YWlucyBhIG1hdGNoZWQgc3RyaW5nLCB3aXRob3V0IHF1b3RlcyBidXQgd2l0aCBlc2NhcGVtZW50LlxuXG4gICAgICAgICAgICBpZiAocmVzdWx0WzFdKSB7XG5cbiAgICAgICAgICAgICAgLy8gVG9rZW46IEV4ZWN1dGUgdGhlIGFjdGlvbiBmb3IgdGhpcyBzdGF0ZSBhbmQgdG9rZW4uXG5cbiAgICAgICAgICAgICAgYWN0aW9uW3Jlc3VsdFsxXV1bc3RhdGVdKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0WzJdKSB7XG5cbiAgICAgICAgICAgICAgLy8gTnVtYmVyIHRva2VuOiBDb252ZXJ0IHRoZSBudW1iZXIgc3RyaW5nIGludG8gYSBudW1iZXIgdmFsdWUgYW5kIGV4ZWN1dGVcbiAgICAgICAgICAgICAgLy8gdGhlIGFjdGlvbiBmb3IgdGhpcyBzdGF0ZSBhbmQgbnVtYmVyLlxuXG4gICAgICAgICAgICAgIHZhbHVlID0gK3Jlc3VsdFsyXTtcbiAgICAgICAgICAgICAgbnVtYmVyW3N0YXRlXSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAvLyBTdHJpbmcgdG9rZW46IFJlcGxhY2UgdGhlIGVzY2FwZW1lbnQgc2VxdWVuY2VzIGFuZCBleGVjdXRlIHRoZSBhY3Rpb24gZm9yXG4gICAgICAgICAgICAgIC8vIHRoaXMgc3RhdGUgYW5kIHN0cmluZy5cblxuICAgICAgICAgICAgICB2YWx1ZSA9IGRlYmFja3NsYXNoaWZ5KHJlc3VsdFszXSk7XG4gICAgICAgICAgICAgIHN0cmluZ1tzdGF0ZV0oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSB0b2tlbiBmcm9tIHRoZSBzdHJpbmcuIFRoZSBsb29wIHdpbGwgY29udGludWUgYXMgbG9uZyBhcyB0aGVyZVxuICAgICAgICAgICAgLy8gYXJlIHRva2Vucy4gVGhpcyBpcyBhIHNsb3cgcHJvY2VzcywgYnV0IGl0IGFsbG93cyB0aGUgdXNlIG9mIF4gbWF0Y2hpbmcsXG4gICAgICAgICAgICAvLyB3aGljaCBhc3N1cmVzIHRoYXQgbm8gaWxsZWdhbCB0b2tlbnMgc2xpcCB0aHJvdWdoLlxuXG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2Uuc2xpY2UocmVzdWx0WzBdLmxlbmd0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgd2UgZmluZCBhIHN0YXRlL3Rva2VuIGNvbWJpbmF0aW9uIHRoYXQgaXMgaWxsZWdhbCwgdGhlbiB0aGUgYWN0aW9uIHdpbGxcbiAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvci4gV2UgaGFuZGxlIHRoZSBlcnJvciBieSBzaW1wbHkgY2hhbmdpbmcgdGhlIHN0YXRlLlxuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBzdGF0ZSA9IGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgcGFyc2luZyBpcyBmaW5pc2hlZC4gSWYgd2UgYXJlIG5vdCBpbiB0aGUgZmluYWwgXCJva1wiIHN0YXRlLCBvciBpZiB0aGVcbiAgICAgICAgLy8gcmVtYWluaW5nIHNvdXJjZSBjb250YWlucyBhbnl0aGluZyBleGNlcHQgd2hpdGVzcGFjZSwgdGhlbiB3ZSBkaWQgbm90IGhhdmVcbiAgICAgICAgLy9hIHdlbGwtZm9ybWVkIEpTT04gdGV4dC5cblxuICAgICAgICBpZiAoc3RhdGUgIT09IFwib2tcIiB8fCAoL1teXFx1MDAyMFxcdFxcblxccl0vLnRlc3Qoc291cmNlKSkpIHtcbiAgICAgICAgICB0aHJvdyAoc3RhdGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcilcbiAgICAgICAgICAgID8gc3RhdGVcbiAgICAgICAgICAgIDogbmV3IFN5bnRheEVycm9yKFwiSlNPTlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcmV2aXZlciBmdW5jdGlvbiwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSxcbiAgICAgICAgLy8gcGFzc2luZyBlYWNoIG5hbWUvdmFsdWUgcGFpciB0byB0aGUgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGVcbiAgICAgICAgLy8gdHJhbnNmb3JtYXRpb24sIHN0YXJ0aW5nIHdpdGggYSB0ZW1wb3Jhcnkgcm9vdCBvYmplY3QgdGhhdCBob2xkcyB0aGUgY3VycmVudFxuICAgICAgICAvLyB2YWx1ZSBpbiBhbiBlbXB0eSBrZXkuIElmIHRoZXJlIGlzIG5vdCBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHNpbXBseSByZXR1cm5cbiAgICAgICAgLy8gdGhhdCB2YWx1ZS5cblxuICAgICAgICByZXR1cm4gKHR5cGVvZiByZXZpdmVyID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgPyAoZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuICAgICAgICAgICAgdmFyIGs7XG4gICAgICAgICAgICB2YXIgdjtcbiAgICAgICAgICAgIHZhciB2YWwgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwgaykpIHtcbiAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbCwgayk7XG4gICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbFtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsW2tdO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsKTtcbiAgICAgICAgICB9KHtcIlwiOiB2YWx1ZX0sIFwiXCIpKVxuICAgICAgICA6IHZhbHVlO1xuICAgICAgfTtcbiAgICB9KCkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXBDdXN0b21KU09OO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiLyogZ2xvYmFscyBleHBlY3QgKi9cbi8qIGdsb2JhbHMgZGVzY3JpYmUgKi9cbi8qIGdsb2JhbHMgaXQgKi9cbi8qIGdsb2JhbHMgc2lub24gKi9cblxudmFyIFJvbGxiYXIgPSByZXF1aXJlKCcuLi9zcmMvcmVhY3QtbmF0aXZlL3JvbGxiYXInKTtcbnZhciB0ID0gcmVxdWlyZSgnLi4vc3JjL3JlYWN0LW5hdGl2ZS90cmFuc2Zvcm1zJyk7XG5cbmZ1bmN0aW9uIFRlc3RDbGllbnRHZW4oKSB7XG4gIHZhciBUZXN0Q2xpZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubm90aWZpZXIgPSB7XG4gICAgICBhZGRUcmFuc2Zvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm90aWZpZXI7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgfTtcbiAgICB0aGlzLnF1ZXVlID0ge1xuICAgICAgYWRkUHJlZGljYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXVlO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgIH07XG4gIH07XG4gIHJldHVybiBUZXN0Q2xpZW50O1xufVxuXG5mdW5jdGlvbiBpdGVtRnJvbUFyZ3MoYXJncykge1xuICB2YXIgY2xpZW50ID0gbmV3IChUZXN0Q2xpZW50R2VuKCkpKCk7XG4gIHZhciByb2xsYmFyID0gbmV3IFJvbGxiYXIoeyBhdXRvSW5zdHJ1bWVudDogZmFsc2UgfSwgY2xpZW50KTtcbiAgdmFyIGl0ZW0gPSByb2xsYmFyLl9jcmVhdGVJdGVtKGFyZ3MpO1xuICBpdGVtLmxldmVsID0gJ2RlYnVnJztcbiAgcmV0dXJuIGl0ZW07XG59XG5cbmRlc2NyaWJlKCdoYW5kbGVJdGVtV2l0aEVycm9yJywgZnVuY3Rpb24gKCkge1xuICBpdCgnc2hvdWxkIGNyZWF0ZSBzdGFja0luZm8nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ3Rlc3QnKTtcbiAgICB2YXIgYXJncyA9IFsnYSBtZXNzYWdlJywgZXJyXTtcbiAgICB2YXIgaXRlbSA9IGl0ZW1Gcm9tQXJncyhhcmdzKTtcbiAgICB2YXIgb3B0aW9ucyA9IG5ldyBSb2xsYmFyKHt9KS5vcHRpb25zO1xuICAgIHQuaGFuZGxlSXRlbVdpdGhFcnJvcihpdGVtLCBvcHRpb25zLCBmdW5jdGlvbiAoZSwgaSkge1xuICAgICAgZXhwZWN0KGl0ZW0uc3RhY2tJbmZvLmV4Y2VwdGlvbikudG8uZXFsKHtcbiAgICAgICAgY2xhc3M6ICdFcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICd0ZXN0JyxcbiAgICAgIH0pO1xuICAgICAgZG9uZShlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbmRlc2NyaWJlKCdfbWF0Y2hGaWxlbmFtZScsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZpbGVuYW1lcyA9IHtcbiAgICBiZWZvcmU6IFtcbiAgICAgICcvdmFyL21vYmlsZS9Db250YWluZXJzL0RhdGEvQXBwbGljYXRpb24vMTEyMkFCQ0QtRkYwMi00OTQyLUEwRDctNjMyRTY5MUQzNDJGLy5hcHAvbWFpbi5qc2J1bmRsZScsXG4gICAgICAnL3Zhci9tb2JpbGUvQ29udGFpbmVycy9EYXRhL0FwcGxpY2F0aW9uLzExMjJBQkNELUZGMDItNDk0Mi1BMEQ3LTYzMkU2OTFEMzQyRi9MaWJyYXJ5L0FwcGxpY2F0aW9uIFN1cHBvcnQvQ29kZVB1c2gvMjA3MTk4MGQ3NGQxZmVmNjgyZmRhYjFkMWNhYjM0NWYzM2Y0OThlM2I1MWY2ODU4NWMxYjBiNTQ2OTMzNGRmNy9jb2RlcHVzaF9pb3MvbWFpbi5qc2J1bmRsZScsXG4gICAgICAnL2RhdGEvdXNlci8wL2NvbS5leGFtcGxlL2ZpbGVzL0NvZGVQdXNoLzIwNzE5ODBkNzRkMWZlZjY4MmZkYWIxZDFjYWIzNDVmMzNmNDk4ZTNiNTFmNjg1ODVjMWIwYjU0NjkzMzRkZjcvY29kZXB1c2hfYW5kcm9pZC9pbmRleC5hbmRyb2lkLmJ1bmRsZScsXG4gICAgICAnaW5kZXguYW5kcm9pZC5idW5kbGUnLFxuICAgIF0sXG4gICAgYWZ0ZXI6IFsnbWFpbi5qc2J1bmRsZScsICdtYWluLmpzYnVuZGxlJywgJ2luZGV4LmFuZHJvaWQuYnVuZGxlJywgbnVsbF0sXG4gIH07XG5cbiAgaXQoJ3Nob3VsZCByZXdyaXRlIGZpbGVuYW1lcycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBuZXcgUm9sbGJhcih7fSkub3B0aW9ucztcbiAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcblxuICAgIHZhciBsZW5ndGggPSBmaWxlbmFtZXMuYmVmb3JlLmxlbmd0aDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBmaWxlbmFtZSA9IHQuX21hdGNoRmlsZW5hbWUoZmlsZW5hbWVzLmJlZm9yZVtpXSwgb3B0aW9ucyk7XG4gICAgICBleHBlY3QoZmlsZW5hbWUpLnRvLmVxbChmaWxlbmFtZXMuYWZ0ZXJbaV0pO1xuICAgIH1cbiAgICBkb25lKCk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsiX3JlZ2VuZXJhdG9yUnVudGltZSIsImUiLCJ0IiwiciIsIk9iamVjdCIsInByb3RvdHlwZSIsIm4iLCJoYXNPd25Qcm9wZXJ0eSIsIm8iLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwiaSIsIlN5bWJvbCIsImEiLCJpdGVyYXRvciIsImMiLCJhc3luY0l0ZXJhdG9yIiwidSIsInRvU3RyaW5nVGFnIiwiZGVmaW5lIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwid3JhcCIsIkdlbmVyYXRvciIsImNyZWF0ZSIsIkNvbnRleHQiLCJtYWtlSW52b2tlTWV0aG9kIiwidHJ5Q2F0Y2giLCJ0eXBlIiwiYXJnIiwiY2FsbCIsImgiLCJsIiwiZiIsInMiLCJ5IiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsInAiLCJkIiwiZ2V0UHJvdG90eXBlT2YiLCJ2IiwidmFsdWVzIiwiZyIsImRlZmluZUl0ZXJhdG9yTWV0aG9kcyIsImZvckVhY2giLCJfaW52b2tlIiwiQXN5bmNJdGVyYXRvciIsImludm9rZSIsIl90eXBlb2YiLCJyZXNvbHZlIiwiX19hd2FpdCIsInRoZW4iLCJjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyIsIkVycm9yIiwiZG9uZSIsIm1ldGhvZCIsImRlbGVnYXRlIiwibWF5YmVJbnZva2VEZWxlZ2F0ZSIsInNlbnQiLCJfc2VudCIsImRpc3BhdGNoRXhjZXB0aW9uIiwiYWJydXB0IiwiVHlwZUVycm9yIiwicmVzdWx0TmFtZSIsIm5leHQiLCJuZXh0TG9jIiwicHVzaFRyeUVudHJ5IiwidHJ5TG9jIiwiY2F0Y2hMb2MiLCJmaW5hbGx5TG9jIiwiYWZ0ZXJMb2MiLCJ0cnlFbnRyaWVzIiwicHVzaCIsInJlc2V0VHJ5RW50cnkiLCJjb21wbGV0aW9uIiwicmVzZXQiLCJpc05hTiIsImxlbmd0aCIsImRpc3BsYXlOYW1lIiwiaXNHZW5lcmF0b3JGdW5jdGlvbiIsImNvbnN0cnVjdG9yIiwibmFtZSIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiYXN5bmMiLCJQcm9taXNlIiwia2V5cyIsInJldmVyc2UiLCJwb3AiLCJwcmV2IiwiY2hhckF0Iiwic2xpY2UiLCJzdG9wIiwicnZhbCIsImhhbmRsZSIsImNvbXBsZXRlIiwiZmluaXNoIiwiX2NhdGNoIiwiZGVsZWdhdGVZaWVsZCIsImFzeW5jR2VuZXJhdG9yU3RlcCIsIl9hc3luY1RvR2VuZXJhdG9yIiwiYXJndW1lbnRzIiwiYXBwbHkiLCJfbmV4dCIsIl90aHJvdyIsIl8iLCJyZXF1aXJlIiwiaGVscGVycyIsImRlZmF1bHRPcHRpb25zIiwiaG9zdG5hbWUiLCJwYXRoIiwic2VhcmNoIiwidmVyc2lvbiIsInByb3RvY29sIiwicG9ydCIsIk9UTFBEZWZhdWx0T3B0aW9ucyIsIkFwaSIsIm9wdGlvbnMiLCJ0cmFuc3BvcnQiLCJ1cmxsaWIiLCJ0cnVuY2F0aW9uIiwidXJsIiwiYWNjZXNzVG9rZW4iLCJ0cmFuc3BvcnRPcHRpb25zIiwiX2dldFRyYW5zcG9ydCIsIk9UTFBUcmFuc3BvcnRPcHRpb25zIiwiX2dldE9UTFBUcmFuc3BvcnQiLCJfcG9zdFByb21pc2UiLCJfcmVmIiwicGF5bG9hZCIsInNlbGYiLCJyZWplY3QiLCJwb3N0IiwiZXJyIiwicmVzcCIsInBvc3RJdGVtIiwiZGF0YSIsImNhbGxiYWNrIiwiYnVpbGRQYXlsb2FkIiwic2V0VGltZW91dCIsInBvc3RTcGFucyIsIl9yZWYyIiwiX2NhbGxlZSIsIl9jYWxsZWUkIiwiX2NvbnRleHQiLCJfeCIsImJ1aWxkSnNvblBheWxvYWQiLCJzdHJpbmdpZnlSZXN1bHQiLCJ0cnVuY2F0ZSIsInN0cmluZ2lmeSIsImVycm9yIiwicG9zdEpzb25QYXlsb2FkIiwianNvblBheWxvYWQiLCJjb25maWd1cmUiLCJvbGRPcHRpb25zIiwibWVyZ2UiLCJ1bmRlZmluZWQiLCJnZXRUcmFuc3BvcnRGcm9tT3B0aW9ucyIsIl9vcHRpb25zJHRyYWNpbmciLCJfb2JqZWN0U3ByZWFkIiwiZW5kcG9pbnQiLCJ0cmFjaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsImlzVHlwZSIsImNvbnRleHQiLCJjb250ZXh0UmVzdWx0Iiwic3Vic3RyIiwiZGVmYXVsdHMiLCJ0aW1lb3V0IiwiZGV0ZWN0VHJhbnNwb3J0IiwicHJveHkiLCJvcHRzIiwicGFyc2UiLCJwYXRobmFtZSIsImdXaW5kb3ciLCJ3aW5kb3ciLCJkZWZhdWx0VHJhbnNwb3J0IiwiZmV0Y2giLCJYTUxIdHRwUmVxdWVzdCIsInRyYW5zcG9ydEFQSSIsImhvc3QiLCJhcHBlbmRQYXRoVG9QYXRoIiwiYmFzZSIsImJhc2VUcmFpbGluZ1NsYXNoIiwidGVzdCIsInBhdGhCZWdpbm5pbmdTbGFzaCIsInN1YnN0cmluZyIsInJlc3VsdCIsImF1dGgiLCJoYXNoIiwiaHJlZiIsInF1ZXJ5IiwibGFzdCIsImluZGV4T2YiLCJzcGxpdCIsInBhcnNlSW50IiwicGF0aFBhcnRzIiwiRXJyb3JTdGFja1BhcnNlciIsIlVOS05PV05fRlVOQ1RJT04iLCJFUlJfQ0xBU1NfUkVHRVhQIiwiUmVnRXhwIiwiZ3Vlc3NGdW5jdGlvbk5hbWUiLCJnYXRoZXJDb250ZXh0IiwiRnJhbWUiLCJzdGFja0ZyYW1lIiwiX3N0YWNrRnJhbWUiLCJmaWxlTmFtZSIsImxpbmUiLCJsaW5lTnVtYmVyIiwiZnVuYyIsImZ1bmN0aW9uTmFtZSIsImNvbHVtbiIsImNvbHVtbk51bWJlciIsImFyZ3MiLCJTdGFjayIsImV4Y2VwdGlvbiIsInNraXAiLCJnZXRTdGFjayIsInBhcnNlclN0YWNrIiwic3RhY2siLCJtZXNzYWdlIiwiX21vc3RTcGVjaWZpY0Vycm9yTmFtZSIsInJhd1N0YWNrIiwicmF3RXhjZXB0aW9uIiwibmVzdGVkIiwiY2F1c2UiLCJ0cmFjZUNoYWluIiwiZ3Vlc3NFcnJvckNsYXNzIiwiZXJyTXNnIiwibWF0Y2giLCJlcnJDbGFzc01hdGNoIiwiZXJyQ2xhc3MiLCJyZXBsYWNlIiwiY29uc3RydWN0b3JOYW1lIiwiaGFzT3duIiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJoYXNPd25Db25zdHJ1Y3RvciIsImhhc0lzUHJvdG90eXBlT2YiLCJrZXkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJjdXJyZW50IiwiTm90aWZpZXIiLCJxdWV1ZSIsInRyYW5zZm9ybXMiLCJkaWFnbm9zdGljIiwiYWRkVHJhbnNmb3JtIiwidHJhbnNmb3JtIiwiaXNGdW5jdGlvbiIsImxvZyIsIml0ZW0iLCJlbmFibGVkIiwiYWRkUGVuZGluZ0l0ZW0iLCJvcmlnaW5hbEVycm9yIiwiX2FwcGx5VHJhbnNmb3JtcyIsInJlbW92ZVBlbmRpbmdJdGVtIiwiYWRkSXRlbSIsImJpbmQiLCJ0cmFuc2Zvcm1JbmRleCIsInRyYW5zZm9ybXNMZW5ndGgiLCJjYiIsImNoZWNrTGV2ZWwiLCJzZXR0aW5ncyIsImxldmVsIiwibGV2ZWxWYWwiLCJMRVZFTFMiLCJyZXBvcnRMZXZlbCIsInJlcG9ydExldmVsVmFsIiwidXNlckNoZWNrSWdub3JlIiwibG9nZ2VyIiwiaXNVbmNhdWdodCIsIl9pc1VuY2F1Z2h0IiwiX29yaWdpbmFsQXJncyIsIm9uU2VuZENhbGxiYWNrIiwiY2hlY2tJZ25vcmUiLCJ1cmxJc05vdEJsb2NrTGlzdGVkIiwidXJsSXNPbkFMaXN0IiwidXJsSXNTYWZlTGlzdGVkIiwibWF0Y2hGcmFtZXMiLCJ0cmFjZSIsImxpc3QiLCJibG9jayIsImZyYW1lcyIsImZyYW1lIiwiZmlsZW5hbWUiLCJ1cmxSZWdleCIsImxpc3RMZW5ndGgiLCJmcmFtZUxlbmd0aCIsImoiLCJzYWZlT3JCbG9jayIsInRyYWNlcyIsImhvc3RCbG9ja0xpc3QiLCJob3N0U2FmZUxpc3QiLCJnZXQiLCJ0cmFjZXNMZW5ndGgiLCJsaXN0TmFtZSIsIm1lc3NhZ2VJc0lnbm9yZWQiLCJpZ25vcmVkTWVzc2FnZXMiLCJsZW4iLCJySWdub3JlZE1lc3NhZ2UiLCJtZXNzYWdlcyIsIm1lc3NhZ2VzRnJvbUl0ZW0iLCJib2R5IiwidHJhY2VfY2hhaW4iLCJRdWV1ZSIsInJhdGVMaW1pdGVyIiwiYXBpIiwicmVwbGF5TWFwIiwicHJlZGljYXRlcyIsInBlbmRpbmdJdGVtcyIsInBlbmRpbmdSZXF1ZXN0cyIsInJldHJ5UXVldWUiLCJyZXRyeUhhbmRsZSIsIndhaXRDYWxsYmFjayIsIndhaXRJbnRlcnZhbElEIiwiYWRkUHJlZGljYXRlIiwicHJlZGljYXRlIiwiaWR4Iiwic3BsaWNlIiwib3JpZ2luYWxJdGVtIiwicHJlZGljYXRlUmVzdWx0IiwiX2FwcGx5UHJlZGljYXRlcyIsIl9tYXliZUxvZyIsInRyYW5zbWl0IiwicmVwbGF5SWQiLCJhZGQiLCJ1dWlkIiwiX21ha2VBcGlSZXF1ZXN0IiwiX2RlcXVldWVQZW5kaW5nUmVxdWVzdCIsIl9oYW5kbGVSZXBsYXlSZXNwb25zZSIsIndhaXQiLCJfbWF5YmVDYWxsV2FpdCIsImNsZWFySW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsInJhdGVMaW1pdFJlc3BvbnNlIiwic2hvdWxkU2VuZCIsIl9tYXliZVJldHJ5IiwiUkVUUklBQkxFX0VSUk9SUyIsInNob3VsZFJldHJ5IiwicmV0cnlJbnRlcnZhbCIsImNvZGUiLCJpc0Zpbml0ZU51bWJlciIsIm1heFJldHJpZXMiLCJyZXRyaWVzIiwiX3JldHJ5QXBpUmVxdWVzdCIsInJldHJ5T2JqZWN0Iiwic2hpZnQiLCJ2ZXJib3NlIiwicmVzcG9uc2UiLCJjb25zb2xlIiwid2FybiIsInNlbmQiLCJkaXNjYXJkIiwidDAiLCJfeDIiLCJSYXRlTGltaXRlciIsInN0YXJ0VGltZSIsIm5vdyIsImNvdW50ZXIiLCJwZXJNaW5Db3VudGVyIiwicGxhdGZvcm0iLCJwbGF0Zm9ybU9wdGlvbnMiLCJjb25maWd1cmVHbG9iYWwiLCJnbG9iYWxTZXR0aW5ncyIsIm1heEl0ZW1zIiwiaXRlbXNQZXJNaW51dGUiLCJlbGFwc2VkVGltZSIsImdsb2JhbFJhdGVMaW1pdCIsImdsb2JhbFJhdGVMaW1pdFBlck1pbiIsImNoZWNrUmF0ZSIsInNob3VsZFNlbmRWYWx1ZSIsInBlck1pbnV0ZSIsInNldFBsYXRmb3JtT3B0aW9ucyIsImxpbWl0IiwiaWdub3JlUmF0ZUxpbWl0IiwibGltaXRQZXJNaW4iLCJyYXRlTGltaXRQYXlsb2FkIiwiZW52aXJvbm1lbnQiLCJtc2ciLCJleHRyYSIsImxhbmd1YWdlIiwibm90aWZpZXIiLCJmcmFtZXdvcmsiLCJpbmZvIiwicGFja2FnZUpzb24iLCJDbGllbnQiLCJBUEkiLCJUcmFuc3BvcnQiLCJUZWxlbWV0ZXIiLCJzaGFyZWRUcmFuc2Zvcm1zIiwic2hhcmVkUHJlZGljYXRlcyIsInBvbHlmaWxsSlNPTiIsIlJvbGxiYXIiLCJjbGllbnQiLCJoYW5kbGVPcHRpb25zIiwiX2NvbmZpZ3VyZWRPcHRpb25zIiwidGVsZW1ldGVyIiwiYWRkVHJhbnNmb3Jtc1RvTm90aWZpZXIiLCJhZGRQcmVkaWNhdGVzVG9RdWV1ZSIsInNldHVwSlNPTiIsIl9pbnN0YW5jZSIsImluaXQiLCJnbG9iYWwiLCJoYW5kbGVVbmluaXRpYWxpemVkIiwibWF5YmVDYWxsYmFjayIsInBheWxvYWREYXRhIiwibGFzdEVycm9yIiwiX2NyZWF0ZUl0ZW0iLCJfZ2V0Rmlyc3RGdW5jdGlvbiIsImRlYnVnIiwid2FybmluZyIsIl91bmNhdWdodEVycm9yIiwiY3JpdGljYWwiLCJzZW5kSnNvblBheWxvYWQiLCJjYXB0dXJlRXZlbnQiLCJldmVudCIsImNyZWF0ZVRlbGVtZXRyeUV2ZW50IiwibWV0YWRhdGEiLCJzZXRQZXJzb24iLCJwZXJzb25JbmZvIiwicGVyc29uIiwiY2xlYXJQZXJzb24iLCJiYXNlRGF0YSIsImhhbmRsZUl0ZW1XaXRoRXJyb3IiLCJhZGRCb2R5IiwiYWRkTWVzc2FnZVdpdGhFcnJvciIsImFkZFRlbGVtZXRyeURhdGEiLCJhZGRDb25maWdUb1BheWxvYWQiLCJzY3J1YlBheWxvYWQiLCJhZGRQYXlsb2FkT3B0aW9ucyIsInVzZXJUcmFuc2Zvcm0iLCJhZGRDb25maWd1cmVkT3B0aW9ucyIsImFkZERpYWdub3N0aWNLZXlzIiwiaXRlbVRvUGF5bG9hZCIsImNyZWF0ZUl0ZW0iLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJzaG93UmVwb3J0ZWRNZXNzYWdlVHJhY2VzIiwic2NydWJIZWFkZXJzIiwic2VydmVyIiwic2NydWJGaWVsZHMiLCJyZXdyaXRlRmlsZW5hbWVQYXR0ZXJucyIsInJlYWN0TmF0aXZlIiwic2VuZENvbmZpZyIsImluY2x1ZGVJdGVtc0luVGVsZW1ldHJ5IiwiaWdub3JlRHVwbGljYXRlRXJyb3JzIiwic2NydWIiLCJlcnJvclBhcnNlciIsInRpbWVzdGFtcCIsIk1hdGgiLCJyb3VuZCIsIkpTT04iLCJjdXN0b20iLCJjb2RlVmVyc2lvbiIsImNvZGVfdmVyc2lvbiIsInByb3BzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImFkZE1lc3NhZ2VEYXRhIiwiYWRkRXJyb3JEYXRhIiwic3RhY2tJbmZvIiwiYWRkRXJyb3JDb250ZXh0IiwicGFyc2VkRXJyb3IiLCJndWVzcyIsIl9idWlsZEZyYW1lcyIsIl9lcnJvckNsYXNzIiwiZGVzY3JpcHRpb24iLCJTdHJpbmciLCJzY3J1YlBhdGhzIiwiY29uY2F0Iiwic2FuaXRpemVVcmwiLCJfcmV3cml0ZUZpbGVuYW1lIiwibGluZW5vIiwiY29sbm8iLCJfbWF0Y2hGaWxlbmFtZSIsInBhdHRlcm5zIiwicGF0dGVybiIsIkJ1ZmZlciIsInJhdGVMaW1pdEV4cGlyZXMiLCJwYXJhbXMiLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImhlYWRlcnMiLCJfaGVhZGVycyIsImZvcm1hdFVybCIsIl9oYW5kbGVSZXNwb25zZSIsIndyaXRlRGF0YSIsIl9tYWtlUmVxdWVzdCIsImpzb24iLCJfd3JhcFBvc3RDYWxsYmFjayIsImJ5dGVMZW5ndGgiLCJqb2luIiwidHJhY2VyIiwidmFsaWRhdGVUcmFjZXIiLCJzZXRTdGFja1RyYWNlTGltaXQiLCJsYXN0RXJyb3JIYXNoIiwiX2RlZmF1bHRMb2dMZXZlbCIsIl9sb2ciLCJjYXB0dXJlRG9tQ29udGVudExvYWRlZCIsInRzIiwiY2FwdHVyZUxvYWQiLCJkZWZhdWx0TGV2ZWwiLCJfc2FtZUFzTGFzdEVycm9yIiwiX2FkZFRyYWNpbmdBdHRyaWJ1dGVzIiwiX2FkZFRyYWNpbmdJbmZvIiwiX2NhcHR1cmVSb2xsYmFySXRlbSIsInRlbGVtZXRyeUV2ZW50cyIsImNvcHlFdmVudHMiLCJ0ZWxlbWV0cnlTcGFuIiwiZW5kIiwic3RhcnRTcGFuIiwiX3RoaXMkdHJhY2luZyIsInNwYW4iLCJnZXRTcGFuIiwiYXR0cmlidXRlcyIsInNlc3Npb25JZCIsInNwYW5JZCIsInRyYWNlSWQiLCJhZGRJdGVtQXR0cmlidXRlcyIsImFkZEV2ZW50IiwibG9nTGV2ZWwiLCJpdGVtSGFzaCIsImdlbmVyYXRlSXRlbUhhc2giLCJzY29wZSIsImFjdGl2ZSIsInZhbGlkYXRlU3BhbiIsInNldFRhZyIsIm9wZW50cmFjaW5nU3BhbklkIiwidG9TcGFuSWQiLCJvcGVudHJhY2luZ1RyYWNlSWQiLCJ0b1RyYWNlSWQiLCJvcGVudHJhY2luZ19zcGFuX2lkIiwib3BlbnRyYWNpbmdfdHJhY2VfaWQiLCJzdGFja1RyYWNlTGltaXQiLCJzcGFuQ29udGV4dCIsInRyYXZlcnNlIiwic2NydWJQYXRoIiwicGFyYW1SZXMiLCJfZ2V0U2NydWJGaWVsZFJlZ2V4cyIsInF1ZXJ5UmVzIiwiX2dldFNjcnViUXVlcnlQYXJhbVJlZ2V4cyIsInJlZGFjdFF1ZXJ5UGFyYW0iLCJkdW1teTAiLCJwYXJhbVBhcnQiLCJyZWRhY3QiLCJwYXJhbVNjcnViYmVyIiwidmFsU2NydWJiZXIiLCJrIiwic2NydWJiZXIiLCJzZWVuIiwidG1wViIsInJldCIsInBhdCIsIk1BWF9FVkVOVFMiLCJmcm9tTWlsbGlzIiwibWlsbGlzIiwidHJ1bmMiLCJtYXhUZWxlbWV0cnlFdmVudHMiLCJtYXhRdWV1ZVNpemUiLCJtYXgiLCJtaW4iLCJuZXdNYXhFdmVudHMiLCJkZWxldGVDb3VudCIsImV2ZW50cyIsIkFycmF5IiwiZmlsdGVyVGVsZW1ldHJ5IiwiY2FwdHVyZSIsInJvbGxiYXJVVUlEIiwiZ2V0TGV2ZWwiLCJ0aW1lc3RhbXBfbXMiLCJzb3VyY2UiLCJleGMiLCJjYXB0dXJlRXJyb3IiLCJfdGhpcyR0ZWxlbWV0cnlTcGFuIiwiY2FwdHVyZUxvZyIsIl90aGlzJHRlbGVtZXRyeVNwYW4yIiwiX3RoaXMkdGVsZW1ldHJ5U3BhbjMiLCJjYXB0dXJlTmV0d29yayIsInN1YnR5cGUiLCJyZXF1ZXN0RGF0YSIsInJlcXVlc3QiLCJsZXZlbEZyb21TdGF0dXMiLCJzdGF0dXNfY29kZSIsInN0YXR1c0NvZGUiLCJjYXB0dXJlRG9tIiwiZWxlbWVudCIsImNoZWNrZWQiLCJjYXB0dXJlTmF2aWdhdGlvbiIsImZyb20iLCJ0byIsIl90aGlzJHRlbGVtZXRyeVNwYW40IiwiZ2V0VGltZSIsImNhcHR1cmVDb25uZWN0aXZpdHlDaGFuZ2UiLCJjaGFuZ2UiLCJtYW51YWwiLCJwYXlsb2FkT3B0aW9ucyIsInNldCIsInRyYWNlUGF0aCIsIm5ld0V4dHJhIiwibmV3SXRlbSIsImlzUHJvbWlzZSIsInByb21pc2VkSXRlbSIsImNvbmZpZ0tleSIsImFkZEZ1bmN0aW9uT3B0aW9uIiwiY29uZmlndXJlZE9wdGlvbnMiLCJjb25maWd1cmVkX29wdGlvbnMiLCJpc19hbm9ueW1vdXMiLCJpc191bmNhdWdodCIsInJhd19lcnJvciIsImNvbnN0cnVjdG9yX25hbWUiLCJmYWlsZWQiLCJyYXciLCJqc29uQmFja3VwIiwic2VsZWN0RnJhbWVzIiwicmFuZ2UiLCJ0cnVuY2F0ZUZyYW1lcyIsImNoYWluIiwibWF5YmVUcnVuY2F0ZVZhbHVlIiwidmFsIiwidHJ1bmNhdGVTdHJpbmdzIiwidHJ1bmNhdG9yIiwidHlwZU5hbWUiLCJ0cnVuY2F0ZVRyYWNlRGF0YSIsInRyYWNlRGF0YSIsIm1pbkJvZHkiLCJuZWVkc1RydW5jYXRpb24iLCJtYXhTaXplIiwibWF4Qnl0ZVNpemUiLCJzdHJhdGVnaWVzIiwic3RyYXRlZ3kiLCJyZXN1bHRzIiwiUm9sbGJhckpTT04iLCJpc0RlZmluZWQiLCJpc05hdGl2ZUZ1bmN0aW9uIiwieCIsInRvTG93ZXJDYXNlIiwicmVSZWdFeHBDaGFyIiwiZnVuY01hdGNoU3RyaW5nIiwiRnVuY3Rpb24iLCJyZUlzTmF0aXZlIiwiaXNPYmplY3QiLCJpc1N0cmluZyIsIk51bWJlciIsImlzRmluaXRlIiwiaXNJdGVyYWJsZSIsImlzRXJyb3IiLCJpc0Jyb3dzZXIiLCJ1dWlkNCIsInJhbmRvbSIsImZsb29yIiwiYmFzZVVybFBhcnRzIiwicGFyc2VVcmkiLCJhbmNob3IiLCJwYXJzZVVyaU9wdGlvbnMiLCJzdHJpY3RNb2RlIiwicSIsInBhcnNlciIsInN0cmljdCIsImxvb3NlIiwic3RyIiwibSIsImV4ZWMiLCJ1cmkiLCIkMCIsIiQxIiwiJDIiLCJhY2Nlc3NfdG9rZW4iLCJwYXJhbXNBcnJheSIsInNvcnQiLCJxcyIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwic3RyaW5nIiwiY291bnQiLCJjaGFyQ29kZUF0IiwianNvblBhcnNlIiwibWFrZVVuaGFuZGxlZFN0YWNrSW5mbyIsIm1vZGUiLCJiYWNrdXBNZXNzYWdlIiwibG9jYXRpb24iLCJkb2N1bWVudCIsInVzZXJhZ2VudCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsIndyYXBDYWxsYmFjayIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJuZXdTZWVuIiwiaW5jbHVkZXMiLCJyZXF1ZXN0S2V5cyIsImxhbWJkYUNvbnRleHQiLCJleHRyYUFyZ3MiLCJhcmdUeXBlcyIsInR5cCIsIkRPTUV4Y2VwdGlvbiIsInNldEN1c3RvbUl0ZW1LZXlzIiwib3JpZ2luYWxfYXJnX3R5cGVzIiwic2tpcEZyYW1lcyIsImVycm9ycyIsImNvbnRleHRBZGRlZCIsInJvbGxiYXJDb250ZXh0IiwiZXJyb3JfY29udGV4dCIsIlRFTEVNRVRSWV9UWVBFUyIsIlRFTEVNRVRSWV9MRVZFTFMiLCJhcnJheUluY2x1ZGVzIiwiYXJyIiwiX2l0ZW0kZGF0YSRhdHRyaWJ1dGVzIiwiX3RvQ29uc3VtYWJsZUFycmF5IiwidGVtcCIsInJlcGxhY2VtZW50IiwiZm9ybWF0QXJnc0FzU3RyaW5nIiwiRGF0ZSIsImZpbHRlcklwIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJpbnB1dCIsInVwZGF0ZURlcHJlY2F0ZWRPcHRpb25zIiwib3ZlcndyaXRlU2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImlzT2JqIiwiaXNBcnJheSIsInNlZW5JbmRleCIsIm1hcHBlZCIsInNhbWUiXSwic291cmNlUm9vdCI6IiJ9