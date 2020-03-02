var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/subdir', function(req, res) {
  res.send('<h1>subdir</h1>');
  console.log("subdir");
});

module.exports = router;
