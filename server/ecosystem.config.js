module.exports = {
  apps: [
    {
      name: 'troudo-api',
      script: 'index.js',
      instances: 'max', // Use all available CPUs for scalability
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // Auto-restart on crash
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
