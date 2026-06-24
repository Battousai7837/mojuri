import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Product } from '@/models/Product';

const schema = z.object({ name: z.string().min(2), email: z.email(), rating: z.number().int().min(1).max(5), comment: z.string().min(5).max(1000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const item = await Product.findByIdAndUpdate((await params).id, { $push: { reviews: schema.parse(await request.json()) } }, { new: true });
    return item ? NextResponse.json(item, { status: 201 }) : NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
  } catch (error) { return apiError(error); }
}
