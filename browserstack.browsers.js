var request = require('request');

var BROWSERSTACK_BROWSERS_ENDPOINT = 'https://www.browserstack.com/automate/browsers.json'


function annotate(browserList) {
  return browserList.map(function(browser) {
    browser.base = 'BrowserStack';
    browser._alias = 'bs_' + browser.browser;
    browser._version = parseFloat(browser.browser_version || '0');
    browser._id = [
      browser.browser,
      browser.browser_version,
      browser.device,
      browser.os,
      browser.os_version
    ].join('-').replace(/\s/g, '_');

    return browser;
  });
}


function versionAliases(browserList) {
  var ret = [];
  browserList.forEach(function(browser) {
    if (browser._version) {
      var copy = simpleCopy(browser);
      copy._alias = 'bs_' + browser.browser + '_' + browser._version;
      ret.push(copy);
    }
  });
  return ret;
}


var browsers = [];
var sortedByBrowser = {};
try {
  loadBrowsers(require('./browserstack.browsers.json'));
} catch (e) {
  console.error('Could not read ./browserstack.browsers.json. Ignoring.', e);
}


function simpleCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function loadBrowsers(browserListFromBrowserStack) {
  browsers = annotate(browserListFromBrowserStack);
  browsers = browsers.concat(versionAliases(browsers));

  sortedByBrowser = {};

  browsers.forEach(function(browser) {
    var browserList = sortedByBrowser[browser._alias] = sortedByBrowser[browser._alias] || [];
    browserList.push(browser);
  });

  // Sort all of the browsers by browser, _version
  for (var browser in sortedByBrowser) {
    var browserList = sortedByBrowser[browser];
    var numBrowsers = browserList.length;
    browserList.sort(function(a, b) {
      return a._version - b._version;
    });

    // Store a reference in the global browsers array to the oldest, previous and latest of
    // each browser.
    if (numBrowsers > 0) {
      var browserName = browser;
      var oldest = simpleCopy(browserList[0]);
      var latest = simpleCopy(browserList[browserList.length - 1]);
      var previous;

      oldest._alias = browserName + '_oldest';
      latest._alias = browserName + '_latest';

      browsers.push(oldest);
      browsers.push(latest);

      if (numBrowsers > 1) {
        previous = simpleCopy(browserList[browserList.length - 2]);
        previous._alias = browserName + '_previous';
        browsers.push(previous);
      }
    }
  }
}


function download(username, accessKey, callback) {
  var auth = 'Basic ' + new Buffer(username + ':' + accessKey).toString('base64');
  var req = {
    url: BROWSERSTACK_BROWSERS_ENDPOINT,
    headers: {
      Authorization: auth
    },
    json: true
  };

  request.get(req, function(err, resp, body) {
    if (err || resp.statusCode != 200) {
      return callback(err || new Error('Received non 200 response from BrowserStack: ' + resp.statusCode));
    }

    // Save the downloaded browsers in memory
    loadBrowsers(body);

    fs.writeFile('./browserstack.browsers.json', JSON.stringify(body, null, '  '), callback);
  });
}


/**
 * Returns an array of Objects that match the requested filters.
 * If no arguments are provided, an empty array is returned.
 *
 * E.g.
 *
 * filter('bs_latest') - Will return the latest browser Objects for each browser.
 * filter('bs_latest', 'bs_previous') - Will return the latest and previous browser Objects for each browser.
 * filter('bs_ie_latest', 'bs_oldest') - Will return the latest IE browser and all of the oldest browsers.
 * filter('bs_all') - Will return the all of the browser Objects.
 *
 * @returns {Array}
 */
function filter() {
  var ret = [];
  var labels = Array.prototype.slice.call(arguments);

  labels.forEach(function(label) {
    browsers.forEach(function(browser) {
      if (label === 'bs_all') {
        ret.push(browser);
      } else if (browser._alias.match(new RegExp(label.slice(2) + '$'))) {
        ret.push(browser);
      }
    });
  });

  return ret;
}


module.exports = {
  _browsers: browsers,
  download: download,
  filter: filter,
};
