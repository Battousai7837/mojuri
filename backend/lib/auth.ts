import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export type TokenPayload = { sub: string; email: string; role: 'admin' | 'user' };

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET is not configured');
  return value;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, secret(), { expiresIn: '1d' });
}

export function requireAdmin(request: NextRequest) {
  const payload = authenticate(request);
  if (payload.role !== 'admin') throw new Error('FORBIDDEN');
  return payload;
}

export function authenticate(request: NextRequest) {
  const value = request.headers.get('authorization');
  if (!value?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED');
  const payload = jwt.verify(value.slice(7), secret()) as TokenPayload;
  return payload;
}
