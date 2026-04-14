const Bull = require('bull');
const Redis = require('ioredis');

// Re-using the same redis connection for simple key storage
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Add a token to the blacklist with an expiry time.
 * Usually set the expiry to match the remaining life of the JWT.
 */
const blacklistToken = async (token, expirySeconds = 86400) => {
    await redis.set(`blacklist:${token}`, '1', 'EX', expirySeconds);
};

/**
 * Check if a token is in the blacklist
 */
const isTokenBlacklisted = async (token) => {
    const exists = await redis.get(`blacklist:${token}`);
    return !!exists;
};

module.exports = { blacklistToken, isTokenBlacklisted };
