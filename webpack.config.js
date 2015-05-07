module.exports = {
  entry: {
    rollbar: './src/bundles/rollbar.js',
    'rollbar.nojson': './src/bundles/rollbar.nojson.js',
    'rollbar.commonjs': './src/bundles/rollbar.commonjs.js'
  },
  output: {
    path: './dist/bundles/',
    filename: '[name].js'
  },
  failOnError: true
};

