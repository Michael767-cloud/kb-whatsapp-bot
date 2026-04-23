const chatWindow = document.getElementById('chat');
const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message');

const greeting = "Hello, I\'m KB\'S AI Assistance — thanks for reaching out. How can I help today?";
const sessionStorageKey = 'kb-ai-greeted';
const sessionIdStorageKey = 'kb-ai-session-id';

function getSessionId() {
  const existing = sessionStorage.getItem(sessionIdStorageKey);
  if (existing) {
    return existing;
  }
  const created = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  sessionStorage.setItem(sessionIdStorageKey, created);
  return created;
}

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

if (!sessionStorage.getItem(sessionStorageKey)) {
  appendMessage('bot', greeting);
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
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId()
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    appendMessage('bot', data.reply || 'Sorry, something went wrong.');
  } catch (error) {
    appendMessage('bot', 'Sorry, I could not reach the server. Please try again.');
  }
});
