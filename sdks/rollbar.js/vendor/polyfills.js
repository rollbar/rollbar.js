// ES5 Polyfills
// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        var O = Object(this);
        var len = O.length >>> 0;
        var T;
        if (arguments.length > 1) {
            T = thisArg;
        }

        var A = new Array(len);
        var k = 0;

        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue;
            }
            k++;
        }

        return A;
    };
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback/*, thisArg*/) {
        var t = Object(this);
        var len = t.length >>> 0;

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (callback.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}
