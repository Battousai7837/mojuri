import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

const schema = z.object({ status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']) });
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAdmin(request); await connectDb(); const { status } = schema.parse(await request.json()); const order = await Order.findById((await params).id);
    if (!order) return NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    if (status === 'cancelled' && order.status !== 'cancelled') await Promise.all(order.items.map((item: { productId: string; quantity: number }) => Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } })));
    if (order.status === 'cancelled' && status !== 'cancelled') {
      const products = await Product.find({ _id: { $in: order.items.map((item: { productId: string }) => item.productId) } });
      for (const item of order.items) { const product = products.find(value => value.id === String(item.productId)); if (!product || product.stock < item.quantity) throw new Error(`${item.name} không đủ tồn kho để mở lại đơn`); }
      await Promise.all(order.items.map((item: { productId: string; quantity: number }) => Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })));
    }
    order.status = status; await order.save(); return NextResponse.json(order);
  } catch (error) { return apiError(error); }
}
