import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Product } from '@/models/Product';

const productSchema = z.object({
  name: z.string().min(2), slug: z.string().min(2).regex(/^[a-z0-9-]+$/), description: z.string().default(''),
  thumbnail: z.string().min(1), gallery: z.array(z.string()).default([]), price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().optional(), stock: z.number().int().nonnegative(),
  category: z.string().min(2), featured: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.get('limit')) || 12));
    const query: Record<string, unknown> = {};
    if (params.get('category')) query.category = params.get('category');
    if (params.get('featured')) query.featured = params.get('featured') === 'true';
    if (params.get('search')) query.name = { $regex: params.get('search'), $options: 'i' };
    const minPrice = Number(params.get('minPrice'));
    const maxPrice = Number(params.get('maxPrice'));
    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) query.price = {
      ...(Number.isFinite(minPrice) ? { $gte: minPrice } : {}),
      ...(Number.isFinite(maxPrice) ? { $lte: maxPrice } : {}),
    };
    const [items, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Product.countDocuments(query),
    ]);
    return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request); await connectDb();
    const product = await Product.create(productSchema.parse(await request.json()));
    return NextResponse.json(product, { status: 201 });
  } catch (error) { return apiError(error); }
}
