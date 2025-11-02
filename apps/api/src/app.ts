import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { router } from './routes';
import session from 'express-session';
import csrf from 'csurf';
import helmet from 'helmet';

const app = express();

// init envs
import './utils/env';
// db init
import './db/mongo';
import { logger } from './utils/logger';
import { Envs } from './utils/env';
import { connectMongo } from './db/mongo';
import { isRedisConnected, redis } from './db/redis';
import { RedisStore } from 'connect-redis';
import { limiter } from './middleware/rateLimitter.middleware';

export const ready = (async () => {
  await connectMongo();
  await isRedisConnected();
  // --- Session Store backed by ioredis ---
  const store = new RedisStore({
    client: redis, // connect-redis accepts ioredis
    prefix: 'sess:',
    disableTouch: false, // keep session alive on activity
    ttl: 60 * 60 * 8, // 8h session TTL in Redis
  });
  // Apply rate limiting to all requests
  app.use(limiter);

  app.use(helmet());
  // Enable CORS
  app.use(cors({ credentials: true }));

  app.use(
    session({
      name: 'sid',
      store,
      secret: Envs.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: true, // true in prod (HTTPS)
        sameSite: 'lax', // helps vs CSRF for top-level nav
        path: '/',
        maxAge: 1000 * 60 * 60 * 8, // 8h
      },
    }),
  );

  app.use(csrf());

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Root url

  app.use('/api', router);
  logger.info(`App is in ${Envs.NODE_ENV} mode`);
})();

export default app;
