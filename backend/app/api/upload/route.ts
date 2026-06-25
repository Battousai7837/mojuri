import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';
import { uploadPublicImage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const data = await request.formData();
    const file = data.get('file');
    const folder = String(data.get('folder') || 'uploads');
    if (!(file instanceof File)) return NextResponse.json({ message: 'Vui lòng chọn ảnh' }, { status: 400 });
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: 'Ảnh không hợp lệ hoặc vượt quá 5MB' }, { status: 400 });
    }
    const url = await uploadPublicImage(file, folder);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
