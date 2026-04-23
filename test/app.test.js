import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { buildReply } from '../src/replyService.js';

function createFakeDb() {
  const greeted = new Set();

  return {
    async init() {},
    async hasBeenGreeted(waId) {
      return greeted.has(waId);
    },
    async markGreeted(waId) {
      greeted.add(waId);
    }
  };
}

async function requestJson({ app, path, method = 'GET', body }) {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    return { response, text };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

test('GET /webhook verifies with matching token', async () => {
  const app = createApp({
    config: { verifyToken: 'verify-me', whatsappToken: 'x', phoneNumberId: 'y', graphApiVersion: 'v20.0', dbPath: ':memory:' },
    db: createFakeDb(),
    sendMessage: async () => {}
  });

  const { response, text } = await requestJson({
    app,
    path: '/webhook?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=12345'
  });

  assert.equal(response.status, 200);
  assert.equal(text, '12345');
});

test('POST /webhook greets only once per user and responds to command after first message', async () => {
  const sentMessages = [];
  const app = createApp({
    config: { verifyToken: 'verify-me', whatsappToken: 'x', phoneNumberId: 'y', graphApiVersion: 'v20.0', dbPath: ':memory:' },
    db: createFakeDb(),
    sendMessage: async ({ to, text }) => {
      sentMessages.push({ to, text });
    }
  });

  const payload = (text) => ({
    entry: [
      {
        changes: [
          {
            value: {
              messages: [
                {
                  from: '15550001111',
                  type: 'text',
                  text: { body: text }
                }
              ]
            }
          }
        ]
      }
    ]
  });

  const first = await requestJson({ app, path: '/webhook', method: 'POST', body: payload('hello') });
  assert.equal(first.response.status, 200);

  await new Promise((resolve) => setTimeout(resolve, 10));

  const second = await requestJson({ app, path: '/webhook', method: 'POST', body: payload('hours') });
  assert.equal(second.response.status, 200);

  await new Promise((resolve) => setTimeout(resolve, 10));

  assert.equal(sentMessages.length, 2);
  assert.equal(sentMessages[0].text, "Hello, I'm KB'S AI Assistance — thanks for reaching out. How can I help today?");
  assert.equal(sentMessages[1].text, 'Support hours: Monday to Friday, 9:00 AM to 5:00 PM.');
});

test('reply service returns menu/help/hours and echo fallback', async () => {
  assert.equal(await buildReply({ text: 'menu', isFirstMessage: false }), 'Menu:\n- help\n- hours\n- echo <message>');
  assert.equal(await buildReply({ text: 'help', isFirstMessage: false }), 'Help: send menu to see options or type your message and I will echo it.');
  assert.equal(await buildReply({ text: 'hours', isFirstMessage: false }), 'Support hours: Monday to Friday, 9:00 AM to 5:00 PM.');
  assert.equal(await buildReply({ text: 'Anything else', isFirstMessage: false }), 'Echo: Anything else');
  assert.equal(await buildReply({ text: '   ', isFirstMessage: false }), 'Echo: (empty message)');
});
