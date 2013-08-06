jQuery(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
  var status = jqXHR.status;
  var url = ajaxSettings.url;
  
  _rollbar.push({
    level: 'warning',
    msg: 'jQuery ajax error for url ' + url,
    jquery_status: status,
    jquery_url: url,
    jquery_thrown_error: thrownError
  });
});

var origReady = jQuery.fn.ready;
jQuery.fn.ready = function(fn) {
  return origReady.call(this, function() {
    try {
      fn();
    } catch (e) {
      _rollbar.push(e);
    }
  });
};

var onFuncs = {};

var origOn = jQuery.fn.on;
jQuery.fn.on = function(events, selector, data, fn) {
  var wrap = function(fn) {
    var newFunc = function() {
      try {
        return fn.apply(this, arguments);
      } catch (e) {
        _rollbar.push(e);
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
  
  return origOn.call(this, events, selector, data, fn);
};

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