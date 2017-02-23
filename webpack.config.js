var extend = require('util')._extend;
var path = require('path');
var webpack = require('webpack');
var defaults = require('./defaults');

var outputPath = './dist/';

var defaultsPlugin = new webpack.DefinePlugin(defaults);
var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
  // We've had some reports of the sourceMappingURL comment causing problems in Firefox.
  // The uglifyjs plugin doesn't provide a way to generate the source map without generating
  // that comment, so until we can resolve that, let's just not generate the source map.
  sourceMap: false,
  minimize: true
});

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
  failOnError: true,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "strict!eslint",
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var pluginConfig = {
  name: 'plugins',
  entry: {
    'jquery': './src/plugins/jquery.js'
  },
  output: {
    path: outputPath + '/plugins/',
    filename: '[name].min.js'
  },
  plugins: [defaultsPlugin, uglifyPlugin],
  failOnError: true,
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "strict!eslint",
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var testsConfig = {
  name: 'tests',
  entry: {
    browserify: './test-browser/browserify.test.js',
    error_parser: './test-browser/error_parser.test.js',
    json: './test-browser/json.test.js',
    mootools: './test-browser/mootools.test.js',
    notifier: './test-browser/notifier.test.js',
    notifier_ratelimit: './test-browser/notifier_ratelimit.test.js',
    rollbar: './test-browser/rollbar.test.js',
    shim: './test-browser/shim.test.js',
    shimalias: './test-browser/shimalias.test.js',
    util: './test-browser/util.test.js',
    xhr: './test-browser/xhr.test.js',
  },
  plugins: [defaultsPlugin],
  output: {
    path: 'test-browser/',
    filename: '[name].bundle.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "strict!eslint",
        exclude: [/node_modules/, /vendor/, /lib/, /dist/]
      }
    ],
  }
};

var vanillaConfigBase = {
  eslint: {
    configFile: path.resolve(__dirname, ".eslintrc")
  },
  entry: {
    'rollbar': './src/bundles/rollbar.js'
  },
  output: {
    path: outputPath
  },
  plugins: [defaultsPlugin, uglifyPlugin],
  failOnError: true,
  devtool: 'hidden-source-map',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "strict!eslint",
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var UMDConfigBase = {
  eslint: {
    configFile: path.resolve(__dirname, ".eslintrc")
  },
  entry: {
    'rollbar.umd': ['./src/bundles/rollbar.js']
  },
  output: {
    path: outputPath,
    libraryTarget: 'umd'
  },
  failOnError: true,
  devtool: 'hidden-source-map',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "strict!eslint",
        exclude: [/node_modules/, /vendor/]
      }
    ],
  }
};

var namedAMDConfigBase = extend({}, UMDConfigBase);
namedAMDConfigBase.entry = {
  'rollbar.named-amd': namedAMDConfigBase.entry['rollbar.umd']
};
namedAMDConfigBase.output = extend({}, namedAMDConfigBase.output)
namedAMDConfigBase.output.library = 'rollbar';
namedAMDConfigBase.output.libraryTarget = 'amd';


var config = [snippetConfig, pluginConfig];

function addVanillaToConfig(webpackConfig, filename, extraPlugins) {
  var basePlugins = [defaultsPlugin];
  var vanillaConfig = extend({}, vanillaConfigBase);
  vanillaConfig.name = filename;

  plugins = basePlugins.concat(extraPlugins);
  vanillaConfig.plugins = plugins;

  vanillaConfig.output = extend({filename: filename}, vanillaConfig.output);

  webpackConfig.push(vanillaConfig);
}

function addUMDToConfig(webpackConfig, filename, extraPlugins) {
  var basePlugins = [defaultsPlugin];
  var UMDConfig = extend({}, UMDConfigBase);

  plugins = basePlugins.concat(extraPlugins);
  UMDConfig.plugins = plugins;

  UMDConfig.output = extend({filename: filename}, UMDConfig.output);

  webpackConfig.push(UMDConfig);
}


function addNamedAMDToConfig(webpackConfig, filename, extraPlugins) {
  var basePlugins = [defaultsPlugin];
  var AMDConfig = extend({}, namedAMDConfigBase);

  plugins = basePlugins.concat(extraPlugins);
  AMDConfig.plugins = plugins;

  AMDConfig.output = extend({filename: filename}, AMDConfig.output);

  webpackConfig.push(AMDConfig);
}


function generateBuildConfig(name, plugins) {
  addVanillaToConfig(config, name, plugins);
  addUMDToConfig(config, name, plugins);
  addNamedAMDToConfig(config, name, plugins);
}

generateBuildConfig('[name].js', []);
generateBuildConfig('[name].min.js', [uglifyPlugin]);

module.exports = config;
