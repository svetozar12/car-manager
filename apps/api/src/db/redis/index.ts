import Redis from 'ioredis';
import { logger } from '../../utils/logger';
import { Envs } from '../../utils/env';

export const redis = new Redis({
  host: Envs.REDIS_HOST,
  port: Envs.REDIS_PORT,
  username: Envs.REDIS_USERNAME,
  password: Envs.REDIS_PASSWORD,
});

export async function isRedisConnected() {
  try {
    await redis.hello();

    logger.info('connected to redis');
  } catch (error) {
    logger.error(error);
  }
}
