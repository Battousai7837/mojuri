import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import { api } from '../lib/api';
import { calculateCartTotals } from '../lib/cartTotals';
import { useCart } from '../store/CartContext';
import type { Order } from '../types';

function deliveryEstimate() {
  const start = new Date();
  const end = new Date();
  start.setDate(start.getDate() + 3);
  end.setDate(end.getDate() + 5);
  return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
}

export default function StoreCheckout() {
  const { items, clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const { subtotal, shippingFee: shipping } = calculateCartTotals(items);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      setSending(true);
      setError('');
      const data = await api<{ order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer: {
            name: form.get('name'),
            phone: form.get('phone'),
            email: form.get('email'),
            address: form.get('address'),
            note: form.get('note') ?? '',
          },
          items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });
      setOrder(data.order);
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tạo đơn hàng');
    } finally {
      setSending(false);
    }
  }

  if (order) {
    return <StoreLayout>
      <main className="store-main">
        <div className="order-success">
          <small>CẢM ƠN BẠN</small>
          <h1>Cảm ơn đã đặt sản phẩm</h1>
          <p>Đơn hàng của bạn đã được ghi nhận. Mã đơn hàng:</p>
          <div className="order-code">{order.code}</div>
          <p>Thời gian giao dự kiến: <b>{deliveryEstimate()}</b></p>
          <p>Tổng thanh toán: <b>${order.total.toFixed(2)}</b></p>
          <Link className="store-button" to={`/order-tracking?code=${order.code}&email=${encodeURIComponent(order.customer.email)}`}>Theo dõi đơn hàng</Link>
        </div>
      </main>
    </StoreLayout>;
  }

  return <StoreLayout>
    <main className="store-main">
      <div className="store-title"><small>Secure checkout</small><h1>Checkout</h1></div>
      {!items.length ? (
        <div className="store-empty"><p>Your bag is empty.</p><Link className="store-button" to="/shop-grid-left">Return to shop</Link></div>
      ) : (
        <div className="checkout-layout">
          <form className="store-form" onSubmit={submit}>
            <h2>Billing & shipping details</h2>
            <div className="store-form-row">
              <label>Full name<input className="store-input" name="name" required /></label>
              <label>Phone<input className="store-input" name="phone" required /></label>
            </div>
            <label>Email<input className="store-input" name="email" type="email" required /></label>
            <label>Delivery address<input className="store-input" name="address" required /></label>
            <label>Order note<textarea className="store-textarea" name="note" /></label>
            {error && <p className="store-error">{error}</p>}
            <button className="store-button" disabled={sending}>{sending ? 'Placing order...' : 'Place order'}</button>
          </form>
          <aside className="order-summary">
            <h2>Your order</h2>
            {items.map(item => <div className="summary-row" key={item.productId}><span>{item.name} x {item.quantity}</span><b>${(item.price * item.quantity).toFixed(2)}</b></div>)}
            <div className="summary-row"><span>Shipping</span><b>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</b></div>
            <div className="summary-row total"><span>Total</span><b>${(subtotal + shipping).toFixed(2)}</b></div>
          </aside>
        </div>
      )}
    </main>
  </StoreLayout>;
}
