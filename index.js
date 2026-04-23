import { createApp } from './src/app.js';

const app = createApp();
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`KB'S AI Assistance webhook listening on port ${port}`);
});
