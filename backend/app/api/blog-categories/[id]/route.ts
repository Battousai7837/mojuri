import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { deletePublicCategory } from '@/lib/supabase';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const item = await deletePublicCategory('blog_categories', (await params).id);
    return item ? NextResponse.json({ message: 'Đã xóa danh mục blog' }) : NextResponse.json({ message: 'Không tìm thấy danh mục blog' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
