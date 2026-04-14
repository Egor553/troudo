const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    errorFormat: 'minimal',
});

// Graceful shutdown to prevent connection leaks
const gracefulDisconnect = async () => {
    await prisma.$disconnect();
    process.exit(0);
};
process.on('SIGINT', gracefulDisconnect);
process.on('SIGTERM', gracefulDisconnect);

module.exports = prisma;
