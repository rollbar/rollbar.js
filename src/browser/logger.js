require('console-polyfill');
var detection = require('./detection');

function error() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  if (detection.ieVersion() <= 8) {
    console.error(formatArgsAsString.apply(null, args));
  } else {
    console.error.apply(console, args);
  }
}

function info() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  if (detection.ieVersion() <= 8) {
    console.info(formatArgsAsString.apply(null, args));
  } else {
    console.info.apply(console, args);
  }
}

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  if (detection.ieVersion() <= 8) {
    console.log(formatArgsAsString.apply(null, args));
  } else {
    console.log.apply(console, args);
  }
}

// IE8 logs objects as [object Object].  This is a wrapper that makes it a bit
// more convenient by logging the JSON of the object.  But only do that in IE8 and below
// because other browsers are smarter and handle it properly.
function formatArgsAsString() {
  var args = [];
  for (var i=0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'object') {
      arg = RollbarJSON.stringify(arg);
      if (arg.length > 500)
        arg = arg.substr(0,500)+'...';
    } else if (typeof arg === 'undefined') {
      arg = 'undefined';
    }
    args.push(arg);
  }
  return args.join(' ');
}

module.exports = {
  error: error,
  info: info,
  log: log
};
