require('dotenv').config();
const app = require('./src/app');

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`KB'S AI Assistance is running on http://localhost:${port}`);
});
