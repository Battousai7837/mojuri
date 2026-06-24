import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Blog } from '@/models/Blog';

export const blogSchema = z.object({ title: z.string().min(3), slug: z.string().min(3).regex(/^[a-z0-9-]+$/), excerpt: z.string().min(10), content: z.string().min(20), coverImage: z.string().min(1), category: z.string().min(2), status: z.enum(['draft', 'published']) });

export async function GET(request: NextRequest) {
  try {
    await connectDb(); const params = request.nextUrl.searchParams; const admin = params.get('admin') === 'true';
    if (admin) requireAdmin(request);
    const page = Math.max(1, Number(params.get('page')) || 1); const limit = Math.min(30, Math.max(1, Number(params.get('limit')) || 9));
    const query: Record<string, unknown> = admin ? {} : { status: 'published' };
    if (params.get('category')) query.category = params.get('category');
    if (params.get('search')) query.title = { $regex: params.get('search'), $options: 'i' };
    const [items, total] = await Promise.all([Blog.find(query).sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit), Blog.countDocuments(query)]);
    return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: NextRequest) {
  try { requireAdmin(request); await connectDb(); const input = blogSchema.parse(await request.json()); return NextResponse.json(await Blog.create({ ...input, publishedAt: input.status === 'published' ? new Date() : undefined }), { status: 201 }); } catch (error) { return apiError(error); }
}
