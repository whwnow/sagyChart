/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.post('/getDay', routes.getDay);
app.post('/getDayRandom', routes.getDayRandom);
app.post('/getMonth', routes.getMonth);
app.post('/getTwoSeries', routes.getTwoSeries);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
