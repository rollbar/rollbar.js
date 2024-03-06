/* eslint no-console: 0 */

const path = require('path');
const express = require('express');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();

app.use(express.static(path.join(__dirname)));
app.get('/rollbar.js', function response(req, res) {
  var t = (req.query.t || 0.01) * 100;
  console.log('Waiting: ', t, 'ms');
  setTimeout(function () {
    res.sendFile(path.join(__dirname, '../../dist/rollbar.umd.js'));
  }, t);
});

app.get('/test', function response(req, res) {
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.get('/sample', function response(req, res) {
  res.status(200).json({ hello: 'world' });
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info(
    '==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.',
    port,
    port,
  );
});
