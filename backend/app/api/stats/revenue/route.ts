import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { connectDb } from '@/lib/db';
import { apiError } from '@/lib/http';
import { Order } from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request); await connectDb();
    const byDay = await Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 30 }]);
    const byMonth = await Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 12 }]);
    const totals = await Order.aggregate([{ $match: { status: 'delivered' } }, { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } }]);
    return NextResponse.json({ totalRevenue: totals[0]?.revenue ?? 0, deliveredOrders: totals[0]?.orders ?? 0, byDay, byMonth });
  } catch (error) { return apiError(error); }
}
