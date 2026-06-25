import { NextResponse } from 'next/server';
import { apiError } from '@/lib/http';
import { listPublicCustomers } from '@/lib/supabase';

export async function GET() {
  try {
    return NextResponse.json({ items: await listPublicCustomers() });
  } catch (error) {
    return apiError(error);
  }
}
