/* eslint no-console: 0 */

const path = require('path');
const express = require('express');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.get('/rollbar.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../../dist/rollbar.umd.js'));
});

app.get('/tool.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/tool.js'));
});

app.get('/other.js', function (req, res) {
  res.sendFile(path.join(__dirname, '/other.js'));
});

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
