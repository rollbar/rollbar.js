import * as _ from '../utility.js';

function checkIgnore(item, settings) {
  if (_.get(settings, 'plugins.jquery.ignoreAjaxErrors')) {
    return !_.get(item, 'body.message.extra.isAjax');
  }
  return true;
}

// Safari replaces the URLs of extension scripts with webkit-masked-url://hidden/
// in stack traces, so that scheme is treated as an extension too.
var EXTENSION_URL_REGEX =
  /^(?:(?:chrome|moz|safari|safari-web|ms-browser)-extension|webkit-masked-url):\/\//i;
var URL_REGEX = /^[a-z][a-z0-9+.-]*:\/\//i;

/**
 * Finds the frame an error was thrown from. Rollbar orders frames with the
 * most recent call last. Frames without a URL, such as `(native)` or
 * `[native code]`, are skipped because they only show that the error passed
 * through a built-in, not where the calling code lives.
 *
 * @param {Object} trace - A Rollbar trace with a `frames` array.
 * @returns {Object|undefined} The originating frame, if one has a URL.
 */
function originatingFrame(trace) {
  var frames = trace && trace.frames;
  if (!frames) {
    return undefined;
  }
  for (var i = frames.length - 1; i >= 0; i--) {
    var filename = frames[i] && frames[i].filename;
    if (_.isType(filename, 'string') && URL_REGEX.test(filename)) {
      return frames[i];
    }
  }
  return undefined;
}

/**
 * Predicate for the `ignoreBrowserExtensions` option. Drops an error when the
 * frame it was thrown from belongs to a browser extension.
 *
 * Only the originating frame of the primary error is checked. Extensions
 * commonly wrap `addEventListener`, `setTimeout` and `fetch`, so extension
 * frames often sit lower in the stacks of errors thrown by application code;
 * matching any frame, as `hostBlockList` does, would drop those errors.
 *
 * @param {Object} item - The item about to be queued.
 * @param {Object} settings - The current Rollbar options.
 * @returns {boolean} false if the item should be ignored.
 */
function checkBrowserExtension(item, settings) {
  if (!settings.ignoreBrowserExtensions) {
    return true;
  }
  var trace = _.get(item, 'body.trace') || _.get(item, 'body.trace_chain.0');
  var frame = originatingFrame(trace);
  return !(frame && EXTENSION_URL_REGEX.test(frame.filename));
}

export { checkIgnore, checkBrowserExtension };
