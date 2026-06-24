import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';

const schema = z.object({
  customer: z.object({ name: z.string().min(2), phone: z.string().min(8), email: z.email(), address: z.string().min(8), note: z.string().default('') }),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1),
});

export async function GET(request: NextRequest) {
  try { requireAdmin(request); await connectDb(); const status = request.nextUrl.searchParams.get('status'); return NextResponse.json({ items: await Order.find(status ? { status } : {}).sort({ createdAt: -1 }) }); } catch (error) { return apiError(error); }
}
export async function POST(request: NextRequest) {
  try {
    await connectDb(); const input = schema.parse(await request.json());
    const ids = input.items.map(item => item.productId); const products = await Product.find({ _id: { $in: ids } });
    const items = input.items.map(requested => {
      const product = products.find(item => item.id === requested.productId);
      if (!product) throw new Error('Có sản phẩm không còn tồn tại');
      if (product.stock < requested.quantity) throw new Error(`${product.name} không đủ hàng`);
      return { productId: product._id, name: product.name, thumbnail: product.thumbnail, price: product.salePrice ?? product.price, quantity: requested.quantity };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 400 ? 0 : 20;
    const code = `MJ${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const order = await Order.create({ code, customer: input.customer, items, subtotal, shippingFee, total: subtotal + shippingFee });
    await Promise.all(items.map(item => Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })));
    return NextResponse.json({ message: 'Đặt hàng thành công', order }, { status: 201 });
  } catch (error) { return apiError(error); }
}
