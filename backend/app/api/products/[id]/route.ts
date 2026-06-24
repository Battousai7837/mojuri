import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Product } from '@/models/Product';

const updateSchema = z.object({ name: z.string().min(2).optional(), slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(), description: z.string().optional(), thumbnail: z.string().min(1).optional(), gallery: z.array(z.string()).optional(), price: z.number().nonnegative().optional(), salePrice: z.number().nonnegative().nullable().optional(), stock: z.number().int().nonnegative().optional(), category: z.string().min(2).optional(), featured: z.boolean().optional() });

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await connectDb(); const id = (await params).id; const item = await Product.findOne(/^[a-f\d]{24}$/i.test(id) ? { _id: id } : { slug: id }); return item ? NextResponse.json(item) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 }); } catch (error) { return apiError(error); }
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(request); await connectDb(); const item = await Product.findByIdAndUpdate((await params).id, updateSchema.parse(await request.json()), { new: true, runValidators: true }); return item ? NextResponse.json(item) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 }); } catch (error) { return apiError(error); }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { requireAdmin(request); await connectDb(); const item = await Product.findByIdAndDelete((await params).id); return item ? NextResponse.json({ message: 'Đã xóa sản phẩm' }) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 }); } catch (error) { return apiError(error); }
}
