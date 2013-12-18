var express = require('express');
var app = express();
app.post('/', function(req, res) {
  res.send('It works!');
});
module.exports = app;