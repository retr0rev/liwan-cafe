import { Router } from 'express';
import { getSupabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

export const statsRouter = Router();

statsRouter.get('/', requireAuth, async (_req, res, next) => {
  try {
    const [catCount, itemCount, popularCount] = await Promise.all([
      getSupabase().from('categories').select('*', { count: 'exact', head: true }),
      getSupabase().from('menu_items').select('*', { count: 'exact', head: true }),
      getSupabase()
        .from('menu_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_popular', true),
    ]);
    res.json({
      categories: catCount.count ?? 0,
      items: itemCount.count ?? 0,
      popular: popularCount.count ?? 0,
    });
  } catch (e) {
    next(e);
  }
});

statsRouter.get('/recent', requireAuth, async (_req, res, next) => {
  try {
    const { data: items } = await getSupabase()
      .from('menu_items')
      .select('id, name_en, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);
    const { data: cats } = await getSupabase()
      .from('categories')
      .select('id, name_en, updated_at')
      .order('updated_at', { ascending: false })
      .limit(5);
    res.json({ items: items || [], categories: cats || [] });
  } catch (e) {
    next(e);
  }
});
