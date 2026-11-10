function captureUncaughtExceptions(window, handler, shim) {
  if (!window) {
    return;
  }
  var oldOnError;

  if (typeof handler._rollbarOldOnError === 'function') {
    oldOnError = handler._rollbarOldOnError;
  } else if (window.onerror) {
    oldOnError = window.onerror;
    while (oldOnError._rollbarOldOnError) {
      oldOnError = oldOnError._rollbarOldOnError;
    }
    handler._rollbarOldOnError = oldOnError;
  }

  handler.handleAnonymousErrors();

  var fn = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    _rollbarWindowOnError(window, handler, oldOnError, args);
  };
  if (shim) {
    fn._rollbarOldOnError = oldOnError;
  }
  window.onerror = fn;
  return fn;
}

function _rollbarWindowOnError(window, r, old, args) {
  if (window._rollbarWrappedError) {
    if (!args[4]) {
      args[4] = window._rollbarWrappedError;
    }
    if (!args[5]) {
      args[5] = window._rollbarWrappedError._rollbarContext;
    }
    window._rollbarWrappedError = null;
  }

  var ret = r.handleUncaughtException.apply(r, args);

  if (old) {
    old.apply(window, args);
  }

  // Let other chained onerror handlers above run before setting this.
  // If an error is thrown and caught within a chained onerror handler,
  // Error.prepareStackTrace() will see that one before the one we want.
  if (ret === 'anonymous') {
    r.anonymousErrorsPending += 1; // See Rollbar.prototype.handleAnonymousErrors()
  }
}

function captureUnhandledRejections(window, handler, shim) {
  if (!window) {
    return;
  }

  if (
    typeof window._rollbarURH === 'function' &&
    window._rollbarURH.belongsToShim
  ) {
    window.removeEventListener('unhandledrejection', window._rollbarURH);
  }

  var rejectionHandler = function (evt) {
    var reason, promise, detail;
    try {
      reason = evt.reason;
    } catch (_e) {
      reason = undefined;
    }
    try {
      promise = evt.promise;
    } catch (_e) {
      promise = '[unhandledrejection] error getting `promise` from event';
    }
    try {
      detail = evt.detail;
      if (!reason && detail) {
        reason = detail.reason;
        promise = detail.promise;
      }
    } catch (_e) {
      // Ignore
    }
    if (!reason) {
      reason = '[unhandledrejection] error getting `reason` from event';
    }

    if (handler && handler.handleUnhandledRejection) {
      handler.handleUnhandledRejection(reason, promise);
    }
  };
  rejectionHandler.belongsToShim = shim;
  window._rollbarURH = rejectionHandler;
  window.addEventListener('unhandledrejection', rejectionHandler);
  return rejectionHandler;
}

/**
 * Detaches the `window.onerror` handler installed by
 * `captureUncaughtExceptions`, putting back the handler it chained to.
 *
 * If something replaced `window.onerror` after Rollbar did, that handler is
 * left in place, and it still calls ours. The caller must make sure ours no
 * longer reports anything once it has been removed.
 *
 * @param {Window} window - The global the handler was installed on.
 * @param {Object} handler - The Rollbar instance passed to `captureUncaughtExceptions`.
 * @param {Function} fn - The function `captureUncaughtExceptions` returned.
 */
function removeUncaughtExceptions(window, handler, fn) {
  if (!window || !fn) {
    return;
  }
  if (window.onerror === fn) {
    window.onerror = handler._rollbarOldOnError || null;
  }
}

/**
 * Detaches the `unhandledrejection` listener installed by
 * `captureUnhandledRejections`.
 *
 * @param {Window} window - The global the listener was added to.
 * @param {Function} rejectionHandler - The function `captureUnhandledRejections` returned.
 */
function removeUnhandledRejections(window, rejectionHandler) {
  if (!window || !rejectionHandler) {
    return;
  }
  window.removeEventListener('unhandledrejection', rejectionHandler);
  if (window._rollbarURH === rejectionHandler) {
    delete window._rollbarURH;
  }
}

export {
  captureUncaughtExceptions,
  captureUnhandledRejections,
  removeUncaughtExceptions,
  removeUnhandledRejections,
};
