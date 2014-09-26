// This file creates our server and calls config.js to configure
// all middleware and routing.
var express = require('express');
var jwt = require('jwt-simple');
var app = express();

app.set('jwtTokenSecret', 'BEERMEBEERMEBEERME');
require('./config.js')(app,express);

module.exports = app;


