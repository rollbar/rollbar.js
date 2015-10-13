var express = require('express');
var app = express();
app.options('/api', function(req, res) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'X-Rollbar-Access-Token, Content-Type');
  res.send(200);
});
app.post('/api', function(req, res) {
  var accessToken = req.headers['x-rollbar-access-token'];

  var response = {
    accessToken: accessToken
  };

  res.header('Access-Control-Allow-Origin', '*');
  res.json(response);
});

app.use('/', express.static(__dirname + '/../'));
module.exports = app;
