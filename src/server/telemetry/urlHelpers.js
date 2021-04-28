var url = require('url');
var { URL } = require('url');
var merge = require('../../merge');

// This function replicates the relevant logic in node/lib/http.js as closely
// as possible in order to produce the same result. Therefore, the code is
// replicated as is, favoring the closest match to the original code without style changes.
//
// The code here is only used to build telemetry metadata and is not used to
// build actual http requests.
function mergeOptions(input, options, cb) {
  if (typeof input === 'string') {
    const urlStr = input;
    input = urlToHttpOptions(new URL(urlStr));
  } else if (input && input[url.searchParamsSymbol] &&
             input[url.searchParamsSymbol][url.searchParamsSymbol]) {
    // url.URL instance
    input = urlToHttpOptions(input);
  } else {
    cb = options;
    options = input;
    input = null;
  }

  if (typeof options === 'function') {
    cb = options;
    options = input || {};
  } else {
    options = merge(input || {}, options);
  }
  return {options: options, cb: cb};
}

// This function replicates the relevant logic in node/lib/url.js as closely
// as possible in order to produce the same result. Therefore, the code is
// replicated as is, favoring the closest match to the original code without style changes.
//
// The code here is only used to build telemetry metadata and is not used to
// build actual http requests.
function urlToHttpOptions(url) {
  const options = {
    protocol: url.protocol,
    hostname: typeof url.hostname === 'string' &&
              url.hostname.startsWith('[') ?
      url.hostname.slice(1, -1) :
      url.hostname,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: `${url.pathname || ''}${url.search || ''}`,
    href: url.href
  };
  if (url.port !== '') {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`;
  }
  return options;
}

function constructUrl(options) {
  var url = options.protocol || 'http:';
  url += '//';
  if (options.auth) {
    url += `${options.auth}@`;
  }
  url += options.hostname || options.host || 'localhost';
  if (options.port) {
    url += `:${options.port}`
  }
  url += options.path || '/';

  return url;
}

module.exports = {
  mergeOptions,
  constructUrl
};
