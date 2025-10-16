const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

module.exports = (_env, argv) => ({
  output: {
    // rollbar.js tests require modified asset path.
    // Detect whether running JIT or building the webpack bundle.
    publicPath: argv.build ? '/examples/react/dist/' : '',
  },
  resolve: {
    alias: {
      'rollbar/replay': path.resolve(__dirname, 'node_modules/rollbar/dist/rollbar.replay.umd.min.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [htmlPlugin],
});
