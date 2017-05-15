/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const Rollbar = require('rollbar');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

var token = 'POST_SERVER_ITEM_TOKEN';

const rollbar = Rollbar.init({
  accessToken: token,
  handleUncaughtExceptions: true
});
const other = require('./other');

app.get('/error', function(req, res) {
  req.user_id = "test-user";
  throw new Error('Hello World');
});
app.get('/dolog', function(req, res) {
  var u = rollbar.log('hello there', req, {
    customName: 'bork bork',
  }, function(err, resp) {
    if (err) {
      console.log('Error');
      console.log(err);
    } else {
      console.log('Response');
      console.log(resp);
    }
  });
  res.send(JSON.stringify(u));
});
app.get('/other', function(req, res) {
  other.doSomeLog('hello', req);
  other.doSomeError('bork bork bork', req);
  res.json({'hello': 'world'});
});

app.use(express.static(path.join(__dirname)));
app.get('*', function response(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use(rollbar.errorHandler());

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
