import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { createPublicOrder, listPublicOrders } from '@/lib/supabase';

const schema = z.object({
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    email: z.email(),
    address: z.string().min(2),
    note: z.string().default(''),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
  })).min(1),
});

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const status = request.nextUrl.searchParams.get('status');
    return NextResponse.json({ items: await listPublicOrders(status) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const order = await createPublicOrder(schema.parse(await request.json()));
    return NextResponse.json({ message: 'Đặt hàng thành công', order }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
