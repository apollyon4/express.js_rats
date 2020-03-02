var express = require('express');
var path = require('path');
var url = require('url');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './views');

// port setup
app.set('port', process.env.PORT || 9000);

// 정적 방식을 사용할 것이나 html 작업에 불편해서 주석처리 하고 동적으로 일단 씁시다.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.locals.pretty = true;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

////////////////////
// creates Server //
////////////////////
module.exports = app;

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port' + server.address().port);
});
//app.listen(3000);

module.exports = app;
