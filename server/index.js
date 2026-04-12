require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/utils/socket');

const server = http.createServer(app);
const io = initSocket(server);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Troudo API Pro is running on http://${HOST}:${PORT}`);
  console.log(`📡 WebSocket: Online`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
