const Bull = require('bull');
const MailService = require('../services/MailService');
const logger = require('../utils/logger');

// Create the queue
const emailQueue = new Bull('email-delivery', process.env.REDIS_URL || 'redis://localhost:6379', {
    limiter: {
        max: 5, // Send at most 5 emails per second to avoid SMTP bans
        duration: 1000
    },
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 5000 // 5s, 10s, 20s...
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});

// Process the queue
emailQueue.process(async (job) => {
    const { type, to, token } = job.data;

    logger.info(`Processing email job ${job.id} for ${to} (${type})`);

    if (type === 'verification') {
        await MailService.sendVerificationEmail(to, token);
    }

    // Add other email types here (password reset, etc.)
});

// Event listeners for monitoring
emailQueue.on('completed', (job) => {
    logger.info(`Email job ${job.id} completed successfully`);
});

emailQueue.on('failed', (job, err) => {
    logger.error(`Email job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`);
});

/**
 * Helper to add emails to the queue
 */
const queueEmail = (type, to, token) => {
    return emailQueue.add({ type, to, token });
};

module.exports = { emailQueue, queueEmail };
