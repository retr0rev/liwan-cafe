import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './routes/auth.js';
import { categoriesRouter } from './routes/categories.js';
import { itemsRouter } from './routes/items.js';
import { settingsRouter } from './routes/settings.js';
import { statsRouter } from './routes/stats.js';
import { errorHandler } from './middleware/error.js';

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS - restrict to explicit allowlist when configured
  app.use(
    cors({
      origin: allowedOrigins.length
        ? allowedOrigins
        : function (origin, cb) {
            // No allowlist configured: allow same-origin and no-origin (curl, serverless).
            // Cross-origin browser requests still blocked unless ALLOWED_ORIGINS is set.
            cb(null, !origin || new URL(origin).hostname === 'localhost');
          },
    })
  );

  // 10kb JSON body limit - menu payloads are small
  app.use(express.json({ limit: '10kb' }));

  // Trust Vercel's proxy chain for correct client IPs in rate limiting
  app.set('trust proxy', 1);

  // Global rate limit: 100 req / 15 min per IP
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests, please try again later.' },
    })
  );

  // Stricter rate limit on auth endpoints: 10 attempts / 15 min per IP
  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many login attempts, please try again later.' },
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/items', itemsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/stats', statsRouter);
  app.use(errorHandler);

  return app;
}
