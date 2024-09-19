import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./src/db/what_do_you_meme.sqlite', (err) => {
    if (err) console.error(err.message);
});
export default db;