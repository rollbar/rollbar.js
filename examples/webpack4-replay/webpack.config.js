const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'rollbar/replay': path.resolve(__dirname, 'node_modules/rollbar/dist/rollbar.replay.umd.min.js'),
    },
  },
  devtool: 'source-map',
};
