import 'dotenv/config';
import * as z from 'zod';

const EnvSchema = z.object({
  PORT: z.number().default(5005),
  JWT_SECRET: z.string(),
  MONGO_URL: z.url(),
  NODE_env: z.enum(['dev', 'prod', 'test']).default('dev'),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),
});

export const Envs = EnvSchema.parse(process.env);
