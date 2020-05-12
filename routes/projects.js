const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
// get a database
const db = new sqlite3.Database('./db/rats.db', sqlite3.OPEN_READWRITE, (err) => {
  if(err) {
    return console.error(err.message);
  }
});

function yearParser(row) {
  var data = [];
  for(var i in row) {
    isExist = false;
    for(var j in data) {
      if(row[i].year == data[j].year) {
        isExist = true;
        data[j].arr.push({
          id: row[i].id,
          title: row[i].title
        });
        break;
      }
    }
    if(isExist == false) {
      isExist = true;
      var item = {
        year : row[i].year,
        arr : [{
          id: row[i].id,
          title: row[i].title
        }]
      };
      data.push(item);
    }
  }
  return data;
}

/* GET project page. */
router.get('/', function(req, res, next) {
  db.all('SELECT id, title, year FROM projects', function(err, row) {
    res.render('projects/projects.pug', {data : yearParser(row)});
  });
});

router.get('/page/:index', function(req, res, next) {
  index = req.params.index;
  db.get('SELECT *, datetime(date_edited) as date FROM projects WHERE id = ' + index, function(err, row) {
    res.render('projects/project.pug', {data : row});
  });
});

/* new post page. */
router.get('/new_post', function(req, res) {
  const sess = req.session,
        name = req.cookies.name;
  if(name === undefined || name != sess.name) {
    sess.destroy();
    res.clearCookie('name');
    res.redirect('/accounts/login');
  } else {
    res.render('projects/new_post.pug');
  }
});

router.post('/new_post', function(req, res, next) {
  const title = req.body.title,
        contents = req.body.content,
        date = new Date().toISOString(),
        year = req.body.year,
        sess = req.session;
  if(sess.userid == null) {
    redirect('/accounts/login');
  }
  db.get('SELECT MAX(id) as id FROM projects', function(err, row) {
    if(err) {
      return console.error(err.message);
    }
    if(row.id==null) { // first posting
      db.run(`INSERT INTO
        projects(id, title, contents, year, date_create, date_edited, editer, name)
        values('${1}', '${title}', '${contents}', '${year}', '${date}', '${date}', '${sess.userid}', '${sess.name}')`);
    } else {
      db.run(`INSERT INTO
        projects(id, title, contents, year, date_create, date_edited, editer, name)
        values('${row.id + 1}', '${title}', '${contents}', '${year}', '${date}', '${date}', '${sess.userid}', '${sess.name}')`);
    }
    res.redirect('/projects');
  });
});

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  var err = new Error('Not Found in projects');
  err.status = 404;
  next(err);
});

module.exports = router;
