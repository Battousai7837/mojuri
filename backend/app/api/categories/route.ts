import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { createPublicCategory, listPublicCategories, publicCategoryJson } from '@/lib/supabase';

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().default(''),
});

export async function GET() {
  try {
    const items = await listPublicCategories('categories');
    return NextResponse.json({ items: items.map(publicCategoryJson) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const item = await createPublicCategory('categories', schema.parse(await request.json()));
    return NextResponse.json(publicCategoryJson(item), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
