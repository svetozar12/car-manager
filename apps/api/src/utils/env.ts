import dotenv from 'dotenv';
import * as z from 'zod';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config({ path: '.env' });
}

export const BooleanStringZod = z
  .string()
  .refine((value) => value === 'true')
  .transform((value) => value === 'true');

const EnvSchema = z.object({
  PORT: z.number().default(5005),
  JWT_SECRET: z.string(),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
  CAR_QUERY_API_URL: z.url().default('http://www.carqueryapi.com/api/0.3/'),
  VERIFY_CODE_HMAC_SECRET: z.string().default('secret'),
  SESSION_SECRET: z.string().default('secret'),
  // Mail
  GMAIL_EMAIL: z.email(),
  GMAIL_PASSWORD: z.string(),
  DISABLE_MAIL: BooleanStringZod.default(false),
  // Mongo
  MONGO_URL: z.url(),
  // Redis
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.number().default(6379),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),
});

export const Envs = EnvSchema.parse(process.env);
