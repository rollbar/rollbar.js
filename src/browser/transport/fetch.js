import logger from '../../logger.js';
import * as _ from '../../utility.js';

function makeFetchRequest({
  accessToken,
  url,
  method,
  payload,
  headers,
  callback,
  timeout,
}) {
  var controller;
  var timeoutId;

  if (_.isFiniteNumber(timeout)) {
    controller = new AbortController();
    timeoutId = setTimeout(function () {
      controller.abort();
    }, timeout);
  }

  headers = {
    'Content-Type': 'application/json',
    'X-Rollbar-Access-Token': accessToken,
    ...headers,
  };

  fetch(url, {
    method,
    headers,
    body: payload,
    signal: controller && controller.signal,
  })
    .then(function (response) {
      if (timeoutId) clearTimeout(timeoutId);
      const respHeaders = response.headers;

      const isItemRoute = url.endsWith('/api/1/item/');
      const headers = isItemRoute
        ? {
            'Rollbar-Replay-Enabled': respHeaders.get('Rollbar-Replay-Enabled'),
            'Rollbar-Replay-RateLimit-Remaining': respHeaders.get(
              'Rollbar-Replay-RateLimit-Remaining',
            ),
            'Rollbar-Replay-RateLimit-Reset': respHeaders.get(
              'Rollbar-Replay-RateLimit-Reset',
            ),
          }
        : {};

      const json = response.json();
      try {
        callback(null, json, headers);
      } catch (e) {
        // Otherwise `.catch` below would take this (often a TypeError) for a
        // network failure, and the item that was just delivered would be
        // retried.
        logger.error(e && e.message);
      }
    })
    .catch(function (error) {
      if (timeoutId) clearTimeout(timeoutId);
      logger.error(error.message);
      callback(_toTransportError(error));
    });
}

/**
 * Converts a fetch rejection into the error shape the queue understands.
 *
 * fetch rejects with a `TypeError` when the request fails at the network
 * layer (offline, DNS failure, connection refused or reset) and with an
 * `AbortError` when the timeout above aborts it. Neither carries a `code`, so
 * `Queue` can't tell them from other failures and never retries them. Give
 * them the same codes the XHR transport and the Node transport use.
 *
 * @param {Error} error - The rejection reason from `fetch`.
 * @returns {Error} An error with a retriable `code` for network failures and
 *   timeouts, otherwise `error` unchanged.
 */
function _toTransportError(error) {
  let code;
  if (error && error.name === 'AbortError') {
    code = 'ETIMEDOUT';
  } else if (error instanceof TypeError) {
    code = 'ENOTFOUND';
  } else {
    return error;
  }
  // DOMException (AbortError) has a read-only `code`, so wrap rather than mutate.
  const err = new Error(error.message);
  err.code = code;
  err.cause = error;
  return err;
}

export default makeFetchRequest;
