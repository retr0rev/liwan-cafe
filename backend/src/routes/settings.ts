import { Router } from 'express';
import multer from 'multer';
import type { Request, Response } from 'express';
import { getSupabase } from '../db/client.js';
import { requireAuth } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});
const BUCKET = process.env.SUPABASE_BUCKET || 'menu-images';

export const settingsRouter = Router();

async function uploadSettingImage(
  req: Request,
  res: Response,
  key: string
): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No image provided' });
    return;
  }
  const ext = req.file.originalname.split('.').pop() || 'png';
  const path = `settings/${key}-${Date.now()}.${ext}`;
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
  if (error) throw error;

  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
  await getSupabase()
    .from('settings')
    .upsert({ key, value: data.publicUrl }, { onConflict: 'key' });
  res.json({ key, value: data.publicUrl });
}

settingsRouter.post('/logo', requireAuth, upload.single('image'), (req, res, next) =>
  uploadSettingImage(req, res, 'logo_url').catch(next)
);
settingsRouter.post(
  '/favicon',
  requireAuth,
  upload.single('image'),
  (req, res, next) => uploadSettingImage(req, res, 'favicon_url').catch(next)
);

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
