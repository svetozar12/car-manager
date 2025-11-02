import rateLimit from 'express-rate-limit';
import { Envs } from '../utils/env';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Envs.NODE_ENV === 'prod' ? 100 : 99999, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
