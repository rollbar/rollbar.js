import * as _ from './utility.js';

/**
 * Queue - an object which handles which handles a queue of items to be sent to Rollbar.
 *   This object handles rate limiting via a passed in rate limiter, retries based on connection
 *   errors, and filtering of items based on a set of configurable predicates. The communication to
 *   the backend is performed via a given API object.
 */
class Queue {
  /**
   * @param rateLimiter - An object which conforms to the interface
   *    `rateLimiter.shouldSend(item) -> bool`
   * @param api - An object which conforms to the interface
   *    `api.postItem(payload, function(err, response))`
   * @param logger - An object used to log verbose messages if desired
   * @param options - see `Queue.prototype.configure`
   * @param replayManager - Optional `ReplayManager` for coordinating session replay with error occurrences
   */
  constructor(rateLimiter, api, logger, options, replayManager) {
    this.rateLimiter = rateLimiter;
    this.api = api;
    this.logger = logger;
    this.options = options;
    this.replayManager = replayManager;
    this.predicates = [];
    this.pendingItems = [];
    this.pendingRequests = [];
    this.retryQueue = [];
    this.retryHandle = null;
    this.waitCallback = null;
    this.waitIntervalID = null;
  }

  /**
   * configure - updates the options this queue uses
   *
   * @param options
   */
  configure(options) {
    this.api?.configure(options);
    const oldOptions = this.options;
    this.options = _.merge(oldOptions, options);
    return this;
  }

  /**
   * addPredicate - adds a predicate to the end of the list of predicates for this queue
   *
   * @param predicate - function(item, options) -> (bool|{err: Error})
   *  Returning true means that this predicate passes and the item is okay to go on the queue
   *  Returning false means do not add the item to the queue, but it is not an error
   *  Returning {err: Error} means do not add the item to the queue, and the given error explains why
   *  Returning {err: undefined} is equivalent to returning true but don't do that
   */
  addPredicate(predicate) {
    if (_.isFunction(predicate)) {
      this.predicates.push(predicate);
    }
    return this;
  }

  addPendingItem(item) {
    this.pendingItems.push(item);
  }

  removePendingItem(item) {
    const idx = this.pendingItems.indexOf(item);
    if (idx !== -1) {
      this.pendingItems.splice(idx, 1);
    }
  }

  /**
   * addItem - Send an item to the Rollbar API if all of the predicates are satisfied
   *
   * @param item - Item instance with the payload to send to the backend
   * @param callback - function(error, repsonse) which will be called with the response from the API
   *  in the case of a success, otherwise response will be null and error will have a value. If both
   *  error and response are null then the item was stopped by a predicate which did not consider this
   *  to be an error condition, but nonetheless did not send the item to the API.
   * @param originalError - The original error before any transformations that is to be logged if any
   * @param originalItem - The original item before transforms, used in pendingItems queue
   */
  addItem(item, callback, originalError, originalItem) {
    if (!callback || !_.isFunction(callback)) {
      callback = function () {
        return;
      };
    }
    const data = item.data;
    const predicateResult = this._applyPredicates(data);
    if (predicateResult.stop) {
      this.removePendingItem(originalItem);
      callback(predicateResult.err);
      return;
    }
    this._maybeLog(data, originalError);
    this.removePendingItem(originalItem);
    if (!this.options.transmit) {
      callback(new Error('Transmit disabled'));
      return;
    }

    if (this.replayManager && data.body) {
      const replayId = data?.attributes?.find(
        (a) => a.key === 'replay_id',
      )?.value;

      if (replayId) {
        item.replayId = this.replayManager.add(replayId, data.uuid);
      }
    }

    this.pendingRequests.push(data);
    try {
      this._makeApiRequest(data, (err, resp, headers) => {
        this._dequeuePendingRequest(data);

        if (!err && resp && item.replayId) {
          this._handleReplayResponse(item.replayId, resp, headers);
        }

        callback(err, resp);
      });
    } catch (e) {
      this._dequeuePendingRequest(data);
      callback(e);
    }
  }

  /**
   * wait - Stop any further errors from being added to the queue, and get called back when all items
   *   currently processing have finished sending to the backend.
   *
   * @param callback - function() called when all pending items have been sent
   */
  wait(callback) {
    if (!_.isFunction(callback)) {
      return;
    }
    this.waitCallback = callback;
    if (this._maybeCallWait()) {
      return;
    }
    if (this.waitIntervalID) {
      this.waitIntervalID = clearInterval(this.waitIntervalID);
    }
    this.waitIntervalID = setInterval(() => {
      this._maybeCallWait();
    }, 500);
  }

  /**
   * Sequentially applies the predicates that have been added to the queue to the
   * given item with the currently configured options.
   *
   * @param item - An item in the queue
   * @returns {stop: bool, err: (Error|null)} - stop being true means do not add item to the queue,
   *   the error value should be passed up to a callbak if we are stopping.
   */
  _applyPredicates(item) {
    let p = null;
    for (let i = 0, len = this.predicates.length; i < len; i++) {
      p = this.predicates[i](item, this.options);
      if (!p || p.err !== undefined) {
        return { stop: true, err: p.err };
      }
    }
    return { stop: false, err: null };
  }

  /**
   * Send an item to Rollbar, callback when done, if there is an error make an
   * effort to retry if we are configured to do so.
   *
   * @param item - an item ready to send to the backend
   * @param callback - function(err, response)
   */
  _makeApiRequest(item, callback) {
    const rateLimitResponse = this.rateLimiter.shouldSend(item);
    if (rateLimitResponse.shouldSend) {
      this.api.postItem(item, (err, resp, headers) => {
        if (err) {
          this._maybeRetry(err, item, callback);
        } else {
          callback(err, resp, headers);
        }
      });
    } else if (rateLimitResponse.error) {
      callback(rateLimitResponse.error);
    } else {
      this.api.postItem(rateLimitResponse.payload, callback);
    }
  }

  // These are errors basically mean there is no internet connection
  static RETRIABLE_ERRORS = [
    'ECONNRESET',
    'ENOTFOUND',
    'ESOCKETTIMEDOUT',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'EHOSTUNREACH',
    'EPIPE',
    'EAI_AGAIN',
  ];

  /**
   * Given the error returned by the API, decide if we should retry or just callback
   * with the error.
   *
   * @param err - an error returned by the API transport
   * @param item - the item that was trying to be sent when this error occured
   * @param callback - function(err, response)
   */
  _maybeRetry(err, item, callback) {
    let shouldRetry = false;
    if (this.options.retryInterval) {
      for (let i = 0, len = Queue.RETRIABLE_ERRORS.length; i < len; i++) {
        if (err.code === Queue.RETRIABLE_ERRORS[i]) {
          shouldRetry = true;
          break;
        }
      }
      if (shouldRetry && _.isFiniteNumber(this.options.maxRetries)) {
        item.retries = item.retries ? item.retries + 1 : 1;
        if (item.retries > this.options.maxRetries) {
          shouldRetry = false;
        }
      }
    }
    if (shouldRetry) {
      this._retryApiRequest(item, callback);
    } else {
      callback(err);
    }
  }

  /**
   * Add an item and a callback to a queue and possibly start a timer to process
   * that queue based on the retryInterval in the options for this queue.
   *
   * @param item - an item that failed to send due to an error we deem retriable
   * @param callback - function(err, response)
   */
  _retryApiRequest(item, callback) {
    this.retryQueue.push({ item, callback });

    if (!this.retryHandle) {
      this.retryHandle = setInterval(() => {
        while (this.retryQueue.length) {
          const retryObject = this.retryQueue.shift();
          this._makeApiRequest(retryObject.item, retryObject.callback);
        }
      }, this.options.retryInterval);
    }
  }

  /**
   * Removes the item from the pending request queue, this queue is used to
   * enable to functionality of providing a callback that clients can pass to `wait` to be notified
   * when the pending request queue has been emptied. This must be called when the API finishes
   * processing this item. If a `wait` callback is configured, it is called by this function.
   *
   * @param item - the item previously added to the pending request queue
   */
  _dequeuePendingRequest(item) {
    const idx = this.pendingRequests.indexOf(item);
    if (idx !== -1) {
      this.pendingRequests.splice(idx, 1);
      this._maybeCallWait();
    }
  }

  _maybeLog(data, originalError) {
    if (this.logger && this.options.verbose) {
      let message =
        originalError ||
        _.get(data, 'body.trace.exception.message') ||
        _.get(data, 'body.trace_chain.0.exception.message');
      if (message) {
        this.logger.error(message);
        return;
      }
      message = _.get(data, 'body.message.body');
      if (message) {
        this.logger.log(message);
      }
    }
  }

  _maybeCallWait() {
    if (
      _.isFunction(this.waitCallback) &&
      this.pendingItems.length === 0 &&
      this.pendingRequests.length === 0
    ) {
      if (this.waitIntervalID) {
        this.waitIntervalID = clearInterval(this.waitIntervalID);
      }
      this.waitCallback();
      return true;
    }
    return false;
  }

  /**
   * Handles the API response for an item with a replay ID.
   * Based on the success or failure status of the response,
   * it either sends or discards the associated session replay.
   *
   * @param {string} replayId - The ID of the replay to handle
   * @param {Object} response - The API response
   * @param {Object} headers - The response headers
   * @returns {Promise<boolean>} A promise that resolves to true if replay was sent successfully,
   *                             false if replay was discarded or an error occurred
   */
  async _handleReplayResponse(replayId, response, headers) {
    if (!this.replayManager) {
      console.warn('Queue._handleReplayResponse: ReplayManager not available');
      return false;
    }

    if (!replayId) {
      console.warn('Queue._handleReplayResponse: No replayId provided');
      return false;
    }

    try {
      if (this._shouldSendReplay(response, headers)) {
        return await this.replayManager.send(replayId);
      } else {
        this.replayManager.discard(replayId);
        return false;
      }
    } catch (error) {
      console.error('Error handling replay response:', error);
      return false;
    }
  }

  _shouldSendReplay(response, headers) {
    if (
      response?.err !== 0 ||
      !headers ||
      headers['Rollbar-Replay-Enabled'] !== 'true' ||
      headers['Rollbar-Replay-RateLimit-Remaining'] === '0'
    ) {
      return false;
    }

    return true;
  }
}

export default Queue;
