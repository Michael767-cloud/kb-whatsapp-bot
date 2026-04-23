const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data.sqlite');
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error('Failed to open SQLite database:', error);
    throw error;
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS conversation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      session_id TEXT NOT NULL,
      user_message TEXT NOT NULL,
      bot_reply TEXT NOT NULL
    )
  `);
});

function logConversation({ sessionId, userMessage, botReply }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO conversation_logs (timestamp, session_id, user_message, bot_reply) VALUES (?, ?, ?, ?)`,
      [new Date().toISOString(), sessionId, userMessage, botReply],
      (error) => {
        if (error) {
          reject(new Error(`Failed to log conversation: ${error.message}`));
          return;
        }
        resolve();
      }
    );
  });
}

module.exports = { db, logConversation };
