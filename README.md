# KB'S AI Assistance (Meta WhatsApp Cloud API)

A minimal Node.js + Express webhook bot for Meta WhatsApp Cloud API with SQLite-backed greet-once behavior.

## Features
- `GET /webhook` verification using `VERIFY_TOKEN`
- `POST /webhook` inbound message handling with immediate `200` acknowledgement
- First message greeting per WhatsApp user (`wa_id/from`) persisted in SQLite
- Basic replies: `menu`, `help`, `hours`, and echo fallback
- AI provider abstraction stub (`src/stubAiProvider.js`) for future integration
- Placeholder SQLite tables for reminders and contacts

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Set values in `.env`:
   - `VERIFY_TOKEN`
   - `WHATSAPP_TOKEN`
   - `PHONE_NUMBER_ID`
4. Start server:
   ```bash
   npm start
   ```

Server starts on `http://localhost:3000` by default.

## Webhook endpoints
- Verification: `GET /webhook`
- Inbound messages: `POST /webhook`

## Commands
- `menu`
- `help`
- `hours`
- Any other text: echoed back

## WhatsApp policy note
WhatsApp Cloud API customer service conversations generally allow free-form replies within a 24-hour window after the user messages your business. Outside that window, you typically need an approved message template.
