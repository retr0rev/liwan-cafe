import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { categoriesRouter } from './routes/categories.js';
import { itemsRouter } from './routes/items.js';
import { settingsRouter } from './routes/settings.js';
import { statsRouter } from './routes/stats.js';
import { errorHandler } from './middleware/error.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

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
