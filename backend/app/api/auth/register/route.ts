import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signToken } from '@/lib/auth';
import { apiError } from '@/lib/http';
import {
  createSupabaseUser,
  deleteSupabaseUser,
  publicUserToAuthUser,
  SupabaseApiError,
  upsertPublicUser,
} from '@/lib/supabase';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase();
    const user = await createSupabaseUser(input.name, email, input.password);
    let profile;

    try {
      profile = await upsertPublicUser({
        id: user.id,
        name: input.name,
        email,
        password_hash: await bcrypt.hash(input.password, 12),
        role: 'user',
      });
    } catch (error) {
      await deleteSupabaseUser(user.id).catch(() => undefined);
      throw error;
    }

    const safeUser = publicUserToAuthUser(profile);
    return NextResponse.json({
      token: signToken({ sub: safeUser.id, email: safeUser.email, role: safeUser.role }),
      user: safeUser,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseApiError && /already|registered|exists/i.test(error.message)) {
      return NextResponse.json({ message: 'Email đã được sử dụng' }, { status: 409 });
    }
    return apiError(error);
  }
}
