/*jslint continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, passfail: false, indent: 2 */
(function(jQuery, window, document) {
  
  if (!window._rollbar) {
    return;
  }
  
  var _rollbarParams = {
    "notifier.plugins.jquery.version": '0.0.5'
  };
  window._rollbar.push({_rollbarParams: _rollbarParams});
  
  var logError = function(e) {
    if (window.console) {
      window.console.log(e.message + ' [reported to Rollbar]');
    }
  }
  
  // Report any ajax errors to Rollbar
  jQuery(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
    var status = jqXHR.status;
    var url = ajaxSettings.url;
    var type = ajaxSettings.type;
    
    window._rollbar.push({
      level: 'warning',
      msg: 'jQuery ajax error for ' + type + ' ' + url,
      jquery_status: status,
      jquery_url: url,
      jquery_type: type,
      jquery_thrown_error: thrownError,
      jquery_ajax_error: true
    });
  });
  
  // Wraps functions passed into jQuery's ready() with try/catch to
  // report errors to Rollbar
  var origReady = jQuery.fn.ready;
  jQuery.fn.ready = function(fn) {
    return origReady.call(this, function() {
      try {
        fn();
      } catch (e) {
        window._rollbar.push(e);
        logError(e);
      }
    });
  };
  
  // Modified from the code removed from Tracekit in this commit
  // https://github.com/occ/TraceKit/commit/0d39401
  var _oldEventAdd = jQuery.event.add;
  jQuery.event.add = function(elem, types, handler, data, selector) {
    var _handler;
    var wrap = function(fn) {
      return function(){
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          window._rollbar.push(e);
          logError(e);
        }   
      }
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
