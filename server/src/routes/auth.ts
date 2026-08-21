import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getSupabase } from '../db/client.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }
  if (username.length > 64 || password.length > 128) {
    res.status(400).json({ error: 'Invalid credentials' });
    return;
  }

  try {
    const { data, error } = await getSupabase()
      .from('admin')
      .select('id, username, password_hash')
      .eq('username', username)
      .single();

    if (error || !data) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, data.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.json({
      token: signToken(data.id),
      user: { id: data.id, username: data.username },
    });
  } catch (e) {
    next(e);
  }
});

authRouter.put('/password', requireAuth, async (req, res, next) => {
  const { currentPassword, newPassword } = req.body || {};
  if (
    typeof currentPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    !currentPassword ||
    !newPassword
  ) {
    res.status(400).json({ error: 'All fields required' });
    return;
  }
  if (newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters' });
    return;
  }
  if (newPassword.length > 128) {
    res.status(400).json({ error: 'New password is too long' });
    return;
  }

  try {
    const { data: admin, error } = await getSupabase()
      .from('admin')
      .select('password_hash')
      .eq('id', (req as any).userId)
      .single();

    if (error || !admin) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await getSupabase()
      .from('admin')
      .update({ password_hash: hash })
      .eq('id', (req as any).userId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
