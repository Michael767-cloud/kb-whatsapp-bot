function resolveReply(rawMessage) {
  const message = (rawMessage || '').trim();

  if (!message) {
    return 'Please type a message so I can help you.';
  }

  const normalized = message.toLowerCase();

  if (/\b(hi|hello)\b/.test(normalized)) {
    return 'Hi there! Welcome to KB\'S AI Assistance. How can I support you today?';
  }

  if (normalized.includes('menu')) {
    return 'Menu: ask for help, check hours, or tell me what you need assistance with.';
  }

  if (normalized.includes('help')) {
    return 'I can help with quick questions, basic guidance, and general support. Tell me what you need.';
  }

  if (normalized.includes('hours')) {
    return 'Support hours are Monday to Friday, 9:00 AM to 6:00 PM.';
  }

  return "Thanks for your message. I'm here to help—could you share a bit more detail?";
}

module.exports = { resolveReply };
