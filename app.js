var express = require('express'); // Express App include
var bodyParser = require('body-parser'); // Body parser for fetch posted data

var index = require('./routes/index');
var movies = require('./routes/movies');
var directors = require('./routes/directors');
var actors = require('./routes/actors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', index);
app.use('/api/movies', movies);
app.use('/api/directors', directors);
app.use('/api/actors', actors);

module.exports = app;
