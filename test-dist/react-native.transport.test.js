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
/*!*********************************************!*\
  !*** ./test/react-native.transport.test.js ***!
  \*********************************************/
/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var truncation = __webpack_require__(/*! ../src/truncation */ "./src/truncation.js");
var Transport = __webpack_require__(/*! ../src/react-native/transport */ "./src/react-native/transport.js");
var t = new Transport(truncation);
var utility = __webpack_require__(/*! ../src/utility */ "./src/utility.js");
utility.setupJSON();

describe('post', function () {
  var accessToken = 'abc123';
  var options = {
    hostname: 'api.rollbar.com',
    protocol: 'https',
    path: '/api/1/item/',
  };
  var payload = {
    access_token: accessToken,
    data: { a: 1 },
  };
  var uuid = 'd4c7acef55bf4c9ea95e4fe9428a8287';

  before(function (done) {
    // In react-native environment, stub fetch() instead of XMLHttpRequest
    sinon.stub(window, 'fetch');
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

    var callback = function (err, data) {
      expect(err).to.eql(null);
      expect(data).to.be.ok();
      expect(data.uuid).to.eql(uuid);
      done();
    };
    t.post(accessToken, options, payload, callback);
  });

  it('should callback with the server error if 403', function (done) {
    stubResponse(403, '403', 'bad request');

    var callback = function (err, resp) {
      expect(resp).to.not.be.ok();
      expect(err.message).to.eql('Api error: bad request');
      done();
    };
    t.post(accessToken, options, payload, callback);
  });
});

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtbmF0aXZlLnRyYW5zcG9ydC50ZXN0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7QUNWQTs7QUFFQSxDQUFDO0FBQ0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsT0FBTztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtEQUFrRCxZQUFZO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDLENBQUMsTUFBOEIsSUFBSSxDQUFrQjs7Ozs7Ozs7Ozs7O0FDM0h0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFWTs7QUFFWixhQUFhLG1CQUFPLENBQUMsc0RBQVc7QUFDaEMsY0FBYyxtQkFBTyxDQUFDLGdEQUFTO0FBQy9CLGNBQWMsbUJBQU8sQ0FBQyxnREFBUzs7QUFFL0IsY0FBYztBQUNkLGtCQUFrQjtBQUNs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QUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQiw2QkFBNkI7QUFDakQ7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixrQkFBa0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0RBQXdELE9BQU87QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdEQUF3RCxPQUFPO0FBQy9EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsWUFBWTtBQUM5Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JvbGxiYXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9ub2RlX21vZHVsZXMvaXNhcnJheS9pbmRleC5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL21lcmdlLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvcmVhY3QtbmF0aXZlL2xvZ2dlci5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3JlYWN0LW5hdGl2ZS90cmFuc3BvcnQuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3NyYy90cnVuY2F0aW9uLmpzIiwid2VicGFjazovL3JvbGxiYXIvLi9zcmMvdXRpbGl0eS5qcyIsIndlYnBhY2s6Ly9yb2xsYmFyLy4vc3JjL3V0aWxpdHkvdHJhdmVyc2UuanMiLCJ3ZWJwYWNrOi8vcm9sbGJhci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yb2xsYmFyL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vcm9sbGJhci8uL3Rlc3QvcmVhY3QtbmF0aXZlLnRyYW5zcG9ydC50ZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwidmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFBMVVNfVVJMX1NBRkUgPSAnLScuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0hfVVJMX1NBRkUgPSAnXycuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTIHx8XG5cdFx0ICAgIGNvZGUgPT09IFBMVVNfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIIHx8XG5cdFx0ICAgIGNvZGUgPT09IFNMQVNIX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG52YXIgcm9vdFBhcmVudCA9IHt9XG5cbi8qKlxuICogSWYgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKG1vc3QgY29tcGF0aWJsZSwgZXZlbiBJRTYpXG4gKlxuICogQnJvd3NlcnMgdGhhdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLCBDaHJvbWUgNyssIFNhZmFyaSA1LjErLFxuICogT3BlcmEgMTEuNissIGlPUyA0LjIrLlxuICpcbiAqIER1ZSB0byB2YXJpb3VzIGJyb3dzZXIgYnVncywgc29tZXRpbWVzIHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24gd2lsbCBiZSB1c2VkIGV2ZW5cbiAqIHdoZW4gdGhlIGJyb3dzZXIgc3VwcG9ydHMgdHlwZWQgYXJyYXlzLlxuICpcbiAqIE5vdGU6XG4gKlxuICogICAtIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcyxcbiAqICAgICBTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOC5cbiAqXG4gKiAgIC0gU2FmYXJpIDUtNyBsYWNrcyBzdXBwb3J0IGZvciBjaGFuZ2luZyB0aGUgYE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3JgIHByb3BlcnR5XG4gKiAgICAgb24gb2JqZWN0cy5cbiAqXG4gKiAgIC0gQ2hyb21lIDktMTAgaXMgbWlzc2luZyB0aGUgYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbi5cbiAqXG4gKiAgIC0gSUUxMCBoYXMgYSBicm9rZW4gYFR5cGVkQXJyYXkucHJvdG90eXBlLnN1YmFycmF5YCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFycmF5cyBvZlxuICogICAgIGluY29ycmVjdCBsZW5ndGggaW4gc29tZSBzaXR1YXRpb25zLlxuXG4gKiBXZSBkZXRlY3QgdGhlc2UgYnVnZ3kgYnJvd3NlcnMgYW5kIHNldCBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgIHRvIGBmYWxzZWAgc28gdGhleVxuICogZ2V0IHRoZSBPYmplY3QgaW1wbGVtZW50YXRpb24sIHdoaWNoIGlzIHNsb3dlciBidXQgYmVoYXZlcyBjb3JyZWN0bHkuXG4gKi9cbkJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUID0gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlQgIT09IHVuZGVmaW5lZFxuICA/IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gIDogdHlwZWRBcnJheVN1cHBvcnQoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIGZ1bmN0aW9uIEJhciAoKSB7fVxuICB0cnkge1xuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgYXJyLmNvbnN0cnVjdG9yID0gQmFyXG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgYXJyLmNvbnN0cnVjdG9yID09PSBCYXIgJiYgLy8gY29uc3RydWN0b3IgY2FuIGJlIHNldFxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nICYmIC8vIGNocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICAgICAgICBhcnIuc3ViYXJyYXkoMSwgMSkuYnl0ZUxlbmd0aCA9PT0gMCAvLyBpZTEwIGhhcyBicm9rZW4gYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuZnVuY3Rpb24ga01heExlbmd0aCAoKSB7XG4gIHJldHVybiBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVFxuICAgID8gMHg3ZmZmZmZmZlxuICAgIDogMHgzZmZmZmZmZlxufVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChhcmcpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICAvLyBBdm9pZCBnb2luZyB0aHJvdWdoIGFuIEFyZ3VtZW50c0FkYXB0b3JUcmFtcG9saW5lIGluIHRoZSBjb21tb24gY2FzZS5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHJldHVybiBuZXcgQnVmZmVyKGFyZywgYXJndW1lbnRzWzFdKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKGFyZylcbiAgfVxuXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBmcm9tTnVtYmVyKHRoaXMsIGFyZylcbiAgfVxuXG4gIC8vIFNsaWdodGx5IGxlc3MgY29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoaXMsIGFyZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiAndXRmOCcpXG4gIH1cblxuICAvLyBVbnVzdWFsLlxuICByZXR1cm4gZnJvbU9iamVjdCh0aGlzLCBhcmcpXG59XG5cbmZ1bmN0aW9uIGZyb21OdW1iZXIgKHRoYXQsIGxlbmd0aCkge1xuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGxlbmd0aCkgfCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAodGhhdCwgc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgLy8gQXNzdW1wdGlvbjogYnl0ZUxlbmd0aCgpIHJldHVybiB2YWx1ZSBpcyBhbHdheXMgPCBrTWF4TGVuZ3RoLlxuICB2YXIgbGVuZ3RoID0gYnl0ZUxlbmd0aChzdHJpbmcsIGVuY29kaW5nKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcblxuICB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iamVjdCkpIHJldHVybiBmcm9tQnVmZmVyKHRoYXQsIG9iamVjdClcblxuICBpZiAoaXNBcnJheShvYmplY3QpKSByZXR1cm4gZnJvbUFycmF5KHRoYXQsIG9iamVjdClcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHN0YXJ0IHdpdGggbnVtYmVyLCBidWZmZXIsIGFycmF5IG9yIHN0cmluZycpXG4gIH1cblxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChvYmplY3QuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIHJldHVybiBmcm9tVHlwZWRBcnJheSh0aGF0LCBvYmplY3QpXG4gICAgfVxuICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih0aGF0LCBvYmplY3QpXG4gICAgfVxuICB9XG5cbiAgaWYgKG9iamVjdC5sZW5ndGgpIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iamVjdClcblxuICByZXR1cm4gZnJvbUpzb25PYmplY3QodGhhdCwgb2JqZWN0KVxufVxuXG5mdW5jdGlvbiBmcm9tQnVmZmVyICh0aGF0LCBidWZmZXIpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYnVmZmVyLmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBhbGxvY2F0ZSh0aGF0LCBsZW5ndGgpXG4gIGJ1ZmZlci5jb3B5KHRoYXQsIDAsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5ICh0aGF0LCBhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLy8gRHVwbGljYXRlIG9mIGZyb21BcnJheSgpIHRvIGtlZXAgZnJvbUFycmF5KCkgbW9ub21vcnBoaWMuXG5mdW5jdGlvbiBmcm9tVHlwZWRBcnJheSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgLy8gVHJ1bmNhdGluZyB0aGUgZWxlbWVudHMgaXMgcHJvYmFibHkgbm90IHdoYXQgcGVvcGxlIGV4cGVjdCBmcm9tIHR5cGVkXG4gIC8vIGFycmF5cyB3aXRoIEJZVEVTX1BFUl9FTEVNRU5UID4gMSBidXQgaXQncyBjb21wYXRpYmxlIHdpdGggdGhlIGJlaGF2aW9yXG4gIC8vIG9mIHRoZSBvbGQgQnVmZmVyIGNvbnN0cnVjdG9yLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBhcnJheS5ieXRlTGVuZ3RoXG4gICAgdGhhdCA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tVHlwZWRBcnJheSh0aGF0LCBuZXcgVWludDhBcnJheShhcnJheSkpXG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgdGhhdCA9IGFsbG9jYXRlKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbi8vIERlc2VyaWFsaXplIHsgdHlwZTogJ0J1ZmZlcicsIGRhdGE6IFsxLDIsMywuLi5dIH0gaW50byBhIEJ1ZmZlciBvYmplY3QuXG4vLyBSZXR1cm5zIGEgemVyby1sZW5ndGggYnVmZmVyIGZvciBpbnB1dHMgdGhhdCBkb24ndCBjb25mb3JtIHRvIHRoZSBzcGVjLlxuZnVuY3Rpb24gZnJvbUpzb25PYmplY3QgKHRoYXQsIG9iamVjdCkge1xuICB2YXIgYXJyYXlcbiAgdmFyIGxlbmd0aCA9IDBcblxuICBpZiAob2JqZWN0LnR5cGUgPT09ICdCdWZmZXInICYmIGlzQXJyYXkob2JqZWN0LmRhdGEpKSB7XG4gICAgYXJyYXkgPSBvYmplY3QuZGF0YVxuICAgIGxlbmd0aCA9IGNoZWNrZWQoYXJyYXkubGVuZ3RoKSB8IDBcbiAgfVxuICB0aGF0ID0gYWxsb2NhdGUodGhhdCwgbGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0aGF0W2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gdGhhdFxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxufSBlbHNlIHtcbiAgLy8gcHJlLXNldCBmb3IgdmFsdWVzIHRoYXQgbWF5IGV4aXN0IGluIHRoZSBmdXR1cmVcbiAgQnVmZmVyLnByb3RvdHlwZS5sZW5ndGggPSB1bmRlZmluZWRcbiAgQnVmZmVyLnByb3RvdHlwZS5wYXJlbnQgPSB1bmRlZmluZWRcbn1cblxuZnVuY3Rpb24gYWxsb2NhdGUgKHRoYXQsIGxlbmd0aCkge1xuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSwgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICB0aGF0ID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gICAgdGhhdC5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgZnJvbVBvb2wgPSBsZW5ndGggIT09IDAgJiYgbGVuZ3RoIDw9IEJ1ZmZlci5wb29sU2l6ZSA+Pj4gMVxuICBpZiAoZnJvbVBvb2wpIHRoYXQucGFyZW50ID0gcm9vdFBhcmVudFxuXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBrTWF4TGVuZ3RoYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNsb3dCdWZmZXIpKSByZXR1cm4gbmV3IFNsb3dCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcpXG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGRlbGV0ZSBidWYucGFyZW50XG4gIHJldHVybiBidWZcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIHZhciB4ID0gYS5sZW5ndGhcbiAgdmFyIHkgPSBiLmxlbmd0aFxuXG4gIHZhciBpID0gMFxuICB2YXIgbGVuID0gTWF0aC5taW4oeCwgeSlcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkgYnJlYWtcblxuICAgICsraVxuICB9XG5cbiAgaWYgKGkgIT09IGxlbikge1xuICAgIHggPSBhW2ldXG4gICAgeSA9IGJbaV1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignbGlzdCBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHN0cmluZyA9ICcnICsgc3RyaW5nXG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAvLyBEZXByZWNhdGVkXG4gICAgICBjYXNlICdyYXcnOlxuICAgICAgY2FzZSAncmF3cyc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgc3RhcnQgPSBzdGFydCB8IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID09PSBJbmZpbml0eSA/IHRoaXMubGVuZ3RoIDogZW5kIHwgMFxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG4gIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmIChlbmQgPD0gc3RhcnQpIHJldHVybiAnJ1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGJpbmFyeVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gMFxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYilcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0KSB7XG4gIGlmIChieXRlT2Zmc2V0ID4gMHg3ZmZmZmZmZikgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgZWxzZSBpZiAoYnl0ZU9mZnNldCA8IC0weDgwMDAwMDAwKSBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgYnl0ZU9mZnNldCA+Pj0gMFxuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG4gIGlmIChieXRlT2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gLTFcblxuICAvLyBOZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IE1hdGgubWF4KHRoaXMubGVuZ3RoICsgYnl0ZU9mZnNldCwgMClcblxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xIC8vIHNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nIGFsd2F5cyBmYWlsc1xuICAgIHJldHVybiBTdHJpbmcucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gIH1cbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gIH1cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwodGhpcywgdmFsLCBieXRlT2Zmc2V0KVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKHRoaXMsIFsgdmFsIF0sIGJ5dGVPZmZzZXQpXG4gIH1cblxuICBmdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0KSB7XG4gICAgdmFyIGZvdW5kSW5kZXggPSAtMVxuICAgIGZvciAodmFyIGkgPSAwOyBieXRlT2Zmc2V0ICsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycltieXRlT2Zmc2V0ICsgaV0gPT09IHZhbFtmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleF0pIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWwubGVuZ3RoKSByZXR1cm4gYnl0ZU9mZnNldCArIGZvdW5kSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTFcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbi8vIGBnZXRgIGlzIGRlcHJlY2F0ZWRcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIGlzIGRlcHJlY2F0ZWRcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0ICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKGlzTmFOKHBhcnNlZCkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGFzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgICBpZiAoaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgbGVuZ3RoID0gbGVuZ3RoIHwgMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIC8vIGxlZ2FjeSB3cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aCkgLSByZW1vdmUgaW4gdjAuMTNcbiAgfSBlbHNlIHtcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGggfCAwXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBiaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGJpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIGlmIChuZXdCdWYubGVuZ3RoKSBuZXdCdWYucGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpc1xuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYnVmZmVyIG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCd2YWx1ZSBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludEJFID0gZnVuY3Rpb24gd3JpdGVVSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSwgMClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIHZhciBtdWwgPSAxXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4ZmYsIDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHZhbHVlID0gTWF0aC5mbG9vcih2YWx1ZSlcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuZnVuY3Rpb24gb2JqZWN0V3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuKSB7XG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIGxpbWl0ID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGggLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICB2YXIgaSA9IDBcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IHZhbHVlIDwgMCA/IDEgOiAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gdmFsdWUgPCAwID8gMSA6IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignaW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdpbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDgsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gY29weSAodGFyZ2V0LCB0YXJnZXRTdGFydCwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0U3RhcnQgPj0gdGFyZ2V0Lmxlbmd0aCkgdGFyZ2V0U3RhcnQgPSB0YXJnZXQubGVuZ3RoXG4gIGlmICghdGFyZ2V0U3RhcnQpIHRhcmdldFN0YXJ0ID0gMFxuICBpZiAoZW5kID4gMCAmJiBlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgaWYgKHRhcmdldFN0YXJ0IDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgfVxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuICB2YXIgaVxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgc3RhcnQgPCB0YXJnZXRTdGFydCAmJiB0YXJnZXRTdGFydCA8IGVuZCkge1xuICAgIC8vIGRlc2NlbmRpbmcgY29weSBmcm9tIGVuZFxuICAgIGZvciAoaSA9IGxlbiAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIGlmIChsZW4gPCAxMDAwIHx8ICFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIGFzY2VuZGluZyBjb3B5IGZyb20gc3RhcnRcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0U3RhcnQpXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBSYW5nZUVycm9yKCdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdGhpc1tpXSA9IHZhbHVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IHV0ZjhUb0J5dGVzKHZhbHVlLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICAgIHRoaXNbaV0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uIHRvQXJyYXlCdWZmZXIgKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIH1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIF9hdWdtZW50IChhcnIpIHtcbiAgYXJyLmNvbnN0cnVjdG9yID0gQnVmZmVyXG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBzZXQgbWV0aG9kIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmVxdWFscyA9IEJQLmVxdWFsc1xuICBhcnIuY29tcGFyZSA9IEJQLmNvbXBhcmVcbiAgYXJyLmluZGV4T2YgPSBCUC5pbmRleE9mXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnRMRSA9IEJQLnJlYWRVSW50TEVcbiAgYXJyLnJlYWRVSW50QkUgPSBCUC5yZWFkVUludEJFXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludExFID0gQlAucmVhZEludExFXG4gIGFyci5yZWFkSW50QkUgPSBCUC5yZWFkSW50QkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50TEUgPSBCUC53cml0ZVVJbnRMRVxuICBhcnIud3JpdGVVSW50QkUgPSBCUC53cml0ZVVJbnRCRVxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50TEUgPSBCUC53cml0ZUludExFXG4gIGFyci53cml0ZUludEJFID0gQlAud3JpdGVJbnRCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuIiwiLyohIGllZWU3NTQuIEJTRC0zLUNsYXVzZSBMaWNlbnNlLiBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmcvb3BlbnNvdXJjZT4gKi9cbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gKGUgKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgZSA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gbUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gKG0gKiAyNTYpICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IChuQnl0ZXMgKiA4KSAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAoKHZhbHVlICogYykgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gZSArIGVCaWFzXG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IDBcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KSB7fVxuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG1cbiAgZUxlbiArPSBtTGVuXG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCkge31cblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjhcbn1cbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcnIpID09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbnZhciBpc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmopIHtcbiAgaWYgKCFvYmogfHwgdG9TdHIuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBoYXNPd25Db25zdHJ1Y3RvciA9IGhhc093bi5jYWxsKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gIHZhciBoYXNJc1Byb3RvdHlwZU9mID1cbiAgICBvYmouY29uc3RydWN0b3IgJiZcbiAgICBvYmouY29uc3RydWN0b3IucHJvdG90eXBlICYmXG4gICAgaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ2lzUHJvdG90eXBlT2YnKTtcbiAgLy8gTm90IG93biBjb25zdHJ1Y3RvciBwcm9wZXJ0eSBtdXN0IGJlIE9iamVjdFxuICBpZiAob2JqLmNvbnN0cnVjdG9yICYmICFoYXNPd25Db25zdHJ1Y3RvciAmJiAhaGFzSXNQcm90b3R5cGVPZikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE93biBwcm9wZXJ0aWVzIGFyZSBlbnVtZXJhdGVkIGZpcnN0bHksIHNvIHRvIHNwZWVkIHVwLFxuICAvLyBpZiBsYXN0IG9uZSBpcyBvd24sIHRoZW4gYWxsIHByb3BlcnRpZXMgYXJlIG93bi5cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgLyoqL1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcbn07XG5cbmZ1bmN0aW9uIG1lcmdlKCkge1xuICB2YXIgaSxcbiAgICBzcmMsXG4gICAgY29weSxcbiAgICBjbG9uZSxcbiAgICBuYW1lLFxuICAgIHJlc3VsdCA9IHt9LFxuICAgIGN1cnJlbnQgPSBudWxsLFxuICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY3VycmVudCA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAoY3VycmVudCA9PSBudWxsKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmb3IgKG5hbWUgaW4gY3VycmVudCkge1xuICAgICAgc3JjID0gcmVzdWx0W25hbWVdO1xuICAgICAgY29weSA9IGN1cnJlbnRbbmFtZV07XG4gICAgICBpZiAocmVzdWx0ICE9PSBjb3B5KSB7XG4gICAgICAgIGlmIChjb3B5ICYmIGlzUGxhaW5PYmplY3QoY29weSkpIHtcbiAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBpc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICByZXN1bHRbbmFtZV0gPSBtZXJnZShjbG9uZSwgY29weSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgcmVzdWx0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG52YXIgbG9nZ2VyID0ge1xuICBlcnJvcjogY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUpLFxuICBpbmZvOiBjb25zb2xlLmluZm8uYmluZChjb25zb2xlKSxcbiAgbG9nOiBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpLFxufTtcbi8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvZ2dlcjtcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbGl0eScpO1xudmFyIGxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJyk7XG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXIvJykuQnVmZmVyO1xuXG5mdW5jdGlvbiBUcmFuc3BvcnQodHJ1bmNhdGlvbikge1xuICB0aGlzLnJhdGVMaW1pdEV4cGlyZXMgPSAwO1xuICB0aGlzLnRydW5jYXRpb24gPSB0cnVuY2F0aW9uO1xufVxuXG5UcmFuc3BvcnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zLCBjYWxsYmFjaykge1xuICBpZiAoIWNhbGxiYWNrIHx8ICFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgXy5hZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGFyYW1zKTtcbiAgdmFyIGhlYWRlcnMgPSBfaGVhZGVycyhhY2Nlc3NUb2tlbiwgb3B0aW9ucyk7XG4gIGZldGNoKF8uZm9ybWF0VXJsKG9wdGlvbnMpLCB7XG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XG4gICAgICBfaGFuZGxlUmVzcG9uc2UocmVzcCwgY2FsbGJhY2spO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfSk7XG59O1xuXG5UcmFuc3BvcnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBheWxvYWQsIGNhbGxiYWNrKSB7XG4gIGlmICghY2FsbGJhY2sgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoIXBheWxvYWQpIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCdDYW5ub3Qgc2VuZCBlbXB0eSByZXF1ZXN0JykpO1xuICB9XG5cbiAgdmFyIHN0cmluZ2lmeVJlc3VsdDtcbiAgaWYgKHRoaXMudHJ1bmNhdGlvbikge1xuICAgIHN0cmluZ2lmeVJlc3VsdCA9IHRoaXMudHJ1bmNhdGlvbi50cnVuY2F0ZShwYXlsb2FkKTtcbiAgfSBlbHNlIHtcbiAgICBzdHJpbmdpZnlSZXN1bHQgPSBfLnN0cmluZ2lmeShwYXlsb2FkKTtcbiAgfVxuICBpZiAoc3RyaW5naWZ5UmVzdWx0LmVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdQcm9ibGVtIHN0cmluZ2lmeWluZyBwYXlsb2FkLiBHaXZpbmcgdXAnKTtcbiAgICByZXR1cm4gY2FsbGJhY2soc3RyaW5naWZ5UmVzdWx0LmVycm9yKTtcbiAgfVxuICB2YXIgd3JpdGVEYXRhID0gc3RyaW5naWZ5UmVzdWx0LnZhbHVlO1xuICB2YXIgaGVhZGVycyA9IF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCB3cml0ZURhdGEpO1xuXG4gIF9tYWtlUmVxdWVzdChoZWFkZXJzLCBvcHRpb25zLCB3cml0ZURhdGEsIGNhbGxiYWNrKTtcbn07XG5cblRyYW5zcG9ydC5wcm90b3R5cGUucG9zdEpzb25QYXlsb2FkID0gZnVuY3Rpb24gKFxuICBhY2Nlc3NUb2tlbixcbiAgb3B0aW9ucyxcbiAganNvblBheWxvYWQsXG4gIGNhbGxiYWNrLFxuKSB7XG4gIGlmICghY2FsbGJhY2sgfHwgIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAoIWpzb25QYXlsb2FkKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcignQ2Fubm90IHNlbmQgZW1wdHkgcmVxdWVzdCcpKTtcbiAgfVxuICB2YXIgaGVhZGVycyA9IF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBqc29uUGF5bG9hZCk7XG5cbiAgX21ha2VSZXF1ZXN0KGhlYWRlcnMsIG9wdGlvbnMsIGpzb25QYXlsb2FkLCBjYWxsYmFjayk7XG59O1xuXG4vKiogSGVscGVycyAqKi9cbmZ1bmN0aW9uIF9tYWtlUmVxdWVzdChoZWFkZXJzLCBvcHRpb25zLCBkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgdXJsID0gXy5mb3JtYXRVcmwob3B0aW9ucyk7XG4gIGZldGNoKHVybCwge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgYm9keTogZGF0YSxcbiAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgcmV0dXJuIHJlc3AuanNvbigpO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIF9oYW5kbGVSZXNwb25zZShkYXRhLCBfd3JhcFBvc3RDYWxsYmFjayhjYWxsYmFjaykpO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9oZWFkZXJzKGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBkYXRhKSB7XG4gIHZhciBoZWFkZXJzID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5oZWFkZXJzKSB8fCB7fTtcbiAgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbic7XG4gIGlmIChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtTGVuZ3RoJ10gPSBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhLCAndXRmOCcpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcignQ291bGQgbm90IGdldCB0aGUgY29udGVudCBsZW5ndGggb2YgdGhlIGRhdGEnKTtcbiAgICB9XG4gIH1cbiAgaGVhZGVyc1snWC1Sb2xsYmFyLUFjY2Vzcy1Ub2tlbiddID0gYWNjZXNzVG9rZW47XG4gIHJldHVybiBoZWFkZXJzO1xufVxuXG5mdW5jdGlvbiBfaGFuZGxlUmVzcG9uc2UoZGF0YSwgY2FsbGJhY2spIHtcbiAgaWYgKGRhdGEuZXJyKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdSZWNlaXZlZCBlcnJvcjogJyArIGRhdGEubWVzc2FnZSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKFxuICAgICAgbmV3IEVycm9yKCdBcGkgZXJyb3I6ICcgKyAoZGF0YS5tZXNzYWdlIHx8ICdVbmtub3duIGVycm9yJykpLFxuICAgICk7XG4gIH1cblxuICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gX3dyYXBQb3N0Q2FsbGJhY2soY2FsbGJhY2spIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICB9XG4gICAgaWYgKGRhdGEucmVzdWx0ICYmIGRhdGEucmVzdWx0LnV1aWQpIHtcbiAgICAgIGxvZ2dlci5sb2coXG4gICAgICAgIFtcbiAgICAgICAgICAnU3VjY2Vzc2Z1bCBhcGkgcmVzcG9uc2UuJyxcbiAgICAgICAgICAnIExpbms6IGh0dHBzOi8vcm9sbGJhci5jb20vb2NjdXJyZW5jZS91dWlkLz91dWlkPScgK1xuICAgICAgICAgICAgZGF0YS5yZXN1bHQudXVpZCxcbiAgICAgICAgXS5qb2luKCcnKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5sb2coJ1N1Y2Nlc3NmdWwgYXBpIHJlc3BvbnNlJyk7XG4gICAgfVxuICAgIGNhbGxiYWNrKG51bGwsIGRhdGEucmVzdWx0KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc3BvcnQ7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbGl0eScpO1xudmFyIHRyYXZlcnNlID0gcmVxdWlyZSgnLi91dGlsaXR5L3RyYXZlcnNlJyk7XG5cbmZ1bmN0aW9uIHJhdyhwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGcmFtZXMoZnJhbWVzLCByYW5nZSkge1xuICB2YXIgbGVuID0gZnJhbWVzLmxlbmd0aDtcbiAgaWYgKGxlbiA+IHJhbmdlICogMikge1xuICAgIHJldHVybiBmcmFtZXMuc2xpY2UoMCwgcmFuZ2UpLmNvbmNhdChmcmFtZXMuc2xpY2UobGVuIC0gcmFuZ2UpKTtcbiAgfVxuICByZXR1cm4gZnJhbWVzO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZUZyYW1lcyhwYXlsb2FkLCBqc29uQmFja3VwLCByYW5nZSkge1xuICByYW5nZSA9IHR5cGVvZiByYW5nZSA9PT0gJ3VuZGVmaW5lZCcgPyAzMCA6IHJhbmdlO1xuICB2YXIgYm9keSA9IHBheWxvYWQuZGF0YS5ib2R5O1xuICB2YXIgZnJhbWVzO1xuICBpZiAoYm9keS50cmFjZV9jaGFpbikge1xuICAgIHZhciBjaGFpbiA9IGJvZHkudHJhY2VfY2hhaW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGFpbi5sZW5ndGg7IGkrKykge1xuICAgICAgZnJhbWVzID0gY2hhaW5baV0uZnJhbWVzO1xuICAgICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgICAgY2hhaW5baV0uZnJhbWVzID0gZnJhbWVzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChib2R5LnRyYWNlKSB7XG4gICAgZnJhbWVzID0gYm9keS50cmFjZS5mcmFtZXM7XG4gICAgZnJhbWVzID0gc2VsZWN0RnJhbWVzKGZyYW1lcywgcmFuZ2UpO1xuICAgIGJvZHkudHJhY2UuZnJhbWVzID0gZnJhbWVzO1xuICB9XG4gIHJldHVybiBbcGF5bG9hZCwgXy5zdHJpbmdpZnkocGF5bG9hZCwganNvbkJhY2t1cCldO1xufVxuXG5mdW5jdGlvbiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2YWwpIHtcbiAgaWYgKCF2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG4gIGlmICh2YWwubGVuZ3RoID4gbGVuKSB7XG4gICAgcmV0dXJuIHZhbC5zbGljZSgwLCBsZW4gLSAzKS5jb25jYXQoJy4uLicpO1xuICB9XG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlU3RyaW5ncyhsZW4sIHBheWxvYWQsIGpzb25CYWNrdXApIHtcbiAgZnVuY3Rpb24gdHJ1bmNhdG9yKGssIHYsIHNlZW4pIHtcbiAgICBzd2l0Y2ggKF8udHlwZU5hbWUodikpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiBtYXliZVRydW5jYXRlVmFsdWUobGVuLCB2KTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIHJldHVybiB0cmF2ZXJzZSh2LCB0cnVuY2F0b3IsIHNlZW4pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuICB9XG4gIHBheWxvYWQgPSB0cmF2ZXJzZShwYXlsb2FkLCB0cnVuY2F0b3IpO1xuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGVUcmFjZURhdGEodHJhY2VEYXRhKSB7XG4gIGlmICh0cmFjZURhdGEuZXhjZXB0aW9uKSB7XG4gICAgZGVsZXRlIHRyYWNlRGF0YS5leGNlcHRpb24uZGVzY3JpcHRpb247XG4gICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlID0gbWF5YmVUcnVuY2F0ZVZhbHVlKFxuICAgICAgMjU1LFxuICAgICAgdHJhY2VEYXRhLmV4Y2VwdGlvbi5tZXNzYWdlLFxuICAgICk7XG4gIH1cbiAgdHJhY2VEYXRhLmZyYW1lcyA9IHNlbGVjdEZyYW1lcyh0cmFjZURhdGEuZnJhbWVzLCAxKTtcbiAgcmV0dXJuIHRyYWNlRGF0YTtcbn1cblxuZnVuY3Rpb24gbWluQm9keShwYXlsb2FkLCBqc29uQmFja3VwKSB7XG4gIHZhciBib2R5ID0gcGF5bG9hZC5kYXRhLmJvZHk7XG4gIGlmIChib2R5LnRyYWNlX2NoYWluKSB7XG4gICAgdmFyIGNoYWluID0gYm9keS50cmFjZV9jaGFpbjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFpbltpXSA9IHRydW5jYXRlVHJhY2VEYXRhKGNoYWluW2ldKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYm9keS50cmFjZSkge1xuICAgIGJvZHkudHJhY2UgPSB0cnVuY2F0ZVRyYWNlRGF0YShib2R5LnRyYWNlKTtcbiAgfVxuICByZXR1cm4gW3BheWxvYWQsIF8uc3RyaW5naWZ5KHBheWxvYWQsIGpzb25CYWNrdXApXTtcbn1cblxuZnVuY3Rpb24gbmVlZHNUcnVuY2F0aW9uKHBheWxvYWQsIG1heFNpemUpIHtcbiAgcmV0dXJuIF8ubWF4Qnl0ZVNpemUocGF5bG9hZCkgPiBtYXhTaXplO1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZShwYXlsb2FkLCBqc29uQmFja3VwLCBtYXhTaXplKSB7XG4gIG1heFNpemUgPSB0eXBlb2YgbWF4U2l6ZSA9PT0gJ3VuZGVmaW5lZCcgPyA1MTIgKiAxMDI0IDogbWF4U2l6ZTtcbiAgdmFyIHN0cmF0ZWdpZXMgPSBbXG4gICAgcmF3LFxuICAgIHRydW5jYXRlRnJhbWVzLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDEwMjQpLFxuICAgIHRydW5jYXRlU3RyaW5ncy5iaW5kKG51bGwsIDUxMiksXG4gICAgdHJ1bmNhdGVTdHJpbmdzLmJpbmQobnVsbCwgMjU2KSxcbiAgICBtaW5Cb2R5LFxuICBdO1xuICB2YXIgc3RyYXRlZ3ksIHJlc3VsdHMsIHJlc3VsdDtcblxuICB3aGlsZSAoKHN0cmF0ZWd5ID0gc3RyYXRlZ2llcy5zaGlmdCgpKSkge1xuICAgIHJlc3VsdHMgPSBzdHJhdGVneShwYXlsb2FkLCBqc29uQmFja3VwKTtcbiAgICBwYXlsb2FkID0gcmVzdWx0c1swXTtcbiAgICByZXN1bHQgPSByZXN1bHRzWzFdO1xuICAgIGlmIChyZXN1bHQuZXJyb3IgfHwgIW5lZWRzVHJ1bmNhdGlvbihyZXN1bHQudmFsdWUsIG1heFNpemUpKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdHJ1bmNhdGU6IHRydW5jYXRlLFxuXG4gIC8qIGZvciB0ZXN0aW5nICovXG4gIHJhdzogcmF3LFxuICB0cnVuY2F0ZUZyYW1lczogdHJ1bmNhdGVGcmFtZXMsXG4gIHRydW5jYXRlU3RyaW5nczogdHJ1bmNhdGVTdHJpbmdzLFxuICBtYXliZVRydW5jYXRlVmFsdWU6IG1heWJlVHJ1bmNhdGVWYWx1ZSxcbn07XG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKCcuL21lcmdlJyk7XG5cbnZhciBSb2xsYmFySlNPTiA9IHt9O1xuZnVuY3Rpb24gc2V0dXBKU09OKHBvbHlmaWxsSlNPTikge1xuICBpZiAoaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpICYmIGlzRnVuY3Rpb24oUm9sbGJhckpTT04ucGFyc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGlzRGVmaW5lZChKU09OKSkge1xuICAgIC8vIElmIHBvbHlmaWxsIGlzIHByb3ZpZGVkLCBwcmVmZXIgaXQgb3ZlciBleGlzdGluZyBub24tbmF0aXZlIHNoaW1zLlxuICAgIGlmIChwb2x5ZmlsbEpTT04pIHtcbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04uc3RyaW5naWZ5KSkge1xuICAgICAgICBSb2xsYmFySlNPTi5zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcbiAgICAgIH1cbiAgICAgIGlmIChpc05hdGl2ZUZ1bmN0aW9uKEpTT04ucGFyc2UpKSB7XG4gICAgICAgIFJvbGxiYXJKU09OLnBhcnNlID0gSlNPTi5wYXJzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZWxzZSBhY2NlcHQgYW55IGludGVyZmFjZSB0aGF0IGlzIHByZXNlbnQuXG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnN0cmluZ2lmeSkpIHtcbiAgICAgICAgUm9sbGJhckpTT04uc3RyaW5naWZ5ID0gSlNPTi5zdHJpbmdpZnk7XG4gICAgICB9XG4gICAgICBpZiAoaXNGdW5jdGlvbihKU09OLnBhcnNlKSkge1xuICAgICAgICBSb2xsYmFySlNPTi5wYXJzZSA9IEpTT04ucGFyc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICghaXNGdW5jdGlvbihSb2xsYmFySlNPTi5zdHJpbmdpZnkpIHx8ICFpc0Z1bmN0aW9uKFJvbGxiYXJKU09OLnBhcnNlKSkge1xuICAgIHBvbHlmaWxsSlNPTiAmJiBwb2x5ZmlsbEpTT04oUm9sbGJhckpTT04pO1xuICB9XG59XG5cbi8qXG4gKiBpc1R5cGUgLSBHaXZlbiBhIEphdmFzY3JpcHQgdmFsdWUgYW5kIGEgc3RyaW5nLCByZXR1cm5zIHRydWUgaWYgdGhlIHR5cGUgb2YgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gKiBnaXZlbiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHggLSBhbnkgdmFsdWVcbiAqIEBwYXJhbSB0IC0gYSBsb3dlcmNhc2Ugc3RyaW5nIGNvbnRhaW5pbmcgb25lIG9mIHRoZSBmb2xsb3dpbmcgdHlwZSBuYW1lczpcbiAqICAgIC0gdW5kZWZpbmVkXG4gKiAgICAtIG51bGxcbiAqICAgIC0gZXJyb3JcbiAqICAgIC0gbnVtYmVyXG4gKiAgICAtIGJvb2xlYW5cbiAqICAgIC0gc3RyaW5nXG4gKiAgICAtIHN5bWJvbFxuICogICAgLSBmdW5jdGlvblxuICogICAgLSBvYmplY3RcbiAqICAgIC0gYXJyYXlcbiAqIEByZXR1cm5zIHRydWUgaWYgeCBpcyBvZiB0eXBlIHQsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1R5cGUoeCwgdCkge1xuICByZXR1cm4gdCA9PT0gdHlwZU5hbWUoeCk7XG59XG5cbi8qXG4gKiB0eXBlTmFtZSAtIEdpdmVuIGEgSmF2YXNjcmlwdCB2YWx1ZSwgcmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgb2JqZWN0IGFzIGEgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHR5cGVOYW1lKHgpIHtcbiAgdmFyIG5hbWUgPSB0eXBlb2YgeDtcbiAgaWYgKG5hbWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuICdudWxsJztcbiAgfVxuICBpZiAoeCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuICdlcnJvcic7XG4gIH1cbiAgcmV0dXJuIHt9LnRvU3RyaW5nXG4gICAgLmNhbGwoeClcbiAgICAubWF0Y2goL1xccyhbYS16QS1aXSspLylbMV1cbiAgICAudG9Mb3dlckNhc2UoKTtcbn1cblxuLyogaXNGdW5jdGlvbiAtIGEgY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgaXMgYSBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZikge1xuICByZXR1cm4gaXNUeXBlKGYsICdmdW5jdGlvbicpO1xufVxuXG4vKiBpc05hdGl2ZUZ1bmN0aW9uIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBhIG5hdGl2ZSBKUyBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSBmIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBuYXRpdmUgSlMgZnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZUZ1bmN0aW9uKGYpIHtcbiAgdmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcbiAgdmFyIGZ1bmNNYXRjaFN0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZ1xuICAgIC5jYWxsKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpXG4gICAgLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/Jyk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNNYXRjaFN0cmluZyArICckJyk7XG4gIHJldHVybiBpc09iamVjdChmKSAmJiByZUlzTmF0aXZlLnRlc3QoZik7XG59XG5cbi8qIGlzT2JqZWN0IC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaXMgdmFsdWUgaXMgYW4gb2JqZWN0IGZ1bmN0aW9uIGlzIGFuIG9iamVjdClcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qIGlzU3RyaW5nIC0gQ2hlY2tzIGlmIHRoZSBhcmd1bWVudCBpcyBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIHN0cmluZ1xuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbn1cblxuLyoqXG4gKiBpc0Zpbml0ZU51bWJlciAtIGRldGVybWluZXMgd2hldGhlciB0aGUgcGFzc2VkIHZhbHVlIGlzIGEgZmluaXRlIG51bWJlclxuICpcbiAqIEBwYXJhbSB7Kn0gbiAtIGFueSB2YWx1ZVxuICogQHJldHVybnMgdHJ1ZSBpZiB2YWx1ZSBpcyBhIGZpbml0ZSBudW1iZXJcbiAqL1xuZnVuY3Rpb24gaXNGaW5pdGVOdW1iZXIobikge1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG4pO1xufVxuXG4vKlxuICogaXNEZWZpbmVkIC0gYSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBub3QgZXF1YWwgdG8gdW5kZWZpbmVkXG4gKlxuICogQHBhcmFtIHUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgdSBpcyBhbnl0aGluZyBvdGhlciB0aGFuIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBpc0RlZmluZWQodSkge1xuICByZXR1cm4gIWlzVHlwZSh1LCAndW5kZWZpbmVkJyk7XG59XG5cbi8qXG4gKiBpc0l0ZXJhYmxlIC0gY29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGEgdmFsdWUgY2FuIGJlIGl0ZXJhdGVkLCBlc3NlbnRpYWxseVxuICogd2hldGhlciBpdCBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkuXG4gKlxuICogQHBhcmFtIGkgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgaSBpcyBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgYXMgZGV0ZXJtaW5lZCBieSBgdHlwZU5hbWVgXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmFibGUoaSkge1xuICB2YXIgdHlwZSA9IHR5cGVOYW1lKGkpO1xuICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgfHwgdHlwZSA9PT0gJ2FycmF5Jztcbn1cblxuLypcbiAqIGlzRXJyb3IgLSBjb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYSB2YWx1ZSBpcyBvZiBhbiBlcnJvciB0eXBlXG4gKlxuICogQHBhcmFtIGUgLSBhbnkgdmFsdWVcbiAqIEByZXR1cm5zIHRydWUgaWYgZSBpcyBhbiBlcnJvclxuICovXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgLy8gRGV0ZWN0IGJvdGggRXJyb3IgYW5kIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgcmV0dXJuIGlzVHlwZShlLCAnZXJyb3InKSB8fCBpc1R5cGUoZSwgJ2V4Y2VwdGlvbicpO1xufVxuXG4vKiBpc1Byb21pc2UgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhIHZhbHVlIGlzIGEgcHJvbWlzZVxuICpcbiAqIEBwYXJhbSBwIC0gYW55IHZhbHVlXG4gKiBAcmV0dXJucyB0cnVlIGlmIGYgaXMgYSBmdW5jdGlvbiwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzUHJvbWlzZShwKSB7XG4gIHJldHVybiBpc09iamVjdChwKSAmJiBpc1R5cGUocC50aGVuLCAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBpc0Jyb3dzZXIgLSBhIGNvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlclxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnRcbiAqL1xuZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlZGFjdCgpIHtcbiAgcmV0dXJuICcqKioqKioqKic7XG59XG5cbi8vIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvODgwOTQ3Mi8xMTM4MTkxXG5mdW5jdGlvbiB1dWlkNCgpIHtcbiAgdmFyIGQgPSBub3coKTtcbiAgdmFyIHV1aWQgPSAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKFxuICAgIC9beHldL2csXG4gICAgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpICogMTYpICUgMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoZCAvIDE2KTtcbiAgICAgIHJldHVybiAoYyA9PT0gJ3gnID8gciA6IChyICYgMHg3KSB8IDB4OCkudG9TdHJpbmcoMTYpO1xuICAgIH0sXG4gICk7XG4gIHJldHVybiB1dWlkO1xufVxuXG52YXIgTEVWRUxTID0ge1xuICBkZWJ1ZzogMCxcbiAgaW5mbzogMSxcbiAgd2FybmluZzogMixcbiAgZXJyb3I6IDMsXG4gIGNyaXRpY2FsOiA0LFxufTtcblxuZnVuY3Rpb24gc2FuaXRpemVVcmwodXJsKSB7XG4gIHZhciBiYXNlVXJsUGFydHMgPSBwYXJzZVVyaSh1cmwpO1xuICBpZiAoIWJhc2VVcmxQYXJ0cykge1xuICAgIHJldHVybiAnKHVua25vd24pJztcbiAgfVxuXG4gIC8vIHJlbW92ZSBhIHRyYWlsaW5nICMgaWYgdGhlcmUgaXMgbm8gYW5jaG9yXG4gIGlmIChiYXNlVXJsUGFydHMuYW5jaG9yID09PSAnJykge1xuICAgIGJhc2VVcmxQYXJ0cy5zb3VyY2UgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJyMnLCAnJyk7XG4gIH1cblxuICB1cmwgPSBiYXNlVXJsUGFydHMuc291cmNlLnJlcGxhY2UoJz8nICsgYmFzZVVybFBhcnRzLnF1ZXJ5LCAnJyk7XG4gIHJldHVybiB1cmw7XG59XG5cbnZhciBwYXJzZVVyaU9wdGlvbnMgPSB7XG4gIHN0cmljdE1vZGU6IGZhbHNlLFxuICBrZXk6IFtcbiAgICAnc291cmNlJyxcbiAgICAncHJvdG9jb2wnLFxuICAgICdhdXRob3JpdHknLFxuICAgICd1c2VySW5mbycsXG4gICAgJ3VzZXInLFxuICAgICdwYXNzd29yZCcsXG4gICAgJ2hvc3QnLFxuICAgICdwb3J0JyxcbiAgICAncmVsYXRpdmUnLFxuICAgICdwYXRoJyxcbiAgICAnZGlyZWN0b3J5JyxcbiAgICAnZmlsZScsXG4gICAgJ3F1ZXJ5JyxcbiAgICAnYW5jaG9yJyxcbiAgXSxcbiAgcToge1xuICAgIG5hbWU6ICdxdWVyeUtleScsXG4gICAgcGFyc2VyOiAvKD86XnwmKShbXiY9XSopPT8oW14mXSopL2csXG4gIH0sXG4gIHBhcnNlcjoge1xuICAgIHN0cmljdDpcbiAgICAgIC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKSg/OjooW146QF0qKSk/KT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gICAgbG9vc2U6XG4gICAgICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBwYXJzZVVyaShzdHIpIHtcbiAgaWYgKCFpc1R5cGUoc3RyLCAnc3RyaW5nJykpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgdmFyIG8gPSBwYXJzZVVyaU9wdGlvbnM7XG4gIHZhciBtID0gby5wYXJzZXJbby5zdHJpY3RNb2RlID8gJ3N0cmljdCcgOiAnbG9vc2UnXS5leGVjKHN0cik7XG4gIHZhciB1cmkgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IG8ua2V5Lmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIHVyaVtvLmtleVtpXV0gPSBtW2ldIHx8ICcnO1xuICB9XG5cbiAgdXJpW28ucS5uYW1lXSA9IHt9O1xuICB1cmlbby5rZXlbMTJdXS5yZXBsYWNlKG8ucS5wYXJzZXIsIGZ1bmN0aW9uICgkMCwgJDEsICQyKSB7XG4gICAgaWYgKCQxKSB7XG4gICAgICB1cmlbby5xLm5hbWVdWyQxXSA9ICQyO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGgoYWNjZXNzVG9rZW4sIG9wdGlvbnMsIHBhcmFtcykge1xuICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIHBhcmFtcy5hY2Nlc3NfdG9rZW4gPSBhY2Nlc3NUb2tlbjtcbiAgdmFyIHBhcmFtc0FycmF5ID0gW107XG4gIHZhciBrO1xuICBmb3IgKGsgaW4gcGFyYW1zKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChwYXJhbXMsIGspKSB7XG4gICAgICBwYXJhbXNBcnJheS5wdXNoKFtrLCBwYXJhbXNba11dLmpvaW4oJz0nKSk7XG4gICAgfVxuICB9XG4gIHZhciBxdWVyeSA9ICc/JyArIHBhcmFtc0FycmF5LnNvcnQoKS5qb2luKCcmJyk7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIG9wdGlvbnMucGF0aCA9IG9wdGlvbnMucGF0aCB8fCAnJztcbiAgdmFyIHFzID0gb3B0aW9ucy5wYXRoLmluZGV4T2YoJz8nKTtcbiAgdmFyIGggPSBvcHRpb25zLnBhdGguaW5kZXhPZignIycpO1xuICB2YXIgcDtcbiAgaWYgKHFzICE9PSAtMSAmJiAoaCA9PT0gLTEgfHwgaCA+IHFzKSkge1xuICAgIHAgPSBvcHRpb25zLnBhdGg7XG4gICAgb3B0aW9ucy5wYXRoID0gcC5zdWJzdHJpbmcoMCwgcXMpICsgcXVlcnkgKyAnJicgKyBwLnN1YnN0cmluZyhxcyArIDEpO1xuICB9IGVsc2Uge1xuICAgIGlmIChoICE9PSAtMSkge1xuICAgICAgcCA9IG9wdGlvbnMucGF0aDtcbiAgICAgIG9wdGlvbnMucGF0aCA9IHAuc3Vic3RyaW5nKDAsIGgpICsgcXVlcnkgKyBwLnN1YnN0cmluZyhoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5wYXRoID0gb3B0aW9ucy5wYXRoICsgcXVlcnk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFVybCh1LCBwcm90b2NvbCkge1xuICBwcm90b2NvbCA9IHByb3RvY29sIHx8IHUucHJvdG9jb2w7XG4gIGlmICghcHJvdG9jb2wgJiYgdS5wb3J0KSB7XG4gICAgaWYgKHUucG9ydCA9PT0gODApIHtcbiAgICAgIHByb3RvY29sID0gJ2h0dHA6JztcbiAgICB9IGVsc2UgaWYgKHUucG9ydCA9PT0gNDQzKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczonO1xuICAgIH1cbiAgfVxuICBwcm90b2NvbCA9IHByb3RvY29sIHx8ICdodHRwczonO1xuXG4gIGlmICghdS5ob3N0bmFtZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciByZXN1bHQgPSBwcm90b2NvbCArICcvLycgKyB1Lmhvc3RuYW1lO1xuICBpZiAodS5wb3J0KSB7XG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgJzonICsgdS5wb3J0O1xuICB9XG4gIGlmICh1LnBhdGgpIHtcbiAgICByZXN1bHQgPSByZXN1bHQgKyB1LnBhdGg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgYmFja3VwKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfSBjYXRjaCAoanNvbkVycm9yKSB7XG4gICAgaWYgKGJhY2t1cCAmJiBpc0Z1bmN0aW9uKGJhY2t1cCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gYmFja3VwKG9iaik7XG4gICAgICB9IGNhdGNoIChiYWNrdXBFcnJvcikge1xuICAgICAgICBlcnJvciA9IGJhY2t1cEVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IGpzb25FcnJvcjtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgZXJyb3I6IGVycm9yLCB2YWx1ZTogdmFsdWUgfTtcbn1cblxuZnVuY3Rpb24gbWF4Qnl0ZVNpemUoc3RyaW5nKSB7XG4gIC8vIFRoZSB0cmFuc3BvcnQgd2lsbCB1c2UgdXRmLTgsIHNvIGFzc3VtZSB1dGYtOCBlbmNvZGluZy5cbiAgLy9cbiAgLy8gVGhpcyBtaW5pbWFsIGltcGxlbWVudGF0aW9uIHdpbGwgYWNjdXJhdGVseSBjb3VudCBieXRlcyBmb3IgYWxsIFVDUy0yIGFuZFxuICAvLyBzaW5nbGUgY29kZSBwb2ludCBVVEYtMTYuIElmIHByZXNlbnRlZCB3aXRoIG11bHRpIGNvZGUgcG9pbnQgVVRGLTE2LFxuICAvLyB3aGljaCBzaG91bGQgYmUgcmFyZSwgaXQgd2lsbCBzYWZlbHkgb3ZlcmNvdW50LCBub3QgdW5kZXJjb3VudC5cbiAgLy9cbiAgLy8gV2hpbGUgcm9idXN0IHV0Zi04IGVuY29kZXJzIGV4aXN0LCB0aGlzIGlzIGZhciBzbWFsbGVyIGFuZCBmYXIgbW9yZSBwZXJmb3JtYW50LlxuICAvLyBGb3IgcXVpY2tseSBjb3VudGluZyBwYXlsb2FkIHNpemUgZm9yIHRydW5jYXRpb24sIHNtYWxsZXIgaXMgYmV0dGVyLlxuXG4gIHZhciBjb3VudCA9IDA7XG4gIHZhciBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY29kZSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChjb2RlIDwgMTI4KSB7XG4gICAgICAvLyB1cCB0byA3IGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAxO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDIwNDgpIHtcbiAgICAgIC8vIHVwIHRvIDExIGJpdHNcbiAgICAgIGNvdW50ID0gY291bnQgKyAyO1xuICAgIH0gZWxzZSBpZiAoY29kZSA8IDY1NTM2KSB7XG4gICAgICAvLyB1cCB0byAxNiBiaXRzXG4gICAgICBjb3VudCA9IGNvdW50ICsgMztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY291bnQ7XG59XG5cbmZ1bmN0aW9uIGpzb25QYXJzZShzKSB7XG4gIHZhciB2YWx1ZSwgZXJyb3I7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBSb2xsYmFySlNPTi5wYXJzZShzKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4geyBlcnJvcjogZXJyb3IsIHZhbHVlOiB2YWx1ZSB9O1xufVxuXG5mdW5jdGlvbiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvKFxuICBtZXNzYWdlLFxuICB1cmwsXG4gIGxpbmVubyxcbiAgY29sbm8sXG4gIGVycm9yLFxuICBtb2RlLFxuICBiYWNrdXBNZXNzYWdlLFxuICBlcnJvclBhcnNlcixcbikge1xuICB2YXIgbG9jYXRpb24gPSB7XG4gICAgdXJsOiB1cmwgfHwgJycsXG4gICAgbGluZTogbGluZW5vLFxuICAgIGNvbHVtbjogY29sbm8sXG4gIH07XG4gIGxvY2F0aW9uLmZ1bmMgPSBlcnJvclBhcnNlci5ndWVzc0Z1bmN0aW9uTmFtZShsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICBsb2NhdGlvbi5jb250ZXh0ID0gZXJyb3JQYXJzZXIuZ2F0aGVyQ29udGV4dChsb2NhdGlvbi51cmwsIGxvY2F0aW9uLmxpbmUpO1xuICB2YXIgaHJlZiA9XG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIGRvY3VtZW50ICYmXG4gICAgZG9jdW1lbnQubG9jYXRpb24gJiZcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICB2YXIgdXNlcmFnZW50ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHdpbmRvdyAmJlxuICAgIHdpbmRvdy5uYXZpZ2F0b3IgJiZcbiAgICB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIHtcbiAgICBtb2RlOiBtb2RlLFxuICAgIG1lc3NhZ2U6IGVycm9yID8gU3RyaW5nKGVycm9yKSA6IG1lc3NhZ2UgfHwgYmFja3VwTWVzc2FnZSxcbiAgICB1cmw6IGhyZWYsXG4gICAgc3RhY2s6IFtsb2NhdGlvbl0sXG4gICAgdXNlcmFnZW50OiB1c2VyYWdlbnQsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXBDYWxsYmFjayhsb2dnZXIsIGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIsIHJlc3ApIHtcbiAgICB0cnkge1xuICAgICAgZihlcnIsIHJlc3ApO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihlKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5vbkNpcmN1bGFyQ2xvbmUob2JqKSB7XG4gIHZhciBzZWVuID0gW29ial07XG5cbiAgZnVuY3Rpb24gY2xvbmUob2JqLCBzZWVuKSB7XG4gICAgdmFyIHZhbHVlLFxuICAgICAgbmFtZSxcbiAgICAgIG5ld1NlZW4sXG4gICAgICByZXN1bHQgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKG5hbWUgaW4gb2JqKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW25hbWVdO1xuXG4gICAgICAgIGlmICh2YWx1ZSAmJiAoaXNUeXBlKHZhbHVlLCAnb2JqZWN0JykgfHwgaXNUeXBlKHZhbHVlLCAnYXJyYXknKSkpIHtcbiAgICAgICAgICBpZiAoc2Vlbi5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtuYW1lXSA9ICdSZW1vdmVkIGNpcmN1bGFyIHJlZmVyZW5jZTogJyArIHR5cGVOYW1lKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3U2VlbiA9IHNlZW4uc2xpY2UoKTtcbiAgICAgICAgICAgIG5ld1NlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBjbG9uZSh2YWx1ZSwgbmV3U2Vlbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzdWx0ID0gJ0ZhaWxlZCBjbG9uaW5nIGN1c3RvbSBkYXRhOiAnICsgZS5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJldHVybiBjbG9uZShvYmosIHNlZW4pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJdGVtKGFyZ3MsIGxvZ2dlciwgbm90aWZpZXIsIHJlcXVlc3RLZXlzLCBsYW1iZGFDb250ZXh0KSB7XG4gIHZhciBtZXNzYWdlLCBlcnIsIGN1c3RvbSwgY2FsbGJhY2ssIHJlcXVlc3Q7XG4gIHZhciBhcmc7XG4gIHZhciBleHRyYUFyZ3MgPSBbXTtcbiAgdmFyIGRpYWdub3N0aWMgPSB7fTtcbiAgdmFyIGFyZ1R5cGVzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBhcmdUeXBlcy5wdXNoKHR5cCk7XG4gICAgc3dpdGNoICh0eXApIHtcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgbWVzc2FnZSA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAobWVzc2FnZSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICBjYWxsYmFjayA9IHdyYXBDYWxsYmFjayhsb2dnZXIsIGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgY2FzZSAnZG9tZXhjZXB0aW9uJzpcbiAgICAgIGNhc2UgJ2V4Y2VwdGlvbic6IC8vIEZpcmVmb3ggRXhjZXB0aW9uIHR5cGVcbiAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhcmcgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAgICh0eXBlb2YgRE9NRXhjZXB0aW9uICE9PSAndW5kZWZpbmVkJyAmJiBhcmcgaW5zdGFuY2VvZiBET01FeGNlcHRpb24pXG4gICAgICAgICkge1xuICAgICAgICAgIGVyciA/IGV4dHJhQXJncy5wdXNoKGFyZykgOiAoZXJyID0gYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxdWVzdEtleXMgJiYgdHlwID09PSAnb2JqZWN0JyAmJiAhcmVxdWVzdCkge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsZW4gPSByZXF1ZXN0S2V5cy5sZW5ndGg7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgaWYgKGFyZ1tyZXF1ZXN0S2V5c1tqXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXF1ZXN0ID0gYXJnO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcXVlc3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXN0b20gPyBleHRyYUFyZ3MucHVzaChhcmcpIDogKGN1c3RvbSA9IGFyZyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGFyZyBpbnN0YW5jZW9mIEVycm9yIHx8XG4gICAgICAgICAgKHR5cGVvZiBET01FeGNlcHRpb24gIT09ICd1bmRlZmluZWQnICYmIGFyZyBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyID8gZXh0cmFBcmdzLnB1c2goYXJnKSA6IChlcnIgPSBhcmcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGV4dHJhQXJncy5wdXNoKGFyZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gaWYgY3VzdG9tIGlzIGFuIGFycmF5IHRoaXMgdHVybnMgaXQgaW50byBhbiBvYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXNcbiAgaWYgKGN1c3RvbSkgY3VzdG9tID0gbm9uQ2lyY3VsYXJDbG9uZShjdXN0b20pO1xuXG4gIGlmIChleHRyYUFyZ3MubGVuZ3RoID4gMCkge1xuICAgIGlmICghY3VzdG9tKSBjdXN0b20gPSBub25DaXJjdWxhckNsb25lKHt9KTtcbiAgICBjdXN0b20uZXh0cmFBcmdzID0gbm9uQ2lyY3VsYXJDbG9uZShleHRyYUFyZ3MpO1xuICB9XG5cbiAgdmFyIGl0ZW0gPSB7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBlcnI6IGVycixcbiAgICBjdXN0b206IGN1c3RvbSxcbiAgICB0aW1lc3RhbXA6IG5vdygpLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBub3RpZmllcjogbm90aWZpZXIsXG4gICAgZGlhZ25vc3RpYzogZGlhZ25vc3RpYyxcbiAgICB1dWlkOiB1dWlkNCgpLFxuICB9O1xuXG4gIGl0ZW0uZGF0YSA9IGl0ZW0uZGF0YSB8fCB7fTtcblxuICBzZXRDdXN0b21JdGVtS2V5cyhpdGVtLCBjdXN0b20pO1xuXG4gIGlmIChyZXF1ZXN0S2V5cyAmJiByZXF1ZXN0KSB7XG4gICAgaXRlbS5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgfVxuICBpZiAobGFtYmRhQ29udGV4dCkge1xuICAgIGl0ZW0ubGFtYmRhQ29udGV4dCA9IGxhbWJkYUNvbnRleHQ7XG4gIH1cbiAgaXRlbS5fb3JpZ2luYWxBcmdzID0gYXJncztcbiAgaXRlbS5kaWFnbm9zdGljLm9yaWdpbmFsX2FyZ190eXBlcyA9IGFyZ1R5cGVzO1xuICByZXR1cm4gaXRlbTtcbn1cblxuZnVuY3Rpb24gc2V0Q3VzdG9tSXRlbUtleXMoaXRlbSwgY3VzdG9tKSB7XG4gIGlmIChjdXN0b20gJiYgY3VzdG9tLmxldmVsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpdGVtLmxldmVsID0gY3VzdG9tLmxldmVsO1xuICAgIGRlbGV0ZSBjdXN0b20ubGV2ZWw7XG4gIH1cbiAgaWYgKGN1c3RvbSAmJiBjdXN0b20uc2tpcEZyYW1lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlbS5za2lwRnJhbWVzID0gY3VzdG9tLnNraXBGcmFtZXM7XG4gICAgZGVsZXRlIGN1c3RvbS5za2lwRnJhbWVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9yQ29udGV4dChpdGVtLCBlcnJvcnMpIHtcbiAgdmFyIGN1c3RvbSA9IGl0ZW0uZGF0YS5jdXN0b20gfHwge307XG4gIHZhciBjb250ZXh0QWRkZWQgPSBmYWxzZTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoZXJyb3JzW2ldLmhhc093blByb3BlcnR5KCdyb2xsYmFyQ29udGV4dCcpKSB7XG4gICAgICAgIGN1c3RvbSA9IG1lcmdlKGN1c3RvbSwgbm9uQ2lyY3VsYXJDbG9uZShlcnJvcnNbaV0ucm9sbGJhckNvbnRleHQpKTtcbiAgICAgICAgY29udGV4dEFkZGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBdm9pZCBhZGRpbmcgYW4gZW1wdHkgb2JqZWN0IHRvIHRoZSBkYXRhLlxuICAgIGlmIChjb250ZXh0QWRkZWQpIHtcbiAgICAgIGl0ZW0uZGF0YS5jdXN0b20gPSBjdXN0b207XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaXRlbS5kaWFnbm9zdGljLmVycm9yX2NvbnRleHQgPSAnRmFpbGVkOiAnICsgZS5tZXNzYWdlO1xuICB9XG59XG5cbnZhciBURUxFTUVUUllfVFlQRVMgPSBbXG4gICdsb2cnLFxuICAnbmV0d29yaycsXG4gICdkb20nLFxuICAnbmF2aWdhdGlvbicsXG4gICdlcnJvcicsXG4gICdtYW51YWwnLFxuXTtcbnZhciBURUxFTUVUUllfTEVWRUxTID0gWydjcml0aWNhbCcsICdlcnJvcicsICd3YXJuaW5nJywgJ2luZm8nLCAnZGVidWcnXTtcblxuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnIsIHZhbCkge1xuICBmb3IgKHZhciBrID0gMDsgayA8IGFyci5sZW5ndGg7ICsraykge1xuICAgIGlmIChhcnJba10gPT09IHZhbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUZWxlbWV0cnlFdmVudChhcmdzKSB7XG4gIHZhciB0eXBlLCBtZXRhZGF0YSwgbGV2ZWw7XG4gIHZhciBhcmc7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcmdzLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG5cbiAgICB2YXIgdHlwID0gdHlwZU5hbWUoYXJnKTtcbiAgICBzd2l0Y2ggKHR5cCkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKCF0eXBlICYmIGFycmF5SW5jbHVkZXMoVEVMRU1FVFJZX1RZUEVTLCBhcmcpKSB7XG4gICAgICAgICAgdHlwZSA9IGFyZztcbiAgICAgICAgfSBlbHNlIGlmICghbGV2ZWwgJiYgYXJyYXlJbmNsdWRlcyhURUxFTUVUUllfTEVWRUxTLCBhcmcpKSB7XG4gICAgICAgICAgbGV2ZWwgPSBhcmc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBtZXRhZGF0YSA9IGFyZztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV2ZW50ID0ge1xuICAgIHR5cGU6IHR5cGUgfHwgJ21hbnVhbCcsXG4gICAgbWV0YWRhdGE6IG1ldGFkYXRhIHx8IHt9LFxuICAgIGxldmVsOiBsZXZlbCxcbiAgfTtcblxuICByZXR1cm4gZXZlbnQ7XG59XG5cbmZ1bmN0aW9uIGFkZEl0ZW1BdHRyaWJ1dGVzKGl0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgaXRlbS5kYXRhLmF0dHJpYnV0ZXMgPSBpdGVtLmRhdGEuYXR0cmlidXRlcyB8fCBbXTtcbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBpdGVtLmRhdGEuYXR0cmlidXRlcy5wdXNoKC4uLmF0dHJpYnV0ZXMpO1xuICB9XG59XG5cbi8qXG4gKiBnZXQgLSBnaXZlbiBhbiBvYmovYXJyYXkgYW5kIGEga2V5cGF0aCwgcmV0dXJuIHRoZSB2YWx1ZSBhdCB0aGF0IGtleXBhdGggb3JcbiAqICAgICAgIHVuZGVmaW5lZCBpZiBub3QgcG9zc2libGUuXG4gKlxuICogQHBhcmFtIG9iaiAtIGFuIG9iamVjdCBvciBhcnJheVxuICogQHBhcmFtIHBhdGggLSBhIHN0cmluZyBvZiBrZXlzIHNlcGFyYXRlZCBieSAnLicgc3VjaCBhcyAncGx1Z2luLmpxdWVyeS4wLm1lc3NhZ2UnXG4gKiAgICB3aGljaCB3b3VsZCBjb3JyZXNwb25kIHRvIDQyIGluIGB7cGx1Z2luOiB7anF1ZXJ5OiBbe21lc3NhZ2U6IDQyfV19fWBcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iaiwgcGF0aCkge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciByZXN1bHQgPSBvYmo7XG4gIHRyeSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdFtrZXlzW2ldXTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGtleXMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgaWYgKGxlbiA8IDEpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGxlbiA9PT0gMSkge1xuICAgIG9ialtrZXlzWzBdXSA9IHZhbHVlO1xuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIHZhciB0ZW1wID0gb2JqW2tleXNbMF1dIHx8IHt9O1xuICAgIHZhciByZXBsYWNlbWVudCA9IHRlbXA7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW4gLSAxOyArK2kpIHtcbiAgICAgIHRlbXBba2V5c1tpXV0gPSB0ZW1wW2tleXNbaV1dIHx8IHt9O1xuICAgICAgdGVtcCA9IHRlbXBba2V5c1tpXV07XG4gICAgfVxuICAgIHRlbXBba2V5c1tsZW4gLSAxXV0gPSB2YWx1ZTtcbiAgICBvYmpba2V5c1swXV0gPSByZXBsYWNlbWVudDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmb3JtYXRBcmdzQXNTdHJpbmcoYXJncykge1xuICB2YXIgaSwgbGVuLCBhcmc7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG4gICAgc3dpdGNoICh0eXBlTmFtZShhcmcpKSB7XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICBhcmcgPSBzdHJpbmdpZnkoYXJnKTtcbiAgICAgICAgYXJnID0gYXJnLmVycm9yIHx8IGFyZy52YWx1ZTtcbiAgICAgICAgaWYgKGFyZy5sZW5ndGggPiA1MDApIHtcbiAgICAgICAgICBhcmcgPSBhcmcuc3Vic3RyKDAsIDQ5NykgKyAnLi4uJztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bGwnOlxuICAgICAgICBhcmcgPSAnbnVsbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgYXJnID0gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3ltYm9sJzpcbiAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChhcmcpO1xuICB9XG4gIHJldHVybiByZXN1bHQuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIGlmIChEYXRlLm5vdykge1xuICAgIHJldHVybiArRGF0ZS5ub3coKTtcbiAgfVxuICByZXR1cm4gK25ldyBEYXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlcklwKHJlcXVlc3REYXRhLCBjYXB0dXJlSXApIHtcbiAgaWYgKCFyZXF1ZXN0RGF0YSB8fCAhcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSB8fCBjYXB0dXJlSXAgPT09IHRydWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5ld0lwID0gcmVxdWVzdERhdGFbJ3VzZXJfaXAnXTtcbiAgaWYgKCFjYXB0dXJlSXApIHtcbiAgICBuZXdJcCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBwYXJ0cztcbiAgICAgIGlmIChuZXdJcC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnRzID0gbmV3SXAuc3BsaXQoJy4nKTtcbiAgICAgICAgcGFydHMucG9wKCk7XG4gICAgICAgIHBhcnRzLnB1c2goJzAnKTtcbiAgICAgICAgbmV3SXAgPSBwYXJ0cy5qb2luKCcuJyk7XG4gICAgICB9IGVsc2UgaWYgKG5ld0lwLmluZGV4T2YoJzonKSAhPT0gLTEpIHtcbiAgICAgICAgcGFydHMgPSBuZXdJcC5zcGxpdCgnOicpO1xuICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMikge1xuICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBwYXJ0cy5zbGljZSgwLCAzKTtcbiAgICAgICAgICB2YXIgc2xhc2hJZHggPSBiZWdpbm5pbmdbMl0uaW5kZXhPZignLycpO1xuICAgICAgICAgIGlmIChzbGFzaElkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGJlZ2lubmluZ1syXSA9IGJlZ2lubmluZ1syXS5zdWJzdHJpbmcoMCwgc2xhc2hJZHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdGVybWluYWwgPSAnMDAwMDowMDAwOjAwMDA6MDAwMDowMDAwJztcbiAgICAgICAgICBuZXdJcCA9IGJlZ2lubmluZy5jb25jYXQodGVybWluYWwpLmpvaW4oJzonKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3SXAgPSBudWxsO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIG5ld0lwID0gbnVsbDtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdERhdGFbJ3VzZXJfaXAnXSA9IG5ld0lwO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVPcHRpb25zKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkLCBsb2dnZXIpIHtcbiAgdmFyIHJlc3VsdCA9IG1lcmdlKGN1cnJlbnQsIGlucHV0LCBwYXlsb2FkKTtcbiAgcmVzdWx0ID0gdXBkYXRlRGVwcmVjYXRlZE9wdGlvbnMocmVzdWx0LCBsb2dnZXIpO1xuICBpZiAoIWlucHV0IHx8IGlucHV0Lm92ZXJ3cml0ZVNjcnViRmllbGRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoaW5wdXQuc2NydWJGaWVsZHMpIHtcbiAgICByZXN1bHQuc2NydWJGaWVsZHMgPSAoY3VycmVudC5zY3J1YkZpZWxkcyB8fCBbXSkuY29uY2F0KGlucHV0LnNjcnViRmllbGRzKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgaWYgKG9wdGlvbnMuaG9zdFdoaXRlTGlzdCAmJiAhb3B0aW9ucy5ob3N0U2FmZUxpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RTYWZlTGlzdCA9IG9wdGlvbnMuaG9zdFdoaXRlTGlzdDtcbiAgICBvcHRpb25zLmhvc3RXaGl0ZUxpc3QgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyICYmIGxvZ2dlci5sb2coJ2hvc3RXaGl0ZUxpc3QgaXMgZGVwcmVjYXRlZC4gVXNlIGhvc3RTYWZlTGlzdC4nKTtcbiAgfVxuICBpZiAob3B0aW9ucy5ob3N0QmxhY2tMaXN0ICYmICFvcHRpb25zLmhvc3RCbG9ja0xpc3QpIHtcbiAgICBvcHRpb25zLmhvc3RCbG9ja0xpc3QgPSBvcHRpb25zLmhvc3RCbGFja0xpc3Q7XG4gICAgb3B0aW9ucy5ob3N0QmxhY2tMaXN0ID0gdW5kZWZpbmVkO1xuICAgIGxvZ2dlciAmJiBsb2dnZXIubG9nKCdob3N0QmxhY2tMaXN0IGlzIGRlcHJlY2F0ZWQuIFVzZSBob3N0QmxvY2tMaXN0LicpO1xuICB9XG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkUGFyYW1zQW5kQWNjZXNzVG9rZW5Ub1BhdGg6IGFkZFBhcmFtc0FuZEFjY2Vzc1Rva2VuVG9QYXRoLFxuICBjcmVhdGVJdGVtOiBjcmVhdGVJdGVtLFxuICBhZGRFcnJvckNvbnRleHQ6IGFkZEVycm9yQ29udGV4dCxcbiAgY3JlYXRlVGVsZW1ldHJ5RXZlbnQ6IGNyZWF0ZVRlbGVtZXRyeUV2ZW50LFxuICBhZGRJdGVtQXR0cmlidXRlczogYWRkSXRlbUF0dHJpYnV0ZXMsXG4gIGZpbHRlcklwOiBmaWx0ZXJJcCxcbiAgZm9ybWF0QXJnc0FzU3RyaW5nOiBmb3JtYXRBcmdzQXNTdHJpbmcsXG4gIGZvcm1hdFVybDogZm9ybWF0VXJsLFxuICBnZXQ6IGdldCxcbiAgaGFuZGxlT3B0aW9uczogaGFuZGxlT3B0aW9ucyxcbiAgaXNFcnJvcjogaXNFcnJvcixcbiAgaXNGaW5pdGVOdW1iZXI6IGlzRmluaXRlTnVtYmVyLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc0l0ZXJhYmxlOiBpc0l0ZXJhYmxlLFxuICBpc05hdGl2ZUZ1bmN0aW9uOiBpc05hdGl2ZUZ1bmN0aW9uLFxuICBpc09iamVjdDogaXNPYmplY3QsXG4gIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgaXNUeXBlOiBpc1R5cGUsXG4gIGlzUHJvbWlzZTogaXNQcm9taXNlLFxuICBpc0Jyb3dzZXI6IGlzQnJvd3NlcixcbiAganNvblBhcnNlOiBqc29uUGFyc2UsXG4gIExFVkVMUzogTEVWRUxTLFxuICBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvOiBtYWtlVW5oYW5kbGVkU3RhY2tJbmZvLFxuICBtZXJnZTogbWVyZ2UsXG4gIG5vdzogbm93LFxuICByZWRhY3Q6IHJlZGFjdCxcbiAgUm9sbGJhckpTT046IFJvbGxiYXJKU09OLFxuICBzYW5pdGl6ZVVybDogc2FuaXRpemVVcmwsXG4gIHNldDogc2V0LFxuICBzZXR1cEpTT046IHNldHVwSlNPTixcbiAgc3RyaW5naWZ5OiBzdHJpbmdpZnksXG4gIG1heEJ5dGVTaXplOiBtYXhCeXRlU2l6ZSxcbiAgdHlwZU5hbWU6IHR5cGVOYW1lLFxuICB1dWlkNDogdXVpZDQsXG59O1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsaXR5Jyk7XG5cbmZ1bmN0aW9uIHRyYXZlcnNlKG9iaiwgZnVuYywgc2Vlbikge1xuICB2YXIgaywgdiwgaTtcbiAgdmFyIGlzT2JqID0gXy5pc1R5cGUob2JqLCAnb2JqZWN0Jyk7XG4gIHZhciBpc0FycmF5ID0gXy5pc1R5cGUob2JqLCAnYXJyYXknKTtcbiAgdmFyIGtleXMgPSBbXTtcbiAgdmFyIHNlZW5JbmRleDtcblxuICAvLyBCZXN0IG1pZ2h0IGJlIHRvIHVzZSBNYXAgaGVyZSB3aXRoIGBvYmpgIGFzIHRoZSBrZXlzLCBidXQgd2Ugd2FudCB0byBzdXBwb3J0IElFIDwgMTEuXG4gIHNlZW4gPSBzZWVuIHx8IHsgb2JqOiBbXSwgbWFwcGVkOiBbXSB9O1xuXG4gIGlmIChpc09iaikge1xuICAgIHNlZW5JbmRleCA9IHNlZW4ub2JqLmluZGV4T2Yob2JqKTtcblxuICAgIGlmIChpc09iaiAmJiBzZWVuSW5kZXggIT09IC0xKSB7XG4gICAgICAvLyBQcmVmZXIgdGhlIG1hcHBlZCBvYmplY3QgaWYgdGhlcmUgaXMgb25lLlxuICAgICAgcmV0dXJuIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gfHwgc2Vlbi5vYmpbc2VlbkluZGV4XTtcbiAgICB9XG5cbiAgICBzZWVuLm9iai5wdXNoKG9iaik7XG4gICAgc2VlbkluZGV4ID0gc2Vlbi5vYmoubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGlmIChpc09iaikge1xuICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkge1xuICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQXJyYXkpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgKytpKSB7XG4gICAgICBrZXlzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGlzT2JqID8ge30gOiBbXTtcbiAgdmFyIHNhbWUgPSB0cnVlO1xuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgIGsgPSBrZXlzW2ldO1xuICAgIHYgPSBvYmpba107XG4gICAgcmVzdWx0W2tdID0gZnVuYyhrLCB2LCBzZWVuKTtcbiAgICBzYW1lID0gc2FtZSAmJiByZXN1bHRba10gPT09IG9ialtrXTtcbiAgfVxuXG4gIGlmIChpc09iaiAmJiAhc2FtZSkge1xuICAgIHNlZW4ubWFwcGVkW3NlZW5JbmRleF0gPSByZXN1bHQ7XG4gIH1cblxuICByZXR1cm4gIXNhbWUgPyByZXN1bHQgOiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2U7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCIvKiBnbG9iYWxzIGV4cGVjdCAqL1xuLyogZ2xvYmFscyBkZXNjcmliZSAqL1xuLyogZ2xvYmFscyBpdCAqL1xuLyogZ2xvYmFscyBzaW5vbiAqL1xuXG52YXIgdHJ1bmNhdGlvbiA9IHJlcXVpcmUoJy4uL3NyYy90cnVuY2F0aW9uJyk7XG52YXIgVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi4vc3JjL3JlYWN0LW5hdGl2ZS90cmFuc3BvcnQnKTtcbnZhciB0ID0gbmV3IFRyYW5zcG9ydCh0cnVuY2F0aW9uKTtcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vc3JjL3V0aWxpdHknKTtcbnV0aWxpdHkuc2V0dXBKU09OKCk7XG5cbmRlc2NyaWJlKCdwb3N0JywgZnVuY3Rpb24gKCkge1xuICB2YXIgYWNjZXNzVG9rZW4gPSAnYWJjMTIzJztcbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgaG9zdG5hbWU6ICdhcGkucm9sbGJhci5jb20nLFxuICAgIHByb3RvY29sOiAnaHR0cHMnLFxuICAgIHBhdGg6ICcvYXBpLzEvaXRlbS8nLFxuICB9O1xuICB2YXIgcGF5bG9hZCA9IHtcbiAgICBhY2Nlc3NfdG9rZW46IGFjY2Vzc1Rva2VuLFxuICAgIGRhdGE6IHsgYTogMSB9LFxuICB9O1xuICB2YXIgdXVpZCA9ICdkNGM3YWNlZjU1YmY0YzllYTk1ZTRmZTk0MjhhODI4Nyc7XG5cbiAgYmVmb3JlKGZ1bmN0aW9uIChkb25lKSB7XG4gICAgLy8gSW4gcmVhY3QtbmF0aXZlIGVudmlyb25tZW50LCBzdHViIGZldGNoKCkgaW5zdGVhZCBvZiBYTUxIdHRwUmVxdWVzdFxuICAgIHNpbm9uLnN0dWIod2luZG93LCAnZmV0Y2gnKTtcbiAgICBkb25lKCk7XG4gIH0pO1xuXG4gIGFmdGVyKGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cuZmV0Y2gucmVzdG9yZSgpO1xuICB9KTtcblxuICBmdW5jdGlvbiBzdHViUmVzcG9uc2UoY29kZSwgZXJyLCBtZXNzYWdlKSB7XG4gICAgd2luZG93LmZldGNoLnJldHVybnMoXG4gICAgICBQcm9taXNlLnJlc29sdmUoXG4gICAgICAgIG5ldyBSZXNwb25zZShcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBlcnI6IGVycixcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICByZXN1bHQ6IHsgdXVpZDogdXVpZCB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YXR1czogY29kZSxcbiAgICAgICAgICAgIHN0YXR1c1RleHQ6IG1lc3NhZ2UsXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICB9LFxuICAgICAgICApLFxuICAgICAgKSxcbiAgICApO1xuICB9XG5cbiAgaXQoJ3Nob3VsZCBjYWxsYmFjayB3aXRoIHRoZSByaWdodCB2YWx1ZSBvbiBzdWNjZXNzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICBzdHViUmVzcG9uc2UoMjAwLCAwLCAnT0snKTtcblxuICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgIGV4cGVjdChlcnIpLnRvLmVxbChudWxsKTtcbiAgICAgIGV4cGVjdChkYXRhKS50by5iZS5vaygpO1xuICAgICAgZXhwZWN0KGRhdGEudXVpZCkudG8uZXFsKHV1aWQpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG4gICAgdC5wb3N0KGFjY2Vzc1Rva2VuLCBvcHRpb25zLCBwYXlsb2FkLCBjYWxsYmFjayk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY2FsbGJhY2sgd2l0aCB0aGUgc2VydmVyIGVycm9yIGlmIDQwMycsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgc3R1YlJlc3BvbnNlKDQwMywgJzQwMycsICdiYWQgcmVxdWVzdCcpO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKGVyciwgcmVzcCkge1xuICAgICAgZXhwZWN0KHJlc3ApLnRvLm5vdC5iZS5vaygpO1xuICAgICAgZXhwZWN0KGVyci5tZXNzYWdlKS50by5lcWwoJ0FwaSBlcnJvcjogYmFkIHJlcXVlc3QnKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuICAgIHQucG9zdChhY2Nlc3NUb2tlbiwgb3B0aW9ucywgcGF5bG9hZCwgY2FsbGJhY2spO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwidG9TdHIiLCJ0b1N0cmluZyIsImlzUGxhaW5PYmplY3QiLCJvYmoiLCJjYWxsIiwiaGFzT3duQ29uc3RydWN0b3IiLCJoYXNJc1Byb3RvdHlwZU9mIiwiY29uc3RydWN0b3IiLCJrZXkiLCJtZXJnZSIsImkiLCJzcmMiLCJjb3B5IiwiY2xvbmUiLCJuYW1lIiwicmVzdWx0IiwiY3VycmVudCIsImxlbmd0aCIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJsb2dnZXIiLCJlcnJvciIsImNvbnNvbGUiLCJiaW5kIiwiaW5mbyIsImxvZyIsIl8iLCJyZXF1aXJlIiwiQnVmZmVyIiwiVHJhbnNwb3J0IiwidHJ1bmNhdGlvbiIsInJhdGVMaW1pdEV4cGlyZXMiLCJnZXQiLCJhY2Nlc3NUb2tlbiIsIm9wdGlvbnMiLCJwYXJhbXMiLCJjYWxsYmFjayIsImlzRnVuY3Rpb24iLCJhZGRQYXJhbXNBbmRBY2Nlc3NUb2tlblRvUGF0aCIsImhlYWRlcnMiLCJfaGVhZGVycyIsImZldGNoIiwiZm9ybWF0VXJsIiwibWV0aG9kIiwidGhlbiIsInJlc3AiLCJfaGFuZGxlUmVzcG9uc2UiLCJlcnIiLCJwb3N0IiwicGF5bG9hZCIsIkVycm9yIiwic3RyaW5naWZ5UmVzdWx0IiwidHJ1bmNhdGUiLCJzdHJpbmdpZnkiLCJ3cml0ZURhdGEiLCJ2YWx1ZSIsIl9tYWtlUmVxdWVzdCIsInBvc3RKc29uUGF5bG9hZCIsImpzb25QYXlsb2FkIiwiZGF0YSIsInVybCIsImJvZHkiLCJqc29uIiwiX3dyYXBQb3N0Q2FsbGJhY2siLCJieXRlTGVuZ3RoIiwiZSIsIm1lc3NhZ2UiLCJ1dWlkIiwiam9pbiIsInRyYXZlcnNlIiwicmF3IiwianNvbkJhY2t1cCIsInNlbGVjdEZyYW1lcyIsImZyYW1lcyIsInJhbmdlIiwibGVuIiwic2xpY2UiLCJjb25jYXQiLCJ0cnVuY2F0ZUZyYW1lcyIsInRyYWNlX2NoYWluIiwiY2hhaW4iLCJ0cmFjZSIsIm1heWJlVHJ1bmNhdGVWYWx1ZSIsInZhbCIsInRydW5jYXRlU3RyaW5ncyIsInRydW5jYXRvciIsImsiLCJ2Iiwic2VlbiIsInR5cGVOYW1lIiwidHJ1bmNhdGVUcmFjZURhdGEiLCJ0cmFjZURhdGEiLCJleGNlcHRpb24iLCJkZXNjcmlwdGlvbiIsIm1pbkJvZHkiLCJuZWVkc1RydW5jYXRpb24iLCJtYXhTaXplIiwibWF4Qnl0ZVNpemUiLCJzdHJhdGVnaWVzIiwic3RyYXRlZ3kiLCJyZXN1bHRzIiwic2hpZnQiLCJSb2xsYmFySlNPTiIsInNldHVwSlNPTiIsInBvbHlmaWxsSlNPTiIsInBhcnNlIiwiaXNEZWZpbmVkIiwiSlNPTiIsImlzTmF0aXZlRnVuY3Rpb24iLCJpc1R5cGUiLCJ4IiwidCIsIl90eXBlb2YiLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiZiIsInJlUmVnRXhwQ2hhciIsImZ1bmNNYXRjaFN0cmluZyIsIkZ1bmN0aW9uIiwicmVwbGFjZSIsInJlSXNOYXRpdmUiLCJSZWdFeHAiLCJpc09iamVjdCIsInRlc3QiLCJ0eXBlIiwiaXNTdHJpbmciLCJTdHJpbmciLCJpc0Zpbml0ZU51bWJlciIsIm4iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsInUiLCJpc0l0ZXJhYmxlIiwiaXNFcnJvciIsImlzUHJvbWlzZSIsInAiLCJpc0Jyb3dzZXIiLCJ3aW5kb3ciLCJyZWRhY3QiLCJ1dWlkNCIsImQiLCJub3ciLCJjIiwiciIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsIkxFVkVMUyIsImRlYnVnIiwid2FybmluZyIsImNyaXRpY2FsIiwic2FuaXRpemVVcmwiLCJiYXNlVXJsUGFydHMiLCJwYXJzZVVyaSIsImFuY2hvciIsInNvdXJjZSIsInF1ZXJ5IiwicGFyc2VVcmlPcHRpb25zIiwic3RyaWN0TW9kZSIsInEiLCJwYXJzZXIiLCJzdHJpY3QiLCJsb29zZSIsInN0ciIsInVuZGVmaW5lZCIsIm8iLCJtIiwiZXhlYyIsInVyaSIsImwiLCIkMCIsIiQxIiwiJDIiLCJhY2Nlc3NfdG9rZW4iLCJwYXJhbXNBcnJheSIsInB1c2giLCJzb3J0IiwicGF0aCIsInFzIiwiaW5kZXhPZiIsImgiLCJzdWJzdHJpbmciLCJwcm90b2NvbCIsInBvcnQiLCJob3N0bmFtZSIsImJhY2t1cCIsImpzb25FcnJvciIsImJhY2t1cEVycm9yIiwic3RyaW5nIiwiY291bnQiLCJjb2RlIiwiY2hhckNvZGVBdCIsImpzb25QYXJzZSIsInMiLCJtYWtlVW5oYW5kbGVkU3RhY2tJbmZvIiwibGluZW5vIiwiY29sbm8iLCJtb2RlIiwiYmFja3VwTWVzc2FnZSIsImVycm9yUGFyc2VyIiwibG9jYXRpb24iLCJsaW5lIiwiY29sdW1uIiwiZnVuYyIsImd1ZXNzRnVuY3Rpb25OYW1lIiwiY29udGV4dCIsImdhdGhlckNvbnRleHQiLCJocmVmIiwiZG9jdW1lbnQiLCJ1c2VyYWdlbnQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJzdGFjayIsIndyYXBDYWxsYmFjayIsIm5vbkNpcmN1bGFyQ2xvbmUiLCJuZXdTZWVuIiwiaW5jbHVkZXMiLCJjcmVhdGVJdGVtIiwiYXJncyIsIm5vdGlmaWVyIiwicmVxdWVzdEtleXMiLCJsYW1iZGFDb250ZXh0IiwiY3VzdG9tIiwicmVxdWVzdCIsImFyZyIsImV4dHJhQXJncyIsImRpYWdub3N0aWMiLCJhcmdUeXBlcyIsInR5cCIsIkRPTUV4Y2VwdGlvbiIsImoiLCJpdGVtIiwidGltZXN0YW1wIiwic2V0Q3VzdG9tSXRlbUtleXMiLCJfb3JpZ2luYWxBcmdzIiwib3JpZ2luYWxfYXJnX3R5cGVzIiwibGV2ZWwiLCJza2lwRnJhbWVzIiwiYWRkRXJyb3JDb250ZXh0IiwiZXJyb3JzIiwiY29udGV4dEFkZGVkIiwicm9sbGJhckNvbnRleHQiLCJlcnJvcl9jb250ZXh0IiwiVEVMRU1FVFJZX1RZUEVTIiwiVEVMRU1FVFJZX0xFVkVMUyIsImFycmF5SW5jbHVkZXMiLCJhcnIiLCJjcmVhdGVUZWxlbWV0cnlFdmVudCIsIm1ldGFkYXRhIiwiZXZlbnQiLCJhZGRJdGVtQXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJfaXRlbSRkYXRhJGF0dHJpYnV0ZXMiLCJhcHBseSIsIl90b0NvbnN1bWFibGVBcnJheSIsImtleXMiLCJzcGxpdCIsInNldCIsInRlbXAiLCJyZXBsYWNlbWVudCIsImZvcm1hdEFyZ3NBc1N0cmluZyIsInN1YnN0ciIsIkRhdGUiLCJmaWx0ZXJJcCIsInJlcXVlc3REYXRhIiwiY2FwdHVyZUlwIiwibmV3SXAiLCJwYXJ0cyIsInBvcCIsImJlZ2lubmluZyIsInNsYXNoSWR4IiwidGVybWluYWwiLCJoYW5kbGVPcHRpb25zIiwiaW5wdXQiLCJ1cGRhdGVEZXByZWNhdGVkT3B0aW9ucyIsIm92ZXJ3cml0ZVNjcnViRmllbGRzIiwic2NydWJGaWVsZHMiLCJob3N0V2hpdGVMaXN0IiwiaG9zdFNhZmVMaXN0IiwiaG9zdEJsYWNrTGlzdCIsImhvc3RCbG9ja0xpc3QiLCJpc09iaiIsImlzQXJyYXkiLCJzZWVuSW5kZXgiLCJtYXBwZWQiLCJzYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==