const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
// get a database
const db = new sqlite3.Database('./db/rats.db', sqlite3.OPEN_READWRITE, (err) => {
  if(err) {
    return console.error(err.message);
  }
});

// login
router.get('/login', function(req, res) {
  res.render('accounts/login.pug');
});
router.post('/login', function(req, res) {
  const sess = req.session;
  const id = req.body.id;
  const pw = req.body.pw;
  if(id === "") {
    res.render('accounts/login.pug', {msg : "ID를 입력해주세요."});
  } else if(pw === "") {
    res.render('accounts/login.pug', {msg : "PW를 입력해주세요."});
  } else {
    db.get('SELECT id, name FROM users WHERE id = ? and pw = ?', [id, pw], function(err, row) {
      if(row == null) {
        res.render('accounts/login.pug', {msg : "ID또는 PW를 확인해주세요."});
      } else {
        var sess = req.session;
        sess.userid = row.id;
        sess.name = row.name;
        res.cookie('name', row.name, {
          maxAge: 60*60*1000,
          httpOnly: false,
          path:'/'
        });
        res.redirect('/');
      }
    });
  }
});
// Logout
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.clearCookie('name');
  res.redirect('/');
});

// Signin
router.get('/signin', function(req, res) {
  res.render('accounts/signin.pug');
});
router.post('/signin', function(req, res) {
  for(var i in req.body) data.push(req.body[i]);
  db.run(`INSERT INTO
    users(id, pw, name, phone_number, email, permission_level, birth, class)
    values(?, ?, ?, ?, ?, 1, ?, ?)`, data, function (err) {
      if(err) {
        // res.redirect('/error');
        return console.error(err.message);
      } else {
        res.redirect('/accounts/login');
      }
    });
});
router.post('/duplicate', function(req, res){
  let id = req.body.id;
  let exists = true;
  db.get('SELECT count(id) as dup FROM users WHERE id = ?', [id], function(err, row) {
    if(err) {
      return console.error(err.message);
    }
    if(row.dup == 0) {
      exists = false;
    } else {
      exists = true;
    }
    var responseData = {'exists' : exists};
    res.json(responseData);
  });
});

// Profile
router.get('/profile', function (req, res) {
  res.render('accounts/profile.pug');
});

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found in login');
  err.status = 404;
  next(err);
});

module.exports = router;
