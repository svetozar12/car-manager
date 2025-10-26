require('dotenv').config();
import * as z from 'zod';

const EnvSchema = z.object({
  JWT_SECRET: z.string(),
  MONGO_URL: z.url(),
  NODE_env: z
    .enum(['development', 'production', 'testing'])
    .default('development'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
});

export const Envs = EnvSchema.parse(process.env);
