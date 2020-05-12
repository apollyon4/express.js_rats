const sqlite3 = require('sqlite3').verbose();

// create a database
let db = new sqlite3.Database('./db/rats.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if(err) {
    return console.error(err.message);
  }
  init()
});

function init() {
  db.run(`CREATE TABLE if not exists projects(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    contents TEXT NOT NULL,
    year INTEGER NOT NULL,
    date_create TEXT NOT NULL,
    date_edited TEXT NOT NULL,
    editer TEXT NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(editer) REFERENCES users(id),
    FOREIGN KEY(name) REFERENCES users(name)
  )`);
  db.run(`CREATE TABLE if not exists users(
    id TEXT PRIMARY KEY,
    pw TEXT NOT NULL,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    permission_level INTEGER NOT NULL,
    birth TEXT NOT NULL,
    class INTEGER NOT NULL
  )`);
  console.log('Connected to the SQlite database(\'rats.db\').');
}
