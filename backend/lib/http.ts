import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function apiError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ message: 'Dữ liệu không hợp lệ', errors: error.flatten() }, { status: 400 });
  if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'Bạn chưa đăng nhập' }, { status: 401 });
  if (error instanceof Error && error.message === 'FORBIDDEN') return NextResponse.json({ message: 'Bạn không có quyền thực hiện thao tác này' }, { status: 403 });
  console.error(error);
  return NextResponse.json({ message: error instanceof Error ? error.message : 'Lỗi máy chủ' }, { status: 500 });
}
