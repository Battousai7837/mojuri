import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { deletePublicProduct, getPublicProduct, publicProductJson, updatePublicProduct } from '@/lib/supabase';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  thumbnail: z.string().min(1).optional(),
  gallery: z.array(z.string()).optional(),
  price: z.number().nonnegative().optional(),
  salePrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const item = await getPublicProduct((await params).id);
    return item ? NextResponse.json(publicProductJson(item)) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const item = await updatePublicProduct((await params).id, updateSchema.parse(await request.json()));
    return item ? NextResponse.json(publicProductJson(item)) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const item = await deletePublicProduct((await params).id);
    return item ? NextResponse.json({ message: 'Đã xóa sản phẩm' }) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
