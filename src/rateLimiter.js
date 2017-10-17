/*
 * RateLimiter - an object that encapsulates the logic for counting items sent to Rollbar
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
function RateLimiter(options) {
  this.startTime = (new Date()).getTime();
  this.counter = 0;
  this.perMinCounter = 0;
  this.platform = null;
  this.platformOptions = {};
  this.configureGlobal(options);
}

RateLimiter.globalSettings = {
  startTime: (new Date()).getTime(),
  maxItems: undefined,
  itemsPerMinute: undefined
};

/*
 * configureGlobal - set the global rate limiter options
 *
 * @param options - Only the following values are recognized:
 *    startTime: a timestamp of the form returned by (new Date()).getTime()
 *    maxItems: the maximum items
 *    itemsPerMinute: the max number of items to send in a given minute
 */
RateLimiter.prototype.configureGlobal = function(options) {
  if (options.startTime !== undefined) {
    RateLimiter.globalSettings.startTime = options.startTime;
  }
  if (options.maxItems !== undefined) {
    RateLimiter.globalSettings.maxItems = options.maxItems;
  }
  if (options.itemsPerMinute !== undefined) {
    RateLimiter.globalSettings.itemsPerMinute = options.itemsPerMinute;
  }
};

/*
 * shouldSend - determine if we should send a given item based on rate limit settings
 *
 * @param item - the item we are about to send
 * @returns An object with the following structure:
 *  error: (Error|null)
 *  shouldSend: bool
 *  payload: (Object|null)
 *  If shouldSend is false, the item passed as a parameter should not be sent to Rollbar, and
 *  exactly one of error or payload will be non-null. If error is non-null, the returned Error will
 *  describe the situation, but it means that we were already over a rate limit (either globally or
 *  per minute) when this item was checked. If error is null, and therefore payload is non-null, it
 *  means this item put us over the global rate limit and the payload should be sent to Rollbar in
 *  place of the passed in item.
 */
RateLimiter.prototype.shouldSend = function(item, now) {
  now = now || (new Date()).getTime();
  if (now - this.startTime >= 60000) {
    this.startTime = now;
    this.perMinCounter = 0;
  }

  var globalRateLimit = RateLimiter.globalSettings.maxItems;
  var globalRateLimitPerMin = RateLimiter.globalSettings.itemsPerMinute;

  if (checkRate(item, globalRateLimit, this.counter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimit + ' max items reached', false);
  } else if (checkRate(item, globalRateLimitPerMin, this.perMinCounter)) {
    return shouldSendValue(this.platform, this.platformOptions, globalRateLimitPerMin + ' items per minute reached', false);
  }
  this.counter++;
  this.perMinCounter++;

  var shouldSend = !checkRate(item, globalRateLimit, this.counter);
  return shouldSendValue(this.platform, this.platformOptions, null, shouldSend, globalRateLimit);
};

RateLimiter.prototype.setPlatformOptions = function(platform, options) {
  this.platform = platform;
  this.platformOptions = options;
};

/* Helpers */

function checkRate(item, limit, counter) {
  return !item.ignoreRateLimit && limit >= 1 && counter > limit;
}

function shouldSendValue(platform, options, error, shouldSend, globalRateLimit) {
  var payload = null;
  if (error) {
    error = new Error(error);
  }
  if (!error && !shouldSend) {
    payload = rateLimitPayload(platform, options, globalRateLimit);
  }
  return {error: error, shouldSend: shouldSend, payload: payload};
}

function rateLimitPayload(platform, options, globalRateLimit) {
  var environment = options.environment || (options.payload && options.payload.environment);
  var item = {
    body: {
      message: {
        body: 'maxItems has been hit. Ignoring errors until reset.',
        extra: {
          maxItems: globalRateLimit
        }
      }
    },
    language: 'javascript',
    environment: environment,
    notifier: {
      version: (options.notifier && options.notifier.version) || options.version
    }
  };
  if (platform === 'browser') {
    item.platform = 'browser';
    item.framework = 'browser-js';
    item.notifier.name = 'rollbar-browser-js';
  } else if (platform === 'server') {
    item.framework = options.framework || 'node-js';
    item.notifier.name = options.notifier.name;
  }
  return item;
}

module.exports = RateLimiter;
