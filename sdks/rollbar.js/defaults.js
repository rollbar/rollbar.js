var semver = require('semver');

var pkg = require('./package.json');

var version = pkg.version;

module.exports = {
  __NOTIFIER_VERSION__: JSON.stringify(pkg.version),
  __JQUERY_PLUGIN_VERSION__: JSON.stringify(pkg.plugins.jquery.version),
  __DEFAULT_SCRUB_FIELDS__: JSON.stringify(pkg.defaults.scrubFields),
  __DEFAULT_ENDPOINT__: JSON.stringify(pkg.defaults.endpoint),
  __DEFAULT_LOG_LEVEL__: JSON.stringify(pkg.defaults.logLevel),
  __DEFAULT_REPORT_LEVEL__: JSON.stringify(pkg.defaults.reportLevel),
  __DEFAULT_UNCAUGHT_ERROR_LEVEL: JSON.stringify(pkg.defaults.uncaughtErrorLevel),
  __DEFAULT_ROLLBARJS_URL__: JSON.stringify('https://' + pkg.cdn.host + '/ajax/libs/rollbar.js/' + version + '/rollbar.min.js'),
  __DEFAULT_MAX_ITEMS__: pkg.defaults.maxItems,
  __DEFAULT_ITEMS_PER_MIN__: pkg.defaults.itemsPerMin
};
