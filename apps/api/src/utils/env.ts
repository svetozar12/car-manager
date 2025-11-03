import dotenv from 'dotenv';
import * as z from 'zod';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config({ path: '.env' });
}

/** Prefer z.coerce.number() for env numbers. */
const IntFromString = z.coerce.number().int();

const BooleanFromString = z.preprocess((v) => {
  if (typeof v === 'boolean') return v;
  if (v == null) return v;
  const s = String(v).trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'n', 'off'].includes(s)) return false;
  return v; // let zod show a validation error
}, z.boolean());

const EnvSchema = z.object({
  PORT: IntFromString.default(5005),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  CAR_QUERY_API_URL: z.url().default('http://www.carqueryapi.com/api/0.3/'),
  VERIFY_CODE_HMAC_SECRET: z.string().default('secret'),
  CSRF_SECRET: z.string().default('secret'),
  SESSION_SECRET: z.string().default('secret'),
  // Mail
  GMAIL_EMAIL: z.email(),
  GMAIL_PASSWORD: z.string(),
  DISABLE_MAIL: BooleanFromString.default(false),
  // Mongo
  MONGO_URL: z.url(),
  // Redis
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: IntFromString.default(6379),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
  DISABLE_CSRF: BooleanFromString.default(false),
});

export const Envs = EnvSchema.parse(process.env);
