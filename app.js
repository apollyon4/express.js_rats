const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const routes = require('./routes/index');
const accounts = require('./routes/accounts');
const projects = require('./routes/projects');
const activities = require('./routes/activities');

const db = require('./db/init');

const app = express();

// view engine setup
app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');
app.set('views', './views');

// port setup
app.set('port', process.env.PORT || 9000);

// public
app.use(express.static(path.join(__dirname, 'public')));
// redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// cookieParser
app.use(cookieParser());

// session
app.use(session({
  secret: 'thisisasecreatkey',
  resave: false,
  saveUninitialized: true
}));

// router
app.use('/', routes);
app.use('/accounts', accounts);
app.use('/projects', projects);
app.use('/activities', activities);
app.locals.pretty = true;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found in app');
  err.status = 404;
  next(err);
});

// error handlers

////////////////////
// creates Server //
////////////////////

var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port' + server.address().port);
});

module.exports = app;
