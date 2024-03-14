/* globals jQuery */
/* globals __JQUERY_PLUGIN_VERSION__ */

(function (jQuery, window, document) {
  var rb = window.Rollbar;
  if (!rb) {
    return;
  }

  var JQUERY_PLUGIN_VERSION = __JQUERY_PLUGIN_VERSION__;

  rb.configure({
    payload: {
      notifier: {
        plugins: {
          jquery: {
            version: JQUERY_PLUGIN_VERSION,
          },
        },
      },
    },
  });

  var logError = function (e) {
    rb.error(e);
    if (window.console) {
      var msg = '[reported to Rollbar]';
      if (rb.options && !rb.options.enabled) {
        msg = '[Rollbar not enabled]';
      }
      window.console.log(e.message + ' ' + msg);
    }
  };

  // Report any ajax errors to Rollbar
  jQuery(document).ajaxError(
    function (event, jqXHR, ajaxSettings, thrownError) {
      var status = jqXHR.status;
      var url = ajaxSettings.url;
      var type = ajaxSettings.type;

      // If status === 0 it means the user left the page before the ajax event finished
      // or other uninteresting events.
      if (!status) {
        return;
      }

      var extra = {
        status: status,
        url: url,
        type: type,
        isAjax: true,
        data: ajaxSettings.data,
        jqXHR_responseText: jqXHR.responseText,
        jqXHR_statusText: jqXHR.statusText,
      };
      var msg = thrownError ? thrownError : 'jQuery ajax error for ' + type;
      rb.warning(msg, extra);
    },
  );

  // Wraps functions passed into jQuery's ready() with try/catch to
  // report errors to Rollbar
  var origReady = jQuery.fn.ready;
  jQuery.fn.ready = function (fn) {
    return origReady.call(this, function ($) {
      try {
        fn($);
      } catch (e) {
        logError(e);
      }
    });
  };

  // Modified from the code removed from Tracekit in this commit
  // https://github.com/occ/TraceKit/commit/0d39401
  var _oldEventAdd = jQuery.event.add;
  jQuery.event.add = function (elem, types, handler, data, selector) {
    var _handler;
    var wrap = function (fn) {
      return function () {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          logError(e);
        }
      };
    };

    if (handler.handler) {
      _handler = handler.handler;
      handler.handler = wrap(handler.handler);
    } else {
      _handler = handler;
      handler = wrap(handler);
    }

    // If the handler we are attaching doesn’t have the same guid as
    // the original, it will never be removed when someone tries to
    // unbind the original function later. Technically as a result of
    // this our guids are no longer globally unique, but whatever, that
    // never hurt anybody RIGHT?!
    if (_handler.guid) {
      handler.guid = _handler.guid;
    } else {
      handler.guid = _handler.guid = jQuery.guid++;
    }
    return _oldEventAdd.call(this, elem, types, handler, data, selector);
  };
})(jQuery, window, document);
