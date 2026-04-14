const Joi = require('joi');
const logger = require('./logger');

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    FRONTEND_URL: Joi.string().uri().required(),

    // Email
    EMAIL_USER: Joi.string().email().required(),
    EMAIL_PASS: Joi.string().required(),
    SMTP_HOST: Joi.string().default('smtp.mail.ru'),
    SMTP_PORT: Joi.number().default(465),

    // YooKassa
    YOOKASSA_SHOP_ID: Joi.string().required(),
    YOOKASSA_SECRET_KEY: Joi.string().required(),
    YOOKASSA_WEBHOOK_SECRET: Joi.string().required(),

    // Redis
    REDIS_URL: Joi.string().required(),

    // S3 / MinIO (Optional for local, required for prod if using MinIO)
    S3_ENDPOINT: Joi.string().uri().required(),
    S3_ACCESS_KEY: Joi.string().required(),
    S3_SECRET_KEY: Joi.string().required(),
    S3_BUCKET: Joi.string().default('troudo-files'),
}).unknown(true);

const validateEnv = () => {
    const { error, value } = envSchema.validate(process.env);

    if (error) {
        logger.error('❌ Invalid environment variables:', error.details.map(d => d.message).join(', '));
        // Fail-fast in production
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }

    return value;
};

module.exports = validateEnv;
