const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.DB_PATH);

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, time_created INTEGER)');

