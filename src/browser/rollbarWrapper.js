function RollbarWrap(impl, options) {
  this.impl = impl(options, this);
  this.options = options;
  _setupForwarding(RollbarWrap.prototype);
}

function _setupForwarding(prototype) {
  var _forward = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      if (this.impl[method]) {
        return this.impl[method].apply(this.impl, args);
      }
    };
  };

  var _methods =
    'log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad'.split(
      ',',
    );
  for (const method of _methods) {
    prototype[method] = _forward(method);
  }
}

RollbarWrap.prototype._swapAndProcessMessages = function (impl, messages) {
  this.impl = impl(this.options);
  var msg, method, args;
  while ((msg = messages.shift())) {
    method = msg.method;
    args = msg.args;
    if (this[method] && typeof this[method] === 'function') {
      if (method === 'captureDomContentLoaded' || method === 'captureLoad') {
        this[method].apply(this, [args[0], msg.ts]);
      } else {
        this[method].apply(this, args);
      }
    }
  }
  return this;
};

export default RollbarWrap;
