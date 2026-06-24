import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Blog } from '@/models/Blog';
import { blogSchema } from '../route';

function lookup(id: string) { return /^[a-f\d]{24}$/i.test(id) ? { _id: id } : { slug: id }; }
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await connectDb(); const item = await Blog.findOne(lookup((await params).id)); return item && item.status === 'published' ? NextResponse.json(item) : NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 }); } catch (error) { return apiError(error); }
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(request); await connectDb(); const input = blogSchema.partial().parse(await request.json()); const item = await Blog.findByIdAndUpdate((await params).id, { ...input, ...(input.status === 'published' ? { publishedAt: new Date() } : {}) }, { new: true, runValidators: true }); return item ? NextResponse.json(item) : NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 }); } catch (error) { return apiError(error); }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(request); await connectDb(); await Blog.findByIdAndDelete((await params).id); return NextResponse.json({ message: 'Đã xóa bài viết' }); } catch (error) { return apiError(error); }
}
