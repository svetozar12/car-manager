import express from 'express';
// import cors from 'cors';
import { router } from './routes';
import session from 'express-session';
import { doubleCsrf } from 'csrf-csrf';
// import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();
app.use(express.json());
app.use(helmet());
// init envs
import './utils/env';
// db init
import './db/mongo';
import { Envs } from './utils/env';
import { connectMongo } from './db/mongo';
import { isRedisConnected, redis } from './db/redis';
import { RedisStore } from 'connect-redis';
import { limiter } from './middleware/rateLimitter.middleware';
import cors from 'cors';
import { buildOpenAPIDocument } from './utils/openAPI/spec';

export async function bootstrap() {
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

  // Enable CORS
  app.use(cors({ credentials: true }));
  app.use(
    session({
      name: 'sid',
      // store,
      secret: Envs.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // true in prod (HTTPS)
        sameSite: 'lax', // helps vs CSRF for top-level nav
        path: '/',
        maxAge: 1000 * 60 * 60 * 8, // 8h
      },
    }),
  );

  app.use(cookieParser());

  const { invalidCsrfTokenError, generateCsrfToken, doubleCsrfProtection } =
    doubleCsrf({
      getSecret: () => Envs.CSRF_SECRET,
      getSessionIdentifier: (req) => req.sessionID,
      skipCsrfProtection: () => Envs.DISABLE_CSRF,
      cookieName: 'xsrf_token',
      cookieOptions: { sameSite: 'strict', secure: Envs.NODE_ENV === 'prod' },
      getCsrfTokenFromRequest: (req) =>
        (req.headers['x-csrf-token'] as string) ||
        (req.body?.csrfToken as string),
    });

  // 4) unprotected endpoint to mint token (and set cookie)
  app.get('/api/csrf', (req, res) => {
    // force a session write so the sid cookie persists when saveUninitialized:false
    // @ts-ignore
    req.session.csrfReady = true;
    req.session.save(() => {
      const token = generateCsrfToken(req, res);
      res.json({ token });
    });
  });

  // Error handling, validation error interception
  const csrfErrorHandler = (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err === invalidCsrfTokenError) {
      res.status(403).json({
        error: 'csrf validation error',
      });
    } else {
      next();
    }
  };
  buildOpenAPIDocument();
  app.use(doubleCsrfProtection);
  app.use('/api', router);
  // Serve your custom Swagger (next section) from /docs
  app.use('/docs', express.static('public'));
  app.get('/openapi.json', (_req, res) => res.json(buildOpenAPIDocument()));
  app.use(csrfErrorHandler);
}

export default app;
