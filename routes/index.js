const express = require('express');
const router = express.Router();
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
// get a database
const db = new sqlite3.Database('./db/rats.db', sqlite3.OPEN_READONLY, (err) => {
  if(err) {
    return console.error(err.message);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  db.all('SELECT id, title, date(date_create) as date FROM projects ORDER BY date_create desc limit 5', function(err, row) {
    res.render('index.pug', {data : row});
  });
});

/* top nov -> single page route */
router.get('/history', function(req, res) {
  res.render('history.pug');
});
router.get('/notice', function(req, res) {
  res.render('notice.pug');
});
router.get('/member', function(req, res) {
  res.render('member.pug');
});

module.exports = router;
