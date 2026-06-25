import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/http';
import { findPublicOrder } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const email = request.nextUrl.searchParams.get('email');
    if (!code || !email) return NextResponse.json({ message: 'Vui lòng nhập mã đơn và email' }, { status: 400 });
    const order = await findPublicOrder(code, email);
    return order ? NextResponse.json(order) : NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
