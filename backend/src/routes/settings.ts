import { Router } from 'express';
import { getSupabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

export const settingsRouter = Router();

settingsRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('settings')
      .select('key, value');
    if (error) throw error;
    const obj: Record<string, string> = {};
    (data || []).forEach((row) => {
      obj[row.key] = row.value || '';
    });
    res.json(obj);
  } catch (e) {
    next(e);
  }
});

settingsRouter.put('/', requireAuth, async (req, res, next) => {
  try {
    const updates = req.body || {};
    for (const [key, value] of Object.entries(updates)) {
      await getSupabase()
        .from('settings')
        .upsert({ key, value: String(value) }, { onConflict: 'key' });
    }
    const { data, error } = await getSupabase()
      .from('settings')
      .select('key, value');
    if (error) throw error;
    const obj: Record<string, string> = {};
    (data || []).forEach((row) => {
      obj[row.key] = row.value || '';
    });
    res.json(obj);
  } catch (e) {
    next(e);
  }
});
