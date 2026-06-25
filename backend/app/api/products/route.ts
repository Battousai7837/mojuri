import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { createPublicProductWithUniqueSlug, listPublicProducts, publicProductJson } from '@/lib/supabase';

const productSchema = z.object({
  name: z.string().min(2), slug: z.string().min(2).regex(/^[a-z0-9-]+$/), description: z.string().default(''),
  thumbnail: z.string().min(1), gallery: z.array(z.string()).default([]), price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().nullable().optional(), stock: z.number().int().nonnegative(),
  category: z.string().optional(), featured: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.get('limit')) || 12));
    const query = new URLSearchParams({ select: '*', order: 'created_at.desc' });
    query.set('limit', String(limit));
    query.set('offset', String((page - 1) * limit));
    if (params.get('featured')) query.set('is_featured', `eq.${params.get('featured') === 'true'}`);
    if (params.get('search')) query.set('name', `ilike.*${params.get('search')}*`);
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    if (minPrice) query.set('price', `gte.${minPrice}`);
    if (maxPrice) query.append('price', `lte.${maxPrice}`);
    const allItems = await listPublicProducts('?select=id');
    const rows = await listPublicProducts(`?${query.toString()}`);
    const items = rows.map(publicProductJson);
    return NextResponse.json({ items, pagination: { page, limit, total: allItems.length, pages: Math.ceil(allItems.length / limit) } });
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const input = productSchema.parse(await request.json());
    const product = await createPublicProductWithUniqueSlug(input);
    return NextResponse.json(publicProductJson(product), { status: 201 });
  } catch (error) { return apiError(error); }
}
