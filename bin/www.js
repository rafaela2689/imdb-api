var app = require('../app');

var port = process.env.PORT || 8080;

app.set('port', port);

var server = app.listen(app.get('port'), function () {
	console.log('Express server listening on port: ' + server.address().port);
});


