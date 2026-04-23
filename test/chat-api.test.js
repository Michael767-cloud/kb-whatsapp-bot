const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('POST /api/chat responds to hello', async () => {
  const response = await request(app)
    .post('/api/chat')
    .send({ message: 'hello there' })
    .expect(200);

  assert.match(response.body.reply, /welcome|hi there/i);
});

test('POST /api/chat responds to menu command', async () => {
  const response = await request(app)
    .post('/api/chat')
    .send({ message: 'menu' })
    .expect(200);

  assert.match(response.body.reply, /menu/i);
});

test('POST /api/chat validates message input', async () => {
  const response = await request(app)
    .post('/api/chat')
    .send({ message: 123 })
    .expect(400);

  assert.equal(response.body.reply, 'Invalid message. Please send text.');
});
