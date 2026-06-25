import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { createPublicBlog, listPublicBlogs, publicBlogJson } from '@/lib/supabase';

export const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(3),
  content: z.string().min(3),
  coverImage: z.string().min(1),
  category: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const admin = params.get('admin') === 'true';
    if (admin) requireAdmin(request);
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.min(30, Math.max(1, Number(params.get('limit')) || 9));
    const query = new URLSearchParams({ select: '*', order: 'published_at.desc.nullslast,created_at.desc' });
    query.set('limit', String(limit));
    query.set('offset', String((page - 1) * limit));
    if (!admin) query.set('status', 'eq.published');
    if (params.get('search')) query.set('title', `ilike.*${params.get('search')}*`);
    const allItems = await listPublicBlogs(admin ? '?select=id' : '?select=id&status=eq.published');
    const rows = await listPublicBlogs(`?${query.toString()}`);
    const items = rows.map(publicBlogJson);
    return NextResponse.json({ items, pagination: { page, limit, total: allItems.length, pages: Math.ceil(allItems.length / limit) } });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const input = blogSchema.parse(await request.json());
    const item = await createPublicBlog(input);
    return NextResponse.json(publicBlogJson(item), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
