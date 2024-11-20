import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  PORT: Joi.number().min(0).max(65535).default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required().default('jwtS3cr3t$$'),
  HOST: Joi.string().default('localhost'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  I18N_FALLBACK_LANGUAGE: Joi.string().default('en'),
});
