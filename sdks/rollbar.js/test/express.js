var express = require('express');
var app = express();
app.post('/', function(req, res) {
  res.send('{"message":"It works!"}');
});
module.exports = app;
