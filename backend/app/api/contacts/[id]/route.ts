import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { publicContactJson, updatePublicContact } from '@/lib/supabase';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const { status } = z.object({ status: z.enum(['read', 'unread']) }).parse(await request.json());
    const { id } = await params;
    const item = await updatePublicContact(id, status === 'read');
    return item
      ? NextResponse.json(publicContactJson(item))
      : NextResponse.json({ message: 'Không tìm thấy liên hệ' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
