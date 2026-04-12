const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const kworkRoutes = require('./routes/kworkRoutes');
const dealRoutes = require('./routes/dealRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Mounting
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/kworks', kworkRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Root Health Check
app.get('/', (req, res) => {
  res.json({ name: 'Troudo API', status: 'live', version: '2.0.0 (Modular/SQL)' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Произошла внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

module.exports = app;
