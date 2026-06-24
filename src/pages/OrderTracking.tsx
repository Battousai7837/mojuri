import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import { api } from '../lib/api';
import type { Order, OrderStatus } from '../types';

const labels: Record<OrderStatus, string> = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };
export default function OrderTracking() {
  const [params] = useSearchParams(); const [order, setOrder] = useState<Order | null>(null); const [error, setError] = useState(''); const statuses: OrderStatus[] = ['pending','processing','shipped','delivered'];
  async function track(code: string, email: string) { try { setError(''); setOrder(await api<Order>(`/orders/track?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`)); } catch (e) { setOrder(null); setError(e instanceof Error ? e.message : 'Không tìm thấy đơn hàng'); } }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const code=params.get('code'), email=params.get('email'); if (code && email) void track(code,email); }, [params]);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); void track(String(form.get('code')), String(form.get('email'))); }
  const current = order ? statuses.indexOf(order.status) : -1;
  return <StoreLayout><main className="store-main"><div className="store-title"><small>Delivery journey</small><h1>Track Your Order</h1><p>Enter the order code and email used at checkout.</p></div><form className="store-form" style={{maxWidth:620,margin:'auto'}} onSubmit={submit}><div className="store-form-row"><label>Order code<input className="store-input" name="code" defaultValue={params.get('code') ?? ''} required/></label><label>Email<input className="store-input" name="email" type="email" defaultValue={params.get('email') ?? ''} required/></label></div><button className="store-button">Track order</button>{error && <p className="store-error">{error}</p>}</form>{order && <section className="order-success"><small>ORDER {order.code}</small><h2>{order.status === 'cancelled' ? 'This order was cancelled' : labels[order.status]}</h2>{order.status !== 'cancelled' && <div className="track-steps">{statuses.map((status,index)=><div className={`track-step ${index<=current?'done':''}`} key={status}>{labels[status]}</div>)}</div>}<p>{order.customer.name} · {order.customer.address}</p><div className="summary-row total"><span>Total</span><b>${order.total.toFixed(2)}</b></div></section>}</main></StoreLayout>;
}
