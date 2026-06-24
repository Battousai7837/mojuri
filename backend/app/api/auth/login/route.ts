import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signToken } from '@/lib/auth';
import { apiError } from '@/lib/http';
import {
  authenticateSupabaseUser,
  getPublicUser,
  publicUserToAuthUser,
  SupabaseApiError,
  toAuthUser,
  upsertPublicUser,
} from '@/lib/supabase';

const schema = z.object({ email: z.email(), password: z.string().min(6) });

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const user = await authenticateSupabaseUser(input.email.toLowerCase(), input.password);
    const authUser = toAuthUser(user);
    const profile = await getPublicUser(user.id) ?? await upsertPublicUser({
      id: user.id,
      name: authUser.name,
      email: authUser.email,
      password_hash: await bcrypt.hash(input.password, 12),
      role: authUser.role,
    });
    const safeUser = publicUserToAuthUser(profile);
    const token = signToken({ sub: safeUser.id, email: safeUser.email, role: safeUser.role });
    return NextResponse.json({ token, user: safeUser });
  } catch (error) {
    if (error instanceof SupabaseApiError && error.status >= 400 && error.status < 500) {
      return NextResponse.json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
    }
    return apiError(error);
  }
}
