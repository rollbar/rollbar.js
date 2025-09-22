import * as _ from '../utility.js';

function error() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  console.error.apply(console, args);
}

function info() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  console.info.apply(console, args);
}

function log() {
  var args = Array.prototype.slice.call(arguments, 0);
  args.unshift('Rollbar:');
  console.log.apply(console, args);
}

export default {
  error,
  info,
  log,
};
