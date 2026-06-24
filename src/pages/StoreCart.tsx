import { Link } from 'react-router-dom';
import StoreLayout from '../components/StoreLayout';
import { useCart } from '../store/CartContext';
import { calculateCartTotals } from '../lib/cartTotals';

export default function StoreCart() {
  const { items, update, remove } = useCart(); const { subtotal, shippingFee: shipping } = calculateCartTotals(items);
  return <StoreLayout><main className="store-main"><div className="store-title"><small>Your selection</small><h1>Shopping Bag</h1></div>{!items.length ? <div className="store-empty"><p>Your bag is empty.</p><Link className="store-button" to="/shop-grid-left">Discover jewelry</Link></div> : <div className="cart-layout"><section>{items.map(item => <div className="cart-row" key={item.productId}><Link to={`/shop-details/${item.slug}`}><img src={item.thumbnail} alt={item.name}/></Link><div><Link to={`/shop-details/${item.slug}`}><b>{item.name}</b></Link><p>${item.price.toFixed(2)}</p></div><input aria-label="Quantity" type="number" min="1" max={item.stock} value={item.quantity} onChange={e => update(item.productId, Number(e.target.value))}/><strong>${(item.price*item.quantity).toFixed(2)}</strong><button aria-label="Remove" onClick={() => remove(item.productId)}>×</button></div>)}</section><aside className="order-summary"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div><div className="summary-row"><span>Shipping</span><b>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</b></div><div className="summary-row total"><span>Total</span><b>${(subtotal+shipping).toFixed(2)}</b></div><Link className="store-button" to="/shop-checkout">Proceed to checkout</Link></aside></div>}</main></StoreLayout>;
}
