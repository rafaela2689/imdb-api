var express = require('express'); // Express App include
var bodyParser = require('body-parser'); // Body parser for fetch posted data

var directors = require('./routes/directors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', directors);

module.exports = app;
