import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { deletePublicBlog, getPublicBlog, publicBlogJson, updatePublicBlog } from '@/lib/supabase';
import { blogSchema } from '../route';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const item = await getPublicBlog((await params).id);
    return item && item.status === 'published'
      ? NextResponse.json(publicBlogJson(item))
      : NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const input = blogSchema.partial().parse(await request.json());
    const item = await updatePublicBlog((await params).id, input);
    return item ? NextResponse.json(publicBlogJson(item)) : NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request);
    const item = await deletePublicBlog((await params).id);
    return item ? NextResponse.json({ message: 'Đã xóa bài viết' }) : NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
