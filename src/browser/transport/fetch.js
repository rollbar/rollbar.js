var logger = require('../logger');
var _ = require('../../utility');

function makeFetchRequest(accessToken, url, method, data, callback, timeout) {
  var controller;
  var timeoutId;

  if(_.isFiniteNumber(timeout)) {
    controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), timeout);
  }

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Rollbar-Access-Token': accessToken,
      signal: controller && controller.signal
    },
    body: data,
  })
  .then((response) => {
    if (timeoutId) clearTimeout(timeoutId);
    return response.json();
  })
  .then((data) => {
    callback(null, data);
  })
  .catch((error) => {
    logger.error(error.message);
    callback(error);
  });
}

module.exports = makeFetchRequest;
