import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { apiError } from '@/lib/http';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request); const data = await request.formData(); const file = data.get('file');
    if (!(file instanceof File)) return NextResponse.json({ message: 'Vui lòng chọn ảnh' }, { status: 400 });
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return NextResponse.json({ message: 'Ảnh không hợp lệ hoặc vượt quá 5MB' }, { status: 400 });
    const extension = path.extname(file.name).replace(/[^.a-z0-9]/gi, '') || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
    const directory = path.join(process.cwd(), 'public', 'uploads'); await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `${request.nextUrl.origin}/uploads/${filename}` }, { status: 201 });
  } catch (error) { return apiError(error); }
}
