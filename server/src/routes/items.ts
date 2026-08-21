import { Router } from 'express';
import multer from 'multer';
import { getSupabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
export const itemsRouter = Router();

const BUCKET = process.env.SUPABASE_BUCKET || 'menu-images';

itemsRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (e) {
    next(e);
  }
});

itemsRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('menu_items')
      .insert(req.body)
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
});

itemsRouter.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { data, error } = await getSupabase()
      .from('menu_items')
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

itemsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await getSupabase()
      .from('menu_items')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

itemsRouter.post(
  '/:id/image',
  requireAuth,
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No image provided' });
        return;
      }
      const ext = req.file.originalname.split('.').pop() || 'jpg';
      const path = `items/${req.params.id}-${Date.now()}.${ext}`;
      const { error } = await getSupabase()
        .storage.from(BUCKET)
        .upload(path, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });
      if (error) throw error;

      const { data: urlData } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
      const image_url = urlData.publicUrl;

      const { data, error: dbError } = await getSupabase()
        .from('menu_items')
        .update({ image_url })
        .eq('id', req.params.id)
        .select()
        .single();
      if (dbError) throw dbError;
      res.json(data);
    } catch (e) {
      next(e);
    }
  }
);
