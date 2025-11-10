/*
 * RateLimiter - encapsulates the logic for counting items sent to Rollbar.
 *
 * @param options - the same options that are accepted by configureGlobal offered as a convenience
 */
class RateLimiter {
  static globalSettings = {
    startTime: Date.now(),
    maxItems: null,
    itemsPerMinute: null,
  };

  constructor(options = {}) {
    this.startTime = Date.now();
    this.counter = 0;
    this.perMinCounter = 0;
    this.platform = null;
    this.platformOptions = {};
    this.configureGlobal(options);
  }

  /*
   * configureGlobal - set the global rate limiter options
   *
   * @param options - Only the following values are recognized:
   *    startTime: a timestamp of the form returned by (new Date()).getTime()
   *    maxItems: the maximum items
   *    itemsPerMinute: the max number of items to send in a given minute
   */
  configureGlobal(options = {}) {
    const { startTime, maxItems, itemsPerMinute } = options;

    if (startTime != null) {
      RateLimiter.globalSettings.startTime = startTime;
    }
    if (maxItems != null) {
      RateLimiter.globalSettings.maxItems = maxItems;
    }
    if (itemsPerMinute != null) {
      RateLimiter.globalSettings.itemsPerMinute = itemsPerMinute;
    }
  }

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
  shouldSend(item, now = Date.now()) {
    const elapsedTime = now - this.startTime;
    if (elapsedTime < 0 || elapsedTime >= 60000) {
      this.startTime = now;
      this.perMinCounter = 0;
    }

    const globalRateLimit = RateLimiter.globalSettings.maxItems;
    const globalRateLimitPerMin = RateLimiter.globalSettings.itemsPerMinute;

    if (checkRate(item, globalRateLimit, this.counter)) {
      return shouldSendValue(
        this.platform,
        this.platformOptions,
        `${globalRateLimit} max items reached`,
        false,
      );
    }

    if (checkRate(item, globalRateLimitPerMin, this.perMinCounter)) {
      return shouldSendValue(
        this.platform,
        this.platformOptions,
        `${globalRateLimitPerMin} items per minute reached`,
        false,
      );
    }

    this.counter += 1;
    this.perMinCounter += 1;

    const underGlobalLimit = !checkRate(item, globalRateLimit, this.counter);
    const perMinute = underGlobalLimit;
    const shouldSend =
      underGlobalLimit &&
      !checkRate(item, globalRateLimitPerMin, this.perMinCounter);

    return shouldSendValue(
      this.platform,
      this.platformOptions,
      null,
      shouldSend,
      globalRateLimit,
      globalRateLimitPerMin,
      perMinute,
    );
  }

  setPlatformOptions(platform, options) {
    this.platform = platform;
    this.platformOptions = options;
  }
}

/* Helpers */

function checkRate(item, limit, counter) {
  return !item.ignoreRateLimit && limit >= 1 && counter > limit;
}

function shouldSendValue(
  platform,
  options,
  error,
  shouldSend,
  globalRateLimit,
  limitPerMin,
  perMinute,
) {
  let payload = null;
  const errorResult = error ? new Error(error) : null;

  if (!errorResult && !shouldSend) {
    payload = rateLimitPayload(
      platform,
      options,
      globalRateLimit,
      limitPerMin,
      perMinute,
    );
  }

  return { error: errorResult, shouldSend, payload };
}

function rateLimitPayload(
  platform,
  options,
  globalRateLimit,
  limitPerMin,
  perMinute,
) {
  const environment =
    options.environment || (options.payload && options.payload.environment);
  const msg = perMinute
    ? 'item per minute limit reached, ignoring errors until timeout'
    : 'maxItems has been hit, ignoring errors until reset.';
  const item = {
    body: {
      message: {
        body: msg,
        extra: {
          maxItems: globalRateLimit,
          itemsPerMinute: limitPerMin,
        },
      },
    },
    language: 'javascript',
    environment: environment,
    notifier: {
      version:
        (options.notifier && options.notifier.version) || options.version,
    },
  };
  if (platform === 'browser') {
    item.platform = 'browser';
    item.framework = 'browser-js';
    item.notifier.name = 'rollbar-browser-js';
  } else if (platform === 'server') {
    item.framework = options.framework || 'node-js';
    item.notifier.name = options.notifier.name;
  } else if (platform === 'react-native') {
    item.framework = options.framework || 'react-native';
    item.notifier.name = options.notifier.name;
  }
  return item;
}

export default RateLimiter;
