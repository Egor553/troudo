require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/utils/socket');
const logger = require('./src/utils/logger');
const prisma = require('./src/utils/prisma');

// ─── Global crash guards ─────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.error('💥 uncaughtException — shutting down', { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('💥 unhandledRejection — shutting down', { reason: String(reason) });
  process.exit(1);
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  logger.info(`🚀 Troudo API is running on port ${PORT}`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed');
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
