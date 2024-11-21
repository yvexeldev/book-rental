import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  PORT: Joi.number().min(0).max(65535).default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required().default('jwtS3cr3t$$'),
  HOST: Joi.string().default('localhost'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  I18N_FALLBACK_LANGUAGE: Joi.string().default('en'),
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_HOST: Joi.string().default('smtp.gmail.com'),
  SMTP_SECURE: Joi.boolean().default(false),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_HOST: Joi.string().default('localhost'),
});
