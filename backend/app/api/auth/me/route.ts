import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { apiError } from '@/lib/http';
import {
  getPublicUser,
  getSupabaseUser,
  publicUserToAuthUser,
  SupabaseApiError,
  toAuthUser,
} from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const payload = authenticate(request);
    const profile = await getPublicUser(payload.sub);
    if (profile) return NextResponse.json(publicUserToAuthUser(profile));

    const user = await getSupabaseUser(payload.sub);
    return NextResponse.json(toAuthUser(user));
  } catch (error) {
    if (error instanceof SupabaseApiError && error.status === 404) {
      return NextResponse.json({ message: 'Tài khoản không tồn tại' }, { status: 404 });
    }
    return apiError(error);
  }
}
