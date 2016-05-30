
function createPolyfills() {
    // Object.create not supported in IE8 needs to be polyfilled
    // pulled in polyfill from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    if (typeof Object.create != 'function') {
        Object.create = (function() {
            var Temp = function() {};
            return function (prototype) {
                if (arguments.length > 1) {
                    throw Error('Second argument not supported');
                }
                if(prototype !== Object(prototype) && prototype !== null) {
                    throw TypeError('Argument must be an object or null');
                }
                if (prototype === null) {
                    throw Error('null [[Prototype]] not supported');
                }
                Temp.prototype = prototype;
                var result = new Temp();
                Temp.prototype = null;
                return result;
            };
        })();
    }
}

var Polyfill = {
    create: createPolyfills
};

module.exports = Polyfill;