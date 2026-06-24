import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Order } from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDb(); const code = request.nextUrl.searchParams.get('code'); const email = request.nextUrl.searchParams.get('email');
    if (!code || !email) return NextResponse.json({ message: 'Vui lòng nhập mã đơn và email' }, { status: 400 });
    const order = await Order.findOne({ code: code.toUpperCase(), 'customer.email': email.toLowerCase() });
    return order ? NextResponse.json(order) : NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
  } catch (error) { return apiError(error); }
}
