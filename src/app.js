const express = require('express');
const path = require('path');
const { resolveReply } = require('./chat/reply');
const { generateAIReply } = require('./ai/provider');
const { logConversation } = require('./db');

const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.post('/api/chat', async (req, res) => {
  const message = req.body?.message;

  if (typeof message !== 'string') {
    return res.status(400).json({ reply: 'Invalid message. Please send text.' });
  }

  let reply = await generateAIReply(message);
  if (!reply) {
    reply = resolveReply(message);
  }

  const sessionId = req.get('x-session-id') || 'anonymous-session';

  try {
    await logConversation({ sessionId, userMessage: message, botReply: reply });
  } catch (error) {
    console.error('Failed to save conversation log:', error);
  }

  return res.json({ reply });
});

module.exports = app;
