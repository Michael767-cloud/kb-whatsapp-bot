const chatWindow = document.getElementById('chat');
const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message');

const INITIAL_BOT_MESSAGE = "Hello, I'm KB'S AI Assistance — thanks for reaching out. How can I help today?";
const sessionStorageKey = 'kb-ai-greeted';
const sessionIdStorageKey = 'kb-ai-session-id';

function getSessionId() {
  const existing = sessionStorage.getItem(sessionIdStorageKey);
  if (existing) {
    return existing;
  }
  const created = createSessionId();
  if (created) {
    sessionStorage.setItem(sessionIdStorageKey, created);
  }
  return created;
}

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  if (!window.crypto?.getRandomValues) {
    return null;
  }
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

if (!sessionStorage.getItem(sessionStorageKey)) {
  appendMessage('bot', INITIAL_BOT_MESSAGE);
  sessionStorage.setItem(sessionStorageKey, 'true');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();
  if (!message) {
    return;
  }

  appendMessage('user', message);
  messageInput.value = '';

  try {
    const sessionId = getSessionId();
    const headers = {
      'Content-Type': 'application/json'
    };
    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    appendMessage('bot', data.reply || 'Sorry, something went wrong.');
  } catch (error) {
    appendMessage('bot', 'Sorry, I could not reach the server. Please try again.');
  }
});
