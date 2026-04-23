import express from 'express';
import { getConfig } from './config.js';
import { createDatabase } from './db.js';
import { sendWhatsAppText } from './metaApi.js';
import { buildReply } from './replyService.js';

function extractIncomingMessages(payload) {
  const entries = payload?.entry || [];
  const messages = [];

  for (const entry of entries) {
    const changes = entry?.changes || [];
    for (const change of changes) {
      const incomingMessages = change?.value?.messages || [];
      for (const msg of incomingMessages) {
        messages.push(msg);
      }
    }
  }

  return messages;
}

export function createApp({ config: providedConfig, db: providedDb, sendMessage = sendWhatsAppText } = {}) {
  const config = providedConfig || getConfig();
  const db = providedDb || createDatabase(config.dbPath);
  const app = express();
  app.use(express.json());

  const dbInitPromise = db.init();

  app.get('/', (_req, res) => {
    res.status(200).json({ name: "KB'S AI Assistance", status: 'ok' });
  });

  app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const safeChallenge = typeof challenge === 'string' && /^[A-Za-z0-9_-]{1,200}$/.test(challenge)
      ? challenge
      : null;

    if (mode === 'subscribe' && token === config.verifyToken && safeChallenge) {
      return res.type('text/plain').status(200).send(safeChallenge);
    }

    return res.sendStatus(403);
  });

  app.post('/webhook', (req, res) => {
    res.sendStatus(200);

    Promise.resolve()
      .then(() => dbInitPromise)
      .then(async () => {
        const messages = extractIncomingMessages(req.body);

        for (const message of messages) {
          if (message.type !== 'text') {
            continue;
          }

          const from = message.from;
          if (!from) {
            continue;
          }

          const text = message?.text?.body || '';
          const isFirstMessage = !(await db.hasBeenGreeted(from));
          if (isFirstMessage) {
            await db.markGreeted(from);
          }

          const reply = await buildReply({ text, isFirstMessage });
          await sendMessage({ to: from, text: reply, config });
        }
      })
      .catch((error) => {
        console.error('Webhook processing error:', error.message);
      });
  });

  return app;
}
