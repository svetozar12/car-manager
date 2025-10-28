import dotenv from 'dotenv';
import * as z from 'zod';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env' });
}

const EnvSchema = z.object({
  PORT: z.number().default(5005),
  JWT_SECRET: z.string(),
  MONGO_URL: z.url(),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
});

export const Envs = EnvSchema.parse(process.env);
