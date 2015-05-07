module.exports = {
  entry: {
    rollbar: './src/bundles/rollbar.js',
    'rollbar.nojson': './src/bundles/rollbar.nojson.js'
  },
  output: {
    path: './dist/bundles/',
    filename: '[name].js'
  },
  failOnError: true
};

