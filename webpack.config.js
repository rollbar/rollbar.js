module.exports = {
  entry: {
    rollbar: './src/bundles/rollbar.js'
  },
  output: {
    path: './dist/bundles/',
    filename: '[name].js'
  },
  failOnError: true
};

