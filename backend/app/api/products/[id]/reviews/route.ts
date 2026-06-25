import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError } from '@/lib/http';
import { getPublicProduct, publicProductJson } from '@/lib/supabase';

const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2).max(1000),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    schema.parse(await request.json());
    const item = await getPublicProduct((await params).id);
    return item ? NextResponse.json(publicProductJson(item), { status: 201 }) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
