import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'dev-secret';

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: number } | null {
  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === 'string' || typeof payload.sub !== 'number') return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}
