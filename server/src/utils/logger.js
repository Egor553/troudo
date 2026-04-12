const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const errorLogPath = path.join(logsDir, 'error.log');
const combinedLogPath = path.join(logsDir, 'combined.log');

const logToFile = (filePath, level, message, details = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = JSON.stringify({
        timestamp,
        level,
        message,
        details,
    }) + '\n';

    fs.appendFile(filePath, logEntry, (err) => {
        if (err) console.error('CRITICAL: Failed to write to log file:', err);
    });
};

const logger = {
    info: (message, details = null) => {
        console.log(`[INFO] ${message}`);
        logToFile(combinedLogPath, 'info', message, details);
    },
    error: (message, details = null) => {
        console.error(`[ERROR] ${message}`);
        if (details) console.error(details);
        
        logToFile(errorLogPath, 'error', message, details);
        logToFile(combinedLogPath, 'error', message, details);
    },
    warn: (message, details = null) => {
        console.warn(`[WARN] ${message}`);
        logToFile(combinedLogPath, 'warn', message, details);
    }
};

module.exports = logger;
