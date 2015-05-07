module.exports = {
  entry: {
    rollbar: './src/bundles/rollbar.js',
    'rollbar.nojson': './src/bundles/rollbar.nojson.js',
    'rollbar.umd': './src/bundles/rollbar.umd.js'
  },
  output: {
    library: 'Rollbar',
    path: './dist/bundles/',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  failOnError: true
};

