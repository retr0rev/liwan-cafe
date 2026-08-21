import { Router } from 'express';
import { getSupabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name_ar, name_en, display_order = 0, is_active = true } = req.body || {};
    if (!name_ar || !name_en) {
      res.status(400).json({ error: 'name_ar and name_en required' });
      return;
    }
    const { data, error } = await getSupabase()
      .from('categories')
      .insert({ name_ar, name_en, display_order, is_active })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('categories')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await getSupabase()
      .from('categories')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
