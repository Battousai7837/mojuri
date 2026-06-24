import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { createPublicContact, listPublicContacts, publicContactJson } from '@/lib/supabase';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
});

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const contacts = await listPublicContacts();
    return NextResponse.json({ items: contacts.map(publicContactJson) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const item = await createPublicContact(input);
    return NextResponse.json({
      message: 'Cảm ơn bạn! Mojuri đã nhận được tin nhắn.',
      item: publicContactJson(item),
    }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
