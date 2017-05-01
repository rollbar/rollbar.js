module.exports = function(options) {
  return function(err) {
    if (err) {
      return;
    }

    if (!window._rollbarInitialized) {
      options = options || {};
      var alias = options.globalAlias || 'Rollbar';

      var rollbar = window.rollbar;
      var realImpl = function(o) {
        return new rollbar(o);
      };
      var i = 0, obj, mainHandler;
      while ((obj = window._rollbarShims[i++])) {
        if (!mainHandler) {
          mainHandler = obj.handler;
        }
        obj.handler._swapAndProcessMessages(realImpl, obj.messages);
      }

      window[alias] = mainHandler;
      window._rollbarInitialized = true;
    }
  };
};
