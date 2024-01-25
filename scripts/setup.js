const sqlite3 = require('sqlite3');

console.warn('Warning: Did you remember to change the secret?')
process.env.DB_PATH = 'dev.db';
process.env.TOKEN_SECRET = 'secret';

const db = new sqlite3.Database(process.env.DB_PATH);

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, time_created INTEGER)');

