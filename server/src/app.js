const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const kworkRoutes = require('./routes/kworkRoutes');
const dealRoutes = require('./routes/dealRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

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
app.use('/api/auth/login', authLimiter);

app.use(bodyParser.json());

// API Mounting
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/kworks', kworkRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);

// Root Health Check
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
