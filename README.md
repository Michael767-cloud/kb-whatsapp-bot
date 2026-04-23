# KB'S AI Assistance

A lightweight web-based chatbot built with Node.js, Express, and SQLite.

## Features

- Web chat UI at `GET /`
- Chat API at `POST /api/chat`
- Built-in rule-based replies (`hi/hello`, `menu`, `help`, `hours`, fallback)
- SQLite conversation logging (no external DB server needed)
- AI provider stub for future integrations (`src/ai/provider.js`)

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Start server:
   ```bash
   npm start
   ```
4. Open:
   ```
   http://localhost:3000
   ```

## Environment variables

See `.env.example`:

- `PORT` (default `3000`)
- `GEMINI_API_KEY` (placeholder for future provider integration)

## Test

```bash
npm test
```

## Deployment notes

### Render

- Create a new **Web Service** from this repository.
- Build command: `npm install`
- Start command: `npm start`
- Add env vars from `.env.example`.

### Railway

- Create a new project from this repository.
- Ensure start command is `npm start`.
- Add env vars from `.env.example`.

Both platforms can run this app without a separate database server because SQLite is file-based.
