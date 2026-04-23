import { getAiReply } from './stubAiProvider.js';

const GREETING = "Hello, I'm KB'S AI Assistance — thanks for reaching out. How can I help today?";

export async function buildReply({ text, isFirstMessage }) {
  if (isFirstMessage) {
    return GREETING;
  }

  const normalized = (text || '').trim().toLowerCase();

  if (normalized === 'menu') {
    return 'Menu:\n- help\n- hours\n- echo <message>';
  }

  if (normalized === 'help') {
    return 'Help: send menu to see options or type your message and I will echo it.';
  }

  if (normalized === 'hours') {
    return 'Support hours: Monday to Friday, 9:00 AM to 5:00 PM.';
  }

  const aiReply = await getAiReply({ text });
  if (aiReply) {
    return aiReply;
  }

  if (!text || !text.trim()) {
    return 'Echo: (empty message)';
  }

  return `Echo: ${text}`;
}
