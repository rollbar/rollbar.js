var logger = require('../logger');
var _ = require('../../utility');

function makeFetchRequest(accessToken, url, method, data, callback, timeout) {
  var controller;
  var timeoutId;

  if (_.isFiniteNumber(timeout)) {
    controller = new AbortController();
    timeoutId = setTimeout(function () {
      controller.abort();
    }, timeout);
  }

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Rollbar-Access-Token': accessToken,
      signal: controller && controller.signal,
    },
    body: data,
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
      callback(null, json, headers);
    })
    .catch(function (error) {
      logger.error(error.message);
      callback(error);
    });
}

module.exports = makeFetchRequest;
