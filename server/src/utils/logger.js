const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`;
    })
);

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'troudo-backend' },
    transports: [
        // 📁 Daily rotate error logs
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
        }),
        // 📁 Daily rotate combined logs
        new winston.transports.DailyRotateFile({
            filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
        }),
    ],
});

// 🖥️ Add console logging in non-test environments
if (process.env.NODE_ENV !== 'test') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
    }));
}

module.exports = logger;
