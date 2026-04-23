import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

export function createDatabase(dbPath) {
  const fullPath = path.resolve(dbPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const db = new sqlite3.Database(fullPath);

  return {
    async init() {
      await run(
        db,
        `CREATE TABLE IF NOT EXISTS greeted_users (
          wa_id TEXT PRIMARY KEY,
          greeted_at TEXT NOT NULL
        )`
      );

      await run(
        db,
        `CREATE TABLE IF NOT EXISTS reminders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wa_id TEXT NOT NULL,
          reminder_text TEXT NOT NULL,
          due_at TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TEXT NOT NULL
        )`
      );

      await run(
        db,
        `CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          owner_wa_id TEXT NOT NULL,
          contact_name TEXT NOT NULL,
          contact_wa_id TEXT,
          created_at TEXT NOT NULL
        )`
      );
    },

    async hasBeenGreeted(waId) {
      const row = await get(db, 'SELECT wa_id FROM greeted_users WHERE wa_id = ?', [waId]);
      return Boolean(row);
    },

    async markGreeted(waId) {
      await run(
        db,
        `INSERT OR IGNORE INTO greeted_users (wa_id, greeted_at)
         VALUES (?, datetime('now'))`,
        [waId]
      );
    }
  };
}
