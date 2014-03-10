var express = require('express');
var app = express();
app.post('/', function(req, res) {
  var accessToken = req.headers['x-rollbar-access-token'];

  var response = {
    accessToken: accessToken
  };

  res.send(JSON.stringify(response));
});
module.exports = app;
