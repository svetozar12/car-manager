import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { logger } from './utils/logger';
import { router } from './routes';

const app = express();

// init envs
import './utils/env';
// db init
import './db/mongo';

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all requests
app.use(limiter);

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Root url

app.use('/', router);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  logger.info(`Server is running on port http://localhost:${PORT}`);
});
