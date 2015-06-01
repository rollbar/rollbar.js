var extend = require('util')._extend;
var webpack = require('webpack');
var semver = require('semver');
var pkg = require('./package.json');

var semVer = semver.parse(pkg.version);

// Get the minimum minor version to put into the CDN URL
semVer.patch = 0;
semVer.prerelease = [];
pkg.pinnedVersion = semVer.major + '.' + semVer.minor;

var outputPath = './dist/';

var jsonDefines = {
  __USE_JSON__: true
};

var noJsonDefines = {
  __USE_JSON__: false
};

var defaults = {
  __NOTIFIER_VERSION__: JSON.stringify(pkg.version),
  __JQUERY_PLUGIN_VERSION__: JSON.stringify(pkg.plugins.jquery.version),
  __DEFAULT_SCRUB_FIELDS__: JSON.stringify(pkg.defaults.scrubFields),
  __DEFAULT_ENDPOINT__: JSON.stringify(pkg.defaults.endpoint),
  __DEFAULT_LOG_LEVEL__: JSON.stringify(pkg.defaults.logLevel),
  __DEFAULT_REPORT_LEVEL__: JSON.stringify(pkg.defaults.reportLevel),
  __DEFAULT_UNCAUGHT_ERROR_LEVEL: JSON.stringify(pkg.defaults.uncaughtErrorLevel),
  __DEFAULT_ROLLBARJS_URL__: JSON.stringify('https://' + pkg.cdn.host + '.js/v' + pkg.pinnedVersion + '/rollbar.umd.min.js'),
  __DEFAULT_MAX_ITEMS__: pkg.defaults.maxItems,
  __DEFAULT_ITEMS_PER_MIN__: pkg.defaults.itemsPerMin
};

var defaultsPlugin = new webpack.DefinePlugin(defaults);
var uglifyPlugin = new webpack.optimize.UglifyJsPlugin();
var useJsonPlugin = new webpack.DefinePlugin(jsonDefines);
var notUseJsonPlugin = new webpack.DefinePlugin(noJsonDefines);

var snippetConfig = {
  name: 'snippet',
  entry: {
    'rollbar.snippet': './src/bundles/rollbar.snippet.js'
  },
  output: {
    path: outputPath,
    filename: '[name].js'
  },
  plugins: [defaultsPlugin, uglifyPlugin],
  failOnError: true
};

var testsConfig = {
  name: 'tests',
  entry: {
    util: './test/bundles/util.js',
    json: './test/bundles/json.js',
    error_parser: './test/bundles/error_parser.js',
    xhr: './test/bundles/xhr.js',
    notifier: './test/bundles/notifier.js',
    'notifier-ratelimit': './test/bundles/notifier.ratelimit.js',
    'rollbar': './test/bundles/rollbar.js',
    'shim': './test/bundles/shim.js',
    'shimalias': './test/bundles/shimalias.js',
  },
  plugins: [defaultsPlugin],
  output: {
    path: 'test/',
    filename: '[name].bundle.js',
  }
};

var UMDConfigBase = {
  entry: {
    'rollbar.umd': './src/bundles/rollbar.umd.js'
  },
  output: {
    path: outputPath,
    libraryTarget: 'umd'
  },
  failOnError: true
};

var config = [];
config.push(snippetConfig);
config.push(testsConfig);

function addUMDToConfig(webpackConfig, filename, extraPlugins) {
  var basePlugins = [defaultsPlugin];
  var UMDConfig = extend({}, UMDConfigBase);

  plugins = basePlugins.concat(extraPlugins);
  UMDConfig.plugins = plugins;

  UMDConfig.output = extend({filename: filename}, UMDConfig.output);

  webpackConfig.push(UMDConfig);
}

addUMDToConfig(config, '[name].js', [useJsonPlugin]);
addUMDToConfig(config, '[name].min.js', [useJsonPlugin, uglifyPlugin]);
addUMDToConfig(config, '[name].nojson.js', [notUseJsonPlugin]);
addUMDToConfig(config, '[name].nojson.min.js', [notUseJsonPlugin, uglifyPlugin]);

module.exports = config;

