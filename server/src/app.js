const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const validateEnv = require('./utils/env');
const prisma = require('./utils/prisma');

// Validate ENV on startup
validateEnv();

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const kworkRoutes = require('./routes/kworkRoutes');
const dealRoutes = require('./routes/dealRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.set('trust proxy', 1);

// 🛡️ SECURITY MIDDLEWARE
app.use(helmet());
app.disable('x-powered-by');

// 🌐 CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 📉 Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много запросов, пожалуйста, попробуйте позже.' }
});
app.use('/api/', limiter);

// 🔐 Strict Rate Limit for Auth
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Слишком много попыток входа, подождите минуту.' }
});

const resendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { message: 'Слишком много запросов на отправку письма, подождите минуту.' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { message: 'Слишком много попыток регистрации, подождите минуту.' }
}));
app.use('/api/auth/resend-verification', resendLimiter);

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.includes('/webhook')) {
      req.rawBody = buf;
    }
  }
}));

// API Mounting
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/kworks', kworkRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Root & Health Check
app.get('/health', async (req, res) => {
  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;
    // Check Redis (simple ping via Bull or direct if needed)
    // For now, if DB is up, we're likely okay, but Redis is critical for queues

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        server: 'online'
      }
    });
  } catch (err) {
    logger.error('Health check failed', err);
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ name: 'Troudo API', status: 'live', version: '2.0.0 (Modular/SQL)' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  // 🛡️ Log the error to file and console
  logger.error(`${req.method} ${req.url} - Error: ${err.message}`, {
    stack: err.stack,
    body: req.body,
    user: req.user ? req.user.id : 'anonymous'
  });

  res.status(500).json({
    message: 'Произошла внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
