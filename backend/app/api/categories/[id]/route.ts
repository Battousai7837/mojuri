import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { deletePublicCategory, publicCategoryJson, updatePublicCategory } from '@/lib/supabase';

const schema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const item = await updatePublicCategory('categories', (await params).id, schema.parse(await request.json()));
    return item ? NextResponse.json(publicCategoryJson(item)) : NextResponse.json({ message: 'Không tìm thấy danh mục' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const item = await deletePublicCategory('categories', (await params).id);
    return item ? NextResponse.json({ message: 'Đã xóa danh mục' }) : NextResponse.json({ message: 'Không tìm thấy danh mục' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
