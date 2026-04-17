const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const validateEnv = require('./utils/env');
const prisma = require('./utils/prisma');

// Validate ENV on startup
validateEnv();

// New clean architecture routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const servicesRoutes = require('./routes/services');
const ordersRoutes = require('./routes/orders');
const reviewsRoutes = require('./routes/reviews');
const messagesRoutes = require('./routes/messages');
const projectsRoutes = require('./routes/projects');
const proposalsRoutes = require('./routes/proposals');
const notificationsRoutes = require('./routes/notifications');

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
app.use(express.json());

// 📉 Global Rate Limiting (Relaxed for tests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много запросов, пожалуйста, попробуйте позже.' }
});
app.use('/', limiter);

// API Mounting
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/services', servicesRoutes);
app.use('/orders', ordersRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/messages', messagesRoutes);
app.use('/projects', projectsRoutes);
app.use('/proposals', proposalsRoutes);
app.use('/notifications', notificationsRoutes);

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
  res.json({ name: 'Troudo API', status: 'live', version: '3.0.0' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  // 🛡️ Log the error to file and console
  logger.error(`${req.method} ${req.url} - Error: ${err.message}`, {
    stack: err.stack,
    body: req.body,
    user: req.user ? req.user.id : 'anonymous'
  });

  const knownBadRequest = [
    'На эту почту уже зарегистрирован аккаунт',
    'Недействительный или устаревший токен',
    'Срок действия ссылки истек',
    'Пользователь не найден',
    'EMAIL_NOT_VERIFIED',
    'INVALID_CREDENTIALS',
  ];
  const status = knownBadRequest.includes(err.message) ? 400 : 500;

  res.status(status).json({
    message: status === 500 ? 'Произошла внутренняя ошибка сервера' : err.message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

module.exports = app;
