const sqlite3 = require('sqlite3');

if (process.env.DB_PATH == null || process.env.TOKEN_SECRET == null) {
  console.error('ERROR: DB_PATH or TOKEN_SECRET is not set.');
  process.exit()
}

const db = new sqlite3.Database(process.env.DB_PATH);

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, timeCreated INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, ownerId INTEGER, ownerUsername TEXT, name TEXT, timeCreated INTEGER, lastUpdated INTEGER, visibility TEXT, characterList TEXT)');