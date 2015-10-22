var express = require('express'); // Express App include
var bodyParser = require('body-parser'); // Body parser for fetch posted data

var index = require('./routes/index');
var movies = require('./routes/movies');
var directors = require('./routes/directors');
var actors = require('./routes/actors');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);
app.use('/movies', movies);
app.use('/directors', directors);
app.use('/actors', actors);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ message: err.message});
});

module.exports = app;
