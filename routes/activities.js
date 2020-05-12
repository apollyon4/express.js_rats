const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('activities/activities.pug');
});

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found in activities');
  err.status = 404;
  next(err);
});

module.exports = router;
