import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Category } from '@/models/Category';

const schema = z.object({ name: z.string().min(2).optional(), slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(), description: z.string().optional() });
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(request); await connectDb(); const item = await Category.findByIdAndUpdate((await params).id, schema.parse(await request.json()), { new: true, runValidators: true }); return item ? NextResponse.json(item) : NextResponse.json({ message: 'Không tìm thấy danh mục' }, { status: 404 }); } catch (error) { return apiError(error); }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(request); await connectDb(); await Category.findByIdAndDelete((await params).id); return NextResponse.json({ message: 'Đã xóa danh mục' }); } catch (error) { return apiError(error); }
}
