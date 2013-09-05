/*jslint continue: true, nomen: true, plusplus: true, regexp: true, vars: true, white: true, passfail: false, indent: 2 */
(function(jQuery, window, document) {
  
  if (!window._rollbar) {
    return;
  }
  
  var _rollbarParams = {
    "notifier.plugins.jquery.version": '0.0.4'
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
    
    window._rollbar.push({
      level: 'warning',
      msg: 'jQuery ajax error for url ' + url,
      jquery_status: status,
      jquery_url: url,
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
  
  // Keeps track of a mapping of original function to wrapped function
  // when used with jQuery's on() and off() event handling
  var onFuncs = {};
  
  // Wraps functions (if any) passed into jQuery's on() with try/catch
  // to report errors to Rollbar
  var origOn = jQuery.fn.on;
  jQuery.fn.on = function(events, selector, data, fn, internal) {
    var wrap = function(fn) {
      var newFunc = function() {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          window._rollbar.push(e);
          logError(e);
          return null;
        }
      }
      
      onFuncs[fn] = newFunc;
      return newFunc;
    }
    
    if (selector && typeof selector === 'function') {
      selector = wrap(selector);
    } else if (data && typeof data === 'function') {
      data = wrap(data);
    } else if (fn && typeof fn === 'function') {
      fn = wrap(fn);
    }
    
    return origOn.call(this, events, selector, data, fn, internal);
  };
  
  // Replaces any passed in functions with the Rollbar-wrapped version
  // created above in on(), deletes the mapping, and passes the resulting
  // function into jQuery's off() to remove the event handling
  var origOff = jQuery.fn.off;
  jQuery.fn.off = function(events, selector, fn) {
    if (selector && typeof selector === 'function') {
      selector = onFuncs[selector];
      delete onFuncs[selector];
    } else {
      fn = onFuncs[fn];
      delete onFuncs[fn];
    }
    
    return origOff.call(this, events, selector, fn);
  };
})(jQuery, window, document);
