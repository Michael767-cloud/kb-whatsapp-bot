export async function sendWhatsAppText({ to, text, config, fetchImpl = fetch }) {
  if (!config.whatsappToken || !config.phoneNumberId) {
    throw new Error('WHATSAPP_TOKEN and PHONE_NUMBER_ID are required to send messages');
  }

  const response = await fetchImpl(
    `https://graph.facebook.com/${config.graphApiVersion}/${config.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.whatsappToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        text: { body: text }
      })
    }
  );

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`WhatsApp send failed: ${response.status} ${responseText}`);
  }
}
