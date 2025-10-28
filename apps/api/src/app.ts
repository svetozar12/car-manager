import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { router } from './routes';

const app = express();

// init envs
import './utils/env';
// db init
import './db/mongo';
import { logger } from './utils/logger';
import { Envs } from './utils/env';
import { connectMongo } from './db/mongo';
export const ready = (async () => {
  connectMongo();
  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  });

  // Apply rate limiting to all requests
  app.use(limiter);

  // Enable CORS
  app.use(cors());

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Root url

  app.use('/', router);
  logger.info(`App is in ${Envs.NODE_ENV} mode`);
})();

export default app;
