import dotenv from 'dotenv';

dotenv.config();

export function getConfig() {
  return {
    verifyToken: process.env.VERIFY_TOKEN || '',
    whatsappToken: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.PHONE_NUMBER_ID || '',
    graphApiVersion: process.env.GRAPH_API_VERSION || 'v20.0',
    dbPath: process.env.SQLITE_DB_PATH || './data/kb-assistant.sqlite',
    port: Number(process.env.PORT || 3000)
  };
}
