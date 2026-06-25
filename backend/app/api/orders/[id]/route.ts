import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { updatePublicOrderStatus } from '@/lib/supabase';

const schema = z.object({ status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']) });

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const { status } = schema.parse(await request.json());
    const order = await updatePublicOrderStatus((await params).id, status);
    return order ? NextResponse.json(order) : NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
